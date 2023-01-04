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
        // return this.mdraw.split('\n').filter((x)=>x).map(line=>{
        //     if (line.startsWith('# ')){
        //         return `<h1>${line.replace('# ','')}</h1>`;
        //     }
        //     else if (line.startsWith('## ')){
        //         return `<h2>${line.replace('## ','')}</h2>`;
        //     }
        //     else if (line.startsWith('### ')){
        //         return `<h3>${line.replace('### ','')}</h3>`;
        //     }
        //     else if (line.startsWith('- ')){
        //         return `<li>${line.replace('- ','')}</li>`;
        //     }
        //     else if (line.startsWith('- ')){
        //         return `<li>${line.replace('- ','')}</li>`;
        //     }
        //     return `<p>${line}</p>`;
        // }).join('\n');
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

    constructor(inMDRaw:string, inRelativePath:string ){
        super(inMDRaw);
        this.processGalleryInfo(inRelativePath);
    }

    private processGalleryInfo(relativePath:string){
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
        this.thumbnail = path.join(relativePath, cleaned);
        this.fullimage = this.thumbnail;
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
                    <!-- 
                    <span class="icon">
                        <i class="fa fa-align-justify fa-external-link icon-info" data-value="project-details-slider.html"></i>
                    </span> 
                    -->
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
        // Generate Works
        // 1. Gather all Meta Info and Generate single Thumbnail Gallery
        // 2. Generate individual page and dump the .html next to .md file.
        //    Individual page should cover full html conversion plus youtube or glb 
        const genTplFilePath = path.join(this.tplPath,'generic.html');

        const workSrcPath = path.join(this.srcPath,'works');
        const workTplFilePath = path.join(this.tplPath,'works.html');
        const workDstFilePath = path.join(this.dstPath,'works-beta.html');        

        let repeaterHtmlArr = [];
        // Walk each .md files in works
        for await (const mdfilePath of this.getFiles(workSrcPath)) {
            const htmlFilePath = mdfilePath.replace('.md','.html');
            const mdraw = await fs.promises.readFile(mdfilePath,'utf-8');
            const genItem = new GenericItem(mdraw);            

            //console.log(mdfilePath);
            // Build up thumbnail html repeater
            const item = await this.getGalleryItem(mdfilePath,this.srcPath);
            repeaterHtmlArr.push(item.getRepeaterHtml());

            // Each MD -> HTML
            const genTemplateHtml = await fs.promises.readFile(genTplFilePath,'utf-8');
            let genOutputHtml = genTemplateHtml.replace(/<!-- {{{CONTENT}}} -->/,genItem.getHtml());
            genOutputHtml = genOutputHtml.replace(/<!-- {{{COPYRIGHT}}} -->/g,'© Copyright '+(new Date()).getFullYear()+' - Kiichi Takeuchi');
            genOutputHtml = genOutputHtml.replace(/<!-- {{{CATEGORY}}} -->/g,'Works');
            genOutputHtml = genOutputHtml.replace(/<!-- {{{TITLE}}} -->/g,item.title);
            genOutputHtml = genOutputHtml.replace(/<!-- {{{SUBTITLE}}} -->/g,`(${item.date})`);
            //genOutputHtml = genOutputHtml.replace(/<!-- {{{MDRAW}}} -->/g,`${genItem.mdraw}`); // https://github.com/markmap/markmap/tree/master/packages/markmap-autoloader
            await fs.promises.writeFile(htmlFilePath,genOutputHtml);
            console.log(htmlFilePath);
            //console.log(genOutputHtml);

        }

        // works.html
        let repeaterHtml = repeaterHtmlArr.join('\n');        
        const galleryTemplateHtml = await fs.promises.readFile(workTplFilePath,'utf-8');
        let galleryOutputHtml = galleryTemplateHtml.replace('<!-- {{{GALLERY}}} -->',repeaterHtml);
        galleryOutputHtml = galleryOutputHtml.replace('<!-- {{{COPYRIGHT}}} -->','© Copyright '+(new Date()).getFullYear()+' - Kiichi Takeuchi');
        await fs.promises.writeFile(workDstFilePath,galleryOutputHtml);
        

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

    async getGalleryItem(filepath:string, workfolder:string):Promise<GalleryItem>{        
        // Read Contents from .md file
        const contents = await fs.promises.readFile(filepath,'utf-8');
        // Calculate relative path - full path minus workfolder. 
        // this is needed to point thumbnail image path from the root of website to works/ ... folder
        const dirpath = path.dirname(filepath);
        const relativePath = dirpath.replace(workfolder,'');
        let item = new GalleryItem(contents, relativePath); 
        return Promise.resolve(item);
    }
}