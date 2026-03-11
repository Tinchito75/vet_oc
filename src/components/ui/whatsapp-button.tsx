import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface WhatsAppButtonProps {
    phone?: string | null;
    patientName?: string;
    date?: string | Date;
    message?: string;
    compact?: boolean;
    className?: string;
}

export function WhatsAppButton({
    phone,
    patientName,
    date,
    message,
    compact = false,
    className
}: WhatsAppButtonProps) {
    if (!phone) return null;

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();

        let cleanNumber = phone.replace(/\D/g, "");
        // Default to generic greeting if no specific message
        let finalMessage = message;

        if (!finalMessage && patientName && date) {
            const dateObj = new Date(date);
            const dateStr = format(dateObj, "EEEE d 'de' MMMM", { locale: es });
            const timeStr = format(dateObj, "HH:mm");
            finalMessage = `Hola, le recordamos el turno para *${patientName}* el día *${dateStr}* a las *${timeStr}* en Oftalmología Veterinaria. Por favor confirmar. Gracias!`;
        }

        if (!finalMessage) {
            finalMessage = "Hola, le escribo desde Oftalmología Veterinaria.";
        }

        const encodedMessage = encodeURIComponent(finalMessage);
        const url = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

        window.open(url, "_blank");
    };

    const content = (
        <Button
            variant="outline"
            size={compact ? "icon" : "sm"}
            className={cn(
                "bg-green-500 hover:bg-green-600 text-white border-green-600 shadow-sm transition-colors",
                compact ? "h-6 w-6" : "h-7 px-3",
                className
            )}
            onClick={handleClick}
            title={compact ? "Enviar WhatsApp" : undefined}
        >
            <MessageCircle className={cn("h-3.5 w-3.5", compact ? "" : "mr-1.5")} />
            {!compact && "WhatsApp"}
        </Button>
    );

    if (compact) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        {content}
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Enviar recordatorio</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    return content;
}
