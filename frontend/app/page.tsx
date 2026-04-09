"use client"

import { useState } from "react"
import { ScholarshipApplication } from "@/components/scholarship/scholarship-application"
import { Dashboard } from "@/components/scholarship/dashboard"

export default function Home() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [applicationData, setApplicationData] = useState<Record<string, unknown> | null>(null)

  const handleSubmit = (data: Record<string, unknown>) => {
    setApplicationData(data)
    setIsSubmitted(true)
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Gradient Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      {isSubmitted ? (
        <Dashboard applicationData={applicationData} />
      ) : (
        <ScholarshipApplication onSubmit={handleSubmit} />
      )}
    </main>
  )
}
