import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { AuthContext } from "../../contexts/authContext";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import Loading from "@/Loading";

const AssessmentCandidate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role, API_BASE_URL, accessToken } = useContext(AuthContext);

  const [assessmentDetail, setAssessmentDetail] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const { register, handleSubmit, control, formState: { errors }, reset } = useForm();

  // Fetch assessment detail
  useEffect(() => {
    const fetchAssessmentDetail = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/assessment/${id}/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = response.data.data;
        setAssessmentDetail(data);

        // Map values for form
        reset({
          trainer_score: data.trainer_score || "",
          trainer_feedback: data.trainer_feedback || "",
          assessment_test_status: data.assessment_test_status || "",
          admin_name: data.admin_name || "",
          admin_score: data.admin_score || "",
          admin_feedback: data.admin_feedback || "",
          admin_selected: data.admin_selected ? "yes" : "no",
          student_name: data.student_name,
          batch_name: data.batch_name,
          batch_id: data.batch_id,
          selected_by_trainer: data.selected_by_trainer || "",
        });
      } catch (err) {
        console.error("Error fetching assessment detail:", err);
      }
    };
    fetchAssessmentDetail();
  }, [id, reset, API_BASE_URL, accessToken]);

  // Submit handler
  const onSubmit = async (data) => {
    try {
      const payload = {};

      // Trainer can only update trainer fields
      if (role !== "ADMIN") {
        payload.trainer_score = data.trainer_score;
        payload.trainer_feedback = data.trainer_feedback;
        payload.assessment_test_status = data.assessment_test_status;
      }

      // Admin can update admin fields
      if (role === "ADMIN") {
        payload.trainer_score = data.trainer_score;
        payload.trainer_feedback = data.trainer_feedback;
        payload.assessment_test_status = data.assessment_test_status;
        payload.admin_name = data.admin_name;
        payload.admin_score = data.admin_score;
        payload.admin_feedback = data.admin_feedback;
        payload.admin_selected = data.admin_selected;
      }

      await axios.put(`${API_BASE_URL}/assessment/update/${id}/`, payload, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setModalMessage("Assessment completed successfully!");
      setSubmitSuccess(true);
    } catch (err) {
      console.error(err);
      setModalMessage("Failed to update assessment.");
      setSubmitSuccess(true);
    }
  };

  if (!assessmentDetail) return <Loading />;

  const handleCloseModal = () => {
    setSubmitSuccess(false);
    if (modalMessage.includes("successfully")) navigate("/AssessmentTable");
  };

  return (
    <Card className="max-w-5xl mx-auto mt-20 p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-center mb-6">Assessment Details</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Read-only Fields */}
        <div>
          <Label>Student Name</Label>
          <Input {...register("student_name")} readOnly />
        </div>
        <div>
          <Label>Batch Name</Label>
          <Input {...register("batch_name")} readOnly />
        </div>
        <div>
          <Label>Batch ID</Label>
          <Input {...register("batch_id")} readOnly />
        </div>
        <div>
          <Label>Trainer Name</Label>
          <Input {...register("selected_by_trainer")} readOnly />
        </div>
        {role === "ADMIN" && (<div>
          <Label>Trainer Is Selected</Label>
          <Input value={assessmentDetail.trainer_is_selected ? "Yes" : "No"} readOnly />
        </div>)}

        {/* Trainer Fields */}
        <div>
          <Label>Trainer Score <span className="text-red-500">*</span></Label>
          <Input
            type="number"
            {...register("trainer_score", {
              required: "Trainer Score is required",
              min: { value: 1, message: "Min 1" },
              max: { value: 10, message: "Max 10" },
            })}
            disabled={role === "ADMIN" ? true : false}
          />
          {errors.trainer_score && <p className="text-red-500 text-sm mt-1">{errors.trainer_score.message}</p>}
        </div>

               <div>
          <Label>Assessment Test Status <span className="text-red-500">*</span></Label>
          <Controller
            control={control}
            name="assessment_test_status"
            rules={{ required: "Status is required" }}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={role === "ADMIN" ? true : false}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Selected">Selected</SelectItem>
                  <SelectItem value="Not">Not Selected</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.assessment_test_status && <p className="text-red-500 text-sm mt-1">{errors.assessment_test_status.message}</p>}
        </div>
        <div>
          <Label>Trainer Feedback <span className="text-red-500">*</span></Label>
          <Textarea
            {...register("trainer_feedback", {
              required: "Trainer Feedback is required",
              minLength: { value: 5, message: "Min 5 chars" },
            })}
            disabled={role === "ADMIN" ? true : false}
          />
          {errors.trainer_feedback && <p className="text-red-500 text-sm mt-1">{errors.trainer_feedback.message}</p>}
        </div>
 

        {/* Admin Fields */}
        {role === "ADMIN" && (
          <>
            <div>
              <Label>Admin Name</Label>
              <Input {...register("admin_name")} readOnly />
            </div>
            <div>
              <Label>Admin Score</Label>
              <Input type="number" {...register("admin_score")} />
            </div>
            <div>
              <Label>Admin Feedback</Label>
              <Textarea {...register("admin_feedback")} />
            </div>
            <div>
              <Label>Admin Selected</Label>
              <Controller
                control={control}
                name="admin_selected"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </>
        )}

        {/* Submit Button */}
        <div className="md:col-span-2 flex justify-center mt-4">
          <Button type="submit">Update Assessment</Button>
        </div>
      </form>

      {/* Success / Error Dialog */}
      <Dialog open={submitSuccess} onOpenChange={setSubmitSuccess}>
        <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden [&>button]:hidden rounded-xl">
          <DialogHeader className="px-5 pt-4 pb-4 space-y-1">
            <DialogTitle className="text-xl pb-2 font-semibold">
              {modalMessage.includes("successfully") ? "Success" : "Error"}
            </DialogTitle>
            <DialogDescription className="text-sm pb-2 text-muted-foreground leading-relaxed">
              {modalMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="px-3 pb-3 bg-muted/30">
            <Button onClick={handleCloseModal} className="w-full sm:w-auto">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AssessmentCandidate;
