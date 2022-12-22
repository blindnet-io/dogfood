/**
* Reacts to submit button form event on the talent portal main page.
*
* Submits consent to the consent endpoint, form data to the form data endpoint and redirects the user to the thank you page.
*
* @since      0.0.1
*
* @milstan  Milan Stankovic
* @memberof blindnet
*
* @listens event:submit
*
*/

// prepopulate form fields

(new URL(window.location.href)).searchParams.forEach((x, y) =>
  document.getElementById(y).value = x)

function redirectOK() {
  window.location.href = './thanx.html';
}

function redirectError() {
  window.location.href = './whoops.html';
}

function getDevKitToken(email) {
  return fetch('https://dogfood-server.azurewebsites.net/token/user/' + email, {
    method: 'GET'
  }).then(result => {
    if (result.ok) {
      return result.json();
    } else {
      throw new Error('Not ok response from dogfood server')
    }
  })
}

function registerConsent(devkit_token) {
  const consent_headers = new Headers();
  consent_headers.append('Authorization', 'Bearer ' + devkit_token);

  return fetch('https://devkit-pce-staging.azurewebsites.net/v0/user-events/consent', {
    method: 'POST',
    headers: consent_headers,
    body: JSON.stringify({

      //consent ID for talent portal
      consentId: '75402f63-104d-4625-880e-2e333ac30660',
      date: new Date().toISOString(),
    }),
  })
}

function submitData(formData) {

  const reader = new FileReader();
  reader.readAsDataURL(formData.get('cv'));
  reader.onload = function () {
    const headers = new Headers();
    headers.append('apikey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imppcnh0emFtbHZ3YW11eWlnem1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjY5Nzk0MjcsImV4cCI6MTk4MjU1NTQyN30.GBTO_ckSgTU4EKpvXUOy1GkWlnw_FoZZ-6s8cpNfv1E');
    headers.append('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imppcnh0emFtbHZ3YW11eWlnem1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjY5Nzk0MjcsImV4cCI6MTk4MjU1NTQyN30.GBTO_ckSgTU4EKpvXUOy1GkWlnw_FoZZ-6s8cpNfv1E');
    headers.append('Content-Type', 'application/json');
    headers.append('Prefer', 'return=representation');

    var object = {};
    formData.forEach((value, key) => object[key] = value);
    object['cv'] = reader.result;
    var body = JSON.stringify(object);

    return fetch('https://jirxtzamlvwamuyigzmj.supabase.co/rest/v1/cv-sumbissions', {
      method: 'POST',
      headers: headers,
      body: body
    })
      .then((response) => {
        if (response.ok) {
          redirectOK('everything OK');
        } else {
          throw new Error('Not ok response from supabase')
        }
      })
  }
}

// handle form submission

const formElement = document.getElementById('form');
const btn = document.getElementById('submit');

if (formElement) {
  formElement.addEventListener('submit', (event) => {

    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Send'

    var formData = new FormData(formElement);
    var email = formData.get('email');
    var name = formData.get('name');
    var job = formData.get('job');
    var cv = formData.get('cv');

    //generate devkit token
    getDevKitToken(email).then(response => {
      const token = response.token;

      //if OK register consent
      return registerConsent(token)
    })
      .then((response) => {
        if (response.ok) {
          //if OK submit data
          return submitData(formData);
        } else {
          throw new Error('Not ok response from pce')
        }
      })
      .catch(_ => {
        btn.removeAttribute('disabled');
        btn.innerHTML = "Send";
        redirectError();
      });

    event.preventDefault();
  })


}
