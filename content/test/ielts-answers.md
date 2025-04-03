---
title: IELTS Test Answer Check
publish: true
answers:
  q31: Zeno
  q32: personal
  q33: I do control
  q34: a different perspective
  q35: Seneca
  q36: translated Marcus Aurelius' works
  q37: Cognitive Behaviour Therapy
  q38: hello
  q39: world
---

# IELTS Test Answer Check

This example shows how to check IELTS test answers against the correct answers in frontmatter.

## Test Questions

31. Who founded Stoicism? `INPUT[text(Answer):user_answers.q31]`

32. What type of journals did Marcus Aurelius keep? `INPUT[text(Answer):user_answers.q32]`

33. Complete the phrase from Stoicism: "________________ what I can control" `INPUT[text(Answer):user_answers.q33]`

34. What did Epictetus suggest we should try to gain? `INPUT[text(Answer):user_answers.q34]`

35. Which Stoic philosopher was an advisor to Emperor Nero? `INPUT[text(Answer):user_answers.q35]`

36. What achievement is attributed to Arrian? `INPUT[text(Answer):user_answers.q36]`

37. What modern therapy is influenced by Stoicism? `INPUT[text(Answer):user_answers.q37]`

38. First test word? `INPUT[text(Answer):user_answers.q38]`

39. Second test word? `INPUT[text(Answer):user_answers.q39]`

## Answer Check

```meta-bind-js-view
{user_answers.q31} as q31
{user_answers.q32} as q32
{user_answers.q33} as q33
{user_answers.q34} as q34
{user_answers.q35} as q35
{user_answers.q36} as q36
{user_answers.q37} as q37
{user_answers.q38} as q38
{user_answers.q39} as q39
---
// Get the correct answers - they should be directly available in context.answers
const correctAnswers = context.answers;
console.log('IELTS Answer Check - context:', context);
console.log('IELTS Answer Check - answers:', correctAnswers);

// User's answers from bound values
const userAnswers = {
  q31: context.bound.q31,
  q32: context.bound.q32,
  q33: context.bound.q33,
  q34: context.bound.q34,
  q35: context.bound.q35,
  q36: context.bound.q36,
  q37: context.bound.q37,
  q38: context.bound.q38,
  q39: context.bound.q39
};

// Helper function to check if answer is correct (case insensitive)
function isCorrect(userAnswer, correctAnswer) {
  if (!userAnswer || !correctAnswer) return false;
  return userAnswer.toLowerCase().trim() === correctAnswer.toString().toLowerCase().trim();
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

// Generate table rows for all questions
const tableRows = Object.keys(correctAnswers).map(qNum => {
  const userAnswer = userAnswers[qNum] || '';
  const correctAnswer = correctAnswers[qNum];
  return `
    <tr>
      <td>Question ${qNum.replace('q', '')}</td>
      <td>${userAnswer || 'Not answered'}</td>
      <td>${getStatusHtml(userAnswer, correctAnswer)}</td>
    </tr>
  `;
}).join('');

// Calculate total score
const totalCorrect = Object.keys(correctAnswers).filter(qNum => 
  isCorrect(userAnswers[qNum], correctAnswers[qNum])
).length;

return `
<div class="answer-comparison">
  <h3>IELTS Test Answer Check</h3>
  <table>
    <thead>
      <tr>
        <th>Question</th>
        <th>Your Answer</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${tableRows}
    </tbody>
  </table>
  
  <div class="score-summary">
    <h4>Score Summary</h4>
    <p>Your Score: <strong>${totalCorrect} / ${Object.keys(correctAnswers).length}</strong></p>
    <p>Percentage: <strong>${Math.round((totalCorrect / Object.keys(correctAnswers).length) * 100)}%</strong></p>
  </div>
</div>`;