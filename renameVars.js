import fs from 'fs';

const targetFile = 'src/App.tsx';
let data = fs.readFileSync(targetFile, 'utf8');

data = data.replace(/showDebateOverlay/g, 'isDebating');
data = data.replace(/setShowDebateOverlay/g, 'setIsDebating');

fs.writeFileSync(targetFile, data);









































