from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.security import HTTPBearer
from pydantic import BaseModel
import psycopg2
import redis
import json
import os
import asyncio
from typing import List, Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="ThreadMaster Worker Service", version="1.0.0")

# Configuration
DATABASE_URL = os.getenv("DATABASE_URL")
REDIS_URL = os.getenv("REDIS_URL")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
WORKER_API_KEY = os.getenv("WORKER_API_API_KEY")

# Security
security = HTTPBearer()

# Models
class JobRequest(BaseModel):
    job_id: str
    input_file_path: str
    output_formats: List[str]
    priority: bool = False

class JobStatus(BaseModel):
    job_id: str
    status: str
    progress: int
    message: str
    output_files: Optional[List[dict]] = None

# Database connection
def get_db_connection():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        return conn
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        raise HTTPException(status_code=500, detail="Database connection failed")

# Redis connection
def get_redis_connection():
    try:
        r = redis.from_url(REDIS_URL)
        return r
    except Exception as e:
        logger.error(f"Redis connection failed: {e}")
        raise HTTPException(status_code=500, detail="Redis connection failed")

# Authentication
async def verify_api_key(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    
    token = authorization.replace("Bearer ", "")
    if token != WORKER_API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")
    
    return token

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "threadmaster-worker"}

@app.post("/process-job", dependencies=[Depends(verify_api_key)])
async def process_job(job_request: JobRequest):
    """Process an embroidery digitization job"""
    try:
        logger.info(f"Processing job: {job_request.job_id}")
        
        # Update job status to processing
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            UPDATE jobs 
            SET status = 'processing', processing_started_at = NOW() 
            WHERE id = %s
        """, (job_request.job_id,))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        # Simulate processing (replace with actual digitization logic)
        await simulate_digitization(job_request)
        
        # Update job as completed
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Mock output files
        output_files = []
        for format_type in job_request.output_formats:
            output_file = {
                "format": format_type,
                "file_path": f"outputs/{job_request.job_id}/{format_type.lower()}_file.{format_type.lower()}",
                "file_size": 102400,  # 100KB mock size
                "download_url": f"/api/download/{job_request.job_id}/{format_type}"
            }
            output_files.append(output_file)
        
        cursor.execute("""
            UPDATE jobs 
            SET status = 'completed', 
                output_files = %s,
                completed_at = NOW() 
            WHERE id = %s
        """, (json.dumps(output_files), job_request.job_id))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        logger.info(f"Job {job_request.job_id} completed successfully")
        
        return {
            "success": True,
            "job_id": job_request.job_id,
            "status": "completed",
            "output_files": output_files
        }
        
    except Exception as e:
        logger.error(f"Error processing job {job_request.job_id}: {e}")
        
        # Update job status to failed
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            
            cursor.execute("""
                UPDATE jobs 
                SET status = 'failed', 
                    error_message = %s 
                WHERE id = %s
            """, (str(e), job_request.job_id))
            
            conn.commit()
            cursor.close()
            conn.close()
        except Exception as update_error:
            logger.error(f"Failed to update job status: {update_error}")
        
        raise HTTPException(status_code=500, detail=f"Job processing failed: {str(e)}")

async def simulate_digitization(job_request: JobRequest):
    """Simulate embroidery digitization process"""
    # In production, this would use Ink/Stitch or libembroidery
    logger.info(f"Starting digitization for job {job_request.job_id}")
    
    # Simulate processing time based on priority and file complexity
    base_time = 5 if job_request.priority else 10
    processing_time = base_time + len(job_request.output_formats) * 2
    
    for i in range(processing_time):
        await asyncio.sleep(1)
        progress = int((i + 1) / processing_time * 100)
        logger.info(f"Job {job_request.job_id} progress: {progress}%")
    
    logger.info(f"Digitization completed for job {job_request.job_id}")

@app.get("/job-status/{job_id}", dependencies=[Depends(verify_api_key)])
async def get_job_status(job_id: str):
    """Get the status of a specific job"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT status, output_files, error_message, 
                   processing_started_at, completed_at
            FROM jobs 
            WHERE id = %s
        """, (job_id,))
        
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if not result:
            raise HTTPException(status_code=404, detail="Job not found")
        
        status, output_files, error_message, processing_started, completed = result
        
        return {
            "job_id": job_id,
            "status": status,
            "output_files": output_files if output_files else [],
            "error_message": error_message,
            "processing_started_at": processing_started,
            "completed_at": completed
        }
        
    except Exception as e:
        logger.error(f"Error getting job status: {e}")
        raise HTTPException(status_code=500, detail="Failed to get job status")

@app.get("/queue-status", dependencies=[Depends(verify_api_key)])
async def get_queue_status():
    """Get the current job queue status"""
    try:
        r = get_redis_connection()
        
        # Get queue statistics
        pending_jobs = r.llen("job_queue")
        processing_jobs = r.llen("processing_jobs")
        
        return {
            "pending_jobs": pending_jobs,
            "processing_jobs": processing_jobs,
            "total_queued": pending_jobs + processing_jobs
        }
        
    except Exception as e:
        logger.error(f"Error getting queue status: {e}")
        raise HTTPException(status_code=500, detail="Failed to get queue status")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
