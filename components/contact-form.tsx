"use client"

import type React from "react"
import { useState } from "react"
import emailjs from "@emailjs/browser"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// EmailJS IDs are public by design; they are inlined at build time via next.config.mjs
const SERVICE_ID = process.env.EMAIL_SERVICE_ID ?? ""
const TEMPLATE_ID = process.env.EMAIL_TEMPLATE_ID ?? ""
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAIL_PUBLIC_KEY ?? ""

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Errors = { email?: string; message?: string }

const labelClass = "text-sm font-medium text-left"

export function ContactForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [errors, setErrors] = useState<Errors>({})
  const [isSending, setIsSending] = useState(false)

  const validate = (): Errors => {
    const next: Errors = {}
    if (!emailRegex.test(email)) next.email = "Please enter a valid email address."
    if (message.trim().length === 0) next.message = "Message cannot be empty."
    return next
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsSending(true)
    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          name: name || "Name not provided",
          customer_email: email,
          title: subject,
          message,
        },
        { publicKey: PUBLIC_KEY },
      )
      toast.success("Message sent successfully. I'll get back to you soon!")
      setName("")
      setEmail("")
      setSubject("")
      setMessage("")
    } catch {
      toast.error("Something went wrong. Please try again later.")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-4">
      <div className="grid gap-2">
        <label htmlFor="contact-name" className={labelClass}>
          Name <span className="font-normal text-gray-500 dark:text-gray-400">(optional)</span>
        </label>
        <Input
          id="contact-name"
          name="name"
          autoComplete="name"
          placeholder="Jane Doe"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <label htmlFor="contact-email" className={labelClass}>
          Email
        </label>
        <Input
          id="contact-email"
          name="email"
          autoComplete="email"
          placeholder="jane@company.com"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && (
          <p id="contact-email-error" className="text-red-600 dark:text-red-400 text-sm text-left">
            {errors.email}
          </p>
        )}
      </div>
      <div className="grid gap-2">
        <label htmlFor="contact-subject" className={labelClass}>
          Subject <span className="font-normal text-gray-500 dark:text-gray-400">(optional)</span>
        </label>
        <Input
          id="contact-subject"
          name="subject"
          placeholder="Role, project or question"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <label htmlFor="contact-message" className={labelClass}>
          Message
        </label>
        <Textarea
          id="contact-message"
          name="message"
          required
          className={`min-h-[100px] ${errors.message ? "border-red-500" : ""}`}
          placeholder="Tell me a bit about what you have in mind"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
        />
        {errors.message && (
          <p id="contact-message-error" className="text-red-600 dark:text-red-400 text-sm text-left">
            {errors.message}
          </p>
        )}
      </div>
      <Button
        type="submit"
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-2 h-11"
        disabled={isSending}
        aria-busy={isSending}
      >
        {isSending ? "Sending…" : "Send Message"}
      </Button>
    </form>
  )
}
