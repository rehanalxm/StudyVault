import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-xl shadow-lg border animate-slide-in ${type === 'success'
                ? 'bg-white border-green-100 text-green-800'
                : 'bg-white border-red-100 text-red-800'
            }`}>
            <div className={`p-2 rounded-lg mr-3 ${type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                }`}>
                {type === 'success' ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
            </div>
            <p className="font-medium mr-8">{message}</p>
            <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
};

export default Toast;
