import React, { useContext, useState, useEffect, useMemo } from "react";
import { AuthContext } from "../../contexts/authContext";
import axios from "axios";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const AllTrainer = () => {
  const { API_BASE_URL } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [allTrainer, setAllTrainer] = useState([]);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [techFilter, setTechFilter] = useState("all");

  const token = localStorage.getItem("accessToken");

  const navigate = useNavigate();


  const fetchAllTrainer = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/trainers/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllTrainer(response.data);
    } catch (err) {
      setError("Failed to fetch trainers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTrainer();
  }, []);

  const allTechnologies = useMemo(() => {
    return [
      ...new Set(
        allTrainer.flatMap((trainer) => trainer.technologies || [])
      ),
    ];
  }, [allTrainer]);

  const filteredTrainers = useMemo(() => {
    return allTrainer.filter((trainer) => {
      const fullName = `${trainer.first_name} ${trainer.last_name}`.toLowerCase();

      const matchesSearch =
        fullName.includes(search.toLowerCase()) ||
        trainer.email.toLowerCase().includes(search.toLowerCase());

      const matchesGender =
        genderFilter === "all" || trainer.gender === genderFilter;

      const matchesTech =
        techFilter === "all" ||
        trainer.technologies?.includes(techFilter);

      return matchesSearch && matchesGender && matchesTech;
    });
  }, [allTrainer, search, genderFilter, techFilter]);

  if (loading) return <Loading />;

  if (error)
    return (
      <div className="text-red-500 text-center py-10">{error}</div>
    );

  return (
    <div className="p-6 mt-16 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-semibold">Trainer Information</h2>  <Button variant="outline" onClick={() => navigate("/AssignBatchForTrainer")}>
          Assign Trainer Batch
        </Button> </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 lg:w-1/2">
        <Input
          placeholder="name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-1/3"
        />

        <Select value={genderFilter} onValueChange={setGenderFilter}>
          <SelectTrigger className="md:w-40">
            <SelectValue placeholder="Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Gender</SelectItem>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
          </SelectContent>
        </Select>

        <Select value={techFilter} onValueChange={setTechFilter}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Technology" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Technologies</SelectItem>
            {allTechnologies.map((tech) => (
              <SelectItem key={tech} value={tech}>
                {tech}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border max-h-[70vh] bg-white shadow-sm overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Job Title</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Technologies</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Gender</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredTrainers.length > 0 ? (
              filteredTrainers.map((trainer) => (
                <TableRow key={trainer.id}>
                  <TableCell className="font-medium capitalize text-nowrap">
                    {trainer.first_name} {trainer.last_name}
                  </TableCell>
                  <TableCell className="capitalize text-nowrap">
                    {trainer.job_title}
                  </TableCell>
                  <TableCell>{trainer.experience} yrs</TableCell>
                  <TableCell className="flex flex-wrap gap-1 border-none">
                    {trainer.technologies?.length ? (
                      trainer.technologies.map((tech, idx) => (
                        <Badge key={idx} variant="outline">
                          {tech}
                        </Badge>
                      ))
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell>{trainer.email}</TableCell>
                  <TableCell>{trainer.mobile_no || "N/A"}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {trainer.gender || "N/A"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  No trainers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AllTrainer;
