---
title: MetaBind Validation Test
---

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