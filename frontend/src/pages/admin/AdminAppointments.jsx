import { useState, useEffect } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const AdminAppointments = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const columns = [
        {
            key: "patient",
            header: "Patient Name",
            render: (row) => `${row.firstName} ${row.lastName}`
        },
        { key: "department", header: "Department" },
        { key: "phone", header: "Phone" },
        { key: "date", header: "Date" },
        { key: "time", header: "Time" },
        {
            key: "status",
            header: "Status",
            render: (row) => {
                const colors = {
                    Confirmed: "bg-success/10 text-success border-success/20",
                    Pending: "bg-warning/10 text-warning border-warning/20",
                    Cancelled: "bg-destructive/10 text-destructive border-destructive/20",
                    Completed: "bg-primary/10 text-primary border-primary/20",
                    Read: "bg-info/10 text-info border-info/20",
                };
                return (
                    <Badge variant="outline" className={colors[row.status] || colors.Pending}>
                        {row.status || 'Pending'}
                    </Badge>
                );
            }
        },
    ];

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/appointments");
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Failed to load appointments");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            const response = await fetch(`http://localhost:5000/api/appointments/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                toast.success(`Patient marked as ${newStatus}`);
                fetchAppointments();
            } else {
                toast.error("Failed to update status");
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error("Connection error");
        }
    };

    const deleteAppointment = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/appointments/${id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                toast.success("Appointment deleted");
                fetchAppointments();
            } else {
                toast.error("Failed to delete appointment");
            }
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Connection error");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-display font-bold text-foreground">Appointments</h1>
                    <p className="text-muted-foreground">Manage patient appointments and schedules.</p>
                </div>
            </div>
            {loading ? (
                <p>Loading appointments...</p>
            ) : (
                <DataTable
                    columns={columns}
                    data={data}
                    searchKey="firstName"
                    onEdit={(row) => updateStatus(row._id, "Confirmed")} // Approve
                    onEditLabel="Approve"
                    onView={(row) => updateStatus(row._id, "Read")} // Mark as Read
                    onViewLabel="Mark as Read"
                    onDelete={(id) => deleteAppointment(id)}
                    onDeleteLabel="Reject"
                />
            )}
        </div>
    );
};

export default AdminAppointments;
