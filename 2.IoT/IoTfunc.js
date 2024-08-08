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
    .db("aws")
    .collection("IoT");
 
    var fullDocument = JSON.parse(payload.body.text());
    
    const firehoseAccessKey = payload.headers["X-Amz-Firehose-Access-Key"];
    const KDFH_SECRET_KEY = "Aol7jmcDjYxLoruWMZprJHQPxHdCx7kvxLn5yvtOR3gdErza0fevfZWwLJygpu3H";
    console.log('should be: ' + context.values.get("KDFH_SECRET_KEY"));
 
   // Check shared secret is the same to validate Request source
   if (firehoseAccessKey == KDFH_SECRET_KEY) {
      
      fullDocument.records.forEach((record) => {
        
            const document = JSON.parse(decodeBase64(record.data))
            
 //console.log('Step2'+Buffer.from(record.data, "base64").toString('utf8'));
            //const document = JSON.parse(Buffer.from(record.data, "base64").toString('utf8'));
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
