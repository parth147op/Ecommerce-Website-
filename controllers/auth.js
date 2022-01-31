const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: "parthpatel321321@gmail.com",
    pass: "parthqazplm",
    clientId:
      "1060457619059-5nfs9dor91n03ds638dumbinq7eus1gm.apps.googleusercontent.com",
    clientSecret: "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",
    refreshToken:
      "1//04mjCA47yFZtUCgYIARAAGAQSNwF-L9IrdrQHapitzokaLUCxPM-LG25sWqVAELa-ulXjqgF_EHK9DDwdGgL0jwI7he_teqY22lA",
  },
});
exports.getRegister = (req, res, next) => {
  var isAdmin=false;
  if(req.user){
    isAdmin = req.user.isAdmin;
  }
  res.render("auth/register", {
    isAuthenticated: req.session.isLoggedIn,
    isAdmin:isAdmin
  });
};
exports.getLogin = (req, res, next) => {
  var isAdmin=false;
  if(req.user){
    isAdmin = req.user.isAdmin;
  }
  res.render("auth/login", {
    isAuthenticated: req.session.isLoggedIn,
    isAdmin:isAdmin
  });
};
exports.postRegister = (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const cpassword = req.body.cpassword;
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        console.log("this email is already registered");
        return res.redirect("/register");
      }
      return bcryptjs.hash(password, 12);
    })
    .then((hashedpassword) => {
      const user = new User({
        username: username,
        email: email,
        password: hashedpassword,
        cart: { items: [] },
      });
      return user.save();
    })
    .then((result) => {
      return res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        console.log("invalid credentials!!!");
        return res.redirect("/login");
      }
      // bcryptjs.compare(password, user.password).then((domatch) => {
      //   if (domatch) {
      //     console.log("loggedin successfully!!!");
      //     return res.redirect("/");
      //   }
      //   console.log("invalid credentials !!!");
      //   return res.redirect("/login");
      // }).catch(err=>{console.log(err);});
      bcryptjs.compare(password, user.password).then((domatch) => {
        if (domatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          console.log("LoggedIn Successfully!!!!");
          return res.redirect("/");
        }
        console.log("Invalid Credentials!!!!");
        res.redirect("/login");
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.postlogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
exports.getReset = (req, res, next) => {
  var isAdmin=false;
  if(req.user){
    isAdmin = req.user.isAdmin;
  }
  res.render("auth/reset", {
    isAuthenticated: req.session.isLoggedIn,
    isAdmin:isAdmin
  });
};
exports.postReset = (req, res, next) => {
  const email = req.body.email;
  //const password = req.body.password;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 30000000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/");
        const mailoptions = {
          from: "parthpatel321321@gmail.com",
          to: email,
          subject: "Signup",
          html: `
                <p>You requested to Reset password.....</p>
                <p><a href="https://parthecommercejs.herokuapp.com/reset/${token}">Click here to reset password</a>....</p>
                
              `,
        };
        return transport.sendMail(mailoptions, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent : " + info.response);
          }
        });
      })
      .catch((err) => console.log(err))
  });
};

exports.getForgotPassword = (req,res,next)=>{
  var isAdmin=false;
  if(req.user){
    isAdmin = req.user.isAdmin;
  }
  const token = req.params.token;
  User.findOne({resetToken:token}).then((user)=>{
    res.render('auth/forgotpassword',{
      isAuthenticated: req.session.isLoggedIn,
      passwordToken:token,
      isAdmin:isAdmin
    });
  })
 
}
exports.postForgotPassword = (req,res,next)=>{
  const newpassword = req.body.newpassword;
  const confirmnewpassword = req.body.confirmnewpassword;
  const passwordToken = req.body.passwordToken;
  let resetUser;
  if(newpassword===confirmnewpassword){
    User.findOne({resetToken:passwordToken}).then((user)=>{
      resetUser=user;
      return bcryptjs.hash(newpassword,12);
    }).then((hashedpassword)=>{
      resetUser.password = hashedpassword;
      resetUser.resetToken = null;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    }).then(result=>{
      return res.redirect('/login');
    }).catch(err=>{
      console.log(err);
    })
  }
}
