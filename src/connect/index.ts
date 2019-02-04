
import CloudWatchLog from './CloudWatchLog';
import Contact from './Contact';

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

async function main(){
  if(process.argv.length != 5) {
    console.log("use: node index.js contactId dateStr isDebug");
    return;
  }


  const instanceName = 'trial-instance';
  const contactId = process.argv[2];
  const dateStr = process.argv[3];
  const isDebug = (process.argv[4]=='true') ? true : false;
  const groupName = '/aws/connect/' + instanceName;
  const filterPattern = contactId.replace(/-/g,' '); // フィルタに記号が使用できない

  const events = await getEvents(groupName , dateStr, filterPattern);
  const contact = new Contact(events);

  console.log(contact.print(isDebug));
}

main();
