"use client"

import { useState } from "react"
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
import { ArrowLeft, ArrowRight, GraduationCap, BookOpen, Calendar, Hash, Percent } from "lucide-react"

interface EducationData {
  instituteName: string
  courseName: string
  year: string
  rollNumber: string
  percentage: string
  passingYear: string
}

interface EducationDetailsProps {
  data: EducationData
  updateData: (data: Partial<EducationData>) => void
  onNext: () => void
  onPrev: () => void
}

export function EducationDetails({ data, updateData, onNext, onPrev }: EducationDetailsProps) {
  const [errors, setErrors] = useState<Partial<EducationData>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof EducationData, boolean>>>({})

  const validateField = (field: keyof EducationData, value: string): string => {
    switch (field) {
      case "instituteName":
        if (!value.trim()) return "Institute name is required"
        if (value.length < 3) return "Please enter valid institute name"
        return ""
      case "courseName":
        if (!value.trim()) return "Course name is required"
        return ""
      case "year":
        if (!value) return "Please select your current year"
        return ""
      case "rollNumber":
        if (!value.trim()) return "Roll number is required"
        return ""
      case "percentage":
        if (!value.trim()) return "Percentage/CGPA is required"
        const num = parseFloat(value)
        if (isNaN(num) || num < 0 || num > 100) return "Enter valid percentage (0-100)"
        return ""
      case "passingYear":
        if (!value.trim()) return "Passing year is required"
        const year = parseInt(value)
        const currentYear = new Date().getFullYear()
        if (isNaN(year) || year < 2000 || year > currentYear + 5) return "Enter valid year"
        return ""
      default:
        return ""
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<EducationData> = {}
    let isValid = true

    ;(Object.keys(data) as Array<keyof EducationData>).forEach((field) => {
      const error = validateField(field, data[field])
      if (error) {
        newErrors[field] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleBlur = (field: keyof EducationData) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const error = validateField(field, data[field])
    setErrors((prev) => ({ ...prev, [field]: error }))
  }

  const handleChange = (field: keyof EducationData, value: string) => {
    updateData({ [field]: value })
    if (touched[field]) {
      const error = validateField(field, value)
      setErrors((prev) => ({ ...prev, [field]: error }))
    }
  }

  const handleNext = () => {
    const allTouched: Partial<Record<keyof EducationData, boolean>> = {}
    ;(Object.keys(data) as Array<keyof EducationData>).forEach((field) => {
      allTouched[field] = true
    })
    setTouched(allTouched)

    if (validateForm()) {
      onNext()
    }
  }

  const currentYear = new Date().getFullYear()
  const passingYears = Array.from({ length: 10 }, (_, i) => currentYear - 3 + i)

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight">
          Education Details
        </h2>
        <p className="text-muted-foreground">
          Provide your current academic information
        </p>
      </div>

      <FieldGroup>
        <div className="grid gap-6">
          <Field>
            <FieldLabel className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              Institute Name <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              placeholder="Enter your college/university name"
              value={data.instituteName}
              onChange={(e) => handleChange("instituteName", e.target.value)}
              onBlur={() => handleBlur("instituteName")}
              aria-invalid={!!errors.instituteName}
            />
            {touched.instituteName && errors.instituteName && (
              <FieldError>{errors.instituteName}</FieldError>
            )}
          </Field>

          <div className="grid gap-6 md:grid-cols-2">
            <Field>
              <FieldLabel className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                Course Name <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                placeholder="e.g., B.Tech, B.Com, BA"
                value={data.courseName}
                onChange={(e) => handleChange("courseName", e.target.value)}
                onBlur={() => handleBlur("courseName")}
                aria-invalid={!!errors.courseName}
              />
              {touched.courseName && errors.courseName && (
                <FieldError>{errors.courseName}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Year <span className="text-destructive">*</span>
              </FieldLabel>
              <Select
                value={data.year}
                onValueChange={(value) => {
                  handleChange("year", value)
                  setTouched((prev) => ({ ...prev, year: true }))
                }}
              >
                <SelectTrigger className="w-full" aria-invalid={!!errors.year}>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fy">First Year (FY)</SelectItem>
                  <SelectItem value="sy">Second Year (SY)</SelectItem>
                  <SelectItem value="ty">Third Year (TY)</SelectItem>
                  <SelectItem value="final">Final Year</SelectItem>
                </SelectContent>
              </Select>
              {touched.year && errors.year && (
                <FieldError>{errors.year}</FieldError>
              )}
            </Field>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Field>
              <FieldLabel className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                Roll Number <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                placeholder="Enter roll number"
                value={data.rollNumber}
                onChange={(e) => handleChange("rollNumber", e.target.value)}
                onBlur={() => handleBlur("rollNumber")}
                aria-invalid={!!errors.rollNumber}
              />
              {touched.rollNumber && errors.rollNumber && (
                <FieldError>{errors.rollNumber}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-muted-foreground" />
                Percentage / CGPA <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                placeholder="e.g., 85.5"
                value={data.percentage}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d.]/g, "")
                  handleChange("percentage", value)
                }}
                onBlur={() => handleBlur("percentage")}
                aria-invalid={!!errors.percentage}
              />
              {touched.percentage && errors.percentage && (
                <FieldError>{errors.percentage}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Expected Passing Year <span className="text-destructive">*</span>
              </FieldLabel>
              <Select
                value={data.passingYear}
                onValueChange={(value) => {
                  handleChange("passingYear", value)
                  setTouched((prev) => ({ ...prev, passingYear: true }))
                }}
              >
                <SelectTrigger className="w-full" aria-invalid={!!errors.passingYear}>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {passingYears.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {touched.passingYear && errors.passingYear && (
                <FieldError>{errors.passingYear}</FieldError>
              )}
            </Field>
          </div>
        </div>
      </FieldGroup>

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={onPrev}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
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
