import { useContext, useEffect, useState, useMemo } from "react";
import { SponsorContext } from "../../contexts/dashboard/sponsorDashboardContext";
import { AuthContext } from "../../contexts/authContext";
import bgSponser from "../../assets/images/sponserDashboard/bgSponser.png";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Loading from "@/Loading";

export const RecruitmentDashboard = () => {
  const { API_BASE_URL, role, responseSubrole } = useContext(AuthContext);
  const {
    readyForRecruitment,
    GET_READY_FOR_RECRUITMENT,
    FetchRecuiter,
    dataFetched,
    setDataFetched,
  } = useContext(SponsorContext);

  const accessToken = localStorage.getItem("accessToken");


  const [searchStudent, setSearchStudent] = useState("");
  const [technology, setTechnology] = useState("");
  const [studentCount, setStudentCount] = useState("");
  const [availableStudent, setAvailableStudent] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);
  const [openRecruitModal, setOpenRecruitModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);




  useEffect(() => {
    if (
      (responseSubrole === "RECRUITER" || role === "ADMIN") &&
      !dataFetched["recruiter"]
    ) {
      Promise.all([GET_READY_FOR_RECRUITMENT(), FetchRecuiter()]).then(() => {
        setDataFetched((prev) => ({ ...prev, recruiter: true }));
      });
    }
  }, [
    responseSubrole,
    role,
    dataFetched,
    GET_READY_FOR_RECRUITMENT,
    FetchRecuiter,
    setDataFetched,
  ]);
  const isTechnologyValid =
    technology && technology !== "Select Technology";

  const isStudentCountValid =
    studentCount &&
    Number(studentCount) > 0 &&
    availableStudent !== null &&
    Number(studentCount) <= availableStudent;

  const isFormValid = isTechnologyValid && isStudentCountValid && !error;


  const handleStudentCountChange = (e) => {
    const value = e.target.value;

    if (!/^\d*$/.test(value)) {
      setError("Only numbers are allowed");
      return;
    }

    const num = Number(value);

    if (availableStudent === null) {
      setError("Please select a technology first");
      setStudentCount(value);
      return;
    }

    if (num === 0) {
      setError("Student count must be greater than 0");
      setStudentCount(value);
      return;
    }

    if (num > availableStudent) {
      setError(`Cannot exceed ${availableStudent} students`);
      setStudentCount(value);
      return;
    }

    setError("");
    setStudentCount(value);
  };

  const handleRecruitStudent = async () => {
    if (!isFormValid) return;

    setLoading(true);

    try {
      const payload = {
        technologies: [technology],
        num_students: Number(studentCount),
        remarks,
      };

      const response = await fetch(
        `${API_BASE_URL}/recruiter/select_students/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Recruitment failed");
      }

      // RESET FORM
      setTechnology("Select Technology");
      setStudentCount("");
      setRemarks("");
      setAvailableStudent(null);
      setError("");
      setOpenRecruitModal(false);
      setShowSuccessModal(true);
    } catch (err) {
      console.error(err);
      setError("Failed to recruit students. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const filteredStudents = useMemo(() => {
    return readyForRecruitment.filter((s) =>
      s.technology.toLowerCase().includes(searchStudent.toLowerCase())
    );
  }, [readyForRecruitment, searchStudent]);


  if (!dataFetched["recruiter"]) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-muted/10 mt-20 pb-40">
      <div className="max-w-7xl mx-auto px-6 space-y-10">

        {/* HERO */}
        <Card className="relative overflow-hidden shadow-none border bg-gradient-to-r from-[#2196f3] via-[#64b5f6] to-[#a2d6fc] rounded-xl">
          <CardHeader className="p-6 md:p-12 flex flex-col md:flex-row justify-between gap-6">
            <div className="text-white max-w-lg space-y-3">
              <CardTitle className="text-4xl font-bold">
                Ready for Recruitment
              </CardTitle>
              <CardDescription className="text-white/80">
                Discover skilled students and recruit talent aligned with your
                technology needs.
              </CardDescription>
            </div>
            <img
              src={bgSponser}
              alt="Recruitment"
              className="w-32 h-32 object-contain rounded-xl"
            />
          </CardHeader>
        </Card>

        {/* SEARCH */}
        <Input
          placeholder="Search Technology"
          value={searchStudent}
          onChange={(e) => setSearchStudent(e.target.value)}
          className="w-64"
        />

        {/* TABLE */}
        <Card className="shadow-none">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Technology</TableHead>
                  <TableHead className="text-center">
                    Available Students
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length ? (
                  filteredStudents.map((tech, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{tech.technology}</TableCell>
                      <TableCell className="text-center">
                        {tech.student_count}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-6">
                      No Students Found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* ACTION BAR */}
        <div className="fixed bottom-0 inset-x-0 bg-white border-t">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-center">
            <Button className="w-1/3" onClick={() => setOpenRecruitModal(true)}>
              Recruit Students
            </Button>
          </div>
        </div>

        {/* RECRUIT MODAL */}
        <Dialog open={openRecruitModal} onOpenChange={setOpenRecruitModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Recruit Students</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Select
                value={technology}
                onValueChange={(value) => {
                  setTechnology(value);
                  const tech = readyForRecruitment.find(t => t.technology === value);
                  setAvailableStudent(tech?.student_count ?? 0);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Technology" />
                </SelectTrigger>

                <SelectContent>
                  {readyForRecruitment.map((tech, idx) => (
                    <SelectItem
                      key={idx}
                      value={tech.technology}
                      disabled={tech.student_count === 0}
                    >
                      {tech.technology} ({tech.student_count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>


              <Input disabled value={availableStudent ?? ""} placeholder="Available students" />

              <Input
                placeholder="Number of students"
                value={studentCount}
                onChange={handleStudentCountChange}
              />

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Input
                placeholder="Remarks (Optional)"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>

            <DialogFooter>
              <Button
                className="w-full"
                disabled={!isFormValid || loading}
                onClick={handleRecruitStudent}
              >
                {loading ? "Submitting..." : "Confirm Recruitment"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* SUCCESS MODAL */}
        <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
          <DialogContent className="sm:max-w-sm [&>button]:hidden">
            <DialogHeader>
              <DialogTitle className="">
                Recruitment Successful
              </DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              Students have been recruited successfully.
            </p>
            <DialogFooter>
              <Button className="w-full" onClick={() => setShowSuccessModal(false)}>
                Continue
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
};
