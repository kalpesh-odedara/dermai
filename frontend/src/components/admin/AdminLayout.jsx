import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Users,
    Calendar,
    FileText,
    MessageSquare,
    Menu,
    X,
    LogOut,
    Bell,
    Search,
    Star,
    MessageCircle,
    CheckCircle2,
    CalendarCheck2,
    ArrowRight
} from "lucide-react";



import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


const sidebarLinks = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Appointments", path: "/admin/appointments", icon: Calendar },
    { name: "Prescriptions", path: "/admin/prescriptions", icon: FileText },
    { name: "Messages", path: "/admin/contacts", icon: MessageSquare },
    { name: "Login History", path: "/admin/logins", icon: LogOut },
    { name: "Feedback", path: "/admin/feedback", icon: Star },
];


export const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Polling every 30s
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/admin/notifications");
            const data = await response.json();
            setNotifications(data);
        } catch (error) {
            console.error("Notification fetch error:", error);
        }
    };

    const markAsRead = async (notif) => {
        try {
            let endpoint = "";
            let body = {};

            if (notif.type === "Contact") {
                endpoint = `http://localhost:5000/api/contacts/${notif.id}`;
                body = { status: "Read" };
            } else if (notif.type === "Feedback") {
                endpoint = `http://localhost:5000/api/feedback/${notif.id}`;
                body = { status: "Read" };
            } else if (notif.type === "Appointment") {
                endpoint = `http://localhost:5000/api/appointments/${notif.id}`;
                body = { status: "Confirmed" };
            }

            const response = await fetch(endpoint, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                setNotifications(notifications.filter(n => n.id !== notif.id));
                navigate(notif.link);
            }
        } catch (error) {
            console.error("Mark as read error:", error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case "Contact": return <MessageCircle className="w-4 h-4 text-primary" />;
            case "Feedback": return <CheckCircle2 className="w-4 h-4 text-success" />;
            case "Appointment": return <CalendarCheck2 className="w-4 h-4 text-warning" />;
            default: return <Bell className="w-4 h-4" />;
        }
    };


    return (
        <div className="min-h-screen bg-muted/30 flex">
            {/* Sidebar */}
            <motion.aside
                initial={{ width: 280 }}
                animate={{ width: isSidebarOpen ? 280 : 80 }}
                className="bg-card border-r border-border h-screen sticky top-0 hidden lg:flex flex-col z-40 transition-all duration-300"
            >
                <div className="p-6 flex items-center justify-between border-b border-border/50">
                    {isSidebarOpen ? (
                        <span className="font-display font-bold text-xl text-primary flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                                D
                            </div>
                            DermaCare
                        </span>
                    ) : (
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground mx-auto">
                            D
                        </div>
                    )}
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors">
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {sidebarLinks.map((link) => {
                        const isActive = location.pathname === link.path;
                        const Icon = link.icon;

                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${isActive
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                            >
                                <Icon size={20} className={isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"} />
                                {isSidebarOpen && (
                                    <span className="font-medium whitespace-nowrap">
                                        {link.name}
                                    </span>
                                )}
                                {isActive && <motion.div layoutId="activeTab" className="absolute inset-0 bg-primary z-[-1]" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border/50">
                    <button
                        onClick={() => {
                            localStorage.removeItem("isAdmin");
                            window.location.href = "/admin/login";
                        }}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full text-destructive hover:bg-destructive/10 transition-colors ${!isSidebarOpen && 'justify-center'}`}
                    >
                        <LogOut size={20} />
                        {isSidebarOpen && <span className="font-medium">Logout</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
                {/* Header */}
                <header className="bg-card/80 backdrop-blur-xl border-b border-border sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 lg:hidden">
                        <Button variant="ghost" size="icon" className="lg:hidden">
                            <Menu size={20} />
                        </Button>
                        <span className="font-display font-bold text-lg text-primary">DermaCare</span>
                    </div>

                    <div className="hidden lg:flex items-center bg-muted/50 rounded-full px-4 py-2 w-96 border border-transparent focus-within:border-primary/20 focus-within:bg-card transition-all">
                        <Search size={18} className="text-muted-foreground mr-2" />
                        <input
                            type="text"
                            placeholder="Search patients, appointments..."
                            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground/70"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary">
                                    <Bell size={20} />
                                    {notifications.length > 0 && (
                                        <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-destructive border-2 border-card animate-pulse"></span>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-80 p-0 rounded-2xl shadow-2xl border-border bg-card/95 backdrop-blur-sm">
                                <div className="p-4 border-b border-border/50 bg-muted/30">
                                    <DropdownMenuLabel className="font-display font-bold text-base flex items-center justify-between p-0">
                                        Notifications
                                        {notifications.length > 0 && (
                                            <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                                                {notifications.length} New
                                            </span>
                                        )}
                                    </DropdownMenuLabel>
                                </div>
                                <div className="max-h-[400px] overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="p-8 text-center">
                                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                                                <Bell className="w-6 h-6 text-muted-foreground/50" />
                                            </div>
                                            <p className="text-sm font-medium text-muted-foreground">All caught up!</p>
                                        </div>
                                    ) : (
                                        notifications.map((notif) => (
                                            <DropdownMenuItem
                                                key={notif.id}
                                                onClick={() => markAsRead(notif)}
                                                className="p-4 cursor-pointer hover:bg-muted/50 transition-colors border-b border-border/30 last:border-0"
                                            >
                                                <div className="flex gap-4 w-full">
                                                    <div className="w-10 h-10 rounded-xl bg-muted flex-shrink-0 flex items-center justify-center">
                                                        {getIcon(notif.type)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between mb-0.5">
                                                            <p className="text-xs font-bold text-primary uppercase tracking-tight">{notif.type}</p>
                                                            <p className="text-[10px] text-muted-foreground font-medium">{new Date(notif.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                        </div>
                                                        <p className="text-sm font-semibold text-foreground truncate">{notif.sender}</p>
                                                        <p className="text-[11px] text-muted-foreground truncate">{notif.title}</p>
                                                    </div>
                                                    <ArrowRight className="w-3 h-3 text-muted-foreground/30 self-center" />
                                                </div>
                                            </DropdownMenuItem>
                                        ))
                                    )}
                                </div>
                                <DropdownMenuSeparator className="bg-border/50" />
                                <div className="p-2">
                                    <Button variant="ghost" className="w-full text-xs font-bold text-primary hover:bg-primary/10 rounded-xl" onClick={() => navigate('/admin/appointments')}>
                                        View All Activity
                                    </Button>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div className="h-8 w-[1px] bg-border mx-2 hidden sm:block"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-foreground">Kalpesh Odedara</p>
                                <p className="text-xs text-muted-foreground">Admin</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
