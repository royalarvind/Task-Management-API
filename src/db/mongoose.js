const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true,
    useUnifiedTopology: true,
    useCreateIndex:true
})





// me.save().then(()=>{
//     console.log(me)
// }).catch((error)=>{
//     console.log(error)
// })



