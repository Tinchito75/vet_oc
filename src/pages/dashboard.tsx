import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, Clock, ArrowRight, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import { es } from 'date-fns/locale';

interface DashboardStats {
    totalPatients: number;
    appointmentsToday: number;
    appointmentsTomorrow: number;
}

interface NextAppointment {
    id: string;
    start_time: string;
    reason: string;
    patient_id: string;
    patients: {
        name: string;
        owners: {
            first_name: string;
            last_name: string;
        }
    };
}

export default function Dashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalPatients: 0,
        appointmentsToday: 0,
        appointmentsTomorrow: 0
    });
    const [nextAppointment, setNextAppointment] = useState<NextAppointment | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                const today = new Date();
                const tomorrow = addDays(today, 1);

                // Helper to get day range
                const getDayRange = (date: Date) => {
                    const start = new Date(date);
                    start.setHours(0, 0, 0, 0);
                    const end = new Date(date);
                    end.setHours(23, 59, 59, 999);
                    return { start: start.toISOString(), end: end.toISOString() };
                };

                const rangeToday = getDayRange(today);
                const rangeTomorrow = getDayRange(tomorrow);

                // Parallel fetching
                const [
                    patientsCount,
                    todayCount,
                    tomorrowCount,
                    nextApt
                ] = await Promise.all([
                    // 1. Total Patients
                    supabase.from('patients').select('*', { count: 'exact', head: true }),

                    // 2. Appointments Today
                    supabase.from('appointments')
                        .select('*', { count: 'exact', head: true })
                        .gte('start_time', rangeToday.start)
                        .lte('start_time', rangeToday.end),

                    // 3. Appointments Tomorrow
                    supabase.from('appointments')
                        .select('*', { count: 'exact', head: true })
                        .gte('start_time', rangeTomorrow.start)
                        .lte('start_time', rangeTomorrow.end),

                    // 4. Next Patient (only 1)
                    supabase.from('appointments')
                        .select(`
                            id, start_time, reason, patient_id,
                            patients (
                                name,
                                owners (first_name, last_name)
                            )
                        `)
                        .gt('start_time', new Date().toISOString())
                        .order('start_time', { ascending: true })
                        .limit(1)
                        .single()
                ]);

                if (nextApt.error && nextApt.error.code !== 'PGRST116') {
                    // Ignore "no rows found" error (PGRST116)
                    console.error("Error fetching next appointment", nextApt.error);
                }

                setStats({
                    totalPatients: patientsCount.count || 0,
                    appointmentsToday: todayCount.count || 0,
                    appointmentsTomorrow: tomorrowCount.count || 0
                });

                if (nextApt.data) {
                    setNextAppointment(nextApt.data as any);
                }

            } catch (error) {
                console.error("Error loading dashboard:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchDashboardData();
    }, []);

    const containerClass = "bg-card text-card-foreground border border-border shadow-lg rounded-xl overflow-hidden";

    return (
        <div className="container mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Bienvenido al Panel</h1>
                <p className="text-muted-foreground mt-1">Resumen operativo del día.</p>
            </div>

            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className={containerClass}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Pacientes
                        </CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {loading ? "..." : stats.totalPatients}
                        </div>
                        <p className="text-xs text-muted-foreground">Registros activos</p>
                    </CardContent>
                </Card>

                <Card className={containerClass}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Turnos Hoy
                        </CardTitle>
                        <Activity className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {loading ? "..." : stats.appointmentsToday}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {format(new Date(), "d 'de' MMMM", { locale: es })}
                        </p>
                    </CardContent>
                </Card>

                <Card className={containerClass}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Turnos Mañana
                        </CardTitle>
                        <Calendar className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {loading ? "..." : stats.appointmentsTomorrow}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Próximamente
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Section: Main Access & Next Patient */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Next Appointment Card (Wider 2/3) */}
                <div className={`lg:col-span-2 ${containerClass} p-6 flex flex-col justify-between relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Clock className="w-5 h-5 text-primary" />
                            <h3 className="font-semibold text-lg text-foreground">Siguiente Turno Programado</h3>
                        </div>

                        {loading ? (
                            <div className="py-8 text-muted-foreground">Cargando información...</div>
                        ) : nextAppointment ? (
                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 z-10 relative">
                                <div>
                                    <div className="text-2xl font-bold text-foreground mb-1">
                                        {format(new Date(nextAppointment.start_time), 'HH:mm')} hs
                                        <span className="text-lg font-normal text-muted-foreground ml-2">
                                            - {format(new Date(nextAppointment.start_time), "EEEE d", { locale: es })}
                                        </span>
                                    </div>
                                    <div className="text-lg text-primary font-medium">
                                        {nextAppointment.patients.name}
                                    </div>
                                    <div className="text-muted-foreground flex items-center gap-2 text-sm mt-1">
                                        <span>Propietario: {nextAppointment.patients.owners.first_name} {nextAppointment.patients.owners.last_name}</span>
                                        <span className="w-1 h-1 bg-border rounded-full" />
                                        <span>{nextAppointment.reason || "Consulta General"}</span>
                                    </div>
                                </div>

                                <Button asChild size="lg" className="shrink-0 bg-primary/90 hover:bg-primary text-primary-foreground border-none">
                                    <Link to={`/patients/${nextAppointment.patient_id}`}>
                                        Ver Ficha <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="py-8 text-muted-foreground">
                                No hay turnos futuros programados.
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions / Shortcuts (1/3) */}
                <div className={`${containerClass} p-6 flex flex-col justify-center gap-4`}>
                    <h3 className="font-semibold text-foreground mb-2">Accesos Rápidos</h3>
                    <Button variant="outline" className="w-full justify-start border-border hover:bg-muted/50" asChild>
                        <Link to="/schedule">
                            <Calendar className="mr-2 h-4 w-4" /> Ver Agenda Completa
                        </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start border-border hover:bg-muted/50" asChild>
                        <Link to="/owners">
                            <Users className="mr-2 h-4 w-4" /> Buscar Clientes
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
