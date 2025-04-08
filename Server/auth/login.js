const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../database");
const util = require("util");

const queryAsync = util.promisify(db.query).bind(db);

const loginFunction = async (username, password, res) => {
    try {
        const secretKey = process.env.SECRET_KEY;

        const results = await queryAsync(`SELECT username, password, id,role FROM admin WHERE username = ?`, [username]);

        if (results.length === 0) {
            console.log("User not found");
            return { success: false, message: "User not found" };
        }

        const user = results[0];

        console.log("Entered Password:", password);
        console.log("Stored Hashed Password:", user.password);

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            console.log("Password mismatch!");
            return { success: false, message: "Incorrect password" };
        }

        const token = jwt.sign({ id: user.id, username: user.username, role: user.role}, secretKey, { expiresIn: "1h" });

        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 60 * 60 * 1000
        });
        console.log(user.role);
            
        return { success: true, message: "Login successful", token, role: user.role};
    } catch (error) {
        console.error("Login error:", error);
        return { success: false, message: "Server error" };
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    const result = await loginFunction(username, password, res);
    return res.status(result.success ? 200 : 401).json(result);
};
