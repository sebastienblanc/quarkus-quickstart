# quarkus-keycloak-quickstart

This quickstart will show you : 
* How to obtain a Keycloak Access Token from a front-end application
* How to Use that Access Token to call in secure way a first Quarkus Rest Application
* How this first service can propagate this token to another Quarkus Rest Service, again in a secure way. 

This quickstart consists of :
* A simple Web App that performs the Keycloak Login and that call the `quarkus-rest-username`
* The `quarkus-rest-username` , a Quarkus REST app, just returns the username of the authenticated user.
* The `quarkus-rest-caps`, a Quarkus REST app, receives as path parameter a `String` and capitalize it.

The flow is pretty simple : 

1. User --login--> `quarkus-front` <-- returns token --> `Keycloak Server`
2. `quarkus-front` -- calls --> `quarkus-rest-username` -- calls --> `quarkus-rest-caps`


## Prerequisites

* JDK8+
* Maven
* A running instance of Keycloak 5.0.0 running on port 8180

## Instructions

* Import the Realm `quarkus-kc-quickstart.json` in your Keycloak Server
* Go to the `quarkus-front` folder and start the app : `mvn package quarkus:dev`
* Go to the `quarkus-rest-username` folder and start the app : `mvn package quarkus:dev`
* Go to the `quarkus-rest-caps` folder and start the app : `mvn package quarkus:dev`

## Running the app

* Go to `http://localhost:8080` and press the `login` button 
* Login with username and password `test/test`
* In the accordeon menu go to `service call` and press the button
* Next to `Service Call Result` you should see the result `TEST`


 

