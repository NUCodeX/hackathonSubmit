const db = require('../database')
const util = require('util')

const query = util.promisify(db.query).bind(db)

exports.lessonTable = async (req,res)=>{

  try {
        const lessons = await query("SELECT id, lessonTitle FROM lesson");

        if (lessons.length === 0) {
            return res.status(404).json({ error: "No lessons found" });
        }

        res.json(lessons);
    } catch (error) {
        console.error("Error fetching lessons:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}