import * as React from "react";
import { Check, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

interface Owner {
    id: string;
    first_name: string;
    last_name: string;
    dni?: string;
}

interface TutorSelectProps {
    value?: string;
    onSelect: (ownerId: string) => void;
    className?: string;
}

export function TutorSelect({ value, onSelect, className }: TutorSelectProps) {
    const [query, setQuery] = React.useState("");
    const [owners, setOwners] = React.useState<Owner[]>([]);
    const [allOwners, setAllOwners] = React.useState<Owner[]>([]);
    const [loading, setLoading] = React.useState(true);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Fetch all owners once
    React.useEffect(() => {
        let mounted = true;
        supabase
            .from('owners')
            .select('id, first_name, last_name, dni')
            .order('first_name')
            .then(({ data, error }) => {
                if (!mounted) return;
                if (error) console.error(error);
                if (data) setAllOwners(data as Owner[]);
                setLoading(false);
            });
        return () => { mounted = false; };
    }, []);

    // Filter on query change
    React.useEffect(() => {
        if (query.trim().length === 0) {
            setOwners([]);
            return;
        }
        const q = query.toLowerCase();
        setOwners(
            allOwners.filter(o => {
                const fullName = `${o.first_name || ""} ${o.last_name || ""}`.toLowerCase();
                const dni = (o.dni || "").toLowerCase();
                return fullName.includes(q) || dni.includes(q);
            })
        );
    }, [query, allOwners]);

    const selectedOwner = allOwners.find(o => String(o.id) === String(value));

    const handleSelect = (owner: Owner) => {
        onSelect(String(owner.id));
        setQuery("");
        setOwners([]);
        inputRef.current?.blur();
    };

    return (
        <div className={cn("relative w-full", className)}>
            {selectedOwner && query.length === 0 ? (
                <div
                    className="flex items-center justify-between px-3 py-2 border border-blue-200 dark:border-blue-900 rounded-md bg-blue-50/50 dark:bg-blue-900/20 cursor-pointer hover:bg-blue-100/50 transition-colors"
                    onClick={() => {
                        setQuery(`${selectedOwner.first_name} ${selectedOwner.last_name}`);
                        setTimeout(() => inputRef.current?.focus(), 50);
                    }}
                >
                    <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500 shrink-0" />
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-foreground">
                                {selectedOwner.first_name} {selectedOwner.last_name}
                            </span>
                            {selectedOwner.dni && (
                                <span className="text-xs text-muted-foreground">DNI: {selectedOwner.dni}</span>
                            )}
                        </div>
                    </div>
                    <span className="text-xs text-blue-600 dark:text-blue-400 underline">Cambiar</span>
                </div>
            ) : (
                <>
                    <div className="flex items-center border border-input rounded-md bg-background px-3 gap-2 focus-within:ring-2 focus-within:ring-ring">
                        <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder={loading ? "Cargando tutores..." : "Buscar tutor por nombre o DNI..."}
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            className="h-10 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                        />
                        {query.length > 0 && (
                            <button
                                type="button"
                                className="text-muted-foreground hover:text-foreground text-xs shrink-0"
                                onMouseDown={e => { e.preventDefault(); setQuery(""); setOwners([]); }}
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    {query.length > 0 && (
                        <div className="absolute top-full left-0 mt-1 w-full bg-background border border-border rounded-md shadow-xl z-[9999] overflow-hidden max-h-[260px] overflow-y-auto">
                            {owners.length > 0 ? (
                                <ul>
                                    {owners.map(owner => {
                                        const isSelected = String(owner.id) === String(value);
                                        return (
                                            <li
                                                key={owner.id}
                                                className="px-4 py-3 hover:bg-accent cursor-pointer flex items-center justify-between border-b border-border last:border-0 transition-colors"
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    handleSelect(owner);
                                                }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                                        <User size={14} />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className={cn("text-sm font-semibold", isSelected && "text-blue-500")}>
                                                            {owner.first_name} {owner.last_name}
                                                        </span>
                                                        {owner.dni && (
                                                            <span className="text-xs text-muted-foreground">DNI: {owner.dni}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                {isSelected && <Check className="h-4 w-4 text-green-500 shrink-0" />}
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                                    No se encontró ningún tutor.
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
