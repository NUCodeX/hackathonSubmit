const db = require('../database');
const bcrypt = require('bcrypt');
const util = require("util");


exports.register = async (req, res) => {
    const queryAsync = util.promisify(db.query).bind(db)
     
    try {
        const { username, password, firstname, lastname } = req.body;

        const checkQuery = "SELECT * FROM admin WHERE username = ?";
        const checkData = [username];

        const rows = await queryAsync(checkQuery, checkData);

        if (rows.length > 0) {
            return res.status(400).json({ message: "User already exists!" });
        }

        
        const hashPassword = await bcrypt.hash(password, 8);

        const query = "INSERT INTO admin (username, password, firstname, lastname) VALUES (?, ?, ?, ?)";
        const data = [username, hashPassword, firstname, lastname];

        queryAsync(query, data);

        return res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error("Something went wrong:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
