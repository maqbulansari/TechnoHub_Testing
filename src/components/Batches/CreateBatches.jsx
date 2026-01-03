import React, { useContext, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { AuthContext } from "../../contexts/authContext";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Toast } from "@/components/ui/toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
export const CreateBatches = () => {
    const { API_BASE_URL } = useContext(AuthContext);
    const token = localStorage.getItem("accessToken");

    const [technologies, setTechnologies] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Multi-select states
    const [selectedTechs, setSelectedTechs] = useState([]);
    const [selectedTrainers, setSelectedTrainers] = useState([]);
    const [techSearchTerm, setTechSearchTerm] = useState("");
    const [trainerSearchTerm, setTrainerSearchTerm] = useState("");

    const [submitSuccess, setSubmitSuccess] = useState(false);
    const today = new Date().toISOString().split("T")[0];



    const {
        register,
        handleSubmit,
        control,
        setValue,
        reset,
        formState: { errors },
        clearErrors,
    } = useForm();

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [techRes, trainerRes, statusRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/technology/`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get(`${API_BASE_URL}/trainers/`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get(`${API_BASE_URL}/batchstatuses/`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);
                setTechnologies(techRes.data);
                setTrainers(trainerRes.data);
                setStatuses(statusRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [API_BASE_URL, token]);

    // Update RHF values when multi-select changes
    useEffect(() => {
        setValue("technoLogies", selectedTechs);
        if (selectedTechs.length > 0) clearErrors("technoLogies");
    }, [selectedTechs, setValue, clearErrors]);

    useEffect(() => {
        setValue("trainer", selectedTrainers);
        if (selectedTrainers.length > 0) clearErrors("trainer");
    }, [selectedTrainers, setValue, clearErrors]);

    // Filtering
    const filteredTechnologies = technologies.filter((t) =>
        t.name.toLowerCase().includes(techSearchTerm.toLowerCase())
    );
    const filteredTrainers = trainers.filter(
        (t) =>
            `${t.first_name} ${t.last_name}`
                .toLowerCase()
                .includes(trainerSearchTerm.toLowerCase()) ||
            t.email.toLowerCase().includes(trainerSearchTerm.toLowerCase())
    );

    // Handlers
    const handleTechChange = (id) => {
        if (selectedTechs.includes(id)) {
            setSelectedTechs(selectedTechs.filter((x) => x !== id));
        } else {
            setSelectedTechs([...selectedTechs, id]);
        }
    };
    const handleTrainerChange = (id) => {
        if (selectedTrainers.includes(id)) {
            setSelectedTrainers(selectedTrainers.filter((x) => x !== id));
        } else {
            setSelectedTrainers([...selectedTrainers, id]);
        }
    };

    // Validation
    const validateTechnologies = () =>
        selectedTechs.length > 0 || "Select at least one technology";
    const validateTrainers = () =>
        selectedTrainers.length > 0 || "Select at least one trainer";

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        console.log(data);

        try {
            const payload = {
                batch_name: data.batch_name,
                start_date: data.start_date,
                end_date: data.end_date,
                capacity: parseInt(data.capacity),
                time_slot: data.time_slot,
                fee: parseFloat(data.fee),
                status_id: parseInt(data.status_id),
                technoLogies: selectedTechs,
                trainer: selectedTrainers,
                center: data.center,
            };


            await axios.post(`${API_BASE_URL}/batches/`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setSubmitSuccess(true);
            reset();
            setSelectedTechs([]);
            setSelectedTrainers([]);
            setTechSearchTerm("");
            setTrainerSearchTerm("");
        } catch (err) {
            console.error(err);
            Toast({
                title: "Error",
                description: err.response?.data?.message || "Failed to create batch",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 mt-12 border border-gray-200 rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-left">Create Batch</h2>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
                {/* Batch Name */}
                <div className="flex flex-col gap-1">
                    <Label htmlFor="batch_name">Batch Name <span className="text-red-500">*</span></Label>
                    <Input
                        id="batch_name"
                        {...register("batch_name", { required: "Batch Name is required" })}
                        disabled={isSubmitting}
                    />
                    {errors.batch_name && (
                        <p className="text-red-500 text-sm mt-1">{errors.batch_name.message}</p>
                    )}
                </div>

                {/* Start Date */}
                <div className="flex flex-col gap-1">
                    <Label htmlFor="start_date">Start Date <span className="text-red-500">*</span></Label>
                    <Input
                        min={today}
                        type="date"
                        id="start_date"
                        {...register("start_date", { required: "Start Date is required" })}
                        disabled={isSubmitting}
                    />
                    {errors.start_date && (
                        <p className="text-red-500 text-sm mt-1">{errors.start_date.message}</p>
                    )}
                </div>

                {/* End Date */}
                <div className="flex flex-col gap-1">
                    <Label htmlFor="end_date">End Date <span className="text-red-500">*</span></Label>
                    <Input
                        min={today}
                        type="date"
                        id="end_date"
                        {...register("end_date", { required: "End Date is required" })}
                        disabled={isSubmitting}
                    />
                    {errors.end_date && (
                        <p className="text-red-500 text-sm mt-1">{errors.end_date.message}</p>
                    )}
                </div>

                {/* Capacity */}
                <div className="flex flex-col gap-1">
                    <Label htmlFor="capacity">Capacity <span className="text-red-500">*</span></Label>
                    <Input
                        type="number"
                        id="capacity"
                        {...register("capacity", { required: "Capacity is required" })}
                        disabled={isSubmitting}
                    />
                    {errors.capacity && (
                        <p className="text-red-500 text-sm mt-1">{errors.capacity.message}</p>
                    )}
                </div>

                {/* Time Slot + Fee */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Time Slot */}
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="time_slot">
                            Time Slot <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="time_slot"
                            placeholder="e.g. 10:00 AM - 12:00 PM"
                            {...register("time_slot", { required: "Time Slot is required" })}
                            disabled={isSubmitting}
                        />
                        {errors.time_slot && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.time_slot.message}
                            </p>
                        )}
                    </div>

                    {/* Fee */}
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="fee">
                            Fee <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type="number"
                            step="0.01"
                            id="fee"
                            {...register("fee", { required: "Fee is required" })}
                            disabled={isSubmitting}
                        />
                        {errors.fee && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.fee.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Status + Technologies */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Status */}
                    <div className="flex flex-col gap-1">
                        <Label>
                            Status <span className="text-red-500">*</span>
                        </Label>
                        <Controller
                            name="status_id"
                            control={control}
                            rules={{ required: "Status is required" }}
                            render={({ field }) => (
                                <Select
                                    value={field.value}
                                    onValueChange={(val) => field.onChange(val)}
                                    disabled={isSubmitting}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statuses.map((s) => (
                                            <SelectItem key={s.id} value={s.id.toString()}>
                                                {s.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.status_id && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.status_id.message}
                            </p>
                        )}
                    </div>

                    {/* Technologies */}
                    <div className="flex flex-col gap-1">
                        <Label>
                            Technologies <span className="text-red-500">*</span>
                        </Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-between">
                                    {selectedTechs.length > 0
                                        ? `${selectedTechs.length} technology(s) selected`
                                        : "Select Technologies"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 w-[300px]">
                                <div className="p-2 border-b">
                                    <Input
                                        placeholder="Search technologies..."
                                        value={techSearchTerm}
                                        onChange={(e) => setTechSearchTerm(e.target.value)}
                                    />
                                </div>
                                <ScrollArea className="max-h-60">
                                    {filteredTechnologies.map((tech) => (
                                        <label
                                            key={tech.id}
                                            className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50"
                                        >
                                            <input
                                                type="checkbox"
                                                className="mr-2 w-4 h-4 rounded"
                                                checked={selectedTechs.includes(tech.id)}
                                                onChange={() => handleTechChange(tech.id)}
                                            />
                                            <span className="text-sm font-medium">{tech.name}</span>
                                        </label>
                                    ))}
                                </ScrollArea>
                            </PopoverContent>
                        </Popover>
                        <input
                            type="hidden"
                            {...register("technoLogies", { validate: validateTechnologies })}
                        />
                        {errors.technoLogies && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.technoLogies.message}
                            </p>
                        )}
                    </div>
                </div>






                {/* Trainers + Center */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Trainers */}
                    <div className="flex flex-col gap-1">
                        <Label>
                            Trainers <span className="text-red-500">*</span>
                        </Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-between">
                                    {selectedTrainers.length > 0
                                        ? `${selectedTrainers.length} trainer(s) selected`
                                        : "Select Trainers"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 w-[300px]">
                                <div className="p-2 border-b">
                                    <Input
                                        placeholder="Search trainers..."
                                        value={trainerSearchTerm}
                                        onChange={(e) => setTrainerSearchTerm(e.target.value)}
                                    />
                                </div>
                                <ScrollArea className="max-h-60">
                                    {filteredTrainers.map((trainer) => (
                                        <label
                                            key={trainer.id}
                                            className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50"
                                        >
                                            <input
                                                type="checkbox"
                                                className="mr-2 w-4 h-4 rounded"
                                                checked={selectedTrainers.includes(trainer.id)}
                                                onChange={() => handleTrainerChange(trainer.id)}
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-700 capitalize">
                                                    {trainer.first_name} {trainer.last_name}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {trainer.email}
                                                </span>
                                            </div>
                                        </label>
                                    ))}
                                </ScrollArea>
                            </PopoverContent>
                        </Popover>
                        <input
                            type="hidden"
                            {...register("trainer", { validate: validateTrainers })}
                        />
                        {errors.trainer && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.trainer.message}
                            </p>
                        )}
                    </div>

                    {/* Center */}
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="center">
                            Center <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="center"
                            {...register("center", { required: "Center is required" })}
                            disabled={isSubmitting}
                        />
                        {errors.center && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.center.message}
                            </p>
                        )}
                    </div>
                </div>





                {/* Submit */}
                <div className="md:col-span-2 flex justify-center mt-4">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Creating..." : "Create Batch"}
                    </Button>
                </div>
            </form>


            {submitSuccess && (
                <div
                    className="modal fade show"
                    style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Register</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setSubmitSuccess(false)}
                                ></button>
                            </div>

                            <div className="modal-body">
                                <p> User successfully created!</p>
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => setSubmitSuccess(false)}
                                    data-bs-dismiss="modal"
                                >
                                    Ok
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateBatches;
