import React, { useContext, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { AuthContext } from "../../contexts/authContext";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

export const CreateBook = () => {
  const { API_BASE_URL } = useContext(AuthContext);
  const token = localStorage.getItem("accessToken");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("author", data.author);
      formData.append("short_desc", data.short_desc);
      formData.append("discussion_month", data.discussion_month);
      formData.append("discussion_year", data.discussion_year);
      formData.append("total_chapters", data.total_chapters);

      if (data.cover_image?.[0]) {
        formData.append("cover_image", data.cover_image[0]);
      }

      await axios.post(`${API_BASE_URL}/bookhub/books/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setModalMessage("Book created successfully!");
      setSubmitSuccess(true);
      reset();
    } catch (err) {
      console.error(err);
      const errorMsg =
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.detail ||
        "Failed to create book";
      setModalMessage(errorMsg);
      setSubmitSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto p-6 mt-20 border border-gray-200 shadow-sm rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Create Book
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Title */}
        <div className="flex flex-col gap-1">
          <Label>
            Title <span className="text-red-500">*</span>
          </Label>
          <Input
            {...register("title", { required: "Title is required" })}
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        {/* Author */}
        <div className="flex flex-col gap-1">
          <Label>
            Author <span className="text-red-500">*</span>
          </Label>
          <Input
            {...register("author", { required: "Author is required" })}
            disabled={isSubmitting}
          />
          {errors.author && (
            <p className="text-red-500 text-sm">{errors.author.message}</p>
          )}
        </div>

        {/* Month */}
        <div className="flex flex-col gap-1">
          <Label>
            Discussion Month <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="discussion_month"
            control={control}
            rules={{ required: "Month is required" }}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.discussion_month && (
            <p className="text-red-500 text-sm">
              {errors.discussion_month.message}
            </p>
          )}
        </div>

        {/* Year */}
        <div className="flex flex-col gap-1">
          <Label>
            Discussion Year <span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            {...register("discussion_year", {
              required: "Year is required",
              min: 2024,
            })}
            disabled={isSubmitting}
          />
          {errors.discussion_year && (
            <p className="text-red-500 text-sm">
              {errors.discussion_year.message}
            </p>
          )}
        </div>

        {/* Chapters */}
        <div className="flex flex-col gap-1">
          <Label>
            Total Chapters <span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            {...register("total_chapters", {
              required: "Total chapters required",
              min: 1,
            })}
            disabled={isSubmitting}
          />
          {errors.total_chapters && (
            <p className="text-red-500 text-sm">
              {errors.total_chapters.message}
            </p>
          )}
        </div>

        {/* Cover */}
        <div className="flex flex-col gap-1">
          <Label>Cover Image</Label>
          <Input
            type="file"
            accept="image/*"
            {...register("cover_image")}
            disabled={isSubmitting}
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2 flex flex-col gap-1">
          <Label>
            Short Description <span className="text-red-500">*</span>
          </Label>
          <textarea
            rows={4}
            className="rounded-md border px-3 py-2 text-sm resize-none"
            {...register("short_desc", { required: "Description is required" })}
            disabled={isSubmitting}
          />
          {errors.short_desc && (
            <p className="text-red-500 text-sm">
              {errors.short_desc.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="md:col-span-2 flex justify-center mt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Book"}
          </Button>
        </div>
      </form>

      {/* SAME Dialog Pattern */}
      <Dialog open={submitSuccess} onOpenChange={setSubmitSuccess}>
        <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden [&>button]:hidden rounded-xl">
          <DialogHeader className="px-5 pt-4 pb-4 space-y-1">
            <DialogTitle className="text-xl pb-2 font-semibold">
              {modalMessage === "Book created successfully!" ? "Success" : "Error"}
            </DialogTitle>
            <DialogDescription className="text-sm pb-2 text-muted-foreground">
              {modalMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="px-3 pb-3 bg-muted/30">
            <Button
              onClick={() => setSubmitSuccess(false)}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CreateBook;
