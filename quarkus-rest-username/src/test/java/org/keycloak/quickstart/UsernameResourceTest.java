package org.keycloak.quickstart;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;

@QuarkusTest
public class UsernameResourceTest {

    @Test
    public void testUsernameEndpoint() {
        given()
          .when().get("/username")
          .then()
             .statusCode(401);
    }

}