import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../contexts/authContext";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Archive, ImageIcon, MessageCircle } from "lucide-react";
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
      await axios.patch(
        `${API_BASE_URL}/submissions/${submissionId}/evaluate/`,
        {
          trainer_marks: Number(marks),
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

      // Show success modal
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
  const downloadFile = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop();
    link.click();
  };

  if (loading) return <Loading />;

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
        <CardContent>
          <p className="text-black/70 text-sm pt-2">{assignment.description}</p>
        </CardContent>
      </Card>

      {/* Submissions */}
      <h3 className="text-lg font-semibold">Submissions ({assignment.submissions.length})</h3>

      {assignment.submissions.map((s) => (
        <Card key={s.id} className="shadow-none">
          <CardHeader className="flex flex-col md:flex-row justify-between pt-4 pb-3 items-start md:items-center gap-2 md:gap-4">
            <div>
              <h3 className="font-medium">{s.student_name}</h3>
              <p className="text-xs text-gray-500">
                Submitted on {new Date(s.submitted_at).toLocaleString()}
              </p>
            </div>
            {s.is_late && <Badge variant="red">Late</Badge>}
          </CardHeader>

          <CardContent className="space-y-3 pb-3">
            {/* Text Answer */}
            {s.text_answer && <p className="text-black/70 text-sm pt-2">{s.text_answer}</p>}

            {/* Submission Files */}
            {s.submission_file &&
              s.submission_file.length > 0 &&
              s.submission_file.map((file) => {
                const { type, Icon, color } = getFileTypeAndIcon(file.assignment_file);
                const fullFilename = file.assignment_file.split("/").pop();
                const dotIndex = fullFilename.lastIndexOf(".");
                const nameOnly = dotIndex !== -1 ? fullFilename.slice(0, dotIndex) : fullFilename;
                const extOnly = dotIndex !== -1 ? fullFilename.slice(dotIndex) : "";

                return (
                  <Button
                    key={file.id}
                    variant="outline"
                    size="sm"
                    onClick={() => downloadFile(file.assignment_file)}
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

            {/* Actions Section */}
            {!s.trainer_feedback && (
              <div className="pt-3 border-t border-gray-200 flex justify-start">
                <Button
                  size="sm"
                  variant="outlinee"
                  className={`p-0 ${openFormId === s.id ? "hidden" : ""}`}
                  onClick={() => setOpenFormId(openFormId === s.id ? null : s.id)}
                >
                  <MessageCircle className="w-4 h-4" /> Add Feedback
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
                    onChange={(e) => setMarks(e.target.value)}
                    className={`w-32 ${marksError ? "" : ""}`}
                  />
                  {marksError && <span className="text-red-500 text-xs">{marksError}</span>}
                </div>

                <div className="flex flex-col">
                  <textarea
                    rows={3}
                    placeholder="Trainer feedback"
                    className={`border rounded-md p-2 w-full text-sm ${feedbackError ? "" : ""}`}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    maxLength={500}
                  />
                  {feedbackError && <span className="text-red-500 text-xs">{feedbackError}</span>}
                </div>

                <div className="flex items-center gap-3">
                  <Button size="sm" variant="default" onClick={() => handleEvaluate(s.id)} disabled={submitting}>
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
