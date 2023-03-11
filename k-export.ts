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
  link(href: string, title: string, text: string): string {
    if (href.startsWith("https://youtu.be/") || href.startsWith("https://www.youtube.com/watch?v=")){
        const videoId = href.replace("https://youtu.be/",'').replace("https://www.youtube.com/watch?v=",'');
        return `
        <iframe width="560" height="315" 
        src="https://www.youtube.com/embed/${videoId}" 
        title="YouTube video player" frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        allowfullscreen></iframe>
        `;
    }    
    else if (href.startsWith("https://www.instagram.com/p/")){
        const instagramId = href.replace('https://www.instagram.com/p/','').replace('\/','');
        return `
        <blockquote class="instagram-media" 
        data-instgrm-captioned 
        data-instgrm-permalink="https://www.instagram.com/reel/${instagramId}/?utm_source=ig_embed&amp;utm_campaign=loading" 
        data-instgrm-version="14" style=" 
        background:#222; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:16px;"> <a href="https://www.instagram.com/reel/ClzffW4gu7Z/?utm_source=ig_embed&amp;utm_campaign=loading" style=" background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank"> <div style=" display: flex; flex-direction: row; align-items: center;"> <div style="background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 40px; margin-right: 14px; width: 40px;"></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 100px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 60px;"></div></div></div><div style="padding: 19% 0;"></div> <div style="display:block; height:50px; margin:0 auto 12px; width:50px;"><svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-511.000000, -20.000000)" fill="#000000"><g><path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path></g></g></g></svg></div><div style="padding-top: 8px;"> <div style=" color:#3897f0; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:550; line-height:18px;">View this post on Instagram</div></div><div style="padding: 12.5% 0;"></div> <div style="display: flex; flex-direction: row; margin-bottom: 14px; align-items: center;"><div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(0px) translateY(7px);"></div> <div style="background-color: #F4F4F4; height: 12.5px; transform: rotate(-45deg) translateX(3px) translateY(1px); width: 12.5px; flex-grow: 0; margin-right: 14px; margin-left: 2px;"></div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(9px) translateY(-18px);"></div></div><div style="margin-left: 8px;"> <div style=" background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 20px; width: 20px;"></div> <div style=" width: 0; height: 0; border-top: 2px solid transparent; border-left: 6px solid #f4f4f4; border-bottom: 2px solid transparent; transform: translateX(16px) translateY(-4px) rotate(30deg)"></div></div><div style="margin-left: auto;"> <div style=" width: 0px; border-top: 8px solid #F4F4F4; border-right: 8px solid transparent; transform: translateY(16px);"></div> <div style=" background-color: #F4F4F4; flex-grow: 0; height: 12px; width: 16px; transform: translateY(-4px);"></div> <div style=" width: 0; height: 0; border-top: 8px solid #F4F4F4; border-left: 8px solid transparent; transform: translateY(-4px) translateX(8px);"></div></div></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center; margin-bottom: 24px;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 224px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 144px;"></div></div></a><p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;"><a href="https://www.instagram.com/reel/ClzffW4gu7Z/?utm_source=ig_embed&amp;utm_campaign=loading" style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none;" target="_blank">A post shared by Kiichi’s Bento and Ceramics (@bentogram22)</a></p></div>
        </blockquote> 
        <script async src="//www.instagram.com/embed.js"></script>
        `;
    }
    return super.link(href,title, text);
  }
}
Marked.setOptions({renderer: new MyRenderer});

class GenericItem {
    mdraw:string = '';
    mdFilePath:string = '';
    htmlFilePath:string = '';
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
                    if (!this.image){
                        this.image =  path.join(inDirPath, cleaned);
                    }
                }
                else if (line.startsWith('# ')){
                    // nothing
                }
                else {
                    tmpSum += line;
                }
            }
            
        }
        this.summary = Marked.parse((tmpSum.length > 300) ? tmpSum.substring(0,300) + ' &mldr; ' : tmpSum);
        this.filePath = inFilePath;
    }
    getDate(){
        return ((new Date(this.date + ' ')).getDate());
    }
    getMonth(){        
        return (new Date(this.date + ' ')).toLocaleString('en-US', {month: 'short'}).toLocaleUpperCase();
    }
    getDateStr(){
        return (new Date(this.date + ' ')).toLocaleDateString();
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
                            <div class="post-summary">${this.summary}</div>
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
    ordnum:number = 0;
    sold:boolean = false;
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
                if (this.tags.indexOf('#sold') > -1){
                    this.sold = true;
                }
            }
            else if (line.startsWith('- OrdNum:')){
                let tmpOrdNum = line.replace('- OrdNum:','').trim();
                if (tmpOrdNum){
                    this.ordnum = parseInt(tmpOrdNum);
                }
            }
        }
                
        if (data["Images"].length == 0){
            throw new Error(`Image Not Found ${this.mdraw}`);
        }
        const cleaned = data['Images'][0].replace('![](','').replace(')','');
        this.thumbnail = path.join(inRelativePath, cleaned);
        this.fullimage = this.thumbnail;
        this.htmlpath = inRelativeHtmlPath;
    }

    getRepeaterHtml(){
        return `
        <div class="item ${this.tags.replace(/#/ig,'')}">
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
                        <div>${this.sold ? 'SOLD' : ''}</div>
                        <!-- <div>No: ${this.no}</div> -->
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
        let workItems:GalleryItem[] = [];
        // Walk each .md files in works
        for await (const mdfilePath of this.getFiles(workSrcPath)) {
            const htmlFilePath = mdfilePath.replace('.md','.html');
            try {                           
                const contents = await fs.promises.readFile(mdfilePath,'utf-8');
                // Calculate relative path - full path minus workfolder. 
                // this is needed to point thumbnail image path from the root of website to works/ ... folder
                const dirpath = path.dirname(mdfilePath);
                const relativeSrcDirPath = dirpath.replace(this.srcPath,'');
                const relativeHtmlPath = htmlFilePath.replace(this.srcPath,'');
                const item = new GalleryItem(contents, relativeSrcDirPath, relativeHtmlPath);
                // TEMP: think about how to manage all full path vs relative path (contents wise)
                item.htmlFilePath = htmlFilePath;
                workItems.push(item);
            }
            catch(e){
                console.error(e, htmlFilePath);
            }
        }


        // Let's sort! Look Into OrdNum field in meta data. Higher Number goes top.
        workItems.sort((a:GalleryItem, b:GalleryItem)=>b.ordnum-a.ordnum);

        for(var i=0; i<workItems.length; i++){
            const item = workItems[i];
            repeaterHtmlArr.push(item.getRepeaterHtml());
            //console.log(item.title);
            // Each MD -> HTML
            let genOutputHtml = genTemplateHtml.replace(/<!-- {{{CONTENT}}} -->/,item.getHtml());
            genOutputHtml = genOutputHtml.replace(/<!-- {{{COPYRIGHT}}} -->/g,'© Copyright '+(new Date()).getFullYear()+' - Kiichi Takeuchi');
            genOutputHtml = genOutputHtml.replace(/<!-- {{{CATEGORY}}} -->/g,'Works');
            genOutputHtml = genOutputHtml.replace(/<!-- {{{TITLE}}} -->/g,item.title);
            genOutputHtml = genOutputHtml.replace(/<!-- {{{SUBTITLE}}} -->/g,`(${item.date})`);
            genOutputHtml = genOutputHtml.replace(/{{{PAGETYPE}}}/g,'work'); // class name in container tag
            await fs.promises.writeFile(item.htmlFilePath,genOutputHtml);
        }        

        // works.html
        let repeaterHtml = repeaterHtmlArr.join('\n');        
        const galleryTemplateHtml = await fs.promises.readFile(workTplFilePath,'utf-8');
        let galleryOutputHtml = galleryTemplateHtml.replace('<!-- {{{GALLERY}}} -->',repeaterHtml);
        galleryOutputHtml = galleryOutputHtml.replace('<!-- {{{COPYRIGHT}}} -->','© Copyright '+(new Date()).getFullYear()+' - Kiichi Takeuchi');
        await fs.promises.writeFile(workDstFilePath,galleryOutputHtml);

        //console.log(workDstFilePath)

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Articles
        const articleSrcPath = path.join(this.srcPath,'articles');
        const articleTplFilePath = path.join(this.tplPath,'articles-template.html');
        const articleDstFilePath = path.join(this.dstPath,'articles.html');
        let repeaterArticleHtmlArr = [];

        let articleItems:ArticleItem[] = [];

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
            item.htmlFilePath = htmlFilePath;
            articleItems.push(item);
        }        

        articleItems.sort((a:ArticleItem, b:ArticleItem)=>(new Date(b.date)).getTime()-(new Date(a.date)).getTime());



        for(var i=0; i<articleItems.length; i++){
            const item = articleItems[i];
            // Build up thumbnail html repeater
            if (item.title.toLowerCase().indexOf('(draft)') === -1 &&
                item.tags.toLocaleLowerCase().indexOf('#unlisted') === -1 &&
                item.tags.toLocaleLowerCase().indexOf('#draft') === -1){
                repeaterArticleHtmlArr.push(item.getRepeaterHtml());
            }

            // Each MD -> HTML
            let genOutputHtml = genTemplateHtml.replace(/<!-- {{{CONTENT}}} -->/,item.getHtml());
            genOutputHtml = genOutputHtml.replace(/<!-- {{{COPYRIGHT}}} -->/g,'© Copyright '+(new Date()).getFullYear()+' - Kiichi Takeuchi');
            genOutputHtml = genOutputHtml.replace(/<!-- {{{CATEGORY}}} -->/g,'Article');
            genOutputHtml = genOutputHtml.replace(/<!-- {{{TITLE}}} -->/g,item.title);
            genOutputHtml = genOutputHtml.replace(/<!-- {{{SUBTITLE}}} -->/g,`(${item.getDateStr()})`);
            genOutputHtml = genOutputHtml.replace(/{{{PAGETYPE}}}/g,'article'); // class name in container tag
            //genOutputHtml = genOutputHtml.replace(/<!-- {{{MDRAW}}} -->/g,`${genItem.mdraw}`); // https://github.com/markmap/markmap/tree/master/packages/markmap-autoloader
            await fs.promises.writeFile(item.htmlFilePath,genOutputHtml);
        }

        // articles.html
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