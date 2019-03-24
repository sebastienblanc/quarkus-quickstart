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
  * If you have Docker you can also run your Keycloak Server like this : 
  ```
  docker run -d --name keycloak -e KEYCLOAK_USER=admin -e KEYCLOAK_PASSWORD=admin -p 8180:8180 -v `pwd`/quarkus-kc-quickstart.json:/config/quarkus-kc-quickstart.json -it jboss/keycloak:5.0.0 -b 0.0.0.0 -Djboss.http.port=8180 -Dkeycloak.migration.action=import -Dkeycloak.migration.provider=singleFile -Dkeycloak.migration.file=/config/quarkus-kc-quickstart.json -Dkeycloak.migration.strategy=OVERWRITE_EXISTING
  ```

## Instructions

* Import the Realm `quarkus-kc-quickstart.json` in your Keycloak Server (except if you are using the docker image from above)
* Go to the `quarkus-front` folder and start the app : `mvn package quarkus:dev`
* Go to the `quarkus-rest-username` folder and start the app : `mvn package quarkus:dev`
* Go to the `quarkus-rest-caps` folder and start the app : `mvn package quarkus:dev`

## Running the app

* Go to `http://localhost:8080` and press the `login` button 
* Login with username and password `test/test`
* In the accordeon menu go to `service call` and press the button
* Next to `Service Call Result` you should see the result `TEST`

## Focus on how the `smallrye-jwt` extension is used 

The service receives a JWT Access Token from the `quarkus-front-end` application. To handle the JWT, we use the `smallrye-jwt` extension : 

```xml
 <dependency>
  <groupId>io.quarkus</groupId>
  <artifactId>quarkus-smallrye-jwt</artifactId>
 </dependency>
```

Then, it just need some configuration, notice the `issuer` and the `publickey.location` properties : 

```
mp.jwt.verify.publickey.location=http://localhost:8180/auth/realms/quarkus-quickstart/protocol/openid-connect/certs
mp.jwt.verify.issuer=http://localhost:8180/auth/realms/quarkus-quickstart
quarkus.smallrye-jwt.auth-mechanism=MP-JWT
quarkus.smallrye-jwt.enabled=true
```
Then in your JAXRS resource, you just need to add an annotation to your endpoint method : 

```java
@GET
@RolesAllowed({"user"})
public String getUsername() {
```
Also notice how easy it is to inject any claim of your token : 

```java
 @Inject
 @Claim(standard = Claims.preferred_username)
 Optional<JsonString> preferred_username;
```
To call the `quarkus-rest-caps` service we use the `quarkus-smallrye-rest-client` extension, notice the annotation `@RegisterClientHeaders`     

```java
@Path("/caps")
@RegisterRestClient
@RegisterClientHeaders
public interface CapsService {
```
By doing this, we indicate that we want to propagate HTTP Headers from the JAXRS context. In our case, we want to propagate the `Authorization` header that contains our access token. 
In the properties we specify this header : 

```
org.eclipse.microprofile.rest.client.propagateHeaders=Authorization
```

 ## Going Native
 
 There is actually an [issue](https://github.com/quarkusio/quarkus/issues/1163) with the `jwt-extension` in Native Mode. The fix is planned for `0.13` and I will be update this section as soon as it will be fixed. 

