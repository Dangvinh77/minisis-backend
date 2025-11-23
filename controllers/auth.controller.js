import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register admin
export const createAccountByAdmin = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        if (!["admin", "user"].includes(role))
            return res.status(400).json({ error: "Invalid role" });

        const newUser = new User({ username, password, role });
        await newUser.save();

        res.status(201).json({ message: "Account created by admin" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
//Register User
export const registerUser = async (req, res) => {
    try {
        const newUser = new User({
            username: req.body.username,
            password: req.body.password,
            role: "user" // ép buộc là user
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully",
            user: { username: newUser.username, role: newUser.role }
        });
    } catch (error) {
        res.status(400).json({
            error: error.message,
         });
    }
};

// Login admin
export const login = async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Incorrect password" });

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.json({ token, user: { username: user.username, role: user.role } });
};
