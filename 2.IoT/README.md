<img src="https://companieslogo.com/img/orig/MDB_BIG-ad812c6c.png?t=1648915248" width="50%" title="Github_Logo"/> <br>


# MongoDB Atlas Tech Camp

### 2. IoT Use Case with MongoDB Atlas, Kinesis Data firehose, MongoDB Charts and Atlas Datalake

지역에 분포된 매장에 대한 환경 정보 (온도, 습도, 전력 사용, 효율)를 수집 하고 이에 대한 간단한 대시보드를 생성 하도록 합니다. 매장은 10분에 한번 데이터를 생성 하는 것으로 가정 하여 가상 데이터를 생성 합니다.  

Kinesis Data firehorse 로 IoT 데이터를 수집하여 Atlas 로 전달 하는 Pipeline을 구성하고 저장된 데이터를 활용 합니다.

<img src="/2.IoT/images/images00.png" width="90%" height="90%">   

Kinesis 는 IoT 이벤트를 수집하고 그 저장소로 MongoDB Cloud를 지정 합니다. MongoDB Cloud내에 Realm Application은 Https endpoint를 통하여 Hirehose로 부터 이벤트를 수신 합니다. 수신 된 데이터는 Realm Application의 Serverless 함수(Function)를 통해 가공된 후 MongoDB에 저장 됩니다.  
저장된 데이터를 Chart를 이용하여 시각화하여 데이터를 확인 합니다.

예상 시간 (40분)

#### MongoDB Atlas Realm Application 생성
Atlas의 Data Platform 서비스로 Serverless 형태의 서비스를 제공 합니다. IoT컬렉션에 데이터 생성을 위한 서비스를 제공 합니다. Atlas Console 에서 Realm 메뉴에서 Realm Application 을 추가 하여 줍니다.     
연결된 데이터 소스를 사용 하고 있는 데이터베이스 클러스터를 선택 하고 배포 모델을 Local 로 한 후 Singapore로 선택 하여 줍니다. (Realm Application은 선택한 MongoDB Cluster와 연결하여 Application 내의 서비스에서 직접 Query 수행이 가능합니다. 이전 Handson에서 진행한 API Gateway와 Lambda와 유사한 서비스로 MongoDB와 직접 연결이 되는 장점이 있습니다.)    


<img src="/2.IoT/images/images50.png" width="80%" height="80%">    

서비스 엔드포인트 생성을 위해 Https Endpoints 메뉴를 선택 하고 Add an endpoint 를 클릭 합니다.

<img src="/2.IoT/images/images06.png" width="90%" height="90%">    

Route 주소를 /myservice 로 입력 하고 Method 를 Post 를 선택 합니다. 
Function 항목에서 Select a function 을 클릭 하고 New Function 을 선택 한 후 작성된 Script 를 입력 하여 줍니다.
Function name 은 IoTFunc 하고 IoTfunc.js 의 내용을 복사하여 주고 저장 합니다.   

Function은 Lambda와 유사한 서비스로 Jaavascript형태로 실행 코드를 작성 합니다. IoTfunc은 다음과 같은 구성으로 메시지를 수신 받아 Base64 decode 후에 데이터를 IoT 컬렉션에 저장 합니다.   

`````
exports = function(payload, response) {
  
    const decodeBase64 = (s) => {
        var e={},i,b=0,c,x,l=0,a,r='',w=String.fromCharCode,L=s.length
        var A="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
        for(i=0;i<64;i++){e[A.charAt(i)]=i}
        for(x=0;x<L;x++){
            c=e[s.charAt(x)];b=(b<<6)+c;l+=6
            while(l>=8){((a=(b>>>(l-=8))&0xff)||(x<(L-2)))&&(r+=w(a))}
        }
        return r
    }
    const collection = context.services
    .get("mongodb-atlas")
    .db("techcamp")
    .collection("IoT");
 
    var fullDocument = JSON.parse(payload.body.text());
    
    const firehoseAccessKey = payload.headers["X-Amz-Firehose-Access-Key"];
    const KDFH_SECRET_KEY = "Aol7jmcDjYxLoruWMZprJHQPxHdCx7kvxLn5yvtOR3gdErza0fevfZWwLJygpu3H";
    console.log('should be: ' + context.values.get("KDFH_SECRET_KEY"));
 
   // Check shared secret is the same to validate Request source
   if (firehoseAccessKey == KDFH_SECRET_KEY) {
      
      fullDocument.records.forEach((record) => {
        
            const document = JSON.parse(decodeBase64(record.data))
            
            const status = collection.insertOne(document);
            console.log("got status: "+ status)
      })
      
      response.setStatusCode(200)
            const s = JSON.stringify({
                requestId: payload.headers['X-Amz-Firehose-Request-Id'][0],
                timestamp: (new Date()).getTime()
            })
            response.addHeader(
                "Content-Type",
                "application/json"
            );
            response.setBody(s)
            console.log("response JSON:" + s)
      return
   } else {
     console.log('ERROR');
 
    response.setStatusCode(500)
            response.setBody(JSON.stringify({
                requestId: payload.headers['X-Amz-Firehose-Request-Id'][0],
                timestamp: (new Date()).getTime(),
                errorMessage: "Error authenticating"
            }))
    return
   }
};

`````

저장 후에 실제 배포는 된 상태가 아니기 때문에 위쪽에 나오는 버튼 REVIEW DRAFT & DEPLOY 를 클릭하여 줍니다.

<img src="/2.IoT/images/images07.png" width="90%" height="90%">     

변경 내용을 보여주며 화면 하단에 Deploy 버튼을 클릭하여 완료 하여 줍니다.
<img src="/2.IoT/images/images08.png" width="80%" height="80%">     

생성한 Function 의 인증을 변경 하기 위해 Functions 에서 생성된 IoTfunc에서 Actions을 클릭 (Edit Function)합니다.    
<img src="/2.IoT/images/images09.png" width="80%" height="80%">

Settings를 선택 하고 Authentication 을 System 으로 선택 합니다. 저장 하고 배포를 진행 하여야 합니다.
<img src="/2.IoT/images/images10.png" width="80%" height="80%">


#### AWS Setting
AWS 에 로그인 후 Kinesis Data Firehose를 생성 합니다.
Source 는 Direct PUT 을 선택 하고 Destination 을 MongoDB Cloud 로 선택 합니다.
<img src="/2.IoT/images/images11.png" width="80%" height="80%">

API Key 는 다음 값을 입력 하여 줍니다.     

`````
Aol7jmcDjYxLoruWMZprJHQPxHdCx7kvxLn5yvtOR3gdErza0fevfZWwLJygpu3H
`````

MongoDB Realm webhook URL 은 Realm application 에서 Https Endpoints 에 생성한 서비스를 클릭 하여 Operation Type 에서 얻을 수 있습니다.    
<img src="/2.IoT/images/images12.png" width="90%" height="90%">     

백업 설정으로 실패한 데이터를 버킷으로 전송 하게 됩니다.    

#### Firehose 수행
Firehose 를 실행하여 데이터 생성을 확인 합니다.   
Data 는 다음 Json 메시지를 Base64로 encoding 하여 줍니다.    

`````
{"owner": "atlas-iot"}
`````

`````
techcamp % aws firehose put-record --delivery-stream-name PUT-MNG-ZBQH1 --record '{ "Data":"eyJvd25lciI6ICJhd3MtaW90In0="}'
{
    "RecordId": "4UhgZcPAvkZjBBOjAp+l3s8XCArwpNIBIyXmGzf5RwTPKVcC5JNThmGPq+AGHU9SiA63pEV8GJPBrXPZ1v1IhlWLhDvWW8w0KfofnIMY6QP/0z8/jsWjfGKKTRsSEnumTeCNeCv9J1X+Dg6WmXhZ0LHvS0bI+WNVlPalOGM1KLfmKhGdceuxMICU/JsG+j98LzM85Hd1hbK1pQN9xm6DtRyOy0hxk3TG",
    "Encrypted": false
}
`````
<img src="/2.IoT/images/images13.png" width="80%" height="80%">    

실제 이벤트 데이터를 생성 하여 넣어 줍니다. 
다양한 형태의 이벤트 데이터가 저장 가능하나 대시보드 생성을 위해 시간별 온도와 습도 데이터를 포함하여 데이터를 생성 하도록 합니다. 다음과 같이 메시지를 생성하고 Base64로 endcode 하여 줍니다.   

`````
{
  "Timestamp": {
    "$date": "2024-08-15T12:00:000Z"
  },
  "owner": "Joey",
  "shop" : "Seoul Shop1",
  "temperature": 40,
  "humidity" : 67,
  "pressure" : 90,
  "wind":10,
  "power": 240,
  "efficiency": 80,
  "location" : { "type":"Point", "coordinates":[37.5130,127.0598] },
}
`````

데이터 생성을 확인 하고 대시보드 작성을 위해 다음 방법으로 데이터를 생성하여 줍니다.    



#### Chart 생성하기
생성된 데이터로 부터 챠트를 생성 합니다. Atlas Console 로그인 후 Charts 를 클릭합니다
Charts 를 클릭 하고 Data Sources 메뉴를 선택 합니다. Add Data Source 버튼을 클릭 한 후 사용 중인 클러스터와 연결 합니다. Chart와 연결할 데이터 소스로 IoT를 선택 합니다.    
<img src="/2.IoT/images/images15.png" width="50%" height="50%">    


이후 Add Dashboard를 합니다.     
<img src="/2.IoT/images/images14.png" width="40%" height="40%">    

Add Chart 를 클릭 하고 Datasource aws.IoT 를 선택 합니다.     

<img src="/2.IoT/images/images16.png" width="70%" height="70%">

챠트 종류를 Circular 를 선택 하고 City 를 Label 항목으로 reg_num 을 Arc 항목으로 Drag & Drop 하여 줍니다.
<img src="/2.IoT/images/images17.png" width="70%" height="70%">

챠트를 저장 합니다.
   
