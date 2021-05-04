const mongoose = require('mongoose')
const validator = require('validator')
const task = mongoose.model('tasks',{
    description :{
         type: String,
         required:true,
         trim:true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        
    }
})

module.exports=task;