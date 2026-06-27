import os
import glob
import re

directory = r'c:\Users\B.GOWTHAMSAIREDDY\plastic\frontend\src'
pattern = r'http://localhost:8000'

for filepath in glob.glob(directory + '/**/*.js', recursive=True):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if pattern in content:
        # Replace occurrences in backticks (e.g., `http://localhost:8000${report.image_url}`)
        new_content = content.replace("`http://localhost:8000", "`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}")
        
        # Replace occurrences in double quotes (e.g., "http://localhost:8000/auth/sync-user")
        # We use regex to grab the rest of the URL and put it in backticks
        new_content = re.sub(r'"http://localhost:8000([^"]*)"', r"`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}\1`", new_content)

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated: {filepath}")
