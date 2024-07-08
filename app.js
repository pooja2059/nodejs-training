const express = require("express")
const connectToDb = require("./database/databaseConnect")
const app = express()
const Blog = require("./model/blogmodel.js")

connectToDb()
app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.get("/",(req,res)=>{
    res.send("<h1>hahaha,thi oih s iugijjg is homeppage</h1>")
    })

app.get("/about",(req,res)=>{
        const name = "Pooja Rana"
        const contact = "Contactform"
        res.render("about.ejs",{name,contact})
})

app.get("/createblog",(req,res)=>{

   res.render("createblog.ejs")
})

// app.get("/about",(req,res)=>{
//     const contact = "Contactform"
//     res.render("about.ejs",{contact})
// })




app.post("/createblog", async(req,res)=>{
    const{title,subtitle,description} = req.body
    console.log(title,subtitle,description)
    // console.log(req.body);
   await Blog.create({
        title,
        subtitle,
        description

    })
    res.send("Post hitted")
})


app.listen(3000,()=>{
    console.log("Nodejs training.",3000)
})