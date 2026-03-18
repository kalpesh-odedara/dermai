import { useState, useEffect } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const AdminContacts = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedContact, setSelectedContact] = useState(null);
    const [isViewOpen, setIsViewOpen] = useState(false);

    const columns = [
        { key: "name", header: "Name" },
        { key: "email", header: "Email" },
        { key: "subject", header: "Subject" },
        {
            key: "status",
            header: "Status",
            render: (row) => (
                <Badge variant={row.status === "New" ? "default" : "secondary"}>
                    {row.status}
                </Badge>
            )
        },
        {
            key: "createdAt",
            header: "Date",
            render: (row) => new Date(row.createdAt).toLocaleDateString()
        },
    ];

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/contacts");
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Failed to load contacts from server");
        } finally {
            setLoading(false);
        }
    };

    const handleView = (contact) => {
        setSelectedContact(contact);
        setIsViewOpen(true);
        if (contact.status === "New") {
            handleStatusUpdate(contact._id, "Read");
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const response = await fetch(`http://localhost:5000/api/contacts/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            if (response.ok) {
                setData(data.map(c => c._id === id ? { ...c, status: newStatus } : c));
            }
        } catch (error) {
            console.error("Update error:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/contacts/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                toast.success("Contact deleted successfully");
                setData(data.filter(c => c._id !== id));
            } else {
                toast.error("Failed to delete contact");
            }
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Error connecting to server");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-display font-bold text-foreground">Contact Queries</h1>
                    <p className="text-muted-foreground">Manage incoming messages from the contact form.</p>
                </div>
            </div>
            {loading ? (
                <p>Loading messages...</p>
            ) : (
                <DataTable
                    columns={columns}
                    data={data}
                    searchKey="name"
                    onView={handleView}
                    onDelete={handleDelete}
                    onEdit={(row) => handleStatusUpdate(row._id, row.status === "New" ? "Read" : "New")}
                />
            )}

            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-display">Message Details</DialogTitle>
                        <DialogDescription>
                            Detailed view of the message from {selectedContact?.name}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedContact && (
                        <div className="space-y-6 mt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Name</p>
                                    <p className="text-foreground font-semibold">{selectedContact.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Email</p>
                                    <p className="text-foreground font-semibold">{selectedContact.email}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Phone</p>
                                    <p className="text-foreground font-semibold">{selectedContact.phone || "N/A"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Received On</p>
                                    <p className="text-foreground font-semibold">{new Date(selectedContact.createdAt).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="space-y-1 border-t pt-4 border-border">
                                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Subject</p>
                                <p className="text-foreground font-semibold text-lg">{selectedContact.subject}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Message</p>
                                <div className="p-4 rounded-xl bg-muted/50 text-foreground leading-relaxed">
                                    {selectedContact.message}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={() => setIsViewOpen(false)}>Close</Button>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminContacts;
