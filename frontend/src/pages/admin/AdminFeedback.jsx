import { useState, useEffect } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Star } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const AdminFeedback = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [isViewOpen, setIsViewOpen] = useState(false);

    const columns = [
        { key: "name", header: "Name" },
        { key: "email", header: "Email" },
        {
            key: "rating",
            header: "Rating",
            render: (row) => (
                <div className="flex items-center gap-1">
                    <span className="font-bold">{row.rating}</span>
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                </div>
            )
        },
        {
            key: "createdAt",
            header: "Date",
            render: (row) => new Date(row.createdAt).toLocaleDateString()
        },
    ];

    useEffect(() => {
        fetchFeedback();
    }, []);

    const fetchFeedback = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL;
            const response = await fetch(`${API_URL}/api/feedback`);
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Failed to load feedback from server");
        } finally {
            setLoading(false);
        }
    };

    const handleView = (feedback) => {
        setSelectedFeedback(feedback);
        setIsViewOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            // Reusing existing patterns if DELETE route exists, otherwise just local filter for now
            // Checking server.js I didn't see a DELETE /api/feedback route, but I'll add one if needed.
            // For now, let's keep it consistent with the existing admin pages.
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/feedback/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                toast.success("Feedback deleted successfully");
                setData(data.filter(f => f._id !== id));
            } else {
                toast.error("Failed to delete feedback");
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
                    <h1 className="text-3xl font-display font-bold text-foreground">User Feedback</h1>
                    <p className="text-muted-foreground">Monitor and manage patient feedback from the services page.</p>
                </div>
            </div>
            {loading ? (
                <p>Loading feedback...</p>
            ) : (
                <DataTable
                    columns={columns}
                    data={data}
                    searchKey="name"
                    onView={handleView}
                    onDelete={handleDelete}
                />
            )}

            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-display">Feedback Details</DialogTitle>
                        <DialogDescription>
                            Detailed view of feedback from {selectedFeedback?.name}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedFeedback && (
                        <div className="space-y-6 mt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Name</p>
                                    <p className="text-foreground font-semibold">{selectedFeedback.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Email</p>
                                    <p className="text-foreground font-semibold">{selectedFeedback.email}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Rating</p>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star
                                                key={s}
                                                className={`w-5 h-5 ${s <= selectedFeedback.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Submitted On</p>
                                    <p className="text-foreground font-semibold">{new Date(selectedFeedback.createdAt).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="space-y-2 border-t pt-4 border-border">
                                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Message</p>
                                <div className="p-4 rounded-xl bg-muted/50 text-foreground leading-relaxed whitespace-pre-wrap">
                                    {selectedFeedback.message}
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

export default AdminFeedback;
