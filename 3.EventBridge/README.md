<img src="https://companieslogo.com/img/orig/MDB_BIG-ad812c6c.png?t=1648915248" width="50%" title="Github_Logo"/> <br>


# MongoDB Atlas Tech Camp

### 3. EventBridge를 이용한 Event Trigger

IoT에서 진행한 이벤트를 수신하여 저장된 이벤트 처리 프로세스를 확장합니다.   
매장의 효율이 30% 이하로 떨어지는 경우 이에 감지하고 처리합니다. MongoDB는 효율이 30이하로 데이터가 들어오는 것을 감지 하고 이에 대한 처리를 위해 해당 메시지를 AWS Lambda서비스에 전달 합니다.    
전체 이벤트 프로세스는 MongoDB의 Trigger를 이용하여 데이터 저장시 효욜에 대한 부분을 체크하고 30이하로 저장된 경우 EventBridge를 호출하여 Event를 전달 합니다. AWS EventBridge서비스는 데이터를 수신받아 가상의 Lambda서비스를 호출 합니다.   


<img src="/3.EventBridge/images/images00.png" width="70%" height="70%">   

예상 시간 (20분)

#### MongoDB Atlas App Serivce Trigger
Atlas의 App Services 메뉴에서 생성한 App Service Application를 오픈 합니다.   
좌측 메뉴에 Trigger에서 새로운 Trigger를 생성 하여 줍니다.   
(RDBMS의 Trigger와 유사한 서비스로 컬렉션에 데이터 변경이 발생하면 Service가 기동됩니다.)    

<img src="/3.EventBridge/images/images01.png" width="90%" height="90%">   

Trigger type은 Database를 선택하고 이름을 입력 하여 주고 Watch Against를 Collection을 선택 하고 대상 클러스터와 데이터베이스 (techcamp), 컬렉션(IoT)를 선택 합니다.   
Operation Type은 Insert Docuemtn를 선택 합니다. techcamp.IoT 컬렉션에 데이터가 생성되는 경우 Trigger가 가동 됩니다.   

<img src="/3.EventBridge/images/images02.png" width="70%" height="70%">   

옵션으로 Full Document를 enable 하여 수신 메시지 전체를 Trigger로 전달 합니다.    

실제 Trigger로 실행될 서비스로 EventBridge를 선택 합니다.  
AWS 의 EventBridge 서비스가 생성되며 이를 위해 AWS Account ID을 입력하고 리전을 선택 합니다. (해당 리전에 EventBridge 서비스가 생성됩니다.)    

<img src="/3.EventBridge/images/images03.png" width="70%" height="70%">   

서비스에 오류가 발생하였을 때 실행될 Function을 지정하기 위해 New Function을 선택 하고 Function Name을 입력 하여 줍니다.   

<img src="/3.EventBridge/images/images04.png" width="80%" height="80%">   

Function Code는 자동 생성된 것을 그대로 사용 합니다.    
`````
{
    "fullDocument.efficiency": {
        "$lte": 30
    }
}
`````
<img src="/3.EventBridge/images/images05.png" width="90%" height="90%">   

이후 서비스를 저장 하고 배포 하여 줍니다.   

<img src="/3.EventBridge/images/images06.png" width="60%" height="60%">   

Deploy가 완료 되면 자동으로 AWS에 EventBridge가 생성되어 이를 추가로 설정하여야 합니다.   

#### AWS EventBridge

AWS 에 로그인 후 EventBridge서비를 오픈 한 후 Integration 메뉴에서 Partner event sources를 선택 합니다.   

<img src="/3.EventBridge/images/images07.png" width="90%" height="90%">   

Pending 상태로 서비스가 생성된 것을 확인 할 수 있으며 해당 서비스를 선택 후 Associate with event bus를 클릭 합니다.  

마지막으로 기본 옵션에서 Associate를 클릭 하여 줍니다.   
<img src="/3.EventBridge/images/images08.png" width="80%" height="80%">   

Event로 전달될 코드를 실행할 Lambda 서비스를 생성 합니다. 간단하게 Nodejs로 수신 메시지를 출력 하는 것으로 생성 합니다.  

`````
exports.handler = async (event, context) =>  {
  console.log('LogScheduledEvent');
    console.log('Received event:', JSON.stringify(event));
};
`````

<img src="/3.EventBridge/images/images09.png" width="80%" height="80%">   


Lambda서비스를 생성하고 배포한 후 EventBridge에서 해당 서비스를 호출하도록 합니다.   

EventBridge에서 Event bueses를 선택 합니다.   

Create event bus를 선택 후 이름과 설명을 입력 하여 줍니다.  

<img src="/3.EventBridge/images/images10.png" width="80%" height="80%">   

생성 완료 이후 Create rule을 클릭 하고 이름과 설명을 작성 합니다. 

<img src="/3.EventBridge/images/images11.png" width="80%" height="80%">   

Next를 클릭하고 event Pattern에서 event source를 eventbridge partners로 선택하고 Partner에서 MongoDB를 선택 합니다.   
Event Type을 All Events로 선택 하면 자동으로 Event Pattern이 작성 됩니다.    

<img src="/3.EventBridge/images/images12.png" width="80%" height="80%">   

Next버튼을 클릭 하면 마지막으로 전달할 대상 서비스를 선택 할 수 있습니다.  
<img src="/3.EventBridge/images/images13.png" width="80%" height="80%">   

이후 기본 값을 선택 하고 rule을 생성 하여 줍니다.

설정 완료된 EventBus를 선택 하고 Start discovery를 선택 합니다.

<img src="/3.EventBridge/images/images14.png" width="80%" height="80%">   


#### Firehose Event 생성
Firehose에서 효율이 낮은 상태로 메시지를 생성하여 전달 하여 봅니다. 

`````
{
  "timestamp": {
    "$date": "2024-09-05T01:30:00.000Z"
  },
  "owner": "Gildong",
  "shop" : "World Tower",
  "temperature": 35,
  "humidity" : 80,
  "power": 340,
  "efficiency": 25,
  "square": 500,
  "floor":2,
  "location" : { "type":"Point", "coordinates":[37.5130,127.0598] }
}

`````
`````
techcamp % aws firehose put-record --delivery-stream-name PUT-MNG-*** --record '{ "Data":"ewogICJ0aW1lc3RhbXAiOiB7CiAgICAiJGRhdGUiOiAiMjAyNC0wOS0wNVQwMTozMDowMC4wMDBaIgogIH0sCiAgIm93bmVyIjogIkdpbGRvbmciLAogICJzaG9wIiA6ICJXb3JsZCBUb3dlciIsCiAgInRlbXBlcmF0dXJlIjogMzUsCiAgImh1bWlkaXR5IiA6IDgwLAogICJwb3dlciI6IDM0MCwKICAiZWZmaWNpZW5jeSI6IDI1LAogICJzcXVhcmUiOiA1MDAsCiAgImZsb29yIjoyLAogICJsb2NhdGlvbiIgOiB7ICJ0eXBlIjoiUG9pbnQiLCAiY29vcmRpbmF0ZXMiOlszNy41MTMwLDEyNy4wNTk4XSB9Cn0="}'
{
    "RecordId": "CleOwQrpO24R67uhVJxNr/SsqLtL5dSGa6GoPWEZgC0TBBqso2nZiCjgoLIy07OJmQsiZOvMJvX7Z8JaIQz7IObTO3E0gYcJYsQn24vp16LEDSKFetuSKRMpC9SmK0CQNDUQhtRwqwyx+KgeBj49o52UMHKy9S7kLOkKrKWbnDnjiCkwZlZA1Orzzcny7VMoDp5DzlcEGwR4jxcdgBdvBVFBjN6C+Zrn",
    "Encrypted": false
}

`````

Logs 항목에 Endpoint를 통해 메시지를 수신한 것을 볼 수 있으며 Trigger가 작동된 것을 볼 수 있습니다.   

<img src="/3.EventBridge/images/images15.png" width="80%" height="80%">   

techcamp.IoT 컬렉션에 입력한 메시지가 정상적으로 등록 되며,    

<img src="/3.EventBridge/images/images16.png" width="80%" height="80%">   

생성한 Lambda 서비스의 로그를 확인하면 

<img src="/3.EventBridge/images/images17.png" width="80%" height="80%">   

데이터에서 특정 조건으로 Trigger를 이용하여 파악하고 AWS에 이벤트를 전달하여 다양한 서비스에서 활용 할 수 있습니다.