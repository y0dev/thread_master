import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// Mock worker service that processes embroidery digitization jobs
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { jobId } = await request.json()

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 })
    }

    // Get the job details
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single()

    if (jobError || !job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    // Update job status to processing
    await supabase
      .from('jobs')
      .update({ 
        status: 'processing',
        processing_started_at: new Date().toISOString()
      })
      .eq('id', jobId)

    // Simulate processing time (in production, this would be actual digitization)
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Mock output files based on requested formats
    const mockOutputFiles = job.output_formats.map((format: string) => ({
      format,
      file_path: `outputs/${jobId}/${format.toLowerCase()}_file.${format.toLowerCase()}`,
      file_size: Math.floor(Math.random() * 100000) + 50000, // 50-150KB
      download_url: `/api/download/${jobId}/${format}`
    }))

    // Update job as completed
    await supabase
      .from('jobs')
      .update({ 
        status: 'completed',
        output_files: mockOutputFiles,
        completed_at: new Date().toISOString()
      })
      .eq('id', jobId)

    return NextResponse.json({ 
      success: true, 
      message: 'Job processed successfully',
      outputFiles: mockOutputFiles
    })

  } catch (error) {
    console.error('Worker service error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

// Get job status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('jobId')

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 })
    }

    const supabase = createServerClient()
    const { data: job, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single()

    if (error || !job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    return NextResponse.json({ job })

  } catch (error) {
    console.error('Get job status error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
