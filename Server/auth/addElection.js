const db = require('../database')
const util = require('util')

const query = util.promisify(db.query).bind(db)

exports.setElection = async (req,res)=>{
    try{    
        const {status, electionYear} = req.body
        await query(`INSERT INTO election_settings (status, year) VALUES (?,?)`, [status, electionYear])
        console.log(req.body);
        
    }catch(error){
        console.log(error); 
    }
}