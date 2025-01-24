const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/userModel");

exports.register = async (req, res) => {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    try {
        // Check if user already exists
        User.findByEmail(email, async (err, existingUser) => {
            if (err) return res.status(500).json({ message: "Server error" });
            if (existingUser.length > 0) {
                return res.status(400).json({ message: "User already exists" });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new user
            User.create(name, email, hashedPassword, (err, result) => {
                if (err) return res.status(500).json({ message: "Server error" });
                
                // Respond with user details (excluding password)
                const newUser = { id: result.insertId, email, name };
                res.status(201).json({
                    message: "User registered successfully",
                    user: newUser,
                });
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        // Check if the user exists
        User.findByEmail(email, async (err, users) => {
            if (err) return res.status(500).json({ message: "Server error" });
            if (users.length === 0) {
                return res.status(400).json({ message: "User not found" });
            }

            const user = users[0]; // We expect a single user object in the array

            // Check if the password matches
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            // Generate a JWT token (optional, if you want to use it for session management)
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET || 'your_jwt_secret',
                { expiresIn: '1h' }
            );

            res.status(200).json({
                message: "Login successful",
                user: { id: user.id, email: user.email, name: user.name },
                token, // Send token if needed for session management
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
