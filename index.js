const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wqpwtor.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const toysCollection = client.db('toysDB').collection('toys');

    // get email spacip data 
    app.get('/toys', async(req, res) => {
      console.log(req.query);
       let query = {};
       if(req.query?.email){
        query = {email: req.query.email}
       }
      const result = await toysCollection.find(query).toArray();
      res.send(result);
    });

    // sent data toys mongoDB
    app.post('/toys', async(req, res) => {
      const toys = req.body;
      console.log(toys);
      const result = await toysCollection.insertOne(toys)
      res.send(result);
    });

    // update 
    app.patch('/toys/:id', async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true}
      const updateToys = req.body;
      const toys = {
        $set: {
          seller_name: updateToys.seller_name,
          email: updateToys.email,
          photo: updateToys.photo,
          toys_name: updateToys.toys_name,
          sub_category:updateToys.sub_category, 
          price: updateToys.price, 
          rating: updateToys.rating, 
          quantity: updateToys.quantity, 
          description: updateToys.description, 
          title: updateToys.title
        }
      }
      const result = await toysCollection.updateOne(filter, toys, options);
      res.send(result);
    })

    // get data mongoDB data 
    app.get('/toys', async(req, res)=> {
        const result = await toysCollection.find().toArray();
        res.send(result);
    });

    // delet data in mongodb
    app.delete('/toys/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await toysCollection.deleteOne(query);
      res.send(result);
    });

    // get spacip data get
    app.get('/toys/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id)};
      const result = await toysCollection.findOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('dickie toys is running');
});

// app.get('/toys', (req, res) => {
// res.send('toy is running')
// })

app.listen(port, () => {
    console.log(`Dickie server is running on port: ${port}`);
});
