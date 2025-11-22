const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://CleanSphereDB:r6b6rfuwdxXQwiiz@cluster0.hgbitkj.mongodb.net/?appName=Cluster0";
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
    const db = client.db('CleanSphereDB')
    const issuesCollection = db.collection('issues')



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('server is running well (CleanSphere)')
});

app.listen(port, () => {
    console.log('server is running on port', port)
})