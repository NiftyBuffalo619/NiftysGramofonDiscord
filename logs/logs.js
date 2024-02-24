const { google } = require("googleapis");

const LogMusicCommandUsage = async (username, iconUrl, CommandValue, Url, ChannelName) => {
    
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets"
    });

    const client = await auth.getClient();

    const googleSheets = google.sheets({ version: "v4", auth: client });


    const metaData = await googleSheets.spreadsheets.get({
        auth: auth,
        spreadsheetId: process.env.spreadSheetId,
    });

    const getRows = await googleSheets.spreadsheets.values.get({
        auth: auth,
        spreadsheetId: process.env.spreadSheetId,
        range: "PlaybackLog"
    });
    await googleSheets.spreadsheets.values.append({
        auth: auth,
        spreadsheetId: process.env.spreadSheetId,
        range: "PlaybackLog!A:E",
        valueInputOption: "USER_ENTERED",
        resource: {
            values: [
                [username, iconUrl, CommandValue, Url, ChannelName]
            ]
        }
    });

    //console.log(getRows.data);
}

const FullCommandLog = async (Date, username, iconUrl, CommandValue, Url, ChannelName) => {

}

module.exports = { LogMusicCommandUsage };