import React, { useEffect, useState, useContext, useMemo } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/authContext";
import Loading from "@/Loading";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const AssignBatch = () => {
  const { API_BASE_URL } = useContext(AuthContext);

  const [learners, setLearners] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedLearners, setSelectedLearners] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);


  const token = localStorage.getItem("accessToken");


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [learnersRes, batchesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/Learner/selected_without_batch/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE_URL}/batches/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setLearners(learnersRes.data);
        setBatches(batchesRes.data);
      }
      catch (err) {
        if (err.response?.status === 403) {
          setPermissionDenied(true);
        } else {
          setError(err.response?.data?.detail || err.message);
        }
      }

      finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_BASE_URL, token]);



  const filteredLearners = useMemo(() => {
    return learners.filter(
      (l) =>
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [learners, search]);

  const allSelected =
    filteredLearners.length > 0 &&
    filteredLearners.every((l) => selectedLearners.includes(l.id));



  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedLearners([]);
    } else {
      setSelectedLearners(filteredLearners.map((l) => l.id));
    }
  };

  const toggleLearner = (id) => {
    setSelectedLearners((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAssignBatch = async () => {
    if (!selectedBatch) return;

    try {
      await axios.post(
        `${API_BASE_URL}/Learner/assign_batch/`,
        {
          learner_ids: selectedLearners,
          batch_id: selectedBatch,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setLearners((prev) =>
        prev.filter((l) => !selectedLearners.includes(l.id))
      );
      setSelectedLearners([]);
      setSelectedBatch("");
      setOpenDialog(false);
    }
    catch (err) {
      if (err.response?.status === 403) {
        setError("You do not have permission to assign batches.");
      } else {
        setError(err.response?.data?.detail || err.message);
      }
    }

  };



  if (loading) return <Loading />;

  if (error)
    return (
      <div className="text-red-500 text-center py-10">
        Error: {error}
      </div>
    );
    if (permissionDenied) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-3">
        <h2 className="text-xl font-semibol">
          Access Denied
        </h2>
        <p className="text-gray-600">
          You do not have permission to view or assign batches.
        </p>
      </div>
    </div>
  );
}


  return (
    <div className="p-6 mt-16 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Assign Batch</h2>


        {/* ACTION BAR */}
        <div className="fixed bottom-0 inset-x-0 bg-white border-t">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-center">
            <Button
              disabled={selectedLearners.length === 0}
              onClick={() => setOpenDialog(true)}
            >
              Assign Batch ({selectedLearners.length})
            </Button>
          </div>
        </div>
      </div>

      {/* Search */}
      <Input
        placeholder="Search name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {/* Table */}
      <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>

              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Mobile</TableHead>
              {/* <TableHead>Level</TableHead> */}
              <TableHead>Laptop</TableHead>
              <TableHead>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                />


              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredLearners.length ? (
              filteredLearners.map((l) => (
                <TableRow key={l.id}>

                  <TableCell className="capitalize font-medium">
                    {l.name}
                  </TableCell>
                  <TableCell>{l.email}</TableCell>
                  <TableCell>{l.mobile_no}</TableCell>
                  {/* <TableCell>
                    <Badge variant="outline">{l.level}</Badge>
                  </TableCell> */}
                  <TableCell>
                    <Badge>{l.laptop === "Y" ? "Yes" : "No"}</Badge>
                  </TableCell>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedLearners.includes(l.id)}
                      onChange={() => toggleLearner(l.id)}
                    />


                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  All students are assigned to batches
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/*Dialog*/}

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle>Assign Batch</DialogTitle>
            <DialogDescription>
              Select a batch for {selectedLearners.length} students
            </DialogDescription>
          </DialogHeader>

          <Select value={selectedBatch} onValueChange={setSelectedBatch}>
            <SelectTrigger>
              <SelectValue placeholder="Select batch" />
            </SelectTrigger>
            <SelectContent>
              {batches.map((b) => (
                <SelectItem key={b.id} value={b.batch_id}>
                  {b.batch_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button
              disabled={!selectedBatch}
              onClick={handleAssignBatch}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssignBatch;
