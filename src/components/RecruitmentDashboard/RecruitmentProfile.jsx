import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { AuthContext } from "../../contexts/authContext";
import { SponsorContext } from "../../contexts/dashboard/sponsorDashboardContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import Loading from "@/Loading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "../ui/badge";

const RecruitmentProfile = () => {
  const { API_BASE_URL, role, responseSubrole } = useContext(AuthContext);
  const accessToken = localStorage.getItem("accessToken");
  const {
    recruiterProfileDetails,
    FetchRecuiter,
    dataFetched,
    setDataFetched,
  } = useContext(SponsorContext);

  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [image, setImage] = useState(null);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [apiErrors, setApiErrors] = useState({});

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();

  // ✅ normalize null → ""
  const normalizeRecruiter = (data) => ({
    ...data,
    gender: data.gender ?? "",
    company_name: data.company_name ?? "",
    mobile_no: data.mobile_no ?? "",
  });

  // Fetch recruiter
  useEffect(() => {
    if (
      (responseSubrole === "RECRUITER" || role === "ADMIN") &&
      !dataFetched["recruiter"]
    ) {
      FetchRecuiter().then(() =>
        setDataFetched((prev) => ({ ...prev, recruiter: true }))
      );
    }
  }, [responseSubrole, role, dataFetched, FetchRecuiter, setDataFetched]);

  // Populate form
  useEffect(() => {
    if (recruiterProfileDetails?.length) {
      const normalized = normalizeRecruiter(recruiterProfileDetails[0]);
      reset(normalized);
      setImage(null);
    }
  }, [recruiterProfileDetails, reset]);

  const onSubmit = async (data) => {
    if (!recruiterProfileDetails?.length) return;

    setLoading(true);
    setApiErrors({});
    const formData = new FormData();
    const currentProfile = recruiterProfileDetails[0];

    // append only valid values
    Object.entries(data).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    formData.append("id", currentProfile.id);

    if (image instanceof File) {
      formData.append("user_profile", image);
    }

    try {
      const response = await axios.put(
        `${API_BASE_URL}/recruiter/Recruiter_update/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      reset(response.data);
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

  if (!recruiterProfileDetails?.length) return <Loading />;

  const profile = recruiterProfileDetails[0];

  return (
    <div className="max-w-4xl mx-auto mt-20 px-4">
      <Card className="overflow-hidden shadow-none rounded-2xl border border-slate-200">
        <CardHeader className="flex flex-col md:flex-row items-center gap-4 bg-blue-50 p-4">
          <Avatar className="w-32 h-32">
            {profile.user_profile ? (
              <AvatarImage src={`${API_BASE_URL}${profile.user_profile}`} />
            ) : (
              <AvatarFallback className="bg-primary text-white text-4xl font-bold">
                {profile.first_name?.charAt(0) || "R"}
              </AvatarFallback>
            )}
          </Avatar>

          <div className="flex-1 text-center md:text-left space-y-1">
            <h2 className="text-2xl font-semibold capitalize">
              {profile.first_name} {profile.last_name}
            </h2>
            <p className="text-sm text-slate-500">{profile.email}</p>
            <Badge variant="outline">Company: {profile.company_name}</Badge>
          </div>

          {!editMode && (
            <Button onClick={() => setEditMode(true)}>Edit Profile</Button>
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
                  <Label>Email</Label>
                  <Input type="email" {...register("email", { required: true })} />
                </div>

                <div>
                  <Label>Phone Number</Label>
                  <Input {...register("mobile_no", { required: true })} />
                </div>

                <div>
                  <Label>Company Name</Label>
                  <Input {...register("company_name", { required: true })} />
                </div>

                <div>
                  <Label>Gender</Label>
                  <Controller
                    name="gender"
                    control={control}
                    rules={{ required: "Gender required" }}
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
              </div>

              <div>
                <Label>Profile Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    reset(profile);
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
              <Info label="First Name" value={profile.first_name} />
              <Info label="Last Name" value={profile.last_name} />
              <Info label="Email" value={profile.email} />
              <Info label="Phone" value={profile.mobile_no} />
              <Info label="Company" value={profile.company_name} />
              <Info label="Gender" value={profile.gender} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* SUCCESS MODAL */}
      <Dialog open={submitSuccess} onOpenChange={setSubmitSuccess}>
        <DialogContent>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">
              Update Failed
            </DialogTitle>
          </DialogHeader>

          {Object.entries(apiErrors).map(([_, msgs]) =>
            msgs.map((msg, i) => (
              <p key={i} className="text-sm text-red-500">
                • {msg}
              </p>
            ))
          )}

          <DialogFooter>
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

export default RecruitmentProfile;
