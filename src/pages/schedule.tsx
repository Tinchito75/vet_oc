import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { User, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppointmentDialog } from '@/components/appointment-dialog';
import { WhatsAppButton } from '@/components/ui/whatsapp-button';
import { AppointmentStatusBadge } from '@/components/appointment-status-badge';
import { ArrowRight } from 'lucide-react';

interface Appointment {
    id: string;
    start_time: string;
    status: string;
    patient_id: string;
    patients: { name: string; owners: { first_name: string; last_name: string; phone: string } };
}

export default function SchedulePage() {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedDate) {
            fetchAppointments(selectedDate);
        }
    }, [selectedDate]);

    async function fetchAppointments(date: Date) {
        setLoading(true);
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const { data } = await supabase
            .from('appointments')
            .select('*, patients(name, owners(first_name, last_name, phone))')
            .gte('start_time', startOfDay.toISOString())
            .lte('start_time', endOfDay.toISOString())
            .order('start_time', { ascending: true });

        if (data) {
            // Safe cast
            setAppointments(data as any[]);
        }
        setLoading(false);
    }

    return (
        <div className="flex flex-col md:flex-row gap-8 h-[calc(100vh-8rem)]">
            <div className="w-full md:w-auto flex flex-col gap-4">
                <div className="bg-card text-card-foreground p-4 rounded-lg border border-border shadow-lg inline-block">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Seleccionar Fecha</label>
                        <input
                            type="date"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                            value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
                            onChange={(e) => {
                                const date = e.target.value ? new Date(e.target.value + 'T12:00:00') : new Date();
                                setSelectedDate(date);
                            }}
                        />
                    </div>
                </div>

                <div className="bg-card text-card-foreground p-4 rounded-lg border border-border hidden md:block shadow-lg">
                    <h4 className="font-semibold text-foreground mb-2">Resumen</h4>
                    <div className="text-sm text-muted-foreground">
                        <p>Turnos del día: <span className="font-bold text-foreground">{appointments.length}</span></p>
                    </div>
                </div>
            </div>

            <div className="flex-1 bg-card text-card-foreground shadow-lg p-6 rounded-lg border border-border flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-foreground">
                            {selectedDate ? format(selectedDate, "EEEE d 'de' MMMM", { locale: es }) : 'Seleccione una fecha'}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {loading ? 'Cargando turnos...' : `${appointments.length} turnos programados`}
                        </p>
                    </div>
                    <AppointmentDialog onAppointmentCreated={() => selectedDate && fetchAppointments(selectedDate)} />
                </div>

                <div className="space-y-4 overflow-auto flex-1">
                    {appointments.length === 0 && !loading && (
                        <div className="text-center py-12 text-slate-400 dark:text-slate-600">
                            No hay turnos programados para este día.
                        </div>
                    )}

                    {appointments.map(apt => (
                        <div key={apt.id} className="flex gap-4 p-4 border border-slate-200 dark:border-zinc-800 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                            <div className="flex flex-col items-center justify-center w-16 bg-slate-100 dark:bg-zinc-800 rounded text-slate-600 dark:text-slate-300">
                                <Clock size={16} className="mb-1" />
                                <span className="font-bold text-sm">
                                    {format(new Date(apt.start_time), 'HH:mm')}
                                </span>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 truncate">{apt.patients.name}</h4>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-1">
                                    <User size={14} className="shrink-0" />
                                    <span className="truncate">{apt.patients.owners.first_name} {apt.patients.owners.last_name}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 ml-auto shrink-0">
                                {apt.patients.owners.phone && (
                                    <WhatsAppButton
                                        phone={apt.patients.owners.phone}
                                        patientName={apt.patients.name}
                                        date={apt.start_time}
                                        compact
                                    />
                                )}

                                <AppointmentStatusBadge
                                    status={apt.status}
                                    onUpdate={async (newStatus) => {
                                        const { error } = await supabase
                                            .from('appointments')
                                            .update({ status: newStatus })
                                            .eq('id', apt.id);

                                        if (error) {
                                            console.error("Error updating status:", error);
                                            alert("Error al actualizar estado");
                                        } else {
                                            selectedDate && fetchAppointments(selectedDate);
                                        }
                                    }}
                                />

                                <Button variant="ghost" size="icon" asChild className="hidden sm:inline-flex">
                                    <Link to={`/patients/${apt.patient_id}`}>
                                        <ArrowRight className="h-4 w-4 text-slate-400 hover:text-blue-500" />
                                    </Link>
                                </Button>
                                {/* Mobile View Link fallback if needed, currently reusing the card click logic isn't here, keeping explicit button */}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
