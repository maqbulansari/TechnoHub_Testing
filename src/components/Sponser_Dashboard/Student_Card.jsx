import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/authContext";

export const Student_Card = ({ filterStudent, selectAll, setSelectAll }) => {
  const [sponsorStudentId, setSponsorStudentId] = useState([]);
  const [sponsorStudentBatchId, setSponsorStudentBatchId] = useState([]);
  const [countStudent, setCountStudent] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const { API_BASE_URL } = useContext(AuthContext);
  const accessToken = localStorage.getItem("accessToken");

  const handleCheckboxClick = (e, studentId, batchId) => {
    const isChecked = e.target.checked;
    const student = filterStudent.find((s) => s.student_id === studentId);
    const studentFee = student ? student.fee : 0;

    if (isChecked) {
      setSponsorStudentId((prev) => [...prev, studentId]);
      setSponsorStudentBatchId((prev) => [...prev, batchId]);
      setCountStudent((prev) => prev + 1);
      setTotalAmount((prev) => prev + studentFee);
    } else {
      setSponsorStudentId((prev) => prev.filter((id) => id !== studentId));
      setSponsorStudentBatchId((prev) => prev.filter((id) => id !== batchId));
      setCountStudent((prev) => prev - 1);
      setTotalAmount((prev) => prev - studentFee);
    }

    if (selectAll && !isChecked) setSelectAll(false);
  };

  const loadScript = (src) =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleSponsorship = async (e) => {
    e.preventDefault();
    if (!sponsorStudentId.length) {
      setSubmitError("Please select at least one student before sponsoring.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_BASE_URL}/sponsors/create-order/`,
        {
          student_id: sponsorStudentId[0],
          amount: totalAmount,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const { order_id, key_id, sponsorship_id, student_id, student_name } = response.data;

      localStorage.setItem('currentStudentInfo', JSON.stringify({
        studentId: student_id,
        studentName: student_name,
        sponsorshipId: sponsorship_id
      }));

      const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!res) {
        setSubmitError("Razorpay SDK failed to load.");
        return;
      }

      const options = {
        key: key_id,
        amount: totalAmount * 100,
        currency: "INR",
        name: "Techno Hub",
        description: "Sponsor Students",
        order_id: order_id,
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
              {
                headers: { Authorization: `Bearer ${accessToken}` },
              }
            );
            localStorage.removeItem('currentStudentInfo');
            setSubmitSuccess(true);
            setTimeout(() => window.location.reload(), 2000);
          } catch (err) {
            const savedInfo = localStorage.getItem('currentStudentInfo');
            if (savedInfo) {
              const studentInfo = JSON.parse(savedInfo);
              setSubmitError(
                `Payment verification failed for ${studentInfo.studentName}. You can try again.`
              );
            } else {
              setSubmitError("Payment verification failed.");
            }
          }
        },
        modal: {
          ondismiss: function () {
            const savedInfo = localStorage.getItem('currentStudentInfo');
            if (savedInfo) {
              const studentInfo = JSON.parse(savedInfo);
              console.log('Payment cancelled for:', studentInfo.studentName);
            }
          },
        },
        prefill: {
          name: "Techno Hub",
          email: "technohub@example.com",
          contact: "9999999999",
        },
        theme: { color: "#2563eb" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.log(err);
      setSubmitError("Error creating payment. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectAll) {
      const allStudentIds = filterStudent.map((s) => s.student_id);
      const allBatchIds = filterStudent.map((s) => s.batch_id || "");
      const totalFee = filterStudent.reduce((sum, s) => sum + (s.fee || 0), 0);
      setSponsorStudentId(allStudentIds);
      setSponsorStudentBatchId(allBatchIds);
      setCountStudent(filterStudent.length);
      setTotalAmount(totalFee);
    } else {
      setSponsorStudentId([]);
      setSponsorStudentBatchId([]);
      setCountStudent(0);
      setTotalAmount(0);
    }
  }, [selectAll, filterStudent]);

  return (
    <div className="table-wrapperS maxhTable">
      <table className="student-tableS">
        <thead className="thead">
          <tr>
            <th width="25%" className="text-white">Name</th>
            <th width="35%" className="text-white">Batch</th>
            <th className="text-end text-white" width="15%">Fee</th>
          </tr>
        </thead>
        <tbody className="overflow-y-auto">
          {filterStudent && filterStudent.length > 0 ? (
            filterStudent.map((student, index) => (
              <tr key={index} className="tr">
                <td>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={student.student_id}
                      checked={sponsorStudentId.includes(student.student_id)}
                      onChange={(e) => handleCheckboxClick(e, student.student_id, student.batch_id)}
                    />
                    <label className="form-check-label text-nowrap capitalize" htmlFor={student.student_id}>
                      {student.student_name}
                    </label>
                  </div>
                </td>
                <td className="text-nowrap capitalize">
                  {`${student.batch_name || ""} (${student.batch_id || ""})`}
                </td>
                <td className="text-end">₹{student.fee || 0}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">No students found.</td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr className="fixedTableBottom">
            <th>Total: {countStudent}</th>
            <th>
              <button className="btn btn-primary w-full" onClick={handleSponsorship}>
                {loading ? <span className="fas fa-spinner fa-spin me-2"></span> : "Sponsor Selected"}
              </button>
            </th>
            <th className="text-end">₹{totalAmount}</th>
          </tr>
        </tfoot>
      </table>


      {submitSuccess && (
        <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Payment Successful</h5>
                <button type="button" className="btn-close" onClick={() => setSubmitSuccess(false)}></button>
              </div>
              <div className="modal-body">
                <p>Your sponsorship payment was successful!</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setSubmitSuccess(false)}
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {submitError
      && (
          <div
            className="modal fade show"
            style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Sponsor</h5>
                  <button
                    type="button"
                    className="btn-close"
                     onClick={() => setSubmitError(null)}
                  ></button>
                </div>

                <div className="modal-body">
                   <p>{submitError}</p>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setSubmitError(null)}
                    data-bs-dismiss="modal"
                  >
                    Ok
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      
      
    }
    </div>
  );
};
