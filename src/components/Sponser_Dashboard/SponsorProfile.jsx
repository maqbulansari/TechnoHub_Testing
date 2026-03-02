import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { AuthContext } from "../../contexts/authContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import Loading from "@/Loading";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil } from "lucide-react";

const SponsorProfile = () => {
  const { API_BASE_URL } = useContext(AuthContext);

  const [sponsor, setSponsor] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [apiErrors, setApiErrors] = useState({});
  const [imageError, setImageError] = useState("");

  const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm();

  const accessToken = localStorage.getItem("accessToken");

  // Fetch sponsor data
  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken) return;

      try {
        const response = await axios.get(`${API_BASE_URL}/sponsors/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const re = await axios.get(`${API_BASE_URL}/sponsor-dashboard/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.status === 200 && response.data?.length) {
          const profile = response.data[0];
          setSponsor(profile);
          reset(profile);
        }
      } catch (err) {
        console.error("Failed to fetch sponsor:", err);
      }
    };

    fetchData();
  }, [reset, accessToken, API_BASE_URL]);

  const onSubmit = async (data) => {
    if (!sponsor) return;

    if (image) {
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!validTypes.includes(image.type)) {
        setImageError("Only JPG, JPEG, or PNG files are allowed");
        return;
      }
      if (image.size > 2 * 1024 * 1024) {
        setImageError("Image size should be less than 2MB");
        return;
      }
    }

    setLoading(true);
    setApiErrors({});
    const formData = new FormData();

    // Remove user_profile from data — it's a path string from reset(), not a File
    delete data.user_profile;

    // Only append fields with non-empty values
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        formData.append(key, value);
      }
    });

    formData.append("id", sponsor.id); // always send ID
    if (image instanceof File) formData.append("user_profile", image); // only if image selected

    try {
      const response = await axios.put(
        `${API_BASE_URL}/sponsors/Sponser_update/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setSponsor({ ...sponsor, ...data, user_profile: response.data.user_profile || sponsor.user_profile });
      reset({ ...sponsor, ...data, user_profile: response.data.user_profile || sponsor.user_profile });
      setImage(null);
      setEditMode(false);
      setSubmitSuccess(true);
    } catch (err) {
      console.error("Error updating sponsor profile:", err);
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


  if (!sponsor) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto mt-20 px-4">
      <Card className="overflow-hidden shadow-none rounded-2xl border border-slate-200">
        <CardHeader className="flex flex-col md:flex-row items-center gap-4 bg-blue-50 p-4">
          {/* Avatar */}
          <Avatar className="w-32 h-32">
            {sponsor.user_profile ? (
              <AvatarImage src={`${API_BASE_URL}${sponsor.user_profile}`} alt="Profile" />
            ) : (
              <AvatarFallback className="bg-primary text-white text-4xl font-bold">
                {sponsor.first_name?.charAt(0)}
              </AvatarFallback>
            )}
          </Avatar>

          {/* Name & Email */}
          <div className="flex-1 text-center md:text-left space-y-1">
            <h2 className="text-2xl font-semibold text-slate-900 capitalize">
              {sponsor.first_name} {sponsor.last_name}
            </h2>
            <p className="text-sm text-slate-500">{sponsor.email}</p>
            <Badge variant="outline">
              Company: {sponsor.company_name || "N/A"}
            </Badge>
          </div>

          {/* Edit Button */}
          {!editMode && (
            <Button className="mt-4 md:mt-0" onClick={() => setEditMode(true)}>
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
                    required: "First name required",
                    minLength: { value: 2, message: "Minimum 2 characters" },
                    pattern: { value: /^[A-Za-z\s]+$/, message: "Only letters and spaces allowed" }
                  })} />
                  {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name.message}</p>}
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input {...register("last_name", {
                    required: "Last name required",
                    minLength: { value: 2, message: "Minimum 2 characters" },
                    pattern: { value: /^[A-Za-z\s]+$/, message: "Only letters and spaces allowed" }
                  })} />
                  {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <Input type="email" {...register("email", {
                    required: "Email required",
                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address" }
                  })} />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>
                <div>
                  <Label>Mobile Number</Label>
                  <Input type="text" {...register("mobile_no", {
                    required: "Mobile number required",
                    pattern: { value: /^[0-9]{10}$/, message: "Please enter a valid mobile number (10 digits)" }
                  })} />
                  {errors.mobile_no && <p className="text-red-500 text-sm">{errors.mobile_no.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
                </div>
                {/* <div>
                  <Label>Contribution Type</Label>
                  <Input {...register("contribution_type")} />
                </div> */}
                  <div>
                  <Label>Company Name</Label>
                  <Input {...register("company_name")} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* <div>
                  <Label>Contribution Value</Label>
                  <Input type="number" {...register("contribution_value")} />
                </div> */}

              
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
                  {imageError && <p className="text-red-500 text-sm">{imageError}</p>}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => { reset(sponsor); setEditMode(false); setImage(null); setImageError(""); }}>
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
                <p className="font-medium text-slate-900 capitalize">{sponsor.first_name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Last Name</p>
                <p className="font-medium text-slate-900 capitalize">{sponsor.last_name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Email</p>
                <p className="font-medium text-slate-900">{sponsor.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Mobile</p>
                <p className="font-medium text-slate-900">{sponsor.mobile_no || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Gender</p>
                <p className="font-medium text-slate-900">{sponsor.gender || "N/A"}</p>
              </div>
               <div>
                <p className="text-sm text-slate-500">Company Name</p>
                <p className="font-medium text-slate-900">{sponsor.company_name || "N/A"}</p>
              </div>
              {/* <div>
                <p className="text-sm text-slate-500">Contribution Type</p>
                <p className="font-medium text-slate-900">{sponsor.contribution_type || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Contribution Value</p>
                <p className="font-medium text-slate-900">{sponsor.contribution_value || "N/A"}</p>
              </div> */}
             
            </div>
          )}
        </CardContent>
      </Card>

      {/* Success Dialog */}
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

export default SponsorProfile;
