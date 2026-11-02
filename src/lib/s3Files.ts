import fs from "fs"
import path from "path"

// Public URLs of the document files that have been added under public/s3/<id>/.
// Objects whose URL is not in this list keep their Open / Download buttons disabled.
export function objectFileUrls(): string[] {
  const root = path.join(process.cwd(), "public", "s3")
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((dir) =>
      fs
        .readdirSync(path.join(root, dir.name))
        .filter((file) => file.startsWith("file."))
        .map((file) => `/s3/${dir.name}/${file}`)
    )
}
