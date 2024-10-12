const express = require('express');
const axios = require('axios');
const readline = require('readline');
const multer = require('multer');
const cors = require('cors');
const app = express();
const dgram = require('dgram');
const path = require('path');
const net = require('net');

const bodyParser = require('body-parser');
const fs = require('fs');
app.use(cors());
const port = 3000;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'apps/')  // Ensure this directory exists or is created
  },
  filename: function (req, file, cb) {
    // Use the original file name
    cb(null, file.originalname)
  }
});

const upload = multer({ storage: storage });

//sensor 192.168.0.80
//actuator 192.168.0.79
//local 192.168.0.111

const tweetTypes = {
  THING: 'Identity_Thing',
  LANGUAGE: 'Identity_Language',
  ENTITY: 'Identity_Entity',
  SERVICE: 'Service',
  RESPONSE: 'Service call reply'
}

const ids = {
  "MySmartGarage1": '192.168.1.80',
  "MySmartGarage2": '192.168.1.79'
}



// Middleware to parse JSON bodies
app.use(express.json());
// Middleware
app.use(bodyParser.json());
// Define the directory where apps are stored
const workingDirectory = './apps/';


const services = [] // for each service after trigger send both value and state. value 0 if not a value service
const entityList = [];
const thingList = [];
const relationships = [
  { name: 'Order-based relationship', properties: ['state'] },
  { name: 'Condition-based relationship', properties: ['threshold', 'comparision'] }
]
let appList = [
  /*{
      service1: {},
      service2: {},
      relationship: {},
      appName:,
      active: ,
  } */

];
const RpisData = []
const client1 = new net.Socket();
const client2 = new net.Socket();
is1Connected = false;
is2Connected = false;

start = () =>{
  const multicastGroup = '232.1.1.1';
  const port = 1235;

  // Create a UDP socket
  const socket = dgram.createSocket({ type: 'udp4', reuseAddr: true });

  // Bind the socket to the port (the second argument is a callback function that is called once the socket starts listening)
  socket.bind(port, function () {
    // Add the socket to the multicast group
    socket.addMembership(multicastGroup);
    console.log(`Listening on multicast group ${multicastGroup}:${port}`);
  });

  // When a new datagram is received, this event is fired
  socket.on('message', function (data, rinfo) {
    RpisData.push({
      thingId: data["Thing Id"],
      tweetData: data,
      unicastAddress: rinfo.address,
      port: rinfo.port
    })
    //console.log(`Received ${data.length} bytes from ${rinfo.address}:${rinfo.port}: ${data}`);
  });

  // When the socket starts listening, this event is fired
  socket.on('listening', function () {
    const address = socket.address();
    console.log(`UDP socket listening on ${address.address}:${address.port}`);
  });

  // Handle errors
  socket.on('error', function (err) {
    console.log(`Socket error:\n${err.stack}`);
    socket.close();
  });
}

connectSockets = () => {
  client1.connect(52790, '192.168.1.79', function() {
    console.log('Connected to server');
    is1Connected = true;
  });
  client2.connect(52790, '192.168.1.79', function() {
    console.log('Connected to server');
    is2Connected = true;
  });
}

const makeServiceCall = (request) => {
  //use unicast address and unicast port make call by sockets.
  if(RpisData.length > 0){
    if(request["Thing Id"] == RpisData[0].port){
      const jsonString = JSON.stringify(request);
      client1.write(jsonString);
      client1.on('data', function(data) {
        return data;
      });
    } else if(request["Thing Id"] == RpisData[0].port){
      const jsonString = JSON.stringify(request);
      client2.write(jsonString);
      client2.on('data', function(data) {
        return data;
      });
    }
  }
  
}

const resolveTweets = (tweetData) => {
  if (tweetData["Tweet Type"] == tweetTypes.ENTITY) {
    entityList.push({
      thingId: tweetData["Thing Id"],
      spaceId: tweetData["Space ID"],
      name: tweetData["Name"],
      id: tweetData["ID"]
    })
  } else if (tweetData["Tweet Type"] == tweetTypes.SERVICE) {
    services.push({
      thingId: tweetData["Thing Id"],
      spaceId: tweetData["Space ID"],
      name: tweetData["Name"],
      type: tweetData["Type"],
      description: tweetData["Description"]
    })

  } else if (tweetData["Tweet Type"] == tweetTypes.THING) {
    thingList.push({
      thingId: tweetData["Thing Id"],
      spaceId: tweetData["Space ID"],
      name: tweetData["Name"],
      model: tweetData["Model"]
    })
  } else if (tweetData["Tweet Type"] == tweetTypes.LANGUAGE) {
    thingList.map(each => {
      if (each.thingId == tweetData["Thing Id"]) {
        each.ip = tweetData["IP"]
        each.port = tweetData["port"]
      }
    })
  }
}

// A POST API to receive JSON data
app.post('/report', async (req, res) => {
  resolveTweets(req.body)
  res.json({ message: 'Data received' });
});

const listApps = () => {
  const apps = fs.readdirSync(workingDirectory);
  const jsonFiles = apps.filter(file => path.extname(file) === '.json');
  for (const app of jsonFiles) {
    loadApp(app);
  }
  return appList;
};

// Function to save app to file
const saveApp = (appName) => {
  const appData = appList.find(each => each.appName === appName);
  if (!fs.existsSync(workingDirectory)) {
    fs.mkdirSync(workingDirectory, { recursive: true });
  }
  const filePath = path.join(workingDirectory, `${appName}.json`);
  fs.writeFileSync(filePath, JSON.stringify(appData));
  fs.writeFileSync(filePath, JSON.stringify(appData));
};

const createNewApp = (appData) => {
  const exists = appList.some(app => app.appName === appData.name);
  if (!exists) {
    appList.push({ ...appData, active: true });
  }
}

// Function to load app from file
const loadApp = (appName) => {
  const rawData = fs.readFileSync(`${workingDirectory}${appName}`);
  const appData = JSON.parse(rawData);

  const exists = appList.some(app => app.appName === appData.name);

  if (!exists) {
    appList.push({ ...appData, active: false });
  }
};

const activateApp = (appName) => {
  appList.forEach(app => {
    if (app.appName == appName) {
      app.active = true
    }
  })
}

const stopApp = (appName) => {
  appList.forEach(app => {
    if (app.appName == appName) {
      app.active = false
    }
  })
}

// Function to delete app file
const deleteApp = (appName) => {
  appList = appList.filter(item => item.appName !== appName);
  const filePath = `${workingDirectory}${appName}.json`;
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
};

const triggerEachApplication = async (appData) => {
  //trigger those .....
  let serviceRequest = {
    "Tweet Type": "Service call",
    "Thing Id": appData.service1["Thing Id"],
    "Space ID": appData.service1["Space ID"],
    "Service Name": appData.service1["Name"],
    "Service Inputs": "(5)"
  }
  let data = await makeServiceCall(serviceRequest);
  data = await saveData(appData.service1);
  let excuteService2 = true;
  if (appData.relationship.name == 'Condition-based relationship') {
    if ((appData.relationship.comparision == 'gt' && appData.relationship.threshold <= data.value) || (appData.relationship.comparision == 'lt' && appData.relationship.threshold >= data.value)) excuteService2 = true;
  } else if (appData.relationship.name == 'Order-based relationship') {
    excuteService2 = (data.state == true)
  }
  if (excuteService2) {
    let serviceRequest2 = {
      "Tweet Type": "Service call",
      "Thing Id": appData.service2["Thing Id"],
      "Space ID": appData.service2["Space ID"],
      "Service Name": appData.service2["Name"],
      "Service Inputs": "(5)"
    }
    await makeServiceCall(serviceRequest2);
    await saveData(appData.service2);
  }
}

const runActiveApplications = async () => {
  while (true) {
    const promises = appList.map(app => {
      let tempApp = JSON.parse(JSON.stringify(app));
      if (tempApp.active) return triggerEachApplication(tempApp);
    });

    await Promise.all(promises);
    await sleep(1000);
  }

}
runActiveApplications()
start()

const saveData = (service) => {
  if (service["type"] == "Report") {
    return makeCall(ids[service["thingId"]], 'sensor-readings', { service: service["name"] })
  }
  else if (service["type"] == "Action") {
    return makeCall(ids[service["thingId"]], 'actuator-action', { service: service["name"] })
  }
}

// Route to save app
app.post('/api/apps/save/:appName', (req, res) => {
  try {
    const { appName } = req.params;
    saveApp(appName);
    res.status(200).json({ message: 'App saved successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save app.' });
  }
});

// Route to save app
app.post('/api/apps/newApp', (req, res) => {
  const appData = req.body;
  try {
    createNewApp(appData);
    res.status(200).json({ message: 'App created successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save app.' });
  }
});

// Route to upload app
app.post('/api/apps/upload', upload.single('file'), (req, res) => {
  try {
    listApps()
    res.status(200).json();
  } catch (error) {
    res.status(404).json({ error: 'App not found.' });
  }
});

app.delete('/api/apps/delete/:appName', (req, res) => {
  const { appName } = req.params;
  try {
    deleteApp(appName);
    res.status(200).json({ message: 'App deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete app.' });
  }
});

app.post('/api/apps/activate/:appName', (req, res) => {
  const { appName } = req.params;
  activateApp(appName)
});

// Route to stop app
app.post('/api/apps/stop/:appName', (req, res) => {
  const { appName } = req.params;
  stopApp(appName);
});

app.get('/api/apps/list', (req, res) => {
  listApps()
  res.json(appList)
})
app.get('/api/services', (req, res) => {
  res.json(services)
})
app.get('/api/relationships', (req, res) => {
  res.json(relationships)
})
app.get('/api/things', (req, res) => {
  res.json(entityList)
})


app.listen(port, () => {
  console.log(`Example app listening at http://192.168.0.111:${port}`);
});

async function makeCall(id, path, body) {
  try {
    const response = await axios.post(`http://${id}:8080/${path}`, {
      ...body
    });
    return response.data
    //console.log(`Sucessfully, controlled actuator ${actuator}, by sensor ${sensor}!!`)
  } catch (error) {
    console.error('Error calling external API:', error);
  }
}


// Function to simulate sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}