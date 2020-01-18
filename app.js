const express = require('express')
const app = express()
const mongoClient = require('mongodb').MongoClient

const url = "mongodb://localhost:27017"

app.use(express.json())

mongoClient.connect(url, (err, db) => {

    if (err) {
        console.log("Error while connecting mongo client")
    } else {

        const myDb = db.db('shivam')
        const collection = myDb.collection('Register')
        const collection_complain = myDb.collection('complain')

        app.post('/signup', (req, res) => {

            const newUser = {
                name: req.body.name,
                contactNumber : req.body.contactNumber
               
            }

            const query = { contactNumber: newUser.contactNumber }

            collection.findOne(query, (err, result) => {

                if (result == null) {
                    collection.insertOne(newUser, (err, result) => {
                        res.status(200).send()
                    })
                } else {
                    res.status(400).send()
                }

            })

        })

        app.post('/registerComplain', (req, res,next) => {

            const newComplain = {
                address: req.body.address,
                longitude: req.body.longitude,
                latitude: req.body.latitude,
                road: req.body.road_name,
                description: req.body.description,
                image: req.body.image
            }

            console.log(newComplain)
            const query = { longitude: newComplain.longitude ,latitude : newComplain.latitude }

            collection_complain.findOne(query, (err, result) => {
                    
                if(err) throw err;
                if (result == null) {
                    collection.insertOne(newComplain, (err, result) => {
                        console.log(result);

                        res.send(JSON.stringify({"answer":"done"}));
                    })
                } else {
                    res.status(404).send();
                }

            })

        })

        app.post('/login', (req, res) => {

            const query = {
                contactNumber : req.body.contactNumber
            }

            collection.findOne(query, (err, result) => {

                if (result != null) {

                    const objToSend = {
                        name: result.name,
                        email: result.email
                    }

                    res.status(200).send(JSON.stringify(objToSend))
                    

                } else {
                    res.status(404).send()
                }

            })

        })

    }

})

app.listen(3000, () => {
    console.log("Listening on port 3000...")
})