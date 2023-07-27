describe("Test Experiment GET Task 2", () => {
    it("should check response status is 200 and log response length", () => {
      cy.request({
        method: "GET",
        url: "http://localhost:8080/todo?complete=true", 
      }).then((response) => {
        expect(response.status).to.equal(200);

        cy.log(`Response length: ${JSON.stringify(response.body).length}`);
      });
    });
  });
