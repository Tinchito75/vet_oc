import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 40,
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 20,
        borderBottom: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerLeft: {
        flexDirection: 'column',
    },
    doctorName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    specialty: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 4,
    },
    logoPlaceholder: {
        width: 50,
        height: 50,
        backgroundColor: '#f1f5f9',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 8,
        color: '#94a3b8',
    },
    patientBar: {
        backgroundColor: '#f8fafc',
        padding: 10,
        borderRadius: 4,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderLeft: 3,
        borderLeftColor: '#0f172a',
    },
    patientInfo: {
        fontSize: 10,
        color: '#334155',
    },
    body: {
        flexGrow: 1,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 15,
        textDecoration: 'underline',
        textAlign: 'center',
    },
    content: {
        fontSize: 11,
        lineHeight: 1.6,
        color: '#1e293b',
    },
    footer: {
        marginTop: 40,
        borderTop: 1,
        borderTopColor: '#ccc',
        paddingTop: 10,
        alignItems: 'center',
    },
    signatureLine: {
        width: 150,
        borderTop: 1,
        borderTopColor: '#000',
        marginBottom: 5,
    },
    footerText: {
        fontSize: 8,
        color: '#94a3b8',
        marginTop: 4,
    },
});

interface PrescriptionData {
    doctorName?: string;
    patientName: string;
    ownerName: string;
    date: string;
    treatment: string;
}

const PrescriptionPDF = ({ data }: { data: PrescriptionData }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.doctorName}>Dra. Graciela Sepúlveda</Text>
                    <Text style={styles.specialty}>Oftalmología Veterinaria</Text>
                </View>
                <View style={styles.logoPlaceholder}>
                    <Text style={styles.logoText}>LOGO</Text>
                </View>
            </View>

            {/* Patient Info Bar */}
            <View style={styles.patientBar}>
                <Text style={styles.patientInfo}>Paciente: {data.patientName}</Text>
                <Text style={styles.patientInfo}>Tutor: {data.ownerName}</Text>
                <Text style={styles.patientInfo}>Fecha: {new Date(data.date).toLocaleDateString()}</Text>
            </View>

            {/* Body */}
            <View style={styles.body}>
                <Text style={styles.title}>INDICACIONES MÉDICAS / RP</Text>
                <Text style={styles.content}>{data.treatment}</Text>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <View style={styles.signatureLine} />
                <Text style={{ fontSize: 10, marginBottom: 5 }}>Dra. Graciela Sepúlveda</Text>
                <Text style={styles.footerText}>Solicitar turnos al [Tu Teléfono] - Urgencias 24hs</Text>
            </View>
        </Page>
    </Document>
);

export function DownloadPrescriptionButton({ data }: { data: PrescriptionData }) {
    if (!data.treatment) return null;

    return (
        <PDFDownloadLink
            document={<PrescriptionPDF data={data} />}
            fileName={`receta-${data.patientName.replace(/\s+/g, '_')}-${data.date}.pdf`}
            className="no-underline"
        >
            {({ loading }) => (
                <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm"
                    disabled={loading}
                >
                    <FileText className="mr-2 h-4 w-4" />
                    {loading ? 'Generando PDF...' : 'Descargar Receta PDF'}
                </Button>
            )}
        </PDFDownloadLink>
    );
}
