import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";

import Loading from "@/Loading";
import { AuthContext } from "@/contexts/authContext";

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
import { AUTH_BASE_URL } from "@/environment";
import { Pencil } from "lucide-react";

export const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [apiErrors, setApiErrors] = useState({});

  const { API_BASE_URL, user } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();

  const normalizeAdmin = (data) => ({
    ...data,
    gender: data.gender ?? "",
    qualification: data.qualification ?? "",
    address: data.address ?? "",
    date_of_birth: data.date_of_birth ?? "",
    mobile_no: data.mobile_no ?? "",
    identity: data.identity ?? "",
  });

  const getProfileImageUrl = (profilePath) => {
    if (!profilePath) return null;
    if (profilePath.startsWith("http://localhost:8000")) {
      return profilePath.replace("http://localhost:8000", AUTH_BASE_URL);
    }
    if (profilePath.startsWith("http://") || profilePath.startsWith("https://")) {
      return profilePath;
    }
    return `${AUTH_BASE_URL}${profilePath}`;
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const fetchAdmin = async () => {
      try {
        const res = await axios.get(`${AUTH_BASE_URL}/User/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const normalized = normalizeAdmin(res.data);
        setAdmin(normalized);
        reset(normalized);
      } catch (err) {
        console.error("Fetch admin error:", err);
      }
    };

    fetchAdmin();
  }, [API_BASE_URL, reset, user?.id]);

  const EXCLUDED_FIELDS = [
    "password",
    "groups",
    "user_permissions",
    "user_profile",
    "id",
    "last_login",
    "date_joined",
    "is_superuser",
    "is_staff",
    "is_active",
    "role",
    "id_type",
    "subrole",
  ];

  const onSubmit = async (data) => {
    if (!admin) return;

    setLoading(true);
    setApiErrors({});
    const token = localStorage.getItem("accessToken");

    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (
        !EXCLUDED_FIELDS.includes(key) &&
        value !== "" &&
        value !== null &&
        value !== undefined
      ) {
        formData.append(key, value);
      }
    });

    if (image && image instanceof File) {
      formData.append("user_profile", image);
    }

    try {
      await axios.patch(
        `${AUTH_BASE_URL}/User/${admin.id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAdmin({ ...admin, ...data });
      reset({ ...admin, ...data });
      setEditMode(false);
      setImage(null);
      setSubmitSuccess(true);
    } catch (err) {
      setApiErrors(err.response?.data || { general: ["Something went wrong"] });
      setErrorModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  if (!admin) return <Loading />;

  const profileImage = getProfileImageUrl(admin.user_profile);

  return (
    // Used sm/md prefixes to gradually increase spacing on larger screens
    <div className="max-w-4xl mx-auto mt-16 sm:mt-20 px-4 pb-8">
      <Card className="overflow-hidden shadow-none rounded-2xl border border-slate-200">
        <CardHeader className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-blue-50/50 p-6">
          {/* Shrunk the avatar on mobile, kept it large on desktop */}
          <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-white shadow-sm">
            {profileImage ? (
              <AvatarImage src={profileImage} className="object-cover" />
            ) : (
              <AvatarFallback className="bg-primary text-white text-3xl sm:text-4xl font-bold">
                {admin.first_name?.charAt(0)}
              </AvatarFallback>
            )}
          </Avatar>

          <div className="flex-1 flex flex-col items-center sm:items-start space-y-2 w-full">
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-semibold capitalize text-slate-900">
                {admin.first_name} {admin.last_name}
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                {admin.email || "N/A"}
              </p>
            </div>
            <Badge variant="outline" className="bg-white">Admin</Badge>
          </div>

          {!editMode && (
            // Made the button full width on mobile, auto width on desktop
            <Button 
              onClick={() => setEditMode(true)} 
              className="w-full sm:w-auto mt-4 sm:mt-0"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </CardHeader>

        <CardContent className="p-4 sm:p-6 lg:p-8">
          {editMode ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Changed to sm:grid-cols-2 so it breaks to 2 columns on tablets earlier */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">

                <div className="space-y-1">
                  <Label>First Name</Label>
                  <Input {...register("first_name", {
                    required: "First name is required",
                    minLength: { value: 2, message: "Minimum 2 characters" },
                    pattern: { value: /^[A-Za-z\s]+$/, message: "Only letters and spaces allowed" }
                  })} />
                  {errors.first_name && <p className="text-red-500 text-xs">{errors.first_name.message}</p>}
                </div>

                <div className="space-y-1">
                  <Label>Last Name</Label>
                  <Input {...register("last_name", {
                    required: "Last name is required",
                    minLength: { value: 2, message: "Minimum 2 characters" },
                    pattern: { value: /^[A-Za-z\s]+$/, message: "Only letters and spaces allowed" }
                  })} />
                  {errors.last_name && <p className="text-red-500 text-xs">{errors.last_name.message}</p>}
                </div>

                <div className="space-y-1">
                  <Label>Email</Label>
                  <Input type="email" {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address" }
                  })} />
                  {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                </div>

                <div className="space-y-1">
                  <Label>Mobile No</Label>
                  <Input {...register("mobile_no", {
                    pattern: { value: /^[0-9]{10}$/, message: "Please enter a valid mobile number (10 digits)" }
                  })} />
                  {errors.mobile_no && <p className="text-red-500 text-xs">{errors.mobile_no.message}</p>}
                </div>

                <div className="space-y-1">
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

                <div className="space-y-1">
                  <Label>Identity</Label>
                  <Input {...register("identity")} />
                </div>

                <div className="space-y-1">
                  <Label>Qualification</Label>
                  <Input {...register("qualification")} />
                </div>

                <div className="space-y-1">
                  <Label>Date of Birth</Label>
                  <Input type="date" {...register("date_of_birth")} />
                </div>

                {/* FIXED: Changed from col-span-2 to sm:col-span-2 to prevent mobile overflow */}
                <div className="col-span-1 sm:col-span-2 space-y-1">
                  <Label>Address</Label>
                  <textarea
                    {...register("address")}
                    className="w-full rounded-md border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                    rows={3}
                  />
                </div>

                {/* FIXED: Changed from col-span-2 to sm:col-span-2 */}
                <div className="col-span-1 sm:col-span-2 space-y-1">
                  <Label>Profile Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setImage(e.target.files?.[0] || null)
                    }
                    className="cursor-pointer"
                  />
                </div>

              </div>

              {/* Stacked buttons on mobile, side-by-side on desktop */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-slate-100">
                <Button
                  variant="outline"
                  type="button"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    reset(admin);
                    setEditMode(false);
                    setImage(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
              <Info label="First Name" value={admin.first_name} />
              <Info label="Last Name" value={admin.last_name} />
              <Info label="Email" value={admin.email} />
              <Info label="Mobile" value={admin.mobile_no} />
              <Info label="Gender" value={admin.gender} />
              <Info label="Identity" value={admin.identity} />
              <Info label="Qualification" value={admin.qualification} />
              <Info label="Date of Birth" value={admin.date_of_birth} />
              {/* FIXED: Prevented address block from breaking mobile grid */}
              <div className="col-span-1 sm:col-span-2">
                <Info label="Address" value={admin.address} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SUCCESS MODAL */}
      <Dialog open={submitSuccess} onOpenChange={setSubmitSuccess}>
        <DialogContent className="w-[90vw] sm:max-w-md p-6 overflow-hidden [&>button]:hidden rounded-2xl">
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
          </DialogHeader>
          <p className="text-slate-600">Profile updated successfully!</p>
          <DialogFooter className="mt-4">
            <Button onClick={() => setSubmitSuccess(false)} className="w-full sm:w-auto">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ERROR MODAL */}
      <Dialog open={errorModalOpen} onOpenChange={setErrorModalOpen}>
        <DialogContent className="w-[90vw] sm:max-w-md p-0 gap-0 overflow-hidden [&>button]:hidden rounded-2xl">
          <DialogHeader className="px-6 pt-6 pb-2 space-y-1">
            <DialogTitle className="text-xl font-semibold text-red-600">Update Failed</DialogTitle>
          </DialogHeader>

          <div className="px-6 pb-6 space-y-2 mt-2">
            {Object.entries(apiErrors).map(([field, msgs]) =>
              Array.isArray(msgs)
                ? msgs.map((msg, i) => (
                  <p key={`${field}-${i}`} className="text-sm">
                    {field === "user_profile" ? "Please upload a valid image file." : msg}
                  </p>
                ))
                : <p key={field} className="text-sm">{msgs}</p>
            )}
          </div>

          <DialogFooter className="px-6 py-4 bg-slate-50 border-t border-slate-100">
            <Button variant="outline" onClick={() => setErrorModalOpen(false)} className="w-full sm:w-auto">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div className="flex flex-col space-y-1">
    <p className="text-xs sm:text-sm text-slate-500 font-medium uppercase tracking-wider">{label}</p>
    <p className="font-medium text-slate-900 break-words">{value || "N/A"}</p>
  </div>
);

export default AdminProfile;