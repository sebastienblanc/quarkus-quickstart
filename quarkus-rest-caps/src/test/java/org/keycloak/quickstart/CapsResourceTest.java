package org.keycloak.quickstart;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;

@QuarkusTest
public class CapsResourceTest {

    @Test
    public void testHelloEndpoint() {
        given()
          .when().get("caps/sebi")
          .then()
             .statusCode(401);
    }

}