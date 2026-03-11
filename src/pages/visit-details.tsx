import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle, Eye } from 'lucide-react';
import { Ophthalmogram } from '@/components/medical/ophthalmogram';
import { type Finding, type FindingStatus } from '@/types/ophthalmology';
import { DownloadPrescriptionButton } from '@/components/medical/prescription-pdf';
import { OphthalmologyTable, type OphthalmologyExamData } from '@/components/medical/ophthalmology-table';
import { SchirmerChart } from '@/components/medical/schirmer-chart';
import { SchemaViewer } from '@/components/medical/schema-viewer';
import { DownloadReportButton } from '@/components/medical/consultation-pdf';

interface Visit {
    id: string;
    date: string;
    reason: string;
    anamnesis: string;
    diagnosis: string;
    treatment_plan: string;
    pressure_od: number | null;
    pressure_os: number | null;
    ophthalmology_exam: OphthalmologyExamData | null;
    patient_id: string;
    patients: {
        name: string;
        is_aggressive: boolean;
        species: string; // Added species
        breed: string;
        gender: string;
        birth_date: string;
        weight: number;
        owners: {
            first_name: string;
            last_name: string;
            dni: string;
            phone: string;
            cuit: string;
        }
    }
}

export default function VisitDetails() {
    const { id } = useParams();
    const [visit, setVisit] = useState<Visit | null>(null);
    const [findingsOD, setFindingsOD] = useState<Finding[]>([]);
    const [findingsOI, setFindingsOI] = useState<Finding[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) loadVisit(id);
    }, [id]);

    async function loadVisit(visitId: string) {
        setLoading(true);

        // 1. Fetch Visit Details
        const { data: visitData, error: visitError } = await supabase
            .from('visits')
            .select('*, patients(name, is_aggressive, species, breed, gender, birth_date, weight, owners(first_name, last_name, dni, phone, cuit))')
            .eq('id', visitId)
            .single();

        if (visitError) {
            console.error(visitError);
            setLoading(false);
            return;
        }
        setVisit(visitData as any);

        // 2. Fetch Findings
        const { data: findingsData } = await supabase
            .from('findings')
            .select('*')
            .eq('visit_id', visitId);

        if (findingsData) {
            const od = findingsData.filter(f => f.eye === 'OD').map(f => ({
                id: f.id,
                zone: f.zone,
                condition: f.condition,
                description: f.description,
                color: f.color_code,
                status: 'abnormal' as FindingStatus
            }));
            const oi = findingsData.filter(f => f.eye === 'OI').map(f => ({
                id: f.id,
                zone: f.zone,
                condition: f.condition,
                description: f.description,
                color: f.color_code,
                status: 'abnormal' as FindingStatus
            }));

            setFindingsOD(od);
            setFindingsOI(oi);
        }

        setLoading(false);
    }

    if (loading) return <div className="p-8 text-center text-slate-500">Cargando visita...</div>;
    if (!visit) return <div className="p-8 text-center text-red-500">Visita no encontrada</div>;

    return (
        <div className="space-y-6 pb-20 max-w-5xl mx-auto">
            {/* Header */}
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link to={`/patients/${visit.patient_id}`}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Volver a {visit.patients.name}
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Consulta del {new Date(visit.date).toLocaleDateString()}</h1>
                        <p className="text-muted-foreground">Motivo: {visit.reason}</p>
                    </div>
                </div>

                {/* PDF Download Action */}
                <div>
                    <DownloadReportButton
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                        data={{
                            patientName: visit.patients.name,
                            species: visit.patients.species,
                            ownerName: `${visit.patients.owners.first_name} ${visit.patients.owners.last_name}`,
                            date: visit.date,
                            reason: visit.reason,
                            anamnesis: visit.anamnesis,
                            diagnosis: visit.diagnosis,
                            treatment: visit.treatment_plan,
                            weight: (visit as any).weight,
                            temperature: (visit as any).temperature,
                            // New Fields
                            breed: visit.patients.breed,
                            patientSex: visit.patients.gender,
                            patientDob: visit.patients.birth_date ? new Date(visit.patients.birth_date).toLocaleDateString() : '',
                            patientWeight: (visit.patients.weight || (visit as any).weight)?.toString(),
                            tutorDni: visit.patients.owners.dni,
                            tutorPhone: visit.patients.owners.phone,
                            tutorCuit: visit.patients.owners.cuit,
                            ophthalmology: visit.ophthalmology_exam ? {
                                examData: visit.ophthalmology_exam,
                                drawings: {
                                    cornea: (visit.ophthalmology_exam as any).sketch_cornea?.od,
                                    lens: (visit.ophthalmology_exam as any).sketch_lens?.od,
                                    fundus: (visit.ophthalmology_exam as any).sketch_fundus?.od,
                                    eyelids: (visit.ophthalmology_exam as any).sketch_eyelids?.od,
                                }
                            } : undefined
                        }}
                    />
                </div>

                {/* Aggressive Alert */}
                {visit.patients.is_aggressive && (
                    <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-600 p-4 rounded-r shadow-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                        <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                        <div>
                            <p className="font-bold text-red-800 dark:text-red-300">⚠️ PACIENTE AGRESIVO</p>
                            <p className="text-sm text-red-700 dark:text-red-400">Tomar precauciones de seguridad durante el manejo.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Clinical Data */}
                {/* Clinical Data */}
                <div className="space-y-6">
                    <div className="bg-card text-card-foreground p-6 rounded-lg border border-border shadow-sm">
                        <h3 className="font-semibold text-lg mb-2 text-blue-600 dark:text-blue-400">Anamnesis</h3>
                        <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{visit.anamnesis || "Sin datos."}</p>
                    </div>

                    <div className="bg-card text-card-foreground p-6 rounded-lg border border-border shadow-sm">
                        <h3 className="font-semibold text-lg mb-2 text-blue-600 dark:text-blue-400">Diagnóstico</h3>
                        <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{visit.diagnosis || "Sin diagnóstico."}</p>
                    </div>

                    {(visit.pressure_od !== null || visit.pressure_os !== null) && (
                        <div className="bg-card text-card-foreground p-6 rounded-lg border border-border shadow-sm">
                            <h3 className="font-semibold text-lg mb-2 text-blue-600 dark:text-blue-400">Presión Intraocular (PIO)</h3>
                            <div className="flex gap-8">
                                <div>
                                    <span className="text-sm text-muted-foreground block">Ojo Derecho (OD)</span>
                                    <span className="text-xl font-medium text-foreground">{visit.pressure_od ?? '-'} mmHg</span>
                                </div>
                                <div>
                                    <span className="text-sm text-muted-foreground block">Ojo Izquierdo (OI)</span>
                                    <span className="text-xl font-medium text-foreground">{visit.pressure_os ?? '-'} mmHg</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-card text-card-foreground p-6 rounded-lg border border-border shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-lg text-blue-600 dark:text-blue-400">Plan Terapéutico</h3>
                            <DownloadPrescriptionButton
                                data={{
                                    patientName: visit.patients.name,
                                    ownerName: `${visit.patients.owners.first_name} ${visit.patients.owners.last_name}`,
                                    date: visit.date,
                                    treatment: visit.treatment_plan
                                }}
                            />
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{visit.treatment_plan || "Sin tratamiento registrado."}</p>
                    </div>
                </div>

                {/* Oftalmogram Display (Read Only) */}
                <div className="bg-card text-card-foreground p-6 rounded-lg border border-border shadow-sm md:col-span-2 xl:col-span-2">
                    <h3 className="font-semibold text-lg mb-6 text-foreground flex items-center gap-2">
                        <Eye className="w-5 h-5 text-blue-600" />
                        Examen Oftalmológico
                    </h3>
                    <div className="grid xl:grid-cols-2 gap-12 pointer-events-none opacity-90">
                        {/* pointer-events-none makes it semi-read-only visually (cant click zones) */}
                        <Ophthalmogram eye="OD" initialFindings={findingsOD} readOnly />
                        <Ophthalmogram eye="OI" initialFindings={findingsOI} readOnly />
                    </div>

                    {/* New Modules Integration */}
                    {visit.ophthalmology_exam && Object.keys(visit.ophthalmology_exam).length > 0 && (
                        <div className="mt-12 space-y-12">
                            {/* 1. Schirmer Chart (History) */}
                            <div>
                                <h4 className="text-md font-semibold mb-4 text-slate-700 dark:text-slate-300 border-b pb-2">Evolución Test de Schirmer</h4>
                                <SchirmerChart
                                    patientId={visit.patient_id}
                                    highlightVisitId={visit.id} // Highlight this visit point
                                />
                            </div>

                            {/* 2. Full Exam Table (Read Only) */}
                            <div>
                                <h4 className="text-md font-semibold mb-4 text-slate-700 dark:text-slate-300 border-b pb-2">Tabla de Valores</h4>
                                <OphthalmologyTable
                                    data={visit.ophthalmology_exam}
                                    onChange={() => { }}
                                    readOnly={true}
                                />
                            </div>

                            {/* 3. Sketches Gallery */}
                            <div>
                                <h4 className="text-md font-semibold mb-4 text-slate-700 dark:text-slate-300 border-b pb-2">Esquemas Gráficos</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        { key: 'sketch_cornea', type: 'cornea', title: 'Córnea' },
                                        { key: 'sketch_lens', type: 'lens', title: 'Cristalino' },
                                        { key: 'sketch_fundus', type: 'fundus', title: 'Fondo de Ojo' },
                                        { key: 'sketch_eyelids', type: 'eyelids', title: 'Párpados' }
                                    ].map(section => {
                                        const sketchData = (visit.ophthalmology_exam as any)[section.key] as { od: string } | undefined;
                                        if (!sketchData?.od) return null;

                                        return (
                                            <div key={section.key} className="border rounded-lg p-2 bg-white shadow-sm">
                                                <p className="text-sm font-bold text-center mb-2 text-slate-700">{section.title}</p>
                                                <SchemaViewer
                                                    type={section.type as any}
                                                    species={visit.patients.species}
                                                    drawingData={sketchData.od}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
