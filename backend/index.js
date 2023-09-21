const connectToMongo=require('./db');
const express = require('express')
var cors = require('cors')

connectToMongo();

const app = express()
const port = 5000

app.use(express.json()); // Without it, we cannot use req.body in the routes to fetch details from the request body.
app.use(cors());

// Available routes
app.use('/api/auth',require('./routes/auth'));
app.use('/api/notes',require('./routes/notes'));

app.listen(port, () => {
  console.log(`myNotes backend listening on http://localhost:${port}`)
})