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
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ text_answer: "" });
    const [file, setFile] = useState(null);
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

        const sortedAssignments = res.data.sort((a, b) => {
            return b.is_active - a.is_active; // true > false
        });

        setAssignments(sortedAssignments);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
};


    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) setFile(files[0]);
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (assignmentId) => {
        setIsSubmitting(true);
        try {
            const data = new FormData();
            data.append("assignment", assignmentId);
            data.append("text_answer", formData.text_answer || "");
            if (file) data.append("submission_file", file);

            await axios.post(`${API_BASE_URL}/submissions/`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            alert("Submission successful!");
            setFormData({ text_answer: "" });
            setFile(null);
            setEditingId(null);
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
            a.download = fileName; // e.g., "assignment.pdf"
            document.body.appendChild(a);
            a.click();
            a.remove();

            window.URL.revokeObjectURL(url); // clean up
        } catch (error) {
            console.error("Download failed:", error);
        }
    };


    if (loading) return <Loading />;

    return (
        <div className="max-w-4xl mx-auto mt-20 space-y-6 pb-6 ">
            {assignments.map((a) => (
                <Card key={a.id} className="transition rounded-md shadow-none ">
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

                        {/* Submission Form */}
                        {a.is_active && (
                            <div className="mt-4 border-t pt-4">
                                <Input
                                    name="text_answer"
                                    placeholder="Write your answer..."
                                    value={formData.text_answer}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                />
                                <label className="flex items-center gap-2 cursor-pointer mt-2">
                                    <Button variant="outline" size="sm" asChild>
                                        <span>Upload File</span>
                                    </Button>
                                    <input
                                        type="file"
                                        name="submission_file"
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                </label>
                                {file && <p>{file.name}</p>}
                                <div className="flex justify-end gap-2 mt-2">
                                    <Button
                                        onClick={() => handleSubmit(a.id)}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Submitting..." : "Submit"}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default StudentAssignment;

