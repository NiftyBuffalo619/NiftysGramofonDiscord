const express = require("express");
const path = require("path");
const colors = require('colors');
const basicAuth = require('basic-auth');
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.db_uri;

const client = new MongoClient(uri , {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  useNewUrlParser: true,
  useUnifiedTopology: true
});

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.port || 80;
    this.paths = {
      //homepage: "/homepage",
    };

    this.app.use(async(req , res , next) => {
      const credentials = basicAuth(req);

      if (!credentials) {
          res.status(401).send("Failed to authenticate");
          return;
      }

      try {
        await client.connect();
        const db = client.db("NiftyhoGramofon");
        const userCollection = db.collection("users");
        const query = { username: credentials.name , password: credentials.pass }
        console.log(query);
        //const user = await client.db("NiftyhoGramofon").collection("users").findOne({ username: "", password: "" });
        const user = db.collection('users')
        .find(
        {
          username: credentials.name,
        },
        {}).sort({});
        const password = db.collection('users').find(
          {
            password: credentials.pass,
          }
        ).sort({});

        if (user && password) {
          next();
        }
        else {
          console.log(`User ${credentials.name} not found`);
          res.status(401).send("User or password not found.");
        }
        console.log("Connected to the database");
      }
      catch (err) {
          console.log(err);
      }
      finally {
        client.close();
      }
    });
    this.app.get('/', function(req , res , next) {
      res.send("OK");
    });
    this.app.get('/api', (req , res) => {

    });
    //PUBLIC PATH 
    this.app.use(express.static(path.join(__dirname , '../server/public/')));

    // NOT FOUND PATH
    this.app.use((req , res , next) => {
      res.status(404);

      if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'public/404notfound.html'));
        return;
      }

      if (req.accepts('json')) {
        res.json({ error: 'Not found' });
        return;
      }

      res.type('txt').send('Not found');
      });

    // ERROR HANDLING 
    this.app.use((err , req , res , next) => {
        if (req.accepts('json')) {
          res.status(500);
        }
        else if (req.accepts('html')) {
          res.status(500).send(`There was an error on the server ${err}`);
        }
    });
  }
  

  middlewares() {

  }
  routes() {
   // this.app.use(this.paths.homepage, require("../routes/homepage"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(colors.green("Server sucessfully started running on port: "), this.port);
    });
  }
}

module.exports = Server;