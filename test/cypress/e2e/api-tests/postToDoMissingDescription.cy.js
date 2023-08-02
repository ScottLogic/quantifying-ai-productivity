//No GenAI used - simply copy/paste job from previous Task
describe("POST Add Task Missing Description", () => {

it("should add Task with no description and return a response of 400", () => {
    cy.request({
      method: "POST", 
      url: "http://localhost:8080/todo/addTask?name=PostTask3&description=",  
      failOnStatusCode: false,}).then((response) => {
      expect(response.status).to.eq(400);
      const createdTimestamp = Math.floor(new Date(response.body.timestamp).getTime() / 1000);
      const submissionTime = new Date().getTime()/1000;
      expect(submissionTime - createdTimestamp).to.be.lessThan(5000);
      // The below supplied automatically by GitHub CoPilot
      if (response.body.error) {
        expect(response.body.error).to.eq("Bad Request");
      }
      if (response.body.path) {
        expect(response.body.path).to.eq("/todo/addTask?name=PostTask3&description=");
      }
    });
});
});
