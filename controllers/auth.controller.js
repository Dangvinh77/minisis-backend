import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// Register admin
export const createAccountByAdmin = async (req, res) => {
    try {
        const { username, password, email, role } = req.body;

        if (!["admin", "user"].includes(role))
            return res.status(400).json({ error: "Invalid role" });

        const newUser = new User({ username, password, email, role });
        await newUser.save();

        res.status(201).json({
            message: "Account created by admin",
            user: {
                username: newUser.username,
                role: newUser.role,
                email: newUser.email
            }
         });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
//Register User

// Tạo transporter cho Gmail
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'phamdangvinh2002@gmail.com',
            pass: process.env.GMAIL_APP_PASS
        }
    });
};

// Template email
const createWelcomeEmailTemplate = (username) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 28px;">Chào mừng đến với ứng dụng!</h1>
      </div>
      <div style="padding: 30px; background: #f9f9f9;">
        <h2 style="color: #333;">Xin chào ${username},</h2>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">
          Cảm ơn bạn đã đăng ký tài khoản tại Persol Glasses Shop.
        </p>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">
          Tài khoản của bạn đã được tạo thành công. Bây giờ bạn có thể đăng nhập và bắt đầu sử dụng các tính năng của ứng dụng.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="http://localhost:5172/#" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Đăng nhập ngay
          </a>
        </div>
      </div>
      <div style="background: #333; padding: 20px; text-align: center; color: white;">
        <p style="margin: 0; font-size: 14px;">
          © 2024 Your App. All rights reserved.
        </p>
      </div>
    </div>
  `;
};

//Register User với gửi email
export const registerUser = async (req, res) => {
    try {
        const newUser = new User({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            role: "user" // ép buộc là user
        });

        await newUser.save();

        // Gửi email chào mừng
        try {
            const transporter = createTransporter();

            const mailOptions = {
                from: '"Persol, Inc" <phamdangvinh2002@gmail.com>',
                to: req.body.email,
                subject: 'Chào mừng đến với Persol Glasses Shop! 🎉',
                html: createWelcomeEmailTemplate(req.body.username)
            };

            await transporter.sendMail(mailOptions);
            console.log('Welcome email sent successfully to:', req.body.email);
        } catch (emailError) {
            console.error('Failed to send welcome email:', emailError);
            // Không throw error để không ảnh hưởng đến quá trình đăng ký
        }

        res.status(201).json({
            message: "User registered successfully",
            user: {
                username: newUser.username,
                role: newUser.role,
                email: newUser.email
            }
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

// Get user profile (sau khi đăng nhập)
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Loại bỏ password
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                fullname: user.fullname,
                phoneNumber: user.phoneNumber,
                address: user.address,
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
