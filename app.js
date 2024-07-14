
require("dotenv").config();

const express = require("express");
const connectToDb = require("./database/databaseConnect");
const app = express();
const bcrypt= require("bcrypt");
const jwt = require("jsonwebtoken")
const {multer,storage}=require("./middleware/multerConfig");
const Blog = require("./model/blogmodel");
const User = require("./model/usermodel");
const isAuthenticated=require("./middleware/isAuthenticated")
const upload = multer({storage:storage});

const cookieParser = require('cookie-parser');
app.use(cookieParser())

connectToDb();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.set('view engine','ejs')





app.use(async (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.SECRET);
            const user = await User.findById(decoded.userId);
            if (user) {
                req.user = { userId: decoded.userId, username: user.username };
            }
        } catch (err) {
            res.clearCookie("token");
        }
    }
    res.locals.user = req.user;
    next();
});


app.get("/",async (req,res)=>{
    const blogs=await Blog.find({});
    if(blogs.length===0){
        res.send("no blogs found");
    }
    res.render("home.ejs",{blogs})
})

app.get("/home",async (req,res)=>{
    const blogs = await Blog.find() // always returns arrray 
    res.render("home.ejs",{blogs:blogs})
})

app.get("/about",(req,res)=>{
        const name = "PooJa Rana"
        res.render("about.ejs",{name})
})

app.get("/contact",(req,res)=>{
    res.render("contact.ejs")
})

app.get("/form",(req,res)=>{
    res.render("form.ejs")
})

app.get("/createblog",(req,res)=>{

    //console.log(process.env.SECRET);
       //console.log(req,userId)
       res.render("createblog.ejs")
})    


app.post("/createblog",upload.single('image') , isAuthenticated,async (req,res)=>{
    const fileName=req.file.filename;
    const{title,subtitle,description} = req.body;
    //console.log(title,subtitle,description);
    // console.log(req.body);
   await Blog.create({
        title:title,
        subtitle:subtitle,
        description:description,
        image:fileName,
        author:req.user.username,
    })
    //res.send("Blog Created Successfully.")
    res.redirect("/");
})


app.get("/blog/:id",isAuthenticated,async (req,res)=>{
    const id = req.params.id
    // console.log(id)
    const blog= await Blog.findById(id)
    res.render("blog.ejs",{blog:blog})
})    

app.get("/deleteblog/:id", isAuthenticated, async (req, res) => {
    const id = req.params.id;
    const blog = await Blog.findById(id);

    if (!blog || blog.author !== req.user.username) {
        return res.status(403).send("You are not authorized to delete this blog.");
     }

    await Blog.findByIdAndDelete(id);
    res.redirect("/");
});

app.get("/editblog/:id", async (req, res) => {
    const id = req.params.id;
    const blog = await Blog.findById(id);

    if (!blog || blog.author !== req.user.username) {
        return res.status(403).send("You are not authorized to edit this blog.");
    }

    res.render("editblog.ejs", { blog:blog});
});

app.post("/editblog/:id", upload.single('image'), isAuthenticated, async (req, res) => {
    const id = req.params.id;
    const blog = await Blog.findById(id);

    if (!blog || blog.author !== req.user.username) {
        return res.status(403).send("You are not authorized to edit this blog.");
    }

    const fileName = req.file ? req.file.filename : blog.image;
    const { title, subtitle, description } = req.body;

    await Blog.findByIdAndUpdate(id, {
        title: title,
        subtitle: subtitle,
        description: description,
        image: fileName,
    });

    res.redirect("/blog/" + id);
});



app.get("/register",(req,res)=>{
    res.render("register.ejs")
})    
  
app.post("/register",async (req,res)=>{
    const {username,email,password} = req.body 
    await User.create({
        username : username, 
        email : email, 
        password : bcrypt.hashSync(password,12)
    })
    res.redirect("/login")
})

app.get("/login",(req,res)=>{
     res.render("login.ejs")
})    

// app.post("/login",async (req,res)=>{
//     const {email,password} = req.body 
//   const user = await User.find({email : email})

//   if(user.length
//      === 0){
//     res.send("Invalid email")
//   }else{
//     // check password now 
//     const isMatched = bcrypt.compareSync(password,user[0].password)
//     if(!isMatched){
//         res.send("Invalid password")
//     }else{
//         // require("dotenv").config()
        
//         const token = jwt.sign({userId : user[0]._id},process.env.SECRET,{
//             expiresIn : '20d'
//         })
//         res.cookie("token",token)
//         res.send("logged in successfully")
//     }
//   }

// })

app.post("/login" ,async (req,res)=>{
    const{email,password} = req.body;
    // console.log(process.env.SECRET);
    const user=await User.findOne({email:email})
    if(!user){
         return res.send("Invalid password")
    }
        //check password
    const isMatched =  bcrypt.compareSync(password,user.password)
    if(!isMatched){
           return res.send("Invalid password")
    }
    const token = jwt.sign({userId:user._id,username: user.username},process.env.SECRET,{
            expiresIn : '20d'
    })
        res.cookie("token",token)
        res.redirect("/")
       
})
 
app.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
});

// app.get("/about",(req,res)=>{
//     const contact = "Contactform"
//     res.render("about.ejs",{contact})
// })




//ASSINGMENT 


app.get("/search", async (req, res) => {
    const query = req.query.query;
    if (!query) {
        return res.redirect("/");
    }

    const blogs = await Blog.find({
        $or: [
            { title: new RegExp(query, 'i') },
            { subtitle: new RegExp(query, 'i') },
            { description: new RegExp(query, 'i') },
            { author: new RegExp(query, 'i') }
        ]
    });

    res.render("search.ejs", { blogs: blogs, query: query });
});


app.use(express.static("./storage"))
app.use(express.static("./public"))


app.listen(3000,()=>{
    console.log("Nodejs has started at port."+3000);
})
