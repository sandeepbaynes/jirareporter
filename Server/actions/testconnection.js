var axios = require('axios');
var config = require('config');

var jiraurl = config.get('jiraurl');
var jiraapiversion = config.get('jiraapiversion');

var action = {
    execute(res, session, testticket) {
        var config = {
            method: 'get',
            url: `${jiraurl}/rest/api/${jiraapiversion}/issue/${testticket}`,
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

        axios(config).then(response => {
            response.data.jirareportersuccess = true;
            res.send(response.data);
        }).catch(error => {
            res.statusCode = error.response.status;
            res.send('Unauthorized');
        });
    }
};

module.exports = action;