// Get Endpoints Test Task 5


describe('API Test_Get: Task Not Found', () => {
    it('should retrieve an unknown task when no task is found', () => {
      cy.request('GET', 'http://localhost:8080/todo/5c3ec8bc-6099-1a2b-b6da-8e2956db3a34')
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.uuid).to.eq('00000000-0000-0000-0000-000000000000');
          expect(response.body.name).to.eq('Unknown Task');
          expect(response.body.description).to.eq('Unknown Task');
          expect(response.body.created).to.eq('1970-01-01T00:00:00.000Z');
          expect(response.body.completed).to.eq(null);
          expect(response.body.complete).to.eq(false);
        });
    });
  });
  