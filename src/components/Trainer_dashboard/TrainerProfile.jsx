import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { AuthContext } from "../../contexts/authContext";

import Loading from "@/Loading";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AUTH_BASE_URL, TECHNO_BASE_URL } from "@/environment";

const TrainerProfile = () => {
  const [trainer, setTrainer] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [apiErrors, setApiErrors] = useState({});

  const { API_BASE_URL } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();

  const normalizeTrainer = (data) => ({
    ...data,
    gender: data.gender ?? "",
    qualification: data.qualification ?? "",
    address: data.address ?? "",
    date_of_birth: data.date_of_birth ?? "",
    mobile_no: data.mobile_no ?? "",
    job_title: data.job_title ?? "",
  });

  // Fetch trainer
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const fetchTrainer = async () => {
      try {
        const res = await axios.get(`${AUTH_BASE_URL}/trainers/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const normalized = normalizeTrainer(res.data[0]);
        setTrainer(normalized);
        reset(normalized);
      } catch (err) {
        console.error("Fetch trainer error:", err);
      }
    };

    fetchTrainer();
  }, [API_BASE_URL, reset]);

  // Handle image change with preview
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImage(null);
      setImagePreview(null);
    }
  };

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Submit
  const onSubmit = async (data) => {
    if (!trainer) return;

    setLoading(true);
    setApiErrors({});
    const token = localStorage.getItem("accessToken");
    const formData = new FormData();

    // Fields to exclude from FormData
    const excludeFields = [
      "technologies",
      "user_profile", // Don't send existing user_profile path
      "id",
      "user",
      "batches",
      "created_at",
      "updated_at",
    ];

    // Append only valid values
    Object.entries(data).forEach(([key, value]) => {
      if (
        value !== "" &&
        value !== null &&
        value !== undefined &&
        !excludeFields.includes(key)
      ) {
        formData.append(key, value);
      }
    });

    // Append image ONLY if it's a new File
    if (image instanceof File) {
      formData.append("user_profile", image);
    }

    try {
      const res = await axios.put(
        `${API_BASE_URL}/trainers/${trainer.id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update trainer with response data
      const updatedTrainer = normalizeTrainer(res.data);
      setTrainer(updatedTrainer);
      reset(updatedTrainer);
      setEditMode(false);
      setImage(null);
      setImagePreview(null);
      setSubmitSuccess(true);

    } catch (err) {
      if (err.response?.data) {
        setApiErrors(err.response.data);
      } else {
        setApiErrors({ general: ["Something went wrong."] });
      }
      setErrorModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Cancel edit
  const handleCancel = () => {
    reset(trainer);
    setEditMode(false);
    setImage(null);
    setImagePreview(null);
  };

  if (!trainer) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto mt-20 px-4">
      <Card className="overflow-hidden shadow-none rounded-2xl border border-slate-200">
        <CardHeader className="flex flex-col md:flex-row items-center gap-4 bg-blue-50 p-4">
          <Avatar className="w-32 h-32">
            {imagePreview ? (
              <AvatarImage src={imagePreview} />
            ) : trainer.user_profile ? (
              <AvatarImage src={`${API_BASE_URL}${trainer.user_profile}`} />
            ) : (
              <AvatarFallback className="bg-primary text-white text-4xl font-bold">
                {trainer.first_name?.charAt(0)}
              </AvatarFallback>
            )}
          </Avatar>

          <div className="flex-1 text-center md:text-left space-y-1">
            <h2 className="text-2xl font-semibold capitalize">
              {trainer.first_name} {trainer.last_name}
            </h2>
            <p className="text-sm text-slate-500">
              {trainer.job_title || "N/A"}
            </p>
            <Badge variant="outline">Trainer</Badge>
          </div>

          {!editMode && (
            <Button onClick={() => setEditMode(true)}>
              Edit Profile
            </Button>
          )}
        </CardHeader>

        <CardContent className="p-6">
          {editMode ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* First Name */}
                <div>
                  <Label>First Name <span className="text-red-500">*</span></Label>
                  <Input
                    {...register("first_name", {
                      required: "First name is required",
                      minLength: {
                        value: 2,
                        message: "First name must be at least 2 characters"
                      }
                    })}
                    className={errors.first_name ? "border-red-500" : ""}
                  />
                  {errors.first_name && (
                    <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <Label>Last Name <span className="text-red-500">*</span></Label>
                  <Input
                    {...register("last_name", {
                      required: "Last name is required",
                      minLength: {
                        value: 2,
                        message: "Last name must be at least 2 characters"
                      }
                    })}
                    className={errors.last_name ? "border-red-500" : ""}
                  />
                  {errors.last_name && (
                    <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>
                  )}
                </div>

                {/* Job Title */}
                <div>
                  <Label>Job Title <span className="text-red-500">*</span></Label>
                  <Input
                    {...register("job_title", {
                      required: "Job title is required"
                    })}
                    className={errors.job_title ? "border-red-500" : ""}
                  />
                  {errors.job_title && (
                    <p className="text-red-500 text-xs mt-1">{errors.job_title.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <Label>Email <span className="text-red-500">*</span></Label>
                  <Input
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Mobile No */}
                <div>
                  <Label>Mobile No</Label>
                  <Input
                    {...register("mobile_no", {
                      pattern: {
                        value: /^[0-9]{10,15}$/,
                        message: "Please enter a valid mobile number (10-15 digits)"
                      }
                    })}
                    className={errors.mobile_no ? "border-red-500" : ""}
                  />
                  {errors.mobile_no && (
                    <p className="text-red-500 text-xs mt-1">{errors.mobile_no.message}</p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <Label>Gender <span className="text-red-500">*</span></Label>
                  <Controller
                    name="gender"
                    control={control}
                    rules={{ required: "Gender is required" }}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select Gender" />
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
                    <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>
                  )}
                </div>

                {/* Qualification */}
                <div>
                  <Label>Qualification</Label>
                  <Input {...register("qualification")} />
                </div>

                {/* Date of Birth */}
                <div>
                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    {...register("date_of_birth", {
                      validate: (value) => {
                        if (!value) return true; // Optional field
                        const selectedDate = new Date(value);
                        const today = new Date();
                        if (selectedDate > today) {
                          return "Date of birth cannot be in the future";
                        }
                        return true;
                      }
                    })}
                    className={errors.date_of_birth ? "border-red-500" : ""}
                  />
                  {errors.date_of_birth && (
                    <p className="text-red-500 text-xs mt-1">{errors.date_of_birth.message}</p>
                  )}
                </div>

                {/* Address */}
                <div className="col-span-2">
                  <Label>Address</Label>
                  <textarea
                    {...register("address", {
                      maxLength: {
                        value: 500,
                        message: "Address cannot exceed 500 characters"
                      }
                    })}
                    className={`w-full rounded-md border p-2 ${errors.address ? "border-red-500" : "border-slate-300"
                      }`}
                    rows={2}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
                  )}
                </div>

                {/* Profile Image */}
                <div className="col-span-2">
                  <Label>Profile Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {image && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-sm text-slate-600">Selected: {image.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-red-500 h-6 px-2"
                        onClick={() => {
                          setImage(null);
                          setImagePreview(null);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>

              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Info label="First Name" value={trainer.first_name} />
              <Info label="Last Name" value={trainer.last_name} />
              <Info label="Job Title" value={trainer.job_title} />
              <Info label="Email" value={trainer.email} />
              <Info label="Mobile" value={trainer.mobile_no} />
              <Info label="Gender" value={trainer.gender} />
              <Info label="Qualification" value={trainer.qualification} />
              <Info label="Date of Birth" value={trainer.date_of_birth} />
              <div className="col-span-2">
                <Info label="Address" value={trainer.address} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SUCCESS MODAL */}
      <Dialog open={submitSuccess} onOpenChange={setSubmitSuccess}>
        <DialogContent className="p-4 overflow-hidden [&>button]:hidden rounded-xl">
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
          </DialogHeader>
          <p>Profile updated successfully!</p>
          <DialogFooter>
            <Button onClick={() => setSubmitSuccess(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ERROR MODAL */}
      <Dialog open={errorModalOpen} onOpenChange={setErrorModalOpen}>
        <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden [&>button]:hidden rounded-xl">
          <DialogHeader className="px-5 pt-4 pb-2 space-y-1">
            <DialogTitle className="text-xl font-semibold">Update Failed</DialogTitle>
          </DialogHeader>

          <div className="px-5 pb-4 space-y-2">
            {Object.entries(apiErrors).map(([field, msgs]) =>
              Array.isArray(msgs)
                ? msgs.map((msg, i) => (
                  <p key={`${field}-${i}`} className="text-sm text-red-500">
                    • {field === "user_profile" ? "Please upload a valid image file." : msg}
                  </p>
                ))
                : <p key={field} className="text-sm text-red-500">• {msgs}</p>
            )}
          </div>

          <DialogFooter className="px-3 pb-3 bg-muted/30">
            <Button onClick={() => setErrorModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div>
    <p className="text-sm text-slate-500">{label}</p>
    <p className="font-medium capitalize">{value || "N/A"}</p>
  </div>
);

export default TrainerProfile;