import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { PatientSelect } from './patient-select';
import { supabase } from '@/lib/supabase';
import { Plus } from 'lucide-react';
import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod"; // Uncomment if you have zod installed, using manual validation for now to be safe
// import * as z from "zod";

const SERVICE_TYPES = [
    'Revisión',
    'Primera Visita',
    'Control',
    'Urgencia',
    'Cirugía',
    'Estudio'
];

interface AppointmentFormData {
    patient_id: string;
    date: string;
    time: string;
    type: string;
}

export function AppointmentDialog({ onAppointmentCreated }: { onAppointmentCreated: () => void }) {
    const [open, setOpen] = useState(false);

    // React Hook Form setup
    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<AppointmentFormData>({
        defaultValues: {
            patient_id: "", // Initialized as empty string as requested
            date: "",
            time: "",
            type: "Consulta General"
        }
    });

    const onSubmit = async (data: AppointmentFormData) => {
        try {
            console.log("Submitting form data:", data);

            // Combine date and time to ISO
            const start_time = new Date(`${data.date}T${data.time}:00`).toISOString();
            // Assuming 30 min duration for simplicity
            const endDate = new Date(`${data.date}T${data.time}:00`);
            endDate.setMinutes(endDate.getMinutes() + 30);
            const end_time = endDate.toISOString();

            const { error } = await supabase
                .from('appointments')
                .insert([{
                    patient_id: data.patient_id,
                    start_time,
                    end_time,
                    status: 'pending',
                    reason: data.type,
                }]);

            if (error) throw error;

            setOpen(false);
            reset(); // Reset form correctly
            onAppointmentCreated();

        } catch (error: any) {
            console.error("Error creating appointment:", error);
            alert("Error al agendar turno: " + error.message);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white border-none">
                    <Plus className="mr-2 h-4 w-4" /> Nuevo Turno
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Agendar Nuevo Turno</DialogTitle>
                    <DialogDescription>
                        Seleccione un paciente y defina el horario de la consulta.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">

                    {/* Patient Field Controlled */}
                    <div className="grid gap-2">
                        <Label htmlFor="patient" className="text-left">
                            Paciente
                        </Label>
                        <Controller
                            name="patient_id"
                            control={control}
                            rules={{ required: "Seleccione un paciente" }}
                            render={({ field }) => (
                                <PatientSelect
                                    value={field.value}
                                    onSelect={(val) => {
                                        console.log("Formulario: onSelect recibido:", val);
                                        field.onChange(val);
                                    }}
                                />
                            )}
                        />
                        {errors.patient_id && <span className="text-red-500 text-xs">{errors.patient_id.message}</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="date">Fecha</Label>
                            <Input
                                id="date"
                                type="date"
                                {...register("date", { required: "Fecha requerida" })}
                            />
                            {errors.date && <span className="text-red-500 text-xs">{errors.date.message}</span>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="time">Hora</Label>
                            <Input
                                id="time"
                                type="time"
                                {...register("time", { required: "Hora requerida" })}
                            />
                            {errors.time && <span className="text-red-500 text-xs">{errors.time.message}</span>}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="type">Tipo de Consulta</Label>
                        <Controller
                            name="type"
                            control={control}
                            render={({ field }: { field: any }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SERVICE_TYPES.map((t) => (
                                            <SelectItem key={t} value={t}>{t}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white font-bold w-full md:w-auto">
                            {isSubmitting ? "Guardando..." : "Agendar Turno"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
