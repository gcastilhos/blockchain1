# Blockchain Demo App

A demonstration application using blockchain technology.

## Host

[Blockchain1 on Heroku](https://blockchain1aus.herokuapp.com/)

### Production Environment

Setting the `PRODUCTION` flag in the production environment.
```
heroku config:add PRODUCTION=True --app blockchain1aus
```

### Security Policy

The module `Talisman` requires a custom policy to allow common resources, including
JS libraries, fonts, and images.

```
heroku config:add CSP_DIRECTIVES="default-src 'self'; img-src *; script-src 'unsafe-eval' 'self' *.jsdelivr.net unpkg.com;" --app blockcahin1aus # or other app
```

Local environment
```
export CSP_DIRECTIVES="default-src 'self'; img-src *; script-src 'unsafe-eval' 'self' *.jsdelivr.net unpkg.com;"
```

## Techonology Stack

* Python 3.8.3
* Flask
* Vue.js

## Event Queue

A third phase of the project includes a remote API providing records on a minute-by-minute basis. The actual API hosted on [heroku.com](https://eventqueue.herokuapp.com/events) will provided a record upon request. A queue runs on the server and guarantees that every record is unique.

## Test Environment

To run locally, some environment variables shoud be set and Flask can be run as

```
QUEUE_DATA=./data TEST_ENV=1 FLASK_ENV=development FLASK_APP=wsgi.py flask run
```

### QUEUE_DATA

The location of JSON files read by events hash and events categorization.

### TEST_ENV

If set to a value that can be evaluated to true, then the CORS headers are included, so the Vue app can reach the local server for event data and hash conversion.
