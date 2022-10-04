const express = require("express");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-abhinav:test123@cluster0.zw7nf0b.mongodb.net/postDB");

const aboutContent =
  "This  is a genral record keeping Website. Feel free to type record of anything you want. Made with ❤️ by Abhinav. If you have any problem regarding the website contact us!" ;
const contactContent =
  "Email: benimaru933gmail.com";

const postSchema = new mongoose.Schema({
  title: String,
  content: String
});
const Post = mongoose.model("Post", postSchema);

app.get("/", (req, res) => {
  Post.find({}, (err, foundPost) => {
    if (!err) {
      res.render("home", {
        posts: foundPost,
      });
    }
  });
});

app.get("/about", (req, res) => {
  res.render("about", { about: aboutContent });
});

app.get("/contact", (req, res) => {
  res.render("contact", { contact: contactContent });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.get("/posts/:post", (req, res) => {
  const getId =req.params.post;

  // console.log( typeof getId);

  Post.find({},(err, foundPost) => {
    if (!err) {
      foundPost.forEach((post) => {
        if (post._id.toString() === getId) {              // Coverting objectid to string with help of toString() method ( Its a mongodb built in method) 
          const postTitle = post.title;
          const postContent = post.content;

          res.render("post", {
            title: postTitle,
            content: postContent,
          });
        } else {
          console.log("Not matched");
        }
      });
    }else{
      console.log(err);
    }
  });
});

app.get("/posts/:post/edit", (req, res) => {
  const getId =req.params.post;

  Post.find((err, foundPost) => {
    if (!err) {
      foundPost.forEach((post) => {

        if (getId === post._id.toString()) {
          const postTitle = post.title;
          const postContent = post.content;
          const postId = post._id;

          res.render("edit", {
            title: postTitle,
            content: postContent,
            id: postId,
          });
        } else {
          console.log("Not matched");
        }
      });
    }
  });
});

app.post("/compose", (req, res) => {
  // check lodash for  more about kebabcase
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postContent,
    ktitle: _.kebabCase(req.body.postTitle),
  });
  post.save().then(() => {
    console.log("Saved successfully");
    res.redirect("/");
  });
});

app.post("/edit", (req, res) => {
  const postId = req.body.id;

  Post.updateOne(
    { postId },
    {
      title: req.body.postTitle,
      content: req.body.postContent,
    },
    (err) => {
      if (!err) {
        console.log("Updated successfully");
        res.redirect("/");
      }
    }
  );
});

app.post("/delete", (req, res) => {
  const id = req.body.id;

  console.log(id);

  Post.deleteOne({id} , (err) => {
    if (!err) {
      console.log("Successfully deleted!");
      res.redirect("/");
    }
    else{
      console.log(err);
    }
  });
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server has started successfully.");
});