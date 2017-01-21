# dublinbus-luas-api
api for real-time information for Dublin Bus and Luas written in nodejs using hapi. Reads data from real-time api's from Dublin bus and Luas and converts to a client friendly JSON format.

endpoints:

```
/bus/route/{route_number}
/bus/stop/{stop_number}

/luas/stops
/luas/stop/{stop_id}
```

### Requires

* nodejs v7 +

### To run

```
npm install
npm start
```