var axios = require('axios');
var config = require('config');

var jiraurl = config.get('jiraurl');
var jiraapiversion = config.get('jiraapiversion');

var action = {
    execute(res, authcreds, username) {
        var config = {
            method: 'get',
            url: `${jiraurl}/rest/api/${jiraapiversion}/user?username=${username}`,
            headers: {
                'Authorization': `Basic ${authcreds}`
            }
        };

        axios(config).then(function (response) {
            var jirasessioncookie = '';
            response.headers['set-cookie'].forEach(c => {
                var s = c.split(';');
                jirasessioncookie += `${s[0]}; `;
            });
            res.cookie('jirasession', jirasessioncookie);
            response.data.jirareportersuccess = true;
            res.send(response.data);
        }).catch(function (error) {
            res.statusCode = error.response.status;
            res.send('Unauthorized');
        });
    }
};

module.exports = action;