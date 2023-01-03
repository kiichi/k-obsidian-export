import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

class GalleryItem {
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
    html:string = '';

    getItemHtml(){
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
        
        const workSrcPath = path.join(this.srcPath,'works');
        const workTplFilePath = path.join(this.tplPath,'works.html');
        const workDstFilePath = path.join(this.dstPath,'works.html');
        const list = await this.getFiles(workSrcPath);

        let repeaterHtmlArr = [];
        for await (const mdfile of this.getFiles(workSrcPath)) {
            //console.log(mdfile);
            const item = await this.parseMarkdown(mdfile,this.srcPath);
            repeaterHtmlArr.push(item.getItemHtml());
        }
        let repeaterHtml = repeaterHtmlArr.join('\n');
        console.log(repeaterHtml);
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

    async parseMarkdown(filepath:string, workfolder:string):Promise<GalleryItem>{        
        // extract meta first
        let item = new GalleryItem();
        var data:any = {};
        var key = '';

        const dirpath = path.dirname(filepath);
        const contents = await fs.promises.readFile(filepath,'utf-8');
        const lines = contents.split('\n').filter((x)=>x);

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
                item.title = line.replace('- Title:','').trim();
            }
            else if (line.startsWith('- Date:')){
                item.date = line.replace('- Date:','').trim();
            }
            else if (line.startsWith('- Place:')){
                item.place = line.replace('- Place:','').trim();
            }
            else if (line.startsWith('- Medium:')){
                item.medium = line.replace('- Medium:','').trim();
            }
            else if (line.startsWith('- Dimensions:')){
                item.dimensions = line.replace('- Dimensions:','').trim();
            }
            else if (line.startsWith('- No:')){
                item.no = line.replace('- No:','').trim();
            }
            else if (line.startsWith('- Description:')){
                item.description = line.replace('- Description:','').trim();
            }
            else if (line.startsWith('- Tags:')){
                item.tags = line.replace('- Tags:','').trim();
            }
        }

        const theRelativePath = dirpath.replace(workfolder,'');
        const cleaned = data['Images'][0].replace('![](','').replace(')','');
        item.thumbnail = path.join(theRelativePath, cleaned);
        item.fullimage = item.thumbnail;
        
        return Promise.resolve(item);
    }
}