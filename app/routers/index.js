/* globals __dirname */

const fs = require('fs');
const path = require('path');

const attachTo = (app, controllersFactory) => {
    app.get('/404', (req, res) => {
        res.send('THE PAGE YOUR ARE LOOKIGN FOR DOES NOT EXIST');
    });

    const attach = (modulePath) => {
        require(modulePath)(app, controllersFactory);
    };

    const traverse = (dir) => {
        const directory = fs.readdirSync(dir);
        const jsFiles = [];
        const subDirs = [];

        directory.forEach((entry) => {
            if (entry.includes('router.js')) {
                jsFiles.push(entry);
            } else if (entry.indexOf('.js') === -1) {
                subDirs.push(entry);
            }
        });

        jsFiles.forEach((file) => {
            const absPath = path.join(dir, file);
            attach(absPath);
        });

        if (subDirs.length === 0) {
            return;
        }

        subDirs.forEach((subDir) => {
            const newDir = path.join(dir, subDir);
            traverse(newDir);
        });
    };

    traverse(__dirname);

    app.get('*', (req, res) => {
        res.redirect('/404');
    });
};

module.exports = { attachTo };
