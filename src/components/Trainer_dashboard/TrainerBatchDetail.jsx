import React, { useContext, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../contexts/authContext";
import Loading from "@/Loading";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { GraduationCap, Building2, Code2 } from "lucide-react";

const TrainerBatchDetail = () => {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const { API_BASE_URL } = useContext(AuthContext);

  const [batch, setBatch] = useState(null);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchBatch = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(
          `${API_BASE_URL}/trainers/batches/${batchId}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBatch(res.data.data);
      } catch (err) {
        console.error("Failed to load batch", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBatch();
  }, [batchId, API_BASE_URL]);

  const students = useMemo(() => {
    if (!batch) return [];
    return batch.students
      .filter((s) =>
        s.student_name.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => a.student_name.localeCompare(b.student_name));
  }, [batch, search]);

  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id]
    );
  };

  const submit = async () => {
    if (!selected.length) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(
        `${API_BASE_URL}/Trainer/trainer_select/`,
        {
          batch_id: batch.batch_id,
          student_ids: selected,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
    } catch (err) {
      console.error("Submit failed", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-muted/40 pt-20 pb-32">
      <div className="max-w-7xl mx-auto px-6 space-y-10">

        {/* HERO CARD */}

        <Card className="relative overflow-hidden shadow-none border border-border/40  bg-gradient-to-r from-[#2196f3] via-[#64b5f6] to-[#a2d6fc]


"><div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_60%)]" />

          <CardHeader className="relative z-10 pb-8 pt-8 md:pt-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="space-y-2">
                <Badge className="bg-white/10 text-white border-0 backdrop-blur">
                  <GraduationCap className="h-3.5 w-3.5 mr-1" />
                  Batch Overview
                </Badge>

                <CardTitle className="text-3xl md:text-4xl font-semibold text-white capitalize tracking-tight">
                  {batch.batch_name}
                </CardTitle>

                <CardDescription className="text-white/70 flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span className="capitalize">{batch.center}</span>
                </CardDescription>
              </div>

              <div className="flex flex-wrap gap-2">
                {batch.technologies.map((tech) => (
                  <Badge
                    key={tech.technology_id}
                    className="bg-white/10 text-white border-0 backdrop-blur px-3 py-1 capitalize"
                  >
                    <Code2 className="h-3.5 w-3.5 mr-1" />
                    {tech.technology_name}
                  </Badge>
                ))}
              </div>
            </div>
          </CardHeader>
        </Card>



        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Students Info */}
          <Card className="border rounded-xl bg-gray-200 shadow-none">
            <CardContent className="p-4 flex flex-col">
              <p className="text-sm text-muted-foreground uppercase">Total Students</p>
              <p className="text-2xl font-bold">{batch.student_count}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Trainer: <span className="font-medium capitalize">{batch.trainer_name}</span>
              </p>
            </CardContent>
          </Card>

          {/* Selection Progress */}
          <Card className="border rounded-xl bg-gray-200 shadow-none">
            <CardContent className="p-4 flex flex-col gap-3">
              <p className="text-sm text-muted-foreground uppercase">Selection Progress</p>
              <div className="flex justify-between text-sm font-medium">
                <span>{selected.length} selected</span>
                <span>{batch.student_count} total</span>
              </div>
              <div className="w-full h-3 bg-white/90 rounded-full overflow-hidden">
                <div
                  className="h-3 bg-[#2196f3] rounded-full transition-all duration-300"
                  style={{
                    width: `${batch.student_count ? (selected.length / batch.student_count) * 100 : 0}%`,
                  }}
                ></div>
              </div>
              {/* Optional text indicator */}
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round((selected.length / batch.student_count) * 100 || 0)}% complete
              </p>
            </CardContent>
          </Card>
        </div>


        {/* SEARCH */}
        <Input
          placeholder="Search student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />

        {/* TABLE */}
        <Card className="shadow-none">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead className="text-right">Industry Ready</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {students.length ? (
                  students.map((s) => (
                    <TableRow
                      key={s.student_id}
                      className={`transition ${s.trainer_is_selected
                        ? "opacity-50"
                        : "hover:bg-muted/50"
                        }`}
                    >
                      <TableCell className="capitalize font-medium">
                        {s.student_name}
                      </TableCell>

                      <TableCell className="text-center">
                        <input
                          type="checkbox"
                          checked={s.trainer_is_selected || selected.includes(s.student_id)}
                          disabled={s.trainer_is_selected}
                          onChange={() => toggle(s.student_id)}
                          className={`h-4 w-4 text-[#2196f3] border-gray-300 rounded-sm focus:ring-0 cursor-pointer`}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No students found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* STICKY ACTION BAR */}

      <div className="fixed bottom-0 inset-x-0 bg-white border-t shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-center">
          <Button
            disabled={!selected.length || submitting}
            onClick={submit}
            className="w-1/3"
          >
            {submitting ? "Submitting..." : "Submit for Assessment"}
          </Button>
        </div>
      </div>



      {/* Dialog Modal */}
      <Dialog open={success} onOpenChange={setSuccess}>
        <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden [&>button]:hidden rounded-xl">
          <DialogHeader className="px-5 pt-4 pb-4 space-y-1">
            <DialogTitle className="text-xl pb-2 font-semibold">
              Success
            </DialogTitle>
            <p className="text-sm pb-2 text-muted-foreground leading-relaxed">
              Students have been successfully submitted for assessment.
            </p>
          </DialogHeader>
          <DialogFooter className="px-3 pb-3 bg-muted/30">
            <Button
              onClick={() => {
                setSuccess(false);
                // navigate("/Trainer_batch"); // Navigate after closing
              }}
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

export default TrainerBatchDetail;
