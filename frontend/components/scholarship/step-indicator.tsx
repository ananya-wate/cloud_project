"use client"

import { motion } from "framer-motion"
import { Check, User, MapPin, BookOpen, Wallet, FileText, ClipboardCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  id: number
  title: string
  description: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
}

const stepIcons = [User, MapPin, BookOpen, Wallet, FileText, ClipboardCheck]

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100

  return (
    <div className="sticky top-0 z-10 bg-background/80 py-4 backdrop-blur-md">
      {/* Progress Bar */}
      <div className="mb-6 overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-2 rounded-full bg-gradient-to-r from-primary to-accent"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Progress Percentage */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          Step {currentStep} of {steps.length}
        </span>
        <span className="text-sm font-semibold text-primary">
          {Math.round(progress)}% Complete
        </span>
      </div>

      {/* Steps */}
      <div className="hidden overflow-x-auto md:block">
        <div className="flex min-w-max items-center justify-between gap-2">
          {steps.map((step, index) => {
            const Icon = stepIcons[index]
            const isCompleted = currentStep > step.id
            const isCurrent = currentStep === step.id

            return (
              <div
                key={step.id}
                className="flex flex-1 items-center"
              >
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={false}
                    animate={{
                      scale: isCurrent ? 1.1 : 1,
                      backgroundColor: isCompleted
                        ? "var(--color-accent)"
                        : isCurrent
                        ? "var(--color-primary)"
                        : "var(--color-muted)",
                    }}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                      isCompleted || isCurrent
                        ? "text-primary-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </motion.div>
                  <div className="mt-2 text-center">
                    <p
                      className={cn(
                        "text-xs font-medium",
                        isCurrent
                          ? "text-foreground"
                          : isCompleted
                          ? "text-accent"
                          : "text-muted-foreground"
                      )}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "mx-2 h-0.5 flex-1",
                      currentStep > step.id ? "bg-accent" : "bg-muted"
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Mobile Steps */}
      <div className="md:hidden">
        <div className="flex items-center gap-3">
          {(() => {
            const Icon = stepIcons[currentStep - 1]
            return (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {steps[currentStep - 1].title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {steps[currentStep - 1].description}
                  </p>
                </div>
              </>
            )
          })()}
        </div>
      </div>
    </div>
  )
}
