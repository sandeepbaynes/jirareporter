var axios = require('axios');
var config = require('config');

var jiraurl = config.get('jiraurl');
var jiraapiversion = config.get('jiraapiversion');

var action = {
    execute(res, session) {
        var config = {
            method: 'get',
            url: `${jiraurl}/rest/api/${jiraapiversion}/myself`,
            headers: {}
        };

        if (session && session != '') {
            config.headers.Cookie = session;
        }
        else {
            res.statusCode = 401;
            res.send('Unauthorized');
            return;
        }

        axios(config).then(function (response) {
            response.data.jirareportersuccess = true;
            res.send(response.data);
        }).catch(function (error) {
            res.statusCode = error.response.status;
            res.send('Unauthorized');
        });
    }
};

module.exports = action;