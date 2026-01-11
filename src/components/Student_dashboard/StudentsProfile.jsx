import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
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

const StudentsProfile = () => {
  const [student, setStudent] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { API_BASE_URL } = useContext(AuthContext);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) return;

    const fetchStudent = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/Students/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudent(response.data);
        reset(response.data);
      } catch (err) {
        console.error("Failed to fetch student:", err);
      }
    };

    fetchStudent();
  }, [API_BASE_URL, reset]);

  const onSubmit = async (data) => {
    if (!student) return;

    setLoading(true);
    const token = localStorage.getItem("accessToken");
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => formData.append(key, value));
    if (image) formData.append("user_profile", image);

    try {
      await axios.put(`${API_BASE_URL}/Students/${student.id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
      });

      setStudent({ ...student, ...data });
      reset({ ...student, ...data });
      setEditMode(false);
      setSubmitSuccess(true);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!student) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto mt-20 px-4">
      <Card className="overflow-hidden shadow-none rounded-2xl border border-slate-200">
        <CardHeader className="flex flex-col md:flex-row items-center gap-4 bg-blue-50 p-4">
          {/* Avatar */}
          <Avatar className="w-32 h-32">
            {student.user_profile ? (
              <AvatarImage src={`${API_BASE_URL}${student.user_profile}`} alt="Profile" />
            ) : (
              <AvatarFallback className="bg-primary text-white text-4xl font-bold">
                {student.first_name?.charAt(0)}
              </AvatarFallback>
            )}
          </Avatar>

          {/* Name & Email */}
          <div className="flex-1 text-center md:text-left space-y-1">
            <h2 className="text-2xl font-semibold text-slate-900 capitalize">
              {student.first_name} {student.last_name}
            </h2>
            <p className="text-sm text-slate-500">{student.email}</p>
            <Badge variant="outline">
              Batch: {student.batch}
            </Badge>
          </div>

          {/* Edit Button */}
          {!editMode && (
            <Button className="mt-4 md:mt-0" onClick={() => setEditMode(true)}>
              Edit Profile
            </Button>
          )}
        </CardHeader>

        <CardContent className="p-6">
          {editMode ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>First Name</Label>
                  <Input {...register("first_name", { required: "First name is required" })} />
                  {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name.message}</p>}
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input {...register("last_name", { required: "Last name is required" })} />
                  {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <Input type="email" {...register("email", { required: "Email is required" })} />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>
                <div>
                  <Label>Mobile Number</Label>
                  <Input type="text" {...register("mobile_no", { required: "Mobile number is required" })} />
                  {errors.mobile_no && <p className="text-red-500 text-sm">{errors.mobile_no.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Gender</Label>
                  <Select {...register("gender", { required: "Gender is required" })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
                </div>
                <div>
                  <Label>Date of Birth</Label>
                  <Input type="date" {...register("date_of_birth", { required: "DOB required" })} max={new Date().toISOString().split("T")[0]} />
                  {errors.date_of_birth && <p className="text-red-500 text-sm">{errors.date_of_birth.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Qualification</Label>
                  <Input {...register("qualification", { required: "Qualification required" })} />
                  {errors.qualification && <p className="text-red-500 text-sm">{errors.qualification.message}</p>}
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

                    {/* {image && (
                      <img
                        src={URL.createObjectURL(image)}
                        alt="Preview"
                        className="w-16 h-16 rounded-full object-cover border"
                      />
                    )} */}
                  </div>
                </div>


              </div>

              <div>
                <Label>Address</Label>
                <textarea {...register("address", { required: "Address required" })} className="w-full rounded-md border border-slate-300 p-2" rows={2}></textarea>
                {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => { reset(student); setEditMode(false); setImage(null); }}>
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
                <p className="font-medium text-slate-900 capitalize">{student.first_name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Last Name</p>
                <p className="font-medium text-slate-900 capitalize">{student.last_name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Gender</p>
                <p className="font-medium text-slate-900">{student.gender || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Date of Birth</p>
                <p className="font-medium text-slate-900">{student.date_of_birth || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Mobile</p>
                <p className="font-medium text-slate-900">{student.mobile_no || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Qualification</p>
                <p className="font-medium text-slate-900 capitalize">{student.qualification || "N/A"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-slate-500">Address</p>
                <p className="font-medium text-slate-900 capitalize">{student.address || "N/A"}</p>
              </div>
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
    </div>
  );
};

export default StudentsProfile;
