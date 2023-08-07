// apiTest.spec.js

describe('API Test', () => {
    it('should return status code 200 and correct values for UUID, name, and description', () => {
      // Replace 'YOUR_ENDPOINT_URL' with the actual URL of your API endpoint
      const taskIdToCheck = '5c3ec8bc-6099-4cd5-b6da-8e2956db3a34';
  
      // Send the request to the API endpoint
      cy.request({
        method: 'GET',
        url: `http://localhost:8080/todo/${taskIdToCheck}`,
      }).then((response) => {
        // Check if the response status code is 200 (OK)
        expect(response.status).to.eq(200);
  
        expect(response.body).to.have.property('uuid', '5c3ec8bc-6099-4cd5-b6da-8e2956db3a34')
        expect(response.body).to.have.property('name','Test generative AI')
        expect(response.body).to.have.property('description','Use generative AI technology to write a simple web service')
        expect(response.body).to.have.property('completed',null)
        expect(response.body).to.have.property('complete',false)
      });
    });
  });
  