---
title: MetaBind Inline Input Test
---

# MetaBind Inline Input Test

This page shows examples of MetaBind inline inputs.

## Standard Code Block Input

```meta-bind
INPUT[text:example_input]
```

## Inline Input Examples

Here's a question with an inline input field: What is 2+2? `INPUT[text(answer):user_answers.q1]`

Another question 39: `INPUT[text(showcase):user_answers.q39]`

Multiple inputs on one line: `INPUT[text(first):user_answers.first]` and `INPUT[text(second):user_answers.second]`

## JSON View Example

```meta-bind-js-view
{user_answers.q1} as answer1
{user_answers.q39} as answer39
{user_answers.first} as first
{user_answers.second} as second
---
return `
<div>
  <h3>Your Answers:</h3>
  <ul>
    <li>Answer to 2+2: ${context.bound.answer1 || 'Not answered'}</li>
    <li>Answer to Q39: ${context.bound.answer39 || 'Not answered'}</li>
    <li>First: ${context.bound.first || 'Not provided'}</li>
    <li>Second: ${context.bound.second || 'Not provided'}</li>
  </ul>
</div>
`
``` 