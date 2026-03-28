const mongoose=require("mongoose");
const express=require("express");
const app=express();
const path=require("path");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
  console.log("connected to db");
  
}).catch((err)=>{
  console.log(err);
  
})

async function main() {
  await mongoose.connect(MONGO_URL);

}
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))
const methodOverride = require("method-override");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));



app.use("/listings",listings);

app.use("/listings/:id/reviews",reviews);


app.get("/",(req,res)=>{
    res.send("hey i am root")
})


app.use((req,res,next)=>{
  next(new ExpressError(404,"Page not found"));
});
app.use((err, req, res, next) => {
  console.log(err);

  let { status = 500, message = "Something went wrong" } = err;
  res.render("error.ejs",{err})
  // res.status(status).send(message);
});
app.listen(8080,()=>{
  console.log(" server is listening on the port 8080" );
  
})