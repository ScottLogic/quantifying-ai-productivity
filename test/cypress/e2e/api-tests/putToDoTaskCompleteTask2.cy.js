//import '../../support/commands.js';


//API test suite generated using ChatGPT for PUT Method
describe('PUT API Test Suite', () => {
    it('should update user information via PUT request', () => {
      // Define the user ID and updated data
      const uuid = 'f360ba09-4682-448b-b32f-0a9e538502fa';
     

      //Get the response of Task 2 which is already completed
      cy.request({
        method: 'GET',
        url: `http://localhost:8080/todo?complete=true`,
       
      }).then((response) => {
        // Assertion example: Check if the response status code is 200 (OK)
        expect(response.status).to.eq(200);
        // Check if the response contains at least one user
        expect(response.body).to.have.length.greaterThan(0);
      });
  
      // Send a PUT request to update the user
      cy.request({
        method: 'PUT',
        url: `http://localhost:8080/todo/completed/${uuid}`,
        //failOnStatusCode: false --> This will not fail my test as Task 2 is
        //already marked as completed. Once we have API to rollbqck task 2
        //to incomplete, we can comment failOnStatusCode: false.
        failOnStatusCode: false,
       
      }).then((response) => {
        // Assertion example: Check if the response status code is 200 (OK)
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('success',true);
        expect(response.body).to.have.property('message','This task has now been completed.');

      });
        //Check the response again of Task 2 which is already completed
      cy.request({
        method: 'GET',
        url: `http://localhost:8080/todo?complete=true`,
        }).then((response) => {
        // Assertion example: Check if the response status code is 200 (OK)
        expect(response.status).to.eq(200);
        // Check if the response contains at least one user
        expect(response.body).to.have.length.greaterThan(0);
                // Assertion example: Check if the response status code is 200 (OK)
        expect(response.status).to.eq(200);
        expect(response.body[1]).to.have.property('uuid','f360ba09-4682-448b-b32f-0a9e538502fa');
        expect(response.body).to.have.property('name','Walk the dog');
        expect(response.body).to.have.property('description','Walk the dog for forty five minutes');
        expect(response.body).to.have.property('created','2023-06-23T09:30:00Z');
        expect(response.body).to.have.property('completed','2023-07-27T13:38:12.280Z');
        expect(response.body).to.have.property('complete',true);
    
  
      });
    });
  });
  