var axios = require('axios');
var config = require('config');

var jiraurl = config.get('jiraurl');
var jiraapiversion = config.get('jiraapiversion');

var getsprinttickets = async function (session, board, sprint) {
    var config = {
        method: 'get',
        url: `${jiraurl}/rest/api/${jiraapiversion}/search/?jql=sprint="${sprint}" and issueFunction not in addedAfterSprintStart("${board}","${sprint}") and issueType not in (Sub-Task, "Test Execution", "TS Sub-Task")&expand=changelog`,
        headers: { Cookie: session }
    }
    return await axios(config);
}

var getticketsaddedaftersprintstart = async function (session, board, sprint) {
    var config = {
        method: 'get',
        url: `${jiraurl}/rest/api/${jiraapiversion}/search/?jql=sprint="${sprint}" and issueFunction in addedAfterSprintStart("${board}","${sprint}") and issueType not in (Sub-Task, "Test Execution", "TS Sub-Task")&expand=changelog`,
        headers: { Cookie: session }
    }
    return await axios(config);
}

var getticketsremovedaftersprintstart = async function (session, board, sprint) {
    var config = {
        method: 'get',
        url: `${jiraurl}/rest/api/${jiraapiversion}/search/?jql=issueFunction in removedAfterSprintStart("${board}","${sprint}") and issueType not in (Sub-Task, "Test Execution", "TS Sub-Task")&expand=changelog`,
        headers: { Cookie: session }
    }
    return await axios(config);
}

var filterticketsfields = function (issues, sprint) {
    //TODO: Get custom fields from a configuration file rather than hardcoded here.
    var activateddate = new Date(sprint.activatedDate);
    var completedate = new Date(sprint.completeDate);
    var startdate = new Date(sprint.startDate);
    var enddate = new Date(sprint.endDate);
    return issues.map(function (issue) {
        var retval = {
            id: issue.id,
            key: issue.key,
            issuelink: `${jiraurl}/browse/${issue.key}`,
            resolution: issue.fields.resolution ? issue.fields.resolution.name : null,
            resolutiondate: issue.fields.resolutiondate ? issue.fields.resolutiondate : null,
            status: issue.fields.status.name,
            statusatstartofsprint: null,
            labels: [],
            statusatendofsprint: null,
            issuetype: issue.fields.issuetype.name,
            issuetypeiconurl: issue.fields.issuetype.iconUrl,
            summary: issue.fields.summary,
            fixversion: issue.fields.fixversions,
            priority: issue.fields.priority.name,
            progress: issue.fields.progress,
            timespent: issue.fields.timespent,
            aggregateprogress: issue.fields.aggregateprogress,
            aggregatetimespent: issue.fields.aggregatetimespent,
            createddate: issue.fields.created,
            reporter: issue.fields.reporter.name,
            reporterdisplayname: issue.fields.reporter.displayname,
            storypoints: issue.fields.customfield_11462,
            storypointsatstartofsprint: null,
            storypointsatendofsprint: null,
            jobcode: issue.fields.customfield_10130,
            statushistory: [],
            timespent: {}
        }
        var historyassignee = '';
        var assigneeatstartofsprint = null, assigneeatendofsprint = null;
        for (var history of issue.changelog.histories) {
            var createdate = new Date(history.created);
            for (var item of history.items) {
                switch (item.field) {
                    case "assignee":
                        historyassignee = item['toString'];
                        if (createdate <= startdate && createdate <= activateddate) {
                            assigneeatstartofsprint = { value: "assignee", changedate: createdate, author: history.author.name, authordisplayname: history.author.displayName };
                        }
                        else if (createdate <= enddate || createdate <= completedate) {
                            if (!assigneeatstartofsprint) {
                                assigneeatstartofsprint = { value: "assignee", changedate: new Date(issue.fields.created), author: issue.fields.creator.name, authordisplayname: issue.fields.creator.displayName };
                            }
                            assigneeatendofsprint = assigneeatstartofsprint = { value: "assignee", changedate: createdate, author: history.author.name, authordisplayname: history.author.displayName, assigneeattime: historyassignee };
                            retval.statushistory.push(assigneeatendofsprint);
                        }
                        break;
                    case "status":
                        if (createdate <= startdate && createdate <= activateddate) {
                            retval.statusatstartofsprint = { value: item['toString'], changedate: createdate, author: history.author.name, authordisplayname: history.author.displayName };
                        }
                        else if (createdate <= enddate || createdate <= completedate) {
                            if (!retval.statusatstartofsprint) {
                                retval.statusatstartofsprint = { value: item['fromString'], changedate: new Date(issue.fields.created), author: issue.fields.creator.name, authordisplayname: issue.fields.creator.displayName };
                            }
                            retval.statusatendofsprint = statusatstartofsrpint = { value: item['toString'], changedate: createdate, author: history.author.name, authordisplayname: history.author.displayName, assigneeattime: historyassignee };
                            retval.statushistory.push(retval.statusatendofsprint);
                        }
                        break;
                    case "Story Points":
                        if (createdate <= startdate && createdate <= activateddate) {
                            retval.storypointsatstartofsprint = { value: !item['toString'] ? '' : item['toString'], changedate: createdate };
                        }
                        else if (createdate <= enddate || createdate <= completedate) {
                            if (!retval.storypointsatstartofsprint) {
                                retval.storypointsatstartofsprint = { value: !item['fromString'] ? '' : item['fromString'], changedate: new Date(issue.fields.created) }
                            }
                            retval.storypointsatendofsprint = { value: !item['toString'] ? '' : item['toString'], changedate: createdate };
                        }
                        break;
                    case "labels":
                        if (createdate <= enddate || createdate <= completedate) {
                            retval.labels = !item['toString'] ? [] : item['toString'].split(' ');
                        }
                        break;
                    case "timespent":   //This is supposed to come from issue.fields.worklog.worklogs[]. But Jira Rest API has an issue and so we need to take from history
                    //Advantage of taking from the worklog is that you get created, updated and started date. This will help get data even if logged after sprint ends
                    //Ref: https://community.atlassian.com/t5/Jira-Software-questions/JIRA-Server-7-4-REST-API-does-not-include-worklog-for-some/qaq-p/875383
                        if (((createdate >= startdate || createdate >= activateddate) && (createdate <= enddate || createdate <= completedate))) {
                            if (!retval.timespent[history.author.name])
                                retval.timespent[history.author.name] = {
                                    loggedbydisplayname: history.author.displayName,
                                    name: history.author.name,
                                    timeinseconds: 0
                                };
                            if (item.to != null)
                                retval.timespent[history.author.name].timeinseconds += (parseInt(item.to) - parseInt(item.from != null ? item.from : 0));
                        }
                        break;
                }
            }
        }
        if (!retval.statusatstartofsprint) {
            retval.statusatstartofsprint = { value: 'Open', changedate: new Date(issue.fields.created), author: issue.fields.creator.name, authordisplayname: issue.fields.creator.displayName };
        }
        if (!retval.statusatendofsprint) {
            retval.statusatendofsprint = {
                value: retval.statusatstartofsprint.value,
                author: retval.statusatstartofsprint.author,
                authordisplayname: retval.statusatstartofsprint.authordisplayname,
                changedate: completedate,
            };
        }
        retval.statushistory = [retval.statusatstartofsprint, ...retval.statushistory];
        if (!retval.storypointsatstartofsprint) {
            retval.storypointsatstartofsprint = { value: issue.fields.customfield_11462, changedate: new Date(issue.fields.created) };
        }
        if ((retval.issuetype == "Story" || retval.issuetype == "Change Request") && (retval.labels.indexOf("Scoped") < 0 && retval.labels.indexOf("scoped") < 0)) {
            retval.labels.push("NotScoped");
        }
        if (retval.labels.length == 0 &&
            !issue.changelog.histories.find(function (history) {
                return !!history.items.find(function (item) {
                    return item.field == "labels";
                });
            })) {
            retval.labels = issue.fields.labels;
        }
        return retval;
    });
}

var action = {
    async execute(session, sprints) {
        var jirareportersuccess = true;
        if (session && session != '') {
            try {
                for (var key in sprints) {
                    var sprint = sprints[key];
                    var sprinttickets = await getsprinttickets(session, sprint.boardname, sprint.name);
                    sprint.tickets = filterticketsfields(sprinttickets.data.issues, sprint);
                    var ticketsaddedaftersprintstart = await getticketsaddedaftersprintstart(session, sprint.boardname, sprint.name);
                    sprint.ticketsaddedaftersprintstart = filterticketsfields(ticketsaddedaftersprintstart.data.issues, sprint);
                    var ticketsremovedaftersprintstart = await getticketsremovedaftersprintstart(session, sprint.boardname, sprint.name);
                    sprint.ticketsremovedaftersprintstart = filterticketsfields(ticketsremovedaftersprintstart.data.issues, sprint);
                }
            }
            catch (error) {
                console.log(error);
                jirareportersuccess = false;
            }
            finally {
                return { jirareportersuccess };
            }
        }
    }
};

module.exports = action;