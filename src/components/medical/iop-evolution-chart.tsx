import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface IopData {
    date: string; // "DD/MMM"
    fullDate: string; // for tooltip
    pressure_od: number | undefined;
    pressure_os: number | undefined;
}

interface IopEvolutionChartProps {
    patientId: string;
}

export function IopEvolutionChart({ patientId }: IopEvolutionChartProps) {
    const [data, setData] = useState<IopData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchIopData();
    }, [patientId]);

    const fetchIopData = async () => {
        setLoading(true);
        const { data: visits, error } = await supabase
            .from('visits')
            .select('date, pressure_od, pressure_os')
            .eq('patient_id', patientId)
            .order('date', { ascending: true });

        if (error) {
            console.error('Error fetching IOP data:', error);
            setLoading(false);
            return;
        }

        if (visits) {
            const chartData = visits
                .filter(v => v.pressure_od !== null || v.pressure_os !== null)
                .map(v => {
                    const d = new Date(v.date);
                    // Explicit conversions and null checks
                    const od = v.pressure_od !== null && v.pressure_od !== undefined ? Number(v.pressure_od) : undefined;
                    const os = v.pressure_os !== null && v.pressure_os !== undefined ? Number(v.pressure_os) : undefined;

                    return {
                        date: `${d.getDate()}/${d.toLocaleDateString('es-ES', { month: 'short' })}`,
                        fullDate: d.toLocaleDateString(),
                        pressure_od: od,
                        pressure_os: os,
                    };
                });
            setData(chartData);
        }
        setLoading(false);
    };

    if (loading) return <div className="h-64 flex items-center justify-center text-slate-400">Cargando gráfico...</div>;

    // Debug log just before render
    console.log('Datos para el gráfico:', data);

    if (data.length === 0) {
        return (
            <Card className="mb-6">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Evolución Presión Intraocular (PIO)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-32 flex items-center justify-center text-slate-400 text-sm italic border-2 border-dashed rounded-lg bg-slate-50">
                        No hay registros de presión aún
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="mb-6">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Evolución Presión Intraocular (PIO)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis
                                dataKey="date"
                                stroke="#64748b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#64748b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                domain={['auto', 'auto']}
                                label={{ value: 'mmHg', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#94a3b8' }}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                labelStyle={{ color: '#64748b', marginBottom: '4px' }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Line
                                type="monotone"
                                dataKey="pressure_od"
                                name="Ojo Derecho (OD)"
                                stroke="#ef4444"
                                strokeWidth={2}
                                dot={{ r: 4, strokeWidth: 2 }}
                                activeDot={{ r: 6 }}
                                connectNulls
                            />
                            <Line
                                type="monotone"
                                dataKey="pressure_os"
                                name="Ojo Izquierdo (OI)"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={{ r: 4, strokeWidth: 2 }}
                                activeDot={{ r: 6 }}
                                connectNulls
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
