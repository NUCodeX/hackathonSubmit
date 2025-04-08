const db = require('../database')
const util = require('util')
const multer = require("multer")
const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, "upload/")
    },
    filename: (req, file, cb)=>{
        cb(null, file.originalname)
    },
})

const upload = multer({storage: storage})


exports.addNewsFlash = [
    upload.single('image'),
    async (req, res)=>{
        const query = util.promisify(db.query).bind(db)
    
        try{
            const {title, date, summary} = req.body
            const image = req.file.filename
            console.log(image);
            
            const newFlashQuery = `INSERT INTO newflash (title, date, summary, image) VALUES (?,?,?,?)`
            const newFlashValues = [title, date, summary, image]

            await query(newFlashQuery, newFlashValues)
            res.status(200).json({message: "News flash added"})
            
        }catch(error){
            console.log(error);
            
        }
    }
]