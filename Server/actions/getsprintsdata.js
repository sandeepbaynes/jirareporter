var getsprintsdinfoaction = require('./getsprintsinfo.js');
var getsprintsticketsaction = require('./getsprintstickets.js');

var action = {
    async execute(session, sprints) {
        var sprintsdata = {};
        //Get all sprint information
        var sprintinfo = await getsprintsdinfoaction.execute(session, sprints);
        if(!sprintinfo.jirareportersuccess) {
            return sprintinfo;
        }
        //Get all sprint tickets
        var sprinttickets = await getsprintsticketsaction.execute(session, sprintinfo.sprintsdata);
        if(!sprinttickets.jirareportersuccess) {
            return sprintinfo;
        }
        return sprintinfo;
    }
}

module.exports = action;