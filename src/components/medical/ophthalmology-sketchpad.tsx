import { useRef, useState } from 'react';
import { ReactSketchCanvas, type ReactSketchCanvasRef } from 'react-sketch-canvas';
import { Button } from '@/components/ui/button';
import { Eraser, RefreshCcw, Save } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

interface OphthalmologySketchpadProps {
    onChange: (sectionId: string, imageBase64: string) => void;
    species?: string;
}

const SECTIONS = [
    { id: "cornea", title: "1. Córnea - Iris - Pupila" },
    { id: "lens", title: "2. Cristalino (Lens)" },
    { id: "fundus", title: "3. Fondo de Ojo (Fundus)" },
    { id: "eyelids", title: "4. Párpados / Anexos" }
];

const COLORS = [
    { name: 'Rojo (Vasos)', value: '#ef4444' }, // red-500
    { name: 'Verde (Fluoresceína)', value: '#22c55e' }, // green-500
    { name: 'Azul (Edema)', value: '#3b82f6' }, // blue-500
];

export function OphthalmologySketchpad({ onChange, species = 'canino' }: OphthalmologySketchpadProps) {
    // Normalize species for strict comparison
    // Normalize species for strict comparison
    // const isFeline = species?.toLowerCase().trim() === 'felino'; // Direct usage in JSX preferred currently

    // Refs for each canvas
    const corneaRef = useRef<ReactSketchCanvasRef>(null);
    const lensRef = useRef<ReactSketchCanvasRef>(null);
    const fundusRef = useRef<ReactSketchCanvasRef>(null);
    const eyelidsRef = useRef<ReactSketchCanvasRef>(null);

    const getRef = (id: string) => {
        switch (id) {
            case "cornea": return corneaRef;
            case "lens": return lensRef;
            case "fundus": return fundusRef;
            case "eyelids": return eyelidsRef;
            default: return null;
        }
    };

    const [activeColor, setActiveColor] = useState('#ef4444'); // Default Red
    const [eraseMode, setEraseMode] = useState(false);

    const handleStrokeColor = (color: string) => {
        setEraseMode(false);
        setActiveColor(color);
    };

    const handleEraser = () => {
        setEraseMode(true);
    };

    const handleClear = (id: string) => {
        getRef(id)?.current?.clearCanvas();
    };

    const handleSave = async (id: string) => {
        const ref = getRef(id);
        if (ref?.current) {
            try {
                const image = await ref.current.exportImage('png');
                onChange(id, image);
                alert('Dibujo guardado temporalmente.');
            } catch (e) {
                console.error(e);
            }
        }
    };

    // --- SVG BACKGROUNDS (User Provided) ---

    const CorneaBackground = () => (
        <svg width="100%" height="100%" viewBox="0 0 500 250" preserveAspectRatio="xMidYMid meet" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
            {/* OD */}
            <text x="125" y="30" textAnchor="middle" fontFamily="sans-serif" fontSize="20" fontWeight="bold" fill="#4B5563">OD</text>
            <circle cx="125" cy="140" r="90" fill="none" stroke="#6B7280" strokeWidth="2" />

            {/* Conditional Pupil based on Species */}
            {species?.toLowerCase() === 'felino' ? (
                // Cat: Vertical Oval
                <ellipse cx="125" cy="140" rx="20" ry="60" fill="none" stroke="#6B7280" strokeWidth="2" />
            ) : (
                // Dog/Other: Perfectly Round (Canine Spec)
                <circle cx="125" cy="140" r="35" fill="none" stroke="#6B7280" strokeWidth="2" />
            )}

            {/* OI */}
            <text x="375" y="30" textAnchor="middle" fontFamily="sans-serif" fontSize="20" fontWeight="bold" fill="#4B5563">OI</text>
            <circle cx="375" cy="140" r="90" fill="none" stroke="#6B7280" strokeWidth="2" />

            {/* Conditional Pupil based on Species */}
            {species?.toLowerCase() === 'felino' ? (
                // Cat: Vertical Oval
                <ellipse cx="375" cy="140" rx="20" ry="60" fill="none" stroke="#6B7280" strokeWidth="2" />
            ) : (
                // Dog/Other: Perfectly Round (Canine Spec)
                <circle cx="375" cy="140" r="35" fill="none" stroke="#6B7280" strokeWidth="2" />
            )}
        </svg>
    );

    const LensBackground = () => (
        <svg width="100%" height="100%" viewBox="0 0 500 220" preserveAspectRatio="xMidYMid meet" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
            {/* OD Label */}
            <text x="125" y="22" textAnchor="middle" fontFamily="sans-serif" fontSize="16" fontWeight="bold" fill="#4B5563">OD</text>

            {/* OD - Anterior (circle) */}
            <circle cx="65" cy="105" r="52" fill="none" stroke="#333" strokeWidth="2.5" />
            <text x="65" y="175" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#555">A</text>

            {/* OD - Posterior (tall oval / P-shape) */}
            <ellipse cx="175" cy="105" rx="40" ry="52" fill="none" stroke="#333" strokeWidth="2.5" />
            <text x="175" y="175" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#555">P</text>

            {/* OI Label */}
            <text x="375" y="22" textAnchor="middle" fontFamily="sans-serif" fontSize="16" fontWeight="bold" fill="#4B5563">OI</text>

            {/* OI - Anterior (circle) */}
            <circle cx="315" cy="105" r="52" fill="none" stroke="#333" strokeWidth="2.5" />
            <text x="315" y="175" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#555">A</text>

            {/* OI - Posterior (tall oval / P-shape) */}
            <ellipse cx="430" cy="105" rx="40" ry="52" fill="none" stroke="#333" strokeWidth="2.5" />
            <text x="430" y="175" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#555">P</text>
        </svg>
    );

    const FundusBackground = () => (
        <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>

            {/* OD - Left circle */}
            <circle cx="100" cy="100" r="85" fill="none" stroke="#333" strokeWidth="2" />
            {/* OD Optic Disc */}
            <ellipse cx="100" cy="112" rx="7" ry="5" fill="none" stroke="#333" strokeWidth="1.5" />
            {/* OD Vessels */}
            {/* Main trunk up */}
            <path d="M 100,107 C 99,90 98,75 95,58" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
            {/* Upper-left branch */}
            <path d="M 95,58 C 85,48 72,40 60,30" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
            {/* Upper-right branch */}
            <path d="M 95,58 C 105,50 118,42 130,32" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
            {/* Right sub-branch from upper-right */}
            <path d="M 118,42 C 130,50 148,65 162,70" fill="none" stroke="#333" strokeWidth="1.2" strokeLinecap="round" />
            {/* Left horizontal */}
            <path d="M 100,112 C 82,108 65,103 35,102" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
            {/* Lower-left */}
            <path d="M 100,117 C 85,125 68,138 52,152" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
            {/* Lower-right */}
            <path d="M 100,117 C 118,125 135,138 155,148" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />

            {/* OI - Right circle */}
            <circle cx="300" cy="100" r="85" fill="none" stroke="#333" strokeWidth="2" />
            {/* OI Optic Disc */}
            <ellipse cx="300" cy="112" rx="7" ry="5" fill="none" stroke="#333" strokeWidth="1.5" />
            {/* OI Vessels */}
            <path d="M 300,107 C 299,90 298,75 295,58" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 295,58 C 285,48 272,40 260,30" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 295,58 C 305,50 318,42 330,32" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 318,42 C 330,50 348,65 362,70" fill="none" stroke="#333" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M 300,112 C 282,108 265,103 235,102" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 300,117 C 285,125 268,138 252,152" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 300,117 C 318,125 335,138 355,148" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );

    const EyelidsBackground = () => (
        <svg width="100%" height="100%" viewBox="0 0 500 200" preserveAspectRatio="xMidYMid meet" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
            {/* Labels */}
            <text x="125" y="30" textAnchor="middle" fill="#666" fontSize="20" fontWeight="bold">OD</text>
            <text x="375" y="30" textAnchor="middle" fill="#666" fontSize="20" fontWeight="bold">OI</text>

            {/* Right Eye (Left side of screen) */}
            <path
                d="M 50,100 Q 125,40 200,100 Q 125,160 50,100 Z"
                fill="none"
                stroke="#333"
                strokeWidth="3"
            />

            {/* Left Eye (Right side of screen) */}
            <path
                d="M 300,100 Q 375,40 450,100 Q 375,160 300,100 Z"
                fill="none"
                stroke="#333"
                strokeWidth="3"
            />
        </svg>
    );

    const renderBackground = (id: string) => {
        switch (id) {
            case "cornea": return <CorneaBackground />;
            case "lens": return <LensBackground />;
            case "fundus": return <FundusBackground />;
            case "eyelids": return <EyelidsBackground />;
            default: return null;
        }
    }


    return (
        <div className="space-y-4">
            {/* Toolbar (Global for simplicity) */}
            <div className="flex flex-wrap gap-2 p-2 bg-muted rounded-md justify-center sticky top-0 z-10 w-full border border-border">
                {COLORS.map(c => (
                    <Button
                        key={c.value}
                        type="button"
                        size="sm"
                        variant={activeColor === c.value && !eraseMode ? "default" : "outline"}
                        onClick={() => handleStrokeColor(c.value)}
                        className="gap-2 focus:ring-2 focus:ring-offset-1"
                        style={{ borderColor: activeColor === c.value && !eraseMode ? c.value : undefined }}
                    >
                        <div className="w-4 h-4 rounded-full border border-white shadow-sm" style={{ backgroundColor: c.value }} />
                        <span className="hidden sm:inline font-medium">{c.name}</span>
                    </Button>
                ))}
                <div className="w-px h-8 bg-border mx-2" />
                <Button
                    type="button"
                    size="sm"
                    variant={eraseMode ? "secondary" : "ghost"}
                    onClick={handleEraser}
                    title="Borrador"
                >
                    <Eraser className="w-4 h-4 mr-2" /> Borrador
                </Button>
            </div>

            <Accordion type="single" collapsible className="w-full" defaultValue="cornea">
                {SECTIONS.map((section) => (
                    <AccordionItem key={section.id} value={section.id}>
                        <AccordionTrigger className="text-lg font-semibold px-4 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-t-lg">{section.title}</AccordionTrigger>
                        <AccordionContent className="p-4 bg-slate-50/50 dark:bg-slate-900/50">
                            {/* Container with Strict Aspect Ratio to match PDF */}
                            <div
                                className={`relative w-full max-w-2xl mx-auto border rounded-lg bg-white overflow-hidden shadow-inner ${section.id === 'eyelids' ? 'aspect-[5/2]' : 'aspect-[2/1]'
                                    }`}
                            >
                                {/* SVG Background Layer */}
                                {renderBackground(section.id)}

                                {/* Drawing Canvas Layer */}
                                <ReactSketchCanvas
                                    ref={getRef(section.id)}
                                    style={{ border: 'none', background: 'transparent' }}
                                    width="100%"
                                    height="100%"
                                    strokeWidth={eraseMode ? 20 : 3}
                                    strokeColor={eraseMode ? "white" : activeColor}
                                    canvasColor="transparent"
                                />

                                {/* Action Buttons */}
                                <div className="absolute bottom-4 right-4 flex gap-2">
                                    <Button type="button" size="icon" variant="secondary" onClick={() => handleClear(section.id)} title="Limpiar">
                                        <RefreshCcw className="w-4 h-4" />
                                    </Button>
                                    <Button type="button" size="icon" onClick={() => handleSave(section.id)} title="Guardar cambios" className="bg-blue-600 text-white hover:bg-blue-700 shadow-sm border border-blue-700">
                                        <Save className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
