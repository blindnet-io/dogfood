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

function redirectOK(message){
  console.log(message);
  window.location.href = './thanx.html';
}

function redirectError(message){
  console.log(message);
  window.location.href = './whoops.html';
}

function getDevKitToken(email){
  return fetch('https://dogfood-server.azurewebsites.net/token/user/'+email, {
    method: 'GET'
  }).then(result => {
    if(result.ok){
      console.log('got token response')
      return result.json();
    } else {
      redirectError('error getting user token');
    }
  })
}

function registerConsent(devkit_token){
  const consent_headers = new Headers();
  consent_headers.append('Authorization','Bearer ' + devkit_token);

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

function submitData(formData){

  const reader = new FileReader();
  console.log('file '+formData.get('cv').name);
  reader.readAsDataURL(formData.get('cv'));
  reader.onload = function(){
  const headers = new Headers();
  headers.append('apikey','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imppcnh0emFtbHZ3YW11eWlnem1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjY5Nzk0MjcsImV4cCI6MTk4MjU1NTQyN30.GBTO_ckSgTU4EKpvXUOy1GkWlnw_FoZZ-6s8cpNfv1E');
  headers.append('Authorization','Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imppcnh0emFtbHZ3YW11eWlnem1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjY5Nzk0MjcsImV4cCI6MTk4MjU1NTQyN30.GBTO_ckSgTU4EKpvXUOy1GkWlnw_FoZZ-6s8cpNfv1E');
  headers.append('Content-Type','application/json');
  headers.append('Prefer','return=representation');

  var object = {};
  formData.forEach((value, key) => object[key] = value);
  object['cv'] = reader.result;
  console.log('encoded file: '+ object['cv']);
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
      redirectError('not submitted');
    }
  })
  .then(result => {
    console.log('Success:', result);
  })
  .catch(error => {
    console.error('Error:', error);
  })
  }
}

// handle form submission

const formElement = document.getElementById('form');

if (formElement) {
  formElement.addEventListener('submit', (event) => {

    var formData = new FormData(formElement);
    var email = formData.get('email');
    var name = formData.get('name');
    var job = formData.get('job');
    var cv = formData.get('cv');


      //generate devkit token
      getDevKitToken(email).then(response => {

      const token = response.token;
      console.log('token '+token);

      //if OK register consent
      return registerConsent(token).then((response) => {
        if (response.ok) {
          console.log(`consent registered`);
          //if OK submit data
          return submitData(formData);
        } else {
          redirectError('consent not registered');
        }
      })
      .then(result => {
        console.log('Success:', result);

      })
      .catch(error => {
        console.error('Error:', error);
      });


    });

    event.preventDefault();
  })


}
