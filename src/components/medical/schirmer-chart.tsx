import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SchirmerChartProps {
    patientId: string;
    currentVisitData?: { od: string; oi: string }; // Optional current data to plot in real-time
    highlightVisitId?: string; // ID of the visit to highlight
}

interface ChartData {
    date: string;
    od: number;
    oi: number;
    isHighlight?: boolean;
}

export function SchirmerChart({ patientId, currentVisitData, highlightVisitId }: SchirmerChartProps) {
    const [data, setData] = useState<ChartData[]>([]);

    useEffect(() => {
        if (patientId) {
            fetchHistory();
        }
    }, [patientId]);

    const fetchHistory = async () => {
        const { data: visits, error } = await supabase
            .from('visits')
            .select('id, created_at, ophthalmology_exam')
            .eq('patient_id', patientId)
            .order('created_at', { ascending: true }); // Chronological order

        if (!error && visits) {
            const history = visits
                .filter(v => v.ophthalmology_exam && v.ophthalmology_exam["Test de Schirmer"])
                .map(v => ({
                    date: new Date(v.created_at).toLocaleDateString(),
                    od: parseFloat(v.ophthalmology_exam["Test de Schirmer"].od) || 0,
                    oi: parseFloat(v.ophthalmology_exam["Test de Schirmer"].oi) || 0,
                    isHighlight: v.id === highlightVisitId,
                    timestamp: new Date(v.created_at).getTime() // For sorting if needed, though SQL sorted it
                }));

            setData(history);
        }
    };

    // Merge current data if provided (for real-time feedback in forms, not details view)
    // Only add "Actual" if we are NOT highlighting an existing visit (meaning we are likely creating a new one)
    const chartData = [...data];
    if (currentVisitData && (currentVisitData.od || currentVisitData.oi) && !highlightVisitId) {
        chartData.push({
            date: 'Actual',
            od: parseFloat(currentVisitData.od) || 0,
            oi: parseFloat(currentVisitData.oi) || 0,
            isHighlight: true
        });
    }

    if (chartData.length === 0) return null;

    // Custom Dot to highlight specific point
    const CustomDot = (props: any) => {
        const { cx, cy, payload, stroke } = props;
        if (payload.isHighlight) {
            return (
                <svg x={cx - 6} y={cy - 6} width={12} height={12} fill="white" viewBox="0 0 12 12">
                    <circle cx="6" cy="6" r="5" stroke={stroke} strokeWidth="3" fill="white" />
                </svg>
            );
        }
        return (
            <circle cx={cx} cy={cy} r={4} stroke={stroke} strokeWidth={2} fill="white" />
        );
    };

    return (
        <div className="w-full h-[300px] mt-4 p-4 border rounded-lg bg-white dark:bg-card">
            <h4 className="text-sm font-bold mb-4 text-center">Histórico: Test de Schirmer (mm/min)</h4>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" fontSize={12} tickMargin={10} />
                    <YAxis domain={[0, 35]} fontSize={12} label={{ value: 'mm/min', angle: -90, position: 'insideLeft' }} />
                    <Tooltip contentStyle={{ borderRadius: '8px' }} />
                    <Legend />
                    <Line type="monotone" dataKey="od" name="OD (Derecho)" stroke="#ef4444" strokeWidth={2} dot={<CustomDot />} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="oi" name="OI (Izquierdo)" stroke="#3b82f6" strokeWidth={2} dot={<CustomDot />} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
