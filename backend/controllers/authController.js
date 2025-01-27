const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
console.log("User Model:", User);


exports.register = (req, res) => {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    console.log("Register request body:", req.body);

    User.findByEmail(email, (err, existingUser) => {
        if (err) {
            console.error("Database error during findByEmail:", err);
            return res.status(500).json({ message: "Database error" });
        }

        console.log("Existing user result:", existingUser);

        if (existingUser.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error("Error hashing password:", err);
                return res.status(500).json({ message: "Error hashing password" });
            }

            User.create(name, email, hashedPassword, (err, result) => {
                if (err) {
                    console.error("Database error during user creation:", err);
                    return res.status(500).json({ message: "Database error" });
                }

                res.status(201).json({ message: "User registered successfully" });
            });
        });
    });
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
