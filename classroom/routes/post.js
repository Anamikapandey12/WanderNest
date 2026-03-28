const express=require("express");
const router=express.Router();

//index route
router.get("/",(req,res)=>{
    res.send("get for posts");
})

//index route
router.get("/:id",(req,res)=>{
    res.send("get for post id");
})

//post route
router.post("/",(req,res)=>{
    res.send("get for post route");
})

//delete route
router.delete("/:id",(req,res)=>{
    res.send("get for delete posts");
});

module.exports=router;