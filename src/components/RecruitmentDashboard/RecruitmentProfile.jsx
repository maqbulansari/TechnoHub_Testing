import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
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
  const { recruiterProfileDetails, FetchRecuiter, dataFetched, setDataFetched } = useContext(SponsorContext);

  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [image, setImage] = useState(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  // Fetch recruiter data
  useEffect(() => {
    if ((responseSubrole === "RECRUITER" || role === "ADMIN") && !dataFetched['recruiter']) {
      FetchRecuiter().then(() => setDataFetched(prev => ({ ...prev, recruiter: true })));
    }
  }, [responseSubrole, role, dataFetched, FetchRecuiter, setDataFetched]);

  // Populate form when data arrives
  useEffect(() => {
    if (recruiterProfileDetails?.length) {
      const profile = recruiterProfileDetails[0];
      reset(profile);
      setImage(null);
    }
  }, [recruiterProfileDetails, reset]);

  const onSubmit = async (data) => {
    if (!recruiterProfileDetails?.length) return;

    setLoading(true);
    const formData = new FormData();
    const currentProfile = recruiterProfileDetails[0];

    Object.entries(data).forEach(([key, value]) => formData.append(key, value));
    formData.append("id", currentProfile.id);
    if (image) formData.append("user_profile", image);

    try {
      const response = await axios.put(`${API_BASE_URL}/recruiter/Recruiter_update/`, formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${accessToken}` },
      });

      reset(response.data);
      setEditMode(false);
      setImage(null);
      setSubmitSuccess(true);
    } catch (err) {
      console.error("Error updating recruiter:", err);
      alert("Failed to update profile");
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
              <AvatarImage src={`${API_BASE_URL}${profile.user_profile}`} alt="Profile" />
            ) : (
              <AvatarFallback className="bg-primary text-white text-4xl font-bold">
                {profile.first_name?.charAt(0) || "R"}
              </AvatarFallback>
            )}
          </Avatar>

          <div className="flex-1 text-center md:text-left space-y-1">
            <h2 className="text-2xl font-semibold text-slate-900 capitalize">
              {profile.first_name} {profile.last_name}
            </h2>
            <p className="text-sm text-slate-500">{profile.email}</p>
       
             <Badge variant="outline">
              Company: {profile.company_name}
            </Badge>
          </div>

          {!editMode && (
            <Button className="mt-4 md:mt-0" onClick={() => setEditMode(true)}>
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
                  <Input {...register("first_name", { required: "First name required" })} />
                  {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name.message}</p>}
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input {...register("last_name", { required: "Last name required" })} />
                  {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <Input type="email" {...register("email", { required: "Email required" })} />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <Input {...register("mobile_no", { required: "Phone required" })} />
                  {errors.mobile_no && <p className="text-red-500 text-sm">{errors.mobile_no.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Company Name</Label>
                  <Input {...register("company_name", { required: "Company required" })} />
                  {errors.company_name && <p className="text-red-500 text-sm">{errors.company_name.message}</p>}
                </div>
                <div>
                  <Label>Gender</Label>
                  <Select {...register("gender", { required: "Gender required" })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
                </div>
              </div>

              <div>
                <Label>Profile Image</Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="profileImage"
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                  />
                  <label htmlFor="profileImage">
                    <Button variant="outline" asChild>
                      <span>{image ? image.name : "Choose file"}</span>
                    </Button>
                  </label>
                  {image && (
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Preview"
                      className="w-16 h-16 rounded-full object-cover border"
                    />
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => { reset(profile); setEditMode(false); setImage(null); }}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">First Name</p>
                <p className="font-medium text-slate-900 capitalize">{profile.first_name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Last Name</p>
                <p className="font-medium text-slate-900 capitalize">{profile.last_name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Email</p>
                <p className="font-medium text-slate-900">{profile.email}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Phone</p>
                <p className="font-medium text-slate-900">{profile.mobile_no}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Company</p>
                <p className="font-medium text-slate-900 capitalize">{profile.company_name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Gender</p>
                <p className="font-medium text-slate-900">{profile.gender}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={submitSuccess} onOpenChange={setSubmitSuccess}>
        <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden [&>button]:hidden rounded-xl">
          <DialogHeader className="px-5 pt-4 pb-4 space-y-1">
            <DialogTitle className="text-xl pb-2 font-semibold">Success</DialogTitle>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Profile updated successfully!
            </p>
          </DialogHeader>
          <DialogFooter className="px-3 pb-3 bg-muted/30">
            <Button className="w-full sm:w-auto" onClick={() => setSubmitSuccess(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecruitmentProfile;
