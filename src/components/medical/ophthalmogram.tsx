import React, { useState } from 'react';
import { type EyeZone, type Finding, EYE_ZONES, COMMON_CONDITIONS } from '@/types/ophthalmology';
import { X, AlertCircle } from 'lucide-react';

interface OphthalmogramProps {
    eye: 'OD' | 'OI';
    onChange?: (findings: Finding[]) => void; // Made optional
    initialFindings?: Finding[];
    readOnly?: boolean;
}

export const Ophthalmogram: React.FC<OphthalmogramProps> = ({
    eye,
    onChange,
    initialFindings = [],
    readOnly = false,
}) => {
    const [findings, setFindings] = useState<Finding[]>(initialFindings);
    const [selectedZone, setSelectedZone] = useState<EyeZone | null>(null);

    // Helper to update findings
    const addFinding = (zone: EyeZone, condition: string, color: string) => {
        const newFinding: Finding = {
            id: Math.random().toString(36).substr(2, 9),
            zone,
            status: 'abnormal',
            condition,
            description: '',
            color,
        };
        const updated = [...findings, newFinding];
        setFindings(updated);
        onChange?.(updated); // Optional call
        setSelectedZone(null);
    };

    const removeFinding = (id: string) => {
        const updated = findings.filter((f) => f.id !== id);
        setFindings(updated);
        onChange?.(updated); // Optional call
    };

    const getZoneColor = (zone: EyeZone) => {
        const zoneFindings = findings.filter((f) => f.zone === zone);
        if (zoneFindings.length > 0) return zoneFindings[zoneFindings.length - 1].color; // Last color applied
        return '#e5e7eb'; // Gray-200 default
    };

    // SVG Paths for the eye (Schematic)
    // These are simplified paths. In a real app, I'd trace a real anatomical diagram.
    const paths: Record<EyeZone, React.ReactNode> = {
        sclera: (
            <path
                d="M100,20 C55.8,20 20,55.8 20,100 C20,144.2 55.8,180 100,180 C144.2,180 180,144.2 180,100 C180,55.8 144.2,20 100,20 Z"
                fill={getZoneColor('sclera')}
                className="stroke-slate-700 dark:stroke-white"
                strokeWidth="2"
            />
        ),
        eyelid: (
            <path
                d="M10,100 Q10,10 100,10 Q190,10 190,100 M10,100 Q10,190 100,190 Q190,190 190,100"
                fill="none"
                stroke={getZoneColor('eyelid') !== '#e5e7eb' ? getZoneColor('eyelid') : '#9ca3af'}
                strokeWidth="5"
            />
        ),
        third_eyelid: (
            <path
                d="M25,140 Q60,110 80,140"
                fill="none"
                stroke={getZoneColor('third_eyelid') !== '#e5e7eb' ? getZoneColor('third_eyelid') : '#9ca3af'}
                strokeWidth="6"
                strokeLinecap="round"
            />
        ),
        cornea: (
            <circle
                cx="100"
                cy="100"
                r="50"
                fill={getZoneColor('cornea')}
                className="stroke-slate-700 dark:stroke-white"
                strokeWidth="1"
                fillOpacity="0.8"
            />
        ),
        lens: (
            <circle
                cx="100"
                cy="100"
                r="30"
                fill={getZoneColor('lens')}
                className="stroke-slate-700 dark:stroke-white"
                strokeWidth="1"
                fillOpacity="0.9"
            />
        ),
        retina: (
            <circle
                cx="100"
                cy="100"
                r="15"
                fill={getZoneColor('retina')}
                fillOpacity="1" // Fundus view is "inside"
            />
        ),
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg text-foreground">
                    Ojo {eye === 'OD' ? 'Derecho (OD)' : 'Izquierdo (OI)'}
                </h3>
                <span className="text-xs text-muted-foreground">Click en una zona para diagnosticar</span>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Interactive SVG */}
                <div className="relative group">
                    <svg viewBox="0 0 200 200" className="w-64 h-64 drop-shadow-lg cursor-crosshair">
                        {/* Layer Order Matters */}
                        <g onClick={() => !readOnly && setSelectedZone('sclera')}>{paths.sclera}</g>
                        <g onClick={() => !readOnly && setSelectedZone('cornea')}>{paths.cornea}</g>
                        <g onClick={() => !readOnly && setSelectedZone('lens')}>{paths.lens}</g>
                        <g onClick={() => !readOnly && setSelectedZone('retina')}>{paths.retina}</g>
                        <g onClick={() => !readOnly && setSelectedZone('third_eyelid')}>{paths.third_eyelid}</g>
                        <g onClick={() => !readOnly && setSelectedZone('eyelid')}>{paths.eyelid}</g>
                    </svg>
                    {/* Labels Overlay */}
                    {/* Can add absolute positioned labels here if needed */}
                </div>

                {/* Findings List & Controls */}
                <div className="flex-1 w-full space-y-4">
                    {selectedZone && (
                        <div className="p-4 bg-muted/20 border border-border rounded-lg animate-in fade-in slide-in-from-left-4">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-medium text-foreground">
                                    {EYE_ZONES.find((z) => z.id === selectedZone)?.label}
                                </h4>
                                <button
                                    onClick={() => setSelectedZone(null)}
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mb-3">
                                <button
                                    onClick={() => addFinding(selectedZone, 'Inflamación', '#ef4444')} // Red
                                    className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                                >
                                    Inflamación
                                </button>
                                <button
                                    onClick={() => addFinding(selectedZone, 'Úlcera', '#3b82f6')} // Blue
                                    className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                >
                                    Úlcera / Fluoresceína
                                </button>
                                <button
                                    onClick={() => addFinding(selectedZone, 'Catarata', '#fefce8')} // White/Yellowish
                                    className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                                >
                                    Catarata
                                </button>
                                <button
                                    onClick={() => addFinding(selectedZone, 'Normal', '#22c55e')} // Green
                                    className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                                >
                                    Normal
                                </button>
                            </div>

                            <div className="space-y-1">
                                <p className="text-xs font-medium text-muted-foreground">Condiciones Comunes:</p>
                                <div className="flex flex-wrap gap-1">
                                    {COMMON_CONDITIONS[selectedZone].map((condition) => (
                                        <button
                                            key={condition}
                                            onClick={() => addFinding(selectedZone, condition, '#ef4444')} // Default to alert color
                                            className="px-2 py-1 text-[10px] bg-background border border-border rounded hover:bg-muted text-foreground"
                                        >
                                            {condition}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* List of current findings */}
                    <div className="space-y-2">
                        {findings.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground bg-muted/50 rounded-lg border border-dashed border-muted-foreground/30">
                                <AlertCircle className="w-6 h-6 mx-auto mb-1 opacity-50" />
                                <p className="text-sm">Sin hallazgos registrados</p>
                            </div>
                        )}
                        {findings.map((finding) => (
                            <div
                                key={finding.id}
                                className="flex items-center justify-between p-2 bg-card border border-border rounded-md shadow-sm"
                            >
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: finding.color }}
                                    />
                                    <div>
                                        <span className="text-sm font-medium text-foreground">
                                            {EYE_ZONES.find((z) => z.id === finding.zone)?.label}
                                        </span>
                                        <p className="text-xs text-muted-foreground">{finding.condition}</p>
                                    </div>
                                </div>
                                {!readOnly && (
                                    <button
                                        onClick={() => removeFinding(finding.id)}
                                        className="text-muted-foreground hover:text-red-500"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
