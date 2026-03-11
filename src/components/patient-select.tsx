import * as React from "react";
import { Check, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

interface Patient {
    id: string;
    name: string;
    owners?: {
        first_name?: string;
        last_name?: string;
    } | null;
}

interface PatientSelectProps {
    value?: string;
    onSelect: (patientId: string) => void;
    className?: string;
}

export function PatientSelect({ value, onSelect, className }: PatientSelectProps) {
    const [query, setQuery] = React.useState("");
    const [patients, setPatients] = React.useState<Patient[]>([]);
    const [allPatients, setAllPatients] = React.useState<Patient[]>([]);
    const [loading, setLoading] = React.useState(true);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Fetch all patients once
    React.useEffect(() => {
        let mounted = true;
        supabase
            .from('patients')
            .select('id, name, owners(first_name, last_name)')
            .order('name')
            .then(({ data, error }) => {
                if (!mounted) return;
                if (error) console.error(error);
                if (data) setAllPatients(data as any[]);
                setLoading(false);
            });
        return () => { mounted = false; };
    }, []);

    // Filter on query change
    React.useEffect(() => {
        if (query.trim().length === 0) {
            setPatients([]);
            return;
        }
        const q = query.toLowerCase();
        setPatients(
            allPatients.filter(p => {
                const name = (p.name || "").toLowerCase();
                const owner = p.owners
                    ? `${p.owners.first_name || ""} ${p.owners.last_name || ""}`.toLowerCase()
                    : "";
                return name.includes(q) || owner.includes(q);
            })
        );
    }, [query, allPatients]);

    const selectedPatient = allPatients.find(p => String(p.id) === String(value));

    const handleSelect = (patient: Patient) => {
        onSelect(String(patient.id));
        setQuery("");
        setPatients([]);
        inputRef.current?.blur();
    };

    return (
        <div className={cn("relative w-full", className)}>
            {/* Show selected patient chip if selected and no query active */}
            {selectedPatient && query.length === 0 ? (
                <div
                    className="flex items-center justify-between px-3 py-2 border border-input rounded-md bg-background cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => {
                        setQuery(selectedPatient.name || "");
                        setTimeout(() => inputRef.current?.focus(), 50);
                    }}
                >
                    <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500 shrink-0" />
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-foreground">{selectedPatient.name}</span>
                            {selectedPatient.owners && (
                                <span className="text-xs text-muted-foreground">
                                    Tutor: {selectedPatient.owners.first_name} {selectedPatient.owners.last_name}
                                </span>
                            )}
                        </div>
                    </div>
                    <span className="text-xs text-muted-foreground underline">Cambiar</span>
                </div>
            ) : (
                <>
                    {/* Search Input */}
                    <div className="flex items-center border border-input rounded-md bg-background px-3 gap-2 focus-within:ring-2 focus-within:ring-ring">
                        <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder={loading ? "Cargando pacientes..." : "Buscar paciente por nombre o tutor..."}
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            className="h-10 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                        />
                        {query.length > 0 && (
                            <button
                                type="button"
                                className="text-muted-foreground hover:text-foreground text-xs shrink-0"
                                onMouseDown={e => { e.preventDefault(); setQuery(""); setPatients([]); }}
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    {/* Dropdown results */}
                    {query.length > 0 && (
                        <div className="absolute top-full left-0 mt-1 w-full bg-background border border-border rounded-md shadow-xl z-[9999] overflow-hidden max-h-[260px] overflow-y-auto">
                            {patients.length > 0 ? (
                                <ul>
                                    {patients.map(patient => {
                                        const ownerName = patient.owners
                                            ? `${patient.owners.first_name || ""} ${patient.owners.last_name || ""}`.trim()
                                            : "";
                                        const isSelected = String(patient.id) === String(value);
                                        return (
                                            <li
                                                key={patient.id}
                                                className="px-4 py-3 hover:bg-accent cursor-pointer flex items-center justify-between border-b border-border last:border-0 transition-colors"
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    handleSelect(patient);
                                                }}
                                            >
                                                <div className="flex flex-col">
                                                    <span className={cn("text-sm font-semibold", isSelected && "text-green-500")}>
                                                        {patient.name}
                                                    </span>
                                                    {ownerName && (
                                                        <span className="text-xs text-muted-foreground">Tutor: {ownerName}</span>
                                                    )}
                                                </div>
                                                {isSelected && <Check className="h-4 w-4 text-green-500 shrink-0" />}
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                                    No se encontró ningún paciente.
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
