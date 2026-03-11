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
        <div className={cn("flex flex-col gap-2 w-full", className)}>
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
                    "group relative flex w-full items-center rounded-full p-1 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-12 shadow-inner",
                    value ? "bg-green-500" : "bg-red-500"
                )}
            >
                {/* Background Text Labels for clarity */}
                <span className={cn(
                    "absolute left-14 text-sm font-bold uppercase text-white/90 transition-opacity duration-300 select-none",
                    value ? "opacity-0" : "opacity-100"
                )}>
                    No Facturar
                </span>
                <span className={cn(
                    "absolute right-14 text-sm font-bold uppercase text-white/90 transition-opacity duration-300 select-none",
                    value ? "opacity-100" : "opacity-0"
                )}>
                    Facturar
                </span>

                {/* Moving Pill */}
                <div
                    className={cn(
                        "absolute top-1 bottom-1 aspect-square rounded-full bg-white shadow-xl flex items-center justify-center transition-all duration-300 ease-out",
                        value ? "left-[calc(100%-2.75rem)]" : "left-1"
                    )}
                >
                    {value ? (
                        <Check className="h-6 w-6 text-green-600" strokeWidth={3} />
                    ) : (
                        <X className="h-6 w-6 text-red-600" strokeWidth={3} />
                    )}
                </div>
            </button>
        </div>
    );
}
