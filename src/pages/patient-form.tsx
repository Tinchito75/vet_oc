import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, User } from 'lucide-react';

import { TutorSelect } from '@/components/tutor-select';

export default function PatientForm() {
    const navigate = useNavigate();
    const { id, ownerId } = useParams(); // id is patient id
    const isEditing = Boolean(id && !ownerId);
    const isStandaloneCreate = !id && !ownerId;

    // If creating new, ownerId comes from URL. If editing, we fetch it.
    const [targetOwnerId, setTargetOwnerId] = useState<string | null>(ownerId || null);

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        species: 'canino',
        breed: '',
        birth_date: '',
        weight: '',
        gender: 'Macho',
        is_neutered: false,
        is_aggressive: false,
        medical_history: '',
    });

    useEffect(() => {
        if (id && !ownerId) { // Editing existing patient
            loadPatient(id);
        }
    }, [id, ownerId]);

    async function loadPatient(patientId: string) {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('patients')
            .select('*')
            .eq('id', patientId)
            .single();

        if (!error && data) {
            setTargetOwnerId(data.owner_id);
            setFormData({
                name: data.name || '',
                species: data.species || 'canino',
                breed: data.breed || '',
                birth_date: data.birth_date || '',
                weight: data.weight?.toString() || '',
                gender: data.gender || 'Macho',
                is_neutered: data.is_neutered || false,
                is_aggressive: data.is_aggressive || false,
                medical_history: data.medical_history || '',
            });
        }
        setIsLoading(false);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const finalOwnerId = targetOwnerId || ownerId;
        
        if (!finalOwnerId) {
            alert("Error: Por favor seleccione un tutor para la mascota.");
            return;
        }
        setIsLoading(true);

        const payload = {
            ...formData,
            weight: formData.weight ? parseFloat(formData.weight) : null,
            owner_id: finalOwnerId,
        };

        try {
            if (isEditing) {
                const { error } = await supabase
                    .from('patients')
                    .update(payload)
                    .eq('id', id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('patients')
                    .insert([payload]);
                if (error) throw error;
            }
            // Go back to owner details
            navigate(`/owners/${finalOwnerId}`);
        } catch (error) {
            console.error('Error saving patient:', error);
            alert('Error al guardar. Por favor revise los datos.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link to={targetOwnerId ? `/owners/${targetOwnerId}` : '/patients'}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Volver
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">
                    {isEditing ? 'Editar Mascota' : 'Nueva Mascota'}
                </h1>
            </div>

            <div className="bg-card border border-border shadow-md rounded-xl p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {isStandaloneCreate && (
                        <div className="space-y-2 pb-4 border-b border-border mb-4">
                            <label className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                                <User className="h-4 w-4" /> Seleccionar Tutor (Obligatorio) *
                            </label>
                            <TutorSelect 
                                value={targetOwnerId || ""} 
                                onSelect={(oid) => setTargetOwnerId(oid)} 
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-foreground">Nombre *</label>
                        <input
                            id="name"
                            name="name"
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="species" className="text-sm font-medium text-foreground">Especie *</label>
                            <select
                                id="species"
                                name="species"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                value={formData.species}
                                onChange={handleChange}
                            >
                                <option value="canino">Canino</option>
                                <option value="felino">Felino</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="breed" className="text-sm font-medium text-foreground">Raza</label>
                            <input
                                id="breed"
                                name="breed"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                value={formData.breed}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="gender" className="text-sm font-medium text-foreground">Sexo</label>
                            <select
                                id="gender"
                                name="gender"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                value={formData.gender}
                                onChange={handleChange}
                            >
                                <option value="Macho">Macho</option>
                                <option value="Hembra">Hembra</option>
                            </select>
                        </div>
                        <div className="flex flex-col space-y-3 pt-8">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="is_neutered"
                                    name="is_neutered"
                                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    checked={formData.is_neutered}
                                    onChange={handleChange}
                                />
                                <label htmlFor="is_neutered" className="text-sm font-medium leading-none">
                                    Castrado / Esterilizado
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="is_aggressive"
                                    name="is_aggressive"
                                    className="h-4 w-4 rounded border-red-300 text-red-600 focus:ring-red-500"
                                    checked={formData.is_aggressive}
                                    onChange={handleChange}
                                />
                                <label htmlFor="is_aggressive" className="text-sm font-bold leading-none text-red-600">
                                    ⚠️ ¿Es Agresivo?
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="birth_date" className="text-sm font-medium text-foreground">Fecha Nacimiento</label>
                            <input
                                id="birth_date"
                                name="birth_date"
                                type="date"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                value={formData.birth_date}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="weight" className="text-sm font-medium text-foreground">Peso (kg)</label>
                            <input
                                id="weight"
                                name="weight"
                                type="number"
                                step="0.1"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                value={formData.weight}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="medical_history" className="text-sm font-medium text-foreground">Antecedentes Médicos</label>
                        <textarea
                            id="medical_history"
                            name="medical_history"
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            value={formData.medical_history}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                            <Save className="mr-2 h-4 w-4" />
                            {isLoading ? 'Guardando...' : 'Guardar Mascota'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
