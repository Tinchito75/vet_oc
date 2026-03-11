import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { BillingSwitch } from '@/components/ui/billing-switch';
import { ArrowLeft, Save } from 'lucide-react';
import { Ophthalmogram } from '@/components/medical/ophthalmogram';
import { OphthalmologyTable, type OphthalmologyExamData } from '@/components/medical/ophthalmology-table';
import { SchirmerChart } from '@/components/medical/schirmer-chart';
import { OphthalmologySketchpad } from '@/components/medical/ophthalmology-sketchpad';
import { type Finding } from '@/types/ophthalmology';

export default function VisitForm() {
    const navigate = useNavigate();
    const { id } = useParams(); // Patient ID
    const [species, setSpecies] = useState<string>('canino'); // Default to canino

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        reason: '',
        anamnesis: '',
        diagnosis: '',
        treatment_plan: '',
        pressure_od: '',
        pressure_os: '',
        cost: '',
        billing_status: 'none' // 'none' | 'pending' | 'billed'
    });

    const [findingsOD, setFindingsOD] = useState<Finding[]>([]);
    const [findingsOI, setFindingsOI] = useState<Finding[]>([]);
    const [ophthalmologyExam, setOphthalmologyExam] = useState<OphthalmologyExamData>({});

    const handleSketchChange = (sectionId: string, imageBase64: string) => {
        setOphthalmologyExam(prev => ({
            ...prev,
            [`sketch_${sectionId}`]: { od: imageBase64, oi: '' } // Storing image in 'od' field for simplicity, as sketches cover both eyes in one image
        }));
    };

    // Fetch patient data to get species
    useEffect(() => {
        const fetchPatient = async () => {
            if (!id) return;
            const { data, error } = await supabase
                .from('patients')
                .select('species')
                .eq('id', id)
                .single();

            if (data && !error) {
                setSpecies(data.species || 'canino');
            }
        };
        fetchPatient();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Create Visit
            const { data: visit, error: visitError } = await supabase
                .from('visits')
                .insert([{
                    patient_id: id,
                    date: formData.date,
                    reason: formData.reason,
                    anamnesis: formData.anamnesis,
                    diagnosis: formData.diagnosis,
                    treatment_plan: formData.treatment_plan,
                    pressure_od: formData.pressure_od ? parseFloat(formData.pressure_od) : null,
                    pressure_os: formData.pressure_os ? parseFloat(formData.pressure_os) : null,
                    cost: formData.cost ? parseFloat(formData.cost) : 0,
                    ophthalmology_exam: ophthalmologyExam, // Add new JSONB logic
                    billing_status: formData.billing_status
                }])
                .select()
                .single();

            if (visitError) throw visitError;
            const visitId = visit.id;

            // 2. Create Findings
            const allFindings = [
                ...findingsOD.map(f => ({ ...f, eye: 'OD' })),
                ...findingsOI.map(f => ({ ...f, eye: 'OI' }))
            ];

            const dbFindings = allFindings.map(f => ({
                visit_id: visitId,
                eye: f.eye,
                zone: f.zone,
                condition: f.condition,
                description: f.description,
                color_code: f.color
            }));

            if (dbFindings.length > 0) {
                const { error: findingsError } = await supabase
                    .from('findings')
                    .insert(dbFindings);
                if (findingsError) throw findingsError;
            }

            navigate(`/patients/${id}`);

        } catch (error) {
            console.error("Error creating visit:", error);
            alert("Error al guardar la visita");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 pb-20 max-w-5xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link to={`/patients/${id}`}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Paciente
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold text-foreground">Nueva Consulta Oftalmológica</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-card text-card-foreground p-6 rounded-lg border border-border shadow-sm space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-gray-200">Fecha</label>
                            <input
                                type="date"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-foreground"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-gray-200">Motivo de Consulta</label>
                            <input
                                type="text"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-foreground placeholder:text-muted-foreground"
                                placeholder="Ej: Ojo rojo, Control..."
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-gray-200">Anamnesis</label>
                            <textarea
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-foreground"
                                value={formData.anamnesis}
                                onChange={(e) => setFormData({ ...formData, anamnesis: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-gray-200">Costo de la Consulta ($)</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 font-mono text-foreground placeholder:text-muted-foreground"
                                placeholder="0.00"
                                value={formData.cost || ''}
                                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                            />
                            {/* Billing Switch - Custom Component */}
                            <BillingSwitch
                                value={formData.billing_status === 'pending'}
                                onChange={(checked) => setFormData({ ...formData, billing_status: checked ? 'pending' : 'none' })}
                                label="¿Requiere Factura?"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-gray-200">PIO Ojo Derecho (mmHg)</label>
                            <input
                                type="number"
                                step="1"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-foreground placeholder:text-muted-foreground"
                                placeholder="Ej: 15"
                                value={formData.pressure_od || ''}
                                onChange={(e) => setFormData({ ...formData, pressure_od: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-gray-200">PIO Ojo Izquierdo (mmHg)</label>
                            <input
                                type="number"
                                step="1"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-foreground placeholder:text-muted-foreground"
                                placeholder="Ej: 15"
                                value={formData.pressure_os || ''}
                                onChange={(e) => setFormData({ ...formData, pressure_os: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Ophthalmogram Section */}
                <div className="bg-card text-card-foreground p-6 rounded-lg border border-border shadow-sm">
                    <h3 className="text-lg font-bold mb-6 text-foreground">Examen Oftalmológico</h3>
                    <div className="grid xl:grid-cols-2 gap-12">
                        <Ophthalmogram eye="OD" onChange={setFindingsOD} />
                        <Ophthalmogram eye="OI" onChange={setFindingsOI} />
                    </div>
                </div>

                {/* Detailed Ophthalmology Exam Table */}
                <div className="bg-card text-card-foreground p-6 rounded-lg border border-border shadow-sm">
                    <h3 className="text-lg font-bold mb-6 text-foreground">Examen Oftalmológico Detallado</h3>

                    {/* Visual Charts / Data */}
                    <div className="mb-8">
                        <h4 className="text-sm font-medium mb-2 text-slate-500">Curva de Schirmer (Evolución)</h4>
                        {/* We pass the current input value to the chart for real-time visualization */}
                        <SchirmerChart
                            patientId={id!}
                            currentVisitData={ophthalmologyExam["Test de Schirmer"]}
                        />
                    </div>

                    <OphthalmologyTable
                        data={ophthalmologyExam}
                        onChange={setOphthalmologyExam}
                    />

                    <div className="mt-8 border-t pt-8">
                        <h3 className="text-lg font-bold mb-4 text-foreground">Esquemas Gráficos</h3>
                        <p className="text-sm text-muted-foreground mb-4">Dibuje sobre los esquemas y guarde cada sección.</p>
                        <OphthalmologySketchpad onChange={handleSketchChange} species={species} />
                    </div>
                </div>

                <div className="bg-card text-card-foreground p-6 rounded-lg border border-border shadow-sm space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-gray-200">Diagnóstico</label>
                        <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-foreground"
                            value={formData.diagnosis}
                            onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-gray-200">Plan Terapéutico (Receta)</label>
                        <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-foreground"
                            value={formData.treatment_plan}
                            onChange={(e) => setFormData({ ...formData, treatment_plan: e.target.value })}
                        />
                    </div>
                </div>



                <div className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border flex justify-end gap-4 md:static md:bg-transparent md:border-0 md:p-0 z-10">
                    <Button type="submit" size="lg" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg md:w-auto">
                        <Save className="mr-2 h-4 w-4" />
                        {loading ? 'Guardando...' : 'Finalizar Consulta'}
                    </Button>
                </div>
            </form >
        </div >
    );
}
