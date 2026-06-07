import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';

// ─── ADMIN DASHBOARD 
const getAdminDashboard = async () => {
  // Total counts
  const [totalUsers, totalDoctors, totalPatients, totalAppointments] =
    await Promise.all([
      prisma.user.count(),
      prisma.doctor.count({ where: { isDeleted: false } }),
      prisma.patient.count({ where: { isDeleted: false } }),
      prisma.appointment.count(),
    ]);

  // Payment / revenue stats
  const revenueResult = await prisma.$queryRaw<{ total_revenue: number; paid_count: bigint }[]>`
    SELECT COALESCE(SUM(amount), 0) AS total_revenue, COUNT(*) AS paid_count
    FROM payments
    WHERE status = 'PAID'
  `;
  const totalRevenue = Number(revenueResult[0]?.total_revenue ?? 0);
  const totalPaidPayments = Number(revenueResult[0]?.paid_count ?? 0);

  // Appointment status breakdown
  const appointmentStats = await prisma.$queryRaw<{ status: string; count: bigint }[]>`
    SELECT status, COUNT(*) AS count
    FROM appointments
    GROUP BY status
  `;

  // Monthly appointment trend (last 6 months)
  const appointmentTrend = await prisma.$queryRaw<{ month: string; count: bigint }[]>`
    SELECT TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon YYYY') AS month,
           COUNT(*) AS count
    FROM appointments
    WHERE "createdAt" >= NOW() - INTERVAL '6 months'
    GROUP BY DATE_TRUNC('month', "createdAt")
    ORDER BY DATE_TRUNC('month', "createdAt") ASC
  `;

  // Monthly revenue trend (last 6 months)
  const revenueTrend = await prisma.$queryRaw<{ month: string; revenue: number }[]>`
    SELECT TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon YYYY') AS month,
           COALESCE(SUM(amount), 0) AS revenue
    FROM payments
    WHERE status = 'PAID'
      AND "createdAt" >= NOW() - INTERVAL '6 months'
    GROUP BY DATE_TRUNC('month', "createdAt")
    ORDER BY DATE_TRUNC('month', "createdAt") ASC
  `;

  // Top 5 rated doctors
  const topDoctors = await prisma.$queryRaw<
    { name: string; email: string; "averageRating": number; "appintmentFee": number; "profilePhoto": string | null }[]
  >`
    SELECT name, email, "averageRating", "appintmentFee", "profilePhoto"
    FROM doctors
    WHERE "isDeleted" = false
    ORDER BY "averageRating" DESC
    LIMIT 5
  `;

  // Recent 5 appointments
  const recentAppointments = await prisma.appointment.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      patient: { select: { name: true, email: true, profilePhoto: true } },
      doctor: { select: { name: true, email: true, profilePhoto: true } },
    },
  });

  return {
    summary: {
      totalUsers,
      totalDoctors,
      totalPatients,
      totalAppointments,
      totalRevenue,
      totalPaidPayments,
    },
    appointmentStats: appointmentStats.map((s) => ({
      status: s.status,
      count: Number(s.count),
    })),
    appointmentTrend: appointmentTrend.map((t) => ({
      month: t.month,
      count: Number(t.count),
    })),
    revenueTrend: revenueTrend.map((r) => ({
      month: r.month,
      revenue: Number(r.revenue),
    })),
    topDoctors,
    recentAppointments,
  };
};

// ─── DOCTOR DASHBOARD 
const getDoctorDashboard = async (userEmail: string) => {
  const doctor = await prisma.doctor.findUniqueOrThrow({
    where: { email: userEmail },
  });

  const [totalAppointments, totalPatients, totalReviews, totalPrescriptions] =
    await Promise.all([
      prisma.appointment.count({ where: { doctorId: doctor.id } }),
      prisma.appointment.findMany({
        where: { doctorId: doctor.id },
        distinct: ['patientId'],
        select: { patientId: true },
      }),
      prisma.review.count({ where: { doctorId: doctor.id } }),
      prisma.prescription.count({ where: { doctorId: doctor.id } }),
    ]);

  // Appointment status breakdown for this doctor
  const appointmentStats = await prisma.$queryRaw<{ status: string; count: bigint }[]>`
    SELECT status, COUNT(*) AS count
    FROM appointments
    WHERE "doctorId" = ${doctor.id}
    GROUP BY status
  `;

  // Monthly appointment trend (last 6 months)
  const appointmentTrend = await prisma.$queryRaw<{ month: string; count: bigint }[]>`
    SELECT TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon YYYY') AS month,
           COUNT(*) AS count
    FROM appointments
    WHERE "doctorId" = ${doctor.id}
      AND "createdAt" >= NOW() - INTERVAL '6 months'
    GROUP BY DATE_TRUNC('month', "createdAt")
    ORDER BY DATE_TRUNC('month', "createdAt") ASC
  `;

  // Avg rating
  const ratingResult = await prisma.$queryRaw<{ avg_rating: number }[]>`
    SELECT COALESCE(AVG(rating), 0) AS avg_rating
    FROM reviews
    WHERE "doctorId" = ${doctor.id}
  `;

  // Recent 5 appointments for this doctor
  const recentAppointments = await prisma.appointment.findMany({
    where: { doctorId: doctor.id },
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      patient: { select: { name: true, email: true, profilePhoto: true } },
      schedule: true,
    },
  });

  // Recent reviews
  const recentReviews = await prisma.review.findMany({
    where: { doctorId: doctor.id },
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      patient: { select: { name: true, profilePhoto: true } },
    },
  });

  return {
    summary: {
      totalAppointments,
      totalPatients: totalPatients.length,
      totalReviews,
      totalPrescriptions,
      averageRating: Number(ratingResult[0]?.avg_rating ?? 0),
    },
    appointmentStats: appointmentStats.map((s) => ({
      status: s.status,
      count: Number(s.count),
    })),
    appointmentTrend: appointmentTrend.map((t) => ({
      month: t.month,
      count: Number(t.count),
    })),
    recentAppointments,
    recentReviews,
  };
};

// ─── PATIENT DASHBOARD 
const getPatientDashboard = async (userEmail: string) => {
  const patient = await prisma.patient.findUniqueOrThrow({
    where: { email: userEmail },
  });

  const [totalAppointments, totalPrescriptions, totalReviews, totalMedicalReports] =
    await Promise.all([
      prisma.appointment.count({ where: { patientId: patient.id } }),
      prisma.prescription.count({ where: { patientId: patient.id } }),
      prisma.review.count({ where: { patientId: patient.id } }),
      prisma.medicalReport.count({ where: { patientId: patient.id } }),
    ]);

  // Appointment status breakdown for this patient
  const appointmentStats = await prisma.$queryRaw<{ status: string; count: bigint }[]>`
    SELECT status, COUNT(*) AS count
    FROM appointments
    WHERE "patientId" = ${patient.id}
    GROUP BY status
  `;

  // Upcoming appointments
  const upcomingAppointments = await prisma.appointment.findMany({
    where: {
      patientId: patient.id,
      status: 'SCHEDULED',
    },
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      doctor: { select: { name: true, email: true, profilePhoto: true, designation: true } },
      schedule: true,
    },
  });

  // Recent prescriptions
  const recentPrescriptions = await prisma.prescription.findMany({
    where: { patientId: patient.id },
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      doctor: { select: { name: true, profilePhoto: true, designation: true } },
    },
  });

  // Payment history stats
  const paymentStats = await prisma.$queryRaw<{ status: string; count: bigint; total: number }[]>`
    SELECT p.status, COUNT(*) AS count, COALESCE(SUM(p.amount), 0) AS total
    FROM payments p
    INNER JOIN appointments a ON p."appointmentId" = a.id
    WHERE a."patientId" = ${patient.id}
    GROUP BY p.status
  `;

  return {
    summary: {
      totalAppointments,
      totalPrescriptions,
      totalReviews,
      totalMedicalReports,
    },
    appointmentStats: appointmentStats.map((s) => ({
      status: s.status,
      count: Number(s.count),
    })),
    paymentStats: paymentStats.map((p) => ({
      status: p.status,
      count: Number(p.count),
      total: Number(p.total),
    })),
    upcomingAppointments,
    recentPrescriptions,
  };
};

// ─── DISPATCHER 
const getDashboardStats = async (user: any) => {
  switch (user.role) {
    case 'ADMIN':
      return getAdminDashboard();
    case 'DOCTOR':
      return getDoctorDashboard(user.email);
    case 'PATIENT':
      return getPatientDashboard(user.email);
    default:
      throw new ApiError(403, 'Unauthorized role');
  }
};

export const metaService = {
  getDashboardStats,
};