const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const cors = require('cors')
const database = require('../Server/database')
const path = require('path')


app.use('/upload', express.static(path.join(__dirname, 'upload')));
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())


app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))


app.use('/auth', require('../Server/auth/postLink'))
app.use('/', require('../Server/routes/route'))


app.listen(5000,()=>{

    console.log('server is running on port 5000');
    
})