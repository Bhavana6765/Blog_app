const exp=require('express')
const adminApp=exp.Router();


adminApp.get("/",(req,res)=>{
    res.send({message:"from admin api"})
})

module.exports=adminApp;