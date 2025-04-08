const db = require('../database');
const util = require('util');

const query = util.promisify(db.query).bind(db);

exports.finder = async (req, res) => {
    try {
        const results = await query('SELECT * FROM advocacy');

        if (!results || results.length === 0) {
            return res.status(404).json({ message: 'No data found' });
        }

        const uniqueAdvocacies = [...new Set(results.map(item => item.advocacy))];
        const uniquePlatforms = [...new Set(results.map(item => item.platform))];

        console.log({ advocacies: uniqueAdvocacies, platforms: uniquePlatforms });

        return res.json({
            advocacies: uniqueAdvocacies,
            platforms: uniquePlatforms
        });
    } catch (error) {
        console.error('Database Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
