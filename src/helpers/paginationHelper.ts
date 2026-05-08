export const calculatePagination = (options: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}) => {
  const page = Number(options.page || 1);
  const limit = Number(options.limit || 10);
  const skip = (page - 1) * limit;

  const sortBy = (options.sortBy || 'createdAt').trim();
  const sortOrder = (options.sortOrder || 'desc').trim();

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};
