import { createElement } from "preact"
import { visit } from "unist-util-visit"
import { QuartzTransformerPlugin } from "../types"

interface Bindings {
  [key: string]: string
}

export const MetaBind: QuartzTransformerPlugin = () => {
  return {
    name: "MetaBind",
    textTransform(ctx, src) {
      // Pass through content unchanged
      return src
    },
    markdownPlugins() {
      return [
        () => {
          return (tree, file) => {
            // Extract frontmatter metadata to be available for binding
            const frontmatter = file.data.frontmatter || {}
            file.data.metaBind = {
              metadata: frontmatter
            }

            // Transform meta-bind code blocks
            visit(tree, "code", (node: any) => {
              if (node.lang === "meta-bind") {
                node.type = "html"
                const content = node.value.trim()
                const isInput = content.startsWith("INPUT[")
                
                if (isInput) {
                  // Parse target path - support both formats:
                  // INPUT[text:path] and INPUT[text():path]
                  const withPlaceholderMatch = content.match(/INPUT\[text:([^\]]+)\]/)
                  const withoutPlaceholderMatch = content.match(/INPUT\[text\(\):([^\]]+)\]/)
                  
                  if (withPlaceholderMatch) {
                    const path = withPlaceholderMatch[1]
                    // Convert to div with data attributes
                    node.value = `<div class="meta-bind-input" data-bind-target="${path}" data-type="text"></div>`
                  } else if (withoutPlaceholderMatch) {
                    const path = withoutPlaceholderMatch[1]
                    // Convert to div with data attributes, with no placeholder
                    node.value = `<div class="meta-bind-input" data-bind-target="${path}" data-type="text" data-no-placeholder="true"></div>`
                  }
                }
              } else if (node.lang === "meta-bind-js-view") {
                node.type = "html"
                // For JS view fields, we'll need to extract bind paths and create a display div
                const lines = node.value.split("\n")
                const bindingSection = []
                const scriptSection = []
                
                let inScript = false
                for (const line of lines) {
                  if (line.trim() === "---") {
                    inScript = true
                    continue
                  }
                  
                  if (!inScript) {
                    bindingSection.push(line)
                  } else {
                    scriptSection.push(line)
                  }
                }
                
                // Parse bindings
                const bindings: Bindings = {}
                for (const line of bindingSection) {
                  const match = line.match(/{([^}]+)} as ([a-zA-Z0-9_]+)/)
                  if (match) {
                    const path = match[1]
                    const name = match[2]
                    bindings[name] = path
                  }
                }
                
                // Create a display element with the bindings and script
                node.value = `<div class="meta-bind-js-view" 
                  data-bindings="${JSON.stringify(bindings).replace(/"/g, '&quot;')}"
                  data-script="${scriptSection.join("\n").replace(/"/g, '&quot;')}">
                </div>`
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
            .meta-bind-input {
              display: inline-block;
              padding: 8px;
              border: 1px solid var(--border);
              border-radius: 4px;
              background: var(--bg);
              min-width: 200px;
              margin: 5px 0;
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
            `
          }
        ],
        js: [
          {
            script: `
            document.addEventListener('DOMContentLoaded', function() {
              // Get frontmatter data
              const metaBindDataEl = document.querySelector('meta[name="meta-bind-data"]');
              const frontmatter = metaBindDataEl ? JSON.parse(metaBindDataEl.getAttribute('content') || '{}') : {};
              
              // Process input fields
              document.querySelectorAll('.meta-bind-input').forEach(el => {
                const bindTarget = el.getAttribute('data-bind-target');
                const type = el.getAttribute('data-type');
                const noPlaceholder = el.getAttribute('data-no-placeholder') === 'true';
                
                // Create input element
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'meta-bind-text-input';
                if (!noPlaceholder) {
                  input.placeholder = bindTarget;
                }
                
                // Get initial value from frontmatter if available
                const pathParts = bindTarget.split('.');
                let value = frontmatter;
                for (const part of pathParts) {
                  value = value && typeof value === 'object' ? value[part] : undefined;
                }
                if (value !== undefined) {
                  input.value = value;
                }
                
                // Add input to container
                el.appendChild(input);
                
                // Add event listener
                input.addEventListener('input', e => {
                  // In Quartz, we can only display the inputs, not save the data
                  console.log('Meta Bind value changed:', bindTarget, e.target.value);
                });
              });
              
              // Process JS view fields
              document.querySelectorAll('.meta-bind-js-view').forEach(el => {
                try {
                  const bindingsStr = el.getAttribute('data-bindings');
                  const scriptStr = el.getAttribute('data-script');
                  
                  if (!bindingsStr || !scriptStr) return;
                  
                  const bindings = JSON.parse(bindingsStr);
                  
                  // Create context object similar to Meta Bind
                  const context = {
                    bound: {}
                  };
                  
                  // Get values from frontmatter
                  Object.keys(bindings).forEach(key => {
                    const path = bindings[key];
                    // Extract path components
                    const parts = path.split('.');
                    
                    // Look up value in frontmatter
                    let value = frontmatter;
                    for (const part of parts) {
                      value = value && typeof value === 'object' ? value[part] : undefined;
                    }
                    
                    context.bound[key] = value;
                  });
                  
                  // Add a minimal markdown engine
                  const engine = {
                    markdown: {
                      create: (markdown) => {
                        return markdown;
                      }
                    }
                  };
                  
                  // Execute the script with the context
                  const result = new Function('context', 'engine', 'return ' + scriptStr)(context, engine);
                  
                  // Display the result
                  el.innerHTML = \`<div class="meta-bind-result">\${result}</div>\`;
                } catch (error) {
                  console.error('Error processing meta-bind-js-view:', error);
                  el.innerHTML = \`<div class="meta-bind-error">Error: \${error.message}</div>\`;
                }
              });
            });
            `,
            loadTime: "afterDOMReady",
            contentType: "inline"
          }
        ],
        additionalHead: [
          (pageData: any) => {
            return createElement("meta", {
              name: "meta-bind-data",
              content: JSON.stringify(pageData.metaBind?.metadata || {})
            })
          }
        ]
      }
    }
  }
} 