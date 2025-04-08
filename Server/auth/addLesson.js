const db = require('../database')
const util = require('util')

const query = util.promisify(db.query).bind(db)
exports.addLesson = async (req, res) => {
  try {
    const { title, description, paragraphs, mythBusters } = req.body;

    console.log(req.body);

    const lessonQuery = `INSERT INTO lesson (lessonTitle, description) VALUES (?, ?)`;
    const values = [title, description];

    const lessonResult = await query(lessonQuery, values);
    const lessonId = lessonResult.insertId;

    if (paragraphs && paragraphs.length > 0) {
      const paragraphQuery = `INSERT INTO paragraph (paragraph, lesson_id, reference) VALUES ?`;
      

      const paragraphData = paragraphs.map((p) => [
        p.content, 
        lessonId, 
        p.reference.length > 0 ? p.reference : null 
      ]);

      await query(paragraphQuery, [paragraphData]);
    }

    if (mythBusters && mythBusters.length > 0) {
      const gameQuery = `INSERT INTO lessongame (question, answer, lesson_id) VALUES ?`;
      const quizData = mythBusters.map((game) => [
        game.question, 
        game.answer, 
        lessonId
      ]);

      await query(gameQuery, [quizData]);
    }

    console.log("Successfully inserted lesson, paragraphs, and mythbusters.");
    res.status(201).json({ message: "Lesson added successfully" });

  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
