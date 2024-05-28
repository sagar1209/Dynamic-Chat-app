const User = require("../models/userModel");
const Chat = require('../models/chatModel')
const bcrypt = require("bcrypt");

const registerLoad = async (req, res) => {
  try {
    res.render("register");
  } catch (error) {
    console.log(error.message);
  }
};

const register = async (req, res) => {
  try {
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      image: "images/" + req.file.filename,
      password: passwordHash,
    });
    await user.save();
    res.render("register", { message: "Registration Successfully!" });
  } catch (error) {
     if (error.code === 11000) { // MongoDB duplicate key error code
      res.render("register", { error: "Email already exists!" });
    } else {
      res.render("register", { error: "An error occurred during registration." });
    }
    console.log(error.message);
  }
};

const loadLogin = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) res.render("login", { message: "email does not exit" });
    const isMatch = await  bcrypt.compare(password, user.password);
    if (!isMatch) return res.render("login", { message: "password incorrect" });
    req.session.user = user;
    return res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

const logout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

const loadDashboard = async (req, res) => {
  try {
   const users = await User.find({_id :{
      $nin : [req.session.user._id]
   }});
    res.render("dashboard", { user: req.session.user,users:users});
  } catch (error) {
    console.log(error);
  }
};

const saveChat = async(req,res)=>{
  try {
    let newChat = new Chat(req.body);
    newChat = await newChat.save();

    res.status(200).send({success:true,message:"chat inserted",data:newChat});

  } catch (error) {
    res.status(400).send({success:false,message:error.message})
  }
}

const deleteChat= async(req,res)=>{
   try {
      await Chat.deleteOne({_id : req.body.id});
      res.status(200).send({success:true})
      
   } catch (error) {
    res.status(400).send({success:false,message:error.message})
   }
}

module.exports = {
  registerLoad,
  register,
  loadLogin,
  login,
  logout,
  loadDashboard,
  saveChat,
  deleteChat
};
