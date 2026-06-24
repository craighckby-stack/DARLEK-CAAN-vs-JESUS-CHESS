const https = require('https');
const fs = require('fs');
const path = require('path');

const owner = 'craighckby-stack';
const repo = 'Darlek-Caan-vs-Jesus-Chess';
const branch = 'main';

https.get(`https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`, { headers: { 'User-Agent': 'node.js' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const tree = JSON.parse(data).tree;
    if (!tree) { console.error("No tree found"); return; }
    
    // We only restore src/ branch because package.json might have changed
    const srcFiles = tree.filter(f => f.type === 'blob' && f.path.startsWith('src/'));
const promises = srcFiles.map(file => {
      return new Promise(resolve => {
        const dir = path.dirname(file.path);
        fs.mkdirSync(dir, { recursive: true });

        https.get(`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${file.path}`, { headers: { 'User-Agent': 'node.js' } }, (fileRes) => {
           let content = '';
           fileRes.on('data', c => content += c);
           fileRes.on('end', () => {
              fs.writeFileSync(file.path, content);
              resolve();
           });
        }).on('error', () => resolve());
      });
    });

    Promise.all(promises).then(() => console.log("ALL RESTORED!"));
  });
});

