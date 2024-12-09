import os
from pathlib import Path
import shutil
import filecmp

# Paths configuration
script_dir = Path(__file__).parent.resolve()  # Get absolute path
vault_path = script_dir.parent.resolve()  # TTL Class folder
vault_root = vault_path.parent.parent.parent.resolve()  # Navigate up to Knowledge Base folder
quartz_content = Path('F:\Studycorner\Programming\Projects\quartz\content').resolve()

# Simple path verification
if str(quartz_content) == str(vault_root) or str(quartz_content) == str(vault_path):
    raise ValueError("Quartz content folder cannot be the same as vault folders")

print(f"Using paths:")
print(f"Vault root: {vault_root}")
print(f"Vault path: {vault_path}")
print(f"Quartz content: {quartz_content}")

# Folders to sync (relative to TTL Class folder)
SYNC_FOLDERS = [
    # 'Timetable',
    # 'Materials/PDF',
    # 'Students',
    # "Anki"
]

# Resources folder (relative to vault root)
RESOURCES_FOLDER = 'Resources'

def safe_copy(src: Path, dst: Path, force: bool = True):
    """Safely copy a file without following symlinks"""
    try:
        if not src.is_file() or src.is_symlink():
            return False
        if force or not dst.exists() or not filecmp.cmp(src, dst, shallow=False):
            shutil.copy2(src, dst)
            print(f"Copied: {src} -> {dst}")
            return True
        return False
    except Exception as e:
        print(f"Error copying {src}: {e}")
        return False

def sync_folders(force: bool = True):
    """One-way sync from vault to quartz content"""
    # Verify source paths exist before starting
    if not vault_path.exists():
        raise ValueError(f"Vault path does not exist: {vault_path}")
    if not quartz_content.exists():
        raise ValueError(f"Quartz content path does not exist: {quartz_content}")

    # Sync root markdown files first
    # for item in vault_path.iterdir():
    #     if item.is_file() and item.suffix.lower() in ['.md']:
    #         # Skip index files and files starting with underscore
    #         if item.name.startswith('_') or 'index' in item.name.lower():
    #             continue
                
    #         target = quartz_content / item.name
    #         safe_copy(item, target, force)

    def sync_directory(src: Path, dst: Path):
        """Sync a directory and its contents"""
        try:
            # Safety checks
            src = src.resolve()
            dst = dst.resolve()
            if not src.exists() or not src.is_dir():
                print(f"Source directory does not exist or is not a directory: {src}")
                return
            if src == dst or dst in src.parents:
                print(f"Cannot sync directory to itself or parent: {src} -> {dst}")
                return

            # Create destination directory
            dst.mkdir(parents=True, exist_ok=True)
            
            # Copy/update files
            for item in src.iterdir():
                if item.is_symlink():
                    continue  # Skip symlinks entirely
                
                destination_item = dst / item.name
                
                if item.is_file():
                    safe_copy(item, destination_item, force)
                elif item.is_dir():
                    sync_directory(item, destination_item)

        except Exception as e:
            print(f"Error syncing directory {src}: {e}")

    # Sync TTL Class folders
    for folder in SYNC_FOLDERS:
        source = vault_path / folder
        target = quartz_content / folder
        
        if not source.exists():
            print(f"Source folder does not exist: {source}")
            continue

        print(f"Syncing folder: {source} -> {target}")
        sync_directory(source, target)

    # Sync Resources folder
    resources_source = vault_root.parent / RESOURCES_FOLDER
    resources_target = quartz_content / RESOURCES_FOLDER

    if resources_source.exists():
        print(f"Syncing Resources folder: {resources_source} -> {resources_target}")
        sync_directory(resources_source, resources_target)
    else:
        print(f"Resources folder does not exist: {resources_source}")

def main():
    try:
        # Print paths for verification
        print(f"Vault path: {vault_path}")
        print(f"Quartz content path: {quartz_content}")
        print(f"Resources path: {vault_root / RESOURCES_FOLDER}")
        
        # Confirm paths before proceeding
        # response = input("Are these paths correct? (y/n): ")
        # if response.lower() != 'n':
        #     # Force update all files
        sync_folders(force=True)
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    main()