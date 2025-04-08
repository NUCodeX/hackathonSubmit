const jwt = require('jsonwebtoken')

exports.verifyToken = async (req,res, next)=>{
const sercretToken = process.env.SECRET_KEY
const token = req.cookies.auth_token

if(!token) return res.json({isAuthenticated: false})
    try{

        const decoded = jwt.verify(token, sercretToken)
        req.user = decoded
        res.json({isAuthenticated: true, role: decoded.role})
        next()
}catch(error){
    return res.status(403).json({ message: "Invalid token" });

}
}