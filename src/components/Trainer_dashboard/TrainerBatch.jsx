import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../contexts/authContext";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import TrainerImage from "../../assets/images/trainers/Trainer.jpg";

const TrainerBatch = () => {
  const { loginSuccess, setLoginSuccess, API_BASE_URL } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [batches, setBatches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (loginSuccess) {
      setShowModal(true);
      const timeout = setTimeout(() => {
        setShowModal(false);
        setLoginSuccess(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [loginSuccess]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const fetchBatches = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/batches/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBatches(response.data);
      } catch (error) {
        console.error("Error fetching batches:", error);
      }
    };

    fetchBatches();
  }, [API_BASE_URL]);

  const handleCardClick = (batchId) => {
    navigate(`/AllAssignments/${batchId}`);
  };
  const handleCardClickAssessment = (batchId) => {
    navigate(`/TrainerBatchDetail/${batchId}`);
  };

  return (
    <div className="max-w-6xl mx-auto mt-20 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Batches</h1>

      {/* Batch Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {batches.map((batch) => (
          <Card
            key={batch.id}
            className=" hover:border border-gray-300 flex flex-col justify-between"
           
          >
            <CardHeader  onClick={() => handleCardClick(batch.id)} className="cursor-pointer flex flex-col items-center text-center pb-2 pt-4">
              <img
                src={TrainerImage}
                alt={batch.batch_name}
                className="w-20 h-20 rounded-full object-cover mb-2"
              />
              <h2 className="text-lg font-semibold uppercase truncate w-full">{batch.batch_name}</h2>
              <Badge
                variant={batch.status.toLowerCase() === "active" ? "green" : "green"}
                className="mt-1"
              >
                {batch.status}
              </Badge>
            </CardHeader>

            <CardContent className="text-sm text-gray-700 space-y-1 p-3 flex-1 flex flex-col justify-between">
              <div className="space-y-1">
                <p><strong>Students:</strong> {batch.student_count}/{batch.capacity}</p>
                <p className="truncate"><strong>Trainer:</strong> {batch.trainer?.join(", ") || "N/A"}</p>
                <p className="truncate"><strong>Center:</strong> {batch.center}</p>
              </div>
              <div className="text-xs text-gray-500 mt-2 flex justify-between">
                <span><strong>Start:</strong> {batch.start_date}</span>
                <span><strong>End:</strong> {batch.end_date}</span>
              </div>
              <Button onClick={() => handleCardClickAssessment(batch.batch_id)} variant="outline">Assessment</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Login Success Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Welcome!</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center">
            <p className="text-gray-700">Login successful!</p>
          </div>
          <DialogFooter className="flex justify-center">
            <Button onClick={() => setShowModal(false)}>Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrainerBatch;
