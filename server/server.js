const express = require("express");
const path = require("path");
const colors = require('colors');
const basicAuth = require('basic-auth');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.port || 80;
    this.paths = {
      //homepage: "/homepage",
    };

    this.app.use((req , res , next) => {
      const credentials = basicAuth(req);

      if (!credentials || credentials.name !== "username" || credentials.pass !== "password") {
          res.status(401).send("Failed to authenticate");
          return;
      }

      next();
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