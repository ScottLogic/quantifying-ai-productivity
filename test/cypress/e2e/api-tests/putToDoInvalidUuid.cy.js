describe(" PUT Task with invalid UUID", () => {
 
    it("should give a response of 200 and a false for success when a PUT request cant find a task", () => {
      cy.request({
        method: "PUT",
        url: "http://localhost:8080/todo/completed/zebedee", 
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal('Bad Request')
        expect(response.body.path).to.equal('/todo/completed/zebedee')
      });
    });
});
