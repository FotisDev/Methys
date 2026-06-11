import { put } from "@vercel/blob";
import { readFileSync } from "fs";
import * as dotenv from 'dotenv';
dotenv.config({path:'.env.local'});

// const file = readFileSync('./public/on-balcony.mp4');

// const blob = await put('on-balcony.mp4', file, {
//     access:'public',
//     contentType:'video/mp4',
// });


const file = readFileSync('./public/man-window.mp4');

const blob = await put('man-window.mp4', file, {
  access: 'public',
  contentType: 'video/mp4',
});

console.log('URL', blob.url);