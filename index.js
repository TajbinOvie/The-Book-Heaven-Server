const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 3000;

app.use(cors())
app.use(express.json())



const uri = "mongodb+srv://SimpleDBuser:l1umvj9IOI2nkGz2@pumpkin-pie.42xr14b.mongodb.net/?appName=Pumpkin-Pie";

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

    await client.connect();

    const db = client.db('Book-Heaven')
    const bookCollection = db.collection('Books')

    // for getting all books
    // app.get('/books', async (req, res) => {
    //   const result = await bookCollection.find().toArray()
    //   res.send(result)
    // })

    app.get('/latest-books', async (req, res) => {
      const cursor = bookCollection.find().sort({ created_at: -1 }).limit(6);
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/books/:id', async (req, res) => {
      const { id } = req.params
      console.log(id)
      const result = await bookCollection.findOne({ _id: new ObjectId(id) })
      res.send({
        success: true,
        result
      })
    })

    // users books and all books 
    app.get('/books', async (req, res) => {
      const email = req.query.email
      const query = {}
      if (email) {
        query.userEmail = email;
      }
      const cursor = bookCollection.find(query);
      const result = await cursor.toArray();
      res.send(result)
    })

    // post method
    app.post('/books', async (req, res) => {
      const data = req.body
      console.log(data)
      const result = await bookCollection.insertOne(data)
      res.send(result)
    })

    // delete method
    app.delete('/books/:id', async (req, res) => {
      const {id} = req.params

      const result = await bookCollection.deleteOne({_id: new ObjectId(id)})

      res.send({
        success: true,
        result
      })
    })

    // put method for edit
    app.put('/books/:id', async(req, res) => {
      const {id} = req.params
      const data = req.body
      console.log(id)
      console.log(data)
      const objectId = new ObjectId(id)
      const filter = {_id: objectId}
      const update = {
        $set: data
      }
      const result = await bookCollection.updateOne(filter, update)
      res.send({
        success: true,
        result
      })
    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})