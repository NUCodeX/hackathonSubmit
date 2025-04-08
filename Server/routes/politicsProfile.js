const db = require('../database');
const util = require('util');

const query = util.promisify(db.query).bind(db);

exports.profile = async (req, res) => {
    try {
        const { id } = req.params;
        
        const profileQuery = `
            SELECT p.*, GROUP_CONCAT(DISTINCT a.advocacy) AS advocacy 
            FROM politician p
            LEFT JOIN advocacy a ON p.id = a.politician_Id
            WHERE p.id = ?
            GROUP BY p.id;
        `;

        const rolesQuery = `
            SELECT role, year FROM pastroles 
            WHERE politician_id = ?
            ORDER BY year DESC;
        `;

        const activitiesQuery = `
            SELECT activity, reference FROM pastactivities
            WHERE politician_id = ?
            ORDER BY id DESC;
        `;

        const [profileData, rolesData, activitiesData] = await Promise.all([
            query(profileQuery, [id]),
            query(rolesQuery, [id]),
            query(activitiesQuery, [id])
        ]);

        if (profileData.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const result = {
            ...profileData[0],
            advocacy: profileData[0].advocacy ? profileData[0].advocacy.split(",") : [],
            pastRoles: rolesData,
            pastActivities: activitiesData
        };

        res.json(result);
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};