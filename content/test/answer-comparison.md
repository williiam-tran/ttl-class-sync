---
title: Answer Comparison Test
publish: true
answers:
  q1: Paris
  q2: 42
  q3: Leonardo da Vinci
  q39: cognitive behavior therapy
---

# Answer Comparison Test

This example demonstrates comparing user answers with correct answers from frontmatter.

## Questions

1. What is the capital of France? `INPUT[text(Answer):user_answers.q1]`

2. What is the answer to life, the universe, and everything? `INPUT[text(Answer):user_answers.q2]`

3. Who painted the Mona Lisa? `INPUT[text(Answer):user_answers.q3]`

4. Question 39: `INPUT[text(Answer):user_answers.q39]`

## Answer Check

```meta-bind-js-view
{user_answers.q1} as userAnswer1
{user_answers.q2} as userAnswer2
{user_answers.q3} as userAnswer3
{user_answers.q39} as userAnswer39
---
// Get the correct answers from frontmatter
const correctAnswers = context.page?.answers || {};

// Helper function to check if answer is correct (case insensitive)
function isCorrect(userAnswer, correctAnswer) {
  if (!userAnswer || !correctAnswer) return false;
  return userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
}

// Function to format answer status
function getStatusHtml(userAnswer, correctAnswer) {
  if (!userAnswer) return '❌ Not answered';
  if (isCorrect(userAnswer, correctAnswer)) {
    return '✅ Correct';
  } else {
    return `❌ Incorrect (correct: ${correctAnswer})`;
  }
}

return `
<div class="answer-comparison">
  <h3>Answer Check</h3>
  <table>
    <thead>
      <tr>
        <th>Question</th>
        <th>Your Answer</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Q1: Capital of France</td>
        <td>${context.bound.userAnswer1 || 'Not answered'}</td>
        <td>${getStatusHtml(context.bound.userAnswer1, correctAnswers.q1)}</td>
      </tr>
      <tr>
        <td>Q2: Life, Universe, Everything</td>
        <td>${context.bound.userAnswer2 || 'Not answered'}</td>
        <td>${getStatusHtml(context.bound.userAnswer2, correctAnswers.q2)}</td>
      </tr>
      <tr>
        <td>Q3: Mona Lisa</td>
        <td>${context.bound.userAnswer3 || 'Not answered'}</td>
        <td>${getStatusHtml(context.bound.userAnswer3, correctAnswers.q3)}</td>
      </tr>
      <tr>
        <td>Q39</td>
        <td>${context.bound.userAnswer39 || 'Not answered'}</td>
        <td>${getStatusHtml(context.bound.userAnswer39, correctAnswers.q39)}</td>
      </tr>
    </tbody>
  </table>
  
  <div class="score-summary">
    <h4>Score Summary</h4>
    <p>Total Score: <strong>${[
      isCorrect(context.bound.userAnswer1, correctAnswers.q1),
      isCorrect(context.bound.userAnswer2, correctAnswers.q2),
      isCorrect(context.bound.userAnswer3, correctAnswers.q3),
      isCorrect(context.bound.userAnswer39, correctAnswers.q39)
    ].filter(Boolean).length} / 4</strong></p>
  </div>
</div>`;
``` 