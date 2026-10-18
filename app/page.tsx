import Link from "next/link"
import Image from "next/image"
import { Github, Linkedin, ExternalLink, Mail, FileText, MapPin, Briefcase, Layers, Cloud, BookOpen, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ContactForm } from "@/components/contact-form"
import { LatestTil } from "@/components/latest-til"
import { SectionHeading } from "@/components/section-heading"
import { SkillChip } from "@/components/skill-chip"
import data from './data.json'
import { siteConfig } from "@/lib/site"
import type { Experience, Project, TechTools } from "@/lib/types"

const skillGroups: { title: string; items: TechTools[] }[] = [
  { title: "Frontend", items: data.Frontend },
  { title: "Backend & Databases", items: data["Backend & Database"] },
  { title: "Tools & DevOps", items: data["DevOps and Misc"] },
]

const projects: Project[] = data.Projects
const experience: Experience[] = data.Experience

const quickFacts = [
  { icon: MapPin, label: "Based in", value: siteConfig.location },
  { icon: Briefcase, label: "Experience", value: "5+ years, professional" },
  { icon: Layers, label: "Full stack", value: "Spring Boot · Node.js · React · Next.js" },
  { icon: Cloud, label: "Infrastructure", value: "Docker · Kubernetes · Terraform" },
]

const isExternal = (href: string) => href.startsWith("http")

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.name,
  jobTitle: "Software Engineer",
  url: siteConfig.url,
  address: { "@type": "PostalAddress", addressLocality: "Austin", addressRegion: "TX", addressCountry: "US" },
  sameAs: [siteConfig.github, siteConfig.linkedin],
  knowsAbout: skillGroups.flatMap((group) => group.items.map((item) => item.name)),
}

const heroOutlineButton =
  "h-11 border border-white/70 bg-transparent px-6 text-white hover:bg-white hover:text-gray-900 focus-visible:ring-white"

// Code-editor style card shown in the hero when no headshot is configured
function ProfileCodeCard() {
  return (
    <div
      aria-hidden="true"
      className="w-full max-w-md rounded-xl border border-white/10 bg-gray-950/70 shadow-2xl ring-1 ring-white/5 backdrop-blur"
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-400/80" />
        <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
        <span className="h-3 w-3 rounded-full bg-green-400/80" />
        <span className="ml-2 font-mono text-xs text-gray-400">ribash.ts</span>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-6 text-gray-300">
        <code>
          <span className="text-purple-300">const</span> <span className="text-blue-300">ribash</span> = {"{"}
          {"\n"}  role: <span className="text-green-300">&quot;Full-Stack Software Engineer&quot;</span>,
          {"\n"}  location: <span className="text-green-300">&quot;Austin, TX&quot;</span>,
          {"\n"}  experience: <span className="text-green-300">&quot;5+ years&quot;</span>,
          {"\n"}  backend: [<span className="text-green-300">&quot;Spring Boot&quot;</span>, <span className="text-green-300">&quot;Node.js&quot;</span>, <span className="text-green-300">&quot;PostgreSQL&quot;</span>],
          {"\n"}  frontend: [<span className="text-green-300">&quot;React&quot;</span>, <span className="text-green-300">&quot;Next.js&quot;</span>, <span className="text-green-300">&quot;TypeScript&quot;</span>],
          {"\n"}  infra: [<span className="text-green-300">&quot;Docker&quot;</span>, <span className="text-green-300">&quot;K8s&quot;</span>, <span className="text-green-300">&quot;Terraform&quot;</span>],
          {"\n"}{"}"}
        </code>
      </pre>
    </div>
  )
}

function ProjectImage({ project }: { project: Project }) {
  if (!project.image) {
    // Branded placeholder for projects without a screenshot
    return (
      <div
        aria-hidden="true"
        className="flex aspect-[16/10] w-full flex-col items-center justify-center gap-2 rounded-md bg-gradient-to-br from-indigo-900 to-indigo-950 text-white"
      >
        <BookOpen className="h-10 w-10 text-accent" />
        <span className="font-heading text-xl font-bold">{project.title}</span>
      </div>
    )
  }
  return (
    <Image
      src={project.image}
      width={1200}
      height={750}
      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
      alt={project.imageAlt}
      className="aspect-[16/10] w-full rounded-md border border-gray-200 object-cover object-top dark:border-gray-800"
    />
  )
}

export default function Home() {
  return (
    <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      {/* Hero */}
      <section
        id="hero"
        className="relative w-full overflow-hidden bg-gradient-to-br from-primary to-indigo-950 py-16 text-white md:py-24 lg:py-28 dark:from-gray-900 dark:to-gray-950"
      >
        <div className="container grid items-center gap-12 px-4 md:px-6 lg:grid-cols-[1.15fr_1fr]">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">
              Full-Stack Software Engineer · {siteConfig.location}
            </p>
            <h1 className="font-heading font-bold tracking-tight">
              <span className="block text-xl font-medium text-indigo-200 md:text-2xl">Hi, I&apos;m</span>
              <span className="block text-5xl sm:text-6xl xl:text-7xl">{siteConfig.name}</span>
            </h1>
            <p className="max-w-xl text-lg text-indigo-100 md:text-xl">
              I build reliable, end-to-end web applications, from Spring Boot and Node.js APIs to React and Next.js
              front ends, and the cloud infrastructure that runs them.
            </p>
            <p className="max-w-xl text-indigo-200">
              5+ years of professional experience building, deploying and maintaining production applications.
            </p>
            <div className="flex flex-col gap-3 min-[400px]:flex-row min-[400px]:flex-wrap min-[400px]:items-center">
              <Button asChild className="h-11 bg-accent px-6 text-gray-950 shadow hover:bg-accent/90 focus-visible:ring-accent">
                <Link href="#projects">
                  View Projects <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild className={heroOutlineButton}>
                <Link href="#contact">Contact Me</Link>
              </Button>
              {siteConfig.resumeUrl && (
                <Button asChild className={heroOutlineButton}>
                  <a href={siteConfig.resumeUrl} target="_blank" rel="noopener noreferrer">
                    <FileText aria-hidden="true" /> Résumé
                  </a>
                </Button>
              )}
              <div className="flex gap-2">
                <a
                  href={siteConfig.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-md text-indigo-100 hover:bg-white/10 hover:text-white"
                >
                  <Github className="h-5 w-5" aria-hidden="true" />
                </a>
                <a
                  href={siteConfig.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-md text-indigo-100 hover:bg-white/10 hover:text-white"
                >
                  <Linkedin className="h-5 w-5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
          <div className="hidden justify-center md:flex lg:justify-end">
            {siteConfig.photo ? (
              <Image
                src={siteConfig.photo}
                width={420}
                height={420}
                priority
                alt={`Portrait of ${siteConfig.name}`}
                className="aspect-square w-full max-w-sm rounded-2xl object-cover shadow-2xl ring-1 ring-white/10"
              />
            ) : (
              <ProfileCodeCard />
            )}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" aria-labelledby="about-heading" className="w-full bg-white py-16 md:py-24 dark:bg-gray-950">
        <div className="container grid gap-12 px-4 md:px-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <div className="space-y-6">
            <SectionHeading id="about-heading" eyebrow="About" title="A bit about me" />
            <div className="max-w-2xl space-y-4 text-gray-700 md:text-lg/relaxed dark:text-gray-300">
              <p>
                I&apos;m a full-stack software engineer based in {siteConfig.location} with over five years of
                professional experience building, deploying and maintaining production applications. I work across the
                stack, from Spring Boot and Node.js services backed by PostgreSQL to React and Next.js front ends, and
                I&apos;m comfortable with the Docker, Kubernetes and Terraform tooling that ships them.
              </p>
              <p>
                My journey in tech began when I clicked a few buttons in a browser and the information that appeared
                felt like magic. I&apos;ve been learning how to make that magic happen ever since. I thrive in
                collaborative teams and am always eager to pick up new technologies and best practices.
              </p>
            </div>
          </div>
          <Card className="border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
            <CardContent className="p-6">
              <dl className="grid gap-5">
                {quickFacts.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-primary shadow-sm dark:bg-gray-800">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{label}</dt>
                      <dd className="font-medium text-gray-900 dark:text-gray-100">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" aria-labelledby="skills-heading" className="w-full bg-gray-50 py-16 md:py-24 dark:bg-gray-900/40">
        <div className="container space-y-10 px-4 md:px-6">
          <SectionHeading
            id="skills-heading"
            eyebrow="Skills"
            title="Tools I build with"
            description="The languages, frameworks and infrastructure I use most."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {skillGroups.map((group) => (
              <Card key={group.title} className="border border-gray-200 dark:border-gray-800">
                <CardContent className="space-y-4 p-6">
                  <h3 className="font-heading text-lg font-bold">{group.title}</h3>
                  <ul className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <SkillChip key={item.name} src={item.src} name={item.name} />
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Experience (shown once data.json has entries) */}
      {experience.length > 0 && (
        <section id="experience" aria-labelledby="experience-heading" className="w-full bg-white py-16 md:py-24 dark:bg-gray-950">
          <div className="container space-y-10 px-4 md:px-6">
            <SectionHeading
              id="experience-heading"
              eyebrow="Experience"
              title="Where I've worked"
              description="Roles, teams and what I delivered."
            />
            <ol className="max-w-3xl border-l border-gray-200 dark:border-gray-700">
              {experience.map((job) => (
                <li key={`${job.company}-${job.period}`} className="relative mb-10 ml-6 last:mb-0">
                  <span
                    aria-hidden="true"
                    className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-accent dark:border-gray-950"
                  />
                  <h3 className="text-xl font-heading font-bold">
                    {job.role} <span className="text-gray-500 dark:text-gray-400">· {job.company}</span>
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {job.period}
                    {job.location && ` · ${job.location}`}
                  </p>
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-gray-700 dark:text-gray-300">
                    {job.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Projects */}
      <section id="projects" aria-labelledby="projects-heading" className="w-full border-t bg-white py-16 md:py-24 dark:bg-gray-950">
        <div className="container space-y-10 px-4 md:px-6">
          <SectionHeading
            id="projects-heading"
            eyebrow="Projects"
            title="Selected work"
            description="Things I've designed, built and shipped."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => {
              // Center an odd last card on two-column (tablet) layouts instead of leaving it orphaned on the left
              const isOrphan = projects.length % 2 === 1 && index === projects.length - 1
              return (
                <Card
                  key={project.title}
                  className={`group flex flex-col border border-gray-200 dark:border-gray-800 custom-shadow motion-safe:transition-all hover:custom-shadow-lg motion-safe:hover:-translate-y-1 ${
                    isOrphan ? "md:col-span-2 md:mx-auto md:w-[calc(50%-0.75rem)] lg:col-span-1 lg:w-auto" : ""
                  }`}
                >
                  <CardHeader className="space-y-4">
                    <ProjectImage project={project} />
                    <CardTitle>
                      <h3 className="font-heading text-xl">{project.title}</h3>
                    </CardTitle>
                    <CardDescription className="text-base">{project.description}</CardDescription>
                    <ul className="flex flex-wrap gap-2" aria-label="Technologies used">
                      {project.tags.map((tag) => (
                        <li key={tag}>
                          <Badge variant="secondary">{tag}</Badge>
                        </li>
                      ))}
                    </ul>
                  </CardHeader>
                  <CardContent className="mt-auto flex gap-6">
                    <Link
                      href={project.liveUrl}
                      {...(isExternal(project.liveUrl) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="inline-flex items-center gap-1 min-h-11 text-sm font-medium text-primary hover:underline underline-offset-4"
                      prefetch={false}
                    >
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      {isExternal(project.liveUrl) ? "Live Site" : "View Project"}
                      <span className="sr-only">: {project.title}</span>
                    </Link>
                    {project.repoUrl && (
                      <Link
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 min-h-11 text-sm font-medium text-primary hover:underline underline-offset-4"
                        prefetch={false}
                      >
                        <Github className="h-4 w-4" aria-hidden="true" />
                        Code
                        <span className="sr-only">: {project.title}</span>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <LatestTil />

      {/* Contact */}
      <section id="contact" aria-labelledby="contact-heading" className="w-full border-t bg-white py-16 md:py-24 dark:bg-gray-950">
        <div className="container grid gap-12 px-4 md:px-6 lg:grid-cols-2 lg:items-start">
          <div className="space-y-6">
            <SectionHeading
              id="contact-heading"
              eyebrow="Contact"
              title="Let's talk"
              description="Whether it's a role, a project or just to say hello, feel free to reach out. I'll get back to you as soon as possible."
            />
            <ul className="space-y-2">
              {siteConfig.email && (
                <li>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="inline-flex items-center gap-2 min-h-11 font-medium text-primary hover:underline underline-offset-4"
                  >
                    <Mail className="h-5 w-5" aria-hidden="true" />
                    {siteConfig.email}
                  </a>
                </li>
              )}
              <li>
                <a
                  href={siteConfig.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 min-h-11 font-medium text-primary hover:underline underline-offset-4"
                >
                  <Linkedin className="h-5 w-5" aria-hidden="true" />
                  Connect on LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 min-h-11 font-medium text-primary hover:underline underline-offset-4"
                >
                  <Github className="h-5 w-5" aria-hidden="true" />
                  See my code on GitHub
                </a>
              </li>
            </ul>
          </div>
          <Card className="w-full border border-gray-200 dark:border-gray-800 custom-shadow">
            <CardHeader>
              <CardTitle>
                <h3 className="font-heading text-xl">Send a message</h3>
              </CardTitle>
              <CardDescription>Fill out the form and it lands straight in my inbox.</CardDescription>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
