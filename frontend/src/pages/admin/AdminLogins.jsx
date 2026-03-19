import { useState, useEffect } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const AdminLogins = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const columns = [
        { key: "name", header: "Name" },
        { key: "email", header: "Email" },
        { key: "password", header: "Password" },
        {
            key: "createdAt",
            header: "Timestamp",
            render: (row) => new Date(row.createdAt).toLocaleString()
        },
    ];

    useEffect(() => {
        fetchLogins();
    }, []);

    const fetchLogins = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user-logins`);
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Failed to load login history");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-display font-bold text-foreground">Login History</h1>
                    <p className="text-muted-foreground">Monitor system access and security logs.</p>
                </div>
            </div>
            {loading ? (
                <p>Loading login history...</p>
            ) : (
                <DataTable columns={columns} data={data} searchKey="name" />
            )}
        </div>
    );
};

export default AdminLogins;
