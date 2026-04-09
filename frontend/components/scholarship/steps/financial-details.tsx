"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldGroup, FieldError } from "@/components/ui/field"
import { ArrowLeft, ArrowRight, IndianRupee, Building, CreditCard, Info } from "lucide-react"

interface FinancialData {
  familyIncome: string
  bankAccountNumber: string
  ifscCode: string
}

interface FinancialDetailsProps {
  data: FinancialData
  updateData: (data: Partial<FinancialData>) => void
  onNext: () => void
  onPrev: () => void
}

export function FinancialDetails({ data, updateData, onNext, onPrev }: FinancialDetailsProps) {
  const [errors, setErrors] = useState<Partial<FinancialData>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof FinancialData, boolean>>>({})

  const validateField = (field: keyof FinancialData, value: string): string => {
    switch (field) {
      case "familyIncome":
        if (!value.trim()) return "Family income is required"
        const income = parseInt(value)
        if (isNaN(income) || income < 0) return "Enter valid income amount"
        return ""
      case "bankAccountNumber":
        if (!value.trim()) return "Bank account number is required"
        if (!/^\d{9,18}$/.test(value)) return "Enter valid account number (9-18 digits)"
        return ""
      case "ifscCode":
        if (!value.trim()) return "IFSC code is required"
        if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value.toUpperCase())) 
          return "Enter valid IFSC code (e.g., SBIN0001234)"
        return ""
      default:
        return ""
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<FinancialData> = {}
    let isValid = true

    ;(Object.keys(data) as Array<keyof FinancialData>).forEach((field) => {
      const error = validateField(field, data[field])
      if (error) {
        newErrors[field] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleBlur = (field: keyof FinancialData) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const error = validateField(field, data[field])
    setErrors((prev) => ({ ...prev, [field]: error }))
  }

  const handleChange = (field: keyof FinancialData, value: string) => {
    updateData({ [field]: value })
    if (touched[field]) {
      const error = validateField(field, value)
      setErrors((prev) => ({ ...prev, [field]: error }))
    }
  }

  const handleNext = () => {
    const allTouched: Partial<Record<keyof FinancialData, boolean>> = {}
    ;(Object.keys(data) as Array<keyof FinancialData>).forEach((field) => {
      allTouched[field] = true
    })
    setTouched(allTouched)

    if (validateForm()) {
      onNext()
    }
  }

  const formatIncome = (value: string) => {
    const num = parseInt(value)
    if (isNaN(num)) return ""
    return new Intl.NumberFormat("en-IN").format(num)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight">
          Financial Details
        </h2>
        <p className="text-muted-foreground">
          Provide your family income and bank details for scholarship disbursement
        </p>
      </div>

      {/* Scholarship Amount Card */}
      <div className="rounded-xl border border-accent/30 bg-accent/10 p-4">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-accent/20 p-2">
            <IndianRupee className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Scholarship Amount</h3>
            <p className="mt-1 text-2xl font-bold text-accent">
              ₹50,000
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Fixed amount per academic year. The amount will be directly transferred to your bank account.
            </p>
          </div>
        </div>
      </div>

      <FieldGroup>
        <div className="grid gap-6">
          <Field>
            <FieldLabel className="flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
              Annual Family Income (₹) <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              placeholder="Enter annual family income"
              value={data.familyIncome}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "")
                handleChange("familyIncome", value)
              }}
              onBlur={() => handleBlur("familyIncome")}
              aria-invalid={!!errors.familyIncome}
            />
            {data.familyIncome && (
              <p className="text-sm text-muted-foreground">
                ₹ {formatIncome(data.familyIncome)} per year
              </p>
            )}
            {touched.familyIncome && errors.familyIncome && (
              <FieldError>{errors.familyIncome}</FieldError>
            )}
          </Field>

          <div className="grid gap-6 md:grid-cols-2">
            <Field>
              <FieldLabel className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                Bank Account Number <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                placeholder="Enter account number"
                value={data.bankAccountNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 18)
                  handleChange("bankAccountNumber", value)
                }}
                onBlur={() => handleBlur("bankAccountNumber")}
                aria-invalid={!!errors.bankAccountNumber}
              />
              {touched.bankAccountNumber && errors.bankAccountNumber && (
                <FieldError>{errors.bankAccountNumber}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                IFSC Code <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                placeholder="e.g., SBIN0001234"
                value={data.ifscCode}
                onChange={(e) => handleChange("ifscCode", e.target.value.toUpperCase())}
                onBlur={() => handleBlur("ifscCode")}
                aria-invalid={!!errors.ifscCode}
                maxLength={11}
              />
              {touched.ifscCode && errors.ifscCode && (
                <FieldError>{errors.ifscCode}</FieldError>
              )}
            </Field>
          </div>
        </div>
      </FieldGroup>

      {/* Info Note */}
      <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
        <Info className="h-5 w-5 shrink-0 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Please ensure your bank account details are correct. The scholarship amount will be 
          directly transferred to this account. The account must be in the applicant&apos;s name.
        </p>
      </div>

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
