import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    task_id: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
    requester_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Request = mongoose.model("Request", requestSchema);
export default Request;
