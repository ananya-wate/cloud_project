"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { StepIndicator } from "./step-indicator"
import { PersonalDetails } from "./steps/personal-details"
import { AddressDetails } from "./steps/address-details"
import { EducationDetails } from "./steps/education-details"
import { FinancialDetails } from "./steps/financial-details"
import { DocumentUploads } from "./steps/document-uploads"
import { ReviewSubmit } from "./steps/review-submit"
import { Card } from "@/components/ui/card"
import { GraduationCap, Shield } from "lucide-react"

interface FormData {
  personal: {
    fullName: string
    dateOfBirth: string
    gender: string
    category: string
    aadhaarNumber: string
    mobileNumber: string
    email: string
  }
  address: {
    addressLine1: string
    addressLine2: string
    city: string
    state: string
    pincode: string
  }
  education: {
    instituteName: string
    courseName: string
    year: string
    rollNumber: string
    percentage: string
    passingYear: string
  }
  financial: {
    familyIncome: string
    bankAccountNumber: string
    ifscCode: string
  }
  documents: {
    aadhaarCard: File | null
    incomeCertificate: File | null
    marksheet: File | null
    bankPassbook: File | null
    casteCertificate: File | null
    domicileCertificate: File | null
    nationalityCertificate: File | null
  }
}

const initialFormData: FormData = {
  personal: {
    fullName: "",
    dateOfBirth: "",
    gender: "",
    category: "",
    aadhaarNumber: "",
    mobileNumber: "",
    email: "",
  },
  address: {
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  },
  education: {
    instituteName: "",
    courseName: "",
    year: "",
    rollNumber: "",
    percentage: "",
    passingYear: "",
  },
  financial: {
    familyIncome: "",
    bankAccountNumber: "",
    ifscCode: "",
  },
  documents: {
    aadhaarCard: null,
    incomeCertificate: null,
    marksheet: null,
    bankPassbook: null,
    casteCertificate: null,
    domicileCertificate: null,
    nationalityCertificate: null,
  },
}

const steps = [
  { id: 1, title: "Personal Details", description: "Basic information" },
  { id: 2, title: "Address", description: "Residential details" },
  { id: 3, title: "Education", description: "Academic information" },
  { id: 4, title: "Financial", description: "Income details" },
  { id: 5, title: "Documents", description: "Upload files" },
  { id: 6, title: "Review", description: "Final review" },
]

interface ScholarshipApplicationProps {
  onSubmit: (data: Record<string, unknown>) => void
}

export function ScholarshipApplication({ onSubmit }: ScholarshipApplicationProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [direction, setDirection] = useState(0)

  const updateFormData = useCallback(<K extends keyof FormData>(
    section: K,
    data: Partial<FormData[K]>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }))
  }, [])

  const goToStep = useCallback((step: number) => {
    setDirection(step > currentStep ? 1 : -1)
    setCurrentStep(step)
  }, [currentStep])

  const nextStep = useCallback(() => {
    if (currentStep < 6) {
      setDirection(1)
      setCurrentStep((prev) => prev + 1)
    }
  }, [currentStep])

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setDirection(-1)
      setCurrentStep((prev) => prev - 1)
    }
  }, [currentStep])

  const handleSubmit = useCallback(() => {
    onSubmit(formData as unknown as Record<string, unknown>)
  }, [formData, onSubmit])

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  }

  const renderStep = () => {
    const props = {
      onNext: nextStep,
      onPrev: prevStep,
    }

    switch (currentStep) {
      case 1:
        return (
          <PersonalDetails
            {...props}
            data={formData.personal}
            updateData={(data) => updateFormData("personal", data)}
          />
        )
      case 2:
        return (
          <AddressDetails
            {...props}
            data={formData.address}
            updateData={(data) => updateFormData("address", data)}
          />
        )
      case 3:
        return (
          <EducationDetails
            {...props}
            data={formData.education}
            updateData={(data) => updateFormData("education", data)}
          />
        )
      case 4:
        return (
          <FinancialDetails
            {...props}
            data={formData.financial}
            updateData={(data) => updateFormData("financial", data)}
          />
        )
      case 5:
        return (
          <DocumentUploads
            {...props}
            data={formData.documents}
            updateData={(data) => updateFormData("documents", data)}
          />
        )
      case 6:
        return (
          <ReviewSubmit
            {...props}
            formData={formData}
            onSubmit={handleSubmit}
            goToStep={goToStep}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 md:py-12">
      {/* Header */}
      <header className="mb-8 text-center">
        <div className="mb-4 inline-flex items-center justify-center gap-3 rounded-full bg-primary/10 px-4 py-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="text-sm font-medium text-primary">Government of India Initiative</span>
        </div>
        <h1 className="mb-2 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          National Scholarship Portal
        </h1>
        <p className="text-muted-foreground">
          Apply for government scholarships online with ease
        </p>
      </header>

      {/* Progress Indicator */}
      <StepIndicator steps={steps} currentStep={currentStep} />

      {/* Main Form Card */}
      <Card className="relative mt-8 overflow-hidden border-0 bg-card/80 p-0 shadow-xl backdrop-blur-sm">
        {/* Security Badge */}
        <div className="absolute right-4 top-4 hidden items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent md:flex">
          <Shield className="h-3.5 w-3.5" />
          Secure & Encrypted
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="p-6 md:p-8"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </Card>

      {/* Footer */}
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>Need help? Contact support at support@scholarship.gov.in</p>
        <p className="mt-1">© 2026 National Scholarship Portal. All rights reserved.</p>
      </footer>
    </div>
  )
}
