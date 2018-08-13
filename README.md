# dublinbus-luas-api
api for real-time information for Dublin Bus and Luas written in nodejs using hapi. Reads data from real-time api's from Dublin bus and Luas and converts to a client friendly JSON format.

endpoints:

```
GET /bus/routes
GET /bus/route/{route_number}
GET /bus/stop/{stop_number}

GET /luas/stops
GET /luas/stop/{stop_id}
```

### Requires

* nodejs v8 +

### To run

```
npm install
npm start
```