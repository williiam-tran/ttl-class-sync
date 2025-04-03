import { createElement } from "preact";
import { visit } from "unist-util-visit";
import { QuartzTransformerPlugin } from "../../types";
import { BindTargetStorageType, PropAccess, PropPath } from "./BindTargetParser";
import { MetaBindQuartz } from "./MetaBindQuartz";
import { deepClone } from "./utils/utils";

/**
 * Global instance of MetaBindQuartz
 */
const metaBindInstance = new MetaBindQuartz();

/**
 * MetaBind transformer plugin for Quartz
 */
export const MetaBind: QuartzTransformerPlugin = () => {
  return {
    name: "MetaBind",
    markdownPlugins() {
      return [
        () => {
          return (tree, file) => {
            // Extract frontmatter metadata to be available for binding
            const frontmatter = file.data.frontmatter || {};
            console.log('[MetaBind Debug] Processing file:', file.data.filePath);
            console.log('[MetaBind Debug] Frontmatter:', frontmatter);
            
            file.data.metaBind = {
              metadata: frontmatter,
              answers: (frontmatter as any).answers || {} // Type cast to avoid linter error
            };
            
            console.log('[MetaBind Debug] MetaBind data:', file.data.metaBind);

            // Store in global cache for access by components
            if (typeof window !== 'undefined' && window._quartzMetaBindCache && file.data.filePath) {
              window._quartzMetaBindCache.frontmatter[file.data.filePath] = deepClone(frontmatter);
            }

            // Transform meta-bind code blocks
            visit(tree, "code", (node: any) => {
              if (node.lang === "meta-bind") {
                node.type = "html";
                const content = node.value.trim();
                const isInput = content.startsWith("INPUT[");
                
                if (isInput) {
                  // Parse target path
                  const match = content.match(/INPUT\[text:([^\]]+)\]/);
                  if (match) {
                    const path = match[1];
                    // Convert to div with data attributes
                    node.value = `<div class="meta-bind-input" data-bind-target="${path}" data-type="text"></div>`;
                  }
                }
              } else if (node.lang === "meta-bind-js-view") {
                node.type = "html";
                // For JS view fields, we'll need to extract bind paths and create a display div
                const lines = node.value.split("\n");
                const bindingSection = [];
                const scriptSection = [];
                
                let inScript = false;
                for (const line of lines) {
                  if (line.trim() === "---") {
                    inScript = true;
                    continue;
                  }
                  
                  if (!inScript) {
                    bindingSection.push(line);
                  } else {
                    scriptSection.push(line);
                  }
                }
                
                // Parse bindings
                const bindings: Record<string, string> = {};
                for (const line of bindingSection) {
                  const match = line.match(/{([^}]+)} as ([a-zA-Z0-9_]+)/);
                  if (match) {
                    const path = match[1];
                    const name = match[2];
                    bindings[name] = path;
                  }
                }
                
                // Create a display element with the bindings and script
                node.value = `<div class="meta-bind-js-view" 
                  data-bindings="${JSON.stringify(bindings).replace(/"/g, '&quot;')}"
                  data-script="${scriptSection.join("\n").replace(/"/g, '&quot;')}">
                </div>`;
              }
            });

            // Transform inline INPUT syntax in paragraphs
            visit(tree, "paragraph", (node: any) => {
              if (!node.children) return;
              
              for (let i = 0; i < node.children.length; i++) {
                const child = node.children[i];
                if (child.type === "text" && child.value) {
                  // Check for INPUT syntax
                  const regex = /INPUT\[([a-zA-Z]+)(?:\(([^)]+)\))?:([^\]]+)\]/g;
                  if (regex.test(child.value)) {
                    // Replace each occurrence with HTML
                    child.type = "html";
                    child.value = child.value.replace(
                      regex,
                      (match: string, type: string, display: string, target: string) => {
                        return `<span class="meta-bind-inline-input" data-bind-target="${target}" data-type="${type}" ${display ? `data-display="${display}"` : ""}></span>`;
                      }
                    );
                  }
                }
              }
            });
            
            // Transform INPUT syntax in inline code blocks
            visit(tree, "inlineCode", (node: any) => {
              if (!node.value) return;
              
              // Check if the code block contains INPUT syntax
              const regex = /^INPUT\[([a-zA-Z]+)(?:\(([^)]+)\))?:([^\]]+)\]$/;
              const match = node.value.match(regex);
              
              if (match) {
                const type = match[1]; // e.g., "text"
                const display = match[2] || ""; // e.g., "showcase" 
                const target = match[3]; // e.g., "user_answers.q39"
                
                // Convert to inline HTML
                node.type = "html";
                node.value = `<span class="meta-bind-inline-input" data-bind-target="${target}" data-type="${type}" ${display ? `data-display="${display}"` : ""}></span>`;
              }
            });
          };
        }
      ];
    },
    externalResources() {
      return {
        css: [
          {
            content: `
            .meta-bind-input {
              background-color: #1e1e1e;
              display: inline-block;
              padding: 8px;
              border-radius: 4px;
              min-width: 200px;
              margin: 5px 0;
            }
            
            .meta-bind-inline-input input {
              background-color: #1e1e1e;
              display: inline-block;
              margin: 0 2px;
            }
            
            .meta-bind-inline-text-input {
              background-color: #1e1e1e;
              padding: 2px 5px;
              border-radius: 4px;
              font-size: 2rem;
              width: auto;
              min-width: 100px;
            }
            
            .meta-bind-js-view {
              margin: 10px 0;
            }
            
            .meta-bind-js-view table {
              border-collapse: collapse;
              width: 100%;
              margin: 10px 0;
            }
            
            .meta-bind-js-view th, .meta-bind-js-view td {
              border: 1px solid var(--border);
              padding: 8px;
              text-align: left;
            }
            
            .meta-bind-js-view th {
              background-color: var(--bg);
            }
            
            .meta-bind-input.invalid input,
            .meta-bind-inline-input.invalid input {
              border-color: #ff6b6b;
              background-color: rgba(255, 107, 107, 0.1);
            }
            
            .validation-message {
              color: #ff6b6b;
              font-size: 0.8em;
              margin-top: 2px;
            }
            
            /* Answer comparison styles */
            .answer-comparison table {
              width: 100%;
              border-collapse: collapse;
              margin: 1rem 0;
            }
            
            .answer-comparison th,
            .answer-comparison td {
              border: 1px solid var(--border);
              padding: 8px;
            }
            
            .answer-comparison th {
              background-color: var(--bg);
              text-align: left;
            }
            
            .score-summary {
              background-color: var(--bg);
              padding: 10px;
              border-radius: 4px;
              margin-top: 1rem;
            }
            
            .score-summary h4 {
              margin-top: 0;
              margin-bottom: 0.5rem;
            }
            `
          }
        ],
        js: [
          {
            script: `
            document.addEventListener('DOMContentLoaded', function() {
              console.log('[MetaBind Client] DOMContentLoaded event fired');
              
              // Get frontmatter data
              const metaBindDataEl = document.querySelector('meta[name="meta-bind-data"]');
              console.log('[MetaBind Client] Meta tag element:', metaBindDataEl);
              
              const metaBindContent = metaBindDataEl ? metaBindDataEl.getAttribute('content') : null;
              console.log('[MetaBind Client] Meta tag content:', metaBindContent);
              
              const metaBindData = metaBindDataEl ? JSON.parse(metaBindDataEl.getAttribute('content') || '{}') : {};
              console.log('[MetaBind Client] Parsed metaBindData:', metaBindData);
              
              // Extract frontmatter and answers
              const frontmatter = metaBindData.metadata || {};
              const answers = metaBindData.answers || {};
              
              console.log('[MetaBind Client] Extracted frontmatter:', frontmatter);
              console.log('[MetaBind Client] Extracted answers:', answers);

              // Initialize cache if not already done
              if (!window._quartzMetaBindCache) {
                window._quartzMetaBindCache = { frontmatter: {}, user_answers: {} };
              }
              
              // Helper function to get value from path
              function getValueFromPath(obj, path) {
                const parts = path.split('.');
                let value = obj;
                for (const part of parts) {
                  value = value && typeof value === 'object' ? value[part] : undefined;
                }
                return value;
              }
              
              // Helper function to set value at path
              function setValueAtPath(obj, path, value) {
                const parts = path.split('.');
                let current = obj;
                
                // Navigate to the parent object
                for (let i = 0; i < parts.length - 1; i++) {
                  const part = parts[i];
                  if (!current[part]) {
                    current[part] = {};
                  }
                  current = current[part];
                }
                
                // Set the value
                if (parts.length > 0) {
                  current[parts[parts.length - 1]] = value;
                }
              }
              
              // Basic validation functions
              const validations = {
                // Validate if input is not empty
                required: (value) => {
                  return value && value.trim() !== '' ? null : 'This field is required';
                },
                // Validate if input is a number
                number: (value) => {
                  return !isNaN(parseFloat(value)) && isFinite(value) ? null : 'Please enter a valid number';
                },
                // Validate if input is an email
                email: (value) => {
                  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  return regex.test(value) ? null : 'Please enter a valid email address';
                }
              };
              
              // Process both regular and inline input fields
              function processInputField(el, isInline) {
                const bindTarget = el.getAttribute('data-bind-target');
                const type = el.getAttribute('data-type');
                const display = el.getAttribute('data-display');
                const validation = el.getAttribute('data-validation') || '';
                
                // Create input element
                const input = document.createElement('input');
                input.type = 'text';
                input.className = isInline ? 'meta-bind-inline-text-input' : 'meta-bind-text-input';
                input.placeholder = display || bindTarget;
                
                // Get initial value from frontmatter if available
                const filePath = window.location.pathname.replace(/\\/$/, '');
                let value = getValueFromPath(window._quartzMetaBindCache?.frontmatter[filePath] || {}, bindTarget);
                
                // If not in cache, try frontmatter
                if (value === undefined) {
                  value = getValueFromPath(frontmatter, bindTarget);
                }
                
                if (value !== undefined) {
                  input.value = value;
                }
                
                // Add input to container
                el.appendChild(input);
                
                // Create validation message element if validation is specified
                let validationMessage = null;
                if (validation) {
                  validationMessage = document.createElement('div');
                  validationMessage.className = 'validation-message';
                  validationMessage.style.display = 'none';
                  el.appendChild(validationMessage);
                }
                
                // Function to validate input
                const validateInput = () => {
                  if (!validation || !validations[validation]) return true;
                  
                  const error = validations[validation](input.value);
                  if (error) {
                    el.classList.add('invalid');
                    if (validationMessage) {
                      validationMessage.textContent = error;
                      validationMessage.style.display = 'block';
                    }
                    return false;
                  } else {
                    el.classList.remove('invalid');
                    if (validationMessage) {
                      validationMessage.style.display = 'none';
                    }
                    return true;
                  }
                };
                
                // Add event listener
                input.addEventListener('input', e => {
                  // Validate input
                  validateInput();
                  
                  // Update cache
                  const target = e.target;
                  if (!target) return;
                  
                  const value = target.value;
                  const filePath = window.location.pathname.replace(/\\/$/, '');
                  
                  if (!window._quartzMetaBindCache.frontmatter[filePath]) {
                    window._quartzMetaBindCache.frontmatter[filePath] = {};
                  }
                  
                  setValueAtPath(window._quartzMetaBindCache.frontmatter[filePath], bindTarget, value);
                  
                  console.log('Meta Bind value changed:', bindTarget, value);
                  
                  // Update any JS view fields that depend on this value
                  document.querySelectorAll('.meta-bind-js-view').forEach(view => {
                    const bindingsStr = view.getAttribute('data-bindings');
                    if (!bindingsStr) return;
                    
                    const bindings = JSON.parse(bindingsStr);
                    let shouldUpdate = false;
                    
                    // Check if any binding matches the changed path
                    for (const key in bindings) {
                      if (bindings[key] === bindTarget) {
                        shouldUpdate = true;
                        break;
                      }
                    }
                    
                    if (shouldUpdate) {
                      // Trigger update of the view
                      const event = new CustomEvent('meta-bind-update');
                      view.dispatchEvent(event);
                    }
                  });

                  // Special handling for user_answers paths to ensure they're saved correctly
                  if (bindTarget.startsWith('user_answers.')) {
                    if (!window._quartzMetaBindCache.user_answers) {
                      window._quartzMetaBindCache.user_answers = {};
                    }
                    const userAnswerKey = bindTarget.substring('user_answers.'.length);
                    window._quartzMetaBindCache.user_answers[userAnswerKey] = value;
                  }
                });
                
                // Initial validation
                validateInput();
              }
              
              // Process standard input fields
              document.querySelectorAll('.meta-bind-input').forEach(el => {
                processInputField(el, false);
              });
              
              // Process inline input fields
              document.querySelectorAll('.meta-bind-inline-input').forEach(el => {
                processInputField(el, true);
              });
              
              // Process JS view fields
              document.querySelectorAll('.meta-bind-js-view').forEach(el => {
                const updateView = () => {
                  try {
                    console.log('[MetaBind View] Updating JS view');
                    
                    const bindingsStr = el.getAttribute('data-bindings');
                    const scriptStr = el.getAttribute('data-script');
                    
                    console.log('[MetaBind View] data-bindings:', bindingsStr);
                    console.log('[MetaBind View] data-script:', scriptStr);
                    
                    if (!bindingsStr || !scriptStr) return;
                    
                    const bindings = JSON.parse(bindingsStr);
                    console.log('[MetaBind View] Parsed bindings:', bindings);
                    
                    // Create context object similar to Meta Bind
                    const context = {
                      bound: {},
                      page: JSON.parse(JSON.stringify(frontmatter || {})), // Clone to avoid reference issues
                      answers: answers // Pass answers directly to the context
                    };
                    
                    console.log('[MetaBind View] Initial context:', {
                      page: context.page,
                      answers: context.answers,
                      frontmatter
                    });
                    
                    // Get values from frontmatter/cache
                    Object.keys(bindings).forEach(key => {
                      const path = bindings[key];
                      // Extract path components
                      const parts = path.split('.');
                      
                      // Look up value in cache or frontmatter
                      const filePath = window.location.pathname.replace(/\\/$/, '');
                      let cache = window._quartzMetaBindCache?.frontmatter[filePath] || {};
                      let value = cache;
                      
                      for (const part of parts) {
                        value = value && typeof value === 'object' ? value[part] : undefined;
                      }
                      
                      if (value === undefined) {
                        // Try frontmatter
                        value = frontmatter;
                        for (const part of parts) {
                          value = value && typeof value === 'object' ? value[part] : undefined;
                        }
                      }
                      
                      context.bound[key] = value;
                      console.log('[MetaBind View] Bound ' + key + ' to value:', value);
                    });
                    
                    console.log('[MetaBind View] Final bound values:', context.bound);
                    console.log('[MetaBind View] Final context object:', context);
                    
                    // Add a minimal markdown engine
                    const engine = {
                      markdown: {
                        create: (markdown) => {
                          return markdown;
                        }
                      }
                    };
                    
                    // Execute the script with the context
                    let script = scriptStr.trim();
                    // Check if the script already starts with 'return'
                    let functionBody;
                    if (script.startsWith('return')) {
                      functionBody = script;
                    } else {
                      functionBody = 'return ' + script;
                    }
                    
                    const result = new Function('context', 'engine', functionBody)(context, engine);
                    
                    // Display the result
                    el.innerHTML = '<div class="meta-bind-result">' + result + '</div>';
                  } catch (error) {
                    console.error('Error processing meta-bind-js-view:', error);
                    el.innerHTML = '<div class="meta-bind-error">Error: ' + error.message + '</div>';
                  }
                };
                
                // Initial update
                updateView();
                
                // Listen for updates
                el.addEventListener('meta-bind-update', updateView);
              });
            });
            `,
            loadTime: "afterDOMReady",
            contentType: "inline"
          }
        ],
        additionalHead: [
          (pageData: any) => {
            // Make sure we're passing the full frontmatter data
            const metaBind = pageData.metaBind || {};
            console.log('[MetaBind Debug] additionalHead pageData:', pageData);
            console.log('[MetaBind Debug] additionalHead metaBind:', metaBind);
            
            const metaBindData = {
              metadata: metaBind.metadata || pageData.frontmatter || {},
              answers: metaBind.answers || (pageData.frontmatter as any)?.answers || {}
            };
            
            console.log('[MetaBind Debug] additionalHead metaBindData:', metaBindData);
            
            return createElement("meta", {
              name: "meta-bind-data",
              content: JSON.stringify(metaBindData)
            });
          }
        ]
      };
    }
  };
};

/**
 * Get the MetaBindQuartz instance
 */
export function getMetaBindInstance(): MetaBindQuartz {
  return metaBindInstance;
}

export { BindTargetStorageType, MetaBindQuartz, PropAccess, PropPath };
