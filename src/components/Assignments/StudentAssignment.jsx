import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "@/contexts/authContext";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loading from "@/Loading";

export const StudentAssignment = () => {
    const { API_BASE_URL, user } = useContext(AuthContext);
    const token = localStorage.getItem("accessToken");

    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submissions, setSubmissions] = useState({}); // {assignmentId: [submissions]}
    const [formData, setFormData] = useState({});
    const [file, setFile] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        const { value, files } = e.target;
        if (files) setFile((prev) => ({ ...prev, [assignmentId]: files[0] }));
        setFormData((prev) => ({ ...prev, [assignmentId]: value }));
    };

    const handleSubmit = async (assignmentId) => {
        setIsSubmitting(true);
        try {
            const data = new FormData();
            data.append("assignment", assignmentId);
            data.append("text_answer", formData[assignmentId] || "");
            if (file[assignmentId]) data.append("submission_file", file[assignmentId]);

            await axios.post(`${API_BASE_URL}/submissions/`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            alert("Submission successful!");
            setFormData((prev) => ({ ...prev, [assignmentId]: "" }));
            setFile((prev) => ({ ...prev, [assignmentId]: null }));
            fetchSubmissions(assignmentId); // fetch all submissions immediately
        } catch (err) {
            console.error(err);
            alert("Failed to submit");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDownload = async (fileUrl, fileName) => {
        try {
            const response = await fetch(fileUrl);
            if (!response.ok) throw new Error("Network response was not ok");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed:", error);
        }
    };

    // Fetch all submissions for an assignment
    const fetchSubmissions = async (assignmentId) => {
        try {
            const res = await axios.get(`${API_BASE_URL}/assignments/${assignmentId}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setSubmissions((prev) => ({
                ...prev,
                [assignmentId]: res.data.submissions || [],
            }));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="max-w-4xl mx-auto mt-20 space-y-6 pb-6">
            {assignments.map((a) => {
                const assignmentSubmissions = submissions[a.id] || [];

                return (
                    <Card key={a.id} className="transition rounded-md shadow-none">
                        <CardHeader className="flex flex-col md:flex-row justify-between py-4 items-start md:items-center gap-2 md:gap-4">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full">
                                <div>
                                    <h3 className="text-lg font-semibold">{a.title}</h3>
                                    <p className="text-sm text-gray-500 flex flex-col md:flex-row md:items-center gap-2">
                                        <span>Batch: {a.batch_name}</span>
                                        <span>| Trainer: {a.trainer_name}</span>
                                        <span>| Due: {new Date(a.due_date).toLocaleDateString()}</span>
                                    </p>
                                </div>
                            </div>
                            <Badge variant={a.is_active ? "green" : "destructive"}>
                                {a.is_active ? "Active" : "Closed"}
                            </Badge>
                        </CardHeader>

                        <CardContent className="space-y-2 pb-2">
                            {a.assignment_file && (
                                <button
                                    onClick={() =>
                                        handleDownload(
                                            a.assignment_file.replace(/^http:\/\/localhost:8000/, API_BASE_URL),
                                            a.title + ".pdf"
                                        )
                                    }
                                    className="text-blue-600 underline"
                                >
                                    Download Assignment File
                                </button>
                            )}
                            {a.assignment_file && (
                                <img
                                    src={a.assignment_file.replace(/^http:\/\/localhost:8000/, API_BASE_URL)}
                                    alt="assignment"
                                    className="w-40 max-h-40 rounded border"
                                />
                            )}
                            <p className="text-gray-700 pt-2">{a.description}</p>

                            {/* Button to fetch all submissions */}
                            {assignmentSubmissions.length === 0 && (
                                <div className="mt-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => fetchSubmissions(a.id)}
                                    >
                                        Show All Submissions
                                    </Button>
                                </div>
                            )}

                            {/* Render all submissions */}

                            {assignmentSubmissions.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    {assignmentSubmissions.map((sub) => (
                                        <div
                                            key={sub.id}
                                            className="border rounded-md bg-white p-3 shadow-sm hover:shadow-md transition"
                                        >
                                            {/* Header */}
                                            <div className="flex justify-between items-center mb-1">
                                                <p className="font-semibold text-sm text-gray-800">{sub.student_name}</p>
                                                {sub.is_late && (
                                                    <Badge variant="destructive" className="text-xs px-2 py-0.5">
                                                        Late
                                                    </Badge>
                                                )}
                                            </div>

                                            {/* Answer */}
                                            {sub.text_answer && (
                                                <p className="text-gray-700 text-sm mb-1">
                                                    <span className="font-medium">Answer:</span> {sub.text_answer}
                                                </p>
                                            )}

                                            {/* Submitted File */}
                                            {sub.submission_file && (
                                                <a
                                                    href={sub.submission_file.replace(/^http:\/\/localhost:8000/, API_BASE_URL)}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-blue-600 underline text-sm mb-1 inline-block"
                                                >
                                                    View Submitted File
                                                </a>
                                            )}

                                            {/* Feedback and Marks */}
                                            {(sub.trainer_feedback || sub.trainer_marks) && (
                                                <div className="bg-blue-50 p-2 rounded text-gray-800 text-sm mt-1">
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
                                </div>
                            )}




                            {/* Submission Form */}
                            {a.is_active && (
                                <div className="mt-4 border-t pt-4">
                                    <Input
                                        name="text_answer"
                                        placeholder="Write your answer..."
                                        value={formData[a.id] || ""}
                                        onChange={(e) => handleChange(e, a.id)}
                                        disabled={isSubmitting}
                                    />
                                    <label className="flex items-center gap-2 cursor-pointer mt-2">
                                        <Button variant="outline" size="sm" asChild>
                                            <span>Upload File</span>
                                        </Button>
                                        <input
                                            type="file"
                                            name="submission_file"
                                            onChange={(e) => handleChange(e, a.id)}
                                            className="hidden"
                                        />
                                    </label>
                                    {file[a.id] && <p>{file[a.id].name}</p>}
                                    <div className="flex justify-end gap-2 mt-2">
                                        <Button onClick={() => handleSubmit(a.id)} disabled={isSubmitting}>
                                            {isSubmitting ? "Submitting..." : "Submit"}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};

export default StudentAssignment;
