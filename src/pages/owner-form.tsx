import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import PatientList from '@/components/patient-list';

export default function OwnerForm() {
    const navigate = useNavigate();
    const { id } = useParams(); // If present, we are editing
    const isEditing = Boolean(id);

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        dni: '',
        cuit: '',
        phone: '',
        email: '',
        address: '',
        referred_by: '',
        notes: '',
    });

    useEffect(() => {
        if (isEditing && id) {
            loadOwner(id);
        }
    }, [id, isEditing]);

    async function loadOwner(ownerId: string) {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('owners')
            .select('*')
            .eq('id', ownerId)
            .single();

        if (!error && data) {
            setFormData({
                first_name: data.first_name || '',
                last_name: data.last_name || '',
                dni: data.dni || '',
                cuit: data.cuit || '',
                phone: data.phone || '',
                email: data.email || '',
                address: data.address || '',
                referred_by: data.referred_by || '',
                notes: data.notes || '',
            });
        }
        setIsLoading(false);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        console.log("Submitting Tutor Data:", formData);

        try {
            if (isEditing) {
                const { error } = await supabase
                    .from('owners')
                    .update(formData)
                    .eq('id', id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('owners')
                    .insert([formData]);
                if (error) throw error;
            }
            navigate('/owners');
        } catch (error: any) {
            console.error('FULL ERROR DETAILS:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            });

            if (error.code === '42501' || error.message?.includes('policy')) {
                alert('RLS ERROR: Permission denied. Check your Supabase Row Level Security policies.');
            } else {
                alert(`Error al guardar: ${error.message || 'Unknown error'}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link to="/owners">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Volver
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">
                    {isEditing ? 'Editar Tutor' : 'Nuevo Tutor'}
                </h1>
            </div>

            <div className="bg-card border border-border shadow-md rounded-xl p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="dna" className="text-sm font-medium text-foreground">DNI</label>
                            <input
                                id="dni"
                                name="dni"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                value={formData.dni}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="cuit" className="text-sm font-medium text-foreground">CUIT (Opcional)</label>
                            <input
                                id="cuit"
                                name="cuit"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                value={formData.cuit}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="first_name" className="text-sm font-medium text-foreground">Nombre *</label>
                            <input
                                id="first_name"
                                name="first_name"
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                value={formData.first_name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="last_name" className="text-sm font-medium text-foreground">Apellido *</label>
                            <input
                                id="last_name"
                                name="last_name"
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                value={formData.last_name}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="phone" className="text-sm font-medium text-foreground">Teléfono</label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                placeholder="+54 9 ..."
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="address" className="text-sm font-medium text-foreground">Dirección</label>
                        <input
                            id="address"
                            name="address"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="referred_by" className="text-sm font-medium text-foreground">Veterinario Derivante / Colega</label>
                        <input
                            id="referred_by"
                            name="referred_by"
                            placeholder="Ej: Dr. Juan Pérez"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            value={formData.referred_by}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="notes" className="text-sm font-medium text-foreground">Notas Adicionales</label>
                        <textarea
                            id="notes"
                            name="notes"
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            value={formData.notes}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md">
                            <Save className="mr-2 h-4 w-4" />
                            {isLoading ? 'Guardando...' : 'Guardar Tutor'}
                        </Button>
                    </div>
                </form>
            </div>

            {isEditing && id && (
                <div className="bg-card border border-border shadow-md rounded-xl p-6">
                    <PatientList ownerId={id} />
                </div>
            )}
        </div>
    );
}

