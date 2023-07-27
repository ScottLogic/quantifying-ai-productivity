//Request to Chat Gpt:
//write a cypress api test to check for response being 200 and also check that all fields are equal to the correct values. Additionally, log the number of milliseconds since the epoch and check that completed is equal to null and false

//Response from Chat Gpt:
// describe('API Test', () => {
//     it('should check the response status code and field values', () => {
//       cy.request({
//         method: 'GET',
//         url: 'https://api.example.com/data', // Replace with your API endpoint
//       }).then((response) => {
//         // Check if the response status code is 200
//         expect(response.status).to.eq(200);
  
//         // Check that all fields are equal to the correct values
//         // Replace 'field1', 'field2', etc. with the actual field names in the API response
//         expect(response.body.field1).to.eq('correct_value_1');
//         expect(response.body.field2).to.eq('correct_value_2');
//         // Add more expects for other fields as needed
  
//         // Log the number of milliseconds since the epoch
//         const epochMilliseconds = new Date().getTime();
//         cy.log(`Milliseconds since the epoch: ${epochMilliseconds}`);
  
//         // Check that completed is equal to null and false
//         expect(response.body.completed).to.eq(null);
//         expect(response.body.completed).to.eq(false);
//       });
//     });
//   });

describe('Test Experiment GET Task 5', () => {
    it('should validate API response is 200, check all fields have correct values, as well as log time since epoch and check that "completed" is equal to null and false', () => {
      cy.request({
        method: 'GET',
        url: 'http://localhost:8080/todo/5c3ec8bc-6099-1a2b-b6da-8e2956db3a34', 
      }).then((response) => {
         expect(response.status).to.eq(200);
        //NOTE HERE - DIFFERENT FORMAT FROM THE THE PREVIOUS TESTS
        expect(response.body.uuid).to.eq('00000000-0000-0000-0000-000000000000');
        expect(response.body.name).to.eq('Unknown Task');
        expect(response.body.description).to.eq('Unknown Task');
        expect(response.body.created).to.eq('1970-01-01T00:00:00.000Z');

        const epochMilliseconds = new Date().getTime();
        cy.log(`Milliseconds since the epoch: ${epochMilliseconds}`);
  
        expect(response.body.completed).to.eq(null);
        expect(response.body.complete).to.eq(false);
      });
    });
  });
  
  
