const Blog = require("../Model/blogModel");
const Comment = require("../Model/comment");


function handleGetBlogForm(req, res){
  try {
    return res.render("addData", {
      user: req.user
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({msg: "Internal Server Error"}); 
  }
}

async function handleCreateBlog(req, res) {
  try {
    const body = req.body;

    let video = "";
    if (req.file) {
      video = req.file.path;
    }

    if (!body || !body.title || !body.blogerName || !body.body) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    await Blog.create({
      Title: body.title,
      BlogerName: body.blogerName,
      Body: body.body,
      CreatedBy: req.user._id,
      Video: video,  // Changed from Image to Video
    });

    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}


async function handleGetBlogBeforeEdit(req, res){
  try {
   const id = req.params.id;
   let findBlog =  await Blog.findById(id);

   if(!findBlog){
       return res.status(400).json({ msg: "Blog Not Found"});
   }

   return res.render("edit", {
       editdata: findBlog,
       user: req.user

   })
  } catch (error) {
   console.log(error);
   return res.status(500).json({ msg: "Internal Server Error"});
  }
}

async function handleEditTheBlog(req, res) {
  try {
    const id = req.params.id;
    const body = req.body;

    if (req.file) {
      let video = req.file.path;  // Changed from image to video

      await Blog.findByIdAndUpdate(id, {
        Title: body.title,
        BlogerName: body.blogerName,
        Body: body.body,
        Video: video  // Changed from Image to Video
      });
      console.log("Blog details Updated with Video");
      return res.redirect("/");
    } else {
      await Blog.findByIdAndUpdate(id, {
        Title: body.title,
        BlogerName: body.blogerName,
        Body: body.body,
      });
      console.log("Blog details Updated without Video");
      return res.redirect("/");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}


async function handleDeleteBlog(req, res){
  try {
      const id = req.params.id;
      await Blog.findByIdAndDelete(id);
      return res.redirect("/");
  } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Internal Server Error"});
  }
}

async function handleGetViewPage(req, res){
  try {
      const id = req.params.id;
      const blog = await Blog.findById(id).populate("CreatedBy");
      const comments = await Comment.find({blogId: req.params.id}).populate("CreatedBy")
    
    
      return res.render("view",{
          blog: blog,
          user: req.user,
          comments
      }) 
  } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Internal Server Error"});
  }
}

async function handleComment(req, res){
     await Comment.create({
      Content : req.body.content,
      blogId: req.params.blogId,
      CreatedBy: req.user._id
    })

    return res.redirect(`/view/${req.params.blogId}`)
}

module.exports = {
  handleCreateBlog,
  handleGetBlogForm,
  handleGetBlogBeforeEdit,
  handleEditTheBlog,
  handleDeleteBlog,
  handleGetViewPage,
  handleComment
}