import { visit } from "unist-util-visit"
import { JSResource } from "../../util/resources"
import { QuartzTransformerPlugin } from "../types"

/**
 * TestResults transformer plugin for Quartz
 * This plugin transforms ```test-results``` code blocks into interactive answer comparison displays
 */
export const TestResults: QuartzTransformerPlugin = () => {
  return {
    name: "TestResults",
    markdownPlugins() {
      return [
        () => {
          return (tree, file) => {
            // Convert test-results code blocks to a special component
            visit(tree, "code", (node: any) => {
              if (node.lang === "test-results") {
                node.type = "html"
                node.value = `<div class="test-results-container"></div>`
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
              .test-results-container {
                margin: 2rem 0;
                padding: 1rem;
                border: 1px solid var(--border);
                border-radius: 0.5rem;
              }
              
              .test-results-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 1rem;
              }
              
              .test-results-table th,
              .test-results-table td {
                padding: 0.5rem;
                border: 1px solid var(--border);
                text-align: left;
              }
              
              .test-results-table th {
                background-color: var(--lightgray);
                font-weight: bold;
              }
              
              .test-results-status.correct {
                color: #4caf50;
                font-weight: bold;
              }
              
              .test-results-status.incorrect {
                color: #f44336;
              }
              
              .test-results-score {
                margin-top: 1rem;
                padding: 1rem;
                background-color: var(--lightgray);
                border-radius: 0.5rem;
                font-weight: bold;
              }
            `
          }
        ],
        js: [
          {
            script: `
              document.addEventListener('DOMContentLoaded', () => {
                const metaBindDataEl = document.querySelector('meta[name="meta-bind-data"]');
                if (!metaBindDataEl) return;
                
                function updateTestResults() {
                  try {
                    const metaBindData = JSON.parse(metaBindDataEl.getAttribute('content') || '{}');
                    const correctAnswers = metaBindData.answers || {};
                    const userAnswers = window._quartzMetaBindCache?.user_answers || {};
                    
                    console.log('[TestResults] Correct answers:', correctAnswers);
                    console.log('[TestResults] User answers:', userAnswers);
                    
                    document.querySelectorAll('.test-results-container').forEach(container => {
                      // If no answers, show message
                      if (Object.keys(correctAnswers).length === 0) {
                        container.innerHTML = '<div class="test-results-message">No answer data available in frontmatter.</div>';
                        return;
                      }
                      
                      // Create results table
                      let html = '<h3>Answer Check</h3>';
                      html += '<table class="test-results-table"><thead><tr><th>Question</th><th>Your Answer</th><th>Correct Answer</th><th>Status</th></tr></thead><tbody>';
                      
                      let score = 0;
                      const questionKeys = Object.keys(correctAnswers).sort();
                      
                      questionKeys.forEach(key => {
                        const userAnswer = userAnswers[key] || '';
                        const correctAnswer = correctAnswers[key] || '';
                        
                        const isCorrect = userAnswer.toLowerCase().trim() === correctAnswer.toString().toLowerCase().trim();
                        if (isCorrect) score++;
                        
                        const statusClass = isCorrect ? 'correct' : 'incorrect';
                        const statusText = isCorrect ? '✅ Correct' : '❌ Incorrect';
                        
                        html += \`<tr>
                          <td>Q\${key}</td>
                          <td>\${userAnswer || '-'}</td>
                          <td>\${correctAnswer}</td>
                          <td class="test-results-status \${statusClass}">\${statusText}</td>
                        </tr>\`;
                      });
                      
                      html += '</tbody></table>';
                      html += \`<div class="test-results-score">Total Score: <strong>\${score} / \${questionKeys.length}</strong></div>\`;
                      
                      container.innerHTML = html;
                    });
                  } catch (error) {
                    console.error('[TestResults] Error processing test results:', error);
                    document.querySelectorAll('.test-results-container').forEach(container => {
                      container.innerHTML = '<div class="test-results-error">Error processing test results.</div>';
                    });
                  }
                }
                
                // Initial update
                updateTestResults();
                
                // Listen for input events on the document to catch any MetaBind input changes
                document.addEventListener('input', (e) => {
                  if (e.target instanceof HTMLInputElement) {
                    const parent = e.target.closest('.meta-bind-input, .meta-bind-inline-input');
                    if (parent && parent.getAttribute('data-bind-target')?.startsWith('user_answers.')) {
                      // If this is a user_answers input, update the test results
                      setTimeout(updateTestResults, 50); // Small delay to ensure the cache is updated
                    }
                  }
                });
              });
            `,
            loadTime: "afterDOMReady",
            contentType: "inline"
          } as JSResource
        ]
      }
    }
  }
} 