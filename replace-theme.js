const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

function replaceInFile(filePath) {
  // Only process ts, tsx, css files
  if (!filePath.match(/\.(tsx|ts|css)$/)) return;
  
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('emerald')) {
    // Replace all instances of 'emerald' with 'orange'
    const newContent = content.replace(/emerald/g, 'orange');
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Updated:', filePath);
  }
}

walkDir(path.join(__dirname, 'src'), replaceInFile);
console.log('Done replacing emerald with orange');
