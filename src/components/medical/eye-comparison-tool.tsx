import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface VisitImage {
    id: string;
    image_url: string;
    visit_date: string;
    visit_id: string;
    notes?: string;
}

interface EyeComparisonToolProps {
    patientId: string;
}

export function EyeComparisonTool({ patientId }: EyeComparisonToolProps) {
    const [images, setImages] = useState<VisitImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [imageA, setImageA] = useState<VisitImage | null>(null);
    const [imageB, setImageB] = useState<VisitImage | null>(null);

    useEffect(() => {
        fetchImages();
    }, [patientId]);

    const fetchImages = async () => {
        setLoading(true);
        // Join visit_images with visits to get the date
        const { data, error } = await supabase
            .from('visit_images')
            .select('id, image_url, notes, visit_id, visits(date)')
            .eq('visits.patient_id', patientId) // This requires a join filter, usually handled differently in Supabase if RLS allows or if we query visits first. 
            // Correct way for Supabase nested filtering:
            // Actually, we usually can't filter top-level by a nested property easily unless we use !inner or similar.
            // Let's grab all visit_images where visit_id is in (select id from visits where patient_id = ...)
            // Or just select *, visits!inner(date, patient_id) and filter by patient_id.
            .select(`
                id,
                image_url,
                notes,
                visit_id,
                visits!inner (
                    date,
                    patient_id
                )
            `)
            .eq('visits.patient_id', patientId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching images:', error);
        } else if (data) {
            const formattedImages: VisitImage[] = data.map((item: any) => ({
                id: item.id,
                image_url: item.image_url,
                notes: item.notes,
                visit_id: item.visit_id,
                visit_date: item.visits.date
            }));

            setImages(formattedImages);
            if (formattedImages.length >= 2) {
                setImageA(formattedImages[formattedImages.length - 1]); // Oldest
                setImageB(formattedImages[0]); // Newest
            } else if (formattedImages.length === 1) {
                setImageB(formattedImages[0]);
            }
        }
        setLoading(false);
    };

    if (loading) return <div className="p-8 text-center text-slate-400">Cargando imágenes...</div>;

    if (images.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Evolución Visual</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center p-8 border-2 border-dashed rounded-lg bg-slate-50 text-slate-400">
                        No hay imágenes registradas para este paciente.
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="overflow-hidden">
            <CardHeader>
                <CardTitle className="text-lg">Comparador de Evolución</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

                {/* Controls */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase">Imagen A (Izquierda)</label>
                        <Select
                            value={imageA?.id}
                            onValueChange={(val) => setImageA(images.find(i => i.id === val) || null)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar fecha" />
                            </SelectTrigger>
                            <SelectContent>
                                {images.map(img => (
                                    <SelectItem key={img.id} value={img.id}>
                                        {format(new Date(img.visit_date), "dd MMM yyyy", { locale: es })}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase">Imagen B (Derecha)</label>
                        <Select
                            value={imageB?.id}
                            onValueChange={(val) => setImageB(images.find(i => i.id === val) || null)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar fecha" />
                            </SelectTrigger>
                            <SelectContent>
                                {images.map(img => (
                                    <SelectItem key={img.id} value={img.id}>
                                        {format(new Date(img.visit_date), "dd MMM yyyy", { locale: es })}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Slider */}
                <div className="relative h-[400px] w-full rounded-xl overflow-hidden border shadow-inner bg-slate-100">
                    {imageA && imageB ? (
                        <ReactCompareSlider
                            className="h-full w-full"
                            position={50}
                            itemOne={
                                <div className="h-full w-full relative">
                                    <ReactCompareSliderImage
                                        src={imageA.image_url}
                                        alt="Imagen A"
                                        className="object-cover h-full w-full"
                                    />
                                    <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-xs backdrop-blur-sm">
                                        {format(new Date(imageA.visit_date), "dd/MM/yyyy")}
                                    </div>
                                </div>
                            }
                            itemTwo={
                                <div className="h-full w-full relative">
                                    <ReactCompareSliderImage
                                        src={imageB.image_url}
                                        alt="Imagen B"
                                        className="object-cover h-full w-full"
                                    />
                                    <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-xs backdrop-blur-sm">
                                        {format(new Date(imageB.visit_date), "dd/MM/yyyy")}
                                    </div>
                                </div>
                            }
                        />
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-400">
                            Seleccione dos imágenes para comparar
                        </div>
                    )}
                </div>

            </CardContent>
        </Card>
    );
}
