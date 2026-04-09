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
import { ArrowLeft, ArrowRight, MapPin, Building2, Globe } from "lucide-react"

interface AddressData {
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  pincode: string
}

interface AddressDetailsProps {
  data: AddressData
  updateData: (data: Partial<AddressData>) => void
  onNext: () => void
  onPrev: () => void
}

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Chandigarh", "Puducherry"
]

export function AddressDetails({ data, updateData, onNext, onPrev }: AddressDetailsProps) {
  const [errors, setErrors] = useState<Partial<AddressData>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof AddressData, boolean>>>({})

  const validateField = (field: keyof AddressData, value: string): string => {
    switch (field) {
      case "addressLine1":
        if (!value.trim()) return "Address line 1 is required"
        if (value.length < 10) return "Please enter a complete address"
        return ""
      case "addressLine2":
        return "" // Optional field
      case "city":
        if (!value.trim()) return "City is required"
        return ""
      case "state":
        if (!value) return "Please select your state"
        return ""
      case "pincode":
        if (!value.trim()) return "Pincode is required"
        if (!/^\d{6}$/.test(value)) return "Enter valid 6-digit pincode"
        return ""
      default:
        return ""
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<AddressData> = {}
    let isValid = true
    const requiredFields: Array<keyof AddressData> = ["addressLine1", "city", "state", "pincode"]

    requiredFields.forEach((field) => {
      const error = validateField(field, data[field])
      if (error) {
        newErrors[field] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleBlur = (field: keyof AddressData) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const error = validateField(field, data[field])
    setErrors((prev) => ({ ...prev, [field]: error }))
  }

  const handleChange = (field: keyof AddressData, value: string) => {
    updateData({ [field]: value })
    if (touched[field]) {
      const error = validateField(field, value)
      setErrors((prev) => ({ ...prev, [field]: error }))
    }
  }

  const handleNext = () => {
    const requiredFields: Array<keyof AddressData> = ["addressLine1", "city", "state", "pincode"]
    const allTouched: Partial<Record<keyof AddressData, boolean>> = {}
    requiredFields.forEach((field) => {
      allTouched[field] = true
    })
    setTouched(allTouched)

    if (validateForm()) {
      onNext()
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight">
          Address Details
        </h2>
        <p className="text-muted-foreground">
          Enter your current residential address
        </p>
      </div>

      <FieldGroup>
        <div className="grid gap-6">
          <Field>
            <FieldLabel className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              Address Line 1 <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              placeholder="House/Flat No., Building Name, Street"
              value={data.addressLine1}
              onChange={(e) => handleChange("addressLine1", e.target.value)}
              onBlur={() => handleBlur("addressLine1")}
              aria-invalid={!!errors.addressLine1}
            />
            {touched.addressLine1 && errors.addressLine1 && (
              <FieldError>{errors.addressLine1}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              Address Line 2
            </FieldLabel>
            <Input
              placeholder="Area, Locality, Landmark (Optional)"
              value={data.addressLine2}
              onChange={(e) => handleChange("addressLine2", e.target.value)}
            />
          </Field>

          <div className="grid gap-6 md:grid-cols-2">
            <Field>
              <FieldLabel className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                City <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                placeholder="Enter city name"
                value={data.city}
                onChange={(e) => handleChange("city", e.target.value)}
                onBlur={() => handleBlur("city")}
                aria-invalid={!!errors.city}
              />
              {touched.city && errors.city && (
                <FieldError>{errors.city}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                State <span className="text-destructive">*</span>
              </FieldLabel>
              <Select
                value={data.state}
                onValueChange={(value) => {
                  handleChange("state", value)
                  setTouched((prev) => ({ ...prev, state: true }))
                }}
              >
                <SelectTrigger className="w-full" aria-invalid={!!errors.state}>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {indianStates.map((state) => (
                    <SelectItem key={state} value={state.toLowerCase()}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {touched.state && errors.state && (
                <FieldError>{errors.state}</FieldError>
              )}
            </Field>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Field>
              <FieldLabel className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Pincode <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                placeholder="6-digit pincode"
                value={data.pincode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                  handleChange("pincode", value)
                }}
                onBlur={() => handleBlur("pincode")}
                aria-invalid={!!errors.pincode}
              />
              {touched.pincode && errors.pincode && (
                <FieldError>{errors.pincode}</FieldError>
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
