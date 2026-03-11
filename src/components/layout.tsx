import { Link, Outlet, useLocation } from 'react-router-dom';
import { Users, Calendar, Activity, Home, Receipt, TestTube2, PawPrint } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ModeToggle } from './mode-toggle';

export default function Layout() {
    const location = useLocation();

    const navItems = [
        { href: '/', label: 'Inicio', icon: Home },
        { href: '/patients', label: 'Pacientes 🐾', icon: PawPrint },
        { href: '/owners', label: 'Tutores', icon: Users },
        { href: '/schedule', label: 'Agenda', icon: Calendar },
        { href: '/estudios', label: 'Solicitar Estudios', icon: TestTube2 },
        { href: '/billing', label: 'Facturación', icon: Receipt },
        { href: '/admin', label: 'Dashboard', icon: Activity },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-black">
            {/* Sidebar */}
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
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-slate-100 dark:bg-zinc-900 text-slate-900 dark:text-slate-100"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-slate-100"
                                )}
                            >
                                <Icon size={18} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100 dark:border-zinc-800 space-y-4">
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

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                <header className="h-16 bg-white dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800 md:hidden flex items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
                        <h1 className="font-bold text-slate-800 dark:text-slate-100">Dra. Sepúlveda</h1>
                    </div>
                    <ModeToggle />
                </header>
                <div className="flex-1 p-8 overflow-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
