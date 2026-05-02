export const buildWhereConditions = (
  searchTerm: string | undefined,
  searchableFields: string[],
  filterData: Record<string, unknown> | undefined
) => {
  const andConditions = [];

  // Dynamic Search term
  if (searchTerm && searchableFields.length > 0) {
    andConditions.push({
      OR: searchableFields.map((field) => {
        // Handle nested fields like 'admin.name'
        if (field.includes('.')) {
          const [relation, nestedField] = field.split('.');
          return {
            [relation]: {
              [nestedField]: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
          };
        }

        // Handle simple fields like 'email'
        return {
          [field]: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        };
      }),
    });
  }

  // Dynamic Filters (Exact match)
  if (filterData && Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key],
        },
      })),
    });
  }

  const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};

  return whereConditions;
};
