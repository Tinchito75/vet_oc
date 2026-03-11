import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Users, Calendar, Activity, Home, Receipt, TestTube2, PawPrint, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ModeToggle } from './mode-toggle';

export default function Layout() {
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const navItems = [
        { href: '/', label: 'Inicio', icon: Home },
        { href: '/patients', label: 'Pacientes 🐾', icon: PawPrint },
        { href: '/owners', label: 'Tutores', icon: Users },
        { href: '/schedule', label: 'Agenda', icon: Calendar },
        { href: '/estudios', label: 'Solicitar Estudios', icon: TestTube2 },
        { href: '/billing', label: 'Facturación', icon: Receipt },
        { href: '/admin', label: 'Dashboard', icon: Activity },
    ];

    const NavLink = ({ href, label, icon: Icon }: typeof navItems[0]) => {
        const isActive = location.pathname === href;
        return (
            <Link
                to={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                        ? "bg-slate-100 dark:bg-zinc-900 text-slate-900 dark:text-slate-100"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-slate-100"
                )}
            >
                <Icon size={18} />
                {label}
            </Link>
        );
    };

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-black">

            {/* ── DESKTOP SIDEBAR (hidden on mobile/tablet) ── */}
            <aside className="w-64 bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-zinc-800 hidden md:flex flex-col">
                <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex items-center gap-3">
                    <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
                    <div>
                        <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight">
                            Vet Ocular
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Dra. Sepúlveda</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => <NavLink key={item.href} {...item} />)}
                </nav>

                <div className="p-4 border-t border-slate-100 dark:border-zinc-800">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-zinc-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-xs">
                                GS
                            </div>
                            <div className="text-xs">
                                <p className="font-medium text-slate-700 dark:text-slate-200">Dra. Graciela</p>
                                <p className="text-slate-400">Veterinaria</p>
                            </div>
                        </div>
                        <ModeToggle />
                    </div>
                </div>
            </aside>

            {/* ── MOBILE / TABLET OVERLAY DRAWER ── */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-50 md:hidden bg-black/60 backdrop-blur-sm"
                    onClick={() => setMobileOpen(false)}
                >
                    <div
                        className="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-zinc-800 flex flex-col shadow-2xl animate-in slide-in-from-left duration-200"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Drawer header */}
                        <div className="p-5 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <img src="/logo.png" alt="Logo" className="h-9 w-auto" />
                                <div>
                                    <p className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-tight">Vet Ocular</p>
                                    <p className="text-xs text-slate-400">Dra. Sepúlveda</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setMobileOpen(false)}
                                className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Drawer nav */}
                        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                            {navItems.map((item) => <NavLink key={item.href} {...item} />)}
                        </nav>

                        {/* Drawer footer */}
                        <div className="p-4 border-t border-slate-100 dark:border-zinc-800">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-zinc-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-xs">
                                        GS
                                    </div>
                                    <div className="text-xs">
                                        <p className="font-medium text-slate-700 dark:text-slate-200">Dra. Graciela</p>
                                        <p className="text-slate-400">Veterinaria</p>
                                    </div>
                                </div>
                                <ModeToggle />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── MAIN CONTENT ── */}
            <main className="flex-1 flex flex-col min-w-0">

                {/* Mobile / tablet top bar */}
                <header className="md:hidden h-14 bg-white dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between px-4 sticky top-0 z-40">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="p-1.5 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            <Menu size={22} />
                        </button>
                        <img src="/logo.png" alt="Logo" className="h-7 w-auto" />
                        <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">Vet Ocular</span>
                    </div>
                    <ModeToggle />
                </header>

                <div className="flex-1 p-4 md:p-8 overflow-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
