'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase'
import { STRIPE_PLANS } from '@/lib/stripe'
import { formatDate, formatFileSize } from '@/lib/utils'
import { Job, OutputFile } from '@/types/database'
import { Upload, Download, Clock, CheckCircle, AlertCircle, Loader2, Plus } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    if (user) {
      fetchJobs()
    }
  }, [user])

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setJobs(data || [])
    } catch (error) {
      console.error('Error fetching jobs:', error)
      toast("Failed to load your jobs.", {
        description: "Error"
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'processing':
        return <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const downloadFile = async (file: OutputFile) => {
    try {
      const { data, error } = await supabase.storage
        .from('embroidery-files')
        .download(file.file_path)

      if (error) throw error

      // Create download link
      const url = window.URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = url
      a.download = `${file.format.toLowerCase()}_file.${file.format.toLowerCase()}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast(`Downloading ${file.format} file.`, {
        description: "Download started"
      })
    } catch (error) {
      console.error('Download error:', error)
      toast("Failed to download file.", {
        description: "Download failed"
      })
    }
  }

  const filteredJobs = jobs.filter(job => {
    if (activeTab === 'all') return true
    return job.status === activeTab
  })

  if (!user) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold mb-4">Please sign in to view your dashboard</h1>
        <Button onClick={() => router.push('/auth/signin')}>
          Sign In
        </Button>
      </div>
    )
  }

  const userPlan = STRIPE_PLANS[user.subscription_tier as keyof typeof STRIPE_PLANS]

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.full_name || user.email}
          </p>
        </div>
        <Button onClick={() => router.push('/upload')}>
          <Plus className="w-4 h-4 mr-2" />
          Upload New File
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs.length}</div>
            <p className="text-xs text-muted-foreground">
              All time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.jobs_used_this_month}</div>
            <p className="text-xs text-muted-foreground">
              / {userPlan.jobsPerMonth} limit
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {jobs.filter(job => job.status === 'completed').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Ready to download
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
            <Badge variant="secondary">{userPlan.name}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${userPlan.price}</div>
            <p className="text-xs text-muted-foreground">
              per month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Jobs Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Your Jobs</CardTitle>
          <CardDescription>
            Track the progress of your embroidery digitization jobs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All ({jobs.length})</TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({jobs.filter(job => job.status === 'pending').length})
              </TabsTrigger>
              <TabsTrigger value="processing">
                Processing ({jobs.filter(job => job.status === 'processing').length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({jobs.filter(job => job.status === 'completed').length})
              </TabsTrigger>
              <TabsTrigger value="failed">
                Failed ({jobs.filter(job => job.status === 'failed').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {loading ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                  <p>Loading your jobs...</p>
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No jobs found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredJobs.map((job) => (
                    <div key={job.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(job.status)}
                          <div>
                            <h3 className="font-medium">{job.input_file_name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {formatFileSize(job.input_file_size)} • {job.input_file_type}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(job.status)}>
                            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                          </Badge>
                          {job.priority && (
                            <Badge variant="secondary">Priority</Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Uploaded: {formatDate(job.created_at)}</span>
                        <span>Formats: {job.output_formats.join(', ')}</span>
                      </div>

                      {job.status === 'completed' && job.output_files && job.output_files.length > 0 && (
                        <div className="border-t pt-3">
                          <h4 className="font-medium mb-2">Download Files:</h4>
                          <div className="flex flex-wrap gap-2">
                            {job.output_files.map((file, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => downloadFile(file)}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                {file.format} ({formatFileSize(file.file_size)})
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      {job.status === 'failed' && job.error_message && (
                        <div className="border-t pt-3">
                          <p className="text-sm text-red-600">
                            Error: {job.error_message}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
