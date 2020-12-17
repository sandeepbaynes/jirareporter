var axios = require('axios');
var config = require('config');

var jiraurl = config.get('jiraurl');
var jiraapiversion = config.get('jiraapiversion');

var getsprintinfo = async function (session, sprint) {
    var config = {
        method: 'get',
        url: `${jiraurl}/rest/agile/${jiraapiversion}/sprint/${sprint}`,
        headers: {}
    }
    if (session || session == '') {
        config.headers.Cookie = session;
        try {
            return await axios(config);
        }
        catch (error) {
            return 'unauthorized';
        }
    }
    else {
        return 'unauthorized';
    }
}

getagileboard = async function (session, board) {
    var config = {
        method: 'get',
        url: `${jiraurl}/rest/agile/${jiraapiversion}/board/${board}`,
        headers: {}
    }
    if (session && session != '') {
        config.headers.Cookie = session;
        try {
            return await axios(config);
        }
        catch (error) {
            return 'unauthorized session';
        }
    }
    else {
        return 'unauthorized';
    }
}

getsprintsboards = async function (session, sprints) {
    var boards = {};
    for (key in sprints) {
        var sprint = sprints[key];
        if (boards[sprint.originBoardId]) {
            sprint.boardname = boards[sprint.originBoardId];
        }
        else {
            var board = await getagileboard(session, sprint.originBoardId);
            sprint.boardname = board.data.name;
            boards[sprint.originBoardId] = board.data.name;
        }
    }
}

var action = {
    async execute(session, sprints) {
        var unauthflag = false;
        sprints = JSON.parse(sprints);
        sprintsdata = {};
        for (sprint of sprints) {
            var sprintsinfo = await getsprintinfo(session, sprint);
            if (sprintsinfo == 'unauthorized') {
                unauthflag = true;
                break;
            }
            sprintsdata[sprintsinfo.data.name] = sprintsinfo.data;
        }

        await getsprintsboards(session, sprintsdata);

        if (unauthflag) {
            return { jirareportersuccess: false };
        }

        return {
            jirareportersuccess: true,
            sprintsdata
        };
    }
};

module.exports = action;