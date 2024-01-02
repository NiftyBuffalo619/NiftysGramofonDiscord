const axios = require("axios");
var colors = require('colors');
const config = require("../config/config");
var ntfy_allowed = "";
var server_address = "";
var topic = "";
var configuration = config.LoadConfig().then((configfile) => {
    ntfy_allowed = configfile.ntfy.allowed;
    server_address = configfile.ntfy.url;
    topic = configfile.ntfy.topic;
});
const notifyCustom = () => {

}

const isNtfyAllowed = () => {
    if (ntfy_allowed) {
        return true;
    }
}

const notifyStartup = async () => {
    try {
        if (!isNtfyAllowed()) return;
        const encodedTitle = Buffer.from(`NiftyhoGramofon`, 'utf-8').toString('base64');
        const headers = {
            "Title": `=?UTF-8?B?${encodedTitle}?=`,
            "Priority": "3",
            "icon": "",
            "tags": ["tada"],
            "markdown": true,
        };
        axios.post(`${server_address}/niftyhogramofon`, `Úspěšně spuštěn`, { headers });
    }
    catch (err) {
        console.log(`[SERVER-NOTIFICATIONS]: There was an error while sending notification ${err.message}`.red);
    }
}
const notifyPlaybackYT = async ({title: title, description: description, channel: channel}) => {
    try {
        if (!isNtfyAllowed()) return;
        const encodedTitle = Buffer.from(`NiftyhoGramofon`, 'utf-8').toString('base64');
        const headers = {
            "Title": `=?UTF-8?B?${encodedTitle}?=`,
            "Priority": "3",
            "icon": "",
            "tags": ["tada"],
            "markdown": true,
        };
        axios.post(`${server_address}/niftyhogramofon`, `Přehrávání **${title}** ve ${channel}`, { headers });
    }
    catch (err) {
        console.log(`[SERVER-NOTIFICATIONS]: There was an error while sending notification ${err.message}`.red);
    }
}
const notifyPlaybackYTStop = async ({title: title}) => {
    try {
        if (!isNtfyAllowed()) return;
        const encodedTitle = Buffer.from(`NiftyhoGramofon`, 'utf-8').toString('base64');
        const headers = {
            "Title": `=?UTF-8?B?${encodedTitle}?=`,
            "Priority": "3",
            "icon": "",
            "tags": ["tada"],
            "markdown": true,
        };
        axios.post(`${server_address}/niftyhogramofon`, `Přehrávání **${title}** bylo pozastaveno`, { headers });
    }
    catch (err) {
        console.log(`[SERVER-NOTIFICATIONS]: There was an error while sending notification ${err.message}`.red);
    }
}

const notifyRadioPlayback = async ({title: title}) => {
    try {
        if (!isNtfyAllowed()) return;
        const encodedTitle = Buffer.from(`NiftyhoGramofon`, 'utf-8').toString('base64');
        const headers = {
            "Title": `=?UTF-8?B?${encodedTitle}?=`,
            "Priority": "3",
            "icon": "",
            "tags": ["radio", "control_knobs"],
            "markdown": true,
        };
        axios.post(`${server_address}/niftyhogramofon`, `Spuštěno radio **${title}** `, { headers });
    }
    catch (err) {
        console.log(`[SERVER-NOTIFICATIONS]: There was an error while sending notification ${err.message}`.red);
    }
}

module.exports = { notifyStartup , notifyPlaybackYT , notifyPlaybackYTStop , notifyRadioPlayback };