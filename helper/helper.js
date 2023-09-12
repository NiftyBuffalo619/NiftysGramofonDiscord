const axios = require('axios');

const UpdatePlayingState = (name , iconUrl , artist , description) => {
    if (name === undefined || name === null &&
        iconUrl === undefined || iconUrl === null &&
        artist === undefined || artist === null &&
        description === undefined || description === null) {
            throw new Error("Non of the following values cannot be null or undefined");
        }

        new Promise((resolve, reject) => {
            axios.post(`http://localhost/api/addsong`, null,
            {
                auth: {
                    username: process.env.usernameDB,
                    password: process.env.passwordDB,
                },
                params: {
                    name: `${name}`,
                    iconUrl: `${iconUrl}`,
                    artist: `${artist}`,
                    description: `${description}`,
                }
            })
            .catch(error => {
                console.log(`Error ${error.stack}`);
                resolve();
             });
         });
};

module.exports = { UpdatePlayingState };