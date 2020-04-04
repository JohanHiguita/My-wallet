const http = require("http")
const fs = require("fs")

//create a server object:
http.createServer(onRequest).listen(8080) //the server object listens on port 8080

function onRequest(req, res) {
	res.writeHead(200, { "Content-Type": "text/html" })
	//res.write('Hello World!'); //write a response to the client
	fs.readFile("./index.html", null, function (error, data) {
		if (error) {
			res.writeHead(404)
			res.write("Whoops! File not found!")
		} else {
			res.write(data)
		}
		res.end()
	})
}
