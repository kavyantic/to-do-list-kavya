
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://rahulkavya9610:painter05@cluster0.afuye.mongodb.net/todolistDB",{useNewUrlParser:true,useUnifiedTopology: true})


const itemSchema = {
  name:{
  type:String,
  requird:true
  }
}

const pageListSchema = {
  name:String ,
  items:[itemSchema]
}

const Item = mongoose.model("Item",itemSchema)
const List = mongoose.model("List",pageListSchema)


const kivi = new Item({
  name:"Kivi"
})

const apple = new Item({
  name:"Apple"
})

const banana = new Item({
  name:"Banana"
})

defaultItem =[kivi,apple,banana]

// const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];
items = []


function say(err,dialog){
  if(err){
    console.log(err);
  }
  else{
    console.log(dialog);
  }
}

app.get("/", function(req, res) {

    Item.find(function(err,items){
        if(items.length ===0){
            Item.insertMany(defaultItem,function(err){
                if(err){
                  console.log(err);
                }
                else{
                  console.log("inserted default items to the todolistDB");

                }
            })
        }
        else{
          res.render("list", {listTitle: "Today", newListItems: items});
        }
    })
});



app.post("/", function(req, res){

    const item = req.body.newItem;
    const title = req.body.list;

    if (title === "Today") {

      itemDB = new Item({name:item})
      Item.insertMany([itemDB],function(err){console.log(err);})
      res.redirect("/");

    } else {

          const itemDB = new Item({
            name:item
          })

          List.findOne({name:title},function(err,itemDocument){
            if(!err){
                itemDocument.items.push(itemDB)
                itemDocument.save()
                res.redirect('/'+title)
            }
          })
    }
});

app.post("/delete",function(req,res){

  const checkBoxItem_ID = req.body.checkbox1;
  const listTitle  = req.body.list;
  console.log(req.body);

  if (listTitle === "Today") {

    Item.deleteOne({_id:checkBoxItem_ID} , function(err){console.log(err);})
    res.redirect("/");

  } else {

      List.findOneAndUpdate({name:listTitle},{$pull:{items:{_id:checkBoxItem_ID}}},function(err,doc){
        say(err,"updated succesfully")
        res.redirect('/'+listTitle)
      })
  }



})


app.get('/:customListName',function(req,res){
  page = req.params.customListName;
  List.findOne({name:page},function(err,Document){

    if(err){console.log(err);}

    else{
      if(!Document){
        const list = new List({
          name:page,
          items:defaultItem
        })
        list.save()
        res.redirect('/'+page)
      }
      else{
          res.render("list",{listTitle: Document.name, newListItems: Document.items})
      }

    }
  })


})



app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
