import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica', color: '#333' },
  header: { marginBottom: 20, borderBottom: 2, borderBottomColor: '#1e293b', paddingBottom: 10 },
  title: { fontSize: 20, fontWeight: 'bold', textTransform: 'uppercase' },
  meta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
  table: { display: 'table', width: 'auto', marginTop: 20 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', minHeight: 25, alignItems: 'center' },
  tableHeader: { backgroundColor: '#f8fafc', fontWeight: 'bold' },
  colDate: { width: '15%' },
  colDesc: { width: '35%', paddingLeft: 5 },
  colAmount: { width: '15%', textAlign: 'right', paddingRight: 5 },
  colBal: { width: '20%', textAlign: 'right', fontWeight: 'bold' },
  footer: { marginTop: 30, borderTop: 1, paddingTop: 10, flexDirection: 'row', justifyContent: 'space-between' },
  bold: { fontWeight: 'bold' },
  textRed: { color: '#dc2626' },
  textGreen: { color: '#16a34a' }
});

const format = (val) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(Math.abs(val || 0));

export const LedgerPDF = ({ data, accountId, accountType, bfBalance, cfBalance }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>General Ledger Report</Text>
        <View style={styles.meta}>
          <Text>Account: {accountId} ({accountType})</Text>
          <Text>Date: {new Date().toLocaleDateString()}</Text>
        </View>
      </View>

      {/* Table */}
      <View style={styles.table}>
        {/* Header Row */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.colDate}>Date</Text>
          <Text style={styles.colDesc}>Particulars</Text>
          <Text style={styles.colAmount}>Debit</Text>
          <Text style={styles.colAmount}>Credit</Text>
          <Text style={styles.colBal}>Balance</Text>
        </View>

        {/* B/F Row */}
        <View style={styles.tableRow}>
          <Text style={styles.colDate}>—</Text>
          <Text style={[styles.colDesc, { fontStyle: 'italic' }]}>Balance Brought Forward</Text>
          <Text style={styles.colAmount}>—</Text>
          <Text style={styles.colAmount}>—</Text>
          <Text style={styles.colBal}>{format(bfBalance)}</Text>
        </View>

        {/* Data Rows */}
        {data.map((row, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={styles.colDate}>{new Date(row.entryDate).toLocaleDateString('en-GB')}</Text>
            <Text style={styles.colDesc}>{row.description}</Text>
            <Text style={[styles.colAmount, styles.textGreen]}>{row.debit > 0 ? format(row.debit) : '—'}</Text>
            <Text style={[styles.colAmount, styles.textRed]}>{row.credit > 0 ? format(row.credit) : '—'}</Text>
            <Text style={styles.colBal}>{format(row.balance)}</Text>
          </View>
        ))}
      </View>

      {/* Final Summary */}
      <View style={styles.footer}>
        <Text>End of Report</Text>
        <View style={{ textAlign: 'right' }}>
          <Text style={{ fontSize: 12, fontWeight: 'bold' }}>
            Closing Balance: {format(cfBalance)}
          </Text>
        </View>
      </View>
    </Page>
  </Document>
);