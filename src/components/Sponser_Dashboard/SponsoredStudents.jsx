import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/authContext";
import Loading from "@/Loading";

export const SponsoredStudents = () => {
    const { API_BASE_URL, accessToken, role, responseSubrole } =
        useContext(AuthContext);

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchName, setSearchName] = useState("");
    const [batchFilter, setBatchFilter] = useState("");

    const fetchSponsoredStudents = async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/sponsors/sponsored_students/`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            setStudents(response.data.students || []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching sponsored students:", err);
            setError("Unable to fetch sponsored students.");
            setLoading(false);
        }
    };

    useEffect(() => {
        if (role === "ADMIN" || responseSubrole === "SPONSOR") {
            fetchSponsoredStudents();
        }
    }, [role, responseSubrole]);

    // Unique Batch List
    const batchList = [...new Set(students.map((s) => s.batch_name))];

    // SEARCH + FILTER + SORT
    const filteredStudents = students
        .filter((s) =>
            s.student_name.toLowerCase().includes(searchName.toLowerCase())
        )
        .filter((s) =>
            batchFilter === "" ? true : s.batch_name === batchFilter
        )
        .sort((a, b) =>
            (a.student_name || "").toLowerCase().localeCompare(
                (b.student_name || "").toLowerCase()
            )
        );

    if (loading) {
        return (
           <Loading />
        );
    }

    if (error) {
        return <div className="text-center text-danger mt-4">{error}</div>;
    }

    return (
        <div className="px-3 mt-20">
            <h1 className="sponsornowHeading">Sponsored Students</h1>
                             <div className="flex gap-3 mt-3 flex-wrap pl-8">
                <div>
                <input
                    type="text"
                    placeholder="Search by Name..."
                    className="form-control w-64"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                />
                </div>
                <div>

                <select
                    className="form-control w-52"
                    value={batchFilter}
                    onChange={(e) => setBatchFilter(e.target.value)}
                >
                    <option value="">Filter by batch</option>
                    {batchList.map((batch, idx) => (
                        <option key={idx} value={batch}>
                            {batch}
                        </option>
                    ))}
                </select>
                </div>
            </div>

            <div className="table-wrapperS mt-3 overflow-auto">
                <table className="student-tableS">
                    <thead className="thead sticky top-0">
                        <tr>
                            <th className="text-nowrap">Student Name</th>
                            <th className="text-nowrap">Batch Name</th>
                            <th className="text-nowrap">Fee</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map((item, index) => (
                                <tr key={index} className="tr">
                                    <td className="text-nowrap capitalize">
                                        {item.student_name || "N/A"}
                                    </td>
                                    <td className="text-nowrap capitalize">
                                        {`${item.batch_name || "N/A"} (${item.batch_id || "N/A"})`}
                                    </td>
                                    <td className="text-nowrap">₹ {item.fee || "0"}</td>
                                </tr>
                            ))
                        ) : (
                            <tr className="text-center">
                                <td colSpan={4}>No Students Found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
