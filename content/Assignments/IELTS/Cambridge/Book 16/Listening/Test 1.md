---
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
user_answers:
  q31: zeno
  q38: hello
  q39: world
  q32: personal
  q37: wrong
  q33: h
---
## Part 1

### Questions 1 - 10
![[Resources/Audio/Cam 16/Test 1 Part 1.mp3|Test 1 Part 1]]
![[Resources/Cambridge/16/Test 1 - Part 1.pdf|Test 1 - Part 1]]

## Part 2
![[Resources/Audio/Cam 16/Test 1 Part 2.mp3|Test 1 Part 2]]

### Questions 11 - 14
![[Resources/Cambridge/16/Test 1 - Part 2 - 1.pdf|Test 1 - Part 2 - 1]]

### Questions 15 - 20
![[Resources/Cambridge/16/Test 1 - Part 2 - 2.pdf|Test 1 - Part 2 - 2]]

## Part 3
![[Resources/Audio/Cam 16/Test 1 Part 3.mp3|Test 1 Part 3]]

### Questions 21 - 24
![[Resources/Cambridge/16/Test 1 - Part 3 - 1.pdf|Test 1 - Part 3 - 1]]

### Questions 25 - 30
![[Resources/Cambridge/16/Test 1 - Part 3 - 3.pdf|Test 1 - Part 3 - 3]]

## Part 4

### Questions 31 - 40
![[Resources/Audio/Cam 16/Test 1 Part 4.mp3|Test 1 Part 4]]
![[Resources/Cambridge/16/Test 1 - Part 4.pdf|Test 1 - Part 4]]

### Your Answers

Question 31: `INPUT[text(showcase):user_answers.q31]`

Question 32: `INPUT[text(showcase):user_answers.q32]`

Question 33: `INPUT[text(showcase):user_answers.q33]`

Question 34: `INPUT[text(showcase):user_answers.q34]`

Question 35: `INPUT[text(showcase):user_answers.q35]`

Question 36: `INPUT[text(showcase):user_answers.q36]`

Question 37: `INPUT[text(showcase):user_answers.q37]`

Question 38: `INPUT[text(showcase):user_answers.q38]`

Question 39: `INPUT[text(showcase):user_answers.q39]`

# MetaBind Validation and Table View Test

This page shows examples of input validation and displaying data in a table.

## Input Questions

1. What is your name? `INPUT[text(Name):user_data.name]`

2. What is your age? `INPUT[text(Age):user_data.age]` 

3. What is your email? `INPUT[text(Email):user_data.email]`

4. Question 39: `INPUT[text(Answer):user_data.q39]`

## JSON View with Table

```meta-bind-js-view
{user_data.name} as name
{user_data.age} as age
{user_data.email} as email
{user_data.q39} as q39
---
return `
<div>
  <h3>Your Input Summary:</h3>
  <table>
    <thead>
      <tr>
        <th>Field</th>
        <th>Value</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Name</td>
        <td>${context.bound.name || 'Not provided'}</td>
        <td>${context.bound.name ? '✅' : '❌'}</td>
      </tr>
      <tr>
        <td>Age</td>
        <td>${context.bound.age || 'Not provided'}</td>
        <td>${!isNaN(context.bound.age) ? '✅' : '❌'}</td>
      </tr>
      <tr>
        <td>Email</td>
        <td>${context.bound.email || 'Not provided'}</td>
        <td>${context.bound.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(context.bound.email) ? '✅' : '❌'}</td>
      </tr>
      <tr>
        <td>Question 39</td>
        <td>${context.bound.q39 || 'Not answered'}</td>
        <td>${context.bound.q39 ? '✅' : '❌'}</td>
      </tr>
    </tbody>
  </table>
</div>
`
``` 

## Answer Check

```meta-bind-js-view
{user_answers.q31} as userAnswer31
{user_answers.q32} as userAnswer32
{user_answers.q33} as userAnswer33
{user_answers.q34} as userAnswer34
{user_answers.q35} as userAnswer35
{user_answers.q36} as userAnswer36
{user_answers.q37} as userAnswer37
{user_answers.q38} as userAnswer38
{user_answers.q39} as userAnswer39
---
var html = '<div class="answer-comparison"><h3>Answer Check</h3><table><thead><tr><th>Question</th><th>Your Answer</th><th>Correct Answer</th><th>Status</th></tr></thead><tbody>';

// Get answers from frontmatter
var answers = context.page?.answers || {};

// Helper function to check answer
function checkAnswer(userAnswer, correctAnswer) {
  if (!userAnswer) return '❌ Not answered';
  if (userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()) {
    return '✅ Correct';
  }
  return '❌ Incorrect';
}

// Add rows for each question
html += '<tr><td>Q31</td><td>' + (context.bound.userAnswer31 || '-') + '</td><td>' + answers.q31 + '</td><td>' + checkAnswer(context.bound.userAnswer31, answers.q31) + '</td></tr>';
html += '<tr><td>Q32</td><td>' + (context.bound.userAnswer32 || '-') + '</td><td>' + answers.q32 + '</td><td>' + checkAnswer(context.bound.userAnswer32, answers.q32) + '</td></tr>';
html += '<tr><td>Q33</td><td>' + (context.bound.userAnswer33 || '-') + '</td><td>' + answers.q33 + '</td><td>' + checkAnswer(context.bound.userAnswer33, answers.q33) + '</td></tr>';
html += '<tr><td>Q34</td><td>' + (context.bound.userAnswer34 || '-') + '</td><td>' + answers.q34 + '</td><td>' + checkAnswer(context.bound.userAnswer34, answers.q34) + '</td></tr>';
html += '<tr><td>Q35</td><td>' + (context.bound.userAnswer35 || '-') + '</td><td>' + answers.q35 + '</td><td>' + checkAnswer(context.bound.userAnswer35, answers.q35) + '</td></tr>';
html += '<tr><td>Q36</td><td>' + (context.bound.userAnswer36 || '-') + '</td><td>' + answers.q36 + '</td><td>' + checkAnswer(context.bound.userAnswer36, answers.q36) + '</td></tr>';
html += '<tr><td>Q37</td><td>' + (context.bound.userAnswer37 || '-') + '</td><td>' + answers.q37 + '</td><td>' + checkAnswer(context.bound.userAnswer37, answers.q37) + '</td></tr>';
html += '<tr><td>Q38</td><td>' + (context.bound.userAnswer38 || '-') + '</td><td>' + answers.q38 + '</td><td>' + checkAnswer(context.bound.userAnswer38, answers.q38) + '</td></tr>';
html += '<tr><td>Q39</td><td>' + (context.bound.userAnswer39 || '-') + '</td><td>' + answers.q39 + '</td><td>' + checkAnswer(context.bound.userAnswer39, answers.q39) + '</td></tr>';

// Count correct answers
var score = 0;
if (context.bound.userAnswer31 && context.bound.userAnswer31.toLowerCase().trim() === answers.q31.toLowerCase().trim()) score++;
if (context.bound.userAnswer32 && context.bound.userAnswer32.toLowerCase().trim() === answers.q32.toLowerCase().trim()) score++;
if (context.bound.userAnswer33 && context.bound.userAnswer33.toLowerCase().trim() === answers.q33.toLowerCase().trim()) score++;
if (context.bound.userAnswer34 && context.bound.userAnswer34.toLowerCase().trim() === answers.q34.toLowerCase().trim()) score++;
if (context.bound.userAnswer35 && context.bound.userAnswer35.toLowerCase().trim() === answers.q35.toLowerCase().trim()) score++;
if (context.bound.userAnswer36 && context.bound.userAnswer36.toLowerCase().trim() === answers.q36.toLowerCase().trim()) score++;
if (context.bound.userAnswer37 && context.bound.userAnswer37.toLowerCase().trim() === answers.q37.toLowerCase().trim()) score++;
if (context.bound.userAnswer38 && context.bound.userAnswer38.toLowerCase().trim() === answers.q38.toLowerCase().trim()) score++;
if (context.bound.userAnswer39 && context.bound.userAnswer39.toLowerCase().trim() === answers.q39.toLowerCase().trim()) score++;

html += '</tbody></table>';
html += '<div class="score-summary"><h4>Score Summary</h4><p>Total Score: <strong>' + score + ' / 9</strong></p></div>';
html += '</div>';

html
```

## Standard Code Block Input

### Transcript

> [!Info]- Part 4
> - Specifically, I am referring to Stoicism, which, in my opinion, is the most practical of all philosophies and therefore the most appealing. ==Zeno== (31) of Citium in the early 3rd century BC, but was practised by the likes of Epictetus, Cato.
> - Amazingly, we still have access to these ideas, despite the fact that the most famous Stoics never wrote anything down for publication. Cato definitely didn't. ==personal== (32)
> - The road to virtue, in turn, lay in understanding that destructive emotions, like anger and jealousy, are under our conscious control — they don't have to control us, because we can learn to control them. In the words of Epictetus: "==I do control== (33)".
> - The modern day philosopher and writer Nassim Nicholas Taleb defines a Stoic as someone who has ==a different perspective== (34) on experiences which most of us would see as wholly negative.
> - The founding fathers of the United States were inspired by the philosophy. George Washington was introduced to Stoicism by his neighbours at age seventeen, and later, put on a play based on the life of Cato to inspire his men. ==Seneca== (35)
> - The economist Adam Smith's theories on capitalism were significantly influenced by the Stoicism that he studied as a schoolboy, under a teacher who had ==translated Marcus Aurelius' works== (36).
> - Stoicism had a profound influence on Albert Ellis, who invented ==Cognitive Behaviour Therapy== (37), which is used to help people manage their problems by changing the way that they think and behave.
> - Stoicism has also become popular in the world of business. Stoic principles can build the resilience and state of mind required to overcome setbacks because Stoics teach ==turning obstacles into opportunity== (38).
> - The Stoics also believed the most important foundation for a good and happy life is not money, fame, power or pleasure, but having ==a disciplined and principled character== (39).
