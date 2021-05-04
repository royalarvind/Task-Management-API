
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const task = require('./task')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        trim: true,
        required: true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        lowercase:true,
        trim:true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('Please Provide a valid email!')
            }
        }
    },
    age: {
        type: Number,
        default:0,
        validate(value){
            if(value<0){
                throw new Error('Age must be a positive number.')
            }
        }
    },
    password:{
        type: String,
        required: true,
        trim:true,
        minLength:6,
        validate(value){
            if(value.toLowerCase().includes("password")){
                throw new Error('Password must not contain password') 
            }
        }
    },
    tokens:[{
        token:{
            type: String,
            required: true 
        }
    }]
})

userSchema.methods.toJSON = function() {
    const user = this
    const Userobject = user.toObject()
    delete Userobject.password
    delete Userobject.tokens
    
    return Userobject

}

userSchema.methods.createAuthtoken = async function(){
    const user = this
    const token = jwt.sign({_id: user._id.toString()},process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async(email,password)=>{
    const user = await User.findOne({email})
    if(!user){
        throw new error('Unable to login')
    }
    const isPasswordMatch = await bcrypt.compare(password,user.password)
    if(!isPasswordMatch){
        throw new error('Unable to login')
    }
    return user
}

userSchema.pre('save', async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }

    next()
})

userSchema.pre('remove', async function(next){
    const user = this
    await task.deleteMany({owner:user._id})

    next()
})

const User = mongoose.model('users',userSchema)

module.exports = User