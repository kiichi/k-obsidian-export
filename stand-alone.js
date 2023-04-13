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
  link(href, title, text) {
    if (href.startsWith("https://youtu.be/") || href.startsWith("https://www.youtube.com/watch?v=")) {
      const videoId = href.replace("https://youtu.be/", "").replace("https://www.youtube.com/watch?v=", "");
      return `
        <iframe width="560" height="315" 
        src="https://www.youtube.com/embed/${videoId}" 
        title="YouTube video player" frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        allowfullscreen></iframe>
        `;
    } else if (href.startsWith("https://www.instagram.com/p/")) {
      const instagramId = href.replace("https://www.instagram.com/p/", "").replace("/", "");
      return `
        <blockquote class="instagram-media" 
        data-instgrm-captioned 
        data-instgrm-permalink="https://www.instagram.com/reel/${instagramId}/?utm_source=ig_embed&amp;utm_campaign=loading" 
        data-instgrm-version="14" style=" 
        background:#222; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:16px;"> <a href="https://www.instagram.com/reel/ClzffW4gu7Z/?utm_source=ig_embed&amp;utm_campaign=loading" style=" background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank"> <div style=" display: flex; flex-direction: row; align-items: center;"> <div style="background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 40px; margin-right: 14px; width: 40px;"></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 100px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 60px;"></div></div></div><div style="padding: 19% 0;"></div> <div style="display:block; height:50px; margin:0 auto 12px; width:50px;"><svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-511.000000, -20.000000)" fill="#000000"><g><path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path></g></g></g></svg></div><div style="padding-top: 8px;"> <div style=" color:#3897f0; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:550; line-height:18px;">View this post on Instagram</div></div><div style="padding: 12.5% 0;"></div> <div style="display: flex; flex-direction: row; margin-bottom: 14px; align-items: center;"><div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(0px) translateY(7px);"></div> <div style="background-color: #F4F4F4; height: 12.5px; transform: rotate(-45deg) translateX(3px) translateY(1px); width: 12.5px; flex-grow: 0; margin-right: 14px; margin-left: 2px;"></div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(9px) translateY(-18px);"></div></div><div style="margin-left: 8px;"> <div style=" background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 20px; width: 20px;"></div> <div style=" width: 0; height: 0; border-top: 2px solid transparent; border-left: 6px solid #f4f4f4; border-bottom: 2px solid transparent; transform: translateX(16px) translateY(-4px) rotate(30deg)"></div></div><div style="margin-left: auto;"> <div style=" width: 0px; border-top: 8px solid #F4F4F4; border-right: 8px solid transparent; transform: translateY(16px);"></div> <div style=" background-color: #F4F4F4; flex-grow: 0; height: 12px; width: 16px; transform: translateY(-4px);"></div> <div style=" width: 0; height: 0; border-top: 8px solid #F4F4F4; border-left: 8px solid transparent; transform: translateY(-4px) translateX(8px);"></div></div></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center; margin-bottom: 24px;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 224px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 144px;"></div></div></a><p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;"><a href="https://www.instagram.com/reel/ClzffW4gu7Z/?utm_source=ig_embed&amp;utm_campaign=loading" style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none;" target="_blank">A post shared by Kiichi\u2019s Bento and Ceramics (@bentogram22)</a></p></div>
        </blockquote> 
        <script async src="//www.instagram.com/embed.js"><\/script>
        `;
    }
    return super.link(href, title, text);
  }
};
Marked.setOptions({ renderer: new MyRenderer() });
var GenericItem = class {
  constructor(inMDRaw) {
    this.mdraw = "";
    this.mdFilePath = "";
    this.htmlFilePath = "";
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
          if (!this.image) {
            this.image = path.join(inDirPath, cleaned);
          }
        } else if (line.startsWith("# ")) {
        } else {
          tmpSum += line;
        }
      }
    }
    this.summary = Marked.parse(tmpSum.length > 260 ? tmpSum.substring(0, 260) + " &mldr; " : tmpSum);
    this.filePath = inFilePath;
  }
  getDate() {
    return new Date(this.date + " ").getDate();
  }
  getMonth() {
    return new Date(this.date + " ").toLocaleString("en-US", { month: "short" }).toLocaleUpperCase();
  }
  getDateStr() {
    return new Date(this.date + " ").toLocaleDateString();
  }
  getRepeaterHtml() {
    return `
        <div class="col-md-4 bloglist ${this.tags.replace(/#/gi, "")}">
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
    this.ordnum = 0;
    this.sold = false;
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
        if (this.tags.indexOf("#sold") > -1) {
          this.sold = true;
        }
      } else if (line.startsWith("- OrdNum:")) {
        let tmpOrdNum = line.replace("- OrdNum:", "").trim();
        if (tmpOrdNum) {
          this.ordnum = parseInt(tmpOrdNum);
        }
      }
    }
    if (data["Images"].length == 0) {
      throw new Error(`Image Not Found ${this.mdraw}`);
    }
    const cleaned = data["Images"][0].replace("![](", "").replace(")", "");
    if (cleaned.indexOf("!") != -1) {
      console.error("ERROR " + this.title + " " + cleaned);
    }
    this.thumbnail = path.join(inRelativePath, cleaned);
    this.fullimage = this.thumbnail;
    this.htmlpath = inRelativeHtmlPath;
  }
  getRepeaterHtml() {
    return `
        <div class="item ${this.tags.replace(/#/ig, "")}">
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
                        <div>${this.sold ? "SOLD" : ""}</div>
                        <!-- <div>No: ${this.no}</div> -->
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
    const genTplFilePath = path.join(this.tplPath, "generic-template.html");
    const genTemplateHtml = await fs.promises.readFile(genTplFilePath, "utf-8");
    const workSrcPath = path.join(this.srcPath, "works");
    const workTplFilePath = path.join(this.tplPath, "works-template.html");
    const workDstFilePath = path.join(this.dstPath, "works.html");
    let repeaterHtmlArr = [];
    let workItems = [];
    for await (const mdfilePath of this.getFiles(workSrcPath)) {
      const htmlFilePath = mdfilePath.replace(".md", ".html");
      try {
        const contents = await fs.promises.readFile(mdfilePath, "utf-8");
        const dirpath = path.dirname(mdfilePath);
        const relativeSrcDirPath = dirpath.replace(this.srcPath, "");
        const relativeHtmlPath = htmlFilePath.replace(this.srcPath, "");
        const item = new GalleryItem(contents, relativeSrcDirPath, relativeHtmlPath);
        item.htmlFilePath = htmlFilePath;
        workItems.push(item);
      } catch (e) {
        console.error(e, htmlFilePath);
      }
    }
    workItems.sort((a, b) => b.ordnum - a.ordnum);
    for (var i = 0; i < workItems.length; i++) {
      const item = workItems[i];
      if (item.title.toLowerCase().indexOf("(draft)") === -1 && item.tags.toLocaleLowerCase().indexOf("#unlisted") === -1 && item.tags.toLocaleLowerCase().indexOf("#draft") === -1) {
        repeaterHtmlArr.push(item.getRepeaterHtml());
      }
      let genOutputHtml = genTemplateHtml.replace(/<!-- {{{CONTENT}}} -->/, item.getHtml());
      genOutputHtml = genOutputHtml.replace(/<!-- {{{COPYRIGHT}}} -->/g, "\xA9 Copyright " + new Date().getFullYear() + " - Kiichi Takeuchi");
      genOutputHtml = genOutputHtml.replace(/<!-- {{{CATEGORY}}} -->/g, "Works");
      genOutputHtml = genOutputHtml.replace(/<!-- {{{TITLE}}} -->/g, item.title);
      genOutputHtml = genOutputHtml.replace(/<!-- {{{SUBTITLE}}} -->/g, `(${item.date})`);
      genOutputHtml = genOutputHtml.replace(/{{{PAGETYPE}}}/g, "work");
      await fs.promises.writeFile(item.htmlFilePath, genOutputHtml);
    }
    let repeaterHtml = repeaterHtmlArr.join("\n");
    const galleryTemplateHtml = await fs.promises.readFile(workTplFilePath, "utf-8");
    let galleryOutputHtml = galleryTemplateHtml.replace("<!-- {{{GALLERY}}} -->", repeaterHtml);
    galleryOutputHtml = galleryOutputHtml.replace("<!-- {{{COPYRIGHT}}} -->", "\xA9 Copyright " + new Date().getFullYear() + " - Kiichi Takeuchi");
    await fs.promises.writeFile(workDstFilePath, galleryOutputHtml);
    const articleSrcPath = path.join(this.srcPath, "articles");
    const articleTplFilePath = path.join(this.tplPath, "articles-template.html");
    const articleDstFilePath = path.join(this.dstPath, "articles.html");
    let repeaterArticleHtmlArr = [];
    let articleItems = [];
    for await (const mdfilePath of this.getFiles(articleSrcPath)) {
      const htmlFilePath = mdfilePath.replace(".md", ".html");
      const contents = await fs.promises.readFile(mdfilePath, "utf-8");
      const dirpath = path.dirname(mdfilePath);
      const relativeSrcDirPath = dirpath.replace(this.srcPath, "");
      const relativeHtmlPath = htmlFilePath.replace(this.srcPath, "");
      const item = new ArticleItem(contents, relativeSrcDirPath, relativeHtmlPath);
      item.htmlFilePath = htmlFilePath;
      articleItems.push(item);
    }
    articleItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    for (var i = 0; i < articleItems.length; i++) {
      const item = articleItems[i];
      if (item.title.toLowerCase().indexOf("(draft)") === -1 && item.tags.toLocaleLowerCase().indexOf("#unlisted") === -1 && item.tags.toLocaleLowerCase().indexOf("#draft") === -1) {
        repeaterArticleHtmlArr.push(item.getRepeaterHtml());
      }
      let genOutputHtml = genTemplateHtml.replace(/<!-- {{{CONTENT}}} -->/, item.getHtml());
      genOutputHtml = genOutputHtml.replace(/<!-- {{{COPYRIGHT}}} -->/g, "\xA9 Copyright " + new Date().getFullYear() + " - Kiichi Takeuchi");
      genOutputHtml = genOutputHtml.replace(/<!-- {{{CATEGORY}}} -->/g, "Article");
      genOutputHtml = genOutputHtml.replace(/<!-- {{{TITLE}}} -->/g, item.title);
      genOutputHtml = genOutputHtml.replace(/<!-- {{{SUBTITLE}}} -->/g, `(${item.getDateStr()})`);
      genOutputHtml = genOutputHtml.replace(/{{{PAGETYPE}}}/g, "article");
      await fs.promises.writeFile(item.htmlFilePath, genOutputHtml);
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
var kex = new KExport("~/Desktop/kiichi-portfolio/public", "~/Desktop/kiichi-portfolio/public", "~/Desktop/kiichi-portfolio/public");
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiay1leHBvcnQudHMiLCAibm9kZV9tb2R1bGVzL0B0cy1zdGFjay9wcm9qZWN0cy9tYXJrZG93bi9zcmMvZXh0ZW5kLXJlZ2V4cC50cyIsICJub2RlX21vZHVsZXMvQHRzLXN0YWNrL3Byb2plY3RzL21hcmtkb3duL3NyYy9oZWxwZXJzLnRzIiwgIm5vZGVfbW9kdWxlcy9AdHMtc3RhY2svcHJvamVjdHMvbWFya2Rvd24vc3JjL2ludGVyZmFjZXMudHMiLCAibm9kZV9tb2R1bGVzL0B0cy1zdGFjay9wcm9qZWN0cy9tYXJrZG93bi9zcmMvcmVuZGVyZXIudHMiLCAibm9kZV9tb2R1bGVzL0B0cy1zdGFjay9wcm9qZWN0cy9tYXJrZG93bi9zcmMvaW5saW5lLWxleGVyLnRzIiwgIm5vZGVfbW9kdWxlcy9AdHMtc3RhY2svcHJvamVjdHMvbWFya2Rvd24vc3JjL3BhcnNlci50cyIsICJub2RlX21vZHVsZXMvQHRzLXN0YWNrL3Byb2plY3RzL21hcmtkb3duL3NyYy9tYXJrZWQudHMiLCAibm9kZV9tb2R1bGVzL0B0cy1zdGFjay9wcm9qZWN0cy9tYXJrZG93bi9zcmMvYmxvY2stbGV4ZXIudHMiLCAibm9kZV9tb2R1bGVzL0B0cy1zdGFjay9wcm9qZWN0cy9tYXJrZG93bi90cy1zdGFjay1tYXJrZG93bi50cyIsICJzdGFuZC1hbG9uZS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIG9zIGZyb20gJ29zJztcbmltcG9ydCB7IE1hcmtlZCwgUmVuZGVyZXIgfSBmcm9tICdAdHMtc3RhY2svbWFya2Rvd24nO1xuXG5jbGFzcyBNeVJlbmRlcmVyIGV4dGVuZHMgUmVuZGVyZXIge1xuICAvLyBpbWFnZSBlbWJlZCBhcyAzLUQgdmlld2VyIGlmIHRoZSBleHQgaXMgLmdsYi4gYWRkIC4vIGZvciB0aGUgcGF0aFxuICAvLyBodHRwczovL2RvYy5iYWJ5bG9uanMuY29tL2ZlYXR1cmVzL2ZlYXR1cmVzRGVlcERpdmUvYmFieWxvblZpZXdlci9kZWZhdWx0Vmlld2VyQ29uZmlnXG4gIGltYWdlKGhyZWY6IHN0cmluZywgdGl0bGU6IHN0cmluZywgdGV4dDogc3RyaW5nKTogc3RyaW5ne1xuICAgIGlmIChocmVmLmVuZHNXaXRoKCcuZ2xiJykpe1xuICAgICAgICByZXR1cm4gYDxiYWJ5bG9uIFxuICAgICAgICB0ZW1wbGF0ZXMubmF2LWJhci5wYXJhbXMubG9nby1pbWFnZT1cIi9pbWFnZXMvZmF2aWNvbi9hcHBsZS1pY29uLnBuZ1wiIFxuICAgICAgICB0ZW1wbGF0ZXMubmF2LWJhci5wYXJhbXMubG9nby10ZXh0PVwiQ29weXJpZ2h0IEtpaWNoaSBUYWtldWNoaVwiIFxuICAgICAgICB0ZW1wbGF0ZXMubmF2LWJhci5wYXJhbXMubG9nby1saW5rPVwiaHR0cHM6Ly9raWljaGl0YWtldWNoaS5jb20vXCIgXG4gICAgICAgIG1vZGVsPVwiLi8ke2hyZWZ9XCIgPjwvYmFieWxvbj5gXG4gICAgfVxuICAgIHJldHVybiBzdXBlci5pbWFnZShocmVmLHRpdGxlLHRleHQpO1xuICB9XG4gIGxpbmsoaHJlZjogc3RyaW5nLCB0aXRsZTogc3RyaW5nLCB0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGlmIChocmVmLnN0YXJ0c1dpdGgoXCJodHRwczovL3lvdXR1LmJlL1wiKSB8fCBocmVmLnN0YXJ0c1dpdGgoXCJodHRwczovL3d3dy55b3V0dWJlLmNvbS93YXRjaD92PVwiKSl7XG4gICAgICAgIGNvbnN0IHZpZGVvSWQgPSBocmVmLnJlcGxhY2UoXCJodHRwczovL3lvdXR1LmJlL1wiLCcnKS5yZXBsYWNlKFwiaHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1cIiwnJyk7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgIDxpZnJhbWUgd2lkdGg9XCI1NjBcIiBoZWlnaHQ9XCIzMTVcIiBcbiAgICAgICAgc3JjPVwiaHR0cHM6Ly93d3cueW91dHViZS5jb20vZW1iZWQvJHt2aWRlb0lkfVwiIFxuICAgICAgICB0aXRsZT1cIllvdVR1YmUgdmlkZW8gcGxheWVyXCIgZnJhbWVib3JkZXI9XCIwXCIgXG4gICAgICAgIGFsbG93PVwiYWNjZWxlcm9tZXRlcjsgYXV0b3BsYXk7IGNsaXBib2FyZC13cml0ZTsgZW5jcnlwdGVkLW1lZGlhOyBneXJvc2NvcGU7IHBpY3R1cmUtaW4tcGljdHVyZTsgd2ViLXNoYXJlXCIgXG4gICAgICAgIGFsbG93ZnVsbHNjcmVlbj48L2lmcmFtZT5cbiAgICAgICAgYDtcbiAgICB9ICAgIFxuICAgIGVsc2UgaWYgKGhyZWYuc3RhcnRzV2l0aChcImh0dHBzOi8vd3d3Lmluc3RhZ3JhbS5jb20vcC9cIikpe1xuICAgICAgICBjb25zdCBpbnN0YWdyYW1JZCA9IGhyZWYucmVwbGFjZSgnaHR0cHM6Ly93d3cuaW5zdGFncmFtLmNvbS9wLycsJycpLnJlcGxhY2UoJ1xcLycsJycpO1xuICAgICAgICByZXR1cm4gYFxuICAgICAgICA8YmxvY2txdW90ZSBjbGFzcz1cImluc3RhZ3JhbS1tZWRpYVwiIFxuICAgICAgICBkYXRhLWluc3Rncm0tY2FwdGlvbmVkIFxuICAgICAgICBkYXRhLWluc3Rncm0tcGVybWFsaW5rPVwiaHR0cHM6Ly93d3cuaW5zdGFncmFtLmNvbS9yZWVsLyR7aW5zdGFncmFtSWR9Lz91dG1fc291cmNlPWlnX2VtYmVkJmFtcDt1dG1fY2FtcGFpZ249bG9hZGluZ1wiIFxuICAgICAgICBkYXRhLWluc3Rncm0tdmVyc2lvbj1cIjE0XCIgc3R5bGU9XCIgXG4gICAgICAgIGJhY2tncm91bmQ6IzIyMjsgYm9yZGVyOjA7IGJvcmRlci1yYWRpdXM6M3B4OyBib3gtc2hhZG93OjAgMCAxcHggMCByZ2JhKDAsMCwwLDAuNSksMCAxcHggMTBweCAwIHJnYmEoMCwwLDAsMC4xNSk7IG1hcmdpbjogMXB4OyBtYXgtd2lkdGg6NTQwcHg7IG1pbi13aWR0aDozMjZweDsgcGFkZGluZzowOyB3aWR0aDo5OS4zNzUlOyB3aWR0aDotd2Via2l0LWNhbGMoMTAwJSAtIDJweCk7IHdpZHRoOmNhbGMoMTAwJSAtIDJweCk7XCI+PGRpdiBzdHlsZT1cInBhZGRpbmc6MTZweDtcIj4gPGEgaHJlZj1cImh0dHBzOi8vd3d3Lmluc3RhZ3JhbS5jb20vcmVlbC9DbHpmZlc0Z3U3Wi8/dXRtX3NvdXJjZT1pZ19lbWJlZCZhbXA7dXRtX2NhbXBhaWduPWxvYWRpbmdcIiBzdHlsZT1cIiBiYWNrZ3JvdW5kOiNGRkZGRkY7IGxpbmUtaGVpZ2h0OjA7IHBhZGRpbmc6MCAwOyB0ZXh0LWFsaWduOmNlbnRlcjsgdGV4dC1kZWNvcmF0aW9uOm5vbmU7IHdpZHRoOjEwMCU7XCIgdGFyZ2V0PVwiX2JsYW5rXCI+IDxkaXYgc3R5bGU9XCIgZGlzcGxheTogZmxleDsgZmxleC1kaXJlY3Rpb246IHJvdzsgYWxpZ24taXRlbXM6IGNlbnRlcjtcIj4gPGRpdiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6ICNGNEY0RjQ7IGJvcmRlci1yYWRpdXM6IDUwJTsgZmxleC1ncm93OiAwOyBoZWlnaHQ6IDQwcHg7IG1hcmdpbi1yaWdodDogMTRweDsgd2lkdGg6IDQwcHg7XCI+PC9kaXY+IDxkaXYgc3R5bGU9XCJkaXNwbGF5OiBmbGV4OyBmbGV4LWRpcmVjdGlvbjogY29sdW1uOyBmbGV4LWdyb3c6IDE7IGp1c3RpZnktY29udGVudDogY2VudGVyO1wiPiA8ZGl2IHN0eWxlPVwiIGJhY2tncm91bmQtY29sb3I6ICNGNEY0RjQ7IGJvcmRlci1yYWRpdXM6IDRweDsgZmxleC1ncm93OiAwOyBoZWlnaHQ6IDE0cHg7IG1hcmdpbi1ib3R0b206IDZweDsgd2lkdGg6IDEwMHB4O1wiPjwvZGl2PiA8ZGl2IHN0eWxlPVwiIGJhY2tncm91bmQtY29sb3I6ICNGNEY0RjQ7IGJvcmRlci1yYWRpdXM6IDRweDsgZmxleC1ncm93OiAwOyBoZWlnaHQ6IDE0cHg7IHdpZHRoOiA2MHB4O1wiPjwvZGl2PjwvZGl2PjwvZGl2PjxkaXYgc3R5bGU9XCJwYWRkaW5nOiAxOSUgMDtcIj48L2Rpdj4gPGRpdiBzdHlsZT1cImRpc3BsYXk6YmxvY2s7IGhlaWdodDo1MHB4OyBtYXJnaW46MCBhdXRvIDEycHg7IHdpZHRoOjUwcHg7XCI+PHN2ZyB3aWR0aD1cIjUwcHhcIiBoZWlnaHQ9XCI1MHB4XCIgdmlld0JveD1cIjAgMCA2MCA2MFwiIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHBzOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cHM6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIj48ZyBzdHJva2U9XCJub25lXCIgc3Ryb2tlLXdpZHRoPVwiMVwiIGZpbGw9XCJub25lXCIgZmlsbC1ydWxlPVwiZXZlbm9kZFwiPjxnIHRyYW5zZm9ybT1cInRyYW5zbGF0ZSgtNTExLjAwMDAwMCwgLTIwLjAwMDAwMClcIiBmaWxsPVwiIzAwMDAwMFwiPjxnPjxwYXRoIGQ9XCJNNTU2Ljg2OSwzMC40MSBDNTU0LjgxNCwzMC40MSA1NTMuMTQ4LDMyLjA3NiA1NTMuMTQ4LDM0LjEzMSBDNTUzLjE0OCwzNi4xODYgNTU0LjgxNCwzNy44NTIgNTU2Ljg2OSwzNy44NTIgQzU1OC45MjQsMzcuODUyIDU2MC41OSwzNi4xODYgNTYwLjU5LDM0LjEzMSBDNTYwLjU5LDMyLjA3NiA1NTguOTI0LDMwLjQxIDU1Ni44NjksMzAuNDEgTTU0MSw2MC42NTcgQzUzNS4xMTQsNjAuNjU3IDUzMC4zNDIsNTUuODg3IDUzMC4zNDIsNTAgQzUzMC4zNDIsNDQuMTE0IDUzNS4xMTQsMzkuMzQyIDU0MSwzOS4zNDIgQzU0Ni44ODcsMzkuMzQyIDU1MS42NTgsNDQuMTE0IDU1MS42NTgsNTAgQzU1MS42NTgsNTUuODg3IDU0Ni44ODcsNjAuNjU3IDU0MSw2MC42NTcgTTU0MSwzMy44ODYgQzUzMi4xLDMzLjg4NiA1MjQuODg2LDQxLjEgNTI0Ljg4Niw1MCBDNTI0Ljg4Niw1OC44OTkgNTMyLjEsNjYuMTEzIDU0MSw2Ni4xMTMgQzU0OS45LDY2LjExMyA1NTcuMTE1LDU4Ljg5OSA1NTcuMTE1LDUwIEM1NTcuMTE1LDQxLjEgNTQ5LjksMzMuODg2IDU0MSwzMy44ODYgTTU2NS4zNzgsNjIuMTAxIEM1NjUuMjQ0LDY1LjAyMiA1NjQuNzU2LDY2LjYwNiA1NjQuMzQ2LDY3LjY2MyBDNTYzLjgwMyw2OS4wNiA1NjMuMTU0LDcwLjA1NyA1NjIuMTA2LDcxLjEwNiBDNTYxLjA1OCw3Mi4xNTUgNTYwLjA2LDcyLjgwMyA1NTguNjYyLDczLjM0NyBDNTU3LjYwNyw3My43NTcgNTU2LjAyMSw3NC4yNDQgNTUzLjEwMiw3NC4zNzggQzU0OS45NDQsNzQuNTIxIDU0OC45OTcsNzQuNTUyIDU0MSw3NC41NTIgQzUzMy4wMDMsNzQuNTUyIDUzMi4wNTYsNzQuNTIxIDUyOC44OTgsNzQuMzc4IEM1MjUuOTc5LDc0LjI0NCA1MjQuMzkzLDczLjc1NyA1MjMuMzM4LDczLjM0NyBDNTIxLjk0LDcyLjgwMyA1MjAuOTQyLDcyLjE1NSA1MTkuODk0LDcxLjEwNiBDNTE4Ljg0Niw3MC4wNTcgNTE4LjE5Nyw2OS4wNiA1MTcuNjU0LDY3LjY2MyBDNTE3LjI0NCw2Ni42MDYgNTE2Ljc1NSw2NS4wMjIgNTE2LjYyMyw2Mi4xMDEgQzUxNi40NzksNTguOTQzIDUxNi40NDgsNTcuOTk2IDUxNi40NDgsNTAgQzUxNi40NDgsNDIuMDAzIDUxNi40NzksNDEuMDU2IDUxNi42MjMsMzcuODk5IEM1MTYuNzU1LDM0Ljk3OCA1MTcuMjQ0LDMzLjM5MSA1MTcuNjU0LDMyLjMzOCBDNTE4LjE5NywzMC45MzggNTE4Ljg0NiwyOS45NDIgNTE5Ljg5NCwyOC44OTQgQzUyMC45NDIsMjcuODQ2IDUyMS45NCwyNy4xOTYgNTIzLjMzOCwyNi42NTQgQzUyNC4zOTMsMjYuMjQ0IDUyNS45NzksMjUuNzU2IDUyOC44OTgsMjUuNjIzIEM1MzIuMDU3LDI1LjQ3OSA1MzMuMDA0LDI1LjQ0OCA1NDEsMjUuNDQ4IEM1NDguOTk3LDI1LjQ0OCA1NDkuOTQzLDI1LjQ3OSA1NTMuMTAyLDI1LjYyMyBDNTU2LjAyMSwyNS43NTYgNTU3LjYwNywyNi4yNDQgNTU4LjY2MiwyNi42NTQgQzU2MC4wNiwyNy4xOTYgNTYxLjA1OCwyNy44NDYgNTYyLjEwNiwyOC44OTQgQzU2My4xNTQsMjkuOTQyIDU2My44MDMsMzAuOTM4IDU2NC4zNDYsMzIuMzM4IEM1NjQuNzU2LDMzLjM5MSA1NjUuMjQ0LDM0Ljk3OCA1NjUuMzc4LDM3Ljg5OSBDNTY1LjUyMiw0MS4wNTYgNTY1LjU1Miw0Mi4wMDMgNTY1LjU1Miw1MCBDNTY1LjU1Miw1Ny45OTYgNTY1LjUyMiw1OC45NDMgNTY1LjM3OCw2Mi4xMDEgTTU3MC44MiwzNy42MzEgQzU3MC42NzQsMzQuNDM4IDU3MC4xNjcsMzIuMjU4IDU2OS40MjUsMzAuMzQ5IEM1NjguNjU5LDI4LjM3NyA1NjcuNjMzLDI2LjcwMiA1NjUuOTY1LDI1LjAzNSBDNTY0LjI5NywyMy4zNjggNTYyLjYyMywyMi4zNDIgNTYwLjY1MiwyMS41NzUgQzU1OC43NDMsMjAuODM0IDU1Ni41NjIsMjAuMzI2IDU1My4zNjksMjAuMTggQzU1MC4xNjksMjAuMDMzIDU0OS4xNDgsMjAgNTQxLDIwIEM1MzIuODUzLDIwIDUzMS44MzEsMjAuMDMzIDUyOC42MzEsMjAuMTggQzUyNS40MzgsMjAuMzI2IDUyMy4yNTcsMjAuODM0IDUyMS4zNDksMjEuNTc1IEM1MTkuMzc2LDIyLjM0MiA1MTcuNzAzLDIzLjM2OCA1MTYuMDM1LDI1LjAzNSBDNTE0LjM2OCwyNi43MDIgNTEzLjM0MiwyOC4zNzcgNTEyLjU3NCwzMC4zNDkgQzUxMS44MzQsMzIuMjU4IDUxMS4zMjYsMzQuNDM4IDUxMS4xODEsMzcuNjMxIEM1MTEuMDM1LDQwLjgzMSA1MTEsNDEuODUxIDUxMSw1MCBDNTExLDU4LjE0NyA1MTEuMDM1LDU5LjE3IDUxMS4xODEsNjIuMzY5IEM1MTEuMzI2LDY1LjU2MiA1MTEuODM0LDY3Ljc0MyA1MTIuNTc0LDY5LjY1MSBDNTEzLjM0Miw3MS42MjUgNTE0LjM2OCw3My4yOTYgNTE2LjAzNSw3NC45NjUgQzUxNy43MDMsNzYuNjM0IDUxOS4zNzYsNzcuNjU4IDUyMS4zNDksNzguNDI1IEM1MjMuMjU3LDc5LjE2NyA1MjUuNDM4LDc5LjY3MyA1MjguNjMxLDc5LjgyIEM1MzEuODMxLDc5Ljk2NSA1MzIuODUzLDgwLjAwMSA1NDEsODAuMDAxIEM1NDkuMTQ4LDgwLjAwMSA1NTAuMTY5LDc5Ljk2NSA1NTMuMzY5LDc5LjgyIEM1NTYuNTYyLDc5LjY3MyA1NTguNzQzLDc5LjE2NyA1NjAuNjUyLDc4LjQyNSBDNTYyLjYyMyw3Ny42NTggNTY0LjI5Nyw3Ni42MzQgNTY1Ljk2NSw3NC45NjUgQzU2Ny42MzMsNzMuMjk2IDU2OC42NTksNzEuNjI1IDU2OS40MjUsNjkuNjUxIEM1NzAuMTY3LDY3Ljc0MyA1NzAuNjc0LDY1LjU2MiA1NzAuODIsNjIuMzY5IEM1NzAuOTY2LDU5LjE3IDU3MSw1OC4xNDcgNTcxLDUwIEM1NzEsNDEuODUxIDU3MC45NjYsNDAuODMxIDU3MC44MiwzNy42MzFcIj48L3BhdGg+PC9nPjwvZz48L2c+PC9zdmc+PC9kaXY+PGRpdiBzdHlsZT1cInBhZGRpbmctdG9wOiA4cHg7XCI+IDxkaXYgc3R5bGU9XCIgY29sb3I6IzM4OTdmMDsgZm9udC1mYW1pbHk6QXJpYWwsc2Fucy1zZXJpZjsgZm9udC1zaXplOjE0cHg7IGZvbnQtc3R5bGU6bm9ybWFsOyBmb250LXdlaWdodDo1NTA7IGxpbmUtaGVpZ2h0OjE4cHg7XCI+VmlldyB0aGlzIHBvc3Qgb24gSW5zdGFncmFtPC9kaXY+PC9kaXY+PGRpdiBzdHlsZT1cInBhZGRpbmc6IDEyLjUlIDA7XCI+PC9kaXY+IDxkaXYgc3R5bGU9XCJkaXNwbGF5OiBmbGV4OyBmbGV4LWRpcmVjdGlvbjogcm93OyBtYXJnaW4tYm90dG9tOiAxNHB4OyBhbGlnbi1pdGVtczogY2VudGVyO1wiPjxkaXY+IDxkaXYgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOiAjRjRGNEY0OyBib3JkZXItcmFkaXVzOiA1MCU7IGhlaWdodDogMTIuNXB4OyB3aWR0aDogMTIuNXB4OyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMHB4KSB0cmFuc2xhdGVZKDdweCk7XCI+PC9kaXY+IDxkaXYgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOiAjRjRGNEY0OyBoZWlnaHQ6IDEyLjVweDsgdHJhbnNmb3JtOiByb3RhdGUoLTQ1ZGVnKSB0cmFuc2xhdGVYKDNweCkgdHJhbnNsYXRlWSgxcHgpOyB3aWR0aDogMTIuNXB4OyBmbGV4LWdyb3c6IDA7IG1hcmdpbi1yaWdodDogMTRweDsgbWFyZ2luLWxlZnQ6IDJweDtcIj48L2Rpdj4gPGRpdiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6ICNGNEY0RjQ7IGJvcmRlci1yYWRpdXM6IDUwJTsgaGVpZ2h0OiAxMi41cHg7IHdpZHRoOiAxMi41cHg7IHRyYW5zZm9ybTogdHJhbnNsYXRlWCg5cHgpIHRyYW5zbGF0ZVkoLTE4cHgpO1wiPjwvZGl2PjwvZGl2PjxkaXYgc3R5bGU9XCJtYXJnaW4tbGVmdDogOHB4O1wiPiA8ZGl2IHN0eWxlPVwiIGJhY2tncm91bmQtY29sb3I6ICNGNEY0RjQ7IGJvcmRlci1yYWRpdXM6IDUwJTsgZmxleC1ncm93OiAwOyBoZWlnaHQ6IDIwcHg7IHdpZHRoOiAyMHB4O1wiPjwvZGl2PiA8ZGl2IHN0eWxlPVwiIHdpZHRoOiAwOyBoZWlnaHQ6IDA7IGJvcmRlci10b3A6IDJweCBzb2xpZCB0cmFuc3BhcmVudDsgYm9yZGVyLWxlZnQ6IDZweCBzb2xpZCAjZjRmNGY0OyBib3JkZXItYm90dG9tOiAycHggc29saWQgdHJhbnNwYXJlbnQ7IHRyYW5zZm9ybTogdHJhbnNsYXRlWCgxNnB4KSB0cmFuc2xhdGVZKC00cHgpIHJvdGF0ZSgzMGRlZylcIj48L2Rpdj48L2Rpdj48ZGl2IHN0eWxlPVwibWFyZ2luLWxlZnQ6IGF1dG87XCI+IDxkaXYgc3R5bGU9XCIgd2lkdGg6IDBweDsgYm9yZGVyLXRvcDogOHB4IHNvbGlkICNGNEY0RjQ7IGJvcmRlci1yaWdodDogOHB4IHNvbGlkIHRyYW5zcGFyZW50OyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMTZweCk7XCI+PC9kaXY+IDxkaXYgc3R5bGU9XCIgYmFja2dyb3VuZC1jb2xvcjogI0Y0RjRGNDsgZmxleC1ncm93OiAwOyBoZWlnaHQ6IDEycHg7IHdpZHRoOiAxNnB4OyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTRweCk7XCI+PC9kaXY+IDxkaXYgc3R5bGU9XCIgd2lkdGg6IDA7IGhlaWdodDogMDsgYm9yZGVyLXRvcDogOHB4IHNvbGlkICNGNEY0RjQ7IGJvcmRlci1sZWZ0OiA4cHggc29saWQgdHJhbnNwYXJlbnQ7IHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNHB4KSB0cmFuc2xhdGVYKDhweCk7XCI+PC9kaXY+PC9kaXY+PC9kaXY+IDxkaXYgc3R5bGU9XCJkaXNwbGF5OiBmbGV4OyBmbGV4LWRpcmVjdGlvbjogY29sdW1uOyBmbGV4LWdyb3c6IDE7IGp1c3RpZnktY29udGVudDogY2VudGVyOyBtYXJnaW4tYm90dG9tOiAyNHB4O1wiPiA8ZGl2IHN0eWxlPVwiIGJhY2tncm91bmQtY29sb3I6ICNGNEY0RjQ7IGJvcmRlci1yYWRpdXM6IDRweDsgZmxleC1ncm93OiAwOyBoZWlnaHQ6IDE0cHg7IG1hcmdpbi1ib3R0b206IDZweDsgd2lkdGg6IDIyNHB4O1wiPjwvZGl2PiA8ZGl2IHN0eWxlPVwiIGJhY2tncm91bmQtY29sb3I6ICNGNEY0RjQ7IGJvcmRlci1yYWRpdXM6IDRweDsgZmxleC1ncm93OiAwOyBoZWlnaHQ6IDE0cHg7IHdpZHRoOiAxNDRweDtcIj48L2Rpdj48L2Rpdj48L2E+PHAgc3R5bGU9XCIgY29sb3I6I2M5YzhjZDsgZm9udC1mYW1pbHk6QXJpYWwsc2Fucy1zZXJpZjsgZm9udC1zaXplOjE0cHg7IGxpbmUtaGVpZ2h0OjE3cHg7IG1hcmdpbi1ib3R0b206MDsgbWFyZ2luLXRvcDo4cHg7IG92ZXJmbG93OmhpZGRlbjsgcGFkZGluZzo4cHggMCA3cHg7IHRleHQtYWxpZ246Y2VudGVyOyB0ZXh0LW92ZXJmbG93OmVsbGlwc2lzOyB3aGl0ZS1zcGFjZTpub3dyYXA7XCI+PGEgaHJlZj1cImh0dHBzOi8vd3d3Lmluc3RhZ3JhbS5jb20vcmVlbC9DbHpmZlc0Z3U3Wi8/dXRtX3NvdXJjZT1pZ19lbWJlZCZhbXA7dXRtX2NhbXBhaWduPWxvYWRpbmdcIiBzdHlsZT1cIiBjb2xvcjojYzljOGNkOyBmb250LWZhbWlseTpBcmlhbCxzYW5zLXNlcmlmOyBmb250LXNpemU6MTRweDsgZm9udC1zdHlsZTpub3JtYWw7IGZvbnQtd2VpZ2h0Om5vcm1hbDsgbGluZS1oZWlnaHQ6MTdweDsgdGV4dC1kZWNvcmF0aW9uOm5vbmU7XCIgdGFyZ2V0PVwiX2JsYW5rXCI+QSBwb3N0IHNoYXJlZCBieSBLaWljaGlcdTIwMTlzIEJlbnRvIGFuZCBDZXJhbWljcyAoQGJlbnRvZ3JhbTIyKTwvYT48L3A+PC9kaXY+XG4gICAgICAgIDwvYmxvY2txdW90ZT4gXG4gICAgICAgIDxzY3JpcHQgYXN5bmMgc3JjPVwiLy93d3cuaW5zdGFncmFtLmNvbS9lbWJlZC5qc1wiPjwvc2NyaXB0PlxuICAgICAgICBgO1xuICAgIH1cbiAgICByZXR1cm4gc3VwZXIubGluayhocmVmLHRpdGxlLCB0ZXh0KTtcbiAgfVxufVxuTWFya2VkLnNldE9wdGlvbnMoe3JlbmRlcmVyOiBuZXcgTXlSZW5kZXJlcn0pO1xuXG5jbGFzcyBHZW5lcmljSXRlbSB7XG4gICAgbWRyYXc6c3RyaW5nID0gJyc7XG4gICAgbWRGaWxlUGF0aDpzdHJpbmcgPSAnJztcbiAgICBodG1sRmlsZVBhdGg6c3RyaW5nID0gJyc7XG4gICAgY29uc3RydWN0b3IoaW5NRFJhdzpzdHJpbmcpe1xuICAgICAgICB0aGlzLm1kcmF3ID0gaW5NRFJhdztcbiAgICB9XG5cbiAgICBnZXRIdG1sKCl7XG4gICAgICAgIHJldHVybiBNYXJrZWQucGFyc2UodGhpcy5tZHJhdyk7XG4gICAgfVxufVxuXG5jbGFzcyBBcnRpY2xlSXRlbSBleHRlbmRzIEdlbmVyaWNJdGVtIHtcbiAgICB0aXRsZTpzdHJpbmcgPSAnJztcbiAgICBzdW1tYXJ5OnN0cmluZyA9ICcnO1xuICAgIHRhZ3M6c3RyaW5nID0gJyc7XG4gICAgZGF0ZTpzdHJpbmcgPSAnJztcbiAgICBpbWFnZTpzdHJpbmcgPSAnJztcbiAgICBmaWxlUGF0aDpzdHJpbmcgPSAnJztcblxuICAgIGNvbnN0cnVjdG9yKGluTURSYXc6c3RyaW5nLCBpbkRpclBhdGg6c3RyaW5nLCBpbkZpbGVQYXRoOnN0cmluZyl7XG4gICAgICAgIHN1cGVyKGluTURSYXcpO1xuXG4gICAgICAgIGNvbnN0IGxpbmVzID0gdGhpcy5tZHJhdy5zcGxpdCgnXFxuJykuZmlsdGVyKCh4KT0+eCk7XG4gICAgICAgIGxldCBjb3VudGVyID0gMDtcbiAgICAgICAgbGV0IHRtcFN1bSA9ICcnO1xuICAgICAgICBmb3IgKGxldCBsaW5lIG9mIGxpbmVzKXtcbiAgICAgICAgICAgIGlmIChsaW5lLnN0YXJ0c1dpdGgoJyMgJykpe1xuICAgICAgICAgICAgICAgIGlmIChjb3VudGVyID09IDApe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRpdGxlID0gbGluZS5yZXBsYWNlKCcjICcsJycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvdW50ZXIrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjb3VudGVyID09IDEpe1xuICAgICAgICAgICAgICAgIGlmIChsaW5lLnN0YXJ0c1dpdGgoJy0gRGF0ZTonKSl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0ZSA9IGxpbmUucmVwbGFjZSgnLSBEYXRlOicsJycpLnRyaW0oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobGluZS5zdGFydHNXaXRoKCctIFRhZ3M6Jykpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRhZ3MgPSBsaW5lLnJlcGxhY2UoJy0gVGFnczonLCcnKS50cmltKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGxpbmUuc3RhcnRzV2l0aCgnIVtdKCcpKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2xlYW5lZCA9IGxpbmUucmVwbGFjZSgnIVtdKCcsJycpLnJlcGxhY2UoJyknLCcnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmltYWdlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2UgPSAgcGF0aC5qb2luKGluRGlyUGF0aCwgY2xlYW5lZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobGluZS5zdGFydHNXaXRoKCcjICcpKXtcbiAgICAgICAgICAgICAgICAgICAgLy8gbm90aGluZ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdG1wU3VtICs9IGxpbmU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdW1tYXJ5ID0gTWFya2VkLnBhcnNlKCh0bXBTdW0ubGVuZ3RoID4gMjYwKSA/IHRtcFN1bS5zdWJzdHJpbmcoMCwyNjApICsgJyAmbWxkcjsgJyA6IHRtcFN1bSk7XG4gICAgICAgIHRoaXMuZmlsZVBhdGggPSBpbkZpbGVQYXRoO1xuICAgIH1cbiAgICBnZXREYXRlKCl7XG4gICAgICAgIHJldHVybiAoKG5ldyBEYXRlKHRoaXMuZGF0ZSArICcgJykpLmdldERhdGUoKSk7XG4gICAgfVxuICAgIGdldE1vbnRoKCl7ICAgICAgICBcbiAgICAgICAgcmV0dXJuIChuZXcgRGF0ZSh0aGlzLmRhdGUgKyAnICcpKS50b0xvY2FsZVN0cmluZygnZW4tVVMnLCB7bW9udGg6ICdzaG9ydCd9KS50b0xvY2FsZVVwcGVyQ2FzZSgpO1xuICAgIH1cbiAgICBnZXREYXRlU3RyKCl7XG4gICAgICAgIHJldHVybiAobmV3IERhdGUodGhpcy5kYXRlICsgJyAnKSkudG9Mb2NhbGVEYXRlU3RyaW5nKCk7XG4gICAgfVxuICAgIGdldFJlcGVhdGVySHRtbCgpe1xuICAgICAgICByZXR1cm4gYFxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTQgYmxvZ2xpc3QgJHt0aGlzLnRhZ3MucmVwbGFjZSgvIy9naSwnJyl9XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBvc3QtY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBvc3QtaW1hZ2VcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz1cIiR7dGhpcy5pbWFnZX1cIiBhbHQ9XCJcIiBkcmFnZ2FibGU9XCJmYWxzZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGF0ZS1ib3hcIj48c3BhbiBjbGFzcz1cImRheVwiPiR7dGhpcy5nZXREYXRlKCl9PC9zcGFuPiA8c3BhbiBjbGFzcz1cIm1vbnRoXCI+JHt0aGlzLmdldE1vbnRoKCl9PC9zcGFuPjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBvc3QtdGV4dFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMz48YSBocmVmPVwiJHt0aGlzLmZpbGVQYXRofVwiPiR7dGhpcy50aXRsZX08L2E+PC9oMz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicG9zdC1zdW1tYXJ5XCI+JHt0aGlzLnN1bW1hcnl9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiR7dGhpcy5maWxlUGF0aH1cIiBjbGFzcz1cImJ0bi10ZXh0XCI+UmVhZCBNb3JlPC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgXG4gICAgfVxufVxuY2xhc3MgR2FsbGVyeUl0ZW0gZXh0ZW5kcyBHZW5lcmljSXRlbSB7XG4gICAgdGl0bGU6c3RyaW5nID0gJyc7XG4gICAgdGFnczpzdHJpbmcgPSAnJztcbiAgICBkYXRlOnN0cmluZyA9ICcnO1xuICAgIHBsYWNlOnN0cmluZyA9ICcnO1xuICAgIG1lZGl1bTpzdHJpbmcgPSAnJztcbiAgICBkaW1lbnNpb25zOnN0cmluZyA9ICcnO1xuICAgIG5vOnN0cmluZyA9ICcnO1xuICAgIG9yZG51bTpudW1iZXIgPSAwO1xuICAgIHNvbGQ6Ym9vbGVhbiA9IGZhbHNlO1xuICAgIGRlc2NyaXB0aW9uOnN0cmluZyA9ICcnO1xuICAgIHRodW1ibmFpbDpzdHJpbmcgPSAnJztcbiAgICBmdWxsaW1hZ2U6c3RyaW5nID0gJyc7XG4gICAgaHRtbHBhdGg6c3RyaW5nID0gJyc7XG5cbiAgICBjb25zdHJ1Y3Rvcihpbk1EUmF3OnN0cmluZywgaW5SZWxhdGl2ZVBhdGg6c3RyaW5nLCBpblJlbGF0aXZlSHRtbFBhdGg6c3RyaW5nICl7XG4gICAgICAgIHN1cGVyKGluTURSYXcpO1xuXG4gICAgICAgIHZhciBkYXRhOmFueSA9IHt9O1xuICAgICAgICB2YXIga2V5ID0gJyc7XG4gICAgICAgIGNvbnN0IGxpbmVzID0gdGhpcy5tZHJhdy5zcGxpdCgnXFxuJykuZmlsdGVyKCh4KT0+eCk7XG5cbiAgICAgICAgZm9yIChsZXQgbGluZSBvZiBsaW5lcyl7XG4gICAgICAgICAgICBpZiAobGluZS5zdGFydHNXaXRoKCcjJykpe1xuICAgICAgICAgICAgICAgIGtleSA9IGxpbmUuc3BsaXQoJyAnKVsxXTtcbiAgICAgICAgICAgICAgICBkYXRhW2tleV0gPSBbXTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChrZXkpe1xuICAgICAgICAgICAgICAgIGRhdGFba2V5XS5wdXNoKGxpbmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuXG4gICAgICAgIGZvciAobGV0IGxpbmUgb2YgZGF0YVsnQWJvdXQnXSl7XG4gICAgICAgICAgICBpZiAobGluZS5zdGFydHNXaXRoKCctIFRpdGxlOicpKXtcbiAgICAgICAgICAgICAgICB0aGlzLnRpdGxlID0gbGluZS5yZXBsYWNlKCctIFRpdGxlOicsJycpLnRyaW0oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGxpbmUuc3RhcnRzV2l0aCgnLSBEYXRlOicpKXtcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGUgPSBsaW5lLnJlcGxhY2UoJy0gRGF0ZTonLCcnKS50cmltKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChsaW5lLnN0YXJ0c1dpdGgoJy0gUGxhY2U6Jykpe1xuICAgICAgICAgICAgICAgIHRoaXMucGxhY2UgPSBsaW5lLnJlcGxhY2UoJy0gUGxhY2U6JywnJykudHJpbSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobGluZS5zdGFydHNXaXRoKCctIE1lZGl1bTonKSl7XG4gICAgICAgICAgICAgICAgdGhpcy5tZWRpdW0gPSBsaW5lLnJlcGxhY2UoJy0gTWVkaXVtOicsJycpLnRyaW0oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGxpbmUuc3RhcnRzV2l0aCgnLSBEaW1lbnNpb25zOicpKXtcbiAgICAgICAgICAgICAgICB0aGlzLmRpbWVuc2lvbnMgPSBsaW5lLnJlcGxhY2UoJy0gRGltZW5zaW9uczonLCcnKS50cmltKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChsaW5lLnN0YXJ0c1dpdGgoJy0gTm86Jykpe1xuICAgICAgICAgICAgICAgIHRoaXMubm8gPSBsaW5lLnJlcGxhY2UoJy0gTm86JywnJykudHJpbSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobGluZS5zdGFydHNXaXRoKCctIERlc2NyaXB0aW9uOicpKXtcbiAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gbGluZS5yZXBsYWNlKCctIERlc2NyaXB0aW9uOicsJycpLnRyaW0oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGxpbmUuc3RhcnRzV2l0aCgnLSBUYWdzOicpKXtcbiAgICAgICAgICAgICAgICB0aGlzLnRhZ3MgPSBsaW5lLnJlcGxhY2UoJy0gVGFnczonLCcnKS50cmltKCk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudGFncy5pbmRleE9mKCcjc29sZCcpID4gLTEpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNvbGQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGxpbmUuc3RhcnRzV2l0aCgnLSBPcmROdW06Jykpe1xuICAgICAgICAgICAgICAgIGxldCB0bXBPcmROdW0gPSBsaW5lLnJlcGxhY2UoJy0gT3JkTnVtOicsJycpLnRyaW0oKTtcbiAgICAgICAgICAgICAgICBpZiAodG1wT3JkTnVtKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vcmRudW0gPSBwYXJzZUludCh0bXBPcmROdW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICBpZiAoZGF0YVtcIkltYWdlc1wiXS5sZW5ndGggPT0gMCl7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEltYWdlIE5vdCBGb3VuZCAke3RoaXMubWRyYXd9YCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY2xlYW5lZCA9IGRhdGFbJ0ltYWdlcyddWzBdLnJlcGxhY2UoJyFbXSgnLCcnKS5yZXBsYWNlKCcpJywnJyk7XG4gICAgICAgIGlmIChjbGVhbmVkLmluZGV4T2YoXCIhXCIpICE9IC0xKXtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFUlJPUiBcIiArIHRoaXMudGl0bGUgKyBcIiBcIiArIGNsZWFuZWQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGh1bWJuYWlsID0gcGF0aC5qb2luKGluUmVsYXRpdmVQYXRoLCBjbGVhbmVkKTtcbiAgICAgICAgdGhpcy5mdWxsaW1hZ2UgPSB0aGlzLnRodW1ibmFpbDtcbiAgICAgICAgdGhpcy5odG1scGF0aCA9IGluUmVsYXRpdmVIdG1sUGF0aDtcbiAgICB9XG5cbiAgICBnZXRSZXBlYXRlckh0bWwoKXtcbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgPGRpdiBjbGFzcz1cIml0ZW0gJHt0aGlzLnRhZ3MucmVwbGFjZSgvIy9pZywnJyl9XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGljZnJhbWVcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm92ZXJsYXlcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJpY29uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiJHt0aGlzLnRodW1ibmFpbH1cIiBkYXRhLXR5cGU9XCJwcmV0dHlQaG90b1tnYWxsZXJ5XVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1zZWFyY2ggaWNvbi12aWV3XCI+PC9pPjwvYT5cbiAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImljb25cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIke3RoaXMuaHRtbHBhdGh9XCI+PGkgY2xhc3M9XCJmYSBmYS1hbGlnbi1qdXN0aWZ5IGZhLWV4dGVybmFsLWxpbmsgaWNvbi1pbmZvXCI+PC9pPjwvYT5cbiAgICAgICAgICAgICAgICAgICAgPC9zcGFuPiBcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwZl90ZXh0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicHJvamVjdC1uYW1lXCI+JHt0aGlzLnRpdGxlfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5EYXRlOiAke3RoaXMuZGF0ZX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+UGxhY2U6ICR7dGhpcy5wbGFjZX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+TWVkaXVtOiAke3RoaXMuZGVzY3JpcHRpb259PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PkRpbWVuc2lvbnM6ICR7dGhpcy5kaW1lbnNpb25zfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj4ke3RoaXMuc29sZCA/ICdTT0xEJyA6ICcnfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSA8ZGl2Pk5vOiAke3RoaXMubm99PC9kaXY+IC0tPlxuICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuXG4gICAgICAgICAgICAgICAgPGltZyBzcmM9XCIke3RoaXMuZnVsbGltYWdlfVwiIGFsdD1cIlwiIC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIGBcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBLRXhwb3J0IHtcbiAgICBzcmNQYXRoOnN0cmluZyA9ICcnO1xuICAgIGRzdFBhdGg6c3RyaW5nID0gJyc7XG4gICAgdHBsUGF0aDpzdHJpbmcgPSAnJztcbiAgICBjb25zdHJ1Y3RvcihpblNyY1BhdGg6c3RyaW5nLCBpblRwbFBhdGg6c3RyaW5nLCBpbkRzdFBhdGg6c3RyaW5nKXtcbiAgICAgICAgdGhpcy5zcmNQYXRoID0gaW5TcmNQYXRoLnJlcGxhY2UoXCJ+XCIsb3MuaG9tZWRpcigpKTtcbiAgICAgICAgdGhpcy5kc3RQYXRoID0gaW5Ec3RQYXRoLnJlcGxhY2UoXCJ+XCIsb3MuaG9tZWRpcigpKTtcbiAgICAgICAgdGhpcy50cGxQYXRoID0gaW5UcGxQYXRoLnJlcGxhY2UoXCJ+XCIsb3MuaG9tZWRpcigpKTtcbiAgICB9XG5cbiAgICBhc3luYyBzdGFydCgpe1xuICAgICAgICBjb25zb2xlLmxvZyhcIkV4cG9ydCBTdGFydGVkLi4uLlwiKTtcblxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgICAgIC8vIEdlbmVyaWNcbiAgICAgICAgY29uc3QgZ2VuVHBsRmlsZVBhdGggPSBwYXRoLmpvaW4odGhpcy50cGxQYXRoLCdnZW5lcmljLXRlbXBsYXRlLmh0bWwnKTtcbiAgICAgICAgY29uc3QgZ2VuVGVtcGxhdGVIdG1sID0gYXdhaXQgZnMucHJvbWlzZXMucmVhZEZpbGUoZ2VuVHBsRmlsZVBhdGgsJ3V0Zi04Jyk7XG4gICAgICAgIFxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgICAgIC8vIFdvcmtzXG4gICAgICAgIC8vIDEuIEdhdGhlciBhbGwgTWV0YSBJbmZvIGFuZCBHZW5lcmF0ZSBzaW5nbGUgVGh1bWJuYWlsIEdhbGxlcnlcbiAgICAgICAgLy8gMi4gR2VuZXJhdGUgaW5kaXZpZHVhbCBwYWdlIGFuZCBkdW1wIHRoZSAuaHRtbCBuZXh0IHRvIC5tZCBmaWxlLlxuICAgICAgICAvLyAgICBJbmRpdmlkdWFsIHBhZ2Ugc2hvdWxkIGNvdmVyIGZ1bGwgaHRtbCBjb252ZXJzaW9uIHBsdXMgeW91dHViZSBvciBnbGIgXG5cbiAgICAgICAgY29uc3Qgd29ya1NyY1BhdGggPSBwYXRoLmpvaW4odGhpcy5zcmNQYXRoLCd3b3JrcycpO1xuICAgICAgICBjb25zdCB3b3JrVHBsRmlsZVBhdGggPSBwYXRoLmpvaW4odGhpcy50cGxQYXRoLCd3b3Jrcy10ZW1wbGF0ZS5odG1sJyk7XG4gICAgICAgIGNvbnN0IHdvcmtEc3RGaWxlUGF0aCA9IHBhdGguam9pbih0aGlzLmRzdFBhdGgsJ3dvcmtzLmh0bWwnKTsgICAgICAgIFxuXG4gICAgICAgIGxldCByZXBlYXRlckh0bWxBcnIgPSBbXTtcbiAgICAgICAgbGV0IHdvcmtJdGVtczpHYWxsZXJ5SXRlbVtdID0gW107XG4gICAgICAgIC8vIFdhbGsgZWFjaCAubWQgZmlsZXMgaW4gd29ya3NcbiAgICAgICAgZm9yIGF3YWl0IChjb25zdCBtZGZpbGVQYXRoIG9mIHRoaXMuZ2V0RmlsZXMod29ya1NyY1BhdGgpKSB7XG4gICAgICAgICAgICBjb25zdCBodG1sRmlsZVBhdGggPSBtZGZpbGVQYXRoLnJlcGxhY2UoJy5tZCcsJy5odG1sJyk7XG4gICAgICAgICAgICB0cnkgeyAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRlbnRzID0gYXdhaXQgZnMucHJvbWlzZXMucmVhZEZpbGUobWRmaWxlUGF0aCwndXRmLTgnKTtcbiAgICAgICAgICAgICAgICAvLyBDYWxjdWxhdGUgcmVsYXRpdmUgcGF0aCAtIGZ1bGwgcGF0aCBtaW51cyB3b3JrZm9sZGVyLiBcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGlzIG5lZWRlZCB0byBwb2ludCB0aHVtYm5haWwgaW1hZ2UgcGF0aCBmcm9tIHRoZSByb290IG9mIHdlYnNpdGUgdG8gd29ya3MvIC4uLiBmb2xkZXJcbiAgICAgICAgICAgICAgICBjb25zdCBkaXJwYXRoID0gcGF0aC5kaXJuYW1lKG1kZmlsZVBhdGgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlbGF0aXZlU3JjRGlyUGF0aCA9IGRpcnBhdGgucmVwbGFjZSh0aGlzLnNyY1BhdGgsJycpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlbGF0aXZlSHRtbFBhdGggPSBodG1sRmlsZVBhdGgucmVwbGFjZSh0aGlzLnNyY1BhdGgsJycpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBuZXcgR2FsbGVyeUl0ZW0oY29udGVudHMsIHJlbGF0aXZlU3JjRGlyUGF0aCwgcmVsYXRpdmVIdG1sUGF0aCk7XG4gICAgICAgICAgICAgICAgLy8gVEVNUDogdGhpbmsgYWJvdXQgaG93IHRvIG1hbmFnZSBhbGwgZnVsbCBwYXRoIHZzIHJlbGF0aXZlIHBhdGggKGNvbnRlbnRzIHdpc2UpXG4gICAgICAgICAgICAgICAgaXRlbS5odG1sRmlsZVBhdGggPSBodG1sRmlsZVBhdGg7XG4gICAgICAgICAgICAgICAgd29ya0l0ZW1zLnB1c2goaXRlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaChlKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGUsIGh0bWxGaWxlUGF0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuXG4gICAgICAgIC8vIExldCdzIHNvcnQhIExvb2sgSW50byBPcmROdW0gZmllbGQgaW4gbWV0YSBkYXRhLiBIaWdoZXIgTnVtYmVyIGdvZXMgdG9wLlxuICAgICAgICB3b3JrSXRlbXMuc29ydCgoYTpHYWxsZXJ5SXRlbSwgYjpHYWxsZXJ5SXRlbSk9PmIub3JkbnVtLWEub3JkbnVtKTtcblxuICAgICAgICBmb3IodmFyIGk9MDsgaTx3b3JrSXRlbXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgY29uc3QgaXRlbSA9IHdvcmtJdGVtc1tpXTtcbiAgICAgICAgICAgIGlmIChpdGVtLnRpdGxlLnRvTG93ZXJDYXNlKCkuaW5kZXhPZignKGRyYWZ0KScpID09PSAtMSAmJlxuICAgICAgICAgICAgaXRlbS50YWdzLnRvTG9jYWxlTG93ZXJDYXNlKCkuaW5kZXhPZignI3VubGlzdGVkJykgPT09IC0xICYmXG4gICAgICAgICAgICBpdGVtLnRhZ3MudG9Mb2NhbGVMb3dlckNhc2UoKS5pbmRleE9mKCcjZHJhZnQnKSA9PT0gLTEpe1xuICAgICAgICAgICAgICAgIHJlcGVhdGVySHRtbEFyci5wdXNoKGl0ZW0uZ2V0UmVwZWF0ZXJIdG1sKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhpdGVtLnRpdGxlKTtcbiAgICAgICAgICAgIC8vIEVhY2ggTUQgLT4gSFRNTFxuICAgICAgICAgICAgbGV0IGdlbk91dHB1dEh0bWwgPSBnZW5UZW1wbGF0ZUh0bWwucmVwbGFjZSgvPCEtLSB7e3tDT05URU5UfX19IC0tPi8saXRlbS5nZXRIdG1sKCkpO1xuICAgICAgICAgICAgZ2VuT3V0cHV0SHRtbCA9IGdlbk91dHB1dEh0bWwucmVwbGFjZSgvPCEtLSB7e3tDT1BZUklHSFR9fX0gLS0+L2csJ1x1MDBBOSBDb3B5cmlnaHQgJysobmV3IERhdGUoKSkuZ2V0RnVsbFllYXIoKSsnIC0gS2lpY2hpIFRha2V1Y2hpJyk7XG4gICAgICAgICAgICBnZW5PdXRwdXRIdG1sID0gZ2VuT3V0cHV0SHRtbC5yZXBsYWNlKC88IS0tIHt7e0NBVEVHT1JZfX19IC0tPi9nLCdXb3JrcycpO1xuICAgICAgICAgICAgZ2VuT3V0cHV0SHRtbCA9IGdlbk91dHB1dEh0bWwucmVwbGFjZSgvPCEtLSB7e3tUSVRMRX19fSAtLT4vZyxpdGVtLnRpdGxlKTtcbiAgICAgICAgICAgIGdlbk91dHB1dEh0bWwgPSBnZW5PdXRwdXRIdG1sLnJlcGxhY2UoLzwhLS0ge3t7U1VCVElUTEV9fX0gLS0+L2csYCgke2l0ZW0uZGF0ZX0pYCk7XG4gICAgICAgICAgICBnZW5PdXRwdXRIdG1sID0gZ2VuT3V0cHV0SHRtbC5yZXBsYWNlKC97e3tQQUdFVFlQRX19fS9nLCd3b3JrJyk7IC8vIGNsYXNzIG5hbWUgaW4gY29udGFpbmVyIHRhZ1xuICAgICAgICAgICAgYXdhaXQgZnMucHJvbWlzZXMud3JpdGVGaWxlKGl0ZW0uaHRtbEZpbGVQYXRoLGdlbk91dHB1dEh0bWwpO1xuICAgICAgICB9ICAgICAgICBcblxuICAgICAgICAvLyB3b3Jrcy5odG1sXG4gICAgICAgIGxldCByZXBlYXRlckh0bWwgPSByZXBlYXRlckh0bWxBcnIuam9pbignXFxuJyk7ICAgICAgICBcbiAgICAgICAgY29uc3QgZ2FsbGVyeVRlbXBsYXRlSHRtbCA9IGF3YWl0IGZzLnByb21pc2VzLnJlYWRGaWxlKHdvcmtUcGxGaWxlUGF0aCwndXRmLTgnKTtcbiAgICAgICAgbGV0IGdhbGxlcnlPdXRwdXRIdG1sID0gZ2FsbGVyeVRlbXBsYXRlSHRtbC5yZXBsYWNlKCc8IS0tIHt7e0dBTExFUll9fX0gLS0+JyxyZXBlYXRlckh0bWwpO1xuICAgICAgICBnYWxsZXJ5T3V0cHV0SHRtbCA9IGdhbGxlcnlPdXRwdXRIdG1sLnJlcGxhY2UoJzwhLS0ge3t7Q09QWVJJR0hUfX19IC0tPicsJ1x1MDBBOSBDb3B5cmlnaHQgJysobmV3IERhdGUoKSkuZ2V0RnVsbFllYXIoKSsnIC0gS2lpY2hpIFRha2V1Y2hpJyk7XG4gICAgICAgIGF3YWl0IGZzLnByb21pc2VzLndyaXRlRmlsZSh3b3JrRHN0RmlsZVBhdGgsZ2FsbGVyeU91dHB1dEh0bWwpO1xuXG4gICAgICAgIC8vY29uc29sZS5sb2cod29ya0RzdEZpbGVQYXRoKVxuXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgICAgICAvLyBBcnRpY2xlc1xuICAgICAgICBjb25zdCBhcnRpY2xlU3JjUGF0aCA9IHBhdGguam9pbih0aGlzLnNyY1BhdGgsJ2FydGljbGVzJyk7XG4gICAgICAgIGNvbnN0IGFydGljbGVUcGxGaWxlUGF0aCA9IHBhdGguam9pbih0aGlzLnRwbFBhdGgsJ2FydGljbGVzLXRlbXBsYXRlLmh0bWwnKTtcbiAgICAgICAgY29uc3QgYXJ0aWNsZURzdEZpbGVQYXRoID0gcGF0aC5qb2luKHRoaXMuZHN0UGF0aCwnYXJ0aWNsZXMuaHRtbCcpO1xuICAgICAgICBsZXQgcmVwZWF0ZXJBcnRpY2xlSHRtbEFyciA9IFtdO1xuXG4gICAgICAgIGxldCBhcnRpY2xlSXRlbXM6QXJ0aWNsZUl0ZW1bXSA9IFtdO1xuXG4gICAgICAgIC8vIFdhbGsgZWFjaCAubWQgZmlsZXMgaW4gd29ya3NcbiAgICAgICAgZm9yIGF3YWl0IChjb25zdCBtZGZpbGVQYXRoIG9mIHRoaXMuZ2V0RmlsZXMoYXJ0aWNsZVNyY1BhdGgpKSB7XG4gICAgICAgICAgICBjb25zdCBodG1sRmlsZVBhdGggPSBtZGZpbGVQYXRoLnJlcGxhY2UoJy5tZCcsJy5odG1sJyk7XG4gICAgICAgICAgICBjb25zdCBjb250ZW50cyA9IGF3YWl0IGZzLnByb21pc2VzLnJlYWRGaWxlKG1kZmlsZVBhdGgsJ3V0Zi04Jyk7XG4gICAgICAgICAgICAvLyBDYWxjdWxhdGUgcmVsYXRpdmUgcGF0aCAtIGZ1bGwgcGF0aCBtaW51cyB3b3JrZm9sZGVyLiBcbiAgICAgICAgICAgIC8vIHRoaXMgaXMgbmVlZGVkIHRvIHBvaW50IHRodW1ibmFpbCBpbWFnZSBwYXRoIGZyb20gdGhlIHJvb3Qgb2Ygd2Vic2l0ZSB0byB3b3Jrcy8gLi4uIGZvbGRlclxuICAgICAgICAgICAgY29uc3QgZGlycGF0aCA9IHBhdGguZGlybmFtZShtZGZpbGVQYXRoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlbGF0aXZlU3JjRGlyUGF0aCA9IGRpcnBhdGgucmVwbGFjZSh0aGlzLnNyY1BhdGgsJycpO1xuICAgICAgICAgICAgY29uc3QgcmVsYXRpdmVIdG1sUGF0aCA9IGh0bWxGaWxlUGF0aC5yZXBsYWNlKHRoaXMuc3JjUGF0aCwnJyk7XG4gICAgICAgICAgICBjb25zdCBpdGVtID0gbmV3IEFydGljbGVJdGVtKGNvbnRlbnRzLHJlbGF0aXZlU3JjRGlyUGF0aCwgcmVsYXRpdmVIdG1sUGF0aCk7XG4gICAgICAgICAgICBpdGVtLmh0bWxGaWxlUGF0aCA9IGh0bWxGaWxlUGF0aDtcbiAgICAgICAgICAgIGFydGljbGVJdGVtcy5wdXNoKGl0ZW0pO1xuICAgICAgICB9ICAgICAgICBcblxuICAgICAgICBhcnRpY2xlSXRlbXMuc29ydCgoYTpBcnRpY2xlSXRlbSwgYjpBcnRpY2xlSXRlbSk9PihuZXcgRGF0ZShiLmRhdGUpKS5nZXRUaW1lKCktKG5ldyBEYXRlKGEuZGF0ZSkpLmdldFRpbWUoKSk7XG5cbiAgICAgICAgZm9yKHZhciBpPTA7IGk8YXJ0aWNsZUl0ZW1zLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBhcnRpY2xlSXRlbXNbaV07XG4gICAgICAgICAgICAvLyBCdWlsZCB1cCB0aHVtYm5haWwgaHRtbCByZXBlYXRlclxuICAgICAgICAgICAgaWYgKGl0ZW0udGl0bGUudG9Mb3dlckNhc2UoKS5pbmRleE9mKCcoZHJhZnQpJykgPT09IC0xICYmXG4gICAgICAgICAgICAgICAgaXRlbS50YWdzLnRvTG9jYWxlTG93ZXJDYXNlKCkuaW5kZXhPZignI3VubGlzdGVkJykgPT09IC0xICYmXG4gICAgICAgICAgICAgICAgaXRlbS50YWdzLnRvTG9jYWxlTG93ZXJDYXNlKCkuaW5kZXhPZignI2RyYWZ0JykgPT09IC0xKXtcbiAgICAgICAgICAgICAgICByZXBlYXRlckFydGljbGVIdG1sQXJyLnB1c2goaXRlbS5nZXRSZXBlYXRlckh0bWwoKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEVhY2ggTUQgLT4gSFRNTFxuICAgICAgICAgICAgbGV0IGdlbk91dHB1dEh0bWwgPSBnZW5UZW1wbGF0ZUh0bWwucmVwbGFjZSgvPCEtLSB7e3tDT05URU5UfX19IC0tPi8saXRlbS5nZXRIdG1sKCkpO1xuICAgICAgICAgICAgZ2VuT3V0cHV0SHRtbCA9IGdlbk91dHB1dEh0bWwucmVwbGFjZSgvPCEtLSB7e3tDT1BZUklHSFR9fX0gLS0+L2csJ1x1MDBBOSBDb3B5cmlnaHQgJysobmV3IERhdGUoKSkuZ2V0RnVsbFllYXIoKSsnIC0gS2lpY2hpIFRha2V1Y2hpJyk7XG4gICAgICAgICAgICBnZW5PdXRwdXRIdG1sID0gZ2VuT3V0cHV0SHRtbC5yZXBsYWNlKC88IS0tIHt7e0NBVEVHT1JZfX19IC0tPi9nLCdBcnRpY2xlJyk7XG4gICAgICAgICAgICBnZW5PdXRwdXRIdG1sID0gZ2VuT3V0cHV0SHRtbC5yZXBsYWNlKC88IS0tIHt7e1RJVExFfX19IC0tPi9nLGl0ZW0udGl0bGUpO1xuICAgICAgICAgICAgZ2VuT3V0cHV0SHRtbCA9IGdlbk91dHB1dEh0bWwucmVwbGFjZSgvPCEtLSB7e3tTVUJUSVRMRX19fSAtLT4vZyxgKCR7aXRlbS5nZXREYXRlU3RyKCl9KWApO1xuICAgICAgICAgICAgZ2VuT3V0cHV0SHRtbCA9IGdlbk91dHB1dEh0bWwucmVwbGFjZSgve3t7UEFHRVRZUEV9fX0vZywnYXJ0aWNsZScpOyAvLyBjbGFzcyBuYW1lIGluIGNvbnRhaW5lciB0YWdcbiAgICAgICAgICAgIC8vZ2VuT3V0cHV0SHRtbCA9IGdlbk91dHB1dEh0bWwucmVwbGFjZSgvPCEtLSB7e3tNRFJBV319fSAtLT4vZyxgJHtnZW5JdGVtLm1kcmF3fWApOyAvLyBodHRwczovL2dpdGh1Yi5jb20vbWFya21hcC9tYXJrbWFwL3RyZWUvbWFzdGVyL3BhY2thZ2VzL21hcmttYXAtYXV0b2xvYWRlclxuICAgICAgICAgICAgYXdhaXQgZnMucHJvbWlzZXMud3JpdGVGaWxlKGl0ZW0uaHRtbEZpbGVQYXRoLGdlbk91dHB1dEh0bWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gYXJ0aWNsZXMuaHRtbFxuICAgICAgICBjb25zdCByZXBlYXRlckFydGljbGVIdG1sID0gcmVwZWF0ZXJBcnRpY2xlSHRtbEFyci5qb2luKCdcXG4nKTsgICAgICAgIFxuICAgICAgICBjb25zdCBhcnRpY2xlVGVtcGxhdGVIdG1sID0gYXdhaXQgZnMucHJvbWlzZXMucmVhZEZpbGUoYXJ0aWNsZVRwbEZpbGVQYXRoLCd1dGYtOCcpO1xuICAgICAgICBsZXQgYXJ0aWNsZU91dHB1dEh0bWwgPSBhcnRpY2xlVGVtcGxhdGVIdG1sLnJlcGxhY2UoJzwhLS0ge3t7QVJUSUNMRVN9fX0gLS0+JyxyZXBlYXRlckFydGljbGVIdG1sKTtcbiAgICAgICAgYXJ0aWNsZU91dHB1dEh0bWwgPSBhcnRpY2xlT3V0cHV0SHRtbC5yZXBsYWNlKCc8IS0tIHt7e0NPUFlSSUdIVH19fSAtLT4nLCdcdTAwQTkgQ29weXJpZ2h0ICcrKG5ldyBEYXRlKCkpLmdldEZ1bGxZZWFyKCkrJyAtIEtpaWNoaSBUYWtldWNoaScpO1xuICAgICAgICBhd2FpdCBmcy5wcm9taXNlcy53cml0ZUZpbGUoYXJ0aWNsZURzdEZpbGVQYXRoLGFydGljbGVPdXRwdXRIdG1sKTtcblxuICAgICAgICBcblxuICAgICAgICBjb25zb2xlLmxvZyhcIkV4cG9ydCBFbmRlZC4uLi5cIik7XG4gICAgfVxuXG4gICAgYXN5bmMgKmdldEZpbGVzKGRpcjpzdHJpbmcpOmFueSB7XG4gICAgICAgIGNvbnN0IGRpcmVudHMgPSBhd2FpdCBmcy5wcm9taXNlcy5yZWFkZGlyKGRpciwgeyB3aXRoRmlsZVR5cGVzOiB0cnVlIH0pO1xuICAgICAgICBmb3IgKGNvbnN0IGRpcmVudCBvZiBkaXJlbnRzKSB7XG4gICAgICAgICAgY29uc3QgcmVzID0gcGF0aC5yZXNvbHZlKGRpciwgZGlyZW50Lm5hbWUpO1xuICAgICAgICAgIGlmIChkaXJlbnQuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICAgICAgeWllbGQqIHRoaXMuZ2V0RmlsZXMocmVzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZihkaXJlbnQubmFtZS5lbmRzV2l0aChcIi5tZFwiKSl7XG4gICAgICAgICAgICB5aWVsZCByZXM7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIGVsc2UgeyAvLyBkbyBub3RoaW5nIH0gXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBcbn0iLCAiLypcbiAqIEBsaWNlbnNlXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDExLTIwMTQsIENocmlzdG9waGVyIEplZmZyZXkuIChNSVQgTGljZW5zZWQpXG4gKiBodHRwczovL2dpdGh1Yi5jb20vY2hqai9tYXJrZWRcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTgtMjAyMSwgXHUwNDFBXHUwNDNFXHUwNDQxXHUwNDQyXHUwNDRGIFx1MDQyMlx1MDQ0MFx1MDQzNVx1MDQ0Mlx1MDQ0Rlx1MDQzQS4gKE1JVCBMaWNlbnNlZClcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS90cy1zdGFjay9tYXJrZG93blxuICovXG5cbmV4cG9ydCBjbGFzcyBFeHRlbmRSZWdleHAge1xuICBwcml2YXRlIHNvdXJjZTogc3RyaW5nO1xuICBwcml2YXRlIGZsYWdzOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IocmVnZXg6IFJlZ0V4cCwgZmxhZ3M6IHN0cmluZyA9ICcnKSB7XG4gICAgdGhpcy5zb3VyY2UgPSByZWdleC5zb3VyY2U7XG4gICAgdGhpcy5mbGFncyA9IGZsYWdzO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4dGVuZCByZWd1bGFyIGV4cHJlc3Npb24uXG4gICAqXG4gICAqIEBwYXJhbSBncm91cE5hbWUgUmVndWxhciBleHByZXNzaW9uIGZvciBzZWFyY2ggYSBncm91cCBuYW1lLlxuICAgKiBAcGFyYW0gZ3JvdXBSZWdleHAgUmVndWxhciBleHByZXNzaW9uIG9mIG5hbWVkIGdyb3VwLlxuICAgKi9cbiAgc2V0R3JvdXAoZ3JvdXBOYW1lOiBSZWdFeHAgfCBzdHJpbmcsIGdyb3VwUmVnZXhwOiBSZWdFeHAgfCBzdHJpbmcpOiB0aGlzIHtcbiAgICBsZXQgbmV3UmVnZXhwOiBzdHJpbmcgPSB0eXBlb2YgZ3JvdXBSZWdleHAgPT0gJ3N0cmluZycgPyBncm91cFJlZ2V4cCA6IGdyb3VwUmVnZXhwLnNvdXJjZTtcbiAgICBuZXdSZWdleHAgPSBuZXdSZWdleHAucmVwbGFjZSgvKF58W15cXFtdKVxcXi9nLCAnJDEnKTtcblxuICAgIC8vIEV4dGVuZCByZWdleHAuXG4gICAgdGhpcy5zb3VyY2UgPSB0aGlzLnNvdXJjZS5yZXBsYWNlKGdyb3VwTmFtZSwgbmV3UmVnZXhwKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgcmVzdWx0IG9mIGV4dGVuZGluZyBhIHJlZ3VsYXIgZXhwcmVzc2lvbi5cbiAgICovXG4gIGdldFJlZ2V4cCgpOiBSZWdFeHAge1xuICAgIHJldHVybiBuZXcgUmVnRXhwKHRoaXMuc291cmNlLCB0aGlzLmZsYWdzKTtcbiAgfVxufVxuIiwgIi8qKlxuICogQGxpY2Vuc2VcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTEtMjAxNCwgQ2hyaXN0b3BoZXIgSmVmZnJleS4gKE1JVCBMaWNlbnNlZClcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9jaGpqL21hcmtlZFxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxOC0yMDIxLCBcdTA0MUFcdTA0M0VcdTA0NDFcdTA0NDJcdTA0NEYgXHUwNDIyXHUwNDQwXHUwNDM1XHUwNDQyXHUwNDRGXHUwNDNBLiAoTUlUIExpY2Vuc2VkKVxuICogaHR0cHM6Ly9naXRodWIuY29tL3RzLXN0YWNrL21hcmtkb3duXG4gKi9cblxuaW1wb3J0IHsgUmVwbGFjZW1lbnRzIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcblxuY29uc3QgZXNjYXBlVGVzdCA9IC9bJjw+XCInXS87XG5jb25zdCBlc2NhcGVSZXBsYWNlID0gL1smPD5cIiddL2c7XG5jb25zdCByZXBsYWNlbWVudHM6IFJlcGxhY2VtZW50cyA9IHtcbiAgJyYnOiAnJmFtcDsnLFxuICAnPCc6ICcmbHQ7JyxcbiAgJz4nOiAnJmd0OycsXG4gICdcIic6ICcmcXVvdDsnLFxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6cXVvdGVtYXJrXG4gIFwiJ1wiOiAnJiMzOTsnLFxufTtcblxuY29uc3QgZXNjYXBlVGVzdE5vRW5jb2RlID0gL1s8PlwiJ118Jig/ISM/XFx3KzspLztcbmNvbnN0IGVzY2FwZVJlcGxhY2VOb0VuY29kZSA9IC9bPD5cIiddfCYoPyEjP1xcdys7KS9nO1xuXG5leHBvcnQgZnVuY3Rpb24gZXNjYXBlKGh0bWw6IHN0cmluZywgZW5jb2RlPzogYm9vbGVhbikge1xuICBpZiAoZW5jb2RlKSB7XG4gICAgaWYgKGVzY2FwZVRlc3QudGVzdChodG1sKSkge1xuICAgICAgcmV0dXJuIGh0bWwucmVwbGFjZShlc2NhcGVSZXBsYWNlLCAoY2g6IHN0cmluZykgPT4gcmVwbGFjZW1lbnRzW2NoXSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChlc2NhcGVUZXN0Tm9FbmNvZGUudGVzdChodG1sKSkge1xuICAgICAgcmV0dXJuIGh0bWwucmVwbGFjZShlc2NhcGVSZXBsYWNlTm9FbmNvZGUsIChjaDogc3RyaW5nKSA9PiByZXBsYWNlbWVudHNbY2hdKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gaHRtbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVuZXNjYXBlKGh0bWw6IHN0cmluZykge1xuICAvLyBFeHBsaWNpdGx5IG1hdGNoIGRlY2ltYWwsIGhleCwgYW5kIG5hbWVkIEhUTUwgZW50aXRpZXNcbiAgcmV0dXJuIGh0bWwucmVwbGFjZSgvJigjKD86XFxkKyl8KD86I3hbMC05QS1GYS1mXSspfCg/OlxcdyspKTs/L2dpLCBmdW5jdGlvbiAoXywgbikge1xuICAgIG4gPSBuLnRvTG93ZXJDYXNlKCk7XG5cbiAgICBpZiAobiA9PT0gJ2NvbG9uJykge1xuICAgICAgcmV0dXJuICc6JztcbiAgICB9XG5cbiAgICBpZiAobi5jaGFyQXQoMCkgPT09ICcjJykge1xuICAgICAgcmV0dXJuIG4uY2hhckF0KDEpID09PSAneCdcbiAgICAgICAgPyBTdHJpbmcuZnJvbUNoYXJDb2RlKHBhcnNlSW50KG4uc3Vic3RyaW5nKDIpLCAxNikpXG4gICAgICAgIDogU3RyaW5nLmZyb21DaGFyQ29kZSgrbi5zdWJzdHJpbmcoMSkpO1xuICAgIH1cblxuICAgIHJldHVybiAnJztcbiAgfSk7XG59XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxOC0yMDIxLCBcdTA0MUFcdTA0M0VcdTA0NDFcdTA0NDJcdTA0NEYgXHUwNDIyXHUwNDQwXHUwNDM1XHUwNDQyXHUwNDRGXHUwNDNBLiAoTUlUIExpY2Vuc2VkKVxuICogaHR0cHM6Ly9naXRodWIuY29tL3RzLXN0YWNrL21hcmtkb3duXG4gKi9cblxuaW1wb3J0IHsgZXNjYXBlLCB1bmVzY2FwZSB9IGZyb20gJy4vaGVscGVycyc7XG5pbXBvcnQgeyBSZW5kZXJlciB9IGZyb20gJy4vcmVuZGVyZXInO1xuXG5leHBvcnQgaW50ZXJmYWNlIE9iaiB7XG4gIFtrZXk6IHN0cmluZ106IGFueTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSdWxlc0Jsb2NrQmFzZSB7XG4gIG5ld2xpbmU6IFJlZ0V4cDtcbiAgY29kZTogUmVnRXhwO1xuICBocjogUmVnRXhwO1xuICBoZWFkaW5nOiBSZWdFeHA7XG4gIGxoZWFkaW5nOiBSZWdFeHA7XG4gIGJsb2NrcXVvdGU6IFJlZ0V4cDtcbiAgbGlzdDogUmVnRXhwO1xuICBodG1sOiBSZWdFeHA7XG4gIGRlZjogUmVnRXhwO1xuICBwYXJhZ3JhcGg6IFJlZ0V4cDtcbiAgdGV4dDogUmVnRXhwO1xuICBidWxsZXQ6IFJlZ0V4cDtcbiAgLyoqXG4gICAqIExpc3QgaXRlbSAoPGxpPikuXG4gICAqL1xuICBpdGVtOiBSZWdFeHA7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUnVsZXNCbG9ja0dmbSBleHRlbmRzIFJ1bGVzQmxvY2tCYXNlIHtcbiAgZmVuY2VzOiBSZWdFeHA7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUnVsZXNCbG9ja1RhYmxlcyBleHRlbmRzIFJ1bGVzQmxvY2tHZm0ge1xuICBucHRhYmxlOiBSZWdFeHA7XG4gIHRhYmxlOiBSZWdFeHA7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGluayB7XG4gIGhyZWY6IHN0cmluZztcbiAgdGl0bGU6IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBMaW5rcyB7XG4gIFtrZXk6IHN0cmluZ106IExpbms7XG59XG5cbmV4cG9ydCBlbnVtIFRva2VuVHlwZSB7XG4gIHNwYWNlID0gMSxcbiAgdGV4dCxcbiAgcGFyYWdyYXBoLFxuICBoZWFkaW5nLFxuICBsaXN0U3RhcnQsXG4gIGxpc3RFbmQsXG4gIGxvb3NlSXRlbVN0YXJ0LFxuICBsb29zZUl0ZW1FbmQsXG4gIGxpc3RJdGVtU3RhcnQsXG4gIGxpc3RJdGVtRW5kLFxuICBibG9ja3F1b3RlU3RhcnQsXG4gIGJsb2NrcXVvdGVFbmQsXG4gIGNvZGUsXG4gIHRhYmxlLFxuICBodG1sLFxuICBoclxufVxuXG5leHBvcnQgdHlwZSBBbGlnbiA9ICdjZW50ZXInIHwgJ2xlZnQnIHwgJ3JpZ2h0JztcblxuZXhwb3J0IGludGVyZmFjZSBUb2tlbiB7XG4gIHR5cGU6IG51bWJlciB8IHN0cmluZztcbiAgdGV4dD86IHN0cmluZztcbiAgbGFuZz86IHN0cmluZztcbiAgLyoqXG4gICAqIE1ldGFkYXRhIG9mIGdmbSBjb2RlLlxuICAgKi9cbiAgbWV0YT86IHN0cmluZztcbiAgZGVwdGg/OiBudW1iZXI7XG4gIGhlYWRlcj86IHN0cmluZ1tdO1xuICBhbGlnbj86IEFsaWduW107XG4gIGNlbGxzPzogc3RyaW5nW11bXTtcbiAgb3JkZXJlZD86IGJvb2xlYW47XG4gIHByZT86IGJvb2xlYW47XG4gIGVzY2FwZWQ/OiBib29sZWFuO1xuICBleGVjQXJyPzogUmVnRXhwRXhlY0FycmF5O1xuICAvKipcbiAgICogVXNlZCBmb3IgZGVidWdnaW5nLiBJZGVudGlmaWVzIHRoZSBsaW5lIG51bWJlciBpbiB0aGUgcmVzdWx0aW5nIEhUTUwgZmlsZS5cbiAgICovXG4gIGxpbmU/OiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUnVsZXNJbmxpbmVCYXNlIHtcbiAgZXNjYXBlOiBSZWdFeHA7XG4gIGF1dG9saW5rOiBSZWdFeHA7XG4gIHRhZzogUmVnRXhwO1xuICBsaW5rOiBSZWdFeHA7XG4gIHJlZmxpbms6IFJlZ0V4cDtcbiAgbm9saW5rOiBSZWdFeHA7XG4gIHN0cm9uZzogUmVnRXhwO1xuICBlbTogUmVnRXhwO1xuICBjb2RlOiBSZWdFeHA7XG4gIGJyOiBSZWdFeHA7XG4gIHRleHQ6IFJlZ0V4cDtcbiAgX2luc2lkZTogUmVnRXhwO1xuICBfaHJlZjogUmVnRXhwO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJ1bGVzSW5saW5lUGVkYW50aWMgZXh0ZW5kcyBSdWxlc0lubGluZUJhc2Uge31cblxuLyoqXG4gKiBHRk0gSW5saW5lIEdyYW1tYXJcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSdWxlc0lubGluZUdmbSBleHRlbmRzIFJ1bGVzSW5saW5lQmFzZSB7XG4gIHVybDogUmVnRXhwO1xuICBkZWw6IFJlZ0V4cDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSdWxlc0lubGluZUJyZWFrcyBleHRlbmRzIFJ1bGVzSW5saW5lR2ZtIHt9XG5cbmV4cG9ydCBjbGFzcyBNYXJrZWRPcHRpb25zIHtcbiAgZ2ZtPzogYm9vbGVhbiA9IHRydWU7XG4gIHRhYmxlcz86IGJvb2xlYW4gPSB0cnVlO1xuICBicmVha3M/OiBib29sZWFuID0gZmFsc2U7XG4gIHBlZGFudGljPzogYm9vbGVhbiA9IGZhbHNlO1xuICBzYW5pdGl6ZT86IGJvb2xlYW4gPSBmYWxzZTtcbiAgc2FuaXRpemVyPzogKHRleHQ6IHN0cmluZykgPT4gc3RyaW5nO1xuICBtYW5nbGU/OiBib29sZWFuID0gdHJ1ZTtcbiAgc21hcnRMaXN0cz86IGJvb2xlYW4gPSBmYWxzZTtcbiAgc2lsZW50PzogYm9vbGVhbiA9IGZhbHNlO1xuICAvKipcbiAgICogQHBhcmFtIGNvZGUgVGhlIHNlY3Rpb24gb2YgY29kZSB0byBwYXNzIHRvIHRoZSBoaWdobGlnaHRlci5cbiAgICogQHBhcmFtIGxhbmcgVGhlIHByb2dyYW1taW5nIGxhbmd1YWdlIHNwZWNpZmllZCBpbiB0aGUgY29kZSBibG9jay5cbiAgICovXG4gIGhpZ2hsaWdodD86IChjb2RlOiBzdHJpbmcsIGxhbmc/OiBzdHJpbmcpID0+IHN0cmluZztcbiAgbGFuZ1ByZWZpeD86IHN0cmluZyA9ICdsYW5nLSc7XG4gIHNtYXJ0eXBhbnRzPzogYm9vbGVhbiA9IGZhbHNlO1xuICBoZWFkZXJQcmVmaXg/OiBzdHJpbmcgPSAnJztcbiAgLyoqXG4gICAqIEFuIG9iamVjdCBjb250YWluaW5nIGZ1bmN0aW9ucyB0byByZW5kZXIgdG9rZW5zIHRvIEhUTUwuIERlZmF1bHQ6IGBuZXcgUmVuZGVyZXIoKWBcbiAgICovXG4gIHJlbmRlcmVyPzogUmVuZGVyZXI7XG4gIC8qKlxuICAgKiBTZWxmLWNsb3NlIHRoZSB0YWdzIGZvciB2b2lkIGVsZW1lbnRzICgmbHQ7YnIvJmd0OywgJmx0O2ltZy8mZ3Q7LCBldGMuKVxuICAgKiB3aXRoIGEgXCIvXCIgYXMgcmVxdWlyZWQgYnkgWEhUTUwuXG4gICAqL1xuICB4aHRtbD86IGJvb2xlYW4gPSBmYWxzZTtcbiAgLyoqXG4gICAqIFRoZSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgdXNpbmcgdG8gZXNjYXBlIEhUTUwgZW50aXRpZXMuXG4gICAqIEJ5IGRlZmF1bHQgdXNpbmcgaW5uZXIgaGVscGVyLlxuICAgKi9cbiAgZXNjYXBlPzogKGh0bWw6IHN0cmluZywgZW5jb2RlPzogYm9vbGVhbikgPT4gc3RyaW5nID0gZXNjYXBlO1xuICAvKipcbiAgICogVGhlIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSB1c2luZyB0byB1bmVzY2FwZSBIVE1MIGVudGl0aWVzLlxuICAgKiBCeSBkZWZhdWx0IHVzaW5nIGlubmVyIGhlbHBlci5cbiAgICovXG4gIHVuZXNjYXBlPzogKGh0bWw6IHN0cmluZykgPT4gc3RyaW5nID0gdW5lc2NhcGU7XG4gIC8qKlxuICAgKiBJZiBzZXQgdG8gYHRydWVgLCBhbiBpbmxpbmUgdGV4dCB3aWxsIG5vdCBiZSB0YWtlbiBpbiBwYXJhZ3JhcGguXG4gICAqXG4gICAqIGBgYHRzXG4gICAqIC8vIGlzTm9QID09IGZhbHNlXG4gICAqIE1hcmtlZC5wYXJzZSgnc29tZSB0ZXh0Jyk7IC8vIHJldHVybnMgJzxwPnNvbWUgdGV4dDwvcD4nXG4gICAqXG4gICAqIE1hcmtlZC5zZXRPcHRpb25zKHtpc05vUDogdHJ1ZX0pO1xuICAgKlxuICAgKiBNYXJrZWQucGFyc2UoJ3NvbWUgdGV4dCcpOyAvLyByZXR1cm5zICdzb21lIHRleHQnXG4gICAqIGBgYFxuICAgKi9cbiAgaXNOb1A/OiBib29sZWFuO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIExleGVyUmV0dXJucyB7XG4gIHRva2VuczogVG9rZW5bXTtcbiAgbGlua3M6IExpbmtzO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIERlYnVnUmV0dXJucyBleHRlbmRzIExleGVyUmV0dXJucyB7XG4gIHJlc3VsdDogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJlcGxhY2VtZW50cyB7XG4gIFtrZXk6IHN0cmluZ106IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSdWxlc0lubGluZUNhbGxiYWNrIHtcbiAgcmVnZXhwPzogUmVnRXhwO1xuICBjb25kaXRpb24oKTogUmVnRXhwO1xuICB0b2tlbml6ZShleGVjQXJyOiBSZWdFeHBFeGVjQXJyYXkpOiB2b2lkO1xufVxuXG5leHBvcnQgdHlwZSBTaW1wbGVSZW5kZXJlciA9IChleGVjQXJyPzogUmVnRXhwRXhlY0FycmF5KSA9PiBzdHJpbmc7XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxMS0yMDE0LCBDaHJpc3RvcGhlciBKZWZmcmV5LiAoTUlUIExpY2Vuc2VkKVxuICogaHR0cHM6Ly9naXRodWIuY29tL2NoamovbWFya2VkXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE4LTIwMjEsIFx1MDQxQVx1MDQzRVx1MDQ0MVx1MDQ0Mlx1MDQ0RiBcdTA0MjJcdTA0NDBcdTA0MzVcdTA0NDJcdTA0NEZcdTA0M0EuIChNSVQgTGljZW5zZWQpXG4gKiBodHRwczovL2dpdGh1Yi5jb20vdHMtc3RhY2svbWFya2Rvd25cbiAqL1xuXG5pbXBvcnQgeyBBbGlnbiwgTWFya2VkT3B0aW9ucyB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBNYXJrZWQgfSBmcm9tICcuL21hcmtlZCc7XG5cbmV4cG9ydCBjbGFzcyBSZW5kZXJlciB7XG4gIHByb3RlY3RlZCBvcHRpb25zOiBNYXJrZWRPcHRpb25zO1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM/OiBNYXJrZWRPcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCBNYXJrZWQub3B0aW9ucztcbiAgfVxuXG4gIGNvZGUoY29kZTogc3RyaW5nLCBsYW5nPzogc3RyaW5nLCBlc2NhcGVkPzogYm9vbGVhbiwgbWV0YT86IHN0cmluZyk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5oaWdobGlnaHQpIHtcbiAgICAgIGNvbnN0IG91dCA9IHRoaXMub3B0aW9ucy5oaWdobGlnaHQoY29kZSwgbGFuZyk7XG5cbiAgICAgIGlmIChvdXQgIT0gbnVsbCAmJiBvdXQgIT09IGNvZGUpIHtcbiAgICAgICAgZXNjYXBlZCA9IHRydWU7XG4gICAgICAgIGNvZGUgPSBvdXQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgZXNjYXBlZENvZGUgPSAoZXNjYXBlZCA/IGNvZGUgOiB0aGlzLm9wdGlvbnMuZXNjYXBlKGNvZGUsIHRydWUpKTtcblxuICAgIGlmICghbGFuZykge1xuICAgICAgcmV0dXJuIGBcXG48cHJlPjxjb2RlPiR7ZXNjYXBlZENvZGV9XFxuPC9jb2RlPjwvcHJlPlxcbmA7XG4gICAgfVxuXG4gICAgY29uc3QgY2xhc3NOYW1lID0gdGhpcy5vcHRpb25zLmxhbmdQcmVmaXggKyB0aGlzLm9wdGlvbnMuZXNjYXBlKGxhbmcsIHRydWUpO1xuICAgIHJldHVybiBgXFxuPHByZT48Y29kZSBjbGFzcz1cIiR7Y2xhc3NOYW1lfVwiPiR7ZXNjYXBlZENvZGV9XFxuPC9jb2RlPjwvcHJlPlxcbmA7XG4gIH1cblxuICBibG9ja3F1b3RlKHF1b3RlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBgPGJsb2NrcXVvdGU+XFxuJHtxdW90ZX08L2Jsb2NrcXVvdGU+XFxuYDtcbiAgfVxuXG4gIGh0bWwoaHRtbDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gaHRtbDtcbiAgfVxuXG4gIGhlYWRpbmcodGV4dDogc3RyaW5nLCBsZXZlbDogbnVtYmVyLCByYXc6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgaWQ6IHN0cmluZyA9IHRoaXMub3B0aW9ucy5oZWFkZXJQcmVmaXggKyByYXcudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9bXlxcd10rL2csICctJyk7XG5cbiAgICByZXR1cm4gYDxoJHtsZXZlbH0gaWQ9XCIke2lkfVwiPiR7dGV4dH08L2gke2xldmVsfT5cXG5gO1xuICB9XG5cbiAgaHIoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLnhodG1sID8gJzxoci8+XFxuJyA6ICc8aHI+XFxuJztcbiAgfVxuXG4gIGxpc3QoYm9keTogc3RyaW5nLCBvcmRlcmVkPzogYm9vbGVhbik6IHN0cmluZyB7XG4gICAgY29uc3QgdHlwZSA9IG9yZGVyZWQgPyAnb2wnIDogJ3VsJztcblxuICAgIHJldHVybiBgXFxuPCR7dHlwZX0+XFxuJHtib2R5fTwvJHt0eXBlfT5cXG5gO1xuICB9XG5cbiAgbGlzdGl0ZW0odGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gJzxsaT4nICsgdGV4dCArICc8L2xpPlxcbic7XG4gIH1cblxuICBwYXJhZ3JhcGgodGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gJzxwPicgKyB0ZXh0ICsgJzwvcD5cXG4nO1xuICB9XG5cbiAgdGFibGUoaGVhZGVyOiBzdHJpbmcsIGJvZHk6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGBcbjx0YWJsZT5cbjx0aGVhZD5cbiR7aGVhZGVyfTwvdGhlYWQ+XG48dGJvZHk+XG4ke2JvZHl9PC90Ym9keT5cbjwvdGFibGU+XG5gO1xuICB9XG5cbiAgdGFibGVyb3coY29udGVudDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gJzx0cj5cXG4nICsgY29udGVudCArICc8L3RyPlxcbic7XG4gIH1cblxuICB0YWJsZWNlbGwoY29udGVudDogc3RyaW5nLCBmbGFnczogeyBoZWFkZXI/OiBib29sZWFuOyBhbGlnbj86IEFsaWduIH0pOiBzdHJpbmcge1xuICAgIGNvbnN0IHR5cGUgPSBmbGFncy5oZWFkZXIgPyAndGgnIDogJ3RkJztcbiAgICBjb25zdCB0YWcgPSBmbGFncy5hbGlnbiA/ICc8JyArIHR5cGUgKyAnIHN0eWxlPVwidGV4dC1hbGlnbjonICsgZmxhZ3MuYWxpZ24gKyAnXCI+JyA6ICc8JyArIHR5cGUgKyAnPic7XG4gICAgcmV0dXJuIHRhZyArIGNvbnRlbnQgKyAnPC8nICsgdHlwZSArICc+XFxuJztcbiAgfVxuXG4gIC8vICoqKiBJbmxpbmUgbGV2ZWwgcmVuZGVyZXIgbWV0aG9kcy4gKioqXG5cbiAgc3Ryb25nKHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuICc8c3Ryb25nPicgKyB0ZXh0ICsgJzwvc3Ryb25nPic7XG4gIH1cblxuICBlbSh0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiAnPGVtPicgKyB0ZXh0ICsgJzwvZW0+JztcbiAgfVxuXG4gIGNvZGVzcGFuKHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuICc8Y29kZT4nICsgdGV4dCArICc8L2NvZGU+JztcbiAgfVxuXG4gIGJyKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy54aHRtbCA/ICc8YnIvPicgOiAnPGJyPic7XG4gIH1cblxuICBkZWwodGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gJzxkZWw+JyArIHRleHQgKyAnPC9kZWw+JztcbiAgfVxuXG4gIGxpbmsoaHJlZjogc3RyaW5nLCB0aXRsZTogc3RyaW5nLCB0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuc2FuaXRpemUpIHtcbiAgICAgIGxldCBwcm90OiBzdHJpbmc7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHByb3QgPSBkZWNvZGVVUklDb21wb25lbnQodGhpcy5vcHRpb25zLnVuZXNjYXBlKGhyZWYpKVxuICAgICAgICAgIC5yZXBsYWNlKC9bXlxcdzpdL2csICcnKVxuICAgICAgICAgIC50b0xvd2VyQ2FzZSgpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgIH1cblxuICAgICAgaWYgKHByb3QuaW5kZXhPZignamF2YXNjcmlwdDonKSA9PT0gMCB8fCBwcm90LmluZGV4T2YoJ3Zic2NyaXB0OicpID09PSAwIHx8IHByb3QuaW5kZXhPZignZGF0YTonKSA9PT0gMCkge1xuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgb3V0ID0gJzxhIGhyZWY9XCInICsgaHJlZiArICdcIic7XG5cbiAgICBpZiAodGl0bGUpIHtcbiAgICAgIG91dCArPSAnIHRpdGxlPVwiJyArIHRpdGxlICsgJ1wiJztcbiAgICB9XG5cbiAgICBvdXQgKz0gJz4nICsgdGV4dCArICc8L2E+JztcblxuICAgIHJldHVybiBvdXQ7XG4gIH1cblxuICBpbWFnZShocmVmOiBzdHJpbmcsIHRpdGxlOiBzdHJpbmcsIHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgbGV0IG91dCA9ICc8aW1nIHNyYz1cIicgKyBocmVmICsgJ1wiIGFsdD1cIicgKyB0ZXh0ICsgJ1wiJztcblxuICAgIGlmICh0aXRsZSkge1xuICAgICAgb3V0ICs9ICcgdGl0bGU9XCInICsgdGl0bGUgKyAnXCInO1xuICAgIH1cblxuICAgIG91dCArPSB0aGlzLm9wdGlvbnMueGh0bWwgPyAnLz4nIDogJz4nO1xuXG4gICAgcmV0dXJuIG91dDtcbiAgfVxuXG4gIHRleHQodGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGV4dDtcbiAgfVxufVxuIiwgIi8qKlxuICogQGxpY2Vuc2VcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTEtMjAxNCwgQ2hyaXN0b3BoZXIgSmVmZnJleS4gKE1JVCBMaWNlbnNlZClcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9jaGpqL21hcmtlZFxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxOC0yMDIxLCBcdTA0MUFcdTA0M0VcdTA0NDFcdTA0NDJcdTA0NEYgXHUwNDIyXHUwNDQwXHUwNDM1XHUwNDQyXHUwNDRGXHUwNDNBLiAoTUlUIExpY2Vuc2VkKVxuICogaHR0cHM6Ly9naXRodWIuY29tL3RzLXN0YWNrL21hcmtkb3duXG4gKi9cblxuaW1wb3J0IHsgRXh0ZW5kUmVnZXhwIH0gZnJvbSAnLi9leHRlbmQtcmVnZXhwJztcbmltcG9ydCB7XG4gIExpbmssXG4gIExpbmtzLFxuICBNYXJrZWRPcHRpb25zLFxuICBSdWxlc0lubGluZUJhc2UsXG4gIFJ1bGVzSW5saW5lQnJlYWtzLFxuICBSdWxlc0lubGluZUNhbGxiYWNrLFxuICBSdWxlc0lubGluZUdmbSxcbiAgUnVsZXNJbmxpbmVQZWRhbnRpYyxcbn0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7IE1hcmtlZCB9IGZyb20gJy4vbWFya2VkJztcbmltcG9ydCB7IFJlbmRlcmVyIH0gZnJvbSAnLi9yZW5kZXJlcic7XG5cbi8qKlxuICogSW5saW5lIExleGVyICYgQ29tcGlsZXIuXG4gKi9cbmV4cG9ydCBjbGFzcyBJbmxpbmVMZXhlciB7XG4gIHByb3RlY3RlZCBzdGF0aWMgcnVsZXNCYXNlOiBSdWxlc0lubGluZUJhc2UgPSBudWxsO1xuICAvKipcbiAgICogUGVkYW50aWMgSW5saW5lIEdyYW1tYXIuXG4gICAqL1xuICBwcm90ZWN0ZWQgc3RhdGljIHJ1bGVzUGVkYW50aWM6IFJ1bGVzSW5saW5lUGVkYW50aWMgPSBudWxsO1xuICAvKipcbiAgICogR0ZNIElubGluZSBHcmFtbWFyXG4gICAqL1xuICBwcm90ZWN0ZWQgc3RhdGljIHJ1bGVzR2ZtOiBSdWxlc0lubGluZUdmbSA9IG51bGw7XG4gIC8qKlxuICAgKiBHRk0gKyBMaW5lIEJyZWFrcyBJbmxpbmUgR3JhbW1hci5cbiAgICovXG4gIHByb3RlY3RlZCBzdGF0aWMgcnVsZXNCcmVha3M6IFJ1bGVzSW5saW5lQnJlYWtzID0gbnVsbDtcbiAgcHJvdGVjdGVkIHJ1bGVzOiBSdWxlc0lubGluZUJhc2UgfCBSdWxlc0lubGluZVBlZGFudGljIHwgUnVsZXNJbmxpbmVHZm0gfCBSdWxlc0lubGluZUJyZWFrcztcbiAgcHJvdGVjdGVkIHJlbmRlcmVyOiBSZW5kZXJlcjtcbiAgcHJvdGVjdGVkIGluTGluazogYm9vbGVhbjtcbiAgcHJvdGVjdGVkIGhhc1J1bGVzR2ZtOiBib29sZWFuO1xuICBwcm90ZWN0ZWQgcnVsZUNhbGxiYWNrczogUnVsZXNJbmxpbmVDYWxsYmFja1tdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBzdGF0aWNUaGlzOiB0eXBlb2YgSW5saW5lTGV4ZXIsXG4gICAgcHJvdGVjdGVkIGxpbmtzOiBMaW5rcyxcbiAgICBwcm90ZWN0ZWQgb3B0aW9uczogTWFya2VkT3B0aW9ucyA9IE1hcmtlZC5vcHRpb25zLFxuICAgIHJlbmRlcmVyPzogUmVuZGVyZXJcbiAgKSB7XG4gICAgdGhpcy5yZW5kZXJlciA9IHJlbmRlcmVyIHx8IHRoaXMub3B0aW9ucy5yZW5kZXJlciB8fCBuZXcgUmVuZGVyZXIodGhpcy5vcHRpb25zKTtcblxuICAgIGlmICghdGhpcy5saW5rcykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbmxpbmVMZXhlciByZXF1aXJlcyAnbGlua3MnIHBhcmFtZXRlci5gKTtcbiAgICB9XG5cbiAgICB0aGlzLnNldFJ1bGVzKCk7XG4gIH1cblxuICAvKipcbiAgICogU3RhdGljIExleGluZy9Db21waWxpbmcgTWV0aG9kLlxuICAgKi9cbiAgc3RhdGljIG91dHB1dChzcmM6IHN0cmluZywgbGlua3M6IExpbmtzLCBvcHRpb25zOiBNYXJrZWRPcHRpb25zKTogc3RyaW5nIHtcbiAgICBjb25zdCBpbmxpbmVMZXhlciA9IG5ldyB0aGlzKHRoaXMsIGxpbmtzLCBvcHRpb25zKTtcbiAgICByZXR1cm4gaW5saW5lTGV4ZXIub3V0cHV0KHNyYyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgc3RhdGljIGdldFJ1bGVzQmFzZSgpOiBSdWxlc0lubGluZUJhc2Uge1xuICAgIGlmICh0aGlzLnJ1bGVzQmFzZSkge1xuICAgICAgcmV0dXJuIHRoaXMucnVsZXNCYXNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIElubGluZS1MZXZlbCBHcmFtbWFyLlxuICAgICAqL1xuICAgIGNvbnN0IGJhc2U6IFJ1bGVzSW5saW5lQmFzZSA9IHtcbiAgICAgIGVzY2FwZTogL15cXFxcKFtcXFxcYCp7fVxcW1xcXSgpIytcXC0uIV8+XSkvLFxuICAgICAgYXV0b2xpbms6IC9ePChbXiA8Pl0rKEB8OlxcLylbXiA8Pl0rKT4vLFxuICAgICAgdGFnOiAvXjwhLS1bXFxzXFxTXSo/LS0+fF48XFwvP1xcdysoPzpcIlteXCJdKlwifCdbXiddKid8W148J1wiPl0pKj8+LyxcbiAgICAgIGxpbms6IC9eIT9cXFsoaW5zaWRlKVxcXVxcKGhyZWZcXCkvLFxuICAgICAgcmVmbGluazogL14hP1xcWyhpbnNpZGUpXFxdXFxzKlxcWyhbXlxcXV0qKVxcXS8sXG4gICAgICBub2xpbms6IC9eIT9cXFsoKD86XFxbW15cXF1dKlxcXXxbXlxcW1xcXV0pKilcXF0vLFxuICAgICAgc3Ryb25nOiAvXl9fKFtcXHNcXFNdKz8pX18oPyFfKXxeXFwqXFwqKFtcXHNcXFNdKz8pXFwqXFwqKD8hXFwqKS8sXG4gICAgICBlbTogL15cXGJfKCg/OlteX118X18pKz8pX1xcYnxeXFwqKCg/OlxcKlxcKnxbXFxzXFxTXSkrPylcXCooPyFcXCopLyxcbiAgICAgIGNvZGU6IC9eKGArKShbXFxzXFxTXSo/W15gXSlcXDEoPyFgKS8sXG4gICAgICBicjogL14gezIsfVxcbig/IVxccyokKS8sXG4gICAgICB0ZXh0OiAvXltcXHNcXFNdKz8oPz1bXFxcXDwhXFxbXypgXXwgezIsfVxcbnwkKS8sXG4gICAgICBfaW5zaWRlOiAvKD86XFxbW15cXF1dKlxcXXxbXlxcW1xcXV18XFxdKD89W15cXFtdKlxcXSkpKi8sXG4gICAgICBfaHJlZjogL1xccyo8PyhbXFxzXFxTXSo/KT4/KD86XFxzK1snXCJdKFtcXHNcXFNdKj8pWydcIl0pP1xccyovLFxuICAgIH07XG5cbiAgICBiYXNlLmxpbmsgPSBuZXcgRXh0ZW5kUmVnZXhwKGJhc2UubGluaykuc2V0R3JvdXAoJ2luc2lkZScsIGJhc2UuX2luc2lkZSkuc2V0R3JvdXAoJ2hyZWYnLCBiYXNlLl9ocmVmKS5nZXRSZWdleHAoKTtcblxuICAgIGJhc2UucmVmbGluayA9IG5ldyBFeHRlbmRSZWdleHAoYmFzZS5yZWZsaW5rKS5zZXRHcm91cCgnaW5zaWRlJywgYmFzZS5faW5zaWRlKS5nZXRSZWdleHAoKTtcblxuICAgIHJldHVybiAodGhpcy5ydWxlc0Jhc2UgPSBiYXNlKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzdGF0aWMgZ2V0UnVsZXNQZWRhbnRpYygpOiBSdWxlc0lubGluZVBlZGFudGljIHtcbiAgICBpZiAodGhpcy5ydWxlc1BlZGFudGljKSB7XG4gICAgICByZXR1cm4gdGhpcy5ydWxlc1BlZGFudGljO1xuICAgIH1cblxuICAgIHJldHVybiAodGhpcy5ydWxlc1BlZGFudGljID0ge1xuICAgICAgLi4udGhpcy5nZXRSdWxlc0Jhc2UoKSxcbiAgICAgIC4uLntcbiAgICAgICAgc3Ryb25nOiAvXl9fKD89XFxTKShbXFxzXFxTXSo/XFxTKV9fKD8hXyl8XlxcKlxcKig/PVxcUykoW1xcc1xcU10qP1xcUylcXCpcXCooPyFcXCopLyxcbiAgICAgICAgZW06IC9eXyg/PVxcUykoW1xcc1xcU10qP1xcUylfKD8hXyl8XlxcKig/PVxcUykoW1xcc1xcU10qP1xcUylcXCooPyFcXCopLyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgc3RhdGljIGdldFJ1bGVzR2ZtKCk6IFJ1bGVzSW5saW5lR2ZtIHtcbiAgICBpZiAodGhpcy5ydWxlc0dmbSkge1xuICAgICAgcmV0dXJuIHRoaXMucnVsZXNHZm07XG4gICAgfVxuXG4gICAgY29uc3QgYmFzZSA9IHRoaXMuZ2V0UnVsZXNCYXNlKCk7XG5cbiAgICBjb25zdCBlc2NhcGUgPSBuZXcgRXh0ZW5kUmVnZXhwKGJhc2UuZXNjYXBlKS5zZXRHcm91cCgnXSknLCAnfnxdKScpLmdldFJlZ2V4cCgpO1xuXG4gICAgY29uc3QgdGV4dCA9IG5ldyBFeHRlbmRSZWdleHAoYmFzZS50ZXh0KS5zZXRHcm91cCgnXXwnLCAnfl18Jykuc2V0R3JvdXAoJ3wnLCAnfGh0dHBzPzovL3wnKS5nZXRSZWdleHAoKTtcblxuICAgIHJldHVybiAodGhpcy5ydWxlc0dmbSA9IHtcbiAgICAgIC4uLmJhc2UsXG4gICAgICAuLi57XG4gICAgICAgIGVzY2FwZSxcbiAgICAgICAgdXJsOiAvXihodHRwcz86XFwvXFwvW15cXHM8XStbXjwuLDo7XCInKVxcXVxcc10pLyxcbiAgICAgICAgZGVsOiAvXn5+KD89XFxTKShbXFxzXFxTXSo/XFxTKX5+LyxcbiAgICAgICAgdGV4dCxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgc3RhdGljIGdldFJ1bGVzQnJlYWtzKCk6IFJ1bGVzSW5saW5lQnJlYWtzIHtcbiAgICBpZiAodGhpcy5ydWxlc0JyZWFrcykge1xuICAgICAgcmV0dXJuIHRoaXMucnVsZXNCcmVha3M7XG4gICAgfVxuXG4gICAgY29uc3QgaW5saW5lID0gdGhpcy5nZXRSdWxlc0dmbSgpO1xuICAgIGNvbnN0IGdmbSA9IHRoaXMuZ2V0UnVsZXNHZm0oKTtcblxuICAgIHJldHVybiAodGhpcy5ydWxlc0JyZWFrcyA9IHtcbiAgICAgIC4uLmdmbSxcbiAgICAgIC4uLntcbiAgICAgICAgYnI6IG5ldyBFeHRlbmRSZWdleHAoaW5saW5lLmJyKS5zZXRHcm91cCgnezIsfScsICcqJykuZ2V0UmVnZXhwKCksXG4gICAgICAgIHRleHQ6IG5ldyBFeHRlbmRSZWdleHAoZ2ZtLnRleHQpLnNldEdyb3VwKCd7Mix9JywgJyonKS5nZXRSZWdleHAoKSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgc2V0UnVsZXMoKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5nZm0pIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuYnJlYWtzKSB7XG4gICAgICAgIHRoaXMucnVsZXMgPSB0aGlzLnN0YXRpY1RoaXMuZ2V0UnVsZXNCcmVha3MoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucnVsZXMgPSB0aGlzLnN0YXRpY1RoaXMuZ2V0UnVsZXNHZm0oKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ucy5wZWRhbnRpYykge1xuICAgICAgdGhpcy5ydWxlcyA9IHRoaXMuc3RhdGljVGhpcy5nZXRSdWxlc1BlZGFudGljKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucnVsZXMgPSB0aGlzLnN0YXRpY1RoaXMuZ2V0UnVsZXNCYXNlKCk7XG4gICAgfVxuXG4gICAgdGhpcy5oYXNSdWxlc0dmbSA9ICh0aGlzLnJ1bGVzIGFzIFJ1bGVzSW5saW5lR2ZtKS51cmwgIT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBMZXhpbmcvQ29tcGlsaW5nLlxuICAgKi9cbiAgb3V0cHV0KG5leHRQYXJ0OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIG5leHRQYXJ0ID0gbmV4dFBhcnQ7XG4gICAgbGV0IGV4ZWNBcnI6IFJlZ0V4cEV4ZWNBcnJheTtcbiAgICBsZXQgb3V0ID0gJyc7XG5cbiAgICB3aGlsZSAobmV4dFBhcnQpIHtcbiAgICAgIC8vIGVzY2FwZVxuICAgICAgaWYgKChleGVjQXJyID0gdGhpcy5ydWxlcy5lc2NhcGUuZXhlYyhuZXh0UGFydCkpKSB7XG4gICAgICAgIG5leHRQYXJ0ID0gbmV4dFBhcnQuc3Vic3RyaW5nKGV4ZWNBcnJbMF0ubGVuZ3RoKTtcbiAgICAgICAgb3V0ICs9IGV4ZWNBcnJbMV07XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBhdXRvbGlua1xuICAgICAgaWYgKChleGVjQXJyID0gdGhpcy5ydWxlcy5hdXRvbGluay5leGVjKG5leHRQYXJ0KSkpIHtcbiAgICAgICAgbGV0IHRleHQ6IHN0cmluZztcbiAgICAgICAgbGV0IGhyZWY6IHN0cmluZztcbiAgICAgICAgbmV4dFBhcnQgPSBuZXh0UGFydC5zdWJzdHJpbmcoZXhlY0FyclswXS5sZW5ndGgpO1xuXG4gICAgICAgIGlmIChleGVjQXJyWzJdID09PSAnQCcpIHtcbiAgICAgICAgICB0ZXh0ID0gdGhpcy5vcHRpb25zLmVzY2FwZShcbiAgICAgICAgICAgIGV4ZWNBcnJbMV0uY2hhckF0KDYpID09PSAnOicgPyB0aGlzLm1hbmdsZShleGVjQXJyWzFdLnN1YnN0cmluZyg3KSkgOiB0aGlzLm1hbmdsZShleGVjQXJyWzFdKVxuICAgICAgICAgICk7XG4gICAgICAgICAgaHJlZiA9IHRoaXMubWFuZ2xlKCdtYWlsdG86JykgKyB0ZXh0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRleHQgPSB0aGlzLm9wdGlvbnMuZXNjYXBlKGV4ZWNBcnJbMV0pO1xuICAgICAgICAgIGhyZWYgPSB0ZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgb3V0ICs9IHRoaXMucmVuZGVyZXIubGluayhocmVmLCBudWxsLCB0ZXh0KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIHVybCAoZ2ZtKVxuICAgICAgaWYgKCF0aGlzLmluTGluayAmJiB0aGlzLmhhc1J1bGVzR2ZtICYmIChleGVjQXJyID0gKHRoaXMucnVsZXMgYXMgUnVsZXNJbmxpbmVHZm0pLnVybC5leGVjKG5leHRQYXJ0KSkpIHtcbiAgICAgICAgbGV0IHRleHQ6IHN0cmluZztcbiAgICAgICAgbGV0IGhyZWY6IHN0cmluZztcbiAgICAgICAgbmV4dFBhcnQgPSBuZXh0UGFydC5zdWJzdHJpbmcoZXhlY0FyclswXS5sZW5ndGgpO1xuICAgICAgICB0ZXh0ID0gdGhpcy5vcHRpb25zLmVzY2FwZShleGVjQXJyWzFdKTtcbiAgICAgICAgaHJlZiA9IHRleHQ7XG4gICAgICAgIG91dCArPSB0aGlzLnJlbmRlcmVyLmxpbmsoaHJlZiwgbnVsbCwgdGV4dCk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyB0YWdcbiAgICAgIGlmICgoZXhlY0FyciA9IHRoaXMucnVsZXMudGFnLmV4ZWMobmV4dFBhcnQpKSkge1xuICAgICAgICBpZiAoIXRoaXMuaW5MaW5rICYmIC9ePGEgL2kudGVzdChleGVjQXJyWzBdKSkge1xuICAgICAgICAgIHRoaXMuaW5MaW5rID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmluTGluayAmJiAvXjxcXC9hPi9pLnRlc3QoZXhlY0FyclswXSkpIHtcbiAgICAgICAgICB0aGlzLmluTGluayA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgbmV4dFBhcnQgPSBuZXh0UGFydC5zdWJzdHJpbmcoZXhlY0FyclswXS5sZW5ndGgpO1xuXG4gICAgICAgIG91dCArPSB0aGlzLm9wdGlvbnMuc2FuaXRpemVcbiAgICAgICAgICA/IHRoaXMub3B0aW9ucy5zYW5pdGl6ZXJcbiAgICAgICAgICAgID8gdGhpcy5vcHRpb25zLnNhbml0aXplcihleGVjQXJyWzBdKVxuICAgICAgICAgICAgOiB0aGlzLm9wdGlvbnMuZXNjYXBlKGV4ZWNBcnJbMF0pXG4gICAgICAgICAgOiBleGVjQXJyWzBdO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gbGlua1xuICAgICAgaWYgKChleGVjQXJyID0gdGhpcy5ydWxlcy5saW5rLmV4ZWMobmV4dFBhcnQpKSkge1xuICAgICAgICBuZXh0UGFydCA9IG5leHRQYXJ0LnN1YnN0cmluZyhleGVjQXJyWzBdLmxlbmd0aCk7XG4gICAgICAgIHRoaXMuaW5MaW5rID0gdHJ1ZTtcblxuICAgICAgICBvdXQgKz0gdGhpcy5vdXRwdXRMaW5rKGV4ZWNBcnIsIHtcbiAgICAgICAgICBocmVmOiBleGVjQXJyWzJdLFxuICAgICAgICAgIHRpdGxlOiBleGVjQXJyWzNdLFxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmluTGluayA9IGZhbHNlO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gcmVmbGluaywgbm9saW5rXG4gICAgICBpZiAoKGV4ZWNBcnIgPSB0aGlzLnJ1bGVzLnJlZmxpbmsuZXhlYyhuZXh0UGFydCkpIHx8IChleGVjQXJyID0gdGhpcy5ydWxlcy5ub2xpbmsuZXhlYyhuZXh0UGFydCkpKSB7XG4gICAgICAgIG5leHRQYXJ0ID0gbmV4dFBhcnQuc3Vic3RyaW5nKGV4ZWNBcnJbMF0ubGVuZ3RoKTtcbiAgICAgICAgY29uc3Qga2V5TGluayA9IChleGVjQXJyWzJdIHx8IGV4ZWNBcnJbMV0pLnJlcGxhY2UoL1xccysvZywgJyAnKTtcbiAgICAgICAgY29uc3QgbGluayA9IHRoaXMubGlua3Nba2V5TGluay50b0xvd2VyQ2FzZSgpXTtcblxuICAgICAgICBpZiAoIWxpbmsgfHwgIWxpbmsuaHJlZikge1xuICAgICAgICAgIG91dCArPSBleGVjQXJyWzBdLmNoYXJBdCgwKTtcbiAgICAgICAgICBuZXh0UGFydCA9IGV4ZWNBcnJbMF0uc3Vic3RyaW5nKDEpICsgbmV4dFBhcnQ7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmluTGluayA9IHRydWU7XG4gICAgICAgIG91dCArPSB0aGlzLm91dHB1dExpbmsoZXhlY0FyciwgbGluayk7XG4gICAgICAgIHRoaXMuaW5MaW5rID0gZmFsc2U7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBzdHJvbmdcbiAgICAgIGlmICgoZXhlY0FyciA9IHRoaXMucnVsZXMuc3Ryb25nLmV4ZWMobmV4dFBhcnQpKSkge1xuICAgICAgICBuZXh0UGFydCA9IG5leHRQYXJ0LnN1YnN0cmluZyhleGVjQXJyWzBdLmxlbmd0aCk7XG4gICAgICAgIG91dCArPSB0aGlzLnJlbmRlcmVyLnN0cm9uZyh0aGlzLm91dHB1dChleGVjQXJyWzJdIHx8IGV4ZWNBcnJbMV0pKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIGVtXG4gICAgICBpZiAoKGV4ZWNBcnIgPSB0aGlzLnJ1bGVzLmVtLmV4ZWMobmV4dFBhcnQpKSkge1xuICAgICAgICBuZXh0UGFydCA9IG5leHRQYXJ0LnN1YnN0cmluZyhleGVjQXJyWzBdLmxlbmd0aCk7XG4gICAgICAgIG91dCArPSB0aGlzLnJlbmRlcmVyLmVtKHRoaXMub3V0cHV0KGV4ZWNBcnJbMl0gfHwgZXhlY0FyclsxXSkpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gY29kZVxuICAgICAgaWYgKChleGVjQXJyID0gdGhpcy5ydWxlcy5jb2RlLmV4ZWMobmV4dFBhcnQpKSkge1xuICAgICAgICBuZXh0UGFydCA9IG5leHRQYXJ0LnN1YnN0cmluZyhleGVjQXJyWzBdLmxlbmd0aCk7XG4gICAgICAgIG91dCArPSB0aGlzLnJlbmRlcmVyLmNvZGVzcGFuKHRoaXMub3B0aW9ucy5lc2NhcGUoZXhlY0FyclsyXS50cmltKCksIHRydWUpKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIGJyXG4gICAgICBpZiAoKGV4ZWNBcnIgPSB0aGlzLnJ1bGVzLmJyLmV4ZWMobmV4dFBhcnQpKSkge1xuICAgICAgICBuZXh0UGFydCA9IG5leHRQYXJ0LnN1YnN0cmluZyhleGVjQXJyWzBdLmxlbmd0aCk7XG4gICAgICAgIG91dCArPSB0aGlzLnJlbmRlcmVyLmJyKCk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBkZWwgKGdmbSlcbiAgICAgIGlmICh0aGlzLmhhc1J1bGVzR2ZtICYmIChleGVjQXJyID0gKHRoaXMucnVsZXMgYXMgUnVsZXNJbmxpbmVHZm0pLmRlbC5leGVjKG5leHRQYXJ0KSkpIHtcbiAgICAgICAgbmV4dFBhcnQgPSBuZXh0UGFydC5zdWJzdHJpbmcoZXhlY0FyclswXS5sZW5ndGgpO1xuICAgICAgICBvdXQgKz0gdGhpcy5yZW5kZXJlci5kZWwodGhpcy5vdXRwdXQoZXhlY0FyclsxXSkpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gdGV4dFxuICAgICAgaWYgKChleGVjQXJyID0gdGhpcy5ydWxlcy50ZXh0LmV4ZWMobmV4dFBhcnQpKSkge1xuICAgICAgICBuZXh0UGFydCA9IG5leHRQYXJ0LnN1YnN0cmluZyhleGVjQXJyWzBdLmxlbmd0aCk7XG4gICAgICAgIG91dCArPSB0aGlzLnJlbmRlcmVyLnRleHQodGhpcy5vcHRpb25zLmVzY2FwZSh0aGlzLnNtYXJ0eXBhbnRzKGV4ZWNBcnJbMF0pKSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAobmV4dFBhcnQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbmZpbml0ZSBsb29wIG9uIGJ5dGU6ICcgKyBuZXh0UGFydC5jaGFyQ29kZUF0KDApKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gb3V0O1xuICB9XG5cbiAgLyoqXG4gICAqIENvbXBpbGUgTGluay5cbiAgICovXG4gIHByb3RlY3RlZCBvdXRwdXRMaW5rKGV4ZWNBcnI6IFJlZ0V4cEV4ZWNBcnJheSwgbGluazogTGluaykge1xuICAgIGNvbnN0IGhyZWYgPSB0aGlzLm9wdGlvbnMuZXNjYXBlKGxpbmsuaHJlZik7XG4gICAgY29uc3QgdGl0bGUgPSBsaW5rLnRpdGxlID8gdGhpcy5vcHRpb25zLmVzY2FwZShsaW5rLnRpdGxlKSA6IG51bGw7XG5cbiAgICByZXR1cm4gZXhlY0FyclswXS5jaGFyQXQoMCkgIT09ICchJ1xuICAgICAgPyB0aGlzLnJlbmRlcmVyLmxpbmsoaHJlZiwgdGl0bGUsIHRoaXMub3V0cHV0KGV4ZWNBcnJbMV0pKVxuICAgICAgOiB0aGlzLnJlbmRlcmVyLmltYWdlKGhyZWYsIHRpdGxlLCB0aGlzLm9wdGlvbnMuZXNjYXBlKGV4ZWNBcnJbMV0pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTbWFydHlwYW50cyBUcmFuc2Zvcm1hdGlvbnMuXG4gICAqL1xuICBwcm90ZWN0ZWQgc21hcnR5cGFudHModGV4dDogc3RyaW5nKSB7XG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuc21hcnR5cGFudHMpIHtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICB0ZXh0XG4gICAgICAgIC8vIGVtLWRhc2hlc1xuICAgICAgICAucmVwbGFjZSgvLS0tL2csICdcXHUyMDE0JylcbiAgICAgICAgLy8gZW4tZGFzaGVzXG4gICAgICAgIC5yZXBsYWNlKC8tLS9nLCAnXFx1MjAxMycpXG4gICAgICAgIC8vIG9wZW5pbmcgc2luZ2xlc1xuICAgICAgICAucmVwbGFjZSgvKF58Wy1cXHUyMDE0LyhcXFt7XCJcXHNdKScvZywgJyQxXFx1MjAxOCcpXG4gICAgICAgIC8vIGNsb3Npbmcgc2luZ2xlcyAmIGFwb3N0cm9waGVzXG4gICAgICAgIC5yZXBsYWNlKC8nL2csICdcXHUyMDE5JylcbiAgICAgICAgLy8gb3BlbmluZyBkb3VibGVzXG4gICAgICAgIC5yZXBsYWNlKC8oXnxbLVxcdTIwMTQvKFxcW3tcXHUyMDE4XFxzXSlcIi9nLCAnJDFcXHUyMDFjJylcbiAgICAgICAgLy8gY2xvc2luZyBkb3VibGVzXG4gICAgICAgIC5yZXBsYWNlKC9cIi9nLCAnXFx1MjAxZCcpXG4gICAgICAgIC8vIGVsbGlwc2VzXG4gICAgICAgIC5yZXBsYWNlKC9cXC57M30vZywgJ1xcdTIwMjYnKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogTWFuZ2xlIExpbmtzLlxuICAgKi9cbiAgcHJvdGVjdGVkIG1hbmdsZSh0ZXh0OiBzdHJpbmcpIHtcbiAgICBpZiAoIXRoaXMub3B0aW9ucy5tYW5nbGUpIHtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cblxuICAgIGxldCBvdXQgPSAnJztcbiAgICBjb25zdCBsZW5ndGggPSB0ZXh0Lmxlbmd0aDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBzdHI6IHN0cmluZztcblxuICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPiAwLjUpIHtcbiAgICAgICAgc3RyID0gJ3gnICsgdGV4dC5jaGFyQ29kZUF0KGkpLnRvU3RyaW5nKDE2KTtcbiAgICAgIH1cblxuICAgICAgb3V0ICs9ICcmIycgKyBzdHIgKyAnOyc7XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dDtcbiAgfVxufVxuIiwgIi8qKlxuICogQGxpY2Vuc2VcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTEtMjAxNCwgQ2hyaXN0b3BoZXIgSmVmZnJleS4gKE1JVCBMaWNlbnNlZClcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9jaGpqL21hcmtlZFxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxOC0yMDIxLCBcdTA0MUFcdTA0M0VcdTA0NDFcdTA0NDJcdTA0NEYgXHUwNDIyXHUwNDQwXHUwNDM1XHUwNDQyXHUwNDRGXHUwNDNBLiAoTUlUIExpY2Vuc2VkKVxuICogaHR0cHM6Ly9naXRodWIuY29tL3RzLXN0YWNrL21hcmtkb3duXG4gKi9cblxuaW1wb3J0IHsgSW5saW5lTGV4ZXIgfSBmcm9tICcuL2lubGluZS1sZXhlcic7XG5pbXBvcnQgeyBMaW5rcywgTWFya2VkT3B0aW9ucywgU2ltcGxlUmVuZGVyZXIsIFRva2VuLCBUb2tlblR5cGUgfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgTWFya2VkIH0gZnJvbSAnLi9tYXJrZWQnO1xuaW1wb3J0IHsgUmVuZGVyZXIgfSBmcm9tICcuL3JlbmRlcmVyJztcblxuLyoqXG4gKiBQYXJzaW5nICYgQ29tcGlsaW5nLlxuICovXG5leHBvcnQgY2xhc3MgUGFyc2VyIHtcbiAgc2ltcGxlUmVuZGVyZXJzOiBTaW1wbGVSZW5kZXJlcltdID0gW107XG4gIHByb3RlY3RlZCB0b2tlbnM6IFRva2VuW107XG4gIHByb3RlY3RlZCB0b2tlbjogVG9rZW47XG4gIHByb3RlY3RlZCBpbmxpbmVMZXhlcjogSW5saW5lTGV4ZXI7XG4gIHByb3RlY3RlZCBvcHRpb25zOiBNYXJrZWRPcHRpb25zO1xuICBwcm90ZWN0ZWQgcmVuZGVyZXI6IFJlbmRlcmVyO1xuICBwcm90ZWN0ZWQgbGluZTogbnVtYmVyID0gMDtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zPzogTWFya2VkT3B0aW9ucykge1xuICAgIHRoaXMudG9rZW5zID0gW107XG4gICAgdGhpcy50b2tlbiA9IG51bGw7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCBNYXJrZWQub3B0aW9ucztcbiAgICB0aGlzLnJlbmRlcmVyID0gdGhpcy5vcHRpb25zLnJlbmRlcmVyIHx8IG5ldyBSZW5kZXJlcih0aGlzLm9wdGlvbnMpO1xuICB9XG5cbiAgc3RhdGljIHBhcnNlKHRva2VuczogVG9rZW5bXSwgbGlua3M6IExpbmtzLCBvcHRpb25zPzogTWFya2VkT3B0aW9ucyk6IHN0cmluZyB7XG4gICAgY29uc3QgcGFyc2VyID0gbmV3IHRoaXMob3B0aW9ucyk7XG4gICAgcmV0dXJuIHBhcnNlci5wYXJzZShsaW5rcywgdG9rZW5zKTtcbiAgfVxuXG4gIHBhcnNlKGxpbmtzOiBMaW5rcywgdG9rZW5zOiBUb2tlbltdKSB7XG4gICAgdGhpcy5pbmxpbmVMZXhlciA9IG5ldyBJbmxpbmVMZXhlcihJbmxpbmVMZXhlciwgbGlua3MsIHRoaXMub3B0aW9ucywgdGhpcy5yZW5kZXJlcik7XG4gICAgdGhpcy50b2tlbnMgPSB0b2tlbnMucmV2ZXJzZSgpO1xuXG4gICAgbGV0IG91dCA9ICcnO1xuXG4gICAgd2hpbGUgKHRoaXMubmV4dCgpKSB7XG4gICAgICBvdXQgKz0gdGhpcy50b2soKTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0O1xuICB9XG5cbiAgZGVidWcobGlua3M6IExpbmtzLCB0b2tlbnM6IFRva2VuW10pIHtcbiAgICB0aGlzLmlubGluZUxleGVyID0gbmV3IElubGluZUxleGVyKElubGluZUxleGVyLCBsaW5rcywgdGhpcy5vcHRpb25zLCB0aGlzLnJlbmRlcmVyKTtcbiAgICB0aGlzLnRva2VucyA9IHRva2Vucy5yZXZlcnNlKCk7XG5cbiAgICBsZXQgb3V0ID0gJyc7XG5cbiAgICB3aGlsZSAodGhpcy5uZXh0KCkpIHtcbiAgICAgIGNvbnN0IG91dFRva2VuOiBzdHJpbmcgPSB0aGlzLnRvaygpO1xuICAgICAgdGhpcy50b2tlbi5saW5lID0gdGhpcy5saW5lICs9IG91dFRva2VuLnNwbGl0KCdcXG4nKS5sZW5ndGggLSAxO1xuICAgICAgb3V0ICs9IG91dFRva2VuO1xuICAgIH1cblxuICAgIHJldHVybiBvdXQ7XG4gIH1cblxuICBwcm90ZWN0ZWQgbmV4dCgpIHtcbiAgICByZXR1cm4gKHRoaXMudG9rZW4gPSB0aGlzLnRva2Vucy5wb3AoKSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0TmV4dEVsZW1lbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMudG9rZW5zW3RoaXMudG9rZW5zLmxlbmd0aCAtIDFdO1xuICB9XG5cbiAgcHJvdGVjdGVkIHBhcnNlVGV4dCgpIHtcbiAgICBsZXQgYm9keSA9IHRoaXMudG9rZW4udGV4dDtcbiAgICBsZXQgbmV4dEVsZW1lbnQ6IFRva2VuO1xuXG4gICAgd2hpbGUgKChuZXh0RWxlbWVudCA9IHRoaXMuZ2V0TmV4dEVsZW1lbnQoKSkgJiYgbmV4dEVsZW1lbnQudHlwZSA9PSBUb2tlblR5cGUudGV4dCkge1xuICAgICAgYm9keSArPSAnXFxuJyArIHRoaXMubmV4dCgpLnRleHQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaW5saW5lTGV4ZXIub3V0cHV0KGJvZHkpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHRvaygpIHtcbiAgICBzd2l0Y2ggKHRoaXMudG9rZW4udHlwZSkge1xuICAgICAgY2FzZSBUb2tlblR5cGUuc3BhY2U6IHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfVxuICAgICAgY2FzZSBUb2tlblR5cGUucGFyYWdyYXBoOiB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlcmVyLnBhcmFncmFwaCh0aGlzLmlubGluZUxleGVyLm91dHB1dCh0aGlzLnRva2VuLnRleHQpKTtcbiAgICAgIH1cbiAgICAgIGNhc2UgVG9rZW5UeXBlLnRleHQ6IHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5pc05vUCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlVGV4dCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLnJlbmRlcmVyLnBhcmFncmFwaCh0aGlzLnBhcnNlVGV4dCgpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY2FzZSBUb2tlblR5cGUuaGVhZGluZzoge1xuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJlci5oZWFkaW5nKHRoaXMuaW5saW5lTGV4ZXIub3V0cHV0KHRoaXMudG9rZW4udGV4dCksIHRoaXMudG9rZW4uZGVwdGgsIHRoaXMudG9rZW4udGV4dCk7XG4gICAgICB9XG4gICAgICBjYXNlIFRva2VuVHlwZS5saXN0U3RhcnQ6IHtcbiAgICAgICAgbGV0IGJvZHkgPSAnJztcbiAgICAgICAgY29uc3Qgb3JkZXJlZCA9IHRoaXMudG9rZW4ub3JkZXJlZDtcblxuICAgICAgICB3aGlsZSAodGhpcy5uZXh0KCkudHlwZSAhPSBUb2tlblR5cGUubGlzdEVuZCkge1xuICAgICAgICAgIGJvZHkgKz0gdGhpcy50b2soKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlcmVyLmxpc3QoYm9keSwgb3JkZXJlZCk7XG4gICAgICB9XG4gICAgICBjYXNlIFRva2VuVHlwZS5saXN0SXRlbVN0YXJ0OiB7XG4gICAgICAgIGxldCBib2R5ID0gJyc7XG5cbiAgICAgICAgd2hpbGUgKHRoaXMubmV4dCgpLnR5cGUgIT0gVG9rZW5UeXBlLmxpc3RJdGVtRW5kKSB7XG4gICAgICAgICAgYm9keSArPSB0aGlzLnRva2VuLnR5cGUgPT0gKFRva2VuVHlwZS50ZXh0IGFzIGFueSkgPyB0aGlzLnBhcnNlVGV4dCgpIDogdGhpcy50b2soKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlcmVyLmxpc3RpdGVtKGJvZHkpO1xuICAgICAgfVxuICAgICAgY2FzZSBUb2tlblR5cGUubG9vc2VJdGVtU3RhcnQ6IHtcbiAgICAgICAgbGV0IGJvZHkgPSAnJztcblxuICAgICAgICB3aGlsZSAodGhpcy5uZXh0KCkudHlwZSAhPSBUb2tlblR5cGUubGlzdEl0ZW1FbmQpIHtcbiAgICAgICAgICBib2R5ICs9IHRoaXMudG9rKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJlci5saXN0aXRlbShib2R5KTtcbiAgICAgIH1cbiAgICAgIGNhc2UgVG9rZW5UeXBlLmNvZGU6IHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyZXIuY29kZSh0aGlzLnRva2VuLnRleHQsIHRoaXMudG9rZW4ubGFuZywgdGhpcy50b2tlbi5lc2NhcGVkLCB0aGlzLnRva2VuLm1ldGEpO1xuICAgICAgfVxuICAgICAgY2FzZSBUb2tlblR5cGUudGFibGU6IHtcbiAgICAgICAgbGV0IGhlYWRlciA9ICcnO1xuICAgICAgICBsZXQgYm9keSA9ICcnO1xuICAgICAgICBsZXQgY2VsbDtcblxuICAgICAgICAvLyBoZWFkZXJcbiAgICAgICAgY2VsbCA9ICcnO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudG9rZW4uaGVhZGVyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgY29uc3QgZmxhZ3MgPSB7IGhlYWRlcjogdHJ1ZSwgYWxpZ246IHRoaXMudG9rZW4uYWxpZ25baV0gfTtcbiAgICAgICAgICBjb25zdCBvdXQgPSB0aGlzLmlubGluZUxleGVyLm91dHB1dCh0aGlzLnRva2VuLmhlYWRlcltpXSk7XG5cbiAgICAgICAgICBjZWxsICs9IHRoaXMucmVuZGVyZXIudGFibGVjZWxsKG91dCwgZmxhZ3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgaGVhZGVyICs9IHRoaXMucmVuZGVyZXIudGFibGVyb3coY2VsbCk7XG5cbiAgICAgICAgZm9yIChjb25zdCByb3cgb2YgdGhpcy50b2tlbi5jZWxscykge1xuICAgICAgICAgIGNlbGwgPSAnJztcblxuICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgcm93Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBjZWxsICs9IHRoaXMucmVuZGVyZXIudGFibGVjZWxsKHRoaXMuaW5saW5lTGV4ZXIub3V0cHV0KHJvd1tqXSksIHtcbiAgICAgICAgICAgICAgaGVhZGVyOiBmYWxzZSxcbiAgICAgICAgICAgICAgYWxpZ246IHRoaXMudG9rZW4uYWxpZ25bal1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGJvZHkgKz0gdGhpcy5yZW5kZXJlci50YWJsZXJvdyhjZWxsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlcmVyLnRhYmxlKGhlYWRlciwgYm9keSk7XG4gICAgICB9XG4gICAgICBjYXNlIFRva2VuVHlwZS5ibG9ja3F1b3RlU3RhcnQ6IHtcbiAgICAgICAgbGV0IGJvZHkgPSAnJztcblxuICAgICAgICB3aGlsZSAodGhpcy5uZXh0KCkudHlwZSAhPSBUb2tlblR5cGUuYmxvY2txdW90ZUVuZCkge1xuICAgICAgICAgIGJvZHkgKz0gdGhpcy50b2soKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlcmVyLmJsb2NrcXVvdGUoYm9keSk7XG4gICAgICB9XG4gICAgICBjYXNlIFRva2VuVHlwZS5ocjoge1xuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJlci5ocigpO1xuICAgICAgfVxuICAgICAgY2FzZSBUb2tlblR5cGUuaHRtbDoge1xuICAgICAgICBjb25zdCBodG1sID1cbiAgICAgICAgICAhdGhpcy50b2tlbi5wcmUgJiYgIXRoaXMub3B0aW9ucy5wZWRhbnRpYyA/IHRoaXMuaW5saW5lTGV4ZXIub3V0cHV0KHRoaXMudG9rZW4udGV4dCkgOiB0aGlzLnRva2VuLnRleHQ7XG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlcmVyLmh0bWwoaHRtbCk7XG4gICAgICB9XG4gICAgICBkZWZhdWx0OiB7XG4gICAgICAgIGlmICh0aGlzLnNpbXBsZVJlbmRlcmVycy5sZW5ndGgpIHtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc2ltcGxlUmVuZGVyZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy50b2tlbi50eXBlID09ICdzaW1wbGVSdWxlJyArIChpICsgMSkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2ltcGxlUmVuZGVyZXJzW2ldLmNhbGwodGhpcy5yZW5kZXJlciwgdGhpcy50b2tlbi5leGVjQXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBlcnJNc2cgPSBgVG9rZW4gd2l0aCBcIiR7dGhpcy50b2tlbi50eXBlfVwiIHR5cGUgd2FzIG5vdCBmb3VuZC5gO1xuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2lsZW50KSB7XG4gICAgICAgICAgY29uc29sZS5sb2coZXJyTXNnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyTXNnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIiwgIi8qKlxuICogQGxpY2Vuc2VcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTEtMjAxNCwgQ2hyaXN0b3BoZXIgSmVmZnJleS4gKE1JVCBMaWNlbnNlZClcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9jaGpqL21hcmtlZFxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxOC0yMDIxLCBcdTA0MUFcdTA0M0VcdTA0NDFcdTA0NDJcdTA0NEYgXHUwNDIyXHUwNDQwXHUwNDM1XHUwNDQyXHUwNDRGXHUwNDNBLiAoTUlUIExpY2Vuc2VkKVxuICogaHR0cHM6Ly9naXRodWIuY29tL3RzLXN0YWNrL21hcmtkb3duXG4gKi9cblxuaW1wb3J0IHsgQmxvY2tMZXhlciB9IGZyb20gJy4vYmxvY2stbGV4ZXInO1xuaW1wb3J0IHsgRGVidWdSZXR1cm5zLCBMZXhlclJldHVybnMsIExpbmtzLCBNYXJrZWRPcHRpb25zLCBTaW1wbGVSZW5kZXJlciwgVG9rZW4sIFRva2VuVHlwZSB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBQYXJzZXIgfSBmcm9tICcuL3BhcnNlcic7XG5cbmV4cG9ydCBjbGFzcyBNYXJrZWQge1xuICBzdGF0aWMgb3B0aW9ucyA9IG5ldyBNYXJrZWRPcHRpb25zKCk7XG4gIHByb3RlY3RlZCBzdGF0aWMgc2ltcGxlUmVuZGVyZXJzOiBTaW1wbGVSZW5kZXJlcltdID0gW107XG5cbiAgLyoqXG4gICAqIE1lcmdlcyB0aGUgZGVmYXVsdCBvcHRpb25zIHdpdGggb3B0aW9ucyB0aGF0IHdpbGwgYmUgc2V0LlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyBIYXNoIG9mIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgc2V0T3B0aW9ucyhvcHRpb25zOiBNYXJrZWRPcHRpb25zKSB7XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRpbmcgc2ltcGxlIGJsb2NrIHJ1bGUuXG4gICAqL1xuICBzdGF0aWMgc2V0QmxvY2tSdWxlKHJlZ2V4cDogUmVnRXhwLCByZW5kZXJlcjogU2ltcGxlUmVuZGVyZXIgPSAoKSA9PiAnJykge1xuICAgIEJsb2NrTGV4ZXIuc2ltcGxlUnVsZXMucHVzaChyZWdleHApO1xuICAgIHRoaXMuc2ltcGxlUmVuZGVyZXJzLnB1c2gocmVuZGVyZXIpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQWNjZXB0cyBNYXJrZG93biB0ZXh0IGFuZCByZXR1cm5zIHRleHQgaW4gSFRNTCBmb3JtYXQuXG4gICAqXG4gICAqIEBwYXJhbSBzcmMgU3RyaW5nIG9mIG1hcmtkb3duIHNvdXJjZSB0byBiZSBjb21waWxlZC5cbiAgICogQHBhcmFtIG9wdGlvbnMgSGFzaCBvZiBvcHRpb25zLiBUaGV5IHJlcGxhY2UsIGJ1dCBkbyBub3QgbWVyZ2Ugd2l0aCB0aGUgZGVmYXVsdCBvcHRpb25zLlxuICAgKiBJZiB5b3Ugd2FudCB0aGUgbWVyZ2luZywgeW91IGNhbiB0byBkbyB0aGlzIHZpYSBgTWFya2VkLnNldE9wdGlvbnMoKWAuXG4gICAqL1xuICBzdGF0aWMgcGFyc2Uoc3JjOiBzdHJpbmcsIG9wdGlvbnM6IE1hcmtlZE9wdGlvbnMgPSB0aGlzLm9wdGlvbnMpOiBzdHJpbmcge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB7IHRva2VucywgbGlua3MgfSA9IHRoaXMuY2FsbEJsb2NrTGV4ZXIoc3JjLCBvcHRpb25zKTtcbiAgICAgIHJldHVybiB0aGlzLmNhbGxQYXJzZXIodG9rZW5zLCBsaW5rcywgb3B0aW9ucyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIHRoaXMuY2FsbE1lKGUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBY2NlcHRzIE1hcmtkb3duIHRleHQgYW5kIHJldHVybnMgb2JqZWN0IHdpdGggdGV4dCBpbiBIVE1MIGZvcm1hdCxcbiAgICogdG9rZW5zIGFuZCBsaW5rcyBmcm9tIGBCbG9ja0xleGVyLnBhcnNlcigpYC5cbiAgICpcbiAgICogQHBhcmFtIHNyYyBTdHJpbmcgb2YgbWFya2Rvd24gc291cmNlIHRvIGJlIGNvbXBpbGVkLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBIYXNoIG9mIG9wdGlvbnMuIFRoZXkgcmVwbGFjZSwgYnV0IGRvIG5vdCBtZXJnZSB3aXRoIHRoZSBkZWZhdWx0IG9wdGlvbnMuXG4gICAqIElmIHlvdSB3YW50IHRoZSBtZXJnaW5nLCB5b3UgY2FuIHRvIGRvIHRoaXMgdmlhIGBNYXJrZWQuc2V0T3B0aW9ucygpYC5cbiAgICovXG4gIHN0YXRpYyBkZWJ1ZyhzcmM6IHN0cmluZywgb3B0aW9uczogTWFya2VkT3B0aW9ucyA9IHRoaXMub3B0aW9ucyk6IERlYnVnUmV0dXJucyB7XG4gICAgY29uc3QgeyB0b2tlbnMsIGxpbmtzIH0gPSB0aGlzLmNhbGxCbG9ja0xleGVyKHNyYywgb3B0aW9ucyk7XG4gICAgbGV0IG9yaWdpbiA9IHRva2Vucy5zbGljZSgpO1xuICAgIGNvbnN0IHBhcnNlciA9IG5ldyBQYXJzZXIob3B0aW9ucyk7XG4gICAgcGFyc2VyLnNpbXBsZVJlbmRlcmVycyA9IHRoaXMuc2ltcGxlUmVuZGVyZXJzO1xuICAgIGNvbnN0IHJlc3VsdCA9IHBhcnNlci5kZWJ1ZyhsaW5rcywgdG9rZW5zKTtcblxuICAgIC8qKlxuICAgICAqIFRyYW5zbGF0ZXMgYSB0b2tlbiB0eXBlIGludG8gYSByZWFkYWJsZSBmb3JtLFxuICAgICAqIGFuZCBtb3ZlcyBgbGluZWAgZmllbGQgdG8gYSBmaXJzdCBwbGFjZSBpbiBhIHRva2VuIG9iamVjdC5cbiAgICAgKi9cbiAgICBvcmlnaW4gPSBvcmlnaW4ubWFwKHRva2VuID0+IHtcbiAgICAgIHRva2VuLnR5cGUgPSAoVG9rZW5UeXBlIGFzIGFueSlbdG9rZW4udHlwZV0gfHwgdG9rZW4udHlwZTtcblxuICAgICAgY29uc3QgbGluZSA9IHRva2VuLmxpbmU7XG4gICAgICBkZWxldGUgdG9rZW4ubGluZTtcbiAgICAgIGlmIChsaW5lKSB7XG4gICAgICAgIHJldHVybiB7IC4uLnsgbGluZSB9LCAuLi50b2tlbiB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRva2VuO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHsgdG9rZW5zOiBvcmlnaW4sIGxpbmtzLCByZXN1bHQgfTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzdGF0aWMgY2FsbEJsb2NrTGV4ZXIoc3JjOiBzdHJpbmcgPSAnJywgb3B0aW9ucz86IE1hcmtlZE9wdGlvbnMpOiBMZXhlclJldHVybnMge1xuICAgIGlmICh0eXBlb2Ygc3JjICE9ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIHRoYXQgdGhlICdzcmMnIHBhcmFtZXRlciB3b3VsZCBoYXZlIGEgJ3N0cmluZycgdHlwZSwgZ290ICcke3R5cGVvZiBzcmN9J2ApO1xuICAgIH1cblxuICAgIC8vIFByZXByb2Nlc3NpbmcuXG4gICAgc3JjID0gc3JjXG4gICAgICAucmVwbGFjZSgvXFxyXFxufFxcci9nLCAnXFxuJylcbiAgICAgIC5yZXBsYWNlKC9cXHQvZywgJyAgICAnKVxuICAgICAgLnJlcGxhY2UoL1xcdTAwYTAvZywgJyAnKVxuICAgICAgLnJlcGxhY2UoL1xcdTI0MjQvZywgJ1xcbicpXG4gICAgICAucmVwbGFjZSgvXiArJC9nbSwgJycpO1xuXG4gICAgcmV0dXJuIEJsb2NrTGV4ZXIubGV4KHNyYywgb3B0aW9ucywgdHJ1ZSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgc3RhdGljIGNhbGxQYXJzZXIodG9rZW5zOiBUb2tlbltdLCBsaW5rczogTGlua3MsIG9wdGlvbnM/OiBNYXJrZWRPcHRpb25zKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5zaW1wbGVSZW5kZXJlcnMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBwYXJzZXIgPSBuZXcgUGFyc2VyKG9wdGlvbnMpO1xuICAgICAgcGFyc2VyLnNpbXBsZVJlbmRlcmVycyA9IHRoaXMuc2ltcGxlUmVuZGVyZXJzO1xuICAgICAgcmV0dXJuIHBhcnNlci5wYXJzZShsaW5rcywgdG9rZW5zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFBhcnNlci5wYXJzZSh0b2tlbnMsIGxpbmtzLCBvcHRpb25zKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgc3RhdGljIGNhbGxNZShlcnI6IEVycm9yKSB7XG4gICAgZXJyLm1lc3NhZ2UgKz0gJ1xcblBsZWFzZSByZXBvcnQgdGhpcyB0byBodHRwczovL2dpdGh1Yi5jb20vdHMtc3RhY2svbWFya2Rvd24nO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5zaWxlbnQpIHtcbiAgICAgIHJldHVybiAnPHA+QW4gZXJyb3Igb2NjdXJlZDo8L3A+PHByZT4nICsgdGhpcy5vcHRpb25zLmVzY2FwZShlcnIubWVzc2FnZSArICcnLCB0cnVlKSArICc8L3ByZT4nO1xuICAgIH1cblxuICAgIHRocm93IGVycjtcbiAgfVxufVxuIiwgIi8qKlxuICogQGxpY2Vuc2VcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTEtMjAxNCwgQ2hyaXN0b3BoZXIgSmVmZnJleS4gKE1JVCBMaWNlbnNlZClcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9jaGpqL21hcmtlZFxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxOC0yMDIxLCBcdTA0MUFcdTA0M0VcdTA0NDFcdTA0NDJcdTA0NEYgXHUwNDIyXHUwNDQwXHUwNDM1XHUwNDQyXHUwNDRGXHUwNDNBLiAoTUlUIExpY2Vuc2VkKVxuICogaHR0cHM6Ly9naXRodWIuY29tL3RzLXN0YWNrL21hcmtkb3duXG4gKi9cblxuaW1wb3J0IHsgRXh0ZW5kUmVnZXhwIH0gZnJvbSAnLi9leHRlbmQtcmVnZXhwJztcbmltcG9ydCB7XG4gIEFsaWduLFxuICBMZXhlclJldHVybnMsXG4gIExpbmtzLFxuICBNYXJrZWRPcHRpb25zLFxuICBSdWxlc0Jsb2NrQmFzZSxcbiAgUnVsZXNCbG9ja0dmbSxcbiAgUnVsZXNCbG9ja1RhYmxlcyxcbiAgVG9rZW4sXG4gIFRva2VuVHlwZSxcbn0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7IE1hcmtlZCB9IGZyb20gJy4vbWFya2VkJztcblxuZXhwb3J0IGNsYXNzIEJsb2NrTGV4ZXI8VCBleHRlbmRzIHR5cGVvZiBCbG9ja0xleGVyPiB7XG4gIHN0YXRpYyBzaW1wbGVSdWxlczogUmVnRXhwW10gPSBbXTtcbiAgcHJvdGVjdGVkIHN0YXRpYyBydWxlc0Jhc2U6IFJ1bGVzQmxvY2tCYXNlID0gbnVsbDtcbiAgLyoqXG4gICAqIEdGTSBCbG9jayBHcmFtbWFyLlxuICAgKi9cbiAgcHJvdGVjdGVkIHN0YXRpYyBydWxlc0dmbTogUnVsZXNCbG9ja0dmbSA9IG51bGw7XG4gIC8qKlxuICAgKiBHRk0gKyBUYWJsZXMgQmxvY2sgR3JhbW1hci5cbiAgICovXG4gIHByb3RlY3RlZCBzdGF0aWMgcnVsZXNUYWJsZXM6IFJ1bGVzQmxvY2tUYWJsZXMgPSBudWxsO1xuICBwcm90ZWN0ZWQgcnVsZXM6IFJ1bGVzQmxvY2tCYXNlIHwgUnVsZXNCbG9ja0dmbSB8IFJ1bGVzQmxvY2tUYWJsZXM7XG4gIHByb3RlY3RlZCBvcHRpb25zOiBNYXJrZWRPcHRpb25zO1xuICBwcm90ZWN0ZWQgbGlua3M6IExpbmtzID0ge307XG4gIHByb3RlY3RlZCB0b2tlbnM6IFRva2VuW10gPSBbXTtcbiAgcHJvdGVjdGVkIGhhc1J1bGVzR2ZtOiBib29sZWFuO1xuICBwcm90ZWN0ZWQgaGFzUnVsZXNUYWJsZXM6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIHN0YXRpY1RoaXM6IFQsIG9wdGlvbnM/OiBvYmplY3QpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IE1hcmtlZC5vcHRpb25zO1xuICAgIHRoaXMuc2V0UnVsZXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBY2NlcHRzIE1hcmtkb3duIHRleHQgYW5kIHJldHVybnMgb2JqZWN0IHdpdGggdG9rZW5zIGFuZCBsaW5rcy5cbiAgICpcbiAgICogQHBhcmFtIHNyYyBTdHJpbmcgb2YgbWFya2Rvd24gc291cmNlIHRvIGJlIGNvbXBpbGVkLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBIYXNoIG9mIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgbGV4KHNyYzogc3RyaW5nLCBvcHRpb25zPzogTWFya2VkT3B0aW9ucywgdG9wPzogYm9vbGVhbiwgaXNCbG9ja1F1b3RlPzogYm9vbGVhbik6IExleGVyUmV0dXJucyB7XG4gICAgY29uc3QgbGV4ZXIgPSBuZXcgdGhpcyh0aGlzLCBvcHRpb25zKTtcbiAgICByZXR1cm4gbGV4ZXIuZ2V0VG9rZW5zKHNyYywgdG9wLCBpc0Jsb2NrUXVvdGUpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHN0YXRpYyBnZXRSdWxlc0Jhc2UoKTogUnVsZXNCbG9ja0Jhc2Uge1xuICAgIGlmICh0aGlzLnJ1bGVzQmFzZSkge1xuICAgICAgcmV0dXJuIHRoaXMucnVsZXNCYXNlO1xuICAgIH1cblxuICAgIGNvbnN0IGJhc2U6IFJ1bGVzQmxvY2tCYXNlID0ge1xuICAgICAgbmV3bGluZTogL15cXG4rLyxcbiAgICAgIGNvZGU6IC9eKCB7NH1bXlxcbl0rXFxuKikrLyxcbiAgICAgIGhyOiAvXiggKlstKl9dKXszLH0gKig/Olxcbit8JCkvLFxuICAgICAgaGVhZGluZzogL14gKigjezEsNn0pICooW15cXG5dKz8pICojKiAqKD86XFxuK3wkKS8sXG4gICAgICBsaGVhZGluZzogL14oW15cXG5dKylcXG4gKig9fC0pezIsfSAqKD86XFxuK3wkKS8sXG4gICAgICBibG9ja3F1b3RlOiAvXiggKj5bXlxcbl0rKFxcblteXFxuXSspKlxcbiopKy8sXG4gICAgICBsaXN0OiAvXiggKikoYnVsbCkgW1xcc1xcU10rPyg/OmhyfGRlZnxcXG57Mix9KD8hICkoPyFcXDFidWxsIClcXG4qfFxccyokKS8sXG4gICAgICBodG1sOiAvXiAqKD86Y29tbWVudCAqKD86XFxufFxccyokKXxjbG9zZWQgKig/OlxcbnsyLH18XFxzKiQpfGNsb3NpbmcgKig/OlxcbnsyLH18XFxzKiQpKS8sXG4gICAgICBkZWY6IC9eICpcXFsoW15cXF1dKylcXF06ICo8PyhbXlxccz5dKyk+Pyg/OiArW1wiKF0oW15cXG5dKylbXCIpXSk/ICooPzpcXG4rfCQpLyxcbiAgICAgIHBhcmFncmFwaDogL14oKD86W15cXG5dK1xcbj8oPyFocnxoZWFkaW5nfGxoZWFkaW5nfGJsb2NrcXVvdGV8dGFnfGRlZikpKylcXG4qLyxcbiAgICAgIHRleHQ6IC9eW15cXG5dKy8sXG4gICAgICBidWxsZXQ6IC8oPzpbKistXXxcXGQrXFwuKS8sXG4gICAgICBpdGVtOiAvXiggKikoYnVsbCkgW15cXG5dKig/Olxcbig/IVxcMWJ1bGwgKVteXFxuXSopKi8sXG4gICAgfTtcblxuICAgIGJhc2UuaXRlbSA9IG5ldyBFeHRlbmRSZWdleHAoYmFzZS5pdGVtLCAnZ20nKS5zZXRHcm91cCgvYnVsbC9nLCBiYXNlLmJ1bGxldCkuZ2V0UmVnZXhwKCk7XG5cbiAgICBiYXNlLmxpc3QgPSBuZXcgRXh0ZW5kUmVnZXhwKGJhc2UubGlzdClcbiAgICAgIC5zZXRHcm91cCgvYnVsbC9nLCBiYXNlLmJ1bGxldClcbiAgICAgIC5zZXRHcm91cCgnaHInLCAnXFxcXG4rKD89XFxcXDE/KD86Wy0qX10gKil7Myx9KD86XFxcXG4rfCQpKScpXG4gICAgICAuc2V0R3JvdXAoJ2RlZicsICdcXFxcbisoPz0nICsgYmFzZS5kZWYuc291cmNlICsgJyknKVxuICAgICAgLmdldFJlZ2V4cCgpO1xuXG4gICAgY29uc3QgdGFnID1cbiAgICAgICcoPyEoPzonICtcbiAgICAgICdhfGVtfHN0cm9uZ3xzbWFsbHxzfGNpdGV8cXxkZm58YWJicnxkYXRhfHRpbWV8Y29kZScgK1xuICAgICAgJ3x2YXJ8c2FtcHxrYmR8c3VifHN1cHxpfGJ8dXxtYXJrfHJ1Ynl8cnR8cnB8YmRpfGJkbycgK1xuICAgICAgJ3xzcGFufGJyfHdicnxpbnN8ZGVsfGltZylcXFxcYilcXFxcdysoPyE6L3xbXlxcXFx3XFxcXHNAXSpAKVxcXFxiJztcblxuICAgIGJhc2UuaHRtbCA9IG5ldyBFeHRlbmRSZWdleHAoYmFzZS5odG1sKVxuICAgICAgLnNldEdyb3VwKCdjb21tZW50JywgLzwhLS1bXFxzXFxTXSo/LS0+LylcbiAgICAgIC5zZXRHcm91cCgnY2xvc2VkJywgLzwodGFnKVtcXHNcXFNdKz88XFwvXFwxPi8pXG4gICAgICAuc2V0R3JvdXAoJ2Nsb3NpbmcnLCAvPHRhZyg/OlwiW15cIl0qXCJ8J1teJ10qJ3xbXidcIj5dKSo/Pi8pXG4gICAgICAuc2V0R3JvdXAoL3RhZy9nLCB0YWcpXG4gICAgICAuZ2V0UmVnZXhwKCk7XG5cbiAgICBiYXNlLnBhcmFncmFwaCA9IG5ldyBFeHRlbmRSZWdleHAoYmFzZS5wYXJhZ3JhcGgpXG4gICAgICAuc2V0R3JvdXAoJ2hyJywgYmFzZS5ocilcbiAgICAgIC5zZXRHcm91cCgnaGVhZGluZycsIGJhc2UuaGVhZGluZylcbiAgICAgIC5zZXRHcm91cCgnbGhlYWRpbmcnLCBiYXNlLmxoZWFkaW5nKVxuICAgICAgLnNldEdyb3VwKCdibG9ja3F1b3RlJywgYmFzZS5ibG9ja3F1b3RlKVxuICAgICAgLnNldEdyb3VwKCd0YWcnLCAnPCcgKyB0YWcpXG4gICAgICAuc2V0R3JvdXAoJ2RlZicsIGJhc2UuZGVmKVxuICAgICAgLmdldFJlZ2V4cCgpO1xuXG4gICAgcmV0dXJuICh0aGlzLnJ1bGVzQmFzZSA9IGJhc2UpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHN0YXRpYyBnZXRSdWxlc0dmbSgpOiBSdWxlc0Jsb2NrR2ZtIHtcbiAgICBpZiAodGhpcy5ydWxlc0dmbSkge1xuICAgICAgcmV0dXJuIHRoaXMucnVsZXNHZm07XG4gICAgfVxuXG4gICAgY29uc3QgYmFzZSA9IHRoaXMuZ2V0UnVsZXNCYXNlKCk7XG5cbiAgICBjb25zdCBnZm06IFJ1bGVzQmxvY2tHZm0gPSB7XG4gICAgICAuLi5iYXNlLFxuICAgICAgLi4ue1xuICAgICAgICBmZW5jZXM6IC9eICooYHszLH18fnszLH0pWyBcXC5dKigoXFxTKyk/ICpbXlxcbl0qKVxcbihbXFxzXFxTXSo/KVxccypcXDEgKig/Olxcbit8JCkvLFxuICAgICAgICBwYXJhZ3JhcGg6IC9eLyxcbiAgICAgICAgaGVhZGluZzogL14gKigjezEsNn0pICsoW15cXG5dKz8pICojKiAqKD86XFxuK3wkKS8sXG4gICAgICB9LFxuICAgIH07XG5cbiAgICBjb25zdCBncm91cDEgPSBnZm0uZmVuY2VzLnNvdXJjZS5yZXBsYWNlKCdcXFxcMScsICdcXFxcMicpO1xuICAgIGNvbnN0IGdyb3VwMiA9IGJhc2UubGlzdC5zb3VyY2UucmVwbGFjZSgnXFxcXDEnLCAnXFxcXDMnKTtcblxuICAgIGdmbS5wYXJhZ3JhcGggPSBuZXcgRXh0ZW5kUmVnZXhwKGJhc2UucGFyYWdyYXBoKS5zZXRHcm91cCgnKD8hJywgYCg/ISR7Z3JvdXAxfXwke2dyb3VwMn18YCkuZ2V0UmVnZXhwKCk7XG5cbiAgICByZXR1cm4gKHRoaXMucnVsZXNHZm0gPSBnZm0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIHN0YXRpYyBnZXRSdWxlc1RhYmxlKCk6IFJ1bGVzQmxvY2tUYWJsZXMge1xuICAgIGlmICh0aGlzLnJ1bGVzVGFibGVzKSB7XG4gICAgICByZXR1cm4gdGhpcy5ydWxlc1RhYmxlcztcbiAgICB9XG5cbiAgICByZXR1cm4gKHRoaXMucnVsZXNUYWJsZXMgPSB7XG4gICAgICAuLi50aGlzLmdldFJ1bGVzR2ZtKCksXG4gICAgICAuLi57XG4gICAgICAgIG5wdGFibGU6IC9eICooXFxTLipcXHwuKilcXG4gKihbLTpdKyAqXFx8Wy18IDpdKilcXG4oKD86LipcXHwuKig/OlxcbnwkKSkqKVxcbiovLFxuICAgICAgICB0YWJsZTogL14gKlxcfCguKylcXG4gKlxcfCggKlstOl0rWy18IDpdKilcXG4oKD86ICpcXHwuKig/OlxcbnwkKSkqKVxcbiovLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzZXRSdWxlcygpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLmdmbSkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy50YWJsZXMpIHtcbiAgICAgICAgdGhpcy5ydWxlcyA9IHRoaXMuc3RhdGljVGhpcy5nZXRSdWxlc1RhYmxlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJ1bGVzID0gdGhpcy5zdGF0aWNUaGlzLmdldFJ1bGVzR2ZtKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucnVsZXMgPSB0aGlzLnN0YXRpY1RoaXMuZ2V0UnVsZXNCYXNlKCk7XG4gICAgfVxuXG4gICAgdGhpcy5oYXNSdWxlc0dmbSA9ICh0aGlzLnJ1bGVzIGFzIFJ1bGVzQmxvY2tHZm0pLmZlbmNlcyAhPT0gdW5kZWZpbmVkO1xuICAgIHRoaXMuaGFzUnVsZXNUYWJsZXMgPSAodGhpcy5ydWxlcyBhcyBSdWxlc0Jsb2NrVGFibGVzKS50YWJsZSAhPT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIExleGluZy5cbiAgICovXG4gIHByb3RlY3RlZCBnZXRUb2tlbnMoc3JjOiBzdHJpbmcsIHRvcD86IGJvb2xlYW4sIGlzQmxvY2tRdW90ZT86IGJvb2xlYW4pOiBMZXhlclJldHVybnMge1xuICAgIGxldCBuZXh0UGFydCA9IHNyYztcbiAgICBsZXQgZXhlY0FycjogUmVnRXhwRXhlY0FycmF5O1xuXG4gICAgbWFpbkxvb3A6IHdoaWxlIChuZXh0UGFydCkge1xuICAgICAgLy8gbmV3bGluZVxuICAgICAgaWYgKChleGVjQXJyID0gdGhpcy5ydWxlcy5uZXdsaW5lLmV4ZWMobmV4dFBhcnQpKSkge1xuICAgICAgICBuZXh0UGFydCA9IG5leHRQYXJ0LnN1YnN0cmluZyhleGVjQXJyWzBdLmxlbmd0aCk7XG5cbiAgICAgICAgaWYgKGV4ZWNBcnJbMF0ubGVuZ3RoID4gMSkge1xuICAgICAgICAgIHRoaXMudG9rZW5zLnB1c2goeyB0eXBlOiBUb2tlblR5cGUuc3BhY2UgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gY29kZVxuICAgICAgaWYgKChleGVjQXJyID0gdGhpcy5ydWxlcy5jb2RlLmV4ZWMobmV4dFBhcnQpKSkge1xuICAgICAgICBuZXh0UGFydCA9IG5leHRQYXJ0LnN1YnN0cmluZyhleGVjQXJyWzBdLmxlbmd0aCk7XG4gICAgICAgIGNvbnN0IGNvZGUgPSBleGVjQXJyWzBdLnJlcGxhY2UoL14gezR9L2dtLCAnJyk7XG5cbiAgICAgICAgdGhpcy50b2tlbnMucHVzaCh7XG4gICAgICAgICAgdHlwZTogVG9rZW5UeXBlLmNvZGUsXG4gICAgICAgICAgdGV4dDogIXRoaXMub3B0aW9ucy5wZWRhbnRpYyA/IGNvZGUucmVwbGFjZSgvXFxuKyQvLCAnJykgOiBjb2RlLFxuICAgICAgICB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIGZlbmNlcyBjb2RlIChnZm0pXG4gICAgICBpZiAodGhpcy5oYXNSdWxlc0dmbSAmJiAoZXhlY0FyciA9ICh0aGlzLnJ1bGVzIGFzIFJ1bGVzQmxvY2tHZm0pLmZlbmNlcy5leGVjKG5leHRQYXJ0KSkpIHtcbiAgICAgICAgbmV4dFBhcnQgPSBuZXh0UGFydC5zdWJzdHJpbmcoZXhlY0FyclswXS5sZW5ndGgpO1xuXG4gICAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICAgIHR5cGU6IFRva2VuVHlwZS5jb2RlLFxuICAgICAgICAgIG1ldGE6IGV4ZWNBcnJbMl0sXG4gICAgICAgICAgbGFuZzogZXhlY0FyclszXSxcbiAgICAgICAgICB0ZXh0OiBleGVjQXJyWzRdIHx8ICcnLFxuICAgICAgICB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIGhlYWRpbmdcbiAgICAgIGlmICgoZXhlY0FyciA9IHRoaXMucnVsZXMuaGVhZGluZy5leGVjKG5leHRQYXJ0KSkpIHtcbiAgICAgICAgbmV4dFBhcnQgPSBuZXh0UGFydC5zdWJzdHJpbmcoZXhlY0FyclswXS5sZW5ndGgpO1xuICAgICAgICB0aGlzLnRva2Vucy5wdXNoKHtcbiAgICAgICAgICB0eXBlOiBUb2tlblR5cGUuaGVhZGluZyxcbiAgICAgICAgICBkZXB0aDogZXhlY0FyclsxXS5sZW5ndGgsXG4gICAgICAgICAgdGV4dDogZXhlY0FyclsyXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyB0YWJsZSBubyBsZWFkaW5nIHBpcGUgKGdmbSlcbiAgICAgIGlmICh0b3AgJiYgdGhpcy5oYXNSdWxlc1RhYmxlcyAmJiAoZXhlY0FyciA9ICh0aGlzLnJ1bGVzIGFzIFJ1bGVzQmxvY2tUYWJsZXMpLm5wdGFibGUuZXhlYyhuZXh0UGFydCkpKSB7XG4gICAgICAgIG5leHRQYXJ0ID0gbmV4dFBhcnQuc3Vic3RyaW5nKGV4ZWNBcnJbMF0ubGVuZ3RoKTtcblxuICAgICAgICBjb25zdCBpdGVtOiBUb2tlbiA9IHtcbiAgICAgICAgICB0eXBlOiBUb2tlblR5cGUudGFibGUsXG4gICAgICAgICAgaGVhZGVyOiBleGVjQXJyWzFdLnJlcGxhY2UoL14gKnwgKlxcfCAqJC9nLCAnJykuc3BsaXQoLyAqXFx8ICovKSxcbiAgICAgICAgICBhbGlnbjogZXhlY0FyclsyXS5yZXBsYWNlKC9eICp8XFx8ICokL2csICcnKS5zcGxpdCgvICpcXHwgKi8pIGFzIEFsaWduW10sXG4gICAgICAgICAgY2VsbHM6IFtdLFxuICAgICAgICB9O1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbS5hbGlnbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmICgvXiAqLSs6ICokLy50ZXN0KGl0ZW0uYWxpZ25baV0pKSB7XG4gICAgICAgICAgICBpdGVtLmFsaWduW2ldID0gJ3JpZ2h0JztcbiAgICAgICAgICB9IGVsc2UgaWYgKC9eICo6LSs6ICokLy50ZXN0KGl0ZW0uYWxpZ25baV0pKSB7XG4gICAgICAgICAgICBpdGVtLmFsaWduW2ldID0gJ2NlbnRlcic7XG4gICAgICAgICAgfSBlbHNlIGlmICgvXiAqOi0rICokLy50ZXN0KGl0ZW0uYWxpZ25baV0pKSB7XG4gICAgICAgICAgICBpdGVtLmFsaWduW2ldID0gJ2xlZnQnO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpdGVtLmFsaWduW2ldID0gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0ZDogc3RyaW5nW10gPSBleGVjQXJyWzNdLnJlcGxhY2UoL1xcbiQvLCAnJykuc3BsaXQoJ1xcbicpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpdGVtLmNlbGxzW2ldID0gdGRbaV0uc3BsaXQoLyAqXFx8ICovKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudG9rZW5zLnB1c2goaXRlbSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBsaGVhZGluZ1xuICAgICAgaWYgKChleGVjQXJyID0gdGhpcy5ydWxlcy5saGVhZGluZy5leGVjKG5leHRQYXJ0KSkpIHtcbiAgICAgICAgbmV4dFBhcnQgPSBuZXh0UGFydC5zdWJzdHJpbmcoZXhlY0FyclswXS5sZW5ndGgpO1xuXG4gICAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICAgIHR5cGU6IFRva2VuVHlwZS5oZWFkaW5nLFxuICAgICAgICAgIGRlcHRoOiBleGVjQXJyWzJdID09PSAnPScgPyAxIDogMixcbiAgICAgICAgICB0ZXh0OiBleGVjQXJyWzFdLFxuICAgICAgICB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIGhyXG4gICAgICBpZiAoKGV4ZWNBcnIgPSB0aGlzLnJ1bGVzLmhyLmV4ZWMobmV4dFBhcnQpKSkge1xuICAgICAgICBuZXh0UGFydCA9IG5leHRQYXJ0LnN1YnN0cmluZyhleGVjQXJyWzBdLmxlbmd0aCk7XG4gICAgICAgIHRoaXMudG9rZW5zLnB1c2goeyB0eXBlOiBUb2tlblR5cGUuaHIgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBibG9ja3F1b3RlXG4gICAgICBpZiAoKGV4ZWNBcnIgPSB0aGlzLnJ1bGVzLmJsb2NrcXVvdGUuZXhlYyhuZXh0UGFydCkpKSB7XG4gICAgICAgIG5leHRQYXJ0ID0gbmV4dFBhcnQuc3Vic3RyaW5nKGV4ZWNBcnJbMF0ubGVuZ3RoKTtcbiAgICAgICAgdGhpcy50b2tlbnMucHVzaCh7IHR5cGU6IFRva2VuVHlwZS5ibG9ja3F1b3RlU3RhcnQgfSk7XG4gICAgICAgIGNvbnN0IHN0ciA9IGV4ZWNBcnJbMF0ucmVwbGFjZSgvXiAqPiA/L2dtLCAnJyk7XG5cbiAgICAgICAgLy8gUGFzcyBgdG9wYCB0byBrZWVwIHRoZSBjdXJyZW50XG4gICAgICAgIC8vIFwidG9wbGV2ZWxcIiBzdGF0ZS4gVGhpcyBpcyBleGFjdGx5XG4gICAgICAgIC8vIGhvdyBtYXJrZG93bi5wbCB3b3Jrcy5cbiAgICAgICAgdGhpcy5nZXRUb2tlbnMoc3RyKTtcbiAgICAgICAgdGhpcy50b2tlbnMucHVzaCh7IHR5cGU6IFRva2VuVHlwZS5ibG9ja3F1b3RlRW5kIH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gbGlzdFxuICAgICAgaWYgKChleGVjQXJyID0gdGhpcy5ydWxlcy5saXN0LmV4ZWMobmV4dFBhcnQpKSkge1xuICAgICAgICBuZXh0UGFydCA9IG5leHRQYXJ0LnN1YnN0cmluZyhleGVjQXJyWzBdLmxlbmd0aCk7XG4gICAgICAgIGNvbnN0IGJ1bGw6IHN0cmluZyA9IGV4ZWNBcnJbMl07XG5cbiAgICAgICAgdGhpcy50b2tlbnMucHVzaCh7IHR5cGU6IFRva2VuVHlwZS5saXN0U3RhcnQsIG9yZGVyZWQ6IGJ1bGwubGVuZ3RoID4gMSB9KTtcblxuICAgICAgICAvLyBHZXQgZWFjaCB0b3AtbGV2ZWwgaXRlbS5cbiAgICAgICAgY29uc3Qgc3RyID0gZXhlY0FyclswXS5tYXRjaCh0aGlzLnJ1bGVzLml0ZW0pO1xuICAgICAgICBjb25zdCBsZW5ndGggPSBzdHIubGVuZ3RoO1xuXG4gICAgICAgIGxldCBuZXh0ID0gZmFsc2U7XG4gICAgICAgIGxldCBzcGFjZTogbnVtYmVyO1xuICAgICAgICBsZXQgYmxvY2tCdWxsZXQ6IHN0cmluZztcbiAgICAgICAgbGV0IGxvb3NlOiBib29sZWFuO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBsZXQgaXRlbSA9IHN0cltpXTtcblxuICAgICAgICAgIC8vIFJlbW92ZSB0aGUgbGlzdCBpdGVtJ3MgYnVsbGV0IHNvIGl0IGlzIHNlZW4gYXMgdGhlIG5leHQgdG9rZW4uXG4gICAgICAgICAgc3BhY2UgPSBpdGVtLmxlbmd0aDtcbiAgICAgICAgICBpdGVtID0gaXRlbS5yZXBsYWNlKC9eICooWyorLV18XFxkK1xcLikgKy8sICcnKTtcblxuICAgICAgICAgIC8vIE91dGRlbnQgd2hhdGV2ZXIgdGhlIGxpc3QgaXRlbSBjb250YWlucy4gSGFja3kuXG4gICAgICAgICAgaWYgKGl0ZW0uaW5kZXhPZignXFxuICcpICE9PSAtMSkge1xuICAgICAgICAgICAgc3BhY2UgLT0gaXRlbS5sZW5ndGg7XG4gICAgICAgICAgICBpdGVtID0gIXRoaXMub3B0aW9ucy5wZWRhbnRpY1xuICAgICAgICAgICAgICA/IGl0ZW0ucmVwbGFjZShuZXcgUmVnRXhwKCdeIHsxLCcgKyBzcGFjZSArICd9JywgJ2dtJyksICcnKVxuICAgICAgICAgICAgICA6IGl0ZW0ucmVwbGFjZSgvXiB7MSw0fS9nbSwgJycpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIERldGVybWluZSB3aGV0aGVyIHRoZSBuZXh0IGxpc3QgaXRlbSBiZWxvbmdzIGhlcmUuXG4gICAgICAgICAgLy8gQmFja3BlZGFsIGlmIGl0IGRvZXMgbm90IGJlbG9uZyBpbiB0aGlzIGxpc3QuXG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zbWFydExpc3RzICYmIGkgIT09IGxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgIGJsb2NrQnVsbGV0ID0gdGhpcy5zdGF0aWNUaGlzLmdldFJ1bGVzQmFzZSgpLmJ1bGxldC5leGVjKHN0cltpICsgMV0pWzBdO1xuXG4gICAgICAgICAgICBpZiAoYnVsbCAhPT0gYmxvY2tCdWxsZXQgJiYgIShidWxsLmxlbmd0aCA+IDEgJiYgYmxvY2tCdWxsZXQubGVuZ3RoID4gMSkpIHtcbiAgICAgICAgICAgICAgbmV4dFBhcnQgPSBzdHIuc2xpY2UoaSArIDEpLmpvaW4oJ1xcbicpICsgbmV4dFBhcnQ7XG4gICAgICAgICAgICAgIGkgPSBsZW5ndGggLSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIERldGVybWluZSB3aGV0aGVyIGl0ZW0gaXMgbG9vc2Ugb3Igbm90LlxuICAgICAgICAgIC8vIFVzZTogLyhefFxcbikoPyEgKVteXFxuXStcXG5cXG4oPyFcXHMqJCkvXG4gICAgICAgICAgLy8gZm9yIGRpc2NvdW50IGJlaGF2aW9yLlxuICAgICAgICAgIGxvb3NlID0gbmV4dCB8fCAvXFxuXFxuKD8hXFxzKiQpLy50ZXN0KGl0ZW0pO1xuXG4gICAgICAgICAgaWYgKGkgIT09IGxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgIG5leHQgPSBpdGVtLmNoYXJBdChpdGVtLmxlbmd0aCAtIDEpID09PSAnXFxuJztcblxuICAgICAgICAgICAgaWYgKCFsb29zZSkge1xuICAgICAgICAgICAgICBsb29zZSA9IG5leHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy50b2tlbnMucHVzaCh7IHR5cGU6IGxvb3NlID8gVG9rZW5UeXBlLmxvb3NlSXRlbVN0YXJ0IDogVG9rZW5UeXBlLmxpc3RJdGVtU3RhcnQgfSk7XG5cbiAgICAgICAgICAvLyBSZWN1cnNlLlxuICAgICAgICAgIHRoaXMuZ2V0VG9rZW5zKGl0ZW0sIGZhbHNlLCBpc0Jsb2NrUXVvdGUpO1xuICAgICAgICAgIHRoaXMudG9rZW5zLnB1c2goeyB0eXBlOiBUb2tlblR5cGUubGlzdEl0ZW1FbmQgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRva2Vucy5wdXNoKHsgdHlwZTogVG9rZW5UeXBlLmxpc3RFbmQgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBodG1sXG4gICAgICBpZiAoKGV4ZWNBcnIgPSB0aGlzLnJ1bGVzLmh0bWwuZXhlYyhuZXh0UGFydCkpKSB7XG4gICAgICAgIG5leHRQYXJ0ID0gbmV4dFBhcnQuc3Vic3RyaW5nKGV4ZWNBcnJbMF0ubGVuZ3RoKTtcbiAgICAgICAgY29uc3QgYXR0ciA9IGV4ZWNBcnJbMV07XG4gICAgICAgIGNvbnN0IGlzUHJlID0gYXR0ciA9PT0gJ3ByZScgfHwgYXR0ciA9PT0gJ3NjcmlwdCcgfHwgYXR0ciA9PT0gJ3N0eWxlJztcblxuICAgICAgICB0aGlzLnRva2Vucy5wdXNoKHtcbiAgICAgICAgICB0eXBlOiB0aGlzLm9wdGlvbnMuc2FuaXRpemUgPyBUb2tlblR5cGUucGFyYWdyYXBoIDogVG9rZW5UeXBlLmh0bWwsXG4gICAgICAgICAgcHJlOiAhdGhpcy5vcHRpb25zLnNhbml0aXplciAmJiBpc1ByZSxcbiAgICAgICAgICB0ZXh0OiBleGVjQXJyWzBdLFxuICAgICAgICB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIGRlZlxuICAgICAgaWYgKHRvcCAmJiAoZXhlY0FyciA9IHRoaXMucnVsZXMuZGVmLmV4ZWMobmV4dFBhcnQpKSkge1xuICAgICAgICBuZXh0UGFydCA9IG5leHRQYXJ0LnN1YnN0cmluZyhleGVjQXJyWzBdLmxlbmd0aCk7XG5cbiAgICAgICAgdGhpcy5saW5rc1tleGVjQXJyWzFdLnRvTG93ZXJDYXNlKCldID0ge1xuICAgICAgICAgIGhyZWY6IGV4ZWNBcnJbMl0sXG4gICAgICAgICAgdGl0bGU6IGV4ZWNBcnJbM10sXG4gICAgICAgIH07XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyB0YWJsZSAoZ2ZtKVxuICAgICAgaWYgKHRvcCAmJiB0aGlzLmhhc1J1bGVzVGFibGVzICYmIChleGVjQXJyID0gKHRoaXMucnVsZXMgYXMgUnVsZXNCbG9ja1RhYmxlcykudGFibGUuZXhlYyhuZXh0UGFydCkpKSB7XG4gICAgICAgIG5leHRQYXJ0ID0gbmV4dFBhcnQuc3Vic3RyaW5nKGV4ZWNBcnJbMF0ubGVuZ3RoKTtcblxuICAgICAgICBjb25zdCBpdGVtOiBUb2tlbiA9IHtcbiAgICAgICAgICB0eXBlOiBUb2tlblR5cGUudGFibGUsXG4gICAgICAgICAgaGVhZGVyOiBleGVjQXJyWzFdLnJlcGxhY2UoL14gKnwgKlxcfCAqJC9nLCAnJykuc3BsaXQoLyAqXFx8ICovKSxcbiAgICAgICAgICBhbGlnbjogZXhlY0FyclsyXS5yZXBsYWNlKC9eICp8XFx8ICokL2csICcnKS5zcGxpdCgvICpcXHwgKi8pIGFzIEFsaWduW10sXG4gICAgICAgICAgY2VsbHM6IFtdLFxuICAgICAgICB9O1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbS5hbGlnbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmICgvXiAqLSs6ICokLy50ZXN0KGl0ZW0uYWxpZ25baV0pKSB7XG4gICAgICAgICAgICBpdGVtLmFsaWduW2ldID0gJ3JpZ2h0JztcbiAgICAgICAgICB9IGVsc2UgaWYgKC9eICo6LSs6ICokLy50ZXN0KGl0ZW0uYWxpZ25baV0pKSB7XG4gICAgICAgICAgICBpdGVtLmFsaWduW2ldID0gJ2NlbnRlcic7XG4gICAgICAgICAgfSBlbHNlIGlmICgvXiAqOi0rICokLy50ZXN0KGl0ZW0uYWxpZ25baV0pKSB7XG4gICAgICAgICAgICBpdGVtLmFsaWduW2ldID0gJ2xlZnQnO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpdGVtLmFsaWduW2ldID0gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0ZCA9IGV4ZWNBcnJbM10ucmVwbGFjZSgvKD86ICpcXHwgKik/XFxuJC8sICcnKS5zcGxpdCgnXFxuJyk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0ZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGl0ZW0uY2VsbHNbaV0gPSB0ZFtpXS5yZXBsYWNlKC9eICpcXHwgKnwgKlxcfCAqJC9nLCAnJykuc3BsaXQoLyAqXFx8ICovKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudG9rZW5zLnB1c2goaXRlbSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBzaW1wbGUgcnVsZXNcbiAgICAgIGlmICh0aGlzLnN0YXRpY1RoaXMuc2ltcGxlUnVsZXMubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IHNpbXBsZVJ1bGVzID0gdGhpcy5zdGF0aWNUaGlzLnNpbXBsZVJ1bGVzO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpbXBsZVJ1bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKChleGVjQXJyID0gc2ltcGxlUnVsZXNbaV0uZXhlYyhuZXh0UGFydCkpKSB7XG4gICAgICAgICAgICBuZXh0UGFydCA9IG5leHRQYXJ0LnN1YnN0cmluZyhleGVjQXJyWzBdLmxlbmd0aCk7XG4gICAgICAgICAgICBjb25zdCB0eXBlID0gJ3NpbXBsZVJ1bGUnICsgKGkgKyAxKTtcbiAgICAgICAgICAgIHRoaXMudG9rZW5zLnB1c2goeyB0eXBlLCBleGVjQXJyIH0pO1xuICAgICAgICAgICAgY29udGludWUgbWFpbkxvb3A7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIHRvcC1sZXZlbCBwYXJhZ3JhcGhcbiAgICAgIGlmICh0b3AgJiYgKGV4ZWNBcnIgPSB0aGlzLnJ1bGVzLnBhcmFncmFwaC5leGVjKG5leHRQYXJ0KSkpIHtcbiAgICAgICAgbmV4dFBhcnQgPSBuZXh0UGFydC5zdWJzdHJpbmcoZXhlY0FyclswXS5sZW5ndGgpO1xuXG4gICAgICAgIGlmIChleGVjQXJyWzFdLnNsaWNlKC0xKSA9PT0gJ1xcbicpIHtcbiAgICAgICAgICB0aGlzLnRva2Vucy5wdXNoKHtcbiAgICAgICAgICAgIHR5cGU6IFRva2VuVHlwZS5wYXJhZ3JhcGgsXG4gICAgICAgICAgICB0ZXh0OiBleGVjQXJyWzFdLnNsaWNlKDAsIC0xKSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnRva2Vucy5wdXNoKHtcbiAgICAgICAgICAgIHR5cGU6IHRoaXMudG9rZW5zLmxlbmd0aCA+IDAgPyBUb2tlblR5cGUucGFyYWdyYXBoIDogVG9rZW5UeXBlLnRleHQsXG4gICAgICAgICAgICB0ZXh0OiBleGVjQXJyWzFdLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyB0ZXh0XG4gICAgICAvLyBUb3AtbGV2ZWwgc2hvdWxkIG5ldmVyIHJlYWNoIGhlcmUuXG4gICAgICBpZiAoKGV4ZWNBcnIgPSB0aGlzLnJ1bGVzLnRleHQuZXhlYyhuZXh0UGFydCkpKSB7XG4gICAgICAgIG5leHRQYXJ0ID0gbmV4dFBhcnQuc3Vic3RyaW5nKGV4ZWNBcnJbMF0ubGVuZ3RoKTtcbiAgICAgICAgdGhpcy50b2tlbnMucHVzaCh7IHR5cGU6IFRva2VuVHlwZS50ZXh0LCB0ZXh0OiBleGVjQXJyWzBdIH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKG5leHRQYXJ0KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAnSW5maW5pdGUgbG9vcCBvbiBieXRlOiAnICsgbmV4dFBhcnQuY2hhckNvZGVBdCgwKSArIGAsIG5lYXIgdGV4dCAnJHtuZXh0UGFydC5zbGljZSgwLCAzMCl9Li4uJ2BcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4geyB0b2tlbnM6IHRoaXMudG9rZW5zLCBsaW5rczogdGhpcy5saW5rcyB9O1xuICB9XG59XG4iLCAiLyoqXG4gKiBHZW5lcmF0ZWQgYnVuZGxlIGluZGV4LiBEbyBub3QgZWRpdC5cbiAqL1xuXG5leHBvcnQgKiBmcm9tICcuL3B1YmxpYy1hcGknO1xuIiwgImltcG9ydCB7IEtFeHBvcnQgfSBmcm9tICdrLWV4cG9ydCdcbmNvbnN0IGtleCA9IG5ldyBLRXhwb3J0KCd+L0Rlc2t0b3Ava2lpY2hpLXBvcnRmb2xpby9wdWJsaWMnICwvLyBzb3VyY2UgZm9sZGVyIC8vJ34vTGlicmFyeS9Nb2JpbGUgRG9jdW1lbnRzL2lDbG91ZH5tZH5vYnNpZGlhbi9Eb2N1bWVudHMvb2JzaWRpYW4ta2lpY2hpLXBvcnRmb2xpby8nLFxuICAgICAgICAgICAgJ34vRGVza3RvcC9raWljaGktcG9ydGZvbGlvL3B1YmxpYycsIC8vIHRlbXBsYXRlIGZvbGRlclxuICAgICAgICAgICAgJ34vRGVza3RvcC9raWljaGktcG9ydGZvbGlvL3B1YmxpYycpOyAvLyBkZXN0aW5hdGlvbiBmb2xkZXJcbmtleC5zdGFydCgpOyJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxTQUFvQjtBQUNwQixXQUFzQjtBQUN0QixTQUFvQjs7O0FDRnBCLElBVWEscUJBQVk7RUFJdkIsWUFBWSxPQUFlLFFBQWdCLElBQUU7QUFDM0MsU0FBSyxTQUFTLE1BQU07QUFDcEIsU0FBSyxRQUFROztFQVNmLFNBQVMsV0FBNEIsYUFBNEI7QUFDL0QsUUFBSSxZQUFvQixPQUFPLGVBQWUsV0FBVyxjQUFjLFlBQVk7QUFDbkYsZ0JBQVksVUFBVSxRQUFRLGdCQUFnQixJQUFJO0FBR2xELFNBQUssU0FBUyxLQUFLLE9BQU8sUUFBUSxXQUFXLFNBQVM7QUFDdEQsV0FBTzs7RUFNVCxZQUFTO0FBQ1AsV0FBTyxJQUFJLE9BQU8sS0FBSyxRQUFRLEtBQUssS0FBSzs7O0FDdEM3QyxBQVlBLElBQU0sYUFBYTtBQUNuQixJQUFNLGdCQUFnQjtBQUN0QixJQUFNLGVBQTZCO0VBQ2pDLEtBQUs7RUFDTCxLQUFLO0VBQ0wsS0FBSztFQUNMLEtBQUs7RUFFTCxLQUFLOztBQUdQLElBQU0scUJBQXFCO0FBQzNCLElBQU0sd0JBQXdCO2dCQUVQLE1BQWMsUUFBZ0I7QUFDbkQsTUFBSSxRQUFRO0FBQ1YsUUFBSSxXQUFXLEtBQUssSUFBSSxHQUFHO0FBQ3pCLGFBQU8sS0FBSyxRQUFRLGVBQWUsQ0FBQyxPQUFlLGFBQWEsR0FBRzs7U0FFaEU7QUFDTCxRQUFJLG1CQUFtQixLQUFLLElBQUksR0FBRztBQUNqQyxhQUFPLEtBQUssUUFBUSx1QkFBdUIsQ0FBQyxPQUFlLGFBQWEsR0FBRzs7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
