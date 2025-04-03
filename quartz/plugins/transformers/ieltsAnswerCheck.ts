import { createElement } from "preact"
import { visit } from "unist-util-visit"
import { Data } from "vfile"
import { JSResource } from "../../util/resources"
import { QuartzTransformerPlugin } from "../types"

export const IELTSAnswerCheck: QuartzTransformerPlugin = () => {
  return {
    name: "IELTSAnswerCheck",
    markdownPlugins() {
      return [
        () => {
          return (tree, file) => {
            // Extract answers from transcript
            const answers: {[key: string]: string} = {}
            visit(tree, "blockquote", (node: any) => {
              visit(node, "text", (textNode: any) => {
                const match = textNode.value.match(/==(.+?)== \((\d+)\)/)
                if (match) {
                  const [_, answer, index] = match
                  answers[index] = answer.trim()
                }
              })
            })

            // Store answers in file data for later use
            file.data.ieltsAnswers = answers
          }
        }
      ]
    },
    htmlPlugins() {
      return [
        () => {
          return (tree) => {
            // Add answer input fields before transcript
            visit(tree, "element", (node) => {
              if (node.tagName === "h3" && node.properties?.id === "transcript") {
                node.children.unshift({
                  type: "element",
                  tagName: "div",
                  properties: { className: ["ielts-answer-section"] },
                  children: [
                    {
                      type: "element",
                      tagName: "div",
                      properties: { className: ["ielts-answer-inputs"] },
                      children: []
                    }
                  ]
                })
              }
            })
          }
        }
      ]
    },
    externalResources() {
      return {
        css: [
          {
            content: `
              .ielts-answer-section {
                margin: 2rem 0;
                padding: 1rem;
                border: none;
                border-radius: 0.5rem;
                background-color: #1e1e1e;
              }
              .ielts-answer-inputs {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 1rem;
              }
              .ielts-answer-input {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                background-color: #1e1e1e;
              }
              .ielts-answer-input input {
                padding: 0.5rem;
                border: none;
                border-radius: 0.25rem;
                background: var(--bg);
                color: var(--text);
              }
              .ielts-answer-input.correct input {
                border-color: #4caf50;
              }
              .ielts-answer-input.incorrect input {
                border-color: #f44336;
              }
            `
          }
        ],
        js: [
          {
            script: `
              document.addEventListener('DOMContentLoaded', () => {
                const answers = JSON.parse(document.querySelector('meta[name="ielts-answers"]')?.content || '{}')
                const answerSection = document.querySelector('.ielts-answer-inputs')
                if (!answerSection) return

                Object.entries(answers).forEach(([index, answer]) => {
                  const div = document.createElement('div')
                  div.className = 'ielts-answer-input'
                  div.innerHTML = \`
                    <label>Answer \${index}:</label>
                    <input type="text" data-answer="\${answer}" data-index="\${index}">
                  \`
                  answerSection.appendChild(div)
                })

                answerSection.addEventListener('input', (e) => {
                  if (e.target instanceof HTMLInputElement) {
                    const correctAnswer = e.target.dataset.answer?.toLowerCase()
                    const userAnswer = e.target.value.toLowerCase()
                    e.target.parentElement?.classList.remove('correct', 'incorrect')
                    if (userAnswer && correctAnswer === userAnswer) {
                      e.target.parentElement?.classList.add('correct')
                    } else if (userAnswer) {
                      e.target.parentElement?.classList.add('incorrect')
                    }
                  }
                })
              })
            `,
            loadTime: "afterDOMReady",
            contentType: "inline"
          } as JSResource
        ],
        additionalHead: [
          (pageData: Data) => {
            return createElement("meta", {
              name: "ielts-answers",
              content: JSON.stringify((pageData as any).ieltsAnswers)
            })
          }
        ]
      }
    }
  }
} 