import { QuartzFilterPlugin } from "../types"

export interface Options {
  /** File extensions that should always be published */
  alwaysPublishExtensions?: string[]
}

const defaultOptions: Options = {
  alwaysPublishExtensions: [".pdf", ".docx", ".doc", ".xlsx", ".xls", ".pptx", ".ppt"],
}

export const ExplicitPublish: QuartzFilterPlugin<Partial<Options>> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }

  return {
    name: "ExplicitPublish",
    shouldPublish(ctx, [_tree, vfile]) {
      // Get the file extension
      const fileExt = vfile?.extname?.toLowerCase()

      // Always publish specified file types
      if (opts.alwaysPublishExtensions?.includes(fileExt ?? "")) {
        return true
      }

      // For markdown and other files, check for explicit publish flag
      return (
        vfile.data?.frontmatter?.publish === true || vfile.data?.frontmatter?.publish === "true"
      )
    },
  }
}
