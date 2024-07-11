const express = require("express");
const connectToDb = require("./database/databaseConnect");
const Blog = require("./model/blogmodel.js");
const bcrypt= require("bcrypt");
const app = express();

const {multer,storage}=require('./middleware/multerConfig');
const upload = multer({storage:storage});

connectToDb();

app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.set('view engine','ejs')


// app.get("/",async (req,res)=>{
//     const blogs=await Blog.find({});
//     if(blogs.length===0){
//         res.send("no blogs found");
//     }
//     res.render("home.ejs",{blogs})
// })

app.get("/home",async (req,res)=>{
    const blogs = await Blog.find() // always returns arrray 
    res.render("home.ejs",{blogs})
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
    res.render("./createblog.ejs")
})    

app.get("/blog/:id",async (req,res)=>{
    const id = req.params.id
    // console.log(id)
    const blog= await Blog.findById(id)
    // console.log(blog)
    res.render("blog.ejs",{blog})
})    

app.get("/deleteblog/:id"),async(req,res)=>{
    const id = req.params.id
    const remove=await Blog.findByIdAndDelete(id)
    res.redirect("/home")
}    

app.get("/editblog/:id",async(req,res)=>{

    // const id = req.params.id;
    // const blog=await Blog.findById(id);
    res.render("register.ejs")
})    

app.get("/register",(req,res)=>{
    res.render("register.ejs")
})    
  
app.post("/register" ,async (req,res)=>{
    const{username,email,password} = req.body;
    await User.create({
        username:username,
        email:email,
        password:bcrypt.hashSync(password,10),
 })
    res.redirect("/login")
})

app.get("/login",(req,res)=>{

    res.render("login.ejs")
})    

app.post("/login" ,async (req,res)=>{
    const{email,password} = req.body;
    const user=await User.find({email:email})
    if(user.length===0){
        res.send("Invalid email or password")
    }else{
        //check password
       const isMatched =  bcrypt.compareSync(password,user[0].password)
       if(!isMatched){
        res.send("Invalid password")
       }else{
        res.send("Logged in successfully")
       }
    }
})


// app.get("/about",(req,res)=>{
//     const contact = "Contactform"
//     res.render("about.ejs",{contact})
// })


app.post("/createblog",upload.single('image') ,async (req,res)=>{
    const fileName=req.file.filename;

    const{title,subtitle,description} = req.body;
    console.log(title,subtitle,description);
    // console.log(req.body);
   await Blog.create({
        title:title,
        subtitle:subtitle,
        description:description,
        image:fileName

    })
    res.send("Blog Created Successfully.")
})

app.use(express.static("./storage"))

app.listen(3000,()=>{
    console.log("Nodejs has started at port."+3000);
})
