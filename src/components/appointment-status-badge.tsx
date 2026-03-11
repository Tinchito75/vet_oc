
import { useState } from "react";
import { ChevronDown, Check, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface AppointmentStatusBadgeProps {
    status: string;
    onUpdate: (newStatus: string) => Promise<void>;
}

export function AppointmentStatusBadge({ status, onUpdate }: AppointmentStatusBadgeProps) {
    const [loading, setLoading] = useState(false);

    const handleStatusChange = async (newStatus: string) => {
        if (newStatus === status) return;
        setLoading(true);
        await onUpdate(newStatus);
        setLoading(false);
    };

    const styles = {
        confirmed: "bg-green-500/15 text-green-600 dark:text-green-400 border-green-200 dark:border-green-900",
        pending: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900",
        cancelled: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900",
        default: "bg-slate-100 text-slate-600 border-slate-200"
    };

    const labels: Record<string, string> = {
        confirmed: "Confirmado",
        pending: "Pendiente",
        cancelled: "Cancelado"
    };

    const currentStyle = styles[status as keyof typeof styles] || styles.default;
    const label = labels[status] || status;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                        "h-7 rounded-full px-3 text-xs font-medium border shadow-sm hover:bg-opacity-80 transition-all",
                        currentStyle,
                        loading && "opacity-50 cursor-wait"
                    )}
                    disabled={loading}
                >
                    {label}
                    <ChevronDown className="ml-1 h-3 w-3 opacity-70" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleStatusChange("confirmed")} className="text-green-600 focus:text-green-700">
                    <Check className="mr-2 h-4 w-4" /> Confirmar Asistencia
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("pending")} className="text-amber-600 focus:text-amber-700">
                    <Clock className="mr-2 h-4 w-4" /> Marcar como Pendiente
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("cancelled")} className="text-red-600 focus:text-red-700">
                    <X className="mr-2 h-4 w-4" /> Cancelar Turno
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
