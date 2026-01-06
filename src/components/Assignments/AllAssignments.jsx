import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/authContext";

import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
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
    DialogDescription,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import Loading from "@/Loading";
import { useNavigate, useParams } from "react-router-dom";
import { FileText, Archive, ImageIcon, MessageCircle, Pen } from "lucide-react"
import { FaFilePdf, FaFileWord, FaFileAlt } from "react-icons/fa"


export const CreateAssignments = ({ onSuccess }) => {
    const { batchId } = useParams();
    const { API_BASE_URL, user } = useContext(AuthContext);
    const token = localStorage.getItem("accessToken");


    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const MAX_FILES = 4;

    const today = new Date().toISOString().split("T")[0];

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        due_date: today,
        assignment_file: [],
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (files) {
            const newFiles = Array.from(files);
            const totalFiles = formData.assignment_file.length + newFiles.length;

            if (totalFiles > MAX_FILES) {
                setModalMessage(`You can upload a maximum of ${MAX_FILES} files.`);
                setSubmitSuccess(true);
                return;
            }

            setFormData(prev => ({
                ...prev,
                [name]: [...prev[name], ...newFiles],
            }));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };


    const removeFile = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            assignment_file: prev.assignment_file.filter((_, idx) => idx !== indexToRemove)
        }));
    };

    const clearAllFiles = () => {
        setFormData(prev => ({
            ...prev,
            assignment_file: []
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user?.id) {
            setModalMessage("User not authenticated. Please login again.");
            setSubmitSuccess(true);
            return;
        }

        if (!batchId) {
            setModalMessage("Batch ID is missing.");
            setSubmitSuccess(true);
            return;
        }

        if (!token) {
            setModalMessage("Session expired. Please login again.");
            setSubmitSuccess(true);
            return;
        }

        setIsSubmitting(true);

        try {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("description", formData.description);
            data.append("due_date", formData.due_date);
            data.append("batch", batchId);
            data.append("trainer", user.id);

            formData.assignment_file.forEach(file => {
                data.append("assignment_file", file);
            });

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
                assignment_file: [],
            });

            setModalMessage("Announcement created successfully!");
            setSubmitSuccess(true);

        } catch (err) {
            console.error(err);
            setModalMessage("Failed to create assignment. Please try again.");
            setSubmitSuccess(true);
        } finally {
            setIsSubmitting(false);
        }
    };


    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    //  Show loading if user not yet loaded
    if (!user) {
        return <Loading />;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 pb-2 mt-2 shadow-none">
            <Input
                name="title"
                placeholder=" Announcement Title"
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

            {/* File Upload Section */}
            <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                    <Button type="button" variant="outline" size="sm" asChild>
                        <span>📁 Add Files</span>
                    </Button>
                    <input
                        type="file"
                        name="assignment_file"
                        onChange={handleChange}
                        className="hidden"
                        multiple
                        disabled={isSubmitting}
                    />
                </label>

                {formData.assignment_file?.length > 0 && (
                    <div className="border rounded-md p-3 space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">
                                {formData.assignment_file.length} file(s) selected
                            </span>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={clearAllFiles}
                            >
                                Clear All
                            </Button>
                        </div>

                        {/* Horizontal Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {formData.assignment_file.map((file, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between gap-2 bg-gray-50 p-2 rounded border"
                                >
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span>📄</span>
                                        <div className="min-w-0">
                                            <p className="text-sm truncate">
                                                {file.name}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {formatFileSize(file.size)}
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeFile(idx)}
                                        disabled={isSubmitting}
                                    >
                                        ✕
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>

            <div className="flex justify-end gap-2 mt-2">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create  Announcement"}
                </Button>
            </div>


            {/* Dialog Modal */}
            <Dialog open={submitSuccess}>
                <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden [&>button]:hidden rounded-xl">
                    <DialogHeader className="px-5 pt-4 pb-4 space-y-1">
                        <DialogTitle className="text-xl pb-2 font-semibold">
                            {modalMessage === "Announcement created successfully!" ? "Success" : "Error"}
                        </DialogTitle>
                        <DialogDescription className="text-sm pb-2 text-muted-foreground leading-relaxed">
                            {modalMessage}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="px-3 pb-3 bg-muted/30">
                        <Button onClick={() => setSubmitSuccess(false)} className="w-full sm:w-auto">
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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

    // People tab states
    const [people, setPeople] = useState(null);
    const [loadingPeople, setLoadingPeople] = useState(false);

    const { batchId } = useParams();

    useEffect(() => {
        fetchAssignments();
        fetchPeople();
    }, []);

    const fetchAssignments = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/assignments/?batch=${batchId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const updatedData = res.data.map((a) => ({
                ...a,
                assignment_file: a.assignment_file?.map(f => `${API_BASE_URL}${f.assignment_file.replace(/^http:\/\/localhost:8000/, "")}`) || [],
            }));

            setAssignments(updatedData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchPeople = async () => {
        setLoadingPeople(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/batch-people-by-id/${batchId}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPeople(res.data);
        } catch (err) {
            console.error("Failed to fetch people:", err);
        } finally {
            setLoadingPeople(false);
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

    // File type and icon helper
    const getFileTypeAndIcon = (url) => {
        if (typeof url !== "string") {
            return { type: "file", Icon: FileText, color: "text-gray-500" };
        }

        const ext = url.split(".").pop()?.toLowerCase();
        if (!ext) return { type: "file", Icon: FileText, color: "text-gray-500" };

        if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext))
            return { type: "image", Icon: ImageIcon, color: "text-green-500" };

        if (["zip", "rar", "7z"].includes(ext))
            return { type: "zip", Icon: Archive, color: "text-yellow-500" };

        if (["pdf"].includes(ext)) return { type: "pdf", Icon: FaFilePdf, color: "text-red-500" };

        if (["doc", "docx"].includes(ext)) return { type: "doc", Icon: FaFileWord, color: "text-blue-500" };

        return { type: ext, Icon: FaFileAlt, color: "text-gray-500" };
    };

    // Download helper
    const downloadFile = async (file) => {
        const files = Array.isArray(file)
            ? file
            : typeof file === "string"
                ? [file]
                : file?.assignment_file
                    ? [file.assignment_file]
                    : [];

        for (const url of files) {
            if (!url) continue;

            try {
                const response = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`
                    }
                });
                const blob = await response.blob();

                const link = document.createElement("a");
                const filename = url.split("/").pop();
                link.href = window.URL.createObjectURL(blob);
                link.download = filename;

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                window.URL.revokeObjectURL(link.href);
            } catch (err) {
                console.error("Failed to download file:", err);
                alert("Failed to download file. Try again.");
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-20 space-y-6">
            <Tabs defaultValue="stream" className="w-full">
                <TabsList>
                    <TabsTrigger value="stream">Stream</TabsTrigger>
                    <TabsTrigger value="people">People</TabsTrigger>
                </TabsList>

                {/* Stream Tab */}
                <TabsContent value="stream" className="space-y-6 mt-6">
                    {/* Filters + Create Button */}
                    <div className="flex justify-between items-center gap-4">
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

                        {/* Create Assignment Modal */}
                        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
                            <DialogTrigger asChild>
                                <Button variant="outlinegray">
                                    <Pen className="w-2 h-4" /> New Announcement
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                    <DialogTitle>Create Announcement</DialogTitle>
                                </DialogHeader>
                                <CreateAssignments
                                    onSuccess={() => {
                                        fetchAssignments();
                                        setOpenCreate(false);
                                    }}
                                    batchId={null}
                                />
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Assignment Feed */}
                    {Object.entries(groupedByBatch).map(([batchName, batchAssignments]) => (
                        <div key={batchName} className="space-y-4">
                            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-[#1e88e5] via-[#42a5f5] to-[#90caf9] rounded-2xl">
                                {/* Decorative elements */}
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />
                                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                                <div className="absolute -left-4 -bottom-4 h-24 w-24 rounded-full bg-white/5 blur-xl" />

                                <div className="relative z-10 p-6 md:p-8">
                                    <Badge className="mb-4 bg-white/20 text-white border-0 backdrop-blur-sm hover:bg-white/30 transition-colors">
                                        Assignments & Resources
                                    </Badge>

                                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-2">
                                        {batchName}
                                    </h2>

                                    <p className="text-white/80 text-sm md:text-base max-w-md">
                                        Overview of assignments and resources
                                    </p>
                                </div>
                            </Card>

                            {batchAssignments.map((a) => (
                                <Card key={a.id} className="transition rounded-md shadow-none">
                                    <CardHeader className="flex flex-col md:flex-row justify-between pt-4 pb-3 items-start md:items-center gap-2 md:gap-4">
                                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full">
                                            <div>
                                                <h3 className="text-lg font-semibold">{a.title}</h3>
                                                <p className="text-xs text-black/50 leading-tight flex items-center gap-1">
                                                    <span>Posted by {a.trainer_name}</span>
                                                    <span className="opacity-60">•</span>
                                                    <span>
                                                        Due <strong className="font-medium">
                                                            {new Date(a.due_date).toLocaleDateString()}
                                                        </strong>
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                        {/* <Badge variant={a.is_active ? "green" : "red"}>
                                            {a.is_active ? "Active" : "Closed"}
                                        </Badge> */}
                                    </CardHeader>
                                    <CardContent className="space-y-2 pb-2">
                                        <div className="flex flex-row gap-1">
                                            {a.assignment_file?.map((fileUrl, idx) => {
                                                const { type, Icon, color } = getFileTypeAndIcon(fileUrl);

                                                const fullFilename = fileUrl.split("/").pop();
                                                const dotIndex = fullFilename.lastIndexOf(".");
                                                const nameOnly = dotIndex !== -1 ? fullFilename.slice(0, dotIndex) : fullFilename;
                                                const extOnly = dotIndex !== -1 ? fullFilename.slice(dotIndex) : "";

                                                return (
                                                    <Button
                                                        key={idx}
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => downloadFile(fileUrl)}
                                                        className="inline-flex items-center gap-1 px-2 py-1 shadow-md text-xs hover:bg-muted transition min-w-0"
                                                    >
                                                        <Icon className={`w-4 h-4 flex-shrink-0 ${color}`} />
                                                        <span className="flex items-center gap-1 truncate max-w-[100px]">
                                                            <span className="truncate">{nameOnly}</span>
                                                            <span className="flex-shrink-0 text-muted-foreground">{extOnly}</span>
                                                        </span>
                                                    </Button>
                                                );
                                            })}
                                        </div>

                                        {/* Read Comments Button */}
                                        <div className="pt-3 border-t border-gray-200 flex justify-start">
                                            <Button
                                                size="sm"
                                                variant="outlin"
                                                className="p-0"
                                                onClick={() => navigate(`/AssignmentComments/${a.id}`)}
                                            >
                                                <MessageCircle className="w-4 h-4" />
                                                Read Comments
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ))}
                </TabsContent>

                {/* People Tab */}
                <TabsContent value="people" className="mt-6">
                    <div className="space-y-6">
                        {loadingPeople ? (
                            <Loading />
                        ) : people ? (
                            <div className="space-y-8">
                                {/* Teachers Section */}
                                <div>
                                    <div className="flex items-center justify-between pb-3 border-b-2">
                                        <h3 className="text-lg font-medium">Teachers</h3>
                                        <span className="text-sm text-muted-foreground">
                                            {people.teachers.length} teacher{people.teachers.length !== 1 ? 's' : ''}
                                        </span>
                                    </div>

                                    <ul className="divide-y">
                                        {people.teachers.map((t) => (
                                            <li key={t.id} className="flex items-center gap-4 py-4">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium flex items-center gap-2">
                                                        {t.name}
                                                        {t.its_you && (
                                                            <span className="text-xs text-muted-foreground">(You)</span>
                                                        )}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground truncate">{t.email}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Students Section */}
                                <div>
                                    <div className="flex items-center justify-between pb-3 border-b-2">
                                        <h3 className="text-lg font-medium">Students</h3>
                                        <span className="text-sm text-muted-foreground">
                                            {people.students_count} student{people.students_count !== 1 ? 's' : ''}
                                        </span>
                                    </div>

                                    {people.students.length === 0 ? (
                                        <p className="text-sm text-muted-foreground py-6 text-center">
                                            No students enrolled yet
                                        </p>
                                    ) : (
                                        <ul className="divide-y">
                                            {people.students.map((s) => (
                                                <li key={s.id} className="flex items-center gap-4 py-4">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium flex items-center gap-2">
                                                            {s.name}
                                                            {s.its_you && (
                                                                <span className="text-xs text-muted-foreground">(You)</span>
                                                            )}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground truncate">{s.email}</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p className="text-center text-muted-foreground py-6">No data found.</p>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AllAssignments;