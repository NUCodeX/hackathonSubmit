const db = require('../database');
const util = require('util');

const query = util.promisify(db.query).bind(db);

exports.getNewsFlash = async (req, res) => {
    try {
        let newsFlash = await query('SELECT * FROM newflash');

        
        newsFlash = newsFlash.map(news => ({
            ...news,
            formatted_date: new Date(news.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
            })
        }));

        res.json(newsFlash); 
        console.log(newsFlash);
    } catch (error) {
        console.error("Error fetching news:", error);
        res.status(500).json({ error: "Failed to fetch news" });
    }
};
