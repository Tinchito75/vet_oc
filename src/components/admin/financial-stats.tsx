import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format, subDays, isSameDay, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { es } from 'date-fns/locale';



export function FinancialStats() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        todayIncome: 0,
        monthIncome: 0,
        monthPatients: 0
    });
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        const today = new Date();
        const startMonth = startOfMonth(today);
        const endMonth = endOfMonth(today);
        const last7DaysStart = subDays(today, 6); // Last 7 days including today

        // Fetch data. 
        // For larger datasets, use RPC. For MVP, fetch recent visits is fine.
        // We'll fetch visits from the beginning of the month OR the beginning of last 7 days (whichever is earlier) to now.
        // Actually, let's just fetch all visits for this month and last 7 days.

        // Simpler: Fetch all visits >= min(startMonth, last7DaysStart)
        const minDate = startMonth < last7DaysStart ? startMonth : last7DaysStart;

        const { data: visits, error } = await supabase
            .from('visits')
            .select('date, cost')
            .gte('date', minDate.toISOString());

        if (error) {
            console.error('Error fetching financial stats:', error);
            setLoading(false);
            return;
        }

        if (visits) {
            let todayInc = 0;
            let monthInc = 0;
            let monthPats = 0;

            // Stats Calculation
            visits.forEach(v => {
                const d = new Date(v.date);
                const cost = Number(v.cost || 0);

                if (isSameDay(d, today)) {
                    todayInc += cost;
                }

                if (isWithinInterval(d, { start: startMonth, end: endMonth })) {
                    monthInc += cost;
                    monthPats++;
                }
            });

            setStats({
                todayIncome: todayInc,
                monthIncome: monthInc,
                monthPatients: monthPats
            });

            // Chart Data Calculation (Last 7 Days)
            const days = [];
            for (let i = 6; i >= 0; i--) {
                const d = subDays(today, i);
                days.push(d);
            }

            const chart = days.map(day => {
                const dayIncome = visits
                    .filter(v => isSameDay(new Date(v.date), day))
                    .reduce((sum, v) => sum + Number(v.cost || 0), 0);

                return {
                    name: format(day, 'dd/MM', { locale: es }),
                    ingresos: dayIncome
                };
            });

            setChartData(chart);
        }
        setLoading(false);
    };

    if (loading) return <div className="p-8 text-center text-slate-400">Cargando estadísticas...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Dashboard Financiero</h2>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ingresos Hoy</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">${stats.todayIncome.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ingresos este Mes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${stats.monthIncome.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pacientes (Mes)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.monthPatients}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Ingresos Últimos 7 Días</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip
                                    formatter={(value: any) => [`$${value}`, 'Ingresos']}
                                    cursor={{ fill: '#f1f5f9' }}
                                />
                                <Bar dataKey="ingresos" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
