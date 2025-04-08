const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/verifyToken')
const profile = require('../routes/politicsProfile')
const MythBuster = require('../routes/getmythbuster')
const rightAndRiddle = require('../routes/getRightAndRiddle')
const sixCards = require('../routes/landingPageNews')
const news = require('../routes/getnewprofile')
const lesson = require('../routes/lesson')
const statistics = require('../routes/statistics')
const lessonTable = require('../routes/lessonsTable')
const politics = require('../routes/politicsFinder')
const landingLesson = require('../routes/lessonLanding')
const editLesson = require('../routes/edit/editLesson')
const advocacies = require('../routes/getAllAdvocacies')
const newsFlash = require('../routes/getAllNews')

router.get('/verifyToken',verifyToken.verifyToken)
router.get('/profile/:id',profile.profile)
router.get('/mythBusterPage',MythBuster.getMythbuster)
router.get('/rightAndRiddle',rightAndRiddle.rightAndRiddle)

router.get('/sixCards',sixCards.sixCards)
router.get('/news/:id',news.getNews)
router.get("/lesson/:id", lesson.getLesson);
router.get("/lessons", lesson.getLessonsList);
router.get('/statistics', statistics.statistics)

router.get('/editLesson', lesson.getEditLesson)

router.get('/politicsFinder', politics.finder)
router.get('/GetAllAdvocacies', advocacies.GetAllAdvocacies)
router.get('/editPoliticsPage', landingLesson.landingLesson)
router.get('/newsFlash', newsFlash.getAllNews)

/* router.put('/lesson/:id', lesson.updateLesson) */
module.exports = router