export class KExport {
    constructor(inSrcPath, inDstPath) {
        this.srcPath = '';
        this.dstPath = '';
        this.srcPath = inSrcPath;
        this.dstPath = inDstPath;
    }
    start() {
        console.log("Export Started....");
        console.log('src', this.srcPath);
        console.log('dst', this.dstPath);
        console.log("Export Ended....");
    }
}
