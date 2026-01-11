import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/authContext";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Loading from "@/Loading";


const StudentsBatches = () => {
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const { API_BASE_URL } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/batches/students_in_batch/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBatch(response.data);
      } catch (error) {
        console.error("Error fetching batch data:", error);
        setBatch(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_BASE_URL]);

  if (loading) {
    return (
      <Loading/>
    );
  }

  if (!batch) {
    return (
      <div className="mt-10 px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600 font-semibold text-lg">No batch data available</p>
          <p className="text-red-500 text-sm mt-1">
            Please check your connection or contact support.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-20 px-4  mx-auto">
      <h2 className="text-2xl font-semibold text-left pb-4">
        Student Batch
      </h2>

      <Card className="overflow-hidden max-w-xl rounded-2xl border border-slate-200">
        {/* Card Header */}
        <CardHeader className="bg-gradient-to-r from-[#2196f3] via-[#64b5f6] to-[#a2d6fc] p-5 flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-white/90 capitalize tracking-wide">
            {batch.batch_name}
          </h2>
          <p className="text-sm text-white/90">{`Starts on ${batch.start_date} | Duration: ${batch.duration}`}</p>
        </CardHeader>

        {/* Card Content */}
        <CardContent className="p-5 flex flex-col gap-4">
          {/* Trainers */}
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-500 ">Trainer(s):</span>
            <div className="flex flex-wrap gap-2">
              {batch.trainers.map((trainer, idx) => (
                <Badge key={idx} variant="outline">
                  {trainer}
                </Badge>
              ))}
            </div>
          </div>

          {/* Technologies */}
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-500 ">Technologies:</span>
            <div className="flex flex-wrap gap-2">
              {batch.technologies.map((tech, idx) => (
                <Badge key={idx} variant="outline">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {/* Assignments Button */}
          <div className="mt-4 flex justify-center">
            <Button
              variant="outlinegray"
              className="w-1/2"
              onClick={() => navigate("/StudentAssignment")}
            >
              View Assignments
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentsBatches;
