const express = require("express");
const cors = require("cors");
const app = express();

//PORT SETUP
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

//API Endpoints
app.get("/", (req, res) => {
    res.send("Hello from simple jwt server");
});

//Listening to port
app.listen(port, () => {
    console.log("simple jwt server is listening to port", port);
});
