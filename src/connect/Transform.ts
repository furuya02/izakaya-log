import { FirehoseTransformationEvent, FirehoseTransformationResultRecord } from "aws-lambda";
import CloudWatchLog from './CloudWatchLog';
import Contact from './Contact';
import AgentEvent from './AgentEvent';

const instanceName = 'trial-instance';
const groupName = '/aws/connect/' + instanceName;
const isDebug = true;

exports.handle = async (event : FirehoseTransformationEvent) => {

  console.log(JSON.stringify(event));
  let results:FirehoseTransformationResultRecord[] = [];

  for(var i=0; i < event.records.length; i++) {
    const record = event.records[i];

    let expoertData = '';

    const data = Buffer.from(record.data, 'base64').toString('utf8');
    let agentEvent = JSON.parse(data) as AgentEvent;

    if (agentEvent.InitiationMethod == "INBOUND") {

      const filterPattern = agentEvent.ContactId.replace(/-/g,' '); // フィルタに記号が使用できない
      const dateStr = createDateStr(agentEvent.InitiationTimestamp);

      const events = await getEvents(groupName , dateStr, filterPattern);
      const contact = new Contact(events);

      expoertData += "ContactId = " + agentEvent.ContactId + '\n';
      expoertData += 'Connect : ' + agentEvent.InitiationTimestamp + '\n';
      expoertData += 'Disconnet  : ' + agentEvent.DisconnectTimestamp + '\n';
      expoertData += '\n';
      expoertData +=  contact.print(isDebug);

      //console.log(expoertData)
    }
    results.push({
        recordId: record.recordId,
        result: 'Ok',
        data: Buffer.from(expoertData, 'utf8').toString('base64')
    });
  } 
  return {records: results}
};

// 対象期間のConnectのログ取得
async function getEvents(groupName: string , dateStr: string, filterPattern: string): Promise<AWS.CloudWatchLogs.FilteredLogEvent[]> {
  
  const cwl = new CloudWatchLog();

  let events: AWS.CloudWatchLogs.FilteredLogEvent[] = [];
  for (var i = 0;; i++) {
    let streamName = dateStr + '/stream-' + (i+1);
    try {
      const e = await cwl.get(groupName, streamName, filterPattern);
      if(e) {
        events = events.concat(e);
      }
    } catch (error) {
      break;
    }
  }
  return events;
}

function createDateStr(timeStamp: string): string {
  const dt = new Date(timeStamp);
  dt.setHours(dt.getHours() - 9); // Asia/Tokyo
  const year = dt.getFullYear();
  const month = ('00' + (dt.getMonth() + 1)).slice(-2);
  const day = ('00' + dt.getDate()).slice(-2);
  const hour = ('00' + dt.getHours()).slice(-2);
  return year + '/' + month + '/' + day + '/' + hour;
}

