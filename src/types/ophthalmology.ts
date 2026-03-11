export type EyeZone = 'cornea' | 'lens' | 'retina' | 'eyelid' | 'third_eyelid' | 'sclera';

export type FindingStatus = 'normal' | 'abnormal';

export interface Finding {
    id: string; // Internal ID for UI listing
    zone: EyeZone;
    status: FindingStatus;
    condition: string;
    description: string;
    color: string;
}

export const EYE_ZONES: { id: EyeZone; label: string }[] = [
    { id: 'cornea', label: 'Córnea' },
    { id: 'lens', label: 'Cristalino' },
    { id: 'retina', label: 'Retina / Fondo' },
    { id: 'eyelid', label: 'Párpados' },
    { id: 'third_eyelid', label: 'Tercer Párpado' },
    { id: 'sclera', label: 'Esclera / Conjuntiva' },
];

export const COMMON_CONDITIONS: Record<EyeZone, string[]> = {
    cornea: ['Úlcera Superficial', 'Úlcera Profunda', 'Queratitis', 'Edema', 'Pigmentación', 'Cuerpo Extraño'],
    lens: ['Catarata Incipiente', 'Catarata Madura', 'Esclerosis Nuclear', 'Luxación', 'Subluxación'],
    retina: ['Atrofia Progresiva', 'Desprendimiento', 'Hemorragia', 'Neuritis Óptica'],
    eyelid: ['Entropión', 'Ectropión', 'Distiquiasis', 'Tumor', 'Blefaritis'],
    third_eyelid: ['Protrusión', 'Prolapso Glándula (Cherry Eye)', 'Inversión Cartílago'],
    sclera: ['Epiescleritis', 'Congestión', 'Hemorragia Subconjuntival', 'Ictericia'],
};
