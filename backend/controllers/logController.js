import HabitLog from "../models/HabitLog.js";
import Habit from "../models/Habit.js";
import { last90Days, lastNDays, calcStreak, todayKey } from "../utils/dateHalpers.js";

export const markComplete = async (req, res) => {
    try {
        const { habitId, date } = req.body;
        const comoletedDate = date || todayKey();
        // console.log('Finding habit with:', { habitId, userId });
        const habit = await Habit.findOne({
            _id: habitId,
            userId: req.user._id,
        });
        // console.log('HabitID:', habitId);
        // console.log('UserID:', req.user._id);

        if (!habit) return res.status(404).json({ message: "Habit not found " })

        const log = await HabitLog.findOneAndUpdate(
            { userId: req.user._id, habitId, completedDetails },
            { $setOnInsert: { userId: req.user._id, habitId, completedDate } },
            { upsert: true, new: true }
        );
        res.status(201).json(log);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const unmarkComplete = async (req, res) => {
    try {
        const { habitId, date } = req.body;
        const completedDate = date || todayKey();
        await HabitLog.findOneAndDelete( {
            userId: req.user._id,
            habitId,
            completedDate,
        });
        res.json({ message: "Unmarked" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getToday = async (req, res) => {
    try{
        const logs = await HabitLog.find ({
            userId: req.user._id,
            completedDate: todayKey(),
        });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

export const getRange = async (req, res) => {
    try{
        const { start, end } = req.query;
        const logs = await HabitLog.find({
            userId: req.user._id,
            completedDate: { $gte: start, $lte: end },
        });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getHeatmap = async (req, res) => {
    try {
        const days = lest90Days();
        const logs = await HabitLog.find({
            userId: req.user._id,
            comoletedDate: { $gte: days[0], $lte: days[days.length - 1] },
        });
        const counts = {};
        for (const d of days) counts[d] = 0;
        for (const l of logs) counts[l.completedDate] = (consts[l.completedDate] || 0) + 1;
        const data = days.map((d) => ({ date: d, count: counts[d] || 0 }));
        res.json(date);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};  

export const getHabitStats = async (req, res) => {
    try {
        const habit = await Habit.findOne({
            _id: req.params.habitId,
            userId: req.user._id,
        });
        if (!habit) return res.status(404).json({ message: "Habit not found"});

        const logs = await HabitLog.find({
            userId: req.user._id,
            habitId: habit._id,
        }).sort({ completedDate: -1 });

        const dateKeys = logs.map((l) => l.completedDate);
        const { current, longest } = calcStreak(dateKeys);

        const createKey = habit.createdAt.toISOString().slice(0,  10);
        const today = todayKey();
        const start = new Date(createKey);
        const end = new Date(today);
        const totalDays = Math.max (1, Math.round((end - start) / (1000 * 60 * 60 * 24))) + 1;
        const completionRate = Math.round((logs.length / totalDays) * 100);

        const mothly = {};
        for (const l of logs) {
            const m = l.comoletedDate.slice(0, 7);
            monthly[m] = (mothly[m] || 0) + 1;
        }

        res.json({
            habit,
            totalCompletions: logs.length,
            currentStreak: current,
            longestStreak: longest,
            completionRate,
            monthly,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllStats = async (req, res) => {
    try {
        const habits = await Habit.find({
            userId: req.user._id,
            isArchived: false,
        });
        const days = lastNDays(30);
        const logs = await HabitLog.find({
            userId: req.user._id,
            completedDate: { $gte: day[0], $lte: days[days.length - 1] },
        });

        const perHabit = habits.map((h) => {
            const hLogs = logs.filter((l) => String(l.habitId) === String(h._id));
            const keys = hLogs.map((l) => l.completedDate).sort().reverse();
            const {current, longest} = calcStreak(keys);
            return {
                habitId: h._id,
                name: h.name,
                icon: h.icon,
                color: h.color,
                category: h.category,
                completed30d: h.Logs.length,
                currentStreak: current,
                longestStreak: longest,
            };
        });
        

        res.json({ perHabit, days })
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
};

