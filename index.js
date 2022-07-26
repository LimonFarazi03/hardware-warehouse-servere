const express = require('express')
const app = express()
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT|| 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.nkqd6.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try{
    await client.connect();
    const serviceCollection = client.db("assignment12").collection("services");
    const bookingCollection = client.db("assignment12").collection("booking");
    const reviewCollection = client.db("assignment12").collection("review");
    const userCollection = client.db("assignment12").collection("users");

    app.get('/users', async(req,res)=>{
      const query = req.body;
      const cursor = userCollection.find(query);
      const result = await cursor.toArray(cursor);
      res.send(result);
    });

    app.post('/users', async(req,res)=>{
      const query = req.body;
      const result = await userCollection.insertOne(query);
      res.send(result);
    });

    app.put("/user/:email", async (req, res) => {
      const email = req.params.email;
      const data = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          ...data,
        },
      };
      const result = await userCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send({success:true ,result});
    });

    app.get('/services', async(req,res)=>{
      const query = req.body;
      const cursor = serviceCollection.find(query);
      const result = await cursor.toArray(cursor);
      res.send(result);
    });

    app.get('/services/:id', async(req,res)=>{
      const id = req.params.id;
      const filter = {_id: ObjectId(id)};
      const result = await serviceCollection.findOne(filter);
      res.send(result);
    });

    app.post("/booking", async (req, res) => {
      const query = req.body;
      const result = await bookingCollection.insertOne(query);
      res.send(result);
    });

    app.delete("/booking/:id", async (req, res) => {
      const query = req.params.id;
      const filter = {_id: ObjectId(query)}
      const result = await bookingCollection.deleteOne(filter);
      res.send(result);
    });

    app.post("/review", async (req, res) => {
      const review = req.body;
      const query = {email: review.email}
      const exists = await reviewCollection.findOne(query)
      if(exists){
        return res.send({success: false, review:exists})
      };
      const result = await reviewCollection.insertOne(review);
      return res.send({success:true, result});
    });

    app.get("/review", async (req, res) => {
      const query = req.body;
      const result = await reviewCollection.find(query).toArray();
      res.send(result);
    });

    app.get('/myOrders', async (req,res)=>{
      const email = req.query.email;
      const query = {email: email};
      const result = await bookingCollection.find(query).toArray();
      res.send(result);
    });

  }
  finally{
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Assignment 12!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})