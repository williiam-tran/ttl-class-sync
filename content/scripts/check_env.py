import os
from pathlib import Path

def check_and_create_env():
    """Check if .env exists and create it if not"""
    script_dir = Path(__file__).parent
    env_path = script_dir / '.env'
    
    if not env_path.exists():
        env_content = """CANVAS_API_URL=https://your-institution.instructure.com
CANVAS_API_KEY=your_api_key
OBSIDIAN_VAULT_PATH=/path/to/vault
CANVAS_COURSE_ID=your_course_id"""
        
        with open(env_path, 'w') as f:
            f.write(env_content)
        print(f"Created .env file at {env_path}")
        print("Please update the .env file with your actual values")
    else:
        print(".env file already exists")
        # Verify required variables are set
        required_vars = ['CANVAS_API_URL', 'CANVAS_API_KEY', 'OBSIDIAN_VAULT_PATH', 'CANVAS_COURSE_ID']
        missing_vars = []
        
        for var in required_vars:
            if not os.getenv(var):
                missing_vars.append(var)
        
        if missing_vars:
            print("Warning: The following required variables are not set:")
            for var in missing_vars:
                print(f"- {var}")

if __name__ == '__main__':
    check_and_create_env() 