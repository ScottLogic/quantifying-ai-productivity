// cypress/integration/post_api_spec.js
describe('POST API Test Suite', () => {
    
    it('should create a new resource using POST', () => {
    
      // Send a POST request to the API endpoint
      cy.request({
        method: 'POST',
        url: 'http://localhost:8080/todo/addTask?description=Missing Name',
        failOnStatusCode: false,//This is stop failing our test as 400 is expected scenario
        
      }).then((response) => {
        // Extract the timestamp from the API response
      const actualTimestampMillis =response.body.timestamp;
        // Perform assertions on the response
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('timestamp',actualTimestampMillis) 
        expect(response.body).to.have.property('error','Bad Request');
        expect(response.body).to.have.property('path','/todo/addTask?description=Missing%20Name');
        
        
             
      });

      
    });
  });
  