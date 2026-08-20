
const User=require("../Models/user");
module.exports.renderSignup=(req,res)=>{
   res.render("user/signup.ejs")
  }


module.exports.signUP = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;

        console.log("SIGNUP DATA:", username, email, password);

        const newuser = new User({ email, username });

        const registerUser = await User.register(newuser, password);

        console.log("USER REGISTERED:", registerUser);

        req.login(registerUser, (err) => {
            if (err) {
                return next(err);
            }

            req.flash("success", "Welcome to WanderNest");
            res.redirect("/listings");
        });

    } catch (e) {
        console.log("SIGNUP ERROR:", e);

        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

 module.exports.renderLogin=(req,res)=>{
    res.render("user/login.ejs")
  }
  module.exports.login=async(req,res)=>{
   req.flash("success","Welcome back to wanderlust");
  let redirectUrl = res.locals.redirectUrl || "/listings";

delete req.session.redirectUrl;

res.redirect(redirectUrl);
}


module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
      if(err){
        return next(err);

      }
      req.flash("success","logged you out");
      res.redirect("/listings");
    })
}