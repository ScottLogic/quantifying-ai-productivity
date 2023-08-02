//chatGpt request:
//ChatGpt Response:
// Sample response containing a timestamp
// const response = {
//   timestamp: "2023-08-02T12:34:56.789Z"
// };

// // Convert the timestamp to seconds
// const timestampInSeconds = Math.floor(new Date(response.timestamp).getTime() / 1000);

// console.log(timestampInSeconds); // Output: 1679542096


describe("POST Add Task Missing Name and Description", () => {

    let initialLength
    let newLength
    let taskName = "";
    let taskDescription = "";
    let createdTaskId = null;
    // beforeEach(() => {
    //   // Make an API request and alias the response as 'apiResponse'
    //   cy.request('GET', 'http://localhost:8080/todo').as('apiResponse');
    // });

    //add task
    it("should add Task with no name or description and return a response of 400", () => {
        cy.request({
          method: "POST", 
          url: "http://localhost:8080/todo/addTask?name=&description=",  
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
            expect(response.body.path).to.eq("/todo/addTask?name=&description=");
          }
        });
    });
});
