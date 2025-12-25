import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../contexts/authContext";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loading from "@/Loading";

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

    useEffect(() => {
        fetchAssignment();
    }, [assignmentId]);

    const fetchAssignment = async () => {
        try {
            const res = await axios.get(
                `${API_BASE_URL}/assignments/${assignmentId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setAssignment(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEvaluate = async (submissionId) => {
        setSubmitting(true);
        try {
            await axios.patch(
                `${API_BASE_URL}/submissions/${submissionId}/evaluate/`,
                {
                    trainer_marks: marks,
                    trainer_feedback: feedback,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setOpenFormId(null);
            setMarks("");
            setFeedback("");
            fetchAssignment();
        } catch (err) {
            console.error(err);
            alert("Failed to submit feedback");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="max-w-4xl mx-auto mt-20 space-y-6 mb-4">
            {/* Assignment Info */}
            <Card className="shadow-none">
                <CardHeader>
                    <h2 className="text-xl font-semibold">{assignment.title}</h2>
                    <p className="text-sm text-gray-500">
                        Batch: {assignment.batch_name} | Due:{" "}
                        {new Date(assignment.due_date).toLocaleDateString()}
                    </p>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-700">{assignment.description}</p>
                </CardContent>
            </Card>

            {/* Submissions */}
            <h3 className="text-lg font-semibold">
                Submissions ({assignment.submissions.length})
            </h3>

            {assignment.submissions.map((s) => (
                <Card key={s.id} className="shadow-none">
                    <CardHeader className="flex justify-between">
                        <div>
                            <p className="font-medium">{s.student_name}</p>
                            <p className="text-xs text-gray-500">
                                Submitted on{" "}
                                {new Date(s.submitted_at).toLocaleString()}
                            </p>
                        </div>
                        {s.is_late && <Badge variant="red">Late</Badge>}
                    </CardHeader>

                    <CardContent className="space-y-3 pb-3">
                        {/* Student Content */}
                        {s.text_answer && (
                            <p className="text-gray-700">{s.text_answer}</p>
                        )}

                        {s.submission_file && (
                            <a
                                href={s.submission_file}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 underline text-sm"
                            >
                                View Submitted File
                            </a>
                        )}

                        {/* Trainer Feedback */}
                        {s.trainer_feedback && (
                            <div className="bg-blue-50 p-3 rounded text-sm">
                                <p>
                                    <strong>Feedback:</strong> {s.trainer_feedback}
                                </p>
                                <p>
                                    <strong>Marks:</strong> {s.trainer_marks}
                                </p>
                            </div>
                        )}

                        {/* Divider */}
                        {!s.trainer_feedback && <hr className="my-3" />}

                        {/* Actions Section */}
                        {!s.trainer_feedback && (
                            <div className="flex justify-end">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                        setOpenFormId(openFormId === s.id ? null : s.id)
                                    }
                                >
                                    {openFormId === s.id ? "Cancel" : "Add Feedback"}
                                </Button>
                            </div>
                        )}

                        {/* Inline Form (Footer Style) */}
                        {openFormId === s.id && (
                            <div className="mt-3 border rounded-md p-3 space-y-3 bg-gray-50">
                                <Input
                                    type="number"
                                    placeholder="Marks"
                                    value={marks}
                                    onChange={(e) => setMarks(e.target.value)}
                                    className="w-32"
                                />

                                <textarea
                                    rows={3}
                                    placeholder="Trainer feedback"
                                    className="border rounded-md p-2 w-full text-sm"
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                />

                                {/* Buttons Row */}
                                <div className="flex items-center gap-3">
                                    <Button
                                        size="sm"
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
        </div>
    );
};

export default AssignmentComments;
