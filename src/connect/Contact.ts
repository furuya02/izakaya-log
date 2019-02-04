//************************************************
// Contactクラス
//************************************************
export default class Contact {
    private _dt: Date;
    private _contactId: string = '';
    private _modules : Module[] = [];
    
    constructor(events:AWS.CloudWatchLogs.OutputLogEvent[]){
        events.forEach( event => {
            this.append(event)
        })
    }

    print(isDebug: boolean){
        let message = '';
        this._modules.forEach( module  => {
            if(isDebug){
                message += module.debug('');
            } else {
                message += module.info('');
            }    
        });
        return message
    }

    getJson(isDebug: boolean) {
        let json = {date:"",modules:[{type:"",item:""}]};
        json.modules.pop();

        json.date = this._dt.toString();
        this._modules.forEach( module  => {
            let item;
            if(isDebug){
                item = module.debug('').replace('\n','');
            } else {
                item = module.info('').replace('\n','');
            }    
            json.modules.push({type:module.moduleType, item:item})
        });
        return json;
    }

    private append(event: AWS.CloudWatchLogs.OutputLogEvent): boolean {
        const e = JSON.parse(event.message as string) as ConnectLog;
        if(this._contactId == '') {
            this._contactId = e.ContactId;
            this._dt = new Date(Number(event.timestamp));
        } else {
            if(e.ContactId != this._contactId){
                return false;
            }
        }
        this._modules.push(this.createModule(e))
        return true;
    }

    private createModule(e: ConnectLog): Module {
        switch (e.ContactFlowModuleType) {
            case ModuleType.PlayPrompt:
                return new PlayPrompt(e);
            case ModuleType.GetUserInput:
                return new GetUserInput(e);
            case ModuleType.StoreUserInput:
                return new StoreUserInput(e);
            case ModuleType.Disconnect:
                return new Disconnect(e);
            case ModuleType.CheckAttribute:
                return new CheckAttribute(e);
            case ModuleType.SetAttributes:
                return new SetAttributes(e);
            case ModuleType.Transfer:
                return new Transfer(e);
            case ModuleType.InvokeExternalResource:
                return new InvokeExternalResource(e);

        }
        return new Module(e, e.ContactFlowModuleType);
    }
}

//************************************************
// Moduleクラス
//************************************************
class Module {
    protected _moduleType: ModuleType;
    protected _moduleName: string;
    protected _text: string = '';
    protected _results: string = '';
    protected _comparisonMethod :string = '';
    protected _secondValue : string = '';
    protected _value : string = '';
    protected _maxDigits: string = '';
    protected _timeout: string = '';
    protected _key: string = '';
    protected _contactFlowId: string = '';
    protected _functionArn: string = '';
    protected _parameters: {} = {};
    protected _externalResults: {} = {};

    constructor(log:ConnectLog, moduleName: string) {
        this._moduleType = log.ContactFlowModuleType as ModuleType;
        this._moduleName = moduleName;
        if (log.Results ) {
            this._results = log.Results;
        }
        if(log.ExternalResults){
            this._externalResults = log.ExternalResults;
        }
        if(log.Parameters) {
            if(log.Parameters.Text){
                this._text = log.Parameters.Text;
            }
            if(log.Parameters.ComparisonMethod){
                this._comparisonMethod = log.Parameters.ComparisonMethod;
            }
            if(log.Parameters.SecondValue){
                this._secondValue = log.Parameters.SecondValue;
            }
            if(log.Parameters.Value){
                this._value = log.Parameters.Value;
            }
            if(log.Parameters.MaxDigits){
                this._maxDigits = log.Parameters.MaxDigits;
            }
            if(log.Parameters.Timeout){
                this._timeout = log.Parameters.Timeout;
            }
            if(log.Parameters.Key){
                this._key = log.Parameters.Key;
            }
            if(log.Parameters.ContactFlowId){
                this._contactFlowId = log.Parameters.ContactFlowId;
            }

            if(log.Parameters.FunctionArn){
                this._functionArn = log.Parameters.FunctionArn;
            }
            if(log.Parameters.Parameters){
                this._parameters = log.Parameters.Parameters;
            }
        }
    }

    get moduleType(): ModuleType {
        return this._moduleType;
    }

    info(additional: string):string {
        let message = ''
        if (this._results != '') {
            message += '> ' + this._results + '\n';
        }
        if (this._text != '') { 
            let text = this._text
            text = this._text.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g,'');
            text = text.replace(/\r?\n/g, '');
            message += text;
        }
        if (additional) {
            message += additional;
        }
        message += '\n';
        return message;
    }

    debug(additional: string):string {
        let message = ''
        message += '----------------------------------\n';
        message += this._moduleName + '\n';
        if (this._results != '') {
            message += '> ' + this._results + '\n';
        }
        if (this._text != '') { 
            let text = this._text
            text = this._text.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g,'');
            text = text.replace(/\r?\n/g, '');
            message += text;
        }
        if (additional) {
            message += additional;
        }
        message += '\n';
        return message;
    }
}

class PlayPrompt　extends Module {
    constructor(log:ConnectLog){
        super(log, 'プロンプト再生');
    }

    info():string {
        return super.info('');
    }

    debug():string {
        return super.debug('');
    }
}


class StoreUserInput　extends Module {
    constructor(log:ConnectLog){
        super(log, '顧客入力の保存');
    }

    info():string {
        return super.info('');
    }

    debug():string {
        return super.debug('');
    }
}

class Disconnect　extends Module {
    constructor(log:ConnectLog){
        super(log, '切断');
    }
    info():string {
        return '';
    }

    debug():string {
        return super.debug('');
    }
}

class CheckAttribute　extends Module {
    constructor(log:ConnectLog){
        super(log, '属性の確認');
    }

    info():string {
        return '';
    }

    debug():string {
        let addtional = 'method=' + this._comparisonMethod + ' secondValue=' + this._secondValue +  ' value=' + this._value + '\n';
        return super.debug(addtional);
    }
}

class SetAttributes　extends Module {
    constructor(log:ConnectLog){
        super(log, '属性の保存');
    }

    info():string {
        return '';
    }

    debug():string {
        let addtional = 'key=' + this._key + ' value=' + this._value + '\n';
        return super.debug(addtional);
    }
}

class Transfer　extends Module {
    constructor(log:ConnectLog){
        super(log, 'フローへの転送');
    }
    
    info():string {
        return '';
    }

    debug():string {
        return super.debug(this._contactFlowId);
    }
}

class InvokeExternalResource　extends Module {
    constructor(log:ConnectLog){
        super(log, 'Lambda実行');
    }
    
    info():string {
        var result = this._externalResults as {Result:string, ErrorLog:string};
        if(result.Result == 'Error') {
            if(result.ErrorLog) {
                return "Lambda ERROR\n" + result.ErrorLog + '\n';
            }
        }
        return '';
    }

    debug(): string {
        let additional = 'functionArn=' + this._functionArn + '\n';
        additional += 'parameters=' + JSON.stringify(this._parameters, undefined, 4) + '\n';
        additional += 'externalResults=' + JSON.stringify(this._externalResults, undefined, 4) + '\n';
        return super.debug(additional);
    }

}

class GetUserInput extends Module {
    constructor(log:ConnectLog) {
        super(log, '顧客入力の保存')
    }
    info():string {
        return super.info('');
    }

    debug():string{
        let additional = '';
        if (this._maxDigits != '') {
            additional = 'max = ' + this._maxDigits + ' timeout = ' + this._timeout+ '\n';
        }
        return super.debug(additional);
    }
}

interface ConnectLog {
    "ContactId": string,
    "Timestamp": string,
    "Results": string,
    "ExternalResults": string,
    "Parameters": {
        "LoggingBehavior": string
        "Text": string
        "TextToSpeechType": string
        "MaxDigits": string
        "Timeout" :string
        "ComparisonMethod":string
        "SecondValue": string
        "Value": string
        "Key" :string
        "ContactFlowId" :string
        "FunctionArn" :string
        "Parameters" : {}
    },
    "ContactFlowId": string,
    "ContactFlowModuleType": string
}

//************************************************
// ModelType型の定義
// 文字列のリストからKey:Valueを作成する
//************************************************
function strEnum<T extends string>(o: Array<T>): {[K in T]: K} {
    return o.reduce((res, key) => {
        res[key] = key;
        return res;
    }, Object.create(null));
}
// Key:Value型の作成
const ModuleType = strEnum([
    'SetLoggingBehavior',
    'GetUserInput',
    'StoreUserInput',
    'SetVoice',
    'SetAttributes',
    'SetLoggingBehavior',
    'PlayPrompt',
    'CheckAttribute',
    'Transfer',
    'InvokeExternalResource',
    'Disconnect'
])
type ModuleType = keyof typeof ModuleType;

