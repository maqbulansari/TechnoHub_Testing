import React, { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/authContext";
import Loading from "@/Loading";

const SelectedTrainerForInterview = () => {
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const [hoveredRow, setHoveredRow] = useState(null);
    const [accessToken, setAccessToken] = useState("");
    const [loading, setLoading] = useState(true);
    const tableRef = useRef(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [rowToDelete, setRowToDelete] = useState(null);


    const { trainers, admin, API_BASE_URL, fetchTrainers, fetchAdmin, user } =
        useContext(AuthContext);

    const trainerName = `${user?.first_name} ${user?.last_name}` || "N/A";
    console.log(trainerName);

    useEffect(() => {
        if (fetchTrainers) fetchTrainers();
        if (fetchAdmin) fetchAdmin();
    }, [fetchTrainers, fetchAdmin]);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("accessToken");
            if (token) setAccessToken(token);

            try {
                const response = await axios.get(
                    `${API_BASE_URL}/interview-schedules/`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setData(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [API_BASE_URL]);

    /* ---------- Templates ---------- */

    const userNameTemplate = (rowData) => (
        <span className="capitalize text-black">
            {rowData.user_name || "N/A"}
        </span>
    );

    const batchesTemplate = (rowData) => (
        <div className="flex flex-wrap gap-1">
            {rowData.batches_names?.length ? (
                rowData.batches_names.map((batch) => (
                    <Tag
                        key={batch.id}
                        value={batch.name}
                        severity="info"
                        className="mr-1 mb-1"
                        tabIndex={-1}
                    />
                ))
            ) : (
                <span>N/A</span>
            )}
        </div>
    );

    const startDateTemplate = (rowData) => (
        <div>
            <span className="text-black">{rowData.start_date}</span>
            <br />
            <small className="text-muted">({rowData.start_day})</small>
        </div>
    );

    const endDateTemplate = (rowData) => (
        <div>
            <span className="text-black">{rowData.end_date}</span>
            <br />
            <small className="text-muted">({rowData.end_day})</small>
        </div>
    );

    const timeTemplate = (rowData) => {
        const formatTime = (time) => {
            if (!time) return "N/A";
            return new Date(time).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });
        };

        return (
            <div>
                <span>
                    {formatTime(rowData.start_time)}
                </span>
                {" - "}
                <span>
                    {formatTime(rowData.end_time)}
                </span>
            </div>
        );
    };

    const approvalTemplate = (rowData) => (
        <Tag
            value={rowData.is_approved ? "Approved" : "Pending"}
            severity={rowData.is_approved ? "success" : "warning"}
            tabIndex={-1}
        />
    );

    const activeStatusTemplate = (rowData) => (
        <Tag
            value={rowData.is_active ? "Active" : "Inactive"}
            severity={rowData.is_active ? "success" : "danger"}
            tabIndex={-1}
        />
    );


    const handleDelete = async (rowData) => {
        try {
            await axios.delete(
                `${API_BASE_URL}/interview-schedules/${rowData.id}/`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

        } catch (error) {
            console.error("Error deleting interview schedule:", error);
        }
    };

    const actionTemplate = (rowData) => (
        <div className="flex gap-2 justify-center">
            <Button
                label="Delete"
                className="btn text-white bg-red-600"
                onClick={() => {
                    setRowToDelete(rowData);
                    setShowDeleteModal(true);
                }}
                tabIndex={-1}
            />
        </div>
    );


    if (loading) {
        return (
            <Loading />
        );
    }

    return (
        <div className="container mt-16">
            <div className="header-containerH d-flex justify-center w-100 ">
                <h2 className="sponsornowHeading pt-4  max-w-[95vw] sm:max-w-[800px] mx-auto">
                    Selected Trainer For Interview
                </h2>
            </div>


            <div className="card" ref={tableRef}>
                <DataTable
                    value={data}
                    stripedRows
                    scrollable
                    scrollHeight="600px"
                    focusable={false}

                    emptyMessage={
                        <div className="flex justify-center items-center w-full py-4">
                            <span className="text-gray-500 text-lg">
                                No interview schedules available
                            </span>
                        </div>
                    }

                >
                    <Column
                        field="user_name"
                        header="Candidate Name"
                        body={userNameTemplate}
                        sortable
                    />
                    <Column
                        header="Batches"
                        body={batchesTemplate}
                        style={{ minWidth: "200px" }}
                    />
                    <Column
                        header="Start Date"
                        body={startDateTemplate}
                        sortable
                    />
                    <Column
                        header="End Date"
                        body={endDateTemplate}
                        sortable
                    />
                    {/* <Column
                        header="Interview Time"
                        body={timeTemplate}
                    /> */}
                    {/* <Column
                        header="Approval Status"
                        body={approvalTemplate}
                        sortable
                    />
                    <Column
                        header="Status"
                        body={activeStatusTemplate}
                        sortable
                    /> */}
                    <Column
                        header="Actions"
                        body={actionTemplate}
                    />
                </DataTable>
            </div>


            {showDeleteModal && (
                <div
                    className="modal fade show"
                    style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Delete</h5>
                            </div>

                            <div className="modal-body">
                                <p>
                                    Are you sure you want to delete the interview schedule for{" "}
                                    <strong>{rowToDelete?.user_name}</strong>?
                                </p>
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowDeleteModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={async () => {
                                        try {
                                            await axios.delete(
                                                `${API_BASE_URL}/interview-schedules/${rowToDelete.id}/`,
                                                {
                                                    headers: {
                                                        Authorization: `Bearer ${accessToken}`,
                                                    },
                                                }
                                            );

                                            setData((prev) =>
                                                prev.filter((item) => item.id !== rowToDelete.id)
                                            );
                                        } catch (error) {
                                            console.error(
                                                "Error deleting interview schedule:",
                                                error
                                            );
                                        } finally {
                                            setShowDeleteModal(false);
                                            setRowToDelete(null);
                                        }
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default SelectedTrainerForInterview;
