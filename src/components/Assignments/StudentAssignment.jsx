import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { AuthContext } from "@/contexts/authContext";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Archive, ImageIcon, MessageCircle, MoreVertical } from "lucide-react";
import { FaFilePdf, FaFileWord, FaFileAlt } from "react-icons/fa";

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogDescription,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import Loading from "@/Loading";


export const StudentAssignment = () => {
    const { API_BASE_URL, user } = useContext(AuthContext);
    const token = localStorage.getItem("accessToken");
    const { batchId } = useParams();

    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submissions, setSubmissions] = useState({});
    const [formData, setFormData] = useState({});
    const [files, setFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSubmissionForm, setShowSubmissionForm] = useState({});
    const [showSubmissions, setShowSubmissions] = useState({});
    const [editingSubmission, setEditingSubmission] = useState(null);
    const [removedFiles, setRemovedFiles] = useState([]);

    // People tab states
    const [people, setPeople] = useState(null);
    const [loadingPeople, setLoadingPeople] = useState(false);

    const [confirmDelete, setConfirmDelete] = useState({
        isOpen: false,
        submissionId: null,
        assignmentId: null,
    });

    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        fetchAssignments();
        if (batchId) {
            fetchPeople();
        }
    }, [batchId]);

    const fetchAssignments = async () => {
        setLoading(true);
        try {
            const url = batchId
                ? `${API_BASE_URL}/assignments/?batch=${batchId}`
                : `${API_BASE_URL}/assignments/`;

            const res = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const sortedAssignments = res.data.sort((a, b) => b.is_active - a.is_active);
            setAssignments(sortedAssignments);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchPeople = async () => {
        if (!batchId) return;

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

    const handleChange = (e, assignmentId) => {
        const { value, files: selectedFiles } = e.target;
        if (selectedFiles) {
            setFiles((prev) => ({
                ...prev,
                [assignmentId]: [...(prev[assignmentId] || []), ...Array.from(selectedFiles)],
            }));
        } else {
            setFormData((prev) => ({ ...prev, [assignmentId]: value }));
        }
    };

    const removeFile = (assignmentId, indexToRemove) => {
        setFiles((prev) => ({
            ...prev,
            [assignmentId]: prev[assignmentId].filter((_, idx) => idx !== indexToRemove),
        }));
    };

    const handleEditSubmission = (assignmentId, sub) => {
        setEditingSubmission(sub);

        setShowSubmissionForm((prev) => ({
            ...prev,
            [assignmentId]: true,
        }));

        setFormData((prev) => ({
            ...prev,
            [assignmentId]: sub.text_answer || "",
        }));

        setFiles((prev) => ({
            ...prev,
            [assignmentId]: [],
        }));

        setRemovedFiles([]);
    };

    const validateSubmission = (assignmentId) => {
        const text = formData[assignmentId] || "";
        const uploadedFiles = files[assignmentId] || [];

        if (!text && uploadedFiles.length === 0) {
            setModalMessage("Please provide an answer or upload at least one file.");
            setSubmitSuccess(true);
            setIsSuccess(false);
            return false;
        }

        const allowedTypes = ["pdf", "doc", "docx", "jpg", "png"];
        const invalidFiles = uploadedFiles.filter(f => {
            const ext = f.name.split(".").pop().toLowerCase();
            return !allowedTypes.includes(ext);
        });

        if (invalidFiles.length > 0) {
            setModalMessage("Some files have unsupported formats. Allowed: pdf, doc, docx, jpg, png.");
            setSubmitSuccess(true);
            setIsSuccess(false);
            return false;
        }

        const maxSizeMB = 5;
        const tooLargeFiles = uploadedFiles.filter(f => f.size > maxSizeMB * 1024 * 1024);
        if (tooLargeFiles.length > 0) {
            setModalMessage(`Some files exceed the maximum size of ${maxSizeMB}MB.`);
            setSubmitSuccess(true);
            setIsSuccess(false);
            return false;
        }

        return true;
    };

    const handleConfirmDelete = (submissionId, assignmentId) => {
        setConfirmDelete({ isOpen: true, submissionId, assignmentId });
    };

    const handleDeleteSubmission = async () => {
        const { submissionId, assignmentId } = confirmDelete;

        try {
            await axios.delete(`${API_BASE_URL}/submissions/${submissionId}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchSubmissions(assignmentId);
        } catch (err) {
            console.error("Delete failed", err);
        } finally {
            setConfirmDelete({ isOpen: false, submissionId: null, assignmentId: null });
        }
    };

    const handleSubmit = async (assignmentId) => {
        if (!validateSubmission(assignmentId)) return;

        setIsSubmitting(true);

        try {
            const data = new FormData();
            data.append("text_answer", formData[assignmentId] || "");

            if (files[assignmentId]) {
                files[assignmentId].forEach((f) =>
                    data.append("submission_file", f)
                );
            }

            if (editingSubmission) {
                await axios.patch(
                    `${API_BASE_URL}/submissions/${editingSubmission.id}/`,
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                setModalMessage("Submission updated successfully!");
            } else {
                data.append("assignment", assignmentId);

                await axios.post(
                    `${API_BASE_URL}/submissions/`,
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                setModalMessage("Submission successful!");
            }

            setIsSuccess(true);
            setSubmitSuccess(true);
            setEditingSubmission(null);
            setFormData((prev) => ({ ...prev, [assignmentId]: "" }));
            setFiles((prev) => ({ ...prev, [assignmentId]: [] }));
            setShowSubmissionForm((prev) => ({ ...prev, [assignmentId]: false }));
            fetchSubmissions(assignmentId);

        } catch (err) {
            console.error(err);
            setModalMessage("Failed to submit. Please try again.");
            setSubmitSuccess(true);
            setIsSuccess(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getFileTypeAndIcon = (url) => {
        const ext = url.split(".").pop()?.toLowerCase();
        if (!ext) return { type: "file", Icon: FileText, color: "text-gray-500" };

        if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext))
            return { type: "image", Icon: ImageIcon, color: "text-green-500" };

        if (["zip", "rar", "7z"].includes(ext)) return { type: "zip", Icon: Archive, color: "text-yellow-500" };

        if (["pdf"].includes(ext)) return { type: "pdf", Icon: FaFilePdf, color: "text-red-500" };

        if (["doc", "docx"].includes(ext)) return { type: "doc", Icon: FaFileWord, color: "text-blue-500" };

        return { type: ext, Icon: FaFileAlt, color: "text-gray-500" };
    };

    const downloadFile = async (url) => {
        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });

            if (!response.ok) throw new Error("Failed to fetch file");

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = url.split("/").pop();
            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(downloadUrl);
        } catch (err) {
            console.error("Download failed:", err);
            alert("Failed to download file.");
        }
    };

    const toggleSubmissionForm = (assignmentId) => {
        setShowSubmissionForm((prev) => ({ ...prev, [assignmentId]: !prev[assignmentId] }));
        if (!showSubmissionForm[assignmentId]) setShowSubmissions((prev) => ({ ...prev, [assignmentId]: false }));
    };

    const toggleSubmissions = (assignmentId) => {
        const isCurrentlyShowing = showSubmissions[assignmentId];
        if (!isCurrentlyShowing) fetchSubmissions(assignmentId);
        setShowSubmissions((prev) => ({ ...prev, [assignmentId]: !prev[assignmentId] }));
        if (!isCurrentlyShowing) setShowSubmissionForm((prev) => ({ ...prev, [assignmentId]: false }));
    };

    const fetchSubmissions = async (assignmentId) => {
        try {
            const res = await axios.get(`${API_BASE_URL}/assignments/${assignmentId}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const submissionsWithFiles = (res.data.submissions || []).map((sub) => ({
                ...sub,
                submission_file: Array.isArray(sub.submission_file) ? sub.submission_file : sub.submission_file ? [sub.submission_file] : [],
            }));

            setSubmissions((prev) => ({ ...prev, [assignmentId]: submissionsWithFiles }));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="max-w-4xl mx-auto mt-20 space-y-6 pb-6">
            <Tabs defaultValue="stream" className="w-full">
                <TabsList className="bg-muted/50 p-1 rounded-full gap-1">
                    <TabsTrigger
                        value="stream"
                        className="rounded-full px-6 py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                        Stream
                    </TabsTrigger>
                    <TabsTrigger
                        value="people"
                        className="rounded-full px-6 py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                        People
                    </TabsTrigger>
                </TabsList>

                {/* Stream Tab */}
                <TabsContent value="stream" className="space-y-6 mt-6">
                    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-[#1e88e5] via-[#42a5f5] to-[#90caf9] rounded-2xl">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />
                        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                        <div className="absolute -left-4 -bottom-4 h-24 w-24 rounded-full bg-white/5 blur-xl" />

                        <div className="relative z-10 p-6 md:p-8">
                            <Badge className="mb-4 bg-white/20 text-white border-0 backdrop-blur-sm hover:bg-white/30 transition-colors">
                                Assignments & Resources
                            </Badge>

                            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-2">
                                {assignments[0]?.batch_name || "Your Assignments"}
                            </h2>

                            <p className="text-white/80 text-sm md:text-base max-w-md">
                                Overview of assignments and resources
                            </p>
                        </div>
                    </Card>

                    {assignments.map((a) => {
                        const assignmentSubmissions = submissions[a.id] || [];
                        const isFormOpen = showSubmissionForm[a.id];
                        const isSubmissionsOpen = showSubmissions[a.id];

                        return (
                            <Card key={a.id} className="transition rounded-md shadow-none">
                                <CardHeader className="flex flex-col md:flex-row justify-between py-4 items-start md:items-center gap-2 md:gap-4">
                                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full">
                                        <div>
                                            <h3 className="text-lg font-semibold">{a.title}</h3>
                                            <p className="text-xs text-black/60 leading-tight flex items-center gap-1">
                                                <span>Batch: {a.batch_name}</span>
                                                <span>| Trainer: {a.trainer_name}</span>
                                                <span>| Due: {new Date(a.due_date).toLocaleDateString()}</span>
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-2 pb-4">
                                    {/* Assignment Files */}
                                    <div className="flex flex-row gap-1">
                                        {a.assignment_file?.length > 0 &&
                                            a.assignment_file.map((f, idx) => {
                                                const { type, Icon, color } = getFileTypeAndIcon(f.assignment_file);
                                                const fullFilename = f.assignment_file.split("/").pop();
                                                const dotIndex = fullFilename.lastIndexOf(".");
                                                const nameOnly = dotIndex !== -1 ? fullFilename.slice(0, dotIndex) : fullFilename;
                                                const extOnly = dotIndex !== -1 ? fullFilename.slice(dotIndex) : "";

                                                return (
                                                    <Button
                                                        key={idx}
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => downloadFile(f.assignment_file.replace(/^http:\/\/localhost:8000/, API_BASE_URL))}
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

                                    <p className="text-black/70 text-sm pt-2">{a.description}</p>

                                    {/* Action Buttons */}
                                    <div className="pt-3 border-t border-gray-200 flex justify-start gap-2">
                                        {a.is_active && (
                                            <Button
                                                size="sm"
                                                variant={isFormOpen ? "secondary" : "default"}
                                                onClick={() => {
                                                    if (isFormOpen) {
                                                        setEditingSubmission(null);
                                                        setRemovedFiles([]);
                                                        setFiles((prev) => ({ ...prev, [a.id]: [] }));
                                                        setFormData((prev) => ({ ...prev, [a.id]: "" }));
                                                    }
                                                    toggleSubmissionForm(a.id);
                                                }}
                                            >
                                                {isFormOpen ? "Close Form" : "Submit Assignment"}
                                            </Button>
                                        )}

                                        <Button
                                            size="sm"
                                            className="p-2"
                                            variant={isSubmissionsOpen ? "secondary" : "outlinee"}
                                            onClick={() => {
                                                if (!isSubmissionsOpen) {
                                                    setEditingSubmission(null);
                                                    setRemovedFiles([]);
                                                    setFiles((prev) => ({ ...prev, [a.id]: [] }));
                                                    setFormData((prev) => ({ ...prev, [a.id]: "" }));
                                                }
                                                toggleSubmissions(a.id);
                                            }}
                                        >
                                            {!isSubmissionsOpen && <MessageCircle className="w-4 h-4 mr-1" />}
                                            {isSubmissionsOpen ? "Hide Submissions" : "All Submissions"}
                                        </Button>
                                    </div>

                                    {/* Submission Form */}
                                    {isFormOpen && a.is_active && (
                                        <div className="mt-4 border-t pt-4 bg-gray-50 p-4 rounded-md">
                                            <Input
                                                name="text_answer"
                                                placeholder="Write your answer..."
                                                value={formData[a.id] || ""}
                                                onChange={(e) => handleChange(e, a.id)}
                                                disabled={isSubmitting}
                                            />

                                            <label className="flex items-center gap-2 cursor-pointer mt-2">
                                                <Button variant="outline" size="sm" asChild>
                                                    <span>Upload Files</span>
                                                </Button>
                                                <input type="file" name="submission_file" multiple onChange={(e) => handleChange(e, a.id)} className="hidden" />
                                            </label>

                                            {/* Existing Files (in edit mode) */}
                                            {editingSubmission?.submission_file
                                                ?.filter((f) => !removedFiles.includes(f.submission_file))
                                                .length > 0 && (
                                                    <div className="mt-2 space-y-1">
                                                        <p className="text-xs font-medium text-gray-600">Existing Files</p>

                                                        {editingSubmission.submission_file
                                                            .filter((f) => !removedFiles.includes(f.submission_file))
                                                            .map((f, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className="flex justify-between items-center text-sm bg-white border rounded px-2 py-1"
                                                                >
                                                                    <span className="truncate max-w-[200px]">
                                                                        {f.submission_file.split("/").pop()}
                                                                    </span>

                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            setRemovedFiles((prev) => [
                                                                                ...prev,
                                                                                f.submission_file,
                                                                            ])
                                                                        }
                                                                        className="text-red-500 text-xs hover:underline"
                                                                    >
                                                                        Remove
                                                                    </button>
                                                                </div>
                                                            ))}
                                                    </div>
                                                )}

                                            {/* New Files */}
                                            {files[a.id]?.length > 0 && (
                                                <div className="mt-2 space-y-1">
                                                    <p className="text-xs font-medium text-gray-600">New Files</p>

                                                    {files[a.id].map((f, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="flex justify-between items-center text-sm bg-white border rounded px-2 py-1"
                                                        >
                                                            <span className="truncate max-w-[200px]">{f.name}</span>

                                                            <button
                                                                type="button"
                                                                onClick={() => removeFile(a.id, idx)}
                                                                className="text-red-500 text-xs hover:underline"
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex justify-end gap-2 mt-3">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setEditingSubmission(null);
                                                        setRemovedFiles([]);
                                                        setFiles((prev) => ({ ...prev, [a.id]: [] }));
                                                        setFormData((prev) => ({ ...prev, [a.id]: "" }));
                                                        toggleSubmissionForm(a.id);
                                                    }}
                                                >
                                                    Cancel
                                                </Button>

                                                <Button size="sm" onClick={() => handleSubmit(a.id)} disabled={isSubmitting}>
                                                    {isSubmitting ? "Submitting..." : "Submit"}
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Submissions List */}
                                    {isSubmissionsOpen && (
                                        <div className="mt-4 space-y-2">
                                            {assignmentSubmissions.length > 0 ? (
                                                <>
                                                    <h4 className="font-medium text-sm text-gray-600">
                                                        Submissions ({assignmentSubmissions.length})
                                                    </h4>
                                                    {assignmentSubmissions.map((sub) => (
                                                        <div
                                                            key={sub.id}
                                                            className="border rounded-md bg-white p-3 shadow-sm hover:shadow-md transition"
                                                        >
                                                            <div className="flex justify-between items-center mb-1">
                                                                <div className="flex items-center gap-2">
                                                                    <p className="font-semibold text-sm text-gray-800">
                                                                        {sub.student_name}
                                                                    </p>

                                                                    {sub.is_late && (
                                                                        <Badge variant="destructive" className="text-xs px-2 py-0.5">
                                                                            Late
                                                                        </Badge>
                                                                    )}
                                                                </div>

                                                                {sub.is_you && (
                                                                    <DropdownMenu>
                                                                        <DropdownMenuTrigger asChild>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                className="h-8 w-1"
                                                                            >
                                                                                <MoreVertical className="h-4 w-4" />
                                                                            </Button>
                                                                        </DropdownMenuTrigger>

                                                                        <DropdownMenuContent align="end">
                                                                            <DropdownMenuItem
                                                                                onClick={() => handleEditSubmission(a.id, sub)}
                                                                            >
                                                                                Edit
                                                                            </DropdownMenuItem>

                                                                            <DropdownMenuItem
                                                                                onClick={() => handleConfirmDelete(sub.id, a.id)}
                                                                            >
                                                                                Delete
                                                                            </DropdownMenuItem>
                                                                        </DropdownMenuContent>
                                                                    </DropdownMenu>
                                                                )}
                                                            </div>

                                                            {sub.text_answer && (
                                                                <p className="text-gray-700 text-sm mb-1">
                                                                    <span className="font-medium">Answer:</span> {sub.text_answer}
                                                                </p>
                                                            )}

                                                            {sub.submission_file?.map((f, idx) => {
                                                                const fileUrl = f.submission_file;
                                                                if (!fileUrl) return null;

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
                                                                        onClick={() => downloadFile(fileUrl.replace(/^http:\/\/localhost:8000/, API_BASE_URL))}
                                                                        className="inline-flex items-center gap-1 px-2 py-1 shadow-md text-xs hover:bg-muted transition min-w-0 my-1"
                                                                    >
                                                                        <Icon className={`w-4 h-4 flex-shrink-0 ${color}`} />
                                                                        <span className="flex items-center gap-1 truncate max-w-[100px]">
                                                                            <span className="truncate">{nameOnly}</span>
                                                                            <span className="flex-shrink-0 text-muted-foreground">{extOnly}</span>
                                                                        </span>
                                                                    </Button>
                                                                );
                                                            })}

                                                            {(sub.trainer_feedback || sub.trainer_marks) && (
                                                                <div className="bg-blue-50 p-2 rounded text-gray-800 text-sm mt-2">
                                                                    {sub.trainer_feedback && (
                                                                        <p>
                                                                            <span className="font-medium">Feedback:</span> {sub.trainer_feedback}
                                                                        </p>
                                                                    )}
                                                                    {sub.trainer_marks && (
                                                                        <p>
                                                                            <span className="font-medium">Marks:</span> {sub.trainer_marks}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </>
                                            ) : (
                                                <div className="mt-4 p-4 bg-gray-50 rounded-md text-center text-gray-500 text-sm">
                                                    No submissions yet for this assignment.
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
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
                                            {people.teachers?.length || 0} teacher{people.teachers?.length !== 1 ? 's' : ''}
                                        </span>
                                    </div>

                                    <ul className="divide-y">
                                        {people.teachers?.map((t) => (
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
                                            {people.students_count || 0} student{people.students_count !== 1 ? 's' : ''}
                                        </span>
                                    </div>

                                    {people.students?.length === 0 ? (
                                        <p className="text-sm text-muted-foreground py-6 text-center">
                                            No students enrolled yet
                                        </p>
                                    ) : (
                                        <ul className="divide-y">
                                            {people.students?.map((s) => (
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

            {/* Dialog Modal */}
            <Dialog open={submitSuccess}>
                <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden [&>button]:hidden rounded-xl">
                    <DialogHeader className="px-5 pt-4 pb-4 space-y-1">
                        <DialogTitle className="text-xl pb-2 font-semibold">
                            {isSuccess ? "Success" : "Error"}
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

            <Dialog open={confirmDelete.isOpen} onOpenChange={(open) => setConfirmDelete(prev => ({ ...prev, isOpen: open }))}>
                <DialogContent className="sm:max-w-md p-5 [&>button]:hidden rounded-xl">
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this submission? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setConfirmDelete({ isOpen: false, submissionId: null, assignmentId: null })}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteSubmission}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default StudentAssignment;