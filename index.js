const express = require("express")
const app = express()
const path = require("path")
const PORT = 8000
const UserRoutes = require("./routes/user")
const BlogRoutes = require("./routes/blog")
const mongoose = require("mongoose")
const Blogs = require("./models/blog")
const cookieParser = require("cookie-parser")
const { checkAuthenticationCookie } = require("./middleware/authentication")
require('dotenv').config()

mongoose.connect(process.env.MONGODB).then(resp=>console.log("mongo connected"))
app.use(express.urlencoded({ extended : false}))
app.use(express.json())


app.use(express.static(path.join(__dirname, "public")))

app.set("view engine", "ejs")
app.set("views", path.resolve("./views"))

app.use(cookieParser())
app.use(checkAuthenticationCookie("token"))

app.get("/", async (req, res)=>{
  const allBlogs = await Blogs.find({});
  res.render("home", {
    user : req.user,
    blogs : allBlogs
  })
})

app.use("/user", UserRoutes)
app.use("/blog", BlogRoutes)

app.listen(PORT,()=>{
    console.log('server is running')
})