import React, { useEffect, useRef, useState } from 'react';
import { LogOut } from 'lucide-react';

const UserMenu = ({ user, onLogout }) => {
    const [open, setOpen] = useState(false);
    const rootRef = useRef(null);

    useEffect(() => {
        if (!open) return;

        const onDocMouseDown = (e) => {
            if (!rootRef.current) return;
            if (!rootRef.current.contains(e.target)) setOpen(false);
        };

        const onKeyDown = (e) => {
            if (e.key === 'Escape') setOpen(false);
        };

        document.addEventListener('mousedown', onDocMouseDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('mousedown', onDocMouseDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [open]);

    const seed = user?.name || user?.email || 'user';
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;

    return (
        <div ref={rootRef} className="relative">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="bg-blue-100 p-2 rounded-full border border-blue-200 hover:border-blue-300 transition-colors"
                aria-label="User menu"
                title="Menu"
            >
                <img src={avatarUrl} className="w-8 h-8 rounded-full" alt="avatar" />
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 shadow-xl rounded-2xl overflow-hidden z-50">
                    <button
                        type="button"
                        onClick={() => {
                            setOpen(false);
                            onLogout?.();
                        }}
                        className="w-full px-4 py-3 text-left flex items-center gap-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserMenu;