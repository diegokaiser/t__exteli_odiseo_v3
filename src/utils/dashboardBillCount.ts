type Bill = {
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  status: string;
};

export function countBillsByMonth(
  bills: Bill[],
  {
    month,
    year,
  }: {
    month: number;
    year: number;
  }
): number {
  return bills.filter((bill) => {
    const createdAt = new Date(bill.createdAt.seconds * 1000);
    return createdAt.getMonth() === month && createdAt.getFullYear() === year;
  }).length;
}
