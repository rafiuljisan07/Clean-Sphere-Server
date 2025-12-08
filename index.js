const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.port || 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hgbitkj.mongodb.net/?appName=Cluster0`;
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
        const database = client.db('CleanSphereDB')
        const issuesCollection = database.collection('issues');
        const contributionsCollection = database.collection('contributions')

        app.post('/issues', async (req, res) => {
            const issue = req.body
            const result = await issuesCollection.insertOne(issue);
            res.send(result)
            console.log(issue);

        })

        app.get('/issues', async (req, res) => {
            const result = await issuesCollection.find().toArray();
            res.send(result)
        });

        app.get('/issues/:id', async (req, res) => {
            const { id } = req.params;
            const objectId = new ObjectId(id)
            const result = await issuesCollection.findOne({ _id: objectId })
            res.send(result)
        });

        app.get('/issues/category/:name', async (req, res) => {
            const category = req.params.name;
            const result = await issuesCollection.find({ category }).toArray();
            res.send(result)
        })

        app.get('/my-issues', async (req, res) => {
            const { email } = req.query;
            const query = { email: email };
            const result = await issuesCollection.find(query).toArray();
            res.send(result)
        });

        app.put('/update/:id', async (req, res) => {
            const data = req.body;
            const { id } = req.params;
            const query = { _id: new ObjectId(id) }

            const updatedIssue = {
                $set: data
            }
            const result = await issuesCollection.updateOne(query, updatedIssue);
            res.send(result)
        });

        app.delete('/delete/:id', async (req, res) => {
            const { id } = req.params;
            const query = { _id: new ObjectId(id) };
            const result = await issuesCollection.deleteOne(query);
            res.send(result)
        });

        app.post('/contributions', async (req, res) => {
            const contribution = req.body
            console.log(contribution);
            const result = await contributionsCollection.insertOne(contribution);
            res.send(result)

        })

        app.get('/my-contributions', async (req, res) => {
            const { email } = req.query;
            const query = { email: email };
            const result = await contributionsCollection.find(query).toArray();
            res.send(result)
        })





        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('server is running well (CleanSphere)')
});

app.listen(port, () => {
    console.log('server is running on port', port)
})