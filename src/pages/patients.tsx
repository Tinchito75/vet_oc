import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';
import { Search, PawPrint, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface Patient {
    id: string;
    name: string;
    species: string;
    breed: string;
    gender: string;
    weight: number;
    birth_date: string;
    is_aggressive: boolean;
    owners: {
        first_name: string;
        last_name: string;
    } | null;
}

export default function PatientsPage() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        async function fetchPatients() {
            setLoading(true);
            const { data, error } = await supabase
                .from('patients')
                .select('id, name, species, breed, gender, weight, birth_date, is_aggressive, owners(first_name, last_name)')
                .order('name', { ascending: true });

            if (error) console.error(error);
            if (data) setPatients(data as any[]);
            setLoading(false);
        }
        fetchPatients();
    }, []);

    const calculateAge = (birthDate: string) => {
        if (!birthDate) return '—';
        const birth = new Date(birthDate);
        const now = new Date();
        let years = now.getFullYear() - birth.getFullYear();
        let months = now.getMonth() - birth.getMonth();
        if (months < 0 || (months === 0 && now.getDate() < birth.getDate())) {
            years--;
            months += 12;
        }
        if (years > 0) return `${years} año${years !== 1 ? 's' : ''}`;
        return `${months} ${months !== 1 ? 'meses' : 'mes'}`;
    };

    const filtered = patients.filter(p => {
        const q = search.toLowerCase();
        const owner = p.owners ? `${p.owners.first_name} ${p.owners.last_name}` : '';
        return (
            p.name.toLowerCase().includes(q) ||
            (p.species || '').toLowerCase().includes(q) ||
            (p.breed || '').toLowerCase().includes(q) ||
            owner.toLowerCase().includes(q)
        );
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                        Pacientes 🐾
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {loading ? 'Cargando...' : `${patients.length} mascota${patients.length !== 1 ? 's' : ''} registrada${patients.length !== 1 ? 's' : ''}`}
                    </p>
                </div>
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                    <Link to="/patients/new">
                        <Plus className="mr-2 h-4 w-4" /> Nueva Mascota
                    </Link>
                </Button>
            </div>

            {/* Search */}
            <div className="flex items-center gap-2 border border-input rounded-md bg-background px-3 max-w-sm focus-within:ring-2 focus-within:ring-ring">
                <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                <input
                    type="text"
                    placeholder="Buscar por nombre, especie, raza o tutor..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="h-10 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
            </div>

            {/* Table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Especie / Raza</TableHead>
                            <TableHead>Sexo</TableHead>
                            <TableHead>Edad</TableHead>
                            <TableHead>Peso</TableHead>
                            <TableHead>Tutor</TableHead>
                            <TableHead className="text-right">Acción</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                                    Cargando mascotas...
                                </TableCell>
                            </TableRow>
                        ) : filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                                    <PawPrint className="mx-auto h-8 w-8 mb-2 opacity-30" />
                                    No se encontraron mascotas.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map(patient => (
                                <TableRow key={patient.id} className="hover:bg-muted/40 transition-colors">
                                    <TableCell className="font-semibold">
                                        <div className="flex items-center gap-2">
                                            {patient.name}
                                            {patient.is_aggressive && (
                                                <span className="text-xs bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded font-bold">
                                                    ⚠ MUERDE
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-medium">{patient.species}</span>
                                        {patient.breed && <span className="text-muted-foreground"> · {patient.breed}</span>}
                                    </TableCell>
                                    <TableCell>{patient.gender || '—'}</TableCell>
                                    <TableCell>{calculateAge(patient.birth_date)}</TableCell>
                                    <TableCell>{patient.weight ? `${patient.weight} kg` : '—'}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {patient.owners
                                            ? `${patient.owners.first_name} ${patient.owners.last_name}`
                                            : '—'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link
                                            to={`/patients/${patient.id}`}
                                            className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                                        >
                                            Ver Ficha →
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
