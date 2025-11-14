"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MonitorSmartphone, Github, Linkedin, ArrowUp } from "lucide-react"
import Image from "next/image"
import { SlideModeToggle } from "@/components/slide-mode-toggle"
import { useState, useEffect, useRef } from "react" // Import useState and useEffect
import EmailSender, {EmailSenderRef} from "@/components/EmailSender"
import TechCard from "./techCard"
import data from './data.json'
import { TechTools } from "@/lib/types"

export default function Component() {
  const backend_items = data["Backend & Database"]
  const frontend_items = data.Frontend
  const misc_items = data["DevOps and Misc"]

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const emailSenderRef = useRef<EmailSenderRef>(null);
  // State for validation
  const [isEmailValid, setIsEmailValid] = useState(false)
  const [isMessageValid, setIsMessageValid] = useState(false)
  const [canSubmit, setCanSubmit] = useState(false)
  const [emailSent, setEmailConfirmed] = useState(false)

  // Email validation regex (basic)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  // Effect to validate email and message whenever they change
  useEffect(() => {
    setIsEmailValid(emailRegex.test(email))
    setIsMessageValid(message.trim().length > 0)
  }, [email, message])

  // Effect to enable/disable submit button
  useEffect(() => {
    setCanSubmit(isEmailValid && isMessageValid)
  }, [isEmailValid, isMessageValid])

  // Function to handle smooth scrolling
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Handle form submission (currently just logs, you'd add server action here)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
   emailSenderRef.current?.sendEmail();
  }

  const clientDetails = {
    nameResetter: setName,
    emailResetter: setEmail,
    subjectResetter: setSubject,
    messageResetter:setMessage,
    clientDetails: [name, email, subject, message],
    setEmailSent: setEmailConfirmed,
    contactForm: true
  }
  

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className="flex flex-col border-b bg-white dark:bg-gray-900">
        {/* First Row: Name, Social Icons, Dark Mode Toggle */}
        <div className="px-4 lg:px-6 h-14 flex items-center justify-between">
          <Link href="#" className="flex items-center justify-center gap-2 font-bold text-lg" prefetch={false}>
            <MonitorSmartphone className="h-6 w-6 text-primary" /> {/* Apply primary color to icon */}
            <span>Ribash Sharma</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/rebussharma"
              className="text-sm font-medium hover:underline underline-offset-4 flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
              prefetch={false}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only sm:not-sr-only">GitHub</span> {/* Show text on larger screens */}
            </Link>
            <Link
              href="https://linkedin.com/in/rebus-sharma"
              className="text-sm font-medium hover:underline underline-offset-4 flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
              prefetch={false}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="h-5 w-5" />
              <span className="sr-only sm:not-sr-only">LinkedIn</span> {/* Show text on larger screens */}
            </Link>
            <SlideModeToggle /> {/* Use the new SlideModeToggle */}
          </div>
        </div>
        {/* Second Row: Main Navigation */}
        <div className="w-full py-2 px-4 lg:px-6 flex justify-center border-t border-gray-200 dark:border-gray-800">
          <nav className="flex gap-4 sm:gap-6">
            <button
              onClick={() => scrollToSection("about")}
              className="text-sm font-medium hover:underline underline-offset-4 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("skills")}
              className="text-sm font-medium hover:underline underline-offset-4 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
            >
              Skills
            </button>
            <button
              onClick={() => scrollToSection("projects")}
              className="text-sm font-medium hover:underline underline-offset-4 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
            >
              Projects
            </button>
            <Link
              href="/til"
              target="_blank"
              className="text-sm font-medium hover:underline underline-offset-4 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
              prefetch={false}
            >
              TIL
            </Link>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-sm font-medium hover:underline underline-offset-4 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
            >
              Contact
            </button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section
          id="hero"
          className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-primary to-indigo-950 dark:from-gray-900 dark:to-gray-950 text-white"
        >
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-1 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4 text-center lg:text-left">
                <div className="space-y-2">
                  <h1 className="text-3xl font-heading font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Hi, I'm a Software Developer
                  </h1>
                  <p className="max-w-[600px] text-indigo-100 md:text-xl mx-auto lg:mx-0">
                    Passionate about building small web applications to do BIG things!
                  </p>
                  <p style={{fontStyle:"italic", fontSize:".75rem"}}>Responsible use of AI: 
                    The UI in this page is generate using <a href="https://v0.dev" target="_blank">v0.dev</a> by Vercel</p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center lg:justify-start">
                  <Button
                    onClick={() => scrollToSection("projects")}
                    className="inline-flex h-10 items-center justify-center rounded-md bg-accent px-8 text-sm font-medium text-accent-foreground shadow transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50"
                  >
                    View Projects
                  </Button>
                  <Button
                    onClick={() => scrollToSection("contact")}
                    className="inline-flex h-10 items-center justify-center rounded-md border border-white bg-transparent px-8 text-sm font-medium shadow-sm transition-colors hover:bg-white hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white disabled:pointer-events-none disabled:opacity-50"
                  >
                    Contact Me
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-950">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-heading font-bold tracking-tighter sm:text-5xl">About Me</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  I have over 5 years of professional experience in building, deploying and maintaing full-stack application.
                  I love transforming ideas into scalale application; from paper to the internet. My journey in tech began
                  when I clicked few buttons on a browser. The informations those clicks rendered was like magic. Ever since, 
                  I have been learing everyday to make the same magic happen. I thrive in
                  collaborative environments and am always eager to learn new technologies and best practices.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-heading font-bold tracking-tighter sm:text-5xl">My Skills</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Some tools and techs I have worked with.
                </p>
              </div>
              <div className="w-full max-w-4xl mx-auto grid gap-8 py-8">
                {/* Frontend Skills */}
                <div className="text-left">
                  <h3 className="text-2xl font-heading font-bold mb-4 text-gray-800 dark:text-gray-200">Frontend</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                   {
                    frontend_items.map((item: TechTools) => {
                      return(
                        <TechCard key={item.name} src={item.src} alt={item.alt} tech_name={item.name} />
                      )
                    })
                   }
                  </div>
                </div>

                {/* Backend Skills */}
                <div className="text-left">
                  <h3 className="text-2xl font-heading font-bold mb-4 text-gray-800 dark:text-gray-200">
                    Backend & Databases
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {
                      backend_items.map((item: TechTools) => {
                        return(
                          <TechCard key={item.name} src={item.src} alt={item.alt} tech_name={item.name} />
                        )
                      })
                    }
                  </div>
                </div>

                {/* Tools & DevOps */}
                <div className="text-left">
                  <h3 className="text-2xl font-heading font-bold mb-4 text-gray-800 dark:text-gray-200">
                    Tools & DevOps
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                   {
                      misc_items.map((item: TechTools) => {
                        return(
                          <TechCard key={item.name} src={item.src} alt={item.alt} tech_name={item.name} />
                        )
                      })
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-950">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-heading font-bold tracking-tighter sm:text-5xl">My Projects</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Showcasing some of my recent work.
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 py-8">
                <Card className="border border-gray-200 dark:border-gray-700 custom-shadow transition-all hover:custom-shadow-lg hover:scale-[1.02]">
                  <CardHeader>
                    <Image
                      src="/images/sammy_salon.jpeg?height=200&width=300"
                      width="300"
                      height="200"
                      alt="Project 1"
                      className="rounded-md object-cover w-full h-48"
                    />
                    <CardTitle className="mt-4">Beauty Salon Landing Page</CardTitle>
                    <CardDescription>
                      A landing page for a beauty salon with integrated reviews and email system built on ReactJs and powered by EmailJs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link
                      href="https://sammysbrow.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-primary hover:underline underline-offset-4"
                      prefetch={false}
                    >
                      View Project &rarr;
                    </Link>
                  </CardContent>
                </Card>
                <Card className="border border-gray-200 dark:border-gray-700 custom-shadow transition-all hover:custom-shadow-lg hover:scale-[1.02]">
                  <CardHeader>
                    <Image
                      src="/images/salon_appt.jpeg?height=200&width=300"
                      width="300"
                      height="200"
                      alt="Project 2"
                      className="rounded-md object-cover w-full h-48"
                    />
                    <CardTitle className="mt-4">Appointment Booking App</CardTitle>
                    <CardDescription>
                      A full stack application to book service appointment for a beauty salon. Built uisng ReactJs for frontend, Spring Boot as backend and Postgres for database.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link
                      href="https://book.sammysbrow.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-primary hover:underline underline-offset-4"
                      prefetch={false}
                    >
                      View Project &rarr;
                    </Link>
                  </CardContent>
                </Card>
                <Card className="border border-gray-200 dark:border-gray-700 custom-shadow transition-all hover:custom-shadow-lg hover:scale-[1.02]">
                  <CardHeader>
                    <Image
                      src="/images/til.jpeg?height=200&width=300"
                      width="300"
                      height="200"
                      alt="Project 3"
                      className="rounded-md object-cover w-full h-48"
                    />
                    <CardTitle className="mt-4">Today I Learnt Feature </CardTitle>
                    <CardDescription>
                      A small blog linked within this page that I use to write about things I learn every now and then.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link
                      href="/til"
                      target="_blank"
                      className="text-sm font-medium text-primary hover:underline underline-offset-4"
                      prefetch={false}
                    >
                      View Project &rarr;
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section id="til" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-heading font-bold tracking-tighter sm:text-5xl">Today I Learned</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  A collection of small things I learn every day.
                </p>
              </div>
              <Button asChild className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/til" target="_blank" prefetch={false}>
                  Go to TIL Page &rarr;
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-950">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-heading font-bold tracking-tighter sm:text-5xl">Get in Touch</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Have a project in mind or just want to say hello? Feel free to reach out!
                </p>
              </div>
              <Card className="w-full max-w-md border border-gray-200 dark:border-gray-700 custom-shadow">
                <CardHeader>
                  <CardTitle>Contact Me</CardTitle>
                  <CardDescription>
                    Fill out the form below and I'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-2">
                      <Input
                        id="name"
                        placeholder="Your Name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2 mt-4">
                      <Input
                        id="email"
                        placeholder="Your Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={!isEmailValid && email.length > 0 ? "border-red-500" : ""}
                      />
                      {!isEmailValid && email.length > 0 && (
                        <p className="text-red-500 text-sm">Please enter a valid email address.</p>
                      )}
                    </div>
                    <div className="grid gap-2 mt-4">
                      <Input
                        id="subject"
                        placeholder="Subject"
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2 mt-4">
                      <Textarea
                        className={`min-h-[100px] ${!isMessageValid && message.length > 0 ? "border-red-500" : ""}`}
                        id="message"
                        placeholder="Your Message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                      {!isMessageValid && message.length > 0 && (
                        <p className="text-red-500 text-sm">Message cannot be empty.</p>
                      )}
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-6"
                      disabled={!canSubmit}
                    >
                      Send Message
                    </Button>
                    <EmailSender ref={emailSenderRef} {...clientDetails} />
                  </form> 
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Ribash Sharma. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            href="https://github.com/rebussharma"
            className="text-xs hover:underline underline-offset-4 flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
            prefetch={false}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="h-4 w-4" /> GitHub
          </Link>
          <Link
            href="https://linkedin.com/in/rebus-sharma"
            className="text-xs hover:underline underline-offset-4 flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
            prefetch={false}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin className="h-4 w-4" /> LinkedIn
          </Link>
          <Button
            variant="outline"
            size="icon"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="h-10 w-10 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label="Go to top"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </nav>
      </footer>
    </div>
  )
}
