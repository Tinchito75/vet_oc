import { useState, useEffect, useRef } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

interface Patient {
    id: string;
    name?: string;
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
    const [open, setOpen] = useState(false);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        let mounted = true;
        async function fetchPatients() {
            setLoading(true);
            const { data, error } = await supabase
                .from('patients')
                .select('id, name, owners(first_name, last_name)')
                .order('name');
            if (!mounted) return;
            if (error) console.error(error);
            if (data) setPatients(data as any[]);
            setLoading(false);
        }
        fetchPatients();
        return () => { mounted = false; };
    }, []);

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedPatient = patients.find(p => String(p.id) === String(value));

    const filtered = patients.filter(p => {
        const name = p.name || "";
        const owner = p.owners ? `${p.owners.first_name} ${p.owners.last_name}` : "";
        const q = search.toLowerCase();
        return name.toLowerCase().includes(q) || owner.toLowerCase().includes(q);
    });

    const handleSelect = (id: string) => {
        onSelect(id);
        setSearch("");
        setOpen(false);
    };

    return (
        <div ref={containerRef} className={cn("relative w-full", className)}>
            {/* Trigger Button */}
            <Button
                type="button"
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground"
                onClick={() => {
                    setOpen(prev => !prev);
                    setTimeout(() => inputRef.current?.focus(), 50);
                }}
            >
                {selectedPatient
                    ? selectedPatient.name || "Sin Nombre"
                    : "Seleccionar paciente..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>

            {/* Dropdown */}
            {open && (
                <div
                    className="absolute left-0 top-full mt-1 w-full rounded-md border border-border bg-background shadow-lg z-[9999]"
                    style={{ pointerEvents: 'auto' }}
                >
                    {/* Search Input */}
                    <div className="flex items-center border-b border-border px-3 py-2">
                        <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Buscar paciente..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                        />
                    </div>

                    {/* Results List */}
                    <ul className="max-h-[240px] overflow-y-auto py-1">
                        {loading ? (
                            <li className="px-3 py-2 text-sm text-muted-foreground">Cargando...</li>
                        ) : filtered.length === 0 ? (
                            <li className="px-3 py-2 text-sm text-muted-foreground">No se encontró paciente.</li>
                        ) : (
                            filtered.map(patient => {
                                const patientName = patient.name || "SIN NOMBRE";
                                const ownerName = patient.owners
                                    ? `${patient.owners.first_name} ${patient.owners.last_name}`
                                    : "";
                                const isSelected = String(patient.id) === String(value);

                                return (
                                    <li
                                        key={patient.id}
                                        className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-sm mx-1"
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            handleSelect(String(patient.id));
                                        }}
                                    >
                                        <Check className={cn("h-4 w-4 shrink-0", isSelected ? "opacity-100" : "opacity-0")} />
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm">{patientName}</span>
                                            {ownerName && (
                                                <span className="text-xs text-muted-foreground">Tutor: {ownerName}</span>
                                            )}
                                        </div>
                                    </li>
                                );
                            })
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
