<img src="https://companieslogo.com/img/orig/MDB_BIG-ad812c6c.png?t=1648915248" width="50%" title="Github_Logo"/> <br>


# MongoDB Atlas Tech Camp


### 1.CRUD and MQL with MongoDB Atlas, Lambda, API Gateway
AWS의 Serverless 환경을 이용하여 사용자 정보를 생성, 수정, 삭제 서비스를 구성합니다.
사용자 정보 관리로 사용자에 대한 기본 정보 및 전화 번호, 주소 정보, 취미를 관리 합니다.  
정규화된 테이블을 설계 하면 다음과 같은 형태가 됩니다. NoSQL을 이용하여 정규화된 내용을 하나의 Json문서로 관리 할 수 있는 Business Layer를 Serverless 형태로 구성합니다.   

<img src="/1.CRUD and MQL/images/image200.png" width="90%" height="90%">  

전체 시스템 아키텍쳐는 다음과 같습니다. Serverless 형태로 API를 구성하고 API gateway를 통해 외부 서비스에서 사용 할 수 있도록 서비스를 오픈 합니다.   

<img src="/1.CRUD and MQL/images/image00.png" width="90%" height="90%">     

사용자 정보(ssn 및 이름, 취미 등)를 저장하고 수정 조회 할 수 있는 REST API 서비스를 구성합니다. 

구성할 API는 다음과 같습니다.  
````
- 전체 사용자 정보를 조회 하는 API
- 사용자 정보를 생성 하는 API
- 사용자 정보를 수정 하는 API
- 사용자 정보를 삭제 하는 API
- 사용자의 취미를 추가 하는 API
- 사용자의 주소를 추가 하는 API
````

예상 시간 (40분)

### Severless

Serverless 형태로 Atlas에 접속 하고 MongoDB Query를 이용하여 데이터를 생성, 조회, 삭제를 테스트 합니다.

#### Lambda Setup

AWS Console에 로그인 후 Lambda function을 생성 하여 줍니다. 

<img src="/1.CRUD and MQL/images/image51.png" width="90%" height="90%">    

Function의 이름은 atlasFunction으로 하며 Runtime 은 Node.js를 선택 합니다. (Java, .NET 등 다양한 언어 드라이버가 제공 됩니다. 과정에서는 json 문서 관리가 편리한 Node.js를 이용합니다.)    

<img src="/1.CRUD and MQL/images/image52.png" width="90%" height="90%">    


#### Lambda VPC

데이터를 받아 MongoDB에 저장 하기 위한 미들웨어 레이어를 Serverless 형태로 구성합니다. 사용자 정보를 입력 받아 저장하고 수정 할 수 있는 서비스를 제공하도록 구성합니다.  
VPC를 구성하고 MongoDB와 Private 한 연결 구성을 한 경우 Lambda를 VPC에서 구동하도록 하여 Private 연결을 사용 할 수 있습니다. 이번 구성에서는 Public 환경을 사용 하도록 합니다.  

#### MongoDB Module Layer

MongoDB를 사용하기 위한 Module을 Lambda에 생성 해주어야 합니다.
첨부된 nodejs.zip을 사용 하거나 다음 방법으로 모듈 레이어를 생성 할 수 있습니다.  

Nodejs가 설치된 환경에서 nodejs 폴더를 생성하고 mongodb module을 npm을 이용하여 설치 하여 줍니다.

````
nodejs % npm init           
This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sensible defaults.

See `npm help init` for definitive documentation on these fields
and exactly what they do.

Use `npm install <pkg>` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
package name: (nodejs) 
version: (1.0.0) 
description: 
entry point: (index.js) 
test command: 
git repository: 
keywords: 
author: 
license: (ISC) 
About to write to nodejs/package.json:

{
  "name": "nodejs",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "description": ""
}


Is this OK? (yes) 

nodejs % npm install mongodb

added 12 packages, and audited 13 packages in 538ms

found 0 vulnerabilities

nodejs % 

````

해당 폴더를 zip으로 압축 하여 줍니다.
````
% zip -r nodejs.zip ./nodejs
````

Lambda 서비스에서 layer 리소스를 추가 하여 줍니다.

<img src="/1.CRUD and MQL/images/image100.png" width="90%" height="90%">     

이름은 mongodb로 하고 압축한 nodejs.zip 파일을 업로드 하여 줍니다. 아키텍쳐는 x86_64를 선택 하고 Runtime은 Node.js 20을 선택하여 줍니다. (필요한 경우 다른 버전을 사용하여도 무방합니다.)     

<img src="/1.CRUD and MQL/images/image101.png" width="90%" height="90%">    

레이어를 생성 하여 줍니다.

#### Lambda 생성

서비스를 제공할 Function을 생성하여 줍니다. 이름은 usersCRUD로 하여 생성 하여 주며 runtime은 Node.js 로 선택 하여 줍니다.   
Architecture는 편의상 x86_64를 선택 하고 VPC 환경에서 서비스를 제공이 필요한 경우 Advanced settings에서 enable VPC를 체크하여 VPC를 선택 하여 줍니다.   

<img src="/1.CRUD and MQL/images/image102.png" width="90%" height="90%">    

Layers를 클릭하여 생성한 mongodb 레이어를 추가 하여 줍니다.

<img src="/1.CRUD and MQL/images/image103.png" width="60%" height="60%">    

Layers 항목에서 Add a layer를 클릭하여 module를 추가 합니다. 별도로 생성하여준 module을 사용하기 때문에 custom을 선택하면 업로드한 module layer를 선택 할 수 있습니다.   

<img src="/1.CRUD and MQL/images/image104.png" width="90%" height="90%">    

환경 변수로 MongoDB 접속을 위한 정보를 추가 하여 줍니다. Configuration의 Environment variables에 MONGO_URL을 추가하여 줍니다. 

<img src="/1.CRUD and MQL/images/image105.png" width="90%" height="90%">    

value 항목은 MongoDB Atlas console에서 데이터베이스 클러스터에 connect를 클릭하면 접속 URL을 볼 수 있습니다.   

<img src="/1.CRUD and MQL/images/image106.png" width="90%" height="90%">  

Drivers 항목을 콜릭 하고 Node.js driver를 선택 하고 인증 방법을 Password를 선택하면 MongoDB를 접속하기 위한 URL정보가 보여 집니다. 

<img src="/1.CRUD and MQL/images/image107.png" width="60%" height="60%">   

URL을 복사하고 이를 환경 변수 값에 복사하여 줍니다. 복사후 생성하여준 데이터베이스 Account와 Password로 URL을 수정 하여 줍니다.  

제공되는 URL 정보는 다음과 같으며 URL에 데이터베이스 Account와 Password가 포함됩니다. 이를 생성한 Account와 Password로 수정하여 주어야 합니다.
````
mongodb+srv://<username>:<password>@mdbatlas.****.mongodb.net/?retryWrites=true&w=majority&appName=MDBAtlas
````

주의 : 비밀번호에 !@#$%&* 같은 특수 문자가 포함된 경우 URIEncoding을 하여야 합니다.  

index.js에 대한 코드를 생성 하여 줍니다.   

다음 코드는 nodejs에서 MongoDB와 연결을 생성하는 코드 입니다.

````
const MongoClient = require("mongodb").MongoClient;
const client = await MongoClient.connect(MONGODB_URI);

// Specify the database we want to use
const db = await client.db("techcamp");

// Open specify collection from database
const userCollection = db.collection("users");
````

환경변수로 부터 Mongodb 접속 주소를 얻어 온 후 Connection을 만들고 techsummit 데이터베이스에 users 컬렉션에 사용자 정보를 추가 하고 수정하는 서비스를 제공 합니다.   

event의 routkey를 기준으로 하여 CRUD를 제공 합니다.  (GET, POST, PUT, DELETE)

코드 블럭은 다음과 같이 routeKey에 따라 CRUD를 실행 합니다.   
특정 사용자는 ssn을 URI parameter로 받고 생성, 변경 정보는 Json 형태 데이터를 body로 받아 처리 합니다.  
기본 CRUD Query는 다음과 같습니다.

Insert Query
https://www.mongodb.com/ko-kr/docs/manual/reference/method/db.collection.insertOne/

Update Query
https://www.mongodb.com/ko-kr/docs/manual/reference/method/db.collection.updateOne/

Find Query
https://www.mongodb.com/ko-kr/docs/manual/reference/method/db.collection.find/

Delete Query
https://www.mongodb.com/ko-kr/docs/manual/reference/method/db.collection.deleteOne/


````
  try{
    switch (event.routeKey) {
      case 'GET /users':
        query = {};
        
        <<Find users Query>>

        break;
      case 'GET /users/{ssn}':
        params = event.pathParameters;
        query = {ssn: params.ssn};
        
        <<Find user Query with ssn>>
        
        break;
      case 'POST /users':
        reqBody = JSON.parse(event.body);
        
        <<Insert user>>
        
        break;
      case 'PUT /users/{ssn}':
        params = event.pathParameters;
        reqBody = JSON.parse(event.body);
        
        query = {ssn: params.ssn};
        
        <<Update user Query with ssn>>
        
        break;
      case 'DELETE /users/{ssn}':
        params = event.pathParameters;
        query = {ssn: params.ssn};
        
        <<Delete user Query with ssn>>
        
        statusCode=201;
        break;
      case 'POST /users/{ssn}/hobby':
        params = event.pathParameters;
        query = {ssn: params.ssn};
        reqBody = JSON.parse(event.body);
        
        <<Insert hobby Query with ssn>>

        break;
      case 'POST /users/{ssn}/address':
        params = event.pathParameters;
        query = {ssn: params.ssn};
        reqBody = JSON.parse(event.body);
        
        <<Insert Address Query with ssn>>
        
        break;
      default:
        throw new Error ('Unsupported route: ${event.routeKey}')
    }
  } catch(err) {
    console.log("Error happen")
    body = err.message;
    statusCode = 400;
  } finally {
    
  }
````  

전체 코드는 index.js에 있습니다. 해당 코드를 복사 하여 주고 deploy 하여 줍니다. lambda함수 내에 파일명이 index.mjs로 되어 있는 경우 index.js로 변경하여 줍니다.   

#### API Gateway 생성

API Gateway를 선택 후 Create API를 클릭 합니다.  
일반 HTTP API로 빌드 합니다.   

<img src="/1.CRUD and MQL/images/image108.png" width="80%" height="80%">   

Add Integration에서 Lambda를 선택 하고 생성한 Lambda 함수를 선택 하여 줍니다.  API 이름을 입력 하고 다음을 클릭 합니다.   

<img src="/1.CRUD and MQL/images/image109.png" width="80%" height="80%"> 

Route 경로를 다음과 같이 입력 하여 줍니다. Route는 사용자를 관리하는 서비스로 특정 사용자는 ssn으로 접근하도록 구성 합니다. 추가로 개인별 취미와 주소 정보를 추가 할 수 있는 POST 서비스를 제공 합니다.   

전체 사용자를 리턴하는 GET 서비스 : /users    
특정 사용자를 리턴하는 GET 서비스 : /users/{ssn}    
사용자를 추가하는 POST 서비스 : /users    
특정 사용자를 수정하는 PUT 서비스 : /users/{ssn}    
특정 사용자를 삭제하는 DELETE 서비스 : /users/{ssn}    
특정 사용자의 주소 정보를 추가하는 POST 서비스 : /users/{ssn}/address    
특정 사용자의 취미 정보를 추가하는 POST 서비스 : /users/{ssn}/hobby    

<img src="/1.CRUD and MQL/images/image110.png" width="80%" height="80%"> 

이후 기본값으로 하여 설정을 완료 하고 생성 합니다.   

<img src="/1.CRUD and MQL/images/image111.png" width="80%" height="80%"> 

Lambda 함수에서 Trigger 분에 API Gateway가 생성된 것을 확인 하고 4개의 API 주소가 등록 되어 있는지 확인 합니다.  

<img src="/1.CRUD and MQL/images/image112.png" width="90%" height="90%"> 

#### API Gateway을 호출

##### Insert User
신규 사용자를 생성하는 API를 호출 합니다. 
POST로 다음 메시지를 Body로 하여 전달 합니다. 
메시지 형태는 다양한 형태로 변경이 가능하나 ssn은 조회 용도로 설정되어 있음으로 넣어 주어야 이후 API호출이 가능합니다. ssn에 별도로 Unique 설정이 않되어 있음으로 중복으로 생성이 가능합니다.

````
{
      ssn:"123-456-0001", 
      email:"user@email.com", 
      name:"Gildong Hong", 
      DateOfBirth: "1st Jan.", 
      Hobbies:["Martial arts"],
      Addresses:[{"Address Name":"Work","Street":"431, Teheran-ro GangNam-gu ","City":"Seoul", "Zip":"06159"}], 
      Phones:[{"type":"mobile","number":"010-5555-1234"}]
}
````

CURL을 이용한 호출

````
curl --location 'https://***.execute-api.ap-northeast-2.amazonaws.com/users' \
--header 'Content-Type: application/json' \
--data-raw '{
        "ssn":"123-456-0001", 
        "email":"user@email.com", 
        "name":"Gildong Hong", 
        "DateOfBirth": "1st Jan.", 
        "Hobbies":["Martial arts"],
        "Addresses":[{"Address Name":"Work","Street":"431, Teheran-ro GangNam-gu ","City":"Seoul", "Zip":"06159"}], 
        "Phones":[{"type":"mobile","number":"010-5555-1234"}]
  }'
````

##### Get Users
전체 사용자를 조회합니다.   
해당 Query는 조건없이 조회 하기 때문에 데이터가 많은 경우 대량의 데이터가 리턴 됩니다. 실 환경에서는 필요한 데이터 만은 조회 하거나 페이징을 처리한 조회를 권장 합니다.   

````
curl --location 'https://*****.execute-api.ap-northeast-2.amazonaws.com/users' \
--header 'Content-Type: application/json'
````
앞서 생성한 데이터를 그대로 응답하는 것을 볼 수 있습니다.  

````
{"_id":"66b62767f0c43b60b8ad4acd","ssn":"123-456-0001","email":"user@email.com","name":"Gildong Hong","DateOfBirth":"1st Jan.","Hobbies":["Martial arts"],"Addresses":[{"Address Name":"Work","Street":"431, Teheran-ro GangNam-gu ","City":"Seoul","Zip":"06159"}],"Phones":[{"type":"mobile","number":"010-5555-1234"}]}

````

##### Get User
특정 사용자를 조회 하여 봅니다. 기존 생성한 사용자의 ssn을 이용합니다.   
최적화 된 조회를 하기 위해서는 index를 생성 하는 것을 권장합니다. 조회 조건인 ssn에 index를 생성하면 전체 데이터를 스캔하지 않고 index를 이용하여 필요한 데이터 만을 스캔하여 더욱 빠르게 데이터 조회가 가능 합니다. 실 환경에서는 반드시 index를 생성하는 것을 권장 합니다.   


````
curl --location 'https://*****.execute-api.ap-northeast-2.amazonaws.com/users/123-456-0001' \
--header 'Content-Type: application/json'
````

ssn으로 검색한 사용자를 조회하여 결과를 반환합니다.

````
{"_id":"66b62767f0c43b60b8ad4acd","ssn":"123-456-0001","email":"user@email.com","name":"Gildong Hong","DateOfBirth":"1st Jan.","Hobbies":["Martial arts"],"Addresses":[{"Address Name":"Work","Street":"431, Teheran-ro GangNam-gu ","City":"Seoul","Zip":"06159"}],"Phones":[{"type":"mobile","number":"010-5555-1234"}]}

````

##### Update Users
사용자의 이메일을 수정을 해봅니다. 나이를 추가 하여 봅니다.  데이터는 수정할 부분을 Body로 전달 하는 형태로 API를 호출 합니다.    
변경 데이터는 기존 항목에 update 형태로 동작하며 존재 하지 않는 값의 경우는 추가 됩니다. 

````
curl --location --request PUT 'https://***.execute-api.ap-northeast-2.amazonaws.com/users/123-456-0001' \
--header 'Content-Type: application/json' \
--data-raw '{
        "email":"Gildong@email.com",
        "age":100
  }'
````
Get User를 다시 호출 하여 보면 email이 변경 되고 age가 추가 된 것을 볼 수 있습니다. Nosql은 schema에 자유롭기 때문에 별도의 작업 없이 schema를 변경 할 수 있습니다.

##### Add Hobby
기존 사용자 정보의 취미 부분은 "Martial arts"가 있습니다. 취미로 "Reading"을 추가하여 봅니다. 

````
curl --location --request POST 'https://***.execute-api.ap-northeast-2.amazonaws.com/users/123-456-0001/hobby' \
--header 'Content-Type: application/json' \
--data '{
        "hobby":"Reading"
  }'
````

Get User를 호출 하여 보면 Hobby에 "Reading"이 추가 된 것을 볼 수 있습니다.  

````
...
Hobbies: ["Martial Arts", "Reading"],
...
````
추가한 값은 배열 형태로 저장된 것을 볼 수 있으며 순서 index를 이용하여 개별 데이터를 변경하거나 삭제 하는 것이 가능합니다.   

##### Add Address
기존 사용자 정보의 주소를 하나 추가 하여 봅니다. 

````
curl --location --request POST 'https://****.execute-api.ap-northeast-2.amazonaws.com/users/123-456-0001/address' \
--header 'Content-Type: application/json' \
--data '{"Address Name":"Home",
"Street":"Yuldo Kuk","City":"Jeju","Zip":"99999"}'
````

Get User를 호출 하여 보면 주소 부분에 입력한 주소가 추가된 것을 볼 수 있습니다.

##### Delete User
생성한 사용자를 삭제 합니다. 

````
curl --location --request DELETE 'https://*****.execute-api.ap-northeast-2.amazonaws.com/users/123-456-0001' \
--header 'Content-Type: application/json'
````

생성했던 사용자를 삭제되어 조회 되지 않는 것을 볼 수 있습니다.
