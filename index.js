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
    const commentsCollection = db.collection('comments')
    const topCollection = db.collection('top-rated')
    const genreCollection = db.collection('top-genre')

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
      try {
        const data = req.body;

        // Add created_at field
        const bookData = {
          ...data,
          created_at: new Date().toISOString(), // timestamp
        };

        const result = await bookCollection.insertOne(bookData);

        res.send({
          success: true,
          message: "Book added successfully",
          result,
        });
      } catch (error) {
        console.error("Error adding book:", error);
        res.status(500).send({
          success: false,
          message: "Failed to add book",
        });
      }
    });

    // delete method
    app.delete('/books/:id', async (req, res) => {
      const { id } = req.params

      const result = await bookCollection.deleteOne({ _id: new ObjectId(id) })

      res.send({
        success: true,
        result
      })
    })

    // put method for edit
    app.put('/books/:id', async (req, res) => {
      const { id } = req.params
      const data = req.body
      console.log(id)
      console.log(data)
      const objectId = new ObjectId(id)
      const filter = { _id: objectId }
      const update = {
        $set: data
      }
      const result = await bookCollection.updateOne(filter, update)
      res.send({
        success: true,
        result
      })
    })

    // GET comments for a specific book
    app.get("/comments/:bookId", async (req, res) => {
      const { bookId } = req.params;
      try {
        const comments = await commentsCollection
          .find({ bookId: bookId })       // match bookId as string
          .sort({ createdAt: -1 })
          .toArray();
        res.send(comments);
      } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Failed to fetch comments" });
      }
    });

    // POST a new comment
    app.post("/comments", async (req, res) => {
      const { bookId, userId, userName, userPhoto, comment } = req.body;

      if (!bookId || !userId || !userName || !comment) {
        return res.status(400).send({ error: "Missing required fields" });
      }

      const newComment = {
        bookId,
        userId,
        userName,
        userPhoto: userPhoto || "",
        comment,
        createdAt: new Date()
      };

      try {
        const result = await commentsCollection.insertOne(newComment);
        res.send({ success: true, comment: newComment });
      } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Failed to post comment" });
      }
    });

    // DELETE /comments/:id
    app.delete('/comments/:id', async (req, res) => {
      const { id } = req.params;
      const userId = req.body.userId; // pass userId in request body to verify ownership

      try {
        const comment = await commentsCollection.findOne({ _id: new ObjectId(id) });

        if (!comment) return res.status(404).json({ message: "Comment not found" });

        if (comment.userId !== userId) {
          return res.status(403).json({ message: "You can only delete your own comments" });
        }

        await commentsCollection.deleteOne({ _id: new ObjectId(id) });
        res.json({ message: "Comment deleted" });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
      }
    });

    // Get top-rated books from top-rated collection
    app.get('/top-rated', async (req, res) => {
      try {
        const cursor = topCollection.find({});
        const result = await cursor.toArray();
        res.send(result);
      } catch (err) {
        console.error(err);
        res.status(500).send({ success: false, message: 'Failed to fetch top-rated books' });
      }
    });

    // Get top genres
    app.get('/top-genres', async (req, res) => {
      try {
        const genres = await genreCollection.find({}).toArray();
        res.send(genres);
      } catch (err) {
        console.error(err);
        res.status(500).send({ success: false, message: "Failed to fetch top genres" });
      }
    });



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