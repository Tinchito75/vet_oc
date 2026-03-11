import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Dog, Cat } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Patient {
    id: string;
    name: string;
    species: string;
    breed: string;
    gender: string;
    age: string; // Calculated or just generic
    is_aggressive: boolean;
}

interface PatientListProps {
    ownerId: string;
}

export default function PatientList({ ownerId }: PatientListProps) {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPatients();
    }, [ownerId]);

    async function fetchPatients() {
        setLoading(true);
        const { data, error } = await supabase
            .from('patients')
            .select('*')
            .eq('owner_id', ownerId);

        if (error) {
            console.error('Error fetching patients:', error);
        } else {
            setPatients((data as any[]) || []); // Casting simplification
        }
        setLoading(false);
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Mascotas</h3>
                <Button size="sm" variant="outline" asChild>
                    <Link to={`/owners/${ownerId}/patients/new`}>
                        <Plus className="mr-2 h-4 w-4" /> Agregar Mascota
                    </Link>
                </Button>
            </div>

            {loading ? (
                <div className="text-sm text-muted-foreground">Cargando mascotas...</div>
            ) : patients.length === 0 ? (
                <div className="p-4 border rounded-md bg-slate-50 text-center text-sm text-muted-foreground dark:bg-zinc-800/50 dark:text-gray-400">
                    No hay mascotas registradas para este dueño.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {patients.map((patient) => (
                        <Link
                            key={patient.id}
                            to={`/patients/${patient.id}`}
                            className={`block p-4 border shadow-sm rounded-lg transition-all bg-card group relative ${patient.is_aggressive ? 'border-red-300 dark:border-red-900/50 hover:border-red-500' : 'border-border hover:border-blue-500'}`}
                        >
                            {patient.is_aggressive && (
                                <div className="absolute top-2 right-2">
                                    <Badge variant="destructive" className="animate-pulse">⚠️ Agresivo</Badge>
                                </div>
                            )}
                            <div className="flex items-start gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${patient.is_aggressive ? 'bg-red-100 text-red-600' : 'bg-blue-900/50 text-blue-200 group-hover:bg-blue-800'}`}>
                                    {patient.species.toLowerCase() === 'gato' ? <Cat size={20} /> : <Dog size={20} />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors flex items-center gap-2">
                                        {patient.name}
                                    </h4>
                                    <p className="text-xs text-gray-400">
                                        {patient.species} • {patient.breed} • {patient.gender}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
