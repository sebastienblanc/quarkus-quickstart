package org.keycloak.quickstart;

import org.eclipse.microprofile.rest.client.annotation.RegisterClientHeaders;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import javax.ws.rs.*;

@Path("/caps")
@RegisterRestClient
@RegisterClientHeaders
public interface CapsService {

    @GET
    @Path("/{username}")
    @Produces("application/json")
    String toCaps(@PathParam("username") String username);
}
