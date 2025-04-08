const db = require('../../database')
const util = require('util')


const query = util.promisify(db.query).bind()

exports.editLesson = async()=>{
    try {
        
    } catch (error) {
        console.log(error);
        
    }
}