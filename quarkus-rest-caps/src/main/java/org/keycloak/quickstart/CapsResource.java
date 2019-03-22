package org.keycloak.quickstart;

import org.eclipse.microprofile.jwt.JsonWebToken;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("caps/{username}")
public class CapsResource {

    @GET
    @RolesAllowed({"user"})
    @Produces("application/json")
    public String toCaps(@PathParam("username") String username) {
        return username.toUpperCase();
    }
}