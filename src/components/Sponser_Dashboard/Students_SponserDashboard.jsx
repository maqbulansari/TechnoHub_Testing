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
import { GraduationCap, Search, Users, CheckCircle2 } from "lucide-react";
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

  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalMessage, setModalMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  const totalAmount = useMemo(() => {
    return filteredStudents
      .filter((s) => selectedStudents[s.student_id])
      .reduce((sum, s) => sum + (s.fee || 0), 0);
  }, [filteredStudents, selectedStudents]);

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

    const amount = filteredStudents
      .filter((s) => selectedStudents[s.student_id])
      .reduce((sum, s) => sum + (s.fee || 0), 0);

    try {
      setSubmitting(true);
      const res = await axios.post(
        `${API_BASE_URL}/sponsors/create-order/`,
        { student_ids: selectedIds, amount },
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
        amount: amount * 100,
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
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-muted/10 mt-16 sm:mt-20 pb-28 sm:pb-32">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 space-y-6 sm:space-y-8 md:space-y-10">

        {/* HERO SECTION */}
        <Card className="relative overflow-hidden shadow-none border border-border/40 bg-gradient-to-r from-[#2196f3] via-[#64b5f6] to-[#a2d6fc] rounded-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_60%)]" />

          <CardHeader className="relative z-10 p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
            <div className="space-y-3 sm:space-y-4 text-white max-w-lg">
              <Badge className="bg-white/20 text-white text-nowrap border-0 backdrop-blur px-2 py-1 text-xs sm:text-sm">
                <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Sponsor Dashboard
              </Badge>

              <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                Empower Students
              </CardTitle>

              <CardDescription className="text-white/80 leading-relaxed text-sm sm:text-base">
                View available students, manage sponsorships, and track progress. Your contribution shapes their future.
              </CardDescription>
            </div>

            <img
              src={bgSponser}
              alt="Sponsor Dashboard"
              className="hidden md:block rounded-xl w-32 h-32 lg:w-44 lg:h-44 object-contain"
            />
          </CardHeader>
        </Card>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Card className="border rounded-xl bg-gray-200 shadow-none">
            <CardContent className="p-3 sm:p-4 flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wide">Total Students</p>
              </div>
              <p className="text-xl sm:text-2xl font-bold">{students.length}</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Sponsor: <span className="font-medium capitalize">{sponsorDetails.first_name || "N/A"}</span>
              </p>
            </CardContent>
          </Card>
          <Card className="border rounded-xl bg-gray-200 shadow-none">
            <CardContent className="p-3 sm:p-4 flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wide">Selected Students</p>
              </div>
              <p className="text-xl sm:text-2xl font-bold">{totalSelected}</p>
              <div className="w-full h-2 sm:h-3 bg-gray-300 rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-[#2196f3] rounded-full transition-all duration-300"
                  style={{ width: students.length ? `${(totalSelected / students.length) * 100}%` : "0%" }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1 text-right">
                {students.length ? Math.round((totalSelected / students.length) * 100) : 0}% complete
              </p>
            </CardContent>
          </Card>
        </div>

        {/* FILTERS */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-stretch sm:items-center justify-start">
          <Button variant="outline" onClick={toggleSelectAll} className="whitespace-nowrap w-full sm:w-auto">
            {totalSelected === filteredStudents.length && filteredStudents.length > 0
              ? "Deselect All"
              : "Select All"}
          </Button>

          <div className="relative w-full sm:max-w-xs md:max-w-sm">
            <Input
              placeholder="Search Student"
              value={searchStudent}
              onChange={(e) => setSearchStudent(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={selectedBatch} onValueChange={setSelectedBatch}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter Batch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Filter Batch">All Batches</SelectItem>
              {batches.map((b) => (
                <SelectItem key={b.batch_id} value={`${b.batch_name} ${b.batch_id}`}>
                  {b.batch_name} {b.batch_id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* STUDENTS - TABLE for md+ / CARDS for mobile */}
        <Card className="shadow-none mt-2 sm:mt-4">
          <CardContent className="p-0">

            {/* Desktop Table - hidden on small screens */}
            <div className="hidden md:block overflow-x-auto">
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
                        <TableCell>₹{student.fee}</TableCell>
                        <TableCell className="text-center">
                          <input
                            type="checkbox"
                            checked={!!selectedStudents[student.student_id]}
                            onChange={() => toggleStudent(student.student_id)}
                            className="h-4 w-4 text-[#2196f3] border-gray-300 rounded-sm cursor-pointer accent-[#2196f3]"
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No students found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card Layout - shown only on small screens */}
            <div className="md:hidden divide-y">
              {filteredStudents.length ? (
                filteredStudents.map((student) => (
                  <div
                    key={student.student_id}
                    className={`flex items-center gap-3 p-3 sm:p-4 transition cursor-pointer ${
                      selectedStudents[student.student_id] ? "bg-blue-50" : "hover:bg-muted/50"
                    }`}
                    onClick={() => toggleStudent(student.student_id)}
                  >
                    <input
                      type="checkbox"
                      checked={!!selectedStudents[student.student_id]}
                      onChange={() => toggleStudent(student.student_id)}
                      onClick={(e) => e.stopPropagation()}
                      className="h-5 w-5 text-[#2196f3] border-gray-300 rounded-sm cursor-pointer accent-[#2196f3] flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium capitalize text-sm truncate">{student.student_name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {student.batch_name} {student.batch_id}
                      </p>
                    </div>
                    <div className="text-sm font-semibold text-right flex-shrink-0">
                      ₹{student.fee}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No students found
                </div>
              )}
            </div>

          </CardContent>
        </Card>
      </div>

      {/* STICKY ACTION BAR */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-sm border-t shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
          {totalSelected > 0 && (
            <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
              <span className="font-semibold text-foreground">{totalSelected}</span> student{totalSelected > 1 ? "s" : ""} selected
              {totalAmount > 0 && (
                <span className="ml-2">
                  · Total: <span className="font-semibold text-foreground">₹{totalAmount.toLocaleString()}</span>
                </span>
              )}
            </div>
          )}
          <Button
            disabled={loadingData || !totalSelected || submitting}
            onClick={submit}
            className="w-full sm:w-auto sm:min-w-[200px] md:min-w-[250px]"
          >
            {submitting ? "Processing..." : `Sponsor Selected (${totalSelected})`}
          </Button>
        </div>
      </div>

      {/* MODAL */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md max-w-[calc(100vw-2rem)] p-0 gap-0 overflow-hidden rounded-xl">
          <DialogHeader className="px-4 sm:px-5 pt-4 pb-4 space-y-1">
            <DialogTitle className="text-lg sm:text-xl pb-2 font-semibold">Notification</DialogTitle>
            <p className="text-sm text-muted-foreground leading-relaxed">{modalMessage}</p>
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