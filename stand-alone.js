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
    this.summary = Marked.parse(tmpSum.length > 300 ? tmpSum.substring(0, 300) + " &mldr; " : tmpSum);
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
        <div class="col-md-4 bloglist ${this.tags.replace("#", "")}">
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
      const contents = await fs.promises.readFile(mdfilePath, "utf-8");
      const dirpath = path.dirname(mdfilePath);
      const relativeSrcDirPath = dirpath.replace(this.srcPath, "");
      const relativeHtmlPath = htmlFilePath.replace(this.srcPath, "");
      const item = new GalleryItem(contents, relativeSrcDirPath, relativeHtmlPath);
      item.htmlFilePath = htmlFilePath;
      workItems.push(item);
    }
    workItems.sort((a, b) => b.ordnum - a.ordnum);
    for (var i = 0; i < workItems.length; i++) {
      const item = workItems[i];
      repeaterHtmlArr.push(item.getRepeaterHtml());
      let genOutputHtml = genTemplateHtml.replace(/<!-- {{{CONTENT}}} -->/, item.getHtml());
      genOutputHtml = genOutputHtml.replace(/<!-- {{{COPYRIGHT}}} -->/g, "\xA9 Copyright " + new Date().getFullYear() + " - Kiichi Takeuchi");
      genOutputHtml = genOutputHtml.replace(/<!-- {{{CATEGORY}}} -->/g, "Works");
      genOutputHtml = genOutputHtml.replace(/<!-- {{{TITLE}}} -->/g, item.title);
      genOutputHtml = genOutputHtml.replace(/<!-- {{{SUBTITLE}}} -->/g, `(${item.date})`);
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
    for await (const mdfilePath of this.getFiles(articleSrcPath)) {
      const htmlFilePath = mdfilePath.replace(".md", ".html");
      const contents = await fs.promises.readFile(mdfilePath, "utf-8");
      const dirpath = path.dirname(mdfilePath);
      const relativeSrcDirPath = dirpath.replace(this.srcPath, "");
      const relativeHtmlPath = htmlFilePath.replace(this.srcPath, "");
      const item = new ArticleItem(contents, relativeSrcDirPath, relativeHtmlPath);
      if (item.title.toLowerCase().indexOf("(draft)") === -1 && item.tags.toLocaleLowerCase().indexOf("#unlisted") === -1 && item.tags.toLocaleLowerCase().indexOf("#draft") === -1) {
        repeaterArticleHtmlArr.push(item.getRepeaterHtml());
      }
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiay1leHBvcnQudHMiLCAibm9kZV9tb2R1bGVzL0B0cy1zdGFjay9wcm9qZWN0cy9tYXJrZG93bi9zcmMvZXh0ZW5kLXJlZ2V4cC50cyIsICJub2RlX21vZHVsZXMvQHRzLXN0YWNrL3Byb2plY3RzL21hcmtkb3duL3NyYy9oZWxwZXJzLnRzIiwgIm5vZGVfbW9kdWxlcy9AdHMtc3RhY2svcHJvamVjdHMvbWFya2Rvd24vc3JjL2ludGVyZmFjZXMudHMiLCAibm9kZV9tb2R1bGVzL0B0cy1zdGFjay9wcm9qZWN0cy9tYXJrZG93bi9zcmMvcmVuZGVyZXIudHMiLCAibm9kZV9tb2R1bGVzL0B0cy1zdGFjay9wcm9qZWN0cy9tYXJrZG93bi9zcmMvaW5saW5lLWxleGVyLnRzIiwgIm5vZGVfbW9kdWxlcy9AdHMtc3RhY2svcHJvamVjdHMvbWFya2Rvd24vc3JjL3BhcnNlci50cyIsICJub2RlX21vZHVsZXMvQHRzLXN0YWNrL3Byb2plY3RzL21hcmtkb3duL3NyYy9tYXJrZWQudHMiLCAibm9kZV9tb2R1bGVzL0B0cy1zdGFjay9wcm9qZWN0cy9tYXJrZG93bi9zcmMvYmxvY2stbGV4ZXIudHMiLCAibm9kZV9tb2R1bGVzL0B0cy1zdGFjay9wcm9qZWN0cy9tYXJrZG93bi90cy1zdGFjay1tYXJrZG93bi50cyIsICJzdGFuZC1hbG9uZS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIG9zIGZyb20gJ29zJztcbmltcG9ydCB7IE1hcmtlZCwgUmVuZGVyZXIgfSBmcm9tICdAdHMtc3RhY2svbWFya2Rvd24nO1xuXG5jbGFzcyBNeVJlbmRlcmVyIGV4dGVuZHMgUmVuZGVyZXIge1xuICAvLyBpbWFnZSBlbWJlZCBhcyAzLUQgdmlld2VyIGlmIHRoZSBleHQgaXMgLmdsYi4gYWRkIC4vIGZvciB0aGUgcGF0aFxuICAvLyBodHRwczovL2RvYy5iYWJ5bG9uanMuY29tL2ZlYXR1cmVzL2ZlYXR1cmVzRGVlcERpdmUvYmFieWxvblZpZXdlci9kZWZhdWx0Vmlld2VyQ29uZmlnXG4gIGltYWdlKGhyZWY6IHN0cmluZywgdGl0bGU6IHN0cmluZywgdGV4dDogc3RyaW5nKTogc3RyaW5ne1xuICAgIGlmIChocmVmLmVuZHNXaXRoKCcuZ2xiJykpe1xuICAgICAgICByZXR1cm4gYDxiYWJ5bG9uIFxuICAgICAgICB0ZW1wbGF0ZXMubmF2LWJhci5wYXJhbXMubG9nby1pbWFnZT1cIi9pbWFnZXMvZmF2aWNvbi9hcHBsZS1pY29uLnBuZ1wiIFxuICAgICAgICB0ZW1wbGF0ZXMubmF2LWJhci5wYXJhbXMubG9nby10ZXh0PVwiQ29weXJpZ2h0IEtpaWNoaSBUYWtldWNoaVwiIFxuICAgICAgICB0ZW1wbGF0ZXMubmF2LWJhci5wYXJhbXMubG9nby1saW5rPVwiaHR0cHM6Ly9raWljaGl0YWtldWNoaS5jb20vXCIgXG4gICAgICAgIG1vZGVsPVwiLi8ke2hyZWZ9XCIgPjwvYmFieWxvbj5gXG4gICAgfVxuICAgIHJldHVybiBzdXBlci5pbWFnZShocmVmLHRpdGxlLHRleHQpO1xuICB9XG4gIGxpbmsoaHJlZjogc3RyaW5nLCB0aXRsZTogc3RyaW5nLCB0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGlmIChocmVmLnN0YXJ0c1dpdGgoXCJodHRwczovL3lvdXR1LmJlL1wiKSB8fCBocmVmLnN0YXJ0c1dpdGgoXCJodHRwczovL3d3dy55b3V0dWJlLmNvbS93YXRjaD92PVwiKSl7XG4gICAgICAgIGNvbnN0IHZpZGVvSWQgPSBocmVmLnJlcGxhY2UoXCJodHRwczovL3lvdXR1LmJlL1wiLCcnKS5yZXBsYWNlKFwiaHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1cIiwnJyk7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgIDxpZnJhbWUgd2lkdGg9XCI1NjBcIiBoZWlnaHQ9XCIzMTVcIiBcbiAgICAgICAgc3JjPVwiaHR0cHM6Ly93d3cueW91dHViZS5jb20vZW1iZWQvJHt2aWRlb0lkfVwiIFxuICAgICAgICB0aXRsZT1cIllvdVR1YmUgdmlkZW8gcGxheWVyXCIgZnJhbWVib3JkZXI9XCIwXCIgXG4gICAgICAgIGFsbG93PVwiYWNjZWxlcm9tZXRlcjsgYXV0b3BsYXk7IGNsaXBib2FyZC13cml0ZTsgZW5jcnlwdGVkLW1lZGlhOyBneXJvc2NvcGU7IHBpY3R1cmUtaW4tcGljdHVyZTsgd2ViLXNoYXJlXCIgXG4gICAgICAgIGFsbG93ZnVsbHNjcmVlbj48L2lmcmFtZT5cbiAgICAgICAgYDtcbiAgICB9ICAgIFxuICAgIGVsc2UgaWYgKGhyZWYuc3RhcnRzV2l0aChcImh0dHBzOi8vd3d3Lmluc3RhZ3JhbS5jb20vcC9cIikpe1xuICAgICAgICBjb25zdCBpbnN0YWdyYW1JZCA9IGhyZWYucmVwbGFjZSgnaHR0cHM6Ly93d3cuaW5zdGFncmFtLmNvbS9wLycsJycpLnJlcGxhY2UoJ1xcLycsJycpO1xuICAgICAgICByZXR1cm4gYFxuICAgICAgICA8YmxvY2txdW90ZSBjbGFzcz1cImluc3RhZ3JhbS1tZWRpYVwiIFxuICAgICAgICBkYXRhLWluc3Rncm0tY2FwdGlvbmVkIFxuICAgICAgICBkYXRhLWluc3Rncm0tcGVybWFsaW5rPVwiaHR0cHM6Ly93d3cuaW5zdGFncmFtLmNvbS9yZWVsLyR7aW5zdGFncmFtSWR9Lz91dG1fc291cmNlPWlnX2VtYmVkJmFtcDt1dG1fY2FtcGFpZ249bG9hZGluZ1wiIFxuICAgICAgICBkYXRhLWluc3Rncm0tdmVyc2lvbj1cIjE0XCIgc3R5bGU9XCIgXG4gICAgICAgIGJhY2tncm91bmQ6IzIyMjsgYm9yZGVyOjA7IGJvcmRlci1yYWRpdXM6M3B4OyBib3gtc2hhZG93OjAgMCAxcHggMCByZ2JhKDAsMCwwLDAuNSksMCAxcHggMTBweCAwIHJnYmEoMCwwLDAsMC4xNSk7IG1hcmdpbjogMXB4OyBtYXgtd2lkdGg6NTQwcHg7IG1pbi13aWR0aDozMjZweDsgcGFkZGluZzowOyB3aWR0aDo5OS4zNzUlOyB3aWR0aDotd2Via2l0LWNhbGMoMTAwJSAtIDJweCk7IHdpZHRoOmNhbGMoMTAwJSAtIDJweCk7XCI+PGRpdiBzdHlsZT1cInBhZGRpbmc6MTZweDtcIj4gPGEgaHJlZj1cImh0dHBzOi8vd3d3Lmluc3RhZ3JhbS5jb20vcmVlbC9DbHpmZlc0Z3U3Wi8/dXRtX3NvdXJjZT1pZ19lbWJlZCZhbXA7dXRtX2NhbXBhaWduPWxvYWRpbmdcIiBzdHlsZT1cIiBiYWNrZ3JvdW5kOiNGRkZGRkY7IGxpbmUtaGVpZ2h0OjA7IHBhZGRpbmc6MCAwOyB0ZXh0LWFsaWduOmNlbnRlcjsgdGV4dC1kZWNvcmF0aW9uOm5vbmU7IHdpZHRoOjEwMCU7XCIgdGFyZ2V0PVwiX2JsYW5rXCI+IDxkaXYgc3R5bGU9XCIgZGlzcGxheTogZmxleDsgZmxleC1kaXJlY3Rpb246IHJvdzsgYWxpZ24taXRlbXM6IGNlbnRlcjtcIj4gPGRpdiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6ICNGNEY0RjQ7IGJvcmRlci1yYWRpdXM6IDUwJTsgZmxleC1ncm93OiAwOyBoZWlnaHQ6IDQwcHg7IG1hcmdpbi1yaWdodDogMTRweDsgd2lkdGg6IDQwcHg7XCI+PC9kaXY+IDxkaXYgc3R5bGU9XCJkaXNwbGF5OiBmbGV4OyBmbGV4LWRpcmVjdGlvbjogY29sdW1uOyBmbGV4LWdyb3c6IDE7IGp1c3RpZnktY29udGVudDogY2VudGVyO1wiPiA8ZGl2IHN0eWxlPVwiIGJhY2tncm91bmQtY29sb3I6ICNGNEY0RjQ7IGJvcmRlci1yYWRpdXM6IDRweDsgZmxleC1ncm93OiAwOyBoZWlnaHQ6IDE0cHg7IG1hcmdpbi1ib3R0b206IDZweDsgd2lkdGg6IDEwMHB4O1wiPjwvZGl2PiA8ZGl2IHN0eWxlPVwiIGJhY2tncm91bmQtY29sb3I6ICNGNEY0RjQ7IGJvcmRlci1yYWRpdXM6IDRweDsgZmxleC1ncm93OiAwOyBoZWlnaHQ6IDE0cHg7IHdpZHRoOiA2MHB4O1wiPjwvZGl2PjwvZGl2PjwvZGl2PjxkaXYgc3R5bGU9XCJwYWRkaW5nOiAxOSUgMDtcIj48L2Rpdj4gPGRpdiBzdHlsZT1cImRpc3BsYXk6YmxvY2s7IGhlaWdodDo1MHB4OyBtYXJnaW46MCBhdXRvIDEycHg7IHdpZHRoOjUwcHg7XCI+PHN2ZyB3aWR0aD1cIjUwcHhcIiBoZWlnaHQ9XCI1MHB4XCIgdmlld0JveD1cIjAgMCA2MCA2MFwiIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHBzOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cHM6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIj48ZyBzdHJva2U9XCJub25lXCIgc3Ryb2tlLXdpZHRoPVwiMVwiIGZpbGw9XCJub25lXCIgZmlsbC1ydWxlPVwiZXZlbm9kZFwiPjxnIHRyYW5zZm9ybT1cInRyYW5zbGF0ZSgtNTExLjAwMDAwMCwgLTIwLjAwMDAwMClcIiBmaWxsPVwiIzAwMDAwMFwiPjxnPjxwYXRoIGQ9XCJNNTU2Ljg2OSwzMC40MSBDNTU0LjgxNCwzMC40MSA1NTMuMTQ4LDMyLjA3NiA1NTMuMTQ4LDM0LjEzMSBDNTUzLjE0OCwzNi4xODYgNTU0LjgxNCwzNy44NTIgNTU2Ljg2OSwzNy44NTIgQzU1OC45MjQsMzcuODUyIDU2MC41OSwzNi4xODYgNTYwLjU5LDM0LjEzMSBDNTYwLjU5LDMyLjA3NiA1NTguOTI0LDMwLjQxIDU1Ni44NjksMzAuNDEgTTU0MSw2MC42NTcgQzUzNS4xMTQsNjAuNjU3IDUzMC4zNDIsNTUuODg3IDUzMC4zNDIsNTAgQzUzMC4zNDIsNDQuMTE0IDUzNS4xMTQsMzkuMzQyIDU0MSwzOS4zNDIgQzU0Ni44ODcsMzkuMzQyIDU1MS42NTgsNDQuMTE0IDU1MS42NTgsNTAgQzU1MS42NTgsNTUuODg3IDU0Ni44ODcsNjAuNjU3IDU0MSw2MC42NTcgTTU0MSwzMy44ODYgQzUzMi4xLDMzLjg4NiA1MjQuODg2LDQxLjEgNTI0Ljg4Niw1MCBDNTI0Ljg4Niw1OC44OTkgNTMyLjEsNjYuMTEzIDU0MSw2Ni4xMTMgQzU0OS45LDY2LjExMyA1NTcuMTE1LDU4Ljg5OSA1NTcuMTE1LDUwIEM1NTcuMTE1LDQxLjEgNTQ5LjksMzMuODg2IDU0MSwzMy44ODYgTTU2NS4zNzgsNjIuMTAxIEM1NjUuMjQ0LDY1LjAyMiA1NjQuNzU2LDY2LjYwNiA1NjQuMzQ2LDY3LjY2MyBDNTYzLjgwMyw2OS4wNiA1NjMuMTU0LDcwLjA1NyA1NjIuMTA2LDcxLjEwNiBDNTYxLjA1OCw3Mi4xNTUgNTYwLjA2LDcyLjgwMyA1NTguNjYyLDczLjM0NyBDNTU3LjYwNyw3My43NTcgNTU2LjAyMSw3NC4yNDQgNTUzLjEwMiw3NC4zNzggQzU0OS45NDQsNzQuNTIxIDU0OC45OTcsNzQuNTUyIDU0MSw3NC41NTIgQzUzMy4wMDMsNzQuNTUyIDUzMi4wNTYsNzQuNTIxIDUyOC44OTgsNzQuMzc4IEM1MjUuOTc5LDc0LjI0NCA1MjQuMzkzLDczLjc1NyA1MjMuMzM4LDczLjM0NyBDNTIxLjk0LDcyLjgwMyA1MjAuOTQyLDcyLjE1NSA1MTkuODk0LDcxLjEwNiBDNTE4Ljg0Niw3MC4wNTcgNTE4LjE5Nyw2OS4wNiA1MTcuNjU0LDY3LjY2MyBDNTE3LjI0NCw2Ni42MDYgNTE2Ljc1NSw2NS4wMjIgNTE2LjYyMyw2Mi4xMDEgQzUxNi40NzksNTguOTQzIDUxNi40NDgsNTcuOTk2IDUxNi40NDgsNTAgQzUxNi40NDgsNDIuMDAzIDUxNi40NzksNDEuMDU2IDUxNi42MjMsMzcuODk5IEM1MTYuNzU1LDM0Ljk3OCA1MTcuMjQ0LDMzLjM5MSA1MTcuNjU0LDMyLjMzOCBDNTE4LjE5NywzMC45MzggNTE4Ljg0NiwyOS45NDIgNTE5Ljg5NCwyOC44OTQgQzUyMC45NDIsMjcuODQ2IDUyMS45NCwyNy4xOTYgNTIzLjMzOCwyNi42NTQgQzUyNC4zOTMsMjYuMjQ0IDUyNS45NzksMjUuNzU2IDUyOC44OTgsMjUuNjIzIEM1MzIuMDU3LDI1LjQ3OSA1MzMuMDA0LDI1LjQ0OCA1NDEsMjUuNDQ4IEM1NDguOTk3LDI1LjQ0OCA1NDkuOTQzLDI1LjQ3OSA1NTMuMTAyLDI1LjYyMyBDNTU2LjAyMSwyNS43NTYgNTU3LjYwNywyNi4yNDQgNTU4LjY2MiwyNi42NTQgQzU2MC4wNiwyNy4xOTYgNTYxLjA1OCwyNy44NDYgNTYyLjEwNiwyOC44OTQgQzU2My4xNTQsMjkuOTQyIDU2My44MDMsMzAuOTM4IDU2NC4zNDYsMzIuMzM4IEM1NjQuNzU2LDMzLjM5MSA1NjUuMjQ0LDM0Ljk3OCA1NjUuMzc4LDM3Ljg5OSBDNTY1LjUyMiw0MS4wNTYgNTY1LjU1Miw0Mi4wMDMgNTY1LjU1Miw1MCBDNTY1LjU1Miw1Ny45OTYgNTY1LjUyMiw1OC45NDMgNTY1LjM3OCw2Mi4xMDEgTTU3MC44MiwzNy42MzEgQzU3MC42NzQsMzQuNDM4IDU3MC4xNjcsMzIuMjU4IDU2OS40MjUsMzAuMzQ5IEM1NjguNjU5LDI4LjM3NyA1NjcuNjMzLDI2LjcwMiA1NjUuOTY1LDI1LjAzNSBDNTY0LjI5NywyMy4zNjggNTYyLjYyMywyMi4zNDIgNTYwLjY1MiwyMS41NzUgQzU1OC43NDMsMjAuODM0IDU1Ni41NjIsMjAuMzI2IDU1My4zNjksMjAuMTggQzU1MC4xNjksMjAuMDMzIDU0OS4xNDgsMjAgNTQxLDIwIEM1MzIuODUzLDIwIDUzMS44MzEsMjAuMDMzIDUyOC42MzEsMjAuMTggQzUyNS40MzgsMjAuMzI2IDUyMy4yNTcsMjAuODM0IDUyMS4zNDksMjEuNTc1IEM1MTkuMzc2LDIyLjM0MiA1MTcuNzAzLDIzLjM2OCA1MTYuMDM1LDI1LjAzNSBDNTE0LjM2OCwyNi43MDIgNTEzLjM0MiwyOC4zNzcgNTEyLjU3NCwzMC4zNDkgQzUxMS44MzQsMzIuMjU4IDUxMS4zMjYsMzQuNDM4IDUxMS4xODEsMzcuNjMxIEM1MTEuMDM1LDQwLjgzMSA1MTEsNDEuODUxIDUxMSw1MCBDNTExLDU4LjE0NyA1MTEuMDM1LDU5LjE3IDUxMS4xODEsNjIuMzY5IEM1MTEuMzI2LDY1LjU2MiA1MTEuODM0LDY3Ljc0MyA1MTIuNTc0LDY5LjY1MSBDNTEzLjM0Miw3MS42MjUgNTE0LjM2OCw3My4yOTYgNTE2LjAzNSw3NC45NjUgQzUxNy43MDMsNzYuNjM0IDUxOS4zNzYsNzcuNjU4IDUyMS4zNDksNzguNDI1IEM1MjMuMjU3LDc5LjE2NyA1MjUuNDM4LDc5LjY3MyA1MjguNjMxLDc5LjgyIEM1MzEuODMxLDc5Ljk2NSA1MzIuODUzLDgwLjAwMSA1NDEsODAuMDAxIEM1NDkuMTQ4LDgwLjAwMSA1NTAuMTY5LDc5Ljk2NSA1NTMuMzY5LDc5LjgyIEM1NTYuNTYyLDc5LjY3MyA1NTguNzQzLDc5LjE2NyA1NjAuNjUyLDc4LjQyNSBDNTYyLjYyMyw3Ny42NTggNTY0LjI5Nyw3Ni42MzQgNTY1Ljk2NSw3NC45NjUgQzU2Ny42MzMsNzMuMjk2IDU2OC42NTksNzEuNjI1IDU2OS40MjUsNjkuNjUxIEM1NzAuMTY3LDY3Ljc0MyA1NzAuNjc0LDY1LjU2MiA1NzAuODIsNjIuMzY5IEM1NzAuOTY2LDU5LjE3IDU3MSw1OC4xNDcgNTcxLDUwIEM1NzEsNDEuODUxIDU3MC45NjYsNDAuODMxIDU3MC44MiwzNy42MzFcIj48L3BhdGg+PC9nPjwvZz48L2c+PC9zdmc+PC9kaXY+PGRpdiBzdHlsZT1cInBhZGRpbmctdG9wOiA4cHg7XCI+IDxkaXYgc3R5bGU9XCIgY29sb3I6IzM4OTdmMDsgZm9udC1mYW1pbHk6QXJpYWwsc2Fucy1zZXJpZjsgZm9udC1zaXplOjE0cHg7IGZvbnQtc3R5bGU6bm9ybWFsOyBmb250LXdlaWdodDo1NTA7IGxpbmUtaGVpZ2h0OjE4cHg7XCI+VmlldyB0aGlzIHBvc3Qgb24gSW5zdGFncmFtPC9kaXY+PC9kaXY+PGRpdiBzdHlsZT1cInBhZGRpbmc6IDEyLjUlIDA7XCI+PC9kaXY+IDxkaXYgc3R5bGU9XCJkaXNwbGF5OiBmbGV4OyBmbGV4LWRpcmVjdGlvbjogcm93OyBtYXJnaW4tYm90dG9tOiAxNHB4OyBhbGlnbi1pdGVtczogY2VudGVyO1wiPjxkaXY+IDxkaXYgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOiAjRjRGNEY0OyBib3JkZXItcmFkaXVzOiA1MCU7IGhlaWdodDogMTIuNXB4OyB3aWR0aDogMTIuNXB4OyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMHB4KSB0cmFuc2xhdGVZKDdweCk7XCI+PC9kaXY+IDxkaXYgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOiAjRjRGNEY0OyBoZWlnaHQ6IDEyLjVweDsgdHJhbnNmb3JtOiByb3RhdGUoLTQ1ZGVnKSB0cmFuc2xhdGVYKDNweCkgdHJhbnNsYXRlWSgxcHgpOyB3aWR0aDogMTIuNXB4OyBmbGV4LWdyb3c6IDA7IG1hcmdpbi1yaWdodDogMTRweDsgbWFyZ2luLWxlZnQ6IDJweDtcIj48L2Rpdj4gPGRpdiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6ICNGNEY0RjQ7IGJvcmRlci1yYWRpdXM6IDUwJTsgaGVpZ2h0OiAxMi41cHg7IHdpZHRoOiAxMi41cHg7IHRyYW5zZm9ybTogdHJhbnNsYXRlWCg5cHgpIHRyYW5zbGF0ZVkoLTE4cHgpO1wiPjwvZGl2PjwvZGl2PjxkaXYgc3R5bGU9XCJtYXJnaW4tbGVmdDogOHB4O1wiPiA8ZGl2IHN0eWxlPVwiIGJhY2tncm91bmQtY29sb3I6ICNGNEY0RjQ7IGJvcmRlci1yYWRpdXM6IDUwJTsgZmxleC1ncm93OiAwOyBoZWlnaHQ6IDIwcHg7IHdpZHRoOiAyMHB4O1wiPjwvZGl2PiA8ZGl2IHN0eWxlPVwiIHdpZHRoOiAwOyBoZWlnaHQ6IDA7IGJvcmRlci10b3A6IDJweCBzb2xpZCB0cmFuc3BhcmVudDsgYm9yZGVyLWxlZnQ6IDZweCBzb2xpZCAjZjRmNGY0OyBib3JkZXItYm90dG9tOiAycHggc29saWQgdHJhbnNwYXJlbnQ7IHRyYW5zZm9ybTogdHJhbnNsYXRlWCgxNnB4KSB0cmFuc2xhdGVZKC00cHgpIHJvdGF0ZSgzMGRlZylcIj48L2Rpdj48L2Rpdj48ZGl2IHN0eWxlPVwibWFyZ2luLWxlZnQ6IGF1dG87XCI+IDxkaXYgc3R5bGU9XCIgd2lkdGg6IDBweDsgYm9yZGVyLXRvcDogOHB4IHNvbGlkICNGNEY0RjQ7IGJvcmRlci1yaWdodDogOHB4IHNvbGlkIHRyYW5zcGFyZW50OyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMTZweCk7XCI+PC9kaXY+IDxkaXYgc3R5bGU9XCIgYmFja2dyb3VuZC1jb2xvcjogI0Y0RjRGNDsgZmxleC1ncm93OiAwOyBoZWlnaHQ6IDEycHg7IHdpZHRoOiAxNnB4OyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTRweCk7XCI+PC9kaXY+IDxkaXYgc3R5bGU9XCIgd2lkdGg6IDA7IGhlaWdodDogMDsgYm9yZGVyLXRvcDogOHB4IHNvbGlkICNGNEY0RjQ7IGJvcmRlci1sZWZ0OiA4cHggc29saWQgdHJhbnNwYXJlbnQ7IHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNHB4KSB0cmFuc2xhdGVYKDhweCk7XCI+PC9kaXY+PC9kaXY+PC9kaXY+IDxkaXYgc3R5bGU9XCJkaXNwbGF5OiBmbGV4OyBmbGV4LWRpcmVjdGlvbjogY29sdW1uOyBmbGV4LWdyb3c6IDE7IGp1c3RpZnktY29udGVudDogY2VudGVyOyBtYXJnaW4tYm90dG9tOiAyNHB4O1wiPiA8ZGl2IHN0eWxlPVwiIGJhY2tncm91bmQtY29sb3I6ICNGNEY0RjQ7IGJvcmRlci1yYWRpdXM6IDRweDsgZmxleC1ncm93OiAwOyBoZWlnaHQ6IDE0cHg7IG1hcmdpbi1ib3R0b206IDZweDsgd2lkdGg6IDIyNHB4O1wiPjwvZGl2PiA8ZGl2IHN0eWxlPVwiIGJhY2tncm91bmQtY29sb3I6ICNGNEY0RjQ7IGJvcmRlci1yYWRpdXM6IDRweDsgZmxleC1ncm93OiAwOyBoZWlnaHQ6IDE0cHg7IHdpZHRoOiAxNDRweDtcIj48L2Rpdj48L2Rpdj48L2E+PHAgc3R5bGU9XCIgY29sb3I6I2M5YzhjZDsgZm9udC1mYW1pbHk6QXJpYWwsc2Fucy1zZXJpZjsgZm9udC1zaXplOjE0cHg7IGxpbmUtaGVpZ2h0OjE3cHg7IG1hcmdpbi1ib3R0b206MDsgbWFyZ2luLXRvcDo4cHg7IG92ZXJmbG93OmhpZGRlbjsgcGFkZGluZzo4cHggMCA3cHg7IHRleHQtYWxpZ246Y2VudGVyOyB0ZXh0LW92ZXJmbG93OmVsbGlwc2lzOyB3aGl0ZS1zcGFjZTpub3dyYXA7XCI+PGEgaHJlZj1cImh0dHBzOi8vd3d3Lmluc3RhZ3JhbS5jb20vcmVlbC9DbHpmZlc0Z3U3Wi8/dXRtX3NvdXJjZT1pZ19lbWJlZCZhbXA7dXRtX2NhbXBhaWduPWxvYWRpbmdcIiBzdHlsZT1cIiBjb2xvcjojYzljOGNkOyBmb250LWZhbWlseTpBcmlhbCxzYW5zLXNlcmlmOyBmb250LXNpemU6MTRweDsgZm9udC1zdHlsZTpub3JtYWw7IGZvbnQtd2VpZ2h0Om5vcm1hbDsgbGluZS1oZWlnaHQ6MTdweDsgdGV4dC1kZWNvcmF0aW9uOm5vbmU7XCIgdGFyZ2V0PVwiX2JsYW5rXCI+QSBwb3N0IHNoYXJlZCBieSBLaWljaGlcdTIwMTlzIEJlbnRvIGFuZCBDZXJhbWljcyAoQGJlbnRvZ3JhbTIyKTwvYT48L3A+PC9kaXY+XG4gICAgICAgIDwvYmxvY2txdW90ZT4gXG4gICAgICAgIDxzY3JpcHQgYXN5bmMgc3JjPVwiLy93d3cuaW5zdGFncmFtLmNvbS9lbWJlZC5qc1wiPjwvc2NyaXB0PlxuICAgICAgICBgO1xuICAgIH1cbiAgICByZXR1cm4gc3VwZXIubGluayhocmVmLHRpdGxlLCB0ZXh0KTtcbiAgfVxufVxuTWFya2VkLnNldE9wdGlvbnMoe3JlbmRlcmVyOiBuZXcgTXlSZW5kZXJlcn0pO1xuXG5jbGFzcyBHZW5lcmljSXRlbSB7XG4gICAgbWRyYXc6c3RyaW5nID0gJyc7XG4gICAgbWRGaWxlUGF0aDpzdHJpbmcgPSAnJztcbiAgICBodG1sRmlsZVBhdGg6c3RyaW5nID0gJyc7XG4gICAgY29uc3RydWN0b3IoaW5NRFJhdzpzdHJpbmcpe1xuICAgICAgICB0aGlzLm1kcmF3ID0gaW5NRFJhdztcbiAgICB9XG5cbiAgICBnZXRIdG1sKCl7XG4gICAgICAgIHJldHVybiBNYXJrZWQucGFyc2UodGhpcy5tZHJhdyk7XG4gICAgfVxufVxuXG5jbGFzcyBBcnRpY2xlSXRlbSBleHRlbmRzIEdlbmVyaWNJdGVtIHtcbiAgICB0aXRsZTpzdHJpbmcgPSAnJztcbiAgICBzdW1tYXJ5OnN0cmluZyA9ICcnO1xuICAgIHRhZ3M6c3RyaW5nID0gJyc7XG4gICAgZGF0ZTpzdHJpbmcgPSAnJztcbiAgICBpbWFnZTpzdHJpbmcgPSAnJztcbiAgICBmaWxlUGF0aDpzdHJpbmcgPSAnJztcblxuICAgIGNvbnN0cnVjdG9yKGluTURSYXc6c3RyaW5nLCBpbkRpclBhdGg6c3RyaW5nLCBpbkZpbGVQYXRoOnN0cmluZyl7XG4gICAgICAgIHN1cGVyKGluTURSYXcpO1xuXG4gICAgICAgIGNvbnN0IGxpbmVzID0gdGhpcy5tZHJhdy5zcGxpdCgnXFxuJykuZmlsdGVyKCh4KT0+eCk7XG4gICAgICAgIGxldCBjb3VudGVyID0gMDtcbiAgICAgICAgbGV0IHRtcFN1bSA9ICcnO1xuICAgICAgICBmb3IgKGxldCBsaW5lIG9mIGxpbmVzKXtcbiAgICAgICAgICAgIGlmIChsaW5lLnN0YXJ0c1dpdGgoJyMgJykpe1xuICAgICAgICAgICAgICAgIGlmIChjb3VudGVyID09IDApe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRpdGxlID0gbGluZS5yZXBsYWNlKCcjICcsJycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvdW50ZXIrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjb3VudGVyID09IDEpe1xuICAgICAgICAgICAgICAgIGlmIChsaW5lLnN0YXJ0c1dpdGgoJy0gRGF0ZTonKSl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0ZSA9IGxpbmUucmVwbGFjZSgnLSBEYXRlOicsJycpLnRyaW0oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobGluZS5zdGFydHNXaXRoKCctIFRhZ3M6Jykpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRhZ3MgPSBsaW5lLnJlcGxhY2UoJy0gVGFnczonLCcnKS50cmltKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGxpbmUuc3RhcnRzV2l0aCgnIVtdKCcpKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2xlYW5lZCA9IGxpbmUucmVwbGFjZSgnIVtdKCcsJycpLnJlcGxhY2UoJyknLCcnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmltYWdlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2UgPSAgcGF0aC5qb2luKGluRGlyUGF0aCwgY2xlYW5lZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobGluZS5zdGFydHNXaXRoKCcjICcpKXtcbiAgICAgICAgICAgICAgICAgICAgLy8gbm90aGluZ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdG1wU3VtICs9IGxpbmU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdW1tYXJ5ID0gTWFya2VkLnBhcnNlKCh0bXBTdW0ubGVuZ3RoID4gMzAwKSA/IHRtcFN1bS5zdWJzdHJpbmcoMCwzMDApICsgJyAmbWxkcjsgJyA6IHRtcFN1bSk7XG4gICAgICAgIHRoaXMuZmlsZVBhdGggPSBpbkZpbGVQYXRoO1xuICAgIH1cbiAgICBnZXREYXRlKCl7XG4gICAgICAgIHJldHVybiAoKG5ldyBEYXRlKHRoaXMuZGF0ZSArICcgJykpLmdldERhdGUoKSk7XG4gICAgfVxuICAgIGdldE1vbnRoKCl7ICAgICAgICBcbiAgICAgICAgcmV0dXJuIChuZXcgRGF0ZSh0aGlzLmRhdGUgKyAnICcpKS50b0xvY2FsZVN0cmluZygnZW4tVVMnLCB7bW9udGg6ICdzaG9ydCd9KS50b0xvY2FsZVVwcGVyQ2FzZSgpO1xuICAgIH1cbiAgICBnZXREYXRlU3RyKCl7XG4gICAgICAgIHJldHVybiAobmV3IERhdGUodGhpcy5kYXRlICsgJyAnKSkudG9Mb2NhbGVEYXRlU3RyaW5nKCk7XG4gICAgfVxuICAgIGdldFJlcGVhdGVySHRtbCgpe1xuICAgICAgICByZXR1cm4gYFxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTQgYmxvZ2xpc3QgJHt0aGlzLnRhZ3MucmVwbGFjZSgnIycsJycpfVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwb3N0LWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwb3N0LWltYWdlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9XCIke3RoaXMuaW1hZ2V9XCIgYWx0PVwiXCIgZHJhZ2dhYmxlPVwiZmFsc2VcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRhdGUtYm94XCI+PHNwYW4gY2xhc3M9XCJkYXlcIj4ke3RoaXMuZ2V0RGF0ZSgpfTwvc3Bhbj4gPHNwYW4gY2xhc3M9XCJtb250aFwiPiR7dGhpcy5nZXRNb250aCgpfTwvc3Bhbj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwb3N0LXRleHRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDM+PGEgaHJlZj1cIiR7dGhpcy5maWxlUGF0aH1cIj4ke3RoaXMudGl0bGV9PC9hPjwvaDM+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBvc3Qtc3VtbWFyeVwiPiR7dGhpcy5zdW1tYXJ5fTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIke3RoaXMuZmlsZVBhdGh9XCIgY2xhc3M9XCJidG4tdGV4dFwiPlJlYWQgTW9yZTwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYFxuICAgIH1cbn1cbmNsYXNzIEdhbGxlcnlJdGVtIGV4dGVuZHMgR2VuZXJpY0l0ZW0ge1xuICAgIHRpdGxlOnN0cmluZyA9ICcnO1xuICAgIHRhZ3M6c3RyaW5nID0gJyc7XG4gICAgZGF0ZTpzdHJpbmcgPSAnJztcbiAgICBwbGFjZTpzdHJpbmcgPSAnJztcbiAgICBtZWRpdW06c3RyaW5nID0gJyc7XG4gICAgZGltZW5zaW9uczpzdHJpbmcgPSAnJztcbiAgICBubzpzdHJpbmcgPSAnJztcbiAgICBvcmRudW06bnVtYmVyID0gMDtcbiAgICBzb2xkOmJvb2xlYW4gPSBmYWxzZTtcbiAgICBkZXNjcmlwdGlvbjpzdHJpbmcgPSAnJztcbiAgICB0aHVtYm5haWw6c3RyaW5nID0gJyc7XG4gICAgZnVsbGltYWdlOnN0cmluZyA9ICcnO1xuICAgIGh0bWxwYXRoOnN0cmluZyA9ICcnO1xuXG4gICAgY29uc3RydWN0b3IoaW5NRFJhdzpzdHJpbmcsIGluUmVsYXRpdmVQYXRoOnN0cmluZywgaW5SZWxhdGl2ZUh0bWxQYXRoOnN0cmluZyApe1xuICAgICAgICBzdXBlcihpbk1EUmF3KTtcblxuICAgICAgICB2YXIgZGF0YTphbnkgPSB7fTtcbiAgICAgICAgdmFyIGtleSA9ICcnO1xuICAgICAgICBjb25zdCBsaW5lcyA9IHRoaXMubWRyYXcuc3BsaXQoJ1xcbicpLmZpbHRlcigoeCk9PngpO1xuXG4gICAgICAgIGZvciAobGV0IGxpbmUgb2YgbGluZXMpe1xuICAgICAgICAgICAgaWYgKGxpbmUuc3RhcnRzV2l0aCgnIycpKXtcbiAgICAgICAgICAgICAgICBrZXkgPSBsaW5lLnNwbGl0KCcgJylbMV07XG4gICAgICAgICAgICAgICAgZGF0YVtrZXldID0gW107XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoa2V5KXtcbiAgICAgICAgICAgICAgICBkYXRhW2tleV0ucHVzaChsaW5lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcblxuICAgICAgICBmb3IgKGxldCBsaW5lIG9mIGRhdGFbJ0Fib3V0J10pe1xuICAgICAgICAgICAgaWYgKGxpbmUuc3RhcnRzV2l0aCgnLSBUaXRsZTonKSl7XG4gICAgICAgICAgICAgICAgdGhpcy50aXRsZSA9IGxpbmUucmVwbGFjZSgnLSBUaXRsZTonLCcnKS50cmltKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChsaW5lLnN0YXJ0c1dpdGgoJy0gRGF0ZTonKSl7XG4gICAgICAgICAgICAgICAgdGhpcy5kYXRlID0gbGluZS5yZXBsYWNlKCctIERhdGU6JywnJykudHJpbSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobGluZS5zdGFydHNXaXRoKCctIFBsYWNlOicpKXtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYWNlID0gbGluZS5yZXBsYWNlKCctIFBsYWNlOicsJycpLnRyaW0oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGxpbmUuc3RhcnRzV2l0aCgnLSBNZWRpdW06Jykpe1xuICAgICAgICAgICAgICAgIHRoaXMubWVkaXVtID0gbGluZS5yZXBsYWNlKCctIE1lZGl1bTonLCcnKS50cmltKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChsaW5lLnN0YXJ0c1dpdGgoJy0gRGltZW5zaW9uczonKSl7XG4gICAgICAgICAgICAgICAgdGhpcy5kaW1lbnNpb25zID0gbGluZS5yZXBsYWNlKCctIERpbWVuc2lvbnM6JywnJykudHJpbSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobGluZS5zdGFydHNXaXRoKCctIE5vOicpKXtcbiAgICAgICAgICAgICAgICB0aGlzLm5vID0gbGluZS5yZXBsYWNlKCctIE5vOicsJycpLnRyaW0oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGxpbmUuc3RhcnRzV2l0aCgnLSBEZXNjcmlwdGlvbjonKSl7XG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IGxpbmUucmVwbGFjZSgnLSBEZXNjcmlwdGlvbjonLCcnKS50cmltKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChsaW5lLnN0YXJ0c1dpdGgoJy0gVGFnczonKSl7XG4gICAgICAgICAgICAgICAgdGhpcy50YWdzID0gbGluZS5yZXBsYWNlKCctIFRhZ3M6JywnJykudHJpbSgpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRhZ3MuaW5kZXhPZignI3NvbGQnKSA+IC0xKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zb2xkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChsaW5lLnN0YXJ0c1dpdGgoJy0gT3JkTnVtOicpKXtcbiAgICAgICAgICAgICAgICBsZXQgdG1wT3JkTnVtID0gbGluZS5yZXBsYWNlKCctIE9yZE51bTonLCcnKS50cmltKCk7XG4gICAgICAgICAgICAgICAgaWYgKHRtcE9yZE51bSl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3JkbnVtID0gcGFyc2VJbnQodG1wT3JkTnVtKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgaWYgKGRhdGFbXCJJbWFnZXNcIl0ubGVuZ3RoID09IDApe1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbWFnZSBOb3QgRm91bmQgJHt0aGlzLm1kcmF3fWApO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGNsZWFuZWQgPSBkYXRhWydJbWFnZXMnXVswXS5yZXBsYWNlKCchW10oJywnJykucmVwbGFjZSgnKScsJycpO1xuICAgICAgICB0aGlzLnRodW1ibmFpbCA9IHBhdGguam9pbihpblJlbGF0aXZlUGF0aCwgY2xlYW5lZCk7XG4gICAgICAgIHRoaXMuZnVsbGltYWdlID0gdGhpcy50aHVtYm5haWw7XG4gICAgICAgIHRoaXMuaHRtbHBhdGggPSBpblJlbGF0aXZlSHRtbFBhdGg7XG4gICAgfVxuXG4gICAgZ2V0UmVwZWF0ZXJIdG1sKCl7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJpdGVtICR7dGhpcy50YWdzLnJlcGxhY2UoLyMvaWcsJycpfVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBpY2ZyYW1lXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJvdmVybGF5XCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiaWNvblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiR7dGhpcy50aHVtYm5haWx9XCIgZGF0YS10eXBlPVwicHJldHR5UGhvdG9bZ2FsbGVyeV1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtc2VhcmNoIGljb24tdmlld1wiPjwvaT48L2E+XG4gICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJpY29uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiJHt0aGlzLmh0bWxwYXRofVwiPjxpIGNsYXNzPVwiZmEgZmEtYWxpZ24tanVzdGlmeSBmYS1leHRlcm5hbC1saW5rIGljb24taW5mb1wiPjwvaT48L2E+XG4gICAgICAgICAgICAgICAgICAgIDwvc3Bhbj4gXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicGZfdGV4dFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2plY3QtbmFtZVwiPiR7dGhpcy50aXRsZX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+RGF0ZTogJHt0aGlzLmRhdGV9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlBsYWNlOiAke3RoaXMucGxhY2V9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2Pk1lZGl1bTogJHt0aGlzLmRlc2NyaXB0aW9ufTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5EaW1lbnNpb25zOiAke3RoaXMuZGltZW5zaW9uc308L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+JHt0aGlzLnNvbGQgPyAnU09MRCcgOiAnJ308L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwhLS0gPGRpdj5ObzogJHt0aGlzLm5vfTwvZGl2PiAtLT5cbiAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cblxuICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiJHt0aGlzLmZ1bGxpbWFnZX1cIiBhbHQ9XCJcIiAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICBgXG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgS0V4cG9ydCB7XG4gICAgc3JjUGF0aDpzdHJpbmcgPSAnJztcbiAgICBkc3RQYXRoOnN0cmluZyA9ICcnO1xuICAgIHRwbFBhdGg6c3RyaW5nID0gJyc7XG4gICAgY29uc3RydWN0b3IoaW5TcmNQYXRoOnN0cmluZywgaW5UcGxQYXRoOnN0cmluZywgaW5Ec3RQYXRoOnN0cmluZyl7XG4gICAgICAgIHRoaXMuc3JjUGF0aCA9IGluU3JjUGF0aC5yZXBsYWNlKFwiflwiLG9zLmhvbWVkaXIoKSk7XG4gICAgICAgIHRoaXMuZHN0UGF0aCA9IGluRHN0UGF0aC5yZXBsYWNlKFwiflwiLG9zLmhvbWVkaXIoKSk7XG4gICAgICAgIHRoaXMudHBsUGF0aCA9IGluVHBsUGF0aC5yZXBsYWNlKFwiflwiLG9zLmhvbWVkaXIoKSk7XG4gICAgfVxuXG4gICAgYXN5bmMgc3RhcnQoKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJFeHBvcnQgU3RhcnRlZC4uLi5cIik7XG5cbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgICAgICAvLyBHZW5lcmljXG4gICAgICAgIGNvbnN0IGdlblRwbEZpbGVQYXRoID0gcGF0aC5qb2luKHRoaXMudHBsUGF0aCwnZ2VuZXJpYy10ZW1wbGF0ZS5odG1sJyk7XG4gICAgICAgIGNvbnN0IGdlblRlbXBsYXRlSHRtbCA9IGF3YWl0IGZzLnByb21pc2VzLnJlYWRGaWxlKGdlblRwbEZpbGVQYXRoLCd1dGYtOCcpO1xuICAgICAgICBcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgICAgICAvLyBXb3Jrc1xuICAgICAgICAvLyAxLiBHYXRoZXIgYWxsIE1ldGEgSW5mbyBhbmQgR2VuZXJhdGUgc2luZ2xlIFRodW1ibmFpbCBHYWxsZXJ5XG4gICAgICAgIC8vIDIuIEdlbmVyYXRlIGluZGl2aWR1YWwgcGFnZSBhbmQgZHVtcCB0aGUgLmh0bWwgbmV4dCB0byAubWQgZmlsZS5cbiAgICAgICAgLy8gICAgSW5kaXZpZHVhbCBwYWdlIHNob3VsZCBjb3ZlciBmdWxsIGh0bWwgY29udmVyc2lvbiBwbHVzIHlvdXR1YmUgb3IgZ2xiIFxuXG4gICAgICAgIGNvbnN0IHdvcmtTcmNQYXRoID0gcGF0aC5qb2luKHRoaXMuc3JjUGF0aCwnd29ya3MnKTtcbiAgICAgICAgY29uc3Qgd29ya1RwbEZpbGVQYXRoID0gcGF0aC5qb2luKHRoaXMudHBsUGF0aCwnd29ya3MtdGVtcGxhdGUuaHRtbCcpO1xuICAgICAgICBjb25zdCB3b3JrRHN0RmlsZVBhdGggPSBwYXRoLmpvaW4odGhpcy5kc3RQYXRoLCd3b3Jrcy5odG1sJyk7ICAgICAgICBcblxuICAgICAgICBsZXQgcmVwZWF0ZXJIdG1sQXJyID0gW107XG4gICAgICAgIGxldCB3b3JrSXRlbXM6R2FsbGVyeUl0ZW1bXSA9IFtdO1xuICAgICAgICAvLyBXYWxrIGVhY2ggLm1kIGZpbGVzIGluIHdvcmtzXG4gICAgICAgIGZvciBhd2FpdCAoY29uc3QgbWRmaWxlUGF0aCBvZiB0aGlzLmdldEZpbGVzKHdvcmtTcmNQYXRoKSkge1xuICAgICAgICAgICAgY29uc3QgaHRtbEZpbGVQYXRoID0gbWRmaWxlUGF0aC5yZXBsYWNlKCcubWQnLCcuaHRtbCcpO1xuICAgICAgICAgICAgY29uc3QgY29udGVudHMgPSBhd2FpdCBmcy5wcm9taXNlcy5yZWFkRmlsZShtZGZpbGVQYXRoLCd1dGYtOCcpO1xuICAgICAgICAgICAgLy8gQ2FsY3VsYXRlIHJlbGF0aXZlIHBhdGggLSBmdWxsIHBhdGggbWludXMgd29ya2ZvbGRlci4gXG4gICAgICAgICAgICAvLyB0aGlzIGlzIG5lZWRlZCB0byBwb2ludCB0aHVtYm5haWwgaW1hZ2UgcGF0aCBmcm9tIHRoZSByb290IG9mIHdlYnNpdGUgdG8gd29ya3MvIC4uLiBmb2xkZXJcbiAgICAgICAgICAgIGNvbnN0IGRpcnBhdGggPSBwYXRoLmRpcm5hbWUobWRmaWxlUGF0aCk7XG4gICAgICAgICAgICBjb25zdCByZWxhdGl2ZVNyY0RpclBhdGggPSBkaXJwYXRoLnJlcGxhY2UodGhpcy5zcmNQYXRoLCcnKTtcbiAgICAgICAgICAgIGNvbnN0IHJlbGF0aXZlSHRtbFBhdGggPSBodG1sRmlsZVBhdGgucmVwbGFjZSh0aGlzLnNyY1BhdGgsJycpO1xuXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKHJlbGF0aXZlU3JjRGlyUGF0aCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBuZXcgR2FsbGVyeUl0ZW0oY29udGVudHMsIHJlbGF0aXZlU3JjRGlyUGF0aCwgcmVsYXRpdmVIdG1sUGF0aCk7XG4gICAgICAgICAgICAvLyBURU1QOiB0aGluayBhYm91dCBob3cgdG8gbWFuYWdlIGFsbCBmdWxsIHBhdGggdnMgcmVsYXRpdmUgcGF0aCAoY29udGVudHMgd2lzZSlcbiAgICAgICAgICAgIGl0ZW0uaHRtbEZpbGVQYXRoID0gaHRtbEZpbGVQYXRoO1xuICAgICAgICAgICAgd29ya0l0ZW1zLnB1c2goaXRlbSk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIC8vIExldCdzIHNvcnQhIExvb2sgSW50byBPcmROdW0gZmllbGQgaW4gbWV0YSBkYXRhLiBIaWdoZXIgTnVtYmVyIGdvZXMgdG9wLlxuICAgICAgICB3b3JrSXRlbXMuc29ydCgoYTpHYWxsZXJ5SXRlbSwgYjpHYWxsZXJ5SXRlbSk9PmIub3JkbnVtLWEub3JkbnVtKTtcblxuICAgICAgICBmb3IodmFyIGk9MDsgaTx3b3JrSXRlbXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgY29uc3QgaXRlbSA9IHdvcmtJdGVtc1tpXTtcbiAgICAgICAgICAgIHJlcGVhdGVySHRtbEFyci5wdXNoKGl0ZW0uZ2V0UmVwZWF0ZXJIdG1sKCkpO1xuXG4gICAgICAgICAgICAvLyBFYWNoIE1EIC0+IEhUTUxcbiAgICAgICAgICAgIGxldCBnZW5PdXRwdXRIdG1sID0gZ2VuVGVtcGxhdGVIdG1sLnJlcGxhY2UoLzwhLS0ge3t7Q09OVEVOVH19fSAtLT4vLGl0ZW0uZ2V0SHRtbCgpKTtcbiAgICAgICAgICAgIGdlbk91dHB1dEh0bWwgPSBnZW5PdXRwdXRIdG1sLnJlcGxhY2UoLzwhLS0ge3t7Q09QWVJJR0hUfX19IC0tPi9nLCdcdTAwQTkgQ29weXJpZ2h0ICcrKG5ldyBEYXRlKCkpLmdldEZ1bGxZZWFyKCkrJyAtIEtpaWNoaSBUYWtldWNoaScpO1xuICAgICAgICAgICAgZ2VuT3V0cHV0SHRtbCA9IGdlbk91dHB1dEh0bWwucmVwbGFjZSgvPCEtLSB7e3tDQVRFR09SWX19fSAtLT4vZywnV29ya3MnKTtcbiAgICAgICAgICAgIGdlbk91dHB1dEh0bWwgPSBnZW5PdXRwdXRIdG1sLnJlcGxhY2UoLzwhLS0ge3t7VElUTEV9fX0gLS0+L2csaXRlbS50aXRsZSk7XG4gICAgICAgICAgICBnZW5PdXRwdXRIdG1sID0gZ2VuT3V0cHV0SHRtbC5yZXBsYWNlKC88IS0tIHt7e1NVQlRJVExFfX19IC0tPi9nLGAoJHtpdGVtLmRhdGV9KWApO1xuICAgICAgICAgICAgYXdhaXQgZnMucHJvbWlzZXMud3JpdGVGaWxlKGl0ZW0uaHRtbEZpbGVQYXRoLGdlbk91dHB1dEh0bWwpO1xuICAgICAgICB9ICAgICAgICBcblxuICAgICAgICAvLyB3b3Jrcy5odG1sXG4gICAgICAgIGxldCByZXBlYXRlckh0bWwgPSByZXBlYXRlckh0bWxBcnIuam9pbignXFxuJyk7ICAgICAgICBcbiAgICAgICAgY29uc3QgZ2FsbGVyeVRlbXBsYXRlSHRtbCA9IGF3YWl0IGZzLnByb21pc2VzLnJlYWRGaWxlKHdvcmtUcGxGaWxlUGF0aCwndXRmLTgnKTtcbiAgICAgICAgbGV0IGdhbGxlcnlPdXRwdXRIdG1sID0gZ2FsbGVyeVRlbXBsYXRlSHRtbC5yZXBsYWNlKCc8IS0tIHt7e0dBTExFUll9fX0gLS0+JyxyZXBlYXRlckh0bWwpO1xuICAgICAgICBnYWxsZXJ5T3V0cHV0SHRtbCA9IGdhbGxlcnlPdXRwdXRIdG1sLnJlcGxhY2UoJzwhLS0ge3t7Q09QWVJJR0hUfX19IC0tPicsJ1x1MDBBOSBDb3B5cmlnaHQgJysobmV3IERhdGUoKSkuZ2V0RnVsbFllYXIoKSsnIC0gS2lpY2hpIFRha2V1Y2hpJyk7XG4gICAgICAgIGF3YWl0IGZzLnByb21pc2VzLndyaXRlRmlsZSh3b3JrRHN0RmlsZVBhdGgsZ2FsbGVyeU91dHB1dEh0bWwpO1xuXG4gICAgICAgIC8vY29uc29sZS5sb2cod29ya0RzdEZpbGVQYXRoKVxuXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgICAgICAvLyBBcnRpY2xlc1xuICAgICAgICBjb25zdCBhcnRpY2xlU3JjUGF0aCA9IHBhdGguam9pbih0aGlzLnNyY1BhdGgsJ2FydGljbGVzJyk7XG4gICAgICAgIGNvbnN0IGFydGljbGVUcGxGaWxlUGF0aCA9IHBhdGguam9pbih0aGlzLnRwbFBhdGgsJ2FydGljbGVzLXRlbXBsYXRlLmh0bWwnKTtcbiAgICAgICAgY29uc3QgYXJ0aWNsZURzdEZpbGVQYXRoID0gcGF0aC5qb2luKHRoaXMuZHN0UGF0aCwnYXJ0aWNsZXMuaHRtbCcpO1xuICAgICAgICBsZXQgcmVwZWF0ZXJBcnRpY2xlSHRtbEFyciA9IFtdO1xuICAgICAgICAvLyBXYWxrIGVhY2ggLm1kIGZpbGVzIGluIHdvcmtzXG4gICAgICAgIGZvciBhd2FpdCAoY29uc3QgbWRmaWxlUGF0aCBvZiB0aGlzLmdldEZpbGVzKGFydGljbGVTcmNQYXRoKSkge1xuICAgICAgICAgICAgY29uc3QgaHRtbEZpbGVQYXRoID0gbWRmaWxlUGF0aC5yZXBsYWNlKCcubWQnLCcuaHRtbCcpO1xuICAgICAgICAgICAgY29uc3QgY29udGVudHMgPSBhd2FpdCBmcy5wcm9taXNlcy5yZWFkRmlsZShtZGZpbGVQYXRoLCd1dGYtOCcpO1xuICAgICAgICAgICAgLy8gQ2FsY3VsYXRlIHJlbGF0aXZlIHBhdGggLSBmdWxsIHBhdGggbWludXMgd29ya2ZvbGRlci4gXG4gICAgICAgICAgICAvLyB0aGlzIGlzIG5lZWRlZCB0byBwb2ludCB0aHVtYm5haWwgaW1hZ2UgcGF0aCBmcm9tIHRoZSByb290IG9mIHdlYnNpdGUgdG8gd29ya3MvIC4uLiBmb2xkZXJcbiAgICAgICAgICAgIGNvbnN0IGRpcnBhdGggPSBwYXRoLmRpcm5hbWUobWRmaWxlUGF0aCk7XG4gICAgICAgICAgICBjb25zdCByZWxhdGl2ZVNyY0RpclBhdGggPSBkaXJwYXRoLnJlcGxhY2UodGhpcy5zcmNQYXRoLCcnKTtcbiAgICAgICAgICAgIGNvbnN0IHJlbGF0aXZlSHRtbFBhdGggPSBodG1sRmlsZVBhdGgucmVwbGFjZSh0aGlzLnNyY1BhdGgsJycpO1xuICAgICAgICAgICAgY29uc3QgaXRlbSA9IG5ldyBBcnRpY2xlSXRlbShjb250ZW50cyxyZWxhdGl2ZVNyY0RpclBhdGgsIHJlbGF0aXZlSHRtbFBhdGgpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBCdWlsZCB1cCB0aHVtYm5haWwgaHRtbCByZXBlYXRlclxuICAgICAgICAgICAgaWYgKGl0ZW0udGl0bGUudG9Mb3dlckNhc2UoKS5pbmRleE9mKCcoZHJhZnQpJykgPT09IC0xICYmXG4gICAgICAgICAgICAgICAgaXRlbS50YWdzLnRvTG9jYWxlTG93ZXJDYXNlKCkuaW5kZXhPZignI3VubGlzdGVkJykgPT09IC0xICYmXG4gICAgICAgICAgICAgICAgaXRlbS50YWdzLnRvTG9jYWxlTG93ZXJDYXNlKCkuaW5kZXhPZignI2RyYWZ0JykgPT09IC0xKXtcbiAgICAgICAgICAgICAgICByZXBlYXRlckFydGljbGVIdG1sQXJyLnB1c2goaXRlbS5nZXRSZXBlYXRlckh0bWwoKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEVhY2ggTUQgLT4gSFRNTFxuICAgICAgICAgICAgbGV0IGdlbk91dHB1dEh0bWwgPSBnZW5UZW1wbGF0ZUh0bWwucmVwbGFjZSgvPCEtLSB7e3tDT05URU5UfX19IC0tPi8saXRlbS5nZXRIdG1sKCkpO1xuICAgICAgICAgICAgZ2VuT3V0cHV0SHRtbCA9IGdlbk91dHB1dEh0bWwucmVwbGFjZSgvPCEtLSB7e3tDT1BZUklHSFR9fX0gLS0+L2csJ1x1MDBBOSBDb3B5cmlnaHQgJysobmV3IERhdGUoKSkuZ2V0RnVsbFllYXIoKSsnIC0gS2lpY2hpIFRha2V1Y2hpJyk7XG4gICAgICAgICAgICBnZW5PdXRwdXRIdG1sID0gZ2VuT3V0cHV0SHRtbC5yZXBsYWNlKC88IS0tIHt7e0NBVEVHT1JZfX19IC0tPi9nLCdXb3JrcycpO1xuICAgICAgICAgICAgZ2VuT3V0cHV0SHRtbCA9IGdlbk91dHB1dEh0bWwucmVwbGFjZSgvPCEtLSB7e3tUSVRMRX19fSAtLT4vZyxpdGVtLnRpdGxlKTtcbiAgICAgICAgICAgIGdlbk91dHB1dEh0bWwgPSBnZW5PdXRwdXRIdG1sLnJlcGxhY2UoLzwhLS0ge3t7U1VCVElUTEV9fX0gLS0+L2csYCgke2l0ZW0uZ2V0RGF0ZVN0cigpfSlgKTtcbiAgICAgICAgICAgIC8vZ2VuT3V0cHV0SHRtbCA9IGdlbk91dHB1dEh0bWwucmVwbGFjZSgvPCEtLSB7e3tNRFJBV319fSAtLT4vZyxgJHtnZW5JdGVtLm1kcmF3fWApOyAvLyBodHRwczovL2dpdGh1Yi5jb20vbWFya21hcC9tYXJrbWFwL3RyZWUvbWFzdGVyL3BhY2thZ2VzL21hcmttYXAtYXV0b2xvYWRlclxuICAgICAgICAgICAgYXdhaXQgZnMucHJvbWlzZXMud3JpdGVGaWxlKGh0bWxGaWxlUGF0aCxnZW5PdXRwdXRIdG1sKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGFydGljbGVzLmh0bWxcbiAgICAgICAgY29uc3QgcmVwZWF0ZXJBcnRpY2xlSHRtbCA9IHJlcGVhdGVyQXJ0aWNsZUh0bWxBcnIuam9pbignXFxuJyk7ICAgICAgICBcbiAgICAgICAgY29uc3QgYXJ0aWNsZVRlbXBsYXRlSHRtbCA9IGF3YWl0IGZzLnByb21pc2VzLnJlYWRGaWxlKGFydGljbGVUcGxGaWxlUGF0aCwndXRmLTgnKTtcbiAgICAgICAgbGV0IGFydGljbGVPdXRwdXRIdG1sID0gYXJ0aWNsZVRlbXBsYXRlSHRtbC5yZXBsYWNlKCc8IS0tIHt7e0FSVElDTEVTfX19IC0tPicscmVwZWF0ZXJBcnRpY2xlSHRtbCk7XG4gICAgICAgIGFydGljbGVPdXRwdXRIdG1sID0gYXJ0aWNsZU91dHB1dEh0bWwucmVwbGFjZSgnPCEtLSB7e3tDT1BZUklHSFR9fX0gLS0+JywnXHUwMEE5IENvcHlyaWdodCAnKyhuZXcgRGF0ZSgpKS5nZXRGdWxsWWVhcigpKycgLSBLaWljaGkgVGFrZXVjaGknKTtcbiAgICAgICAgYXdhaXQgZnMucHJvbWlzZXMud3JpdGVGaWxlKGFydGljbGVEc3RGaWxlUGF0aCxhcnRpY2xlT3V0cHV0SHRtbCk7XG5cbiAgICAgICAgXG5cbiAgICAgICAgY29uc29sZS5sb2coXCJFeHBvcnQgRW5kZWQuLi4uXCIpO1xuICAgIH1cblxuICAgIGFzeW5jICpnZXRGaWxlcyhkaXI6c3RyaW5nKTphbnkge1xuICAgICAgICBjb25zdCBkaXJlbnRzID0gYXdhaXQgZnMucHJvbWlzZXMucmVhZGRpcihkaXIsIHsgd2l0aEZpbGVUeXBlczogdHJ1ZSB9KTtcbiAgICAgICAgZm9yIChjb25zdCBkaXJlbnQgb2YgZGlyZW50cykge1xuICAgICAgICAgIGNvbnN0IHJlcyA9IHBhdGgucmVzb2x2ZShkaXIsIGRpcmVudC5uYW1lKTtcbiAgICAgICAgICBpZiAoZGlyZW50LmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgICAgIHlpZWxkKiB0aGlzLmdldEZpbGVzKHJlcyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgaWYoZGlyZW50Lm5hbWUuZW5kc1dpdGgoXCIubWRcIikpe1xuICAgICAgICAgICAgeWllbGQgcmVzO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBlbHNlIHsgLy8gZG8gbm90aGluZyB9IFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgXG59IiwgIi8qXG4gKiBAbGljZW5zZVxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxMS0yMDE0LCBDaHJpc3RvcGhlciBKZWZmcmV5LiAoTUlUIExpY2Vuc2VkKVxuICogaHR0cHM6Ly9naXRodWIuY29tL2NoamovbWFya2VkXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE4LTIwMjEsIFx1MDQxQVx1MDQzRVx1MDQ0MVx1MDQ0Mlx1MDQ0RiBcdTA0MjJcdTA0NDBcdTA0MzVcdTA0NDJcdTA0NEZcdTA0M0EuIChNSVQgTGljZW5zZWQpXG4gKiBodHRwczovL2dpdGh1Yi5jb20vdHMtc3RhY2svbWFya2Rvd25cbiAqL1xuXG5leHBvcnQgY2xhc3MgRXh0ZW5kUmVnZXhwIHtcbiAgcHJpdmF0ZSBzb3VyY2U6IHN0cmluZztcbiAgcHJpdmF0ZSBmbGFnczogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHJlZ2V4OiBSZWdFeHAsIGZsYWdzOiBzdHJpbmcgPSAnJykge1xuICAgIHRoaXMuc291cmNlID0gcmVnZXguc291cmNlO1xuICAgIHRoaXMuZmxhZ3MgPSBmbGFncztcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHRlbmQgcmVndWxhciBleHByZXNzaW9uLlxuICAgKlxuICAgKiBAcGFyYW0gZ3JvdXBOYW1lIFJlZ3VsYXIgZXhwcmVzc2lvbiBmb3Igc2VhcmNoIGEgZ3JvdXAgbmFtZS5cbiAgICogQHBhcmFtIGdyb3VwUmVnZXhwIFJlZ3VsYXIgZXhwcmVzc2lvbiBvZiBuYW1lZCBncm91cC5cbiAgICovXG4gIHNldEdyb3VwKGdyb3VwTmFtZTogUmVnRXhwIHwgc3RyaW5nLCBncm91cFJlZ2V4cDogUmVnRXhwIHwgc3RyaW5nKTogdGhpcyB7XG4gICAgbGV0IG5ld1JlZ2V4cDogc3RyaW5nID0gdHlwZW9mIGdyb3VwUmVnZXhwID09ICdzdHJpbmcnID8gZ3JvdXBSZWdleHAgOiBncm91cFJlZ2V4cC5zb3VyY2U7XG4gICAgbmV3UmVnZXhwID0gbmV3UmVnZXhwLnJlcGxhY2UoLyhefFteXFxbXSlcXF4vZywgJyQxJyk7XG5cbiAgICAvLyBFeHRlbmQgcmVnZXhwLlxuICAgIHRoaXMuc291cmNlID0gdGhpcy5zb3VyY2UucmVwbGFjZShncm91cE5hbWUsIG5ld1JlZ2V4cCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHJlc3VsdCBvZiBleHRlbmRpbmcgYSByZWd1bGFyIGV4cHJlc3Npb24uXG4gICAqL1xuICBnZXRSZWdleHAoKTogUmVnRXhwIHtcbiAgICByZXR1cm4gbmV3IFJlZ0V4cCh0aGlzLnNvdXJjZSwgdGhpcy5mbGFncyk7XG4gIH1cbn1cbiIsICIvKipcbiAqIEBsaWNlbnNlXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDExLTIwMTQsIENocmlzdG9waGVyIEplZmZyZXkuIChNSVQgTGljZW5zZWQpXG4gKiBodHRwczovL2dpdGh1Yi5jb20vY2hqai9tYXJrZWRcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTgtMjAyMSwgXHUwNDFBXHUwNDNFXHUwNDQxXHUwNDQyXHUwNDRGIFx1MDQyMlx1MDQ0MFx1MDQzNVx1MDQ0Mlx1MDQ0Rlx1MDQzQS4gKE1JVCBMaWNlbnNlZClcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS90cy1zdGFjay9tYXJrZG93blxuICovXG5cbmltcG9ydCB7IFJlcGxhY2VtZW50cyB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5cbmNvbnN0IGVzY2FwZVRlc3QgPSAvWyY8PlwiJ10vO1xuY29uc3QgZXNjYXBlUmVwbGFjZSA9IC9bJjw+XCInXS9nO1xuY29uc3QgcmVwbGFjZW1lbnRzOiBSZXBsYWNlbWVudHMgPSB7XG4gICcmJzogJyZhbXA7JyxcbiAgJzwnOiAnJmx0OycsXG4gICc+JzogJyZndDsnLFxuICAnXCInOiAnJnF1b3Q7JyxcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnF1b3RlbWFya1xuICBcIidcIjogJyYjMzk7Jyxcbn07XG5cbmNvbnN0IGVzY2FwZVRlc3ROb0VuY29kZSA9IC9bPD5cIiddfCYoPyEjP1xcdys7KS87XG5jb25zdCBlc2NhcGVSZXBsYWNlTm9FbmNvZGUgPSAvWzw+XCInXXwmKD8hIz9cXHcrOykvZztcblxuZXhwb3J0IGZ1bmN0aW9uIGVzY2FwZShodG1sOiBzdHJpbmcsIGVuY29kZT86IGJvb2xlYW4pIHtcbiAgaWYgKGVuY29kZSkge1xuICAgIGlmIChlc2NhcGVUZXN0LnRlc3QoaHRtbCkpIHtcbiAgICAgIHJldHVybiBodG1sLnJlcGxhY2UoZXNjYXBlUmVwbGFjZSwgKGNoOiBzdHJpbmcpID0+IHJlcGxhY2VtZW50c1tjaF0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoZXNjYXBlVGVzdE5vRW5jb2RlLnRlc3QoaHRtbCkpIHtcbiAgICAgIHJldHVybiBodG1sLnJlcGxhY2UoZXNjYXBlUmVwbGFjZU5vRW5jb2RlLCAoY2g6IHN0cmluZykgPT4gcmVwbGFjZW1lbnRzW2NoXSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGh0bWw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1bmVzY2FwZShodG1sOiBzdHJpbmcpIHtcbiAgLy8gRXhwbGljaXRseSBtYXRjaCBkZWNpbWFsLCBoZXgsIGFuZCBuYW1lZCBIVE1MIGVudGl0aWVzXG4gIHJldHVybiBodG1sLnJlcGxhY2UoLyYoIyg/OlxcZCspfCg/OiN4WzAtOUEtRmEtZl0rKXwoPzpcXHcrKSk7Py9naSwgZnVuY3Rpb24gKF8sIG4pIHtcbiAgICBuID0gbi50b0xvd2VyQ2FzZSgpO1xuXG4gICAgaWYgKG4gPT09ICdjb2xvbicpIHtcbiAgICAgIHJldHVybiAnOic7XG4gICAgfVxuXG4gICAgaWYgKG4uY2hhckF0KDApID09PSAnIycpIHtcbiAgICAgIHJldHVybiBuLmNoYXJBdCgxKSA9PT0gJ3gnXG4gICAgICAgID8gU3RyaW5nLmZyb21DaGFyQ29kZShwYXJzZUludChuLnN1YnN0cmluZygyKSwgMTYpKVxuICAgICAgICA6IFN0cmluZy5mcm9tQ2hhckNvZGUoK24uc3Vic3RyaW5nKDEpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gJyc7XG4gIH0pO1xufVxuIiwgIi8qKlxuICogQGxpY2Vuc2VcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTgtMjAyMSwgXHUwNDFBXHUwNDNFXHUwNDQxXHUwNDQyXHUwNDRGIFx1MDQyMlx1MDQ0MFx1MDQzNVx1MDQ0Mlx1MDQ0Rlx1MDQzQS4gKE1JVCBMaWNlbnNlZClcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS90cy1zdGFjay9tYXJrZG93blxuICovXG5cbmltcG9ydCB7IGVzY2FwZSwgdW5lc2NhcGUgfSBmcm9tICcuL2hlbHBlcnMnO1xuaW1wb3J0IHsgUmVuZGVyZXIgfSBmcm9tICcuL3JlbmRlcmVyJztcblxuZXhwb3J0IGludGVyZmFjZSBPYmoge1xuICBba2V5OiBzdHJpbmddOiBhbnk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUnVsZXNCbG9ja0Jhc2Uge1xuICBuZXdsaW5lOiBSZWdFeHA7XG4gIGNvZGU6IFJlZ0V4cDtcbiAgaHI6IFJlZ0V4cDtcbiAgaGVhZGluZzogUmVnRXhwO1xuICBsaGVhZGluZzogUmVnRXhwO1xuICBibG9ja3F1b3RlOiBSZWdFeHA7XG4gIGxpc3Q6IFJlZ0V4cDtcbiAgaHRtbDogUmVnRXhwO1xuICBkZWY6IFJlZ0V4cDtcbiAgcGFyYWdyYXBoOiBSZWdFeHA7XG4gIHRleHQ6IFJlZ0V4cDtcbiAgYnVsbGV0OiBSZWdFeHA7XG4gIC8qKlxuICAgKiBMaXN0IGl0ZW0gKDxsaT4pLlxuICAgKi9cbiAgaXRlbTogUmVnRXhwO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJ1bGVzQmxvY2tHZm0gZXh0ZW5kcyBSdWxlc0Jsb2NrQmFzZSB7XG4gIGZlbmNlczogUmVnRXhwO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJ1bGVzQmxvY2tUYWJsZXMgZXh0ZW5kcyBSdWxlc0Jsb2NrR2ZtIHtcbiAgbnB0YWJsZTogUmVnRXhwO1xuICB0YWJsZTogUmVnRXhwO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIExpbmsge1xuICBocmVmOiBzdHJpbmc7XG4gIHRpdGxlOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGlua3Mge1xuICBba2V5OiBzdHJpbmddOiBMaW5rO1xufVxuXG5leHBvcnQgZW51bSBUb2tlblR5cGUge1xuICBzcGFjZSA9IDEsXG4gIHRleHQsXG4gIHBhcmFncmFwaCxcbiAgaGVhZGluZyxcbiAgbGlzdFN0YXJ0LFxuICBsaXN0RW5kLFxuICBsb29zZUl0ZW1TdGFydCxcbiAgbG9vc2VJdGVtRW5kLFxuICBsaXN0SXRlbVN0YXJ0LFxuICBsaXN0SXRlbUVuZCxcbiAgYmxvY2txdW90ZVN0YXJ0LFxuICBibG9ja3F1b3RlRW5kLFxuICBjb2RlLFxuICB0YWJsZSxcbiAgaHRtbCxcbiAgaHJcbn1cblxuZXhwb3J0IHR5cGUgQWxpZ24gPSAnY2VudGVyJyB8ICdsZWZ0JyB8ICdyaWdodCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVG9rZW4ge1xuICB0eXBlOiBudW1iZXIgfCBzdHJpbmc7XG4gIHRleHQ/OiBzdHJpbmc7XG4gIGxhbmc/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBNZXRhZGF0YSBvZiBnZm0gY29kZS5cbiAgICovXG4gIG1ldGE/OiBzdHJpbmc7XG4gIGRlcHRoPzogbnVtYmVyO1xuICBoZWFkZXI/OiBzdHJpbmdbXTtcbiAgYWxpZ24/OiBBbGlnbltdO1xuICBjZWxscz86IHN0cmluZ1tdW107XG4gIG9yZGVyZWQ/OiBib29sZWFuO1xuICBwcmU/OiBib29sZWFuO1xuICBlc2NhcGVkPzogYm9vbGVhbjtcbiAgZXhlY0Fycj86IFJlZ0V4cEV4ZWNBcnJheTtcbiAgLyoqXG4gICAqIFVzZWQgZm9yIGRlYnVnZ2luZy4gSWRlbnRpZmllcyB0aGUgbGluZSBudW1iZXIgaW4gdGhlIHJlc3VsdGluZyBIVE1MIGZpbGUuXG4gICAqL1xuICBsaW5lPzogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJ1bGVzSW5saW5lQmFzZSB7XG4gIGVzY2FwZTogUmVnRXhwO1xuICBhdXRvbGluazogUmVnRXhwO1xuICB0YWc6IFJlZ0V4cDtcbiAgbGluazogUmVnRXhwO1xuICByZWZsaW5rOiBSZWdFeHA7XG4gIG5vbGluazogUmVnRXhwO1xuICBzdHJvbmc6IFJlZ0V4cDtcbiAgZW06IFJlZ0V4cDtcbiAgY29kZTogUmVnRXhwO1xuICBicjogUmVnRXhwO1xuICB0ZXh0OiBSZWdFeHA7XG4gIF9pbnNpZGU6IFJlZ0V4cDtcbiAgX2hyZWY6IFJlZ0V4cDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSdWxlc0lubGluZVBlZGFudGljIGV4dGVuZHMgUnVsZXNJbmxpbmVCYXNlIHt9XG5cbi8qKlxuICogR0ZNIElubGluZSBHcmFtbWFyXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUnVsZXNJbmxpbmVHZm0gZXh0ZW5kcyBSdWxlc0lubGluZUJhc2Uge1xuICB1cmw6IFJlZ0V4cDtcbiAgZGVsOiBSZWdFeHA7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUnVsZXNJbmxpbmVCcmVha3MgZXh0ZW5kcyBSdWxlc0lubGluZUdmbSB7fVxuXG5leHBvcnQgY2xhc3MgTWFya2VkT3B0aW9ucyB7XG4gIGdmbT86IGJvb2xlYW4gPSB0cnVlO1xuICB0YWJsZXM/OiBib29sZWFuID0gdHJ1ZTtcbiAgYnJlYWtzPzogYm9vbGVhbiA9IGZhbHNlO1xuICBwZWRhbnRpYz86IGJvb2xlYW4gPSBmYWxzZTtcbiAgc2FuaXRpemU/OiBib29sZWFuID0gZmFsc2U7XG4gIHNhbml0aXplcj86ICh0ZXh0OiBzdHJpbmcpID0+IHN0cmluZztcbiAgbWFuZ2xlPzogYm9vbGVhbiA9IHRydWU7XG4gIHNtYXJ0TGlzdHM/OiBib29sZWFuID0gZmFsc2U7XG4gIHNpbGVudD86IGJvb2xlYW4gPSBmYWxzZTtcbiAgLyoqXG4gICAqIEBwYXJhbSBjb2RlIFRoZSBzZWN0aW9uIG9mIGNvZGUgdG8gcGFzcyB0byB0aGUgaGlnaGxpZ2h0ZXIuXG4gICAqIEBwYXJhbSBsYW5nIFRoZSBwcm9ncmFtbWluZyBsYW5ndWFnZSBzcGVjaWZpZWQgaW4gdGhlIGNvZGUgYmxvY2suXG4gICAqL1xuICBoaWdobGlnaHQ/OiAoY29kZTogc3RyaW5nLCBsYW5nPzogc3RyaW5nKSA9PiBzdHJpbmc7XG4gIGxhbmdQcmVmaXg/OiBzdHJpbmcgPSAnbGFuZy0nO1xuICBzbWFydHlwYW50cz86IGJvb2xlYW4gPSBmYWxzZTtcbiAgaGVhZGVyUHJlZml4Pzogc3RyaW5nID0gJyc7XG4gIC8qKlxuICAgKiBBbiBvYmplY3QgY29udGFpbmluZyBmdW5jdGlvbnMgdG8gcmVuZGVyIHRva2VucyB0byBIVE1MLiBEZWZhdWx0OiBgbmV3IFJlbmRlcmVyKClgXG4gICAqL1xuICByZW5kZXJlcj86IFJlbmRlcmVyO1xuICAvKipcbiAgICogU2VsZi1jbG9zZSB0aGUgdGFncyBmb3Igdm9pZCBlbGVtZW50cyAoJmx0O2JyLyZndDssICZsdDtpbWcvJmd0OywgZXRjLilcbiAgICogd2l0aCBhIFwiL1wiIGFzIHJlcXVpcmVkIGJ5IFhIVE1MLlxuICAgKi9cbiAgeGh0bWw/OiBib29sZWFuID0gZmFsc2U7XG4gIC8qKlxuICAgKiBUaGUgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIHVzaW5nIHRvIGVzY2FwZSBIVE1MIGVudGl0aWVzLlxuICAgKiBCeSBkZWZhdWx0IHVzaW5nIGlubmVyIGhlbHBlci5cbiAgICovXG4gIGVzY2FwZT86IChodG1sOiBzdHJpbmcsIGVuY29kZT86IGJvb2xlYW4pID0+IHN0cmluZyA9IGVzY2FwZTtcbiAgLyoqXG4gICAqIFRoZSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgdXNpbmcgdG8gdW5lc2NhcGUgSFRNTCBlbnRpdGllcy5cbiAgICogQnkgZGVmYXVsdCB1c2luZyBpbm5lciBoZWxwZXIuXG4gICAqL1xuICB1bmVzY2FwZT86IChodG1sOiBzdHJpbmcpID0+IHN0cmluZyA9IHVuZXNjYXBlO1xuICAvKipcbiAgICogSWYgc2V0IHRvIGB0cnVlYCwgYW4gaW5saW5lIHRleHQgd2lsbCBub3QgYmUgdGFrZW4gaW4gcGFyYWdyYXBoLlxuICAgKlxuICAgKiBgYGB0c1xuICAgKiAvLyBpc05vUCA9PSBmYWxzZVxuICAgKiBNYXJrZWQucGFyc2UoJ3NvbWUgdGV4dCcpOyAvLyByZXR1cm5zICc8cD5zb21lIHRleHQ8L3A+J1xuICAgKlxuICAgKiBNYXJrZWQuc2V0T3B0aW9ucyh7aXNOb1A6IHRydWV9KTtcbiAgICpcbiAgICogTWFya2VkLnBhcnNlKCdzb21lIHRleHQnKTsgLy8gcmV0dXJucyAnc29tZSB0ZXh0J1xuICAgKiBgYGBcbiAgICovXG4gIGlzTm9QPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBMZXhlclJldHVybnMge1xuICB0b2tlbnM6IFRva2VuW107XG4gIGxpbmtzOiBMaW5rcztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBEZWJ1Z1JldHVybnMgZXh0ZW5kcyBMZXhlclJldHVybnMge1xuICByZXN1bHQ6IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSZXBsYWNlbWVudHMge1xuICBba2V5OiBzdHJpbmddOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUnVsZXNJbmxpbmVDYWxsYmFjayB7XG4gIHJlZ2V4cD86IFJlZ0V4cDtcbiAgY29uZGl0aW9uKCk6IFJlZ0V4cDtcbiAgdG9rZW5pemUoZXhlY0FycjogUmVnRXhwRXhlY0FycmF5KTogdm9pZDtcbn1cblxuZXhwb3J0IHR5cGUgU2ltcGxlUmVuZGVyZXIgPSAoZXhlY0Fycj86IFJlZ0V4cEV4ZWNBcnJheSkgPT4gc3RyaW5nO1xuIiwgIi8qKlxuICogQGxpY2Vuc2VcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTEtMjAxNCwgQ2hyaXN0b3BoZXIgSmVmZnJleS4gKE1JVCBMaWNlbnNlZClcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9jaGpqL21hcmtlZFxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxOC0yMDIxLCBcdTA0MUFcdTA0M0VcdTA0NDFcdTA0NDJcdTA0NEYgXHUwNDIyXHUwNDQwXHUwNDM1XHUwNDQyXHUwNDRGXHUwNDNBLiAoTUlUIExpY2Vuc2VkKVxuICogaHR0cHM6Ly9naXRodWIuY29tL3RzLXN0YWNrL21hcmtkb3duXG4gKi9cblxuaW1wb3J0IHsgQWxpZ24sIE1hcmtlZE9wdGlvbnMgfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgTWFya2VkIH0gZnJvbSAnLi9tYXJrZWQnO1xuXG5leHBvcnQgY2xhc3MgUmVuZGVyZXIge1xuICBwcm90ZWN0ZWQgb3B0aW9uczogTWFya2VkT3B0aW9ucztcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zPzogTWFya2VkT3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgfHwgTWFya2VkLm9wdGlvbnM7XG4gIH1cblxuICBjb2RlKGNvZGU6IHN0cmluZywgbGFuZz86IHN0cmluZywgZXNjYXBlZD86IGJvb2xlYW4sIG1ldGE/OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuaGlnaGxpZ2h0KSB7XG4gICAgICBjb25zdCBvdXQgPSB0aGlzLm9wdGlvbnMuaGlnaGxpZ2h0KGNvZGUsIGxhbmcpO1xuXG4gICAgICBpZiAob3V0ICE9IG51bGwgJiYgb3V0ICE9PSBjb2RlKSB7XG4gICAgICAgIGVzY2FwZWQgPSB0cnVlO1xuICAgICAgICBjb2RlID0gb3V0O1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGVzY2FwZWRDb2RlID0gKGVzY2FwZWQgPyBjb2RlIDogdGhpcy5vcHRpb25zLmVzY2FwZShjb2RlLCB0cnVlKSk7XG5cbiAgICBpZiAoIWxhbmcpIHtcbiAgICAgIHJldHVybiBgXFxuPHByZT48Y29kZT4ke2VzY2FwZWRDb2RlfVxcbjwvY29kZT48L3ByZT5cXG5gO1xuICAgIH1cblxuICAgIGNvbnN0IGNsYXNzTmFtZSA9IHRoaXMub3B0aW9ucy5sYW5nUHJlZml4ICsgdGhpcy5vcHRpb25zLmVzY2FwZShsYW5nLCB0cnVlKTtcbiAgICByZXR1cm4gYFxcbjxwcmU+PGNvZGUgY2xhc3M9XCIke2NsYXNzTmFtZX1cIj4ke2VzY2FwZWRDb2RlfVxcbjwvY29kZT48L3ByZT5cXG5gO1xuICB9XG5cbiAgYmxvY2txdW90ZShxdW90ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYDxibG9ja3F1b3RlPlxcbiR7cXVvdGV9PC9ibG9ja3F1b3RlPlxcbmA7XG4gIH1cblxuICBodG1sKGh0bWw6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGh0bWw7XG4gIH1cblxuICBoZWFkaW5nKHRleHQ6IHN0cmluZywgbGV2ZWw6IG51bWJlciwgcmF3OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IGlkOiBzdHJpbmcgPSB0aGlzLm9wdGlvbnMuaGVhZGVyUHJlZml4ICsgcmF3LnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvW15cXHddKy9nLCAnLScpO1xuXG4gICAgcmV0dXJuIGA8aCR7bGV2ZWx9IGlkPVwiJHtpZH1cIj4ke3RleHR9PC9oJHtsZXZlbH0+XFxuYDtcbiAgfVxuXG4gIGhyKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy54aHRtbCA/ICc8aHIvPlxcbicgOiAnPGhyPlxcbic7XG4gIH1cblxuICBsaXN0KGJvZHk6IHN0cmluZywgb3JkZXJlZD86IGJvb2xlYW4pOiBzdHJpbmcge1xuICAgIGNvbnN0IHR5cGUgPSBvcmRlcmVkID8gJ29sJyA6ICd1bCc7XG5cbiAgICByZXR1cm4gYFxcbjwke3R5cGV9PlxcbiR7Ym9keX08LyR7dHlwZX0+XFxuYDtcbiAgfVxuXG4gIGxpc3RpdGVtKHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuICc8bGk+JyArIHRleHQgKyAnPC9saT5cXG4nO1xuICB9XG5cbiAgcGFyYWdyYXBoKHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuICc8cD4nICsgdGV4dCArICc8L3A+XFxuJztcbiAgfVxuXG4gIHRhYmxlKGhlYWRlcjogc3RyaW5nLCBib2R5OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBgXG48dGFibGU+XG48dGhlYWQ+XG4ke2hlYWRlcn08L3RoZWFkPlxuPHRib2R5PlxuJHtib2R5fTwvdGJvZHk+XG48L3RhYmxlPlxuYDtcbiAgfVxuXG4gIHRhYmxlcm93KGNvbnRlbnQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuICc8dHI+XFxuJyArIGNvbnRlbnQgKyAnPC90cj5cXG4nO1xuICB9XG5cbiAgdGFibGVjZWxsKGNvbnRlbnQ6IHN0cmluZywgZmxhZ3M6IHsgaGVhZGVyPzogYm9vbGVhbjsgYWxpZ24/OiBBbGlnbiB9KTogc3RyaW5nIHtcbiAgICBjb25zdCB0eXBlID0gZmxhZ3MuaGVhZGVyID8gJ3RoJyA6ICd0ZCc7XG4gICAgY29uc3QgdGFnID0gZmxhZ3MuYWxpZ24gPyAnPCcgKyB0eXBlICsgJyBzdHlsZT1cInRleHQtYWxpZ246JyArIGZsYWdzLmFsaWduICsgJ1wiPicgOiAnPCcgKyB0eXBlICsgJz4nO1xuICAgIHJldHVybiB0YWcgKyBjb250ZW50ICsgJzwvJyArIHR5cGUgKyAnPlxcbic7XG4gIH1cblxuICAvLyAqKiogSW5saW5lIGxldmVsIHJlbmRlcmVyIG1ldGhvZHMuICoqKlxuXG4gIHN0cm9uZyh0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiAnPHN0cm9uZz4nICsgdGV4dCArICc8L3N0cm9uZz4nO1xuICB9XG5cbiAgZW0odGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gJzxlbT4nICsgdGV4dCArICc8L2VtPic7XG4gIH1cblxuICBjb2Rlc3Bhbih0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiAnPGNvZGU+JyArIHRleHQgKyAnPC9jb2RlPic7XG4gIH1cblxuICBicigpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLm9wdGlvbnMueGh0bWwgPyAnPGJyLz4nIDogJzxicj4nO1xuICB9XG5cbiAgZGVsKHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuICc8ZGVsPicgKyB0ZXh0ICsgJzwvZGVsPic7XG4gIH1cblxuICBsaW5rKGhyZWY6IHN0cmluZywgdGl0bGU6IHN0cmluZywgdGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLnNhbml0aXplKSB7XG4gICAgICBsZXQgcHJvdDogc3RyaW5nO1xuXG4gICAgICB0cnkge1xuICAgICAgICBwcm90ID0gZGVjb2RlVVJJQ29tcG9uZW50KHRoaXMub3B0aW9ucy51bmVzY2FwZShocmVmKSlcbiAgICAgICAgICAucmVwbGFjZSgvW15cXHc6XS9nLCAnJylcbiAgICAgICAgICAudG9Mb3dlckNhc2UoKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcm90LmluZGV4T2YoJ2phdmFzY3JpcHQ6JykgPT09IDAgfHwgcHJvdC5pbmRleE9mKCd2YnNjcmlwdDonKSA9PT0gMCB8fCBwcm90LmluZGV4T2YoJ2RhdGE6JykgPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IG91dCA9ICc8YSBocmVmPVwiJyArIGhyZWYgKyAnXCInO1xuXG4gICAgaWYgKHRpdGxlKSB7XG4gICAgICBvdXQgKz0gJyB0aXRsZT1cIicgKyB0aXRsZSArICdcIic7XG4gICAgfVxuXG4gICAgb3V0ICs9ICc+JyArIHRleHQgKyAnPC9hPic7XG5cbiAgICByZXR1cm4gb3V0O1xuICB9XG5cbiAgaW1hZ2UoaHJlZjogc3RyaW5nLCB0aXRsZTogc3RyaW5nLCB0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGxldCBvdXQgPSAnPGltZyBzcmM9XCInICsgaHJlZiArICdcIiBhbHQ9XCInICsgdGV4dCArICdcIic7XG5cbiAgICBpZiAodGl0bGUpIHtcbiAgICAgIG91dCArPSAnIHRpdGxlPVwiJyArIHRpdGxlICsgJ1wiJztcbiAgICB9XG5cbiAgICBvdXQgKz0gdGhpcy5vcHRpb25zLnhodG1sID8gJy8+JyA6ICc+JztcblxuICAgIHJldHVybiBvdXQ7XG4gIH1cblxuICB0ZXh0KHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRleHQ7XG4gIH1cbn1cbiIsICIvKipcbiAqIEBsaWNlbnNlXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDExLTIwMTQsIENocmlzdG9waGVyIEplZmZyZXkuIChNSVQgTGljZW5zZWQpXG4gKiBodHRwczovL2dpdGh1Yi5jb20vY2hqai9tYXJrZWRcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTgtMjAyMSwgXHUwNDFBXHUwNDNFXHUwNDQxXHUwNDQyXHUwNDRGIFx1MDQyMlx1MDQ0MFx1MDQzNVx1MDQ0Mlx1MDQ0Rlx1MDQzQS4gKE1JVCBMaWNlbnNlZClcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS90cy1zdGFjay9tYXJrZG93blxuICovXG5cbmltcG9ydCB7IEV4dGVuZFJlZ2V4cCB9IGZyb20gJy4vZXh0ZW5kLXJlZ2V4cCc7XG5pbXBvcnQge1xuICBMaW5rLFxuICBMaW5rcyxcbiAgTWFya2VkT3B0aW9ucyxcbiAgUnVsZXNJbmxpbmVCYXNlLFxuICBSdWxlc0lubGluZUJyZWFrcyxcbiAgUnVsZXNJbmxpbmVDYWxsYmFjayxcbiAgUnVsZXNJbmxpbmVHZm0sXG4gIFJ1bGVzSW5saW5lUGVkYW50aWMsXG59IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBNYXJrZWQgfSBmcm9tICcuL21hcmtlZCc7XG5pbXBvcnQgeyBSZW5kZXJlciB9IGZyb20gJy4vcmVuZGVyZXInO1xuXG4vKipcbiAqIElubGluZSBMZXhlciAmIENvbXBpbGVyLlxuICovXG5leHBvcnQgY2xhc3MgSW5saW5lTGV4ZXIge1xuICBwcm90ZWN0ZWQgc3RhdGljIHJ1bGVzQmFzZTogUnVsZXNJbmxpbmVCYXNlID0gbnVsbDtcbiAgLyoqXG4gICAqIFBlZGFudGljIElubGluZSBHcmFtbWFyLlxuICAgKi9cbiAgcHJvdGVjdGVkIHN0YXRpYyBydWxlc1BlZGFudGljOiBSdWxlc0lubGluZVBlZGFudGljID0gbnVsbDtcbiAgLyoqXG4gICAqIEdGTSBJbmxpbmUgR3JhbW1hclxuICAgKi9cbiAgcHJvdGVjdGVkIHN0YXRpYyBydWxlc0dmbTogUnVsZXNJbmxpbmVHZm0gPSBudWxsO1xuICAvKipcbiAgICogR0ZNICsgTGluZSBCcmVha3MgSW5saW5lIEdyYW1tYXIuXG4gICAqL1xuICBwcm90ZWN0ZWQgc3RhdGljIHJ1bGVzQnJlYWtzOiBSdWxlc0lubGluZUJyZWFrcyA9IG51bGw7XG4gIHByb3RlY3RlZCBydWxlczogUnVsZXNJbmxpbmVCYXNlIHwgUnVsZXNJbmxpbmVQZWRhbnRpYyB8IFJ1bGVzSW5saW5lR2ZtIHwgUnVsZXNJbmxpbmVCcmVha3M7XG4gIHByb3RlY3RlZCByZW5kZXJlcjogUmVuZGVyZXI7XG4gIHByb3RlY3RlZCBpbkxpbms6IGJvb2xlYW47XG4gIHByb3RlY3RlZCBoYXNSdWxlc0dmbTogYm9vbGVhbjtcbiAgcHJvdGVjdGVkIHJ1bGVDYWxsYmFja3M6IFJ1bGVzSW5saW5lQ2FsbGJhY2tbXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgc3RhdGljVGhpczogdHlwZW9mIElubGluZUxleGVyLFxuICAgIHByb3RlY3RlZCBsaW5rczogTGlua3MsXG4gICAgcHJvdGVjdGVkIG9wdGlvbnM6IE1hcmtlZE9wdGlvbnMgPSBNYXJrZWQub3B0aW9ucyxcbiAgICByZW5kZXJlcj86IFJlbmRlcmVyXG4gICkge1xuICAgIHRoaXMucmVuZGVyZXIgPSByZW5kZXJlciB8fCB0aGlzLm9wdGlvbnMucmVuZGVyZXIgfHwgbmV3IFJlbmRlcmVyKHRoaXMub3B0aW9ucyk7XG5cbiAgICBpZiAoIXRoaXMubGlua3MpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW5saW5lTGV4ZXIgcmVxdWlyZXMgJ2xpbmtzJyBwYXJhbWV0ZXIuYCk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRSdWxlcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXRpYyBMZXhpbmcvQ29tcGlsaW5nIE1ldGhvZC5cbiAgICovXG4gIHN0YXRpYyBvdXRwdXQoc3JjOiBzdHJpbmcsIGxpbmtzOiBMaW5rcywgb3B0aW9uczogTWFya2VkT3B0aW9ucyk6IHN0cmluZyB7XG4gICAgY29uc3QgaW5saW5lTGV4ZXIgPSBuZXcgdGhpcyh0aGlzLCBsaW5rcywgb3B0aW9ucyk7XG4gICAgcmV0dXJuIGlubGluZUxleGVyLm91dHB1dChzcmMpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHN0YXRpYyBnZXRSdWxlc0Jhc2UoKTogUnVsZXNJbmxpbmVCYXNlIHtcbiAgICBpZiAodGhpcy5ydWxlc0Jhc2UpIHtcbiAgICAgIHJldHVybiB0aGlzLnJ1bGVzQmFzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbmxpbmUtTGV2ZWwgR3JhbW1hci5cbiAgICAgKi9cbiAgICBjb25zdCBiYXNlOiBSdWxlc0lubGluZUJhc2UgPSB7XG4gICAgICBlc2NhcGU6IC9eXFxcXChbXFxcXGAqe31cXFtcXF0oKSMrXFwtLiFfPl0pLyxcbiAgICAgIGF1dG9saW5rOiAvXjwoW14gPD5dKyhAfDpcXC8pW14gPD5dKyk+LyxcbiAgICAgIHRhZzogL148IS0tW1xcc1xcU10qPy0tPnxePFxcLz9cXHcrKD86XCJbXlwiXSpcInwnW14nXSonfFtePCdcIj5dKSo/Pi8sXG4gICAgICBsaW5rOiAvXiE/XFxbKGluc2lkZSlcXF1cXChocmVmXFwpLyxcbiAgICAgIHJlZmxpbms6IC9eIT9cXFsoaW5zaWRlKVxcXVxccypcXFsoW15cXF1dKilcXF0vLFxuICAgICAgbm9saW5rOiAvXiE/XFxbKCg/OlxcW1teXFxdXSpcXF18W15cXFtcXF1dKSopXFxdLyxcbiAgICAgIHN0cm9uZzogL15fXyhbXFxzXFxTXSs/KV9fKD8hXyl8XlxcKlxcKihbXFxzXFxTXSs/KVxcKlxcKig/IVxcKikvLFxuICAgICAgZW06IC9eXFxiXygoPzpbXl9dfF9fKSs/KV9cXGJ8XlxcKigoPzpcXCpcXCp8W1xcc1xcU10pKz8pXFwqKD8hXFwqKS8sXG4gICAgICBjb2RlOiAvXihgKykoW1xcc1xcU10qP1teYF0pXFwxKD8hYCkvLFxuICAgICAgYnI6IC9eIHsyLH1cXG4oPyFcXHMqJCkvLFxuICAgICAgdGV4dDogL15bXFxzXFxTXSs/KD89W1xcXFw8IVxcW18qYF18IHsyLH1cXG58JCkvLFxuICAgICAgX2luc2lkZTogLyg/OlxcW1teXFxdXSpcXF18W15cXFtcXF1dfFxcXSg/PVteXFxbXSpcXF0pKSovLFxuICAgICAgX2hyZWY6IC9cXHMqPD8oW1xcc1xcU10qPyk+Pyg/OlxccytbJ1wiXShbXFxzXFxTXSo/KVsnXCJdKT9cXHMqLyxcbiAgICB9O1xuXG4gICAgYmFzZS5saW5rID0gbmV3IEV4dGVuZFJlZ2V4cChiYXNlLmxpbmspLnNldEdyb3VwKCdpbnNpZGUnLCBiYXNlLl9pbnNpZGUpLnNldEdyb3VwKCdocmVmJywgYmFzZS5faHJlZikuZ2V0UmVnZXhwKCk7XG5cbiAgICBiYXNlLnJlZmxpbmsgPSBuZXcgRXh0ZW5kUmVnZXhwKGJhc2UucmVmbGluaykuc2V0R3JvdXAoJ2luc2lkZScsIGJhc2UuX2luc2lkZSkuZ2V0UmVnZXhwKCk7XG5cbiAgICByZXR1cm4gKHRoaXMucnVsZXNCYXNlID0gYmFzZSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgc3RhdGljIGdldFJ1bGVzUGVkYW50aWMoKTogUnVsZXNJbmxpbmVQZWRhbnRpYyB7XG4gICAgaWYgKHRoaXMucnVsZXNQZWRhbnRpYykge1xuICAgICAgcmV0dXJuIHRoaXMucnVsZXNQZWRhbnRpYztcbiAgICB9XG5cbiAgICByZXR1cm4gKHRoaXMucnVsZXNQZWRhbnRpYyA9IHtcbiAgICAgIC4uLnRoaXMuZ2V0UnVsZXNCYXNlKCksXG4gICAgICAuLi57XG4gICAgICAgIHN0cm9uZzogL15fXyg/PVxcUykoW1xcc1xcU10qP1xcUylfXyg/IV8pfF5cXCpcXCooPz1cXFMpKFtcXHNcXFNdKj9cXFMpXFwqXFwqKD8hXFwqKS8sXG4gICAgICAgIGVtOiAvXl8oPz1cXFMpKFtcXHNcXFNdKj9cXFMpXyg/IV8pfF5cXCooPz1cXFMpKFtcXHNcXFNdKj9cXFMpXFwqKD8hXFwqKS8sXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIHN0YXRpYyBnZXRSdWxlc0dmbSgpOiBSdWxlc0lubGluZUdmbSB7XG4gICAgaWYgKHRoaXMucnVsZXNHZm0pIHtcbiAgICAgIHJldHVybiB0aGlzLnJ1bGVzR2ZtO1xuICAgIH1cblxuICAgIGNvbnN0IGJhc2UgPSB0aGlzLmdldFJ1bGVzQmFzZSgpO1xuXG4gICAgY29uc3QgZXNjYXBlID0gbmV3IEV4dGVuZFJlZ2V4cChiYXNlLmVzY2FwZSkuc2V0R3JvdXAoJ10pJywgJ358XSknKS5nZXRSZWdleHAoKTtcblxuICAgIGNvbnN0IHRleHQgPSBuZXcgRXh0ZW5kUmVnZXhwKGJhc2UudGV4dCkuc2V0R3JvdXAoJ118JywgJ35dfCcpLnNldEdyb3VwKCd8JywgJ3xodHRwcz86Ly98JykuZ2V0UmVnZXhwKCk7XG5cbiAgICByZXR1cm4gKHRoaXMucnVsZXNHZm0gPSB7XG4gICAgICAuLi5iYXNlLFxuICAgICAgLi4ue1xuICAgICAgICBlc2NhcGUsXG4gICAgICAgIHVybDogL14oaHR0cHM/OlxcL1xcL1teXFxzPF0rW148Liw6O1wiJylcXF1cXHNdKS8sXG4gICAgICAgIGRlbDogL15+fig/PVxcUykoW1xcc1xcU10qP1xcUyl+fi8sXG4gICAgICAgIHRleHQsXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIHN0YXRpYyBnZXRSdWxlc0JyZWFrcygpOiBSdWxlc0lubGluZUJyZWFrcyB7XG4gICAgaWYgKHRoaXMucnVsZXNCcmVha3MpIHtcbiAgICAgIHJldHVybiB0aGlzLnJ1bGVzQnJlYWtzO1xuICAgIH1cblxuICAgIGNvbnN0IGlubGluZSA9IHRoaXMuZ2V0UnVsZXNHZm0oKTtcbiAgICBjb25zdCBnZm0gPSB0aGlzLmdldFJ1bGVzR2ZtKCk7XG5cbiAgICByZXR1cm4gKHRoaXMucnVsZXNCcmVha3MgPSB7XG4gICAgICAuLi5nZm0sXG4gICAgICAuLi57XG4gICAgICAgIGJyOiBuZXcgRXh0ZW5kUmVnZXhwKGlubGluZS5icikuc2V0R3JvdXAoJ3syLH0nLCAnKicpLmdldFJlZ2V4cCgpLFxuICAgICAgICB0ZXh0OiBuZXcgRXh0ZW5kUmVnZXhwKGdmbS50ZXh0KS5zZXRHcm91cCgnezIsfScsICcqJykuZ2V0UmVnZXhwKCksXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIHNldFJ1bGVzKCkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuZ2ZtKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmJyZWFrcykge1xuICAgICAgICB0aGlzLnJ1bGVzID0gdGhpcy5zdGF0aWNUaGlzLmdldFJ1bGVzQnJlYWtzKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJ1bGVzID0gdGhpcy5zdGF0aWNUaGlzLmdldFJ1bGVzR2ZtKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMucGVkYW50aWMpIHtcbiAgICAgIHRoaXMucnVsZXMgPSB0aGlzLnN0YXRpY1RoaXMuZ2V0UnVsZXNQZWRhbnRpYygpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJ1bGVzID0gdGhpcy5zdGF0aWNUaGlzLmdldFJ1bGVzQmFzZSgpO1xuICAgIH1cblxuICAgIHRoaXMuaGFzUnVsZXNHZm0gPSAodGhpcy5ydWxlcyBhcyBSdWxlc0lubGluZUdmbSkudXJsICE9PSB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogTGV4aW5nL0NvbXBpbGluZy5cbiAgICovXG4gIG91dHB1dChuZXh0UGFydDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBuZXh0UGFydCA9IG5leHRQYXJ0O1xuICAgIGxldCBleGVjQXJyOiBSZWdFeHBFeGVjQXJyYXk7XG4gICAgbGV0IG91dCA9ICcnO1xuXG4gICAgd2hpbGUgKG5leHRQYXJ0KSB7XG4gICAgICAvLyBlc2NhcGVcbiAgICAgIGlmICgoZXhlY0FyciA9IHRoaXMucnVsZXMuZXNjYXBlLmV4ZWMobmV4dFBhcnQpKSkge1xuICAgICAgICBuZXh0UGFydCA9IG5leHRQYXJ0LnN1YnN0cmluZyhleGVjQXJyWzBdLmxlbmd0aCk7XG4gICAgICAgIG91dCArPSBleGVjQXJyWzFdO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gYXV0b2xpbmtcbiAgICAgIGlmICgoZXhlY0FyciA9IHRoaXMucnVsZXMuYXV0b2xpbmsuZXhlYyhuZXh0UGFydCkpKSB7XG4gICAgICAgIGxldCB0ZXh0OiBzdHJpbmc7XG4gICAgICAgIGxldCBocmVmOiBzdHJpbmc7XG4gICAgICAgIG5leHRQYXJ0ID0gbmV4dFBhcnQuc3Vic3RyaW5nKGV4ZWNBcnJbMF0ubGVuZ3RoKTtcblxuICAgICAgICBpZiAoZXhlY0FyclsyXSA9PT0gJ0AnKSB7XG4gICAgICAgICAgdGV4dCA9IHRoaXMub3B0aW9ucy5lc2NhcGUoXG4gICAgICAgICAgICBleGVjQXJyWzFdLmNoYXJBdCg2KSA9PT0gJzonID8gdGhpcy5tYW5nbGUoZXhlY0FyclsxXS5zdWJzdHJpbmcoNykpIDogdGhpcy5tYW5nbGUoZXhlY0FyclsxXSlcbiAgICAgICAgICApO1xuICAgICAgICAgIGhyZWYgPSB0aGlzLm1hbmdsZSgnbWFpbHRvOicpICsgdGV4dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0ZXh0ID0gdGhpcy5vcHRpb25zLmVzY2FwZShleGVjQXJyWzFdKTtcbiAgICAgICAgICBocmVmID0gdGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIG91dCArPSB0aGlzLnJlbmRlcmVyLmxpbmsoaHJlZiwgbnVsbCwgdGV4dCk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyB1cmwgKGdmbSlcbiAgICAgIGlmICghdGhpcy5pbkxpbmsgJiYgdGhpcy5oYXNSdWxlc0dmbSAmJiAoZXhlY0FyciA9ICh0aGlzLnJ1bGVzIGFzIFJ1bGVzSW5saW5lR2ZtKS51cmwuZXhlYyhuZXh0UGFydCkpKSB7XG4gICAgICAgIGxldCB0ZXh0OiBzdHJpbmc7XG4gICAgICAgIGxldCBocmVmOiBzdHJpbmc7XG4gICAgICAgIG5leHRQYXJ0ID0gbmV4dFBhcnQuc3Vic3RyaW5nKGV4ZWNBcnJbMF0ubGVuZ3RoKTtcbiAgICAgICAgdGV4dCA9IHRoaXMub3B0aW9ucy5lc2NhcGUoZXhlY0FyclsxXSk7XG4gICAgICAgIGhyZWYgPSB0ZXh0O1xuICAgICAgICBvdXQgKz0gdGhpcy5yZW5kZXJlci5saW5rKGhyZWYsIG51bGwsIHRleHQpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gdGFnXG4gICAgICBpZiAoKGV4ZWNBcnIgPSB0aGlzLnJ1bGVzLnRhZy5leGVjKG5leHRQYXJ0KSkpIHtcbiAgICAgICAgaWYgKCF0aGlzLmluTGluayAmJiAvXjxhIC9pLnRlc3QoZXhlY0FyclswXSkpIHtcbiAgICAgICAgICB0aGlzLmluTGluayA9IHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5pbkxpbmsgJiYgL148XFwvYT4vaS50ZXN0KGV4ZWNBcnJbMF0pKSB7XG4gICAgICAgICAgdGhpcy5pbkxpbmsgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIG5leHRQYXJ0ID0gbmV4dFBhcnQuc3Vic3RyaW5nKGV4ZWNBcnJbMF0ubGVuZ3RoKTtcblxuICAgICAgICBvdXQgKz0gdGhpcy5vcHRpb25zLnNhbml0aXplXG4gICAgICAgICAgPyB0aGlzLm9wdGlvbnMuc2FuaXRpemVyXG4gICAgICAgICAgICA/IHRoaXMub3B0aW9ucy5zYW5pdGl6ZXIoZXhlY0FyclswXSlcbiAgICAgICAgICAgIDogdGhpcy5vcHRpb25zLmVzY2FwZShleGVjQXJyWzBdKVxuICAgICAgICAgIDogZXhlY0FyclswXTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIGxpbmtcbiAgICAgIGlmICgoZXhlY0FyciA9IHRoaXMucnVsZXMubGluay5leGVjKG5leHRQYXJ0KSkpIHtcbiAgICAgICAgbmV4dFBhcnQgPSBuZXh0UGFydC5zdWJzdHJpbmcoZXhlY0FyclswXS5sZW5ndGgpO1xuICAgICAgICB0aGlzLmluTGluayA9IHRydWU7XG5cbiAgICAgICAgb3V0ICs9IHRoaXMub3V0cHV0TGluayhleGVjQXJyLCB7XG4gICAgICAgICAgaHJlZjogZXhlY0FyclsyXSxcbiAgICAgICAgICB0aXRsZTogZXhlY0FyclszXSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5pbkxpbmsgPSBmYWxzZTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIHJlZmxpbmssIG5vbGlua1xuICAgICAgaWYgKChleGVjQXJyID0gdGhpcy5ydWxlcy5yZWZsaW5rLmV4ZWMobmV4dFBhcnQpKSB8fCAoZXhlY0FyciA9IHRoaXMucnVsZXMubm9saW5rLmV4ZWMobmV4dFBhcnQpKSkge1xuICAgICAgICBuZXh0UGFydCA9IG5leHRQYXJ0LnN1YnN0cmluZyhleGVjQXJyWzBdLmxlbmd0aCk7XG4gICAgICAgIGNvbnN0IGtleUxpbmsgPSAoZXhlY0FyclsyXSB8fCBleGVjQXJyWzFdKS5yZXBsYWNlKC9cXHMrL2csICcgJyk7XG4gICAgICAgIGNvbnN0IGxpbmsgPSB0aGlzLmxpbmtzW2tleUxpbmsudG9Mb3dlckNhc2UoKV07XG5cbiAgICAgICAgaWYgKCFsaW5rIHx8ICFsaW5rLmhyZWYpIHtcbiAgICAgICAgICBvdXQgKz0gZXhlY0FyclswXS5jaGFyQXQoMCk7XG4gICAgICAgICAgbmV4dFBhcnQgPSBleGVjQXJyWzBdLnN1YnN0cmluZygxKSArIG5leHRQYXJ0O1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5pbkxpbmsgPSB0cnVlO1xuICAgICAgICBvdXQgKz0gdGhpcy5vdXRwdXRMaW5rKGV4ZWNBcnIsIGxpbmspO1xuICAgICAgICB0aGlzLmluTGluayA9IGZhbHNlO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gc3Ryb25nXG4gICAgICBpZiAoKGV4ZWNBcnIgPSB0aGlzLnJ1bGVzLnN0cm9uZy5leGVjKG5leHRQYXJ0KSkpIHtcbiAgICAgICAgbmV4dFBhcnQgPSBuZXh0UGFydC5zdWJzdHJpbmcoZXhlY0FyclswXS5sZW5ndGgpO1xuICAgICAgICBvdXQgKz0gdGhpcy5yZW5kZXJlci5zdHJvbmcodGhpcy5vdXRwdXQoZXhlY0FyclsyXSB8fCBleGVjQXJyWzFdKSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBlbVxuICAgICAgaWYgKChleGVjQXJyID0gdGhpcy5ydWxlcy5lbS5leGVjKG5leHRQYXJ0KSkpIHtcbiAgICAgICAgbmV4dFBhcnQgPSBuZXh0UGFydC5zdWJzdHJpbmcoZXhlY0FyclswXS5sZW5ndGgpO1xuICAgICAgICBvdXQgKz0gdGhpcy5yZW5kZXJlci5lbSh0aGlzLm91dHB1dChleGVjQXJyWzJdIHx8IGV4ZWNBcnJbMV0pKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIGNvZGVcbiAgICAgIGlmICgoZXhlY0FyciA9IHRoaXMucnVsZXMuY29kZS5leGVjKG5leHRQYXJ0KSkpIHtcbiAgICAgICAgbmV4dFBhcnQgPSBuZXh0UGFydC5zdWJzdHJpbmcoZXhlY0FyclswXS5sZW5ndGgpO1xuICAgICAgICBvdXQgKz0gdGhpcy5yZW5kZXJlci5jb2Rlc3Bhbih0aGlzLm9wdGlvbnMuZXNjYXBlKGV4ZWNBcnJbMl0udHJpbSgpLCB0cnVlKSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBiclxuICAgICAgaWYgKChleGVjQXJyID0gdGhpcy5ydWxlcy5ici5leGVjKG5leHRQYXJ0KSkpIHtcbiAgICAgICAgbmV4dFBhcnQgPSBuZXh0UGFydC5zdWJzdHJpbmcoZXhlY0FyclswXS5sZW5ndGgpO1xuICAgICAgICBvdXQgKz0gdGhpcy5yZW5kZXJlci5icigpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gZGVsIChnZm0pXG4gICAgICBpZiAodGhpcy5oYXNSdWxlc0dmbSAmJiAoZXhlY0FyciA9ICh0aGlzLnJ1bGVzIGFzIFJ1bGVzSW5saW5lR2ZtKS5kZWwuZXhlYyhuZXh0UGFydCkpKSB7XG4gICAgICAgIG5leHRQYXJ0ID0gbmV4dFBhcnQuc3Vic3RyaW5nKGV4ZWNBcnJbMF0ubGVuZ3RoKTtcbiAgICAgICAgb3V0ICs9IHRoaXMucmVuZGVyZXIuZGVsKHRoaXMub3V0cHV0KGV4ZWNBcnJbMV0pKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIHRleHRcbiAgICAgIGlmICgoZXhlY0FyciA9IHRoaXMucnVsZXMudGV4dC5leGVjKG5leHRQYXJ0KSkpIHtcbiAgICAgICAgbmV4dFBhcnQgPSBuZXh0UGFydC5zdWJzdHJpbmcoZXhlY0FyclswXS5sZW5ndGgpO1xuICAgICAgICBvdXQgKz0gdGhpcy5yZW5kZXJlci50ZXh0KHRoaXMub3B0aW9ucy5lc2NhcGUodGhpcy5zbWFydHlwYW50cyhleGVjQXJyWzBdKSkpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKG5leHRQYXJ0KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSW5maW5pdGUgbG9vcCBvbiBieXRlOiAnICsgbmV4dFBhcnQuY2hhckNvZGVBdCgwKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb21waWxlIExpbmsuXG4gICAqL1xuICBwcm90ZWN0ZWQgb3V0cHV0TGluayhleGVjQXJyOiBSZWdFeHBFeGVjQXJyYXksIGxpbms6IExpbmspIHtcbiAgICBjb25zdCBocmVmID0gdGhpcy5vcHRpb25zLmVzY2FwZShsaW5rLmhyZWYpO1xuICAgIGNvbnN0IHRpdGxlID0gbGluay50aXRsZSA/IHRoaXMub3B0aW9ucy5lc2NhcGUobGluay50aXRsZSkgOiBudWxsO1xuXG4gICAgcmV0dXJuIGV4ZWNBcnJbMF0uY2hhckF0KDApICE9PSAnISdcbiAgICAgID8gdGhpcy5yZW5kZXJlci5saW5rKGhyZWYsIHRpdGxlLCB0aGlzLm91dHB1dChleGVjQXJyWzFdKSlcbiAgICAgIDogdGhpcy5yZW5kZXJlci5pbWFnZShocmVmLCB0aXRsZSwgdGhpcy5vcHRpb25zLmVzY2FwZShleGVjQXJyWzFdKSk7XG4gIH1cblxuICAvKipcbiAgICogU21hcnR5cGFudHMgVHJhbnNmb3JtYXRpb25zLlxuICAgKi9cbiAgcHJvdGVjdGVkIHNtYXJ0eXBhbnRzKHRleHQ6IHN0cmluZykge1xuICAgIGlmICghdGhpcy5vcHRpb25zLnNtYXJ0eXBhbnRzKSB7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgdGV4dFxuICAgICAgICAvLyBlbS1kYXNoZXNcbiAgICAgICAgLnJlcGxhY2UoLy0tLS9nLCAnXFx1MjAxNCcpXG4gICAgICAgIC8vIGVuLWRhc2hlc1xuICAgICAgICAucmVwbGFjZSgvLS0vZywgJ1xcdTIwMTMnKVxuICAgICAgICAvLyBvcGVuaW5nIHNpbmdsZXNcbiAgICAgICAgLnJlcGxhY2UoLyhefFstXFx1MjAxNC8oXFxbe1wiXFxzXSknL2csICckMVxcdTIwMTgnKVxuICAgICAgICAvLyBjbG9zaW5nIHNpbmdsZXMgJiBhcG9zdHJvcGhlc1xuICAgICAgICAucmVwbGFjZSgvJy9nLCAnXFx1MjAxOScpXG4gICAgICAgIC8vIG9wZW5pbmcgZG91Ymxlc1xuICAgICAgICAucmVwbGFjZSgvKF58Wy1cXHUyMDE0LyhcXFt7XFx1MjAxOFxcc10pXCIvZywgJyQxXFx1MjAxYycpXG4gICAgICAgIC8vIGNsb3NpbmcgZG91Ymxlc1xuICAgICAgICAucmVwbGFjZSgvXCIvZywgJ1xcdTIwMWQnKVxuICAgICAgICAvLyBlbGxpcHNlc1xuICAgICAgICAucmVwbGFjZSgvXFwuezN9L2csICdcXHUyMDI2JylcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hbmdsZSBMaW5rcy5cbiAgICovXG4gIHByb3RlY3RlZCBtYW5nbGUodGV4dDogc3RyaW5nKSB7XG4gICAgaWYgKCF0aGlzLm9wdGlvbnMubWFuZ2xlKSB7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG5cbiAgICBsZXQgb3V0ID0gJyc7XG4gICAgY29uc3QgbGVuZ3RoID0gdGV4dC5sZW5ndGg7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgc3RyOiBzdHJpbmc7XG5cbiAgICAgIGlmIChNYXRoLnJhbmRvbSgpID4gMC41KSB7XG4gICAgICAgIHN0ciA9ICd4JyArIHRleHQuY2hhckNvZGVBdChpKS50b1N0cmluZygxNik7XG4gICAgICB9XG5cbiAgICAgIG91dCArPSAnJiMnICsgc3RyICsgJzsnO1xuICAgIH1cblxuICAgIHJldHVybiBvdXQ7XG4gIH1cbn1cbiIsICIvKipcbiAqIEBsaWNlbnNlXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDExLTIwMTQsIENocmlzdG9waGVyIEplZmZyZXkuIChNSVQgTGljZW5zZWQpXG4gKiBodHRwczovL2dpdGh1Yi5jb20vY2hqai9tYXJrZWRcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTgtMjAyMSwgXHUwNDFBXHUwNDNFXHUwNDQxXHUwNDQyXHUwNDRGIFx1MDQyMlx1MDQ0MFx1MDQzNVx1MDQ0Mlx1MDQ0Rlx1MDQzQS4gKE1JVCBMaWNlbnNlZClcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS90cy1zdGFjay9tYXJrZG93blxuICovXG5cbmltcG9ydCB7IElubGluZUxleGVyIH0gZnJvbSAnLi9pbmxpbmUtbGV4ZXInO1xuaW1wb3J0IHsgTGlua3MsIE1hcmtlZE9wdGlvbnMsIFNpbXBsZVJlbmRlcmVyLCBUb2tlbiwgVG9rZW5UeXBlIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7IE1hcmtlZCB9IGZyb20gJy4vbWFya2VkJztcbmltcG9ydCB7IFJlbmRlcmVyIH0gZnJvbSAnLi9yZW5kZXJlcic7XG5cbi8qKlxuICogUGFyc2luZyAmIENvbXBpbGluZy5cbiAqL1xuZXhwb3J0IGNsYXNzIFBhcnNlciB7XG4gIHNpbXBsZVJlbmRlcmVyczogU2ltcGxlUmVuZGVyZXJbXSA9IFtdO1xuICBwcm90ZWN0ZWQgdG9rZW5zOiBUb2tlbltdO1xuICBwcm90ZWN0ZWQgdG9rZW46IFRva2VuO1xuICBwcm90ZWN0ZWQgaW5saW5lTGV4ZXI6IElubGluZUxleGVyO1xuICBwcm90ZWN0ZWQgb3B0aW9uczogTWFya2VkT3B0aW9ucztcbiAgcHJvdGVjdGVkIHJlbmRlcmVyOiBSZW5kZXJlcjtcbiAgcHJvdGVjdGVkIGxpbmU6IG51bWJlciA9IDA7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucz86IE1hcmtlZE9wdGlvbnMpIHtcbiAgICB0aGlzLnRva2VucyA9IFtdO1xuICAgIHRoaXMudG9rZW4gPSBudWxsO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgfHwgTWFya2VkLm9wdGlvbnM7XG4gICAgdGhpcy5yZW5kZXJlciA9IHRoaXMub3B0aW9ucy5yZW5kZXJlciB8fCBuZXcgUmVuZGVyZXIodGhpcy5vcHRpb25zKTtcbiAgfVxuXG4gIHN0YXRpYyBwYXJzZSh0b2tlbnM6IFRva2VuW10sIGxpbmtzOiBMaW5rcywgb3B0aW9ucz86IE1hcmtlZE9wdGlvbnMpOiBzdHJpbmcge1xuICAgIGNvbnN0IHBhcnNlciA9IG5ldyB0aGlzKG9wdGlvbnMpO1xuICAgIHJldHVybiBwYXJzZXIucGFyc2UobGlua3MsIHRva2Vucyk7XG4gIH1cblxuICBwYXJzZShsaW5rczogTGlua3MsIHRva2VuczogVG9rZW5bXSkge1xuICAgIHRoaXMuaW5saW5lTGV4ZXIgPSBuZXcgSW5saW5lTGV4ZXIoSW5saW5lTGV4ZXIsIGxpbmtzLCB0aGlzLm9wdGlvbnMsIHRoaXMucmVuZGVyZXIpO1xuICAgIHRoaXMudG9rZW5zID0gdG9rZW5zLnJldmVyc2UoKTtcblxuICAgIGxldCBvdXQgPSAnJztcblxuICAgIHdoaWxlICh0aGlzLm5leHQoKSkge1xuICAgICAgb3V0ICs9IHRoaXMudG9rKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dDtcbiAgfVxuXG4gIGRlYnVnKGxpbmtzOiBMaW5rcywgdG9rZW5zOiBUb2tlbltdKSB7XG4gICAgdGhpcy5pbmxpbmVMZXhlciA9IG5ldyBJbmxpbmVMZXhlcihJbmxpbmVMZXhlciwgbGlua3MsIHRoaXMub3B0aW9ucywgdGhpcy5yZW5kZXJlcik7XG4gICAgdGhpcy50b2tlbnMgPSB0b2tlbnMucmV2ZXJzZSgpO1xuXG4gICAgbGV0IG91dCA9ICcnO1xuXG4gICAgd2hpbGUgKHRoaXMubmV4dCgpKSB7XG4gICAgICBjb25zdCBvdXRUb2tlbjogc3RyaW5nID0gdGhpcy50b2soKTtcbiAgICAgIHRoaXMudG9rZW4ubGluZSA9IHRoaXMubGluZSArPSBvdXRUb2tlbi5zcGxpdCgnXFxuJykubGVuZ3RoIC0gMTtcbiAgICAgIG91dCArPSBvdXRUb2tlbjtcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0O1xuICB9XG5cbiAgcHJvdGVjdGVkIG5leHQoKSB7XG4gICAgcmV0dXJuICh0aGlzLnRva2VuID0gdGhpcy50b2tlbnMucG9wKCkpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldE5leHRFbGVtZW50KCkge1xuICAgIHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLnRva2Vucy5sZW5ndGggLSAxXTtcbiAgfVxuXG4gIHByb3RlY3RlZCBwYXJzZVRleHQoKSB7XG4gICAgbGV0IGJvZHkgPSB0aGlzLnRva2VuLnRleHQ7XG4gICAgbGV0IG5leHRFbGVtZW50OiBUb2tlbjtcblxuICAgIHdoaWxlICgobmV4dEVsZW1lbnQgPSB0aGlzLmdldE5leHRFbGVtZW50KCkpICYmIG5leHRFbGVtZW50LnR5cGUgPT0gVG9rZW5UeXBlLnRleHQpIHtcbiAgICAgIGJvZHkgKz0gJ1xcbicgKyB0aGlzLm5leHQoKS50ZXh0O1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmlubGluZUxleGVyLm91dHB1dChib2R5KTtcbiAgfVxuXG4gIHByb3RlY3RlZCB0b2soKSB7XG4gICAgc3dpdGNoICh0aGlzLnRva2VuLnR5cGUpIHtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLnNwYWNlOiB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICAgIH1cbiAgICAgIGNhc2UgVG9rZW5UeXBlLnBhcmFncmFwaDoge1xuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJlci5wYXJhZ3JhcGgodGhpcy5pbmxpbmVMZXhlci5vdXRwdXQodGhpcy50b2tlbi50ZXh0KSk7XG4gICAgICB9XG4gICAgICBjYXNlIFRva2VuVHlwZS50ZXh0OiB7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuaXNOb1ApIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZVRleHQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJlci5wYXJhZ3JhcGgodGhpcy5wYXJzZVRleHQoKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNhc2UgVG9rZW5UeXBlLmhlYWRpbmc6IHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyZXIuaGVhZGluZyh0aGlzLmlubGluZUxleGVyLm91dHB1dCh0aGlzLnRva2VuLnRleHQpLCB0aGlzLnRva2VuLmRlcHRoLCB0aGlzLnRva2VuLnRleHQpO1xuICAgICAgfVxuICAgICAgY2FzZSBUb2tlblR5cGUubGlzdFN0YXJ0OiB7XG4gICAgICAgIGxldCBib2R5ID0gJyc7XG4gICAgICAgIGNvbnN0IG9yZGVyZWQgPSB0aGlzLnRva2VuLm9yZGVyZWQ7XG5cbiAgICAgICAgd2hpbGUgKHRoaXMubmV4dCgpLnR5cGUgIT0gVG9rZW5UeXBlLmxpc3RFbmQpIHtcbiAgICAgICAgICBib2R5ICs9IHRoaXMudG9rKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJlci5saXN0KGJvZHksIG9yZGVyZWQpO1xuICAgICAgfVxuICAgICAgY2FzZSBUb2tlblR5cGUubGlzdEl0ZW1TdGFydDoge1xuICAgICAgICBsZXQgYm9keSA9ICcnO1xuXG4gICAgICAgIHdoaWxlICh0aGlzLm5leHQoKS50eXBlICE9IFRva2VuVHlwZS5saXN0SXRlbUVuZCkge1xuICAgICAgICAgIGJvZHkgKz0gdGhpcy50b2tlbi50eXBlID09IChUb2tlblR5cGUudGV4dCBhcyBhbnkpID8gdGhpcy5wYXJzZVRleHQoKSA6IHRoaXMudG9rKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJlci5saXN0aXRlbShib2R5KTtcbiAgICAgIH1cbiAgICAgIGNhc2UgVG9rZW5UeXBlLmxvb3NlSXRlbVN0YXJ0OiB7XG4gICAgICAgIGxldCBib2R5ID0gJyc7XG5cbiAgICAgICAgd2hpbGUgKHRoaXMubmV4dCgpLnR5cGUgIT0gVG9rZW5UeXBlLmxpc3RJdGVtRW5kKSB7XG4gICAgICAgICAgYm9keSArPSB0aGlzLnRvaygpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyZXIubGlzdGl0ZW0oYm9keSk7XG4gICAgICB9XG4gICAgICBjYXNlIFRva2VuVHlwZS5jb2RlOiB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlcmVyLmNvZGUodGhpcy50b2tlbi50ZXh0LCB0aGlzLnRva2VuLmxhbmcsIHRoaXMudG9rZW4uZXNjYXBlZCwgdGhpcy50b2tlbi5tZXRhKTtcbiAgICAgIH1cbiAgICAgIGNhc2UgVG9rZW5UeXBlLnRhYmxlOiB7XG4gICAgICAgIGxldCBoZWFkZXIgPSAnJztcbiAgICAgICAgbGV0IGJvZHkgPSAnJztcbiAgICAgICAgbGV0IGNlbGw7XG5cbiAgICAgICAgLy8gaGVhZGVyXG4gICAgICAgIGNlbGwgPSAnJztcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnRva2VuLmhlYWRlci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGNvbnN0IGZsYWdzID0geyBoZWFkZXI6IHRydWUsIGFsaWduOiB0aGlzLnRva2VuLmFsaWduW2ldIH07XG4gICAgICAgICAgY29uc3Qgb3V0ID0gdGhpcy5pbmxpbmVMZXhlci5vdXRwdXQodGhpcy50b2tlbi5oZWFkZXJbaV0pO1xuXG4gICAgICAgICAgY2VsbCArPSB0aGlzLnJlbmRlcmVyLnRhYmxlY2VsbChvdXQsIGZsYWdzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGhlYWRlciArPSB0aGlzLnJlbmRlcmVyLnRhYmxlcm93KGNlbGwpO1xuXG4gICAgICAgIGZvciAoY29uc3Qgcm93IG9mIHRoaXMudG9rZW4uY2VsbHMpIHtcbiAgICAgICAgICBjZWxsID0gJyc7XG5cbiAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHJvdy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgY2VsbCArPSB0aGlzLnJlbmRlcmVyLnRhYmxlY2VsbCh0aGlzLmlubGluZUxleGVyLm91dHB1dChyb3dbal0pLCB7XG4gICAgICAgICAgICAgIGhlYWRlcjogZmFsc2UsXG4gICAgICAgICAgICAgIGFsaWduOiB0aGlzLnRva2VuLmFsaWduW2pdXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBib2R5ICs9IHRoaXMucmVuZGVyZXIudGFibGVyb3coY2VsbCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJlci50YWJsZShoZWFkZXIsIGJvZHkpO1xuICAgICAgfVxuICAgICAgY2FzZSBUb2tlblR5cGUuYmxvY2txdW90ZVN0YXJ0OiB7XG4gICAgICAgIGxldCBib2R5ID0gJyc7XG5cbiAgICAgICAgd2hpbGUgKHRoaXMubmV4dCgpLnR5cGUgIT0gVG9rZW5UeXBlLmJsb2NrcXVvdGVFbmQpIHtcbiAgICAgICAgICBib2R5ICs9IHRoaXMudG9rKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJlci5ibG9ja3F1b3RlKGJvZHkpO1xuICAgICAgfVxuICAgICAgY2FzZSBUb2tlblR5cGUuaHI6IHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyZXIuaHIoKTtcbiAgICAgIH1cbiAgICAgIGNhc2UgVG9rZW5UeXBlLmh0bWw6IHtcbiAgICAgICAgY29uc3QgaHRtbCA9XG4gICAgICAgICAgIXRoaXMudG9rZW4ucHJlICYmICF0aGlzLm9wdGlvbnMucGVkYW50aWMgPyB0aGlzLmlubGluZUxleGVyLm91dHB1dCh0aGlzLnRva2VuLnRleHQpIDogdGhpcy50b2tlbi50ZXh0O1xuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJlci5odG1sKGh0bWwpO1xuICAgICAgfVxuICAgICAgZGVmYXVsdDoge1xuICAgICAgICBpZiAodGhpcy5zaW1wbGVSZW5kZXJlcnMubGVuZ3RoKSB7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnNpbXBsZVJlbmRlcmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMudG9rZW4udHlwZSA9PSAnc2ltcGxlUnVsZScgKyAoaSArIDEpKSB7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLnNpbXBsZVJlbmRlcmVyc1tpXS5jYWxsKHRoaXMucmVuZGVyZXIsIHRoaXMudG9rZW4uZXhlY0Fycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZXJyTXNnID0gYFRva2VuIHdpdGggXCIke3RoaXMudG9rZW4udHlwZX1cIiB0eXBlIHdhcyBub3QgZm91bmQuYDtcblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNpbGVudCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGVyck1zZyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVyck1zZyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiIsICIvKipcbiAqIEBsaWNlbnNlXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDExLTIwMTQsIENocmlzdG9waGVyIEplZmZyZXkuIChNSVQgTGljZW5zZWQpXG4gKiBodHRwczovL2dpdGh1Yi5jb20vY2hqai9tYXJrZWRcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTgtMjAyMSwgXHUwNDFBXHUwNDNFXHUwNDQxXHUwNDQyXHUwNDRGIFx1MDQyMlx1MDQ0MFx1MDQzNVx1MDQ0Mlx1MDQ0Rlx1MDQzQS4gKE1JVCBMaWNlbnNlZClcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS90cy1zdGFjay9tYXJrZG93blxuICovXG5cbmltcG9ydCB7IEJsb2NrTGV4ZXIgfSBmcm9tICcuL2Jsb2NrLWxleGVyJztcbmltcG9ydCB7IERlYnVnUmV0dXJucywgTGV4ZXJSZXR1cm5zLCBMaW5rcywgTWFya2VkT3B0aW9ucywgU2ltcGxlUmVuZGVyZXIsIFRva2VuLCBUb2tlblR5cGUgfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgUGFyc2VyIH0gZnJvbSAnLi9wYXJzZXInO1xuXG5leHBvcnQgY2xhc3MgTWFya2VkIHtcbiAgc3RhdGljIG9wdGlvbnMgPSBuZXcgTWFya2VkT3B0aW9ucygpO1xuICBwcm90ZWN0ZWQgc3RhdGljIHNpbXBsZVJlbmRlcmVyczogU2ltcGxlUmVuZGVyZXJbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBNZXJnZXMgdGhlIGRlZmF1bHQgb3B0aW9ucyB3aXRoIG9wdGlvbnMgdGhhdCB3aWxsIGJlIHNldC5cbiAgICpcbiAgICogQHBhcmFtIG9wdGlvbnMgSGFzaCBvZiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHNldE9wdGlvbnMob3B0aW9uczogTWFya2VkT3B0aW9ucykge1xuICAgIE9iamVjdC5hc3NpZ24odGhpcy5vcHRpb25zLCBvcHRpb25zKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0aW5nIHNpbXBsZSBibG9jayBydWxlLlxuICAgKi9cbiAgc3RhdGljIHNldEJsb2NrUnVsZShyZWdleHA6IFJlZ0V4cCwgcmVuZGVyZXI6IFNpbXBsZVJlbmRlcmVyID0gKCkgPT4gJycpIHtcbiAgICBCbG9ja0xleGVyLnNpbXBsZVJ1bGVzLnB1c2gocmVnZXhwKTtcbiAgICB0aGlzLnNpbXBsZVJlbmRlcmVycy5wdXNoKHJlbmRlcmVyKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEFjY2VwdHMgTWFya2Rvd24gdGV4dCBhbmQgcmV0dXJucyB0ZXh0IGluIEhUTUwgZm9ybWF0LlxuICAgKlxuICAgKiBAcGFyYW0gc3JjIFN0cmluZyBvZiBtYXJrZG93biBzb3VyY2UgdG8gYmUgY29tcGlsZWQuXG4gICAqIEBwYXJhbSBvcHRpb25zIEhhc2ggb2Ygb3B0aW9ucy4gVGhleSByZXBsYWNlLCBidXQgZG8gbm90IG1lcmdlIHdpdGggdGhlIGRlZmF1bHQgb3B0aW9ucy5cbiAgICogSWYgeW91IHdhbnQgdGhlIG1lcmdpbmcsIHlvdSBjYW4gdG8gZG8gdGhpcyB2aWEgYE1hcmtlZC5zZXRPcHRpb25zKClgLlxuICAgKi9cbiAgc3RhdGljIHBhcnNlKHNyYzogc3RyaW5nLCBvcHRpb25zOiBNYXJrZWRPcHRpb25zID0gdGhpcy5vcHRpb25zKTogc3RyaW5nIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgeyB0b2tlbnMsIGxpbmtzIH0gPSB0aGlzLmNhbGxCbG9ja0xleGVyKHNyYywgb3B0aW9ucyk7XG4gICAgICByZXR1cm4gdGhpcy5jYWxsUGFyc2VyKHRva2VucywgbGlua3MsIG9wdGlvbnMpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiB0aGlzLmNhbGxNZShlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWNjZXB0cyBNYXJrZG93biB0ZXh0IGFuZCByZXR1cm5zIG9iamVjdCB3aXRoIHRleHQgaW4gSFRNTCBmb3JtYXQsXG4gICAqIHRva2VucyBhbmQgbGlua3MgZnJvbSBgQmxvY2tMZXhlci5wYXJzZXIoKWAuXG4gICAqXG4gICAqIEBwYXJhbSBzcmMgU3RyaW5nIG9mIG1hcmtkb3duIHNvdXJjZSB0byBiZSBjb21waWxlZC5cbiAgICogQHBhcmFtIG9wdGlvbnMgSGFzaCBvZiBvcHRpb25zLiBUaGV5IHJlcGxhY2UsIGJ1dCBkbyBub3QgbWVyZ2Ugd2l0aCB0aGUgZGVmYXVsdCBvcHRpb25zLlxuICAgKiBJZiB5b3Ugd2FudCB0aGUgbWVyZ2luZywgeW91IGNhbiB0byBkbyB0aGlzIHZpYSBgTWFya2VkLnNldE9wdGlvbnMoKWAuXG4gICAqL1xuICBzdGF0aWMgZGVidWcoc3JjOiBzdHJpbmcsIG9wdGlvbnM6IE1hcmtlZE9wdGlvbnMgPSB0aGlzLm9wdGlvbnMpOiBEZWJ1Z1JldHVybnMge1xuICAgIGNvbnN0IHsgdG9rZW5zLCBsaW5rcyB9ID0gdGhpcy5jYWxsQmxvY2tMZXhlcihzcmMsIG9wdGlvbnMpO1xuICAgIGxldCBvcmlnaW4gPSB0b2tlbnMuc2xpY2UoKTtcbiAgICBjb25zdCBwYXJzZXIgPSBuZXcgUGFyc2VyKG9wdGlvbnMpO1xuICAgIHBhcnNlci5zaW1wbGVSZW5kZXJlcnMgPSB0aGlzLnNpbXBsZVJlbmRlcmVycztcbiAgICBjb25zdCByZXN1bHQgPSBwYXJzZXIuZGVidWcobGlua3MsIHRva2Vucyk7XG5cbiAgICAvKipcbiAgICAgKiBUcmFuc2xhdGVzIGEgdG9rZW4gdHlwZSBpbnRvIGEgcmVhZGFibGUgZm9ybSxcbiAgICAgKiBhbmQgbW92ZXMgYGxpbmVgIGZpZWxkIHRvIGEgZmlyc3QgcGxhY2UgaW4gYSB0b2tlbiBvYmplY3QuXG4gICAgICovXG4gICAgb3JpZ2luID0gb3JpZ2luLm1hcCh0b2tlbiA9PiB7XG4gICAgICB0b2tlbi50eXBlID0gKFRva2VuVHlwZSBhcyBhbnkpW3Rva2VuLnR5cGVdIHx8IHRva2VuLnR5cGU7XG5cbiAgICAgIGNvbnN0IGxpbmUgPSB0b2tlbi5saW5lO1xuICAgICAgZGVsZXRlIHRva2VuLmxpbmU7XG4gICAgICBpZiAobGluZSkge1xuICAgICAgICByZXR1cm4geyAuLi57IGxpbmUgfSwgLi4udG9rZW4gfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0b2tlbjtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiB7IHRva2Vuczogb3JpZ2luLCBsaW5rcywgcmVzdWx0IH07XG4gIH1cblxuICBwcm90ZWN0ZWQgc3RhdGljIGNhbGxCbG9ja0xleGVyKHNyYzogc3RyaW5nID0gJycsIG9wdGlvbnM/OiBNYXJrZWRPcHRpb25zKTogTGV4ZXJSZXR1cm5zIHtcbiAgICBpZiAodHlwZW9mIHNyYyAhPSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCB0aGF0IHRoZSAnc3JjJyBwYXJhbWV0ZXIgd291bGQgaGF2ZSBhICdzdHJpbmcnIHR5cGUsIGdvdCAnJHt0eXBlb2Ygc3JjfSdgKTtcbiAgICB9XG5cbiAgICAvLyBQcmVwcm9jZXNzaW5nLlxuICAgIHNyYyA9IHNyY1xuICAgICAgLnJlcGxhY2UoL1xcclxcbnxcXHIvZywgJ1xcbicpXG4gICAgICAucmVwbGFjZSgvXFx0L2csICcgICAgJylcbiAgICAgIC5yZXBsYWNlKC9cXHUwMGEwL2csICcgJylcbiAgICAgIC5yZXBsYWNlKC9cXHUyNDI0L2csICdcXG4nKVxuICAgICAgLnJlcGxhY2UoL14gKyQvZ20sICcnKTtcblxuICAgIHJldHVybiBCbG9ja0xleGVyLmxleChzcmMsIG9wdGlvbnMsIHRydWUpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHN0YXRpYyBjYWxsUGFyc2VyKHRva2VuczogVG9rZW5bXSwgbGlua3M6IExpbmtzLCBvcHRpb25zPzogTWFya2VkT3B0aW9ucyk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMuc2ltcGxlUmVuZGVyZXJzLmxlbmd0aCkge1xuICAgICAgY29uc3QgcGFyc2VyID0gbmV3IFBhcnNlcihvcHRpb25zKTtcbiAgICAgIHBhcnNlci5zaW1wbGVSZW5kZXJlcnMgPSB0aGlzLnNpbXBsZVJlbmRlcmVycztcbiAgICAgIHJldHVybiBwYXJzZXIucGFyc2UobGlua3MsIHRva2Vucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBQYXJzZXIucGFyc2UodG9rZW5zLCBsaW5rcywgb3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIHN0YXRpYyBjYWxsTWUoZXJyOiBFcnJvcikge1xuICAgIGVyci5tZXNzYWdlICs9ICdcXG5QbGVhc2UgcmVwb3J0IHRoaXMgdG8gaHR0cHM6Ly9naXRodWIuY29tL3RzLXN0YWNrL21hcmtkb3duJztcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuc2lsZW50KSB7XG4gICAgICByZXR1cm4gJzxwPkFuIGVycm9yIG9jY3VyZWQ6PC9wPjxwcmU+JyArIHRoaXMub3B0aW9ucy5lc2NhcGUoZXJyLm1lc3NhZ2UgKyAnJywgdHJ1ZSkgKyAnPC9wcmU+JztcbiAgICB9XG5cbiAgICB0aHJvdyBlcnI7XG4gIH1cbn1cbiIsICIvKipcbiAqIEBsaWNlbnNlXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDExLTIwMTQsIENocmlzdG9waGVyIEplZmZyZXkuIChNSVQgTGljZW5zZWQpXG4gKiBodHRwczovL2dpdGh1Yi5jb20vY2hqai9tYXJrZWRcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTgtMjAyMSwgXHUwNDFBXHUwNDNFXHUwNDQxXHUwNDQyXHUwNDRGIFx1MDQyMlx1MDQ0MFx1MDQzNVx1MDQ0Mlx1MDQ0Rlx1MDQzQS4gKE1JVCBMaWNlbnNlZClcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS90cy1zdGFjay9tYXJrZG93blxuICovXG5cbmltcG9ydCB7IEV4dGVuZFJlZ2V4cCB9IGZyb20gJy4vZXh0ZW5kLXJlZ2V4cCc7XG5pbXBvcnQge1xuICBBbGlnbixcbiAgTGV4ZXJSZXR1cm5zLFxuICBMaW5rcyxcbiAgTWFya2VkT3B0aW9ucyxcbiAgUnVsZXNCbG9ja0Jhc2UsXG4gIFJ1bGVzQmxvY2tHZm0sXG4gIFJ1bGVzQmxvY2tUYWJsZXMsXG4gIFRva2VuLFxuICBUb2tlblR5cGUsXG59IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBNYXJrZWQgfSBmcm9tICcuL21hcmtlZCc7XG5cbmV4cG9ydCBjbGFzcyBCbG9ja0xleGVyPFQgZXh0ZW5kcyB0eXBlb2YgQmxvY2tMZXhlcj4ge1xuICBzdGF0aWMgc2ltcGxlUnVsZXM6IFJlZ0V4cFtdID0gW107XG4gIHByb3RlY3RlZCBzdGF0aWMgcnVsZXNCYXNlOiBSdWxlc0Jsb2NrQmFzZSA9IG51bGw7XG4gIC8qKlxuICAgKiBHRk0gQmxvY2sgR3JhbW1hci5cbiAgICovXG4gIHByb3RlY3RlZCBzdGF0aWMgcnVsZXNHZm06IFJ1bGVzQmxvY2tHZm0gPSBudWxsO1xuICAvKipcbiAgICogR0ZNICsgVGFibGVzIEJsb2NrIEdyYW1tYXIuXG4gICAqL1xuICBwcm90ZWN0ZWQgc3RhdGljIHJ1bGVzVGFibGVzOiBSdWxlc0Jsb2NrVGFibGVzID0gbnVsbDtcbiAgcHJvdGVjdGVkIHJ1bGVzOiBSdWxlc0Jsb2NrQmFzZSB8IFJ1bGVzQmxvY2tHZm0gfCBSdWxlc0Jsb2NrVGFibGVzO1xuICBwcm90ZWN0ZWQgb3B0aW9uczogTWFya2VkT3B0aW9ucztcbiAgcHJvdGVjdGVkIGxpbmtzOiBMaW5rcyA9IHt9O1xuICBwcm90ZWN0ZWQgdG9rZW5zOiBUb2tlbltdID0gW107XG4gIHByb3RlY3RlZCBoYXNSdWxlc0dmbTogYm9vbGVhbjtcbiAgcHJvdGVjdGVkIGhhc1J1bGVzVGFibGVzOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBzdGF0aWNUaGlzOiBULCBvcHRpb25zPzogb2JqZWN0KSB7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCBNYXJrZWQub3B0aW9ucztcbiAgICB0aGlzLnNldFJ1bGVzKCk7XG4gIH1cblxuICAvKipcbiAgICogQWNjZXB0cyBNYXJrZG93biB0ZXh0IGFuZCByZXR1cm5zIG9iamVjdCB3aXRoIHRva2VucyBhbmQgbGlua3MuXG4gICAqXG4gICAqIEBwYXJhbSBzcmMgU3RyaW5nIG9mIG1hcmtkb3duIHNvdXJjZSB0byBiZSBjb21waWxlZC5cbiAgICogQHBhcmFtIG9wdGlvbnMgSGFzaCBvZiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIGxleChzcmM6IHN0cmluZywgb3B0aW9ucz86IE1hcmtlZE9wdGlvbnMsIHRvcD86IGJvb2xlYW4sIGlzQmxvY2tRdW90ZT86IGJvb2xlYW4pOiBMZXhlclJldHVybnMge1xuICAgIGNvbnN0IGxleGVyID0gbmV3IHRoaXModGhpcywgb3B0aW9ucyk7XG4gICAgcmV0dXJuIGxleGVyLmdldFRva2VucyhzcmMsIHRvcCwgaXNCbG9ja1F1b3RlKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzdGF0aWMgZ2V0UnVsZXNCYXNlKCk6IFJ1bGVzQmxvY2tCYXNlIHtcbiAgICBpZiAodGhpcy5ydWxlc0Jhc2UpIHtcbiAgICAgIHJldHVybiB0aGlzLnJ1bGVzQmFzZTtcbiAgICB9XG5cbiAgICBjb25zdCBiYXNlOiBSdWxlc0Jsb2NrQmFzZSA9IHtcbiAgICAgIG5ld2xpbmU6IC9eXFxuKy8sXG4gICAgICBjb2RlOiAvXiggezR9W15cXG5dK1xcbiopKy8sXG4gICAgICBocjogL14oICpbLSpfXSl7Myx9ICooPzpcXG4rfCQpLyxcbiAgICAgIGhlYWRpbmc6IC9eICooI3sxLDZ9KSAqKFteXFxuXSs/KSAqIyogKig/Olxcbit8JCkvLFxuICAgICAgbGhlYWRpbmc6IC9eKFteXFxuXSspXFxuICooPXwtKXsyLH0gKig/Olxcbit8JCkvLFxuICAgICAgYmxvY2txdW90ZTogL14oICo+W15cXG5dKyhcXG5bXlxcbl0rKSpcXG4qKSsvLFxuICAgICAgbGlzdDogL14oICopKGJ1bGwpIFtcXHNcXFNdKz8oPzpocnxkZWZ8XFxuezIsfSg/ISApKD8hXFwxYnVsbCApXFxuKnxcXHMqJCkvLFxuICAgICAgaHRtbDogL14gKig/OmNvbW1lbnQgKig/OlxcbnxcXHMqJCl8Y2xvc2VkICooPzpcXG57Mix9fFxccyokKXxjbG9zaW5nICooPzpcXG57Mix9fFxccyokKSkvLFxuICAgICAgZGVmOiAvXiAqXFxbKFteXFxdXSspXFxdOiAqPD8oW15cXHM+XSspPj8oPzogK1tcIihdKFteXFxuXSspW1wiKV0pPyAqKD86XFxuK3wkKS8sXG4gICAgICBwYXJhZ3JhcGg6IC9eKCg/OlteXFxuXStcXG4/KD8haHJ8aGVhZGluZ3xsaGVhZGluZ3xibG9ja3F1b3RlfHRhZ3xkZWYpKSspXFxuKi8sXG4gICAgICB0ZXh0OiAvXlteXFxuXSsvLFxuICAgICAgYnVsbGV0OiAvKD86WyorLV18XFxkK1xcLikvLFxuICAgICAgaXRlbTogL14oICopKGJ1bGwpIFteXFxuXSooPzpcXG4oPyFcXDFidWxsIClbXlxcbl0qKSovLFxuICAgIH07XG5cbiAgICBiYXNlLml0ZW0gPSBuZXcgRXh0ZW5kUmVnZXhwKGJhc2UuaXRlbSwgJ2dtJykuc2V0R3JvdXAoL2J1bGwvZywgYmFzZS5idWxsZXQpLmdldFJlZ2V4cCgpO1xuXG4gICAgYmFzZS5saXN0ID0gbmV3IEV4dGVuZFJlZ2V4cChiYXNlLmxpc3QpXG4gICAgICAuc2V0R3JvdXAoL2J1bGwvZywgYmFzZS5idWxsZXQpXG4gICAgICAuc2V0R3JvdXAoJ2hyJywgJ1xcXFxuKyg/PVxcXFwxPyg/OlstKl9dICopezMsfSg/OlxcXFxuK3wkKSknKVxuICAgICAgLnNldEdyb3VwKCdkZWYnLCAnXFxcXG4rKD89JyArIGJhc2UuZGVmLnNvdXJjZSArICcpJylcbiAgICAgIC5nZXRSZWdleHAoKTtcblxuICAgIGNvbnN0IHRhZyA9XG4gICAgICAnKD8hKD86JyArXG4gICAgICAnYXxlbXxzdHJvbmd8c21hbGx8c3xjaXRlfHF8ZGZufGFiYnJ8ZGF0YXx0aW1lfGNvZGUnICtcbiAgICAgICd8dmFyfHNhbXB8a2JkfHN1YnxzdXB8aXxifHV8bWFya3xydWJ5fHJ0fHJwfGJkaXxiZG8nICtcbiAgICAgICd8c3Bhbnxicnx3YnJ8aW5zfGRlbHxpbWcpXFxcXGIpXFxcXHcrKD8hOi98W15cXFxcd1xcXFxzQF0qQClcXFxcYic7XG5cbiAgICBiYXNlLmh0bWwgPSBuZXcgRXh0ZW5kUmVnZXhwKGJhc2UuaHRtbClcbiAgICAgIC5zZXRHcm91cCgnY29tbWVudCcsIC88IS0tW1xcc1xcU10qPy0tPi8pXG4gICAgICAuc2V0R3JvdXAoJ2Nsb3NlZCcsIC88KHRhZylbXFxzXFxTXSs/PFxcL1xcMT4vKVxuICAgICAgLnNldEdyb3VwKCdjbG9zaW5nJywgLzx0YWcoPzpcIlteXCJdKlwifCdbXiddKid8W14nXCI+XSkqPz4vKVxuICAgICAgLnNldEdyb3VwKC90YWcvZywgdGFnKVxuICAgICAgLmdldFJlZ2V4cCgpO1xuXG4gICAgYmFzZS5wYXJhZ3JhcGggPSBuZXcgRXh0ZW5kUmVnZXhwKGJhc2UucGFyYWdyYXBoKVxuICAgICAgLnNldEdyb3VwKCdocicsIGJhc2UuaHIpXG4gICAgICAuc2V0R3JvdXAoJ2hlYWRpbmcnLCBiYXNlLmhlYWRpbmcpXG4gICAgICAuc2V0R3JvdXAoJ2xoZWFkaW5nJywgYmFzZS5saGVhZGluZylcbiAgICAgIC5zZXRHcm91cCgnYmxvY2txdW90ZScsIGJhc2UuYmxvY2txdW90ZSlcbiAgICAgIC5zZXRHcm91cCgndGFnJywgJzwnICsgdGFnKVxuICAgICAgLnNldEdyb3VwKCdkZWYnLCBiYXNlLmRlZilcbiAgICAgIC5nZXRSZWdleHAoKTtcblxuICAgIHJldHVybiAodGhpcy5ydWxlc0Jhc2UgPSBiYXNlKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzdGF0aWMgZ2V0UnVsZXNHZm0oKTogUnVsZXNCbG9ja0dmbSB7XG4gICAgaWYgKHRoaXMucnVsZXNHZm0pIHtcbiAgICAgIHJldHVybiB0aGlzLnJ1bGVzR2ZtO1xuICAgIH1cblxuICAgIGNvbnN0IGJhc2UgPSB0aGlzLmdldFJ1bGVzQmFzZSgpO1xuXG4gICAgY29uc3QgZ2ZtOiBSdWxlc0Jsb2NrR2ZtID0ge1xuICAgICAgLi4uYmFzZSxcbiAgICAgIC4uLntcbiAgICAgICAgZmVuY2VzOiAvXiAqKGB7Myx9fH57Myx9KVsgXFwuXSooKFxcUyspPyAqW15cXG5dKilcXG4oW1xcc1xcU10qPylcXHMqXFwxICooPzpcXG4rfCQpLyxcbiAgICAgICAgcGFyYWdyYXBoOiAvXi8sXG4gICAgICAgIGhlYWRpbmc6IC9eICooI3sxLDZ9KSArKFteXFxuXSs/KSAqIyogKig/Olxcbit8JCkvLFxuICAgICAgfSxcbiAgICB9O1xuXG4gICAgY29uc3QgZ3JvdXAxID0gZ2ZtLmZlbmNlcy5zb3VyY2UucmVwbGFjZSgnXFxcXDEnLCAnXFxcXDInKTtcbiAgICBjb25zdCBncm91cDIgPSBiYXNlLmxpc3Quc291cmNlLnJlcGxhY2UoJ1xcXFwxJywgJ1xcXFwzJyk7XG5cbiAgICBnZm0ucGFyYWdyYXBoID0gbmV3IEV4dGVuZFJlZ2V4cChiYXNlLnBhcmFncmFwaCkuc2V0R3JvdXAoJyg/IScsIGAoPyEke2dyb3VwMX18JHtncm91cDJ9fGApLmdldFJlZ2V4cCgpO1xuXG4gICAgcmV0dXJuICh0aGlzLnJ1bGVzR2ZtID0gZ2ZtKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzdGF0aWMgZ2V0UnVsZXNUYWJsZSgpOiBSdWxlc0Jsb2NrVGFibGVzIHtcbiAgICBpZiAodGhpcy5ydWxlc1RhYmxlcykge1xuICAgICAgcmV0dXJuIHRoaXMucnVsZXNUYWJsZXM7XG4gICAgfVxuXG4gICAgcmV0dXJuICh0aGlzLnJ1bGVzVGFibGVzID0ge1xuICAgICAgLi4udGhpcy5nZXRSdWxlc0dmbSgpLFxuICAgICAgLi4ue1xuICAgICAgICBucHRhYmxlOiAvXiAqKFxcUy4qXFx8LiopXFxuICooWy06XSsgKlxcfFstfCA6XSopXFxuKCg/Oi4qXFx8LiooPzpcXG58JCkpKilcXG4qLyxcbiAgICAgICAgdGFibGU6IC9eICpcXHwoLispXFxuICpcXHwoICpbLTpdK1stfCA6XSopXFxuKCg/OiAqXFx8LiooPzpcXG58JCkpKilcXG4qLyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgc2V0UnVsZXMoKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5nZm0pIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMudGFibGVzKSB7XG4gICAgICAgIHRoaXMucnVsZXMgPSB0aGlzLnN0YXRpY1RoaXMuZ2V0UnVsZXNUYWJsZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5ydWxlcyA9IHRoaXMuc3RhdGljVGhpcy5nZXRSdWxlc0dmbSgpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJ1bGVzID0gdGhpcy5zdGF0aWNUaGlzLmdldFJ1bGVzQmFzZSgpO1xuICAgIH1cblxuICAgIHRoaXMuaGFzUnVsZXNHZm0gPSAodGhpcy5ydWxlcyBhcyBSdWxlc0Jsb2NrR2ZtKS5mZW5jZXMgIT09IHVuZGVmaW5lZDtcbiAgICB0aGlzLmhhc1J1bGVzVGFibGVzID0gKHRoaXMucnVsZXMgYXMgUnVsZXNCbG9ja1RhYmxlcykudGFibGUgIT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBMZXhpbmcuXG4gICAqL1xuICBwcm90ZWN0ZWQgZ2V0VG9rZW5zKHNyYzogc3RyaW5nLCB0b3A/OiBib29sZWFuLCBpc0Jsb2NrUXVvdGU/OiBib29sZWFuKTogTGV4ZXJSZXR1cm5zIHtcbiAgICBsZXQgbmV4dFBhcnQgPSBzcmM7XG4gICAgbGV0IGV4ZWNBcnI6IFJlZ0V4cEV4ZWNBcnJheTtcblxuICAgIG1haW5Mb29wOiB3aGlsZSAobmV4dFBhcnQpIHtcbiAgICAgIC8vIG5ld2xpbmVcbiAgICAgIGlmICgoZXhlY0FyciA9IHRoaXMucnVsZXMubmV3bGluZS5leGVjKG5leHRQYXJ0KSkpIHtcbiAgICAgICAgbmV4dFBhcnQgPSBuZXh0UGFydC5zdWJzdHJpbmcoZXhlY0FyclswXS5sZW5ndGgpO1xuXG4gICAgICAgIGlmIChleGVjQXJyWzBdLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICB0aGlzLnRva2Vucy5wdXNoKHsgdHlwZTogVG9rZW5UeXBlLnNwYWNlIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIGNvZGVcbiAgICAgIGlmICgoZXhlY0FyciA9IHRoaXMucnVsZXMuY29kZS5leGVjKG5leHRQYXJ0KSkpIHtcbiAgICAgICAgbmV4dFBhcnQgPSBuZXh0UGFydC5zdWJzdHJpbmcoZXhlY0FyclswXS5sZW5ndGgpO1xuICAgICAgICBjb25zdCBjb2RlID0gZXhlY0FyclswXS5yZXBsYWNlKC9eIHs0fS9nbSwgJycpO1xuXG4gICAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICAgIHR5cGU6IFRva2VuVHlwZS5jb2RlLFxuICAgICAgICAgIHRleHQ6ICF0aGlzLm9wdGlvbnMucGVkYW50aWMgPyBjb2RlLnJlcGxhY2UoL1xcbiskLywgJycpIDogY29kZSxcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBmZW5jZXMgY29kZSAoZ2ZtKVxuICAgICAgaWYgKHRoaXMuaGFzUnVsZXNHZm0gJiYgKGV4ZWNBcnIgPSAodGhpcy5ydWxlcyBhcyBSdWxlc0Jsb2NrR2ZtKS5mZW5jZXMuZXhlYyhuZXh0UGFydCkpKSB7XG4gICAgICAgIG5leHRQYXJ0ID0gbmV4dFBhcnQuc3Vic3RyaW5nKGV4ZWNBcnJbMF0ubGVuZ3RoKTtcblxuICAgICAgICB0aGlzLnRva2Vucy5wdXNoKHtcbiAgICAgICAgICB0eXBlOiBUb2tlblR5cGUuY29kZSxcbiAgICAgICAgICBtZXRhOiBleGVjQXJyWzJdLFxuICAgICAgICAgIGxhbmc6IGV4ZWNBcnJbM10sXG4gICAgICAgICAgdGV4dDogZXhlY0Fycls0XSB8fCAnJyxcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBoZWFkaW5nXG4gICAgICBpZiAoKGV4ZWNBcnIgPSB0aGlzLnJ1bGVzLmhlYWRpbmcuZXhlYyhuZXh0UGFydCkpKSB7XG4gICAgICAgIG5leHRQYXJ0ID0gbmV4dFBhcnQuc3Vic3RyaW5nKGV4ZWNBcnJbMF0ubGVuZ3RoKTtcbiAgICAgICAgdGhpcy50b2tlbnMucHVzaCh7XG4gICAgICAgICAgdHlwZTogVG9rZW5UeXBlLmhlYWRpbmcsXG4gICAgICAgICAgZGVwdGg6IGV4ZWNBcnJbMV0ubGVuZ3RoLFxuICAgICAgICAgIHRleHQ6IGV4ZWNBcnJbMl0sXG4gICAgICAgIH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gdGFibGUgbm8gbGVhZGluZyBwaXBlIChnZm0pXG4gICAgICBpZiAodG9wICYmIHRoaXMuaGFzUnVsZXNUYWJsZXMgJiYgKGV4ZWNBcnIgPSAodGhpcy5ydWxlcyBhcyBSdWxlc0Jsb2NrVGFibGVzKS5ucHRhYmxlLmV4ZWMobmV4dFBhcnQpKSkge1xuICAgICAgICBuZXh0UGFydCA9IG5leHRQYXJ0LnN1YnN0cmluZyhleGVjQXJyWzBdLmxlbmd0aCk7XG5cbiAgICAgICAgY29uc3QgaXRlbTogVG9rZW4gPSB7XG4gICAgICAgICAgdHlwZTogVG9rZW5UeXBlLnRhYmxlLFxuICAgICAgICAgIGhlYWRlcjogZXhlY0FyclsxXS5yZXBsYWNlKC9eICp8ICpcXHwgKiQvZywgJycpLnNwbGl0KC8gKlxcfCAqLyksXG4gICAgICAgICAgYWxpZ246IGV4ZWNBcnJbMl0ucmVwbGFjZSgvXiAqfFxcfCAqJC9nLCAnJykuc3BsaXQoLyAqXFx8ICovKSBhcyBBbGlnbltdLFxuICAgICAgICAgIGNlbGxzOiBbXSxcbiAgICAgICAgfTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW0uYWxpZ24ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAoL14gKi0rOiAqJC8udGVzdChpdGVtLmFsaWduW2ldKSkge1xuICAgICAgICAgICAgaXRlbS5hbGlnbltpXSA9ICdyaWdodCc7XG4gICAgICAgICAgfSBlbHNlIGlmICgvXiAqOi0rOiAqJC8udGVzdChpdGVtLmFsaWduW2ldKSkge1xuICAgICAgICAgICAgaXRlbS5hbGlnbltpXSA9ICdjZW50ZXInO1xuICAgICAgICAgIH0gZWxzZSBpZiAoL14gKjotKyAqJC8udGVzdChpdGVtLmFsaWduW2ldKSkge1xuICAgICAgICAgICAgaXRlbS5hbGlnbltpXSA9ICdsZWZ0JztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaXRlbS5hbGlnbltpXSA9IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdGQ6IHN0cmluZ1tdID0gZXhlY0FyclszXS5yZXBsYWNlKC9cXG4kLywgJycpLnNwbGl0KCdcXG4nKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaXRlbS5jZWxsc1tpXSA9IHRkW2ldLnNwbGl0KC8gKlxcfCAqLyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRva2Vucy5wdXNoKGl0ZW0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gbGhlYWRpbmdcbiAgICAgIGlmICgoZXhlY0FyciA9IHRoaXMucnVsZXMubGhlYWRpbmcuZXhlYyhuZXh0UGFydCkpKSB7XG4gICAgICAgIG5leHRQYXJ0ID0gbmV4dFBhcnQuc3Vic3RyaW5nKGV4ZWNBcnJbMF0ubGVuZ3RoKTtcblxuICAgICAgICB0aGlzLnRva2Vucy5wdXNoKHtcbiAgICAgICAgICB0eXBlOiBUb2tlblR5cGUuaGVhZGluZyxcbiAgICAgICAgICBkZXB0aDogZXhlY0FyclsyXSA9PT0gJz0nID8gMSA6IDIsXG4gICAgICAgICAgdGV4dDogZXhlY0FyclsxXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBoclxuICAgICAgaWYgKChleGVjQXJyID0gdGhpcy5ydWxlcy5oci5leGVjKG5leHRQYXJ0KSkpIHtcbiAgICAgICAgbmV4dFBhcnQgPSBuZXh0UGFydC5zdWJzdHJpbmcoZXhlY0FyclswXS5sZW5ndGgpO1xuICAgICAgICB0aGlzLnRva2Vucy5wdXNoKHsgdHlwZTogVG9rZW5UeXBlLmhyIH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gYmxvY2txdW90ZVxuICAgICAgaWYgKChleGVjQXJyID0gdGhpcy5ydWxlcy5ibG9ja3F1b3RlLmV4ZWMobmV4dFBhcnQpKSkge1xuICAgICAgICBuZXh0UGFydCA9IG5leHRQYXJ0LnN1YnN0cmluZyhleGVjQXJyWzBdLmxlbmd0aCk7XG4gICAgICAgIHRoaXMudG9rZW5zLnB1c2goeyB0eXBlOiBUb2tlblR5cGUuYmxvY2txdW90ZVN0YXJ0IH0pO1xuICAgICAgICBjb25zdCBzdHIgPSBleGVjQXJyWzBdLnJlcGxhY2UoL14gKj4gPy9nbSwgJycpO1xuXG4gICAgICAgIC8vIFBhc3MgYHRvcGAgdG8ga2VlcCB0aGUgY3VycmVudFxuICAgICAgICAvLyBcInRvcGxldmVsXCIgc3RhdGUuIFRoaXMgaXMgZXhhY3RseVxuICAgICAgICAvLyBob3cgbWFya2Rvd24ucGwgd29ya3MuXG4gICAgICAgIHRoaXMuZ2V0VG9rZW5zKHN0cik7XG4gICAgICAgIHRoaXMudG9rZW5zLnB1c2goeyB0eXBlOiBUb2tlblR5cGUuYmxvY2txdW90ZUVuZCB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIGxpc3RcbiAgICAgIGlmICgoZXhlY0FyciA9IHRoaXMucnVsZXMubGlzdC5leGVjKG5leHRQYXJ0KSkpIHtcbiAgICAgICAgbmV4dFBhcnQgPSBuZXh0UGFydC5zdWJzdHJpbmcoZXhlY0FyclswXS5sZW5ndGgpO1xuICAgICAgICBjb25zdCBidWxsOiBzdHJpbmcgPSBleGVjQXJyWzJdO1xuXG4gICAgICAgIHRoaXMudG9rZW5zLnB1c2goeyB0eXBlOiBUb2tlblR5cGUubGlzdFN0YXJ0LCBvcmRlcmVkOiBidWxsLmxlbmd0aCA+IDEgfSk7XG5cbiAgICAgICAgLy8gR2V0IGVhY2ggdG9wLWxldmVsIGl0ZW0uXG4gICAgICAgIGNvbnN0IHN0ciA9IGV4ZWNBcnJbMF0ubWF0Y2godGhpcy5ydWxlcy5pdGVtKTtcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gc3RyLmxlbmd0aDtcblxuICAgICAgICBsZXQgbmV4dCA9IGZhbHNlO1xuICAgICAgICBsZXQgc3BhY2U6IG51bWJlcjtcbiAgICAgICAgbGV0IGJsb2NrQnVsbGV0OiBzdHJpbmc7XG4gICAgICAgIGxldCBsb29zZTogYm9vbGVhbjtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgbGV0IGl0ZW0gPSBzdHJbaV07XG5cbiAgICAgICAgICAvLyBSZW1vdmUgdGhlIGxpc3QgaXRlbSdzIGJ1bGxldCBzbyBpdCBpcyBzZWVuIGFzIHRoZSBuZXh0IHRva2VuLlxuICAgICAgICAgIHNwYWNlID0gaXRlbS5sZW5ndGg7XG4gICAgICAgICAgaXRlbSA9IGl0ZW0ucmVwbGFjZSgvXiAqKFsqKy1dfFxcZCtcXC4pICsvLCAnJyk7XG5cbiAgICAgICAgICAvLyBPdXRkZW50IHdoYXRldmVyIHRoZSBsaXN0IGl0ZW0gY29udGFpbnMuIEhhY2t5LlxuICAgICAgICAgIGlmIChpdGVtLmluZGV4T2YoJ1xcbiAnKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHNwYWNlIC09IGl0ZW0ubGVuZ3RoO1xuICAgICAgICAgICAgaXRlbSA9ICF0aGlzLm9wdGlvbnMucGVkYW50aWNcbiAgICAgICAgICAgICAgPyBpdGVtLnJlcGxhY2UobmV3IFJlZ0V4cCgnXiB7MSwnICsgc3BhY2UgKyAnfScsICdnbScpLCAnJylcbiAgICAgICAgICAgICAgOiBpdGVtLnJlcGxhY2UoL14gezEsNH0vZ20sICcnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBEZXRlcm1pbmUgd2hldGhlciB0aGUgbmV4dCBsaXN0IGl0ZW0gYmVsb25ncyBoZXJlLlxuICAgICAgICAgIC8vIEJhY2twZWRhbCBpZiBpdCBkb2VzIG5vdCBiZWxvbmcgaW4gdGhpcyBsaXN0LlxuICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc21hcnRMaXN0cyAmJiBpICE9PSBsZW5ndGggLSAxKSB7XG4gICAgICAgICAgICBibG9ja0J1bGxldCA9IHRoaXMuc3RhdGljVGhpcy5nZXRSdWxlc0Jhc2UoKS5idWxsZXQuZXhlYyhzdHJbaSArIDFdKVswXTtcblxuICAgICAgICAgICAgaWYgKGJ1bGwgIT09IGJsb2NrQnVsbGV0ICYmICEoYnVsbC5sZW5ndGggPiAxICYmIGJsb2NrQnVsbGV0Lmxlbmd0aCA+IDEpKSB7XG4gICAgICAgICAgICAgIG5leHRQYXJ0ID0gc3RyLnNsaWNlKGkgKyAxKS5qb2luKCdcXG4nKSArIG5leHRQYXJ0O1xuICAgICAgICAgICAgICBpID0gbGVuZ3RoIC0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBEZXRlcm1pbmUgd2hldGhlciBpdGVtIGlzIGxvb3NlIG9yIG5vdC5cbiAgICAgICAgICAvLyBVc2U6IC8oXnxcXG4pKD8hIClbXlxcbl0rXFxuXFxuKD8hXFxzKiQpL1xuICAgICAgICAgIC8vIGZvciBkaXNjb3VudCBiZWhhdmlvci5cbiAgICAgICAgICBsb29zZSA9IG5leHQgfHwgL1xcblxcbig/IVxccyokKS8udGVzdChpdGVtKTtcblxuICAgICAgICAgIGlmIChpICE9PSBsZW5ndGggLSAxKSB7XG4gICAgICAgICAgICBuZXh0ID0gaXRlbS5jaGFyQXQoaXRlbS5sZW5ndGggLSAxKSA9PT0gJ1xcbic7XG5cbiAgICAgICAgICAgIGlmICghbG9vc2UpIHtcbiAgICAgICAgICAgICAgbG9vc2UgPSBuZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMudG9rZW5zLnB1c2goeyB0eXBlOiBsb29zZSA/IFRva2VuVHlwZS5sb29zZUl0ZW1TdGFydCA6IFRva2VuVHlwZS5saXN0SXRlbVN0YXJ0IH0pO1xuXG4gICAgICAgICAgLy8gUmVjdXJzZS5cbiAgICAgICAgICB0aGlzLmdldFRva2VucyhpdGVtLCBmYWxzZSwgaXNCbG9ja1F1b3RlKTtcbiAgICAgICAgICB0aGlzLnRva2Vucy5wdXNoKHsgdHlwZTogVG9rZW5UeXBlLmxpc3RJdGVtRW5kIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50b2tlbnMucHVzaCh7IHR5cGU6IFRva2VuVHlwZS5saXN0RW5kIH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gaHRtbFxuICAgICAgaWYgKChleGVjQXJyID0gdGhpcy5ydWxlcy5odG1sLmV4ZWMobmV4dFBhcnQpKSkge1xuICAgICAgICBuZXh0UGFydCA9IG5leHRQYXJ0LnN1YnN0cmluZyhleGVjQXJyWzBdLmxlbmd0aCk7XG4gICAgICAgIGNvbnN0IGF0dHIgPSBleGVjQXJyWzFdO1xuICAgICAgICBjb25zdCBpc1ByZSA9IGF0dHIgPT09ICdwcmUnIHx8IGF0dHIgPT09ICdzY3JpcHQnIHx8IGF0dHIgPT09ICdzdHlsZSc7XG5cbiAgICAgICAgdGhpcy50b2tlbnMucHVzaCh7XG4gICAgICAgICAgdHlwZTogdGhpcy5vcHRpb25zLnNhbml0aXplID8gVG9rZW5UeXBlLnBhcmFncmFwaCA6IFRva2VuVHlwZS5odG1sLFxuICAgICAgICAgIHByZTogIXRoaXMub3B0aW9ucy5zYW5pdGl6ZXIgJiYgaXNQcmUsXG4gICAgICAgICAgdGV4dDogZXhlY0FyclswXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBkZWZcbiAgICAgIGlmICh0b3AgJiYgKGV4ZWNBcnIgPSB0aGlzLnJ1bGVzLmRlZi5leGVjKG5leHRQYXJ0KSkpIHtcbiAgICAgICAgbmV4dFBhcnQgPSBuZXh0UGFydC5zdWJzdHJpbmcoZXhlY0FyclswXS5sZW5ndGgpO1xuXG4gICAgICAgIHRoaXMubGlua3NbZXhlY0FyclsxXS50b0xvd2VyQ2FzZSgpXSA9IHtcbiAgICAgICAgICBocmVmOiBleGVjQXJyWzJdLFxuICAgICAgICAgIHRpdGxlOiBleGVjQXJyWzNdLFxuICAgICAgICB9O1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gdGFibGUgKGdmbSlcbiAgICAgIGlmICh0b3AgJiYgdGhpcy5oYXNSdWxlc1RhYmxlcyAmJiAoZXhlY0FyciA9ICh0aGlzLnJ1bGVzIGFzIFJ1bGVzQmxvY2tUYWJsZXMpLnRhYmxlLmV4ZWMobmV4dFBhcnQpKSkge1xuICAgICAgICBuZXh0UGFydCA9IG5leHRQYXJ0LnN1YnN0cmluZyhleGVjQXJyWzBdLmxlbmd0aCk7XG5cbiAgICAgICAgY29uc3QgaXRlbTogVG9rZW4gPSB7XG4gICAgICAgICAgdHlwZTogVG9rZW5UeXBlLnRhYmxlLFxuICAgICAgICAgIGhlYWRlcjogZXhlY0FyclsxXS5yZXBsYWNlKC9eICp8ICpcXHwgKiQvZywgJycpLnNwbGl0KC8gKlxcfCAqLyksXG4gICAgICAgICAgYWxpZ246IGV4ZWNBcnJbMl0ucmVwbGFjZSgvXiAqfFxcfCAqJC9nLCAnJykuc3BsaXQoLyAqXFx8ICovKSBhcyBBbGlnbltdLFxuICAgICAgICAgIGNlbGxzOiBbXSxcbiAgICAgICAgfTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW0uYWxpZ24ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAoL14gKi0rOiAqJC8udGVzdChpdGVtLmFsaWduW2ldKSkge1xuICAgICAgICAgICAgaXRlbS5hbGlnbltpXSA9ICdyaWdodCc7XG4gICAgICAgICAgfSBlbHNlIGlmICgvXiAqOi0rOiAqJC8udGVzdChpdGVtLmFsaWduW2ldKSkge1xuICAgICAgICAgICAgaXRlbS5hbGlnbltpXSA9ICdjZW50ZXInO1xuICAgICAgICAgIH0gZWxzZSBpZiAoL14gKjotKyAqJC8udGVzdChpdGVtLmFsaWduW2ldKSkge1xuICAgICAgICAgICAgaXRlbS5hbGlnbltpXSA9ICdsZWZ0JztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaXRlbS5hbGlnbltpXSA9IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdGQgPSBleGVjQXJyWzNdLnJlcGxhY2UoLyg/OiAqXFx8ICopP1xcbiQvLCAnJykuc3BsaXQoJ1xcbicpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpdGVtLmNlbGxzW2ldID0gdGRbaV0ucmVwbGFjZSgvXiAqXFx8ICp8ICpcXHwgKiQvZywgJycpLnNwbGl0KC8gKlxcfCAqLyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRva2Vucy5wdXNoKGl0ZW0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gc2ltcGxlIHJ1bGVzXG4gICAgICBpZiAodGhpcy5zdGF0aWNUaGlzLnNpbXBsZVJ1bGVzLmxlbmd0aCkge1xuICAgICAgICBjb25zdCBzaW1wbGVSdWxlcyA9IHRoaXMuc3RhdGljVGhpcy5zaW1wbGVSdWxlcztcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaW1wbGVSdWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmICgoZXhlY0FyciA9IHNpbXBsZVJ1bGVzW2ldLmV4ZWMobmV4dFBhcnQpKSkge1xuICAgICAgICAgICAgbmV4dFBhcnQgPSBuZXh0UGFydC5zdWJzdHJpbmcoZXhlY0FyclswXS5sZW5ndGgpO1xuICAgICAgICAgICAgY29uc3QgdHlwZSA9ICdzaW1wbGVSdWxlJyArIChpICsgMSk7XG4gICAgICAgICAgICB0aGlzLnRva2Vucy5wdXNoKHsgdHlwZSwgZXhlY0FyciB9KTtcbiAgICAgICAgICAgIGNvbnRpbnVlIG1haW5Mb29wO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyB0b3AtbGV2ZWwgcGFyYWdyYXBoXG4gICAgICBpZiAodG9wICYmIChleGVjQXJyID0gdGhpcy5ydWxlcy5wYXJhZ3JhcGguZXhlYyhuZXh0UGFydCkpKSB7XG4gICAgICAgIG5leHRQYXJ0ID0gbmV4dFBhcnQuc3Vic3RyaW5nKGV4ZWNBcnJbMF0ubGVuZ3RoKTtcblxuICAgICAgICBpZiAoZXhlY0FyclsxXS5zbGljZSgtMSkgPT09ICdcXG4nKSB7XG4gICAgICAgICAgdGhpcy50b2tlbnMucHVzaCh7XG4gICAgICAgICAgICB0eXBlOiBUb2tlblR5cGUucGFyYWdyYXBoLFxuICAgICAgICAgICAgdGV4dDogZXhlY0FyclsxXS5zbGljZSgwLCAtMSksXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy50b2tlbnMucHVzaCh7XG4gICAgICAgICAgICB0eXBlOiB0aGlzLnRva2Vucy5sZW5ndGggPiAwID8gVG9rZW5UeXBlLnBhcmFncmFwaCA6IFRva2VuVHlwZS50ZXh0LFxuICAgICAgICAgICAgdGV4dDogZXhlY0FyclsxXSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gdGV4dFxuICAgICAgLy8gVG9wLWxldmVsIHNob3VsZCBuZXZlciByZWFjaCBoZXJlLlxuICAgICAgaWYgKChleGVjQXJyID0gdGhpcy5ydWxlcy50ZXh0LmV4ZWMobmV4dFBhcnQpKSkge1xuICAgICAgICBuZXh0UGFydCA9IG5leHRQYXJ0LnN1YnN0cmluZyhleGVjQXJyWzBdLmxlbmd0aCk7XG4gICAgICAgIHRoaXMudG9rZW5zLnB1c2goeyB0eXBlOiBUb2tlblR5cGUudGV4dCwgdGV4dDogZXhlY0FyclswXSB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChuZXh0UGFydCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgJ0luZmluaXRlIGxvb3Agb24gYnl0ZTogJyArIG5leHRQYXJ0LmNoYXJDb2RlQXQoMCkgKyBgLCBuZWFyIHRleHQgJyR7bmV4dFBhcnQuc2xpY2UoMCwgMzApfS4uLidgXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgdG9rZW5zOiB0aGlzLnRva2VucywgbGlua3M6IHRoaXMubGlua3MgfTtcbiAgfVxufVxuIiwgIi8qKlxuICogR2VuZXJhdGVkIGJ1bmRsZSBpbmRleC4gRG8gbm90IGVkaXQuXG4gKi9cblxuZXhwb3J0ICogZnJvbSAnLi9wdWJsaWMtYXBpJztcbiIsICJpbXBvcnQgeyBLRXhwb3J0IH0gZnJvbSAnay1leHBvcnQnXG5jb25zdCBrZXggPSBuZXcgS0V4cG9ydCgnfi9EZXNrdG9wL2tpaWNoaS1wb3J0Zm9saW8vcHVibGljJyAsLy8gc291cmNlIGZvbGRlciAvLyd+L0xpYnJhcnkvTW9iaWxlIERvY3VtZW50cy9pQ2xvdWR+bWR+b2JzaWRpYW4vRG9jdW1lbnRzL29ic2lkaWFuLWtpaWNoaS1wb3J0Zm9saW8vJyxcbiAgICAgICAgICAgICd+L0Rlc2t0b3Ava2lpY2hpLXBvcnRmb2xpby9wdWJsaWMnLCAvLyB0ZW1wbGF0ZSBmb2xkZXJcbiAgICAgICAgICAgICd+L0Rlc2t0b3Ava2lpY2hpLXBvcnRmb2xpby9wdWJsaWMnKTsgLy8gZGVzdGluYXRpb24gZm9sZGVyXG5rZXguc3RhcnQoKTsiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7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
