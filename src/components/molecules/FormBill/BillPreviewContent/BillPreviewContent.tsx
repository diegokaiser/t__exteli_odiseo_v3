import { PDFViewer } from '@react-pdf/renderer';

import { Document } from '@/components/wrappers';
import { BillDescriptionItem, BillIrpf, BillIva } from '@/types/bills';
import { Company } from '@/types/company';

type BillPreviewContentProps = {
  billSerial: string;
  billNumber: string;
  provider: Company;
  customerData: string;
  customerPhone: string;
  customerEmail: string;
  createDate: string;
  rowsData: BillDescriptionItem[];
  subtotal: number;
  descuentos: number;
  ivas: BillIva[];
  irpfs: BillIrpf[];
  total: number;
  notes?: string;
  paymentMethod: string;
  registeredBy?: string;
};

const BillPreviewContent = ({
  billSerial,
  billNumber,
  provider,
  customerData,
  customerPhone,
  customerEmail,
  createDate,
  rowsData,
  subtotal,
  descuentos,
  ivas,
  irpfs,
  total,
  notes,
  paymentMethod,
  registeredBy,
}: BillPreviewContentProps) => {
  return (
    <div className="w-full">
      <PDFViewer style={{ width: '100%', height: '800px' }}>
        <Document
          billSerial={billSerial}
          billNumber={billNumber}
          provider={provider}
          customerData={customerData}
          customerPhone={customerPhone}
          customerEmail={customerEmail}
          createDate={createDate}
          rowsData={rowsData}
          subtotal={subtotal}
          descuentos={descuentos}
          ivas={ivas}
          irpfs={irpfs}
          total={total}
          notes={notes || ''}
          paymentMethod={paymentMethod}
          status="emitted"
          registeredBy={registeredBy}
          isPreview={true}
        />
      </PDFViewer>
    </div>
  );
};

export default BillPreviewContent;
