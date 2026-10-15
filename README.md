# AB Console

A personal portfolio for **Atharva Bedekar**, built to look and behave like a cloud management console.
Each "service" in the console is a section of the portfolio.

> [!NOTE]
> This is an unofficial, personal, non-commercial project. It is **not affiliated with, endorsed by or
> sponsored by Amazon Web Services**. The interface is modelled on the AWS Management Console purely as a
> design reference. "AWS", the AWS service names and service icons are trademarks of Amazon.com, Inc. or
> its affiliates. No real AWS accounts, resources or data are used: everything is static portfolio content.

## Service equivalents

| Console service | Portfolio section | Content                              | Data                                   |
|-----------------|-------------------|--------------------------------------|----------------------------------------|
| Console home    | Dashboard         | Widgets you can drag, resize, add    | `dashboard-layout.json`                |
| EC2             | Projects          | Projects and project types           | `ec2-projects.json`                    |
| S3              | Documents         | Resumes, letters, certifications     | `s3.json` + files in `public/s3/`      |
| IAM             | Skills            | Skill groups, skills, role history   | `iam-groups.json`, `iam-users.json`    |
| VPC             | Connect           | Links, social, contact               | `vpc.json`                             |
| CloudTrail      | Experience        | Work history timeline                | derived from `iam-users.json`          |

Regions, the services menu, search, favourites, dark mode and unified settings all work like their
console counterparts.

**Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Zustand, @dnd-kit.

## Run locally

Requires Node.js 20.9 or newer.

```bash
git clone https://github.com/AB527/aws-console-portfolio.git
cd aws-console-portfolio
npm install
npm run dev          # http://localhost:3000
```

Production build:

```bash
npm run build
npm start
```

## Editing content

All content is JSON in `public/data/`. Document files live in `public/s3/<object id>/`.

- **Studio (easiest):** with `npm run dev` running, open [`/studio`](http://localhost:3000/studio)
  (or the "Studio" link in the footer). It lets you add, edit and delete projects, documents, skills,
  links, widgets and console text through forms, and uploads document files. Studio exists only in
  development and is left out of production builds.
- **By hand:** edit the JSON files directly. Dates are `"YYYY-MM-DD"`; an empty `periodTo` means
  "Present". Counts are computed, so never store them.

Forking this for your own portfolio? Replace everything in `public/data/` and `public/s3/` with your
own content before deploying (see [LICENSE](LICENSE)).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). The full set of project conventions is in [CLAUDE.md](CLAUDE.md).

## License

Code is released under the [MIT License](LICENSE). Personal content (`public/data/`, `public/s3/`)
is not covered and remains all rights reserved.
