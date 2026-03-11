
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
        <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
            <text x="100" y="20" textAnchor="middle" fontFamily="sans-serif" fill="#666">OD</text>
            <circle cx="60" cy="100" r="38" fill="none" stroke="#333" strokeWidth="2" />
            <text x="60" y="155" textAnchor="middle" fontSize="12" fill="#666">Ant</text>
            <circle cx="140" cy="100" r="38" fill="none" stroke="#333" strokeWidth="2" />
            <text x="140" y="155" textAnchor="middle" fontSize="12" fill="#666">Post</text>

            <text x="300" y="20" textAnchor="middle" fontFamily="sans-serif" fill="#666">OI</text>
            <circle cx="260" cy="100" r="38" fill="none" stroke="#333" strokeWidth="2" />
            <text x="260" y="155" textAnchor="middle" fontSize="12" fill="#666">Ant</text>
            <circle cx="340" cy="100" r="38" fill="none" stroke="#333" strokeWidth="2" />
            <text x="340" y="155" textAnchor="middle" fontSize="12" fill="#666">Post</text>
        </svg>
    );

    const FundusBackground = () => (
        <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
            <g transform="translate(0,0)">
                <circle cx="100" cy="100" r="80" fill="none" stroke="#333" strokeWidth="2" />
                <g opacity="0.3" stroke="#555" strokeWidth="2" fill="none">
                    <path d="M100 100 L100 60 M100 100 L70 130 M100 100 L130 130 M100 100 L80 80 M100 100 L120 80" />
                    <ellipse cx="100" cy="100" rx="10" ry="8" />
                </g>
            </g>
            <g transform="translate(200,0)">
                <circle cx="100" cy="100" r="80" fill="none" stroke="#333" strokeWidth="2" />
                <g opacity="0.3" stroke="#555" strokeWidth="2" fill="none">
                    <path d="M100 100 L100 60 M100 100 L70 130 M100 100 L130 130 M100 100 L80 80 M100 100 L120 80" />
                    <ellipse cx="100" cy="100" rx="10" ry="8" />
                </g>
            </g>
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
