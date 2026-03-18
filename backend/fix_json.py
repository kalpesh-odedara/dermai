import json
import os

path = r'd:\e-drive\major_project\chatbot_dataset\skin_knowledge_base.json'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read().strip()

# Find the last valid closing bracket of the array
if content.count(']') > 1:
    # We expect content to end with ]
    # If it ends with ]], we fix it
    while content.endswith(']]'):
        content = content[:-1]

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("JSON fixed successfully")
