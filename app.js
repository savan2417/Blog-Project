require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const connecteDB = require("./connection");
const PORT = process.env.PORT || 3000;
const userRoutes = require("./Routes/userRoute");
const blogRoutes = require("./Routes/blogRoutes")
var cookieParser = require('cookie-parser');
const { checkForAuthenticationCookie } = require("./Middleware/auth");
const Blog = require("./Model/blogModel");



// connection
connecteDB(process.env.MONGO_URL).then( ()=> {console.log("Mongodb Connected")}).catch( (error)=> {console.log(error);})




// ejs
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser())
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")))


app.get("/", async(req, res)=> {
  try {
    const blogs = await Blog.find({});
     res.render("home", {
      user: req.user,
      blogs: blogs
     });
  } catch (error) {
    console.log(error);
    res.status(500).json({msg: "Internal Server Error"})
  }
})





// Routes
app.use(userRoutes)
app.use(blogRoutes)


app.listen(PORT, ()=> {
  console.log(`Server Started at Port: ${PORT}`);
})