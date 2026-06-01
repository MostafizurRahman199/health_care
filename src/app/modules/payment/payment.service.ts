import prisma from '../../../shared/prisma';
import Stripe from 'stripe';
import { PaymentStatus, AppointmentStatus } from '@prisma/client';
import ApiError from '../../../errors/ApiError';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16' as any,
});

const initPayment = async (appointmentId: string) => {
  const paymentData = await prisma.payment.findUniqueOrThrow({
    where: {
      appointmentId,
    },
    include: {
      appointment: {
        include: {
          patient: true,
        },
      },
    },
  });

  if (paymentData.status === PaymentStatus.PAID) {
    throw new ApiError(400, 'Payment already completed');
  }

  // Handle $0 edge case
  if (paymentData.amount === 0) {
    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: paymentData.id },
        data: {
          status: PaymentStatus.PAID,
          transactionId: `FREE-${paymentData.id.substring(0, 8)}`,
        },
      });

      await tx.appointment.update({
        where: { id: appointmentId },
        data: {
          paymentStatus: PaymentStatus.PAID,
        },
      });
    });

    return {
      paymentUrl: 'http://localhost:3000/success.html', // Redirect to success page for free appointments
      transactionId: `FREE-${paymentData.id.substring(0, 8)}`,
    };
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: 'http://localhost:3000/success.html', // Replace with your actual frontend success URL
    cancel_url: 'http://localhost:3000/cancel.html',   // Replace with your actual frontend cancel URL
    customer_email: paymentData.appointment.patient.email,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Appointment Fee',
          },
          unit_amount: Math.round(paymentData.amount * 100),
        },
        quantity: 1,
      },
    ],
    metadata: {
      appointmentId: paymentData.appointmentId,
      paymentId: paymentData.id,
    },
  });

  await prisma.payment.update({
    where: {
      id: paymentData.id,
    },
    data: {
      transactionId: checkoutSession.id,
    },
  });

  return {
    paymentUrl: checkoutSession.url,
    transactionId: checkoutSession.id,
  };
};

const validateWebhook = async (payload: any, signature: string) => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error('Stripe webhook secret is not configured');
  }

  let event: any;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err: any) {
    throw new Error(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;

    // Safety check: ensure payment is actually paid
    if (session.payment_status !== 'paid') {
      return { received: true }; // Ignore uncaptured payments (like async bank transfers) until paid
    }

    // We attached appointmentId and paymentId in metadata during initPayment
    const paymentId = session.metadata?.paymentId;
    const appointmentId = session.metadata?.appointmentId;

    if (paymentId && appointmentId) {
      await prisma.$transaction(async (tx) => {
        await tx.payment.update({
          where: {
            id: paymentId,
          },
          data: {
            status: PaymentStatus.PAID,
            paymentGatewayData: session,
          },
        });

        await tx.appointment.update({
          where: {
            id: appointmentId,
          },
          data: {
            paymentStatus: PaymentStatus.PAID,
          },
        });
      });
    }
  }

  return {
    received: true,
  };
};

export const paymentService = {
  initPayment,
  validateWebhook,
};
