
import sys
import os

# Add the project root to sys.path
sys.path.append(os.getcwd())

try:
    from app.routes import drive_links
    print("SUCCESS: drive_links imported")
except Exception as e:
    print(f"FAILURE: {e}")
    import traceback
    traceback.print_exc()
