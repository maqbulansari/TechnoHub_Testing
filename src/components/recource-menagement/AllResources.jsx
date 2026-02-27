// AllResources.jsx
import React, { useContext, useEffect, useState, useMemo } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/authContext";
import { AUTH_BASE_URL } from "@/environment";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ── Constants ─────────────────────────────────────────────────
const ASSET_TYPES = [
  { value: "LAPTOP", label: "Laptop" },
  { value: "DESKTOP", label: "Desktop" },
  { value: "MONITOR", label: "Monitor" },
  { value: "OTHER", label: "Other" },
];

const STATUS_OPTIONS = [
  { value: "AVAILABLE", label: "Available" },
  { value: "ALLOCATED", label: "Allocated" },
  { value: "MAINTENANCE", label: "Maintenance" },
];

const CONDITION_OPTIONS = [
  { value: "GOOD", label: "Good" },
  { value: "DAMAGED", label: "Damaged" },
  { value: "UNDER_REPAIR", label: "Under Repair" },
];

const REQUEST_TYPES = [
  { value: "NEW", label: "New Allocation" },
  { value: "RETURN", label: "Return Request" },
  { value: "REPAIR", label: "Repair Request" },
];

const REQUEST_STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

const EMPTY_ASSET = {
  name: "",
  asset_type: "LAPTOP",
  serial_number: "",
  brand: "",
  status: "AVAILABLE",
  current_condition: "GOOD",
};

// ── Badge helpers ─────────────────────────────────────────────
const statusColor = (status) => {
  switch (status) {
    case "AVAILABLE":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "ALLOCATED":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "MAINTENANCE":
      return "bg-orange-100 text-orange-800 hover:bg-orange-100";
    default:
      return "";
  }
};

const conditionColor = (condition) => {
  switch (condition) {
    case "GOOD":
      return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100";
    case "DAMAGED":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    case "UNDER_REPAIR":
      return "bg-amber-100 text-amber-800 hover:bg-amber-100";
    default:
      return "";
  }
};

const requestStatusColor = (status) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "APPROVED":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "REJECTED":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    default:
      return "";
  }
};

const requestTypeColor = (type) => {
  switch (type) {
    case "NEW":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "RETURN":
      return "bg-amber-100 text-amber-800 hover:bg-amber-100";
    case "REPAIR":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    default:
      return "";
  }
};

export const AllResources = () => {
  // ── State ──────────────────────────────────────────────────
  const [assets, setAssets] = useState([]);
  const [myAllocations, setMyAllocations] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  // Admin: all requests from all users
  const [allRequests, setAllRequests] = useState([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [requestSearch, setRequestSearch] = useState("");

  // Admin dialogs
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ ...EMPTY_ASSET });
  const [editFormData, setEditFormData] = useState({ ...EMPTY_ASSET });
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  // Admin: approve dialog (for NEW — pick asset to assign)
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [approvingRequest, setApprovingRequest] = useState(null);
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [approving, setApproving] = useState(false);

  // Admin: reject dialog
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectingRequest, setRejectingRequest] = useState(null);
  const [rejecting, setRejecting] = useState(false);

  // User: NEW request dialog (category-based)
  const [newRequestDialogOpen, setNewRequestDialogOpen] = useState(false);
  const [newRequestAssetType, setNewRequestAssetType] = useState("LAPTOP");
  const [submittingNewRequest, setSubmittingNewRequest] = useState(false);

  // User: RETURN / REPAIR dialog
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState("RETURN"); // RETURN | REPAIR
  const [actionAssetId, setActionAssetId] = useState(null);
  const [actionAssetName, setActionAssetName] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [submittingAction, setSubmittingAction] = useState(false);

  // Result modal
  const [resultOpen, setResultOpen] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [resultIsSuccess, setResultIsSuccess] = useState(true);

  const { user, hasRole } = useContext(AuthContext);
  const isAdmin = hasRole("ADMIN");

  // ── Auth header ────────────────────────────────────────────
  const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  });

  // ── Extract API error ──────────────────────────────────────
  const extractError = (error, fallback = "Something went wrong.") => {
    const data = error?.response?.data;
    if (!data) return fallback;
    if (typeof data === "string") return data;
    if (data.detail) return data.detail;
    if (data.non_field_errors?.[0]) return data.non_field_errors[0];
    const firstKey = Object.keys(data)[0];
    if (firstKey) {
      const val = data[firstKey];
      return Array.isArray(val) ? val[0] : String(val);
    }
    return fallback;
  };

  // ── Show result modal ──────────────────────────────────────
  const showResult = (message, success = true) => {
    setResultMessage(message);
    setResultIsSuccess(success);
    setResultOpen(true);
  };

  // ══════════════════════════════════════════════════════════════
  // FETCH DATA
  // ══════════════════════════════════════════════════════════════
  const fetchData = async () => {
    setLoading(true);
    try {
      // Assets — both roles
      const assetsRes = await axios.get(`${AUTH_BASE_URL}/assets/`, {
        headers: authHeaders(),
      });
      setAssets(assetsRes.data);

      if (isAdmin) {
        // Admin: fetch ALL requests
        const reqRes = await axios.get(`${AUTH_BASE_URL}/asset-requests/`, {
          headers: authHeaders(),
        });
        setAllRequests(reqRes.data);
      } else {
        // Student: fetch own allocations + own requests
        const [allocRes, reqRes] = await Promise.all([
          axios.get(`${AUTH_BASE_URL}/asset-allocations/`, {
            headers: authHeaders(),
          }),
          axios.get(`${AUTH_BASE_URL}/asset-requests/`, {
            headers: authHeaders(),
          }),
        ]);

        setMyAllocations(allocRes.data.filter((a) => !a.is_returned));
        setPendingRequests(reqRes.data.filter((r) => r.status === "PENDING"));
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ── Filtered data ──────────────────────────────────────────
  const filteredAssets = useMemo(() => {
    const q = search.toLowerCase();
    return assets.filter((item) =>
      `${item.name} ${item.brand} ${item.serial_number} ${item.asset_type}`
        .toLowerCase()
        .includes(q)
    );
  }, [assets, search]);

  const filteredRequests = useMemo(() => {
    const q = requestSearch.toLowerCase();
    return allRequests.filter((r) =>
      `${r.user_name} ${r.user_email} ${r.request_type} ${r.status} ${
        r.requested_asset_type_display || ""
      } ${r.issue_description || ""}`
        .toLowerCase()
        .includes(q)
    );
  }, [allRequests, requestSearch]);

  // Pending requests filtered for admin badge count
  const pendingCount = allRequests.filter((r) => r.status === "PENDING").length;

  // ── Student helpers ────────────────────────────────────────
  const isMyAsset = (assetId) =>
    myAllocations.some((a) => a.asset === assetId);

  const hasPendingRequest = (assetId, type) =>
    pendingRequests.some(
      (r) => r.asset === assetId && r.request_type === type
    );

  const hasPendingNewRequest = () =>
    pendingRequests.some((r) => r.request_type === "NEW");

  // ── Available assets for admin to assign (NEW requests) ───
  const availableAssets = assets.filter((a) => a.status === "AVAILABLE");

  // ══════════════════════════════════════════════════════════════
  // ADMIN: Create Asset
  // ══════════════════════════════════════════════════════════════
  const handleFormChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleCreateAsset = async () => {
    if (!formData.name.trim() || !formData.serial_number.trim()) return;
    setSaving(true);
    try {
      const response = await axios.post(
        `${AUTH_BASE_URL}/assets/`,
        formData,
        { headers: authHeaders() }
      );
      setAssets((prev) => [...prev, response.data]);
      setAddDialogOpen(false);
      setFormData({ ...EMPTY_ASSET });
      showResult("Asset created successfully!");
    } catch (error) {
      showResult(extractError(error, "Failed to create asset."), false);
    } finally {
      setSaving(false);
    }
  };

  // ══════════════════════════════════════════════════════════════
  // ADMIN: Edit Asset
  // ══════════════════════════════════════════════════════════════
  const openEditDialog = (asset) => {
    setEditingId(asset.id);
    setEditFormData({
      name: asset.name,
      asset_type: asset.asset_type,
      serial_number: asset.serial_number,
      brand: asset.brand,
      status: asset.status,
      current_condition: asset.current_condition,
    });
    setEditDialogOpen(true);
  };

  const handleEditFormChange = (field, value) =>
    setEditFormData((prev) => ({ ...prev, [field]: value }));

  const handleUpdateAsset = async () => {
    if (!editFormData.name.trim() || !editFormData.serial_number.trim()) return;
    setSaving(true);
    try {
      const response = await axios.patch(
        `${AUTH_BASE_URL}/assets/${editingId}/`,
        editFormData,
        { headers: authHeaders() }
      );
      setAssets((prev) =>
        prev.map((a) => (a.id === editingId ? { ...a, ...response.data } : a))
      );
      setEditDialogOpen(false);
      showResult("Asset updated successfully!");
    } catch (error) {
      showResult(extractError(error, "Failed to update asset."), false);
    } finally {
      setSaving(false);
    }
  };

  // ══════════════════════════════════════════════════════════════
  // ADMIN: Approve Request
  //
  // NEW    → POST /asset-requests/{id}/approve/ { asset_id: <id> }
  // RETURN → POST /asset-requests/{id}/approve/ {}
  // REPAIR → POST /asset-requests/{id}/approve/ {}
  // ══════════════════════════════════════════════════════════════
  const openApproveDialog = (request) => {
    setApprovingRequest(request);
    setSelectedAssetId("");
    setApproveDialogOpen(true);
  };

  const handleApproveRequest = async () => {
    if (!approvingRequest) return;
    setApproving(true);
    try {
      // For NEW requests, admin must pick an asset to assign
      const body =
        approvingRequest.request_type === "NEW"
          ? { asset_id: Number(selectedAssetId) }
          : {};

      await axios.post(
        `${AUTH_BASE_URL}/asset-requests/${approvingRequest.id}/approve/`,
        body,
        { headers: authHeaders() }
      );

      setApproveDialogOpen(false);
      showResult("Request approved successfully!");
      fetchData(); // refresh everything
    } catch (error) {
      showResult(extractError(error, "Failed to approve request."), false);
    } finally {
      setApproving(false);
    }
  };

  // ══════════════════════════════════════════════════════════════
  // ADMIN: Reject Request
  // ══════════════════════════════════════════════════════════════
  const openRejectDialog = (request) => {
    setRejectingRequest(request);
    setRejectDialogOpen(true);
  };

  const handleRejectRequest = async () => {
    if (!rejectingRequest) return;
    setRejecting(true);
    try {
      await axios.post(
        `${AUTH_BASE_URL}/asset-requests/${rejectingRequest.id}/reject/`,
        {},
        { headers: authHeaders() }
      );
      setRejectDialogOpen(false);
      showResult("Request rejected.");
      fetchData();
    } catch (error) {
      showResult(extractError(error, "Failed to reject request."), false);
    } finally {
      setRejecting(false);
    }
  };

  // ══════════════════════════════════════════════════════════════
  // USER: Submit NEW request (category-based)
  // POST /asset-requests/ { request_type: "NEW", requested_asset_type }
  // ══════════════════════════════════════════════════════════════
  const handleSubmitNewRequest = async () => {
    setSubmittingNewRequest(true);
    try {
      await axios.post(
        `${AUTH_BASE_URL}/asset-requests/`,
        {
          request_type: "NEW",
          requested_asset_type: newRequestAssetType,
        },
        { headers: authHeaders() }
      );
      setNewRequestDialogOpen(false);
      showResult("Allocation request submitted! Admin will assign an asset.");
      fetchData();
    } catch (error) {
      showResult(extractError(error, "Failed to submit request."), false);
    } finally {
      setSubmittingNewRequest(false);
    }
  };

  // ══════════════════════════════════════════════════════════════
  // USER: Submit RETURN / REPAIR request
  // POST /asset-requests/ { request_type, asset, issue_description? }
  // ══════════════════════════════════════════════════════════════
  const openActionDialog = (asset, type) => {
    setActionAssetId(asset.id);
    setActionAssetName(asset.name);
    setActionType(type);
    setIssueDescription("");
    setActionDialogOpen(true);
  };

  const handleSubmitAction = async () => {
    setSubmittingAction(true);
    try {
      const payload = {
        request_type: actionType,
        asset: actionAssetId,
        ...(actionType === "REPAIR" &&
          issueDescription.trim() && {
            issue_description: issueDescription.trim(),
          }),
      };

      await axios.post(`${AUTH_BASE_URL}/asset-requests/`, payload, {
        headers: authHeaders(),
      });

      setActionDialogOpen(false);
      setIssueDescription("");
      showResult(
        actionType === "RETURN"
          ? "Return request submitted successfully!"
          : "Repair request submitted successfully!"
      );
      fetchData();
    } catch (error) {
      showResult(extractError(error, "Failed to submit request."), false);
    } finally {
      setSubmittingAction(false);
    }
  };

  // ── Label helpers ──────────────────────────────────────────
  const getRequestTypeLabel = (type) =>
    REQUEST_TYPES.find((r) => r.value === type)?.label || type;

  // ── Loading ────────────────────────────────────────────────
  if (loading) return <Loading />;

  // ══════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════
  return (
    <div className="p-6 mt-16 space-y-6">
      <h2 className="text-2xl font-semibold">All Resources</h2>

      {/* ════════════════════════════════════════════════════════
          ADMIN VIEW — Tabs: Assets | Requests
         ════════════════════════════════════════════════════════ */}
      {isAdmin ? (
        <Tabs defaultValue="assets">
          <TabsList>
            <TabsTrigger value="assets">Assets</TabsTrigger>
            <TabsTrigger value="requests" className="relative">
              Asset Requests
              {pendingCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 leading-none">
                  {pendingCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* ── Tab 1: Assets ─────────────────────────────── */}
          <TabsContent value="assets" className="space-y-4 mt-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <Input
                placeholder="Search assets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm"
              />

              {/* Add Asset dialog */}
              <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    + Add Asset
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Asset</DialogTitle>
                    <DialogDescription>
                      Fill in the details to register a new asset.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-2">
                    <div className="space-y-2">
                      <Label>Name *</Label>
                      <Input
                        placeholder="e.g. Dell Latitude 5420"
                        value={formData.name}
                        onChange={(e) =>
                          handleFormChange("name", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Brand *</Label>
                      <Input
                        placeholder="e.g. Dell"
                        value={formData.brand}
                        onChange={(e) =>
                          handleFormChange("brand", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Serial Number *</Label>
                      <Input
                        placeholder="e.g. DL5420-001"
                        value={formData.serial_number}
                        onChange={(e) =>
                          handleFormChange("serial_number", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Asset Type</Label>
                      <Select
                        value={formData.asset_type}
                        onValueChange={(v) =>
                          handleFormChange("asset_type", v)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ASSET_TYPES.map((t) => (
                            <SelectItem key={t.value} value={t.value}>
                              {t.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(v) => handleFormChange("status", v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Condition</Label>
                      <Select
                        value={formData.current_condition}
                        onValueChange={(v) =>
                          handleFormChange("current_condition", v)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CONDITION_OPTIONS.map((c) => (
                            <SelectItem key={c.value} value={c.value}>
                              {c.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setAddDialogOpen(false)}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateAsset}
                      disabled={
                        saving ||
                        !formData.name.trim() ||
                        !formData.serial_number.trim() ||
                        !formData.brand.trim()
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {saving ? "Saving…" : "Create Asset"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Assets Table */}
            <div className="rounded-lg border bg-white shadow-sm overflow-auto max-h-[65vh]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Serial Number</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssets.length ? (
                    filteredAssets.map((asset) => (
                      <TableRow key={asset.id}>
                        <TableCell className="font-medium">
                          {asset.name}
                        </TableCell>
                        <TableCell>
                          {ASSET_TYPES.find(
                            (t) => t.value === asset.asset_type
                          )?.label || asset.asset_type}
                        </TableCell>
                        <TableCell>{asset.brand || "N/A"}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {asset.serial_number}
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColor(asset.status)}>
                            {STATUS_OPTIONS.find(
                              (s) => s.value === asset.status
                            )?.label || asset.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={conditionColor(
                              asset.current_condition
                            )}
                          >
                            {CONDITION_OPTIONS.find(
                              (c) => c.value === asset.current_condition
                            )?.label || asset.current_condition}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(asset)}
                          >
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6">
                        No assets found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* ── Tab 2: Asset Requests ──────────────────────── */}
          <TabsContent value="requests" className="space-y-4 mt-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <Input
                placeholder="Search requests by user, type, status..."
                value={requestSearch}
                onChange={(e) => setRequestSearch(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <div className="rounded-lg border bg-white shadow-sm overflow-auto max-h-[65vh]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Asset / Category</TableHead>
                    <TableHead>Issue</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.length ? (
                    filteredRequests.map((req) => (
                      <TableRow key={req.id}>
                        <TableCell>
                          <div className="font-medium">{req.user_name}</div>
                          <div className="text-xs text-muted-foreground">
                            {req.user_email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={requestTypeColor(req.request_type)}>
                            {getRequestTypeLabel(req.request_type)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {req.request_type === "NEW" ? (
                            <span className="text-sm">
                              {req.requested_asset_type_display ||
                                req.requested_asset_type ||
                                "N/A"}
                            </span>
                          ) : req.asset ? (
                            <span className="text-sm font-mono">
                              Asset #{req.asset}
                            </span>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                        <TableCell className="max-w-[160px]">
                          <span className="text-sm text-muted-foreground truncate block">
                            {req.issue_description || "N/A"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={requestStatusColor(req.status)}>
                            {REQUEST_STATUS_OPTIONS.find(
                              (s) => s.value === req.status
                            )?.label || req.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                          {new Date(req.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {req.status === "PENDING" && (
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                // className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => openApproveDialog(req)}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openRejectDialog(req)}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                          {req.status !== "PENDING" && (
                            <span className="text-xs text-muted-foreground italic">
                              {req.approved_by_name
                                ? `by ${req.approved_by_name}`
                                : "Processed"}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6">
                        No requests found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        /* ════════════════════════════════════════════════════════
            STUDENT VIEW
           ════════════════════════════════════════════════════════ */
        <div className="space-y-4">
          {/* Toolbar: search + Request New Asset button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <Input
              placeholder="Search assets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />

            {/* NEW REQUEST — category-based, not tied to a specific asset */}
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                setNewRequestAssetType("LAPTOP");
                setNewRequestDialogOpen(true);
              }}
              disabled={hasPendingNewRequest()}
            >
              {hasPendingNewRequest()
                ? "Your Request Pending"
                : "+ Request New Asset"}
            </Button>
          </div>

          {/* Assets Table */}
          <div className="rounded-lg border bg-white shadow-sm overflow-auto max-h-[65vh]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Serial Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.length ? (
                  filteredAssets.map((asset) => {
                    const assetIsMine = isMyAsset(asset.id);
                    const pendingReturn = hasPendingRequest(
                      asset.id,
                      "RETURN"
                    );
                    const pendingRepair = hasPendingRequest(
                      asset.id,
                      "REPAIR"
                    );

                    return (
                      <TableRow key={asset.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {asset.name}
                            {assetIsMine && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                                Mine
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {ASSET_TYPES.find(
                            (t) => t.value === asset.asset_type
                          )?.label || asset.asset_type}
                        </TableCell>
                        <TableCell>{asset.brand || "N/A"}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {asset.serial_number}
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColor(asset.status)}>
                            {STATUS_OPTIONS.find(
                              (s) => s.value === asset.status
                            )?.label || asset.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={conditionColor(
                              asset.current_condition
                            )}
                          >
                            {CONDITION_OPTIONS.find(
                              (c) => c.value === asset.current_condition
                            )?.label || asset.current_condition}
                          </Badge>
                        </TableCell>

                        {/* Student actions: only Return / Repair on OWN assets */}
                        <TableCell className="text-right">
                          {assetIsMine ? (
                            <div className="flex justify-end gap-2">
                              {!pendingReturn && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-amber-500 text-amber-600 hover:bg-amber-50"
                                  onClick={() =>
                                    openActionDialog(asset, "RETURN")
                                  }
                                >
                                  Return
                                </Button>
                              )}
                              {!pendingRepair && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() =>
                                    openActionDialog(asset, "REPAIR")
                                  }
                                >
                                  Repair
                                </Button>
                              )}
                              {/* {(pendingReturn || pendingRepair) && (
                                <span className="text-xs text-muted-foreground italic self-center">
                                  Request pending…
                                </span>
                              )} */}
                            </div>
                          ) : (
                            // Not my asset — no actions
                            <span className="text-xs text-muted-foreground">
                              No Actions
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      No assets found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          ADMIN: Edit Asset Dialog
         ══════════════════════════════════════════════════════ */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Asset</DialogTitle>
            <DialogDescription>Update the asset details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={editFormData.name}
                onChange={(e) =>
                  handleEditFormChange("name", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Brand</Label>
              <Input
                value={editFormData.brand}
                onChange={(e) =>
                  handleEditFormChange("brand", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Serial Number</Label>
              <Input
                value={editFormData.serial_number}
                onChange={(e) =>
                  handleEditFormChange("serial_number", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Asset Type</Label>
              <Select
                value={editFormData.asset_type}
                onValueChange={(v) => handleEditFormChange("asset_type", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ASSET_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={editFormData.status}
                onValueChange={(v) => handleEditFormChange("status", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Condition</Label>
              <Select
                value={editFormData.current_condition}
                onValueChange={(v) =>
                  handleEditFormChange("current_condition", v)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONDITION_OPTIONS.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateAsset}
              disabled={
                saving ||
                !editFormData.name.trim() ||
                !editFormData.serial_number.trim()
              }
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {saving ? "Updating…" : "Update Asset"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════════
          ADMIN: Approve Request Dialog
         ══════════════════════════════════════════════════════ */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent className="sm:max-w-md p-5 [&>button]:hidden">
          <DialogHeader>
            <DialogTitle>Approve Request</DialogTitle>
            <DialogDescription>
              {approvingRequest?.request_type === "NEW"
                ? `Assign an available asset to ${approvingRequest?.user_name} for their ${approvingRequest?.requested_asset_type_display || approvingRequest?.requested_asset_type} request.`
                : `Approve the ${getRequestTypeLabel(
                    approvingRequest?.request_type
                  )} request from ${approvingRequest?.user_name}.`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 p">
            {/* Request summary */}
            <div className="rounded-lg bg-muted/40 p-1 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">User</span>
                <span className="font-medium">
                  {approvingRequest?.user_name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Request Type</span>
                <Badge
                  className={requestTypeColor(
                    approvingRequest?.request_type
                  )}
                >
                  {getRequestTypeLabel(approvingRequest?.request_type)}
                </Badge>
              </div>
              {approvingRequest?.request_type === "NEW" && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Requested Type</span>
                  <span>
                    {approvingRequest?.requested_asset_type_display ||
                      approvingRequest?.requested_asset_type}
                  </span>
                </div>
              )}
              {approvingRequest?.issue_description && (
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">Issue</span>
                  <span className="text-xs">
                    {approvingRequest.issue_description}
                  </span>
                </div>
              )}
            </div>

            {/* Asset picker — only for NEW requests */}
            {approvingRequest?.request_type === "NEW" && (
              <div className="space-y-2">
                <Label>
                  Assign Asset{" "}
                  <span className="text-red-500">*</span>
                </Label>
                {availableAssets.length === 0 ? (
                  <p className="text-sm text-red-500">
                    No available assets to assign.
                  </p>
                ) : (
                  <Select
                    value={selectedAssetId}
                    onValueChange={setSelectedAssetId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an available asset" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableAssets.map((a) => (
                        <SelectItem key={a.id} value={String(a.id)}>
                          {a.name} — {a.serial_number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setApproveDialogOpen(false)}
              disabled={approving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApproveRequest}
              disabled={
                approving ||
                (approvingRequest?.request_type === "NEW" &&
                  (!selectedAssetId || availableAssets.length === 0))
              }
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {approving ? "Approving…" : "Approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════════
          ADMIN: Reject Request Dialog
         ══════════════════════════════════════════════════════ */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-sm p-5 [&>button]:hidden">
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject the{" "}
              <strong>
                {getRequestTypeLabel(rejectingRequest?.request_type)}
              </strong>{" "}
              request from <strong>{rejectingRequest?.user_name}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
              disabled={rejecting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectRequest}
              disabled={rejecting}
            >
              {rejecting ? "Rejecting…" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════════
          USER: New Request Dialog (category-based)
         ══════════════════════════════════════════════════════ */}
      <Dialog
        open={newRequestDialogOpen}
        onOpenChange={setNewRequestDialogOpen}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Request New Asset</DialogTitle>
            <DialogDescription>
              Select the type of asset you need. Admin will assign one to
              you.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Asset Type *</Label>
              <Select
                value={newRequestAssetType}
                onValueChange={setNewRequestAssetType}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ASSET_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNewRequestDialogOpen(false)}
              disabled={submittingNewRequest}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitNewRequest}
              disabled={submittingNewRequest}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {submittingNewRequest ? "Submitting…" : "Submit Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════════
          USER: Return / Repair Dialog
         ══════════════════════════════════════════════════════ */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{getRequestTypeLabel(actionType)}</DialogTitle>
            <DialogDescription>
              {actionType === "RETURN"
                ? `Submit a return request for "${actionAssetName}".`
                : `Submit a repair request for "${actionAssetName}".`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Asset</Label>
              <Input value={actionAssetName} disabled />
            </div>
            {actionType === "REPAIR" && (
              <div className="space-y-2">
                <Label htmlFor="issueDesc">
                  Issue Description{" "}
                  <span className="text-muted-foreground text-xs">
                    (optional)
                  </span>
                </Label>
                <Textarea
                  id="issueDesc"
                  placeholder="Describe the issue…"
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  rows={3}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setActionDialogOpen(false);
                setIssueDescription("");
              }}
              disabled={submittingAction}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitAction}
              disabled={submittingAction}
              className={
                actionType === "REPAIR"
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-amber-600 hover:bg-amber-700 text-white"
              }
            >
              {submittingAction ? "Submitting…" : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Result Modal ─────────────────────────────────────── */}
      <Dialog open={resultOpen} onOpenChange={setResultOpen}>
        <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden [&>button]:hidden rounded-xl">
          <DialogHeader className="px-5 pt-4 pb-4 space-y-1">
            <DialogTitle
              className={`text-xl pb-2 font-semibold `}
            >
              {resultIsSuccess ? "Success" : " Error"}
            </DialogTitle>
            <DialogDescription className="text-sm pb-2 text-muted-foreground leading-relaxed">
              {resultMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="px-3 pb-3 bg-muted/30">
            <Button
              onClick={() => setResultOpen(false)}
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

export default AllResources;