import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { examinationRows } from '@/constants/examDefinition';

const styles = StyleSheet.create({
    tableContainer: {
        width: '100%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#000000',
        marginTop: 10,
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        minHeight: 20, // Ensure empty rows have some height
        alignItems: 'center',
    },
    headerRow: {
        backgroundColor: '#E5E7EB', // Gray-200
        fontWeight: 'bold',
    },
    sectionHeaderRow: {
        backgroundColor: '#D1D5DB', // Gray-300
        fontWeight: 'bold',
    },
    cellLabel: {
        width: '50%',
        borderRightWidth: 1,
        borderRightColor: '#000000',
        padding: 4,
        fontSize: 9,
        justifyContent: 'center',
    },
    cellValue: {
        width: '25%',
        borderRightWidth: 1,
        borderRightColor: '#000000',
        padding: 4,
        fontSize: 9,
        textAlign: 'center',
        justifyContent: 'center',
    },
    lastCell: {
        borderRightWidth: 0,
    },
    text: {
        fontSize: 9,
        fontFamily: 'Helvetica',
    },
    headerText: {
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    sectionHeaderText: {
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
        fontWeight: 'bold',
        textAlign: 'center',
        width: '100%',
    }
});

interface ExamPDFTableProps {
    examData: Record<string, string>;
}

export const ExamPDFTable: React.FC<ExamPDFTableProps> = ({ examData }) => {
    return (
        <View style={styles.tableContainer}>
            {/* Table Header */}
            <View style={[styles.row, styles.headerRow]}>
                <View style={[styles.cellLabel, { alignItems: 'center' }]}>
                    <Text style={[styles.text, { fontWeight: 'bold' }]}>Prueba</Text>
                </View>
                <View style={styles.cellValue}>
                    <Text style={[styles.text, { fontWeight: 'bold' }]}>OD (Derecho)</Text>
                </View>
                <View style={[styles.cellValue, styles.lastCell]}>
                    <Text style={[styles.text, { fontWeight: 'bold' }]}>OI (Izquierdo)</Text>
                </View>
            </View>

            {/* Table Body */}
            {examinationRows.map((row) => {
                if (row.isHeader) {
                    return (
                        <View key={row.id} style={[styles.row, styles.sectionHeaderRow]}>
                            <View style={{ width: '100%', padding: 4 }}>
                                <Text style={styles.sectionHeaderText}>{row.label}</Text>
                            </View>
                        </View>
                    );
                }

                const valOD = examData?.[`${row.id}_od`] || '-';
                const valOI = examData?.[`${row.id}_oi`] || '-';

                return (
                    <View key={row.id} style={styles.row}>
                        <View style={styles.cellLabel}>
                            <Text style={styles.text}>{row.label}</Text>
                        </View>
                        <View style={styles.cellValue}>
                            <Text style={styles.text}>{valOD}</Text>
                        </View>
                        <View style={[styles.cellValue, styles.lastCell]}>
                            <Text style={styles.text}>{valOI}</Text>
                        </View>
                    </View>
                );
            })}
        </View>
    );
};
