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


 // handle form submission

const formElement = document.getElementById('form');

if (formElement) {
  formElement.addEventListener('submit', (event) => {

    var formData = new FormData(formElement);
    var email = formData.get('email');
    var name = formData.get('name');
    var job = formData.get('job');
    var cv = formData.get('cv');

    const reader = new FileReader();

    reader.readAsDataURL(cv);


    // register consent

    fetch('https://devkit-pce-staging.azurewebsites.net/v0/user-events/consent', {
      method: 'POST',
      body: JSON.stringify({
          dataSubject: {
            id: email,
            schema: 'dsid',
          },
          //consent ID for talent portal
          consentId: 'e94d6ee3-24dd-46fa-8742-2c37adcc9cda',
          date: new Date().toISOString(),
        }),
    })
    .then((response) => {
      if (response.ok) {
        console.log(`consent registered`);

        // submit data
        const headers = new Headers();
        headers.append('apikey','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imppcnh0emFtbHZ3YW11eWlnem1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjY5Nzk0MjcsImV4cCI6MTk4MjU1NTQyN30.GBTO_ckSgTU4EKpvXUOy1GkWlnw_FoZZ-6s8cpNfv1E');
        headers.append('Authorization','Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imppcnh0emFtbHZ3YW11eWlnem1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjY5Nzk0MjcsImV4cCI6MTk4MjU1NTQyN30.GBTO_ckSgTU4EKpvXUOy1GkWlnw_FoZZ-6s8cpNfv1E');
        headers.append('Content-Type','application/json');
        headers.append('Prefer','return=representation');

        var object = {};
        formData.forEach((value, key) => object[key] = value);
        object['cv'] = reader.result;
        console.log(object['cv']);
        var body = JSON.stringify(object);

        // send data
        fetch('https://jirxtzamlvwamuyigzmj.supabase.co/rest/v1/cv-sumbissions', {
          method: 'POST',
          headers: headers,
          body: body
        })
        .then((response) => {
          if (response.ok) {
            console.log(`submission OK`);
            window.location.href = './thanx.html';
          } else {
            console.log(`submission NOT OK`);
            window.location.href = './whoops.html';
          }
        })
        .then(result => {
          console.log('Success:', result);

        })
        .catch(error => {
          console.error('Error:', error);
        })


      }
    })
    .then(result => {
      console.log('Success:', result);

    })
    .catch(error => {
      console.error('Error:', error);
    });

    event.preventDefault();
  })
}
