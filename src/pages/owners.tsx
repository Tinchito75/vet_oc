import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';
import { Plus, Search, User, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface Owner {
    id: string;
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    dni?: string;
    cuit?: string;
    referred_by?: string;
}

export default function OwnersPage() {
    const [owners, setOwners] = useState<Owner[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchOwners();
    }, []);

    async function fetchOwners() {
        setLoading(true);
        const { data, error } = await supabase
            .from('owners')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching owners:', error);
        } else {
            // Safe cast if needed or just trust supabase headers
            setOwners((data as Owner[]) || []);
        }
        setLoading(false);
    }

    const filteredOwners = owners.filter((owner) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            `${owner.first_name} ${owner.last_name}`.toLowerCase().includes(searchLower) ||
            (owner.dni && owner.dni.toLowerCase().includes(searchLower))
        );
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Pacientes y Tutores</h2>
                    <p className="text-muted-foreground">
                        Gestiona la base de datos de clientes y sus mascotas.
                    </p>
                </div>
                <Button asChild>
                    <Link to="/owners/new">
                        <Plus className="mr-2 h-4 w-4" /> Nuevo Tutor
                    </Link>
                </Button>
            </div>

            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o DNI..."
                        className="flex h-10 w-full rounded-md border border-slate-300 bg-white dark:bg-zinc-900/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-9 dark:border-zinc-700 dark:text-slate-100"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="text-muted-foreground">Nombre / DNI</TableHead>
                            <TableHead className="text-muted-foreground">Teléfono</TableHead>
                            <TableHead className="text-muted-foreground">Email</TableHead>
                            <TableHead className="text-muted-foreground">Derivado por</TableHead>
                            <TableHead className="text-right text-muted-foreground">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    Cargando...
                                </TableCell>
                            </TableRow>
                        ) : filteredOwners.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    No se encontraron tutores.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredOwners.map((owner) => (
                                <TableRow key={owner.id} className="bg-card hover:bg-muted/50 transition-colors border-border">
                                    <TableCell className="font-medium text-foreground">
                                        <div className='flex items-center gap-2'>
                                            <div className='w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400'>
                                                <User size={14} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span>{owner.first_name} {owner.last_name}</span>
                                                {owner.dni && <span className="text-xs text-muted-foreground">DNI: {owner.dni}</span>}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{owner.phone || '-'}</TableCell>
                                    <TableCell className="text-muted-foreground">{owner.email || '-'}</TableCell>
                                    <TableCell className="text-muted-foreground">{owner.referred_by || '-'}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="default"
                                                size="icon"
                                                asChild
                                            >
                                                <Link to={`/owners/${owner.id}`}>
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => { if (confirm('¿Eliminar tutor?')) console.log('Delete', owner.id) }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
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

