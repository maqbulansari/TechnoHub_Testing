import { AuthContext } from "@/contexts/authContext";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export const EditAssignmentDialog = ({ open, onOpenChange, assignment, onUpdated }) => {
  const { API_BASE_URL } = useContext(AuthContext);
  const token = localStorage.getItem("accessToken");
  const MAX_FILES = 4;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: "",
    new_files: [],
    existing_files: [],
    remove_files: [],
  });

  useEffect(() => {
    if (!assignment) return;

    setFormData({
      title: assignment.title || "",
      description: assignment.description || "",
      due_date: assignment.due_date || "",
      new_files: [],
      existing_files: assignment.assignment_file || [],
      remove_files: [],
    });
  }, [assignment]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const newFiles = Array.from(files);
      const activeExisting =
        formData.existing_files.length - formData.remove_files.length;

      const total =
        activeExisting + formData.new_files.length + newFiles.length;

      if (total > MAX_FILES) {
        alert(`Maximum ${MAX_FILES} files allowed`);
        return;
      }

      setFormData((prev) => ({
        ...prev,
        new_files: [...prev.new_files, ...newFiles],
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const removeExistingFile = (file) => {
    setFormData((prev) => ({
      ...prev,
      remove_files: [...prev.remove_files, file],
    }));
  };

  const removeNewFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      new_files: prev.new_files.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("due_date", formData.due_date);

      formData.new_files.forEach((f) =>
        data.append("assignment_file", f)
      );

      formData.remove_files.forEach((f) =>
        data.append("remove_files", f)
      );

      await axios.patch(
        `${API_BASE_URL}/assignments/${assignment.id}/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      onUpdated();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update assignment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Assignment</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input name="title" value={formData.title} onChange={handleChange} />

          <textarea
            name="description"
            rows={4}
            className="border rounded-md p-2 w-full"
            value={formData.description}
            onChange={handleChange}
          />

          <Input type="date" name="due_date" value={formData.due_date} onChange={handleChange} />

          {/* Existing files */}
          {formData.existing_files
            .filter((f) => !formData.remove_files.includes(f))
            .map((file, idx) => (
              <div key={idx} className="flex justify-between items-center border p-2 rounded">
                <span className="text-sm truncate">{file.split("/").pop()}</span>
                <Button size="icon" variant="ghost" onClick={() => removeExistingFile(file)}>✕</Button>
              </div>
            ))}

          {/* Add new files */}
          <label className="flex items-center gap-2 cursor-pointer">
            <Button variant="outline" size="sm" asChild>
              <span>📁 Add Files</span>
            </Button>
            <input type="file" multiple className="hidden" onChange={handleChange} />
          </label>

          {formData.new_files.map((f, idx) => (
            <div key={idx} className="flex justify-between items-center border p-2 rounded">
              <span className="text-sm truncate">{f.name}</span>
              <Button size="icon" variant="ghost" onClick={() => removeNewFile(idx)}>✕</Button>
            </div>
          ))}
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
