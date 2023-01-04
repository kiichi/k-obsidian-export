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

// node_modules/@ts-stack/markdown/fesm2015/ts-stack-markdown.js
var ExtendRegexp = class {
  constructor(regex, flags = "") {
    this.source = regex.source;
    this.flags = flags;
  }
  setGroup(groupName, groupRegexp) {
    let newRegexp = typeof groupRegexp == "string" ? groupRegexp : groupRegexp.source;
    newRegexp = newRegexp.replace(/(^|[^\[])\^/g, "$1");
    this.source = this.source.replace(groupName, newRegexp);
    return this;
  }
  getRegexp() {
    return new RegExp(this.source, this.flags);
  }
};
var escapeTest = /[&<>"']/;
var escapeReplace = /[&<>"']/g;
var replacements = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};
var escapeTestNoEncode = /[<>"']|&(?!#?\w+;)/;
var escapeReplaceNoEncode = /[<>"']|&(?!#?\w+;)/g;
function escape(html, encode) {
  if (encode) {
    if (escapeTest.test(html)) {
      return html.replace(escapeReplace, (ch) => replacements[ch]);
    }
  } else {
    if (escapeTestNoEncode.test(html)) {
      return html.replace(escapeReplaceNoEncode, (ch) => replacements[ch]);
    }
  }
  return html;
}
function unescape(html) {
  return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/gi, function(_, n) {
    n = n.toLowerCase();
    if (n === "colon") {
      return ":";
    }
    if (n.charAt(0) === "#") {
      return n.charAt(1) === "x" ? String.fromCharCode(parseInt(n.substring(2), 16)) : String.fromCharCode(+n.substring(1));
    }
    return "";
  });
}
var TokenType;
(function(TokenType2) {
  TokenType2[TokenType2["space"] = 1] = "space";
  TokenType2[TokenType2["text"] = 2] = "text";
  TokenType2[TokenType2["paragraph"] = 3] = "paragraph";
  TokenType2[TokenType2["heading"] = 4] = "heading";
  TokenType2[TokenType2["listStart"] = 5] = "listStart";
  TokenType2[TokenType2["listEnd"] = 6] = "listEnd";
  TokenType2[TokenType2["looseItemStart"] = 7] = "looseItemStart";
  TokenType2[TokenType2["looseItemEnd"] = 8] = "looseItemEnd";
  TokenType2[TokenType2["listItemStart"] = 9] = "listItemStart";
  TokenType2[TokenType2["listItemEnd"] = 10] = "listItemEnd";
  TokenType2[TokenType2["blockquoteStart"] = 11] = "blockquoteStart";
  TokenType2[TokenType2["blockquoteEnd"] = 12] = "blockquoteEnd";
  TokenType2[TokenType2["code"] = 13] = "code";
  TokenType2[TokenType2["table"] = 14] = "table";
  TokenType2[TokenType2["html"] = 15] = "html";
  TokenType2[TokenType2["hr"] = 16] = "hr";
})(TokenType || (TokenType = {}));
var MarkedOptions = class {
  constructor() {
    this.gfm = true;
    this.tables = true;
    this.breaks = false;
    this.pedantic = false;
    this.sanitize = false;
    this.mangle = true;
    this.smartLists = false;
    this.silent = false;
    this.langPrefix = "lang-";
    this.smartypants = false;
    this.headerPrefix = "";
    this.xhtml = false;
    this.escape = escape;
    this.unescape = unescape;
  }
};
var Renderer = class {
  constructor(options) {
    this.options = options || Marked.options;
  }
  code(code, lang, escaped, meta) {
    if (this.options.highlight) {
      const out = this.options.highlight(code, lang);
      if (out != null && out !== code) {
        escaped = true;
        code = out;
      }
    }
    const escapedCode = escaped ? code : this.options.escape(code, true);
    if (!lang) {
      return `
<pre><code>${escapedCode}
</code></pre>
`;
    }
    const className = this.options.langPrefix + this.options.escape(lang, true);
    return `
<pre><code class="${className}">${escapedCode}
</code></pre>
`;
  }
  blockquote(quote) {
    return `<blockquote>
${quote}</blockquote>
`;
  }
  html(html) {
    return html;
  }
  heading(text, level, raw) {
    const id = this.options.headerPrefix + raw.toLowerCase().replace(/[^\w]+/g, "-");
    return `<h${level} id="${id}">${text}</h${level}>
`;
  }
  hr() {
    return this.options.xhtml ? "<hr/>\n" : "<hr>\n";
  }
  list(body, ordered) {
    const type = ordered ? "ol" : "ul";
    return `
<${type}>
${body}</${type}>
`;
  }
  listitem(text) {
    return "<li>" + text + "</li>\n";
  }
  paragraph(text) {
    return "<p>" + text + "</p>\n";
  }
  table(header, body) {
    return `
<table>
<thead>
${header}</thead>
<tbody>
${body}</tbody>
</table>
`;
  }
  tablerow(content) {
    return "<tr>\n" + content + "</tr>\n";
  }
  tablecell(content, flags) {
    const type = flags.header ? "th" : "td";
    const tag = flags.align ? "<" + type + ' style="text-align:' + flags.align + '">' : "<" + type + ">";
    return tag + content + "</" + type + ">\n";
  }
  strong(text) {
    return "<strong>" + text + "</strong>";
  }
  em(text) {
    return "<em>" + text + "</em>";
  }
  codespan(text) {
    return "<code>" + text + "</code>";
  }
  br() {
    return this.options.xhtml ? "<br/>" : "<br>";
  }
  del(text) {
    return "<del>" + text + "</del>";
  }
  link(href, title, text) {
    if (this.options.sanitize) {
      let prot;
      try {
        prot = decodeURIComponent(this.options.unescape(href)).replace(/[^\w:]/g, "").toLowerCase();
      } catch (e) {
        return text;
      }
      if (prot.indexOf("javascript:") === 0 || prot.indexOf("vbscript:") === 0 || prot.indexOf("data:") === 0) {
        return text;
      }
    }
    let out = '<a href="' + href + '"';
    if (title) {
      out += ' title="' + title + '"';
    }
    out += ">" + text + "</a>";
    return out;
  }
  image(href, title, text) {
    let out = '<img src="' + href + '" alt="' + text + '"';
    if (title) {
      out += ' title="' + title + '"';
    }
    out += this.options.xhtml ? "/>" : ">";
    return out;
  }
  text(text) {
    return text;
  }
};
var InlineLexer = class {
  constructor(staticThis, links, options = Marked.options, renderer) {
    this.staticThis = staticThis;
    this.links = links;
    this.options = options;
    this.renderer = renderer || this.options.renderer || new Renderer(this.options);
    if (!this.links) {
      throw new Error(`InlineLexer requires 'links' parameter.`);
    }
    this.setRules();
  }
  static output(src, links, options) {
    const inlineLexer = new this(this, links, options);
    return inlineLexer.output(src);
  }
  static getRulesBase() {
    if (this.rulesBase) {
      return this.rulesBase;
    }
    const base = {
      escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
      autolink: /^<([^ <>]+(@|:\/)[^ <>]+)>/,
      tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^<'">])*?>/,
      link: /^!?\[(inside)\]\(href\)/,
      reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
      nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
      strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
      em: /^\b_((?:[^_]|__)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
      code: /^(`+)([\s\S]*?[^`])\1(?!`)/,
      br: /^ {2,}\n(?!\s*$)/,
      text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/,
      _inside: /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/,
      _href: /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/
    };
    base.link = new ExtendRegexp(base.link).setGroup("inside", base._inside).setGroup("href", base._href).getRegexp();
    base.reflink = new ExtendRegexp(base.reflink).setGroup("inside", base._inside).getRegexp();
    return this.rulesBase = base;
  }
  static getRulesPedantic() {
    if (this.rulesPedantic) {
      return this.rulesPedantic;
    }
    return this.rulesPedantic = Object.assign(Object.assign({}, this.getRulesBase()), {
      strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
      em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
    });
  }
  static getRulesGfm() {
    if (this.rulesGfm) {
      return this.rulesGfm;
    }
    const base = this.getRulesBase();
    const escape2 = new ExtendRegexp(base.escape).setGroup("])", "~|])").getRegexp();
    const text = new ExtendRegexp(base.text).setGroup("]|", "~]|").setGroup("|", "|https?://|").getRegexp();
    return this.rulesGfm = Object.assign(Object.assign({}, base), {
      escape: escape2,
      url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
      del: /^~~(?=\S)([\s\S]*?\S)~~/,
      text
    });
  }
  static getRulesBreaks() {
    if (this.rulesBreaks) {
      return this.rulesBreaks;
    }
    const inline = this.getRulesGfm();
    const gfm = this.getRulesGfm();
    return this.rulesBreaks = Object.assign(Object.assign({}, gfm), {
      br: new ExtendRegexp(inline.br).setGroup("{2,}", "*").getRegexp(),
      text: new ExtendRegexp(gfm.text).setGroup("{2,}", "*").getRegexp()
    });
  }
  setRules() {
    if (this.options.gfm) {
      if (this.options.breaks) {
        this.rules = this.staticThis.getRulesBreaks();
      } else {
        this.rules = this.staticThis.getRulesGfm();
      }
    } else if (this.options.pedantic) {
      this.rules = this.staticThis.getRulesPedantic();
    } else {
      this.rules = this.staticThis.getRulesBase();
    }
    this.hasRulesGfm = this.rules.url !== void 0;
  }
  output(nextPart) {
    nextPart = nextPart;
    let execArr;
    let out = "";
    while (nextPart) {
      if (execArr = this.rules.escape.exec(nextPart)) {
        nextPart = nextPart.substring(execArr[0].length);
        out += execArr[1];
        continue;
      }
      if (execArr = this.rules.autolink.exec(nextPart)) {
        let text;
        let href;
        nextPart = nextPart.substring(execArr[0].length);
        if (execArr[2] === "@") {
          text = this.options.escape(execArr[1].charAt(6) === ":" ? this.mangle(execArr[1].substring(7)) : this.mangle(execArr[1]));
          href = this.mangle("mailto:") + text;
        } else {
          text = this.options.escape(execArr[1]);
          href = text;
        }
        out += this.renderer.link(href, null, text);
        continue;
      }
      if (!this.inLink && this.hasRulesGfm && (execArr = this.rules.url.exec(nextPart))) {
        let text;
        let href;
        nextPart = nextPart.substring(execArr[0].length);
        text = this.options.escape(execArr[1]);
        href = text;
        out += this.renderer.link(href, null, text);
        continue;
      }
      if (execArr = this.rules.tag.exec(nextPart)) {
        if (!this.inLink && /^<a /i.test(execArr[0])) {
          this.inLink = true;
        } else if (this.inLink && /^<\/a>/i.test(execArr[0])) {
          this.inLink = false;
        }
        nextPart = nextPart.substring(execArr[0].length);
        out += this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(execArr[0]) : this.options.escape(execArr[0]) : execArr[0];
        continue;
      }
      if (execArr = this.rules.link.exec(nextPart)) {
        nextPart = nextPart.substring(execArr[0].length);
        this.inLink = true;
        out += this.outputLink(execArr, {
          href: execArr[2],
          title: execArr[3]
        });
        this.inLink = false;
        continue;
      }
      if ((execArr = this.rules.reflink.exec(nextPart)) || (execArr = this.rules.nolink.exec(nextPart))) {
        nextPart = nextPart.substring(execArr[0].length);
        const keyLink = (execArr[2] || execArr[1]).replace(/\s+/g, " ");
        const link = this.links[keyLink.toLowerCase()];
        if (!link || !link.href) {
          out += execArr[0].charAt(0);
          nextPart = execArr[0].substring(1) + nextPart;
          continue;
        }
        this.inLink = true;
        out += this.outputLink(execArr, link);
        this.inLink = false;
        continue;
      }
      if (execArr = this.rules.strong.exec(nextPart)) {
        nextPart = nextPart.substring(execArr[0].length);
        out += this.renderer.strong(this.output(execArr[2] || execArr[1]));
        continue;
      }
      if (execArr = this.rules.em.exec(nextPart)) {
        nextPart = nextPart.substring(execArr[0].length);
        out += this.renderer.em(this.output(execArr[2] || execArr[1]));
        continue;
      }
      if (execArr = this.rules.code.exec(nextPart)) {
        nextPart = nextPart.substring(execArr[0].length);
        out += this.renderer.codespan(this.options.escape(execArr[2].trim(), true));
        continue;
      }
      if (execArr = this.rules.br.exec(nextPart)) {
        nextPart = nextPart.substring(execArr[0].length);
        out += this.renderer.br();
        continue;
      }
      if (this.hasRulesGfm && (execArr = this.rules.del.exec(nextPart))) {
        nextPart = nextPart.substring(execArr[0].length);
        out += this.renderer.del(this.output(execArr[1]));
        continue;
      }
      if (execArr = this.rules.text.exec(nextPart)) {
        nextPart = nextPart.substring(execArr[0].length);
        out += this.renderer.text(this.options.escape(this.smartypants(execArr[0])));
        continue;
      }
      if (nextPart) {
        throw new Error("Infinite loop on byte: " + nextPart.charCodeAt(0));
      }
    }
    return out;
  }
  outputLink(execArr, link) {
    const href = this.options.escape(link.href);
    const title = link.title ? this.options.escape(link.title) : null;
    return execArr[0].charAt(0) !== "!" ? this.renderer.link(href, title, this.output(execArr[1])) : this.renderer.image(href, title, this.options.escape(execArr[1]));
  }
  smartypants(text) {
    if (!this.options.smartypants) {
      return text;
    }
    return text.replace(/---/g, "\u2014").replace(/--/g, "\u2013").replace(/(^|[-\u2014/(\[{"\s])'/g, "$1\u2018").replace(/'/g, "\u2019").replace(/(^|[-\u2014/(\[{\u2018\s])"/g, "$1\u201C").replace(/"/g, "\u201D").replace(/\.{3}/g, "\u2026");
  }
  mangle(text) {
    if (!this.options.mangle) {
      return text;
    }
    let out = "";
    const length = text.length;
    for (let i = 0; i < length; i++) {
      let str;
      if (Math.random() > 0.5) {
        str = "x" + text.charCodeAt(i).toString(16);
      }
      out += "&#" + str + ";";
    }
    return out;
  }
};
InlineLexer.rulesBase = null;
InlineLexer.rulesPedantic = null;
InlineLexer.rulesGfm = null;
InlineLexer.rulesBreaks = null;
var Parser = class {
  constructor(options) {
    this.simpleRenderers = [];
    this.line = 0;
    this.tokens = [];
    this.token = null;
    this.options = options || Marked.options;
    this.renderer = this.options.renderer || new Renderer(this.options);
  }
  static parse(tokens, links, options) {
    const parser = new this(options);
    return parser.parse(links, tokens);
  }
  parse(links, tokens) {
    this.inlineLexer = new InlineLexer(InlineLexer, links, this.options, this.renderer);
    this.tokens = tokens.reverse();
    let out = "";
    while (this.next()) {
      out += this.tok();
    }
    return out;
  }
  debug(links, tokens) {
    this.inlineLexer = new InlineLexer(InlineLexer, links, this.options, this.renderer);
    this.tokens = tokens.reverse();
    let out = "";
    while (this.next()) {
      const outToken = this.tok();
      this.token.line = this.line += outToken.split("\n").length - 1;
      out += outToken;
    }
    return out;
  }
  next() {
    return this.token = this.tokens.pop();
  }
  getNextElement() {
    return this.tokens[this.tokens.length - 1];
  }
  parseText() {
    let body = this.token.text;
    let nextElement;
    while ((nextElement = this.getNextElement()) && nextElement.type == TokenType.text) {
      body += "\n" + this.next().text;
    }
    return this.inlineLexer.output(body);
  }
  tok() {
    switch (this.token.type) {
      case TokenType.space: {
        return "";
      }
      case TokenType.paragraph: {
        return this.renderer.paragraph(this.inlineLexer.output(this.token.text));
      }
      case TokenType.text: {
        if (this.options.isNoP) {
          return this.parseText();
        } else {
          return this.renderer.paragraph(this.parseText());
        }
      }
      case TokenType.heading: {
        return this.renderer.heading(this.inlineLexer.output(this.token.text), this.token.depth, this.token.text);
      }
      case TokenType.listStart: {
        let body = "";
        const ordered = this.token.ordered;
        while (this.next().type != TokenType.listEnd) {
          body += this.tok();
        }
        return this.renderer.list(body, ordered);
      }
      case TokenType.listItemStart: {
        let body = "";
        while (this.next().type != TokenType.listItemEnd) {
          body += this.token.type == TokenType.text ? this.parseText() : this.tok();
        }
        return this.renderer.listitem(body);
      }
      case TokenType.looseItemStart: {
        let body = "";
        while (this.next().type != TokenType.listItemEnd) {
          body += this.tok();
        }
        return this.renderer.listitem(body);
      }
      case TokenType.code: {
        return this.renderer.code(this.token.text, this.token.lang, this.token.escaped, this.token.meta);
      }
      case TokenType.table: {
        let header = "";
        let body = "";
        let cell;
        cell = "";
        for (let i = 0; i < this.token.header.length; i++) {
          const flags = { header: true, align: this.token.align[i] };
          const out = this.inlineLexer.output(this.token.header[i]);
          cell += this.renderer.tablecell(out, flags);
        }
        header += this.renderer.tablerow(cell);
        for (const row of this.token.cells) {
          cell = "";
          for (let j = 0; j < row.length; j++) {
            cell += this.renderer.tablecell(this.inlineLexer.output(row[j]), {
              header: false,
              align: this.token.align[j]
            });
          }
          body += this.renderer.tablerow(cell);
        }
        return this.renderer.table(header, body);
      }
      case TokenType.blockquoteStart: {
        let body = "";
        while (this.next().type != TokenType.blockquoteEnd) {
          body += this.tok();
        }
        return this.renderer.blockquote(body);
      }
      case TokenType.hr: {
        return this.renderer.hr();
      }
      case TokenType.html: {
        const html = !this.token.pre && !this.options.pedantic ? this.inlineLexer.output(this.token.text) : this.token.text;
        return this.renderer.html(html);
      }
      default: {
        if (this.simpleRenderers.length) {
          for (let i = 0; i < this.simpleRenderers.length; i++) {
            if (this.token.type == "simpleRule" + (i + 1)) {
              return this.simpleRenderers[i].call(this.renderer, this.token.execArr);
            }
          }
        }
        const errMsg = `Token with "${this.token.type}" type was not found.`;
        if (this.options.silent) {
          console.log(errMsg);
        } else {
          throw new Error(errMsg);
        }
      }
    }
  }
};
var Marked = class {
  static setOptions(options) {
    Object.assign(this.options, options);
    return this;
  }
  static setBlockRule(regexp, renderer = () => "") {
    BlockLexer.simpleRules.push(regexp);
    this.simpleRenderers.push(renderer);
    return this;
  }
  static parse(src, options = this.options) {
    try {
      const { tokens, links } = this.callBlockLexer(src, options);
      return this.callParser(tokens, links, options);
    } catch (e) {
      return this.callMe(e);
    }
  }
  static debug(src, options = this.options) {
    const { tokens, links } = this.callBlockLexer(src, options);
    let origin = tokens.slice();
    const parser = new Parser(options);
    parser.simpleRenderers = this.simpleRenderers;
    const result = parser.debug(links, tokens);
    origin = origin.map((token) => {
      token.type = TokenType[token.type] || token.type;
      const line = token.line;
      delete token.line;
      if (line) {
        return Object.assign({ line }, token);
      } else {
        return token;
      }
    });
    return { tokens: origin, links, result };
  }
  static callBlockLexer(src = "", options) {
    if (typeof src != "string") {
      throw new Error(`Expected that the 'src' parameter would have a 'string' type, got '${typeof src}'`);
    }
    src = src.replace(/\r\n|\r/g, "\n").replace(/\t/g, "    ").replace(/\u00a0/g, " ").replace(/\u2424/g, "\n").replace(/^ +$/gm, "");
    return BlockLexer.lex(src, options, true);
  }
  static callParser(tokens, links, options) {
    if (this.simpleRenderers.length) {
      const parser = new Parser(options);
      parser.simpleRenderers = this.simpleRenderers;
      return parser.parse(links, tokens);
    } else {
      return Parser.parse(tokens, links, options);
    }
  }
  static callMe(err) {
    err.message += "\nPlease report this to https://github.com/ts-stack/markdown";
    if (this.options.silent) {
      return "<p>An error occured:</p><pre>" + this.options.escape(err.message + "", true) + "</pre>";
    }
    throw err;
  }
};
Marked.options = new MarkedOptions();
Marked.simpleRenderers = [];
var BlockLexer = class {
  constructor(staticThis, options) {
    this.staticThis = staticThis;
    this.links = {};
    this.tokens = [];
    this.options = options || Marked.options;
    this.setRules();
  }
  static lex(src, options, top, isBlockQuote) {
    const lexer = new this(this, options);
    return lexer.getTokens(src, top, isBlockQuote);
  }
  static getRulesBase() {
    if (this.rulesBase) {
      return this.rulesBase;
    }
    const base = {
      newline: /^\n+/,
      code: /^( {4}[^\n]+\n*)+/,
      hr: /^( *[-*_]){3,} *(?:\n+|$)/,
      heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
      lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
      blockquote: /^( *>[^\n]+(\n[^\n]+)*\n*)+/,
      list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
      html: /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,
      def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
      paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
      text: /^[^\n]+/,
      bullet: /(?:[*+-]|\d+\.)/,
      item: /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/
    };
    base.item = new ExtendRegexp(base.item, "gm").setGroup(/bull/g, base.bullet).getRegexp();
    base.list = new ExtendRegexp(base.list).setGroup(/bull/g, base.bullet).setGroup("hr", "\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))").setGroup("def", "\\n+(?=" + base.def.source + ")").getRegexp();
    const tag = "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b";
    base.html = new ExtendRegexp(base.html).setGroup("comment", /<!--[\s\S]*?-->/).setGroup("closed", /<(tag)[\s\S]+?<\/\1>/).setGroup("closing", /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/).setGroup(/tag/g, tag).getRegexp();
    base.paragraph = new ExtendRegexp(base.paragraph).setGroup("hr", base.hr).setGroup("heading", base.heading).setGroup("lheading", base.lheading).setGroup("blockquote", base.blockquote).setGroup("tag", "<" + tag).setGroup("def", base.def).getRegexp();
    return this.rulesBase = base;
  }
  static getRulesGfm() {
    if (this.rulesGfm) {
      return this.rulesGfm;
    }
    const base = this.getRulesBase();
    const gfm = Object.assign(Object.assign({}, base), {
      fences: /^ *(`{3,}|~{3,})[ \.]*((\S+)? *[^\n]*)\n([\s\S]*?)\s*\1 *(?:\n+|$)/,
      paragraph: /^/,
      heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/
    });
    const group1 = gfm.fences.source.replace("\\1", "\\2");
    const group2 = base.list.source.replace("\\1", "\\3");
    gfm.paragraph = new ExtendRegexp(base.paragraph).setGroup("(?!", `(?!${group1}|${group2}|`).getRegexp();
    return this.rulesGfm = gfm;
  }
  static getRulesTable() {
    if (this.rulesTables) {
      return this.rulesTables;
    }
    return this.rulesTables = Object.assign(Object.assign({}, this.getRulesGfm()), {
      nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
      table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
    });
  }
  setRules() {
    if (this.options.gfm) {
      if (this.options.tables) {
        this.rules = this.staticThis.getRulesTable();
      } else {
        this.rules = this.staticThis.getRulesGfm();
      }
    } else {
      this.rules = this.staticThis.getRulesBase();
    }
    this.hasRulesGfm = this.rules.fences !== void 0;
    this.hasRulesTables = this.rules.table !== void 0;
  }
  getTokens(src, top, isBlockQuote) {
    let nextPart = src;
    let execArr;
    mainLoop:
      while (nextPart) {
        if (execArr = this.rules.newline.exec(nextPart)) {
          nextPart = nextPart.substring(execArr[0].length);
          if (execArr[0].length > 1) {
            this.tokens.push({ type: TokenType.space });
          }
        }
        if (execArr = this.rules.code.exec(nextPart)) {
          nextPart = nextPart.substring(execArr[0].length);
          const code = execArr[0].replace(/^ {4}/gm, "");
          this.tokens.push({
            type: TokenType.code,
            text: !this.options.pedantic ? code.replace(/\n+$/, "") : code
          });
          continue;
        }
        if (this.hasRulesGfm && (execArr = this.rules.fences.exec(nextPart))) {
          nextPart = nextPart.substring(execArr[0].length);
          this.tokens.push({
            type: TokenType.code,
            meta: execArr[2],
            lang: execArr[3],
            text: execArr[4] || ""
          });
          continue;
        }
        if (execArr = this.rules.heading.exec(nextPart)) {
          nextPart = nextPart.substring(execArr[0].length);
          this.tokens.push({
            type: TokenType.heading,
            depth: execArr[1].length,
            text: execArr[2]
          });
          continue;
        }
        if (top && this.hasRulesTables && (execArr = this.rules.nptable.exec(nextPart))) {
          nextPart = nextPart.substring(execArr[0].length);
          const item = {
            type: TokenType.table,
            header: execArr[1].replace(/^ *| *\| *$/g, "").split(/ *\| */),
            align: execArr[2].replace(/^ *|\| *$/g, "").split(/ *\| */),
            cells: []
          };
          for (let i = 0; i < item.align.length; i++) {
            if (/^ *-+: *$/.test(item.align[i])) {
              item.align[i] = "right";
            } else if (/^ *:-+: *$/.test(item.align[i])) {
              item.align[i] = "center";
            } else if (/^ *:-+ *$/.test(item.align[i])) {
              item.align[i] = "left";
            } else {
              item.align[i] = null;
            }
          }
          const td = execArr[3].replace(/\n$/, "").split("\n");
          for (let i = 0; i < td.length; i++) {
            item.cells[i] = td[i].split(/ *\| */);
          }
          this.tokens.push(item);
          continue;
        }
        if (execArr = this.rules.lheading.exec(nextPart)) {
          nextPart = nextPart.substring(execArr[0].length);
          this.tokens.push({
            type: TokenType.heading,
            depth: execArr[2] === "=" ? 1 : 2,
            text: execArr[1]
          });
          continue;
        }
        if (execArr = this.rules.hr.exec(nextPart)) {
          nextPart = nextPart.substring(execArr[0].length);
          this.tokens.push({ type: TokenType.hr });
          continue;
        }
        if (execArr = this.rules.blockquote.exec(nextPart)) {
          nextPart = nextPart.substring(execArr[0].length);
          this.tokens.push({ type: TokenType.blockquoteStart });
          const str = execArr[0].replace(/^ *> ?/gm, "");
          this.getTokens(str);
          this.tokens.push({ type: TokenType.blockquoteEnd });
          continue;
        }
        if (execArr = this.rules.list.exec(nextPart)) {
          nextPart = nextPart.substring(execArr[0].length);
          const bull = execArr[2];
          this.tokens.push({ type: TokenType.listStart, ordered: bull.length > 1 });
          const str = execArr[0].match(this.rules.item);
          const length = str.length;
          let next = false;
          let space;
          let blockBullet;
          let loose;
          for (let i = 0; i < length; i++) {
            let item = str[i];
            space = item.length;
            item = item.replace(/^ *([*+-]|\d+\.) +/, "");
            if (item.indexOf("\n ") !== -1) {
              space -= item.length;
              item = !this.options.pedantic ? item.replace(new RegExp("^ {1," + space + "}", "gm"), "") : item.replace(/^ {1,4}/gm, "");
            }
            if (this.options.smartLists && i !== length - 1) {
              blockBullet = this.staticThis.getRulesBase().bullet.exec(str[i + 1])[0];
              if (bull !== blockBullet && !(bull.length > 1 && blockBullet.length > 1)) {
                nextPart = str.slice(i + 1).join("\n") + nextPart;
                i = length - 1;
              }
            }
            loose = next || /\n\n(?!\s*$)/.test(item);
            if (i !== length - 1) {
              next = item.charAt(item.length - 1) === "\n";
              if (!loose) {
                loose = next;
              }
            }
            this.tokens.push({ type: loose ? TokenType.looseItemStart : TokenType.listItemStart });
            this.getTokens(item, false, isBlockQuote);
            this.tokens.push({ type: TokenType.listItemEnd });
          }
          this.tokens.push({ type: TokenType.listEnd });
          continue;
        }
        if (execArr = this.rules.html.exec(nextPart)) {
          nextPart = nextPart.substring(execArr[0].length);
          const attr = execArr[1];
          const isPre = attr === "pre" || attr === "script" || attr === "style";
          this.tokens.push({
            type: this.options.sanitize ? TokenType.paragraph : TokenType.html,
            pre: !this.options.sanitizer && isPre,
            text: execArr[0]
          });
          continue;
        }
        if (top && (execArr = this.rules.def.exec(nextPart))) {
          nextPart = nextPart.substring(execArr[0].length);
          this.links[execArr[1].toLowerCase()] = {
            href: execArr[2],
            title: execArr[3]
          };
          continue;
        }
        if (top && this.hasRulesTables && (execArr = this.rules.table.exec(nextPart))) {
          nextPart = nextPart.substring(execArr[0].length);
          const item = {
            type: TokenType.table,
            header: execArr[1].replace(/^ *| *\| *$/g, "").split(/ *\| */),
            align: execArr[2].replace(/^ *|\| *$/g, "").split(/ *\| */),
            cells: []
          };
          for (let i = 0; i < item.align.length; i++) {
            if (/^ *-+: *$/.test(item.align[i])) {
              item.align[i] = "right";
            } else if (/^ *:-+: *$/.test(item.align[i])) {
              item.align[i] = "center";
            } else if (/^ *:-+ *$/.test(item.align[i])) {
              item.align[i] = "left";
            } else {
              item.align[i] = null;
            }
          }
          const td = execArr[3].replace(/(?: *\| *)?\n$/, "").split("\n");
          for (let i = 0; i < td.length; i++) {
            item.cells[i] = td[i].replace(/^ *\| *| *\| *$/g, "").split(/ *\| */);
          }
          this.tokens.push(item);
          continue;
        }
        if (this.staticThis.simpleRules.length) {
          const simpleRules = this.staticThis.simpleRules;
          for (let i = 0; i < simpleRules.length; i++) {
            if (execArr = simpleRules[i].exec(nextPart)) {
              nextPart = nextPart.substring(execArr[0].length);
              const type = "simpleRule" + (i + 1);
              this.tokens.push({ type, execArr });
              continue mainLoop;
            }
          }
        }
        if (top && (execArr = this.rules.paragraph.exec(nextPart))) {
          nextPart = nextPart.substring(execArr[0].length);
          if (execArr[1].slice(-1) === "\n") {
            this.tokens.push({
              type: TokenType.paragraph,
              text: execArr[1].slice(0, -1)
            });
          } else {
            this.tokens.push({
              type: this.tokens.length > 0 ? TokenType.paragraph : TokenType.text,
              text: execArr[1]
            });
          }
          continue;
        }
        if (execArr = this.rules.text.exec(nextPart)) {
          nextPart = nextPart.substring(execArr[0].length);
          this.tokens.push({ type: TokenType.text, text: execArr[0] });
          continue;
        }
        if (nextPart) {
          throw new Error("Infinite loop on byte: " + nextPart.charCodeAt(0) + `, near text '${nextPart.slice(0, 30)}...'`);
        }
      }
    return { tokens: this.tokens, links: this.links };
  }
};
BlockLexer.simpleRules = [];
BlockLexer.rulesBase = null;
BlockLexer.rulesGfm = null;
BlockLexer.rulesTables = null;

// k-export.ts
var MyRenderer = class extends Renderer {
  image(href, title, text) {
    if (href.endsWith(".glb")) {
      return `<babylon 
        templates.nav-bar.params.logo-image="/images/favicon/apple-icon.png" 
        templates.nav-bar.params.logo-text="Copyright Kiichi Takeuchi" 
        templates.nav-bar.params.logo-link="https://kiichitakeuchi.com/" 
        model="./${href}" ></babylon>`;
    }
    return super.image(href, title, text);
  }
};
Marked.setOptions({ renderer: new MyRenderer() });
var GenericItem = class {
  constructor(inMDRaw) {
    this.mdraw = "";
    this.mdraw = inMDRaw;
  }
  getHtml() {
    return Marked.parse(this.mdraw);
  }
};
var ArticleItem = class extends GenericItem {
  constructor(inMDRaw, inDirPath, inFilePath) {
    super(inMDRaw);
    this.title = "";
    this.summary = "";
    this.tags = "";
    this.date = "";
    this.image = "";
    this.filePath = "";
    const lines = this.mdraw.split("\n").filter((x) => x);
    let counter = 0;
    let tmpSum = "";
    for (let line of lines) {
      if (line.startsWith("# ")) {
        if (counter == 0) {
          this.title = line.replace("# ", "");
        } else {
        }
        counter++;
      }
      if (counter == 1) {
        if (line.startsWith("- Date:")) {
          this.date = line.replace("- Date:", "").trim();
        } else if (line.startsWith("- Tags:")) {
          this.tags = line.replace("- Tags:", "").trim();
        } else if (line.startsWith("![](")) {
          const cleaned = line.replace("![](", "").replace(")", "");
          this.image = path.join(inDirPath, cleaned);
        } else if (line.startsWith("# ")) {
        } else {
          tmpSum += line;
        }
      }
    }
    this.summary = tmpSum.length > 300 ? tmpSum.substring(0, 300) + " &mldr; " : tmpSum;
    this.filePath = inFilePath;
  }
  getDate() {
    return new Date(this.date).getDate() + 1;
  }
  getMonth() {
    return new Date(this.date).toLocaleString("en-US", { month: "short" }).toLocaleUpperCase();
  }
  getDateStr() {
    return new Date(this.date).toLocaleDateString();
  }
  getRepeaterHtml() {
    return `
        <div class="col-md-4 bloglist ${this.tags.replace("#", "")}">
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
        `;
  }
};
var GalleryItem = class extends GenericItem {
  constructor(inMDRaw, inRelativePath, inRelativeHtmlPath) {
    super(inMDRaw);
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
    this.htmlpath = "";
    var data = {};
    var key = "";
    const lines = this.mdraw.split("\n").filter((x) => x);
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
        this.title = line.replace("- Title:", "").trim();
      } else if (line.startsWith("- Date:")) {
        this.date = line.replace("- Date:", "").trim();
      } else if (line.startsWith("- Place:")) {
        this.place = line.replace("- Place:", "").trim();
      } else if (line.startsWith("- Medium:")) {
        this.medium = line.replace("- Medium:", "").trim();
      } else if (line.startsWith("- Dimensions:")) {
        this.dimensions = line.replace("- Dimensions:", "").trim();
      } else if (line.startsWith("- No:")) {
        this.no = line.replace("- No:", "").trim();
      } else if (line.startsWith("- Description:")) {
        this.description = line.replace("- Description:", "").trim();
      } else if (line.startsWith("- Tags:")) {
        this.tags = line.replace("- Tags:", "").trim();
      }
    }
    const cleaned = data["Images"][0].replace("![](", "").replace(")", "");
    this.thumbnail = path.join(inRelativePath, cleaned);
    this.fullimage = this.thumbnail;
    this.htmlpath = inRelativeHtmlPath;
  }
  getRepeaterHtml() {
    return `
        <div class="item ${this.tags.replace("#", "")}">
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
    const genTplFilePath = path.join(this.tplPath, "generic.html");
    const genTemplateHtml = await fs.promises.readFile(genTplFilePath, "utf-8");
    const workSrcPath = path.join(this.srcPath, "works");
    const workTplFilePath = path.join(this.tplPath, "works.html");
    const workDstFilePath = path.join(this.dstPath, "works.html");
    let repeaterHtmlArr = [];
    for await (const mdfilePath of this.getFiles(workSrcPath)) {
      const htmlFilePath = mdfilePath.replace(".md", ".html");
      const contents = await fs.promises.readFile(mdfilePath, "utf-8");
      const dirpath = path.dirname(mdfilePath);
      const relativeSrcDirPath = dirpath.replace(this.srcPath, "");
      const relativeHtmlPath = htmlFilePath.replace(this.srcPath, "");
      const item = new GalleryItem(contents, relativeSrcDirPath, relativeHtmlPath);
      repeaterHtmlArr.push(item.getRepeaterHtml());
      let genOutputHtml = genTemplateHtml.replace(/<!-- {{{CONTENT}}} -->/, item.getHtml());
      genOutputHtml = genOutputHtml.replace(/<!-- {{{COPYRIGHT}}} -->/g, "\xA9 Copyright " + new Date().getFullYear() + " - Kiichi Takeuchi");
      genOutputHtml = genOutputHtml.replace(/<!-- {{{CATEGORY}}} -->/g, "Works");
      genOutputHtml = genOutputHtml.replace(/<!-- {{{TITLE}}} -->/g, item.title);
      genOutputHtml = genOutputHtml.replace(/<!-- {{{SUBTITLE}}} -->/g, `(${item.date})`);
      await fs.promises.writeFile(htmlFilePath, genOutputHtml);
    }
    let repeaterHtml = repeaterHtmlArr.join("\n");
    const galleryTemplateHtml = await fs.promises.readFile(workTplFilePath, "utf-8");
    let galleryOutputHtml = galleryTemplateHtml.replace("<!-- {{{GALLERY}}} -->", repeaterHtml);
    galleryOutputHtml = galleryOutputHtml.replace("<!-- {{{COPYRIGHT}}} -->", "\xA9 Copyright " + new Date().getFullYear() + " - Kiichi Takeuchi");
    await fs.promises.writeFile(workDstFilePath, galleryOutputHtml);
    console.log(workDstFilePath);
    const articleSrcPath = path.join(this.srcPath, "articles");
    const articleTplFilePath = path.join(this.tplPath, "articles.html");
    const articleDstFilePath = path.join(this.dstPath, "articles.html");
    let repeaterArticleHtmlArr = [];
    for await (const mdfilePath of this.getFiles(articleSrcPath)) {
      const htmlFilePath = mdfilePath.replace(".md", ".html");
      const contents = await fs.promises.readFile(mdfilePath, "utf-8");
      const dirpath = path.dirname(mdfilePath);
      const relativeSrcDirPath = dirpath.replace(this.srcPath, "");
      const relativeHtmlPath = htmlFilePath.replace(this.srcPath, "");
      const item = new ArticleItem(contents, relativeSrcDirPath, relativeHtmlPath);
      repeaterArticleHtmlArr.push(item.getRepeaterHtml());
      let genOutputHtml = genTemplateHtml.replace(/<!-- {{{CONTENT}}} -->/, item.getHtml());
      genOutputHtml = genOutputHtml.replace(/<!-- {{{COPYRIGHT}}} -->/g, "\xA9 Copyright " + new Date().getFullYear() + " - Kiichi Takeuchi");
      genOutputHtml = genOutputHtml.replace(/<!-- {{{CATEGORY}}} -->/g, "Works");
      genOutputHtml = genOutputHtml.replace(/<!-- {{{TITLE}}} -->/g, item.title);
      genOutputHtml = genOutputHtml.replace(/<!-- {{{SUBTITLE}}} -->/g, `(${item.getDateStr()})`);
      await fs.promises.writeFile(htmlFilePath, genOutputHtml);
    }
    const repeaterArticleHtml = repeaterArticleHtmlArr.join("\n");
    const articleTemplateHtml = await fs.promises.readFile(articleTplFilePath, "utf-8");
    let articleOutputHtml = articleTemplateHtml.replace("<!-- {{{ARTICLES}}} -->", repeaterArticleHtml);
    articleOutputHtml = articleOutputHtml.replace("<!-- {{{COPYRIGHT}}} -->", "\xA9 Copyright " + new Date().getFullYear() + " - Kiichi Takeuchi");
    await fs.promises.writeFile(articleDstFilePath, articleOutputHtml);
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
};

// stand-alone.ts
var kex = new KExport("~/Desktop/publish", "~/Desktop/template", "~/Desktop/publish");
kex.start();
/*
 * @license
 *
 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/marked
 *
 * Copyright (c) 2018-2021, Костя Третяк. (MIT Licensed)
 * https://github.com/ts-stack/markdown
 */
/**
 * @license
 *
 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/marked
 *
 * Copyright (c) 2018-2021, Костя Третяк. (MIT Licensed)
 * https://github.com/ts-stack/markdown
 */
/**
 * @license
 *
 * Copyright (c) 2018-2021, Костя Третяк. (MIT Licensed)
 * https://github.com/ts-stack/markdown
 */
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiay1leHBvcnQudHMiLCAibm9kZV9tb2R1bGVzL0B0cy1zdGFjay9wcm9qZWN0cy9tYXJrZG93bi9zcmMvZXh0ZW5kLXJlZ2V4cC50cyIsICJub2RlX21vZHVsZXMvQHRzLXN0YWNrL3Byb2plY3RzL21hcmtkb3duL3NyYy9oZWxwZXJzLnRzIiwgIm5vZGVfbW9kdWxlcy9AdHMtc3RhY2svcHJvamVjdHMvbWFya2Rvd24vc3JjL2ludGVyZmFjZXMudHMiLCAibm9kZV9tb2R1bGVzL0B0cy1zdGFjay9wcm9qZWN0cy9tYXJrZG93bi9zcmMvcmVuZGVyZXIudHMiLCAibm9kZV9tb2R1bGVzL0B0cy1zdGFjay9wcm9qZWN0cy9tYXJrZG93bi9zcmMvaW5saW5lLWxleGVyLnRzIiwgIm5vZGVfbW9kdWxlcy9AdHMtc3RhY2svcHJvamVjdHMvbWFya2Rvd24vc3JjL3BhcnNlci50cyIsICJub2RlX21vZHVsZXMvQHRzLXN0YWNrL3Byb2plY3RzL21hcmtkb3duL3NyYy9tYXJrZWQudHMiLCAibm9kZV9tb2R1bGVzL0B0cy1zdGFjay9wcm9qZWN0cy9tYXJrZG93bi9zcmMvYmxvY2stbGV4ZXIudHMiLCAibm9kZV9tb2R1bGVzL0B0cy1zdGFjay9wcm9qZWN0cy9tYXJrZG93bi90cy1zdGFjay1tYXJrZG93bi50cyIsICJzdGFuZC1hbG9uZS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIG9zIGZyb20gJ29zJztcbmltcG9ydCB7IE1hcmtlZCwgUmVuZGVyZXIgfSBmcm9tICdAdHMtc3RhY2svbWFya2Rvd24nO1xuXG5cbmNsYXNzIE15UmVuZGVyZXIgZXh0ZW5kcyBSZW5kZXJlciB7XG4gIC8vIGltYWdlIGVtYmVkIGFzIDMtRCB2aWV3ZXIgaWYgdGhlIGV4dCBpcyAuZ2xiLiBhZGQgLi8gZm9yIHRoZSBwYXRoXG4gIC8vIGh0dHBzOi8vZG9jLmJhYnlsb25qcy5jb20vZmVhdHVyZXMvZmVhdHVyZXNEZWVwRGl2ZS9iYWJ5bG9uVmlld2VyL2RlZmF1bHRWaWV3ZXJDb25maWdcbiAgaW1hZ2UoaHJlZjogc3RyaW5nLCB0aXRsZTogc3RyaW5nLCB0ZXh0OiBzdHJpbmcpOiBzdHJpbmd7XG4gICAgaWYgKGhyZWYuZW5kc1dpdGgoJy5nbGInKSl7XG4gICAgICAgIHJldHVybiBgPGJhYnlsb24gXG4gICAgICAgIHRlbXBsYXRlcy5uYXYtYmFyLnBhcmFtcy5sb2dvLWltYWdlPVwiL2ltYWdlcy9mYXZpY29uL2FwcGxlLWljb24ucG5nXCIgXG4gICAgICAgIHRlbXBsYXRlcy5uYXYtYmFyLnBhcmFtcy5sb2dvLXRleHQ9XCJDb3B5cmlnaHQgS2lpY2hpIFRha2V1Y2hpXCIgXG4gICAgICAgIHRlbXBsYXRlcy5uYXYtYmFyLnBhcmFtcy5sb2dvLWxpbms9XCJodHRwczovL2tpaWNoaXRha2V1Y2hpLmNvbS9cIiBcbiAgICAgICAgbW9kZWw9XCIuLyR7aHJlZn1cIiA+PC9iYWJ5bG9uPmBcbiAgICB9XG4gICAgcmV0dXJuIHN1cGVyLmltYWdlKGhyZWYsdGl0bGUsdGV4dCk7XG4gIH1cbn1cbk1hcmtlZC5zZXRPcHRpb25zKHtyZW5kZXJlcjogbmV3IE15UmVuZGVyZXJ9KTtcblxuY2xhc3MgR2VuZXJpY0l0ZW0ge1xuICAgIG1kcmF3OnN0cmluZyA9ICcnO1xuICAgIGNvbnN0cnVjdG9yKGluTURSYXc6c3RyaW5nKXtcbiAgICAgICAgdGhpcy5tZHJhdyA9IGluTURSYXc7XG4gICAgfVxuXG4gICAgZ2V0SHRtbCgpe1xuICAgICAgICByZXR1cm4gTWFya2VkLnBhcnNlKHRoaXMubWRyYXcpO1xuICAgIH1cbn1cblxuY2xhc3MgQXJ0aWNsZUl0ZW0gZXh0ZW5kcyBHZW5lcmljSXRlbSB7XG4gICAgdGl0bGU6c3RyaW5nID0gJyc7XG4gICAgc3VtbWFyeTpzdHJpbmcgPSAnJztcbiAgICB0YWdzOnN0cmluZyA9ICcnO1xuICAgIGRhdGU6c3RyaW5nID0gJyc7XG4gICAgaW1hZ2U6c3RyaW5nID0gJyc7XG4gICAgZmlsZVBhdGg6c3RyaW5nID0gJyc7XG5cbiAgICBjb25zdHJ1Y3Rvcihpbk1EUmF3OnN0cmluZywgaW5EaXJQYXRoOnN0cmluZywgaW5GaWxlUGF0aDpzdHJpbmcpe1xuICAgICAgICBzdXBlcihpbk1EUmF3KTtcblxuICAgICAgICBjb25zdCBsaW5lcyA9IHRoaXMubWRyYXcuc3BsaXQoJ1xcbicpLmZpbHRlcigoeCk9PngpO1xuICAgICAgICBsZXQgY291bnRlciA9IDA7XG4gICAgICAgIGxldCB0bXBTdW0gPSAnJztcbiAgICAgICAgZm9yIChsZXQgbGluZSBvZiBsaW5lcyl7XG4gICAgICAgICAgICBpZiAobGluZS5zdGFydHNXaXRoKCcjICcpKXtcbiAgICAgICAgICAgICAgICBpZiAoY291bnRlciA9PSAwKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50aXRsZSA9IGxpbmUucmVwbGFjZSgnIyAnLCcnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb3VudGVyKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY291bnRlciA9PSAxKXtcbiAgICAgICAgICAgICAgICBpZiAobGluZS5zdGFydHNXaXRoKCctIERhdGU6Jykpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGUgPSBsaW5lLnJlcGxhY2UoJy0gRGF0ZTonLCcnKS50cmltKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGxpbmUuc3RhcnRzV2l0aCgnLSBUYWdzOicpKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50YWdzID0gbGluZS5yZXBsYWNlKCctIFRhZ3M6JywnJykudHJpbSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChsaW5lLnN0YXJ0c1dpdGgoJyFbXSgnKSl7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNsZWFuZWQgPSBsaW5lLnJlcGxhY2UoJyFbXSgnLCcnKS5yZXBsYWNlKCcpJywnJyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2UgPSAgcGF0aC5qb2luKGluRGlyUGF0aCwgY2xlYW5lZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGxpbmUuc3RhcnRzV2l0aCgnIyAnKSl7XG4gICAgICAgICAgICAgICAgICAgIC8vIG5vdGhpbmdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRtcFN1bSArPSBsaW5lO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3VtbWFyeSA9ICh0bXBTdW0ubGVuZ3RoID4gMzAwKSA/IHRtcFN1bS5zdWJzdHJpbmcoMCwzMDApICsgJyAmbWxkcjsgJyA6IHRtcFN1bTtcbiAgICAgICAgdGhpcy5maWxlUGF0aCA9IGluRmlsZVBhdGg7XG4gICAgfVxuICAgIGdldERhdGUoKXtcbiAgICAgICAgcmV0dXJuICgobmV3IERhdGUodGhpcy5kYXRlKSkuZ2V0RGF0ZSgpICsgMSk7XG4gICAgfVxuICAgIGdldE1vbnRoKCl7ICAgICAgICBcbiAgICAgICAgcmV0dXJuIChuZXcgRGF0ZSh0aGlzLmRhdGUpKS50b0xvY2FsZVN0cmluZygnZW4tVVMnLCB7bW9udGg6ICdzaG9ydCd9KS50b0xvY2FsZVVwcGVyQ2FzZSgpO1xuICAgIH1cbiAgICBnZXREYXRlU3RyKCl7XG4gICAgICAgIHJldHVybiAobmV3IERhdGUodGhpcy5kYXRlKSkudG9Mb2NhbGVEYXRlU3RyaW5nKCk7XG4gICAgfVxuICAgIGdldFJlcGVhdGVySHRtbCgpe1xuICAgICAgICByZXR1cm4gYFxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTQgYmxvZ2xpc3QgJHt0aGlzLnRhZ3MucmVwbGFjZSgnIycsJycpfVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwb3N0LWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwb3N0LWltYWdlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9XCIke3RoaXMuaW1hZ2V9XCIgYWx0PVwiXCIgZHJhZ2dhYmxlPVwiZmFsc2VcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRhdGUtYm94XCI+PHNwYW4gY2xhc3M9XCJkYXlcIj4ke3RoaXMuZ2V0RGF0ZSgpfTwvc3Bhbj4gPHNwYW4gY2xhc3M9XCJtb250aFwiPiR7dGhpcy5nZXRNb250aCgpfTwvc3Bhbj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwb3N0LXRleHRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDM+PGEgaHJlZj1cIiR7dGhpcy5maWxlUGF0aH1cIj4ke3RoaXMudGl0bGV9PC9hPjwvaDM+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHt0aGlzLnN1bW1hcnl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIke3RoaXMuZmlsZVBhdGh9XCIgY2xhc3M9XCJidG4tdGV4dFwiPlJlYWQgTW9yZTwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYFxuICAgIH1cbn1cblxuY2xhc3MgR2FsbGVyeUl0ZW0gZXh0ZW5kcyBHZW5lcmljSXRlbSB7XG4gICAgdGl0bGU6c3RyaW5nID0gJyc7XG4gICAgdGFnczpzdHJpbmcgPSAnJztcbiAgICBkYXRlOnN0cmluZyA9ICcnO1xuICAgIHBsYWNlOnN0cmluZyA9ICcnO1xuICAgIG1lZGl1bTpzdHJpbmcgPSAnJztcbiAgICBkaW1lbnNpb25zOnN0cmluZyA9ICcnO1xuICAgIG5vOnN0cmluZyA9ICcnO1xuICAgIGRlc2NyaXB0aW9uOnN0cmluZyA9ICcnO1xuICAgIHRodW1ibmFpbDpzdHJpbmcgPSAnJztcbiAgICBmdWxsaW1hZ2U6c3RyaW5nID0gJyc7XG4gICAgaHRtbHBhdGg6c3RyaW5nID0gJyc7XG5cbiAgICBjb25zdHJ1Y3Rvcihpbk1EUmF3OnN0cmluZywgaW5SZWxhdGl2ZVBhdGg6c3RyaW5nLCBpblJlbGF0aXZlSHRtbFBhdGg6c3RyaW5nICl7XG4gICAgICAgIHN1cGVyKGluTURSYXcpO1xuXG5cbiAgICAgICAgdmFyIGRhdGE6YW55ID0ge307XG4gICAgICAgIHZhciBrZXkgPSAnJztcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGxpbmVzID0gdGhpcy5tZHJhdy5zcGxpdCgnXFxuJykuZmlsdGVyKCh4KT0+eCk7XG5cbiAgICAgICAgZm9yIChsZXQgbGluZSBvZiBsaW5lcyl7XG4gICAgICAgICAgICBpZiAobGluZS5zdGFydHNXaXRoKCcjJykpe1xuICAgICAgICAgICAgICAgIGtleSA9IGxpbmUuc3BsaXQoJyAnKVsxXTtcbiAgICAgICAgICAgICAgICBkYXRhW2tleV0gPSBbXTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChrZXkpe1xuICAgICAgICAgICAgICAgIGRhdGFba2V5XS5wdXNoKGxpbmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuXG4gICAgICAgIGZvciAobGV0IGxpbmUgb2YgZGF0YVsnQWJvdXQnXSl7XG4gICAgICAgICAgICBpZiAobGluZS5zdGFydHNXaXRoKCctIFRpdGxlOicpKXtcbiAgICAgICAgICAgICAgICB0aGlzLnRpdGxlID0gbGluZS5yZXBsYWNlKCctIFRpdGxlOicsJycpLnRyaW0oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGxpbmUuc3RhcnRzV2l0aCgnLSBEYXRlOicpKXtcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGUgPSBsaW5lLnJlcGxhY2UoJy0gRGF0ZTonLCcnKS50cmltKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChsaW5lLnN0YXJ0c1dpdGgoJy0gUGxhY2U6Jykpe1xuICAgICAgICAgICAgICAgIHRoaXMucGxhY2UgPSBsaW5lLnJlcGxhY2UoJy0gUGxhY2U6JywnJykudHJpbSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobGluZS5zdGFydHNXaXRoKCctIE1lZGl1bTonKSl7XG4gICAgICAgICAgICAgICAgdGhpcy5tZWRpdW0gPSBsaW5lLnJlcGxhY2UoJy0gTWVkaXVtOicsJycpLnRyaW0oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGxpbmUuc3RhcnRzV2l0aCgnLSBEaW1lbnNpb25zOicpKXtcbiAgICAgICAgICAgICAgICB0aGlzLmRpbWVuc2lvbnMgPSBsaW5lLnJlcGxhY2UoJy0gRGltZW5zaW9uczonLCcnKS50cmltKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChsaW5lLnN0YXJ0c1dpdGgoJy0gTm86Jykpe1xuICAgICAgICAgICAgICAgIHRoaXMubm8gPSBsaW5lLnJlcGxhY2UoJy0gTm86JywnJykudHJpbSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobGluZS5zdGFydHNXaXRoKCctIERlc2NyaXB0aW9uOicpKXtcbiAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gbGluZS5yZXBsYWNlKCctIERlc2NyaXB0aW9uOicsJycpLnRyaW0oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGxpbmUuc3RhcnRzV2l0aCgnLSBUYWdzOicpKXtcbiAgICAgICAgICAgICAgICB0aGlzLnRhZ3MgPSBsaW5lLnJlcGxhY2UoJy0gVGFnczonLCcnKS50cmltKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGNsZWFuZWQgPSBkYXRhWydJbWFnZXMnXVswXS5yZXBsYWNlKCchW10oJywnJykucmVwbGFjZSgnKScsJycpO1xuICAgICAgICB0aGlzLnRodW1ibmFpbCA9IHBhdGguam9pbihpblJlbGF0aXZlUGF0aCwgY2xlYW5lZCk7XG4gICAgICAgIHRoaXMuZnVsbGltYWdlID0gdGhpcy50aHVtYm5haWw7XG4gICAgICAgIHRoaXMuaHRtbHBhdGggPSBpblJlbGF0aXZlSHRtbFBhdGg7XG4gICAgfVxuXG4gICAgZ2V0UmVwZWF0ZXJIdG1sKCl7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJpdGVtICR7dGhpcy50YWdzLnJlcGxhY2UoJyMnLCcnKX1cIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwaWNmcmFtZVwiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwib3ZlcmxheVwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImljb25cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIke3RoaXMudGh1bWJuYWlsfVwiIGRhdGEtdHlwZT1cInByZXR0eVBob3RvW2dhbGxlcnldXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXNlYXJjaCBpY29uLXZpZXdcIj48L2k+PC9hPlxuICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiaWNvblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiR7dGhpcy5odG1scGF0aH1cIj48aSBjbGFzcz1cImZhIGZhLWFsaWduLWp1c3RpZnkgZmEtZXh0ZXJuYWwtbGluayBpY29uLWluZm9cIj48L2k+PC9hPlxuICAgICAgICAgICAgICAgICAgICA8L3NwYW4+IFxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInBmX3RleHRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9qZWN0LW5hbWVcIj4ke3RoaXMudGl0bGV9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PkRhdGU6ICR7dGhpcy5kYXRlfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5QbGFjZTogJHt0aGlzLnBsYWNlfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5NZWRpdW06ICR7dGhpcy5kZXNjcmlwdGlvbn08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+RGltZW5zaW9uczogJHt0aGlzLmRpbWVuc2lvbnN9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2Pk5vOiAke3RoaXMubm99PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L3NwYW4+XG5cbiAgICAgICAgICAgICAgICA8aW1nIHNyYz1cIiR7dGhpcy5mdWxsaW1hZ2V9XCIgYWx0PVwiXCIgLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgYFxuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEtFeHBvcnQge1xuICAgIHNyY1BhdGg6c3RyaW5nID0gJyc7XG4gICAgZHN0UGF0aDpzdHJpbmcgPSAnJztcbiAgICB0cGxQYXRoOnN0cmluZyA9ICcnO1xuICAgIGNvbnN0cnVjdG9yKGluU3JjUGF0aDpzdHJpbmcsIGluVHBsUGF0aDpzdHJpbmcsIGluRHN0UGF0aDpzdHJpbmcpe1xuICAgICAgICB0aGlzLnNyY1BhdGggPSBpblNyY1BhdGgucmVwbGFjZShcIn5cIixvcy5ob21lZGlyKCkpO1xuICAgICAgICB0aGlzLmRzdFBhdGggPSBpbkRzdFBhdGgucmVwbGFjZShcIn5cIixvcy5ob21lZGlyKCkpO1xuICAgICAgICB0aGlzLnRwbFBhdGggPSBpblRwbFBhdGgucmVwbGFjZShcIn5cIixvcy5ob21lZGlyKCkpO1xuICAgIH1cblxuICAgIGFzeW5jIHN0YXJ0KCl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRXhwb3J0IFN0YXJ0ZWQuLi4uXCIpO1xuXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAgICAgLy8gR2VuZXJpY1xuICAgICAgICBjb25zdCBnZW5UcGxGaWxlUGF0aCA9IHBhdGguam9pbih0aGlzLnRwbFBhdGgsJ2dlbmVyaWMuaHRtbCcpO1xuICAgICAgICBjb25zdCBnZW5UZW1wbGF0ZUh0bWwgPSBhd2FpdCBmcy5wcm9taXNlcy5yZWFkRmlsZShnZW5UcGxGaWxlUGF0aCwndXRmLTgnKTtcbiAgICAgICAgXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAgICAgLy8gV29ya3NcbiAgICAgICAgLy8gMS4gR2F0aGVyIGFsbCBNZXRhIEluZm8gYW5kIEdlbmVyYXRlIHNpbmdsZSBUaHVtYm5haWwgR2FsbGVyeVxuICAgICAgICAvLyAyLiBHZW5lcmF0ZSBpbmRpdmlkdWFsIHBhZ2UgYW5kIGR1bXAgdGhlIC5odG1sIG5leHQgdG8gLm1kIGZpbGUuXG4gICAgICAgIC8vICAgIEluZGl2aWR1YWwgcGFnZSBzaG91bGQgY292ZXIgZnVsbCBodG1sIGNvbnZlcnNpb24gcGx1cyB5b3V0dWJlIG9yIGdsYiBcblxuICAgICAgICBjb25zdCB3b3JrU3JjUGF0aCA9IHBhdGguam9pbih0aGlzLnNyY1BhdGgsJ3dvcmtzJyk7XG4gICAgICAgIGNvbnN0IHdvcmtUcGxGaWxlUGF0aCA9IHBhdGguam9pbih0aGlzLnRwbFBhdGgsJ3dvcmtzLmh0bWwnKTtcbiAgICAgICAgY29uc3Qgd29ya0RzdEZpbGVQYXRoID0gcGF0aC5qb2luKHRoaXMuZHN0UGF0aCwnd29ya3MuaHRtbCcpOyAgICAgICAgXG5cbiAgICAgICAgbGV0IHJlcGVhdGVySHRtbEFyciA9IFtdO1xuICAgICAgICAvLyBXYWxrIGVhY2ggLm1kIGZpbGVzIGluIHdvcmtzXG4gICAgICAgIGZvciBhd2FpdCAoY29uc3QgbWRmaWxlUGF0aCBvZiB0aGlzLmdldEZpbGVzKHdvcmtTcmNQYXRoKSkge1xuICAgICAgICAgICAgY29uc3QgaHRtbEZpbGVQYXRoID0gbWRmaWxlUGF0aC5yZXBsYWNlKCcubWQnLCcuaHRtbCcpO1xuICAgICAgICAgICAgLy9jb25zdCBtZHJhdyA9IGF3YWl0IGZzLnByb21pc2VzLnJlYWRGaWxlKG1kZmlsZVBhdGgsJ3V0Zi04Jyk7XG4gICAgICAgICAgICAvLyBwcm9iYWJseSBJIGRvbid0IGhhdmUgdG8gY3JlYXRlIGFub3RoZXIgb2JqIGhlcmVcbiAgICAgICAgICAgIC8vY29uc3QgZ2VuSXRlbSA9IG5ldyBHZW5lcmljSXRlbShtZHJhdyk7XG5cbiAgICAgICAgICAgIC8vY29uc29sZS5sb2cobWRmaWxlUGF0aCk7XG4gICAgICAgICAgICAvLyBCdWlsZCB1cCB0aHVtYm5haWwgaHRtbCByZXBlYXRlclxuICAgICAgICAgICAgY29uc3QgY29udGVudHMgPSBhd2FpdCBmcy5wcm9taXNlcy5yZWFkRmlsZShtZGZpbGVQYXRoLCd1dGYtOCcpO1xuICAgICAgICAgICAgLy8gQ2FsY3VsYXRlIHJlbGF0aXZlIHBhdGggLSBmdWxsIHBhdGggbWludXMgd29ya2ZvbGRlci4gXG4gICAgICAgICAgICAvLyB0aGlzIGlzIG5lZWRlZCB0byBwb2ludCB0aHVtYm5haWwgaW1hZ2UgcGF0aCBmcm9tIHRoZSByb290IG9mIHdlYnNpdGUgdG8gd29ya3MvIC4uLiBmb2xkZXJcbiAgICAgICAgICAgIGNvbnN0IGRpcnBhdGggPSBwYXRoLmRpcm5hbWUobWRmaWxlUGF0aCk7XG4gICAgICAgICAgICBjb25zdCByZWxhdGl2ZVNyY0RpclBhdGggPSBkaXJwYXRoLnJlcGxhY2UodGhpcy5zcmNQYXRoLCcnKTtcbiAgICAgICAgICAgIGNvbnN0IHJlbGF0aXZlSHRtbFBhdGggPSBodG1sRmlsZVBhdGgucmVwbGFjZSh0aGlzLnNyY1BhdGgsJycpO1xuXG4gICAgICAgICAgICBjb25zdCBpdGVtID0gbmV3IEdhbGxlcnlJdGVtKGNvbnRlbnRzLCByZWxhdGl2ZVNyY0RpclBhdGgsIHJlbGF0aXZlSHRtbFBhdGgpOyBcbiAgICAgICAgICAgIHJlcGVhdGVySHRtbEFyci5wdXNoKGl0ZW0uZ2V0UmVwZWF0ZXJIdG1sKCkpO1xuXG4gICAgICAgICAgICAvLyBFYWNoIE1EIC0+IEhUTUxcbiAgICAgICAgICAgIGxldCBnZW5PdXRwdXRIdG1sID0gZ2VuVGVtcGxhdGVIdG1sLnJlcGxhY2UoLzwhLS0ge3t7Q09OVEVOVH19fSAtLT4vLGl0ZW0uZ2V0SHRtbCgpKTtcbiAgICAgICAgICAgIGdlbk91dHB1dEh0bWwgPSBnZW5PdXRwdXRIdG1sLnJlcGxhY2UoLzwhLS0ge3t7Q09QWVJJR0hUfX19IC0tPi9nLCdcdTAwQTkgQ29weXJpZ2h0ICcrKG5ldyBEYXRlKCkpLmdldEZ1bGxZZWFyKCkrJyAtIEtpaWNoaSBUYWtldWNoaScpO1xuICAgICAgICAgICAgZ2VuT3V0cHV0SHRtbCA9IGdlbk91dHB1dEh0bWwucmVwbGFjZSgvPCEtLSB7e3tDQVRFR09SWX19fSAtLT4vZywnV29ya3MnKTtcbiAgICAgICAgICAgIGdlbk91dHB1dEh0bWwgPSBnZW5PdXRwdXRIdG1sLnJlcGxhY2UoLzwhLS0ge3t7VElUTEV9fX0gLS0+L2csaXRlbS50aXRsZSk7XG4gICAgICAgICAgICBnZW5PdXRwdXRIdG1sID0gZ2VuT3V0cHV0SHRtbC5yZXBsYWNlKC88IS0tIHt7e1NVQlRJVExFfX19IC0tPi9nLGAoJHtpdGVtLmRhdGV9KWApO1xuICAgICAgICAgICAgYXdhaXQgZnMucHJvbWlzZXMud3JpdGVGaWxlKGh0bWxGaWxlUGF0aCxnZW5PdXRwdXRIdG1sKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHdvcmtzLmh0bWxcbiAgICAgICAgbGV0IHJlcGVhdGVySHRtbCA9IHJlcGVhdGVySHRtbEFyci5qb2luKCdcXG4nKTsgICAgICAgIFxuICAgICAgICBjb25zdCBnYWxsZXJ5VGVtcGxhdGVIdG1sID0gYXdhaXQgZnMucHJvbWlzZXMucmVhZEZpbGUod29ya1RwbEZpbGVQYXRoLCd1dGYtOCcpO1xuICAgICAgICBsZXQgZ2FsbGVyeU91dHB1dEh0bWwgPSBnYWxsZXJ5VGVtcGxhdGVIdG1sLnJlcGxhY2UoJzwhLS0ge3t7R0FMTEVSWX19fSAtLT4nLHJlcGVhdGVySHRtbCk7XG4gICAgICAgIGdhbGxlcnlPdXRwdXRIdG1sID0gZ2FsbGVyeU91dHB1dEh0bWwucmVwbGFjZSgnPCEtLSB7e3tDT1BZUklHSFR9fX0gLS0+JywnXHUwMEE5IENvcHlyaWdodCAnKyhuZXcgRGF0ZSgpKS5nZXRGdWxsWWVhcigpKycgLSBLaWljaGkgVGFrZXVjaGknKTtcbiAgICAgICAgYXdhaXQgZnMucHJvbWlzZXMud3JpdGVGaWxlKHdvcmtEc3RGaWxlUGF0aCxnYWxsZXJ5T3V0cHV0SHRtbCk7XG5cbiAgICAgICAgY29uc29sZS5sb2cod29ya0RzdEZpbGVQYXRoKVxuXG5cblxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAgICAgLy8gQXJ0aWNsZXNcbiAgICAgICAgY29uc3QgYXJ0aWNsZVNyY1BhdGggPSBwYXRoLmpvaW4odGhpcy5zcmNQYXRoLCdhcnRpY2xlcycpO1xuICAgICAgICBjb25zdCBhcnRpY2xlVHBsRmlsZVBhdGggPSBwYXRoLmpvaW4odGhpcy50cGxQYXRoLCdhcnRpY2xlcy5odG1sJyk7XG4gICAgICAgIGNvbnN0IGFydGljbGVEc3RGaWxlUGF0aCA9IHBhdGguam9pbih0aGlzLmRzdFBhdGgsJ2FydGljbGVzLmh0bWwnKTsgICBcbiAgICAgICAgbGV0IHJlcGVhdGVyQXJ0aWNsZUh0bWxBcnIgPSBbXTtcbiAgICAgICAgLy8gV2FsayBlYWNoIC5tZCBmaWxlcyBpbiB3b3Jrc1xuICAgICAgICBmb3IgYXdhaXQgKGNvbnN0IG1kZmlsZVBhdGggb2YgdGhpcy5nZXRGaWxlcyhhcnRpY2xlU3JjUGF0aCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGh0bWxGaWxlUGF0aCA9IG1kZmlsZVBhdGgucmVwbGFjZSgnLm1kJywnLmh0bWwnKTtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRlbnRzID0gYXdhaXQgZnMucHJvbWlzZXMucmVhZEZpbGUobWRmaWxlUGF0aCwndXRmLTgnKTtcbiAgICAgICAgICAgIC8vIENhbGN1bGF0ZSByZWxhdGl2ZSBwYXRoIC0gZnVsbCBwYXRoIG1pbnVzIHdvcmtmb2xkZXIuIFxuICAgICAgICAgICAgLy8gdGhpcyBpcyBuZWVkZWQgdG8gcG9pbnQgdGh1bWJuYWlsIGltYWdlIHBhdGggZnJvbSB0aGUgcm9vdCBvZiB3ZWJzaXRlIHRvIHdvcmtzLyAuLi4gZm9sZGVyXG4gICAgICAgICAgICBjb25zdCBkaXJwYXRoID0gcGF0aC5kaXJuYW1lKG1kZmlsZVBhdGgpO1xuICAgICAgICAgICAgY29uc3QgcmVsYXRpdmVTcmNEaXJQYXRoID0gZGlycGF0aC5yZXBsYWNlKHRoaXMuc3JjUGF0aCwnJyk7XG4gICAgICAgICAgICBjb25zdCByZWxhdGl2ZUh0bWxQYXRoID0gaHRtbEZpbGVQYXRoLnJlcGxhY2UodGhpcy5zcmNQYXRoLCcnKTtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBuZXcgQXJ0aWNsZUl0ZW0oY29udGVudHMscmVsYXRpdmVTcmNEaXJQYXRoLCByZWxhdGl2ZUh0bWxQYXRoKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gQnVpbGQgdXAgdGh1bWJuYWlsIGh0bWwgcmVwZWF0ZXIgICAgICAgICAgICBcbiAgICAgICAgICAgIHJlcGVhdGVyQXJ0aWNsZUh0bWxBcnIucHVzaChpdGVtLmdldFJlcGVhdGVySHRtbCgpKTtcblxuICAgICAgICAgICAgLy8gRWFjaCBNRCAtPiBIVE1MXG4gICAgICAgICAgICBsZXQgZ2VuT3V0cHV0SHRtbCA9IGdlblRlbXBsYXRlSHRtbC5yZXBsYWNlKC88IS0tIHt7e0NPTlRFTlR9fX0gLS0+LyxpdGVtLmdldEh0bWwoKSk7XG4gICAgICAgICAgICBnZW5PdXRwdXRIdG1sID0gZ2VuT3V0cHV0SHRtbC5yZXBsYWNlKC88IS0tIHt7e0NPUFlSSUdIVH19fSAtLT4vZywnXHUwMEE5IENvcHlyaWdodCAnKyhuZXcgRGF0ZSgpKS5nZXRGdWxsWWVhcigpKycgLSBLaWljaGkgVGFrZXVjaGknKTtcbiAgICAgICAgICAgIGdlbk91dHB1dEh0bWwgPSBnZW5PdXRwdXRIdG1sLnJlcGxhY2UoLzwhLS0ge3t7Q0FURUdPUll9fX0gLS0+L2csJ1dvcmtzJyk7XG4gICAgICAgICAgICBnZW5PdXRwdXRIdG1sID0gZ2VuT3V0cHV0SHRtbC5yZXBsYWNlKC88IS0tIHt7e1RJVExFfX19IC0tPi9nLGl0ZW0udGl0bGUpO1xuICAgICAgICAgICAgZ2VuT3V0cHV0SHRtbCA9IGdlbk91dHB1dEh0bWwucmVwbGFjZSgvPCEtLSB7e3tTVUJUSVRMRX19fSAtLT4vZyxgKCR7aXRlbS5nZXREYXRlU3RyKCl9KWApO1xuICAgICAgICAgICAgLy9nZW5PdXRwdXRIdG1sID0gZ2VuT3V0cHV0SHRtbC5yZXBsYWNlKC88IS0tIHt7e01EUkFXfX19IC0tPi9nLGAke2dlbkl0ZW0ubWRyYXd9YCk7IC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXJrbWFwL21hcmttYXAvdHJlZS9tYXN0ZXIvcGFja2FnZXMvbWFya21hcC1hdXRvbG9hZGVyXG4gICAgICAgICAgICBhd2FpdCBmcy5wcm9taXNlcy53cml0ZUZpbGUoaHRtbEZpbGVQYXRoLGdlbk91dHB1dEh0bWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gd29ya3MuaHRtbFxuICAgICAgICBjb25zdCByZXBlYXRlckFydGljbGVIdG1sID0gcmVwZWF0ZXJBcnRpY2xlSHRtbEFyci5qb2luKCdcXG4nKTsgICAgICAgIFxuICAgICAgICBjb25zdCBhcnRpY2xlVGVtcGxhdGVIdG1sID0gYXdhaXQgZnMucHJvbWlzZXMucmVhZEZpbGUoYXJ0aWNsZVRwbEZpbGVQYXRoLCd1dGYtOCcpO1xuICAgICAgICBsZXQgYXJ0aWNsZU91dHB1dEh0bWwgPSBhcnRpY2xlVGVtcGxhdGVIdG1sLnJlcGxhY2UoJzwhLS0ge3t7QVJUSUNMRVN9fX0gLS0+JyxyZXBlYXRlckFydGljbGVIdG1sKTtcbiAgICAgICAgYXJ0aWNsZU91dHB1dEh0bWwgPSBhcnRpY2xlT3V0cHV0SHRtbC5yZXBsYWNlKCc8IS0tIHt7e0NPUFlSSUdIVH19fSAtLT4nLCdcdTAwQTkgQ29weXJpZ2h0ICcrKG5ldyBEYXRlKCkpLmdldEZ1bGxZZWFyKCkrJyAtIEtpaWNoaSBUYWtldWNoaScpO1xuICAgICAgICBhd2FpdCBmcy5wcm9taXNlcy53cml0ZUZpbGUoYXJ0aWNsZURzdEZpbGVQYXRoLGFydGljbGVPdXRwdXRIdG1sKTtcblxuICAgICAgICBcblxuICAgICAgICBjb25zb2xlLmxvZyhcIkV4cG9ydCBFbmRlZC4uLi5cIik7XG4gICAgfVxuXG4gICAgYXN5bmMgKmdldEZpbGVzKGRpcjpzdHJpbmcpOmFueSB7XG4gICAgICAgIGNvbnN0IGRpcmVudHMgPSBhd2FpdCBmcy5wcm9taXNlcy5yZWFkZGlyKGRpciwgeyB3aXRoRmlsZVR5cGVzOiB0cnVlIH0pO1xuICAgICAgICBmb3IgKGNvbnN0IGRpcmVudCBvZiBkaXJlbnRzKSB7XG4gICAgICAgICAgY29uc3QgcmVzID0gcGF0aC5yZXNvbHZlKGRpciwgZGlyZW50Lm5hbWUpO1xuICAgICAgICAgIGlmIChkaXJlbnQuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICAgICAgeWllbGQqIHRoaXMuZ2V0RmlsZXMocmVzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZihkaXJlbnQubmFtZS5lbmRzV2l0aChcIi5tZFwiKSl7XG4gICAgICAgICAgICB5aWVsZCByZXM7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIGVsc2UgeyAvLyBkbyBub3RoaW5nIH0gXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBcbn0iLCAiLypcbiAqIEBsaWNlbnNlXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDExLTIwMTQsIENocmlzdG9waGVyIEplZmZyZXkuIChNSVQgTGljZW5zZWQpXG4gKiBodHRwczovL2dpdGh1Yi5jb20vY2hqai9tYXJrZWRcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTgtMjAyMSwgXHUwNDFBXHUwNDNFXHUwNDQxXHUwNDQyXHUwNDRGIFx1MDQyMlx1MDQ0MFx1MDQzNVx1MDQ0Mlx1MDQ0Rlx1MDQzQS4gKE1JVCBMaWNlbnNlZClcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS90cy1zdGFjay9tYXJrZG93blxuICovXG5cbmV4cG9ydCBjbGFzcyBFeHRlbmRSZWdleHAge1xuICBwcml2YXRlIHNvdXJjZTogc3RyaW5nO1xuICBwcml2YXRlIGZsYWdzOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IocmVnZXg6IFJlZ0V4cCwgZmxhZ3M6IHN0cmluZyA9ICcnKSB7XG4gICAgdGhpcy5zb3VyY2UgPSByZWdleC5zb3VyY2U7XG4gICAgdGhpcy5mbGFncyA9IGZsYWdzO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4dGVuZCByZWd1bGFyIGV4cHJlc3Npb24uXG4gICAqXG4gICAqIEBwYXJhbSBncm91cE5hbWUgUmVndWxhciBleHByZXNzaW9uIGZvciBzZWFyY2ggYSBncm91cCBuYW1lLlxuICAgKiBAcGFyYW0gZ3JvdXBSZWdleHAgUmVndWxhciBleHByZXNzaW9uIG9mIG5hbWVkIGdyb3VwLlxuICAgKi9cbiAgc2V0R3JvdXAoZ3JvdXBOYW1lOiBSZWdFeHAgfCBzdHJpbmcsIGdyb3VwUmVnZXhwOiBSZWdFeHAgfCBzdHJpbmcpOiB0aGlzIHtcbiAgICBsZXQgbmV3UmVnZXhwOiBzdHJpbmcgPSB0eXBlb2YgZ3JvdXBSZWdleHAgPT0gJ3N0cmluZycgPyBncm91cFJlZ2V4cCA6IGdyb3VwUmVnZXhwLnNvdXJjZTtcbiAgICBuZXdSZWdleHAgPSBuZXdSZWdleHAucmVwbGFjZSgvKF58W15cXFtdKVxcXi9nLCAnJDEnKTtcblxuICAgIC8vIEV4dGVuZCByZWdleHAuXG4gICAgdGhpcy5zb3VyY2UgPSB0aGlzLnNvdXJjZS5yZXBsYWNlKGdyb3VwTmFtZSwgbmV3UmVnZXhwKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgcmVzdWx0IG9mIGV4dGVuZGluZyBhIHJlZ3VsYXIgZXhwcmVzc2lvbi5cbiAgICovXG4gIGdldFJlZ2V4cCgpOiBSZWdFeHAge1xuICAgIHJldHVybiBuZXcgUmVnRXhwKHRoaXMuc291cmNlLCB0aGlzLmZsYWdzKTtcbiAgfVxufVxuIiwgIi8qKlxuICogQGxpY2Vuc2VcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTEtMjAxNCwgQ2hyaXN0b3BoZXIgSmVmZnJleS4gKE1JVCBMaWNlbnNlZClcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9jaGpqL21hcmtlZFxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxOC0yMDIxLCBcdTA0MUFcdTA0M0VcdTA0NDFcdTA0NDJcdTA0NEYgXHUwNDIyXHUwNDQwXHUwNDM1XHUwNDQyXHUwNDRGXHUwNDNBLiAoTUlUIExpY2Vuc2VkKVxuICogaHR0cHM6Ly9naXRodWIuY29tL3RzLXN0YWNrL21hcmtkb3duXG4gKi9cblxuaW1wb3J0IHsgUmVwbGFjZW1lbnRzIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcblxuY29uc3QgZXNjYXBlVGVzdCA9IC9bJjw+XCInXS87XG5jb25zdCBlc2NhcGVSZXBsYWNlID0gL1smPD5cIiddL2c7XG5jb25zdCByZXBsYWNlbWVudHM6IFJlcGxhY2VtZW50cyA9IHtcbiAgJyYnOiAnJmFtcDsnLFxuICAnPCc6ICcmbHQ7JyxcbiAgJz4nOiAnJmd0OycsXG4gICdcIic6ICcmcXVvdDsnLFxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6cXVvdGVtYXJrXG4gIFwiJ1wiOiAnJiMzOTsnLFxufTtcblxuY29uc3QgZXNjYXBlVGVzdE5vRW5jb2RlID0gL1s8PlwiJ118Jig/ISM/XFx3KzspLztcbmNvbnN0IGVzY2FwZVJlcGxhY2VOb0VuY29kZSA9IC9bPD5cIiddfCYoPyEjP1xcdys7KS9nO1xuXG5leHBvcnQgZnVuY3Rpb24gZXNjYXBlKGh0bWw6IHN0cmluZywgZW5jb2RlPzogYm9vbGVhbikge1xuICBpZiAoZW5jb2RlKSB7XG4gICAgaWYgKGVzY2FwZVRlc3QudGVzdChodG1sKSkge1xuICAgICAgcmV0dXJuIGh0bWwucmVwbGFjZShlc2NhcGVSZXBsYWNlLCAoY2g6IHN0cmluZykgPT4gcmVwbGFjZW1lbnRzW2NoXSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChlc2NhcGVUZXN0Tm9FbmNvZGUudGVzdChodG1sKSkge1xuICAgICAgcmV0dXJuIGh0bWwucmVwbGFjZShlc2NhcGVSZXBsYWNlTm9FbmNvZGUsIChjaDogc3RyaW5nKSA9PiByZXBsYWNlbWVudHNbY2hdKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gaHRtbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVuZXNjYXBlKGh0bWw6IHN0cmluZykge1xuICAvLyBFeHBsaWNpdGx5IG1hdGNoIGRlY2ltYWwsIGhleCwgYW5kIG5hbWVkIEhUTUwgZW50aXRpZXNcbiAgcmV0dXJuIGh0bWwucmVwbGFjZSgvJigjKD86XFxkKyl8KD86I3hbMC05QS1GYS1mXSspfCg/OlxcdyspKTs/L2dpLCBmdW5jdGlvbiAoXywgbikge1xuICAgIG4gPSBuLnRvTG93ZXJDYXNlKCk7XG5cbiAgICBpZiAobiA9PT0gJ2NvbG9uJykge1xuICAgICAgcmV0dXJuICc6JztcbiAgICB9XG5cbiAgICBpZiAobi5jaGFyQXQoMCkgPT09ICcjJykge1xuICAgICAgcmV0dXJuIG4uY2hhckF0KDEpID09PSAneCdcbiAgICAgICAgPyBTdHJpbmcuZnJvbUNoYXJDb2RlKHBhcnNlSW50KG4uc3Vic3RyaW5nKDIpLCAxNikpXG4gICAgICAgIDogU3RyaW5nLmZyb21DaGFyQ29kZSgrbi5zdWJzdHJpbmcoMSkpO1xuICAgIH1cblxuICAgIHJldHVybiAnJztcbiAgfSk7XG59XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxOC0yMDIxLCBcdTA0MUFcdTA0M0VcdTA0NDFcdTA0NDJcdTA0NEYgXHUwNDIyXHUwNDQwXHUwNDM1XHUwNDQyXHUwNDRGXHUwNDNBLiAoTUlUIExpY2Vuc2VkKVxuICogaHR0cHM6Ly9naXRodWIuY29tL3RzLXN0YWNrL21hcmtkb3duXG4gKi9cblxuaW1wb3J0IHsgZXNjYXBlLCB1bmVzY2FwZSB9IGZyb20gJy4vaGVscGVycyc7XG5pbXBvcnQgeyBSZW5kZXJlciB9IGZyb20gJy4vcmVuZGVyZXInO1xuXG5leHBvcnQgaW50ZXJmYWNlIE9iaiB7XG4gIFtrZXk6IHN0cmluZ106IGFueTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSdWxlc0Jsb2NrQmFzZSB7XG4gIG5ld2xpbmU6IFJlZ0V4cDtcbiAgY29kZTogUmVnRXhwO1xuICBocjogUmVnRXhwO1xuICBoZWFkaW5nOiBSZWdFeHA7XG4gIGxoZWFkaW5nOiBSZWdFeHA7XG4gIGJsb2NrcXVvdGU6IFJlZ0V4cDtcbiAgbGlzdDogUmVnRXhwO1xuICBodG1sOiBSZWdFeHA7XG4gIGRlZjogUmVnRXhwO1xuICBwYXJhZ3JhcGg6IFJlZ0V4cDtcbiAgdGV4dDogUmVnRXhwO1xuICBidWxsZXQ6IFJlZ0V4cDtcbiAgLyoqXG4gICAqIExpc3QgaXRlbSAoPGxpPikuXG4gICAqL1xuICBpdGVtOiBSZWdFeHA7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUnVsZXNCbG9ja0dmbSBleHRlbmRzIFJ1bGVzQmxvY2tCYXNlIHtcbiAgZmVuY2VzOiBSZWdFeHA7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUnVsZXNCbG9ja1RhYmxlcyBleHRlbmRzIFJ1bGVzQmxvY2tHZm0ge1xuICBucHRhYmxlOiBSZWdFeHA7XG4gIHRhYmxlOiBSZWdFeHA7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGluayB7XG4gIGhyZWY6IHN0cmluZztcbiAgdGl0bGU6IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBMaW5rcyB7XG4gIFtrZXk6IHN0cmluZ106IExpbms7XG59XG5cbmV4cG9ydCBlbnVtIFRva2VuVHlwZSB7XG4gIHNwYWNlID0gMSxcbiAgdGV4dCxcbiAgcGFyYWdyYXBoLFxuICBoZWFkaW5nLFxuICBsaXN0U3RhcnQsXG4gIGxpc3RFbmQsXG4gIGxvb3NlSXRlbVN0YXJ0LFxuICBsb29zZUl0ZW1FbmQsXG4gIGxpc3RJdGVtU3RhcnQsXG4gIGxpc3RJdGVtRW5kLFxuICBibG9ja3F1b3RlU3RhcnQsXG4gIGJsb2NrcXVvdGVFbmQsXG4gIGNvZGUsXG4gIHRhYmxlLFxuICBodG1sLFxuICBoclxufVxuXG5leHBvcnQgdHlwZSBBbGlnbiA9ICdjZW50ZXInIHwgJ2xlZnQnIHwgJ3JpZ2h0JztcblxuZXhwb3J0IGludGVyZmFjZSBUb2tlbiB7XG4gIHR5cGU6IG51bWJlciB8IHN0cmluZztcbiAgdGV4dD86IHN0cmluZztcbiAgbGFuZz86IHN0cmluZztcbiAgLyoqXG4gICAqIE1ldGFkYXRhIG9mIGdmbSBjb2RlLlxuICAgKi9cbiAgbWV0YT86IHN0cmluZztcbiAgZGVwdGg/OiBudW1iZXI7XG4gIGhlYWRlcj86IHN0cmluZ1tdO1xuICBhbGlnbj86IEFsaWduW107XG4gIGNlbGxzPzogc3RyaW5nW11bXTtcbiAgb3JkZXJlZD86IGJvb2xlYW47XG4gIHByZT86IGJvb2xlYW47XG4gIGVzY2FwZWQ/OiBib29sZWFuO1xuICBleGVjQXJyPzogUmVnRXhwRXhlY0FycmF5O1xuICAvKipcbiAgICogVXNlZCBmb3IgZGVidWdnaW5nLiBJZGVudGlmaWVzIHRoZSBsaW5lIG51bWJlciBpbiB0aGUgcmVzdWx0aW5nIEhUTUwgZmlsZS5cbiAgICovXG4gIGxpbmU/OiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUnVsZXNJbmxpbmVCYXNlIHtcbiAgZXNjYXBlOiBSZWdFeHA7XG4gIGF1dG9saW5rOiBSZWdFeHA7XG4gIHRhZzogUmVnRXhwO1xuICBsaW5rOiBSZWdFeHA7XG4gIHJlZmxpbms6IFJlZ0V4cDtcbiAgbm9saW5rOiBSZWdFeHA7XG4gIHN0cm9uZzogUmVnRXhwO1xuICBlbTogUmVnRXhwO1xuICBjb2RlOiBSZWdFeHA7XG4gIGJyOiBSZWdFeHA7XG4gIHRleHQ6IFJlZ0V4cDtcbiAgX2luc2lkZTogUmVnRXhwO1xuICBfaHJlZjogUmVnRXhwO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJ1bGVzSW5saW5lUGVkYW50aWMgZXh0ZW5kcyBSdWxlc0lubGluZUJhc2Uge31cblxuLyoqXG4gKiBHRk0gSW5saW5lIEdyYW1tYXJcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSdWxlc0lubGluZUdmbSBleHRlbmRzIFJ1bGVzSW5saW5lQmFzZSB7XG4gIHVybDogUmVnRXhwO1xuICBkZWw6IFJlZ0V4cDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSdWxlc0lubGluZUJyZWFrcyBleHRlbmRzIFJ1bGVzSW5saW5lR2ZtIHt9XG5cbmV4cG9ydCBjbGFzcyBNYXJrZWRPcHRpb25zIHtcbiAgZ2ZtPzogYm9vbGVhbiA9IHRydWU7XG4gIHRhYmxlcz86IGJvb2xlYW4gPSB0cnVlO1xuICBicmVha3M/OiBib29sZWFuID0gZmFsc2U7XG4gIHBlZGFudGljPzogYm9vbGVhbiA9IGZhbHNlO1xuICBzYW5pdGl6ZT86IGJvb2xlYW4gPSBmYWxzZTtcbiAgc2FuaXRpemVyPzogKHRleHQ6IHN0cmluZykgPT4gc3RyaW5nO1xuICBtYW5nbGU/OiBib29sZWFuID0gdHJ1ZTtcbiAgc21hcnRMaXN0cz86IGJvb2xlYW4gPSBmYWxzZTtcbiAgc2lsZW50PzogYm9vbGVhbiA9IGZhbHNlO1xuICAvKipcbiAgICogQHBhcmFtIGNvZGUgVGhlIHNlY3Rpb24gb2YgY29kZSB0byBwYXNzIHRvIHRoZSBoaWdobGlnaHRlci5cbiAgICogQHBhcmFtIGxhbmcgVGhlIHByb2dyYW1taW5nIGxhbmd1YWdlIHNwZWNpZmllZCBpbiB0aGUgY29kZSBibG9jay5cbiAgICovXG4gIGhpZ2hsaWdodD86IChjb2RlOiBzdHJpbmcsIGxhbmc/OiBzdHJpbmcpID0+IHN0cmluZztcbiAgbGFuZ1ByZWZpeD86IHN0cmluZyA9ICdsYW5nLSc7XG4gIHNtYXJ0eXBhbnRzPzogYm9vbGVhbiA9IGZhbHNlO1xuICBoZWFkZXJQcmVmaXg/OiBzdHJpbmcgPSAnJztcbiAgLyoqXG4gICAqIEFuIG9iamVjdCBjb250YWluaW5nIGZ1bmN0aW9ucyB0byByZW5kZXIgdG9rZW5zIHRvIEhUTUwuIERlZmF1bHQ6IGBuZXcgUmVuZGVyZXIoKWBcbiAgICovXG4gIHJlbmRlcmVyPzogUmVuZGVyZXI7XG4gIC8qKlxuICAgKiBTZWxmLWNsb3NlIHRoZSB0YWdzIGZvciB2b2lkIGVsZW1lbnRzICgmbHQ7YnIvJmd0OywgJmx0O2ltZy8mZ3Q7LCBldGMuKVxuICAgKiB3aXRoIGEgXCIvXCIgYXMgcmVxdWlyZWQgYnkgWEhUTUwuXG4gICAqL1xuICB4aHRtbD86IGJvb2xlYW4gPSBmYWxzZTtcbiAgLyoqXG4gICAqIFRoZSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgdXNpbmcgdG8gZXNjYXBlIEhUTUwgZW50aXRpZXMuXG4gICAqIEJ5IGRlZmF1bHQgdXNpbmcgaW5uZXIgaGVscGVyLlxuICAgKi9cbiAgZXNjYXBlPzogKGh0bWw6IHN0cmluZywgZW5jb2RlPzogYm9vbGVhbikgPT4gc3RyaW5nID0gZXNjYXBlO1xuICAvKipcbiAgICogVGhlIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSB1c2luZyB0byB1bmVzY2FwZSBIVE1MIGVudGl0aWVzLlxuICAgKiBCeSBkZWZhdWx0IHVzaW5nIGlubmVyIGhlbHBlci5cbiAgICovXG4gIHVuZXNjYXBlPzogKGh0bWw6IHN0cmluZykgPT4gc3RyaW5nID0gdW5lc2NhcGU7XG4gIC8qKlxuICAgKiBJZiBzZXQgdG8gYHRydWVgLCBhbiBpbmxpbmUgdGV4dCB3aWxsIG5vdCBiZSB0YWtlbiBpbiBwYXJhZ3JhcGguXG4gICAqXG4gICAqIGBgYHRzXG4gICAqIC8vIGlzTm9QID09IGZhbHNlXG4gICAqIE1hcmtlZC5wYXJzZSgnc29tZSB0ZXh0Jyk7IC8vIHJldHVybnMgJzxwPnNvbWUgdGV4dDwvcD4nXG4gICAqXG4gICAqIE1hcmtlZC5zZXRPcHRpb25zKHtpc05vUDogdHJ1ZX0pO1xuICAgKlxuICAgKiBNYXJrZWQucGFyc2UoJ3NvbWUgdGV4dCcpOyAvLyByZXR1cm5zICdzb21lIHRleHQnXG4gICAqIGBgYFxuICAgKi9cbiAgaXNOb1A/OiBib29sZWFuO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIExleGVyUmV0dXJucyB7XG4gIHRva2VuczogVG9rZW5bXTtcbiAgbGlua3M6IExpbmtzO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIERlYnVnUmV0dXJucyBleHRlbmRzIExleGVyUmV0dXJucyB7XG4gIHJlc3VsdDogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJlcGxhY2VtZW50cyB7XG4gIFtrZXk6IHN0cmluZ106IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSdWxlc0lubGluZUNhbGxiYWNrIHtcbiAgcmVnZXhwPzogUmVnRXhwO1xuICBjb25kaXRpb24oKTogUmVnRXhwO1xuICB0b2tlbml6ZShleGVjQXJyOiBSZWdFeHBFeGVjQXJyYXkpOiB2b2lkO1xufVxuXG5leHBvcnQgdHlwZSBTaW1wbGVSZW5kZXJlciA9IChleGVjQXJyPzogUmVnRXhwRXhlY0FycmF5KSA9PiBzdHJpbmc7XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxMS0yMDE0LCBDaHJpc3RvcGhlciBKZWZmcmV5LiAoTUlUIExpY2Vuc2VkKVxuICogaHR0cHM6Ly9naXRodWIuY29tL2NoamovbWFya2VkXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE4LTIwMjEsIFx1MDQxQVx1MDQzRVx1MDQ0MVx1MDQ0Mlx1MDQ0RiBcdTA0MjJcdTA0NDBcdTA0MzVcdTA0NDJcdTA0NEZcdTA0M0EuIChNSVQgTGljZW5zZWQpXG4gKiBodHRwczovL2dpdGh1Yi5jb20vdHMtc3RhY2svbWFya2Rvd25cbiAqL1xuXG5pbXBvcnQgeyBBbGlnbiwgTWFya2VkT3B0aW9ucyB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBNYXJrZWQgfSBmcm9tICcuL21hcmtlZCc7XG5cbmV4cG9ydCBjbGFzcyBSZW5kZXJlciB7XG4gIHByb3RlY3RlZCBvcHRpb25zOiBNYXJrZWRPcHRpb25zO1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM/OiBNYXJrZWRPcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCBNYXJrZWQub3B0aW9ucztcbiAgfVxuXG4gIGNvZGUoY29kZTogc3RyaW5nLCBsYW5nPzogc3RyaW5nLCBlc2NhcGVkPzogYm9vbGVhbiwgbWV0YT86IHN0cmluZyk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5oaWdobGlnaHQpIHtcbiAgICAgIGNvbnN0IG91dCA9IHRoaXMub3B0aW9ucy5oaWdobGlnaHQoY29kZSwgbGFuZyk7XG5cbiAgICAgIGlmIChvdXQgIT0gbnVsbCAmJiBvdXQgIT09IGNvZGUpIHtcbiAgICAgICAgZXNjYXBlZCA9IHRydWU7XG4gICAgICAgIGNvZGUgPSBvdXQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgZXNjYXBlZENvZGUgPSAoZXNjYXBlZCA/IGNvZGUgOiB0aGlzLm9wdGlvbnMuZXNjYXBlKGNvZGUsIHRydWUpKTtcblxuICAgIGlmICghbGFuZykge1xuICAgICAgcmV0dXJuIGBcXG48cHJlPjxjb2RlPiR7ZXNjYXBlZENvZGV9XFxuPC9jb2RlPjwvcHJlPlxcbmA7XG4gICAgfVxuXG4gICAgY29uc3QgY2xhc3NOYW1lID0gdGhpcy5vcHRpb25zLmxhbmdQcmVmaXggKyB0aGlzLm9wdGlvbnMuZXNjYXBlKGxhbmcsIHRydWUpO1xuICAgIHJldHVybiBgXFxuPHByZT48Y29kZSBjbGFzcz1cIiR7Y2xhc3NOYW1lfVwiPiR7ZXNjYXBlZENvZGV9XFxuPC9jb2RlPjwvcHJlPlxcbmA7XG4gIH1cblxuICBibG9ja3F1b3RlKHF1b3RlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBgPGJsb2NrcXVvdGU+XFxuJHtxdW90ZX08L2Jsb2NrcXVvdGU+XFxuYDtcbiAgfVxuXG4gIGh0bWwoaHRtbDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gaHRtbDtcbiAgfVxuXG4gIGhlYWRpbmcodGV4dDogc3RyaW5nLCBsZXZlbDogbnVtYmVyLCByYXc6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgaWQ6IHN0cmluZyA9IHRoaXMub3B0aW9ucy5oZWFkZXJQcmVmaXggKyByYXcudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9bXlxcd10rL2csICctJyk7XG5cbiAgICByZXR1cm4gYDxoJHtsZXZlbH0gaWQ9XCIke2lkfVwiPiR7dGV4dH08L2gke2xldmVsfT5cXG5gO1xuICB9XG5cbiAgaHIoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLnhodG1sID8gJzxoci8+XFxuJyA6ICc8aHI+XFxuJztcbiAgfVxuXG4gIGxpc3QoYm9keTogc3RyaW5nLCBvcmRlcmVkPzogYm9vbGVhbik6IHN0cmluZyB7XG4gICAgY29uc3QgdHlwZSA9IG9yZGVyZWQgPyAnb2wnIDogJ3VsJztcblxuICAgIHJldHVybiBgXFxuPCR7dHlwZX0+XFxuJHtib2R5fTwvJHt0eXBlfT5cXG5gO1xuICB9XG5cbiAgbGlzdGl0ZW0odGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gJzxsaT4nICsgdGV4dCArICc8L2xpPlxcbic7XG4gIH1cblxuICBwYXJhZ3JhcGgodGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gJzxwPicgKyB0ZXh0ICsgJzwvcD5cXG4nO1xuICB9XG5cbiAgdGFibGUoaGVhZGVyOiBzdHJpbmcsIGJvZHk6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGBcbjx0YWJsZT5cbjx0aGVhZD5cbiR7aGVhZGVyfTwvdGhlYWQ+XG48dGJvZHk+XG4ke2JvZHl9PC90Ym9keT5cbjwvdGFibGU+XG5gO1xuICB9XG5cbiAgdGFibGVyb3coY29udGVudDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gJzx0cj5cXG4nICsgY29udGVudCArICc8L3RyPlxcbic7XG4gIH1cblxuICB0YWJsZWNlbGwoY29udGVudDogc3RyaW5nLCBmbGFnczogeyBoZWFkZXI/OiBib29sZWFuOyBhbGlnbj86IEFsaWduIH0pOiBzdHJpbmcge1xuICAgIGNvbnN0IHR5cGUgPSBmbGFncy5oZWFkZXIgPyAndGgnIDogJ3RkJztcbiAgICBjb25zdCB0YWcgPSBmbGFncy5hbGlnbiA/ICc8JyArIHR5cGUgKyAnIHN0eWxlPVwidGV4dC1hbGlnbjonICsgZmxhZ3MuYWxpZ24gKyAnXCI+JyA6ICc8JyArIHR5cGUgKyAnPic7XG4gICAgcmV0dXJuIHRhZyArIGNvbnRlbnQgKyAnPC8nICsgdHlwZSArICc+XFxuJztcbiAgfVxuXG4gIC8vICoqKiBJbmxpbmUgbGV2ZWwgcmVuZGVyZXIgbWV0aG9kcy4gKioqXG5cbiAgc3Ryb25nKHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuICc8c3Ryb25nPicgKyB0ZXh0ICsgJzwvc3Ryb25nPic7XG4gIH1cblxuICBlbSh0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiAnPGVtPicgKyB0ZXh0ICsgJzwvZW0+JztcbiAgfVxuXG4gIGNvZGVzcGFuKHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuICc8Y29kZT4nICsgdGV4dCArICc8L2NvZGU+JztcbiAgfVxuXG4gIGJyKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy54aHRtbCA/ICc8YnIvPicgOiAnPGJyPic7XG4gIH1cblxuICBkZWwodGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gJzxkZWw+JyArIHRleHQgKyAnPC9kZWw+JztcbiAgfVxuXG4gIGxpbmsoaHJlZjogc3RyaW5nLCB0aXRsZTogc3RyaW5nLCB0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuc2FuaXRpemUpIHtcbiAgICAgIGxldCBwcm90OiBzdHJpbmc7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHByb3QgPSBkZWNvZGVVUklDb21wb25lbnQodGhpcy5vcHRpb25zLnVuZXNjYXBlKGhyZWYpKVxuICAgICAgICAgIC5yZXBsYWNlKC9bXlxcdzpdL2csICcnKVxuICAgICAgICAgIC50b0xvd2VyQ2FzZSgpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgIH1cblxuICAgICAgaWYgKHByb3QuaW5kZXhPZignamF2YXNjcmlwdDonKSA9PT0gMCB8fCBwcm90LmluZGV4T2YoJ3Zic2NyaXB0OicpID09PSAwIHx8IHByb3QuaW5kZXhPZignZGF0YTonKSA9PT0gMCkge1xuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgb3V0ID0gJzxhIGhyZWY9XCInICsgaHJlZiArICdcIic7XG5cbiAgICBpZiAodGl0bGUpIHtcbiAgICAgIG91dCArPSAnIHRpdGxlPVwiJyArIHRpdGxlICsgJ1wiJztcbiAgICB9XG5cbiAgICBvdXQgKz0gJz4nICsgdGV4dCArICc8L2E+JztcblxuICAgIHJldHVybiBvdXQ7XG4gIH1cblxuICBpbWFnZShocmVmOiBzdHJpbmcsIHRpdGxlOiBzdHJpbmcsIHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgbGV0IG91dCA9ICc8aW1nIHNyYz1cIicgKyBocmVmICsgJ1wiIGFsdD1cIicgKyB0ZXh0ICsgJ1wiJztcblxuICAgIGlmICh0aXRsZSkge1xuICAgICAgb3V0ICs9ICcgdGl0bGU9XCInICsgdGl0bGUgKyAnXCInO1xuICAgIH1cblxuICAgIG91dCArPSB0aGlzLm9wdGlvbnMueGh0bWwgPyAnLz4nIDogJz4nO1xuXG4gICAgcmV0dXJuIG91dDtcbiAgfVxuXG4gIHRleHQodGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGV4dDtcbiAgfVxufVxuIiwgIi8qKlxuICogQGxpY2Vuc2VcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTEtMjAxNCwgQ2hyaXN0b3BoZXIgSmVmZnJleS4gKE1JVCBMaWNlbnNlZClcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9jaGpqL21hcmtlZFxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxOC0yMDIxLCBcdTA0MUFcdTA0M0VcdTA0NDFcdTA0NDJcdTA0NEYgXHUwNDIyXHUwNDQwXHUwNDM1XHUwNDQyXHUwNDRGXHUwNDNBLiAoTUlUIExpY2Vuc2VkKVxuICogaHR0cHM6Ly9naXRodWIuY29tL3RzLXN0YWNrL21hcmtkb3duXG4gKi9cblxuaW1wb3J0IHsgRXh0ZW5kUmVnZXhwIH0gZnJvbSAnLi9leHRlbmQtcmVnZXhwJztcbmltcG9ydCB7XG4gIExpbmssXG4gIExpbmtzLFxuICBNYXJrZWRPcHRpb25zLFxuICBSdWxlc0lubGluZUJhc2UsXG4gIFJ1bGVzSW5saW5lQnJlYWtzLFxuICBSdWxlc0lubGluZUNhbGxiYWNrLFxuICBSdWxlc0lubGluZUdmbSxcbiAgUnVsZXNJbmxpbmVQZWRhbnRpYyxcbn0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7IE1hcmtlZCB9IGZyb20gJy4vbWFya2VkJztcbmltcG9ydCB7IFJlbmRlcmVyIH0gZnJvbSAnLi9yZW5kZXJlcic7XG5cbi8qKlxuICogSW5saW5lIExleGVyICYgQ29tcGlsZXIuXG4gKi9cbmV4cG9ydCBjbGFzcyBJbmxpbmVMZXhlciB7XG4gIHByb3RlY3RlZCBzdGF0aWMgcnVsZXNCYXNlOiBSdWxlc0lubGluZUJhc2UgPSBudWxsO1xuICAvKipcbiAgICogUGVkYW50aWMgSW5saW5lIEdyYW1tYXIuXG4gICAqL1xuICBwcm90ZWN0ZWQgc3RhdGljIHJ1bGVzUGVkYW50aWM6IFJ1bGVzSW5saW5lUGVkYW50aWMgPSBudWxsO1xuICAvKipcbiAgICogR0ZNIElubGluZSBHcmFtbWFyXG4gICAqL1xuICBwcm90ZWN0ZWQgc3RhdGljIHJ1bGVzR2ZtOiBSdWxlc0lubGluZUdmbSA9IG51bGw7XG4gIC8qKlxuICAgKiBHRk0gKyBMaW5lIEJyZWFrcyBJbmxpbmUgR3JhbW1hci5cbiAgICovXG4gIHByb3RlY3RlZCBzdGF0aWMgcnVsZXNCcmVha3M6IFJ1bGVzSW5saW5lQnJlYWtzID0gbnVsbDtcbiAgcHJvdGVjdGVkIHJ1bGVzOiBSdWxlc0lubGluZUJhc2UgfCBSdWxlc0lubGluZVBlZGFudGljIHwgUnVsZXNJbmxpbmVHZm0gfCBSdWxlc0lubGluZUJyZWFrcztcbiAgcHJvdGVjdGVkIHJlbmRlcmVyOiBSZW5kZXJlcjtcbiAgcHJvdGVjdGVkIGluTGluazogYm9vbGVhbjtcbiAgcHJvdGVjdGVkIGhhc1J1bGVzR2ZtOiBib29sZWFuO1xuICBwcm90ZWN0ZWQgcnVsZUNhbGxiYWNrczogUnVsZXNJbmxpbmVDYWxsYmFja1tdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBzdGF0aWNUaGlzOiB0eXBlb2YgSW5saW5lTGV4ZXIsXG4gICAgcHJvdGVjdGVkIGxpbmtzOiBMaW5rcyxcbiAgICBwcm90ZWN0ZWQgb3B0aW9uczogTWFya2VkT3B0aW9ucyA9IE1hcmtlZC5vcHRpb25zLFxuICAgIHJlbmRlcmVyPzogUmVuZGVyZXJcbiAgKSB7XG4gICAgdGhpcy5yZW5kZXJlciA9IHJlbmRlcmVyIHx8IHRoaXMub3B0aW9ucy5yZW5kZXJlciB8fCBuZXcgUmVuZGVyZXIodGhpcy5vcHRpb25zKTtcblxuICAgIGlmICghdGhpcy5saW5rcykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbmxpbmVMZXhlciByZXF1aXJlcyAnbGlua3MnIHBhcmFtZXRlci5gKTtcbiAgICB9XG5cbiAgICB0aGlzLnNldFJ1bGVzKCk7XG4gIH1cblxuICAvKipcbiAgICogU3RhdGljIExleGluZy9Db21waWxpbmcgTWV0aG9kLlxuICAgKi9cbiAgc3RhdGljIG91dHB1dChzcmM6IHN0cmluZywgbGlua3M6IExpbmtzLCBvcHRpb25zOiBNYXJrZWRPcHRpb25zKTogc3RyaW5nIHtcbiAgICBjb25zdCBpbmxpbmVMZXhlciA9IG5ldyB0aGlzKHRoaXMsIGxpbmtzLCBvcHRpb25zKTtcbiAgICByZXR1cm4gaW5saW5lTGV4ZXIub3V0cHV0KHNyYyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgc3RhdGljIGdldFJ1bGVzQmFzZSgpOiBSdWxlc0lubGluZUJhc2Uge1xuICAgIGlmICh0aGlzLnJ1bGVzQmFzZSkge1xuICAgICAgcmV0dXJuIHRoaXMucnVsZXNCYXNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIElubGluZS1MZXZlbCBHcmFtbWFyLlxuICAgICAqL1xuICAgIGNvbnN0IGJhc2U6IFJ1bGVzSW5saW5lQmFzZSA9IHtcbiAgICAgIGVzY2FwZTogL15cXFxcKFtcXFxcYCp7fVxcW1xcXSgpIytcXC0uIV8+XSkvLFxuICAgICAgYXV0b2xpbms6IC9ePChbXiA8Pl0rKEB8OlxcLylbXiA8Pl0rKT4vLFxuICAgICAgdGFnOiAvXjwhLS1bXFxzXFxTXSo/LS0+fF48XFwvP1xcdysoPzpcIlteXCJdKlwifCdbXiddKid8W148J1wiPl0pKj8+LyxcbiAgICAgIGxpbms6IC9eIT9cXFsoaW5zaWRlKVxcXVxcKGhyZWZcXCkvLFxuICAgICAgcmVmbGluazogL14hP1xcWyhpbnNpZGUpXFxdXFxzKlxcWyhbXlxcXV0qKVxcXS8sXG4gICAgICBub2xpbms6IC9eIT9cXFsoKD86XFxbW15cXF1dKlxcXXxbXlxcW1xcXV0pKilcXF0vLFxuICAgICAgc3Ryb25nOiAvXl9fKFtcXHNcXFNdKz8pX18oPyFfKXxeXFwqXFwqKFtcXHNcXFNdKz8pXFwqXFwqKD8hXFwqKS8sXG4gICAgICBlbTogL15cXGJfKCg/OlteX118X18pKz8pX1xcYnxeXFwqKCg/OlxcKlxcKnxbXFxzXFxTXSkrPylcXCooPyFcXCopLyxcbiAgICAgIGNvZGU6IC9eKGArKShbXFxzXFxTXSo/W15gXSlcXDEoPyFgKS8sXG4gICAgICBicjogL14gezIsfVxcbig/IVxccyokKS8sXG4gICAgICB0ZXh0OiAvXltcXHNcXFNdKz8oPz1bXFxcXDwhXFxbXypgXXwgezIsfVxcbnwkKS8sXG4gICAgICBfaW5zaWRlOiAvKD86XFxbW15cXF1dKlxcXXxbXlxcW1xcXV18XFxdKD89W15cXFtdKlxcXSkpKi8sXG4gICAgICBfaHJlZjogL1xccyo8PyhbXFxzXFxTXSo/KT4/KD86XFxzK1snXCJdKFtcXHNcXFNdKj8pWydcIl0pP1xccyovLFxuICAgIH07XG5cbiAgICBiYXNlLmxpbmsgPSBuZXcgRXh0ZW5kUmVnZXhwKGJhc2UubGluaykuc2V0R3JvdXAoJ2luc2lkZScsIGJhc2UuX2luc2lkZSkuc2V0R3JvdXAoJ2hyZWYnLCBiYXNlLl9ocmVmKS5nZXRSZWdleHAoKTtcblxuICAgIGJhc2UucmVmbGluayA9IG5ldyBFeHRlbmRSZWdleHAoYmFzZS5yZWZsaW5rKS5zZXRHcm91cCgnaW5zaWRlJywgYmFzZS5faW5zaWRlKS5nZXRSZWdleHAoKTtcblxuICAgIHJldHVybiAodGhpcy5ydWxlc0Jhc2UgPSBiYXNlKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzdGF0aWMgZ2V0UnVsZXNQZWRhbnRpYygpOiBSdWxlc0lubGluZVBlZGFudGljIHtcbiAgICBpZiAodGhpcy5ydWxlc1BlZGFudGljKSB7XG4gICAgICByZXR1cm4gdGhpcy5ydWxlc1BlZGFudGljO1xuICAgIH1cblxuICAgIHJldHVybiAodGhpcy5ydWxlc1BlZGFudGljID0ge1xuICAgICAgLi4udGhpcy5nZXRSdWxlc0Jhc2UoKSxcbiAgICAgIC4uLntcbiAgICAgICAgc3Ryb25nOiAvXl9fKD89XFxTKShbXFxzXFxTXSo/XFxTKV9fKD8hXyl8XlxcKlxcKig/PVxcUykoW1xcc1xcU10qP1xcUylcXCpcXCooPyFcXCopLyxcbiAgICAgICAgZW06IC9eXyg/PVxcUykoW1xcc1xcU10qP1xcUylfKD8hXyl8XlxcKig/PVxcUykoW1xcc1xcU10qP1xcUylcXCooPyFcXCopLyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgc3RhdGljIGdldFJ1bGVzR2ZtKCk6IFJ1bGVzSW5saW5lR2ZtIHtcbiAgICBpZiAodGhpcy5ydWxlc0dmbSkge1xuICAgICAgcmV0dXJuIHRoaXMucnVsZXNHZm07XG4gICAgfVxuXG4gICAgY29uc3QgYmFzZSA9IHRoaXMuZ2V0UnVsZXNCYXNlKCk7XG5cbiAgICBjb25zdCBlc2NhcGUgPSBuZXcgRXh0ZW5kUmVnZXhwKGJhc2UuZXNjYXBlKS5zZXRHcm91cCgnXSknLCAnfnxdKScpLmdldFJlZ2V4cCgpO1xuXG4gICAgY29uc3QgdGV4dCA9IG5ldyBFeHRlbmRSZWdleHAoYmFzZS50ZXh0KS5zZXRHcm91cCgnXXwnLCAnfl18Jykuc2V0R3JvdXAoJ3wnLCAnfGh0dHBzPzovL3wnKS5nZXRSZWdleHAoKTtcblxuICAgIHJldHVybiAodGhpcy5ydWxlc0dmbSA9IHtcbiAgICAgIC4uLmJhc2UsXG4gICAgICAuLi57XG4gICAgICAgIGVzY2FwZSxcbiAgICAgICAgdXJsOiAvXihodHRwcz86XFwvXFwvW15cXHM8XStbXjwuLDo7XCInKVxcXVxcc10pLyxcbiAgICAgICAgZGVsOiAvXn5+KD89XFxTKShbXFxzXFxTXSo/XFxTKX5+LyxcbiAgICAgICAgdGV4dCxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgc3RhdGljIGdldFJ1bGVzQnJlYWtzKCk6IFJ1bGVzSW5saW5lQnJlYWtzIHtcbiAgICBpZiAodGhpcy5ydWxlc0JyZWFrcykge1xuICAgICAgcmV0dXJuIHRoaXMucnVsZXNCcmVha3M7XG4gICAgfVxuXG4gICAgY29uc3QgaW5saW5lID0gdGhpcy5nZXRSdWxlc0dmbSgpO1xuICAgIGNvbnN0IGdmbSA9IHRoaXMuZ2V0UnVsZXNHZm0oKTtcblxuICAgIHJldHVybiAodGhpcy5ydWxlc0JyZWFrcyA9IHtcbiAgICAgIC4uLmdmbSxcbiAgICAgIC4uLntcbiAgICAgICAgYnI6IG5ldyBFeHRlbmRSZWdleHAoaW5saW5lLmJyKS5zZXRHcm91cCgnezIsfScsICcqJykuZ2V0UmVnZXhwKCksXG4gICAgICAgIHRleHQ6IG5ldyBFeHRlbmRSZWdleHAoZ2ZtLnRleHQpLnNldEdyb3VwKCd7Mix9JywgJyonKS5nZXRSZWdleHAoKSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgc2V0UnVsZXMoKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5nZm0pIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuYnJlYWtzKSB7XG4gICAgICAgIHRoaXMucnVsZXMgPSB0aGlzLnN0YXRpY1RoaXMuZ2V0UnVsZXNCcmVha3MoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucnVsZXMgPSB0aGlzLnN0YXRpY1RoaXMuZ2V0UnVsZXNHZm0oKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ucy5wZWRhbnRpYykge1xuICAgICAgdGhpcy5ydWxlcyA9IHRoaXMuc3RhdGljVGhpcy5nZXRSdWxlc1BlZGFudGljKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucnVsZXMgPSB0aGlzLnN0YXRpY1RoaXMuZ2V0UnVsZXNCYXNlKCk7XG4gICAgfVxuXG4gICAgdGhpcy5oYXNSdWxlc0dmbSA9ICh0aGlzLnJ1bGVzIGFzIFJ1bGVzSW5saW5lR2ZtKS51cmwgIT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBMZXhpbmcvQ29tcGlsaW5nLlxuICAgKi9cbiAgb3V0cHV0KG5leHRQYXJ0OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIG5leHRQYXJ0ID0gbmV4dFBhcnQ7XG4gICAgbGV0IGV4ZWNBcnI6IFJlZ0V4cEV4ZWNBcnJheTtcbiAgICBsZXQgb3V0ID0gJyc7XG5cbiAgICB3aGlsZSAobmV4dFBhcnQpIHtcbiAgICAgIC8vIGVzY2FwZVxuICAgICAgaWYgKChleGVjQXJyID0gdGhpcy5ydWxlcy5lc2NhcGUuZXhlYyhuZXh0UGFydCkpKSB7XG4gICAgICAgIG5leHRQYXJ0ID0gbmV4dFBhcnQuc3Vic3RyaW5nKGV4ZWNBcnJbMF0ubGVuZ3RoKTtcbiAgICAgICAgb3V0ICs9IGV4ZWNBcnJbMV07XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBhdXRvbGlua1xuICAgICAgaWYgKChleGVjQXJyID0gdGhpcy5ydWxlcy5hdXRvbGluay5leGVjKG5leHRQYXJ0KSkpIHtcbiAgICAgICAgbGV0IHRleHQ6IHN0cmluZztcbiAgICAgICAgbGV0IGhyZWY6IHN0cmluZztcbiAgICAgICAgbmV4dFBhcnQgPSBuZXh0UGFydC5zdWJzdHJpbmcoZXhlY0FyclswXS5sZW5ndGgpO1xuXG4gICAgICAgIGlmIChleGVjQXJyWzJdID09PSAnQCcpIHtcbiAgICAgICAgICB0ZXh0ID0gdGhpcy5vcHRpb25zLmVzY2FwZShcbiAgICAgICAgICAgIGV4ZWNBcnJbMV0uY2hhckF0KDYpID09PSAnOicgPyB0aGlzLm1hbmdsZShleGVjQXJyWzFdLnN1YnN0cmluZyg3KSkgOiB0aGlzLm1hbmdsZShleGVjQXJyWzFdKVxuICAgICAgICAgICk7XG4gICAgICAgICAgaHJlZiA9IHRoaXMubWFuZ2xlKCdtYWlsdG86JykgKyB0ZXh0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRleHQgPSB0aGlzLm9wdGlvbnMuZXNjYXBlKGV4ZWNBcnJbMV0pO1xuICAgICAgICAgIGhyZWYgPSB0ZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgb3V0ICs9IHRoaXMucmVuZGVyZXIubGluayhocmVmLCBudWxsLCB0ZXh0KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIHVybCAoZ2ZtKVxuICAgICAgaWYgKCF0aGlzLmluTGluayAmJiB0aGlzLmhhc1J1bGVzR2ZtICYmIChleGVjQXJyID0gKHRoaXMucnVsZXMgYXMgUnVsZXNJbmxpbmVHZm0pLnVybC5leGVjKG5leHRQYXJ0KSkpIHtcbiAgICAgICAgbGV0IHRleHQ6IHN0cmluZztcbiAgICAgICAgbGV0IGhyZWY6IHN0cmluZztcbiAgICAgICAgbmV4dFBhcnQgPSBuZXh0UGFydC5zdWJzdHJpbmcoZXhlY0FyclswXS5sZW5ndGgpO1xuICAgICAgICB0ZXh0ID0gdGhpcy5vcHRpb25zLmVzY2FwZShleGVjQXJyWzFdKTtcbiAgICAgICAgaHJlZiA9IHRleHQ7XG4gICAgICAgIG91dCArPSB0aGlzLnJlbmRlcmVyLmxpbmsoaHJlZiwgbnVsbCwgdGV4dCk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyB0YWdcbiAgICAgIGlmICgoZXhlY0FyciA9IHRoaXMucnVsZXMudGFnLmV4ZWMobmV4dFBhcnQpKSkge1xuICAgICAgICBpZiAoIXRoaXMuaW5MaW5rICYmIC9ePGEgL2kudGVzdChleGVjQXJyWzBdKSkge1xuICAgICAgICAgIHRoaXMuaW5MaW5rID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmluTGluayAmJiAvXjxcXC9hPi9pLnRlc3QoZXhlY0FyclswXSkpIHtcbiAgICAgICAgICB0aGlzLmluTGluayA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgbmV4dFBhcnQgPSBuZXh0UGFydC5zdWJzdHJpbmcoZXhlY0FyclswXS5sZW5ndGgpO1xuXG4gICAgICAgIG91dCArPSB0aGlzLm9wdGlvbnMuc2FuaXRpemVcbiAgICAgICAgICA/IHRoaXMub3B0aW9ucy5zYW5pdGl6ZXJcbiAgICAgICAgICAgID8gdGhpcy5vcHRpb25zLnNhbml0aXplcihleGVjQXJyWzBdKVxuICAgICAgICAgICAgOiB0aGlzLm9wdGlvbnMuZXNjYXBlKGV4ZWNBcnJbMF0pXG4gICAgICAgICAgOiBleGVjQXJyWzBdO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gbGlua1xuICAgICAgaWYgKChleGVjQXJyID0gdGhpcy5ydWxlcy5saW5rLmV4ZWMobmV4dFBhcnQpKSkge1xuICAgICAgICBuZXh0UGFydCA9IG5leHRQYXJ0LnN1YnN0cmluZyhleGVjQXJyWzBdLmxlbmd0aCk7XG4gICAgICAgIHRoaXMuaW5MaW5rID0gdHJ1ZTtcblxuICAgICAgICBvdXQgKz0gdGhpcy5vdXRwdXRMaW5rKGV4ZWNBcnIsIHtcbiAgICAgICAgICBocmVmOiBleGVjQXJyWzJdLFxuICAgICAgICAgIHRpdGxlOiBleGVjQXJyWzNdLFxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmluTGluayA9IGZhbHNlO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gcmVmbGluaywgbm9saW5rXG4gICAgICBpZiAoKGV4ZWNBcnIgPSB0aGlzLnJ1bGVzLnJlZmxpbmsuZXhlYyhuZXh0UGFydCkpIHx8IChleGVjQXJyID0gdGhpcy5ydWxlcy5ub2xpbmsuZXhlYyhuZXh0UGFydCkpKSB7XG4gICAgICAgIG5leHRQYXJ0ID0gbmV4dFBhcnQuc3Vic3RyaW5nKGV4ZWNBcnJbMF0ubGVuZ3RoKTtcbiAgICAgICAgY29uc3Qga2V5TGluayA9IChleGVjQXJyWzJdIHx8IGV4ZWNBcnJbMV0pLnJlcGxhY2UoL1xccysvZywgJyAnKTtcbiAgICAgICAgY29uc3QgbGluayA9IHRoaXMubGlua3Nba2V5TGluay50b0xvd2VyQ2FzZSgpXTtcblxuICAgICAgICBpZiAoIWxpbmsgfHwgIWxpbmsuaHJlZikge1xuICAgICAgICAgIG91dCArPSBleGVjQXJyWzBdLmNoYXJBdCgwKTtcbiAgICAgICAgICBuZXh0UGFydCA9IGV4ZWNBcnJbMF0uc3Vic3RyaW5nKDEpICsgbmV4dFBhcnQ7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmluTGluayA9IHRydWU7XG4gICAgICAgIG91dCArPSB0aGlzLm91dHB1dExpbmsoZXhlY0FyciwgbGluayk7XG4gICAgICAgIHRoaXMuaW5MaW5rID0gZmFsc2U7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBzdHJvbmdcbiAgICAgIGlmICgoZXhlY0FyciA9IHRoaXMucnVsZXMuc3Ryb25nLmV4ZWMobmV4dFBhcnQpKSkge1xuICAgICAgICBuZXh0UGFydCA9IG5leHRQYXJ0LnN1YnN0cmluZyhleGVjQXJyWzBdLmxlbmd0aCk7XG4gICAgICAgIG91dCArPSB0aGlzLnJlbmRlcmVyLnN0cm9uZyh0aGlzLm91dHB1dChleGVjQXJyWzJdIHx8IGV4ZWNBcnJbMV0pKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIGVtXG4gICAgICBpZiAoKGV4ZWNBcnIgPSB0aGlzLnJ1bGVzLmVtLmV4ZWMobmV4dFBhcnQpKSkge1xuICAgICAgICBuZXh0UGFydCA9IG5leHRQYXJ0LnN1YnN0cmluZyhleGVjQXJyWzBdLmxlbmd0aCk7XG4gICAgICAgIG91dCArPSB0aGlzLnJlbmRlcmVyLmVtKHRoaXMub3V0cHV0KGV4ZWNBcnJbMl0gfHwgZXhlY0FyclsxXSkpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gY29kZVxuICAgICAgaWYgKChleGVjQXJyID0gdGhpcy5ydWxlcy5jb2RlLmV4ZWMobmV4dFBhcnQpKSkge1xuICAgICAgICBuZXh0UGFydCA9IG5leHRQYXJ0LnN1YnN0cmluZyhleGVjQXJyWzBdLmxlbmd0aCk7XG4gICAgICAgIG91dCArPSB0aGlzLnJlbmRlcmVyLmNvZGVzcGFuKHRoaXMub3B0aW9ucy5lc2NhcGUoZXhlY0FyclsyXS50cmltKCksIHRydWUpKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIGJyXG4gICAgICBpZiAoKGV4ZWNBcnIgPSB0aGlzLnJ1bGVzLmJyLmV4ZWMobmV4dFBhcnQpKSkge1xuICAgICAgICBuZXh0UGFydCA9IG5leHRQYXJ0LnN1YnN0cmluZyhleGVjQXJyWzBdLmxlbmd0aCk7XG4gICAgICAgIG91dCArPSB0aGlzLnJlbmRlcmVyLmJyKCk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBkZWwgKGdmbSlcbiAgICAgIGlmICh0aGlzLmhhc1J1bGVzR2ZtICYmIChleGVjQXJyID0gKHRoaXMucnVsZXMgYXMgUnVsZXNJbmxpbmVHZm0pLmRlbC5leGVjKG5leHRQYXJ0KSkpIHtcbiAgICAgICAgbmV4dFBhcnQgPSBuZXh0UGFydC5zdWJzdHJpbmcoZXhlY0FyclswXS5sZW5ndGgpO1xuICAgICAgICBvdXQgKz0gdGhpcy5yZW5kZXJlci5kZWwodGhpcy5vdXRwdXQoZXhlY0FyclsxXSkpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gdGV4dFxuICAgICAgaWYgKChleGVjQXJyID0gdGhpcy5ydWxlcy50ZXh0LmV4ZWMobmV4dFBhcnQpKSkge1xuICAgICAgICBuZXh0UGFydCA9IG5leHRQYXJ0LnN1YnN0cmluZyhleGVjQXJyWzBdLmxlbmd0aCk7XG4gICAgICAgIG91dCArPSB0aGlzLnJlbmRlcmVyLnRleHQodGhpcy5vcHRpb25zLmVzY2FwZSh0aGlzLnNtYXJ0eXBhbnRzKGV4ZWNBcnJbMF0pKSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAobmV4dFBhcnQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbmZpbml0ZSBsb29wIG9uIGJ5dGU6ICcgKyBuZXh0UGFydC5jaGFyQ29kZUF0KDApKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gb3V0O1xuICB9XG5cbiAgLyoqXG4gICAqIENvbXBpbGUgTGluay5cbiAgICovXG4gIHByb3RlY3RlZCBvdXRwdXRMaW5rKGV4ZWNBcnI6IFJlZ0V4cEV4ZWNBcnJheSwgbGluazogTGluaykge1xuICAgIGNvbnN0IGhyZWYgPSB0aGlzLm9wdGlvbnMuZXNjYXBlKGxpbmsuaHJlZik7XG4gICAgY29uc3QgdGl0bGUgPSBsaW5rLnRpdGxlID8gdGhpcy5vcHRpb25zLmVzY2FwZShsaW5rLnRpdGxlKSA6IG51bGw7XG5cbiAgICByZXR1cm4gZXhlY0FyclswXS5jaGFyQXQoMCkgIT09ICchJ1xuICAgICAgPyB0aGlzLnJlbmRlcmVyLmxpbmsoaHJlZiwgdGl0bGUsIHRoaXMub3V0cHV0KGV4ZWNBcnJbMV0pKVxuICAgICAgOiB0aGlzLnJlbmRlcmVyLmltYWdlKGhyZWYsIHRpdGxlLCB0aGlzLm9wdGlvbnMuZXNjYXBlKGV4ZWNBcnJbMV0pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTbWFydHlwYW50cyBUcmFuc2Zvcm1hdGlvbnMuXG4gICAqL1xuICBwcm90ZWN0ZWQgc21hcnR5cGFudHModGV4dDogc3RyaW5nKSB7XG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuc21hcnR5cGFudHMpIHtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICB0ZXh0XG4gICAgICAgIC8vIGVtLWRhc2hlc1xuICAgICAgICAucmVwbGFjZSgvLS0tL2csICdcXHUyMDE0JylcbiAgICAgICAgLy8gZW4tZGFzaGVzXG4gICAgICAgIC5yZXBsYWNlKC8tLS9nLCAnXFx1MjAxMycpXG4gICAgICAgIC8vIG9wZW5pbmcgc2luZ2xlc1xuICAgICAgICAucmVwbGFjZSgvKF58Wy1cXHUyMDE0LyhcXFt7XCJcXHNdKScvZywgJyQxXFx1MjAxOCcpXG4gICAgICAgIC8vIGNsb3Npbmcgc2luZ2xlcyAmIGFwb3N0cm9waGVzXG4gICAgICAgIC5yZXBsYWNlKC8nL2csICdcXHUyMDE5JylcbiAgICAgICAgLy8gb3BlbmluZyBkb3VibGVzXG4gICAgICAgIC5yZXBsYWNlKC8oXnxbLVxcdTIwMTQvKFxcW3tcXHUyMDE4XFxzXSlcIi9nLCAnJDFcXHUyMDFjJylcbiAgICAgICAgLy8gY2xvc2luZyBkb3VibGVzXG4gICAgICAgIC5yZXBsYWNlKC9cIi9nLCAnXFx1MjAxZCcpXG4gICAgICAgIC8vIGVsbGlwc2VzXG4gICAgICAgIC5yZXBsYWNlKC9cXC57M30vZywgJ1xcdTIwMjYnKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogTWFuZ2xlIExpbmtzLlxuICAgKi9cbiAgcHJvdGVjdGVkIG1hbmdsZSh0ZXh0OiBzdHJpbmcpIHtcbiAgICBpZiAoIXRoaXMub3B0aW9ucy5tYW5nbGUpIHtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cblxuICAgIGxldCBvdXQgPSAnJztcbiAgICBjb25zdCBsZW5ndGggPSB0ZXh0Lmxlbmd0aDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBzdHI6IHN0cmluZztcblxuICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPiAwLjUpIHtcbiAgICAgICAgc3RyID0gJ3gnICsgdGV4dC5jaGFyQ29kZUF0KGkpLnRvU3RyaW5nKDE2KTtcbiAgICAgIH1cblxuICAgICAgb3V0ICs9ICcmIycgKyBzdHIgKyAnOyc7XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dDtcbiAgfVxufVxuIiwgIi8qKlxuICogQGxpY2Vuc2VcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTEtMjAxNCwgQ2hyaXN0b3BoZXIgSmVmZnJleS4gKE1JVCBMaWNlbnNlZClcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9jaGpqL21hcmtlZFxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxOC0yMDIxLCBcdTA0MUFcdTA0M0VcdTA0NDFcdTA0NDJcdTA0NEYgXHUwNDIyXHUwNDQwXHUwNDM1XHUwNDQyXHUwNDRGXHUwNDNBLiAoTUlUIExpY2Vuc2VkKVxuICogaHR0cHM6Ly9naXRodWIuY29tL3RzLXN0YWNrL21hcmtkb3duXG4gKi9cblxuaW1wb3J0IHsgSW5saW5lTGV4ZXIgfSBmcm9tICcuL2lubGluZS1sZXhlcic7XG5pbXBvcnQgeyBMaW5rcywgTWFya2VkT3B0aW9ucywgU2ltcGxlUmVuZGVyZXIsIFRva2VuLCBUb2tlblR5cGUgfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgTWFya2VkIH0gZnJvbSAnLi9tYXJrZWQnO1xuaW1wb3J0IHsgUmVuZGVyZXIgfSBmcm9tICcuL3JlbmRlcmVyJztcblxuLyoqXG4gKiBQYXJzaW5nICYgQ29tcGlsaW5nLlxuICovXG5leHBvcnQgY2xhc3MgUGFyc2VyIHtcbiAgc2ltcGxlUmVuZGVyZXJzOiBTaW1wbGVSZW5kZXJlcltdID0gW107XG4gIHByb3RlY3RlZCB0b2tlbnM6IFRva2VuW107XG4gIHByb3RlY3RlZCB0b2tlbjogVG9rZW47XG4gIHByb3RlY3RlZCBpbmxpbmVMZXhlcjogSW5saW5lTGV4ZXI7XG4gIHByb3RlY3RlZCBvcHRpb25zOiBNYXJrZWRPcHRpb25zO1xuICBwcm90ZWN0ZWQgcmVuZGVyZXI6IFJlbmRlcmVyO1xuICBwcm90ZWN0ZWQgbGluZTogbnVtYmVyID0gMDtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zPzogTWFya2VkT3B0aW9ucykge1xuICAgIHRoaXMudG9rZW5zID0gW107XG4gICAgdGhpcy50b2tlbiA9IG51bGw7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCBNYXJrZWQub3B0aW9ucztcbiAgICB0aGlzLnJlbmRlcmVyID0gdGhpcy5vcHRpb25zLnJlbmRlcmVyIHx8IG5ldyBSZW5kZXJlcih0aGlzLm9wdGlvbnMpO1xuICB9XG5cbiAgc3RhdGljIHBhcnNlKHRva2VuczogVG9rZW5bXSwgbGlua3M6IExpbmtzLCBvcHRpb25zPzogTWFya2VkT3B0aW9ucyk6IHN0cmluZyB7XG4gICAgY29uc3QgcGFyc2VyID0gbmV3IHRoaXMob3B0aW9ucyk7XG4gICAgcmV0dXJuIHBhcnNlci5wYXJzZShsaW5rcywgdG9rZW5zKTtcbiAgfVxuXG4gIHBhcnNlKGxpbmtzOiBMaW5rcywgdG9rZW5zOiBUb2tlbltdKSB7XG4gICAgdGhpcy5pbmxpbmVMZXhlciA9IG5ldyBJbmxpbmVMZXhlcihJbmxpbmVMZXhlciwgbGlua3MsIHRoaXMub3B0aW9ucywgdGhpcy5yZW5kZXJlcik7XG4gICAgdGhpcy50b2tlbnMgPSB0b2tlbnMucmV2ZXJzZSgpO1xuXG4gICAgbGV0IG91dCA9ICcnO1xuXG4gICAgd2hpbGUgKHRoaXMubmV4dCgpKSB7XG4gICAgICBvdXQgKz0gdGhpcy50b2soKTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0O1xuICB9XG5cbiAgZGVidWcobGlua3M6IExpbmtzLCB0b2tlbnM6IFRva2VuW10pIHtcbiAgICB0aGlzLmlubGluZUxleGVyID0gbmV3IElubGluZUxleGVyKElubGluZUxleGVyLCBsaW5rcywgdGhpcy5vcHRpb25zLCB0aGlzLnJlbmRlcmVyKTtcbiAgICB0aGlzLnRva2VucyA9IHRva2Vucy5yZXZlcnNlKCk7XG5cbiAgICBsZXQgb3V0ID0gJyc7XG5cbiAgICB3aGlsZSAodGhpcy5uZXh0KCkpIHtcbiAgICAgIGNvbnN0IG91dFRva2VuOiBzdHJpbmcgPSB0aGlzLnRvaygpO1xuICAgICAgdGhpcy50b2tlbi5saW5lID0gdGhpcy5saW5lICs9IG91dFRva2VuLnNwbGl0KCdcXG4nKS5sZW5ndGggLSAxO1xuICAgICAgb3V0ICs9IG91dFRva2VuO1xuICAgIH1cblxuICAgIHJldHVybiBvdXQ7XG4gIH1cblxuICBwcm90ZWN0ZWQgbmV4dCgpIHtcbiAgICByZXR1cm4gKHRoaXMudG9rZW4gPSB0aGlzLnRva2Vucy5wb3AoKSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0TmV4dEVsZW1lbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMudG9rZW5zW3RoaXMudG9rZW5zLmxlbmd0aCAtIDFdO1xuICB9XG5cbiAgcHJvdGVjdGVkIHBhcnNlVGV4dCgpIHtcbiAgICBsZXQgYm9keSA9IHRoaXMudG9rZW4udGV4dDtcbiAgICBsZXQgbmV4dEVsZW1lbnQ6IFRva2VuO1xuXG4gICAgd2hpbGUgKChuZXh0RWxlbWVudCA9IHRoaXMuZ2V0TmV4dEVsZW1lbnQoKSkgJiYgbmV4dEVsZW1lbnQudHlwZSA9PSBUb2tlblR5cGUudGV4dCkge1xuICAgICAgYm9keSArPSAnXFxuJyArIHRoaXMubmV4dCgpLnRleHQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaW5saW5lTGV4ZXIub3V0cHV0KGJvZHkpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHRvaygpIHtcbiAgICBzd2l0Y2ggKHRoaXMudG9rZW4udHlwZSkge1xuICAgICAgY2FzZSBUb2tlblR5cGUuc3BhY2U6IHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfVxuICAgICAgY2FzZSBUb2tlblR5cGUucGFyYWdyYXBoOiB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlcmVyLnBhcmFncmFwaCh0aGlzLmlubGluZUxleGVyLm91dHB1dCh0aGlzLnRva2VuLnRleHQpKTtcbiAgICAgIH1cbiAgICAgIGNhc2UgVG9rZW5UeXBlLnRleHQ6IHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5pc05vUCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlVGV4dCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLnJlbmRlcmVyLnBhcmFncmFwaCh0aGlzLnBhcnNlVGV4dCgpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY2FzZSBUb2tlblR5cGUuaGVhZGluZzoge1xuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJlci5oZWFkaW5nKHRoaXMuaW5saW5lTGV4ZXIub3V0cHV0KHRoaXMudG9rZW4udGV4dCksIHRoaXMudG9rZW4uZGVwdGgsIHRoaXMudG9rZW4udGV4dCk7XG4gICAgICB9XG4gICAgICBjYXNlIFRva2VuVHlwZS5saXN0U3RhcnQ6IHtcbiAgICAgICAgbGV0IGJvZHkgPSAnJztcbiAgICAgICAgY29uc3Qgb3JkZXJlZCA9IHRoaXMudG9rZW4ub3JkZXJlZDtcblxuICAgICAgICB3aGlsZSAodGhpcy5uZXh0KCkudHlwZSAhPSBUb2tlblR5cGUubGlzdEVuZCkge1xuICAgICAgICAgIGJvZHkgKz0gdGhpcy50b2soKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlcmVyLmxpc3QoYm9keSwgb3JkZXJlZCk7XG4gICAgICB9XG4gICAgICBjYXNlIFRva2VuVHlwZS5saXN0SXRlbVN0YXJ0OiB7XG4gICAgICAgIGxldCBib2R5ID0gJyc7XG5cbiAgICAgICAgd2hpbGUgKHRoaXMubmV4dCgpLnR5cGUgIT0gVG9rZW5UeXBlLmxpc3RJdGVtRW5kKSB7XG4gICAgICAgICAgYm9keSArPSB0aGlzLnRva2VuLnR5cGUgPT0gKFRva2VuVHlwZS50ZXh0IGFzIGFueSkgPyB0aGlzLnBhcnNlVGV4dCgpIDogdGhpcy50b2soKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlcmVyLmxpc3RpdGVtKGJvZHkpO1xuICAgICAgfVxuICAgICAgY2FzZSBUb2tlblR5cGUubG9vc2VJdGVtU3RhcnQ6IHtcbiAgICAgICAgbGV0IGJvZHkgPSAnJztcblxuICAgICAgICB3aGlsZSAodGhpcy5uZXh0KCkudHlwZSAhPSBUb2tlblR5cGUubGlzdEl0ZW1FbmQpIHtcbiAgICAgICAgICBib2R5ICs9IHRoaXMudG9rKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJlci5saXN0aXRlbShib2R5KTtcbiAgICAgIH1cbiAgICAgIGNhc2UgVG9rZW5UeXBlLmNvZGU6IHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyZXIuY29kZSh0aGlzLnRva2VuLnRleHQsIHRoaXMudG9rZW4ubGFuZywgdGhpcy50b2tlbi5lc2NhcGVkLCB0aGlzLnRva2VuLm1ldGEpO1xuICAgICAgfVxuICAgICAgY2FzZSBUb2tlblR5cGUudGFibGU6IHtcbiAgICAgICAgbGV0IGhlYWRlciA9ICcnO1xuICAgICAgICBsZXQgYm9keSA9ICcnO1xuICAgICAgICBsZXQgY2VsbDtcblxuICAgICAgICAvLyBoZWFkZXJcbiAgICAgICAgY2VsbCA9ICcnO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudG9rZW4uaGVhZGVyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgY29uc3QgZmxhZ3MgPSB7IGhlYWRlcjogdHJ1ZSwgYWxpZ246IHRoaXMudG9rZW4uYWxpZ25baV0gfTtcbiAgICAgICAgICBjb25zdCBvdXQgPSB0aGlzLmlubGluZUxleGVyLm91dHB1dCh0aGlzLnRva2VuLmhlYWRlcltpXSk7XG5cbiAgICAgICAgICBjZWxsICs9IHRoaXMucmVuZGVyZXIudGFibGVjZWxsKG91dCwgZmxhZ3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgaGVhZGVyICs9IHRoaXMucmVuZGVyZXIudGFibGVyb3coY2VsbCk7XG5cbiAgICAgICAgZm9yIChjb25zdCByb3cgb2YgdGhpcy50b2tlbi5jZWxscykge1xuICAgICAgICAgIGNlbGwgPSAnJztcblxuICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgcm93Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBjZWxsICs9IHRoaXMucmVuZGVyZXIudGFibGVjZWxsKHRoaXMuaW5saW5lTGV4ZXIub3V0cHV0KHJvd1tqXSksIHtcbiAgICAgICAgICAgICAgaGVhZGVyOiBmYWxzZSxcbiAgICAgICAgICAgICAgYWxpZ246IHRoaXMudG9rZW4uYWxpZ25bal1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGJvZHkgKz0gdGhpcy5yZW5kZXJlci50YWJsZXJvdyhjZWxsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlcmVyLnRhYmxlKGhlYWRlciwgYm9keSk7XG4gICAgICB9XG4gICAgICBjYXNlIFRva2VuVHlwZS5ibG9ja3F1b3RlU3RhcnQ6IHtcbiAgICAgICAgbGV0IGJvZHkgPSAnJztcblxuICAgICAgICB3aGlsZSAodGhpcy5uZXh0KCkudHlwZSAhPSBUb2tlblR5cGUuYmxvY2txdW90ZUVuZCkge1xuICAgICAgICAgIGJvZHkgKz0gdGhpcy50b2soKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlcmVyLmJsb2NrcXVvdGUoYm9keSk7XG4gICAgICB9XG4gICAgICBjYXNlIFRva2VuVHlwZS5ocjoge1xuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJlci5ocigpO1xuICAgICAgfVxuICAgICAgY2FzZSBUb2tlblR5cGUuaHRtbDoge1xuICAgICAgICBjb25zdCBodG1sID1cbiAgICAgICAgICAhdGhpcy50b2tlbi5wcmUgJiYgIXRoaXMub3B0aW9ucy5wZWRhbnRpYyA/IHRoaXMuaW5saW5lTGV4ZXIub3V0cHV0KHRoaXMudG9rZW4udGV4dCkgOiB0aGlzLnRva2VuLnRleHQ7XG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlcmVyLmh0bWwoaHRtbCk7XG4gICAgICB9XG4gICAgICBkZWZhdWx0OiB7XG4gICAgICAgIGlmICh0aGlzLnNpbXBsZVJlbmRlcmVycy5sZW5ndGgpIHtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc2ltcGxlUmVuZGVyZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy50b2tlbi50eXBlID09ICdzaW1wbGVSdWxlJyArIChpICsgMSkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2ltcGxlUmVuZGVyZXJzW2ldLmNhbGwodGhpcy5yZW5kZXJlciwgdGhpcy50b2tlbi5leGVjQXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBlcnJNc2cgPSBgVG9rZW4gd2l0aCBcIiR7dGhpcy50b2tlbi50eXBlfVwiIHR5cGUgd2FzIG5vdCBmb3VuZC5gO1xuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2lsZW50KSB7XG4gICAgICAgICAgY29uc29sZS5sb2coZXJyTXNnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyTXNnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIiwgIi8qKlxuICogQGxpY2Vuc2VcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTEtMjAxNCwgQ2hyaXN0b3BoZXIgSmVmZnJleS4gKE1JVCBMaWNlbnNlZClcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9jaGpqL21hcmtlZFxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxOC0yMDIxLCBcdTA0MUFcdTA0M0VcdTA0NDFcdTA0NDJcdTA0NEYgXHUwNDIyXHUwNDQwXHUwNDM1XHUwNDQyXHUwNDRGXHUwNDNBLiAoTUlUIExpY2Vuc2VkKVxuICogaHR0cHM6Ly9naXRodWIuY29tL3RzLXN0YWNrL21hcmtkb3duXG4gKi9cblxuaW1wb3J0IHsgQmxvY2tMZXhlciB9IGZyb20gJy4vYmxvY2stbGV4ZXInO1xuaW1wb3J0IHsgRGVidWdSZXR1cm5zLCBMZXhlclJldHVybnMsIExpbmtzLCBNYXJrZWRPcHRpb25zLCBTaW1wbGVSZW5kZXJlciwgVG9rZW4sIFRva2VuVHlwZSB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBQYXJzZXIgfSBmcm9tICcuL3BhcnNlcic7XG5cbmV4cG9ydCBjbGFzcyBNYXJrZWQge1xuICBzdGF0aWMgb3B0aW9ucyA9IG5ldyBNYXJrZWRPcHRpb25zKCk7XG4gIHByb3RlY3RlZCBzdGF0aWMgc2ltcGxlUmVuZGVyZXJzOiBTaW1wbGVSZW5kZXJlcltdID0gW107XG5cbiAgLyoqXG4gICAqIE1lcmdlcyB0aGUgZGVmYXVsdCBvcHRpb25zIHdpdGggb3B0aW9ucyB0aGF0IHdpbGwgYmUgc2V0LlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyBIYXNoIG9mIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgc2V0T3B0aW9ucyhvcHRpb25zOiBNYXJrZWRPcHRpb25zKSB7XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRpbmcgc2ltcGxlIGJsb2NrIHJ1bGUuXG4gICAqL1xuICBzdGF0aWMgc2V0QmxvY2tSdWxlKHJlZ2V4cDogUmVnRXhwLCByZW5kZXJlcjogU2ltcGxlUmVuZGVyZXIgPSAoKSA9PiAnJykge1xuICAgIEJsb2NrTGV4ZXIuc2ltcGxlUnVsZXMucHVzaChyZWdleHApO1xuICAgIHRoaXMuc2ltcGxlUmVuZGVyZXJzLnB1c2gocmVuZGVyZXIpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQWNjZXB0cyBNYXJrZG93biB0ZXh0IGFuZCByZXR1cm5zIHRleHQgaW4gSFRNTCBmb3JtYXQuXG4gICAqXG4gICAqIEBwYXJhbSBzcmMgU3RyaW5nIG9mIG1hcmtkb3duIHNvdXJjZSB0byBiZSBjb21waWxlZC5cbiAgICogQHBhcmFtIG9wdGlvbnMgSGFzaCBvZiBvcHRpb25zLiBUaGV5IHJlcGxhY2UsIGJ1dCBkbyBub3QgbWVyZ2Ugd2l0aCB0aGUgZGVmYXVsdCBvcHRpb25zLlxuICAgKiBJZiB5b3Ugd2FudCB0aGUgbWVyZ2luZywgeW91IGNhbiB0byBkbyB0aGlzIHZpYSBgTWFya2VkLnNldE9wdGlvbnMoKWAuXG4gICAqL1xuICBzdGF0aWMgcGFyc2Uoc3JjOiBzdHJpbmcsIG9wdGlvbnM6IE1hcmtlZE9wdGlvbnMgPSB0aGlzLm9wdGlvbnMpOiBzdHJpbmcge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB7IHRva2VucywgbGlua3MgfSA9IHRoaXMuY2FsbEJsb2NrTGV4ZXIoc3JjLCBvcHRpb25zKTtcbiAgICAgIHJldHVybiB0aGlzLmNhbGxQYXJzZXIodG9rZW5zLCBsaW5rcywgb3B0aW9ucyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIHRoaXMuY2FsbE1lKGUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBY2NlcHRzIE1hcmtkb3duIHRleHQgYW5kIHJldHVybnMgb2JqZWN0IHdpdGggdGV4dCBpbiBIVE1MIGZvcm1hdCxcbiAgICogdG9rZW5zIGFuZCBsaW5rcyBmcm9tIGBCbG9ja0xleGVyLnBhcnNlcigpYC5cbiAgICpcbiAgICogQHBhcmFtIHNyYyBTdHJpbmcgb2YgbWFya2Rvd24gc291cmNlIHRvIGJlIGNvbXBpbGVkLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBIYXNoIG9mIG9wdGlvbnMuIFRoZXkgcmVwbGFjZSwgYnV0IGRvIG5vdCBtZXJnZSB3aXRoIHRoZSBkZWZhdWx0IG9wdGlvbnMuXG4gICAqIElmIHlvdSB3YW50IHRoZSBtZXJnaW5nLCB5b3UgY2FuIHRvIGRvIHRoaXMgdmlhIGBNYXJrZWQuc2V0T3B0aW9ucygpYC5cbiAgICovXG4gIHN0YXRpYyBkZWJ1ZyhzcmM6IHN0cmluZywgb3B0aW9uczogTWFya2VkT3B0aW9ucyA9IHRoaXMub3B0aW9ucyk6IERlYnVnUmV0dXJucyB7XG4gICAgY29uc3QgeyB0b2tlbnMsIGxpbmtzIH0gPSB0aGlzLmNhbGxCbG9ja0xleGVyKHNyYywgb3B0aW9ucyk7XG4gICAgbGV0IG9yaWdpbiA9IHRva2Vucy5zbGljZSgpO1xuICAgIGNvbnN0IHBhcnNlciA9IG5ldyBQYXJzZXIob3B0aW9ucyk7XG4gICAgcGFyc2VyLnNpbXBsZVJlbmRlcmVycyA9IHRoaXMuc2ltcGxlUmVuZGVyZXJzO1xuICAgIGNvbnN0IHJlc3VsdCA9IHBhcnNlci5kZWJ1ZyhsaW5rcywgdG9rZW5zKTtcblxuICAgIC8qKlxuICAgICAqIFRyYW5zbGF0ZXMgYSB0b2tlbiB0eXBlIGludG8gYSByZWFkYWJsZSBmb3JtLFxuICAgICAqIGFuZCBtb3ZlcyBgbGluZWAgZmllbGQgdG8gYSBmaXJzdCBwbGFjZSBpbiBhIHRva2VuIG9iamVjdC5cbiAgICAgKi9cbiAgICBvcmlnaW4gPSBvcmlnaW4ubWFwKHRva2VuID0+IHtcbiAgICAgIHRva2VuLnR5cGUgPSAoVG9rZW5UeXBlIGFzIGFueSlbdG9rZW4udHlwZV0gfHwgdG9rZW4udHlwZTtcblxuICAgICAgY29uc3QgbGluZSA9IHRva2VuLmxpbmU7XG4gICAgICBkZWxldGUgdG9rZW4ubGluZTtcbiAgICAgIGlmIChsaW5lKSB7XG4gICAgICAgIHJldHVybiB7IC4uLnsgbGluZSB9LCAuLi50b2tlbiB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRva2VuO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHsgdG9rZW5zOiBvcmlnaW4sIGxpbmtzLCByZXN1bHQgfTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzdGF0aWMgY2FsbEJsb2NrTGV4ZXIoc3JjOiBzdHJpbmcgPSAnJywgb3B0aW9ucz86IE1hcmtlZE9wdGlvbnMpOiBMZXhlclJldHVybnMge1xuICAgIGlmICh0eXBlb2Ygc3JjICE9ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIHRoYXQgdGhlICdzcmMnIHBhcmFtZXRlciB3b3VsZCBoYXZlIGEgJ3N0cmluZycgdHlwZSwgZ290ICcke3R5cGVvZiBzcmN9J2ApO1xuICAgIH1cblxuICAgIC8vIFByZXByb2Nlc3NpbmcuXG4gICAgc3JjID0gc3JjXG4gICAgICAucmVwbGFjZSgvXFxyXFxufFxcci9nLCAnXFxuJylcbiAgICAgIC5yZXBsYWNlKC9cXHQvZywgJyAgICAnKVxuICAgICAgLnJlcGxhY2UoL1xcdTAwYTAvZywgJyAnKVxuICAgICAgLnJlcGxhY2UoL1xcdTI0MjQvZywgJ1xcbicpXG4gICAgICAucmVwbGFjZSgvXiArJC9nbSwgJycpO1xuXG4gICAgcmV0dXJuIEJsb2NrTGV4ZXIubGV4KHNyYywgb3B0aW9ucywgdHJ1ZSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgc3RhdGljIGNhbGxQYXJzZXIodG9rZW5zOiBUb2tlbltdLCBsaW5rczogTGlua3MsIG9wdGlvbnM/OiBNYXJrZWRPcHRpb25zKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5zaW1wbGVSZW5kZXJlcnMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBwYXJzZXIgPSBuZXcgUGFyc2VyKG9wdGlvbnMpO1xuICAgICAgcGFyc2VyLnNpbXBsZVJlbmRlcmVycyA9IHRoaXMuc2ltcGxlUmVuZGVyZXJzO1xuICAgICAgcmV0dXJuIHBhcnNlci5wYXJzZShsaW5rcywgdG9rZW5zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFBhcnNlci5wYXJzZSh0b2tlbnMsIGxpbmtzLCBvcHRpb25zKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgc3RhdGljIGNhbGxNZShlcnI6IEVycm9yKSB7XG4gICAgZXJyLm1lc3NhZ2UgKz0gJ1xcblBsZWFzZSByZXBvcnQgdGhpcyB0byBodHRwczovL2dpdGh1Yi5jb20vdHMtc3RhY2svbWFya2Rvd24nO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5zaWxlbnQpIHtcbiAgICAgIHJldHVybiAnPHA+QW4gZXJyb3Igb2NjdXJlZDo8L3A+PHByZT4nICsgdGhpcy5vcHRpb25zLmVzY2FwZShlcnIubWVzc2FnZSArICcnLCB0cnVlKSArICc8L3ByZT4nO1xuICAgIH1cblxuICAgIHRocm93IGVycjtcbiAgfVxufVxuIiwgIi8qKlxuICogQGxpY2Vuc2VcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTEtMjAxNCwgQ2hyaXN0b3BoZXIgSmVmZnJleS4gKE1JVCBMaWNlbnNlZClcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9jaGpqL21hcmtlZFxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxOC0yMDIxLCBcdTA0MUFcdTA0M0VcdTA0NDFcdTA0NDJcdTA0NEYgXHUwNDIyXHUwNDQwXHUwNDM1XHUwNDQyXHUwNDRGXHUwNDNBLiAoTUlUIExpY2Vuc2VkKVxuICogaHR0cHM6Ly9naXRodWIuY29tL3RzLXN0YWNrL21hcmtkb3duXG4gKi9cblxuaW1wb3J0IHsgRXh0ZW5kUmVnZXhwIH0gZnJvbSAnLi9leHRlbmQtcmVnZXhwJztcbmltcG9ydCB7XG4gIEFsaWduLFxuICBMZXhlclJldHVybnMsXG4gIExpbmtzLFxuICBNYXJrZWRPcHRpb25zLFxuICBSdWxlc0Jsb2NrQmFzZSxcbiAgUnVsZXNCbG9ja0dmbSxcbiAgUnVsZXNCbG9ja1RhYmxlcyxcbiAgVG9rZW4sXG4gIFRva2VuVHlwZSxcbn0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7IE1hcmtlZCB9IGZyb20gJy4vbWFya2VkJztcblxuZXhwb3J0IGNsYXNzIEJsb2NrTGV4ZXI8VCBleHRlbmRzIHR5cGVvZiBCbG9ja0xleGVyPiB7XG4gIHN0YXRpYyBzaW1wbGVSdWxlczogUmVnRXhwW10gPSBbXTtcbiAgcHJvdGVjdGVkIHN0YXRpYyBydWxlc0Jhc2U6IFJ1bGVzQmxvY2tCYXNlID0gbnVsbDtcbiAgLyoqXG4gICAqIEdGTSBCbG9jayBHcmFtbWFyLlxuICAgKi9cbiAgcHJvdGVjdGVkIHN0YXRpYyBydWxlc0dmbTogUnVsZXNCbG9ja0dmbSA9IG51bGw7XG4gIC8qKlxuICAgKiBHRk0gKyBUYWJsZXMgQmxvY2sgR3JhbW1hci5cbiAgICovXG4gIHByb3RlY3RlZCBzdGF0aWMgcnVsZXNUYWJsZXM6IFJ1bGVzQmxvY2tUYWJsZXMgPSBudWxsO1xuICBwcm90ZWN0ZWQgcnVsZXM6IFJ1bGVzQmxvY2tCYXNlIHwgUnVsZXNCbG9ja0dmbSB8IFJ1bGVzQmxvY2tUYWJsZXM7XG4gIHByb3RlY3RlZCBvcHRpb25zOiBNYXJrZWRPcHRpb25zO1xuICBwcm90ZWN0ZWQgbGlua3M6IExpbmtzID0ge307XG4gIHByb3RlY3RlZCB0b2tlbnM6IFRva2VuW10gPSBbXTtcbiAgcHJvdGVjdGVkIGhhc1J1bGVzR2ZtOiBib29sZWFuO1xuICBwcm90ZWN0ZWQgaGFzUnVsZXNUYWJsZXM6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIHN0YXRpY1RoaXM6IFQsIG9wdGlvbnM/OiBvYmplY3QpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IE1hcmtlZC5vcHRpb25zO1xuICAgIHRoaXMuc2V0UnVsZXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBY2NlcHRzIE1hcmtkb3duIHRleHQgYW5kIHJldHVybnMgb2JqZWN0IHdpdGggdG9rZW5zIGFuZCBsaW5rcy5cbiAgICpcbiAgICogQHBhcmFtIHNyYyBTdHJpbmcgb2YgbWFya2Rvd24gc291cmNlIHRvIGJlIGNvbXBpbGVkLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBIYXNoIG9mIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgbGV4KHNyYzogc3RyaW5nLCBvcHRpb25zPzogTWFya2VkT3B0aW9ucywgdG9wPzogYm9vbGVhbiwgaXNCbG9ja1F1b3RlPzogYm9vbGVhbik6IExleGVyUmV0dXJucyB7XG4gICAgY29uc3QgbGV4ZXIgPSBuZXcgdGhpcyh0aGlzLCBvcHRpb25zKTtcbiAgICByZXR1cm4gbGV4ZXIuZ2V0VG9rZW5zKHNyYywgdG9wLCBpc0Jsb2NrUXVvdGUpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHN0YXRpYyBnZXRSdWxlc0Jhc2UoKTogUnVsZXNCbG9ja0Jhc2Uge1xuICAgIGlmICh0aGlzLnJ1bGVzQmFzZSkge1xuICAgICAgcmV0dXJuIHRoaXMucnVsZXNCYXNlO1xuICAgIH1cblxuICAgIGNvbnN0IGJhc2U6IFJ1bGVzQmxvY2tCYXNlID0ge1xuICAgICAgbmV3bGluZTogL15cXG4rLyxcbiAgICAgIGNvZGU6IC9eKCB7NH1bXlxcbl0rXFxuKikrLyxcbiAgICAgIGhyOiAvXiggKlstKl9dKXszLH0gKig/Olxcbit8JCkvLFxuICAgICAgaGVhZGluZzogL14gKigjezEsNn0pICooW15cXG5dKz8pICojKiAqKD86XFxuK3wkKS8sXG4gICAgICBsaGVhZGluZzogL14oW15cXG5dKylcXG4gKig9fC0pezIsfSAqKD86XFxuK3wkKS8sXG4gICAgICBibG9ja3F1b3RlOiAvXiggKj5bXlxcbl0rKFxcblteXFxuXSspKlxcbiopKy8sXG4gICAgICBsaXN0OiAvXiggKikoYnVsbCkgW1xcc1xcU10rPyg/OmhyfGRlZnxcXG57Mix9KD8hICkoPyFcXDFidWxsIClcXG4qfFxccyokKS8sXG4gICAgICBodG1sOiAvXiAqKD86Y29tbWVudCAqKD86XFxufFxccyokKXxjbG9zZWQgKig/OlxcbnsyLH18XFxzKiQpfGNsb3NpbmcgKig/OlxcbnsyLH18XFxzKiQpKS8sXG4gICAgICBkZWY6IC9eICpcXFsoW15cXF1dKylcXF06ICo8PyhbXlxccz5dKyk+Pyg/OiArW1wiKF0oW15cXG5dKylbXCIpXSk/ICooPzpcXG4rfCQpLyxcbiAgICAgIHBhcmFncmFwaDogL14oKD86W15cXG5dK1xcbj8oPyFocnxoZWFkaW5nfGxoZWFkaW5nfGJsb2NrcXVvdGV8dGFnfGRlZikpKylcXG4qLyxcbiAgICAgIHRleHQ6IC9eW15cXG5dKy8sXG4gICAgICBidWxsZXQ6IC8oPzpbKistXXxcXGQrXFwuKS8sXG4gICAgICBpdGVtOiAvXiggKikoYnVsbCkgW15cXG5dKig/Olxcbig/IVxcMWJ1bGwgKVteXFxuXSopKi8sXG4gICAgfTtcblxuICAgIGJhc2UuaXRlbSA9IG5ldyBFeHRlbmRSZWdleHAoYmFzZS5pdGVtLCAnZ20nKS5zZXRHcm91cCgvYnVsbC9nLCBiYXNlLmJ1bGxldCkuZ2V0UmVnZXhwKCk7XG5cbiAgICBiYXNlLmxpc3QgPSBuZXcgRXh0ZW5kUmVnZXhwKGJhc2UubGlzdClcbiAgICAgIC5zZXRHcm91cCgvYnVsbC9nLCBiYXNlLmJ1bGxldClcbiAgICAgIC5zZXRHcm91cCgnaHInLCAnXFxcXG4rKD89XFxcXDE/KD86Wy0qX10gKil7Myx9KD86XFxcXG4rfCQpKScpXG4gICAgICAuc2V0R3JvdXAoJ2RlZicsICdcXFxcbisoPz0nICsgYmFzZS5kZWYuc291cmNlICsgJyknKVxuICAgICAgLmdldFJlZ2V4cCgpO1xuXG4gICAgY29uc3QgdGFnID1cbiAgICAgICcoPyEoPzonICtcbiAgICAgICdhfGVtfHN0cm9uZ3xzbWFsbHxzfGNpdGV8cXxkZm58YWJicnxkYXRhfHRpbWV8Y29kZScgK1xuICAgICAgJ3x2YXJ8c2FtcHxrYmR8c3VifHN1cHxpfGJ8dXxtYXJrfHJ1Ynl8cnR8cnB8YmRpfGJkbycgK1xuICAgICAgJ3xzcGFufGJyfHdicnxpbnN8ZGVsfGltZylcXFxcYilcXFxcdysoPyE6L3xbXlxcXFx3XFxcXHNAXSpAKVxcXFxiJztcblxuICAgIGJhc2UuaHRtbCA9IG5ldyBFeHRlbmRSZWdleHAoYmFzZS5odG1sKVxuICAgICAgLnNldEdyb3VwKCdjb21tZW50JywgLzwhLS1bXFxzXFxTXSo/LS0+LylcbiAgICAgIC5zZXRHcm91cCgnY2xvc2VkJywgLzwodGFnKVtcXHNcXFNdKz88XFwvXFwxPi8pXG4gICAgICAuc2V0R3JvdXAoJ2Nsb3NpbmcnLCAvPHRhZyg/OlwiW15cIl0qXCJ8J1teJ10qJ3xbXidcIj5dKSo/Pi8pXG4gICAgICAuc2V0R3JvdXAoL3RhZy9nLCB0YWcpXG4gICAgICAuZ2V0UmVnZXhwKCk7XG5cbiAgICBiYXNlLnBhcmFncmFwaCA9IG5ldyBFeHRlbmRSZWdleHAoYmFzZS5wYXJhZ3JhcGgpXG4gICAgICAuc2V0R3JvdXAoJ2hyJywgYmFzZS5ocilcbiAgICAgIC5zZXRHcm91cCgnaGVhZGluZycsIGJhc2UuaGVhZGluZylcbiAgICAgIC5zZXRHcm91cCgnbGhlYWRpbmcnLCBiYXNlLmxoZWFkaW5nKVxuICAgICAgLnNldEdyb3VwKCdibG9ja3F1b3RlJywgYmFzZS5ibG9ja3F1b3RlKVxuICAgICAgLnNldEdyb3VwKCd0YWcnLCAnPCcgKyB0YWcpXG4gICAgICAuc2V0R3JvdXAoJ2RlZicsIGJhc2UuZGVmKVxuICAgICAgLmdldFJlZ2V4cCgpO1xuXG4gICAgcmV0dXJuICh0aGlzLnJ1bGVzQmFzZSA9IGJhc2UpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHN0YXRpYyBnZXRSdWxlc0dmbSgpOiBSdWxlc0Jsb2NrR2ZtIHtcbiAgICBpZiAodGhpcy5ydWxlc0dmbSkge1xuICAgICAgcmV0dXJuIHRoaXMucnVsZXNHZm07XG4gICAgfVxuXG4gICAgY29uc3QgYmFzZSA9IHRoaXMuZ2V0UnVsZXNCYXNlKCk7XG5cbiAgICBjb25zdCBnZm06IFJ1bGVzQmxvY2tHZm0gPSB7XG4gICAgICAuLi5iYXNlLFxuICAgICAgLi4ue1xuICAgICAgICBmZW5jZXM6IC9eICooYHszLH18fnszLH0pWyBcXC5dKigoXFxTKyk/ICpbXlxcbl0qKVxcbihbXFxzXFxTXSo/KVxccypcXDEgKig/Olxcbit8JCkvLFxuICAgICAgICBwYXJhZ3JhcGg6IC9eLyxcbiAgICAgICAgaGVhZGluZzogL14gKigjezEsNn0pICsoW15cXG5dKz8pICojKiAqKD86XFxuK3wkKS8sXG4gICAgICB9LFxuICAgIH07XG5cbiAgICBjb25zdCBncm91cDEgPSBnZm0uZmVuY2VzLnNvdXJjZS5yZXBsYWNlKCdcXFxcMScsICdcXFxcMicpO1xuICAgIGNvbnN0IGdyb3VwMiA9IGJhc2UubGlzdC5zb3VyY2UucmVwbGFjZSgnXFxcXDEnLCAnXFxcXDMnKTtcblxuICAgIGdmbS5wYXJhZ3JhcGggPSBuZXcgRXh0ZW5kUmVnZXhwKGJhc2UucGFyYWdyYXBoKS5zZXRHcm91cCgnKD8hJywgYCg/ISR7Z3JvdXAxfXwke2dyb3VwMn18YCkuZ2V0UmVnZXhwKCk7XG5cbiAgICByZXR1cm4gKHRoaXMucnVsZXNHZm0gPSBnZm0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIHN0YXRpYyBnZXRSdWxlc1RhYmxlKCk6IFJ1bGVzQmxvY2tUYWJsZXMge1xuICAgIGlmICh0aGlzLnJ1bGVzVGFibGVzKSB7XG4gICAgICByZXR1cm4gdGhpcy5ydWxlc1RhYmxlcztcbiAgICB9XG5cbiAgICByZXR1cm4gKHRoaXMucnVsZXNUYWJsZXMgPSB7XG4gICAgICAuLi50aGlzLmdldFJ1bGVzR2ZtKCksXG4gICAgICAuLi57XG4gICAgICAgIG5wdGFibGU6IC9eICooXFxTLipcXHwuKilcXG4gKihbLTpdKyAqXFx8Wy18IDpdKilcXG4oKD86LipcXHwuKig/OlxcbnwkKSkqKVxcbiovLFxuICAgICAgICB0YWJsZTogL14gKlxcfCguKylcXG4gKlxcfCggKlstOl0rWy18IDpdKilcXG4oKD86ICpcXHwuKig/OlxcbnwkKSkqKVxcbiovLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzZXRSdWxlcygpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLmdmbSkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy50YWJsZXMpIHtcbiAgICAgICAgdGhpcy5ydWxlcyA9IHRoaXMuc3RhdGljVGhpcy5nZXRSdWxlc1RhYmxlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJ1bGVzID0gdGhpcy5zdGF0aWNUaGlzLmdldFJ1bGVzR2ZtKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucnVsZXMgPSB0aGlzLnN0YXRpY1RoaXMuZ2V0UnVsZXNCYXNlKCk7XG4gICAgfVxuXG4gICAgdGhpcy5oYXNSdWxlc0dmbSA9ICh0aGlzLnJ1bGVzIGFzIFJ1bGVzQmxvY2tHZm0pLmZlbmNlcyAhPT0gdW5kZWZpbmVkO1xuICAgIHRoaXMuaGFzUnVsZXNUYWJsZXMgPSAodGhpcy5ydWxlcyBhcyBSdWxlc0Jsb2NrVGFibGVzKS50YWJsZSAhPT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIExleGluZy5cbiAgICovXG4gIHByb3RlY3RlZCBnZXRUb2tlbnMoc3JjOiBzdHJpbmcsIHRvcD86IGJvb2xlYW4sIGlzQmxvY2tRdW90ZT86IGJvb2xlYW4pOiBMZXhlclJldHVybnMge1xuICAgIGxldCBuZXh0UGFydCA9IHNyYztcbiAgICBsZXQgZXhlY0FycjogUmVnRXhwRXhlY0FycmF5O1xuXG4gICAgbWFpbkxvb3A6IHdoaWxlIChuZXh0UGFydCkge1xuICAgICAgLy8gbmV3bGluZVxuICAgICAgaWYgKChleGVjQXJyID0gdGhpcy5ydWxlcy5uZXdsaW5lLmV4ZWMobmV4dFBhcnQpKSkge1xuICAgICAgICBuZXh0UGFydCA9IG5leHRQYXJ0LnN1YnN0cmluZyhleGVjQXJyWzBdLmxlbmd0aCk7XG5cbiAgICAgICAgaWYgKGV4ZWNBcnJbMF0ubGVuZ3RoID4gMSkge1xuICAgICAgICAgIHRoaXMudG9rZW5zLnB1c2goeyB0eXBlOiBUb2tlblR5cGUuc3BhY2UgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gY29kZVxuICAgICAgaWYgKChleGVjQXJyID0gdGhpcy5ydWxlcy5jb2RlLmV4ZWMobmV4dFBhcnQpKSkge1xuICAgICAgICBuZXh0UGFydCA9IG5leHRQYXJ0LnN1YnN0cmluZyhleGVjQXJyWzBdLmxlbmd0aCk7XG4gICAgICAgIGNvbnN0IGNvZGUgPSBleGVjQXJyWzBdLnJlcGxhY2UoL14gezR9L2dtLCAnJyk7XG5cbiAgICAgICAgdGhpcy50b2tlbnMucHVzaCh7XG4gICAgICAgICAgdHlwZTogVG9rZW5UeXBlLmNvZGUsXG4gICAgICAgICAgdGV4dDogIXRoaXMub3B0aW9ucy5wZWRhbnRpYyA/IGNvZGUucmVwbGFjZSgvXFxuKyQvLCAnJykgOiBjb2RlLFxuICAgICAgICB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIGZlbmNlcyBjb2RlIChnZm0pXG4gICAgICBpZiAodGhpcy5oYXNSdWxlc0dmbSAmJiAoZXhlY0FyciA9ICh0aGlzLnJ1bGVzIGFzIFJ1bGVzQmxvY2tHZm0pLmZlbmNlcy5leGVjKG5leHRQYXJ0KSkpIHtcbiAgICAgICAgbmV4dFBhcnQgPSBuZXh0UGFydC5zdWJzdHJpbmcoZXhlY0FyclswXS5sZW5ndGgpO1xuXG4gICAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICAgIHR5cGU6IFRva2VuVHlwZS5jb2RlLFxuICAgICAgICAgIG1ldGE6IGV4ZWNBcnJbMl0sXG4gICAgICAgICAgbGFuZzogZXhlY0FyclszXSxcbiAgICAgICAgICB0ZXh0OiBleGVjQXJyWzRdIHx8ICcnLFxuICAgICAgICB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIGhlYWRpbmdcbiAgICAgIGlmICgoZXhlY0FyciA9IHRoaXMucnVsZXMuaGVhZGluZy5leGVjKG5leHRQYXJ0KSkpIHtcbiAgICAgICAgbmV4dFBhcnQgPSBuZXh0UGFydC5zdWJzdHJpbmcoZXhlY0FyclswXS5sZW5ndGgpO1xuICAgICAgICB0aGlzLnRva2Vucy5wdXNoKHtcbiAgICAgICAgICB0eXBlOiBUb2tlblR5cGUuaGVhZGluZyxcbiAgICAgICAgICBkZXB0aDogZXhlY0FyclsxXS5sZW5ndGgsXG4gICAgICAgICAgdGV4dDogZXhlY0FyclsyXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyB0YWJsZSBubyBsZWFkaW5nIHBpcGUgKGdmbSlcbiAgICAgIGlmICh0b3AgJiYgdGhpcy5oYXNSdWxlc1RhYmxlcyAmJiAoZXhlY0FyciA9ICh0aGlzLnJ1bGVzIGFzIFJ1bGVzQmxvY2tUYWJsZXMpLm5wdGFibGUuZXhlYyhuZXh0UGFydCkpKSB7XG4gICAgICAgIG5leHRQYXJ0ID0gbmV4dFBhcnQuc3Vic3RyaW5nKGV4ZWNBcnJbMF0ubGVuZ3RoKTtcblxuICAgICAgICBjb25zdCBpdGVtOiBUb2tlbiA9IHtcbiAgICAgICAgICB0eXBlOiBUb2tlblR5cGUudGFibGUsXG4gICAgICAgICAgaGVhZGVyOiBleGVjQXJyWzFdLnJlcGxhY2UoL14gKnwgKlxcfCAqJC9nLCAnJykuc3BsaXQoLyAqXFx8ICovKSxcbiAgICAgICAgICBhbGlnbjogZXhlY0FyclsyXS5yZXBsYWNlKC9eICp8XFx8ICokL2csICcnKS5zcGxpdCgvICpcXHwgKi8pIGFzIEFsaWduW10sXG4gICAgICAgICAgY2VsbHM6IFtdLFxuICAgICAgICB9O1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbS5hbGlnbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmICgvXiAqLSs6ICokLy50ZXN0KGl0ZW0uYWxpZ25baV0pKSB7XG4gICAgICAgICAgICBpdGVtLmFsaWduW2ldID0gJ3JpZ2h0JztcbiAgICAgICAgICB9IGVsc2UgaWYgKC9eICo6LSs6ICokLy50ZXN0KGl0ZW0uYWxpZ25baV0pKSB7XG4gICAgICAgICAgICBpdGVtLmFsaWduW2ldID0gJ2NlbnRlcic7XG4gICAgICAgICAgfSBlbHNlIGlmICgvXiAqOi0rICokLy50ZXN0KGl0ZW0uYWxpZ25baV0pKSB7XG4gICAgICAgICAgICBpdGVtLmFsaWduW2ldID0gJ2xlZnQnO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpdGVtLmFsaWduW2ldID0gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0ZDogc3RyaW5nW10gPSBleGVjQXJyWzNdLnJlcGxhY2UoL1xcbiQvLCAnJykuc3BsaXQoJ1xcbicpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpdGVtLmNlbGxzW2ldID0gdGRbaV0uc3BsaXQoLyAqXFx8ICovKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudG9rZW5zLnB1c2goaXRlbSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBsaGVhZGluZ1xuICAgICAgaWYgKChleGVjQXJyID0gdGhpcy5ydWxlcy5saGVhZGluZy5leGVjKG5leHRQYXJ0KSkpIHtcbiAgICAgICAgbmV4dFBhcnQgPSBuZXh0UGFydC5zdWJzdHJpbmcoZXhlY0FyclswXS5sZW5ndGgpO1xuXG4gICAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICAgIHR5cGU6IFRva2VuVHlwZS5oZWFkaW5nLFxuICAgICAgICAgIGRlcHRoOiBleGVjQXJyWzJdID09PSAnPScgPyAxIDogMixcbiAgICAgICAgICB0ZXh0OiBleGVjQXJyWzFdLFxuICAgICAgICB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIGhyXG4gICAgICBpZiAoKGV4ZWNBcnIgPSB0aGlzLnJ1bGVzLmhyLmV4ZWMobmV4dFBhcnQpKSkge1xuICAgICAgICBuZXh0UGFydCA9IG5leHRQYXJ0LnN1YnN0cmluZyhleGVjQXJyWzBdLmxlbmd0aCk7XG4gICAgICAgIHRoaXMudG9rZW5zLnB1c2goeyB0eXBlOiBUb2tlblR5cGUuaHIgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBibG9ja3F1b3RlXG4gICAgICBpZiAoKGV4ZWNBcnIgPSB0aGlzLnJ1bGVzLmJsb2NrcXVvdGUuZXhlYyhuZXh0UGFydCkpKSB7XG4gICAgICAgIG5leHRQYXJ0ID0gbmV4dFBhcnQuc3Vic3RyaW5nKGV4ZWNBcnJbMF0ubGVuZ3RoKTtcbiAgICAgICAgdGhpcy50b2tlbnMucHVzaCh7IHR5cGU6IFRva2VuVHlwZS5ibG9ja3F1b3RlU3RhcnQgfSk7XG4gICAgICAgIGNvbnN0IHN0ciA9IGV4ZWNBcnJbMF0ucmVwbGFjZSgvXiAqPiA/L2dtLCAnJyk7XG5cbiAgICAgICAgLy8gUGFzcyBgdG9wYCB0byBrZWVwIHRoZSBjdXJyZW50XG4gICAgICAgIC8vIFwidG9wbGV2ZWxcIiBzdGF0ZS4gVGhpcyBpcyBleGFjdGx5XG4gICAgICAgIC8vIGhvdyBtYXJrZG93bi5wbCB3b3Jrcy5cbiAgICAgICAgdGhpcy5nZXRUb2tlbnMoc3RyKTtcbiAgICAgICAgdGhpcy50b2tlbnMucHVzaCh7IHR5cGU6IFRva2VuVHlwZS5ibG9ja3F1b3RlRW5kIH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gbGlzdFxuICAgICAgaWYgKChleGVjQXJyID0gdGhpcy5ydWxlcy5saXN0LmV4ZWMobmV4dFBhcnQpKSkge1xuICAgICAgICBuZXh0UGFydCA9IG5leHRQYXJ0LnN1YnN0cmluZyhleGVjQXJyWzBdLmxlbmd0aCk7XG4gICAgICAgIGNvbnN0IGJ1bGw6IHN0cmluZyA9IGV4ZWNBcnJbMl07XG5cbiAgICAgICAgdGhpcy50b2tlbnMucHVzaCh7IHR5cGU6IFRva2VuVHlwZS5saXN0U3RhcnQsIG9yZGVyZWQ6IGJ1bGwubGVuZ3RoID4gMSB9KTtcblxuICAgICAgICAvLyBHZXQgZWFjaCB0b3AtbGV2ZWwgaXRlbS5cbiAgICAgICAgY29uc3Qgc3RyID0gZXhlY0FyclswXS5tYXRjaCh0aGlzLnJ1bGVzLml0ZW0pO1xuICAgICAgICBjb25zdCBsZW5ndGggPSBzdHIubGVuZ3RoO1xuXG4gICAgICAgIGxldCBuZXh0ID0gZmFsc2U7XG4gICAgICAgIGxldCBzcGFjZTogbnVtYmVyO1xuICAgICAgICBsZXQgYmxvY2tCdWxsZXQ6IHN0cmluZztcbiAgICAgICAgbGV0IGxvb3NlOiBib29sZWFuO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBsZXQgaXRlbSA9IHN0cltpXTtcblxuICAgICAgICAgIC8vIFJlbW92ZSB0aGUgbGlzdCBpdGVtJ3MgYnVsbGV0IHNvIGl0IGlzIHNlZW4gYXMgdGhlIG5leHQgdG9rZW4uXG4gICAgICAgICAgc3BhY2UgPSBpdGVtLmxlbmd0aDtcbiAgICAgICAgICBpdGVtID0gaXRlbS5yZXBsYWNlKC9eICooWyorLV18XFxkK1xcLikgKy8sICcnKTtcblxuICAgICAgICAgIC8vIE91dGRlbnQgd2hhdGV2ZXIgdGhlIGxpc3QgaXRlbSBjb250YWlucy4gSGFja3kuXG4gICAgICAgICAgaWYgKGl0ZW0uaW5kZXhPZignXFxuICcpICE9PSAtMSkge1xuICAgICAgICAgICAgc3BhY2UgLT0gaXRlbS5sZW5ndGg7XG4gICAgICAgICAgICBpdGVtID0gIXRoaXMub3B0aW9ucy5wZWRhbnRpY1xuICAgICAgICAgICAgICA/IGl0ZW0ucmVwbGFjZShuZXcgUmVnRXhwKCdeIHsxLCcgKyBzcGFjZSArICd9JywgJ2dtJyksICcnKVxuICAgICAgICAgICAgICA6IGl0ZW0ucmVwbGFjZSgvXiB7MSw0fS9nbSwgJycpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIERldGVybWluZSB3aGV0aGVyIHRoZSBuZXh0IGxpc3QgaXRlbSBiZWxvbmdzIGhlcmUuXG4gICAgICAgICAgLy8gQmFja3BlZGFsIGlmIGl0IGRvZXMgbm90IGJlbG9uZyBpbiB0aGlzIGxpc3QuXG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zbWFydExpc3RzICYmIGkgIT09IGxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgIGJsb2NrQnVsbGV0ID0gdGhpcy5zdGF0aWNUaGlzLmdldFJ1bGVzQmFzZSgpLmJ1bGxldC5leGVjKHN0cltpICsgMV0pWzBdO1xuXG4gICAgICAgICAgICBpZiAoYnVsbCAhPT0gYmxvY2tCdWxsZXQgJiYgIShidWxsLmxlbmd0aCA+IDEgJiYgYmxvY2tCdWxsZXQubGVuZ3RoID4gMSkpIHtcbiAgICAgICAgICAgICAgbmV4dFBhcnQgPSBzdHIuc2xpY2UoaSArIDEpLmpvaW4oJ1xcbicpICsgbmV4dFBhcnQ7XG4gICAgICAgICAgICAgIGkgPSBsZW5ndGggLSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIERldGVybWluZSB3aGV0aGVyIGl0ZW0gaXMgbG9vc2Ugb3Igbm90LlxuICAgICAgICAgIC8vIFVzZTogLyhefFxcbikoPyEgKVteXFxuXStcXG5cXG4oPyFcXHMqJCkvXG4gICAgICAgICAgLy8gZm9yIGRpc2NvdW50IGJlaGF2aW9yLlxuICAgICAgICAgIGxvb3NlID0gbmV4dCB8fCAvXFxuXFxuKD8hXFxzKiQpLy50ZXN0KGl0ZW0pO1xuXG4gICAgICAgICAgaWYgKGkgIT09IGxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgIG5leHQgPSBpdGVtLmNoYXJBdChpdGVtLmxlbmd0aCAtIDEpID09PSAnXFxuJztcblxuICAgICAgICAgICAgaWYgKCFsb29zZSkge1xuICAgICAgICAgICAgICBsb29zZSA9IG5leHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy50b2tlbnMucHVzaCh7IHR5cGU6IGxvb3NlID8gVG9rZW5UeXBlLmxvb3NlSXRlbVN0YXJ0IDogVG9rZW5UeXBlLmxpc3RJdGVtU3RhcnQgfSk7XG5cbiAgICAgICAgICAvLyBSZWN1cnNlLlxuICAgICAgICAgIHRoaXMuZ2V0VG9rZW5zKGl0ZW0sIGZhbHNlLCBpc0Jsb2NrUXVvdGUpO1xuICAgICAgICAgIHRoaXMudG9rZW5zLnB1c2goeyB0eXBlOiBUb2tlblR5cGUubGlzdEl0ZW1FbmQgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRva2Vucy5wdXNoKHsgdHlwZTogVG9rZW5UeXBlLmxpc3RFbmQgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBodG1sXG4gICAgICBpZiAoKGV4ZWNBcnIgPSB0aGlzLnJ1bGVzLmh0bWwuZXhlYyhuZXh0UGFydCkpKSB7XG4gICAgICAgIG5leHRQYXJ0ID0gbmV4dFBhcnQuc3Vic3RyaW5nKGV4ZWNBcnJbMF0ubGVuZ3RoKTtcbiAgICAgICAgY29uc3QgYXR0ciA9IGV4ZWNBcnJbMV07XG4gICAgICAgIGNvbnN0IGlzUHJlID0gYXR0ciA9PT0gJ3ByZScgfHwgYXR0ciA9PT0gJ3NjcmlwdCcgfHwgYXR0ciA9PT0gJ3N0eWxlJztcblxuICAgICAgICB0aGlzLnRva2Vucy5wdXNoKHtcbiAgICAgICAgICB0eXBlOiB0aGlzLm9wdGlvbnMuc2FuaXRpemUgPyBUb2tlblR5cGUucGFyYWdyYXBoIDogVG9rZW5UeXBlLmh0bWwsXG4gICAgICAgICAgcHJlOiAhdGhpcy5vcHRpb25zLnNhbml0aXplciAmJiBpc1ByZSxcbiAgICAgICAgICB0ZXh0OiBleGVjQXJyWzBdLFxuICAgICAgICB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIGRlZlxuICAgICAgaWYgKHRvcCAmJiAoZXhlY0FyciA9IHRoaXMucnVsZXMuZGVmLmV4ZWMobmV4dFBhcnQpKSkge1xuICAgICAgICBuZXh0UGFydCA9IG5leHRQYXJ0LnN1YnN0cmluZyhleGVjQXJyWzBdLmxlbmd0aCk7XG5cbiAgICAgICAgdGhpcy5saW5rc1tleGVjQXJyWzFdLnRvTG93ZXJDYXNlKCldID0ge1xuICAgICAgICAgIGhyZWY6IGV4ZWNBcnJbMl0sXG4gICAgICAgICAgdGl0bGU6IGV4ZWNBcnJbM10sXG4gICAgICAgIH07XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyB0YWJsZSAoZ2ZtKVxuICAgICAgaWYgKHRvcCAmJiB0aGlzLmhhc1J1bGVzVGFibGVzICYmIChleGVjQXJyID0gKHRoaXMucnVsZXMgYXMgUnVsZXNCbG9ja1RhYmxlcykudGFibGUuZXhlYyhuZXh0UGFydCkpKSB7XG4gICAgICAgIG5leHRQYXJ0ID0gbmV4dFBhcnQuc3Vic3RyaW5nKGV4ZWNBcnJbMF0ubGVuZ3RoKTtcblxuICAgICAgICBjb25zdCBpdGVtOiBUb2tlbiA9IHtcbiAgICAgICAgICB0eXBlOiBUb2tlblR5cGUudGFibGUsXG4gICAgICAgICAgaGVhZGVyOiBleGVjQXJyWzFdLnJlcGxhY2UoL14gKnwgKlxcfCAqJC9nLCAnJykuc3BsaXQoLyAqXFx8ICovKSxcbiAgICAgICAgICBhbGlnbjogZXhlY0FyclsyXS5yZXBsYWNlKC9eICp8XFx8ICokL2csICcnKS5zcGxpdCgvICpcXHwgKi8pIGFzIEFsaWduW10sXG4gICAgICAgICAgY2VsbHM6IFtdLFxuICAgICAgICB9O1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbS5hbGlnbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmICgvXiAqLSs6ICokLy50ZXN0KGl0ZW0uYWxpZ25baV0pKSB7XG4gICAgICAgICAgICBpdGVtLmFsaWduW2ldID0gJ3JpZ2h0JztcbiAgICAgICAgICB9IGVsc2UgaWYgKC9eICo6LSs6ICokLy50ZXN0KGl0ZW0uYWxpZ25baV0pKSB7XG4gICAgICAgICAgICBpdGVtLmFsaWduW2ldID0gJ2NlbnRlcic7XG4gICAgICAgICAgfSBlbHNlIGlmICgvXiAqOi0rICokLy50ZXN0KGl0ZW0uYWxpZ25baV0pKSB7XG4gICAgICAgICAgICBpdGVtLmFsaWduW2ldID0gJ2xlZnQnO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpdGVtLmFsaWduW2ldID0gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0ZCA9IGV4ZWNBcnJbM10ucmVwbGFjZSgvKD86ICpcXHwgKik/XFxuJC8sICcnKS5zcGxpdCgnXFxuJyk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0ZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGl0ZW0uY2VsbHNbaV0gPSB0ZFtpXS5yZXBsYWNlKC9eICpcXHwgKnwgKlxcfCAqJC9nLCAnJykuc3BsaXQoLyAqXFx8ICovKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudG9rZW5zLnB1c2goaXRlbSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBzaW1wbGUgcnVsZXNcbiAgICAgIGlmICh0aGlzLnN0YXRpY1RoaXMuc2ltcGxlUnVsZXMubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IHNpbXBsZVJ1bGVzID0gdGhpcy5zdGF0aWNUaGlzLnNpbXBsZVJ1bGVzO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpbXBsZVJ1bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKChleGVjQXJyID0gc2ltcGxlUnVsZXNbaV0uZXhlYyhuZXh0UGFydCkpKSB7XG4gICAgICAgICAgICBuZXh0UGFydCA9IG5leHRQYXJ0LnN1YnN0cmluZyhleGVjQXJyWzBdLmxlbmd0aCk7XG4gICAgICAgICAgICBjb25zdCB0eXBlID0gJ3NpbXBsZVJ1bGUnICsgKGkgKyAxKTtcbiAgICAgICAgICAgIHRoaXMudG9rZW5zLnB1c2goeyB0eXBlLCBleGVjQXJyIH0pO1xuICAgICAgICAgICAgY29udGludWUgbWFpbkxvb3A7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIHRvcC1sZXZlbCBwYXJhZ3JhcGhcbiAgICAgIGlmICh0b3AgJiYgKGV4ZWNBcnIgPSB0aGlzLnJ1bGVzLnBhcmFncmFwaC5leGVjKG5leHRQYXJ0KSkpIHtcbiAgICAgICAgbmV4dFBhcnQgPSBuZXh0UGFydC5zdWJzdHJpbmcoZXhlY0FyclswXS5sZW5ndGgpO1xuXG4gICAgICAgIGlmIChleGVjQXJyWzFdLnNsaWNlKC0xKSA9PT0gJ1xcbicpIHtcbiAgICAgICAgICB0aGlzLnRva2Vucy5wdXNoKHtcbiAgICAgICAgICAgIHR5cGU6IFRva2VuVHlwZS5wYXJhZ3JhcGgsXG4gICAgICAgICAgICB0ZXh0OiBleGVjQXJyWzFdLnNsaWNlKDAsIC0xKSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnRva2Vucy5wdXNoKHtcbiAgICAgICAgICAgIHR5cGU6IHRoaXMudG9rZW5zLmxlbmd0aCA+IDAgPyBUb2tlblR5cGUucGFyYWdyYXBoIDogVG9rZW5UeXBlLnRleHQsXG4gICAgICAgICAgICB0ZXh0OiBleGVjQXJyWzFdLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyB0ZXh0XG4gICAgICAvLyBUb3AtbGV2ZWwgc2hvdWxkIG5ldmVyIHJlYWNoIGhlcmUuXG4gICAgICBpZiAoKGV4ZWNBcnIgPSB0aGlzLnJ1bGVzLnRleHQuZXhlYyhuZXh0UGFydCkpKSB7XG4gICAgICAgIG5leHRQYXJ0ID0gbmV4dFBhcnQuc3Vic3RyaW5nKGV4ZWNBcnJbMF0ubGVuZ3RoKTtcbiAgICAgICAgdGhpcy50b2tlbnMucHVzaCh7IHR5cGU6IFRva2VuVHlwZS50ZXh0LCB0ZXh0OiBleGVjQXJyWzBdIH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKG5leHRQYXJ0KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAnSW5maW5pdGUgbG9vcCBvbiBieXRlOiAnICsgbmV4dFBhcnQuY2hhckNvZGVBdCgwKSArIGAsIG5lYXIgdGV4dCAnJHtuZXh0UGFydC5zbGljZSgwLCAzMCl9Li4uJ2BcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4geyB0b2tlbnM6IHRoaXMudG9rZW5zLCBsaW5rczogdGhpcy5saW5rcyB9O1xuICB9XG59XG4iLCAiLyoqXG4gKiBHZW5lcmF0ZWQgYnVuZGxlIGluZGV4LiBEbyBub3QgZWRpdC5cbiAqL1xuXG5leHBvcnQgKiBmcm9tICcuL3B1YmxpYy1hcGknO1xuIiwgImltcG9ydCB7IEtFeHBvcnQgfSBmcm9tICdrLWV4cG9ydCdcbmNvbnN0IGtleCA9IG5ldyBLRXhwb3J0KCd+L0Rlc2t0b3AvcHVibGlzaCcsLy8nfi9MaWJyYXJ5L01vYmlsZSBEb2N1bWVudHMvaUNsb3Vkfm1kfm9ic2lkaWFuL0RvY3VtZW50cy9wb3J0Zm9saW8ta2lpY2hpLycsXG4gICAgICAgICAgICAnfi9EZXNrdG9wL3RlbXBsYXRlJyxcbiAgICAgICAgICAgICd+L0Rlc2t0b3AvcHVibGlzaCcpO1xua2V4LnN0YXJ0KCk7Il0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLFNBQW9CO0FBQ3BCLFdBQXNCO0FBQ3RCLFNBQW9COzs7QUNGcEIsSUFVYSxxQkFBWTtFQUl2QixZQUFZLE9BQWUsUUFBZ0IsSUFBRTtBQUMzQyxTQUFLLFNBQVMsTUFBTTtBQUNwQixTQUFLLFFBQVE7O0VBU2YsU0FBUyxXQUE0QixhQUE0QjtBQUMvRCxRQUFJLFlBQW9CLE9BQU8sZUFBZSxXQUFXLGNBQWMsWUFBWTtBQUNuRixnQkFBWSxVQUFVLFFBQVEsZ0JBQWdCLElBQUk7QUFHbEQsU0FBSyxTQUFTLEtBQUssT0FBTyxRQUFRLFdBQVcsU0FBUztBQUN0RCxXQUFPOztFQU1ULFlBQVM7QUFDUCxXQUFPLElBQUksT0FBTyxLQUFLLFFBQVEsS0FBSyxLQUFLOzs7QUN0QzdDLEFBWUEsSUFBTSxhQUFhO0FBQ25CLElBQU0sZ0JBQWdCO0FBQ3RCLElBQU0sZUFBNkI7RUFDakMsS0FBSztFQUNMLEtBQUs7RUFDTCxLQUFLO0VB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