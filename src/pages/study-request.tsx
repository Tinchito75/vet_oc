import { useState, useEffect, useMemo, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Check, Search } from 'lucide-react';
import { DownloadStudyRequestButton, type StudyType, type StudyRequestData } from '@/components/medical/study-request-pdf';
import { cn } from '@/lib/utils';

interface Owner {
    id: string;
    first_name: string;
    last_name: string;
    dni: string;
    phone: string;
    email: string;
}

interface Patient {
    id: string;
    name: string;
    species: string;
    breed: string;
    birth_date: string;
    gender: string;
    weight: number;
    is_aggressive: boolean;
    owner_id: string;
}

const BLOOD_TEST_OPTIONS = [
    'Hemograma',
    'Perfil Renal',
    'Perfil Hepático',
    'Glucemia',
    'Fructosamina',
    'Perfil Tiroideo',
    'Toxoplasmosis',
    'VIF/VILeF',
];

export default function StudyRequestScreen() {
    const [owners, setOwners] = useState<Owner[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loadingOwners, setLoadingOwners] = useState(true);

    const [selectedOwnerId, setSelectedOwnerId] = useState<string>('');
    const [selectedPatientId, setSelectedPatientId] = useState<string>('');

    const [openOwnerPopover, setOpenOwnerPopover] = useState(false);
    const [ownerQuery, setOwnerQuery] = useState('');
    const [openPatientPopover, setOpenPatientPopover] = useState(false);
    const [patientQuery, setPatientQuery] = useState('');
    const ownerInputRef = useRef<HTMLInputElement>(null);
    const patientInputRef = useRef<HTMLInputElement>(null);

    // Study Request State
    const [studyType, setStudyType] = useState<StudyType | ''>('');
    const [detailsText, setDetailsText] = useState('');
    const [bloodTests, setBloodTests] = useState<string[]>([]);
    const [currentWeight, setCurrentWeight] = useState<string>('');

    // Fetch all owners on mount
    useEffect(() => {
        const fetchOwners = async () => {
            setLoadingOwners(true);
            const { data, error } = await supabase
                .from('owners')
                .select('id, first_name, last_name, dni, phone, email')
                .order('first_name');

            if (!error && data) {
                setOwners(data);
            }
            setLoadingOwners(false);
        };
        fetchOwners();
    }, []);

    // Fetch patients when owner changes
    useEffect(() => {
        setSelectedPatientId('');
        setCurrentWeight('');
        if (!selectedOwnerId) {
            setPatients([]);
            return;
        }

        const fetchPatients = async () => {
            const { data, error } = await supabase
                .from('patients')
                .select('*')
                .eq('owner_id', selectedOwnerId);

            if (!error && data) {
                setPatients(data);
            }
        };
        fetchPatients();
    }, [selectedOwnerId]);

    // Update weight locally when patient is selected
    useEffect(() => {
        if (selectedPatientId) {
            const p = patients.find(p => p.id === selectedPatientId);
            if (p) {
                setCurrentWeight(p.weight?.toString() || '');
            }
        }
    }, [selectedPatientId, patients]);

    const selectedOwner = useMemo(() => owners.find((o) => o.id === selectedOwnerId), [owners, selectedOwnerId]);
    const selectedPatient = useMemo(() => patients.find((p) => p.id === selectedPatientId), [patients, selectedPatientId]);

    const calculateAge = (birthDate: string) => {
        if (!birthDate) return 'Desconocida';
        const birth = new Date(birthDate);
        const now = new Date();
        let years = now.getFullYear() - birth.getFullYear();
        let months = now.getMonth() - birth.getMonth();
        if (months < 0 || (months === 0 && now.getDate() < birth.getDate())) {
            years--;
            months += 12;
        }
        if (years > 0) return `${years} años`;
        return `${months} meses`;
    };

    const handleBloodTestToggle = (test: string) => {
        setBloodTests((prev) =>
            prev.includes(test)
                ? prev.filter((t) => t !== test)
                : [...prev, test]
        );
    };

    // Construct the payload for the PDF
    const studyData: StudyRequestData = {
        patientName: selectedPatient?.name || '',
        species: selectedPatient?.species || '',
        age: selectedPatient?.birth_date ? calculateAge(selectedPatient.birth_date) : '',
        ownerName: selectedOwner ? `${selectedOwner.first_name} ${selectedOwner.last_name}` : '',
        ownerDni: selectedOwner?.dni || '',
        ownerPhone: selectedOwner?.phone || '',
        ownerEmail: selectedOwner?.email || '',
        date: new Date().toISOString(),
        studyType: studyType as StudyType,
        detailsText,
        bloodTests,
    };

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <h1 className="text-3xl font-bold tracking-tight mb-6">Solicitar Estudios</h1>

            <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-sm p-6 space-y-8">
                {/* 1. SELECCIÓN DE ESTUDIO */}
                <section>
                    <h2 className="text-lg font-semibold border-b pb-2 mb-4 dark:border-zinc-800">1. Tipo de Estudio</h2>
                    <div className="flex flex-wrap gap-4">
                        {['Radiografía', 'Resonancia', 'Análisis de Sangre'].map((type) => (
                            <label
                                key={type}
                                className={`flex items-center gap-2 px-4 py-3 border rounded-xl cursor-pointer transition-colors ${studyType === type
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                    : 'border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="studyType"
                                    value={type}
                                    checked={studyType === type}
                                    onChange={(e) => {
                                        setStudyType(e.target.value as StudyType);
                                        if (e.target.value === 'Análisis de Sangre') {
                                            setDetailsText('');
                                        } else {
                                            setBloodTests([]);
                                        }
                                    }}
                                    className="text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                                />
                                <span className="font-medium">{type}</span>
                            </label>
                        ))}
                    </div>
                </section>

                {/* 2. DATOS DE AUTOCOMPLETADO */}
                <section>
                    <h2 className="text-lg font-semibold border-b pb-2 mb-4 dark:border-zinc-800">2. Destinatario del Estudio</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Selector de Tutor - Plain Dropdown */}
                        <div className="space-y-4">
                            <div>
                                <Label className="mb-1 block">Tutor</Label>
                                <div className="relative">
                                    {/* Selected chip */}
                                    {selectedOwner && ownerQuery.length === 0 ? (
                                        <div
                                            className="flex items-center justify-between px-3 py-2 border border-input rounded-md bg-background cursor-pointer hover:bg-accent transition-colors"
                                            onClick={() => { setOwnerQuery(`${selectedOwner.first_name} ${selectedOwner.last_name}`); setTimeout(() => ownerInputRef.current?.focus(), 50); }}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-green-500" />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold">{selectedOwner.first_name} {selectedOwner.last_name}</span>
                                                    {selectedOwner.dni && <span className="text-xs text-muted-foreground">DNI: {selectedOwner.dni}</span>}
                                                </div>
                                            </div>
                                            <span className="text-xs text-muted-foreground underline">Cambiar</span>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-center border border-input rounded-md bg-background px-3 gap-2 focus-within:ring-2 focus-within:ring-ring">
                                                <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                                                <input
                                                    ref={ownerInputRef}
                                                    type="text"
                                                    placeholder={loadingOwners ? "Cargando tutores..." : "Buscar tutor por nombre o DNI..."}
                                                    value={ownerQuery}
                                                    onChange={e => { setOwnerQuery(e.target.value); setOpenOwnerPopover(true); }}
                                                    onFocus={() => setOpenOwnerPopover(true)}
                                                    onBlur={() => setTimeout(() => setOpenOwnerPopover(false), 150)}
                                                    className="h-10 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                                                />
                                                {ownerQuery && <button type="button" className="text-muted-foreground text-xs shrink-0" onMouseDown={e => { e.preventDefault(); setOwnerQuery(''); setSelectedOwnerId(''); setOpenOwnerPopover(false); }}>✕</button>}
                                            </div>
                                            {openOwnerPopover && (() => {
                                                const q = ownerQuery.toLowerCase();
                                                const filtered = owners.filter(o =>
                                                    `${o.first_name} ${o.last_name}`.toLowerCase().includes(q) ||
                                                    (o.dni || '').toLowerCase().includes(q)
                                                );
                                                return filtered.length > 0 ? (
                                                    <div className="absolute top-full left-0 mt-1 w-full bg-background border border-border rounded-md shadow-xl z-[9999] overflow-hidden max-h-[240px] overflow-y-auto">
                                                        <ul>
                                                            {filtered.map(owner => (
                                                                <li
                                                                    key={owner.id}
                                                                    className="px-4 py-3 hover:bg-accent cursor-pointer flex items-center justify-between border-b border-border last:border-0 transition-colors"
                                                                    onMouseDown={e => {
                                                                        e.preventDefault();
                                                                        setSelectedOwnerId(owner.id);
                                                                        setOwnerQuery('');
                                                                        setOpenOwnerPopover(false);
                                                                    }}
                                                                >
                                                                    <div className="flex flex-col">
                                                                        <span className={cn("text-sm font-semibold", selectedOwnerId === owner.id && "text-green-500")}>{owner.first_name} {owner.last_name}</span>
                                                                        {owner.dni && <span className="text-xs text-muted-foreground">DNI: {owner.dni}</span>}
                                                                    </div>
                                                                    {selectedOwnerId === owner.id && <Check className="h-4 w-4 text-green-500" />}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ) : null;
                                            })()}
                                        </>
                                    )}
                                </div>
                            </div>

                            {selectedOwner && (
                                <div className="bg-slate-50 dark:bg-zinc-900/50 p-4 rounded-lg border border-slate-100 dark:border-zinc-800 space-y-3">
                                    <div>
                                        <Label className="text-xs text-slate-500 mb-1 block">Nombre Completo</Label>
                                        <Input readOnly value={`${selectedOwner.first_name} ${selectedOwner.last_name}`} className="bg-slate-100 dark:bg-zinc-800/50 text-slate-600 dark:text-slate-400 cursor-not-allowed focus-visible:ring-0" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <Label className="text-xs text-slate-500 mb-1 block">DNI</Label>
                                            <Input readOnly value={selectedOwner.dni || '-'} className="bg-slate-100 dark:bg-zinc-800/50 text-slate-600 dark:text-slate-400 cursor-not-allowed focus-visible:ring-0" />
                                        </div>
                                        <div>
                                            <Label className="text-xs text-slate-500 mb-1 block">Teléfono</Label>
                                            <Input readOnly value={selectedOwner.phone || '-'} className="bg-slate-100 dark:bg-zinc-800/50 text-slate-600 dark:text-slate-400 cursor-not-allowed focus-visible:ring-0" />
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-slate-500 mb-1 block">Email</Label>
                                        <Input readOnly value={selectedOwner.email || '-'} className="bg-slate-100 dark:bg-zinc-800/50 text-slate-600 dark:text-slate-400 cursor-not-allowed focus-visible:ring-0" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Selector de Mascota - Plain Dropdown */}
                        <div className="space-y-4">
                            <div>
                                <Label className="mb-1 block">Mascota</Label>
                                <div className="relative">
                                    {selectedPatient && patientQuery.length === 0 ? (
                                        <div
                                            className="flex items-center justify-between px-3 py-2 border border-input rounded-md bg-background cursor-pointer hover:bg-accent transition-colors"
                                            onClick={() => { setPatientQuery(selectedPatient.name); setTimeout(() => patientInputRef.current?.focus(), 50); }}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-green-500" />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold">{selectedPatient.name}</span>
                                                    <span className="text-xs text-muted-foreground">{selectedPatient.species} — {selectedPatient.breed || 'Sin raza'}</span>
                                                </div>
                                            </div>
                                            <span className="text-xs text-muted-foreground underline">Cambiar</span>
                                        </div>
                                    ) : (
                                        <>
                                            <div className={cn("flex items-center border border-input rounded-md bg-background px-3 gap-2 focus-within:ring-2 focus-within:ring-ring", !selectedOwnerId && "opacity-50")}>
                                                <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                                                <input
                                                    ref={patientInputRef}
                                                    type="text"
                                                    disabled={!selectedOwnerId}
                                                    placeholder={!selectedOwnerId ? "Primero seleccioná un tutor" : patients.length === 0 ? "Sin mascotas registradas" : "Buscar mascota..."}
                                                    value={patientQuery}
                                                    onChange={e => { setPatientQuery(e.target.value); setOpenPatientPopover(true); }}
                                                    onFocus={() => setOpenPatientPopover(true)}
                                                    onBlur={() => setTimeout(() => setOpenPatientPopover(false), 150)}
                                                    className="h-10 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none disabled:cursor-not-allowed"
                                                />
                                                {patientQuery && <button type="button" className="text-muted-foreground text-xs shrink-0" onMouseDown={e => { e.preventDefault(); setPatientQuery(''); setSelectedPatientId(''); setOpenPatientPopover(false); }}>✕</button>}
                                            </div>
                                            {openPatientPopover && patients.length > 0 && (() => {
                                                const q = patientQuery.toLowerCase();
                                                const filtered = patients.filter(p => p.name.toLowerCase().includes(q));
                                                return filtered.length > 0 ? (
                                                    <div className="absolute top-full left-0 mt-1 w-full bg-background border border-border rounded-md shadow-xl z-[9999] overflow-hidden max-h-[240px] overflow-y-auto">
                                                        <ul>
                                                            {filtered.map(patient => (
                                                                <li
                                                                    key={patient.id}
                                                                    className="px-4 py-3 hover:bg-accent cursor-pointer flex items-center justify-between border-b border-border last:border-0 transition-colors"
                                                                    onMouseDown={e => {
                                                                        e.preventDefault();
                                                                        setSelectedPatientId(patient.id);
                                                                        setPatientQuery('');
                                                                        setOpenPatientPopover(false);
                                                                    }}
                                                                >
                                                                    <div className="flex flex-col">
                                                                        <span className={cn("text-sm font-semibold", selectedPatientId === patient.id && "text-green-500")}>{patient.name}</span>
                                                                        <span className="text-xs text-muted-foreground">{patient.species} — {patient.breed || 'Sin raza'}</span>
                                                                    </div>
                                                                    {selectedPatientId === patient.id && <Check className="h-4 w-4 text-green-500" />}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ) : null;
                                            })()}
                                        </>
                                    )}
                                </div>
                            </div>

                            {selectedPatient && (
                                <div className="bg-slate-50 dark:bg-zinc-900/50 p-4 rounded-lg border border-slate-100 dark:border-zinc-800 space-y-3 relative">
                                    {selectedPatient.is_aggressive && (
                                        <Badge variant="destructive" className="absolute top-3 right-3 flex items-center gap-1 z-10">
                                            <AlertTriangle className="h-3 w-3" /> Agresivo
                                        </Badge>
                                    )}
                                    <div className="grid grid-cols-2 gap-3 mt-4">
                                        <div>
                                            <Label className="text-xs text-slate-500 mb-1 block">Nombre</Label>
                                            <Input readOnly value={selectedPatient.name} className="bg-slate-100 dark:bg-zinc-800/50 text-slate-600 dark:text-slate-400 cursor-not-allowed focus-visible:ring-0" />
                                        </div>
                                        <div>
                                            <Label className="text-xs text-slate-500 mb-1 block">Especie</Label>
                                            <Input readOnly value={selectedPatient.species} className="bg-slate-100 dark:bg-zinc-800/50 text-slate-600 dark:text-slate-400 cursor-not-allowed focus-visible:ring-0" />
                                        </div>
                                        <div>
                                            <Label className="text-xs text-slate-500 mb-1 block">Raza</Label>
                                            <Input readOnly value={selectedPatient.breed || '-'} className="bg-slate-100 dark:bg-zinc-800/50 text-slate-600 dark:text-slate-400 cursor-not-allowed focus-visible:ring-0" />
                                        </div>
                                        <div>
                                            <Label className="text-xs text-slate-500 mb-1 block">Sexo</Label>
                                            <Input readOnly value={selectedPatient.gender || '-'} className="bg-slate-100 dark:bg-zinc-800/50 text-slate-600 dark:text-slate-400 cursor-not-allowed focus-visible:ring-0" />
                                        </div>
                                        <div>
                                            <Label className="text-xs text-slate-500 mb-1 block">Edad</Label>
                                            <Input readOnly value={calculateAge(selectedPatient.birth_date)} className="bg-slate-100 dark:bg-zinc-800/50 text-slate-600 dark:text-slate-400 cursor-not-allowed focus-visible:ring-0" />
                                        </div>
                                        <div>
                                            <Label className="text-xs font-semibold mb-1 block text-blue-600 dark:text-blue-400">Peso Actual (kg)*</Label>
                                            <Input
                                                type="number"
                                                value={currentWeight}
                                                onChange={(e) => setCurrentWeight(e.target.value)}
                                                className="border-blue-300 dark:border-blue-700 focus-visible:ring-blue-500"
                                                placeholder="Ej: 15.5"
                                            />
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-400 text-right mt-1">El peso es el único campo editable para actualizarlo al día de hoy.</p>
                                </div>
                            )}
                        </div>

                    </div>
                </section>

                {/* 3. CONDICIONALES DE ESTUDIO */}
                {studyType && selectedPatient && (
                    <section className="animate-in fade-in duration-300">
                        <h2 className="text-lg font-semibold border-b pb-2 mb-4 dark:border-zinc-800">3. Detalles de Facturación y Solicitud</h2>
                        <div className="bg-blue-50/50 dark:bg-blue-950/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
                            {(studyType === 'Radiografía' || studyType === 'Resonancia') && (
                                <div>
                                    <Label className="mb-2 block">
                                        Región anatómica y proyecciones
                                    </Label>
                                    <textarea
                                        className="w-full border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-md p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 min-h-[120px]"
                                        placeholder={`Ej: Solicito ${studyType.toLowerCase()} de tórax (LLD y VD) para evaluar...`}
                                        value={detailsText}
                                        onChange={(e) => setDetailsText(e.target.value)}
                                    />
                                </div>
                            )}

                            {studyType === 'Análisis de Sangre' && (
                                <div>
                                    <Label className="mb-3 block">
                                        Seleccionar determinaciones
                                    </Label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {BLOOD_TEST_OPTIONS.map((test) => (
                                            <label
                                                key={test}
                                                className="flex items-center gap-2 cursor-pointer group bg-white dark:bg-zinc-900 p-2 rounded border border-slate-200 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={bloodTests.includes(test)}
                                                    onChange={() => handleBloodTestToggle(test)}
                                                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                />
                                                <span className="text-sm font-medium">{test}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* 4. BOTÓN DE GENERACIÓN */}
                <div className="pt-6 border-t border-slate-200 dark:border-zinc-800 flex justify-end">
                    <DownloadStudyRequestButton data={studyData} />
                </div>
            </div>
        </div>
    );
}
