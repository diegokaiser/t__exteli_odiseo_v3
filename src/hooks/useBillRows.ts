import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { BillDescriptionItem } from '@/types/bills';
import { calculateRowTotal } from '@/utils/bill/calculations';

const createEmptyRow = (): BillDescriptionItem => ({
  id: uuidv4(),
  concept: '',
  cantidad: 1,
  base: 0,
  iva: 21,
  irpf: 0,
  dto: 0,
  total: 0,
});

export const useBillRows = (initialRows?: BillDescriptionItem[]) => {
  const [rows, setRows] = useState<BillDescriptionItem[]>(
    initialRows?.length ? initialRows : [createEmptyRow()]
  );

  const addRow = () => {
    setRows((prev) => [...prev, createEmptyRow()]);
  };

  const deleteRow = (index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const updateRow = (
    index: number,
    updater: (currentRow: BillDescriptionItem) => BillDescriptionItem
  ) => {
    setRows((prev) => prev.map((row, i) => (i === index ? updater(row) : row)));
  };

  const updateConcept = (index: number, concept: string) => {
    updateRow(index, (row) => ({
      ...row,
      concept,
    }));
  };

  const updateBase = (index: number, value: string | number) => {
    const base = Number(value) || 0;

    updateRow(index, (row) => ({
      ...row,
      base,
      total: calculateRowTotal(base, row.cantidad || 1, row.dto || 0),
    }));
  };

  const updateCantidad = (index: number, value: string | number) => {
    const cantidad = Number(value) || 1;

    updateRow(index, (row) => ({
      ...row,
      cantidad,
      total: calculateRowTotal(row.base || 0, cantidad, row.dto || 0),
    }));
  };

  const updateDto = (index: number, value: string | number) => {
    const dto = Number(value) || 0;

    updateRow(index, (row) => ({
      ...row,
      dto,
      total: calculateRowTotal(row.base || 0, row.cantidad || 1, dto),
    }));
  };

  const updateIva = (index: number, value: string | number) => {
    const iva = Number(value) || 0;

    updateRow(index, (row) => ({
      ...row,
      iva,
    }));
  };

  const updateIrpf = (index: number, value: string | number) => {
    const irpf = Number(value) || 0;

    updateRow(index, (row) => ({
      ...row,
      irpf,
    }));
  };

  return {
    rows,
    setRows,
    addRow,
    deleteRow,
    updateRow,
    updateConcept,
    updateBase,
    updateCantidad,
    updateDto,
    updateIva,
    updateIrpf,
  };
};
