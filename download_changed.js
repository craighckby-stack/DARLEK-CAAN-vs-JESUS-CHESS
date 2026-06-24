const fs = require('fs');
const https = require('https');

const remoteBlobs = JSON.parse(fs.readFileSync('remote_blobs.json', 'utf8'));
let index = 0;
let changed = [];

function checkNext() {
  if (index >= remoteBlobs.length) {
    fs.writeFileSync('changed_files.json', JSON.stringify(changed));
return;
  }
  const fileObj = remoteBlobs[index++];
  if (!fileObj.path.startsWith('src/')) { checkNext(); return; }
  
  if (fs.existsSync(fileObj.path)) {
     const localContent = fs.readFileSync(fileObj.path, 'utf8');
     https.get('https://raw.githubusercontent.com/craighckby-stack/epistemic_debate_engine/main/' + fileObj.path, { headers: { 'User-Agent': 'node.js' } }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (data !== localContent) {
changed.push(fileObj);
             // Let's also overwrite it since it's changed!
             fs.writeFileSync(fileObj.path, data);
          }
          checkNext();
        });
     }).on('error', () => checkNext());
  } else {
     checkNext();
  }
}

checkNext();


