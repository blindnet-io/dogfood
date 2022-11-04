const options = {
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience:'https://dogfood-server.azurewebsites.net'
  },
  theme: {
    logo: 'https://dogfood.blindnet.io/common/img/blindnet.png',
    favicon: 'https://dogfood.blindnet.io/common/img/favicon/favicon.ico',
    primaryColor: '#000000'
  },
  languageDictionary: {
    emailInputPlaceholder: "something@youremail.com",
    title: "Let us verify your e-mail",
    passwordlessEmailInstructions:'Enter the email associated<br/>with your data',
    signUpTerms: 'By clicking SUMBIT, you give consent for processing your data (email) for the purposes of identifying you and processing your privacy request.',
    success: {
      logIn: 'Email verified.',
      magicLink: 'We sent you a link to verify<br />your e-mail at %s.',
    }
  },
  allowSignUp: false,
  passwordlessMethod: `link`
};

// const lock = new Auth0LockPasswordless('2aGXtZzyztM5G0Hmj5VI9mL4Lz2QTT7W', 'blindnet.eu.auth0.com');
//


// Get an auth0 instance
const auth0 = new Auth0Client({
  domain: 'blindnet.eu.auth0.com',
  client_id: '1C0uhFCpzvJAkFi4uqoq2oAWSgQicqHc',
  redirect_uri: `${window.location.origin}/demos/devkit-simple-tutorial/privacy`,
  authorizationParams: {
    redirect_uri: `${window.location.origin}/demos/devkit-simple-tutorial/privacy`,
  },
  allowSignUp: false,
  audience:'https://dogfood-server.azurewebsites.net',
  passwordlessMethod: `link`
});

document.getElementById("btn-login").addEventListener('click', (event) => {
  auth0.loginWithRedirect();
})

// let auth0 = null
//
// window.onload = async () => {
//   await configureClient()
//   await processLoginState()
//   updateUI()
// }
//
// const configureClient = async () => {
//   auth0 = await createAuth0Client({
//     domain: "blindnet.eu.auth0.com",
//     clientId: "2aGXtZzyztM5G0Hmj5VI9mL4Lz2QTT7W"
//   },options)
// }
//
// const processLoginState = async () => {
//   // Check code and state parameters
//   const query = window.location.search
//   if (query.includes("code=") && query.includes("state=")) {
//     // Process the login state
//     await auth0.handleRedirectCallback()
//     // Use replaceState to redirect the user away and remove the querystring parameters
//     window.history.replaceState({}, document.title, window.location.pathname)
//   }
// }
//
// const updateUI = async () => {
//   const isAuthenticated = await auth0.isAuthenticated()
//   document.getElementById("btn-logout").disabled = !isAuthenticated
//   document.getElementById("btn-login").disabled = isAuthenticated
//   // NEW - add logic to show/hide gated content after authentication
//   if (isAuthenticated) {
//     document.getElementById("btn-login").classList.add("hidden")
//     document.getElementById("div-logout").classList.remove("hidden")
//     document.getElementById(
//       "ipt-access-token"
//     ).innerHTML = await auth0.getTokenSilently()
//     document.getElementById("ipt-user-profile").innerHTML = JSON.stringify(
//       await auth0.getUser()
//     )
//   } else {
//     document.getElementById("div-logout").classList.add("hidden")
//     document.getElementById("btn-login").classList.remove("hidden")
//   }
// }
//
// const login = async () => {
//   await auth0.loginWithRedirect({
//     redirect_uri: window.location.href,
//   })
// }
//
// const logout = () => {
//   auth0.logout({
//     returnTo: window.location.href,
//   })
// }
