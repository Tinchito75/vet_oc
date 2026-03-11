import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Assuming this exists or falling back to standard
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Save } from 'lucide-react';

interface Template {
    id: string;
    title: string;
    prescription_body: string;
}

interface PrescriptionBuilderProps {
    visitId?: string;
    initialPrescription?: string;
    onSave?: (prescription: string) => void;
}

export function PrescriptionBuilder({ visitId, initialPrescription = "", onSave }: PrescriptionBuilderProps) {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [prescription, setPrescription] = useState(initialPrescription);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTemplates();
    }, []);

    useEffect(() => {
        setPrescription(initialPrescription);
    }, [initialPrescription]);

    async function fetchTemplates() {
        const { data } = await supabase
            .from('medical_templates')
            .select('*')
            .order('title');
        if (data) {
            setTemplates(data as any[]);
        }
    }

    const handleTemplateSelect = (templateId: string) => {
        const template = templates.find(t => t.id === templateId);
        if (template) {
            // Append or replace? Usually replacing or appending is better. Let's append with new lines if text exists.
            const newText = prescription
                ? `${prescription}\n\n--- ${template.title} ---\n${template.prescription_body}`
                : template.prescription_body;
            setPrescription(newText);
        }
    };

    const handleSave = async () => {
        if (!visitId && !onSave) return;
        setLoading(true);

        try {
            if (visitId) {
                const { error } = await supabase
                    .from('visits')
                    .update({ treatment_plan: prescription })
                    .eq('id', visitId);

                if (error) throw error;
                alert("Receta guardada en la historia clínica.");
            }

            if (onSave) {
                onSave(prescription);
            }
        } catch (error: any) {
            console.error(error);
            alert("Error al guardar: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4 border p-4 rounded-lg bg-slate-50">
            <h3 className="font-semibold text-slate-900">Constructor de Recetas (Vademecum)</h3>

            <div className="space-y-2">
                <Label>Plantillas Rápidas</Label>
                <Select onValueChange={handleTemplateSelect}>
                    <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Seleccionar tratamiento frecuente..." />
                    </SelectTrigger>
                    <SelectContent>
                        {templates.map((t) => (
                            <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Cuerpo de la Receta</Label>
                <Textarea
                    className="min-h-[150px] bg-white"
                    placeholder="Escriba la receta aquí..."
                    value={prescription}
                    onChange={(e) => setPrescription(e.target.value)}
                />
            </div>

            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={loading}>
                    <Save className="mr-2 h-4 w-4" />
                    {loading ? "Guardando..." : "Guardar en Historia Clínica"}
                </Button>
            </div>
        </div>
    );
}
