import { KExport } from 'k-export'
const kex = new KExport('~/Desktop/kiichi-portfolio/public',// source folder //'~/Library/Mobile Documents/iCloud~md~obsidian/Documents/obsidian-kiichi-portfolio/',
            '~/Desktop/kiichi-portfolio/public', // template folder
            '~/Desktop/kiichi-portfolio/public'); // destination folder
kex.start();