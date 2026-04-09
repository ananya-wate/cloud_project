"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  CheckCircle2, 
  Clock, 
  IndianRupee, 
  TrendingUp,
  FileText,
  Download,
  GraduationCap,
  Calendar,
  Phone,
  Mail,
  HelpCircle,
  ExternalLink,
  Award
} from "lucide-react"

interface DashboardProps {
  applicationData: Record<string, unknown> | null
}

export function Dashboard({ applicationData }: DashboardProps) {
  const applicationId = `NSP${Date.now().toString().slice(-8)}`
  const submissionDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  })

  // Mock data for demonstration
  const applicationStatus = {
    status: "Under Review",
    statusType: "pending" as const,
    rank: 1247,
    totalApplicants: 15632,
    estimatedDate: "15 May 2026",
    amountSanctioned: 50000,
    amountDisbursed: 0
  }

  const getStatusConfig = (type: string) => {
    switch (type) {
      case "approved":
        return {
          bg: "bg-accent/10",
          text: "text-accent",
          icon: CheckCircle2,
          label: "Approved"
        }
      case "rejected":
        return {
          bg: "bg-destructive/10",
          text: "text-destructive",
          icon: Clock,
          label: "Rejected"
        }
      default:
        return {
          bg: "bg-amber-500/10",
          text: "text-amber-600",
          icon: Clock,
          label: "Under Review"
        }
    }
  }

  const statusConfig = getStatusConfig(applicationStatus.statusType)
  const StatusIcon = statusConfig.icon

  const personal = (applicationData as { personal?: { fullName?: string; email?: string; mobileNumber?: string } })?.personal
  const education = (applicationData as { education?: { instituteName?: string; courseName?: string } })?.education

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 md:py-12">
      {/* Header */}
      <header className="mb-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-accent/20"
        >
          <CheckCircle2 className="h-10 w-10 text-accent" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-foreground md:text-4xl"
        >
          Application Submitted Successfully!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-2 text-muted-foreground"
        >
          Your scholarship application has been received and is being processed
        </motion.p>
      </header>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Application Details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Application Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="overflow-hidden border-0 bg-card/80 shadow-xl backdrop-blur-sm">
              <div className="border-b bg-gradient-to-r from-primary/10 to-accent/10 p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Application ID</p>
                    <p className="font-mono text-lg font-bold text-foreground">{applicationId}</p>
                  </div>
                  <div className={`inline-flex items-center gap-2 rounded-full ${statusConfig.bg} px-4 py-2`}>
                    <StatusIcon className={`h-4 w-4 ${statusConfig.text}`} />
                    <span className={`text-sm font-medium ${statusConfig.text}`}>
                      {applicationStatus.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-muted p-2">
                      <GraduationCap className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Applicant Name</p>
                      <p className="font-medium text-foreground">
                        {personal?.fullName || "Applicant"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-muted p-2">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Submission Date</p>
                      <p className="font-medium text-foreground">{submissionDate}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-muted p-2">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium text-foreground">
                        {personal?.email || "email@example.com"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-muted p-2">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Mobile</p>
                      <p className="font-medium text-foreground">
                        +91 {personal?.mobileNumber || "XXXXXXXXXX"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Institute Info */}
                <div className="mt-6 rounded-lg bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground">Institute</p>
                  <p className="font-medium text-foreground">
                    {education?.instituteName || "Institute Name"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {education?.courseName || "Course Name"}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Ranking Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-0 bg-card/80 p-6 shadow-xl backdrop-blur-sm">
              <h3 className="mb-4 flex items-center gap-2 font-[family-name:var(--font-display)] text-lg font-semibold">
                <Award className="h-5 w-5 text-primary" />
                Application Ranking
              </h3>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-primary/10 p-4 text-center">
                  <p className="text-3xl font-bold text-primary">
                    #{applicationStatus.rank}
                  </p>
                  <p className="text-sm text-muted-foreground">Your Rank</p>
                </div>
                <div className="rounded-lg bg-muted p-4 text-center">
                  <p className="text-3xl font-bold text-foreground">
                    {applicationStatus.totalApplicants.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Applicants</p>
                </div>
                <div className="rounded-lg bg-accent/10 p-4 text-center">
                  <p className="text-lg font-bold text-accent">
                    {applicationStatus.estimatedDate}
                  </p>
                  <p className="text-sm text-muted-foreground">Expected Decision</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-muted-foreground">Processing Progress</span>
                  <span className="font-medium text-primary">35%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "35%" }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                  />
                </div>
                <div className="mt-4 flex justify-between text-xs text-muted-foreground">
                  <span>Submitted</span>
                  <span>Document Verification</span>
                  <span>Final Review</span>
                  <span>Approved</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Right Column - Stats & Actions */}
        <div className="space-y-6">
          {/* Scholarship Amount Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <IndianRupee className="h-8 w-8 opacity-80" />
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
                  Scholarship
                </span>
              </div>
              <p className="text-sm opacity-80">Amount Sanctioned</p>
              <p className="text-3xl font-bold">
                ₹{applicationStatus.amountSanctioned.toLocaleString()}
              </p>
              <div className="mt-4 border-t border-white/20 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="opacity-80">Disbursed</span>
                  <span className="font-medium">
                    ₹{applicationStatus.amountDisbursed.toLocaleString()}
                  </span>
                </div>
                <div className="mt-2 flex justify-between text-sm">
                  <span className="opacity-80">Remaining</span>
                  <span className="font-medium">
                    ₹{(applicationStatus.amountSanctioned - applicationStatus.amountDisbursed).toLocaleString()}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="border-0 bg-card/80 p-6 shadow-xl backdrop-blur-sm">
              <h3 className="mb-4 font-semibold text-foreground">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-accent/10 p-2">
                      <TrendingUp className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-sm text-muted-foreground">Success Rate</span>
                  </div>
                  <span className="font-semibold text-foreground">78%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">Avg. Processing</span>
                  </div>
                  <span className="font-semibold text-foreground">21 Days</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-amber-500/10 p-2">
                      <FileText className="h-4 w-4 text-amber-600" />
                    </div>
                    <span className="text-sm text-muted-foreground">Documents</span>
                  </div>
                  <span className="font-semibold text-foreground">7 Uploaded</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-3"
          >
            <Button className="w-full gap-2" variant="outline">
              <Download className="h-4 w-4" />
              Download Receipt
            </Button>
            <Button className="w-full gap-2" variant="outline">
              <FileText className="h-4 w-4" />
              View Application
            </Button>
            <Button className="w-full gap-2" variant="outline">
              <HelpCircle className="h-4 w-4" />
              Track Status
            </Button>
          </motion.div>

          {/* Help Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Card className="border-0 bg-muted/50 p-4">
              <h4 className="mb-2 font-medium text-foreground">Need Help?</h4>
              <p className="mb-3 text-sm text-muted-foreground">
                Contact our support team for any queries
              </p>
              <a
                href="mailto:support@scholarship.gov.in"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                support@scholarship.gov.in
                <ExternalLink className="h-3 w-3" />
              </a>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>© 2026 National Scholarship Portal. All rights reserved.</p>
        <p className="mt-1">
          An initiative of the Government of India
        </p>
      </footer>
    </div>
  )
}
