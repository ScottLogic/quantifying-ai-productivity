// request to chat Gpt:
// write a cypress api test to check for response being 200 and also check that the uuid, name and description are equal to the correct values. Additionally, log the number of milliseconds since the epoch and check that completed is equal to null and false

//Response from chat Gpt:
// describe('API Test', () => {
//     it('should validate API response', () => {
//       // Send the API request
//       cy.request('GET', '/api/some_endpoint')
//         .then((response) => {
//           // Assert the response status code is 200
//           expect(response.status).to.eq(200);
  
//           // Assert the properties in the response body
//           expect(response.body).to.have.property('uuid', 'correct_uuid');
//           expect(response.body).to.have.property('name', 'correct_name');
//           expect(response.body).to.have.property('description', 'correct_description');
  
//           // Get the number of milliseconds since the epoch
//           const currentTime = new Date().getTime();
  
//           // Assert the "completed" property is equal to null and false
//           expect(response.body.completed).to.eq(null);
//           expect(response.body.completed).to.eq(false);
  
//           // Log the number of milliseconds since the epoch
//           cy.log(`Current time in milliseconds since the epoch: ${currentTime}`);
//         });
//     });
//   });
  
describe('Test Experiment GET Task 4', () => {
    it('should validate API response is 200, check for correct uuid, name and description, as well as log time since epoch and check that "completed" is equal to null and false', () => {

      cy.request('GET', 'http://localhost:8080/todo/5c3ec8bc-6099-4cd5-b6da-8e2956db3a34')
        .then((response) => {
          expect(response.status).to.eq(200);

          expect(response.body).to.have.property('uuid', '5c3ec8bc-6099-4cd5-b6da-8e2956db3a34');
          expect(response.body).to.have.property('name', 'Test generative AI');
          expect(response.body).to.have.property('description', 'Use generative AI technology to write a simple web service');
  
          const currentTime = new Date().getTime();

          expect(response.body.completed).to.eq(null);
          expect(response.body.complete).to.eq(false);
  
          cy.log(`Current time in milliseconds since the epoch: ${currentTime}`);
        });
    });
  });
  
