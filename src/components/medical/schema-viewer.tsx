
interface SchemaViewerProps {
    type: 'cornea' | 'lens' | 'fundus' | 'eyelids';
    species?: string; // 'canino' | 'felino'
    drawingData: string; // base64 image
}

export function SchemaViewer({ type, species = 'canino', drawingData }: SchemaViewerProps) {

    // --- SVG BACKGROUNDS (Reused from OphthalmologySketchpad + Eyelids) ---

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
            <path d="M 100,107 C 99,90 98,75 95,58" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 95,58 C 85,48 72,40 60,30" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 95,58 C 105,50 118,42 130,32" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 118,42 C 130,50 148,65 162,70" fill="none" stroke="#333" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M 100,112 C 82,108 65,103 35,102" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 100,117 C 85,125 68,138 52,152" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
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

            {/* Right Eye (OD) */}
            <path
                d="M 50,100 Q 125,40 200,100 Q 125,160 50,100 Z"
                fill="none"
                stroke="#333"
                strokeWidth="3"
            />

            {/* Left Eye (OI) */}
            <path
                d="M 300,100 Q 375,40 450,100 Q 375,160 300,100 Z"
                fill="none"
                stroke="#333"
                strokeWidth="3"
            />
        </svg>
    );

    const renderBackground = () => {
        switch (type) {
            case "cornea": return <CorneaBackground />;
            case "lens": return <LensBackground />;
            case "fundus": return <FundusBackground />;
            case "eyelids": return <EyelidsBackground />;
            default: return null;
        }
    };

    return (
        <div className={`relative w-full border rounded-lg bg-white overflow-hidden shadow-sm ${type === 'eyelids' ? 'aspect-[5/2]' : 'aspect-[2/1]'
            }`}>
            {/* Layer 0: SVG Background */}
            <div className="absolute inset-0 z-0">
                {renderBackground()}
            </div>

            {/* Layer 10: Drawing */}
            <img
                src={drawingData}
                alt={`${type} diagram`}
                className="absolute inset-0 w-full h-full object-contain z-10"
            />
        </div>
    );
}
