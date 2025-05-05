import Quiz from '../../client/src/components/Quiz'; // Adjust path as needed

describe('Quiz Component Tests', () => {
  beforeEach(() => {
    // Mount the Quiz component and mock API
    cy.intercept('GET', '/api/questions/random', { fixture: 'questions.json' }).as('getQuestions');
    // @ts-ignore
    cy.mount(<Quiz />);
  });

  it('should display the start button on initial load', () => {
    // Mount the Quiz component
    // @ts-ignore
    cy.mount(<Quiz />);

    // Check if the start button is visible
    cy.get('button').contains('Start Quiz').should('be.visible');
  });

  it('should fetch and display the first question when the quiz starts', () => {
    // Mount the Quiz component
    // @ts-ignore
    cy.mount(<Quiz />);

    // Click "Start Quiz" and wait for the API call
    cy.get('button').contains('Start Quiz').click();
    cy.wait('@getQuestions');

    // Verify the first question and its answers
    cy.get('h2').should('contain.text', "What's 2 + 2?");
    cy.get('.alert').should('have.length', 3);
  });

  it('should show the final score after quiz completion', () => {
    // Start the quiz
    cy.get('button').contains('Start Quiz').click();
    cy.wait('@getQuestions');

    // Answer the first question
    cy.get('h2').should('contain.text', "What's 2 + 2?");
    cy.get('button').contains('2').click(); // Click the correct answer (4)

    // Wait for the next question
    cy.get('h2').should('contain.text', "What's the capital of France?");
    cy.get('button').contains('2').click(); // Click the correct answer (Paris)

    // Verify the quiz completion screen
    cy.get('h2').should('contain.text', 'Quiz Completed');
    cy.get('.alert').should('contain.text', 'Your score: 2/2');
  });  
});