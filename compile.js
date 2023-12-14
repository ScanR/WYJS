const exe = require('@angablue/exe');

const build = exe({
    entry: './scrap.js',
    out: './scrap.exe',
    target: 'latest-win-x64'
});

build.then(() => console.log('Build completed!'));