import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { Pencil } from "lucide-react";

// Define the schema combining Patient and Owner fields
const formSchema = z.object({
    // Patient Fields
    name: z.string().min(1, "El nombre del paciente es requerido"),
    species: z.string().min(1, "La especie es requerida"),
    breed: z.string().optional(),
    birth_date: z.string().optional(),
    gender: z.string().optional(),
    weight: z.string().optional(),
    is_neutered: z.boolean().optional(),
    is_aggressive: z.boolean().optional(),
    medical_history: z.string().optional(),

    // Owner Fields
    owner_first_name: z.string().min(1, "Nombre del tutor requerido"),
    owner_last_name: z.string().min(1, "Apellido del tutor requerido"),
    owner_phone: z.string().optional(),
    owner_email: z.string().email("Email inválido").optional().or(z.literal("")),
});

type FormData = z.infer<typeof formSchema>;

interface EditPatientDialogProps {
    patient: any;
    onPatientUpdated: () => void;
}

export function EditPatientDialog({ patient, onPatientUpdated }: EditPatientDialogProps) {
    const [open, setOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: patient?.name || "",
            species: patient?.species || "",
            breed: patient?.breed || "",
            birth_date: patient?.birth_date || "",
            gender: patient?.gender || "Macho",
            weight: patient?.weight?.toString() || "",
            is_neutered: patient?.is_neutered || false,
            is_aggressive: patient?.is_aggressive || false,
            medical_history: patient?.medical_history || "",
            owner_first_name: patient?.owners?.first_name || "",
            owner_last_name: patient?.owners?.last_name || "",
            owner_phone: patient?.owners?.phone || "",
            owner_email: patient?.owners?.email || "",
        },
    });

    const onSubmit = async (data: FormData) => {
        setIsSaving(true);
        try {
            // 1. Update Patient
            const { error: patientError } = await supabase
                .from("patients")
                .update({
                    name: data.name,
                    species: data.species,
                    breed: data.breed,
                    birth_date: data.birth_date || null,
                    gender: data.gender,
                    weight: data.weight ? parseFloat(data.weight) : null,
                    is_neutered: data.is_neutered,
                    is_aggressive: data.is_aggressive,
                    medical_history: data.medical_history,
                })
                .eq("id", patient.id);

            if (patientError) throw patientError;

            // 2. Update Owner (if owner_id exists)
            if (patient.owner_id) {
                const { error: ownerError } = await supabase
                    .from("owners")
                    .update({
                        first_name: data.owner_first_name,
                        last_name: data.owner_last_name,
                        phone: data.owner_phone,
                        email: data.owner_email || null,
                    })
                    .eq("id", patient.owner_id);

                if (ownerError) throw ownerError;
            }

            console.log("Patient and Owner updated successfully");
            setOpen(false);
            onPatientUpdated();

        } catch (error) {
            console.error("Error updating patient/owner:", error);
            alert("Error al actualizar la información.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-card border-border text-foreground">
                <DialogHeader>
                    <DialogTitle className="text-white">Editar Ficha Clínica</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Modifique los datos del paciente y su tutor.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 py-4">

                    {/* Sección Paciente */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium border-b border-border pb-2 text-white">Datos del Paciente</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-gray-300">Nombre</Label>
                                <Input id="name" {...register("name")} className="bg-background border-input text-white" />
                                {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="species" className="text-gray-300">Especie</Label>
                                <select
                                    id="species"
                                    {...register("species")}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-ring"
                                >
                                    <option value="canino">Canino</option>
                                    <option value="felino">Felino</option>
                                </select>
                                {errors.species && <span className="text-red-500 text-xs">{errors.species.message}</span>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="breed" className="text-gray-300">Raza</Label>
                                <Input id="breed" {...register("breed")} className="bg-background border-input text-white" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="birth_date" className="text-gray-300">Fecha Nacimiento</Label>
                                <Input type="date" id="birth_date" {...register("birth_date")} className="bg-background border-input text-white" />
                            </div>

                            {/* Nuevos Campos */}
                            <div className="grid gap-2">
                                <Label htmlFor="gender" className="text-gray-300">Sexo</Label>
                                <select
                                    id="gender"
                                    {...register("gender")}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-ring"
                                >
                                    <option value="Macho">Macho</option>
                                    <option value="Hembra">Hembra</option>
                                </select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="weight" className="text-gray-300">Peso (kg)</Label>
                                <Input type="number" step="0.1" id="weight" {...register("weight")} className="bg-background border-input text-white" />
                            </div>
                        </div>

                        <div className="flex flex-col space-y-3 pt-2">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="is_neutered"
                                    {...register("is_neutered")}
                                    className="h-4 w-4 rounded border-input bg-background text-blue-600 focus:ring-blue-500"
                                />
                                <Label htmlFor="is_neutered" className="text-gray-300">Castrado / Esterilizado</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="is_aggressive"
                                    {...register("is_aggressive")}
                                    className="h-4 w-4 rounded border-red-500 bg-background text-red-600 focus:ring-red-500"
                                />
                                <Label htmlFor="is_aggressive" className="text-red-400 font-bold">⚠️ ¿Es Agresivo?</Label>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="medical_history" className="text-gray-300">Antecedentes Médicos</Label>
                            <textarea
                                id="medical_history"
                                {...register("medical_history")}
                                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>
                    </div>

                    {/* Sección Dueño */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium border-b border-border pb-2 text-white">Datos del Tutor</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="owner_first_name" className="text-gray-300">Nombre</Label>
                                <Input id="owner_first_name" {...register("owner_first_name")} className="bg-background border-input text-white" />
                                {errors.owner_first_name && <span className="text-red-500 text-xs">{errors.owner_first_name.message}</span>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="owner_last_name" className="text-gray-300">Apellido</Label>
                                <Input id="owner_last_name" {...register("owner_last_name")} className="bg-background border-input text-white" />
                                {errors.owner_last_name && <span className="text-red-500 text-xs">{errors.owner_last_name.message}</span>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="owner_phone" className="text-gray-300">Teléfono</Label>
                                <Input id="owner_phone" {...register("owner_phone")} className="bg-background border-input text-white" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="owner_email" className="text-gray-300">Email</Label>
                                <Input id="owner_email" {...register("owner_email")} className="bg-background border-input text-white" />
                                {errors.owner_email && <span className="text-red-500 text-xs">{errors.owner_email.message}</span>}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-gray-600 text-gray-300 hover:bg-gray-800">Cancelar</Button>
                        <Button type="submit" disabled={isSaving} className="bg-blue-600 text-white hover:bg-blue-700">
                            {isSaving ? "Guardando..." : "Guardar Cambios"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
