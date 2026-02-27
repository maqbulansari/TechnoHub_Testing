import { useContext, useEffect, useState, useMemo } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/authContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { GraduationCap } from "lucide-react";
import { Badge } from "../ui/badge";
import bgSponser from "../../assets/images/sponserDashboard/bgSponser.png";

export const Students_SponserDashboard = () => {
  const { API_BASE_URL, accessToken, role, responseSubrole, hasSubrole, hasRole } = useContext(AuthContext);

  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [sponsorDetails, setSponsorDetails] = useState({});
  const [selectedStudents, setSelectedStudents] = useState({});
  const [selectedBatch, setSelectedBatch] = useState("Filter Batch");
  const [searchStudent, setSearchStudent] = useState("");

  const [loadingData, setLoadingData] = useState(true); // NEW: loading state for data
  const [submitting, setSubmitting] = useState(false);
  const [modalMessage, setModalMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch students, batches, sponsor details
  const fetchAllData = async () => {
    setLoadingData(true);
    try {
      const [studentsRes, batchesRes, sponsorRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/sponsors/available_students/`, { headers: { Authorization: `Bearer ${accessToken}` } }),
        axios.get(`${API_BASE_URL}/batches/`, { headers: { Authorization: `Bearer ${accessToken}` } }),
        axios.get(`${API_BASE_URL}/sponsors/`, { headers: { Authorization: `Bearer ${accessToken}` } }),
      ]);

      if (studentsRes.status === 200) setStudents(studentsRes.data.students_to_sponsor);
      if (batchesRes.status === 200) setBatches(batchesRes.data);
      if (sponsorRes.status === 200) setSponsorDetails(sponsorRes.data[0] || {});
    } catch (err) {
      console.log(err);
      setModalMessage("Failed to load data. Please try again.");
      setShowModal(true);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (responseSubrole?.includes("SPONSOR") || role === "SPONSOR" || role === "ADMIN") {
      fetchAllData();
    }
  }, [responseSubrole, role, hasSubrole, hasRole]);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const name = s.student_name?.toLowerCase() || "";
      const search = searchStudent.toLowerCase();
      const batch = `${s.batch_name} ${s.batch_id}`;
      const matchName = name.includes(search);
      const matchBatch = selectedBatch === "Filter Batch" || batch === selectedBatch;
      return matchName && matchBatch;
    });
  }, [students, searchStudent, selectedBatch]);

  const totalSelected = Object.values(selectedStudents).filter(Boolean).length;

  const toggleStudent = (id) => {
    setSelectedStudents((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSelectAll = () => {
    const allSelected = filteredStudents.every((s) => selectedStudents[s.student_id]);
    const newSelection = {};
    filteredStudents.forEach((s) => {
      newSelection[s.student_id] = !allSelected;
    });
    setSelectedStudents((prev) => ({ ...prev, ...newSelection }));
  };

  const loadScript = (src) =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const submit = async () => {
    if (!totalSelected) {
      setModalMessage("Please select at least one student to sponsor.");
      setShowModal(true);
      return;
    }

    const selectedIds = filteredStudents
      .filter((s) => selectedStudents[s.student_id])
      .map((s) => s.student_id);

    const totalAmount = filteredStudents
      .filter((s) => selectedStudents[s.student_id])
      .reduce((sum, s) => sum + (s.fee || 0), 0);

    try {
      setSubmitting(true);
      const res = await axios.post(
        `${API_BASE_URL}/sponsors/create-order/`,
        { student_ids: selectedIds, amount: totalAmount },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const { order_id, key_id, sponsorship_id, student_name } = res.data;

      localStorage.setItem(
        "currentStudentInfo",
        JSON.stringify({
          studentIds: selectedIds,
          studentName: student_name,
          sponsorshipId: sponsorship_id,
        })
      );

      const scriptLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!scriptLoaded) {
        setModalMessage("Razorpay SDK failed to load.");
        setShowModal(true);
        return;
      }

      const options = {
        key: key_id,
        amount: totalAmount * 100,
        currency: "INR",
        name: "Techno Hub",
        description: "Sponsor Students",
        order_id,
        handler: async (paymentResponse) => {
          try {
            await axios.post(
              `${API_BASE_URL}/sponsors/verify-payment/`,
              {
                sponsorship_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_signature: paymentResponse.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            localStorage.removeItem("currentStudentInfo");
            setModalMessage("Payment successful!");
            setShowModal(true);
            setTimeout(() => window.location.reload(), 2000);
          } catch (err) {
            const savedInfo = localStorage.getItem("currentStudentInfo");
            const studentInfo = savedInfo ? JSON.parse(savedInfo) : {};
            setModalMessage(
              `Payment verification failed for ${studentInfo.studentName || ""}. Please try again.`
            );
            setShowModal(true);
          }
        },
        modal: { ondismiss: () => console.log("Payment cancelled") },
        prefill: { name: "Techno Hub", email: "technohub@example.com", contact: "9999999999" },
        theme: { color: "#2563eb" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.log(err);
      setModalMessage("Error creating payment. Please try again.");
      setShowModal(true);
    } finally {
      setSubmitting(false);
    }
  };
  if (loadingData) {
    return <Loading />
  }

  return (
    <div className="min-h-screen bg-muted/10 mt-20 pb-40">
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        <>

          {/* HERO SECTION */}
          <Card className="relative overflow-hidden shadow-none border border-border/40 bg-gradient-to-r from-[#2196f3] via-[#64b5f6] to-[#a2d6fc] rounded-xl">
            {/* Decorative radial gradient overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_60%)]" />

            <CardHeader className="relative z-10 p-6 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              {/* Left Section: Title and Description */}
              <div className="space-y-4 text-white max-w-lg">
                <Badge className="bg-white/20 text-white text-nowrap border-0 backdrop-blur px-2 py-1">
                  <GraduationCap className="h-4 w-4 mr-1" />
                  Sponsor Dashboard
                </Badge>

                <CardTitle className="text-3xl md:text-4xl font-bold tracking-tight">
                  Empower Students
                </CardTitle>

                <CardDescription className="text-white/80 leading-relaxed">
                  View available students, manage sponsorships, and track progress. Your contribution shapes their future.
                </CardDescription>


              </div>

              {/* Right Section: Illustration / Image */}
              <img
                src={bgSponser}
                alt="Sponsor Dashboard"
                className="hidden md:block rounded-xl w-44 h-44 object-contain"
              />


            </CardHeader>
          </Card>

          {/* STATS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border rounded-xl bg-gray-200 shadow-none">
              <CardContent className="p-4 flex flex-col">
                <p className="text-sm text-muted-foreground uppercase">Total Students</p>
                <p className="text-2xl font-bold">{students.length}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Sponsor: <span className="font-medium capitalize">{sponsorDetails.first_name || "N/A"}</span>
                </p>
              </CardContent>
            </Card>
            <Card className="border rounded-xl bg-gray-200 shadow-none">
              <CardContent className="p-4 flex flex-col">
                <p className="text-sm text-muted-foreground uppercase tracking-wide">Selected Students</p>
                <p className="text-2xl font-bold">{totalSelected}</p>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-3 bg-[#2196f3] rounded-full transition-all duration-300"
                    style={{ width: students.length ? `${(totalSelected / students.length) * 100}%` : "0%" }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  {students.length ? Math.round((totalSelected / students.length) * 100) : 0}% complete
                </p>
              </CardContent>
            </Card>
          </div>

          {/* FILTERS */}
          <div className="flex flex-wrap gap-4 items-center justify-start">
            <Button variant="outline" onClick={toggleSelectAll} className="whitespace-nowrap">
              {totalSelected === filteredStudents.length && filteredStudents.length > 0
                ? "Deselect All"
                : "Select All"}
            </Button>

            <div className="relative w-full max-w-sm">
              <Input
                placeholder="Search Student"
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
                className="pr-10"
              />
            </div>

            <Select value={selectedBatch} onValueChange={setSelectedBatch}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter Batch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Filter Batch">Filter Batch</SelectItem>
                {batches.map((b) => (
                  <SelectItem key={b.batch_id} value={`${b.batch_name} ${b.batch_id}`}>
                    {b.batch_name} {b.batch_id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* STUDENTS TABLE */}
          <Card className="shadow-none mt-4">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="text-center">Select</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length ? (
                    filteredStudents.map((student) => (
                      <TableRow key={student.student_id} className="hover:bg-muted/50 transition">
                        <TableCell className="capitalize">{student.student_name}</TableCell>
                        <TableCell>{student.batch_name} {student.batch_id}</TableCell>
                        <TableCell>{student.fee}</TableCell>
                        <TableCell className="text-center">
                          <input
                            type="checkbox"
                            checked={!!selectedStudents[student.student_id]}
                            onChange={() => toggleStudent(student.student_id)}
                            className="h-4 w-4 text-[#2196f3] border-gray-300 rounded-sm cursor-pointer"
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                        No students found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>

      </div>

      {/* STICKY ACTION BAR */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-center">
          <Button
            disabled={loadingData || !totalSelected || submitting}
            onClick={submit}
            className="w-1/3"
          >
            {submitting ? "Submitting..." : "Sponsor Selected"}
          </Button>
        </div>
      </div>

      {/* MODAL */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden rounded-xl">
          <DialogHeader className="px-5 pt-4 pb-4 space-y-1">
            <DialogTitle className="text-xl pb-2 font-semibold">Success</DialogTitle>
            <p className="text-sm pb-2 text-muted-foreground leading-relaxed">{modalMessage}</p>
          </DialogHeader>
          <DialogFooter className="px-3 pb-3 bg-muted/30">
            <Button onClick={() => setShowModal(false)} className="w-full sm:w-auto">
              Ok
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
