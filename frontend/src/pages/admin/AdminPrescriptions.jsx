import { useState, useEffect } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const AdminPrescriptions = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const columns = [
        { key: "patientName", header: "Patient" },
        {
            key: "problemName",
            header: "Assessment",
            render: (row) => row.problemName.replace("Problem name :- ", "")
        },
        {
            key: "medication",
            header: "Medication",
            render: (row) => row.medication.replace("Related medicine name :- ", "")
        },
        {
            key: "date",
            header: "Date",
            render: (row) => new Date(row.date).toLocaleDateString()
        },
        {
            key: "status",
            header: "Status",
            render: (row) => (
                <Badge variant={row.status === "Active" ? "default" : "secondary"}>
                    {row.status}
                </Badge>
            )
        },
    ];

    useEffect(() => {
        fetchPrescriptions();
    }, []);

    const fetchPrescriptions = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/prescriptions");
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Failed to load prescriptions");
        } finally {
            setLoading(false);
        }
    };

    const deletePrescription = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/prescriptions/${id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                toast.success("Prescription deleted");
                fetchPrescriptions();
            } else {
                toast.error("Failed to delete prescription");
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
                    <h1 className="text-3xl font-display font-bold text-foreground">Prescriptions</h1>
                    <p className="text-muted-foreground">View and manage patient prescriptions.</p>
                </div>
            </div>
            {loading ? (
                <p>Loading prescriptions...</p>
            ) : (
                <DataTable
                    columns={columns}
                    data={data}
                    searchKey="patientName"
                    onDelete={(id) => deletePrescription(id)}
                />
            )}
        </div>
    );
};

export default AdminPrescriptions;
