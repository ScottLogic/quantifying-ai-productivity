
//API test suite generated using ChatGPT for PUT Method
describe('PUT API Test Suite', () => {
    it('should update user information via PUT request', () => {
      // Define the user ID and updated data
      const uuid = 'f360ba09-4682-448b-b32f-0a9e538502fa';
      //const updatedUserData = {
      //  complete: 'true',
        
     // };

      //Get the response of Task 2 which is already completed
      cy.request({
        method: 'GET',
        url: `http://localhost:8080/todo?complete=true`,
        //body: updatedUserData,
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
       // body: updatedUserData,
      }).then((response) => {
        // Assertion example: Check if the response status code is 200 (OK)
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('success',false);
        expect(response.body).to.have.property('message','Task already marked complete.');
        
      });
        //Check the response again of Task 2 which is already completed
      cy.request({
        method: 'GET',
        url: `http://localhost:8080/todo?complete=true`,
       // body: updatedUserData,
      }).then((response) => {
        // Assertion example: Check if the response status code is 200 (OK)
        expect(response.status).to.eq(200);
        // Check if the response contains at least one user
        expect(response.body).to.have.length.greaterThan(0);
    
  
      });
    });
  });
  