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

    const formData = new FormData(formElement);

    formData.forEach(file => console.log("File: ", file));

    // register consent


    fetch('https://devkit-pce-staging.azurewebsites.net/v0/user-events/consent', {
      method: 'POST',
      body: JSON.stringify({
          dataSubject: {
            id: formData.get('email'),
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
        fetch('https://blindnet-connector-demo-staging.azurewebsites.net/form', {
          method: 'POST',
          body: formData
        })
        .then((response) => {
          if (response.ok) {
            console.log(`OK`);
            window.location.href = './thanx.html';
          }
        })
        .then(result => {
          console.log('Success:', result);

        })
        .catch(error => {
          console.error('Error:', error);
        });


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
