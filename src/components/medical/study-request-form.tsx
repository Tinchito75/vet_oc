import React, { useState } from 'react';
import { StudyType, StudyRequestData, DownloadStudyRequestButton } from './study-request-pdf';

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

export function StudyRequestForm() {
    // Mocked data as requested for now
    const [patientData] = useState({
        patientName: 'Firulais',
        species: 'Canina',
        age: '5 años',
        ownerName: 'Juan Pérez',
        date: new Date().toISOString(),
    });

    const [studyType, setStudyType] = useState<StudyType | ''>('');
    const [detailsText, setDetailsText] = useState('');
    const [bloodTests, setBloodTests] = useState<string[]>([]);

    const handleBloodTestToggle = (test: string) => {
        setBloodTests((prev) =>
            prev.includes(test)
                ? prev.filter((t) => t !== test)
                : [...prev, test]
        );
    };

    // Construct the data payload for the PDF
    const studyData: StudyRequestData = {
        ...patientData,
        studyType: studyType as StudyType,
        detailsText,
        bloodTests,
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 w-full max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-2">Solicitud de Estudios Complementarios</h2>

            <div className="space-y-6">
                {/* 1. Selector de Estudio */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                        Seleccionar tipo de estudio
                    </label>
                    <div className="flex flex-wrap gap-4">
                        {['Radiografía', 'Resonancia', 'Análisis de Sangre'].map((type) => (
                            <label
                                key={type}
                                className={`flex items-center gap-2 p-3 border rounded-md cursor-pointer transition-colors ${studyType === type
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-slate-200 hover:bg-slate-50'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="studyType"
                                    value={type}
                                    checked={studyType === type}
                                    onChange={(e) => {
                                        setStudyType(e.target.value as StudyType);
                                        // Reset fields when switching main category
                                        if (e.target.value === 'Análisis de Sangre') {
                                            setDetailsText('');
                                        } else {
                                            setBloodTests([]);
                                        }
                                    }}
                                    className="text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                                />
                                <span className="font-medium text-sm">{type}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* 2. Renderizado Condicional */}
                {studyType && (
                    <div className="bg-slate-50 p-4 rounded-md border border-slate-100">
                        {(studyType === 'Radiografía' || studyType === 'Resonancia') && (
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Detalle de vistas o región anatómica solicitada
                                </label>
                                <textarea
                                    className="w-full border border-slate-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 min-h-[120px]"
                                    placeholder={`Ej: Solicito ${studyType.toLowerCase()} de tórax (LLD y VD) para evaluar...`}
                                    value={detailsText}
                                    onChange={(e) => setDetailsText(e.target.value)}
                                />
                            </div>
                        )}

                        {studyType === 'Análisis de Sangre' && (
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-3">
                                    Seleccionar determinaciones
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {BLOOD_TEST_OPTIONS.map((test) => (
                                        <label
                                            key={test}
                                            className="flex items-center gap-2 cursor-pointer group"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={bloodTests.includes(test)}
                                                onChange={() => handleBloodTestToggle(test)}
                                                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                            />
                                            <span className="text-sm text-slate-700 group-hover:text-slate-900">{test}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* 3. Botón Generar PDF */}
                <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <DownloadStudyRequestButton data={studyData} />
                </div>
            </div>
        </div>
    );
}
