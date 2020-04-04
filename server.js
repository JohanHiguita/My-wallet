const http = require("http")
const fs = require("fs")
const express = require("express")
const app = express()
const path = require('path');

app.use(express.static("public"))

app.get("/", function (req, res) {
	res.sendFile(path.join(__dirname+'/index.html'));
})

app.listen(8080, function () {
	console.log("Listening on port 8080")
})

