import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, FileText, Plus, TriangleAlert } from 'lucide-react';
import { IopEvolutionChart } from '@/components/medical/iop-evolution-chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EyeComparisonTool } from '@/components/medical/eye-comparison-tool';
import { EditPatientDialog } from "@/components/patients/edit-patient-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Patient {
    id: string;
    name: string;
    species: string;
    breed: string;
    age: number;
    weight: number;
    gender: string;
    medical_history: string;
    birth_date: string;
    is_neutered: boolean;
    is_aggressive: boolean;
    owner_id: string;
    owners: { first_name: string; last_name: string };
    owner_phone: string;
}

interface Visit {
    id: string;
    date: string;
    reason: string;
    diagnosis: string;
}

export default function PatientDetails() {
    const { id } = useParams();
    const [patient, setPatient] = useState<Patient | null>(null);
    const [visits, setVisits] = useState<Visit[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            loadData(id);
        }
    }, [id]);

    async function loadData(patientId: string) {
        setLoading(true);
        // Fetch patient info
        const { data: patientData } = await supabase
            .from('patients')
            .select('*, owners(first_name, last_name)')
            .eq('id', patientId)
            .single();

        if (patientData) {
            setPatient(patientData as any);
        }

        // Fetch visits
        const { data: visitsData } = await supabase
            .from('visits')
            .select('id, date, reason, diagnosis')
            .eq('patient_id', patientId)
            .order('date', { ascending: false });

        if (visitsData) {
            setVisits(visitsData);
        }
        setLoading(false);
    }

    if (loading) return <div className="p-8 text-center text-slate-500">Cargando historia clínica...</div>;
    if (!patient) return <div className="p-8 text-center text-red-500">Paciente no encontrado</div>;

    return (
        <div className="space-y-6">
            {patient.is_aggressive && (
                <Alert variant="destructive" className="border-red-600 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400">
                    <TriangleAlert className="h-5 w-5" />
                    <AlertTitle className="text-lg font-bold ml-2">PRECAUCIÓN: PACIENTE AGRESIVO / MUERDE</AlertTitle>
                    <AlertDescription className="ml-2">
                        Tener extrema precaución al manipular a este paciente. Utilizar bozal si es necesario.
                    </AlertDescription>
                </Alert>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link to={`/owners/${patient.owner_id}`}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Volver
                        </Link>
                    </Button>
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {patient.name}
                            </h1>
                            <EditPatientDialog
                                patient={patient}
                                onPatientUpdated={() => window.location.reload()}
                            />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">
                            {patient.species} • {patient.breed} • {patient.gender} • {patient.weight}kg • {(() => {
                                if (!patient.birth_date) return 'Edad desconocida';
                                const birth = new Date(patient.birth_date);
                                const now = new Date();
                                let years = now.getFullYear() - birth.getFullYear();
                                let months = now.getMonth() - birth.getMonth();
                                if (months < 0 || (months === 0 && now.getDate() < birth.getDate())) {
                                    years--;
                                    months += 12;
                                }
                                if (years > 0) return `${years} años`;
                                return `${months} meses`;
                            })()}
                        </p>
                        <p className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                            Tutor: {patient.owners?.first_name} {patient.owners?.last_name}
                        </p>
                    </div>
                </div>
                <Button asChild>
                    <Link to={`/patients/${id}/visits/new`}>
                        <Plus className="mr-2 h-4 w-4" /> Nueva Consulta
                    </Link>
                </Button>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="general">General & Historia</TabsTrigger>
                    <TabsTrigger value="evolution">Evolución Visual</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Sidebar Info */}
                        <div className="space-y-6">
                            <IopEvolutionChart patientId={patient.id} />

                            <div className="bg-card border border-border shadow-sm rounded-xl p-6">
                                <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Antecedentes</h3>
                                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                    {patient.medical_history || "Sin antecedentes registrados."}
                                </p>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="lg:col-span-2 space-y-6">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <Clock className="w-5 h-5" /> Historia Clínica
                            </h3>

                            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                                {visits.length === 0 ? (
                                    <div className="pl-8 text-slate-500 italic">No hay visitas registradas.</div>
                                ) : (
                                    visits.map((visit) => (
                                        <div key={visit.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">

                                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-200 group-[.is-active]:bg-blue-500 text-slate-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                                <FileText size={18} />
                                            </div>

                                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-card border border-border shadow-sm rounded-xl p-4">
                                                <div className="flex justify-between items-start mb-1">
                                                    <time className="font-mono text-xs text-gray-500 dark:text-gray-400">
                                                        {new Date(visit.date).toLocaleDateString()}
                                                    </time>
                                                    <Link
                                                        to={`/visits/${visit.id}`}
                                                        className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                                                    >
                                                        Ver Detalles
                                                    </Link>
                                                </div>
                                                <h4 className="font-bold text-gray-900 dark:text-white">{visit.reason}</h4>
                                                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 line-clamp-2">
                                                    {visit.diagnosis || "Sin diagnóstico final"}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="evolution">
                    <div className="max-w-4xl mx-auto">
                        <EyeComparisonTool patientId={patient.id} />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
