We then developed an Application Manager, IDE and Dashboard using Angular. Where we had developed a screen to display Smartspace meta information. This Angular based frontend hosts the IDE. i.e the application manager, from where we can create, upload, save, stop, activate and delete any application.
 CODE EXPLANATION: 1.edgeServer.js:
● NodeJs based backend which serves as an edge server.
● Listens to multicast port to collect information about the two Rpis.
● Provides End points which are used to build a front end that hosts Application Manager
and dashboard.
● Handles communication with Rpis based on the relationship between services to run the
application.
Network Communication and Service Management:
● Utilizes UDP sockets to join multicast groups, enabling the system to receive and handle data broadcasts within a specified network segment.
● Establishes TCP connections with specific IP addresses to manage data flows and potentially initiate device-specific actions.
● Manages incoming data related to IoT devices (entities, services, relationships) via RESTful API endpoints that process JSON payloads.
Application and File Management:
● Applications are managed in a directory where they can be created, saved, activated, deactivated, and deleted through specific API endpoints. This involves file operations like reading, writing, and deleting JSON files which represent individual applications.
● Provides endpoints to upload and manage these application files via HTTP POST requests, supporting operations like file saving (/api/apps/save/:appName), app creation (/api/apps/newApp), app activation (/api/apps/activate/:appName), and deletion (/api/apps/delete/:appName).
Data Handling and Visualization:
● Handles various types of data related to IoT things, such as entity lists, service details, and relationship types, making them accessible via HTTP GET requests.
● Offers a dynamic view of available services, relationships between services, and entity details which can be filtered and viewed through different API endpoints.

 2. IOT_DASHBOARD:
● Angular based frontend.
● Separate components to display meta information about VSS.
● Features include Application creation, upload, save, activate, stop and delete
SCREENSHOTS OF THE IDE, APPLICATION MANAGER AND METADATA ABOUT OUR SMART SPACE
  
   
