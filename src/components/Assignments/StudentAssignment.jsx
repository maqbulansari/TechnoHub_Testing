import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "@/contexts/authContext";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Archive, ImageIcon, MessageCircle } from "lucide-react";
import { FaFilePdf, FaFileWord, FaFileAlt } from "react-icons/fa";
import {
    Dialog,
    DialogTrigger,
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

    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submissions, setSubmissions] = useState({}); // {assignmentId: [submissions]}
    const [formData, setFormData] = useState({});
    const [files, setFiles] = useState({}); // {assignmentId: [File, ...]}
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSubmissionForm, setShowSubmissionForm] = useState({});
    const [showSubmissions, setShowSubmissions] = useState({});

    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [modalMessage, setModalMessage] = useState("");


    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/assignments/`, {
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

    const handleChange = (e, assignmentId) => {
        const { value, files: selectedFiles } = e.target;
        if (selectedFiles) {
            // Add multiple files
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

    const handleSubmit = async (assignmentId) => {
        setIsSubmitting(true);
        try {
            const data = new FormData();
            data.append("assignment", assignmentId);
            data.append("text_answer", formData[assignmentId] || "");

            if (files[assignmentId]) {
                files[assignmentId].forEach((f) => data.append("submission_file", f));
            }

            await axios.post(`${API_BASE_URL}/submissions/`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            setModalMessage("Submission successful!");
            setSubmitSuccess(true);

            setFormData((prev) => ({ ...prev, [assignmentId]: "" }));
            setFiles((prev) => ({ ...prev, [assignmentId]: [] }));
            setShowSubmissionForm((prev) => ({ ...prev, [assignmentId]: false }));
            fetchSubmissions(assignmentId);
        } catch (err) {
            console.error(err);
            setModalMessage("Failed to submit. Please try again.");
            setSubmitSuccess(true);
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
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // if your files need auth
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

            // Release memory
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

            // Ensure submission_file is always an array
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
                            <Badge variant={a.is_active ? "green" : "destructive"}>{a.is_active ? "Active" : "Closed"}</Badge>
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
                                    })} </div>

                            <p className="text-black/70 text-sm pt-2">{a.description}</p>

                            {/* Action Buttons */}
                            <div className="pt-3 border-t border-gray-200 flex justify-start gap-2">
                                {a.is_active && (
                                    <Button size="sm" variant={isFormOpen ? "secondary" : "default"} onClick={() => toggleSubmissionForm(a.id)}>
                                        {isFormOpen ? "Close Form" : "Submit Assignment"}
                                    </Button>
                                )}

                                <Button
                                    size="sm"
                                    className="p-2"
                                    variant={isSubmissionsOpen ? "secondary" : "outlin"}
                                    onClick={() => toggleSubmissions(a.id)}
                                >
                                    {isSubmissionsOpen ? "" : <MessageCircle className="w-4 h-4 mr-1" />}
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

                                    {files[a.id]?.length > 0 &&
                                        files[a.id].map((f, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-sm  mt-1">
                                                <span>{f.name}</span>
                                                <button type="button" onClick={() => removeFile(a.id, idx)}>✕</button>
                                            </div>
                                        ))}

                                    <div className="flex justify-end gap-2 mt-3">
                                        <Button size="sm" variant="outline" onClick={() => toggleSubmissionForm(a.id)}>
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
                                                        <p className="font-semibold text-sm text-gray-800">{sub.student_name}</p>
                                                        {sub.is_late && (
                                                            <Badge variant="destructive" className="text-xs px-2 py-0.5">
                                                                Late
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    {sub.text_answer && (
                                                        <p className="text-gray-700 text-sm mb-1">
                                                            <span className="font-medium">Answer:</span> {sub.text_answer}
                                                        </p>
                                                    )}

                                                    {/* Fixed submission files */}
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

            {/* Dialog Modal */}
            <Dialog open={submitSuccess}>
                <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden [&>button]:hidden rounded-xl">
                    <DialogHeader className="px-5 pt-4 pb-4 space-y-1">
                        <DialogTitle className="text-xl pb-2 font-semibold">
                            {modalMessage === "Submission successful!" ? "Success" : "Error"}
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

        </div>
    );
};

export default StudentAssignment;
