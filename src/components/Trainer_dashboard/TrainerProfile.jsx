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

const TrainerProfile = () => {
  const [trainer, setTrainer] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [image, setImage] = useState(null);
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
        const res = await axios.get(`${API_BASE_URL}/trainers/`, {
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

  // Submit
  const onSubmit = async (data) => {
    if (!trainer) return;

    setLoading(true);
    setApiErrors({});
    const token = localStorage.getItem("accessToken");
    const formData = new FormData();

    // append only valid values (prevents id_type error)
    Object.entries(data).forEach(([key, value]) => {
      if (
        value !== "" &&
        value !== null &&
        value !== undefined &&
        key !== "technologies" 
      ) {
        formData.append(key, value);
      }
    });


    // append image ONLY if real file
    if (image instanceof File) {
      formData.append("user_profile", image);
    }

    try {
      await axios.put(
        `${API_BASE_URL}/trainers/${trainer.id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTrainer({ ...trainer, ...data });
      reset({ ...trainer, ...data });
      setEditMode(false);
      setImage(null);
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

  if (!trainer) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto mt-20 px-4">
      <Card className="overflow-hidden shadow-none rounded-2xl border border-slate-200">
        <CardHeader className="flex flex-col md:flex-row items-center gap-4 bg-blue-50 p-4">
          <Avatar className="w-32 h-32">
            {trainer.user_profile ? (
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

                <div>
                  <Label>First Name</Label>
                  <Input {...register("first_name", { required: true })} />
                </div>

                <div>
                  <Label>Last Name</Label>
                  <Input {...register("last_name", { required: true })} />
                </div>

                <div>
                  <Label>Job Title</Label>
                  <Input {...register("job_title", { required: true })} />
                </div>

                <div>
                  <Label>Email</Label>
                  <Input type="email" {...register("email")} />
                </div>

                <div>
                  <Label>Mobile No</Label>
                  <Input {...register("mobile_no")} />
                </div>

                <div>
                  <Label>Gender</Label>
                  <Controller
                    name="gender"
                    control={control}
                    rules={{ required: "Gender is required" }}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
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
                </div>

                <div>
                  <Label>Qualification</Label>
                  <Input {...register("qualification")} />
                </div>

                <div>
                  <Label>Date of Birth</Label>
                  <Input type="date" {...register("date_of_birth")} />
                </div>

                <div className="col-span-2">
                  <Label>Address</Label>
                  <textarea
                    {...register("address")}
                    className="w-full rounded-md border border-slate-300 p-2"
                    rows={2}
                  />
                </div>

                <div className="col-span-2">
                  <Label>Profile Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setImage(e.target.files?.[0] || null)
                    }
                  />
                </div>

              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    reset(trainer);
                    setEditMode(false);
                    setImage(null);
                  }}
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
      <Dialog open={submitSuccess}  onOpenChange={setSubmitSuccess}>
        <DialogContent className=" p-4  overflow-hidden [&>button]:hidden rounded-xl">
          <DialogHeader>
            <DialogTitle  >Success</DialogTitle>
          </DialogHeader>
          <p>Profile updated successfully!</p>
          <DialogFooter>
            <Button onClick={() => setSubmitSuccess(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ERROR MODAL */}
      <Dialog open={errorModalOpen} onOpenChange={setErrorModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="">
              Update Failed
            </DialogTitle>
          </DialogHeader>

          {Object.entries(apiErrors).map(([field, messages]) =>
            messages.map((msg, i) => (
              <p key={i} className="text-sm">
                {msg}
              </p>
            ))
          )}

          <DialogFooter>
            <Button onClick={() => setErrorModalOpen(false)}>
              Close
            </Button>
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
