const sharp = require('sharp');
const path = require('node:path');
const sourceDirectory = process.argv[2] || '..';
const fs = require('fs');
fs.mkdirSync('public/images',{recursive:true});
const photos = [ ['1.jpeg','desserts',0,520,946,802], ['2.jpeg','cafe-front',0,432,946,1182], ['3.jpeg','cake-pops',0,650,946,760], ['4.jpeg','cafe-window',0,520,946,802], ['5.jpeg','sweet-moment',0,930,946,684], ['6.jpeg','cafe-interior',0,432,946,1182], ['WhatsApp Image 2026-09-27 at 15.20.19.jpeg','pastries',70,720,876,810] ];
(async()=>{
for(const [file,name,left,top,width,height] of photos){for(const size of [480,960])await sharp(path.join(sourceDirectory,file)).extract({left,top,width,height}).resize({width:size,withoutEnlargement:true}).webp({quality:85}).toFile(`public/images/${name}-${size}.webp`);}
await sharp(path.join(sourceDirectory,'karte.jpeg')).extract({left:0,top:432,width:946,height:1182}).rotate(270).webp({quality:96}).toFile('public/images/menu.webp');
})();
