path = r'd:\e-drive\major_project\chatbot_dataset\skin_knowledge_base.json'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read().strip()

while text.endswith(']'):
    text = text[:-1]

# Now text ends with the last object's bracket }
# We want to add only one ]
with open(path, 'w', encoding='utf-8') as f:
    f.write(text.strip() + '\n]')

print("Fixed")
