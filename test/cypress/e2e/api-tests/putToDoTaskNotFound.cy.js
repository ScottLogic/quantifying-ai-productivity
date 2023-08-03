describe(" PUT Task not found", () => {
 
    it("should give a response of 200 and a false for success when a PUT request cant find a task", () => {
      cy.request({
        method: "PUT",
        url: "http://localhost:8080/todo/completed/fd5ff9df-f194-1a3b-966a-71b38f95e14f", 
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.success).to.equal(false)
        expect(response.body.message).to.equal('Task not found.')
      });
    });
});
