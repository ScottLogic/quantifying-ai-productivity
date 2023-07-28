// cypress/integration/post_api_spec.js
describe('POST API Test Suite', () => {
    let initialResponseSize;
    it('should create a new resource using POST', () => {
      // Define the request body for the POST request
      const requestBody = {
        name: 'Task Four',
        description: 'Description Four',
               
      };

      cy.request({
        method: 'GET',
        url: 'http://localhost:8080/todo',
      }).then((response) => {

        
         // Save the current response size
         initialResponseSize = response.body.length;

        // Assertion example: Check if the response status code is 200 (OK)
        expect(response.status).to.eq(200);
  
         // Check if the response contains at least one user
        expect(response.body).to.have.length.greaterThan(0);
      
  
      });
  
      // Send a POST request to the API endpoint
      cy.request({
        method: 'POST',
        url: 'http://localhost:8080/todo/addTask?name=Task Four&description=Description Four',
        body: requestBody,
      }).then((response) => {
        // Perform assertions on the response
        expect(response.status).to.equal(201); // Assuming the API returns 201 (Created) for successful POST
        expect(response.body).to.have.property('taskId');
        expect(response.body.message).to.equal('Task Task Four added successfully.');
        
             
      });

      cy.request({
        method: 'GET',
        url: 'http://localhost:8080/todo',
      }).then((response) => {
        // Assertion example: Check if the response status code is 200 (OK)
        expect(response.status).to.eq(200);
        
  
         // Check if the response size is increased by 1
         expect(response.body.length).to.equal(initialResponseSize + 1);
  
      });
    });
  });
  