import mongoose from "mongoose";

const acceptedTaskSchema = new mongoose.Schema(
  {
    task_id: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // the helper
    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
  },
  { timestamps: true }
);

const AcceptedTask = mongoose.model("AcceptedTask", acceptedTaskSchema);
export default AcceptedTask;
