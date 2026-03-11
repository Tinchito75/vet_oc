import { Page, Text, View, Document, StyleSheet, Image, PDFDownloadLink, Svg, Circle, Ellipse, Path } from '@react-pdf/renderer';

// --- Constants ---
const EXAM_ROWS = [
    "Aspecto del Globo Ocular",
    "Test de Schirmer",
    "Prueba de Amenaza",
    "Prueba de Deambulación",
    "Reflejo Fúndico",
    "Pupilas",
    "Reflejos Fotomotores Pupilares",
    "Reflejo Corneal",
    "Reflejo Palpebral",
    "Reflejo Trigémino - Abducens Ac.",
    "Reflejo del Parpadeo Fotópico",
    "Respuesta de la Luz Oscilante",
    "Permeabilidad del Sistema Lagrimal",
    "Fluoresceína",
    "Reflejo Fotocromático (ROJA)",
    "Reflejo Fotocromático (AZUL)",
    "Rosa de Bengala",
    "Párpados/Conjuntiva"
];

// --- Styles ---
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
        borderBottomColor: '#111827', // Gray-900 like
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        textTransform: 'uppercase',
    },
    headerSubtitle: {
        fontSize: 10,
        color: '#6B7280', // Gray-500
    },
    section: {
        marginBottom: 10,
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
    // Ophthalmology specific
    examSection: {
        marginTop: 10,
    },
    sketchContainer: {
        width: '100%',
        height: 150,
        position: 'relative',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 10,
    },
    sketchTitle: {
        fontSize: 10,
        textAlign: 'center',
        marginBottom: 5,
        fontWeight: 'bold',
        color: '#374151',
    },
    sketchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        marginTop: 10,
    },
    sketchItem: {
        width: '48%', // 2 per row
        marginBottom: 15,
        alignItems: 'center',
    },
    chartTable: {
        width: '100%',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        minHeight: 20,
        alignItems: 'center',
    },
    tableHeader: {
        backgroundColor: '#F9FAFB',
        fontWeight: 'bold',
    },
    tableCell: {
        width: '33%',
        padding: 4,
        textAlign: 'center',
        fontSize: 9,
    },
    tableCellLabel: {
        width: '40%',
        textAlign: 'left',
        paddingLeft: 8,
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
    }
});

// --- Types ---
interface ConsultationData {
    patientName: string;
    species: string;
    breed?: string;
    sex?: string;
    ownerName: string;
    date: string;
    reason: string;
    anamnesis: string;
    diagnosis: string;
    treatment: string;
    weight?: string;
    temperature?: string;
    tutorDni?: string;
    tutorPhone?: string;
    tutorCuit?: string;
    patientDob?: string;
    patientSex?: string;
    patientWeight?: string;
    ophthalmology?: {
        examData: any; // The full JSON object
        drawings?: {
            cornea?: string;
            lens?: string;
            fundus?: string;
            eyelids?: string;
        };
    };
}

// --- Props ---
interface ConsultationPDFProps {
    data: ConsultationData;
}

// --- PDF Component ---
const ConsultationPDF = ({ data }: ConsultationPDFProps) => {

    // Normalization
    const speciesNorm = data.species?.toLowerCase().trim() || 'canino';

    // Helper to render backgrounds
    const renderCorneaBg = () => (
        <Svg viewBox="0 0 500 250" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            {/* OD */}
            <Text x="125" y="30" textAnchor="middle" fill="#4B5563" style={{ fontSize: 20, fontWeight: 'bold' }}>OD</Text>
            <Circle cx="125" cy="140" r="90" fill="none" stroke="#6B7280" strokeWidth="2" />
            {speciesNorm === 'felino' ? (
                <Ellipse cx="125" cy="140" rx="20" ry="60" fill="none" stroke="#6B7280" strokeWidth="2" />
            ) : (
                <Circle cx="125" cy="140" r="35" fill="none" stroke="#6B7280" strokeWidth="2" />
            )}

            {/* OI */}
            <Text x="375" y="30" textAnchor="middle" fill="#4B5563" style={{ fontSize: 20, fontWeight: 'bold' }}>OI</Text>
            <Circle cx="375" cy="140" r="90" fill="none" stroke="#6B7280" strokeWidth="2" />
            {speciesNorm === 'felino' ? (
                <Ellipse cx="375" cy="140" rx="20" ry="60" fill="none" stroke="#6B7280" strokeWidth="2" />
            ) : (
                <Circle cx="375" cy="140" r="35" fill="none" stroke="#6B7280" strokeWidth="2" />
            )}
        </Svg>
    );

    const renderLensBg = () => (
        <Svg viewBox="0 0 400 200" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <Text x="100" y="20" textAnchor="middle" fill="#666">OD</Text>
            <Circle cx="60" cy="100" r="38" fill="none" stroke="#333" strokeWidth="2" />
            <Text x="60" y="155" textAnchor="middle" style={{ fontSize: 12 }} fill="#666">Ant</Text>
            <Circle cx="140" cy="100" r="38" fill="none" stroke="#333" strokeWidth="2" />
            <Text x="140" y="155" textAnchor="middle" style={{ fontSize: 12 }} fill="#666">Post</Text>

            <Text x="300" y="20" textAnchor="middle" fill="#666">OI</Text>
            <Circle cx="260" cy="100" r="38" fill="none" stroke="#333" strokeWidth="2" />
            <Text x="260" y="155" textAnchor="middle" style={{ fontSize: 12 }} fill="#666">Ant</Text>
            <Circle cx="340" cy="100" r="38" fill="none" stroke="#333" strokeWidth="2" />
            <Text x="340" y="155" textAnchor="middle" style={{ fontSize: 12 }} fill="#666">Post</Text>
        </Svg>
    );

    const renderFundusBg = () => (
        <Svg viewBox="0 0 400 200" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            {/* OD */}
            <Circle cx="100" cy="100" r="80" fill="none" stroke="#333" strokeWidth="2" />
            <Path d="M100 100 L100 60 M100 100 L70 130 M100 100 L130 130" stroke="#555" strokeWidth="2" strokeOpacity={0.3} />

            {/* OI */}
            <Circle cx="300" cy="100" r="80" fill="none" stroke="#333" strokeWidth="2" />
            <Path d="M300 100 L300 60 M300 100 L270 130 M300 100 L330 130" stroke="#555" strokeWidth="2" strokeOpacity={0.3} />
        </Svg>
    );

    const renderEyelidsBg = () => (
        <Svg viewBox="0 0 400 250" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <Text x="200" y="30" textAnchor="middle" fill="#666">OD (Sup/Inf)</Text>
            <Path d="M40 100 Q100 40 160 100 Q100 160 40 100Z" fill="none" stroke="#333" strokeWidth="2" />

            <Text x="300" y="30" textAnchor="middle" fill="#666">OI (Sup/Inf)</Text>
            <Path d="M240 100 Q300 40 360 100 Q300 160 240 100Z" fill="none" stroke="#333" strokeWidth="2" />
        </Svg>
    );

    // Helper for Asset URLs
    const getAssetUrl = (path: string) => {
        try {
            return typeof window !== 'undefined' ? `${window.location.origin}${path}` : path;
        } catch (e) {
            return path;
        }
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                {/* Header - Centered Logo Layout */}
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
                            {/* Name is bold or not? User said: "deja solo los titulos en negrita la informacion no osea,DNI en negrita...". Name is info. So Name normal. */}
                            <Text style={[styles.value, { marginRight: 10 }]}>{data.ownerName}</Text>

                            {data.tutorDni && (
                                <Text style={[styles.value, { marginRight: 10 }]}>
                                    <Text style={{ fontWeight: 'bold' }}>DNI:</Text> {data.tutorDni}
                                </Text>
                            )}

                            {data.tutorPhone && (
                                <Text style={[styles.value, { marginRight: 10 }]}>
                                    <Text style={{ fontWeight: 'bold' }}>Tel:</Text> {data.tutorPhone}
                                </Text>
                            )}

                            {data.tutorCuit && (
                                <Text style={styles.value}>
                                    <Text style={{ fontWeight: 'bold' }}>CUIT:</Text> {data.tutorCuit}
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
                            {data.breed && <Text style={[styles.value, { marginRight: 10 }]}>Raza: {data.breed}</Text>}
                            {data.patientDob && <Text style={[styles.value, { marginRight: 10 }]}>Fecha Nac: {data.patientDob}</Text>}
                            {data.patientSex && <Text style={[styles.value, { marginRight: 10 }]}>Sexo: {data.patientSex}</Text>}
                            {data.patientWeight && <Text style={styles.value}>Peso: {data.patientWeight} kg</Text>}
                        </View>
                    </View>
                </View>

                {/* Vitals (Simplified) */}
                {(data.weight || data.temperature) && (
                    <View style={[styles.infoBox, { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB' }]}>
                        {data.weight && (
                            <View style={styles.infoItem}>
                                <Text style={styles.label}>Peso</Text>
                                <Text style={styles.value}>{data.weight} kg</Text>
                            </View>
                        )}
                        {data.temperature && (
                            <View style={styles.infoItem}>
                                <Text style={styles.label}>Temperatura</Text>
                                <Text style={styles.value}>{data.temperature} °C</Text>
                            </View>
                        )}
                    </View>
                )}

                {/* Clinical Data */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Anamnesis</Text>
                    <Text style={styles.textBlock}>{data.anamnesis || 'Sin datos.'}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Diagnóstico</Text>
                    <Text style={styles.textBlock}>{data.diagnosis || 'Sin diagnóstico.'}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Plan Terapéutico</Text>
                    <Text style={styles.textBlock}>{data.treatment || 'Sin tratamiento.'}</Text>
                </View>

                {/* Ophthalmology Section (New Page if needed or flows) */}
                {data.ophthalmology && (
                    <View style={styles.examSection} break>
                        <Text style={[styles.sectionTitle, { marginBottom: 15 }]}>Examen Oftalmológico</Text>

                        {/* Values Table */}
                        <View style={styles.chartTable}>
                            <View style={[styles.tableRow, styles.tableHeader]}>
                                <Text style={[styles.tableCellLabel, { fontWeight: 'bold' }]}>Prueba</Text>
                                <Text style={styles.tableCell}>OD (Derecho)</Text>
                                <Text style={styles.tableCell}>OI (Izquierdo)</Text>
                            </View>

                            {/* Iterative Row Rendering */}
                            {EXAM_ROWS.map((testName) => (
                                <View style={styles.tableRow} key={testName}>
                                    <Text style={styles.tableCellLabel}>{testName}</Text>
                                    <Text style={styles.tableCell}>{data.ophthalmology?.examData?.[testName]?.od || '-'}</Text>
                                    <Text style={styles.tableCell}>{data.ophthalmology?.examData?.[testName]?.oi || '-'}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Sketches */}
                        {data.ophthalmology.drawings && Object.keys(data.ophthalmology.drawings).length > 0 && (
                            <View>
                                <Text style={[styles.sketchTitle, { textAlign: 'left', fontSize: 12, marginTop: 10 }]}>Esquemas</Text>
                                <View style={styles.sketchRow}>

                                    {/* Cornea */}
                                    {data.ophthalmology.drawings.cornea && (
                                        <View style={styles.sketchItem}>
                                            <Text style={styles.sketchTitle}>Córnea</Text>
                                            <View style={styles.sketchContainer}>
                                                {renderCorneaBg()}
                                                <Image
                                                    src={data.ophthalmology.drawings.cornea}
                                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                                />
                                            </View>
                                        </View>
                                    )}

                                    {/* Lens */}
                                    {data.ophthalmology.drawings.lens && (
                                        <View style={styles.sketchItem}>
                                            <Text style={styles.sketchTitle}>Cristalino</Text>
                                            <View style={styles.sketchContainer}>
                                                {renderLensBg()}
                                                <Image
                                                    src={data.ophthalmology.drawings.lens}
                                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                                />
                                            </View>
                                        </View>
                                    )}

                                    {/* Fundus */}
                                    {data.ophthalmology.drawings.fundus && (
                                        <View style={styles.sketchItem}>
                                            <Text style={styles.sketchTitle}>Fondo de Ojo</Text>
                                            <View style={styles.sketchContainer}>
                                                {renderFundusBg()}
                                                <Image
                                                    src={data.ophthalmology.drawings.fundus}
                                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                                />
                                            </View>
                                        </View>
                                    )}

                                    {/* Eyelids */}
                                    {data.ophthalmology.drawings.eyelids && (
                                        <View style={styles.sketchItem}>
                                            <Text style={styles.sketchTitle}>Párpados</Text>
                                            <View style={styles.sketchContainer}>
                                                {renderEyelidsBg()}
                                                <Image
                                                    src={data.ophthalmology.drawings.eyelids}
                                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                                />
                                            </View>
                                        </View>
                                    )}
                                </View>
                            </View>
                        )}
                    </View>
                )}
            </Page>
        </Document>
    );
};

// --- Download Button Component ---
interface DownloadReportButtonProps {
    data: ConsultationData;
    className?: string;
}

export const DownloadReportButton = ({ data, className }: DownloadReportButtonProps) => (
    <PDFDownloadLink
        document={<ConsultationPDF data={data} />}
        fileName={`Informe_${data.patientName}_${data.date}.pdf`}
        className={className}
    >
        {({ loading }) =>
            loading ? 'Generando PDF...' : 'Descargar Informe PDF'
        }
    </PDFDownloadLink>
);
