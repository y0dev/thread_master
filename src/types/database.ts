export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  subscription_tier: 'FREE' | 'BASIC' | 'PRO'
  subscription_status: 'active' | 'inactive' | 'past_due'
  stripe_customer_id?: string
  jobs_used_this_month: number
  created_at: string
  updated_at: string
}

export interface Job {
  id: string
  user_id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  priority: boolean
  input_file_path: string
  input_file_name: string
  input_file_size: number
  input_file_type: string
  output_formats: string[]
  output_files: OutputFile[]
  error_message?: string
  processing_started_at?: string
  completed_at?: string
  created_at: string
  updated_at: string
}

export interface OutputFile {
  format: string
  file_path: string
  file_size: number
  download_url?: string
}

export interface Subscription {
  id: string
  user_id: string
  stripe_subscription_id: string
  stripe_price_id: string
  status: 'active' | 'inactive' | 'past_due' | 'canceled'
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}

export interface FileUpload {
  id: string
  user_id: string
  file_name: string
  file_size: number
  file_type: string
  file_path: string
  upload_date: string
}
