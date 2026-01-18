'use client';

import { clockifyReportDate } from '@/utils/clockifyReportDate';
import { clockifyReportHour } from '@/utils/clockifyReportHour';

import {
  Document as DocumentPDF,
  Font,
  Image as ImagePDF,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';
import React from 'react';

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
  sectionNLH: {
    margin: 1,
    padding: 1,
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
  tableRowNLH: {
    flexDirection: 'row',
    lineHeight: 0,
    margin: 0,
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
  tableCellRow: {
    fontSize: 10,
    lineHeight: 0.25,
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

const Report = ({
  records,
  startDate,
  endDate,
  userName,
}: {
  records: any[];
  startDate: string;
  endDate: string;
  userName: string;
}) => {
  console.log(records);

  return (
    <DocumentPDF>
      <Page size="A4" style={styles.body}>
        <View style={styles.sectionImg}>
          <ImagePDF src="/assets/images/logo2.jpeg" style={{ width: 84, height: 84 }} />
        </View>

        <View style={[styles.tableFull, styles.sectionImg]}>
          <View style={styles.tableRow}>
            <View>
              <Text style={styles.fontBold}>{userName}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View>
              <Text style={styles.fontBold}>
                Reporte del {clockifyReportDate(startDate)} al {clockifyReportDate(endDate)}
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.table, styles.section]}>
          {records.map((row, index) => (
            <React.Fragment key={index}>
              <View style={styles.tableRow}>
                <View style={[styles.tableFull, styles.borderTopCol]}>
                  <Text style={[styles.tableCell, styles.fontBold]}>{row.date}</Text>
                </View>
              </View>
              {row.records.map((record: any, index: number) => (
                <View key={index} style={styles.tableRow}>
                  <View style={[styles.tableFull]}>
                    <View style={[styles.table, styles.sectionNLH]}>
                      <View style={styles.tableRow}>
                        <View style={[styles.tableColw6d12]}>
                          <Text style={[styles.tableCell, styles.fontExtralight]}>
                            {record.name}
                          </Text>
                        </View>
                        <View style={[styles.tableColw6d12]}>
                          <Text style={[styles.tableCell, styles.fontExtralight]}>
                            {clockifyReportHour(record.registeredAt)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </React.Fragment>
          ))}
        </View>
      </Page>
    </DocumentPDF>
  );
};

export default Report;
