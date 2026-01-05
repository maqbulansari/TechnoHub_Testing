import React, { useContext, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../contexts/authContext";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";    

export const CreateAssignments = () => {
  const { batchId } = useParams(); 
  const { API_BASE_URL,user } = useContext(AuthContext);
  const token = localStorage.getItem("accessToken");

  const [batch, setBatch] = useState(null);
  const [trainers, setTrainers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  console.log(batchId);
  
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm();



  const onSubmit = async (data) => {
    setIsSubmitting(true);
    console.log(data);
    

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("due_date", data.due_date);
      formData.append("batch", batchId); 
      formData.append("trainer", user.id);

      if (data.assignment_file?.[0]) {
        formData.append("assignment_file", data.assignment_file[0]);
      }

      await axios.post(
        `${API_BASE_URL}/assignments/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      reset();
      alert("Assignment created successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to create assignment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 pt-4 pb-3 border rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Create Assignment
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 "
      >
        {/* Batch (Read-only) */}
        {/* <div className="flex flex-col md:col-span-2">
          <Label>Batch</Label>
          <Input
            value={batch?.batch_name || "Loading..."}
            disabled
          />
        </div> */}

        {/* Title */}
        <div className="flex flex-col md:col-span-2">
          <Label className="pb-1" htmlFor="title">Assignment Title</Label>
          <Input
            id="title"
            {...register("title", { required: "Title is required" })}
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="flex flex-col md:col-span-2">
          <Label className="pb-1" htmlFor="description">Description</Label>
          <textarea
            id="description"
            rows={4}
            className="border rounded-md p-2"
            {...register("description", {
              required: "Description is required",
            })}
            disabled={isSubmitting}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Due Date */}
        <div className="flex flex-col">
          <Label className="pb-1" htmlFor="due_date">Due Date</Label>
          <Input
            type="date"
            min={today}
            id="due_date"
            {...register("due_date", {
              required: "Due date is required",
            })}
            disabled={isSubmitting}
          />
          {errors.due_date && (
            <p className="text-red-500 text-sm">
              {errors.due_date.message}
            </p>
          )}
        </div>

        {/* Trainer */}
        {/* <div className="flex flex-col">
          <Label>Trainer</Label>
          <Controller
            name="trainer"
            control={control}
            rules={{ required: "Trainer is required" }}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select trainer" />
                </SelectTrigger>
                <SelectContent>
                  {trainers.map((t) => (
                    <SelectItem key={t.id} value={t.id.toString()}>
                      {t.first_name} {t.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.trainer && (
            <p className="text-red-500 text-sm">
              {errors.trainer.message}
            </p>
          )}
        </div> */}

        {/* File Upload */}
        <div className="flex flex-col md:col-span-2">
          <Label className="pb-1" htmlFor="assignment_file">
            Assignment File (optional)
          </Label>
          <Input
            type="file"
            id="assignment_file"
            {...register("assignment_file")}
            disabled={isSubmitting}
          />
        </div>

        {/* Submit */}
        <div className="md:col-span-2 flex justify-center mt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Assignment"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateAssignments;
