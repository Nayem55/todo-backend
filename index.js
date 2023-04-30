const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

//middleware
app.use(cors());
app.use(express.json());

// todo-user
// hbSz5A98JoonCRGf

const uri =
  "mongodb+srv://todo-user:hbSz5A98JoonCRGf@cluster0.av29dvy.mongodb.net/test";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const todoCollection = client.db("todo").collection("todos");

    // Get todos
    app.get("/todos", async (req, res) => {
      const query = {email:req.query?.email};
      const result = await todoCollection.find(query).toArray();
      res.send(result);
    });
   
    // post todo
    app.post('/todos',async(req,res)=>{
      const todo = req.body;
      const result = await todoCollection.insertOne(todo);
      res.send(result);
    })

    // update todo
    app.put("/todos",async(req,res)=>{
      const editedProduct = req.body;
      const id = editedProduct._id;
      const filter = { _id :new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          task: editedProduct.task,
          date: editedProduct.date,
          startTime: editedProduct.startTime,
          endTime: editedProduct.endTime,
          priority:editedProduct.priority,
          status:editedProduct.status,
          email:editedProduct.email
        }
     };
     const result = await todoCollection.updateOne(filter, updatedDoc ,options);
     res.send(result)
      
    })

    // delete todo
    app.delete('/todos' , async(req,res)=>{
      const id = req.body._id;
      const query = {_id:new ObjectId(id)};
      console.log(query)
      const result = await todoCollection.deleteOne(query);
      res.send(result)
    })

  } finally {
  }
}
run().catch(console.log);

app.get("/", async (req, res) => {
  res.send("Server is runing");
});

app.listen(port, () => {
  console.log("Listening at port", port);
});
