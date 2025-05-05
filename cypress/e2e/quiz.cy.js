/// <reference types="cypress" />

describe('Quiz Component', () => {
  beforeEach(() => {
    cy.fixture('questions.json').then((questions) => {
      cy.intercept('GET', '/api/questions/random', { statusCode: 200, body: questions }).as('getQuestions');
    });
    cy.visit('/');
  });

  it('should display the start button on initial load', () => {
    cy.get('button').contains('Start Quiz').should('be.visible');
  });

  it('should fetch and display the first question when the quiz starts', () => {
    cy.get('button').contains('Start Quiz').click();
    cy.wait('@getQuestions');
    cy.get('h2').should('contain.text', "What's 2 + 2?");
    cy.get('.alert').should('have.length', 3); // 3 answer choices
  });

  it('should update the score and proceed to the next question on correct answer', () => {
    cy.get('button').contains('Start Quiz').click();
    cy.wait('@getQuestions');

    // Click the correct answer for the first question
    cy.get('.btn').eq(1).click(); // Correct answer index
    cy.get('h2').should('contain.text', "What's the capital of France?");
  });

  it('should display the final score after the last question', () => {
    cy.get('button').contains('Start Quiz').click();
    cy.wait('@getQuestions');

    // Answer both questions
    cy.get('.btn').eq(1).click(); // Correct answer for Q1
    cy.get('.btn').eq(1).click(); // Correct answer for Q2

    cy.get('h2').should('contain.text', 'Quiz Completed');
    cy.get('.alert').should('contain.text', 'Your score: 2/2');
  });

  it('should allow the user to restart the quiz', () => {
    cy.get('button').contains('Start Quiz').click();
    cy.wait('@getQuestions');

    // Complete the quiz
    cy.get('.btn').eq(1).click(); // Correct answer for Q1
    cy.get('.btn').eq(1).click(); // Correct answer for Q2

    cy.get('button').contains('Take New Quiz').click();
    cy.wait('@getQuestions');

    cy.get('h2').should('contain.text', "What's 2 + 2?");
    cy.get('.alert').should('have.length', 3); // 3 answer choices
  });
});