import cron from 'node-cron';
import prisma from '../../shared/prisma';
import { PaymentStatus, AppointmentStatus } from '@prisma/client';

export const startCronJobs = () => {
  // Run every minute
  cron.schedule('* * * * *', async () => {
    try {
      // Find appointments created more than 20 minutes ago
      const twentyMinutesAgo = new Date(Date.now() - 20 * 60 * 1000);

      const unpaidAppointments = await prisma.appointment.findMany({
        where: {
          paymentStatus: PaymentStatus.UNPAID,
          status: {
            not: AppointmentStatus.CANCELED, // Avoid re-canceling
          },
          createdAt: {
            lte: twentyMinutesAgo,
          },
        },
      });

      if (unpaidAppointments.length > 0) {
        for (const appointment of unpaidAppointments) {
          await prisma.$transaction(async (tx) => {
            // Update appointment to CANCELED
            await tx.appointment.update({
              where: { id: appointment.id },
              data: {
                status: AppointmentStatus.CANCELED,
              },
            });

            // Free up the doctor's schedule
            await tx.doctorSchedule.updateMany({
              where: {
                doctorId: appointment.doctorId,
                scheduleId: appointment.scheduleId,
              },
              data: {
                isBooked: false,
              },
            });
          });
        }
        console.log(`Auto-canceled ${unpaidAppointments.length} unpaid appointments and freed their schedules.`);
      }
    } catch (error) {
      console.error('Error in auto-cancel cron job:', error);
    }
  });
};
