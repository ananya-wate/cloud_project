"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Field, FieldLabel, FieldGroup, FieldError } from "@/components/ui/field"
import { ArrowRight, User, Calendar, Users, CreditCard, Phone, Mail } from "lucide-react"

interface PersonalData {
  fullName: string
  dateOfBirth: string
  gender: string
  category: string
  aadhaarNumber: string
  mobileNumber: string
  email: string
}

interface PersonalDetailsProps {
  data: PersonalData
  updateData: (data: Partial<PersonalData>) => void
  onNext: () => void
}

export function PersonalDetails({ data, updateData, onNext }: PersonalDetailsProps) {
  const [errors, setErrors] = useState<Partial<PersonalData>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof PersonalData, boolean>>>({})

  const validateField = (field: keyof PersonalData, value: string): string => {
    switch (field) {
      case "fullName":
        if (!value.trim()) return "Full name is required"
        if (value.length < 3) return "Name must be at least 3 characters"
        return ""
      case "dateOfBirth":
        if (!value) return "Date of birth is required"
        return ""
      case "gender":
        if (!value) return "Please select your gender"
        return ""
      case "category":
        if (!value) return "Please select your category"
        return ""
      case "aadhaarNumber":
        if (!value.trim()) return "Aadhaar number is required"
        if (!/^\d{12}$/.test(value.replace(/\s/g, ""))) return "Enter valid 12-digit Aadhaar"
        return ""
      case "mobileNumber":
        if (!value.trim()) return "Mobile number is required"
        if (!/^\d{10}$/.test(value)) return "Enter valid 10-digit mobile number"
        return ""
      case "email":
        if (!value.trim()) return "Email is required"
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter valid email address"
        return ""
      default:
        return ""
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<PersonalData> = {}
    let isValid = true

    ;(Object.keys(data) as Array<keyof PersonalData>).forEach((field) => {
      const error = validateField(field, data[field])
      if (error) {
        newErrors[field] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleBlur = (field: keyof PersonalData) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const error = validateField(field, data[field])
    setErrors((prev) => ({ ...prev, [field]: error }))
  }

  const handleChange = (field: keyof PersonalData, value: string) => {
    updateData({ [field]: value })
    if (touched[field]) {
      const error = validateField(field, value)
      setErrors((prev) => ({ ...prev, [field]: error }))
    }
  }

  const handleNext = () => {
    const allTouched: Partial<Record<keyof PersonalData, boolean>> = {}
    ;(Object.keys(data) as Array<keyof PersonalData>).forEach((field) => {
      allTouched[field] = true
    })
    setTouched(allTouched)

    if (validateForm()) {
      onNext()
    }
  }

  const isFormValid = Object.keys(data).every(
    (field) => !validateField(field as keyof PersonalData, data[field as keyof PersonalData])
  )

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight">
          Personal Details
        </h2>
        <p className="text-muted-foreground">
          Please provide your basic personal information
        </p>
      </div>

      <FieldGroup>
        <div className="grid gap-6 md:grid-cols-2">
          <Field>
            <FieldLabel className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              Full Name <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              placeholder="Enter your full name"
              value={data.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              onBlur={() => handleBlur("fullName")}
              aria-invalid={!!errors.fullName}
            />
            {touched.fullName && errors.fullName && (
              <FieldError>{errors.fullName}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Date of Birth <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              type="date"
              value={data.dateOfBirth}
              onChange={(e) => handleChange("dateOfBirth", e.target.value)}
              onBlur={() => handleBlur("dateOfBirth")}
              max={new Date().toISOString().split("T")[0]}
              aria-invalid={!!errors.dateOfBirth}
            />
            {touched.dateOfBirth && errors.dateOfBirth && (
              <FieldError>{errors.dateOfBirth}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              Gender <span className="text-destructive">*</span>
            </FieldLabel>
            <Select
              value={data.gender}
              onValueChange={(value) => {
                handleChange("gender", value)
                setTouched((prev) => ({ ...prev, gender: true }))
              }}
            >
              <SelectTrigger className="w-full" aria-invalid={!!errors.gender}>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {touched.gender && errors.gender && (
              <FieldError>{errors.gender}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              Category <span className="text-destructive">*</span>
            </FieldLabel>
            <Select
              value={data.category}
              onValueChange={(value) => {
                handleChange("category", value)
                setTouched((prev) => ({ ...prev, category: true }))
              }}
            >
              <SelectTrigger className="w-full" aria-invalid={!!errors.category}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="obc">OBC</SelectItem>
                <SelectItem value="sc">SC</SelectItem>
                <SelectItem value="st">ST</SelectItem>
              </SelectContent>
            </Select>
            {touched.category && errors.category && (
              <FieldError>{errors.category}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              Aadhaar Number <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              placeholder="XXXX XXXX XXXX"
              value={data.aadhaarNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 12)
                handleChange("aadhaarNumber", value)
              }}
              onBlur={() => handleBlur("aadhaarNumber")}
              aria-invalid={!!errors.aadhaarNumber}
            />
            {touched.aadhaarNumber && errors.aadhaarNumber && (
              <FieldError>{errors.aadhaarNumber}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              Mobile Number <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              type="tel"
              placeholder="10-digit mobile number"
              value={data.mobileNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 10)
                handleChange("mobileNumber", value)
              }}
              onBlur={() => handleBlur("mobileNumber")}
              aria-invalid={!!errors.mobileNumber}
            />
            {touched.mobileNumber && errors.mobileNumber && (
              <FieldError>{errors.mobileNumber}</FieldError>
            )}
          </Field>

          <Field className="md:col-span-2">
            <FieldLabel className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              Email ID <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              type="email"
              placeholder="your.email@example.com"
              value={data.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              aria-invalid={!!errors.email}
            />
            {touched.email && errors.email && (
              <FieldError>{errors.email}</FieldError>
            )}
          </Field>
        </div>
      </FieldGroup>

      <div className="flex justify-end pt-4">
        <Button
          onClick={handleNext}
          className="gap-2 bg-primary px-6 hover:bg-primary/90"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
