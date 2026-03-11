import { useState, useEffect, useMemo } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { supabase } from "@/lib/supabase";

interface Patient {
    id: string;
    name?: string;
    full_name?: string;
    owners?: {
        first_name?: string;
        last_name?: string;
    } | null;
}

interface PatientSelectProps {
    value?: string;
    onSelect: (patientId: string) => void;
    className?: string; // Allow overriding className
}

export function PatientSelect({ value, onSelect, className }: PatientSelectProps) {
    const [open, setOpen] = useState(false);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);

    // Initial Fetch (Memoized)
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

    const selectedPatient = useMemo(() => {
        return patients.find((p) => String(p.id) === String(value));
    }, [value, patients]);

    const handleSelect = (id: string) => {
        console.log("PatientSelect: Handle Select Triggered for", id);
        onSelect(id);
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen} modal={true}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "w-full justify-between bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground",
                        className
                    )}
                >
                    {selectedPatient
                        ? (selectedPatient.name || selectedPatient.full_name || "Sin Nombre")
                        : "Seleccionar paciente..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent
                className="w-[300px] p-0 z-[99999] bg-popover border border-border text-popover-foreground"
                align="start"
                onMouseDown={(e) => e.preventDefault()}
            >
                <Command className="bg-popover text-popover-foreground">
                    <CommandInput
                        placeholder="Buscar paciente..."
                        className="bg-transparent text-foreground placeholder:text-muted-foreground"
                    />

                    <CommandList className="max-h-[300px] pointer-events-auto">
                        <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                            {loading ? "Cargando..." : "No se encontró paciente."}
                        </CommandEmpty>

                        <CommandGroup className="pointer-events-auto">
                            {patients.map((patient) => {
                                const patientName = patient.name || patient.full_name || "SIN NOMBRE";
                                const ownerName = patient.owners
                                    ? `${patient.owners.first_name} ${patient.owners.last_name}`
                                    : "";
                                const uniqueValue = `${patientName} ${ownerName} ${patient.id}`;

                                return (
                                    <CommandItem
                                        key={patient.id}
                                        value={uniqueValue}
                                        className="cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
                                        onSelect={() => handleSelect(String(patient.id))}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            handleSelect(String(patient.id));
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === String(patient.id) ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        <div className="flex flex-col">
                                            <span className="font-bold">{patientName}</span>
                                            {ownerName && (
                                                <span className="text-xs text-muted-foreground">Tutor: {ownerName}</span>
                                            )}
                                        </div>
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
