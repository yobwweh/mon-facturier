import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

// --- STYLES ---
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#1f2937', 
    backgroundColor: '#ffffff',
    flexDirection: 'column'
  },
  
  // EN-TÊTE
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 2,
    borderBottomColor: '#111827',
    paddingBottom: 15,
    marginBottom: 20,
  },
  
  // Gauche
  headerLeft: { width: '40%', flexDirection: 'column' },
  logoContainer: { height: 60, marginBottom: 10, justifyContent: 'center', alignItems: 'flex-start' },
  logoImage: { width: 100, height: '100%', objectFit: 'contain' },
  logoPlaceholder: { width: 60, height: 60, backgroundColor: '#2563eb', justifyContent: 'center', alignItems: 'center' },
  
  senderName: { fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', marginBottom: 2 },
  senderLegal: { fontSize: 8, fontWeight: 'bold', color: '#6b7280', marginBottom: 4 }, 
  senderDetails: { fontSize: 8, color: '#4b5563', lineHeight: 1.3 },

  // --- CORRECTION ICI (QR CODE PLUS GRAND) ---
  // Centre (QR)
  headerCenter: { 
      width: '25%', // Agrandissement de la zone (était 20%)
      alignItems: 'center', 
      justifyContent: 'flex-start', 
      paddingTop: 0 // On remonte le QR pour gagner de la place
  },
  qrImage: { 
      width: 100,   // ÉTAIT 70 -> MAINTENANT 100 (Plus lisible)
      height: 100,  // ÉTAIT 70 -> MAINTENANT 100
      objectFit: 'contain',
      // Suppression des bordures et padding qui écrasent le QR code
  },
  // -------------------------------------------

  // Droite
  headerRight: { width: '35%', flexDirection: 'column', alignItems: 'flex-end' }, // Ajustement width pour compenser headerCenter
  docTitle: { fontSize: 28, fontWeight: 'extrabold', textTransform: 'uppercase', color: '#111827', lineHeight: 1 },
  docNumber: { fontSize: 12, color: '#4b5563', marginTop: 4 },
  docDate: { fontSize: 9, color: '#6b7280', marginTop: 2 },

  nccBox: {
    marginTop: 10,
    backgroundColor: '#f9fafb',
    borderRightWidth: 4,
    borderRightColor: '#3b82f6',
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'flex-end',
    minWidth: 140
  },
  nccRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 2 },
  nccLabel: { fontSize: 7, fontWeight: 'bold', textTransform: 'uppercase', color: '#374151', marginRight: 5 },
  nccValue: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#111827' },

  // CORPS
  recuContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25, gap: 15 },
  recuClientBox: { flex: 1, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 4, padding: 15, backgroundColor: '#ffffff' },
  recuAmountWrapper: { width: '40%' },
  recuAmountBox: { backgroundColor: '#2563eb', borderRadius: 4, padding: 20, alignItems: 'center', justifyContent: 'center', height: 100 },
  
  factureClientWrapper: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 30 },
  factureClientBox: { width: '60%', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 4, padding: 15, backgroundColor: '#ffffff' },

  labelTiny: { fontSize: 7, fontWeight: 'bold', textTransform: 'uppercase', color: '#9ca3af', letterSpacing: 1, marginBottom: 5 },
  clientName: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', color: '#1f2937', marginBottom: 4 },
  clientText: { fontSize: 9, color: '#4b5563', lineHeight: 1.4 },
  amountLabel: { fontSize: 8, fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.8, marginBottom: 4, color: 'white' },
  amountValue: { fontSize: 20, fontWeight: 'bold', fontFamily: 'Helvetica-Bold', color: 'white' },

  // TABLEAU
  table: { width: '100%', marginBottom: 30 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#1f2937', paddingVertical: 8, paddingHorizontal: 8, alignItems: 'center' },
  th: { color: 'white', fontSize: 8, fontWeight: 'bold', textTransform: 'uppercase' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#f3f4f6', paddingVertical: 8, paddingHorizontal: 8, alignItems: 'center' },
  rowEven: { backgroundColor: '#ffffff' },
  rowOdd: { backgroundColor: '#f9fafb' },
  colDesc: { width: '50%', textAlign: 'left' },
  colQty: { width: '15%', textAlign: 'center' },
  colPrice: { width: '15%', textAlign: 'right' },
  colTotal: { width: '20%', textAlign: 'right' },
  td: { fontSize: 9, color: '#374151' },
  tdMono: { fontSize: 9, color: '#4b5563', fontFamily: 'Helvetica' },
  tdBold: { fontSize: 9, fontWeight: 'bold', color: '#1f2937' },

  // TOTAUX
  totalsSection: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 30 },
  totalsContainer: { width: '45%' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  totalLabel: { fontSize: 8, textTransform: 'uppercase', color: '#4b5563' },
  totalValue: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#1f2937' },
  netBadge: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderRadius: 4, marginTop: 8, alignItems: 'center' },
  netLabel: { fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase', color: 'white' },
  netValue: { fontSize: 13, fontWeight: 'bold', fontFamily: 'Helvetica-Bold', color: 'white' },

  // DETAILS RECU
  recuDetailsBox: { backgroundColor: '#eff6ff', borderWidth: 1, borderColor: '#dbeafe', borderLeftWidth: 4, borderLeftColor: '#60a5fa', padding: 12, marginBottom: 20, borderRadius: 4 },
  recuDetailTitle: { fontSize: 8, fontWeight: 'bold', textTransform: 'uppercase', color: '#9ca3af', marginBottom: 8, borderBottomWidth: 1, borderBottomColor: '#bfdbfe', paddingBottom: 4 },
  recuDetailRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 4 },
  recuLabel: { width: 80, fontWeight: 'bold', color: '#4b5563', fontSize: 9 },
  recuValue: { flex: 1, color: '#1f2937', fontSize: 9, fontFamily: 'Helvetica' },

  // SIGNATURES
  signatureSection: { flexDirection: 'row', justifyContent: 'space-between', gap: 30, height: 90, marginBottom: 20, borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingTop: 15 },
  sigBox: { width: '48%', borderWidth: 2, borderColor: '#d1d5db', borderRadius: 3, padding: 10, justifyContent: 'space-between' },
  sigTitle: { fontSize: 8, fontWeight: 'bold', textTransform: 'uppercase', color: '#6b7280' },
  sigSub: { fontSize: 7, fontStyle: 'italic', color: '#9ca3af' },

  // INFO REGLEMENT
  paymentBox: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 4, padding: 10, marginBottom: 10 },
  paymentTitle: { fontSize: 8, fontWeight: 'bold', textTransform: 'uppercase', color: '#374151', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', paddingBottom: 4, marginBottom: 6 },
  paymentGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  
  paymentItem: { 
    width: '50%', 
    marginBottom: 4, 
    fontSize: 8, 
    color: '#6b7280',
    flexDirection: 'row',
    alignItems: 'center'
  },
  paymentVal: { color: '#1f2937', fontWeight: 'bold', marginLeft: 4 },

  bankBox: { marginTop: 4, marginBottom: 20, backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 4, padding: 8, alignItems: 'center' },

  // FOOTER FIXÉ EN BAS
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#d1d5db',
    paddingTop: 10,
    alignItems: 'center'
  },
  footerText: { fontSize: 7, color: '#9ca3af', textAlign: 'center', marginBottom: 2 }
});

const formatMoney = (amount) => new Intl.NumberFormat('fr-CI', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(amount).replace('XOF', 'FCFA');

export default function InvoicePDF({ invoice }) {
  const subtotal = invoice.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
  const taxAmount = invoice.hasTax ? (subtotal * invoice.taxRate) / 100 : 0;
  const total = subtotal + taxAmount;
  const advance = invoice.advance || 0;
  const balanceDue = total - advance;
  
  const isRecu = invoice.type === 'RECU';
  const isPaid = invoice.status === 'PAID';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoContainer}>
              {invoice.sender.logo ? <Image src={invoice.sender.logo} style={styles.logoImage} /> : <View style={styles.logoPlaceholder}><Text style={{color:'white', fontSize:10}}>LOGO</Text></View>}
            </View>
            <Text style={styles.senderName}>{invoice.sender.name || "VOTRE ENTREPRISE"}</Text>
            <Text style={styles.senderLegal}>{invoice.sender.legalForm}</Text>
            <Text style={styles.senderDetails}>{invoice.sender.address}</Text>
            <Text style={styles.senderDetails}>{invoice.sender.zip} {invoice.sender.city}</Text>
            <Text style={styles.senderDetails}>Tél: {invoice.sender.phone}</Text>
            <Text style={styles.senderDetails}>Email: {invoice.sender.email}</Text>
          </View>

          <View style={styles.headerCenter}>
             {/* QR Code rendu plus grand et sans bordure pour le scan */}
             {isRecu && invoice.receiptQrCode && <Image src={invoice.receiptQrCode} style={styles.qrImage} />}
          </View>

          <View style={styles.headerRight}>
             <Text style={styles.docTitle}>{invoice.type}</Text>
             <Text style={styles.docNumber}>N° {invoice.number}</Text>
             <Text style={styles.docDate}>Date: {new Date(invoice.date).toLocaleDateString('fr-FR')}</Text>
             <View style={styles.nccBox}>
                 <View style={styles.nccRow}><Text style={styles.nccLabel}>NCC :</Text><Text style={styles.nccValue}>{invoice.sender.ncc || '-'}</Text></View>
                 <View style={styles.nccRow}><Text style={styles.nccLabel}>RCCM :</Text><Text style={styles.nccValue}>{invoice.sender.rccm || '-'}</Text></View>
             </View>
          </View>
        </View>

        {/* CORPS */}
        {isRecu ? (
            <View style={styles.recuContainer}>
                <View style={styles.recuClientBox}>
                    <Text style={styles.labelTiny}>REÇU DE</Text>
                    <Text style={styles.clientName}>{invoice.recipient.name || "NOM DU CLIENT"}</Text>
                    <Text style={styles.clientText}>Tél: {invoice.recipient.phone}</Text>
                    <Text style={styles.clientText}>{invoice.recipient.city} {invoice.recipient.address}</Text>
                </View>
                <View style={styles.recuAmountWrapper}>
                    <View style={styles.recuAmountBox}>
                        <Text style={styles.amountLabel}>MONTANT PERÇU</Text>
                        <Text style={styles.amountValue}>{invoice.receiptAmount || '0 FCFA'}</Text>
                    </View>
                </View>
            </View>
        ) : (
            <View style={styles.factureClientWrapper}>
                <View style={styles.factureClientBox}>
                    <Text style={styles.labelTiny}>FACTURÉ À</Text>
                    <Text style={styles.clientName}>{invoice.recipient.name || "NOM DU CLIENT"}</Text>
                    <Text style={styles.clientText}>{invoice.recipient.address} {invoice.recipient.city}</Text>
                    {invoice.recipient.phone && <Text style={styles.clientText}>Tél: {invoice.recipient.phone}</Text>}
                    {invoice.recipient.ncc && <Text style={{ fontSize:8, fontWeight:'bold', color:'#6b7280', marginTop:6, paddingTop:4, borderTopWidth:1, borderTopColor:'#f3f4f6' }}>NCC: {invoice.recipient.ncc}</Text>}
                </View>
            </View>
        )}

        {/* TABLEAU */}
        {!isRecu && (
            <View style={styles.table}>
                <View style={styles.tableHeader}>
                    <Text style={[styles.th, styles.colDesc]}>Désignation</Text>
                    <Text style={[styles.th, styles.colQty]}>Qté</Text>
                    <Text style={[styles.th, styles.colPrice]}>P.U.</Text>
                    <Text style={[styles.th, styles.colTotal]}>Total</Text>
                </View>
                {invoice.items.map((item, index) => (
                    <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.rowOdd : styles.rowEven]}>
                        <Text style={[styles.td, styles.colDesc]}>{item.description}</Text>
                        <Text style={[styles.tdMono, styles.colQty]}>{item.quantity}</Text>
                        <Text style={[styles.tdMono, styles.colPrice]}>{formatMoney(item.price).replace('FCFA', '')}</Text>
                        <Text style={[styles.tdBold, styles.colTotal]}>{formatMoney(item.quantity * item.price).replace('FCFA', '')}</Text>
                    </View>
                ))}
            </View>
        )}

        {/* TOTAUX */}
        {!isRecu && (
            <View style={styles.totalsSection}>
                <View style={styles.totalsContainer}>
                    {invoice.hasTax && (
                        <>
                            <View style={styles.totalRow}><Text style={styles.totalLabel}>Total HT</Text><Text style={styles.totalValue}>{formatMoney(subtotal)}</Text></View>
                            <View style={styles.totalRow}><Text style={styles.totalLabel}>TVA ({invoice.taxRate}%)</Text><Text style={styles.totalValue}>{formatMoney(taxAmount)}</Text></View>
                        </>
                    )}
                    {advance > 0 && (
                        <>
                            <View style={[styles.totalRow, { borderTopWidth: 1, marginTop: 4 }]}><Text style={[styles.totalLabel, {fontWeight:'bold'}]}>Total Général</Text><Text style={styles.totalValue}>{formatMoney(total)}</Text></View>
                            <View style={[styles.totalRow, { backgroundColor:'#ecfdf5', padding:4, borderRadius:2, marginTop:4 }]}><Text style={[styles.totalLabel, {color:'#059669', fontWeight:'bold'}]}>Avance Reçue</Text><Text style={[styles.totalValue, {color:'#059669'}]}>- {formatMoney(advance)}</Text></View>
                        </>
                    )}
                    <View style={[styles.netBadge, { backgroundColor: (advance > 0 && balanceDue <= 0) ? '#16a34a' : '#2563eb' }]}>
                        <Text style={styles.netLabel}>{advance > 0 ? (balanceDue <= 0 ? "Soldé" : "Reste à Payer") : "Net à Payer"}</Text>
                        <Text style={styles.netValue}>{formatMoney(balanceDue > 0 ? balanceDue : 0)}</Text>
                    </View>
                </View>
            </View>
        )}

        {/* DETAILS RECU */}
        {isRecu && (
            <View style={styles.recuDetailsBox}>
                <Text style={styles.recuDetailTitle}>Détails de la transaction</Text>
                <View style={styles.recuDetailRow}><Text style={styles.recuLabel}>Référence :</Text><Text style={styles.recuValue}>{invoice.receiptReference || '-'}</Text></View>
                <View style={styles.recuDetailRow}><Text style={styles.recuLabel}>Motif :</Text><Text style={styles.recuValue}>{invoice.receiptReason || '-'}</Text></View>
            </View>
        )}

        {isRecu && (
            <View style={styles.signatureSection}>
                <View style={styles.sigBox}><Text style={styles.sigTitle}>Signature Client</Text></View>
                <View style={styles.sigBox}><Text style={styles.sigTitle}>Pour {invoice.sender.name || "L'ENTREPRISE"}</Text><Text style={styles.sigSub}>"Montant perçu et validé"</Text></View>
            </View>
        )}

        {!isRecu && invoice.notes && (
             <View style={{ marginBottom: 20 }}>
                 <Text style={styles.labelTiny}>Arrêté de compte</Text>
                 <Text style={{ fontSize: 9, fontStyle: 'italic', color: '#4b5563', paddingLeft: 10, borderLeftWidth: 2, borderLeftColor: '#d1d5db' }}>"{invoice.notes}"</Text>
             </View>
        )}

        {/* INFO PAIEMENT */}
        <View style={styles.paymentBox}>
            <Text style={styles.paymentTitle}>Règlement</Text>
            <View style={styles.paymentGrid}>
                {/* Ligne Mode */}
                <View style={styles.paymentItem}>
                    <Text>Mode: </Text>
                    <Text style={styles.paymentVal}>{invoice.paymentMethod}</Text>
                </View>
                
                {/* Ligne Echeance */}
                {!isRecu && (
                     <View style={styles.paymentItem}>
                        <Text>Échéance: </Text>
                        <Text style={styles.paymentVal}>{new Date(invoice.dueDate).toLocaleDateString('fr-FR')}</Text>
                     </View>
                )}

                {/* Ligne Statut */}
                <View style={styles.paymentItem}>
                    <Text>Statut: </Text>
                    <Text style={{ fontWeight:'bold', color: isPaid ? '#16a34a' : '#ef4444', marginLeft: 4 }}>{isPaid ? 'PAYÉ' : 'EN ATTENTE'}</Text>
                </View>
            </View>
            {invoice.paymentMethod === 'Mobile Money' && <Text style={{ fontSize: 8, color: '#1e40af', marginTop: 4, fontWeight:'bold' }}>Mobile Money: {invoice.mobileMoneyInfo}</Text>}
        </View>

        {(invoice.sender.bankName || invoice.sender.iban) && (
             <View style={styles.bankBox}>
                 <Text style={{ fontSize: 8, color:'#4b5563', textAlign:'center' }}>
                    <Text style={{ fontWeight:'bold' }}>INFOS BANCAIRES : </Text>
                    {invoice.sender.bankName} - IBAN: <Text style={{ fontFamily:'Helvetica-Bold', color:'#1f2937' }}>{invoice.sender.iban}</Text>
                 </Text>
             </View>
        )}

        <View style={styles.footer}>
            <Text style={[styles.footerText, { fontWeight: 'bold', color: '#374151' }]}>{invoice.sender.name} - {invoice.sender.legalForm} au capital de {invoice.sender.capital} FCFA</Text>
            <Text style={styles.footerText}>Siège Social: {invoice.sender.address} - {invoice.sender.city}</Text>
            <Text style={styles.footerText}>RCCM: {invoice.sender.rccm} - NCC: {invoice.sender.ncc}</Text>
            <Text style={[styles.footerText, { fontStyle: 'italic', marginTop: 2 }]}>En cas de litige, seul le tribunal de commerce d'Abidjan est compétent.</Text>
        </View>

      </Page>
    </Document>
  );
}