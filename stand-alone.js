/*
THIS IS FOR STAND-ALONE EXPORT RUNNER WITHOUT INSTALLING THIS PLUGIN
K Website Export
*/

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));

// k-export.ts
var fs = __toESM(require("fs"));
var path = __toESM(require("path"));
var os = __toESM(require("os"));
var GalleryItem = class {
  constructor() {
    this.title = "";
    this.tags = "";
    this.date = "";
    this.place = "";
    this.medium = "";
    this.dimensions = "";
    this.no = "";
    this.description = "";
    this.thumbnail = "";
    this.fullimage = "";
    this.html = "";
  }
  getItemHtml() {
    return `
        <div class="item ${this.tags.replace("#", "")}">
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
        `;
  }
};
var KExport = class {
  constructor(inSrcPath, inTplPath, inDstPath) {
    this.srcPath = "";
    this.dstPath = "";
    this.tplPath = "";
    this.srcPath = inSrcPath.replace("~", os.homedir());
    this.dstPath = inDstPath.replace("~", os.homedir());
    this.tplPath = inTplPath.replace("~", os.homedir());
  }
  async start() {
    console.log("Export Started....");
    const workSrcPath = path.join(this.srcPath, "works");
    const workTplFilePath = path.join(this.tplPath, "works.html");
    const workDstFilePath = path.join(this.dstPath, "works.html");
    const list = await this.getFiles(workSrcPath);
    let repeaterHtmlArr = [];
    for await (const mdfile of this.getFiles(workSrcPath)) {
      const item = await this.parseMarkdown(mdfile, this.srcPath);
      repeaterHtmlArr.push(item.getItemHtml());
    }
    let repeaterHtml = repeaterHtmlArr.join("\n");
    console.log(repeaterHtml);
    const galleryTemplateHtml = await fs.promises.readFile(workTplFilePath, "utf-8");
    let galleryOutputHtml = galleryTemplateHtml.replace("<!-- {{{GALLERY}}} -->", repeaterHtml);
    galleryOutputHtml = galleryOutputHtml.replace("<!-- {{{COPYRIGHT}}} -->", "\xA9 Copyright " + new Date().getFullYear() + " - Kiichi Takeuchi");
    await fs.promises.writeFile(workDstFilePath, galleryOutputHtml);
    console.log("Export Ended....");
  }
  async *getFiles(dir) {
    const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
    for (const dirent of dirents) {
      const res = path.resolve(dir, dirent.name);
      if (dirent.isDirectory()) {
        yield* this.getFiles(res);
      } else if (dirent.name.endsWith(".md")) {
        yield res;
      }
    }
  }
  async parseMarkdown(filepath, workfolder) {
    let item = new GalleryItem();
    var data = {};
    var key = "";
    const dirpath = path.dirname(filepath);
    const contents = await fs.promises.readFile(filepath, "utf-8");
    const lines = contents.split("\n").filter((x) => x);
    for (let line of lines) {
      if (line.startsWith("#")) {
        key = line.split(" ")[1];
        data[key] = [];
        continue;
      }
      if (key) {
        data[key].push(line);
      }
    }
    for (let line of data["About"]) {
      if (line.startsWith("- Title:")) {
        item.title = line.replace("- Title:", "").trim();
      } else if (line.startsWith("- Date:")) {
        item.date = line.replace("- Date:", "").trim();
      } else if (line.startsWith("- Place:")) {
        item.place = line.replace("- Place:", "").trim();
      } else if (line.startsWith("- Medium:")) {
        item.medium = line.replace("- Medium:", "").trim();
      } else if (line.startsWith("- Dimensions:")) {
        item.dimensions = line.replace("- Dimensions:", "").trim();
      } else if (line.startsWith("- No:")) {
        item.no = line.replace("- No:", "").trim();
      } else if (line.startsWith("- Description:")) {
        item.description = line.replace("- Description:", "").trim();
      } else if (line.startsWith("- Tags:")) {
        item.tags = line.replace("- Tags:", "").trim();
      }
    }
    const theRelativePath = dirpath.replace(workfolder, "");
    const cleaned = data["Images"][0].replace("![](", "").replace(")", "");
    item.thumbnail = path.join(theRelativePath, cleaned);
    item.fullimage = item.thumbnail;
    return Promise.resolve(item);
  }
};

// stand-alone.ts
var kex = new KExport("~/Library/Mobile Documents/iCloud~md~obsidian/Documents/portfolio-kiichi/", "~/Desktop/template", "~/Desktop/publish");
kex.start();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiay1leHBvcnQudHMiLCAic3RhbmQtYWxvbmUudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBvcyBmcm9tICdvcyc7XG5cbmNsYXNzIEdhbGxlcnlJdGVtIHtcbiAgICB0aXRsZTpzdHJpbmcgPSAnJztcbiAgICB0YWdzOnN0cmluZyA9ICcnO1xuICAgIGRhdGU6c3RyaW5nID0gJyc7XG4gICAgcGxhY2U6c3RyaW5nID0gJyc7XG4gICAgbWVkaXVtOnN0cmluZyA9ICcnO1xuICAgIGRpbWVuc2lvbnM6c3RyaW5nID0gJyc7XG4gICAgbm86c3RyaW5nID0gJyc7XG4gICAgZGVzY3JpcHRpb246c3RyaW5nID0gJyc7XG4gICAgdGh1bWJuYWlsOnN0cmluZyA9ICcnO1xuICAgIGZ1bGxpbWFnZTpzdHJpbmcgPSAnJztcbiAgICBodG1sOnN0cmluZyA9ICcnO1xuXG4gICAgZ2V0SXRlbUh0bWwoKXtcbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgPGRpdiBjbGFzcz1cIml0ZW0gJHt0aGlzLnRhZ3MucmVwbGFjZSgnIycsJycpfVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBpY2ZyYW1lXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJvdmVybGF5XCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiaWNvblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiR7dGhpcy50aHVtYm5haWx9XCIgZGF0YS10eXBlPVwicHJldHR5UGhvdG9bZ2FsbGVyeV1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtc2VhcmNoIGljb24tdmlld1wiPjwvaT48L2E+XG4gICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPCEtLSBcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJpY29uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLWFsaWduLWp1c3RpZnkgZmEtZXh0ZXJuYWwtbGluayBpY29uLWluZm9cIiBkYXRhLXZhbHVlPVwicHJvamVjdC1kZXRhaWxzLXNsaWRlci5odG1sXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICA8L3NwYW4+IFxuICAgICAgICAgICAgICAgICAgICAtLT5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwZl90ZXh0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicHJvamVjdC1uYW1lXCI+JHt0aGlzLnRpdGxlfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5EYXRlOiAke3RoaXMuZGF0ZX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+UGxhY2U6ICR7dGhpcy5wbGFjZX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+TWVkaXVtOiAke3RoaXMuZGVzY3JpcHRpb259PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PkRpbWVuc2lvbnM6ICR7dGhpcy5kaW1lbnNpb25zfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5ObzogJHt0aGlzLm5vfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuXG4gICAgICAgICAgICAgICAgPGltZyBzcmM9XCIke3RoaXMuZnVsbGltYWdlfVwiIGFsdD1cIlwiIC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIGBcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBLRXhwb3J0IHtcbiAgICBzcmNQYXRoOnN0cmluZyA9ICcnO1xuICAgIGRzdFBhdGg6c3RyaW5nID0gJyc7XG4gICAgdHBsUGF0aDpzdHJpbmcgPSAnJztcbiAgICBjb25zdHJ1Y3RvcihpblNyY1BhdGg6c3RyaW5nLCBpblRwbFBhdGg6c3RyaW5nLCBpbkRzdFBhdGg6c3RyaW5nKXtcbiAgICAgICAgdGhpcy5zcmNQYXRoID0gaW5TcmNQYXRoLnJlcGxhY2UoXCJ+XCIsb3MuaG9tZWRpcigpKTtcbiAgICAgICAgdGhpcy5kc3RQYXRoID0gaW5Ec3RQYXRoLnJlcGxhY2UoXCJ+XCIsb3MuaG9tZWRpcigpKTtcbiAgICAgICAgdGhpcy50cGxQYXRoID0gaW5UcGxQYXRoLnJlcGxhY2UoXCJ+XCIsb3MuaG9tZWRpcigpKTtcbiAgICB9XG4gICAgYXN5bmMgc3RhcnQoKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJFeHBvcnQgU3RhcnRlZC4uLi5cIik7XG4gICAgICAgIFxuICAgICAgICBjb25zdCB3b3JrU3JjUGF0aCA9IHBhdGguam9pbih0aGlzLnNyY1BhdGgsJ3dvcmtzJyk7XG4gICAgICAgIGNvbnN0IHdvcmtUcGxGaWxlUGF0aCA9IHBhdGguam9pbih0aGlzLnRwbFBhdGgsJ3dvcmtzLmh0bWwnKTtcbiAgICAgICAgY29uc3Qgd29ya0RzdEZpbGVQYXRoID0gcGF0aC5qb2luKHRoaXMuZHN0UGF0aCwnd29ya3MuaHRtbCcpO1xuICAgICAgICBjb25zdCBsaXN0ID0gYXdhaXQgdGhpcy5nZXRGaWxlcyh3b3JrU3JjUGF0aCk7XG5cbiAgICAgICAgbGV0IHJlcGVhdGVySHRtbEFyciA9IFtdO1xuICAgICAgICBmb3IgYXdhaXQgKGNvbnN0IG1kZmlsZSBvZiB0aGlzLmdldEZpbGVzKHdvcmtTcmNQYXRoKSkge1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhtZGZpbGUpO1xuICAgICAgICAgICAgY29uc3QgaXRlbSA9IGF3YWl0IHRoaXMucGFyc2VNYXJrZG93bihtZGZpbGUsdGhpcy5zcmNQYXRoKTtcbiAgICAgICAgICAgIHJlcGVhdGVySHRtbEFyci5wdXNoKGl0ZW0uZ2V0SXRlbUh0bWwoKSk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHJlcGVhdGVySHRtbCA9IHJlcGVhdGVySHRtbEFyci5qb2luKCdcXG4nKTtcbiAgICAgICAgY29uc29sZS5sb2cocmVwZWF0ZXJIdG1sKTtcbiAgICAgICAgY29uc3QgZ2FsbGVyeVRlbXBsYXRlSHRtbCA9IGF3YWl0IGZzLnByb21pc2VzLnJlYWRGaWxlKHdvcmtUcGxGaWxlUGF0aCwndXRmLTgnKTtcbiAgICAgICAgbGV0IGdhbGxlcnlPdXRwdXRIdG1sID0gZ2FsbGVyeVRlbXBsYXRlSHRtbC5yZXBsYWNlKCc8IS0tIHt7e0dBTExFUll9fX0gLS0+JyxyZXBlYXRlckh0bWwpO1xuICAgICAgICBnYWxsZXJ5T3V0cHV0SHRtbCA9IGdhbGxlcnlPdXRwdXRIdG1sLnJlcGxhY2UoJzwhLS0ge3t7Q09QWVJJR0hUfX19IC0tPicsJ1x1MDBBOSBDb3B5cmlnaHQgJysobmV3IERhdGUoKSkuZ2V0RnVsbFllYXIoKSsnIC0gS2lpY2hpIFRha2V1Y2hpJyk7XG4gICAgICAgIGF3YWl0IGZzLnByb21pc2VzLndyaXRlRmlsZSh3b3JrRHN0RmlsZVBhdGgsZ2FsbGVyeU91dHB1dEh0bWwpOyAgICAgICAgXG5cbiAgICAgICAgY29uc29sZS5sb2coXCJFeHBvcnQgRW5kZWQuLi4uXCIpO1xuICAgIH1cblxuICAgIGFzeW5jICpnZXRGaWxlcyhkaXI6c3RyaW5nKTphbnkge1xuICAgICAgICBjb25zdCBkaXJlbnRzID0gYXdhaXQgZnMucHJvbWlzZXMucmVhZGRpcihkaXIsIHsgd2l0aEZpbGVUeXBlczogdHJ1ZSB9KTtcbiAgICAgICAgZm9yIChjb25zdCBkaXJlbnQgb2YgZGlyZW50cykge1xuICAgICAgICAgIGNvbnN0IHJlcyA9IHBhdGgucmVzb2x2ZShkaXIsIGRpcmVudC5uYW1lKTtcbiAgICAgICAgICBpZiAoZGlyZW50LmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgICAgIHlpZWxkKiB0aGlzLmdldEZpbGVzKHJlcyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgaWYoZGlyZW50Lm5hbWUuZW5kc1dpdGgoXCIubWRcIikpe1xuICAgICAgICAgICAgeWllbGQgcmVzO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBlbHNlIHsgLy8gZG8gbm90aGluZyB9IFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgcGFyc2VNYXJrZG93bihmaWxlcGF0aDpzdHJpbmcsIHdvcmtmb2xkZXI6c3RyaW5nKTpQcm9taXNlPEdhbGxlcnlJdGVtPnsgICAgICAgIFxuICAgICAgICAvLyBleHRyYWN0IG1ldGEgZmlyc3RcbiAgICAgICAgbGV0IGl0ZW0gPSBuZXcgR2FsbGVyeUl0ZW0oKTtcbiAgICAgICAgdmFyIGRhdGE6YW55ID0ge307XG4gICAgICAgIHZhciBrZXkgPSAnJztcblxuICAgICAgICBjb25zdCBkaXJwYXRoID0gcGF0aC5kaXJuYW1lKGZpbGVwYXRoKTtcbiAgICAgICAgY29uc3QgY29udGVudHMgPSBhd2FpdCBmcy5wcm9taXNlcy5yZWFkRmlsZShmaWxlcGF0aCwndXRmLTgnKTtcbiAgICAgICAgY29uc3QgbGluZXMgPSBjb250ZW50cy5zcGxpdCgnXFxuJykuZmlsdGVyKCh4KT0+eCk7XG5cbiAgICAgICAgZm9yIChsZXQgbGluZSBvZiBsaW5lcyl7XG4gICAgICAgICAgICBpZiAobGluZS5zdGFydHNXaXRoKCcjJykpe1xuICAgICAgICAgICAgICAgIGtleSA9IGxpbmUuc3BsaXQoJyAnKVsxXTtcbiAgICAgICAgICAgICAgICBkYXRhW2tleV0gPSBbXTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChrZXkpe1xuICAgICAgICAgICAgICAgIGRhdGFba2V5XS5wdXNoKGxpbmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuXG4gICAgICAgIGZvciAobGV0IGxpbmUgb2YgZGF0YVsnQWJvdXQnXSl7XG4gICAgICAgICAgICBpZiAobGluZS5zdGFydHNXaXRoKCctIFRpdGxlOicpKXtcbiAgICAgICAgICAgICAgICBpdGVtLnRpdGxlID0gbGluZS5yZXBsYWNlKCctIFRpdGxlOicsJycpLnRyaW0oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGxpbmUuc3RhcnRzV2l0aCgnLSBEYXRlOicpKXtcbiAgICAgICAgICAgICAgICBpdGVtLmRhdGUgPSBsaW5lLnJlcGxhY2UoJy0gRGF0ZTonLCcnKS50cmltKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChsaW5lLnN0YXJ0c1dpdGgoJy0gUGxhY2U6Jykpe1xuICAgICAgICAgICAgICAgIGl0ZW0ucGxhY2UgPSBsaW5lLnJlcGxhY2UoJy0gUGxhY2U6JywnJykudHJpbSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobGluZS5zdGFydHNXaXRoKCctIE1lZGl1bTonKSl7XG4gICAgICAgICAgICAgICAgaXRlbS5tZWRpdW0gPSBsaW5lLnJlcGxhY2UoJy0gTWVkaXVtOicsJycpLnRyaW0oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGxpbmUuc3RhcnRzV2l0aCgnLSBEaW1lbnNpb25zOicpKXtcbiAgICAgICAgICAgICAgICBpdGVtLmRpbWVuc2lvbnMgPSBsaW5lLnJlcGxhY2UoJy0gRGltZW5zaW9uczonLCcnKS50cmltKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChsaW5lLnN0YXJ0c1dpdGgoJy0gTm86Jykpe1xuICAgICAgICAgICAgICAgIGl0ZW0ubm8gPSBsaW5lLnJlcGxhY2UoJy0gTm86JywnJykudHJpbSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobGluZS5zdGFydHNXaXRoKCctIERlc2NyaXB0aW9uOicpKXtcbiAgICAgICAgICAgICAgICBpdGVtLmRlc2NyaXB0aW9uID0gbGluZS5yZXBsYWNlKCctIERlc2NyaXB0aW9uOicsJycpLnRyaW0oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGxpbmUuc3RhcnRzV2l0aCgnLSBUYWdzOicpKXtcbiAgICAgICAgICAgICAgICBpdGVtLnRhZ3MgPSBsaW5lLnJlcGxhY2UoJy0gVGFnczonLCcnKS50cmltKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0aGVSZWxhdGl2ZVBhdGggPSBkaXJwYXRoLnJlcGxhY2Uod29ya2ZvbGRlciwnJyk7XG4gICAgICAgIGNvbnN0IGNsZWFuZWQgPSBkYXRhWydJbWFnZXMnXVswXS5yZXBsYWNlKCchW10oJywnJykucmVwbGFjZSgnKScsJycpO1xuICAgICAgICBpdGVtLnRodW1ibmFpbCA9IHBhdGguam9pbih0aGVSZWxhdGl2ZVBhdGgsIGNsZWFuZWQpO1xuICAgICAgICBpdGVtLmZ1bGxpbWFnZSA9IGl0ZW0udGh1bWJuYWlsO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShpdGVtKTtcbiAgICB9XG59IiwgImltcG9ydCB7IEtFeHBvcnQgfSBmcm9tICdrLWV4cG9ydCdcbmNvbnN0IGtleCA9IG5ldyBLRXhwb3J0KCd+L0xpYnJhcnkvTW9iaWxlIERvY3VtZW50cy9pQ2xvdWR+bWR+b2JzaWRpYW4vRG9jdW1lbnRzL3BvcnRmb2xpby1raWljaGkvJyxcbiAgICAgICAgICAgICd+L0Rlc2t0b3AvdGVtcGxhdGUnLFxuICAgICAgICAgICAgJ34vRGVza3RvcC9wdWJsaXNoJyk7XG5rZXguc3RhcnQoKTsiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsU0FBb0I7QUFDcEIsV0FBc0I7QUFDdEIsU0FBb0I7QUFFcEIsSUFBTSxjQUFOLE1BQWtCO0FBQUEsRUFBbEI7QUFDSSxpQkFBZTtBQUNmLGdCQUFjO0FBQ2QsZ0JBQWM7QUFDZCxpQkFBZTtBQUNmLGtCQUFnQjtBQUNoQixzQkFBb0I7QUFDcEIsY0FBWTtBQUNaLHVCQUFxQjtB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
