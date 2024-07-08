const mongoose = require("mongoose")

async function connectToDb() {
    await mongoose.connect("mongodb+srv://4610poojarana:Aavya4610@cluster0.hwtwjxp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    console.log("Database Connect")
}

module.exports=connectToDb