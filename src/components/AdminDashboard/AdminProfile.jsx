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

  // Fetch admin
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
  }, [API_BASE_URL, reset]);

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
  ];


  const onSubmit = async (data) => {
    if (!admin) return;

    setLoading(true);
    setApiErrors({});
    const token = localStorage.getItem("accessToken");

    const formData = new FormData();

    //  Append ONLY allowed fields
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

    // Append profile image ONLY if file is selected
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

  //  Get the correct profile image URL
  const profileImage = getProfileImageUrl(admin.user_profile);

  return (
    <div className="max-w-4xl mx-auto mt-20 px-4">
      <Card className="overflow-hidden shadow-none rounded-2xl border border-slate-200">
        <CardHeader className="flex flex-col md:flex-row items-center gap-4 bg-blue-50 p-4">
          <Avatar className="w-32 h-32">
            {/* FIXED: Use profileImage variable */}
            {profileImage ? (
              <AvatarImage src={profileImage} />
            ) : (
              <AvatarFallback className="bg-primary text-white text-4xl font-bold">
                {admin.first_name?.charAt(0)}
              </AvatarFallback>
            )}
          </Avatar>

          <div className="flex-1 text-center md:text-left space-y-1">
            <h2 className="text-2xl font-semibold capitalize">
              {admin.first_name} {admin.last_name}
            </h2>
            <p className="text-sm text-slate-500">
              {admin.email || "N/A"}
            </p>
            <Badge variant="outline">Admin</Badge>
          </div>

          {!editMode && (
            <Button onClick={() => setEditMode(true)}>
                <Pencil className="h-4 w-2" />
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
                  <Input {...register("first_name", {
                    required: "First name is required",
                    minLength: { value: 2, message: "Minimum 2 characters" },
                    pattern: { value: /^[A-Za-z\s]+$/, message: "Only letters and spaces allowed" }
                  })} />
                  {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>}
                </div>

                <div>
                  <Label>Last Name</Label>
                  <Input {...register("last_name", {
                    required: "Last name is required",
                    minLength: { value: 2, message: "Minimum 2 characters" },
                    pattern: { value: /^[A-Za-z\s]+$/, message: "Only letters and spaces allowed" }
                  })} />
                  {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>}
                </div>

                <div>
                  <Label>Email</Label>
                  <Input type="email" {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address" }
                  })} />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <Label>Mobile No</Label>
                  <Input {...register("mobile_no", {
                    pattern: { value: /^[0-9]{10}$/, message: "Please enter a valid mobile number (10 digits)" }
                  })} />
                  {errors.mobile_no && <p className="text-red-500 text-xs mt-1">{errors.mobile_no.message}</p>}
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
                  <Label>Identity</Label>
                  <Input {...register("identity")} />
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
                    reset(admin);
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
              <Info label="First Name" value={admin.first_name} />
              <Info label="Last Name" value={admin.last_name} />
              <Info label="Email" value={admin.email} />
              <Info label="Mobile" value={admin.mobile_no} />
              <Info label="Gender" value={admin.gender} />
              <Info label="Identity" value={admin.identity} />
              <Info label="Qualification" value={admin.qualification} />
              <Info label="Date of Birth" value={admin.date_of_birth} />
              <div className="col-span-2">
                <Info label="Address" value={admin.address} />
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
    <p className="font-medium ">{value || "N/A"}</p>
  </div>
);

export default AdminProfile;