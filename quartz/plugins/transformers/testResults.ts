import { visit } from "unist-util-visit"
import { JSResource } from "../../util/resources"
import { QuartzTransformerPlugin } from "../types"
// @ts-ignore
import answerCheckScript from "../../components/scripts/answer-check.inline.ts"

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
                
                // Check if there are options in the code block
                const content = node.value.trim()
                let options = {}
                
                if (content) {
                  try {
                    // Try to parse as JSON if there's content
                    options = JSON.parse(content)
                  } catch (e) {
                    // If not valid JSON, use as a title
                    options = { title: content }
                  }
                }
                
                // Pass options as data attributes
                const optionsAttr = Object.entries(options)
                  .map(([key, value]) => `data-${key}="${String(value).replace(/"/g, '&quot;')}"`)
                  .join(' ')
                
                node.value = `<div class="test-results-container" ${optionsAttr}></div>`
              }
            })
          }
        }
      ]
    },
    externalResources() {
      return {
        js: [
          {
            script: answerCheckScript,
            loadTime: "afterDOMReady",
            contentType: "inline"
          } as JSResource
        ]
      }
    }
  }
} 