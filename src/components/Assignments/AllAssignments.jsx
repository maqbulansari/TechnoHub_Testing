import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/authContext";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import Loading from "@/Loading";
import { useNavigate, useParams } from "react-router-dom";

export const CreateAssignments = ({ onSuccess }) => {
    const { batchId } = useParams();


    const { API_BASE_URL, user } = useContext(AuthContext);
    const token = localStorage.getItem("accessToken");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const today = new Date().toISOString().split("T")[0];

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        due_date: today,
        assignment_file: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) setFormData({ ...formData, [name]: files[0] });
        else setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("description", formData.description);
            data.append("due_date", formData.due_date);
            data.append("batch", batchId);
            data.append("trainer", user.id);    
            if (formData.assignment_file) {
                data.append("assignment_file", formData.assignment_file);
            }

            await axios.post(`${API_BASE_URL}/assignments/`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            setFormData({
                title: "",
                description: "",
                due_date: today,
                assignment_file: null,
            });

            alert("Assignment created successfully!");
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error(err);
            alert("Failed to create assignment");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 pb-2 mt-2 shadow-none">
            <Input
                name="title"
                placeholder="Assignment Title"
                value={formData.title}
                onChange={handleChange}
                disabled={isSubmitting}
                required
            />
            <textarea
                name="description"
                rows={4}
                placeholder="Description"
                className="border rounded-md p-2 w-full"
                value={formData.description}
                onChange={handleChange}
                disabled={isSubmitting}
                required
            />
            <Input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                disabled={isSubmitting}
                min={today}
                required
            />
            <label className="flex items-center gap-2 cursor-pointer">
                <Button variant="outline" size="sm" asChild>
                    <span>Upload File</span>
                </Button>
                <input
                    type="file"
                    name="assignment_file"
                    onChange={handleChange}
                    className="hidden"
                />
            </label>
            {formData.assignment_file && (
                <p>{formData.assignment_file.name}</p>
            )}
            <div className="flex justify-end gap-2 mt-2">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Assignment"}
                </Button>
            </div>
        </form>
    );
};

export const AllAssignments = () => {
    const { API_BASE_URL } = useContext(AuthContext);
    const token = localStorage.getItem("accessToken");
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({});
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(true);

    const [filterBatch, setFilterBatch] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [openCreate, setOpenCreate] = useState(false);

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/assignments/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const re = await axios.get(`${API_BASE_URL}/assignments/${1}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const updatedData = res.data.map((a) => ({
                ...a,
                assignment_file: a.assignment_file
                    ? `${API_BASE_URL}${a.assignment_file.replace(/^http:\/\/localhost:8000/, "")}`
                    : null,
            }));
            setAssignments(updatedData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading />;

    const uniqueBatches = [...new Set(assignments.map((a) => a.batch_name))];

    const groupedByBatch = assignments
        .filter((a) => (filterBatch !== "all" ? a.batch_name === filterBatch : true))
        .filter((a) => {
            if (filterStatus === "all") return true;
            return filterStatus === "Active" ? a.is_active : !a.is_active;
        })
        .reduce((acc, a) => {
            acc[a.batch_name] = acc[a.batch_name] || [];
            acc[a.batch_name].push(a);
            return acc;
        }, {});

    return (
        <div className="max-w-4xl mx-auto mt-20 space-y-6">
            {/* Filters + Create Button */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex gap-2 items-center">
                    <Select value={filterBatch} onValueChange={setFilterBatch}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="All Batches" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Batches</SelectItem>
                            {uniqueBatches.map((batch) => (
                                <SelectItem key={batch} value={batch}>
                                    {batch}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Closed">Closed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Create Assignment Modal */}
                <Dialog open={openCreate} onOpenChange={setOpenCreate}>
                    <DialogTrigger asChild>
                        <Button variant="outlinegray">New Announcement</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Create Assignment</DialogTitle>
                        </DialogHeader>
                        <CreateAssignments
                            onSuccess={() => {
                                fetchAssignments();
                                setOpenCreate(false);
                            }}
                            batchId={null} // pass batchId if needed
                        />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Assignment Feed */}
            {Object.entries(groupedByBatch).map(([batchName, batchAssignments]) => (
                <div key={batchName} className="space-y-4">
                    <h2 className="text-xl font-semibold">{batchName}</h2>
                    {batchAssignments.map((a) => (
                        <Card key={a.id} className="transition rounded-md shadow-none bg-blue-50">
                            <CardHeader className="flex flex-col md:flex-row justify-between py-4 items-start md:items-center gap-2 md:gap-4">
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full">
                                    <div>
                                        <h3 className="text-lg font-semibold">{a.title}</h3>
                                        <p className="text-sm text-gray-500 flex flex-col md:flex-row md:items-center gap-2">
                                            <span>Posted by {a.trainer_name}</span>
                                            <span>| Due: <strong>{new Date(a.due_date).toLocaleDateString()}</strong></span>
                                        </p>
                                    </div>
                                </div>
                                <Badge variant={a.is_active ? "green" : "red"}>
                                    {a.is_active ? "Active" : "Closed"}
                                </Badge>
                            </CardHeader>
                            <CardContent className="space-y-2 pb-2">
                                {a.assignment_file && (
                                    <img
                                        src={a.assignment_file}
                                        alt="assignment"
                                        className="w-40 max-h-40 rounded border"
                                    />
                                )}

                                <p className="text-gray-700 pt-2">{a.description}</p>

                                {/* Read Comments Button */}
                                <div className="flex justify-end pt-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => navigate(`/AssignmentComments/${a.id}`)}
                                    >
                                        Read Comments
                                    </Button>
                                </div>
                            </CardContent>

                        </Card>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default AllAssignments;
