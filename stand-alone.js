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
var GalleryItem = class extends GenericItem {
  constructor(inMDRaw, inRelativePath) {
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
    this.processGalleryInfo(inRelativePath);
  }
  processGalleryInfo(relativePath) {
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
    this.thumbnail = path.join(relativePath, cleaned);
    this.fullimage = this.thumbnail;
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
    const genTplFilePath = path.join(this.tplPath, "generic.html");
    let repeaterHtmlArr = [];
    for await (const mdfilePath of this.getFiles(workSrcPath)) {
      const htmlFilePath = mdfilePath.replace(".md", ".html");
      const mdraw = await fs.promises.readFile(mdfilePath, "utf-8");
      const genItem = new GenericItem(mdraw);
      const item = await this.getGalleryItem(mdfilePath, this.srcPath);
      repeaterHtmlArr.push(item.getRepeaterHtml());
      const genTemplateHtml = await fs.promises.readFile(genTplFilePath, "utf-8");
      let genOutputHtml = genTemplateHtml.replace(/<!-- {{{CONTENT}}} -->/, genItem.getHtml());
      genOutputHtml = genOutputHtml.replace(/<!-- {{{COPYRIGHT}}} -->/g, "\xA9 Copyright " + new Date().getFullYear() + " - Kiichi Takeuchi");
      genOutputHtml = genOutputHtml.replace(/<!-- {{{CATEGORY}}} -->/g, "Works");
      genOutputHtml = genOutputHtml.replace(/<!-- {{{TITLE}}} -->/g, item.title);
      genOutputHtml = genOutputHtml.replace(/<!-- {{{SUBTITLE}}} -->/g, `(${item.date})`);
      genOutputHtml = genOutputHtml.replace(/<!-- {{{MDRAW}}} -->/g, `${genItem.mdraw}`);
      await fs.promises.writeFile(htmlFilePath, genOutputHtml);
      console.log(htmlFilePath);
    }
    let repeaterHtml = repeaterHtmlArr.join("\n");
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
  async getGalleryItem(filepath, workfolder) {
    const contents = await fs.promises.readFile(filepath, "utf-8");
    const dirpath = path.dirname(filepath);
    const relativePath = dirpath.replace(workfolder, "");
    let item = new GalleryItem(contents, relativePath);
    return Promise.resolve(item);
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiay1leHBvcnQudHMiLCAibm9kZV9tb2R1bGVzL0B0cy1zdGFjay9wcm9qZWN0cy9tYXJrZG93bi9zcmMvZXh0ZW5kLXJlZ2V4cC50cyIsICJub2RlX21vZHVsZXMvQHRzLXN0YWNrL3Byb2plY3RzL21hcmtkb3duL3NyYy9oZWxwZXJzLnRzIiwgIm5vZGVfbW9kdWxlcy9AdHMtc3RhY2svcHJvamVjdHMvbWFya2Rvd24vc3JjL2ludGVyZmFjZXMudHMiLCAibm9kZV9tb2R1bGVzL0B0cy1zdGFjay9wcm9qZWN0cy9tYXJrZG93bi9zcmMvcmVuZGVyZXIudHMiLCAibm9kZV9tb2R1bGVzL0B0cy1zdGFjay9wcm9qZWN0cy9tYXJrZG93bi9zcmMvaW5saW5lLWxleGVyLnRzIiwgIm5vZGVfbW9kdWxlcy9AdHMtc3RhY2svcHJvamVjdHMvbWFya2Rvd24vc3JjL3BhcnNlci50cyIsICJub2RlX21vZHVsZXMvQHRzLXN0YWNrL3Byb2plY3RzL21hcmtkb3duL3NyYy9tYXJrZWQudHMiLCAibm9kZV9tb2R1bGVzL0B0cy1zdGFjay9wcm9qZWN0cy9tYXJrZG93bi9zcmMvYmxvY2stbGV4ZXIudHMiLCAibm9kZV9tb2R1bGVzL0B0cy1zdGFjay9wcm9qZWN0cy9tYXJrZG93bi90cy1zdGFjay1tYXJrZG93bi50cyIsICJzdGFuZC1hbG9uZS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIG9zIGZyb20gJ29zJztcbmltcG9ydCB7IE1hcmtlZCwgUmVuZGVyZXIgfSBmcm9tICdAdHMtc3RhY2svbWFya2Rvd24nO1xuXG5cbmNsYXNzIE15UmVuZGVyZXIgZXh0ZW5kcyBSZW5kZXJlciB7XG4gIC8vIGltYWdlIGVtYmVkIGFzIDMtRCB2aWV3ZXIgaWYgdGhlIGV4dCBpcyAuZ2xiLiBhZGQgLi8gZm9yIHRoZSBwYXRoXG4gIC8vIGh0dHBzOi8vZG9jLmJhYnlsb25qcy5jb20vZmVhdHVyZXMvZmVhdHVyZXNEZWVwRGl2ZS9iYWJ5bG9uVmlld2VyL2RlZmF1bHRWaWV3ZXJDb25maWdcbiAgaW1hZ2UoaHJlZjogc3RyaW5nLCB0aXRsZTogc3RyaW5nLCB0ZXh0OiBzdHJpbmcpOiBzdHJpbmd7XG4gICAgaWYgKGhyZWYuZW5kc1dpdGgoJy5nbGInKSl7XG4gICAgICAgIHJldHVybiBgPGJhYnlsb24gXG4gICAgICAgIHRlbXBsYXRlcy5uYXYtYmFyLnBhcmFtcy5sb2dvLWltYWdlPVwiL2ltYWdlcy9mYXZpY29uL2FwcGxlLWljb24ucG5nXCIgXG4gICAgICAgIHRlbXBsYXRlcy5uYXYtYmFyLnBhcmFtcy5sb2dvLXRleHQ9XCJDb3B5cmlnaHQgS2lpY2hpIFRha2V1Y2hpXCIgXG4gICAgICAgIHRlbXBsYXRlcy5uYXYtYmFyLnBhcmFtcy5sb2dvLWxpbms9XCJodHRwczovL2tpaWNoaXRha2V1Y2hpLmNvbS9cIiBcbiAgICAgICAgbW9kZWw9XCIuLyR7aHJlZn1cIiA+PC9iYWJ5bG9uPmBcbiAgICB9XG4gICAgcmV0dXJuIHN1cGVyLmltYWdlKGhyZWYsdGl0bGUsdGV4dCk7XG4gIH1cbn1cbk1hcmtlZC5zZXRPcHRpb25zKHtyZW5kZXJlcjogbmV3IE15UmVuZGVyZXJ9KTtcblxuY2xhc3MgR2VuZXJpY0l0ZW0ge1xuICAgIG1kcmF3OnN0cmluZyA9ICcnO1xuICAgIGNvbnN0cnVjdG9yKGluTURSYXc6c3RyaW5nKXtcbiAgICAgICAgdGhpcy5tZHJhdyA9IGluTURSYXc7XG4gICAgfVxuXG4gICAgZ2V0SHRtbCgpe1xuICAgICAgICByZXR1cm4gTWFya2VkLnBhcnNlKHRoaXMubWRyYXcpO1xuICAgICAgICAvLyByZXR1cm4gdGhpcy5tZHJhdy5zcGxpdCgnXFxuJykuZmlsdGVyKCh4KT0+eCkubWFwKGxpbmU9PntcbiAgICAgICAgLy8gICAgIGlmIChsaW5lLnN0YXJ0c1dpdGgoJyMgJykpe1xuICAgICAgICAvLyAgICAgICAgIHJldHVybiBgPGgxPiR7bGluZS5yZXBsYWNlKCcjICcsJycpfTwvaDE+YDtcbiAgICAgICAgLy8gICAgIH1cbiAgICAgICAgLy8gICAgIGVsc2UgaWYgKGxpbmUuc3RhcnRzV2l0aCgnIyMgJykpe1xuICAgICAgICAvLyAgICAgICAgIHJldHVybiBgPGgyPiR7bGluZS5yZXBsYWNlKCcjIyAnLCcnKX08L2gyPmA7XG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vICAgICBlbHNlIGlmIChsaW5lLnN0YXJ0c1dpdGgoJyMjIyAnKSl7XG4gICAgICAgIC8vICAgICAgICAgcmV0dXJuIGA8aDM+JHtsaW5lLnJlcGxhY2UoJyMjIyAnLCcnKX08L2gzPmA7XG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vICAgICBlbHNlIGlmIChsaW5lLnN0YXJ0c1dpdGgoJy0gJykpe1xuICAgICAgICAvLyAgICAgICAgIHJldHVybiBgPGxpPiR7bGluZS5yZXBsYWNlKCctICcsJycpfTwvbGk+YDtcbiAgICAgICAgLy8gICAgIH1cbiAgICAgICAgLy8gICAgIGVsc2UgaWYgKGxpbmUuc3RhcnRzV2l0aCgnLSAnKSl7XG4gICAgICAgIC8vICAgICAgICAgcmV0dXJuIGA8bGk+JHtsaW5lLnJlcGxhY2UoJy0gJywnJyl9PC9saT5gO1xuICAgICAgICAvLyAgICAgfVxuICAgICAgICAvLyAgICAgcmV0dXJuIGA8cD4ke2xpbmV9PC9wPmA7XG4gICAgICAgIC8vIH0pLmpvaW4oJ1xcbicpO1xuICAgIH1cbn1cblxuY2xhc3MgR2FsbGVyeUl0ZW0gZXh0ZW5kcyBHZW5lcmljSXRlbSB7XG4gICAgdGl0bGU6c3RyaW5nID0gJyc7XG4gICAgdGFnczpzdHJpbmcgPSAnJztcbiAgICBkYXRlOnN0cmluZyA9ICcnO1xuICAgIHBsYWNlOnN0cmluZyA9ICcnO1xuICAgIG1lZGl1bTpzdHJpbmcgPSAnJztcbiAgICBkaW1lbnNpb25zOnN0cmluZyA9ICcnO1xuICAgIG5vOnN0cmluZyA9ICcnO1xuICAgIGRlc2NyaXB0aW9uOnN0cmluZyA9ICcnO1xuICAgIHRodW1ibmFpbDpzdHJpbmcgPSAnJztcbiAgICBmdWxsaW1hZ2U6c3RyaW5nID0gJyc7XG5cbiAgICBjb25zdHJ1Y3Rvcihpbk1EUmF3OnN0cmluZywgaW5SZWxhdGl2ZVBhdGg6c3RyaW5nICl7XG4gICAgICAgIHN1cGVyKGluTURSYXcpO1xuICAgICAgICB0aGlzLnByb2Nlc3NHYWxsZXJ5SW5mbyhpblJlbGF0aXZlUGF0aCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwcm9jZXNzR2FsbGVyeUluZm8ocmVsYXRpdmVQYXRoOnN0cmluZyl7XG4gICAgICAgIHZhciBkYXRhOmFueSA9IHt9O1xuICAgICAgICB2YXIga2V5ID0gJyc7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBsaW5lcyA9IHRoaXMubWRyYXcuc3BsaXQoJ1xcbicpLmZpbHRlcigoeCk9PngpO1xuXG4gICAgICAgIGZvciAobGV0IGxpbmUgb2YgbGluZXMpe1xuICAgICAgICAgICAgaWYgKGxpbmUuc3RhcnRzV2l0aCgnIycpKXtcbiAgICAgICAgICAgICAgICBrZXkgPSBsaW5lLnNwbGl0KCcgJylbMV07XG4gICAgICAgICAgICAgICAgZGF0YVtrZXldID0gW107XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoa2V5KXtcbiAgICAgICAgICAgICAgICBkYXRhW2tleV0ucHVzaChsaW5lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcblxuICAgICAgICBmb3IgKGxldCBsaW5lIG9mIGRhdGFbJ0Fib3V0J10pe1xuICAgICAgICAgICAgaWYgKGxpbmUuc3RhcnRzV2l0aCgnLSBUaXRsZTonKSl7XG4gICAgICAgICAgICAgICAgdGhpcy50aXRsZSA9IGxpbmUucmVwbGFjZSgnLSBUaXRsZTonLCcnKS50cmltKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChsaW5lLnN0YXJ0c1dpdGgoJy0gRGF0ZTonKSl7XG4gICAgICAgICAgICAgICAgdGhpcy5kYXRlID0gbGluZS5yZXBsYWNlKCctIERhdGU6JywnJykudHJpbSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobGluZS5zdGFydHNXaXRoKCctIFBsYWNlOicpKXtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYWNlID0gbGluZS5yZXBsYWNlKCctIFBsYWNlOicsJycpLnRyaW0oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGxpbmUuc3RhcnRzV2l0aCgnLSBNZWRpdW06Jykpe1xuICAgICAgICAgICAgICAgIHRoaXMubWVkaXVtID0gbGluZS5yZXBsYWNlKCctIE1lZGl1bTonLCcnKS50cmltKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChsaW5lLnN0YXJ0c1dpdGgoJy0gRGltZW5zaW9uczonKSl7XG4gICAgICAgICAgICAgICAgdGhpcy5kaW1lbnNpb25zID0gbGluZS5yZXBsYWNlKCctIERpbWVuc2lvbnM6JywnJykudHJpbSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobGluZS5zdGFydHNXaXRoKCctIE5vOicpKXtcbiAgICAgICAgICAgICAgICB0aGlzLm5vID0gbGluZS5yZXBsYWNlKCctIE5vOicsJycpLnRyaW0oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGxpbmUuc3RhcnRzV2l0aCgnLSBEZXNjcmlwdGlvbjonKSl7XG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IGxpbmUucmVwbGFjZSgnLSBEZXNjcmlwdGlvbjonLCcnKS50cmltKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChsaW5lLnN0YXJ0c1dpdGgoJy0gVGFnczonKSl7XG4gICAgICAgICAgICAgICAgdGhpcy50YWdzID0gbGluZS5yZXBsYWNlKCctIFRhZ3M6JywnJykudHJpbSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBjb25zdCBjbGVhbmVkID0gZGF0YVsnSW1hZ2VzJ11bMF0ucmVwbGFjZSgnIVtdKCcsJycpLnJlcGxhY2UoJyknLCcnKTtcbiAgICAgICAgdGhpcy50aHVtYm5haWwgPSBwYXRoLmpvaW4ocmVsYXRpdmVQYXRoLCBjbGVhbmVkKTtcbiAgICAgICAgdGhpcy5mdWxsaW1hZ2UgPSB0aGlzLnRodW1ibmFpbDtcbiAgICB9XG5cbiAgICBnZXRSZXBlYXRlckh0bWwoKXtcbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgPGRpdiBjbGFzcz1cIml0ZW0gJHt0aGlzLnRhZ3MucmVwbGFjZSgnIycsJycpfVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBpY2ZyYW1lXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJvdmVybGF5XCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiaWNvblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiR7dGhpcy50aHVtYm5haWx9XCIgZGF0YS10eXBlPVwicHJldHR5UGhvdG9bZ2FsbGVyeV1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtc2VhcmNoIGljb24tdmlld1wiPjwvaT48L2E+XG4gICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPCEtLSBcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJpY29uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLWFsaWduLWp1c3RpZnkgZmEtZXh0ZXJuYWwtbGluayBpY29uLWluZm9cIiBkYXRhLXZhbHVlPVwicHJvamVjdC1kZXRhaWxzLXNsaWRlci5odG1sXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICA8L3NwYW4+IFxuICAgICAgICAgICAgICAgICAgICAtLT5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwZl90ZXh0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicHJvamVjdC1uYW1lXCI+JHt0aGlzLnRpdGxlfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5EYXRlOiAke3RoaXMuZGF0ZX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+UGxhY2U6ICR7dGhpcy5wbGFjZX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+TWVkaXVtOiAke3RoaXMuZGVzY3JpcHRpb259PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PkRpbWVuc2lvbnM6ICR7dGhpcy5kaW1lbnNpb25zfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5ObzogJHt0aGlzLm5vfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuXG4gICAgICAgICAgICAgICAgPGltZyBzcmM9XCIke3RoaXMuZnVsbGltYWdlfVwiIGFsdD1cIlwiIC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIGBcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBLRXhwb3J0IHtcbiAgICBzcmNQYXRoOnN0cmluZyA9ICcnO1xuICAgIGRzdFBhdGg6c3RyaW5nID0gJyc7XG4gICAgdHBsUGF0aDpzdHJpbmcgPSAnJztcbiAgICBjb25zdHJ1Y3RvcihpblNyY1BhdGg6c3RyaW5nLCBpblRwbFBhdGg6c3RyaW5nLCBpbkRzdFBhdGg6c3RyaW5nKXtcbiAgICAgICAgdGhpcy5zcmNQYXRoID0gaW5TcmNQYXRoLnJlcGxhY2UoXCJ+XCIsb3MuaG9tZWRpcigpKTtcbiAgICAgICAgdGhpcy5kc3RQYXRoID0gaW5Ec3RQYXRoLnJlcGxhY2UoXCJ+XCIsb3MuaG9tZWRpcigpKTtcbiAgICAgICAgdGhpcy50cGxQYXRoID0gaW5UcGxQYXRoLnJlcGxhY2UoXCJ+XCIsb3MuaG9tZWRpcigpKTtcbiAgICB9XG5cbiAgICBhc3luYyBzdGFydCgpe1xuICAgICAgICBjb25zb2xlLmxvZyhcIkV4cG9ydCBTdGFydGVkLi4uLlwiKTtcbiAgICAgICAgXG4gICAgICAgIC8vIEdlbmVyYXRlIFdvcmtzXG4gICAgICAgIC8vIDEuIEdhdGhlciBhbGwgTWV0YSBJbmZvIGFuZCBHZW5lcmF0ZSBzaW5nbGUgVGh1bWJuYWlsIEdhbGxlcnlcbiAgICAgICAgLy8gMi4gR2VuZXJhdGUgaW5kaXZpZHVhbCBwYWdlIGFuZCBkdW1wIHRoZSAuaHRtbCBuZXh0IHRvIC5tZCBmaWxlLlxuICAgICAgICAvLyAgICBJbmRpdmlkdWFsIHBhZ2Ugc2hvdWxkIGNvdmVyIGZ1bGwgaHRtbCBjb252ZXJzaW9uIHBsdXMgeW91dHViZSBvciBnbGIgXG4gICAgICAgIGNvbnN0IHdvcmtTcmNQYXRoID0gcGF0aC5qb2luKHRoaXMuc3JjUGF0aCwnd29ya3MnKTtcbiAgICAgICAgY29uc3Qgd29ya1RwbEZpbGVQYXRoID0gcGF0aC5qb2luKHRoaXMudHBsUGF0aCwnd29ya3MuaHRtbCcpO1xuICAgICAgICBjb25zdCB3b3JrRHN0RmlsZVBhdGggPSBwYXRoLmpvaW4odGhpcy5kc3RQYXRoLCd3b3Jrcy5odG1sJyk7XG5cbiAgICAgICAgY29uc3QgZ2VuVHBsRmlsZVBhdGggPSBwYXRoLmpvaW4odGhpcy50cGxQYXRoLCdnZW5lcmljLmh0bWwnKTtcblxuICAgICAgICBsZXQgcmVwZWF0ZXJIdG1sQXJyID0gW107XG4gICAgICAgIC8vIFdhbGsgZWFjaCAubWQgZmlsZXMgaW4gd29ya3NcbiAgICAgICAgZm9yIGF3YWl0IChjb25zdCBtZGZpbGVQYXRoIG9mIHRoaXMuZ2V0RmlsZXMod29ya1NyY1BhdGgpKSB7XG4gICAgICAgICAgICBjb25zdCBodG1sRmlsZVBhdGggPSBtZGZpbGVQYXRoLnJlcGxhY2UoJy5tZCcsJy5odG1sJyk7XG4gICAgICAgICAgICBjb25zdCBtZHJhdyA9IGF3YWl0IGZzLnByb21pc2VzLnJlYWRGaWxlKG1kZmlsZVBhdGgsJ3V0Zi04Jyk7XG4gICAgICAgICAgICBjb25zdCBnZW5JdGVtID0gbmV3IEdlbmVyaWNJdGVtKG1kcmF3KTsgICAgICAgICAgICBcblxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhtZGZpbGVQYXRoKTtcbiAgICAgICAgICAgIC8vIEJ1aWxkIHVwIHRodW1ibmFpbCBodG1sIHJlcGVhdGVyXG4gICAgICAgICAgICBjb25zdCBpdGVtID0gYXdhaXQgdGhpcy5nZXRHYWxsZXJ5SXRlbShtZGZpbGVQYXRoLHRoaXMuc3JjUGF0aCk7XG4gICAgICAgICAgICByZXBlYXRlckh0bWxBcnIucHVzaChpdGVtLmdldFJlcGVhdGVySHRtbCgpKTtcblxuICAgICAgICAgICAgLy8gRWFjaCBNRCAtPiBIVE1MXG4gICAgICAgICAgICBjb25zdCBnZW5UZW1wbGF0ZUh0bWwgPSBhd2FpdCBmcy5wcm9taXNlcy5yZWFkRmlsZShnZW5UcGxGaWxlUGF0aCwndXRmLTgnKTtcbiAgICAgICAgICAgIGxldCBnZW5PdXRwdXRIdG1sID0gZ2VuVGVtcGxhdGVIdG1sLnJlcGxhY2UoLzwhLS0ge3t7Q09OVEVOVH19fSAtLT4vLGdlbkl0ZW0uZ2V0SHRtbCgpKTtcbiAgICAgICAgICAgIGdlbk91dHB1dEh0bWwgPSBnZW5PdXRwdXRIdG1sLnJlcGxhY2UoLzwhLS0ge3t7Q09QWVJJR0hUfX19IC0tPi9nLCdcdTAwQTkgQ29weXJpZ2h0ICcrKG5ldyBEYXRlKCkpLmdldEZ1bGxZZWFyKCkrJyAtIEtpaWNoaSBUYWtldWNoaScpO1xuICAgICAgICAgICAgZ2VuT3V0cHV0SHRtbCA9IGdlbk91dHB1dEh0bWwucmVwbGFjZSgvPCEtLSB7e3tDQVRFR09SWX19fSAtLT4vZywnV29ya3MnKTtcbiAgICAgICAgICAgIGdlbk91dHB1dEh0bWwgPSBnZW5PdXRwdXRIdG1sLnJlcGxhY2UoLzwhLS0ge3t7VElUTEV9fX0gLS0+L2csaXRlbS50aXRsZSk7XG4gICAgICAgICAgICBnZW5PdXRwdXRIdG1sID0gZ2VuT3V0cHV0SHRtbC5yZXBsYWNlKC88IS0tIHt7e1NVQlRJVExFfX19IC0tPi9nLGAoJHtpdGVtLmRhdGV9KWApO1xuICAgICAgICAgICAgZ2VuT3V0cHV0SHRtbCA9IGdlbk91dHB1dEh0bWwucmVwbGFjZSgvPCEtLSB7e3tNRFJBV319fSAtLT4vZyxgJHtnZW5JdGVtLm1kcmF3fWApOyAvLyBodHRwczovL2dpdGh1Yi5jb20vbWFya21hcC9tYXJrbWFwL3RyZWUvbWFzdGVyL3BhY2thZ2VzL21hcmttYXAtYXV0b2xvYWRlclxuICAgICAgICAgICAgYXdhaXQgZnMucHJvbWlzZXMud3JpdGVGaWxlKGh0bWxGaWxlUGF0aCxnZW5PdXRwdXRIdG1sKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGh0bWxGaWxlUGF0aCk7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGdlbk91dHB1dEh0bWwpO1xuXG4gICAgICAgIH1cblxuICAgICAgICAvLyB3b3Jrcy5odG1sXG4gICAgICAgIGxldCByZXBlYXRlckh0bWwgPSByZXBlYXRlckh0bWxBcnIuam9pbignXFxuJyk7ICAgICAgICBcbiAgICAgICAgY29uc3QgZ2FsbGVyeVRlbXBsYXRlSHRtbCA9IGF3YWl0IGZzLnByb21pc2VzLnJlYWRGaWxlKHdvcmtUcGxGaWxlUGF0aCwndXRmLTgnKTtcbiAgICAgICAgbGV0IGdhbGxlcnlPdXRwdXRIdG1sID0gZ2FsbGVyeVRlbXBsYXRlSHRtbC5yZXBsYWNlKCc8IS0tIHt7e0dBTExFUll9fX0gLS0+JyxyZXBlYXRlckh0bWwpO1xuICAgICAgICBnYWxsZXJ5T3V0cHV0SHRtbCA9IGdhbGxlcnlPdXRwdXRIdG1sLnJlcGxhY2UoJzwhLS0ge3t7Q09QWVJJR0hUfX19IC0tPicsJ1x1MDBBOSBDb3B5cmlnaHQgJysobmV3IERhdGUoKSkuZ2V0RnVsbFllYXIoKSsnIC0gS2lpY2hpIFRha2V1Y2hpJyk7XG4gICAgICAgIGF3YWl0IGZzLnByb21pc2VzLndyaXRlRmlsZSh3b3JrRHN0RmlsZVBhdGgsZ2FsbGVyeU91dHB1dEh0bWwpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKGdhbGxlcnlPdXRwdXRIdG1sKTtcblxuICAgICAgICBjb25zb2xlLmxvZyhcIkV4cG9ydCBFbmRlZC4uLi5cIik7XG4gICAgfVxuXG4gICAgYXN5bmMgKmdldEZpbGVzKGRpcjpzdHJpbmcpOmFueSB7XG4gICAgICAgIGNvbnN0IGRpcmVudHMgPSBhd2FpdCBmcy5wcm9taXNlcy5yZWFkZGlyKGRpciwgeyB3aXRoRmlsZVR5cGVzOiB0cnVlIH0pO1xuICAgICAgICBmb3IgKGNvbnN0IGRpcmVudCBvZiBkaXJlbnRzKSB7XG4gICAgICAgICAgY29uc3QgcmVzID0gcGF0aC5yZXNvbHZlKGRpciwgZGlyZW50Lm5hbWUpO1xuICAgICAgICAgIGlmIChkaXJlbnQuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICAgICAgeWllbGQqIHRoaXMuZ2V0RmlsZXMocmVzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZihkaXJlbnQubmFtZS5lbmRzV2l0aChcIi5tZFwiKSl7XG4gICAgICAgICAgICB5aWVsZCByZXM7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIGVsc2UgeyAvLyBkbyBub3RoaW5nIH0gXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBnZXRHYWxsZXJ5SXRlbShmaWxlcGF0aDpzdHJpbmcsIHdvcmtmb2xkZXI6c3RyaW5nKTpQcm9taXNlPEdhbGxlcnlJdGVtPnsgICAgICAgIFxuICAgICAgICAvLyBSZWFkIENvbnRlbnRzIGZyb20gLm1kIGZpbGVcbiAgICAgICAgY29uc3QgY29udGVudHMgPSBhd2FpdCBmcy5wcm9taXNlcy5yZWFkRmlsZShmaWxlcGF0aCwndXRmLTgnKTtcbiAgICAgICAgLy8gQ2FsY3VsYXRlIHJlbGF0aXZlIHBhdGggLSBmdWxsIHBhdGggbWludXMgd29ya2ZvbGRlci4gXG4gICAgICAgIC8vIHRoaXMgaXMgbmVlZGVkIHRvIHBvaW50IHRodW1ibmFpbCBpbWFnZSBwYXRoIGZyb20gdGhlIHJvb3Qgb2Ygd2Vic2l0ZSB0byB3b3Jrcy8gLi4uIGZvbGRlclxuICAgICAgICBjb25zdCBkaXJwYXRoID0gcGF0aC5kaXJuYW1lKGZpbGVwYXRoKTtcbiAgICAgICAgY29uc3QgcmVsYXRpdmVQYXRoID0gZGlycGF0aC5yZXBsYWNlKHdvcmtmb2xkZXIsJycpO1xuICAgICAgICBsZXQgaXRlbSA9IG5ldyBHYWxsZXJ5SXRlbShjb250ZW50cywgcmVsYXRpdmVQYXRoKTsgXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoaXRlbSk7XG4gICAgfVxufSIsICIvKlxuICogQGxpY2Vuc2VcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTEtMjAxNCwgQ2hyaXN0b3BoZXIgSmVmZnJleS4gKE1JVCBMaWNlbnNlZClcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9jaGpqL21hcmtlZFxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxOC0yMDIxLCBcdTA0MUFcdTA0M0VcdTA0NDFcdTA0NDJcdTA0NEYgXHUwNDIyXHUwNDQwXHUwNDM1XHUwNDQyXHUwNDRGXHUwNDNBLiAoTUlUIExpY2Vuc2VkKVxuICogaHR0cHM6Ly9naXRodWIuY29tL3RzLXN0YWNrL21hcmtkb3duXG4gKi9cblxuZXhwb3J0IGNsYXNzIEV4dGVuZFJlZ2V4cCB7XG4gIHByaXZhdGUgc291cmNlOiBzdHJpbmc7XG4gIHByaXZhdGUgZmxhZ3M6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihyZWdleDogUmVnRXhwLCBmbGFnczogc3RyaW5nID0gJycpIHtcbiAgICB0aGlzLnNvdXJjZSA9IHJlZ2V4LnNvdXJjZTtcbiAgICB0aGlzLmZsYWdzID0gZmxhZ3M7XG4gIH1cblxuICAvKipcbiAgICogRXh0ZW5kIHJlZ3VsYXIgZXhwcmVzc2lvbi5cbiAgICpcbiAgICogQHBhcmFtIGdyb3VwTmFtZSBSZWd1bGFyIGV4cHJlc3Npb24gZm9yIHNlYXJjaCBhIGdyb3VwIG5hbWUuXG4gICAqIEBwYXJhbSBncm91cFJlZ2V4cCBSZWd1bGFyIGV4cHJlc3Npb24gb2YgbmFtZWQgZ3JvdXAuXG4gICAqL1xuICBzZXRHcm91cChncm91cE5hbWU6IFJlZ0V4cCB8IHN0cmluZywgZ3JvdXBSZWdleHA6IFJlZ0V4cCB8IHN0cmluZyk6IHRoaXMge1xuICAgIGxldCBuZXdSZWdleHA6IHN0cmluZyA9IHR5cGVvZiBncm91cFJlZ2V4cCA9PSAnc3RyaW5nJyA/IGdyb3VwUmVnZXhwIDogZ3JvdXBSZWdleHAuc291cmNlO1xuICAgIG5ld1JlZ2V4cCA9IG5ld1JlZ2V4cC5yZXBsYWNlKC8oXnxbXlxcW10pXFxeL2csICckMScpO1xuXG4gICAgLy8gRXh0ZW5kIHJlZ2V4cC5cbiAgICB0aGlzLnNvdXJjZSA9IHRoaXMuc291cmNlLnJlcGxhY2UoZ3JvdXBOYW1lLCBuZXdSZWdleHApO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSByZXN1bHQgb2YgZXh0ZW5kaW5nIGEgcmVndWxhciBleHByZXNzaW9uLlxuICAgKi9cbiAgZ2V0UmVnZXhwKCk6IFJlZ0V4cCB7XG4gICAgcmV0dXJuIG5ldyBSZWdFeHAodGhpcy5zb3VyY2UsIHRoaXMuZmxhZ3MpO1xuICB9XG59XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxMS0yMDE0LCBDaHJpc3RvcGhlciBKZWZmcmV5LiAoTUlUIExpY2Vuc2VkKVxuICogaHR0cHM6Ly9naXRodWIuY29tL2NoamovbWFya2VkXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE4LTIwMjEsIFx1MDQxQVx1MDQzRVx1MDQ0MVx1MDQ0Mlx1MDQ0RiBcdTA0MjJcdTA0NDBcdTA0MzVcdTA0NDJcdTA0NEZcdTA0M0EuIChNSVQgTGljZW5zZWQpXG4gKiBodHRwczovL2dpdGh1Yi5jb20vdHMtc3RhY2svbWFya2Rvd25cbiAqL1xuXG5pbXBvcnQgeyBSZXBsYWNlbWVudHMgfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuXG5jb25zdCBlc2NhcGVUZXN0ID0gL1smPD5cIiddLztcbmNvbnN0IGVzY2FwZVJlcGxhY2UgPSAvWyY8PlwiJ10vZztcbmNvbnN0IHJlcGxhY2VtZW50czogUmVwbGFjZW1lbnRzID0ge1xuICAnJic6ICcmYW1wOycsXG4gICc8JzogJyZsdDsnLFxuICAnPic6ICcmZ3Q7JyxcbiAgJ1wiJzogJyZxdW90OycsXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpxdW90ZW1hcmtcbiAgXCInXCI6ICcmIzM5OycsXG59O1xuXG5jb25zdCBlc2NhcGVUZXN0Tm9FbmNvZGUgPSAvWzw+XCInXXwmKD8hIz9cXHcrOykvO1xuY29uc3QgZXNjYXBlUmVwbGFjZU5vRW5jb2RlID0gL1s8PlwiJ118Jig/ISM/XFx3KzspL2c7XG5cbmV4cG9ydCBmdW5jdGlvbiBlc2NhcGUoaHRtbDogc3RyaW5nLCBlbmNvZGU/OiBib29sZWFuKSB7XG4gIGlmIChlbmNvZGUpIHtcbiAgICBpZiAoZXNjYXBlVGVzdC50ZXN0KGh0bWwpKSB7XG4gICAgICByZXR1cm4gaHRtbC5yZXBsYWNlKGVzY2FwZVJlcGxhY2UsIChjaDogc3RyaW5nKSA9PiByZXBsYWNlbWVudHNbY2hdKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGVzY2FwZVRlc3ROb0VuY29kZS50ZXN0KGh0bWwpKSB7XG4gICAgICByZXR1cm4gaHRtbC5yZXBsYWNlKGVzY2FwZVJlcGxhY2VOb0VuY29kZSwgKGNoOiBzdHJpbmcpID0+IHJlcGxhY2VtZW50c1tjaF0pO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBodG1sO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdW5lc2NhcGUoaHRtbDogc3RyaW5nKSB7XG4gIC8vIEV4cGxpY2l0bHkgbWF0Y2ggZGVjaW1hbCwgaGV4LCBhbmQgbmFtZWQgSFRNTCBlbnRpdGllc1xuICByZXR1cm4gaHRtbC5yZXBsYWNlKC8mKCMoPzpcXGQrKXwoPzojeFswLTlBLUZhLWZdKyl8KD86XFx3KykpOz8vZ2ksIGZ1bmN0aW9uIChfLCBuKSB7XG4gICAgbiA9IG4udG9Mb3dlckNhc2UoKTtcblxuICAgIGlmIChuID09PSAnY29sb24nKSB7XG4gICAgICByZXR1cm4gJzonO1xuICAgIH1cblxuICAgIGlmIChuLmNoYXJBdCgwKSA9PT0gJyMnKSB7XG4gICAgICByZXR1cm4gbi5jaGFyQXQoMSkgPT09ICd4J1xuICAgICAgICA/IFN0cmluZy5mcm9tQ2hhckNvZGUocGFyc2VJbnQobi5zdWJzdHJpbmcoMiksIDE2KSlcbiAgICAgICAgOiBTdHJpbmcuZnJvbUNoYXJDb2RlKCtuLnN1YnN0cmluZygxKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuICcnO1xuICB9KTtcbn1cbiIsICIvKipcbiAqIEBsaWNlbnNlXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE4LTIwMjEsIFx1MDQxQVx1MDQzRVx1MDQ0MVx1MDQ0Mlx1MDQ0RiBcdTA0MjJcdTA0NDBcdTA0MzVcdTA0NDJcdTA0NEZcdTA0M0EuIChNSVQgTGljZW5zZWQpXG4gKiBodHRwczovL2dpdGh1Yi5jb20vdHMtc3RhY2svbWFya2Rvd25cbiAqL1xuXG5pbXBvcnQgeyBlc2NhcGUsIHVuZXNjYXBlIH0gZnJvbSAnLi9oZWxwZXJzJztcbmltcG9ydCB7IFJlbmRlcmVyIH0gZnJvbSAnLi9yZW5kZXJlcic7XG5cbmV4cG9ydCBpbnRlcmZhY2UgT2JqIHtcbiAgW2tleTogc3RyaW5nXTogYW55O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJ1bGVzQmxvY2tCYXNlIHtcbiAgbmV3bGluZTogUmVnRXhwO1xuICBjb2RlOiBSZWdFeHA7XG4gIGhyOiBSZWdFeHA7XG4gIGhlYWRpbmc6IFJlZ0V4cDtcbiAgbGhlYWRpbmc6IFJlZ0V4cDtcbiAgYmxvY2txdW90ZTogUmVnRXhwO1xuICBsaXN0OiBSZWdFeHA7XG4gIGh0bWw6IFJlZ0V4cDtcbiAgZGVmOiBSZWdFeHA7XG4gIHBhcmFncmFwaDogUmVnRXhwO1xuICB0ZXh0OiBSZWdFeHA7XG4gIGJ1bGxldDogUmVnRXhwO1xuICAvKipcbiAgICogTGlzdCBpdGVtICg8bGk+KS5cbiAgICovXG4gIGl0ZW06IFJlZ0V4cDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSdWxlc0Jsb2NrR2ZtIGV4dGVuZHMgUnVsZXNCbG9ja0Jhc2Uge1xuICBmZW5jZXM6IFJlZ0V4cDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSdWxlc0Jsb2NrVGFibGVzIGV4dGVuZHMgUnVsZXNCbG9ja0dmbSB7XG4gIG5wdGFibGU6IFJlZ0V4cDtcbiAgdGFibGU6IFJlZ0V4cDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBMaW5rIHtcbiAgaHJlZjogc3RyaW5nO1xuICB0aXRsZTogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIExpbmtzIHtcbiAgW2tleTogc3RyaW5nXTogTGluaztcbn1cblxuZXhwb3J0IGVudW0gVG9rZW5UeXBlIHtcbiAgc3BhY2UgPSAxLFxuICB0ZXh0LFxuICBwYXJhZ3JhcGgsXG4gIGhlYWRpbmcsXG4gIGxpc3RTdGFydCxcbiAgbGlzdEVuZCxcbiAgbG9vc2VJdGVtU3RhcnQsXG4gIGxvb3NlSXRlbUVuZCxcbiAgbGlzdEl0ZW1TdGFydCxcbiAgbGlzdEl0ZW1FbmQsXG4gIGJsb2NrcXVvdGVTdGFydCxcbiAgYmxvY2txdW90ZUVuZCxcbiAgY29kZSxcbiAgdGFibGUsXG4gIGh0bWwsXG4gIGhyXG59XG5cbmV4cG9ydCB0eXBlIEFsaWduID0gJ2NlbnRlcicgfCAnbGVmdCcgfCAncmlnaHQnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFRva2VuIHtcbiAgdHlwZTogbnVtYmVyIHwgc3RyaW5nO1xuICB0ZXh0Pzogc3RyaW5nO1xuICBsYW5nPzogc3RyaW5nO1xuICAvKipcbiAgICogTWV0YWRhdGEgb2YgZ2ZtIGNvZGUuXG4gICAqL1xuICBtZXRhPzogc3RyaW5nO1xuICBkZXB0aD86IG51bWJlcjtcbiAgaGVhZGVyPzogc3RyaW5nW107XG4gIGFsaWduPzogQWxpZ25bXTtcbiAgY2VsbHM/OiBzdHJpbmdbXVtdO1xuICBvcmRlcmVkPzogYm9vbGVhbjtcbiAgcHJlPzogYm9vbGVhbjtcbiAgZXNjYXBlZD86IGJvb2xlYW47XG4gIGV4ZWNBcnI/OiBSZWdFeHBFeGVjQXJyYXk7XG4gIC8qKlxuICAgKiBVc2VkIGZvciBkZWJ1Z2dpbmcuIElkZW50aWZpZXMgdGhlIGxpbmUgbnVtYmVyIGluIHRoZSByZXN1bHRpbmcgSFRNTCBmaWxlLlxuICAgKi9cbiAgbGluZT86IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSdWxlc0lubGluZUJhc2Uge1xuICBlc2NhcGU6IFJlZ0V4cDtcbiAgYXV0b2xpbms6IFJlZ0V4cDtcbiAgdGFnOiBSZWdFeHA7XG4gIGxpbms6IFJlZ0V4cDtcbiAgcmVmbGluazogUmVnRXhwO1xuICBub2xpbms6IFJlZ0V4cDtcbiAgc3Ryb25nOiBSZWdFeHA7XG4gIGVtOiBSZWdFeHA7XG4gIGNvZGU6IFJlZ0V4cDtcbiAgYnI6IFJlZ0V4cDtcbiAgdGV4dDogUmVnRXhwO1xuICBfaW5zaWRlOiBSZWdFeHA7XG4gIF9ocmVmOiBSZWdFeHA7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUnVsZXNJbmxpbmVQZWRhbnRpYyBleHRlbmRzIFJ1bGVzSW5saW5lQmFzZSB7fVxuXG4vKipcbiAqIEdGTSBJbmxpbmUgR3JhbW1hclxuICovXG5leHBvcnQgaW50ZXJmYWNlIFJ1bGVzSW5saW5lR2ZtIGV4dGVuZHMgUnVsZXNJbmxpbmVCYXNlIHtcbiAgdXJsOiBSZWdFeHA7XG4gIGRlbDogUmVnRXhwO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJ1bGVzSW5saW5lQnJlYWtzIGV4dGVuZHMgUnVsZXNJbmxpbmVHZm0ge31cblxuZXhwb3J0IGNsYXNzIE1hcmtlZE9wdGlvbnMge1xuICBnZm0/OiBib29sZWFuID0gdHJ1ZTtcbiAgdGFibGVzPzogYm9vbGVhbiA9IHRydWU7XG4gIGJyZWFrcz86IGJvb2xlYW4gPSBmYWxzZTtcbiAgcGVkYW50aWM/OiBib29sZWFuID0gZmFsc2U7XG4gIHNhbml0aXplPzogYm9vbGVhbiA9IGZhbHNlO1xuICBzYW5pdGl6ZXI/OiAodGV4dDogc3RyaW5nKSA9PiBzdHJpbmc7XG4gIG1hbmdsZT86IGJvb2xlYW4gPSB0cnVlO1xuICBzbWFydExpc3RzPzogYm9vbGVhbiA9IGZhbHNlO1xuICBzaWxlbnQ/OiBib29sZWFuID0gZmFsc2U7XG4gIC8qKlxuICAgKiBAcGFyYW0gY29kZSBUaGUgc2VjdGlvbiBvZiBjb2RlIHRvIHBhc3MgdG8gdGhlIGhpZ2hsaWdodGVyLlxuICAgKiBAcGFyYW0gbGFuZyBUaGUgcHJvZ3JhbW1pbmcgbGFuZ3VhZ2Ugc3BlY2lmaWVkIGluIHRoZSBjb2RlIGJsb2NrLlxuICAgKi9cbiAgaGlnaGxpZ2h0PzogKGNvZGU6IHN0cmluZywgbGFuZz86IHN0cmluZykgPT4gc3RyaW5nO1xuICBsYW5nUHJlZml4Pzogc3RyaW5nID0gJ2xhbmctJztcbiAgc21hcnR5cGFudHM/OiBib29sZWFuID0gZmFsc2U7XG4gIGhlYWRlclByZWZpeD86IHN0cmluZyA9ICcnO1xuICAvKipcbiAgICogQW4gb2JqZWN0IGNvbnRhaW5pbmcgZnVuY3Rpb25zIHRvIHJlbmRlciB0b2tlbnMgdG8gSFRNTC4gRGVmYXVsdDogYG5ldyBSZW5kZXJlcigpYFxuICAgKi9cbiAgcmVuZGVyZXI/OiBSZW5kZXJlcjtcbiAgLyoqXG4gICAqIFNlbGYtY2xvc2UgdGhlIHRhZ3MgZm9yIHZvaWQgZWxlbWVudHMgKCZsdDtici8mZ3Q7LCAmbHQ7aW1nLyZndDssIGV0Yy4pXG4gICAqIHdpdGggYSBcIi9cIiBhcyByZXF1aXJlZCBieSBYSFRNTC5cbiAgICovXG4gIHhodG1sPzogYm9vbGVhbiA9IGZhbHNlO1xuICAvKipcbiAgICogVGhlIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSB1c2luZyB0byBlc2NhcGUgSFRNTCBlbnRpdGllcy5cbiAgICogQnkgZGVmYXVsdCB1c2luZyBpbm5lciBoZWxwZXIuXG4gICAqL1xuICBlc2NhcGU/OiAoaHRtbDogc3RyaW5nLCBlbmNvZGU/OiBib29sZWFuKSA9PiBzdHJpbmcgPSBlc2NhcGU7XG4gIC8qKlxuICAgKiBUaGUgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIHVzaW5nIHRvIHVuZXNjYXBlIEhUTUwgZW50aXRpZXMuXG4gICAqIEJ5IGRlZmF1bHQgdXNpbmcgaW5uZXIgaGVscGVyLlxuICAgKi9cbiAgdW5lc2NhcGU/OiAoaHRtbDogc3RyaW5nKSA9PiBzdHJpbmcgPSB1bmVzY2FwZTtcbiAgLyoqXG4gICAqIElmIHNldCB0byBgdHJ1ZWAsIGFuIGlubGluZSB0ZXh0IHdpbGwgbm90IGJlIHRha2VuIGluIHBhcmFncmFwaC5cbiAgICpcbiAgICogYGBgdHNcbiAgICogLy8gaXNOb1AgPT0gZmFsc2VcbiAgICogTWFya2VkLnBhcnNlKCdzb21lIHRleHQnKTsgLy8gcmV0dXJucyAnPHA+c29tZSB0ZXh0PC9wPidcbiAgICpcbiAgICogTWFya2VkLnNldE9wdGlvbnMoe2lzTm9QOiB0cnVlfSk7XG4gICAqXG4gICAqIE1hcmtlZC5wYXJzZSgnc29tZSB0ZXh0Jyk7IC8vIHJldHVybnMgJ3NvbWUgdGV4dCdcbiAgICogYGBgXG4gICAqL1xuICBpc05vUD86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGV4ZXJSZXR1cm5zIHtcbiAgdG9rZW5zOiBUb2tlbltdO1xuICBsaW5rczogTGlua3M7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRGVidWdSZXR1cm5zIGV4dGVuZHMgTGV4ZXJSZXR1cm5zIHtcbiAgcmVzdWx0OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVwbGFjZW1lbnRzIHtcbiAgW2tleTogc3RyaW5nXTogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJ1bGVzSW5saW5lQ2FsbGJhY2sge1xuICByZWdleHA/OiBSZWdFeHA7XG4gIGNvbmRpdGlvbigpOiBSZWdFeHA7XG4gIHRva2VuaXplKGV4ZWNBcnI6IFJlZ0V4cEV4ZWNBcnJheSk6IHZvaWQ7XG59XG5cbmV4cG9ydCB0eXBlIFNpbXBsZVJlbmRlcmVyID0gKGV4ZWNBcnI/OiBSZWdFeHBFeGVjQXJyYXkpID0+IHN0cmluZztcbiIsICIvKipcbiAqIEBsaWNlbnNlXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDExLTIwMTQsIENocmlzdG9waGVyIEplZmZyZXkuIChNSVQgTGljZW5zZWQpXG4gKiBodHRwczovL2dpdGh1Yi5jb20vY2hqai9tYXJrZWRcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTgtMjAyMSwgXHUwNDFBXHUwNDNFXHUwNDQxXHUwNDQyXHUwNDRGIFx1MDQyMlx1MDQ0MFx1MDQzNVx1MDQ0Mlx1MDQ0Rlx1MDQzQS4gKE1JVCBMaWNlbnNlZClcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS90cy1zdGFjay9tYXJrZG93blxuICovXG5cbmltcG9ydCB7IEFsaWduLCBNYXJrZWRPcHRpb25zIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7IE1hcmtlZCB9IGZyb20gJy4vbWFya2VkJztcblxuZXhwb3J0IGNsYXNzIFJlbmRlcmVyIHtcbiAgcHJvdGVjdGVkIG9wdGlvbnM6IE1hcmtlZE9wdGlvbnM7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucz86IE1hcmtlZE9wdGlvbnMpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IE1hcmtlZC5vcHRpb25zO1xuICB9XG5cbiAgY29kZShjb2RlOiBzdHJpbmcsIGxhbmc/OiBzdHJpbmcsIGVzY2FwZWQ/OiBib29sZWFuLCBtZXRhPzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLmhpZ2hsaWdodCkge1xuICAgICAgY29uc3Qgb3V0ID0gdGhpcy5vcHRpb25zLmhpZ2hsaWdodChjb2RlLCBsYW5nKTtcblxuICAgICAgaWYgKG91dCAhPSBudWxsICYmIG91dCAhPT0gY29kZSkge1xuICAgICAgICBlc2NhcGVkID0gdHJ1ZTtcbiAgICAgICAgY29kZSA9IG91dDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBlc2NhcGVkQ29kZSA9IChlc2NhcGVkID8gY29kZSA6IHRoaXMub3B0aW9ucy5lc2NhcGUoY29kZSwgdHJ1ZSkpO1xuXG4gICAgaWYgKCFsYW5nKSB7XG4gICAgICByZXR1cm4gYFxcbjxwcmU+PGNvZGU+JHtlc2NhcGVkQ29kZX1cXG48L2NvZGU+PC9wcmU+XFxuYDtcbiAgICB9XG5cbiAgICBjb25zdCBjbGFzc05hbWUgPSB0aGlzLm9wdGlvbnMubGFuZ1ByZWZpeCArIHRoaXMub3B0aW9ucy5lc2NhcGUobGFuZywgdHJ1ZSk7XG4gICAgcmV0dXJuIGBcXG48cHJlPjxjb2RlIGNsYXNzPVwiJHtjbGFzc05hbWV9XCI+JHtlc2NhcGVkQ29kZX1cXG48L2NvZGU+PC9wcmU+XFxuYDtcbiAgfVxuXG4gIGJsb2NrcXVvdGUocXVvdGU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGA8YmxvY2txdW90ZT5cXG4ke3F1b3RlfTwvYmxvY2txdW90ZT5cXG5gO1xuICB9XG5cbiAgaHRtbChodG1sOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBodG1sO1xuICB9XG5cbiAgaGVhZGluZyh0ZXh0OiBzdHJpbmcsIGxldmVsOiBudW1iZXIsIHJhdzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBpZDogc3RyaW5nID0gdGhpcy5vcHRpb25zLmhlYWRlclByZWZpeCArIHJhdy50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL1teXFx3XSsvZywgJy0nKTtcblxuICAgIHJldHVybiBgPGgke2xldmVsfSBpZD1cIiR7aWR9XCI+JHt0ZXh0fTwvaCR7bGV2ZWx9PlxcbmA7XG4gIH1cblxuICBocigpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLm9wdGlvbnMueGh0bWwgPyAnPGhyLz5cXG4nIDogJzxocj5cXG4nO1xuICB9XG5cbiAgbGlzdChib2R5OiBzdHJpbmcsIG9yZGVyZWQ/OiBib29sZWFuKTogc3RyaW5nIHtcbiAgICBjb25zdCB0eXBlID0gb3JkZXJlZCA/ICdvbCcgOiAndWwnO1xuXG4gICAgcmV0dXJuIGBcXG48JHt0eXBlfT5cXG4ke2JvZHl9PC8ke3R5cGV9PlxcbmA7XG4gIH1cblxuICBsaXN0aXRlbSh0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiAnPGxpPicgKyB0ZXh0ICsgJzwvbGk+XFxuJztcbiAgfVxuXG4gIHBhcmFncmFwaCh0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiAnPHA+JyArIHRleHQgKyAnPC9wPlxcbic7XG4gIH1cblxuICB0YWJsZShoZWFkZXI6IHN0cmluZywgYm9keTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYFxuPHRhYmxlPlxuPHRoZWFkPlxuJHtoZWFkZXJ9PC90aGVhZD5cbjx0Ym9keT5cbiR7Ym9keX08L3Rib2R5PlxuPC90YWJsZT5cbmA7XG4gIH1cblxuICB0YWJsZXJvdyhjb250ZW50OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiAnPHRyPlxcbicgKyBjb250ZW50ICsgJzwvdHI+XFxuJztcbiAgfVxuXG4gIHRhYmxlY2VsbChjb250ZW50OiBzdHJpbmcsIGZsYWdzOiB7IGhlYWRlcj86IGJvb2xlYW47IGFsaWduPzogQWxpZ24gfSk6IHN0cmluZyB7XG4gICAgY29uc3QgdHlwZSA9IGZsYWdzLmhlYWRlciA/ICd0aCcgOiAndGQnO1xuICAgIGNvbnN0IHRhZyA9IGZsYWdzLmFsaWduID8gJzwnICsgdHlwZSArICcgc3R5bGU9XCJ0ZXh0LWFsaWduOicgKyBmbGFncy5hbGlnbiArICdcIj4nIDogJzwnICsgdHlwZSArICc+JztcbiAgICByZXR1cm4gdGFnICsgY29udGVudCArICc8LycgKyB0eXBlICsgJz5cXG4nO1xuICB9XG5cbiAgLy8gKioqIElubGluZSBsZXZlbCByZW5kZXJlciBtZXRob2RzLiAqKipcblxuICBzdHJvbmcodGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gJzxzdHJvbmc+JyArIHRleHQgKyAnPC9zdHJvbmc+JztcbiAgfVxuXG4gIGVtKHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuICc8ZW0+JyArIHRleHQgKyAnPC9lbT4nO1xuICB9XG5cbiAgY29kZXNwYW4odGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gJzxjb2RlPicgKyB0ZXh0ICsgJzwvY29kZT4nO1xuICB9XG5cbiAgYnIoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLnhodG1sID8gJzxici8+JyA6ICc8YnI+JztcbiAgfVxuXG4gIGRlbCh0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiAnPGRlbD4nICsgdGV4dCArICc8L2RlbD4nO1xuICB9XG5cbiAgbGluayhocmVmOiBzdHJpbmcsIHRpdGxlOiBzdHJpbmcsIHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5zYW5pdGl6ZSkge1xuICAgICAgbGV0IHByb3Q6IHN0cmluZztcblxuICAgICAgdHJ5IHtcbiAgICAgICAgcHJvdCA9IGRlY29kZVVSSUNvbXBvbmVudCh0aGlzLm9wdGlvbnMudW5lc2NhcGUoaHJlZikpXG4gICAgICAgICAgLnJlcGxhY2UoL1teXFx3Ol0vZywgJycpXG4gICAgICAgICAgLnRvTG93ZXJDYXNlKCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgfVxuXG4gICAgICBpZiAocHJvdC5pbmRleE9mKCdqYXZhc2NyaXB0OicpID09PSAwIHx8IHByb3QuaW5kZXhPZigndmJzY3JpcHQ6JykgPT09IDAgfHwgcHJvdC5pbmRleE9mKCdkYXRhOicpID09PSAwKSB7XG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgfVxuICAgIH1cblxuICAgIGxldCBvdXQgPSAnPGEgaHJlZj1cIicgKyBocmVmICsgJ1wiJztcblxuICAgIGlmICh0aXRsZSkge1xuICAgICAgb3V0ICs9ICcgdGl0bGU9XCInICsgdGl0bGUgKyAnXCInO1xuICAgIH1cblxuICAgIG91dCArPSAnPicgKyB0ZXh0ICsgJzwvYT4nO1xuXG4gICAgcmV0dXJuIG91dDtcbiAgfVxuXG4gIGltYWdlKGhyZWY6IHN0cmluZywgdGl0bGU6IHN0cmluZywgdGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBsZXQgb3V0ID0gJzxpbWcgc3JjPVwiJyArIGhyZWYgKyAnXCIgYWx0PVwiJyArIHRleHQgKyAnXCInO1xuXG4gICAgaWYgKHRpdGxlKSB7XG4gICAgICBvdXQgKz0gJyB0aXRsZT1cIicgKyB0aXRsZSArICdcIic7XG4gICAgfVxuXG4gICAgb3V0ICs9IHRoaXMub3B0aW9ucy54aHRtbCA/ICcvPicgOiAnPic7XG5cbiAgICByZXR1cm4gb3V0O1xuICB9XG5cbiAgdGV4dCh0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiB0ZXh0O1xuICB9XG59XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxMS0yMDE0LCBDaHJpc3RvcGhlciBKZWZmcmV5LiAoTUlUIExpY2Vuc2VkKVxuICogaHR0cHM6Ly9naXRodWIuY29tL2NoamovbWFya2VkXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE4LTIwMjEsIFx1MDQxQVx1MDQzRVx1MDQ0MVx1MDQ0Mlx1MDQ0RiBcdTA0MjJcdTA0NDBcdTA0MzVcdTA0NDJcdTA0NEZcdTA0M0EuIChNSVQgTGljZW5zZWQpXG4gKiBodHRwczovL2dpdGh1Yi5jb20vdHMtc3RhY2svbWFya2Rvd25cbiAqL1xuXG5pbXBvcnQgeyBFeHRlbmRSZWdleHAgfSBmcm9tICcuL2V4dGVuZC1yZWdleHAnO1xuaW1wb3J0IHtcbiAgTGluayxcbiAgTGlua3MsXG4gIE1hcmtlZE9wdGlvbnMsXG4gIFJ1bGVzSW5saW5lQmFzZSxcbiAgUnVsZXNJbmxpbmVCcmVha3MsXG4gIFJ1bGVzSW5saW5lQ2FsbGJhY2ssXG4gIFJ1bGVzSW5saW5lR2ZtLFxuICBSdWxlc0lubGluZVBlZGFudGljLFxufSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgTWFya2VkIH0gZnJvbSAnLi9tYXJrZWQnO1xuaW1wb3J0IHsgUmVuZGVyZXIgfSBmcm9tICcuL3JlbmRlcmVyJztcblxuLyoqXG4gKiBJbmxpbmUgTGV4ZXIgJiBDb21waWxlci5cbiAqL1xuZXhwb3J0IGNsYXNzIElubGluZUxleGVyIHtcbiAgcHJvdGVjdGVkIHN0YXRpYyBydWxlc0Jhc2U6IFJ1bGVzSW5saW5lQmFzZSA9IG51bGw7XG4gIC8qKlxuICAgKiBQZWRhbnRpYyBJbmxpbmUgR3JhbW1hci5cbiAgICovXG4gIHByb3RlY3RlZCBzdGF0aWMgcnVsZXNQZWRhbnRpYzogUnVsZXNJbmxpbmVQZWRhbnRpYyA9IG51bGw7XG4gIC8qKlxuICAgKiBHRk0gSW5saW5lIEdyYW1tYXJcbiAgICovXG4gIHByb3RlY3RlZCBzdGF0aWMgcnVsZXNHZm06IFJ1bGVzSW5saW5lR2ZtID0gbnVsbDtcbiAgLyoqXG4gICAqIEdGTSArIExpbmUgQnJlYWtzIElubGluZSBHcmFtbWFyLlxuICAgKi9cbiAgcHJvdGVjdGVkIHN0YXRpYyBydWxlc0JyZWFrczogUnVsZXNJbmxpbmVCcmVha3MgPSBudWxsO1xuICBwcm90ZWN0ZWQgcnVsZXM6IFJ1bGVzSW5saW5lQmFzZSB8IFJ1bGVzSW5saW5lUGVkYW50aWMgfCBSdWxlc0lubGluZUdmbSB8IFJ1bGVzSW5saW5lQnJlYWtzO1xuICBwcm90ZWN0ZWQgcmVuZGVyZXI6IFJlbmRlcmVyO1xuICBwcm90ZWN0ZWQgaW5MaW5rOiBib29sZWFuO1xuICBwcm90ZWN0ZWQgaGFzUnVsZXNHZm06IGJvb2xlYW47XG4gIHByb3RlY3RlZCBydWxlQ2FsbGJhY2tzOiBSdWxlc0lubGluZUNhbGxiYWNrW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIHN0YXRpY1RoaXM6IHR5cGVvZiBJbmxpbmVMZXhlcixcbiAgICBwcm90ZWN0ZWQgbGlua3M6IExpbmtzLFxuICAgIHByb3RlY3RlZCBvcHRpb25zOiBNYXJrZWRPcHRpb25zID0gTWFya2VkLm9wdGlvbnMsXG4gICAgcmVuZGVyZXI/OiBSZW5kZXJlclxuICApIHtcbiAgICB0aGlzLnJlbmRlcmVyID0gcmVuZGVyZXIgfHwgdGhpcy5vcHRpb25zLnJlbmRlcmVyIHx8IG5ldyBSZW5kZXJlcih0aGlzLm9wdGlvbnMpO1xuXG4gICAgaWYgKCF0aGlzLmxpbmtzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYElubGluZUxleGVyIHJlcXVpcmVzICdsaW5rcycgcGFyYW1ldGVyLmApO1xuICAgIH1cblxuICAgIHRoaXMuc2V0UnVsZXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGF0aWMgTGV4aW5nL0NvbXBpbGluZyBNZXRob2QuXG4gICAqL1xuICBzdGF0aWMgb3V0cHV0KHNyYzogc3RyaW5nLCBsaW5rczogTGlua3MsIG9wdGlvbnM6IE1hcmtlZE9wdGlvbnMpOiBzdHJpbmcge1xuICAgIGNvbnN0IGlubGluZUxleGVyID0gbmV3IHRoaXModGhpcywgbGlua3MsIG9wdGlvbnMpO1xuICAgIHJldHVybiBpbmxpbmVMZXhlci5vdXRwdXQoc3JjKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzdGF0aWMgZ2V0UnVsZXNCYXNlKCk6IFJ1bGVzSW5saW5lQmFzZSB7XG4gICAgaWYgKHRoaXMucnVsZXNCYXNlKSB7XG4gICAgICByZXR1cm4gdGhpcy5ydWxlc0Jhc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5saW5lLUxldmVsIEdyYW1tYXIuXG4gICAgICovXG4gICAgY29uc3QgYmFzZTogUnVsZXNJbmxpbmVCYXNlID0ge1xuICAgICAgZXNjYXBlOiAvXlxcXFwoW1xcXFxgKnt9XFxbXFxdKCkjK1xcLS4hXz5dKS8sXG4gICAgICBhdXRvbGluazogL148KFteIDw+XSsoQHw6XFwvKVteIDw+XSspPi8sXG4gICAgICB0YWc6IC9ePCEtLVtcXHNcXFNdKj8tLT58XjxcXC8/XFx3Kyg/OlwiW15cIl0qXCJ8J1teJ10qJ3xbXjwnXCI+XSkqPz4vLFxuICAgICAgbGluazogL14hP1xcWyhpbnNpZGUpXFxdXFwoaHJlZlxcKS8sXG4gICAgICByZWZsaW5rOiAvXiE/XFxbKGluc2lkZSlcXF1cXHMqXFxbKFteXFxdXSopXFxdLyxcbiAgICAgIG5vbGluazogL14hP1xcWygoPzpcXFtbXlxcXV0qXFxdfFteXFxbXFxdXSkqKVxcXS8sXG4gICAgICBzdHJvbmc6IC9eX18oW1xcc1xcU10rPylfXyg/IV8pfF5cXCpcXCooW1xcc1xcU10rPylcXCpcXCooPyFcXCopLyxcbiAgICAgIGVtOiAvXlxcYl8oKD86W15fXXxfXykrPylfXFxifF5cXCooKD86XFwqXFwqfFtcXHNcXFNdKSs/KVxcKig/IVxcKikvLFxuICAgICAgY29kZTogL14oYCspKFtcXHNcXFNdKj9bXmBdKVxcMSg/IWApLyxcbiAgICAgIGJyOiAvXiB7Mix9XFxuKD8hXFxzKiQpLyxcbiAgICAgIHRleHQ6IC9eW1xcc1xcU10rPyg/PVtcXFxcPCFcXFtfKmBdfCB7Mix9XFxufCQpLyxcbiAgICAgIF9pbnNpZGU6IC8oPzpcXFtbXlxcXV0qXFxdfFteXFxbXFxdXXxcXF0oPz1bXlxcW10qXFxdKSkqLyxcbiAgICAgIF9ocmVmOiAvXFxzKjw/KFtcXHNcXFNdKj8pPj8oPzpcXHMrWydcIl0oW1xcc1xcU10qPylbJ1wiXSk/XFxzKi8sXG4gICAgfTtcblxuICAgIGJhc2UubGluayA9IG5ldyBFeHRlbmRSZWdleHAoYmFzZS5saW5rKS5zZXRHcm91cCgnaW5zaWRlJywgYmFzZS5faW5zaWRlKS5zZXRHcm91cCgnaHJlZicsIGJhc2UuX2hyZWYpLmdldFJlZ2V4cCgpO1xuXG4gICAgYmFzZS5yZWZsaW5rID0gbmV3IEV4dGVuZFJlZ2V4cChiYXNlLnJlZmxpbmspLnNldEdyb3VwKCdpbnNpZGUnLCBiYXNlLl9pbnNpZGUpLmdldFJlZ2V4cCgpO1xuXG4gICAgcmV0dXJuICh0aGlzLnJ1bGVzQmFzZSA9IGJhc2UpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHN0YXRpYyBnZXRSdWxlc1BlZGFudGljKCk6IFJ1bGVzSW5saW5lUGVkYW50aWMge1xuICAgIGlmICh0aGlzLnJ1bGVzUGVkYW50aWMpIHtcbiAgICAgIHJldHVybiB0aGlzLnJ1bGVzUGVkYW50aWM7XG4gICAgfVxuXG4gICAgcmV0dXJuICh0aGlzLnJ1bGVzUGVkYW50aWMgPSB7XG4gICAgICAuLi50aGlzLmdldFJ1bGVzQmFzZSgpLFxuICAgICAgLi4ue1xuICAgICAgICBzdHJvbmc6IC9eX18oPz1cXFMpKFtcXHNcXFNdKj9cXFMpX18oPyFfKXxeXFwqXFwqKD89XFxTKShbXFxzXFxTXSo/XFxTKVxcKlxcKig/IVxcKikvLFxuICAgICAgICBlbTogL15fKD89XFxTKShbXFxzXFxTXSo/XFxTKV8oPyFfKXxeXFwqKD89XFxTKShbXFxzXFxTXSo/XFxTKVxcKig/IVxcKikvLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzdGF0aWMgZ2V0UnVsZXNHZm0oKTogUnVsZXNJbmxpbmVHZm0ge1xuICAgIGlmICh0aGlzLnJ1bGVzR2ZtKSB7XG4gICAgICByZXR1cm4gdGhpcy5ydWxlc0dmbTtcbiAgICB9XG5cbiAgICBjb25zdCBiYXNlID0gdGhpcy5nZXRSdWxlc0Jhc2UoKTtcblxuICAgIGNvbnN0IGVzY2FwZSA9IG5ldyBFeHRlbmRSZWdleHAoYmFzZS5lc2NhcGUpLnNldEdyb3VwKCddKScsICd+fF0pJykuZ2V0UmVnZXhwKCk7XG5cbiAgICBjb25zdCB0ZXh0ID0gbmV3IEV4dGVuZFJlZ2V4cChiYXNlLnRleHQpLnNldEdyb3VwKCddfCcsICd+XXwnKS5zZXRHcm91cCgnfCcsICd8aHR0cHM/Oi8vfCcpLmdldFJlZ2V4cCgpO1xuXG4gICAgcmV0dXJuICh0aGlzLnJ1bGVzR2ZtID0ge1xuICAgICAgLi4uYmFzZSxcbiAgICAgIC4uLntcbiAgICAgICAgZXNjYXBlLFxuICAgICAgICB1cmw6IC9eKGh0dHBzPzpcXC9cXC9bXlxcczxdK1tePC4sOjtcIicpXFxdXFxzXSkvLFxuICAgICAgICBkZWw6IC9efn4oPz1cXFMpKFtcXHNcXFNdKj9cXFMpfn4vLFxuICAgICAgICB0ZXh0LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzdGF0aWMgZ2V0UnVsZXNCcmVha3MoKTogUnVsZXNJbmxpbmVCcmVha3Mge1xuICAgIGlmICh0aGlzLnJ1bGVzQnJlYWtzKSB7XG4gICAgICByZXR1cm4gdGhpcy5ydWxlc0JyZWFrcztcbiAgICB9XG5cbiAgICBjb25zdCBpbmxpbmUgPSB0aGlzLmdldFJ1bGVzR2ZtKCk7XG4gICAgY29uc3QgZ2ZtID0gdGhpcy5nZXRSdWxlc0dmbSgpO1xuXG4gICAgcmV0dXJuICh0aGlzLnJ1bGVzQnJlYWtzID0ge1xuICAgICAgLi4uZ2ZtLFxuICAgICAgLi4ue1xuICAgICAgICBicjogbmV3IEV4dGVuZFJlZ2V4cChpbmxpbmUuYnIpLnNldEdyb3VwKCd7Mix9JywgJyonKS5nZXRSZWdleHAoKSxcbiAgICAgICAgdGV4dDogbmV3IEV4dGVuZFJlZ2V4cChnZm0udGV4dCkuc2V0R3JvdXAoJ3syLH0nLCAnKicpLmdldFJlZ2V4cCgpLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzZXRSdWxlcygpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLmdmbSkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5icmVha3MpIHtcbiAgICAgICAgdGhpcy5ydWxlcyA9IHRoaXMuc3RhdGljVGhpcy5nZXRSdWxlc0JyZWFrcygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5ydWxlcyA9IHRoaXMuc3RhdGljVGhpcy5nZXRSdWxlc0dmbSgpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLnBlZGFudGljKSB7XG4gICAgICB0aGlzLnJ1bGVzID0gdGhpcy5zdGF0aWNUaGlzLmdldFJ1bGVzUGVkYW50aWMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ydWxlcyA9IHRoaXMuc3RhdGljVGhpcy5nZXRSdWxlc0Jhc2UoKTtcbiAgICB9XG5cbiAgICB0aGlzLmhhc1J1bGVzR2ZtID0gKHRoaXMucnVsZXMgYXMgUnVsZXNJbmxpbmVHZm0pLnVybCAhPT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIExleGluZy9Db21waWxpbmcuXG4gICAqL1xuICBvdXRwdXQobmV4dFBhcnQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgbmV4dFBhcnQgPSBuZXh0UGFydDtcbiAgICBsZXQgZXhlY0FycjogUmVnRXhwRXhlY0FycmF5O1xuICAgIGxldCBvdXQgPSAnJztcblxuICAgIHdoaWxlIChuZXh0UGFydCkge1xuICAgICAgLy8gZXNjYXBlXG4gICAgICBpZiAoKGV4ZWNBcnIgPSB0aGlzLnJ1bGVzLmVzY2FwZS5leGVjKG5leHRQYXJ0KSkpIHtcbiAgICAgICAgbmV4dFBhcnQgPSBuZXh0UGFydC5zdWJzdHJpbmcoZXhlY0FyclswXS5sZW5ndGgpO1xuICAgICAgICBvdXQgKz0gZXhlY0FyclsxXTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIGF1dG9saW5rXG4gICAgICBpZiAoKGV4ZWNBcnIgPSB0aGlzLnJ1bGVzLmF1dG9saW5rLmV4ZWMobmV4dFBhcnQpKSkge1xuICAgICAgICBsZXQgdGV4dDogc3RyaW5nO1xuICAgICAgICBsZXQgaHJlZjogc3RyaW5nO1xuICAgICAgICBuZXh0UGFydCA9IG5leHRQYXJ0LnN1YnN0cmluZyhleGVjQXJyWzBdLmxlbmd0aCk7XG5cbiAgICAgICAgaWYgKGV4ZWNBcnJbMl0gPT09ICdAJykge1xuICAgICAgICAgIHRleHQgPSB0aGlzLm9wdGlvbnMuZXNjYXBlKFxuICAgICAgICAgICAgZXhlY0FyclsxXS5jaGFyQXQoNikgPT09ICc6JyA/IHRoaXMubWFuZ2xlKGV4ZWNBcnJbMV0uc3Vic3RyaW5nKDcpKSA6IHRoaXMubWFuZ2xlKGV4ZWNBcnJbMV0pXG4gICAgICAgICAgKTtcbiAgICAgICAgICBocmVmID0gdGhpcy5tYW5nbGUoJ21haWx0bzonKSArIHRleHQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGV4dCA9IHRoaXMub3B0aW9ucy5lc2NhcGUoZXhlY0FyclsxXSk7XG4gICAgICAgICAgaHJlZiA9IHRleHQ7XG4gICAgICAgIH1cblxuICAgICAgICBvdXQgKz0gdGhpcy5yZW5kZXJlci5saW5rKGhyZWYsIG51bGwsIHRleHQpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gdXJsIChnZm0pXG4gICAgICBpZiAoIXRoaXMuaW5MaW5rICYmIHRoaXMuaGFzUnVsZXNHZm0gJiYgKGV4ZWNBcnIgPSAodGhpcy5ydWxlcyBhcyBSdWxlc0lubGluZUdmbSkudXJsLmV4ZWMobmV4dFBhcnQpKSkge1xuICAgICAgICBsZXQgdGV4dDogc3RyaW5nO1xuICAgICAgICBsZXQgaHJlZjogc3RyaW5nO1xuICAgICAgICBuZXh0UGFydCA9IG5leHRQYXJ0LnN1YnN0cmluZyhleGVjQXJyWzBdLmxlbmd0aCk7XG4gICAgICAgIHRleHQgPSB0aGlzLm9wdGlvbnMuZXNjYXBlKGV4ZWNBcnJbMV0pO1xuICAgICAgICBocmVmID0gdGV4dDtcbiAgICAgICAgb3V0ICs9IHRoaXMucmVuZGVyZXIubGluayhocmVmLCBudWxsLCB0ZXh0KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIHRhZ1xuICAgICAgaWYgKChleGVjQXJyID0gdGhpcy5ydWxlcy50YWcuZXhlYyhuZXh0UGFydCkpKSB7XG4gICAgICAgIGlmICghdGhpcy5pbkxpbmsgJiYgL148YSAvaS50ZXN0KGV4ZWNBcnJbMF0pKSB7XG4gICAgICAgICAgdGhpcy5pbkxpbmsgPSB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaW5MaW5rICYmIC9ePFxcL2E+L2kudGVzdChleGVjQXJyWzBdKSkge1xuICAgICAgICAgIHRoaXMuaW5MaW5rID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBuZXh0UGFydCA9IG5leHRQYXJ0LnN1YnN0cmluZyhleGVjQXJyWzBdLmxlbmd0aCk7XG5cbiAgICAgICAgb3V0ICs9IHRoaXMub3B0aW9ucy5zYW5pdGl6ZVxuICAgICAgICAgID8gdGhpcy5vcHRpb25zLnNhbml0aXplclxuICAgICAgICAgICAgPyB0aGlzLm9wdGlvbnMuc2FuaXRpemVyKGV4ZWNBcnJbMF0pXG4gICAgICAgICAgICA6IHRoaXMub3B0aW9ucy5lc2NhcGUoZXhlY0FyclswXSlcbiAgICAgICAgICA6IGV4ZWNBcnJbMF07XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBsaW5rXG4gICAgICBpZiAoKGV4ZWNBcnIgPSB0aGlzLnJ1bGVzLmxpbmsuZXhlYyhuZXh0UGFydCkpKSB7XG4gICAgICAgIG5leHRQYXJ0ID0gbmV4dFBhcnQuc3Vic3RyaW5nKGV4ZWNBcnJbMF0ubGVuZ3RoKTtcbiAgICAgICAgdGhpcy5pbkxpbmsgPSB0cnVlO1xuXG4gICAgICAgIG91dCArPSB0aGlzLm91dHB1dExpbmsoZXhlY0Fyciwge1xuICAgICAgICAgIGhyZWY6IGV4ZWNBcnJbMl0sXG4gICAgICAgICAgdGl0bGU6IGV4ZWNBcnJbM10sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuaW5MaW5rID0gZmFsc2U7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyByZWZsaW5rLCBub2xpbmtcbiAgICAgIGlmICgoZXhlY0FyciA9IHRoaXMucnVsZXMucmVmbGluay5leGVjKG5leHRQYXJ0KSkgfHwgKGV4ZWNBcnIgPSB0aGlzLnJ1bGVzLm5vbGluay5leGVjKG5leHRQYXJ0KSkpIHtcbiAgICAgICAgbmV4dFBhcnQgPSBuZXh0UGFydC5zdWJzdHJpbmcoZXhlY0FyclswXS5sZW5ndGgpO1xuICAgICAgICBjb25zdCBrZXlMaW5rID0gKGV4ZWNBcnJbMl0gfHwgZXhlY0FyclsxXSkucmVwbGFjZSgvXFxzKy9nLCAnICcpO1xuICAgICAgICBjb25zdCBsaW5rID0gdGhpcy5saW5rc1trZXlMaW5rLnRvTG93ZXJDYXNlKCldO1xuXG4gICAgICAgIGlmICghbGluayB8fCAhbGluay5ocmVmKSB7XG4gICAgICAgICAgb3V0ICs9IGV4ZWNBcnJbMF0uY2hhckF0KDApO1xuICAgICAgICAgIG5leHRQYXJ0ID0gZXhlY0FyclswXS5zdWJzdHJpbmcoMSkgKyBuZXh0UGFydDtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaW5MaW5rID0gdHJ1ZTtcbiAgICAgICAgb3V0ICs9IHRoaXMub3V0cHV0TGluayhleGVjQXJyLCBsaW5rKTtcbiAgICAgICAgdGhpcy5pbkxpbmsgPSBmYWxzZTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIHN0cm9uZ1xuICAgICAgaWYgKChleGVjQXJyID0gdGhpcy5ydWxlcy5zdHJvbmcuZXhlYyhuZXh0UGFydCkpKSB7XG4gICAgICAgIG5leHRQYXJ0ID0gbmV4dFBhcnQuc3Vic3RyaW5nKGV4ZWNBcnJbMF0ubGVuZ3RoKTtcbiAgICAgICAgb3V0ICs9IHRoaXMucmVuZGVyZXIuc3Ryb25nKHRoaXMub3V0cHV0KGV4ZWNBcnJbMl0gfHwgZXhlY0FyclsxXSkpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gZW1cbiAgICAgIGlmICgoZXhlY0FyciA9IHRoaXMucnVsZXMuZW0uZXhlYyhuZXh0UGFydCkpKSB7XG4gICAgICAgIG5leHRQYXJ0ID0gbmV4dFBhcnQuc3Vic3RyaW5nKGV4ZWNBcnJbMF0ubGVuZ3RoKTtcbiAgICAgICAgb3V0ICs9IHRoaXMucmVuZGVyZXIuZW0odGhpcy5vdXRwdXQoZXhlY0FyclsyXSB8fCBleGVjQXJyWzFdKSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBjb2RlXG4gICAgICBpZiAoKGV4ZWNBcnIgPSB0aGlzLnJ1bGVzLmNvZGUuZXhlYyhuZXh0UGFydCkpKSB7XG4gICAgICAgIG5leHRQYXJ0ID0gbmV4dFBhcnQuc3Vic3RyaW5nKGV4ZWNBcnJbMF0ubGVuZ3RoKTtcbiAgICAgICAgb3V0ICs9IHRoaXMucmVuZGVyZXIuY29kZXNwYW4odGhpcy5vcHRpb25zLmVzY2FwZShleGVjQXJyWzJdLnRyaW0oKSwgdHJ1ZSkpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gYnJcbiAgICAgIGlmICgoZXhlY0FyciA9IHRoaXMucnVsZXMuYnIuZXhlYyhuZXh0UGFydCkpKSB7XG4gICAgICAgIG5leHRQYXJ0ID0gbmV4dFBhcnQuc3Vic3RyaW5nKGV4ZWNBcnJbMF0ubGVuZ3RoKTtcbiAgICAgICAgb3V0ICs9IHRoaXMucmVuZGVyZXIuYnIoKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIGRlbCAoZ2ZtKVxuICAgICAgaWYgKHRoaXMuaGFzUnVsZXNHZm0gJiYgKGV4ZWNBcnIgPSAodGhpcy5ydWxlcyBhcyBSdWxlc0lubGluZUdmbSkuZGVsLmV4ZWMobmV4dFBhcnQpKSkge1xuICAgICAgICBuZXh0UGFydCA9IG5leHRQYXJ0LnN1YnN0cmluZyhleGVjQXJyWzBdLmxlbmd0aCk7XG4gICAgICAgIG91dCArPSB0aGlzLnJlbmRlcmVyLmRlbCh0aGlzLm91dHB1dChleGVjQXJyWzFdKSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyB0ZXh0XG4gICAgICBpZiAoKGV4ZWNBcnIgPSB0aGlzLnJ1bGVzLnRleHQuZXhlYyhuZXh0UGFydCkpKSB7XG4gICAgICAgIG5leHRQYXJ0ID0gbmV4dFBhcnQuc3Vic3RyaW5nKGV4ZWNBcnJbMF0ubGVuZ3RoKTtcbiAgICAgICAgb3V0ICs9IHRoaXMucmVuZGVyZXIudGV4dCh0aGlzLm9wdGlvbnMuZXNjYXBlKHRoaXMuc21hcnR5cGFudHMoZXhlY0FyclswXSkpKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChuZXh0UGFydCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0luZmluaXRlIGxvb3Agb24gYnl0ZTogJyArIG5leHRQYXJ0LmNoYXJDb2RlQXQoMCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBvdXQ7XG4gIH1cblxuICAvKipcbiAgICogQ29tcGlsZSBMaW5rLlxuICAgKi9cbiAgcHJvdGVjdGVkIG91dHB1dExpbmsoZXhlY0FycjogUmVnRXhwRXhlY0FycmF5LCBsaW5rOiBMaW5rKSB7XG4gICAgY29uc3QgaHJlZiA9IHRoaXMub3B0aW9ucy5lc2NhcGUobGluay5ocmVmKTtcbiAgICBjb25zdCB0aXRsZSA9IGxpbmsudGl0bGUgPyB0aGlzLm9wdGlvbnMuZXNjYXBlKGxpbmsudGl0bGUpIDogbnVsbDtcblxuICAgIHJldHVybiBleGVjQXJyWzBdLmNoYXJBdCgwKSAhPT0gJyEnXG4gICAgICA/IHRoaXMucmVuZGVyZXIubGluayhocmVmLCB0aXRsZSwgdGhpcy5vdXRwdXQoZXhlY0FyclsxXSkpXG4gICAgICA6IHRoaXMucmVuZGVyZXIuaW1hZ2UoaHJlZiwgdGl0bGUsIHRoaXMub3B0aW9ucy5lc2NhcGUoZXhlY0FyclsxXSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNtYXJ0eXBhbnRzIFRyYW5zZm9ybWF0aW9ucy5cbiAgICovXG4gIHByb3RlY3RlZCBzbWFydHlwYW50cyh0ZXh0OiBzdHJpbmcpIHtcbiAgICBpZiAoIXRoaXMub3B0aW9ucy5zbWFydHlwYW50cykge1xuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIHRleHRcbiAgICAgICAgLy8gZW0tZGFzaGVzXG4gICAgICAgIC5yZXBsYWNlKC8tLS0vZywgJ1xcdTIwMTQnKVxuICAgICAgICAvLyBlbi1kYXNoZXNcbiAgICAgICAgLnJlcGxhY2UoLy0tL2csICdcXHUyMDEzJylcbiAgICAgICAgLy8gb3BlbmluZyBzaW5nbGVzXG4gICAgICAgIC5yZXBsYWNlKC8oXnxbLVxcdTIwMTQvKFxcW3tcIlxcc10pJy9nLCAnJDFcXHUyMDE4JylcbiAgICAgICAgLy8gY2xvc2luZyBzaW5nbGVzICYgYXBvc3Ryb3BoZXNcbiAgICAgICAgLnJlcGxhY2UoLycvZywgJ1xcdTIwMTknKVxuICAgICAgICAvLyBvcGVuaW5nIGRvdWJsZXNcbiAgICAgICAgLnJlcGxhY2UoLyhefFstXFx1MjAxNC8oXFxbe1xcdTIwMThcXHNdKVwiL2csICckMVxcdTIwMWMnKVxuICAgICAgICAvLyBjbG9zaW5nIGRvdWJsZXNcbiAgICAgICAgLnJlcGxhY2UoL1wiL2csICdcXHUyMDFkJylcbiAgICAgICAgLy8gZWxsaXBzZXNcbiAgICAgICAgLnJlcGxhY2UoL1xcLnszfS9nLCAnXFx1MjAyNicpXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYW5nbGUgTGlua3MuXG4gICAqL1xuICBwcm90ZWN0ZWQgbWFuZ2xlKHRleHQ6IHN0cmluZykge1xuICAgIGlmICghdGhpcy5vcHRpb25zLm1hbmdsZSkge1xuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuXG4gICAgbGV0IG91dCA9ICcnO1xuICAgIGNvbnN0IGxlbmd0aCA9IHRleHQubGVuZ3RoO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgbGV0IHN0cjogc3RyaW5nO1xuXG4gICAgICBpZiAoTWF0aC5yYW5kb20oKSA+IDAuNSkge1xuICAgICAgICBzdHIgPSAneCcgKyB0ZXh0LmNoYXJDb2RlQXQoaSkudG9TdHJpbmcoMTYpO1xuICAgICAgfVxuXG4gICAgICBvdXQgKz0gJyYjJyArIHN0ciArICc7JztcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0O1xuICB9XG59XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxMS0yMDE0LCBDaHJpc3RvcGhlciBKZWZmcmV5LiAoTUlUIExpY2Vuc2VkKVxuICogaHR0cHM6Ly9naXRodWIuY29tL2NoamovbWFya2VkXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE4LTIwMjEsIFx1MDQxQVx1MDQzRVx1MDQ0MVx1MDQ0Mlx1MDQ0RiBcdTA0MjJcdTA0NDBcdTA0MzVcdTA0NDJcdTA0NEZcdTA0M0EuIChNSVQgTGljZW5zZWQpXG4gKiBodHRwczovL2dpdGh1Yi5jb20vdHMtc3RhY2svbWFya2Rvd25cbiAqL1xuXG5pbXBvcnQgeyBJbmxpbmVMZXhlciB9IGZyb20gJy4vaW5saW5lLWxleGVyJztcbmltcG9ydCB7IExpbmtzLCBNYXJrZWRPcHRpb25zLCBTaW1wbGVSZW5kZXJlciwgVG9rZW4sIFRva2VuVHlwZSB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBNYXJrZWQgfSBmcm9tICcuL21hcmtlZCc7XG5pbXBvcnQgeyBSZW5kZXJlciB9IGZyb20gJy4vcmVuZGVyZXInO1xuXG4vKipcbiAqIFBhcnNpbmcgJiBDb21waWxpbmcuXG4gKi9cbmV4cG9ydCBjbGFzcyBQYXJzZXIge1xuICBzaW1wbGVSZW5kZXJlcnM6IFNpbXBsZVJlbmRlcmVyW10gPSBbXTtcbiAgcHJvdGVjdGVkIHRva2VuczogVG9rZW5bXTtcbiAgcHJvdGVjdGVkIHRva2VuOiBUb2tlbjtcbiAgcHJvdGVjdGVkIGlubGluZUxleGVyOiBJbmxpbmVMZXhlcjtcbiAgcHJvdGVjdGVkIG9wdGlvbnM6IE1hcmtlZE9wdGlvbnM7XG4gIHByb3RlY3RlZCByZW5kZXJlcjogUmVuZGVyZXI7XG4gIHByb3RlY3RlZCBsaW5lOiBudW1iZXIgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM/OiBNYXJrZWRPcHRpb25zKSB7XG4gICAgdGhpcy50b2tlbnMgPSBbXTtcbiAgICB0aGlzLnRva2VuID0gbnVsbDtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IE1hcmtlZC5vcHRpb25zO1xuICAgIHRoaXMucmVuZGVyZXIgPSB0aGlzLm9wdGlvbnMucmVuZGVyZXIgfHwgbmV3IFJlbmRlcmVyKHRoaXMub3B0aW9ucyk7XG4gIH1cblxuICBzdGF0aWMgcGFyc2UodG9rZW5zOiBUb2tlbltdLCBsaW5rczogTGlua3MsIG9wdGlvbnM/OiBNYXJrZWRPcHRpb25zKTogc3RyaW5nIHtcbiAgICBjb25zdCBwYXJzZXIgPSBuZXcgdGhpcyhvcHRpb25zKTtcbiAgICByZXR1cm4gcGFyc2VyLnBhcnNlKGxpbmtzLCB0b2tlbnMpO1xuICB9XG5cbiAgcGFyc2UobGlua3M6IExpbmtzLCB0b2tlbnM6IFRva2VuW10pIHtcbiAgICB0aGlzLmlubGluZUxleGVyID0gbmV3IElubGluZUxleGVyKElubGluZUxleGVyLCBsaW5rcywgdGhpcy5vcHRpb25zLCB0aGlzLnJlbmRlcmVyKTtcbiAgICB0aGlzLnRva2VucyA9IHRva2Vucy5yZXZlcnNlKCk7XG5cbiAgICBsZXQgb3V0ID0gJyc7XG5cbiAgICB3aGlsZSAodGhpcy5uZXh0KCkpIHtcbiAgICAgIG91dCArPSB0aGlzLnRvaygpO1xuICAgIH1cblxuICAgIHJldHVybiBvdXQ7XG4gIH1cblxuICBkZWJ1ZyhsaW5rczogTGlua3MsIHRva2VuczogVG9rZW5bXSkge1xuICAgIHRoaXMuaW5saW5lTGV4ZXIgPSBuZXcgSW5saW5lTGV4ZXIoSW5saW5lTGV4ZXIsIGxpbmtzLCB0aGlzLm9wdGlvbnMsIHRoaXMucmVuZGVyZXIpO1xuICAgIHRoaXMudG9rZW5zID0gdG9rZW5zLnJldmVyc2UoKTtcblxuICAgIGxldCBvdXQgPSAnJztcblxuICAgIHdoaWxlICh0aGlzLm5leHQoKSkge1xuICAgICAgY29uc3Qgb3V0VG9rZW46IHN0cmluZyA9IHRoaXMudG9rKCk7XG4gICAgICB0aGlzLnRva2VuLmxpbmUgPSB0aGlzLmxpbmUgKz0gb3V0VG9rZW4uc3BsaXQoJ1xcbicpLmxlbmd0aCAtIDE7XG4gICAgICBvdXQgKz0gb3V0VG9rZW47XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dDtcbiAgfVxuXG4gIHByb3RlY3RlZCBuZXh0KCkge1xuICAgIHJldHVybiAodGhpcy50b2tlbiA9IHRoaXMudG9rZW5zLnBvcCgpKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXROZXh0RWxlbWVudCgpIHtcbiAgICByZXR1cm4gdGhpcy50b2tlbnNbdGhpcy50b2tlbnMubGVuZ3RoIC0gMV07XG4gIH1cblxuICBwcm90ZWN0ZWQgcGFyc2VUZXh0KCkge1xuICAgIGxldCBib2R5ID0gdGhpcy50b2tlbi50ZXh0O1xuICAgIGxldCBuZXh0RWxlbWVudDogVG9rZW47XG5cbiAgICB3aGlsZSAoKG5leHRFbGVtZW50ID0gdGhpcy5nZXROZXh0RWxlbWVudCgpKSAmJiBuZXh0RWxlbWVudC50eXBlID09IFRva2VuVHlwZS50ZXh0KSB7XG4gICAgICBib2R5ICs9ICdcXG4nICsgdGhpcy5uZXh0KCkudGV4dDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5pbmxpbmVMZXhlci5vdXRwdXQoYm9keSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgdG9rKCkge1xuICAgIHN3aXRjaCAodGhpcy50b2tlbi50eXBlKSB7XG4gICAgICBjYXNlIFRva2VuVHlwZS5zcGFjZToge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgICB9XG4gICAgICBjYXNlIFRva2VuVHlwZS5wYXJhZ3JhcGg6IHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyZXIucGFyYWdyYXBoKHRoaXMuaW5saW5lTGV4ZXIub3V0cHV0KHRoaXMudG9rZW4udGV4dCkpO1xuICAgICAgfVxuICAgICAgY2FzZSBUb2tlblR5cGUudGV4dDoge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmlzTm9QKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VUZXh0KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyZXIucGFyYWdyYXBoKHRoaXMucGFyc2VUZXh0KCkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjYXNlIFRva2VuVHlwZS5oZWFkaW5nOiB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlcmVyLmhlYWRpbmcodGhpcy5pbmxpbmVMZXhlci5vdXRwdXQodGhpcy50b2tlbi50ZXh0KSwgdGhpcy50b2tlbi5kZXB0aCwgdGhpcy50b2tlbi50ZXh0KTtcbiAgICAgIH1cbiAgICAgIGNhc2UgVG9rZW5UeXBlLmxpc3RTdGFydDoge1xuICAgICAgICBsZXQgYm9keSA9ICcnO1xuICAgICAgICBjb25zdCBvcmRlcmVkID0gdGhpcy50b2tlbi5vcmRlcmVkO1xuXG4gICAgICAgIHdoaWxlICh0aGlzLm5leHQoKS50eXBlICE9IFRva2VuVHlwZS5saXN0RW5kKSB7XG4gICAgICAgICAgYm9keSArPSB0aGlzLnRvaygpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyZXIubGlzdChib2R5LCBvcmRlcmVkKTtcbiAgICAgIH1cbiAgICAgIGNhc2UgVG9rZW5UeXBlLmxpc3RJdGVtU3RhcnQ6IHtcbiAgICAgICAgbGV0IGJvZHkgPSAnJztcblxuICAgICAgICB3aGlsZSAodGhpcy5uZXh0KCkudHlwZSAhPSBUb2tlblR5cGUubGlzdEl0ZW1FbmQpIHtcbiAgICAgICAgICBib2R5ICs9IHRoaXMudG9rZW4udHlwZSA9PSAoVG9rZW5UeXBlLnRleHQgYXMgYW55KSA/IHRoaXMucGFyc2VUZXh0KCkgOiB0aGlzLnRvaygpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyZXIubGlzdGl0ZW0oYm9keSk7XG4gICAgICB9XG4gICAgICBjYXNlIFRva2VuVHlwZS5sb29zZUl0ZW1TdGFydDoge1xuICAgICAgICBsZXQgYm9keSA9ICcnO1xuXG4gICAgICAgIHdoaWxlICh0aGlzLm5leHQoKS50eXBlICE9IFRva2VuVHlwZS5saXN0SXRlbUVuZCkge1xuICAgICAgICAgIGJvZHkgKz0gdGhpcy50b2soKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlcmVyLmxpc3RpdGVtKGJvZHkpO1xuICAgICAgfVxuICAgICAgY2FzZSBUb2tlblR5cGUuY29kZToge1xuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJlci5jb2RlKHRoaXMudG9rZW4udGV4dCwgdGhpcy50b2tlbi5sYW5nLCB0aGlzLnRva2VuLmVzY2FwZWQsIHRoaXMudG9rZW4ubWV0YSk7XG4gICAgICB9XG4gICAgICBjYXNlIFRva2VuVHlwZS50YWJsZToge1xuICAgICAgICBsZXQgaGVhZGVyID0gJyc7XG4gICAgICAgIGxldCBib2R5ID0gJyc7XG4gICAgICAgIGxldCBjZWxsO1xuXG4gICAgICAgIC8vIGhlYWRlclxuICAgICAgICBjZWxsID0gJyc7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy50b2tlbi5oZWFkZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBmbGFncyA9IHsgaGVhZGVyOiB0cnVlLCBhbGlnbjogdGhpcy50b2tlbi5hbGlnbltpXSB9O1xuICAgICAgICAgIGNvbnN0IG91dCA9IHRoaXMuaW5saW5lTGV4ZXIub3V0cHV0KHRoaXMudG9rZW4uaGVhZGVyW2ldKTtcblxuICAgICAgICAgIGNlbGwgKz0gdGhpcy5yZW5kZXJlci50YWJsZWNlbGwob3V0LCBmbGFncyk7XG4gICAgICAgIH1cblxuICAgICAgICBoZWFkZXIgKz0gdGhpcy5yZW5kZXJlci50YWJsZXJvdyhjZWxsKTtcblxuICAgICAgICBmb3IgKGNvbnN0IHJvdyBvZiB0aGlzLnRva2VuLmNlbGxzKSB7XG4gICAgICAgICAgY2VsbCA9ICcnO1xuXG4gICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCByb3cubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGNlbGwgKz0gdGhpcy5yZW5kZXJlci50YWJsZWNlbGwodGhpcy5pbmxpbmVMZXhlci5vdXRwdXQocm93W2pdKSwge1xuICAgICAgICAgICAgICBoZWFkZXI6IGZhbHNlLFxuICAgICAgICAgICAgICBhbGlnbjogdGhpcy50b2tlbi5hbGlnbltqXVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYm9keSArPSB0aGlzLnJlbmRlcmVyLnRhYmxlcm93KGNlbGwpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyZXIudGFibGUoaGVhZGVyLCBib2R5KTtcbiAgICAgIH1cbiAgICAgIGNhc2UgVG9rZW5UeXBlLmJsb2NrcXVvdGVTdGFydDoge1xuICAgICAgICBsZXQgYm9keSA9ICcnO1xuXG4gICAgICAgIHdoaWxlICh0aGlzLm5leHQoKS50eXBlICE9IFRva2VuVHlwZS5ibG9ja3F1b3RlRW5kKSB7XG4gICAgICAgICAgYm9keSArPSB0aGlzLnRvaygpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyZXIuYmxvY2txdW90ZShib2R5KTtcbiAgICAgIH1cbiAgICAgIGNhc2UgVG9rZW5UeXBlLmhyOiB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlcmVyLmhyKCk7XG4gICAgICB9XG4gICAgICBjYXNlIFRva2VuVHlwZS5odG1sOiB7XG4gICAgICAgIGNvbnN0IGh0bWwgPVxuICAgICAgICAgICF0aGlzLnRva2VuLnByZSAmJiAhdGhpcy5vcHRpb25zLnBlZGFudGljID8gdGhpcy5pbmxpbmVMZXhlci5vdXRwdXQodGhpcy50b2tlbi50ZXh0KSA6IHRoaXMudG9rZW4udGV4dDtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyZXIuaHRtbChodG1sKTtcbiAgICAgIH1cbiAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgaWYgKHRoaXMuc2ltcGxlUmVuZGVyZXJzLmxlbmd0aCkge1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zaW1wbGVSZW5kZXJlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnRva2VuLnR5cGUgPT0gJ3NpbXBsZVJ1bGUnICsgKGkgKyAxKSkge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zaW1wbGVSZW5kZXJlcnNbaV0uY2FsbCh0aGlzLnJlbmRlcmVyLCB0aGlzLnRva2VuLmV4ZWNBcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGVyck1zZyA9IGBUb2tlbiB3aXRoIFwiJHt0aGlzLnRva2VuLnR5cGV9XCIgdHlwZSB3YXMgbm90IGZvdW5kLmA7XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zaWxlbnQpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhlcnJNc2cpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJNc2cpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxMS0yMDE0LCBDaHJpc3RvcGhlciBKZWZmcmV5LiAoTUlUIExpY2Vuc2VkKVxuICogaHR0cHM6Ly9naXRodWIuY29tL2NoamovbWFya2VkXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE4LTIwMjEsIFx1MDQxQVx1MDQzRVx1MDQ0MVx1MDQ0Mlx1MDQ0RiBcdTA0MjJcdTA0NDBcdTA0MzVcdTA0NDJcdTA0NEZcdTA0M0EuIChNSVQgTGljZW5zZWQpXG4gKiBodHRwczovL2dpdGh1Yi5jb20vdHMtc3RhY2svbWFya2Rvd25cbiAqL1xuXG5pbXBvcnQgeyBCbG9ja0xleGVyIH0gZnJvbSAnLi9ibG9jay1sZXhlcic7XG5pbXBvcnQgeyBEZWJ1Z1JldHVybnMsIExleGVyUmV0dXJucywgTGlua3MsIE1hcmtlZE9wdGlvbnMsIFNpbXBsZVJlbmRlcmVyLCBUb2tlbiwgVG9rZW5UeXBlIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7IFBhcnNlciB9IGZyb20gJy4vcGFyc2VyJztcblxuZXhwb3J0IGNsYXNzIE1hcmtlZCB7XG4gIHN0YXRpYyBvcHRpb25zID0gbmV3IE1hcmtlZE9wdGlvbnMoKTtcbiAgcHJvdGVjdGVkIHN0YXRpYyBzaW1wbGVSZW5kZXJlcnM6IFNpbXBsZVJlbmRlcmVyW10gPSBbXTtcblxuICAvKipcbiAgICogTWVyZ2VzIHRoZSBkZWZhdWx0IG9wdGlvbnMgd2l0aCBvcHRpb25zIHRoYXQgd2lsbCBiZSBzZXQuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRpb25zIEhhc2ggb2Ygb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyBzZXRPcHRpb25zKG9wdGlvbnM6IE1hcmtlZE9wdGlvbnMpIHtcbiAgICBPYmplY3QuYXNzaWduKHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGluZyBzaW1wbGUgYmxvY2sgcnVsZS5cbiAgICovXG4gIHN0YXRpYyBzZXRCbG9ja1J1bGUocmVnZXhwOiBSZWdFeHAsIHJlbmRlcmVyOiBTaW1wbGVSZW5kZXJlciA9ICgpID0+ICcnKSB7XG4gICAgQmxvY2tMZXhlci5zaW1wbGVSdWxlcy5wdXNoKHJlZ2V4cCk7XG4gICAgdGhpcy5zaW1wbGVSZW5kZXJlcnMucHVzaChyZW5kZXJlcik7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBBY2NlcHRzIE1hcmtkb3duIHRleHQgYW5kIHJldHVybnMgdGV4dCBpbiBIVE1MIGZvcm1hdC5cbiAgICpcbiAgICogQHBhcmFtIHNyYyBTdHJpbmcgb2YgbWFya2Rvd24gc291cmNlIHRvIGJlIGNvbXBpbGVkLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBIYXNoIG9mIG9wdGlvbnMuIFRoZXkgcmVwbGFjZSwgYnV0IGRvIG5vdCBtZXJnZSB3aXRoIHRoZSBkZWZhdWx0IG9wdGlvbnMuXG4gICAqIElmIHlvdSB3YW50IHRoZSBtZXJnaW5nLCB5b3UgY2FuIHRvIGRvIHRoaXMgdmlhIGBNYXJrZWQuc2V0T3B0aW9ucygpYC5cbiAgICovXG4gIHN0YXRpYyBwYXJzZShzcmM6IHN0cmluZywgb3B0aW9uczogTWFya2VkT3B0aW9ucyA9IHRoaXMub3B0aW9ucyk6IHN0cmluZyB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHsgdG9rZW5zLCBsaW5rcyB9ID0gdGhpcy5jYWxsQmxvY2tMZXhlcihzcmMsIG9wdGlvbnMpO1xuICAgICAgcmV0dXJuIHRoaXMuY2FsbFBhcnNlcih0b2tlbnMsIGxpbmtzLCBvcHRpb25zKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gdGhpcy5jYWxsTWUoZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFjY2VwdHMgTWFya2Rvd24gdGV4dCBhbmQgcmV0dXJucyBvYmplY3Qgd2l0aCB0ZXh0IGluIEhUTUwgZm9ybWF0LFxuICAgKiB0b2tlbnMgYW5kIGxpbmtzIGZyb20gYEJsb2NrTGV4ZXIucGFyc2VyKClgLlxuICAgKlxuICAgKiBAcGFyYW0gc3JjIFN0cmluZyBvZiBtYXJrZG93biBzb3VyY2UgdG8gYmUgY29tcGlsZWQuXG4gICAqIEBwYXJhbSBvcHRpb25zIEhhc2ggb2Ygb3B0aW9ucy4gVGhleSByZXBsYWNlLCBidXQgZG8gbm90IG1lcmdlIHdpdGggdGhlIGRlZmF1bHQgb3B0aW9ucy5cbiAgICogSWYgeW91IHdhbnQgdGhlIG1lcmdpbmcsIHlvdSBjYW4gdG8gZG8gdGhpcyB2aWEgYE1hcmtlZC5zZXRPcHRpb25zKClgLlxuICAgKi9cbiAgc3RhdGljIGRlYnVnKHNyYzogc3RyaW5nLCBvcHRpb25zOiBNYXJrZWRPcHRpb25zID0gdGhpcy5vcHRpb25zKTogRGVidWdSZXR1cm5zIHtcbiAgICBjb25zdCB7IHRva2VucywgbGlua3MgfSA9IHRoaXMuY2FsbEJsb2NrTGV4ZXIoc3JjLCBvcHRpb25zKTtcbiAgICBsZXQgb3JpZ2luID0gdG9rZW5zLnNsaWNlKCk7XG4gICAgY29uc3QgcGFyc2VyID0gbmV3IFBhcnNlcihvcHRpb25zKTtcbiAgICBwYXJzZXIuc2ltcGxlUmVuZGVyZXJzID0gdGhpcy5zaW1wbGVSZW5kZXJlcnM7XG4gICAgY29uc3QgcmVzdWx0ID0gcGFyc2VyLmRlYnVnKGxpbmtzLCB0b2tlbnMpO1xuXG4gICAgLyoqXG4gICAgICogVHJhbnNsYXRlcyBhIHRva2VuIHR5cGUgaW50byBhIHJlYWRhYmxlIGZvcm0sXG4gICAgICogYW5kIG1vdmVzIGBsaW5lYCBmaWVsZCB0byBhIGZpcnN0IHBsYWNlIGluIGEgdG9rZW4gb2JqZWN0LlxuICAgICAqL1xuICAgIG9yaWdpbiA9IG9yaWdpbi5tYXAodG9rZW4gPT4ge1xuICAgICAgdG9rZW4udHlwZSA9IChUb2tlblR5cGUgYXMgYW55KVt0b2tlbi50eXBlXSB8fCB0b2tlbi50eXBlO1xuXG4gICAgICBjb25zdCBsaW5lID0gdG9rZW4ubGluZTtcbiAgICAgIGRlbGV0ZSB0b2tlbi5saW5lO1xuICAgICAgaWYgKGxpbmUpIHtcbiAgICAgICAgcmV0dXJuIHsgLi4ueyBsaW5lIH0sIC4uLnRva2VuIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdG9rZW47XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4geyB0b2tlbnM6IG9yaWdpbiwgbGlua3MsIHJlc3VsdCB9O1xuICB9XG5cbiAgcHJvdGVjdGVkIHN0YXRpYyBjYWxsQmxvY2tMZXhlcihzcmM6IHN0cmluZyA9ICcnLCBvcHRpb25zPzogTWFya2VkT3B0aW9ucyk6IExleGVyUmV0dXJucyB7XG4gICAgaWYgKHR5cGVvZiBzcmMgIT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgdGhhdCB0aGUgJ3NyYycgcGFyYW1ldGVyIHdvdWxkIGhhdmUgYSAnc3RyaW5nJyB0eXBlLCBnb3QgJyR7dHlwZW9mIHNyY30nYCk7XG4gICAgfVxuXG4gICAgLy8gUHJlcHJvY2Vzc2luZy5cbiAgICBzcmMgPSBzcmNcbiAgICAgIC5yZXBsYWNlKC9cXHJcXG58XFxyL2csICdcXG4nKVxuICAgICAgLnJlcGxhY2UoL1xcdC9nLCAnICAgICcpXG4gICAgICAucmVwbGFjZSgvXFx1MDBhMC9nLCAnICcpXG4gICAgICAucmVwbGFjZSgvXFx1MjQyNC9nLCAnXFxuJylcbiAgICAgIC5yZXBsYWNlKC9eICskL2dtLCAnJyk7XG5cbiAgICByZXR1cm4gQmxvY2tMZXhlci5sZXgoc3JjLCBvcHRpb25zLCB0cnVlKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzdGF0aWMgY2FsbFBhcnNlcih0b2tlbnM6IFRva2VuW10sIGxpbmtzOiBMaW5rcywgb3B0aW9ucz86IE1hcmtlZE9wdGlvbnMpOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLnNpbXBsZVJlbmRlcmVycy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IHBhcnNlciA9IG5ldyBQYXJzZXIob3B0aW9ucyk7XG4gICAgICBwYXJzZXIuc2ltcGxlUmVuZGVyZXJzID0gdGhpcy5zaW1wbGVSZW5kZXJlcnM7XG4gICAgICByZXR1cm4gcGFyc2VyLnBhcnNlKGxpbmtzLCB0b2tlbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gUGFyc2VyLnBhcnNlKHRva2VucywgbGlua3MsIG9wdGlvbnMpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBzdGF0aWMgY2FsbE1lKGVycjogRXJyb3IpIHtcbiAgICBlcnIubWVzc2FnZSArPSAnXFxuUGxlYXNlIHJlcG9ydCB0aGlzIHRvIGh0dHBzOi8vZ2l0aHViLmNvbS90cy1zdGFjay9tYXJrZG93bic7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLnNpbGVudCkge1xuICAgICAgcmV0dXJuICc8cD5BbiBlcnJvciBvY2N1cmVkOjwvcD48cHJlPicgKyB0aGlzLm9wdGlvbnMuZXNjYXBlKGVyci5tZXNzYWdlICsgJycsIHRydWUpICsgJzwvcHJlPic7XG4gICAgfVxuXG4gICAgdGhyb3cgZXJyO1xuICB9XG59XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxMS0yMDE0LCBDaHJpc3RvcGhlciBKZWZmcmV5LiAoTUlUIExpY2Vuc2VkKVxuICogaHR0cHM6Ly9naXRodWIuY29tL2NoamovbWFya2VkXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE4LTIwMjEsIFx1MDQxQVx1MDQzRVx1MDQ0MVx1MDQ0Mlx1MDQ0RiBcdTA0MjJcdTA0NDBcdTA0MzVcdTA0NDJcdTA0NEZcdTA0M0EuIChNSVQgTGljZW5zZWQpXG4gKiBodHRwczovL2dpdGh1Yi5jb20vdHMtc3RhY2svbWFya2Rvd25cbiAqL1xuXG5pbXBvcnQgeyBFeHRlbmRSZWdleHAgfSBmcm9tICcuL2V4dGVuZC1yZWdleHAnO1xuaW1wb3J0IHtcbiAgQWxpZ24sXG4gIExleGVyUmV0dXJucyxcbiAgTGlua3MsXG4gIE1hcmtlZE9wdGlvbnMsXG4gIFJ1bGVzQmxvY2tCYXNlLFxuICBSdWxlc0Jsb2NrR2ZtLFxuICBSdWxlc0Jsb2NrVGFibGVzLFxuICBUb2tlbixcbiAgVG9rZW5UeXBlLFxufSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgTWFya2VkIH0gZnJvbSAnLi9tYXJrZWQnO1xuXG5leHBvcnQgY2xhc3MgQmxvY2tMZXhlcjxUIGV4dGVuZHMgdHlwZW9mIEJsb2NrTGV4ZXI+IHtcbiAgc3RhdGljIHNpbXBsZVJ1bGVzOiBSZWdFeHBbXSA9IFtdO1xuICBwcm90ZWN0ZWQgc3RhdGljIHJ1bGVzQmFzZTogUnVsZXNCbG9ja0Jhc2UgPSBudWxsO1xuICAvKipcbiAgICogR0ZNIEJsb2NrIEdyYW1tYXIuXG4gICAqL1xuICBwcm90ZWN0ZWQgc3RhdGljIHJ1bGVzR2ZtOiBSdWxlc0Jsb2NrR2ZtID0gbnVsbDtcbiAgLyoqXG4gICAqIEdGTSArIFRhYmxlcyBCbG9jayBHcmFtbWFyLlxuICAgKi9cbiAgcHJvdGVjdGVkIHN0YXRpYyBydWxlc1RhYmxlczogUnVsZXNCbG9ja1RhYmxlcyA9IG51bGw7XG4gIHByb3RlY3RlZCBydWxlczogUnVsZXNCbG9ja0Jhc2UgfCBSdWxlc0Jsb2NrR2ZtIHwgUnVsZXNCbG9ja1RhYmxlcztcbiAgcHJvdGVjdGVkIG9wdGlvbnM6IE1hcmtlZE9wdGlvbnM7XG4gIHByb3RlY3RlZCBsaW5rczogTGlua3MgPSB7fTtcbiAgcHJvdGVjdGVkIHRva2VuczogVG9rZW5bXSA9IFtdO1xuICBwcm90ZWN0ZWQgaGFzUnVsZXNHZm06IGJvb2xlYW47XG4gIHByb3RlY3RlZCBoYXNSdWxlc1RhYmxlczogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgc3RhdGljVGhpczogVCwgb3B0aW9ucz86IG9iamVjdCkge1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgfHwgTWFya2VkLm9wdGlvbnM7XG4gICAgdGhpcy5zZXRSdWxlcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFjY2VwdHMgTWFya2Rvd24gdGV4dCBhbmQgcmV0dXJucyBvYmplY3Qgd2l0aCB0b2tlbnMgYW5kIGxpbmtzLlxuICAgKlxuICAgKiBAcGFyYW0gc3JjIFN0cmluZyBvZiBtYXJrZG93biBzb3VyY2UgdG8gYmUgY29tcGlsZWQuXG4gICAqIEBwYXJhbSBvcHRpb25zIEhhc2ggb2Ygb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyBsZXgoc3JjOiBzdHJpbmcsIG9wdGlvbnM/OiBNYXJrZWRPcHRpb25zLCB0b3A/OiBib29sZWFuLCBpc0Jsb2NrUXVvdGU/OiBib29sZWFuKTogTGV4ZXJSZXR1cm5zIHtcbiAgICBjb25zdCBsZXhlciA9IG5ldyB0aGlzKHRoaXMsIG9wdGlvbnMpO1xuICAgIHJldHVybiBsZXhlci5nZXRUb2tlbnMoc3JjLCB0b3AsIGlzQmxvY2tRdW90ZSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgc3RhdGljIGdldFJ1bGVzQmFzZSgpOiBSdWxlc0Jsb2NrQmFzZSB7XG4gICAgaWYgKHRoaXMucnVsZXNCYXNlKSB7XG4gICAgICByZXR1cm4gdGhpcy5ydWxlc0Jhc2U7XG4gICAgfVxuXG4gICAgY29uc3QgYmFzZTogUnVsZXNCbG9ja0Jhc2UgPSB7XG4gICAgICBuZXdsaW5lOiAvXlxcbisvLFxuICAgICAgY29kZTogL14oIHs0fVteXFxuXStcXG4qKSsvLFxuICAgICAgaHI6IC9eKCAqWy0qX10pezMsfSAqKD86XFxuK3wkKS8sXG4gICAgICBoZWFkaW5nOiAvXiAqKCN7MSw2fSkgKihbXlxcbl0rPykgKiMqICooPzpcXG4rfCQpLyxcbiAgICAgIGxoZWFkaW5nOiAvXihbXlxcbl0rKVxcbiAqKD18LSl7Mix9ICooPzpcXG4rfCQpLyxcbiAgICAgIGJsb2NrcXVvdGU6IC9eKCAqPlteXFxuXSsoXFxuW15cXG5dKykqXFxuKikrLyxcbiAgICAgIGxpc3Q6IC9eKCAqKShidWxsKSBbXFxzXFxTXSs/KD86aHJ8ZGVmfFxcbnsyLH0oPyEgKSg/IVxcMWJ1bGwgKVxcbip8XFxzKiQpLyxcbiAgICAgIGh0bWw6IC9eICooPzpjb21tZW50ICooPzpcXG58XFxzKiQpfGNsb3NlZCAqKD86XFxuezIsfXxcXHMqJCl8Y2xvc2luZyAqKD86XFxuezIsfXxcXHMqJCkpLyxcbiAgICAgIGRlZjogL14gKlxcWyhbXlxcXV0rKVxcXTogKjw/KFteXFxzPl0rKT4/KD86ICtbXCIoXShbXlxcbl0rKVtcIildKT8gKig/Olxcbit8JCkvLFxuICAgICAgcGFyYWdyYXBoOiAvXigoPzpbXlxcbl0rXFxuPyg/IWhyfGhlYWRpbmd8bGhlYWRpbmd8YmxvY2txdW90ZXx0YWd8ZGVmKSkrKVxcbiovLFxuICAgICAgdGV4dDogL15bXlxcbl0rLyxcbiAgICAgIGJ1bGxldDogLyg/OlsqKy1dfFxcZCtcXC4pLyxcbiAgICAgIGl0ZW06IC9eKCAqKShidWxsKSBbXlxcbl0qKD86XFxuKD8hXFwxYnVsbCApW15cXG5dKikqLyxcbiAgICB9O1xuXG4gICAgYmFzZS5pdGVtID0gbmV3IEV4dGVuZFJlZ2V4cChiYXNlLml0ZW0sICdnbScpLnNldEdyb3VwKC9idWxsL2csIGJhc2UuYnVsbGV0KS5nZXRSZWdleHAoKTtcblxuICAgIGJhc2UubGlzdCA9IG5ldyBFeHRlbmRSZWdleHAoYmFzZS5saXN0KVxuICAgICAgLnNldEdyb3VwKC9idWxsL2csIGJhc2UuYnVsbGV0KVxuICAgICAgLnNldEdyb3VwKCdocicsICdcXFxcbisoPz1cXFxcMT8oPzpbLSpfXSAqKXszLH0oPzpcXFxcbit8JCkpJylcbiAgICAgIC5zZXRHcm91cCgnZGVmJywgJ1xcXFxuKyg/PScgKyBiYXNlLmRlZi5zb3VyY2UgKyAnKScpXG4gICAgICAuZ2V0UmVnZXhwKCk7XG5cbiAgICBjb25zdCB0YWcgPVxuICAgICAgJyg/ISg/OicgK1xuICAgICAgJ2F8ZW18c3Ryb25nfHNtYWxsfHN8Y2l0ZXxxfGRmbnxhYmJyfGRhdGF8dGltZXxjb2RlJyArXG4gICAgICAnfHZhcnxzYW1wfGtiZHxzdWJ8c3VwfGl8Ynx1fG1hcmt8cnVieXxydHxycHxiZGl8YmRvJyArXG4gICAgICAnfHNwYW58YnJ8d2JyfGluc3xkZWx8aW1nKVxcXFxiKVxcXFx3Kyg/ITovfFteXFxcXHdcXFxcc0BdKkApXFxcXGInO1xuXG4gICAgYmFzZS5odG1sID0gbmV3IEV4dGVuZFJlZ2V4cChiYXNlLmh0bWwpXG4gICAgICAuc2V0R3JvdXAoJ2NvbW1lbnQnLCAvPCEtLVtcXHNcXFNdKj8tLT4vKVxuICAgICAgLnNldEdyb3VwKCdjbG9zZWQnLCAvPCh0YWcpW1xcc1xcU10rPzxcXC9cXDE+LylcbiAgICAgIC5zZXRHcm91cCgnY2xvc2luZycsIC88dGFnKD86XCJbXlwiXSpcInwnW14nXSonfFteJ1wiPl0pKj8+LylcbiAgICAgIC5zZXRHcm91cCgvdGFnL2csIHRhZylcbiAgICAgIC5nZXRSZWdleHAoKTtcblxuICAgIGJhc2UucGFyYWdyYXBoID0gbmV3IEV4dGVuZFJlZ2V4cChiYXNlLnBhcmFncmFwaClcbiAgICAgIC5zZXRHcm91cCgnaHInLCBiYXNlLmhyKVxuICAgICAgLnNldEdyb3VwKCdoZWFkaW5nJywgYmFzZS5oZWFkaW5nKVxuICAgICAgLnNldEdyb3VwKCdsaGVhZGluZycsIGJhc2UubGhlYWRpbmcpXG4gICAgICAuc2V0R3JvdXAoJ2Jsb2NrcXVvdGUnLCBiYXNlLmJsb2NrcXVvdGUpXG4gICAgICAuc2V0R3JvdXAoJ3RhZycsICc8JyArIHRhZylcbiAgICAgIC5zZXRHcm91cCgnZGVmJywgYmFzZS5kZWYpXG4gICAgICAuZ2V0UmVnZXhwKCk7XG5cbiAgICByZXR1cm4gKHRoaXMucnVsZXNCYXNlID0gYmFzZSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgc3RhdGljIGdldFJ1bGVzR2ZtKCk6IFJ1bGVzQmxvY2tHZm0ge1xuICAgIGlmICh0aGlzLnJ1bGVzR2ZtKSB7XG4gICAgICByZXR1cm4gdGhpcy5ydWxlc0dmbTtcbiAgICB9XG5cbiAgICBjb25zdCBiYXNlID0gdGhpcy5nZXRSdWxlc0Jhc2UoKTtcblxuICAgIGNvbnN0IGdmbTogUnVsZXNCbG9ja0dmbSA9IHtcbiAgICAgIC4uLmJhc2UsXG4gICAgICAuLi57XG4gICAgICAgIGZlbmNlczogL14gKihgezMsfXx+ezMsfSlbIFxcLl0qKChcXFMrKT8gKlteXFxuXSopXFxuKFtcXHNcXFNdKj8pXFxzKlxcMSAqKD86XFxuK3wkKS8sXG4gICAgICAgIHBhcmFncmFwaDogL14vLFxuICAgICAgICBoZWFkaW5nOiAvXiAqKCN7MSw2fSkgKyhbXlxcbl0rPykgKiMqICooPzpcXG4rfCQpLyxcbiAgICAgIH0sXG4gICAgfTtcblxuICAgIGNvbnN0IGdyb3VwMSA9IGdmbS5mZW5jZXMuc291cmNlLnJlcGxhY2UoJ1xcXFwxJywgJ1xcXFwyJyk7XG4gICAgY29uc3QgZ3JvdXAyID0gYmFzZS5saXN0LnNvdXJjZS5yZXBsYWNlKCdcXFxcMScsICdcXFxcMycpO1xuXG4gICAgZ2ZtLnBhcmFncmFwaCA9IG5ldyBFeHRlbmRSZWdleHAoYmFzZS5wYXJhZ3JhcGgpLnNldEdyb3VwKCcoPyEnLCBgKD8hJHtncm91cDF9fCR7Z3JvdXAyfXxgKS5nZXRSZWdleHAoKTtcblxuICAgIHJldHVybiAodGhpcy5ydWxlc0dmbSA9IGdmbSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgc3RhdGljIGdldFJ1bGVzVGFibGUoKTogUnVsZXNCbG9ja1RhYmxlcyB7XG4gICAgaWYgKHRoaXMucnVsZXNUYWJsZXMpIHtcbiAgICAgIHJldHVybiB0aGlzLnJ1bGVzVGFibGVzO1xuICAgIH1cblxuICAgIHJldHVybiAodGhpcy5ydWxlc1RhYmxlcyA9IHtcbiAgICAgIC4uLnRoaXMuZ2V0UnVsZXNHZm0oKSxcbiAgICAgIC4uLntcbiAgICAgICAgbnB0YWJsZTogL14gKihcXFMuKlxcfC4qKVxcbiAqKFstOl0rICpcXHxbLXwgOl0qKVxcbigoPzouKlxcfC4qKD86XFxufCQpKSopXFxuKi8sXG4gICAgICAgIHRhYmxlOiAvXiAqXFx8KC4rKVxcbiAqXFx8KCAqWy06XStbLXwgOl0qKVxcbigoPzogKlxcfC4qKD86XFxufCQpKSopXFxuKi8sXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIHNldFJ1bGVzKCkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuZ2ZtKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLnRhYmxlcykge1xuICAgICAgICB0aGlzLnJ1bGVzID0gdGhpcy5zdGF0aWNUaGlzLmdldFJ1bGVzVGFibGUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucnVsZXMgPSB0aGlzLnN0YXRpY1RoaXMuZ2V0UnVsZXNHZm0oKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ydWxlcyA9IHRoaXMuc3RhdGljVGhpcy5nZXRSdWxlc0Jhc2UoKTtcbiAgICB9XG5cbiAgICB0aGlzLmhhc1J1bGVzR2ZtID0gKHRoaXMucnVsZXMgYXMgUnVsZXNCbG9ja0dmbSkuZmVuY2VzICE9PSB1bmRlZmluZWQ7XG4gICAgdGhpcy5oYXNSdWxlc1RhYmxlcyA9ICh0aGlzLnJ1bGVzIGFzIFJ1bGVzQmxvY2tUYWJsZXMpLnRhYmxlICE9PSB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogTGV4aW5nLlxuICAgKi9cbiAgcHJvdGVjdGVkIGdldFRva2VucyhzcmM6IHN0cmluZywgdG9wPzogYm9vbGVhbiwgaXNCbG9ja1F1b3RlPzogYm9vbGVhbik6IExleGVyUmV0dXJucyB7XG4gICAgbGV0IG5leHRQYXJ0ID0gc3JjO1xuICAgIGxldCBleGVjQXJyOiBSZWdFeHBFeGVjQXJyYXk7XG5cbiAgICBtYWluTG9vcDogd2hpbGUgKG5leHRQYXJ0KSB7XG4gICAgICAvLyBuZXdsaW5lXG4gICAgICBpZiAoKGV4ZWNBcnIgPSB0aGlzLnJ1bGVzLm5ld2xpbmUuZXhlYyhuZXh0UGFydCkpKSB7XG4gICAgICAgIG5leHRQYXJ0ID0gbmV4dFBhcnQuc3Vic3RyaW5nKGV4ZWNBcnJbMF0ubGVuZ3RoKTtcblxuICAgICAgICBpZiAoZXhlY0FyclswXS5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgdGhpcy50b2tlbnMucHVzaCh7IHR5cGU6IFRva2VuVHlwZS5zcGFjZSB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBjb2RlXG4gICAgICBpZiAoKGV4ZWNBcnIgPSB0aGlzLnJ1bGVzLmNvZGUuZXhlYyhuZXh0UGFydCkpKSB7XG4gICAgICAgIG5leHRQYXJ0ID0gbmV4dFBhcnQuc3Vic3RyaW5nKGV4ZWNBcnJbMF0ubGVuZ3RoKTtcbiAgICAgICAgY29uc3QgY29kZSA9IGV4ZWNBcnJbMF0ucmVwbGFjZSgvXiB7NH0vZ20sICcnKTtcblxuICAgICAgICB0aGlzLnRva2Vucy5wdXNoKHtcbiAgICAgICAgICB0eXBlOiBUb2tlblR5cGUuY29kZSxcbiAgICAgICAgICB0ZXh0OiAhdGhpcy5vcHRpb25zLnBlZGFudGljID8gY29kZS5yZXBsYWNlKC9cXG4rJC8sICcnKSA6IGNvZGUsXG4gICAgICAgIH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gZmVuY2VzIGNvZGUgKGdmbSlcbiAgICAgIGlmICh0aGlzLmhhc1J1bGVzR2ZtICYmIChleGVjQXJyID0gKHRoaXMucnVsZXMgYXMgUnVsZXNCbG9ja0dmbSkuZmVuY2VzLmV4ZWMobmV4dFBhcnQpKSkge1xuICAgICAgICBuZXh0UGFydCA9IG5leHRQYXJ0LnN1YnN0cmluZyhleGVjQXJyWzBdLmxlbmd0aCk7XG5cbiAgICAgICAgdGhpcy50b2tlbnMucHVzaCh7XG4gICAgICAgICAgdHlwZTogVG9rZW5UeXBlLmNvZGUsXG4gICAgICAgICAgbWV0YTogZXhlY0FyclsyXSxcbiAgICAgICAgICBsYW5nOiBleGVjQXJyWzNdLFxuICAgICAgICAgIHRleHQ6IGV4ZWNBcnJbNF0gfHwgJycsXG4gICAgICAgIH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gaGVhZGluZ1xuICAgICAgaWYgKChleGVjQXJyID0gdGhpcy5ydWxlcy5oZWFkaW5nLmV4ZWMobmV4dFBhcnQpKSkge1xuICAgICAgICBuZXh0UGFydCA9IG5leHRQYXJ0LnN1YnN0cmluZyhleGVjQXJyWzBdLmxlbmd0aCk7XG4gICAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICAgIHR5cGU6IFRva2VuVHlwZS5oZWFkaW5nLFxuICAgICAgICAgIGRlcHRoOiBleGVjQXJyWzFdLmxlbmd0aCxcbiAgICAgICAgICB0ZXh0OiBleGVjQXJyWzJdLFxuICAgICAgICB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIHRhYmxlIG5vIGxlYWRpbmcgcGlwZSAoZ2ZtKVxuICAgICAgaWYgKHRvcCAmJiB0aGlzLmhhc1J1bGVzVGFibGVzICYmIChleGVjQXJyID0gKHRoaXMucnVsZXMgYXMgUnVsZXNCbG9ja1RhYmxlcykubnB0YWJsZS5leGVjKG5leHRQYXJ0KSkpIHtcbiAgICAgICAgbmV4dFBhcnQgPSBuZXh0UGFydC5zdWJzdHJpbmcoZXhlY0FyclswXS5sZW5ndGgpO1xuXG4gICAgICAgIGNvbnN0IGl0ZW06IFRva2VuID0ge1xuICAgICAgICAgIHR5cGU6IFRva2VuVHlwZS50YWJsZSxcbiAgICAgICAgICBoZWFkZXI6IGV4ZWNBcnJbMV0ucmVwbGFjZSgvXiAqfCAqXFx8ICokL2csICcnKS5zcGxpdCgvICpcXHwgKi8pLFxuICAgICAgICAgIGFsaWduOiBleGVjQXJyWzJdLnJlcGxhY2UoL14gKnxcXHwgKiQvZywgJycpLnNwbGl0KC8gKlxcfCAqLykgYXMgQWxpZ25bXSxcbiAgICAgICAgICBjZWxsczogW10sXG4gICAgICAgIH07XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtLmFsaWduLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKC9eICotKzogKiQvLnRlc3QoaXRlbS5hbGlnbltpXSkpIHtcbiAgICAgICAgICAgIGl0ZW0uYWxpZ25baV0gPSAncmlnaHQnO1xuICAgICAgICAgIH0gZWxzZSBpZiAoL14gKjotKzogKiQvLnRlc3QoaXRlbS5hbGlnbltpXSkpIHtcbiAgICAgICAgICAgIGl0ZW0uYWxpZ25baV0gPSAnY2VudGVyJztcbiAgICAgICAgICB9IGVsc2UgaWYgKC9eICo6LSsgKiQvLnRlc3QoaXRlbS5hbGlnbltpXSkpIHtcbiAgICAgICAgICAgIGl0ZW0uYWxpZ25baV0gPSAnbGVmdCc7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGl0ZW0uYWxpZ25baV0gPSBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRkOiBzdHJpbmdbXSA9IGV4ZWNBcnJbM10ucmVwbGFjZSgvXFxuJC8sICcnKS5zcGxpdCgnXFxuJyk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0ZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGl0ZW0uY2VsbHNbaV0gPSB0ZFtpXS5zcGxpdCgvICpcXHwgKi8pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50b2tlbnMucHVzaChpdGVtKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIGxoZWFkaW5nXG4gICAgICBpZiAoKGV4ZWNBcnIgPSB0aGlzLnJ1bGVzLmxoZWFkaW5nLmV4ZWMobmV4dFBhcnQpKSkge1xuICAgICAgICBuZXh0UGFydCA9IG5leHRQYXJ0LnN1YnN0cmluZyhleGVjQXJyWzBdLmxlbmd0aCk7XG5cbiAgICAgICAgdGhpcy50b2tlbnMucHVzaCh7XG4gICAgICAgICAgdHlwZTogVG9rZW5UeXBlLmhlYWRpbmcsXG4gICAgICAgICAgZGVwdGg6IGV4ZWNBcnJbMl0gPT09ICc9JyA/IDEgOiAyLFxuICAgICAgICAgIHRleHQ6IGV4ZWNBcnJbMV0sXG4gICAgICAgIH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gaHJcbiAgICAgIGlmICgoZXhlY0FyciA9IHRoaXMucnVsZXMuaHIuZXhlYyhuZXh0UGFydCkpKSB7XG4gICAgICAgIG5leHRQYXJ0ID0gbmV4dFBhcnQuc3Vic3RyaW5nKGV4ZWNBcnJbMF0ubGVuZ3RoKTtcbiAgICAgICAgdGhpcy50b2tlbnMucHVzaCh7IHR5cGU6IFRva2VuVHlwZS5ociB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIGJsb2NrcXVvdGVcbiAgICAgIGlmICgoZXhlY0FyciA9IHRoaXMucnVsZXMuYmxvY2txdW90ZS5leGVjKG5leHRQYXJ0KSkpIHtcbiAgICAgICAgbmV4dFBhcnQgPSBuZXh0UGFydC5zdWJzdHJpbmcoZXhlY0FyclswXS5sZW5ndGgpO1xuICAgICAgICB0aGlzLnRva2Vucy5wdXNoKHsgdHlwZTogVG9rZW5UeXBlLmJsb2NrcXVvdGVTdGFydCB9KTtcbiAgICAgICAgY29uc3Qgc3RyID0gZXhlY0FyclswXS5yZXBsYWNlKC9eICo+ID8vZ20sICcnKTtcblxuICAgICAgICAvLyBQYXNzIGB0b3BgIHRvIGtlZXAgdGhlIGN1cnJlbnRcbiAgICAgICAgLy8gXCJ0b3BsZXZlbFwiIHN0YXRlLiBUaGlzIGlzIGV4YWN0bHlcbiAgICAgICAgLy8gaG93IG1hcmtkb3duLnBsIHdvcmtzLlxuICAgICAgICB0aGlzLmdldFRva2VucyhzdHIpO1xuICAgICAgICB0aGlzLnRva2Vucy5wdXNoKHsgdHlwZTogVG9rZW5UeXBlLmJsb2NrcXVvdGVFbmQgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBsaXN0XG4gICAgICBpZiAoKGV4ZWNBcnIgPSB0aGlzLnJ1bGVzLmxpc3QuZXhlYyhuZXh0UGFydCkpKSB7XG4gICAgICAgIG5leHRQYXJ0ID0gbmV4dFBhcnQuc3Vic3RyaW5nKGV4ZWNBcnJbMF0ubGVuZ3RoKTtcbiAgICAgICAgY29uc3QgYnVsbDogc3RyaW5nID0gZXhlY0FyclsyXTtcblxuICAgICAgICB0aGlzLnRva2Vucy5wdXNoKHsgdHlwZTogVG9rZW5UeXBlLmxpc3RTdGFydCwgb3JkZXJlZDogYnVsbC5sZW5ndGggPiAxIH0pO1xuXG4gICAgICAgIC8vIEdldCBlYWNoIHRvcC1sZXZlbCBpdGVtLlxuICAgICAgICBjb25zdCBzdHIgPSBleGVjQXJyWzBdLm1hdGNoKHRoaXMucnVsZXMuaXRlbSk7XG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IHN0ci5sZW5ndGg7XG5cbiAgICAgICAgbGV0IG5leHQgPSBmYWxzZTtcbiAgICAgICAgbGV0IHNwYWNlOiBudW1iZXI7XG4gICAgICAgIGxldCBibG9ja0J1bGxldDogc3RyaW5nO1xuICAgICAgICBsZXQgbG9vc2U6IGJvb2xlYW47XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgIGxldCBpdGVtID0gc3RyW2ldO1xuXG4gICAgICAgICAgLy8gUmVtb3ZlIHRoZSBsaXN0IGl0ZW0ncyBidWxsZXQgc28gaXQgaXMgc2VlbiBhcyB0aGUgbmV4dCB0b2tlbi5cbiAgICAgICAgICBzcGFjZSA9IGl0ZW0ubGVuZ3RoO1xuICAgICAgICAgIGl0ZW0gPSBpdGVtLnJlcGxhY2UoL14gKihbKistXXxcXGQrXFwuKSArLywgJycpO1xuXG4gICAgICAgICAgLy8gT3V0ZGVudCB3aGF0ZXZlciB0aGUgbGlzdCBpdGVtIGNvbnRhaW5zLiBIYWNreS5cbiAgICAgICAgICBpZiAoaXRlbS5pbmRleE9mKCdcXG4gJykgIT09IC0xKSB7XG4gICAgICAgICAgICBzcGFjZSAtPSBpdGVtLmxlbmd0aDtcbiAgICAgICAgICAgIGl0ZW0gPSAhdGhpcy5vcHRpb25zLnBlZGFudGljXG4gICAgICAgICAgICAgID8gaXRlbS5yZXBsYWNlKG5ldyBSZWdFeHAoJ14gezEsJyArIHNwYWNlICsgJ30nLCAnZ20nKSwgJycpXG4gICAgICAgICAgICAgIDogaXRlbS5yZXBsYWNlKC9eIHsxLDR9L2dtLCAnJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIG5leHQgbGlzdCBpdGVtIGJlbG9uZ3MgaGVyZS5cbiAgICAgICAgICAvLyBCYWNrcGVkYWwgaWYgaXQgZG9lcyBub3QgYmVsb25nIGluIHRoaXMgbGlzdC5cbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNtYXJ0TGlzdHMgJiYgaSAhPT0gbGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgYmxvY2tCdWxsZXQgPSB0aGlzLnN0YXRpY1RoaXMuZ2V0UnVsZXNCYXNlKCkuYnVsbGV0LmV4ZWMoc3RyW2kgKyAxXSlbMF07XG5cbiAgICAgICAgICAgIGlmIChidWxsICE9PSBibG9ja0J1bGxldCAmJiAhKGJ1bGwubGVuZ3RoID4gMSAmJiBibG9ja0J1bGxldC5sZW5ndGggPiAxKSkge1xuICAgICAgICAgICAgICBuZXh0UGFydCA9IHN0ci5zbGljZShpICsgMSkuam9pbignXFxuJykgKyBuZXh0UGFydDtcbiAgICAgICAgICAgICAgaSA9IGxlbmd0aCAtIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gRGV0ZXJtaW5lIHdoZXRoZXIgaXRlbSBpcyBsb29zZSBvciBub3QuXG4gICAgICAgICAgLy8gVXNlOiAvKF58XFxuKSg/ISApW15cXG5dK1xcblxcbig/IVxccyokKS9cbiAgICAgICAgICAvLyBmb3IgZGlzY291bnQgYmVoYXZpb3IuXG4gICAgICAgICAgbG9vc2UgPSBuZXh0IHx8IC9cXG5cXG4oPyFcXHMqJCkvLnRlc3QoaXRlbSk7XG5cbiAgICAgICAgICBpZiAoaSAhPT0gbGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgbmV4dCA9IGl0ZW0uY2hhckF0KGl0ZW0ubGVuZ3RoIC0gMSkgPT09ICdcXG4nO1xuXG4gICAgICAgICAgICBpZiAoIWxvb3NlKSB7XG4gICAgICAgICAgICAgIGxvb3NlID0gbmV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLnRva2Vucy5wdXNoKHsgdHlwZTogbG9vc2UgPyBUb2tlblR5cGUubG9vc2VJdGVtU3RhcnQgOiBUb2tlblR5cGUubGlzdEl0ZW1TdGFydCB9KTtcblxuICAgICAgICAgIC8vIFJlY3Vyc2UuXG4gICAgICAgICAgdGhpcy5nZXRUb2tlbnMoaXRlbSwgZmFsc2UsIGlzQmxvY2tRdW90ZSk7XG4gICAgICAgICAgdGhpcy50b2tlbnMucHVzaCh7IHR5cGU6IFRva2VuVHlwZS5saXN0SXRlbUVuZCB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudG9rZW5zLnB1c2goeyB0eXBlOiBUb2tlblR5cGUubGlzdEVuZCB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIGh0bWxcbiAgICAgIGlmICgoZXhlY0FyciA9IHRoaXMucnVsZXMuaHRtbC5leGVjKG5leHRQYXJ0KSkpIHtcbiAgICAgICAgbmV4dFBhcnQgPSBuZXh0UGFydC5zdWJzdHJpbmcoZXhlY0FyclswXS5sZW5ndGgpO1xuICAgICAgICBjb25zdCBhdHRyID0gZXhlY0FyclsxXTtcbiAgICAgICAgY29uc3QgaXNQcmUgPSBhdHRyID09PSAncHJlJyB8fCBhdHRyID09PSAnc2NyaXB0JyB8fCBhdHRyID09PSAnc3R5bGUnO1xuXG4gICAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICAgIHR5cGU6IHRoaXMub3B0aW9ucy5zYW5pdGl6ZSA/IFRva2VuVHlwZS5wYXJhZ3JhcGggOiBUb2tlblR5cGUuaHRtbCxcbiAgICAgICAgICBwcmU6ICF0aGlzLm9wdGlvbnMuc2FuaXRpemVyICYmIGlzUHJlLFxuICAgICAgICAgIHRleHQ6IGV4ZWNBcnJbMF0sXG4gICAgICAgIH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gZGVmXG4gICAgICBpZiAodG9wICYmIChleGVjQXJyID0gdGhpcy5ydWxlcy5kZWYuZXhlYyhuZXh0UGFydCkpKSB7XG4gICAgICAgIG5leHRQYXJ0ID0gbmV4dFBhcnQuc3Vic3RyaW5nKGV4ZWNBcnJbMF0ubGVuZ3RoKTtcblxuICAgICAgICB0aGlzLmxpbmtzW2V4ZWNBcnJbMV0udG9Mb3dlckNhc2UoKV0gPSB7XG4gICAgICAgICAgaHJlZjogZXhlY0FyclsyXSxcbiAgICAgICAgICB0aXRsZTogZXhlY0FyclszXSxcbiAgICAgICAgfTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIHRhYmxlIChnZm0pXG4gICAgICBpZiAodG9wICYmIHRoaXMuaGFzUnVsZXNUYWJsZXMgJiYgKGV4ZWNBcnIgPSAodGhpcy5ydWxlcyBhcyBSdWxlc0Jsb2NrVGFibGVzKS50YWJsZS5leGVjKG5leHRQYXJ0KSkpIHtcbiAgICAgICAgbmV4dFBhcnQgPSBuZXh0UGFydC5zdWJzdHJpbmcoZXhlY0FyclswXS5sZW5ndGgpO1xuXG4gICAgICAgIGNvbnN0IGl0ZW06IFRva2VuID0ge1xuICAgICAgICAgIHR5cGU6IFRva2VuVHlwZS50YWJsZSxcbiAgICAgICAgICBoZWFkZXI6IGV4ZWNBcnJbMV0ucmVwbGFjZSgvXiAqfCAqXFx8ICokL2csICcnKS5zcGxpdCgvICpcXHwgKi8pLFxuICAgICAgICAgIGFsaWduOiBleGVjQXJyWzJdLnJlcGxhY2UoL14gKnxcXHwgKiQvZywgJycpLnNwbGl0KC8gKlxcfCAqLykgYXMgQWxpZ25bXSxcbiAgICAgICAgICBjZWxsczogW10sXG4gICAgICAgIH07XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtLmFsaWduLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKC9eICotKzogKiQvLnRlc3QoaXRlbS5hbGlnbltpXSkpIHtcbiAgICAgICAgICAgIGl0ZW0uYWxpZ25baV0gPSAncmlnaHQnO1xuICAgICAgICAgIH0gZWxzZSBpZiAoL14gKjotKzogKiQvLnRlc3QoaXRlbS5hbGlnbltpXSkpIHtcbiAgICAgICAgICAgIGl0ZW0uYWxpZ25baV0gPSAnY2VudGVyJztcbiAgICAgICAgICB9IGVsc2UgaWYgKC9eICo6LSsgKiQvLnRlc3QoaXRlbS5hbGlnbltpXSkpIHtcbiAgICAgICAgICAgIGl0ZW0uYWxpZ25baV0gPSAnbGVmdCc7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGl0ZW0uYWxpZ25baV0gPSBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRkID0gZXhlY0FyclszXS5yZXBsYWNlKC8oPzogKlxcfCAqKT9cXG4kLywgJycpLnNwbGl0KCdcXG4nKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaXRlbS5jZWxsc1tpXSA9IHRkW2ldLnJlcGxhY2UoL14gKlxcfCAqfCAqXFx8ICokL2csICcnKS5zcGxpdCgvICpcXHwgKi8pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50b2tlbnMucHVzaChpdGVtKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIHNpbXBsZSBydWxlc1xuICAgICAgaWYgKHRoaXMuc3RhdGljVGhpcy5zaW1wbGVSdWxlcy5sZW5ndGgpIHtcbiAgICAgICAgY29uc3Qgc2ltcGxlUnVsZXMgPSB0aGlzLnN0YXRpY1RoaXMuc2ltcGxlUnVsZXM7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2ltcGxlUnVsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAoKGV4ZWNBcnIgPSBzaW1wbGVSdWxlc1tpXS5leGVjKG5leHRQYXJ0KSkpIHtcbiAgICAgICAgICAgIG5leHRQYXJ0ID0gbmV4dFBhcnQuc3Vic3RyaW5nKGV4ZWNBcnJbMF0ubGVuZ3RoKTtcbiAgICAgICAgICAgIGNvbnN0IHR5cGUgPSAnc2ltcGxlUnVsZScgKyAoaSArIDEpO1xuICAgICAgICAgICAgdGhpcy50b2tlbnMucHVzaCh7IHR5cGUsIGV4ZWNBcnIgfSk7XG4gICAgICAgICAgICBjb250aW51ZSBtYWluTG9vcDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gdG9wLWxldmVsIHBhcmFncmFwaFxuICAgICAgaWYgKHRvcCAmJiAoZXhlY0FyciA9IHRoaXMucnVsZXMucGFyYWdyYXBoLmV4ZWMobmV4dFBhcnQpKSkge1xuICAgICAgICBuZXh0UGFydCA9IG5leHRQYXJ0LnN1YnN0cmluZyhleGVjQXJyWzBdLmxlbmd0aCk7XG5cbiAgICAgICAgaWYgKGV4ZWNBcnJbMV0uc2xpY2UoLTEpID09PSAnXFxuJykge1xuICAgICAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICAgICAgdHlwZTogVG9rZW5UeXBlLnBhcmFncmFwaCxcbiAgICAgICAgICAgIHRleHQ6IGV4ZWNBcnJbMV0uc2xpY2UoMCwgLTEpLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICAgICAgdHlwZTogdGhpcy50b2tlbnMubGVuZ3RoID4gMCA/IFRva2VuVHlwZS5wYXJhZ3JhcGggOiBUb2tlblR5cGUudGV4dCxcbiAgICAgICAgICAgIHRleHQ6IGV4ZWNBcnJbMV0sXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIHRleHRcbiAgICAgIC8vIFRvcC1sZXZlbCBzaG91bGQgbmV2ZXIgcmVhY2ggaGVyZS5cbiAgICAgIGlmICgoZXhlY0FyciA9IHRoaXMucnVsZXMudGV4dC5leGVjKG5leHRQYXJ0KSkpIHtcbiAgICAgICAgbmV4dFBhcnQgPSBuZXh0UGFydC5zdWJzdHJpbmcoZXhlY0FyclswXS5sZW5ndGgpO1xuICAgICAgICB0aGlzLnRva2Vucy5wdXNoKHsgdHlwZTogVG9rZW5UeXBlLnRleHQsIHRleHQ6IGV4ZWNBcnJbMF0gfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAobmV4dFBhcnQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICdJbmZpbml0ZSBsb29wIG9uIGJ5dGU6ICcgKyBuZXh0UGFydC5jaGFyQ29kZUF0KDApICsgYCwgbmVhciB0ZXh0ICcke25leHRQYXJ0LnNsaWNlKDAsIDMwKX0uLi4nYFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7IHRva2VuczogdGhpcy50b2tlbnMsIGxpbmtzOiB0aGlzLmxpbmtzIH07XG4gIH1cbn1cbiIsICIvKipcbiAqIEdlbmVyYXRlZCBidW5kbGUgaW5kZXguIERvIG5vdCBlZGl0LlxuICovXG5cbmV4cG9ydCAqIGZyb20gJy4vcHVibGljLWFwaSc7XG4iLCAiaW1wb3J0IHsgS0V4cG9ydCB9IGZyb20gJ2stZXhwb3J0J1xuY29uc3Qga2V4ID0gbmV3IEtFeHBvcnQoJ34vRGVza3RvcC9wdWJsaXNoJywvLyd+L0xpYnJhcnkvTW9iaWxlIERvY3VtZW50cy9pQ2xvdWR+bWR+b2JzaWRpYW4vRG9jdW1lbnRzL3BvcnRmb2xpby1raWljaGkvJyxcbiAgICAgICAgICAgICd+L0Rlc2t0b3AvdGVtcGxhdGUnLFxuICAgICAgICAgICAgJ34vRGVza3RvcC9wdWJsaXNoJyk7XG5rZXguc3RhcnQoKTsiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsU0FBb0I7QUFDcEIsV0FBc0I7QUFDdEIsU0FBb0I7OztBQ0ZwQixJQVVhLHFCQUFZO0VBSXZCLFlBQVksT0FBZSxRQUFnQixJQUFFO0FBQzNDLFNBQUssU0FBUyxNQUFNO0FBQ3BCLFNBQUssUUFBUTs7RUFTZixTQUFTLFdBQTRCLGFBQTRCO0FBQy9ELFFBQUksWUFBb0IsT0FBTyxlQUFlLFdBQVcsY0FBYyxZQUFZO0FBQ25GLGdCQUFZLFVBQVUsUUFBUSxnQkFBZ0IsSUFBSTtBQUdsRCxTQUFLLFNBQVMsS0FBSyxPQUFPLFFBQVEsV0FBVyxTQUFTO0FBQ3RELFdBQU87O0VBTVQsWUFBUztBQUNQLFdBQU8sSUFBSSxPQUFPLEtBQUssUUFBUSxLQUFLLEtBQUs7OztBQ3RDN0MsQUFZQSxJQUFNLGFBQWE7QUFDbkIsSUFBTSxnQkFBZ0I7QUFDdEIsSUFBTSxlQUE2QjtFQUNqQyxLQUFL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
