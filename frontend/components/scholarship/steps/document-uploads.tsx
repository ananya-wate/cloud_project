"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel, FieldGroup, FieldError } from "@/components/ui/field"
import { 
  ArrowLeft, 
  ArrowRight, 
  Upload, 
  FileText, 
  Check, 
  X, 
  CreditCard,
  FileSpreadsheet,
  Building,
  Users,
  MapPin,
  Flag
} from "lucide-react"
import { cn } from "@/lib/utils"

interface DocumentsData {
  aadhaarCard: File | null
  incomeCertificate: File | null
  marksheet: File | null
  bankPassbook: File | null
  casteCertificate: File | null
  domicileCertificate: File | null
  nationalityCertificate: File | null
}

interface DocumentUploadsProps {
  data: DocumentsData
  updateData: (data: Partial<DocumentsData>) => void
  onNext: () => void
  onPrev: () => void
}

interface DocumentField {
  key: keyof DocumentsData
  label: string
  required: boolean
  icon: React.ElementType
  description: string
}

const documentFields: DocumentField[] = [
  {
    key: "aadhaarCard",
    label: "Aadhaar Card",
    required: true,
    icon: CreditCard,
    description: "Front & back of Aadhaar card"
  },
  {
    key: "incomeCertificate",
    label: "Income Certificate",
    required: true,
    icon: FileSpreadsheet,
    description: "Issued by authorized authority"
  },
  {
    key: "marksheet",
    label: "Marksheet",
    required: true,
    icon: FileText,
    description: "Latest semester/year marksheet"
  },
  {
    key: "bankPassbook",
    label: "Bank Passbook",
    required: true,
    icon: Building,
    description: "First page with account details"
  },
  {
    key: "casteCertificate",
    label: "Caste Certificate",
    required: false,
    icon: Users,
    description: "If applicable (SC/ST/OBC)"
  },
  {
    key: "domicileCertificate",
    label: "Domicile Certificate",
    required: true,
    icon: MapPin,
    description: "Proof of residence"
  },
  {
    key: "nationalityCertificate",
    label: "Nationality Certificate",
    required: true,
    icon: Flag,
    description: "Indian citizenship proof"
  }
]

export function DocumentUploads({ data, updateData, onNext, onPrev }: DocumentUploadsProps) {
  const [errors, setErrors] = useState<Partial<Record<keyof DocumentsData, string>>>({})
  const [dragOver, setDragOver] = useState<keyof DocumentsData | null>(null)

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof DocumentsData, string>> = {}
    let isValid = true

    documentFields.forEach((field) => {
      if (field.required && !data[field.key]) {
        newErrors[field.key] = `${field.label} is required`
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleFileChange = useCallback((
    field: keyof DocumentsData,
    file: File | null
  ) => {
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          [field]: "Only PDF, JPG, JPEG, PNG files are allowed"
        }))
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          [field]: "File size must be less than 5MB"
        }))
        return
      }

      setErrors(prev => ({ ...prev, [field]: undefined }))
    }

    updateData({ [field]: file })
  }, [updateData])

  const handleDrop = useCallback((
    e: React.DragEvent<HTMLDivElement>,
    field: keyof DocumentsData
  ) => {
    e.preventDefault()
    setDragOver(null)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileChange(field, file)
    }
  }, [handleFileChange])

  const handleDragOver = useCallback((
    e: React.DragEvent<HTMLDivElement>,
    field: keyof DocumentsData
  ) => {
    e.preventDefault()
    setDragOver(field)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOver(null)
  }, [])

  const handleNext = () => {
    if (validateForm()) {
      onNext()
    }
  }

  const removeFile = (field: keyof DocumentsData) => {
    updateData({ [field]: null })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight">
          Document Uploads
        </h2>
        <p className="text-muted-foreground">
          Upload required documents (PDF, JPG, PNG - Max 5MB each)
        </p>
      </div>

      <FieldGroup>
        <div className="grid gap-4 sm:grid-cols-2">
          {documentFields.map((field) => {
            const Icon = field.icon
            const file = data[field.key]
            const hasError = !!errors[field.key]
            const isDraggedOver = dragOver === field.key

            return (
              <Field key={field.key}>
                <FieldLabel className="mb-2 flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  {field.label}
                  {field.required && <span className="text-destructive">*</span>}
                  {!field.required && (
                    <span className="text-xs text-muted-foreground">(Optional)</span>
                  )}
                </FieldLabel>

                <div
                  className={cn(
                    "relative rounded-xl border-2 border-dashed transition-all",
                    isDraggedOver 
                      ? "border-primary bg-primary/5" 
                      : file 
                        ? "border-accent bg-accent/5" 
                        : hasError 
                          ? "border-destructive bg-destructive/5"
                          : "border-muted hover:border-muted-foreground/50",
                    "cursor-pointer"
                  )}
                  onDrop={(e) => handleDrop(e, field.key)}
                  onDragOver={(e) => handleDragOver(e, field.key)}
                  onDragLeave={handleDragLeave}
                >
                  {file ? (
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-accent/20 p-2">
                          <Check className="h-4 w-4 text-accent" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="truncate text-sm font-medium text-foreground">
                            {file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeFile(field.key)
                        }}
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex cursor-pointer flex-col items-center justify-center p-6">
                      <div className="mb-2 rounded-full bg-muted p-3">
                        <Upload className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        Drop file or click to upload
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {field.description}
                      </p>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const selectedFile = e.target.files?.[0]
                          if (selectedFile) {
                            handleFileChange(field.key, selectedFile)
                          }
                        }}
                      />
                    </label>
                  )}
                </div>

                {hasError && (
                  <FieldError className="mt-1">{errors[field.key]}</FieldError>
                )}
              </Field>
            )
          })}
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
          Review Application
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
