const express=require("express");
const router=express.Router();


//index route
router.get("/",(req,res)=>{
    res.send("get for userss");
})

//index route
router.get("/:id",(req,res)=>{
    res.send("get for user id");
})

//post route
router.post("/",(req,res)=>{
    res.send("get for user route");
})

//delete route
router.delete("/:id",(req,res)=>{
    res.send("get for delete users");
});
module.exports=router;