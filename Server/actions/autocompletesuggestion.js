var axios = require('axios');
var config = require('config');

var jiraurl = config.get('jiraurl');
var jiraapiversion = config.get('jiraapiversion');

var action = {
    execute(res, session, fieldname, fieldvalue) {
        var config = {
            method: 'get',
            url: `${jiraurl}/rest/api/${jiraapiversion}/jql/autocompletedata/suggestions?fieldName=${fieldname}&fieldValue=${fieldvalue}`,
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
            var result = {
                jirareportersuccess: true
            }
            result.suggestions = response.data.results.map((suggestion) => {
                suggestion.displayName = suggestion.displayName.replace('<b>', '').replace('</b>', '');
                return { id: suggestion.value, displayname: suggestion.displayName }
            });
            res.send(result);
        }).catch(function (error) {
            res.statusCode = error.response.status;
            res.send('Unauthorized');
        });
    }
};

module.exports = action;