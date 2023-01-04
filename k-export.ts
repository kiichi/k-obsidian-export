import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { Marked, Renderer } from '@ts-stack/markdown';

class MyRenderer extends Renderer {
  // image embed as 3-D viewer if the ext is .glb. add ./ for the path
  // https://doc.babylonjs.com/features/featuresDeepDive/babylonViewer/defaultViewerConfig
  image(href: string, title: string, text: string): string{
    if (href.endsWith('.glb')){
        return `<babylon 
        templates.nav-bar.params.logo-image="/images/favicon/apple-icon.png" 
        templates.nav-bar.params.logo-text="Copyright Kiichi Takeuchi" 
        templates.nav-bar.params.logo-link="https://kiichitakeuchi.com/" 
        model="./${href}" ></babylon>`
    }
    return super.image(href,title,text);
  }
}
Marked.setOptions({renderer: new MyRenderer});

class GenericItem {
    mdraw:string = '';
    constructor(inMDRaw:string){
        this.mdraw = inMDRaw;
    }

    getHtml(){
        return Marked.parse(this.mdraw);
    }
}

class ArticleItem extends GenericItem {
    title:string = '';
    summary:string = '';
    tags:string = '';
    date:string = '';
    image:string = '';
    filePath:string = '';

    constructor(inMDRaw:string, inDirPath:string, inFilePath:string){
        super(inMDRaw);

        const lines = this.mdraw.split('\n').filter((x)=>x);
        let counter = 0;
        let tmpSum = '';
        for (let line of lines){
            if (line.startsWith('# ')){
                if (counter == 0){
                    this.title = line.replace('# ','');
                }
                else {
                    
                }
                counter++;
            }
            if (counter == 1){
                if (line.startsWith('- Date:')){
                    this.date = line.replace('- Date:','').trim();
                }
                else if (line.startsWith('- Tags:')){
                    this.tags = line.replace('- Tags:','').trim();
                }
                else if (line.startsWith('![](')){
                    const cleaned = line.replace('![](','').replace(')','');
                    this.image =  path.join(inDirPath, cleaned);
                }
                else if (line.startsWith('# ')){
                    // nothing
                }
                else {
                    tmpSum += line;
                }
            }
            
        }
        this.summary = (tmpSum.length > 300) ? tmpSum.substring(0,300) + ' &mldr; ' : tmpSum;
        this.filePath = inFilePath;
    }
    getDate(){
        return ((new Date(this.date)).getDate() + 1);
    }
    getMonth(){        
        return (new Date(this.date)).toLocaleString('en-US', {month: 'short'}).toLocaleUpperCase();
    }
    getDateStr(){
        return (new Date(this.date)).toLocaleDateString();
    }
    getRepeaterHtml(){
        return `
        <div class="col-md-4 bloglist ${this.tags.replace('#','')}">
                <div class="post-content">
                        <div class="post-image">
                            <img src="${this.image}" alt="" draggable="false">
                        </div>
                        <div class="date-box"><span class="day">${this.getDate()}</span> <span class="month">${this.getMonth()}</span></div>
                        <div class="post-text">
                            <h3><a href="${this.filePath}">${this.title}</a></h3>
                            ${this.summary}
                            <br>
                            <a href="${this.filePath}" class="btn-text">Read More</a>
                        </div>
                    </div>
                </div>
        `
    }
}

class GalleryItem extends GenericItem {
    title:string = '';
    tags:string = '';
    date:string = '';
    place:string = '';
    medium:string = '';
    dimensions:string = '';
    no:string = '';
    description:string = '';
    thumbnail:string = '';
    fullimage:string = '';
    htmlpath:string = '';

    constructor(inMDRaw:string, inRelativePath:string, inRelativeHtmlPath:string ){
        super(inMDRaw);


        var data:any = {};
        var key = '';
        
        const lines = this.mdraw.split('\n').filter((x)=>x);

        for (let line of lines){
            if (line.startsWith('#')){
                key = line.split(' ')[1];
                data[key] = [];
                continue;
            }
            if (key){
                data[key].push(line);
            }
        }
        

        for (let line of data['About']){
            if (line.startsWith('- Title:')){
                this.title = line.replace('- Title:','').trim();
            }
            else if (line.startsWith('- Date:')){
                this.date = line.replace('- Date:','').trim();
            }
            else if (line.startsWith('- Place:')){
                this.place = line.replace('- Place:','').trim();
            }
            else if (line.startsWith('- Medium:')){
                this.medium = line.replace('- Medium:','').trim();
            }
            else if (line.startsWith('- Dimensions:')){
                this.dimensions = line.replace('- Dimensions:','').trim();
            }
            else if (line.startsWith('- No:')){
                this.no = line.replace('- No:','').trim();
            }
            else if (line.startsWith('- Description:')){
                this.description = line.replace('- Description:','').trim();
            }
            else if (line.startsWith('- Tags:')){
                this.tags = line.replace('- Tags:','').trim();
            }
        }
        
        const cleaned = data['Images'][0].replace('![](','').replace(')','');
        this.thumbnail = path.join(inRelativePath, cleaned);
        this.fullimage = this.thumbnail;
        this.htmlpath = inRelativeHtmlPath;
    }

    getRepeaterHtml(){
        return `
        <div class="item ${this.tags.replace('#','')}">
            <div class="picframe">
                <span class="overlay">
                    <span class="icon">
                        <a href="${this.thumbnail}" data-type="prettyPhoto[gallery]">
                        <i class="fa fa-search icon-view"></i></a>
                    </span>
                    <span class="icon">
                        <a href="${this.htmlpath}"><i class="fa fa-align-justify fa-external-link icon-info"></i></a>
                    </span> 
                    <span class="pf_text">
                        <div class="project-name">${this.title}</div>
                        <div>Date: ${this.date}</div>
                        <div>Place: ${this.place}</div>
                        <div>Medium: ${this.description}</div>
                        <div>Dimensions: ${this.dimensions}</div>
                        <div>No: ${this.no}</div>
                    </span>
                </span>

                <img src="${this.fullimage}" alt="" />
            </div>
        </div>
        `
    }
}

export class KExport {
    srcPath:string = '';
    dstPath:string = '';
    tplPath:string = '';
    constructor(inSrcPath:string, inTplPath:string, inDstPath:string){
        this.srcPath = inSrcPath.replace("~",os.homedir());
        this.dstPath = inDstPath.replace("~",os.homedir());
        this.tplPath = inTplPath.replace("~",os.homedir());
    }

    async start(){
        console.log("Export Started....");

        ////////////////////////////////////////////////////////////////////////////////////////
        // Generic
        const genTplFilePath = path.join(this.tplPath,'generic-template.html');
        const genTemplateHtml = await fs.promises.readFile(genTplFilePath,'utf-8');
        
        ////////////////////////////////////////////////////////////////////////////////////////
        // Works
        // 1. Gather all Meta Info and Generate single Thumbnail Gallery
        // 2. Generate individual page and dump the .html next to .md file.
        //    Individual page should cover full html conversion plus youtube or glb 

        const workSrcPath = path.join(this.srcPath,'works');
        const workTplFilePath = path.join(this.tplPath,'works-template.html');
        const workDstFilePath = path.join(this.dstPath,'works.html');        

        let repeaterHtmlArr = [];
        // Walk each .md files in works
        for await (const mdfilePath of this.getFiles(workSrcPath)) {
            const htmlFilePath = mdfilePath.replace('.md','.html');
            //const mdraw = await fs.promises.readFile(mdfilePath,'utf-8');
            // probably I don't have to create another obj here
            //const genItem = new GenericItem(mdraw);

            //console.log(mdfilePath);
            // Build up thumbnail html repeater
            const contents = await fs.promises.readFile(mdfilePath,'utf-8');
            // Calculate relative path - full path minus workfolder. 
            // this is needed to point thumbnail image path from the root of website to works/ ... folder
            const dirpath = path.dirname(mdfilePath);
            const relativeSrcDirPath = dirpath.replace(this.srcPath,'');
            const relativeHtmlPath = htmlFilePath.replace(this.srcPath,'');

            const item = new GalleryItem(contents, relativeSrcDirPath, relativeHtmlPath); 
            repeaterHtmlArr.push(item.getRepeaterHtml());

            // Each MD -> HTML
            let genOutputHtml = genTemplateHtml.replace(/<!-- {{{CONTENT}}} -->/,item.getHtml());
            genOutputHtml = genOutputHtml.replace(/<!-- {{{COPYRIGHT}}} -->/g,'© Copyright '+(new Date()).getFullYear()+' - Kiichi Takeuchi');
            genOutputHtml = genOutputHtml.replace(/<!-- {{{CATEGORY}}} -->/g,'Works');
            genOutputHtml = genOutputHtml.replace(/<!-- {{{TITLE}}} -->/g,item.title);
            genOutputHtml = genOutputHtml.replace(/<!-- {{{SUBTITLE}}} -->/g,`(${item.date})`);
            await fs.promises.writeFile(htmlFilePath,genOutputHtml);
        }        

        // works.html
        let repeaterHtml = repeaterHtmlArr.join('\n');        
        const galleryTemplateHtml = await fs.promises.readFile(workTplFilePath,'utf-8');
        let galleryOutputHtml = galleryTemplateHtml.replace('<!-- {{{GALLERY}}} -->',repeaterHtml);
        galleryOutputHtml = galleryOutputHtml.replace('<!-- {{{COPYRIGHT}}} -->','© Copyright '+(new Date()).getFullYear()+' - Kiichi Takeuchi');
        await fs.promises.writeFile(workDstFilePath,galleryOutputHtml);

        console.log(workDstFilePath)



        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Articles
        const articleSrcPath = path.join(this.srcPath,'articles');
        const articleTplFilePath = path.join(this.tplPath,'articles-template.html');
        const articleDstFilePath = path.join(this.dstPath,'articles.html');   
        let repeaterArticleHtmlArr = [];
        // Walk each .md files in works
        for await (const mdfilePath of this.getFiles(articleSrcPath)) {
            const htmlFilePath = mdfilePath.replace('.md','.html');
            const contents = await fs.promises.readFile(mdfilePath,'utf-8');
            // Calculate relative path - full path minus workfolder. 
            // this is needed to point thumbnail image path from the root of website to works/ ... folder
            const dirpath = path.dirname(mdfilePath);
            const relativeSrcDirPath = dirpath.replace(this.srcPath,'');
            const relativeHtmlPath = htmlFilePath.replace(this.srcPath,'');
            const item = new ArticleItem(contents,relativeSrcDirPath, relativeHtmlPath);
            
            // Build up thumbnail html repeater            
            repeaterArticleHtmlArr.push(item.getRepeaterHtml());

            // Each MD -> HTML
            let genOutputHtml = genTemplateHtml.replace(/<!-- {{{CONTENT}}} -->/,item.getHtml());
            genOutputHtml = genOutputHtml.replace(/<!-- {{{COPYRIGHT}}} -->/g,'© Copyright '+(new Date()).getFullYear()+' - Kiichi Takeuchi');
            genOutputHtml = genOutputHtml.replace(/<!-- {{{CATEGORY}}} -->/g,'Works');
            genOutputHtml = genOutputHtml.replace(/<!-- {{{TITLE}}} -->/g,item.title);
            genOutputHtml = genOutputHtml.replace(/<!-- {{{SUBTITLE}}} -->/g,`(${item.getDateStr()})`);
            //genOutputHtml = genOutputHtml.replace(/<!-- {{{MDRAW}}} -->/g,`${genItem.mdraw}`); // https://github.com/markmap/markmap/tree/master/packages/markmap-autoloader
            await fs.promises.writeFile(htmlFilePath,genOutputHtml);
        }

        // works.html
        const repeaterArticleHtml = repeaterArticleHtmlArr.join('\n');        
        const articleTemplateHtml = await fs.promises.readFile(articleTplFilePath,'utf-8');
        let articleOutputHtml = articleTemplateHtml.replace('<!-- {{{ARTICLES}}} -->',repeaterArticleHtml);
        articleOutputHtml = articleOutputHtml.replace('<!-- {{{COPYRIGHT}}} -->','© Copyright '+(new Date()).getFullYear()+' - Kiichi Takeuchi');
        await fs.promises.writeFile(articleDstFilePath,articleOutputHtml);

        

        console.log("Export Ended....");
    }

    async *getFiles(dir:string):any {
        const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
        for (const dirent of dirents) {
          const res = path.resolve(dir, dirent.name);
          if (dirent.isDirectory()) {
            yield* this.getFiles(res);
          }
          else if(dirent.name.endsWith(".md")){
            yield res;
          }
          // else { // do nothing } 
        }
    }

    
}