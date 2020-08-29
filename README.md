# Blockchain Demo App - Event Queue

A demonstration application using blockchain technology.

This application is an RESTFul API that provides event records and the so-called Proof Of Work (POW) functionality for 
the [blockchain1aus app](blockchain1aus.herokuapp.com) on [Heroku](https://heroku.com)

## Host

[Event Queue on Heroku](https://eventqueue.herokuapp.com/)

## Endpoints

For event records
```
https://eventqueue.herokuapp.com/events
```

For POW hash creation (returning the `nonce` and the hash from the given data)
```
https://eventqueue.herokuapp.com/hash?previous=<previous_hash>&data=<new_data>
```

The querystring should carry the previous hash (starts with 0) and the data to be transformed.

## Production Environment

Setting the `PRODUCTION` flag in the production environment.
```
heroku config:add PRODUCTION=True --app blockchain1aus
```

## Security Policy

The module `Talisman` requires a custom policy to allow common resources, including
JS libraries, fonts, and images.

```
heroku config:add CSP_DIRECTIVES="default-src 'self'; img-src *; script-src 'unsafe-eval' 'self' *.jsdelivr.net unpkg.com;" --app blockcahin1aus # or other app
```

### Local environment
```
export CSP_DIRECTIVES="default-src 'self'; img-src *; script-src 'unsafe-eval' 'self' *.jsdelivr.net unpkg.com;"
```

## Techonology Stack

* Python 3.8.3
* Flask

## Local Environment

To run locally, some environment variables shoud be set and Flask can be run as

```
QUEUE_DATA=./data FLASK_ENV=development FLASK_APP=wsgi.py flask run
```

### QUEUE_DATA

> The location of JSON files read by events hash and events categorization.

### CORS Setup

The `CORS_URLS` environment variable contains the Cross-Origin websites that can access the API. The front-end application is a pure Vue.js app, without any server involved, considered a static website. The value is in JSON format.
```
CORS_URLS='{
               "/events": {
                   "origins": ["http://localhost:808*", "https://blockchain1aus-dev.herokuapp.com"]
               },
               "/hash": {
                   "origins": ["http://localhost:808*", "https://blockchain1aus-dev.herokuapp.com"]
               }
           }'
```

This has to be set in the target environment (e.g., https:://eventqueue.herokuapp.com) with the Heroku command

```
heroku config:set CORS_URLS=... --app eventqueue
```
## Running Process

The event queue application reads a datasource Python pickle file which contains 1,500 records. These records are read sequentially, with each field value receiving a random amount (either positive or negative) to make it unique for every call to the event queue.

Every time the endpoint

> https://eventqueue.herokuapp.com/events

is requested, an event with the JSON response (sample) is sent back

```
{
	"columns": ["Event_Id",
				"Date",
				"Time_24H",
				"Duration_Min",
				"Appl_Id",
				"Appl.NAME",
				"Global_active_power",
				"Global_reactive_power",
				"Voltage",
				"Global_intensity",
				"Total Subm. 1+2+3",
				"Total measum. WH",
				"POWER Composition [kWH]",
				"USE CATEG",
				"CATEGORY NAME (Literal)"],
	"data": [
		[40894,
		 "29\/08\/2020",
		 "16:25:51",
		 1,
		 "00010_c2",
		 "PrinterKit",
		 4.64,
		 0.46,
		 258.32,
		 20.24,
		 19,
		 19,
		 0.02,
		 "E",
		 "EDUCATION, COMMS, ENTERNTAINMENT"]
	]
}
```

The most notorious part of the response data is the `USE CATEG` and `CATEGORY NAME` fields, which are used in several applications to group be usage category.
