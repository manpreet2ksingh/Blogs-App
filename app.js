var express     = require('express'),
    app         = express(),
    methodOverride=require("method-override"),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose');

    mongoose.connect('mongodb://localhost:27017/restfulBlogApp', {useNewUrlParser: true});
    app.use(express.static('public'));
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(methodOverride("_method"));

    var blogSchema = new mongoose.Schema({
        title:String,
        image:String,
        body:String,
        created:{type:Date,default:Date.now}
    });

    var Blog = mongoose.model("Blog",blogSchema);

   /* Blog.create({
        title:"Test",
        image:"https://images.pexels.com/photos/459225/pexels-photo-459225.jpeg?auto=format%2Ccompress&cs=tinysrgb&dpr=1&w=500",
        body :"Hey there,its an awesome blog on Nature."
    },function(err,blog){
        if(err)
        {
            console.log("error");
        }
        else{
            console.log(blog);
        }
    });*/


    app.get("/",function(req,res){
        res.redirect("/blogs");
    })

    app.get("/blogs/new",function(req,res){
        res.render("new.ejs");
    })

    app.get("/blogs",function(req,res){
        Blog.find({},function(err,blogs){
            if(err)
            {
                console.log("Error");
            }
            else
            {
                res.render("index.ejs",{blogs:blogs});
            }
        });
       
    });

    app.post("/blogs",function(req,res){
        Blog.create(req.body.blog,function(err,blog){
            if(err)
            {
                res.redirect("new.ejs");
            }
            else
            {
                res.redirect("/blogs");
            }
        });
    });

    app.get("/blogs/:id",function(req,res){
        Blog.findById(req.params.id,function(err,blog){
            if(err)
                res.redirect("/blogs");
            else
                res.render("show.ejs",{blog:blog});
        });
    });

    app.get("/blogs/:id/edit",function(req,res){
         Blog.findById(req.params.id,function(err,Editblog){
            if(err)
                res.redirect("/blogs");
            else
                res.render("edit.ejs",{blog:Editblog});
        });
    });

    app.put("/blogs/:id",function(req,res){
        Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
            if(err)
            {
                res.redirect("/blogs");
            }
            else{
                res.redirect("/blogs/"+req.params.id);
            }
        });
    });

    app.delete("/blogs/:id",function(req,res){
        Blog.findByIdAndRemove(req.params.id,function(err){
            if(err)
            res.redirect("/blogs");
            else
            res.redirect("/blogs");
        });
    });
    

    app.listen(3000,function(){
        console.log("Server has Started");
    }); 