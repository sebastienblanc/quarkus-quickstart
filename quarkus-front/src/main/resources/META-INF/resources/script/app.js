function refreshToken(minValidity) {
    keycloak.updateToken(minValidity).success(function(refreshed) {
        if (refreshed) {
            //output(keycloak.tokenParsed);
        } else {
            output('Token not refreshed, valid for ' + Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds');
        }
    }).error(function() {
        output('Failed to refresh token');
    });
}


function output(data) {
    if (typeof data === 'object') {
        data = JSON.stringify(data, null, '  ');
    }
   document.getElementById('output').innerHTML = data;
}

function event(event) {
   document.getElementById('output').innerHTML = event;
}

var keycloak = Keycloak();
var authorization;
keycloak.onAuthSuccess = function () {
    event('Auth Success');
};

keycloak.onAuthError = function (errorData) {
    event("Auth Error: " + JSON.stringify(errorData) );
};

keycloak.onAuthRefreshSuccess = function () {
    event('Auth Refresh Success');
    document.getElementById('token64').innerHTML = keycloak.token;
   document.getElementById('refreshToken').innerHTML = JSON.stringify(keycloak.refreshTokenParsed, null, 4);
   document.getElementById('idToken').innerHTML = JSON.stringify(keycloak.idTokenParsed,null, 4);
   document.getElementById('token').innerHTML = JSON.stringify(keycloak.tokenParsed,null, 4);

};

keycloak.onAuthRefreshError = function () {
    event('Auth Refresh Error');
};

keycloak.onAuthLogout = function () {
    document.getElementById("login").style.display = "block";
};

keycloak.onTokenExpired = function () {
    event('Access token expired.');
    if(document.getElementById("refresh").checked) {
      refreshToken();
    }
};

// Flow can be changed to 'implicit' or 'hybrid', but then client must enable implicit flow in admin console too
var initOptions = {
    responseMode: 'fragment',
    flow: 'standard',
    onload: 'check-sso'
};

function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            timer = duration;
        }
    }, 1000);
}

function serviceCallSimple() {
    var oReq = new XMLHttpRequest();
    oReq.open('GET', "http://localhost:8081/username", true);
    oReq.setRequestHeader('Authorization', 'Bearer ' + keycloak.token);
    oReq.send();

    oReq.onload = function () {
        if (oReq.readyState === oReq.DONE) {
            if (oReq.status === 200) {
                document.getElementById('result').innerHTML = oReq.responseText
            }
        }
    };
}


keycloak.init(initOptions).success(function(authenticated) {
   authorization = new KeycloakAuthorization(keycloak);
   document.getElementById('refreshToken').innerHTML = JSON.stringify(keycloak.refreshTokenParsed, null, 4);
   document.getElementById('idToken').innerHTML = JSON.stringify(keycloak.idTokenParsed,null, 4);
   document.getElementById('token').innerHTML = JSON.stringify(keycloak.tokenParsed,null, 4); 
   document.getElementById('token64').innerHTML = keycloak.token;
   output('Init Success (' + (authenticated ? 'Authenticated' : 'Not Authenticated') + ')');
   var fiveMinutes = Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000);
       display = document.querySelector('#time');
    startTimer(fiveMinutes, display);
  if(!authenticated) {
    document.getElementById("logout").style.display = "none";
    document.getElementById("login").style.display = "";
    
  }
else {
     document.getElementById("logout").style.display = "";
    document.getElementById("login").style.display = "none";
    
}
}).error(function() {
    output('Init Error');
});