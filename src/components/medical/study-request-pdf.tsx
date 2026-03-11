import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image, Svg, Path } from '@react-pdf/renderer';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 30, // Updated to match
        fontFamily: 'Helvetica',
        fontSize: 10, // Added base font
        color: '#333333', // Added base color
    },
    header: {
        marginBottom: 20,
        borderBottomWidth: 2, // Updated to 2
        borderBottomStyle: 'solid',
        borderBottomColor: '#111827', // Updated to dark gray
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end', // Updated to flex-end
    },
    headerTitle: {
        fontSize: 24, // 14 in local usage earlier but 24 in def
        fontWeight: 'bold',
        color: '#111827',
        textTransform: 'uppercase',
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
    infoBox: {
        backgroundColor: '#F3F4F6', // Gray-100
        padding: 10,
        borderRadius: 4,
        marginBottom: 15,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    infoItem: {
        width: '50%',
        marginBottom: 4,
    },
    label: {
        fontSize: 8,
        color: '#6B7280',
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    value: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#111827',
    },
    section: {
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2563EB', // Blue-600
        marginBottom: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingBottom: 2,
    },
    textBlock: {
        fontSize: 10,
        lineHeight: 1.5,
        marginBottom: 8,
        color: '#4B5563',
    },
    studyBox: {
        marginTop: 10,
        padding: 15,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#E5E7EB',
        borderRadius: 6,
        backgroundColor: '#FFFFFF',
    },
    bulletItem: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    bulletPoint: {
        width: 15,
        fontSize: 10, // adjusted
        color: '#4B5563',
    },
    bulletText: {
        flex: 1,
        fontSize: 10, // adjusted
        color: '#4B5563',
        lineHeight: 1.4,
    },
    recommendedSection: {
        marginTop: 20,
        padding: 15,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#E5E7EB',
        borderRadius: 4,
        backgroundColor: '#F9FAFB', // matched light gray
    },
    recommendedTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 5,
    },
    recommendedText: {
        fontSize: 9,
        color: '#6B7280',
        lineHeight: 1.4,
    },
    footerContainer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
    },
    footer: {
        borderTopWidth: 1,
        borderTopStyle: 'solid',
        borderTopColor: '#E5E7EB',
        paddingTop: 10,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 8,
        color: '#9CA3AF',
        marginTop: 4,
    },
});

// Helper for Asset URLs
const getAssetUrl = (path: string) => {
    try {
        return typeof window !== 'undefined' ? `${window.location.origin}${path}` : path;
    } catch (e) {
        return path;
    }
};

export type StudyType = 'Radiografía' | 'Resonancia' | 'Análisis de Sangre' | '';

export interface StudyRequestData {
    patientName: string;
    species: string;
    breed?: string;
    gender?: string;
    weight?: string;
    age: string;
    ownerName: string;
    ownerDni?: string;
    ownerPhone?: string;
    ownerEmail?: string;
    date: string;
    studyType: StudyType;
    detailsText?: string;
    bloodTests?: string[];
}

const StudyRequestDocument = ({ data }: { data: StudyRequestData }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header - Centered Logo Layout */}
            <View style={[styles.header, { alignItems: 'center' }]}>

                {/* Left Column: Identity */}
                <View style={{ width: '20%' }}>
                    <Text style={[styles.headerTitle, { fontSize: 14, marginBottom: 2 }]}>Graciela Sepúlveda</Text>
                    <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#374151' }}>Médica Veterinaria</Text>
                    <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#374151' }}>Mat. 1054</Text>
                    <Text style={{ fontSize: 8, color: '#4B5563', marginTop: 2 }}>Especialista CMVSF2 N°0006</Text>
                </View>

                {/* Center Column: Big Logo */}
                <View style={{ width: '50%', alignItems: 'center', justifyContent: 'center' }}>
                    <Image src={getAssetUrl("/logo-clinica.png")} style={styles.logo} />
                </View>

                {/* Right Column: Contact & Socials */}
                <View style={{ width: '30%', alignItems: 'flex-end' }}>

                    {/* Location */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                        <Svg width={10} height={10} viewBox="0 0 24 24" style={{ marginRight: 4 }}>
                            <Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#374151" />
                        </Svg>
                        <Text style={{ fontSize: 8, color: '#374151' }}>San Luis 3698 / 2000 Rosario</Text>
                    </View>

                    {/* Phone */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                        <Svg width={10} height={10} viewBox="0 0 24 24" style={{ marginRight: 4 }}>
                            <Path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="#374151" />
                        </Svg>
                        <Text style={{ fontSize: 8, color: '#374151' }}>+54 9 3413 13-4477</Text>
                    </View>

                    {/* Email */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                        <Svg width={10} height={10} viewBox="0 0 24 24" style={{ marginRight: 4 }}>
                            <Path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="#4B5563" />
                        </Svg>
                        <Text style={{ fontSize: 8, color: '#4B5563' }}>gsepulveda@gracielasepulveda.com</Text>
                    </View>

                    {/* Social Row */}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image src={getAssetUrl("/icon-fb.png?v=3")} style={styles.socialIcon} />
                        <Image src={getAssetUrl("/icon-ig.png?v=3")} style={styles.socialIcon} />
                        <Text style={{ fontSize: 8, color: '#374151' }}>oftalmovetgracielasepulveda</Text>
                    </View>
                </View>
            </View>

            {/* Patient Info */}
            <View style={[styles.infoBox, { flexDirection: 'column' }]}>
                {/* TUTOR SECTION */}
                <View style={{ marginBottom: 6, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingBottom: 4 }}>
                    <Text style={[styles.label, { fontSize: 9, fontWeight: 'bold', marginBottom: 2, textTransform: 'uppercase', color: '#111827' }]}>TUTOR</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        <Text style={[styles.value, { marginRight: 10 }]}>{data.ownerName}</Text>

                        {data.ownerDni && (
                            <Text style={[styles.value, { marginRight: 10 }]}>
                                <Text style={{ fontWeight: 'bold' }}>DNI:</Text> {data.ownerDni}
                            </Text>
                        )}

                        {data.ownerPhone && (
                            <Text style={[styles.value, { marginRight: 10 }]}>
                                <Text style={{ fontWeight: 'bold' }}>Tel:</Text> {data.ownerPhone}
                            </Text>
                        )}

                        {data.ownerEmail && (
                            <Text style={[styles.value, { marginRight: 10 }]}>
                                <Text style={{ fontWeight: 'bold' }}>Email:</Text> {data.ownerEmail}
                            </Text>
                        )}
                    </View>
                </View>

                {/* PATIENT SECTION */}
                <View>
                    <Text style={[styles.label, { fontSize: 9, fontWeight: 'bold', marginBottom: 2, textTransform: 'uppercase', color: '#111827' }]}>PACIENTE</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        <Text style={[styles.value, { marginRight: 10 }]}>Nombre: {data.patientName}</Text>
                        <Text style={[styles.value, { marginRight: 10 }]}>Especie: {data.species}</Text>
                        {data.age && <Text style={[styles.value, { marginRight: 10 }]}>Edad: {data.age}</Text>}
                        <Text style={[styles.value, { marginRight: 10 }]}>Fecha: {new Date(data.date).toLocaleDateString()}</Text>
                    </View>
                </View>
            </View>

            {/* Body */}
            <View style={{ flexGrow: 1 }}>
                <Text style={[styles.sectionTitle, { textAlign: 'center', marginBottom: 15 }]}>
                    SOLICITUD DE ESTUDIO COMPLEMENTARIO: {data.studyType.toUpperCase()}
                </Text>

                <View style={styles.studyBox}>
                    {data.studyType === 'Análisis de Sangre' ? (
                        <View>
                            <Text style={styles.textBlock}>Se solicita la realización de las siguientes determinaciones:</Text>
                            {data.bloodTests?.map((test, index) => (
                                <View key={index} style={styles.bulletItem}>
                                    <Text style={styles.bulletPoint}>•</Text>
                                    <Text style={styles.bulletText}>{test}</Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View>
                            <Text style={styles.textBlock}>Se solicita la realización del siguiente estudio de imagen (Región anatómica y proyecciones):</Text>
                            <Text style={[styles.textBlock, { color: '#111827', fontWeight: 'bold', marginTop: 10 }]}>{data.detailsText}</Text>
                        </View>
                    )}
                </View>

                {/* Recommended Place Section */}
                <View style={styles.recommendedSection}>
                    <Text style={styles.recommendedTitle}>Centros Recomendados para la realización del estudio:</Text>
                    <Text style={styles.recommendedText}>Dr. Especialista en Imágenes M.V. - Av. Falsa 1234, Rosario. Tel: 341-0000000</Text>
                    <Text style={styles.recommendedText}>Laboratorio VET - Bv. Falso 5678, Rosario. Tel: 341-1111111</Text>
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footerContainer}>
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Powered by System Coral</Text>
                </View>
            </View>
        </Page>
    </Document>
);

export function DownloadStudyRequestButton({ data }: { data: StudyRequestData }) {
    const isComplete = data.studyType && data.patientName && data.ownerName && (
        (data.studyType === 'Análisis de Sangre' && data.bloodTests && data.bloodTests.length > 0) ||
        (data.studyType !== 'Análisis de Sangre' && data.detailsText && data.detailsText.trim() !== '')
    );

    if (!isComplete) {
        return (
            <Button
                className="bg-slate-300 text-slate-500 font-semibold cursor-not-allowed shadow-none"
                disabled
            >
                <FileText className="mr-2 h-4 w-4" />
                Completar datos para PDF
            </Button>
        );
    }

    return (
        <PDFDownloadLink
            document={<StudyRequestDocument data={data} />}
            fileName={`solicitud-${data.studyType.replace(/\s+/g, '-').toLowerCase()}-${data.patientName.replace(/\s+/g, '_')}.pdf`}
            className="no-underline"
        >
            {({ loading }) => (
                <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm"
                    disabled={loading}
                >
                    <FileText className="mr-2 h-4 w-4" />
                    {loading ? 'Generando PDF...' : 'Generar PDF'}
                </Button>
            )}
        </PDFDownloadLink>
    );
}
