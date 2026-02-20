import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { AuthContext } from "../../contexts/authContext";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const InterviewCandidate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { candidateData } = location.state || {};

  const { batches, loadingBatches, fetchBatches, API_BASE_URL } =
    useContext(AuthContext);

  const token = localStorage.getItem("accessToken");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: candidateData?.id ?? "",
      name: candidateData?.name ?? "",
      email: candidateData?.email ?? "",
      mobile_no: candidateData?.mobile_no ?? "",
      role: candidateData?.role ?? "",
      subrole: candidateData?.subrole ?? "",
      gender: candidateData?.gender ?? "",
      batch: candidateData?.batch ?? "",
      eng_comm_skills: candidateData?.eng_comm_skills
        ? String(candidateData.eng_comm_skills)
        : "",
      humble_background: candidateData?.humble_background ?? "",
      laptop: candidateData?.laptop ?? "",
      profession: candidateData?.profession ?? "",
      selected_status: candidateData?.selected_status ?? "",
      level: candidateData?.level ? String(candidateData.level) : "",
      source: candidateData?.source ?? "",
      remarks: candidateData?.remarks ?? "",
    },
  });

  useEffect(() => {
    fetchBatches?.();
  }, [fetchBatches]);

  const onSubmit = async (data) => {
    try {
      await axios.put(
        `${API_BASE_URL}/Learner/${data.id}/update_selected/`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubmitSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Failed to update candidate data");
    }
  };

  if (!candidateData) {
    return <div className="text-center mt-10">No candidate data found.</div>;
  }

  return (
    <Card className="max-w-5xl mx-auto mt-20 p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-center mb-6">
        Candidate Information For Interview
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Name */}
        <div>
          <Label>Name</Label>
          <Input {...register("name")} readOnly />
        </div>

        {/* Email */}
        <div>
          <Label>Email</Label>
          <Input {...register("email")} readOnly />
        </div>

        {/* Mobile */}
        <div className="h-[60px]">
          <Label>
            Mobile No <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            inputMode="numeric"
            placeholder="10 digit mobile number"
            {...register("mobile_no", {
              required: "Mobile number is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Mobile number must be exactly 10 digits",
              },
            })}
          />
          {errors.mobile_no && (
            <p className="text-red-500 text-sm mt-1">
              {errors.mobile_no.message}
            </p>
          )}
        </div>

        {/* Role */}
        {/* <div>
          <Label>Role</Label>
          <Input {...register("role")} readOnly />
        </div> */}

        {/* Subrole */}
        {/* <div>
          <Label>Subrole</Label>
          <Input {...register("subrole")} readOnly />
        </div> */}

        {/* Gender */}
        <div>
          <Label>
            Gender <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="gender"
            control={control}
            rules={{ required: "Gender is required" }}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.gender && (
            <p className="text-red-500 text-sm mt-1">
              {errors.gender.message}
            </p>
          )}
        </div>

        {/* Batch */}
        <div>
          <Label>Batch</Label>
          <Controller
            name="batch"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select batch" />
                </SelectTrigger>
                <SelectContent>
                  {loadingBatches ? (
                    <SelectItem value="loading">Loading...</SelectItem>
                  ) : (
                    batches.map((b) => (
                      <SelectItem key={b.id} value={b.batch_id}>
                        {b.batch_name} - {b.center}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* English Communication */}
        <div>
          <Label>
             Communication <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="eng_comm_skills"
            control={control}
            rules={{ required: " communication rating is required" }}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Rate 1–5" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((v) => (
                    <SelectItem key={v} value={String(v)}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.eng_comm_skills && (
            <p className="text-red-500 text-sm mt-1">
              {errors.eng_comm_skills.message}
            </p>
          )}
        </div>

        {/* Humble Background */}
        <div>
          <Label>
            Humble Background <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="humble_background"
            control={control}
            rules={{ required: "Required" }}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Y">Yes</SelectItem>
                  <SelectItem value="N">No</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.humble_background && (
            <p className="text-red-500 text-sm mt-1">
              {errors.humble_background.message}
            </p>
          )}
        </div>

        {/* Laptop */}
        <div>
          <Label>
            Laptop <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="laptop"
            control={control}
            rules={{ required: "Required" }}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Laptop availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Y">Yes</SelectItem>
                  <SelectItem value="N">No</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.laptop && (
            <p className="text-red-500 text-sm mt-1">
              {errors.laptop.message}
            </p>
          )}
        </div>

        {/* Profession */}
        <div>
          <Label>
            Profession <span className="text-red-500">*</span>
          </Label>
          <Input
            {...register("profession", {
              required: "Profession is required",
              pattern: {
                value: /^[A-Za-z\s]+$/,
                message: "Only letters allowed",
              },
            })}
          />
          {errors.profession && (
            <p className="text-red-500 text-sm mt-1">
              {errors.profession.message}
            </p>
          )}
        </div>

        {/* Selected Status */}
        <div>
          <Label>
            Selected Status <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="selected_status"
            control={control}
            rules={{ required: "Selection status is required" }}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Y">Yes</SelectItem>
                  <SelectItem value="N">No</SelectItem>
                  <SelectItem value="TBD">TBD</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.selected_status && (
            <p className="text-red-500 text-sm mt-1">
              {errors.selected_status.message}
            </p>
          )}
        </div>

        {/* Level */}
        <div>
          <Label>
            Level <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="level"
            control={control}
            rules={{ required: "Level is required" }}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((l) => (
                    <SelectItem key={l} value={String(l)}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.level && (
            <p className="text-red-500 text-sm mt-1">
              {errors.level.message}
            </p>
          )}
        </div>

        {/* Source */}
        <div>
          <Label>
            Source <span className="text-red-500">*</span>
          </Label>
          <Input
            {...register("source", {
              required: "Source is required",
            })}
          />
          {errors.source && (
            <p className="text-red-500 text-sm mt-1">
              {errors.source.message}
            </p>
          )}
        </div>

        {/* Remarks */}
        <div className="md:col-span-2">
          <Label>
            Remarks <span className="text-red-500">*</span>
          </Label>
          <Textarea
            {...register("remarks", {
              required: "Remarks are required",
              minLength: {
                value: 3,
                message: "Minimum 3 characters required",
              },
              maxLength: {
                value: 200,
                message: "Maximum 200 characters allowed",
              },
            })}
          />
          {errors.remarks && (
            <p className="text-red-500 text-sm mt-1">
              {errors.remarks.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="md:col-span-2 flex justify-center mt-6">
          <Button type="submit">Update Candidate</Button>
        </div>
      </form>

      {/* Success Dialog */}
      <Dialog open={submitSuccess} onOpenChange={setSubmitSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
            <DialogDescription>
              Candidate data updated successfully.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => navigate("/Admission_table")}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default InterviewCandidate;
