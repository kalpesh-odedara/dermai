import {
    Users,
    Calendar,
    DollarSign,
    TrendingUp,
    Activity,
    ArrowUpRight
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const data = [
    { name: 'Mon', visits: 4000, revenue: 2400 },
    { name: 'Tue', visits: 3000, revenue: 1398 },
    { name: 'Wed', visits: 2000, revenue: 9800 },
    { name: 'Thu', visits: 2780, revenue: 3908 },
    { name: 'Fri', visits: 1890, revenue: 4800 },
    { name: 'Sat', visits: 2390, revenue: 3800 },
    { name: 'Sun', visits: 3490, revenue: 4300 },
];

const StatCard = ({ title, value, change, icon: Icon, trend }) => (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
                <Icon className="w-6 h-6 text-primary" />
            </div>
            <span className={`text-sm font-medium flex items-center gap-1 ${trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                {change}
                <ArrowUpRight className="w-4 h-4" />
            </span>
        </div>
        <h3 className="text-muted-foreground text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold mt-1 text-foreground">{value}</p>
    </div>
);

const AdminDashboard = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-display font-bold text-foreground">Dashboard Overview</h1>
                <p className="text-muted-foreground text-lg">Welcome back, Kalpesh Odedara. Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Patients" value="12,345" change="+12%" icon={Users} trend="up" />
                <StatCard title="Appointments" value="48" change="+5%" icon={Calendar} trend="up" />
                <StatCard title="Total Revenue" value="$84,232" change="+18%" icon={DollarSign} trend="up" />
                <StatCard title="Growth Rate" value="2.4%" change="+4%" icon={TrendingUp} trend="up" />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Chart */}
                <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-foreground">Patient Visits Overview</h2>
                        <select className="bg-muted/50 border-none rounded-lg text-sm p-2 outline-none">
                            <option>This Week</option>
                            <option>Last Week</option>
                            <option>This Month</option>
                        </select>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                                />
                                <Area type="monotone" dataKey="visits" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorVisits)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Side Chart */}
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-foreground mb-6">Revenue Source</h2>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                <XAxis dataKey="name" hide />
                                <Tooltip
                                    cursor={{ fill: 'hsl(var(--muted)/0.5)' }}
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                                />
                                <Bar dataKey="revenue" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Activity Section */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-foreground mb-6">Recent Activity</h2>
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center justify-between p-4 hover:bg-muted/30 rounded-lg transition-colors border border-transparent hover:border-border/50">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                    JS
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-foreground">John Smith scheduled an appointment</p>
                                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                                </div>
                            </div>
                            <Activity className="w-5 h-5 text-accent" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
