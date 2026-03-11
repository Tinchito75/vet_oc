import React from 'react';
import { examinationRows } from '@/constants/examDefinition';

interface ExamFormProps {
    examData: Record<string, string>;
    onChange: (newData: Record<string, string>) => void;
}

export const ExamForm: React.FC<ExamFormProps> = ({ examData, onChange }) => {

    const handleChange = (key: string, value: string) => {
        onChange({
            ...examData,
            [key]: value
        });
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300 text-sm">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2 text-left font-medium text-gray-700 w-1/2">Prueba</th>
                        <th className="border border-gray-300 p-2 text-center font-medium text-gray-700 w-1/4">OD (Derecho)</th>
                        <th className="border border-gray-300 p-2 text-center font-medium text-gray-700 w-1/4">OI (Izquierdo)</th>
                    </tr>
                </thead>
                <tbody>
                    {examinationRows.map((row) => {
                        if (row.isHeader) {
                            return (
                                <tr key={row.id} className="bg-gray-200">
                                    <td colSpan={3} className="border border-gray-300 p-2 font-bold text-gray-800 text-center uppercase">
                                        {row.label}
                                    </td>
                                </tr>
                            );
                        }

                        const keyOD = `${row.id}_od`;
                        const keyOI = `${row.id}_oi`;

                        return (
                            <tr key={row.id} className="hover:bg-gray-50">
                                <td className="border border-gray-300 p-2 text-gray-700 font-medium">
                                    {row.label}
                                </td>
                                <td className="border border-gray-300 p-1">
                                    <input
                                        type="text"
                                        value={examData[keyOD] || ''}
                                        onChange={(e) => handleChange(keyOD, e.target.value)}
                                        className="w-full text-center border-none focus:ring-1 focus:ring-blue-500 bg-transparent p-1 text-gray-900"
                                        placeholder="-"
                                    />
                                </td>
                                <td className="border border-gray-300 p-1">
                                    <input
                                        type="text"
                                        value={examData[keyOI] || ''}
                                        onChange={(e) => handleChange(keyOI, e.target.value)}
                                        className="w-full text-center border-none focus:ring-1 focus:ring-blue-500 bg-transparent p-1 text-gray-900"
                                        placeholder="-"
                                    />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};
