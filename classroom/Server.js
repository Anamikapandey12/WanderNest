const express=require("express");
const app=express();
const posts=require("./routes/post.js")
const users=require("./routes/user.js")
// const cookieParser=require("cookie-parser");

const session = require('express-session');
app.use(session({secret:"mysupersecretstring",
    resave:false,
    saveUninitialized:true
    
}));  
  

      app.get("/register",(req,res)=>{
        let {name="anonymous"}=req.query;
        req.session.name=name;
        res.send(name);
      })
// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//              req.session.count=1
//     }
 
//     res.send(`you sens a message ${req.session.count} times`);
// })
app.get("/test",(req,res)=>{
    res.send("test sucessful");
})

// app.use("/getsignedcookie",(req,res)=>{
//     res.cookie("made-in","India",{signed:true});
//     res.send("signed cookie sent");
// })


// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("verifiy")
    
// })
// app.get("/setCookie",(req,res)=>{
//     res.cookie("greet","hello");
//         res.cookie("greet","hello");
//     res.send("hi, i am root");
// })
// app.get("/greet",(req,res)=>{
//     let {name="Ananomus"}=req.cookies; 
//    res.send(`Hi ${name}`)
// })
// app.get("/",(req,res)=>{
//     console.dir(req.cookies);
//     res.send("hi, i am root");
// })
// app.use("/posts",posts);
// app.use("/users",users);


app.listen(3000,()=>{
    console.log("Server is litening on the port");
    
})