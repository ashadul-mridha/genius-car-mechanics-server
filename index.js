const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const app = express()

const port = process.env.PORT || 5000
const cors = require('cors')

app.use(cors())
app.use( express.json())

//mongo db post
//bXVgyldjUvrG7eVm
//car_services

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.riphr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){

    try{
        await client.connect();

        const database = client.db("gCarService");
        const serviceCollection = database.collection("services");

        //add new service
        app.post('/addService', async (req , res) => {

            const service = req.body;
            
            const result = await serviceCollection.insertOne(req.body);
            console.log("service Hitted",service);
            res.send(result)

        })
        //get all services
        app.get('/services' , async (req , res) => {

            const result = await serviceCollection.find({}).toArray();
            res.send(result);
            console.log("Data fetch successfull", result);
        })

        //get single service
        app.get('/service/:id' , async (req , res) => {

            const id = req.params.id;
            console.log(id);
            const  query = {_id: ObjectId(id)};
            console.log(query);


            const result = await serviceCollection.findOne(query);
            res.send(result);
            console.log("Single Data fetch successfull", result);
        })

        //delete service

        app.delete('/service/:id', async ( req , res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await serviceCollection.deleteOne(query);
            res.send(result)

            console.log('Hitted Deleted', result);
        })

        //update data 

        app.put('/service/update/:id' , async (req , res) => {
            const id = req.params.id;
            const query = { _id : ObjectId(id) }
            const data = req.body
            const options = { upsert: true };
            const updateDoc = {
                $set : {
                    name : data.name,
                    desc : data.desc,
                    img : data.img,
                    price : data.price
                }
            }
            const result = await serviceCollection.updateOne(query , updateDoc , options)
            console.log('hitted update', id , query , updateDoc);
            res.send(result)
        })

    }
    finally{

    }

}

run().catch(console.dir);

app.get('/' , (req , res) => {
    res.send('Hello Bd People');
})

app.listen(port , () => {
    console.log('Ashadul Try Again You Can Do It');
})