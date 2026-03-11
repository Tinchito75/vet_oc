import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Eye } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface PendingVisit {
    id: string;
    date: string;
    reason: string;
    cost: number | null;
    patient: {
        name: string;
        owner: {
            first_name: string;
            last_name: string;
            dni?: string;     // Added as per request (mocked/assumed)
            cuit?: string;    // Added as per request (mocked/assumed)
            address?: string; // Optional
        } | null;
    } | null;
}

export default function BillingDashboard() {
    const [pendingVisits, setPendingVisits] = useState<PendingVisit[]>([]);
    const [selectedConsultation, setSelectedConsultation] = useState<PendingVisit | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchPendingVisits();
    }, []);

    const fetchPendingVisits = async () => {
        // Note: Assuming 'dni' and 'cuit' exist in owners table as requested by user.
        // If they don't exist, this query will fail with 400.
        // I will try to fetch them. If migration hasn't run, this might break.
        // However, user explicitly said "Asume que el objeto client... tiene las propiedades".
        const { data, error } = await supabase
            .from('visits')
            .select(`
                id,
                date,
                reason,
                cost,
                patient:patients (
                    name,
                    owner:owners (
                        first_name,
                        last_name,
                        dni,
                        cuit,
                        address
                    )
                )
            `)
            .eq('billing_status', 'pending')
            .order('date', { ascending: false });

        if (error) {
            console.error("Error fetching pending visits:", error);
            // Fallback for dev if columns missing:
            if (error.code === '42703') { // Undefined column
                console.warn("Columns dni/cuit might be missing. Attempting fetch without them.");
                const { data: fallbackData } = await supabase
                    .from('visits')
                    .select(`
                        id,
                        date,
                        reason,
                        cost,
                        patient:patients (
                            name,
                            owner:owners (
                                first_name,
                                last_name
                            )
                        )
                    `)
                    .eq('billing_status', 'pending')
                    .order('date', { ascending: false });
                if (fallbackData) setPendingVisits(fallbackData as unknown as PendingVisit[]);
            }
        } else {
            setPendingVisits(data as unknown as PendingVisit[]);
        }
    };

    const markAsBilled = async (id: string) => {
        const { error } = await supabase
            .from('visits')
            .update({ billing_status: 'billed' })
            .eq('id', id);

        if (error) {
            console.error("Error updating billing status:", error);
            alert("Hubo un error al actualizar el estado.");
        } else {
            setPendingVisits(prev => prev.filter(visit => visit.id !== id));
            if (selectedConsultation?.id === id) {
                setIsModalOpen(false);
                setSelectedConsultation(null);
            }
        }
    };

    const openDetailModal = (visit: PendingVisit) => {
        setSelectedConsultation(visit);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Pendientes de Facturación</h1>
                    <p className="text-slate-500 text-sm">Gestiona los cobros y facturas pendientes de emisión.</p>
                </div>
                <Badge variant="outline" className="px-3 py-1 text-sm">
                    {pendingVisits.length} Pendientes
                </Badge>
            </div>

            {pendingVisits.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/50">
                    <div className="bg-green-100 p-4 rounded-full mb-4">
                        <Check className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-800">¡Todo al día!</h3>
                    <p className="text-slate-500">No hay facturas pendientes de emisión.</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-zinc-900 rounded-lg shadow border border-slate-200 dark:border-zinc-700 overflow-hidden">
                    <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                        <thead className="bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-slate-200">
                            <tr>
                                <th className="px-4 py-3 font-medium">Fecha</th>
                                <th className="px-4 py-3 font-medium">Propietario / Paciente</th>
                                <th className="px-4 py-3 font-medium">Motivo</th>
                                <th className="px-4 py-3 font-medium text-right">Monto</th>
                                <th className="px-4 py-3 font-medium text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-zinc-700">
                            {pendingVisits.map((visit) => (
                                <tr key={visit.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        {format(new Date(visit.date), 'dd/MM/yyyy', { locale: es })}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-slate-900 dark:text-slate-100">
                                            {visit.patient?.owner ? `${visit.patient.owner.first_name} ${visit.patient.owner.last_name}` : 'Sin Propietario'}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            Pac: {visit.patient?.name || 'Desconocido'}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 max-w-xs truncate" title={visit.reason}>
                                        {visit.reason}
                                    </td>
                                    <td className="px-4 py-3 text-right font-mono font-medium text-slate-900 dark:text-slate-100">
                                        {visit.cost ? `$${visit.cost.toFixed(2)}` : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                onClick={() => openDetailModal(visit)}
                                                variant="ghost"
                                                size="sm"
                                                className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2"
                                                title="Ver Detalle"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                onClick={() => markAsBilled(visit.id)}
                                                size="sm"
                                                className="bg-green-600 hover:bg-green-700 text-white shadow-sm"
                                            >
                                                <Check className="mr-1.5 h-3.5 w-3.5" />
                                                Facturado
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal Detail */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-lg bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800">
                    {selectedConsultation && (
                        <>
                            <DialogHeader>
                                <div className="flex items-center justify-between">
                                    <DialogTitle className="text-xl font-bold">Detalle para Facturación</DialogTitle>
                                    {/* Close button is usually handled by DialogClose or styling the X */}
                                </div>
                            </DialogHeader>

                            <div className="space-y-6 py-4">
                                {/* Section 1: Client Data */}
                                <div className="bg-slate-50 dark:bg-zinc-900/50 p-4 rounded-lg border border-slate-100 dark:border-zinc-800">
                                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Datos del Cliente</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="col-span-2">
                                            <span className="block text-slate-400 text-xs">Nombre Completo</span>
                                            <span className="font-medium text-slate-800 dark:text-slate-200">
                                                {selectedConsultation.patient?.owner ?
                                                    `${selectedConsultation.patient.owner.first_name} ${selectedConsultation.patient.owner.last_name}`
                                                    : 'Desconocido'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-slate-400 text-xs">DNI</span>
                                            <span className="font-medium text-slate-800 dark:text-slate-200">
                                                {selectedConsultation.patient?.owner?.dni || '-'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-slate-400 text-xs">CUIT/CUIL</span>
                                            <span className="font-medium text-slate-800 dark:text-slate-200">
                                                {selectedConsultation.patient?.owner?.cuit || '-'}
                                            </span>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="block text-slate-400 text-xs">Dirección</span>
                                            <span className="font-medium text-slate-800 dark:text-slate-200">
                                                {selectedConsultation.patient?.owner?.address || '-'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Consultation Summary */}
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Resumen de Consulta</h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Fecha:</span>
                                            <span className="font-medium">{format(new Date(selectedConsultation.date), 'dd/MM/yyyy')}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Paciente:</span>
                                            <span className="font-medium">{selectedConsultation.patient?.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Motivo:</span>
                                            <span className="font-medium">{selectedConsultation.reason}</span>
                                        </div>
                                        <div className="pt-3 mt-3 border-t border-slate-100 dark:border-zinc-800 flex justify-between items-center bg-blue-50 dark:bg-blue-900/10 p-3 rounded-md">
                                            <span className="text-blue-700 dark:text-blue-300 font-semibold">Monto Total</span>
                                            <span className="text-xl font-bold text-blue-700 dark:text-blue-300">
                                                {selectedConsultation.cost ? `$${selectedConsultation.cost.toFixed(2)}` : '$0.00'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="sm:justify-end">
                                <Button
                                    type="button"
                                    className="w-full sm:w-auto"
                                    onClick={() => markAsBilled(selectedConsultation.id)}
                                >
                                    <Check className="mr-2 h-4 w-4" />
                                    Marcar como Facturado
                                </Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
