import { BillDescriptionItem, BillIrpf, BillIva } from '@/types/bills';

export const calculateRowTotal = (base: number, cantidad: number, dto: number) => {
  return base * cantidad - dto;
};

export const calculateSubtotal = (rows: BillDescriptionItem[]): number => {
  return rows.reduce((acc, row) => {
    const base = Number(row.base) || 0;
    const cantidad = Number(row.cantidad) || 1;
    return acc + base * cantidad;
  }, 0);
};

export const calculateDiscounts = (rows: BillDescriptionItem[]): number => {
  return rows.reduce((acc, row) => acc + (Number(row.dto) || 0), 0);
};

export const calculateIvas = (rows: BillDescriptionItem[]): BillIva[] => {
  const uniqueIvas = [...new Set(rows.map((row) => Number(row.iva) || 0))];
  return uniqueIvas.map((iva) => ({
    iva,
    value: rows.reduce((acc, row) => {
      const base = Number(row.base) || 0;
      const cantidad = Number(row.cantidad) || 1;
      const currentIva = Number(row.iva) || 0;
      return currentIva === iva ? acc + (base * cantidad * iva) / 100 : acc;
    }, 0),
  }));
};

export const calculateIRPFs = (rows: BillDescriptionItem[]): BillIrpf[] => {
  return rows.map((row) => {
    const irpf = Number(row.irpf) || 0;
    const base = Number(row.base) || 0;
    const cantidad = Number(row.cantidad) || 1;
    return {
      irpf,
      value: (base * cantidad * irpf) / 100,
    };
  });
};

export const calculateTotal = ({
  subtotal,
  descuentos,
  ivas,
  irpfs,
}: {
  subtotal: number;
  descuentos: number;
  ivas: BillIva[];
  irpfs: BillIrpf[];
}): number => {
  const totalIva = ivas.reduce((acc, row) => acc + row.value, 0);
  const totalIrpf = irpfs.reduce((acc, row) => acc + row.value, 0);

  return subtotal - descuentos + totalIva - totalIrpf;
};

export const calculateBillTotals = (rows: BillDescriptionItem[]) => {
  const subtotal = calculateSubtotal(rows);
  const descuentos = calculateDiscounts(rows);
  const ivas = calculateIvas(rows);
  const irpfs = calculateIRPFs(rows);
  const total = calculateTotal({
    subtotal,
    descuentos,
    ivas,
    irpfs,
  });

  return {
    subtotal,
    descuentos,
    ivas,
    irpfs,
    total,
  };
};
