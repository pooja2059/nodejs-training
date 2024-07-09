const express = require("express");
const connectToDb = require("./database/databaseConnect");
const Blog = require("./model/blogmodel.js");
const app = express();

const {multer,storage}=require('./middleware/multerConfig');
const upload = multer({storage:storage});

app.use(express.json());
app.use(express.urlencoded({extended:true}));

connectToDb();

app.use(express.static("./images"))
app.set('view engine','ejs')

app.get("/",async (req,res)=>{
    const blogs=await Blog.find()
    res.render("home.ejs",{blogs:blogs})
    })


app.get("/about",(req,res)=>{
        const name = "PooJa Rana"
        res.render("about.ejs",{name:name})
})

app.get("/contact",(req,res)=>{
    res.render("createblog.ejs")
})


app.get("/createblog",(req,res)=>{
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
        title:title,
        subtitle:subtitle,
        description:description,
        image:fileName

    })
    res.send("Blog Created Successfully.")
})


app.listen(3000,()=>{
    console.log("Nodejs has started at port."+3000);
})