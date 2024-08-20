<img src="https://companieslogo.com/img/orig/MDB_BIG-ad812c6c.png?t=1648915248" width="50%" title="Github_Logo"/> <br>


# MongoDB Atlas Tech Camp

### Provision

#### Atlas Account
MongoDB Atlas 의 무료 계정을 생성 합니다.     
Atlas는 관리형 데이터 베이스로 간편하게 데이터 베이스를 생성 하고 인터넷을 통한 엑세스로 편리하게 사용 할 수 있습니다.   

계정 생성을 위해 Atlas 사이트에 접속 합니다.   

https://www.mongodb.com/ko-kr/cloud/atlas/register

신용카드 입력 없이 계정을 생성 할 수 있습니다. 기존 계정을 가지고 있는 경우 2개의 Freetier 데이터베이스 클러스터까지 생성 가능 하며 Hands-on 과정도 Free-tier를 이용하게 됩니다.    

#### Database 생성
Atlas에 로그인 후 테스트용 데이터 베이스를 생성 합니다.    
로그인 후 Deployment 메뉴에 Database 를 클릭 합니다. 오른쪽 화면에 생성되어 진 데이터 베이스 정보를 볼 수 있으며 최초에는 데이터 베이스가 없음으로 Create를 클릭 하여 데이터베이스 클러스터를 생성 합니다.    

<img src="/0.Provision/images/images01.png" width="90%" height="90%">     
클러스터 사양을 선택 할 수 있으며 무료로 사용 할 수 있는 Shared를 선택 하고 Cloud Provider로 AWS를 선택 하고 지역은 Seoul을 선택 합니다.

<img src="/0.Provision/images/images02.png" width="90%" height="90%">     
Cluster Tier 는 M0 Sandbox 를 선택 합니다 (M2, M5는 추가 금액이 소요 됩니다.)    

<img src="/0.Provision/images/images03.png" width="90%" height="90%">  
Cluster Name을 입력 하고 Create Cluster를 클릭 하여 데이터 베이스를 생성합니다. (소요시간은 대략 10분이내가 소요 됩니다.)


#### Database Account 생성
Atlas 데이터베이스 클러스터를 접근하기 위한 계정 생성으로 Security 메뉴에 Database Access를 클릭 하여 계정을 생성 할 수 있습니다.    
Hands-on에서는 Id/password를 이용하는 방식의 데이터베이스 계정을 생성 합니다.   
<img src="/0.Provision/images/images08.png" width="90%" height="90%">  
계정은 atlas-account로 하여 생성 합니다. Built-in Role 은 편의상 Read and Write to any database 를 선택합니다.


#### Network Access 생성
데이터 베이스 접근 테스트를 위해서 접근 하려는 컴퓨터의 IP 주소를 방화벽에 허용 해 주어야 합니다.    
Security의 Network Access메뉴를 선택 합니다.
<img src="/0.Provision/images/images05.png" width="80%" height="80%">  
Add IP Address를 클릭하고 Add IP Access List Entry 에서 Add current IP Address를 클릭하하고 Confirm을 선택 합니다.   
방화벽 설정은 1분 가량의 시간이 소요 됩니다.


#### VPC Peering 설정 (Option)
MongoDB Provision이 되면 해당 Cluster 운영을 위한 VPC가 선택한 AWS 리전에 생성됩니다. 사용하고 있는 VPC와 직접적인 연결을 위해 VPC peering과 Private link가 지원 됩니다.   
단 해당 설정은 M0(Free tier)에서는 지원 되지 않음으로 비용이 발생 합니다.  
Peering을 설정하는 경우 Database접속이 Public network를 경유하지 않고 VPC간 연결되어 인터넷으로 데이터가 유출될 가능성이 줄어 듦니다. (MongoDB는 TLS가 적용된 네트워크를 사용하여 데이터 유출을 방지 합니다.)   
설정을 위해 Security의 Network Access메뉴에서 Peering을 선택 합니다.   
<img src="/0.Provision/images/images10.png" width="80%" height="80%">   

Cloud Provider로 AWS를 선택 하면 사용하고 있는 VPC의 정보를 입력이 필요 합니다.   

<img src="/0.Provision/images/images11.png" width="80%" height="80%">   

Account ID는 AWS console로그인 후 Account정보에서 얻을 수 있습니다.   
<img src="/0.Provision/images/images12.png" width="80%" height="80%">  

연결할 VPC의 ID와 CIDR정보를 입력 하여 줍니다.    
<img src="/0.Provision/images/images13.png" width="80%" height="80%">  

마지막으로 VPC가 구동되고 있는 Region을 선택 하여 줍니다. (Peering은 Inter region이 지원됩니다.)   
주의할 점은 Peering은 VPC간의 양방향 통신이기 때문에 CIDR주소가 중복이 않되어야 합니다. 서울 리전의 경우 MongoDB의 CIDR주소는 192.168.232.0/21로 생성됩니다. 만약 주소가 중복된다면 Private Link를 사용을 권고 합니다. Private Link는 MongoDB의 VPC내에 Load Balancer가 생성되어 접속되어 단방향 통신이 되어 중복에 무관 합니다.    
Intiate Peering을 클릭 합니다.  

<img src="/0.Provision/images/images15.png" width="90%" height="90%">  

AWS console내에 VPC에서 Peering Connection을 선택 하면 승인 대기 중인 Peering Connection 정보를 볼 수 있습니다. 이를 선택 후 Accept를 선택 합니다.  

<img src="/0.Provision/images/images16.png" width="80%" height="80%">  

이후 상태는 Accept 상태가 됩니다.   
(Accept 처리는 수분 소요 됩니다)

VPC내에 애플리케이션이 실행될 Subnet의 Routing Table을 선택 후 Route를 추가 하여 줍니다.  
<img src="/0.Provision/images/images17.png" width="70%" height="70%">  

Destination은 MongoDB의 CIDR주소(192.168.232.0/21)를 입력 하고 Target을 Peering으로 선택 하고 생성한 Peering을 선택 하고 저장 합니다.

테스트를 위해 EC2 instance를 해당 subnet에 생성하고 접속 테스트를 진행 합니다.   
Atlas Console에서 Connection을 클릭하여 접속 정보를 복사하고 앞단에 주소 (_mongodb._tcp.)를 추가하고 연결 테스트를 진행 합니다.   

````
$ dig srv _mongodb._tcp.<<Atlas Cluster Connection>>.mongodb.net
````

일반 Publics을 이용한 접속은 다음과 같이 나오게 됩니다. 
````
$ dig srv _mongodb._tcp.***.****.mongodb.net

; <<>> DiG 9.11.36-RedHat-9.11.36-14.el8_10 <<>> srv _mongodb._tcp.***.****.mongodb.net
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 53259
;; flags: qr rd ra; QUERY: 1, ANSWER: 3, AUTHORITY: 0, ADDITIONAL: 1

....

_mongodb._tcp.****.****.mongodb.net. 60 IN SRV 0 0 27017 ****-shard-00-00.****.mongodb.net.
_mongodb._tcp.****.****.mongodb.net. 60 IN SRV 0 0 27017 ****-shard-00-01.****.mongodb.net.
_mongodb._tcp.****.5qj****lg.mongodb.net. 60 IN SRV 0 0 27017 ****-shard-00-02.****.mongodb.net.

;; Query time: 5 msec
;; SERVER: 169.254.169.254#53(169.254.169.254)
;; WHEN: Sun Aug 18 16:19:09 GMT 2024
;; MSG SIZE  rcvd: 243

$ ping ****-shard-00-00.****.mongodb.net
PING ec2-13-125-****8.ap-northeast-2.compute.amazonaws.com (13.125.****) 56(84) bytes of data.
64 bytes from ec2-13-125-****.ap-northeast-2.compute.amazonaws.com (13.125.****): icmp_seq=1 ttl=239 time=2.91 ms
64 bytes from ec2-13-125-****.ap-northeast-2.compute.amazonaws.com (13.125.****): icmp_seq=2 ttl=239 time=2.93 ms
^C

````
접속을 위한 Query과 public 서버(169.254.169.254)에 된것을 볼 수 있으며 구성 서버에 Ping을 한 경우 외부 IP가 나오는 것을 볼수 있습니다.

Peering이 된 인스턴스에서 동일한 명령을 실행 하면 다음과 같습니다.    
````
$ dig srv _mongodb._tcp.***.***.mongodb.net

; <<>> DiG 9.18.28 <<>> srv _mongodb._tcp.***.***.mongodb.net
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 63102
;; flags: qr rd ra; QUERY: 1, ANSWER: 3, AUTHORITY: 0, ADDITIONAL: 1

...

;; ANSWER SECTION:
_mongodb._tcp.***.***.mongodb.net. 60 IN SRV 0 0 27017 ***-shard-00-00.***.mongodb.net.
_mongodb._tcp.***.***.mongodb.net. 60 IN SRV 0 0 27017 ***-shard-00-01.***.mongodb.net.
_mongodb._tcp.***.***.mongodb.net. 60 IN SRV 0 0 27017 ***-shard-00-02.***.mongodb.net.

;; Query time: 0 msec
;; SERVER: 10.0.0.2#53(10.0.0.2) (UDP)
;; WHEN: Sun Aug 18 16:18:33 UTC 2024
;; MSG SIZE  rcvd: 243

$ ping ***-shard-00-00.***.mongodb.net
PING ec2-13-125-***.ap-northeast-2.compute.amazonaws.com (192.168.233.223) 56(84) bytes of data.
64 bytes from ip-192-168-***.ap-northeast-2.compute.internal (192.168.233.223): icmp_seq=1 ttl=255 time=0.913 ms

````
Query가 내부 DNS에 된것을 볼 수 있으며 Ping으로 나오는 IP 정보 또한 내부 IP로 진행 되는 것을 볼 수 있습니다.   

참고 : Peering의 경우 Host 이름으로 상호 라우팅이 가능해야 하기 때문에 VPC의 DNS Hostnames와 DNS Resolution이 Enable이 되어야 합니다.  

VPC의 라우팅 테이블에 MongoDB의 CIDR 주소로 라우팅이 되도록 등록 하여 줍니다.   

등록이 완료 되면 Security 의 Network Access에 VPC 의 CIDR주소가 자동으로 등록되게 됩니다.   

Peering 연결은 비용이 발생 하기 때문에 반드시 실습 완료 이후 삭제 하여 줍니다.  
(Atlas Console에서 Security > Network Access > Peering에서 Peering 항목을 선택 하고 Terminate를 클릭 합니다.)
<img src="/0.Provision/images/images18.png" width="80%" height="80%">  

(삭제에 수분이 소요 됩니다.)    

AWS Console의 VPC에서 라우팅 테이블에 Peering으로 추가된 항목을 삭제 합니다.   

#### 기타 필요한 소프트웨어
클라이언트 애플리케이션 테스트를 위한 Nodejs 필요합니다.  

Nodejs : 
https://nodejs.org/en/download/


