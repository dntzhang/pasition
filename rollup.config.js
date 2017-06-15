import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import uglify from 'rollup-plugin-uglify';

const ENV = process.env.npm_lifecycle_event;
const license = require('rollup-plugin-license');

let pkg = require('./package.json');
let external = Object.keys(pkg.dependencies);
let licensePlugin =  license({
  banner: " pasition v"+pkg.version+" By dntzhang \r\n Github: https://github.com/AlloyTeam/pasition\r\n MIT Licensed."
})

let config = {
  entry: 'src/index.js',
  format:'umd',
  moduleName:'pasition',
  plugins: [
    babel(babelrc())
  ],
  external: external
}

if(ENV === 'dist'){
  config.plugins.push(uglify(),licensePlugin)
  config.dest = 'dist/pasition.min.js'
}else if(ENV==='dev'){
  config.plugins.push(licensePlugin)
  config.dest = 'dist/pasition.js'
}else{
  config.entry = 'example/'+ENV+'/index.js'
  config.dest = 'example/'+ENV+'/main.js'
}

export default config