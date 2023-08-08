describe("Trying to complete an already completed task is unsuccessful", () => { 

    it("should give a response of 200 and array has been populated once Task 2 has been marked as completed", () => {

        //Get the response of Task 2 which is already completed
        cy.request({
          method: "GET",
          url: "http://localhost:8080/todo?complete=true", 
        }).then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body.length).to.equal(1)
        });
      });
    
      it("should give a response of 200 when a PUT request marks Task 2 as Complete", () => {
        const uuid = 'f360ba09-4682-448b-b32f-0a9e538502fa';
        cy.request({
          method: "PUT",
          url: `http://localhost:8080/todo/completed/${uuid}`, 
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
          expect(response.body).to.have.length.greaterThan(0)
        });
    });
});