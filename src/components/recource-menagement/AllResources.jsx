// AllResources.jsx
import React, { useContext, useEffect, useState, useMemo } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/authContext";
import { TECHNO_BASE_URL, AUTH_BASE_URL } from "@/environment";
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

// ── Constants (matching Django model choices exactly) ─────────
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

const EMPTY_ASSET = {
  name: "",
  asset_type: "LAPTOP",
  serial_number: "",
  brand: "",
  status: "AVAILABLE",
  current_condition: "GOOD",
};

// ── Badge variant helpers ────────────────────────────────────
const statusVariant = (status) => {
  switch (status) {
    case "AVAILABLE":
      return "default";
    case "ALLOCATED":
      return "secondary";
    case "MAINTENANCE":
      return "destructive";
    default:
      return "outline";
  }
};

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

export const AllResources = () => {
  // ── State ──────────────────────────────────────────────────
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Admin dialogs
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ ...EMPTY_ASSET });
  const [editFormData, setEditFormData] = useState({ ...EMPTY_ASSET });
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  // User request dialog
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [requestType, setRequestType] = useState("NEW");
  const [requestAssetId, setRequestAssetId] = useState(null);
  const [requestAssetName, setRequestAssetName] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [submittingRequest, setSubmittingRequest] = useState(false);

  // Result modal
  const [resultOpen, setResultOpen] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [resultIsSuccess, setResultIsSuccess] = useState(true);

  const { API_BASE_URL, user } = useContext(AuthContext);

  // ── Determine role ─────────────────────────────────────────
  const isAdmin = localStorage.getItem("role") === "ADMIN";

  // ── Fetch assets ───────────────────────────────────────────
  const fetchAssets = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${AUTH_BASE_URL}/assets/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const re = await axios.get(`${AUTH_BASE_URL}/asset-requests/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setAssets(response.data);
    } catch (err) {
      console.error("Error fetching assets", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  // ── Filtered data ──────────────────────────────────────────
  const filteredAssets = useMemo(() => {
    return assets.filter((item) =>
      `${item.name} ${item.brand} ${item.serial_number} ${item.asset_type}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [assets, search]);

  // ── Show result modal helper ───────────────────────────────
  const showResult = (message, success = true) => {
    setResultMessage(message);
    setResultIsSuccess(success);
    setResultOpen(true);
  };

  // ══════════════════════════════════════════════════════════════
  // ADMIN: Create Asset
  // ══════════════════════════════════════════════════════════════
  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateAsset = async () => {
    if (!formData.name.trim() || !formData.serial_number.trim()) return;
    setSaving(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${AUTH_BASE_URL}/assets/`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAssets((prev) => [...prev, response.data]);
      setAddDialogOpen(false);
      setFormData({ ...EMPTY_ASSET });
      showResult("Asset created successfully!");
    } catch (error) {
      console.error("Failed to create asset", error);
      const errMsg =
        error?.response?.data?.serial_number?.[0] ||
        error?.response?.data?.detail ||
        "Failed to create asset. Please try again.";
      showResult(errMsg, false);
    } finally {
      setSaving(false);
    }
  };

  // ══════════════════════════════════════════════════════════════
  // ADMIN: Edit / Patch Asset
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

  const handleEditFormChange = (field, value) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateAsset = async () => {
    if (!editFormData.name.trim() || !editFormData.serial_number.trim()) return;
    setSaving(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.patch(
        `${AUTH_BASE_URL}/assets/${editingId}/`,
        editFormData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAssets((prev) =>
        prev.map((a) => (a.id === editingId ? { ...a, ...response.data } : a))
      );
      setEditDialogOpen(false);
      showResult("Asset updated successfully!");
    } catch (error) {
      console.error("Failed to update asset", error);
      const errMsg =
        error?.response?.data?.serial_number?.[0] ||
        error?.response?.data?.detail ||
        "Failed to update asset. Please try again.";
      showResult(errMsg, false);
    } finally {
      setSaving(false);
    }
  };

  // ══════════════════════════════════════════════════════════════
  // USER: Request (NEW / RETURN / REPAIR)
  // ══════════════════════════════════════════════════════════════
  const openRequestDialog = (asset, type) => {
    setRequestAssetId(asset.id);
    setRequestAssetName(asset.name);
    setRequestType(type);
    setIssueDescription("");
    setRequestDialogOpen(true);
  };

  const handleSubmitRequest = async () => {
    setSubmittingRequest(true);
    try {
      const token = localStorage.getItem("accessToken");
      const payload = {
        request_type: requestType,
        asset: requestAssetId,
      };

      // Only include issue_description for REPAIR requests
      if (requestType === "REPAIR" && issueDescription.trim()) {
        payload.issue_description = issueDescription.trim();
      }

      await axios.post(`${AUTH_BASE_URL}/asset-requests/`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRequestDialogOpen(false);
      setIssueDescription("");

  

      const messages = {
        NEW: "Allocation request submitted successfully!",
        RETURN: "Return request submitted successfully!",
        REPAIR: "Repair request submitted successfully!",
      };
      showResult(messages[requestType] || "Request submitted successfully!");

      // Refresh list
      fetchAssets();
    } catch (error) {
      console.error("Failed to submit request", error);
      const errMsg =
        error?.response?.data?.detail ||
        error?.response?.data?.non_field_errors?.[0] ||
        "Failed to submit request. Please try again.";
      showResult(errMsg, false);
    } finally {
      setSubmittingRequest(false);
    }
  };

  // ── Helper: get request type label ─────────────────────────
  const getRequestTypeLabel = (type) => {
    const found = REQUEST_TYPES.find((r) => r.value === type);
    return found ? found.label : type;
  };

  // ── Helper: get request button config per asset ────────────
  const getRequestButtonConfig = (asset) => {
    switch (requestType) {
      case "REPAIR":
        return "bg-red-600 hover:bg-red-700 text-white";
      case "RETURN":
        return "bg-amber-600 hover:bg-amber-700 text-white";
      default:
        return "bg-blue-600 hover:bg-blue-700 text-white";
    }
  };

  // ── Loading ────────────────────────────────────────────────
  if (loading) return <Loading />;

  // ══════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════
  return (
    <div className="p-6 mt-16 space-y-6">
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-semibold">All Resources</h2>

        <div className="flex gap-2 flex-wrap">
          {/* Admin-only: Add Asset button */}
          {isAdmin && (
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
                    Fill in the details below to register a new asset.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="assetName">Name *</Label>
                    <Input
                      id="assetName"
                      placeholder="e.g. Dell Latitude 5420"
                      value={formData.name}
                      onChange={(e) => handleFormChange("name", e.target.value)}
                    />
                  </div>

                  {/* Brand */}
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand *</Label>
                    <Input
                      id="brand"
                      placeholder="e.g. Dell"
                      value={formData.brand}
                      onChange={(e) => handleFormChange("brand", e.target.value)}
                    />
                  </div>

                  {/* Serial Number */}
                  <div className="space-y-2">
                    <Label htmlFor="serial">Serial Number *</Label>
                    <Input
                      id="serial"
                      placeholder="e.g. DL5420-001"
                      value={formData.serial_number}
                      onChange={(e) =>
                        handleFormChange("serial_number", e.target.value)
                      }
                    />
                  </div>

                  {/* Asset Type */}
                  <div className="space-y-2">
                    <Label>Asset Type</Label>
                    <Select
                      value={formData.asset_type}
                      onValueChange={(val) =>
                        handleFormChange("asset_type", val)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
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

                  {/* Status */}
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(val) => handleFormChange("status", val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
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

                  {/* Condition */}
                  <div className="space-y-2">
                    <Label>Current Condition</Label>
                    <Select
                      value={formData.current_condition}
                      onValueChange={(val) =>
                        handleFormChange("current_condition", val)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
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
          )}
        </div>
      </div>

      {/* ── Search ─────────────────────────────────────────── */}
      <Input
        placeholder="Search by name, brand, serial number or type..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      {/* ── Table ──────────────────────────────────────────── */}
      <div className="rounded-lg border max-h-[70vh] bg-white shadow-sm overflow-auto">
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
                  <TableCell className="font-medium">{asset.name}</TableCell>
                  <TableCell>
                    {ASSET_TYPES.find((t) => t.value === asset.asset_type)
                      ?.label || asset.asset_type}
                  </TableCell>
                  <TableCell>{asset.brand || "N/A"}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {asset.serial_number}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColor(asset.status)}>
                      {STATUS_OPTIONS.find((s) => s.value === asset.status)
                        ?.label || asset.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={conditionColor(asset.current_condition)}>
                      {CONDITION_OPTIONS.find(
                        (c) => c.value === asset.current_condition
                      )?.label || asset.current_condition}
                    </Badge>
                  </TableCell>

                  {/* ── Role-based actions ── */}
                  <TableCell className="text-right">
                    {isAdmin ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(asset)}
                      >
                        Edit
                      </Button>
                    ) : (
                      <div className="flex justify-end gap-2">
                        {/* Request NEW allocation — only if AVAILABLE */}
                        {asset.status === "AVAILABLE" && (
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => openRequestDialog(asset, "NEW")}
                          >
                            Request
                          </Button>
                        )}

                        {/* Return — only if ALLOCATED */}
                        {asset.status === "ALLOCATED" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-amber-500 text-amber-600 hover:bg-amber-50"
                            onClick={() => openRequestDialog(asset, "RETURN")}
                          >
                            Return
                          </Button>
                        )}

                        {/* Repair — if ALLOCATED or condition is DAMAGED / UNDER_REPAIR */}
                        {(asset.status === "ALLOCATED" ||
                          asset.current_condition === "DAMAGED" ||
                          asset.current_condition === "UNDER_REPAIR") && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => openRequestDialog(asset, "REPAIR")}
                          >
                            Repair
                          </Button>
                        )}
                      </div>
                    )}
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

      {/* ══════════════════════════════════════════════════════════
          ADMIN: Edit Asset Dialog
         ══════════════════════════════════════════════════════════ */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Asset</DialogTitle>
            <DialogDescription>
              Update the asset details below.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="editName">Name</Label>
              <Input
                id="editName"
                value={editFormData.name}
                onChange={(e) => handleEditFormChange("name", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editBrand">Brand</Label>
              <Input
                id="editBrand"
                value={editFormData.brand}
                onChange={(e) => handleEditFormChange("brand", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editSerial">Serial Number</Label>
              <Input
                id="editSerial"
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
                onValueChange={(val) =>
                  handleEditFormChange("asset_type", val)
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
                value={editFormData.status}
                onValueChange={(val) => handleEditFormChange("status", val)}
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
              <Label>Current Condition</Label>
              <Select
                value={editFormData.current_condition}
                onValueChange={(val) =>
                  handleEditFormChange("current_condition", val)
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

      {/* ══════════════════════════════════════════════════════════
          USER: Request / Return / Repair Dialog
         ══════════════════════════════════════════════════════════ */}
      <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{getRequestTypeLabel(requestType)}</DialogTitle>
            <DialogDescription>
              {requestType === "REPAIR" &&
                `Submit a repair request for "${requestAssetName}".`}
              {requestType === "NEW" &&
                `Request "${requestAssetName}" to be allocated to you.`}
              {requestType === "RETURN" &&
                `Submit a return request for "${requestAssetName}".`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Asset</Label>
              <Input value={requestAssetName} disabled />
            </div>

            <div className="space-y-2">
              <Label>Request Type</Label>
              <Input value={getRequestTypeLabel(requestType)} disabled />
            </div>

            {/* Issue description — shown for REPAIR, optional for others */}
            {requestType === "REPAIR" && (
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
                setRequestDialogOpen(false);
                setIssueDescription("");
              }}
              disabled={submittingRequest}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitRequest}
              disabled={submittingRequest}
              className={
                requestType === "REPAIR"
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : requestType === "RETURN"
                  ? "bg-amber-600 hover:bg-amber-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }
            >
              {submittingRequest ? "Submitting…" : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 
          Result Modal (shared)
       */}
      <Dialog open={resultOpen} onOpenChange={setResultOpen}>
        <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden [&>button]:hidden rounded-xl">
          <DialogHeader className="px-5 pt-4 pb-4 space-y-1">
            <DialogTitle className="text-xl pb-2 font-semibold">
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