// Central site configuration. Leave optional fields empty to hide the related UI.
export const siteConfig = {
  name: "Ribash Sharma",
  title: "Ribash Sharma — Full-Stack Software Engineer",
  description:
    "Full-stack software engineer based in Austin, Texas, with 5+ years of experience building, deploying and maintaining web applications with Spring Boot, Node.js, React and Next.js.",
  location: "Austin, Texas",
  // Set NEXT_PUBLIC_SITE_URL in your environment to your production domain (e.g. https://example.com).
  // VERCEL_PROJECT_PRODUCTION_URL is the stable production domain on Vercel (VERCEL_URL changes per deployment).
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
  github: "https://github.com/rebussharma",
  linkedin: "https://linkedin.com/in/rebus-sharma",
  // Public contact email shown in the contact section and footer, e.g. "you@example.com"
  email: "",
  // Path or URL to your résumé, e.g. "/resume.pdf" (place the file in /public)
  resumeUrl: "",
  // Path to a professional headshot, e.g. "/images/headshot.webp". When empty, the hero shows a code-card visual instead.
  photo: "",
}

export const navLinks = [
  { label: "About", href: "/#about" },
  { label: "Skills", href: "/#skills" },
  { label: "Experience", href: "/#experience" },
  { label: "Projects", href: "/#projects" },
  { label: "TIL", href: "/til" },
  { label: "Contact", href: "/#contact" },
]
