const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../../b_cH5a3RSNNci-1773848300515/package.json');
const targetPath = path.join(__dirname, 'package.json');

const sourcePkg = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
const targetPkg = JSON.parse(fs.readFileSync(targetPath, 'utf8'));

// Merge dependencies
targetPkg.dependencies = {
  ...sourcePkg.dependencies,
  ...targetPkg.dependencies
};

// Merge devDependencies
targetPkg.devDependencies = {
  ...sourcePkg.devDependencies,
  ...targetPkg.devDependencies
};

fs.writeFileSync(targetPath, JSON.stringify(targetPkg, null, 2));
console.log('Successfully merged package.json dependencies');
