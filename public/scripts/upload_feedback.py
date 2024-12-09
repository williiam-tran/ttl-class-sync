import sys
import boto3
from botocore.client import Config
import os
from pathlib import Path
from dotenv import load_dotenv
import re
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from google.oauth2.service_account import Credentials

# Load .env from the same directory as this script
script_dir = Path(__file__).parent
env_path = script_dir / '.env'
load_dotenv(env_path)

# Get vault path relative to script directory (3 levels up from scripts folder)
VAULT_PATH = script_dir.parent

# R2 configuration
ACCESS_KEY = os.getenv('R2_ACCESS_KEY')
SECRET_KEY = os.getenv('R2_SECRET_KEY')
BUCKET_NAME = os.getenv('R2_BUCKET_NAME')
ENDPOINT_URL = os.getenv('R2_ENDPOINT_URL')

# Google Drive configuration
SERVICE_ACCOUNT_FILE = script_dir / 'service_account.json'
FOLDER_ID = os.getenv('GOOGLE_DRIVE_FOLDER_ID')

def upload_to_r2(file_path, key):
    """Upload file to R2 bucket."""
    s3 = boto3.client('s3',
                      endpoint_url=ENDPOINT_URL,
                      aws_access_key_id=ACCESS_KEY,
                      aws_secret_access_key=SECRET_KEY,
                      region_name='auto',
                      config=Config(signature_version='s3v4'))
    
    try:
        s3.upload_file(str(file_path), BUCKET_NAME, key)
        print(f"Uploaded to R2: {key}")
        return True
    except Exception as e:
        print(f"Error uploading to R2: {str(e)}")
        return False

def upload_to_drive(file_path, file_name):
    """Upload file to Google Drive using service account."""
    creds = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=["https://www.googleapis.com/auth/drive.file"])
    service = build('drive', 'v3', credentials=creds)

    file_metadata = {
        'name': file_name,
        'parents': [FOLDER_ID]
    }
    media = MediaFileUpload(file_path, mimetype='application/pdf')

    try:
        file = service.files().create(
            body=file_metadata,
            media_body=media,
            fields='id'
        ).execute()
        print(f"Uploaded to Drive: {file.get('id')}")
        return file.get('id')
    except Exception as e:
        print(f"Error uploading to Drive: {str(e)}")
        return None

def main():
    if len(sys.argv) < 2:
        print("Usage: python upload_feedback.py <week_number> [student1,student2,...]")
        return

    # Get week number
    try:
        week_num = int(sys.argv[1])
    except ValueError:
        print("Error: Week number must be an integer")
        return

    # Get student list (all students by default)
    students = ['Thanh', 'TLinh', 'Trung']  # default student list
    if len(sys.argv) > 2:
        students = sys.argv[2].split(',')

    # Process files for each student
    pdf_dir = VAULT_PATH / "Materials" / "PDF"
    
    for student in students:
        # Look for both assignment and feedback files
        file_patterns = [
            f"Week {week_num} - {student} - Assignment *.pdf",
            f"Week {week_num} - {student} - Feedback *.pdf"
        ]
        
        for pattern in file_patterns:
            for file_path in pdf_dir.glob(pattern):
                print(f"Processing {file_path.name}")
                
                # Upload to R2
                r2_key = file_path.name
                r2_success = upload_to_r2(file_path, r2_key)

                # Upload to Google Drive
                drive_id = upload_to_drive(str(file_path), file_path.name)

                if r2_success and drive_id:
                    print(f"Successfully uploaded {file_path.name} to both R2 and Google Drive")
                else:
                    print(f"Some uploads failed for {file_path.name}, check the logs above")

if __name__ == '__main__':
    main() 