const mongoose=require("mongoose");
const review = require("./review");
const Schema=mongoose.Schema;

const listingSchema=new Schema({
    title:{
        type:String,
        required:true,

    },
    description:String,
    
  image: {
    filename: {
      type: String,
      default: "listingimage",
    },
    url: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=870&auto=format&fit=crop",
    },
  },
    // image:{
    //     type:String,
    //     default:"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //     set:(v)=>v===""?"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v,
    // }
    // ,
  price: {
  type: Number,
  required: true
},
    location:String,
    country:String,
    reviews:[
      {
       type:Schema.Types.ObjectId,
       ref:"Review"

      }
    

    ]
});

const listing=mongoose.model("listing",listingSchema)
module.exports=listing;

