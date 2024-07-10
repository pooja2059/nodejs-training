const express = require("express");
const connectToDb = require("./database/databaseConnect");
const Blog = require("./model/blogmodel.js");
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

app.get("/",async (req,res)=>{
    const blogs = await Blog.find() // always returns arrray 
    res.render("home.ejs",{blogs})
})

app.get("/about",(req,res)=>{
        const name = "PooJa Rana"
        res.render("about.ejs",{name})
})

app.get("/createblog",(req,res)=>{
    res.render("createblog.ejs")
})

app.get("/blog/:id",async (req,res)=>{
    const id = req.params.id
    // console.log(id)
    const blog= await Blog.findById(id)
    // console.log(blog)
    res.render("./blog.ejs",{blog})
})

app.get("/deleteblog/:id"),async(req,res)=>{
    const id = req.params.id
    await Blog.findByIdAndDelete(id)
    res.redirect("/")
}

app.get("/editblog/:id",(req,res)=>{
    res.render("editblog.ejs")
})

app.get("/contact",(req,res)=>{
    res.render("createblog.ejs")
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
        title,
        subtitle,
        description,
        image:fileName

    })
    res.send("Blog Created Successfully.")
})

app.use(express.static("./storage"))

app.listen(3000,()=>{
    console.log("Nodejs has started at port."+3000);
})