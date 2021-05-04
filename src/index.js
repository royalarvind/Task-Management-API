const { response } = require('express')
const express = require('express')
const Users = require('./models/user.js')
const Task = require('./models/task.js')
const userrouter = require('./routers/user.js')
const taskrouter = require('./routers/task') 

const app = express()
require('./db/mongoose.js')


const PORT = process.env.PORT

app.use(express.json())
app.use(userrouter)
app.use(taskrouter)

app.listen(PORT,()=>{
    console.log('Server is up and running on '+PORT)
})