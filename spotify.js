const express = require('express');
const app = express();
const port = 8080;

// Application requests authorization, user logs in + authorizes access

app.get('/', (req, res) => {
	console.log(req.query)
})

app.listen(port)