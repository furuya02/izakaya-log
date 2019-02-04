import AWS = require("aws-sdk");

export default class CloudWatchLog {

    private _cwl = new AWS.CloudWatchLogs({region:'ap-northeast-1'});

    async get(groupName: string, streamName: string, filterPattern: string): Promise<AWS.CloudWatchLogs.FilteredLogEvent[]|undefined> {
        const params = {
            logGroupName: groupName,
            logStreamNames: [
                streamName
            ],
            filterPattern: filterPattern,
        }
        const data =  await this._cwl.filterLogEvents(params).promise();
        return data.events;
    }
}
