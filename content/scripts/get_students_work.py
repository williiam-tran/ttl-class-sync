import os
import re
import sys
from pathlib import Path

import boto3
from botocore.client import Config
from dotenv import load_dotenv

# Get the absolute path to the TTL Class directory (2 levels up from scripts)
vault_path = Path(__file__).parent.parent.resolve()

# Load .env from the scripts directory
script_dir = Path(__file__).parent
env_path = script_dir / '.env'
load_dotenv(env_path)

# Get R2 credentials from environment variables
ACCESS_KEY = os.getenv('R2_ACCESS_KEY')
SECRET_KEY = os.getenv('R2_SECRET_KEY')
BUCKET_NAME = os.getenv('R2_BUCKET_NAME')
ENDPOINT_URL = os.getenv('R2_ENDPOINT_URL')

# Initialize the R2 client
s3 = boto3.client('s3',
                  endpoint_url=ENDPOINT_URL,
                  aws_access_key_id=ACCESS_KEY,
                  aws_secret_access_key=SECRET_KEY,
                  region_name='auto',
                  config=Config(signature_version='s3v4'))

def list_and_download_assignments(week_index):
    """List and download all assignments for a given week."""
    prefix = f"Week {week_index} -"
    response = s3.list_objects_v2(Bucket=BUCKET_NAME, Prefix=prefix)
    
    assignments = {}
    if 'Contents' in response:
        for obj in response['Contents']:
            match = re.match(rf"Week {week_index} - (.+?) - Assignment (\d+)\.pdf", obj['Key'])
            if match:
                student_name = match.group(1)
                assignment_index = match.group(2)
                if student_name not in assignments:
                    assignments[student_name] = []
                assignments[student_name].append((assignment_index, obj['Key']))

                # Download the assignment using relative path
                download_path = vault_path / "Materials" / "PDF" / obj['Key']
                download_path.parent.mkdir(parents=True, exist_ok=True)
                s3.download_file(BUCKET_NAME, obj['Key'], str(download_path))
                print(f"Downloaded {obj['Key']} to {download_path}")

    return assignments

def update_dashboard(week_index, assignments):
    """Update the dashboard with assignment links."""
    dashboard_path = vault_path / f"Timetable/Week {week_index}/Dashboard.md"
    if not dashboard_path.exists():
        print(f"Dashboard for Week {week_index} does not exist.")
        return

    with open(dashboard_path, 'r', encoding='utf-8') as f:
        content = f.readlines()

    new_content = []
    current_student = None
    in_assignments_section = False

    for line in content:
        # Track current student
        if line.startswith('## '):
            current_student = line[3:].strip()
            in_assignments_section = False
            new_content.append(line)
            continue

        # Track assignments section
        if line.startswith('### Assignments'):
            in_assignments_section = True
            new_content.append(line)
            if current_student in assignments:
                # Add assignments for current student
                for assignment_index, key in sorted(assignments[current_student]):
                    link = f"[[../../Materials/PDF/{key}|Week {week_index} - {current_student} - Assignment {assignment_index}]]"
                    new_content.append(f"{assignment_index}. {link}\n")
            continue

        # If we're not in assignments section or it's a new section, add the line
        if not in_assignments_section or line.startswith('### '):
            in_assignments_section = False
            new_content.append(line)

    with open(dashboard_path, 'w', encoding='utf-8') as f:
        f.writelines(new_content)

def main():
    if len(sys.argv) < 2:
        print("Error: Week path not provided")
        return

    student_names = ['Thanh', 'Minitung', 'Tlinh', 'Trung']
    week_index = 1

    # Parse command line arguments
    if len(sys.argv) > 1:
        week_index = int(sys.argv[1])

    # List and download assignments
    assignments = list_and_download_assignments(week_index)
    print(f"Found assignments: {assignments}")

    # Update dashboard
    update_dashboard(week_index, assignments)
    print("Dashboard updated successfully")

if __name__ == '__main__':
    main()