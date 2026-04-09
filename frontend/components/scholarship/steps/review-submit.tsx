"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { 
  ArrowLeft, 
  Edit2, 
  Check, 
  User, 
  MapPin, 
  GraduationCap, 
  Wallet, 
  FileText,
  Send
} from "lucide-react"
import { cn } from "@/lib/utils"

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

interface ReviewSubmitProps {
  formData: FormData
  onSubmit: () => void
  onPrev: () => void
  goToStep: (step: number) => void
}

const formatDate = (dateString: string) => {
  if (!dateString) return "-"
  const date = new Date(dateString)
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  })
}

const formatIncome = (value: string) => {
  const num = parseInt(value)
  if (isNaN(num)) return "-"
  return `₹ ${new Intl.NumberFormat("en-IN").format(num)}`
}

const maskAadhaar = (value: string) => {
  if (!value) return "-"
  return `XXXX XXXX ${value.slice(-4)}`
}

const maskAccountNumber = (value: string) => {
  if (!value) return "-"
  return `XXXXXX${value.slice(-4)}`
}

const yearLabels: Record<string, string> = {
  fy: "First Year",
  sy: "Second Year",
  ty: "Third Year",
  final: "Final Year"
}

const categoryLabels: Record<string, string> = {
  general: "General",
  obc: "OBC",
  sc: "SC",
  st: "ST"
}

const genderLabels: Record<string, string> = {
  male: "Male",
  female: "Female",
  other: "Other"
}

export function ReviewSubmit({ formData, onSubmit, onPrev, goToStep }: ReviewSubmitProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const handleSubmit = async () => {
    if (!agreedToTerms) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    onSubmit()
  }

  const uploadedDocuments = Object.entries(formData.documents)
    .filter(([, file]) => file !== null)
    .map(([key]) => {
      const labels: Record<string, string> = {
        aadhaarCard: "Aadhaar Card",
        incomeCertificate: "Income Certificate",
        marksheet: "Marksheet",
        bankPassbook: "Bank Passbook",
        casteCertificate: "Caste Certificate",
        domicileCertificate: "Domicile Certificate",
        nationalityCertificate: "Nationality Certificate"
      }
      return labels[key]
    })

  const sections = [
    {
      title: "Personal Details",
      icon: User,
      step: 1,
      fields: [
        { label: "Full Name", value: formData.personal.fullName },
        { label: "Date of Birth", value: formatDate(formData.personal.dateOfBirth) },
        { label: "Gender", value: genderLabels[formData.personal.gender] || "-" },
        { label: "Category", value: categoryLabels[formData.personal.category] || "-" },
        { label: "Aadhaar Number", value: maskAadhaar(formData.personal.aadhaarNumber) },
        { label: "Mobile Number", value: formData.personal.mobileNumber ? `+91 ${formData.personal.mobileNumber}` : "-" },
        { label: "Email", value: formData.personal.email }
      ]
    },
    {
      title: "Address Details",
      icon: MapPin,
      step: 2,
      fields: [
        { label: "Address", value: `${formData.address.addressLine1}${formData.address.addressLine2 ? ", " + formData.address.addressLine2 : ""}` },
        { label: "City", value: formData.address.city },
        { label: "State", value: formData.address.state ? formData.address.state.charAt(0).toUpperCase() + formData.address.state.slice(1) : "-" },
        { label: "Pincode", value: formData.address.pincode }
      ]
    },
    {
      title: "Education Details",
      icon: GraduationCap,
      step: 3,
      fields: [
        { label: "Institute", value: formData.education.instituteName },
        { label: "Course", value: formData.education.courseName },
        { label: "Year", value: yearLabels[formData.education.year] || "-" },
        { label: "Roll Number", value: formData.education.rollNumber },
        { label: "Percentage/CGPA", value: formData.education.percentage ? `${formData.education.percentage}%` : "-" },
        { label: "Passing Year", value: formData.education.passingYear }
      ]
    },
    {
      title: "Financial Details",
      icon: Wallet,
      step: 4,
      fields: [
        { label: "Family Income", value: formatIncome(formData.financial.familyIncome) },
        { label: "Bank Account", value: maskAccountNumber(formData.financial.bankAccountNumber) },
        { label: "IFSC Code", value: formData.financial.ifscCode || "-" }
      ]
    }
  ]

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight">
          Review Your Application
        </h2>
        <p className="text-muted-foreground">
          Please review all the information before submitting
        </p>
      </div>

      {/* Summary Sections */}
      <div className="space-y-4">
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <div
              key={section.title}
              className="rounded-xl border bg-card/50 p-4 transition-colors hover:bg-card"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{section.title}</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => goToStep(section.step)}
                  className="gap-1.5 text-muted-foreground hover:text-foreground"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  Edit
                </Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {section.fields.map((field) => (
                  <div key={field.label}>
                    <p className="text-xs text-muted-foreground">{field.label}</p>
                    <p className="text-sm font-medium text-foreground">{field.value || "-"}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {/* Documents Section */}
        <div className="rounded-xl border bg-card/50 p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Uploaded Documents</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => goToStep(5)}
              className="gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <Edit2 className="h-3.5 w-3.5" />
              Edit
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {uploadedDocuments.map((doc) => (
              <span
                key={doc}
                className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
              >
                <Check className="h-3 w-3" />
                {doc}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Scholarship Amount */}
      <div className="rounded-xl border border-accent/30 bg-gradient-to-r from-accent/10 to-primary/10 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Scholarship Amount</p>
            <p className="text-2xl font-bold text-foreground">₹50,000</p>
          </div>
          <div className="rounded-full bg-accent/20 px-4 py-1">
            <span className="text-sm font-medium text-accent">Fixed</span>
          </div>
        </div>
      </div>

      {/* Terms Agreement */}
      <div className="rounded-lg bg-muted/50 p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-input accent-primary"
          />
          <span className="text-sm text-muted-foreground">
            I hereby declare that all the information provided above is true and correct 
            to the best of my knowledge. I understand that providing false information 
            may result in cancellation of my scholarship application and legal action.
          </span>
        </label>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={onPrev}
          className="gap-2"
          disabled={isSubmitting}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!agreedToTerms || isSubmitting}
          className={cn(
            "gap-2 px-8",
            agreedToTerms 
              ? "bg-accent hover:bg-accent/90" 
              : "bg-muted text-muted-foreground"
          )}
        >
          {isSubmitting ? (
            <>
              <Spinner className="h-4 w-4" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Submit Application
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
