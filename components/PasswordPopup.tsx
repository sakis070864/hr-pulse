import React, { useState } from 'react';

interface PasswordPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const PasswordPopup: React.FC<PasswordPopupProps> = ({ isOpen, onClose, onSuccess }) => {
    const [accessCode, setAccessCode] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const correctCode = import.meta.env.NEXT_PUBLIC_JUDGE_ACCESS_CODE || import.meta.env.VITE_JUDGE_ACCESS_CODE;

        if (accessCode === correctCode) {
            onSuccess();
            onClose();
        } else {
            setError('Access code incorrect. Please check your Devpost submission.');
        }
    };

    return (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-6 bg-black/90 backdrop-blur-3xl animate-in fade-in duration-300">
            <div className="relative w-full max-w-lg glass p-8 rounded-3xl border border-white/10 shadow-[0_0_100px_rgba(79,70,229,0.3)]">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400 mb-4">
                        Welcome Google Gemini 3 Judges! 🚀
                    </h2>
                    <p className="text-gray-300 text-sm leading-relaxed">
                        To ensure a smooth evaluation session and prioritize API resources for you, please enter the access code.
                    </p>
                    <div className="my-4 p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/30 text-lg font-bold text-indigo-200 shadow-[0_0_15px_rgba(79,70,229,0.1)]">
                        Code found at the top of our Devpost<br />
                        <span className="block mt-1 text-xl text-white">"Project Story"</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={accessCode}
                            onChange={(e) => {
                                setAccessCode(e.target.value);
                                setError('');
                            }}
                            placeholder="Enter Judge Access Code"
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono text-center tracking-widest"
                            autoFocus
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                        {error && (
                            <p className="mt-2 text-red-400 text-xs text-center font-medium animate-pulse">
                                {error}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)]"
                    >
                        Authenticate Access
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PasswordPopup;
