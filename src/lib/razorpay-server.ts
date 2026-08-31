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

type RazorpaySdkClient = new (options: { key_id: string; key_secret: string }) => {
  orders: {
    create: (input: {
      amount: number;
      currency: string;
      receipt: string;
      notes?: Record<string, string>;
    }) => Promise<RazorpayOrderResponse>;
  };
};

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

export function getRazorpayDiagnostics() {
  const keyId = getServerEnv("RAZORPAY_KEY_ID");
  const keySecret = getServerEnv("RAZORPAY_KEY_SECRET");
  const secretDigest = keySecret
    ? crypto.createHash("sha256").update(keySecret).digest("hex").slice(0, 12)
    : null;

  return {
    hasKeyId: Boolean(keyId),
    keyIdPrefix: keyId ? keyId.slice(0, 8) : null,
    keyIdSuffix: keyId ? keyId.slice(-4) : null,
    keyIdLength: keyId?.length ?? 0,
    hasKeySecret: Boolean(keySecret),
    keySecretLength: keySecret?.length ?? 0,
    keySecretDigest: secretDigest,
  };
}

function encodeBasicAuth(value: string) {
  if (typeof btoa === "function") return btoa(value);
  return Buffer.from(value, "utf8").toString("base64");
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
  const auth = encodeBasicAuth(`${keyId}:${keySecret}`);
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
    return createRazorpayOrderWithSdk(input, keyId, keySecret);
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

async function createRazorpayOrderWithSdk(
  input: {
    amountPaise: number;
    currency: string;
    receipt: string;
    notes?: Record<string, string>;
  },
  keyId: string,
  keySecret: string,
): Promise<RazorpayOrderResponse> {
  try {
    const module = (await import("razorpay")) as { default: RazorpaySdkClient };
    const client = new module.default({
      key_id: keyId,
      key_secret: keySecret,
    });
    const order = await client.orders.create({
      amount: input.amountPaise,
      currency: input.currency,
      receipt: input.receipt,
      notes: input.notes,
    });

    if (!order?.id) throw new RazorpayOrderError("Razorpay SDK did not return an order id");
    return order;
  } catch (error) {
    if (error instanceof RazorpayOrderError) throw error;
    throw new RazorpayConfigError(
      error instanceof Error
        ? `Razorpay authentication failed: ${error.message}`
        : "Razorpay authentication failed. Check the key id and secret.",
    );
  }
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
