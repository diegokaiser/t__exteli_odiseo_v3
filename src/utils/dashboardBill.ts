type Bill = {
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  total: number;
  status: string;
};

export const sumBillsByMonth = (
  bills: Bill[],
  {
    month,
    year,
    status,
  }: {
    month: number;
    year: number;
    status?: string;
  }
) => {
  return bills
    .filter((bill) => {
      const createdAt = new Date(bill.createdAt.seconds * 1000);
      return (
        createdAt.getMonth() === month && createdAt.getFullYear() === year && bill.status === status
      );
    })
    .reduce((acc, bill) => acc + bill.total, 0);
};
