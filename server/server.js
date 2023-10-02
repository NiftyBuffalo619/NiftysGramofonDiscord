const express = require("express");
const path = require("path");
const colors = require('colors');
const basicAuth = require('basic-auth');
const uri = process.env.db_uri;
const bcrypt = require('bcrypt');
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.host,
  user: "gramofon",
  password: process.env.password,
  database: process.env.database
});
const ServerMode = {
  OPERATIONAL: "operational", // Fully operational mode
  LIMITED: "limited", // Some requests are temporarily restricted
  MAINTENANCE: "maintenance", // All requests are temporarily restricted except for status request
}

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.port || 80;
    this.song = new SongObject();
    this.paths = {
      //homepage: "/homepage",
    };
    this.status = ServerMode.OPERATIONAL;
    const ServerStatusMiddleware = (req , res , next) => {
        if (this.status === ServerMode.OPERATIONAL) {
          next();
        }
        else if (this.status === ServerMode.MAINTENANCE) {
          res.status(503).send("Service temporarily unavailable");
        }
    }
    this.app.get('/status', (req , res) => {
        res.json({"status": "online", "servermode": this.status, "inChannel": ""});
    });

    this.app.use(async(req , res , next) => {
      const credentials = basicAuth(req);

      if (!credentials) {
          res.status(401).send("No credentials specified Please make sure to specify them");
          return;
      }

      try {
        connection.connect((err) => {
            if (err) {
              console.log("Error while connecting to the database " + e.stack);
              return;
            }
            console.log("Successfully connected to the database");

            const sql = 'SELECT * FROM ?? WHERE username = ? AND password = ?';
            const values = ["Users" , credentials.name , credentials.pass];

            connection.query(sql , values, (err, results , fields) => {
                if (err) {
                  console.log("Error executing query: " + err.stack);
                  return;
                }
              
                if (results.length > 0) {
                  results.forEach(user => {
                    console.log(`[Server]: Successfully authenticated user ${user.username}`.cyan);
                  });
                  next();
                }
                else {
                  console.log(`[Server]: Unsuccessfull login bad credentials`.cyan);
                  res.status(401).send("Bad credentials");
                }
            });
        });
      }
      catch (err) {
          console.log(err);
      }
    });
    this.app.get('/', function(req , res , next) {
      res.send("OK");
    });
    this.app.get('/api', (req , res) => {
        res.send("API");
    });
    this.app.get('/api/song', ServerStatusMiddleware, (req , res) => {
        res.json({ iconUrl: this.song.iconUrl, name: this.song.name , artist: this.song.artist , description: this.song.description });
    });
    this.app.post('/api/addsong', (req , res) => {
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
    this.app.post('/adduser', (req , res) => {
      const credentials = basicAuth(req);
      const username = req.query.username;
      const password = req.query.password;
      const nickname = req.query.nickname;
      const iconUrl = req.query.iconUrl;
      if (req.query.username === undefined || req.query.password === undefined) {
        res.status(400).send("Bad Request Please provide all variables");
      }

      try {
        connection.connect((err) => {
            if (err) {
              console.log("Error while connecting to the database " + e.stack);
              return;
            }

            const sql = 'SELECT * FROM ?? WHERE username = ? AND password = ?';
            const values = ["Users" , credentials.name , credentials.pass];

            connection.query(sql , values, (err, results , fields) => {
                if (err) {
                  console.log("Error executing query: " + err.stack);
                  return;
                }
              
                if (results.length > 0) {
                  results.forEach(async user => {
                      if (user.isAdmin === 1) {
                          const [result] = await connection.query('INSERT INTO Users (username, password) VALUES (?, ?)', [req.query.username, req.query.password])
                          .catch(err => {
                            console.log(err.stack);
                          });
                          console.log("Successfully created a user");
                          res.status(200).send();
                      }
                      else {
                        res.status(403).send();
                      }
                  });
                }
                else {
                  console.log("User not found");
                  res.status(401).send("Bad credentials");
                }
            });
        });
      }
      catch (err) {
          console.log(err);
      }
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
          res.status(500).send("Internal Server Error");
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
      console.log(colors.green("API Server sucessfully started running on port: "), this.port);
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