'use client';

import { BillCustomer } from '@/types/bills';
import { Company } from '@/types/company';
import { parsePrice } from '@/utils/parsePrice';
import {
  Document as DocumentPDF,
  Font,
  Image as ImagePDF,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';

Font.register({
  family: 'Inter',
  fonts: [
    {
      src: '/assets/fonts/Inter/Inter_18pt-ExtraLight.ttf',
      fontWeight: 200,
    },
    {
      src: '/assets/fonts/Inter/Inter_18pt-Regular.ttf',
      fontWeight: 400,
    },
    {
      src: '/assets/fonts/Inter/Inter_18pt-SemiBold.ttf',
      fontWeight: 600,
    },
  ],
});

const styles = StyleSheet.create({
  body: {
    paddingTop: 14,
    paddingBottom: 21,
    paddingHorizontal: 21,
    fontFamily: 'Inter',
  },
  section: {
    margin: 10,
    padding: 10,
    fontSize: 12,
  },
  sectionImportant: {
    margin: 10,
    padding: 10,
    fontSize: 10,
  },
  sectionImg: {
    margin: 10,
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 12,
  },
  fontExtralight: {
    fontWeight: 200,
  },
  fontBold: {
    fontWeight: 'bold',
  },
  table: {
    // @ts-expect-error display: 'table' no está en los tipos de react-pdf
    display: 'table',
    width: 'auto',
  },
  tableFull: {
    // @ts-expect-error display: 'table' no está en los tipos de react-pdf
    display: 'table',
    width: '100%',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCol: {
    width: '16.67%',
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderBottomWidth: 1,
  },
  tableColw1d12: {
    width: '8.333333%',
  },
  tableColw2d12: {
    width: '16.666667%',
  },
  tableColw3d12: {
    width: '25%',
  },
  tableColw4d12: {
    width: '33.333333%',
  },
  tableColw5d12: {
    width: '41.666667%',
  },
  tableColw6d12: {
    width: '50%',
  },
  tableColw7d12: {
    width: '58.333333%',
  },
  tableColw8d12: {
    width: '66.666667%',
  },
  tableColw9d12: {
    width: '75%',
  },
  tableColw10d12: {
    width: '83.333333%',
  },
  tableColw11d12: {
    width: '91.666667%',
  },
  tableColw12d12: {
    width: '100%',
  },
  tableColTotals: {
    width: '9.722222%',
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
  },
  title: {
    fontSize: 14,
    marginBottom: 10,
  },
  textRight: {
    textAlign: 'right',
  },
  totalsBox: {
    backgroundColor: '#e5e7eb',
    borderRadius: '12px',
    // @ts-expect-error display: 'table' no está en los tipos de react-pdf
    display: 'block',
    padding: '16px 24px',
  },
  borderTopCol: {
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderTopWidth: 1,
  },
  mb1: {
    marginBottom: '7px',
  },
});

const Document = ({
  billSerial,
  billNumber,
  provider,
  customerData,
  customerPhone,
  createDate,
  rowsData,
  subtotal,
  descuentos,
  ivas,
  irpfs,
  total,
  notes,
  paymentMethod,
  status,
}: {
  billSerial: string;
  billNumber: string;
  provider: Company;
  customerData: BillCustomer;
  customerPhone: string | undefined;
  createDate: string;
  rowsData: any[];
  subtotal: number;
  descuentos: number;
  ivas: { iva: number; value: number }[];
  irpfs: { irpf: number; value: number }[];
  total: number;
  notes: string;
  paymentMethod: string;
  status: string;
}) => {
  const isCustomerObject = typeof customerData !== 'string' && customerData?.customer !== undefined;

  return (
    <DocumentPDF>
      <Page size="A4" style={styles.body}>
        <View style={styles.sectionImg}>
          <ImagePDF src="/assets/images/logo2.jpeg" style={{ width: 84, height: 84 }} />
        </View>

        <View style={[styles.tableFull, styles.sectionImg]}>
          <View style={styles.tableRow}>
            <View>
              <Text style={styles.fontBold}>Factura N° </Text>
            </View>
            <View>
              <Text style={styles.fontExtralight}>
                {billSerial}-{billNumber}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.fontExtralight}>{provider.name}</Text>
          <Text style={styles.fontExtralight}>{provider.address}</Text>
          <Text style={styles.fontExtralight}>{provider.zipcode}</Text>
          <Text style={styles.fontExtralight}>{provider.city}</Text>
          <View style={styles.tableFull}>
            <View style={styles.tableRow}>
              <View>
                <Text style={styles.fontBold}>{provider.documentType}: </Text>
              </View>
              <View>
                <Text style={styles.fontExtralight}>{provider.document}</Text>
              </View>
            </View>
          </View>
          <Text style={styles.fontExtralight}>{provider.country}</Text>
        </View>

        <View style={[styles.tableFull, styles.section]}>
          <View style={styles.tableRow}>
            <View style={styles.tableColw6d12}>
              <View style={styles.tableColw12d12}>
                {!isCustomerObject && (
                  <>
                    <View style={styles.tableColw12d12}>
                      <Text style={styles.fontExtralight}>
                        {typeof customerData === 'string'
                          ? customerData
                          : customerData.customer.documentType +
                            ': ' +
                            customerData.customer.documentNumber}
                      </Text>
                    </View>
                    <View style={styles.tableColw12d12}>
                      <Text style={styles.fontExtralight}>{customerPhone}</Text>
                    </View>
                  </>
                )}
                {isCustomerObject && (
                  <>
                    <View style={styles.tableFull}>
                      <View style={styles.tableRow}>
                        <View>
                          <Text style={styles.fontBold}>
                            {customerData.customer.documentType}:{' '}
                          </Text>
                        </View>
                        <View>
                          <Text style={styles.fontExtralight}>
                            {customerData.customer.documentNumber}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </>
                )}
              </View>
            </View>
            <View style={styles.tableColw6d12}>
              <View style={styles.tableFull}>
                <View style={styles.tableRow}>
                  <View style={styles.tableColw6d12}>
                    <Text style={styles.fontBold}>Fecha de emisión:</Text>
                  </View>
                  <View style={styles.tableColw6d12}>
                    <Text style={styles.fontExtralight}>{createDate}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.table, styles.section]}>
          <View style={styles.tableRow}>
            <View style={styles.tableColw5d12}>
              <Text style={[styles.tableCell, styles.fontBold]}>CONCEPTO</Text>
            </View>
            <View style={styles.tableColTotals}>
              <Text style={[styles.tableCell, styles.fontBold, styles.textRight]}>BASE</Text>
            </View>
            <View style={styles.tableColTotals}>
              <Text style={[styles.tableCell, styles.fontBold, styles.textRight]}>CANT</Text>
            </View>
            <View style={styles.tableColTotals}>
              <Text style={[styles.tableCell, styles.fontBold, styles.textRight]}>DTO</Text>
            </View>
            <View style={styles.tableColTotals}>
              <Text style={[styles.tableCell, styles.fontBold, styles.textRight]}>IVA</Text>
            </View>
            <View style={styles.tableColTotals}>
              <Text style={[styles.tableCell, styles.fontBold, styles.textRight]}>IRPF</Text>
            </View>
            <View style={styles.tableColTotals}>
              <Text style={[styles.tableCell, styles.fontBold, styles.textRight]}>TOTAL</Text>
            </View>
          </View>

          {rowsData.map((row, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={[styles.tableColw5d12, styles.borderTopCol]}>
                <Text style={[styles.tableCell, styles.fontExtralight]}>{row.concept}</Text>
              </View>
              <View style={[styles.tableColTotals, styles.borderTopCol]}>
                <Text style={[styles.tableCell, styles.fontExtralight, styles.textRight]}>
                  {row.base} €
                </Text>
              </View>
              <View style={[styles.tableColTotals, styles.borderTopCol]}>
                <Text style={[styles.tableCell, styles.fontExtralight, styles.textRight]}>
                  {row.cantidad}
                </Text>
              </View>
              <View style={[styles.tableColTotals, styles.borderTopCol]}>
                <Text style={[styles.tableCell, styles.fontExtralight, styles.textRight]}>
                  {row.dto} €
                </Text>
              </View>
              <View style={[styles.tableColTotals, styles.borderTopCol]}>
                <Text style={[styles.tableCell, styles.fontExtralight, styles.textRight]}>
                  {row.iva} €
                </Text>
              </View>
              <View style={[styles.tableColTotals, styles.borderTopCol]}>
                <Text style={[styles.tableCell, styles.fontExtralight, styles.textRight]}>
                  {row.irpf} €
                </Text>
              </View>
              <View style={[styles.tableColTotals, styles.borderTopCol]}>
                <Text style={[styles.tableCell, styles.fontExtralight, styles.textRight]}>
                  {row.total} €
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.tableFull, styles.section]}>
          <View style={styles.tableRow}>
            <View style={styles.tableColw6d12}></View>
            <View style={styles.tableColw6d12}>
              <View style={styles.totalsBox}>
                <View style={[styles.tableFull, styles.mb1]}>
                  <View style={styles.tableRow}>
                    <View style={styles.tableColw6d12}>
                      <Text style={{ fontFamily: 'Inter', fontWeight: 200 }}>Base imponible:</Text>
                    </View>
                    <View style={[styles.tableColw6d12, styles.textRight]}>
                      <Text style={{ fontFamily: 'Inter', fontWeight: 200 }}>
                        {parsePrice(subtotal - descuentos)} €
                      </Text>
                    </View>
                  </View>
                </View>

                {ivas.map(
                  (iva, index) =>
                    iva.iva !== 0 && (
                      <View style={[styles.tableFull, styles.mb1]} key={index}>
                        <View style={styles.tableRow}>
                          <View style={styles.tableColw6d12}>
                            <Text style={{ fontFamily: 'Inter', fontWeight: 200 }}>
                              IVA ({iva.iva} %):
                            </Text>
                          </View>
                          <View style={[styles.tableColw6d12, styles.textRight]}>
                            <Text style={{ fontFamily: 'Inter', fontWeight: 200 }}>
                              {parsePrice(iva.value)} €
                            </Text>
                          </View>
                        </View>
                      </View>
                    )
                )}
                {irpfs.map(
                  (irpf, index) =>
                    irpf.irpf !== 0 && (
                      <View style={[styles.tableFull, styles.mb1]} key={index}>
                        <View style={styles.tableRow}>
                          <View style={styles.tableColw6d12}>
                            <Text style={{ fontFamily: 'Inter', fontWeight: 200 }}>IRPF:</Text>
                          </View>
                          <View style={[styles.tableColw6d12, styles.textRight]}>
                            <Text style={{ fontFamily: 'Inter', fontWeight: 200 }}>
                              -{parsePrice(irpf.value)} €
                            </Text>
                          </View>
                        </View>
                      </View>
                    )
                )}

                <View style={styles.tableFull}>
                  <View style={styles.tableRow}>
                    <View style={styles.tableColw6d12}>
                      <Text style={{ fontFamily: 'Inter', fontWeight: 600 }}>TOTAL:</Text>
                    </View>
                    <View style={[styles.tableColw6d12, styles.textRight]}>
                      <Text style={styles.fontBold}>{parsePrice(total)} €</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.fontBold}>Notas:</Text>
          <Text>Medio de pago: {paymentMethod}</Text>
          <Text>{notes}</Text>
        </View>

        <View style={styles.sectionImportant}>
          <Text style={styles.fontBold}>IMPORTANTE:</Text>
          <Text>
            Una vez iniciado el tramite no se devolverá el dinero a no ser que por fuerza mayor no
            se pueda continuar con el proceso.
          </Text>
          <Text>
            Se descontará por concepto de asesoramiento 50€ y la parte proporcional del trabajo
            realizado hasta ese momento.
          </Text>
        </View>

        {status == 'Cancelado' && (
          <View style={styles.section}>
            <Text style={{ color: '#EF5350', fontFamily: 'Inter', fontWeight: 600 }}>
              FACTURA CANCELADA
            </Text>
          </View>
        )}
      </Page>
    </DocumentPDF>
  );
};

export default Document;
