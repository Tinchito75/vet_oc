import { useState } from 'react';
import { Ophthalmogram } from '@/components/medical/ophthalmogram';
import { type Finding } from '@/types/ophthalmology';

export default function OphthalmogramDemo() {
    const [findingsOD, setFindingsOD] = useState<Finding[]>([]);
    const [findingsOI, setFindingsOI] = useState<Finding[]>([]);

    return (
        <div className="container mx-auto p-8 space-y-8">
            <h1 className="text-3xl font-bold text-foreground border-b border-border pb-4">
                Demo Oftalmograma Veterinario
            </h1>

            <div className="grid lg:grid-cols-2 gap-12">
                <div className="bg-card text-card-foreground border border-border p-6 rounded-xl shadow-lg">
                    <Ophthalmogram
                        eye="OD"
                        onChange={setFindingsOD}
                        initialFindings={findingsOD}
                    />
                </div>

                <div className="bg-card text-card-foreground border border-border p-6 rounded-xl shadow-lg">
                    <Ophthalmogram
                        eye="OI"
                        onChange={setFindingsOI}
                        initialFindings={findingsOI}
                    />
                </div>
            </div>

            <div className="p-4 bg-muted/50 border border-border rounded-lg font-mono text-xs overflow-auto max-h-64 shadow-lg text-muted-foreground">
                <h3 className="font-bold mb-2 text-foreground">Estado Actual (JSON):</h3>
                <pre>{JSON.stringify({ OD: findingsOD, OI: findingsOI }, null, 2)}</pre>
            </div>
        </div>
    );
}
