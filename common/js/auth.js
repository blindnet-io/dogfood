
const auth0 = new window.Auth0Client({
  domain: 'blindnet.eu.auth0.com',
  client_id: '2aGXtZzyztM5G0Hmj5VI9mL4Lz2QTT7W',
  audience: 'https://dogfood-server.azurewebsites.net/',
  redirect_uri: `${window.location.origin}/privacy_portal`,
  authorizationParams: {
    redirect_uri: `${window.location.origin}/privacy_portal`,
  },
  allowSignUp: false,
  passwordlessMethod: `link`
});

function login() {
  auth0.loginWithRedirect();
}

function logout() {
  auth0.logout({
    returnTo: `${window.location.origin}/privacy_portal`,
  })
}

async function renderLoggedInState() {

  try {

    const accessToken = await auth0.getTokenSilently()
    const claims = await auth0.getIdTokenClaims()

    const blindnetToken = await fetch('https://dogfood-server.azurewebsites.net/token/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ access_token: accessToken })
    }).then(r => r.json()).then(r => r.token)

    document.getElementById("not-logged-in").setAttribute("hidden", "true")
    document.getElementById("logged-in").removeAttribute("hidden")
    document.getElementById("ipt-user-profile").innerHTML = claims.name
    document.getElementById("token").value = blindnetToken
    // push blindnet token to prci component
    document.getElementById("devkit-prci").setAttribute("api-token", blindnetToken)

  } catch {

    document.getElementById("not-logged-in").removeAttribute("hidden")
    document.getElementById("logged-in").setAttribute("hidden", "true")
    document.getElementById("ipt-user-profile").innerHTML = ""
    document.getElementById("token").value = null
    document.getElementById("devkit-prci").setAttribute("api-token", null)

  }
}

function getBlindnetToken() {
  return document.getElementById("token").value
}

window.onload = async () => {
  renderLoggedInState()
}
