import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export interface OphthalmologyExamData {
    [key: string]: {
        od: string;
        oi: string;
    };
}

interface OphthalmologyTableProps {
    data: OphthalmologyExamData;
    onChange: (data: OphthalmologyExamData) => void;
    readOnly?: boolean;
}

const EXAM_ROWS = [
    "Aspecto del Globo Ocular",
    "Test de Schirmer", // Special handling: number input
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

// Suggested values for autofill/datalist
const COMMON_VALUES = [
    "Normal",
    "Anormal",
    "Positivo",
    "Negativo",
    "Disminuido",
    "Aumentado",
    "Ausente",
    "Presente"
];

export function OphthalmologyTable({ data, onChange, readOnly = false }: OphthalmologyTableProps) {
    const handleChange = (rowName: string, eye: 'od' | 'oi', value: string) => {
        if (readOnly) return;
        const newData = { ...data };
        if (!newData[rowName]) {
            newData[rowName] = { od: '', oi: '' };
        }
        newData[rowName][eye] = value;
        onChange(newData);
    };

    const getValue = (rowName: string, eye: 'od' | 'oi') => {
        return data[rowName]?.[eye] || '';
    };

    return (
        <div className="rounded-md border overflow-hidden">
            {!readOnly && (
                <datalist id="exam-suggestions">
                    {COMMON_VALUES.map(val => <option key={val} value={val} />)}
                </datalist>
            )}
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow>
                        <TableHead className="w-[300px]">Prueba / Examen</TableHead>
                        <TableHead className="text-center font-bold text-blue-600 dark:text-blue-400">OD (Derecho)</TableHead>
                        <TableHead className="text-center font-bold text-blue-600 dark:text-blue-400">OI (Izquierdo)</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {EXAM_ROWS.map((rowName) => (
                        <TableRow key={rowName} className="hover:bg-muted/50">
                            <TableCell className="font-medium text-xs md:text-sm">{rowName}</TableCell>
                            <TableCell className="p-2 text-center">
                                {readOnly ? (
                                    <span className="text-sm font-medium text-foreground">
                                        {getValue(rowName, 'od') || '-'}
                                    </span>
                                ) : (
                                    <Input
                                        type={rowName === "Test de Schirmer" ? "number" : "text"}
                                        list={rowName !== "Test de Schirmer" ? "exam-suggestions" : undefined}
                                        placeholder={rowName === "Test de Schirmer" ? "mm/min" : "-"}
                                        className="h-8 text-center"
                                        value={getValue(rowName, 'od')}
                                        onChange={(e) => handleChange(rowName, 'od', e.target.value)}
                                    />
                                )}
                            </TableCell>
                            <TableCell className="p-2 text-center">
                                {readOnly ? (
                                    <span className="text-sm font-medium text-foreground">
                                        {getValue(rowName, 'oi') || '-'}
                                    </span>
                                ) : (
                                    <Input
                                        type={rowName === "Test de Schirmer" ? "number" : "text"}
                                        list={rowName !== "Test de Schirmer" ? "exam-suggestions" : undefined}
                                        placeholder={rowName === "Test de Schirmer" ? "mm/min" : "-"}
                                        className="h-8 text-center"
                                        value={getValue(rowName, 'oi')}
                                        onChange={(e) => handleChange(rowName, 'oi', e.target.value)}
                                    />
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
