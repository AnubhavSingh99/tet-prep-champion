import { z } from "zod";

import { requireApiAuth } from "./api-auth";
import { createCheckoutForUser, verifyRazorpayPaymentForUser } from "./platform-store";
import {
  createRazorpayOrder,
  getRazorpayKeyId,
  RazorpayConfigError,
  RazorpayOrderError,
  RazorpaySignatureError,
} from "./razorpay-server";

const packageOrderSchema = z.object({
  packageSlug: z.enum(["starter", "complete", "premium"]),
  examCode: z.enum(["UP_PCS", "RO_ARO", "UPTET_CTET", "UP_PET", "UP_Lekhpal", "UP_Police"]),
});

const directOrderSchema = z.object({
  amount: z.number().int().min(100),
  currency: z.string().min(3).default("INR"),
  receipt: z.string().min(1).max(40).optional(),
});

const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

function json(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
}

function errorResponse(error: unknown) {
  if (error instanceof Response) return error;
  if (error instanceof z.ZodError) {
    return json({ error: "Invalid request payload", issues: error.issues }, { status: 400 });
  }
  if (error instanceof RazorpaySignatureError) {
    return json({ error: error.message }, { status: 400 });
  }
  if (error instanceof RazorpayConfigError) {
    return json({ error: error.message }, { status: 401 });
  }
  if (error instanceof RazorpayOrderError) {
    return json({ error: error.message }, { status: 500 });
  }
  return json(
    { error: error instanceof Error ? error.message : "Razorpay request failed" },
    { status: 500 },
  );
}

export async function handleRazorpayApi(request: Request): Promise<Response | undefined> {
  const url = new URL(request.url);
  if (request.method !== "POST") {
    if (url.pathname === "/api/create-order" || url.pathname === "/api/verify-payment") {
      return json({ error: "Method not allowed" }, { status: 405 });
    }
    return undefined;
  }

  try {
    if (url.pathname === "/api/create-order") {
      const auth = await requireApiAuth(request);
      const body = await request.json();
      const packageInput = packageOrderSchema.safeParse(body);
      if (!packageInput.success) {
        const directInput = directOrderSchema.parse(body);
        const order = await createRazorpayOrder({
          amountPaise: directInput.amount,
          currency: directInput.currency,
          receipt: directInput.receipt ?? `upq_${Date.now().toString(36)}`,
          notes: {
            user_id: auth.userId,
          },
        });
        return json({
          order_id: order.id,
          key_id: getRazorpayKeyId(),
          amount: order.amount,
          currency: order.currency,
        });
      }

      const input = packageInput.data;
      const checkout = await createCheckoutForUser(input, auth);
      return json({
        payment_id: checkout.id,
        order_id: checkout.razorpayOrderId,
        key_id: checkout.razorpayKeyId,
        amount: checkout.amountPaise,
        currency: checkout.currency,
        package_name: checkout.packageName,
        exam_name: checkout.examName,
        message: checkout.message,
      });
    }

    if (url.pathname === "/api/verify-payment") {
      const auth = await requireApiAuth(request);
      const input = verifyPaymentSchema.parse(await request.json());
      const payment = await verifyRazorpayPaymentForUser(
        {
          razorpayOrderId: input.razorpay_order_id,
          razorpayPaymentId: input.razorpay_payment_id,
          razorpaySignature: input.razorpay_signature,
        },
        auth,
      );
      return json({
        success: true,
        payment_id: payment.id,
        status: payment.status,
        package_name: payment.packageName,
        exam_name: payment.examName,
        message: payment.message,
      });
    }
  } catch (error) {
    return errorResponse(error);
  }

  return undefined;
}
