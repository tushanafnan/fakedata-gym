const express = require("express");
const cors = require("cors");
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = "mongodb+srv://tushanafnan:Tushan123@cluster0.lr4x6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("Service").collection("data");
  console.log("Hitting the database by Tushan");});

  async function run () {
    try {
        await client.connect ();
        const database = client.db('Service');
        const productCollection = database.collection('data');
        const orderCollection = database.collection('orders');


        app.get('/products', async (req,res)=> {
            const cursor = productCollection.find ({});
            const products = await cursor.toArray();
            res.send(products);
        });
        app.get('/orders', async (req,res)=> {
            
            const cursor = orderCollection.find ({});
            const orders = await cursor.toArray();
            res.send(orders);
        });

        
        //POST API

        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result);
        })

        app.get("/myBookings/:email", async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            console.log(query);
            const result = await orderCollection.find(query).toArray();
            res.json(result);
          });


          app.get("/manageAllBookings", async (req, res) => {
            const cursor = orderCollection.find({});
            const result = await cursor.toArray();
            res.json(result);
          });
       
       
        app.delete('/deleteBooking/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
       
            res.json(result);
          });
      
       
          app.post("/addPackage", async (req, res) => {
            const resort = req.body;
            const result = await productCollection.insertOne(resort);
            res.json(result);
          });

          app.get("/allPackage", async (req, res) => {
            const cursor = productCollection.find({});
            const package = await cursor.toArray();
            res.json(package);
          });
      
          app.put("/approveBooking/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const Booking = {
              $set: {
                status: "Approved",
              },
            };
            const result = await orderCollection.updateOne(query, Booking);
            res.json(result);
          });
      

    }
    finally {
        //client.close ();
    }
}
run().catch(console.dir);


app.get("/", (req, res)=> {
    res.send(" <b> Backend Server for TourBD </b>");
});

app.listen(port,()=> {
    console.log("Running Server on port", port);
});

