---
publish: true
answers:
  q31: Hello
  q32: World
  q33: I do control
  q34: a different perspective
  q35: Seneca
  q36: translated Marcus Aurelius' works
  q37: Cognitive Behaviour Therapy
  q38: hello
  q39: world
user_answers:
  q31: hello
  q38: hello
  q39: world
  q32: iea
  q37: wrong
  q33: iea
  q2: ""
  q1: iea
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
## Student Answer - part 2
Question 1: `INPUT[text():user_answers.q1]`
Question 2: `INPUT[text():user_answers.q2]`

Question 31: `INPUT[text():user_answers.q31]`

Question 32: `INPUT[text(showcase):user_answers.q32]`

Question 33: `INPUT[text(showcase):user_answers.q33]`

Question 34: `INPUT[text(showcase):user_answers.q34]`

Question 35: `INPUT[text(showcase):user_answers.q35]`

Question 36: `INPUT[text(showcase):user_answers.q36]`

Question 37: `INPUT[text(showcase):user_answers.q37]`

Question 38: `INPUT[text(showcase):user_answers.q38]`

Question 39: `INPUT[text(showcase):user_answers.q39]`

### Check Your Answers
```ielts-answer```

```meta-bind-js-view
{user_answers.q31} as userAnswer31
{answers.q31} as correctAnswer31
{user_answers.q32} as userAnswer32
{answers.q32} as correctAnswer32
{user_answers.q33} as userAnswer33
{answers.q33} as correctAnswer33
{user_answers.q34} as userAnswer34
{answers.q34} as correctAnswer34
{user_answers.q35} as userAnswer35
{answers.q35} as correctAnswer35
{user_answers.q36} as userAnswer36
{answers.q36} as correctAnswer36
{user_answers.q37} as userAnswer37
{answers.q37} as correctAnswer37
{user_answers.q38} as userAnswer38
{answers.q38} as correctAnswer38
{user_answers.q39} as userAnswer39
{answers.q39} as correctAnswer39
---
const results = [
  {q: 31, user: context.bound.userAnswer31, correct: context.bound.correctAnswer31},
  {q: 32, user: context.bound.userAnswer32, correct: context.bound.correctAnswer32},
  {q: 33, user: context.bound.userAnswer33, correct: context.bound.correctAnswer33},
  {q: 34, user: context.bound.userAnswer34, correct: context.bound.correctAnswer34},
  {q: 35, user: context.bound.userAnswer35, correct: context.bound.correctAnswer35},
  {q: 36, user: context.bound.userAnswer36, correct: context.bound.correctAnswer36},
  {q: 37, user: context.bound.userAnswer37, correct: context.bound.correctAnswer37},
  {q: 38, user: context.bound.userAnswer38, correct: context.bound.correctAnswer38},
  {q: 39, user: context.bound.userAnswer39, correct: context.bound.correctAnswer39},
];

let markdown = "| Question | Your Answer | Correct Answer | Result |\n|----------|------------|---------------|--------|\n";

results.forEach(item => {
  const isCorrect = item.user && item.user.toLowerCase() === item.correct.toLowerCase();
  const result = isCorrect ? "✅" : "❌";
  markdown += `| ${item.q} | ${item.user || ""} | ${item.correct} | ${result} |\n`;
});

const score = results.filter(item => 
  item.user && item.user.toLowerCase() === item.correct.toLowerCase()
).length;

markdown += `\n**Your score: ${score}/${results.length}**`;

return engine.markdown.create(markdown);
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
