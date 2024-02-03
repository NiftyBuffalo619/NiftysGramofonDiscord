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

class Config {
    constructor() {
        this.config = null;
    }
    load() {
        return new Promise((resolve, reject) => {
            try {
                const config_file = fs.readFileSync("./config/config.yml", "utf-8");
                this.config = yaml.load(config_file);
                console.log("[CONFIG]".white + "Sucessfully loaded the config file".green);
                //return config;
                resolve(config);
            }
            catch (e) {
                console.log(`[CONFIG-ERROR]: An error occurred while loading the config file ${e.message}`.red);
                this.config = { app: { port: 80 }, ntfy: { allowed: false } };
                reject(e);
            }
        })
    }
    get(key) {
        if (!this.config) {
            console.log(`[CONFIG-ERROR]: Config file is null`.red);
        }
        const properties = key.split('.');

        // Traverse the nested properties
        let value = this.config;
        for (const prop of properties) {
            value = value[prop];
            if (value === undefined) {
                console.error(`[CONFIG] Property '${key}' not found.`);
                return null;
            }
        }

        return value;

        //return key ? this.config[key] : this.config;
    }
}

module.exports = Config;