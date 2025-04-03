---
title: Answer Comparison Test
publish: true
answers:
  q1: Hello World
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

```test-results
``` 