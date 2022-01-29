const path = require("path");
const session = require("express-session");
const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const mongodbStore = require("connect-mongodb-session")(session);

const User = require('./models/user');
const app = express();
const MONGOURI = `mongodb+srv://Parth147:parth001@cluster0.aztrh.mongodb.net/Ecommerce?retryWrites=true&w=majority`;
const store = new mongodbStore({
    uri: MONGOURI,
  collection: "session"
})
app.set("view engine", "ejs");
app.set("views", "views");
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
    session({
        secret: "abcdefghi",
    resave: false,
    saveUninitialized: false,
    store: store,
    })
)
app.use((req,res,next)=>{
    if(!req.session.user){
        return next();
    }
    User.findById(req.session.user._id).then((user)=>{
        req.user=user;
        next();
    }).catch((err)=>console.log(err));
    
})
app.use(shopRoutes);
app.use(authRoutes);
const PORT = process.env.PORT || '8080';
mongoose.connect(MONGOURI).then
(connect=>{
    console.log(`Connection with database mongodb://localhost:27017/Parthjs successfull!!!`)
}).then(result=>{
    app.listen(process.env.PORT || PORT,()=>{
        console.log('App is running on PORT:'+PORT);
    })
}).catch(err=>console.log(err));
