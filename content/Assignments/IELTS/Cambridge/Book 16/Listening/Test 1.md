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

online mp3
![alt text](https://ia802202.us.archive.org/15/items/cambridge-ielts-1-to-18-pdf-audio/5.%20Cambridge%20Books/Cambridge%20IELTS%2016/Cambridge%20IELTS%2016-Audio/Test%201%20Part%204.mp3)

<iframe scrolling="no" style="overflow: hidden;" src="https://ttl-s3.williamtran.tech/Week%204.pdf#view=FitV" frameborder="0"></iframe>

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

## Standard Code Block Input

```meta-bind
INPUT[text:example_input]
```

## Inline Input Examples

Here's a question with an inline input field: What is 2+2? `INPUT[text(answer):user_answers.q1]`

Another question 39: `INPUT[text(showcase):user_answers.q39]`

Multiple inputs on one line: `INPUT[text(first):user_answers.first]` and `INPUT[text(second):user_answers.second]`

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
