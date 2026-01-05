import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/authContext";
import axios from "axios";
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
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

const AssignBatchForTrainer = () => {
  const { batches, fetchBatches, API_BASE_URL } = useContext(AuthContext);
  const [allTrainer, setAllTrainer] = useState([]);
  const [loadingTrainers, setLoadingTrainers] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [trainerId, setTrainerId] = useState("");
  const [batchId, setBatchId] = useState("");
  const [errors, setErrors] = useState({});

  const token = localStorage.getItem("accessToken");

  // Fetch all trainers
  useEffect(() => {
    const fetchAllTrainer = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${API_BASE_URL}/trainers/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllTrainer(res.data);
      } catch (err) {
        setModalTitle("Error");
        setModalMessage("Failed to fetch trainers");
        setModalOpen(true);
      } finally {
        setLoadingTrainers(false);
      }
    };

    fetchAllTrainer();
    fetchBatches();
  }, [API_BASE_URL, fetchBatches, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!trainerId) newErrors.trainerId = "Trainer is required";
    if (!batchId) newErrors.batchId = "Batch is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      await axios.post(
        `${API_BASE_URL}/batches/assign_trainers_for_admin/`,
        {
          batch_id: batchId,
          trainer_ids: [parseInt(trainerId)],
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setModalTitle("Success");
      setModalMessage("Batch assigned to trainer successfully!");
      setModalOpen(true);
      setTrainerId("");
      setBatchId("");
    } catch (err) {
      setModalTitle("Error");
      setModalMessage(
        err.response?.data?.message || "Failed to assign batch"
      );
      setModalOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-20 px-4">
      <Card className="p-6 space-y-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-center">
          Assign Batch to Trainer
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Trainer Select */}
          <div>
            <label className="block text-gray-900 font-medium mb-1">
              Select Trainer <span className="text-red-500">*</span>
            </label>
            <Select
              value={trainerId}
              onValueChange={setTrainerId}
              disabled={loadingTrainers || submitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a trainer" />
              </SelectTrigger>
              <SelectContent>
                {allTrainer.map((trainer) => (
                  <SelectItem key={trainer.id} value={trainer.id.toString()}>
                    {trainer.first_name} {trainer.last_name} - {trainer.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.trainerId && (
              <p className="text-red-500 text-sm mt-1">{errors.trainerId}</p>
            )}
          </div>

          {/* Batch Select */}
          <div>
            <label className="block text-gray-900 font-medium mb-1">
              Select Batch <span className="text-red-500">*</span>
            </label>
            <Select
              value={batchId}
              onValueChange={setBatchId}
              disabled={submitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a batch" />
              </SelectTrigger>
              <SelectContent>
                {batches.map((batch) => (
                  <SelectItem
                    key={batch.batch_id}
                    value={batch.batch_id.toString()}
                  >
                    {batch.batch_name} - {batch.center}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.batchId && (
              <p className="text-red-500 text-sm mt-1">{errors.batchId}</p>
            )}
          </div>

          <div className="flex justify-center">
            <Button type="submit" disabled={submitting} className="w-1/2">
              {submitting ? "Assigning..." : "Assign Batch"}
            </Button>
          </div>
        </form>
      </Card>

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden [&>button]:hidden rounded-xl">
          {/* Header */}
          <DialogHeader className="px-5 pt-4 pb-4 space-y-1">
            <DialogTitle className="text-xl pb-2 font-semibold">
              {modalTitle}
            </DialogTitle>
            <DialogDescription className="text-sm pb-2 text-muted-foreground leading-relaxed">
              {modalMessage}
            </DialogDescription>
          </DialogHeader>

          {/* Footer */}
          <DialogFooter className="px-3 pb-3 bg-muted/30">
            <Button
              onClick={() => setModalOpen(false)}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssignBatchForTrainer;
