const fs = require('fs');
const path = 'd:/e-drive/major_project/chatbot_dataset/skin_knowledge_base.json';
let content = fs.readFileSync(path, 'utf8').trim();
while (content.endsWith(']')) {
    content = content.slice(0, -1).trim();
}
fs.writeFileSync(path, content + '\n]');
console.log('Fixed');
