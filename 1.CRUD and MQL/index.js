// Import the MongoDB driver
const MongoClient = require("mongodb").MongoClient;

// Define the connection string which we can get using the Connect button on the cluster in MongoDB Atlas GUI.
const MONGODB_URI = process.env.MONGO_URL;

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  // Connect to our MongoDB database hosted on MongoDB Atlas
  const client = await MongoClient.connect(MONGODB_URI);

  // Specify the database we want to use
  const db = await client.db("techsummit");

  cachedDb = db;
  return db;
}

exports.handler = async (event, context) => {

  /* By default, the callback waits until the runtime event loop is empty before freezing the process and returning the results to the caller. Setting this property to false requests that AWS Lambda freeze the process soon after the callback is invoked, even if there are events in the event loop. AWS Lambda will freeze the process, any state data, and the events in the event loop. Any remaining events in the event loop are processed when the Lambda function is next invoked, if AWS Lambda chooses to use the frozen process. */
  context.callbackWaitsForEmptyEventLoop = false;

  // Get an instance of our database
  const db = await connectToDatabase();
  const userCollection = db.collection("users");
  
  
  const headers = {'Content-Type':'appliation/json'};
  let results;
  let query = {};
  let statusCode =200;
  let body = '';
  let params='';
  let reqBody = {};
  
  
  console.log("Route:"+event.routeKey);
  try{
    switch (event.routeKey) {
      case 'GET /users':
        query = {};
        
        results = await userCollection.find(query).toArray();
        
        if (results.length > 0) {
            results.forEach((result, i) => {
                body += JSON.stringify(result);
            });
        } else {
            body = JSON.stringify({});
        }
        
        statusCode=200;
        break;
      case 'GET /users/{ssn}':
        params = event.pathParameters;
        query = {ssn: params.ssn};
        
        results = await userCollection.find(query).toArray();
        
        if (results.length > 0) {
            results.forEach((result, i) => {
                body += JSON.stringify(result);
            });
        } else {
            body = JSON.stringify({});
        }
        
        statusCode=200;
        break;
      case 'POST /users':
        reqBody = JSON.parse(event.body);
        
        results = await userCollection.insertOne(reqBody);
        
        body = await JSON.stringify({insertedId:results.insertedId});
        
        statusCode=201;
        
        break;
      case 'PUT /users/{ssn}':
        params = event.pathParameters;
        reqBody = JSON.parse(event.body);
        
        query = {ssn: params.ssn};
        results = await userCollection.updateOne(query, {$set:reqBody});
        
        
        body = await JSON.stringify({modifiedCount:results.modifiedCount});
        
        statusCode=201;
        
        break;
      case 'DELETE /users/{ssn}':
        params = event.pathParameters;
        query = {ssn: params.ssn};
        
        results = await userCollection.deleteOne(query);
        
        body = await JSON.stringify({deletedCount:results.deletedCount});
        
        statusCode=201;
        break;
      case 'POST /users/{ssn}/hobby':
        params = event.pathParameters;
        query = {ssn: params.ssn};
        reqBody = JSON.parse(event.body);
        
        results = await userCollection.updateOne(query, {$push:{Hobbies:reqBody.hobby}});
        
        body = await JSON.stringify({modifiedCount:results.modifiedCount});
        
        statusCode=201;
        break;
      case 'POST /users/{ssn}/address':
        params = event.pathParameters;
        query = {ssn: params.ssn};
        reqBody = JSON.parse(event.body);
        
        results = await userCollection.updateOne(query, {$push: {Addresses:reqBody}});
        
        body = await JSON.stringify({modifiedCount:results.modifiedCount});
        
        statusCode=201;
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
  
  return { statusCode: statusCode, body: body, headers: headers};
  
};