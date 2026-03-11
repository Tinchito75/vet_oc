export interface ExaminationRow {
    id: string;
    label: string;
    isHeader?: boolean;
    defaultValue?: string; // Optional default placeholder
}

export const examinationRows: ExaminationRow[] = [
    { id: 'aspecto_globo', label: 'Aspecto del Globo Ocular' },
    { id: 'schirmer', label: 'Test Lagrimal de Schirmer (MM/MIN)' },
    { id: 'amenaza_foto', label: 'Prueba de Amenaza (Fotópica)' },
    { id: 'amenaza_esco', label: 'Prueba de Amenaza (Escotópica)' },
    { id: 'deambulacion_foto', label: 'Prueba de Deambulación (Fotópica)' },
    { id: 'deambulacion_esco', label: 'Prueba de Deambulación (Escotópica)' },
    { id: 'reflejo_fundico', label: 'Reflejo Fúndico' },
    { id: 'header_pupilas', label: 'Pupilas', isHeader: true },
    { id: 'rfp_directo', label: 'Reflejos Fotomotores Pupilares (Directo)' },
    { id: 'rfp_cruzado', label: 'Reflejos Fotomotores Pupilares (Cruzado)' },
    { id: 'reflejo_corneal', label: 'Reflejo Corneal' },
    { id: 'reflejo_palpebral', label: 'Reflejo Palpebral' },
    { id: 'reflejo_trigemino', label: 'Reflejo Trigémino - Abducens Ac.' },
    { id: 'dazzle', label: 'Reflejo del Parpadeo Fotópico (Dazzle Reflex)' },
    { id: 'swinging_light', label: 'Respuesta de la Luz Oscilante (Swinging light response)' },
    { id: 'fluoresceina', label: 'Tinción de Fluoresceína' },
    { id: 'rosa_bengala', label: 'Tinción de Rosa de Bengala' },
    { id: 'permeabilidad', label: 'Permeabilidad Sist. Lacrimonasal a la Fluoresceína' },
    { id: 'fotocromatico_roja', label: 'Reflejo Fotocromático (Luz ROJA)' },
    { id: 'fotocromatico_azul', label: 'Reflejo Fotocromático (Luz AZUL)' },
    { id: 'retropulsion', label: 'Prueba de Retropulsión' },
    { id: 'conjuntiva', label: 'Conjuntiva' },
    { id: 'parpados', label: 'Párpados' },
    { id: 'tercer_parpado_int', label: '3er Párpado (Cara interna)' },
    { id: 'tercer_parpado_ext', label: '3er Párpado (Cara externa)' },
];
