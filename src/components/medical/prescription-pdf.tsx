import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image, Svg, Path } from '@react-pdf/renderer';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 30,
        fontFamily: 'Helvetica',
        fontSize: 10,
        color: '#333333',
    },
    header: {
        marginBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#111827',
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 100,
        objectFit: 'contain',
    },
    socialIcon: {
        width: 10,
        height: 10,
        marginRight: 4,
    },
    patientBar: {
        backgroundColor: '#f8fafc',
        padding: 10,
        borderRadius: 4,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderLeftWidth: 3,
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
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        paddingTop: 10,
        alignItems: 'center',
    },
    signatureLine: {
        width: 150,
        borderTopWidth: 1,
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

const getAssetUrl = (path: string) => {
    try {
        return typeof window !== 'undefined' ? `${window.location.origin}${path}` : path;
    } catch (e) {
        return path;
    }
};

const PrescriptionPDF = ({ data }: { data: PrescriptionData }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header — identical to ConsultationPDF */}
            <View style={[styles.header, { alignItems: 'center' }]}>

                {/* Left Column: Doctor Identity */}
                <View style={{ width: '20%' }}>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#111827', marginBottom: 2 }}>Graciela Sepúlveda</Text>
                    <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#374151' }}>Médica Veterinaria</Text>
                    <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#374151' }}>Mat. 1054</Text>
                    <Text style={{ fontSize: 8, color: '#4B5563', marginTop: 2 }}>Especialista CMVSF2 N°0006</Text>
                </View>

                {/* Center Column: Logo */}
                <View style={{ width: '50%', alignItems: 'center', justifyContent: 'center' }}>
                    <Image src={getAssetUrl('/logo-clinica.png')} style={styles.logo} />
                </View>

                {/* Right Column: Contact & Socials */}
                <View style={{ width: '30%', alignItems: 'flex-end' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                        <Svg width={10} height={10} viewBox="0 0 24 24" style={{ marginRight: 4 }}>
                            <Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#374151" />
                        </Svg>
                        <Text style={{ fontSize: 8, color: '#374151' }}>San Luis 3698 / 2000 Rosario</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                        <Svg width={10} height={10} viewBox="0 0 24 24" style={{ marginRight: 4 }}>
                            <Path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="#374151" />
                        </Svg>
                        <Text style={{ fontSize: 8, color: '#374151' }}>+54 9 3413 13-4477</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                        <Svg width={10} height={10} viewBox="0 0 24 24" style={{ marginRight: 4 }}>
                            <Path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="#4B5563" />
                        </Svg>
                        <Text style={{ fontSize: 8, color: '#4B5563' }}>gsepulveda@gracielasepulveda.com</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image src={getAssetUrl('/icon-fb.png?v=3')} style={styles.socialIcon} />
                        <Image src={getAssetUrl('/icon-ig.png?v=3')} style={styles.socialIcon} />
                        <Text style={{ fontSize: 8, color: '#374151' }}>oftalmovetgracielasepulveda</Text>
                    </View>
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
                <Text style={styles.footerText}>San Luis 3698, Rosario — +54 9 3413 13-4477 — Powered by System Coral</Text>
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
