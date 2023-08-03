describe("Trying to complete an already completed task is unsuccessful", () => { 

it("should give a response of 200 and array has been populated once Task 2 has been marked as completed", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:8080/todo?complete=true", 
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.length).to.equal(1)
    });
  });

  it("should give a response of 200 when a PUT request marks Task 2 as Complete", () => {
    cy.request({
      method: "PUT",
      url: "http://localhost:8080/todo/completed/fd5ff9df-f194-4c6e-966a-71b38f95e14f", 
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.success).to.equal(false)
      expect(response.body.message).to.equal('Task already marked complete.')
    });
  });

  it("should re-check that request gives a response of 200 and array still has value of 1", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:8080/todo?complete=true", 
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.length).to.equal(1)
    });
  });
});
