import mongoose from "mongoose";

const CATEGORIES = ["Health", "Fitness", "Productivity", "Learning", "Mindfulness", "Social", "Finance", "Creativity", "Other"];

const habitSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        name: {
            type:String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            default: "",
        },
        category: {
            type: String,
            enum: CATEGORIES,
            default: "Other",
        },
        frequency: {
            type: String,
            enum: ["Daily", "Weekly", "Monthly"],
            default: "Daily",   
        },
        targetDays: {
            type: Number,
            default: 7,
            max: 7,
        },
        color: {
            type: String,
            default: "#6366f1",
        },
        icon: {
            type: String,
            default: "default-icon",
        },
        isArchived: {
            type: Boolean,
            default: false,
        },
        other: {
            type: Number,
            default: 0,
        },
    },
    {timestamps: true}
);

export const HABIT_CATEGORIES = CATEGORIES;

export default mongoose.model("Habit", habitSchema);