import express from 'express';
import { userRouter } from '../modules/user/user.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { scheduleRoutes } from '../modules/Schedule/schedule.route';
import { doctorScheduleRoutes } from '../modules/doctorSchedule/doctorSchedule.route';
import { specialtiesRoutes } from '../modules/specialties/specialties.route';
import { doctorRoutes } from '../modules/doctor/doctor.route';
import { patientRoutes } from '../modules/patient/patient.route';
import { appointmentRoutes } from '../modules/appointment/appointment.route';
import { paymentRoutes } from '../modules/payment/payment.route';
import { prescriptionRoutes } from '../modules/prescription/prescription.route';
import { reviewRoutes } from '../modules/review/review.route';
import { patientHealthDataRoutes } from '../modules/patientHealthData/patientHealthData.route';
import { medicalReportRoutes } from '../modules/medicalReport/medicalReport.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/user',
    route: userRouter,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/schedule',
    route: scheduleRoutes,
  },
  {
    path: '/doctor-schedule',
    route: doctorScheduleRoutes,
  },
  {
    path: '/specialties',
    route: specialtiesRoutes,
  },
  {
    path: '/doctor',
    route: doctorRoutes,
  },
  {
    path: '/patient',
    route: patientRoutes,
  },
  {
    path: '/appointment',
    route: appointmentRoutes,
  },
  {
    path: '/payment',
    route: paymentRoutes,
  },
  {
    path: '/prescription',
    route: prescriptionRoutes,
  },
  {
    path: '/review',
    route: reviewRoutes,
  },
  {
    path: '/patient-health-data',
    route: patientHealthDataRoutes,
  },
  {
    path: '/medical-report',
    route: medicalReportRoutes,
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
