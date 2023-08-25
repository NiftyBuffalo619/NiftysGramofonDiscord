const express = require("express");
const path = require("path");
const colors = require('colors');
const basicAuth = require('basic-auth');
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.db_uri;
const bcrypt = require('bcrypt');

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
    this.song = new SongObject();
    this.paths = {
      //homepage: "/homepage",
    };

    const comparePassword = (psw1 , psw2) => {
      if (psw1 === psw2)
        return true;
      else 
        return false;
    } 

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

        if (user) {
          //const passwordMatch = await bcrypt.compare(credentials.pass , user.password);
          console.log(`${credentials.pass} ${user.password}`);
          /*if (comparePassword(credentials.pass , user.password)) {
             next();
          }
          else {
            res.status(401).send("User or password not found.");
          }*/
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
        res.send("API");
    });
    this.app.get('/api/song', (req , res) => {
        res.json({ iconUrl: this.song.iconUrl, name: this.song.name , artist: this.song.artist , description: this.song.description });
    });
    this.app.post('/api/addsong', (req , res) => {
        console.log(`${req.query.name} ${req.query.iconUrl} ${req.query.artist} ${req.query.description} `);
        if (req.query.name === undefined || req.query.iconUrl === undefined || req.query.artist === undefined || req.query.description === undefined) {
          res.status(400).send("Bad Request Please provide all variables");
          return;
        }
        const name = req.query.name;
        const iconUrl = req.query.iconUrl;
        const artist = req.query.artist;
        const description = req.query.description;

        this.song = new SongObject(iconUrl , name , artist , description);
        res.status(200).send("200 OK");
    });
    //PUBLIC PATH 
    this.app.use(express.static(path.join(__dirname , '../server/public/')));

    // NOT FOUND PATH
    this.app.use((req , res , next) => {
      res.status(404).send("404 Not Found");
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
class SongObject {
  constructor(iconUrl , name , artist , description) {
      this.iconUrl = iconUrl;
      this.name = name;
      this.artist = artist;
      this.description = description;
  }
}

module.exports = Server;