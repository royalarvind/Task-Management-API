const express  = require('express')
const Users = require('../models/user.js')
const auth =require('../middleware/auth.js')

const router = new express.Router()


router.post('/users', async (req,res)=>{
    
    const user = new Users(req.body)
    try{
        await user.save()
        const token = await user.createAuthtoken()
        res.status(201).send({user,token})
    }catch(e){
        res.status(400).send(e)
    }
    
    
})

router.post('/users/login',async (req,res)=>{
    try{
        const user = await Users.findByCredentials(req.body.email, req.body.password)
        const token = await user.createAuthtoken()
        res.status(200).send({user,token})
    }catch(e){
        console.log(e.message)
        res.status(400).send(e)
    }
})

router.get('/users/logout', auth, async (req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send(e)
    }
})

router.get('/users/logoutall', auth, async (req,res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send(e)
    }
})
router.get('/users/me', auth,async (req,res)=>{
    res.send(req.user)
})


router.patch('/users/me', auth, async (req,res)=>{
    const _id = req.user._id
    const updates = Object.keys(req.body)
    const allowedupdates = ['name','email','password','age']
    const isValidOperation = updates.every((updates)=>{
        return allowedupdates.includes(updates)
    })
    if(!isValidOperation){
        return res.status(404).send({error:"Invalid Operation"})
    }
    try{
        const user = req.user
        updates.forEach((update)=>{
            user[update] = req.body[update]
        })
        await user.save()
        res.send(user)
    }catch(e){
        res.status(500).send(e)
    }
})

router.delete('/users/me', auth, async (req,res)=>{
    try{
    req.user.remove()
    res.send(req.user)
    }catch(e){
        res.status(400).send(e)
    }
})

module.exports = router