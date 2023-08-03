//Chat Gpt Request:
//write a cypress api test to check for response being 200 and also log the length of the response
//Chat Gpt Response was:

// cypress/integration/api.spec.js

// describe("API Test", () => {
//     it("should check response status and log response length", () => {
//       cy.request({
//         method: "GET",
//         url: "https://api.example.com/data", // Replace with the actual API endpoint URL
//       }).then((response) => {
//         // Assertion: Check for response status 200
//         expect(response.status).to.equal(200);
  
//         // Log the length of the response
//         cy.log(`Response length: ${JSON.stringify(response.body).length}`);
//       });
//     });
//   });

describe("Test Experiment GET Task 3", () => {
    it("should check response status is 200 and log response length", () => {
      cy.request({
        method: "GET",
        url: "http://localhost:8080/todo?complete=false", 
      }).then((response) => {
        expect(response.status).to.equal(200);

        cy.log('Response length: ', response.body.length);
      });
    });
  });
