const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const jwt = require("jsonwebtoken");

//PORT SETUP
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

//Getting Token For user
app.post("/login", (req, res) => {
    const email = req.body;
    const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
    });
    res.send({
        success: true,
        accessToken,
    });
});

//MongoDB Config
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eykod.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

// API Endpoints
async function run() {
    try {
        await client.connect();
        console.log("Mongo connected");
        const productCollections = client.db("simple_JWT_DB").collection("products");

        //Find Products using Email
        app.get("/my-products", async (req, res) => {
            const addedBy = req.query?.addedBy;
            if (addedBy) {
                console.log(addedBy);
                const query = { addedBy };
                const cursor = productCollections.find(query);
                const myProducts = await cursor.toArray();
                res.send(myProducts);
            }
        });

        //Find All Products
        app.get("/products", async (req, res) => {
            const query = {};
            const cursor = productCollections.find(query);
            const products = await cursor.toArray();
            console.log(products);
            res.send(products);
        });
    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);

//API Endpoints
app.get("/", (req, res) => {
    res.send("Hello from simple jwt server");
});

//Listening to port
app.listen(port, () => {
    console.log("simple jwt server is listening to port", port);
});
