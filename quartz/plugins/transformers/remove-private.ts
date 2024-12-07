import { QuartzTransformerPlugin } from "../types"
import { Root } from "mdast"
import { VFile } from "vfile"

export interface Options {
  /** Enable filtering of files in Private folders */
  privateFolders: boolean
  /** Enable filtering of files with -private suffix */
  privateFiles: boolean
  /** Enable filtering based on frontmatter private flag */
  privateFrontmatter: boolean
  /** Enable filtering of index files */
  privateIndex: boolean
}

const defaultOptions: Options = {
  privateFolders: true,
  privateFiles: true,
  privateFrontmatter: true,
  privateIndex: true,
}

export const RemovePrivate: QuartzTransformerPlugin<Partial<Options> | undefined> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }

  return {
    name: "RemovePrivate",
    transformVirtualFile(
      file: VFile,
      data: { filePath: string; frontmatter: Record<string, any> },
    ) {
      // Normalize file path to use forward slashes
      const normalizedPath = data.filePath.replace(/\\/g, "/")

      // Check if file should be private based on enabled options
      const isPrivate =
        (opts.privateFolders && normalizedPath.includes("/Private/")) ||
        (opts.privateFiles && normalizedPath.includes("-private.")) ||
        (opts.privateFrontmatter && data.frontmatter?.private === true) ||
        (opts.privateIndex &&
          (normalizedPath.startsWith("_Index") ||
            normalizedPath.includes("/_Index") ||
            normalizedPath.match(/\/_?[Ii]ndex(_of)?/)))

      if (isPrivate) {
        console.log(`Filtering private file: ${normalizedPath}`)
        return null
      }

      return file
    },
  }
}
