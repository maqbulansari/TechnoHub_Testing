import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { AuthContext } from "../../contexts/authContext";
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

  // Normalize null values
  const normalizeStudent = (data) => ({
    ...data,
    address: data.address ?? "",
    qualification: data.qualification ?? "",
    date_of_birth: data.date_of_birth ?? "",
    gender: data.gender ?? "",
    mobile_no: data.mobile_no ?? "",
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const fetchStudent = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/Students/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const re = await axios.get(`${API_BASE_URL}/student-dashboard/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(re);


        const normalizedData = normalizeStudent(response.data);

        setStudent(normalizedData);
        reset(normalizedData);
      } catch (err) {
        console.error("Failed to fetch student:", err);
      }
    };

    fetchStudent();
  }, [API_BASE_URL, reset]);

  const onSubmit = async (data) => {
    if (!student) return;

    setLoading(true);
    setApiErrors({});
    const token = localStorage.getItem("accessToken");

    const formData = new FormData();


    delete data.user_profile;

    // append only non-empty values
    Object.entries(data).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });


    if (image instanceof File) {
      formData.append("user_profile", image);
    }

    try {
      await axios.put(
        `${API_BASE_URL}/Students/${student.id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStudent({ ...student, ...data });
      reset({ ...student, ...data });
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


  if (!student) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto mt-20 px-4">
      <Card className="overflow-hidden shadow-none rounded-2xl border border-slate-200">
        <CardHeader className="flex flex-col md:flex-row items-center gap-4 bg-blue-50 p-4">
          <Avatar className="w-32 h-32">
            {student.user_profile ? (
              <AvatarImage
                src={`${API_BASE_URL}${student.user_profile}`}
                alt="Profile"
              />
            ) : (
              <AvatarFallback className="bg-primary text-white text-4xl font-bold">
                {student.first_name?.charAt(0)}
              </AvatarFallback>
            )}
          </Avatar>

          <div className="flex-1 text-center md:text-left space-y-1">
            <h2 className="text-2xl font-semibold text-slate-900 capitalize">
              {student.first_name} {student.last_name}
            </h2>
            <p className="text-sm text-slate-500">{student.email}</p>
            <Badge variant="outline">Batch: {student.batch}</Badge>
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
                  <Input
                    {...register("first_name", {
                      required: "First name is required",
                      minLength: { value: 2, message: "Minimum 2 characters" },
                      pattern: { value: /^[A-Za-z\s]+$/, message: "Only letters and spaces allowed" }
                    })}
                  />
                  {errors.first_name && (
                    <p className="text-red-500 text-sm">
                      {errors.first_name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Last Name</Label>
                  <Input
                    {...register("last_name", {
                      required: "Last name is required",
                      minLength: { value: 2, message: "Minimum 2 characters" },
                      pattern: { value: /^[A-Za-z\s]+$/, message: "Only letters and spaces allowed" }
                    })}
                  />
                  {errors.last_name && (
                    <p className="text-red-500 text-sm">
                      {errors.last_name.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address" }
                    })}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Mobile Number</Label>
                  <Input
                    {...register("mobile_no", {
                      required: "Mobile number is required",
                      pattern: { value: /^[0-9]{10,15}$/, message: "Please enter a valid mobile number (10-15 digits)" }
                    })}
                  />
                  {errors.mobile_no && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.mobile_no.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Gender</Label>
                  <Controller
                    name="gender"
                    control={control}
                    rules={{ required: "Gender is required" }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
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
                  {errors.gender && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.gender.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    {...register("date_of_birth")}
                    max={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Qualification</Label>
                  <Input {...register("qualification")} />
                </div>

                <div>
                  <Label>Profile Image</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="profileImage"
                      onChange={(e) =>
                        setImage(e.target.files?.[0] || null)
                      }
                    />
                    <label htmlFor="profileImage">
                      <Button variant="outline" asChild>
                        <span>{image ? image.name : "Choose file"}</span>
                      </Button>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <Label>Address</Label>
                <textarea
                  {...register("address")}
                  className="w-full rounded-md border border-slate-300 p-2"
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    reset(student);
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
              <Info label="First Name" value={student.first_name} />
              <Info label="Last Name" value={student.last_name} />
              <Info label="Gender" value={student.gender} />
              <Info label="Date of Birth" value={student.date_of_birth} />
              <Info label="Mobile" value={student.mobile_no} />
              <Info label="Qualification" value={student.qualification} />
              <div className="col-span-2">
                <Info label="Address" value={student.address} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={submitSuccess} onOpenChange={setSubmitSuccess}>
        <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden [&>button]:hidden rounded-xl">
          <DialogHeader className="px-5 pt-4 pb-4">
            <DialogTitle className="text-xl font-semibold">
              Success
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Profile updated successfully!
            </p>
          </DialogHeader>
          <DialogFooter className="px-3 pb-3 bg-muted/30">
            <Button onClick={() => setSubmitSuccess(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <Dialog open={errorModalOpen} onOpenChange={setErrorModalOpen}>
        <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden [&>button]:hidden rounded-xl">
          <DialogHeader className="px-5 pt-4 pb-4 space-y-1">
            <DialogTitle className="text-xl font-semibold">
              Update Failed
            </DialogTitle>
          </DialogHeader>

          <div className="px-5 pb-4 space-y-2">
            {Object.entries(apiErrors).map(([field, messages]) =>
              messages.map((msg, idx) => (
                <p key={`${field}-${idx}`} className="text-sm text-red-500">
                  {field === "id_type"
                    ? "Please select a valid ID type."
                    : field === "user_profile"
                      ? "Please upload a valid image file."
                      : msg}
                </p>
              ))
            )}
          </div>

          <DialogFooter className="px-3 pb-3 bg-muted/30">
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
    <p className="font-medium text-slate-900 capitalize">
      {value || "N/A"}
    </p>
  </div>
);

export default StudentsProfile;
