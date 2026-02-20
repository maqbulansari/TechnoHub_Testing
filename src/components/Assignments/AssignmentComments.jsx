import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../contexts/authContext";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Archive, ImageIcon, MessageCircle, Download } from "lucide-react";
import { FaFilePdf, FaFileWord, FaFileAlt } from "react-icons/fa";
import Loading from "@/Loading";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

export const AssignmentComments = () => {
    const { assignmentId } = useParams();
    const { API_BASE_URL } = useContext(AuthContext);
    const token = localStorage.getItem("accessToken");

    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);

    const [openFormId, setOpenFormId] = useState(null);
    const [marks, setMarks] = useState("");
    const [feedback, setFeedback] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Validation states
    const [marksError, setMarksError] = useState("");
    const [feedbackError, setFeedbackError] = useState("");

    // Modal states
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    useEffect(() => {
        fetchAssignment();
    }, [assignmentId]);

    const fetchAssignment = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/assignments/${assignmentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAssignment(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const validate = () => {
        let valid = true;
        setMarksError("");
        setFeedbackError("");

        const marksNumber = Number(marks);
        if (!marks || isNaN(marksNumber) || marksNumber < 0 || marksNumber > 20) {
            setMarksError("Marks must be a number between 0 and 20");
            valid = false;
        }

        if (!feedback.trim()) {
            setFeedbackError("Feedback cannot be empty");
            valid = false;
        } else if (feedback.length > 500) {
            setFeedbackError("Feedback cannot exceed 500 characters");
            valid = false;
        }

        return valid;
    };

    const handleEvaluate = async (submissionId) => {
        if (!validate()) return;

        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("trainer_marks", Number(marks));
            formData.append("trainer_feedback", feedback);

            await axios.patch(
                `${API_BASE_URL}/submissions/${submissionId}/evaluate/`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setOpenFormId(null);
            setMarks("");
            setFeedback("");
            fetchAssignment();

            setModalMessage("Feedback submitted successfully!");
            setSubmitSuccess(true);
        } catch (err) {
            console.error(err);
            setModalMessage("Failed to submit feedback");
            setSubmitSuccess(true);
        } finally {
            setSubmitting(false);
        }
    };

    // File type and icon helper
    const getFileTypeAndIcon = (url) => {
        if (!url || typeof url !== 'string') {
            return { type: "file", Icon: FileText, color: "text-gray-500" };
        }

        const ext = url.split(".").pop()?.toLowerCase();
        if (!ext) return { type: "file", Icon: FileText, color: "text-gray-500" };

        if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext))
            return { type: "image", Icon: ImageIcon, color: "text-green-500" };

        if (["zip", "rar", "7z"].includes(ext))
            return { type: "zip", Icon: Archive, color: "text-yellow-500" };

        if (["pdf"].includes(ext))
            return { type: "pdf", Icon: FaFilePdf, color: "text-red-500" };

        if (["doc", "docx"].includes(ext))
            return { type: "doc", Icon: FaFileWord, color: "text-blue-500" };

        return { type: ext, Icon: FaFileAlt, color: "text-gray-500" };
    };

    // Reusable File Button Component
    const FileButton = ({ fileUrl, fileId }) => {
        if (!fileUrl) return null;

        const { Icon, color } = getFileTypeAndIcon(fileUrl);
        const fullFilename = fileUrl.split("/").pop() || "file";
        const dotIndex = fullFilename.lastIndexOf(".");
        const nameOnly = dotIndex !== -1 ? fullFilename.slice(0, dotIndex) : fullFilename;
        const extOnly = dotIndex !== -1 ? fullFilename.slice(dotIndex) : "";

        const handleDownload = () => {
            const link = document.createElement("a");
            link.href = fileUrl;
            link.download = fullFilename;
            link.target = "_blank";
            link.click();
        };

        return (
            <Button
                key={fileId}
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="inline-flex items-center gap-1 px-2 py-1 shadow-md text-xs hover:bg-muted transition min-w-0"
            >
                <Icon className={`w-4 h-4 flex-shrink-0 ${color}`} />
                <span className="flex items-center gap-1 truncate max-w-[100px]">
                    <span className="truncate">{nameOnly}</span>
                    <span className="flex-shrink-0 text-muted-foreground">{extOnly}</span>
                </span>
            </Button>
        );
    };

    if (loading) return <Loading />;

    if (!assignment) {
        return (
            <div className="max-w-4xl mx-auto mt-20 text-center">
                <p className="text-gray-500">Assignment not found</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto mt-20 space-y-6 mb-4">
            {/* Assignment Info */}
            <Card className="shadow-none">
                <CardHeader className="pt-4 pb-3">
                    <h2 className="text-xl font-semibold">{assignment.title}</h2>
                    <p className="text-xs text-black/60 leading-tight flex items-center gap-1">
                        Batch: {assignment.batch_name} | Due: {new Date(assignment.due_date).toLocaleDateString()}
                    </p>
                </CardHeader>
                <CardContent className="space-y-3">
                    <p className="text-black/70 text-sm">{assignment.description}</p>

                    {/* Assignment Files (uploaded by trainer) */}
                    {assignment.assignment_file && assignment.assignment_file.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700">Attached Files:</p>
                            <div className="flex flex-wrap gap-2">
                                {assignment.assignment_file.map((file) => (
                                    <FileButton
                                        key={file.id}
                                        fileId={file.id}
                                        fileUrl={file.assignment_file}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Submissions */}
            <h3 className="text-lg font-semibold">
                Submissions ({assignment.submissions?.length || 0})
            </h3>

            {assignment.submissions?.length === 0 && (
                <p className="text-gray-500 text-sm">No submissions yet</p>
            )}

            {assignment.submissions?.map((s) => (
                <Card key={s.id} className="shadow-none">
                    <CardHeader className="flex flex-col md:flex-row justify-between pt-4 pb-3 items-start md:items-center gap-2 md:gap-4">
                        <div>
                            <h3 className="font-medium">{s.student_name}</h3>
                            <p className="text-xs text-gray-500">
                                Submitted on {new Date(s.submitted_at).toLocaleString()}
                            </p>
                        </div>
                        {s.is_late && <Badge variant="destructive">Late</Badge>}
                    </CardHeader>

                    <CardContent className="space-y-3 pb-3">
                        {/* Text Answer */}
                        {s.text_answer && (
                            <p className="text-black/70 text-sm">{s.text_answer}</p>
                        )}

                        {/* Submission Files - FIXED: Use submission_file instead of assignment_file */}
                        {s.submission_file && s.submission_file.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {s.submission_file
                                    .filter((file) => file && file.submission_file) // Filter valid files
                                    .map((file) => (
                                        <FileButton
                                            key={file.id}
                                            fileId={file.id}
                                            fileUrl={file.submission_file} // ✅ CORRECT KEY
                                        />
                                    ))}
                            </div>
                        )}

                        {/* Trainer Feedback */}
                        {s.trainer_feedback && (
                            <div className="bg-gray-100 p-3 rounded-md">
                                <p className="text-black/70 text-sm">
                                    <span className="font-medium">Marks:</span> {parseInt(s.trainer_marks)}
                                </p>
                                <p className="text-black/70 text-sm mt-1">
                                    <span className="font-medium">Feedback:</span> {s.trainer_feedback}
                                </p>
                            </div>
                        )}

                        {/* Actions Section */}
                        {!s.trainer_feedback && (
                            <div className="pt-3 border-t border-gray-200 flex justify-start">
                                <Button
                                    size="sm"
                                    variant="outlin"
                                    className={`${openFormId === s.id ? "hidden" : ""}`}
                                    onClick={() => setOpenFormId(openFormId === s.id ? null : s.id)}
                                >
                                    <MessageCircle className="w-4 h-4 mr-1" /> Add Feedback
                                </Button>
                            </div>
                        )}

                        {/* Inline Form */}
                        {openFormId === s.id && (
                            <div className="mt-3 border rounded-md p-3 space-y-2">
                                <div className="flex flex-col">
                                    <Input
                                        type="number"
                                        placeholder="Marks (0-20)"
                                        value={marks}
                                        min={0}
                                        max={20}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value === '' || (Number(value) >= 0 && Number(value) <= 20)) {
                                                setMarks(value);
                                                setMarksError("");
                                            }
                                        }}
                                        className="w-32"
                                    />
                                    {marksError && <span className="text-red-500 text-xs mt-1">{marksError}</span>}
                                </div>

                                <div className="flex flex-col">
                                    <textarea
                                        rows={3}
                                        placeholder="Trainer feedback"
                                        className="border rounded-md p-2 w-full text-sm"
                                        value={feedback}
                                        onChange={(e) => {
                                            setFeedback(e.target.value);
                                            setFeedbackError("");
                                        }}
                                        maxLength={500}
                                    />
                                    <div className="flex justify-between items-center mt-1">
                                        {feedbackError && <span className="text-red-500 text-xs">{feedbackError}</span>}
                                        <span className="text-xs text-gray-400 ml-auto">{feedback.length}/500</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Button
                                        size="sm"
                                        variant="default"
                                        onClick={() => handleEvaluate(s.id)}
                                        disabled={submitting}
                                    >
                                        {submitting ? "Submitting..." : "Submit"}
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => {
                                            setOpenFormId(null);
                                            setMarks("");
                                            setFeedback("");
                                            setMarksError("");
                                            setFeedbackError("");
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}

            {/* Success/Error Modal */}
            <Dialog open={submitSuccess} onOpenChange={setSubmitSuccess}>
                <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden [&>button]:hidden rounded-xl">
                    <DialogHeader className="px-5 pt-4 pb-4 space-y-1">
                        <DialogTitle className="text-xl pb-2 font-semibold">
                            {modalMessage === "Feedback submitted successfully!" ? "Success" : "Error"}
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

export default AssignmentComments;