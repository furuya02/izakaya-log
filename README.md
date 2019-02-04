# izakaya-log
IVRで無人の予約受付を作ってみました　〜居酒屋の予約の場合〜　のログ集計



```
$ git clone https://github.com/furuya02/izakaya-log.git
$ cd izakaya-log
$ npm install
$ cd functions/connect
$ npm install
$ cd ../..
$ tsc
```

## Command Line

**$ node index.js contandId dateStr isDebug**

簡易出力
```
$ node index.js 5222daf1-53bd-4443-8c48-735a5f75e58b 2019/02/03/18 true
```
詳細出力

```
$ node index.js 5222daf1-53bd-4443-8c48-735a5f75e58b 2019/02/03/18 false
```

## Kinesis Firehorse

```
"handler": "Transform.handle",
```
