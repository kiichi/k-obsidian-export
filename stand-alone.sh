use nvm 16
rsync -av  ~/Library/Mobile\ Documents/iCloud~md~obsidian/Documents/obsidian-kiichi-portfolio/articles ~/Desktop/kiichi-portfolio/public/
rsync -av  ~/Library/Mobile\ Documents/iCloud~md~obsidian/Documents/obsidian-kiichi-portfolio/works ~/Desktop/kiichi-portfolio/public/
npm run stand-alone
node stand-alone.js