import { promises as fs } from "fs"
import path from "path"
import type { Json } from "@/components/studio/json"
import type { Lookups, Option } from "@/components/studio/schema"
import type regionsJson from "@data/regions.json"
import type groupsJson from "@data/iam-groups.json"
import type usersJson from "@data/iam-users.json"
import type projectsJson from "@data/ec2-projects.json"
import type vpcJson from "@data/vpc.json"
import type servicesJson from "@data/services.json"
import type helpJson from "@data/help.json"
import type s3Json from "@data/s3.json"
import { fileExt } from "@/lib/fileExt"

// Server-side helpers for the data studio (development only)

const DATA_DIR = path.join(process.cwd(), "public", "data")
const ICONS_DIR = path.join(process.cwd(), "public", "icons")
const S3_DIR = path.join(process.cwd(), "public", "s3")

export function dataFilePath(name: string): string | null {
  return /^[a-z0-9-]+$/.test(name) ? path.join(DATA_DIR, `${name}.json`) : null
}

// undefined when there is no such file
export async function readDataFile(name: string): Promise<Json | undefined> {
  const file = dataFilePath(name)
  if (!file) return undefined
  try {
    return JSON.parse(await fs.readFile(file, "utf8")) as Json
  } catch {
    return undefined
  }
}

async function read<T>(name: string): Promise<T> {
  return (await readDataFile(name)) as unknown as T
}

function addUse(usage: Record<string, string[]>, id: string, user: string) {
  usage[id] = [...(usage[id] ?? []), user]
}

// Dropdown choices and "what uses what", read fresh from the data files
export async function loadLookups(): Promise<Lookups> {
  const [regions, groups, users, projects, vpc, services, help, s3, icons] = await Promise.all([
    read<typeof regionsJson>("regions"),
    read<typeof groupsJson>("iam-groups"),
    read<typeof usersJson>("iam-users"),
    read<typeof projectsJson>("ec2-projects"),
    read<typeof vpcJson>("vpc"),
    read<typeof servicesJson>("services"),
    read<typeof helpJson>("help"),
    read<typeof s3Json>("s3"),
    fs.readdir(ICONS_DIR),
  ])

  const iconOptions = (ext: string): Option[] =>
    icons
      .filter((f) => f.endsWith(ext))
      .map((f) => f.slice(0, -ext.length))
      .sort()
      .map((name) => ({ value: name, label: name }))

  const skillGroups: Record<string, string[]> = {}
  const regionUse: Record<string, string[]> = {}
  for (const user of users.users) {
    for (const group of user.groups) addUse(skillGroups, group, user.displayName)
    addUse(regionUse, user.region, `role ${user.displayName}`)
  }

  const projectTypes: Record<string, string[]> = {}
  for (const project of projects.instances) {
    addUse(projectTypes, project.instanceType, project.name)
    addUse(regionUse, project.region, `project ${project.name}`)
  }
  for (const bucket of s3.buckets) addUse(regionUse, bucket.region, `folder ${bucket.name}`)
  for (const service of services) for (const region of service.regions) addUse(regionUse, region, `service ${service.title}`)
  addUse(regionUse, vpc.region, "Connect profile")

  const subnets: Record<string, string[]> = {}
  for (const table of vpc.routeTables) addUse(subnets, table.subnetId, table.name)

  const helpTopics: Record<string, string[]> = {}
  for (const [page, topic] of Object.entries(help.pages)) addUse(helpTopics, topic, page)

  return {
    regions: regions.groups.flatMap((g) => g.regions).map((r) => ({ value: r.id, label: r.full })),
    skillGroups: groups.groups.map((g) => ({ value: g.id, label: g.label })),
    projectTypes: projects.instanceTypeDetails.map((t) => ({ value: t.id, label: `${t.id}: ${t.description}` })),
    subnets: vpc.subnets.map((s) => ({ value: s.id, label: s.name })),
    services: services.map((s) => ({ value: s.id, label: s.title })),
    helpTopics: Object.keys(help.topics).map((id) => ({ value: id, label: id })),
    svgIcons: iconOptions(".svg"),
    pngIcons: iconOptions(".png"),
    usage: { skillGroups, projectTypes, regions: regionUse, subnets, helpTopics },
  }
}

// ---- document files (public/s3/<id>/file.<ext>) ------------------------------------------

function objectDir(id: string): string | null {
  return /^[a-f0-9-]{36}$/.test(id) ? path.join(S3_DIR, id) : null
}

// Replaces whatever file the object had
export async function writeObjectFile(id: string, ext: string, content: Buffer): Promise<boolean> {
  const dir = objectDir(id)
  if (!dir || !/^[a-z0-9]{1,8}$/.test(ext)) return false
  await fs.rm(dir, { recursive: true, force: true })
  await fs.mkdir(dir, { recursive: true })
  await fs.writeFile(path.join(dir, `file.${ext}`), content)
  return true
}

export async function removeObjectFile(id: string): Promise<boolean> {
  const dir = objectDir(id)
  if (!dir) return false
  await fs.rm(dir, { recursive: true, force: true })
  return true
}

// Keeps the table in public/s3/README.md in step with s3.json
export async function writeS3Readme(data: Json): Promise<void> {
  const s3 = data as unknown as typeof s3Json
  const rows = s3.buckets.flatMap((bucket) =>
    bucket.objects.map((obj) => `| \`${obj.id}\` | ${bucket.name} | ${obj.key} | \`file.${fileExt(obj.key)}\` |`)
  )
  const readme = [
    "# S3 object files",
    "",
    "Each folder is named by the object `id` in `public/data/s3.json`. Drop the document into its folder using the file name shown below; the Open / Download buttons enable automatically once the file exists.",
    "",
    "| Folder (object id) | Bucket | Object key | File name |",
    "|---|---|---|---|",
    ...rows,
    "",
  ].join("\n")
  await fs.writeFile(path.join(S3_DIR, "README.md"), readme, "utf8")
}
