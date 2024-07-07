const express = require("express")
const app = express()

app.get("/",(req,res)=>{
    res.send("<h1>hahaha,thi oih s iugijjg is homeppage</h1>")
    })

app.get("/about",(req,res)=>{
        const name = "Pooja Rana"
        const contact = "Contactform"
        res.render("about.ejs",{name},{contact})
})

// app.get("/about",(req,res)=>{
//     const contact = "Contactform"
//     res.render("about.ejs",{contact})
// })

app.listen(3000,()=>{
    console.log("Nodejs training.",3000)
})