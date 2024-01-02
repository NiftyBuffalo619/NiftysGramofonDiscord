const fs = require('fs');
const yaml = require('js-yaml');
var colors = require('colors');

var config;
const LoadConfig = async () => {
    return new Promise((resolve, reject) => {
        try {
            const config_file = yaml.load(fs.readFileSync("./config/config.yml", "utf-8"));
            config = config_file;
            console.log("[CONFIG]".white + "Sucessfully loaded the config file".green);
            //return config;
            resolve(config);
        }
        catch (e) {
            console.log(`[CONFIG-ERROR]: An error occurred while loading the config file ${e.message}`.red);
            config = {app: {port: 80}, ntfy: {allowed: false}}
            reject(e);
        }
    })
}

module.exports = { LoadConfig };