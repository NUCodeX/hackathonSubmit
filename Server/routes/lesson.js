const db = require("../database");
const util = require("util");
const query = util.promisify(db.query).bind(db);

exports.getLesson = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id:params",id);
    
    const { quizIndex = 0 } = req.query;

    console.log("Incoming lesson ID:", id);
    console.log("Requested quiz index:", quizIndex);

    if (!id) return res.status(400).json({ error: "Lesson ID is required" });

    const lesson = await query("SELECT * FROM lesson WHERE id = ?", [id]);
    if (!lesson.length) {
      console.log("Lesson not found");
      return res.status(404).json({ error: `Lesson with ID ${id} not found` });
    }

    const paragraphs = await query("SELECT * FROM paragraph WHERE lesson_id = ?", [id]);
    const allQuizzes = await query("SELECT * FROM lessongame WHERE lesson_id = ?", [id]);
    const currentQuiz = allQuizzes[quizIndex] || null;

    res.json({
      lesson: lesson[0],
      paragraphs,
      game: currentQuiz,
      totalQuizzes: allQuizzes.length
    });

    console.log({  lesson: lesson[0],
      paragraphs,
      game: currentQuiz,
      totalQuizzes: allQuizzes.length});
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getLessonsList = async (req, res) => {
  try {
    const lessons = await query("SELECT id, lessonTitle, description FROM lesson");
    res.json(lessons);

    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getEditLesson = async (req, res) => {
  try {
    const lessons = await query("SELECT id, lessonTitle, description FROM lesson");
    const paragraphs = await query('SELECT * FROM paragraph');
    const data = lessons.map(lesson => ({
      ...lesson,
      paragraphs: paragraphs.filter(p => p.lesson_id === lesson.id)
    }));
    
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};