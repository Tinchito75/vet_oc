import { X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BillingSwitchProps {
    value: boolean;
    onChange: (value: boolean) => void;
    label?: string;
    className?: string;
}

export function BillingSwitch({ value, onChange, label, className }: BillingSwitchProps) {
    return (
        <div className={cn("flex flex-col gap-2", className)}>
            {label && (
                <span className="text-sm font-medium text-slate-700 dark:text-gray-200">
                    {label}
                </span>
            )}
            <button
                type="button"
                onClick={() => onChange(!value)}
                className={cn(
                    "relative flex h-10 w-full items-center rounded-full px-1 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    value ? "bg-green-500" : "bg-red-500"
                )}
                role="switch"
                aria-checked={value}
            >
                <div
                    className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg transition-transform duration-300",
                        value ? "translate-x-[calc(100%_+_1.5rem)] md:translate-x-[calc(100%_+_8rem)] lg:translate-x-[calc(100%_+_12rem)]" : "translate-x-0", // Dynamic width might be tricky, let's stick to a fixed width container or calculation based on container width if possible. 
                        // Actually, for a full width button, translate-x needs to be calculated or we use flex justification. 
                        // Let's try a different approach for the "Pill" to work on full width or fixed width.
                        // The user asked for "Pill horizontal grande".
                        // Use a flex container with 'justify-start' vs 'justify-end'? No, animation needs translate.
                        // Let's use a fixed width for the switch track like a standard huge switch, or make it relative.
                        // Better: Use `left-1` and `right-1` with absolute positioning?
                    )}
                    style={{
                        transform: value ? 'translateX(calc(100% + 4px))' : 'translateX(0)',
                        // Wait, if the parent width varies, a percentage translate might be better or specific px if parent is fixed.
                        // Let's make the parent a fixed visible width or control the toggle handle position differently.
                        // The user said "Pill (cápsula) horizontal grande".
                    }}
                >
                    {/* Icon inside the circle */}
                    {value ? (
                        <Check className="h-5 w-5 text-green-600" strokeWidth={3} />
                    ) : (
                        <X className="h-5 w-5 text-red-600" strokeWidth={3} />
                    )}
                </div>

                {/* Optional: Text inside the track for extra clarity? User didn't ask, but it helps. 
                    User asked: "Fondo del Riel: Rojo... Posición del Círculo: Izquierda..."
                    Let's stick to the prompt.
                */}
            </button>
        </div>
    );
}

// Re-writing the component component to be more robust with Tailwind arbitrary values for width 
// or simply standard toggle logic but bigger.

export function BillingSwitchSimple({ value, onChange, label, className }: BillingSwitchProps) {
    return (
        <div className={cn("flex flex-col gap-1.5", className)}>
            {label && (
                <span className="text-sm font-medium text-slate-700 dark:text-gray-200">
                    {label}
                </span>
            )}
            <div
                onClick={() => onChange(!value)}
                className={cn(
                    "relative flex w-full cursor-pointer items-center rounded-full p-1 transition-colors duration-300 h-12",
                    value ? "bg-green-500" : "bg-red-500"
                )}
            >
                {/* Text Labels Background (Optional, implicit guide for user) */}
                <div className="absolute inset-0 flex items-center justify-between px-4 text-white font-bold text-xs uppercase tracking-wider select-none pointer-events-none">
                    <span className={cn("transition-opacity duration-300", value ? "opacity-0" : "opacity-100")}>No Facturar</span>
                    <span className={cn("transition-opacity duration-300", value ? "opacity-100" : "opacity-0")}>Facturar</span>
                </div>

                <div
                    className={cn(
                        "z-10 bg-white shadow-md rounded-full h-10 w-10 flex items-center justify-center transition-all duration-300 ease-in-out",
                        value ? "translate-x-[calc(100%)] ml-auto" : "translate-x-0"
                    )}
                    // Note: "ml-auto" won't animate with transition-all on transform. 
                    // We need real translation.
                    style={{
                        transform: value ? 'translateX(calc(100% - 100%))' : 'translateX(0)'
                        // Wait, calculating generic width is hard in pure CSS without a container query or fixed width.
                        // Let's go with a fixed container width or use a flex 'justify-end' trick which doesn't animate generic slide well.
                        // Preferred: Absolutes.
                    }}
                >
                    {value ? (
                        <Check className="h-6 w-6 text-green-600" strokeWidth={3} />
                    ) : (
                        <X className="h-6 w-6 text-red-600" strokeWidth={3} />
                    )}
                </div>
            </div>
        </div>
    );
}
// Let's try a standard approach that works responsively.
// We will use a container with `w-full`. The pill travels from left to right.
// If it's `w-full`, we can't easily animate `translateX` to "the end" without knowing the width.
// BUT, we can use `left-1` vs `right-1` absolute positioning. Transitioning `left` property works.

export function BillingSwitchFinal({ value, onChange, label }: BillingSwitchProps) {
    return (
        <div className="flex flex-col gap-2 w-full">
            {label && (
                <label className="text-sm font-medium text-slate-700 dark:text-gray-200">
                    {label}
                </label>
            )}
            <button
                type="button"
                role="checkbox"
                aria-checked={value}
                onClick={() => onChange(!value)}
                className={cn(
                    "group relative flex w-full items-center rounded-full p-1 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-12",
                    value ? "bg-green-500" : "bg-red-500"
                )}
            >
                {/* Background Labels */}
                <span className={cn(
                    "absolute left-4 text-xs font-bold uppercase text-white/90 transition-opacity duration-300",
                    value ? "opacity-0" : "opacity-100"
                )}>
                    No Facturar
                </span>
                <span className={cn(
                    "absolute right-4 text-xs font-bold uppercase text-white/90 transition-opacity duration-300",
                    value ? "opacity-100" : "opacity-0"
                )}>
                    Facturar
                </span>

                {/* Moving Pill */}
                <div
                    className={cn(
                        "absolute top-1 bottom-1 aspect-square rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300",
                        value ? "left-[calc(100%-2.75rem)]" : "left-1"
                        // h-12 is 3rem. padding 1 (0.25rem). circle is 2.5rem (10). 
                        // left-1 = 0.25rem. 
                        // right side = 100% - 2.5rem - 0.25rem = 100% - 2.75rem.
                    )}
                >
                    {value ? (
                        <Check className="h-5 w-5 text-green-600" />
                    ) : (
                        <X className="h-5 w-5 text-red-600" />
                    )}
                </div>
            </button>
        </div>
    );
}
