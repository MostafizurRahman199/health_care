import { Request, Response } from 'express';
import { paymentService } from './payment.service';

const stripeWebhook = async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'] as string;
  // Use rawBody populated by express.json if available, fallback to req.body
  const payload = (req as any).rawBody || req.body;

  try {
    const result = await paymentService.validateWebhook(payload, signature);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};

const initPayment = async (req: Request, res: Response) => {
  const { appointmentId } = req.params;

  try {
    const result = await paymentService.initPayment(appointmentId as string);
    res.status(200).json({
      success: true,
      message: 'Payment initialized successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const paymentController = {
  stripeWebhook,
  initPayment,
};
