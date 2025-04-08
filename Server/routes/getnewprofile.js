const db = require('../database');
const util = require('util');

const query = util.promisify(db.query).bind(db);

exports.getNews = async (req, res) => {
    try {
        const {id} = req.params
        let news = await query('SELECT * FROM newflash WHERE id = ? ', [id]);
        
        news = news.map(news => ({
            ...news,
            date: new Date(news.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
            })
        }));

        res.json(news); 
        
    } catch (error) {
        console.error("Error fetching news:", error);
        res.status(500).json({ error: "Failed to fetch news" });
    }
};
