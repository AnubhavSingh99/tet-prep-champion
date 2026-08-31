import crypto from "node:crypto";

import { getServerEnv } from "./runtime-env";

type RazorpayOrderResponse = {
  id: string;
  amount: number;
  currency: string;
  receipt?: string;
  status?: string;
};

type RazorpayErrorResponse = {
  error?: {
    code?: string;
    description?: string;
    reason?: string;
  };
};

export class RazorpayConfigError extends Error {}
export class RazorpayOrderError extends Error {}
export class RazorpaySignatureError extends Error {}

function getRazorpayKeys() {
  const keyId = getServerEnv("RAZORPAY_KEY_ID");
  const keySecret = getServerEnv("RAZORPAY_KEY_SECRET");

  if (!keyId || !keySecret) {
    throw new RazorpayConfigError("Razorpay test keys are not configured on the server");
  }

  return { keyId, keySecret };
}

export function getRazorpayKeyId() {
  return getRazorpayKeys().keyId;
}

export async function createRazorpayOrder(input: {
  amountPaise: number;
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}): Promise<RazorpayOrderResponse> {
  if (!Number.isInteger(input.amountPaise) || input.amountPaise < 100) {
    throw new RazorpayOrderError("Minimum checkout amount is 100 paise");
  }

  const { keyId, keySecret } = getRazorpayKeys();
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: input.amountPaise,
      currency: input.currency,
      receipt: input.receipt,
      notes: input.notes,
    }),
  });

  const payload = (await response.json().catch(() => ({}))) as RazorpayOrderResponse &
    RazorpayErrorResponse;

  if (response.status === 401) {
    throw new RazorpayConfigError("Razorpay authentication failed. Check the key id and secret.");
  }

  if (!response.ok || !payload.id) {
    const message =
      payload.error?.description ||
      payload.error?.reason ||
      `Razorpay order creation failed with status ${response.status}`;
    throw new RazorpayOrderError(message);
  }

  return payload;
}

export function verifyRazorpaySignature(input: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) {
  const { keySecret } = getRazorpayKeys();
  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(`${input.razorpayOrderId}|${input.razorpayPaymentId}`)
    .digest("hex");

  const received = input.razorpaySignature;
  const expectedBuffer = Buffer.from(expected, "hex");
  const receivedBuffer = Buffer.from(received, "hex");

  if (
    expectedBuffer.length !== receivedBuffer.length ||
    !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
  ) {
    throw new RazorpaySignatureError("Payment signature mismatch");
  }
}
