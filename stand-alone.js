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
      repeaterHtmlArr.push(item.getRepeaterHtml());
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiay1leHBvcnQudHMiLCAibm9kZV9tb2R1bGVzL0B0cy1zdGFjay9wcm9qZWN0cy9tYXJrZG93bi9zcmMvZXh0ZW5kLXJlZ2V4cC50cyIsICJub2RlX21vZHVsZXMvQHRzLXN0YWNrL3Byb2plY3RzL21hcmtkb3duL3NyYy9oZWxwZXJzLnRzIiwgIm5vZGVfbW9kdWxlcy9AdHMtc3RhY2svcHJvamVjdHMvbWFya2Rvd24vc3JjL2ludGVyZmFjZXMudHMiLCAibm9kZV9tb2R1bGVzL0B0cy1zdGFjay9wcm9qZWN0cy9tYXJrZG93bi9zcmMvcmVuZGVyZXIudHMiLCAibm9kZV9tb2R1bGVzL0B0cy1zdGFjay9wcm9qZWN0cy9tYXJrZG93bi9zcmMvaW5saW5lLWxleGVyLnRzIiwgIm5vZGVfbW9kdWxlcy9AdHMtc3RhY2svcHJvamVjdHMvbWFya2Rvd24vc3JjL3BhcnNlci50cyIsICJub2RlX21vZHVsZXMvQHRzLXN0YWNrL3Byb2plY3RzL21hcmtkb3duL3NyYy9tYXJrZWQudHMiLCAibm9kZV9tb2R1bGVzL0B0cy1zdGFjay9wcm9qZWN0cy9tYXJrZG93bi9zcmMvYmxvY2stbGV4ZXIudHMiLCAibm9kZV9tb2R1bGVzL0B0cy1zdGFjay9wcm9qZWN0cy9tYXJrZG93bi90cy1zdGFjay1tYXJrZG93bi50cyIsICJzdGFuZC1hbG9uZS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIG9zIGZyb20gJ29zJztcbmltcG9ydCB7IE1hcmtlZCwgUmVuZGVyZXIgfSBmcm9tICdAdHMtc3RhY2svbWFya2Rvd24nO1xuXG5jbGFzcyBNeVJlbmRlcmVyIGV4dGVuZHMgUmVuZGVyZXIge1xuICAvLyBpbWFnZSBlbWJlZCBhcyAzLUQgdmlld2VyIGlmIHRoZSBleHQgaXMgLmdsYi4gYWRkIC4vIGZvciB0aGUgcGF0aFxuICAvLyBodHRwczovL2RvYy5iYWJ5bG9uanMuY29tL2ZlYXR1cmVzL2ZlYXR1cmVzRGVlcERpdmUvYmFieWxvblZpZXdlci9kZWZhdWx0Vmlld2VyQ29uZmlnXG4gIGltYWdlKGhyZWY6IHN0cmluZywgdGl0bGU6IHN0cmluZywgdGV4dDogc3RyaW5nKTogc3RyaW5ne1xuICAgIGlmIChocmVmLmVuZHNXaXRoKCcuZ2xiJykpe1xuICAgICAgICByZXR1cm4gYDxiYWJ5bG9uIFxuICAgICAgICB0ZW1wbGF0ZXMubmF2LWJhci5wYXJhbXMubG9nby1pbWFnZT1cIi9pbWFnZXMvZmF2aWNvbi9hcHBsZS1pY29uLnBuZ1wiIFxuICAgICAgICB0ZW1wbGF0ZXMubmF2LWJhci5wYXJhbXMubG9nby10ZXh0PVwiQ29weXJpZ2h0IEtpaWNoaSBUYWtldWNoaVwiIFxuICAgICAgICB0ZW1wbGF0ZXMubmF2LWJhci5wYXJhbXMubG9nby1saW5rPVwiaHR0cHM6Ly9raWljaGl0YWtldWNoaS5jb20vXCIgXG4gICAgICAgIG1vZGVsPVwiLi8ke2hyZWZ9XCIgPjwvYmFieWxvbj5gXG4gICAgfVxuICAgIHJldHVybiBzdXBlci5pbWFnZShocmVmLHRpdGxlLHRleHQpO1xuICB9XG4gIGxpbmsoaHJlZjogc3RyaW5nLCB0aXRsZTogc3RyaW5nLCB0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGlmIChocmVmLnN0YXJ0c1dpdGgoXCJodHRwczovL3lvdXR1LmJlL1wiKSB8fCBocmVmLnN0YXJ0c1dpdGgoXCJodHRwczovL3d3dy55b3V0dWJlLmNvbS93YXRjaD92PVwiKSl7XG4gICAgICAgIGNvbnN0IHZpZGVvSWQgPSBocmVmLnJlcGxhY2UoXCJodHRwczovL3lvdXR1LmJlL1wiLCcnKS5yZXBsYWNlKFwiaHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1cIiwnJyk7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgIDxpZnJhbWUgd2lkdGg9XCI1NjBcIiBoZWlnaHQ9XCIzMTVcIiBcbiAgICAgICAgc3JjPVwiaHR0cHM6Ly93d3cueW91dHViZS5jb20vZW1iZWQvJHt2aWRlb0lkfVwiIFxuICAgICAgICB0aXRsZT1cIllvdVR1YmUgdmlkZW8gcGxheWVyXCIgZnJhbWVib3JkZXI9XCIwXCIgXG4gICAgICAgIGFsbG93PVwiYWNjZWxlcm9tZXRlcjsgYXV0b3BsYXk7IGNsaXBib2FyZC13cml0ZTsgZW5jcnlwdGVkLW1lZGlhOyBneXJvc2NvcGU7IHBpY3R1cmUtaW4tcGljdHVyZTsgd2ViLXNoYXJlXCIgXG4gICAgICAgIGFsbG93ZnVsbHNjcmVlbj48L2lmcmFtZT5cbiAgICAgICAgYDtcbiAgICB9ICAgIFxuICAgIGVsc2UgaWYgKGhyZWYuc3RhcnRzV2l0aChcImh0dHBzOi8vd3d3Lmluc3RhZ3JhbS5jb20vcC9cIikpe1xuICAgICAgICBjb25zdCBpbnN0YWdyYW1JZCA9IGhyZWYucmVwbGFjZSgnaHR0cHM6Ly93d3cuaW5zdGFncmFtLmNvbS9wLycsJycpLnJlcGxhY2UoJ1xcLycsJycpO1xuICAgICAgICByZXR1cm4gYFxuICAgICAgICA8YmxvY2txdW90ZSBjbGFzcz1cImluc3RhZ3JhbS1tZWRpYVwiIFxuICAgICAgICBkYXRhLWluc3Rncm0tY2FwdGlvbmVkIFxuICAgICAgICBkYXRhLWluc3Rncm0tcGVybWFsaW5rPVwiaHR0cHM6Ly93d3cuaW5zdGFncmFtLmNvbS9yZWVsLyR7aW5zdGFncmFtSWR9Lz91dG1fc291cmNlPWlnX2VtYmVkJmFtcDt1dG1fY2FtcGFpZ249bG9hZGluZ1wiIFxuICAgICAgICBkYXRhLWluc3Rncm0tdmVyc2lvbj1cIjE0XCIgc3R5bGU9XCIgXG4gICAgICAgIGJhY2tncm91bmQ6IzIyMjsgYm9yZGVyOjA7IGJvcmRlci1yYWRpdXM6M3B4OyBib3gtc2hhZG93OjAgMCAxcHggMCByZ2JhKDAsMCwwLDAuNSksMCAxcHggMTBweCAwIHJnYmEoMCwwLDAsMC4xNSk7IG1hcmdpbjogMXB4OyBtYXgtd2lkdGg6NTQwcHg7IG1pbi13aWR0aDozMjZweDsgcGFkZGluZzowOyB3aWR0aDo5OS4zNzUlOyB3aWR0aDotd2Via2l0LWNhbGMoMTAwJSAtIDJweCk7IHdpZHRoOmNhbGMoMTAwJSAtIDJweCk7XCI+PGRpdiBzdHlsZT1cInBhZGRpbmc6MTZweDtcIj4gPGEgaHJlZj1cImh0dHBzOi8vd3d3Lmluc3RhZ3JhbS5jb20vcmVlbC9DbHpmZlc0Z3U3Wi8/dXRtX3NvdXJjZT1pZ19lbWJlZCZhbXA7dXRtX2NhbXBhaWduPWxvYWRpbmdcIiBzdHlsZT1cIiBiYWNrZ3JvdW5kOiNGRkZGRkY7IGxpbmUtaGVpZ2h0OjA7IHBhZGRpbmc6MCAwOyB0ZXh0LWFsaWduOmNlbnRlcjsgdGV4dC1kZWNvcmF0aW9uOm5vbmU7IHdpZHRoOjEwMCU7XCIgdGFyZ2V0PVwiX2JsYW5rXCI+IDxkaXYgc3R5bGU9XCIgZGlzcGxheTogZmxleDsgZmxleC1kaXJlY3Rpb246IHJvdzsgYWxpZ24taXRlbXM6IGNlbnRlcjtcIj4gPGRpdiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6ICNGNEY0RjQ7IGJvcmRlci1yYWRpdXM6IDUwJTsgZmxleC1ncm93OiAwOyBoZWlnaHQ6IDQwcHg7IG1hcmdpbi1yaWdodDogMTRweDsgd2lkdGg6IDQwcHg7XCI+PC9kaXY+IDxkaXYgc3R5bGU9XCJkaXNwbGF5OiBmbGV4OyBmbGV4LWRpcmVjdGlvbjogY29sdW1uOyBmbGV4LWdyb3c6IDE7IGp1c3RpZnktY29udGVudDogY2VudGVyO1wiPiA8ZGl2IHN0eWxlPVwiIGJhY2tncm91bmQtY29sb3I6ICNGNEY0RjQ7IGJvcmRlci1yYWRpdXM6IDRweDsgZmxleC1ncm93OiAwOyBoZWlnaHQ6IDE0cHg7IG1hcmdpbi1ib3R0b206IDZweDsgd2lkdGg6IDEwMHB4O1wiPjwvZGl2PiA8ZGl2IHN0eWxlPVwiIGJhY2tncm91bmQtY29sb3I6ICNGNEY0RjQ7IGJvcmRlci1yYWRpdXM6IDRweDsgZmxleC1ncm93OiAwOyBoZWlnaHQ6IDE0cHg7IHdpZHRoOiA2MHB4O1wiPjwvZGl2PjwvZGl2PjwvZGl2PjxkaXYgc3R5bGU9XCJwYWRkaW5nOiAxOSUgMDtcIj48L2Rpdj4gPGRpdiBzdHlsZT1cImRpc3BsYXk6YmxvY2s7IGhlaWdodDo1MHB4OyBtYXJnaW46MCBhdXRvIDEycHg7IHdpZHRoOjUwcHg7XCI+PHN2ZyB3aWR0aD1cIjUwcHhcIiBoZWlnaHQ9XCI1MHB4XCIgdmlld0JveD1cIjAgMCA2MCA2MFwiIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHBzOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cHM6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIj48ZyBzdHJva2U9XCJub25lXCIgc3Ryb2tlLXdpZHRoPVwiMVwiIGZpbGw9XCJub25lXCIgZmlsbC1ydWxlPVwiZXZlbm9kZFwiPjxnIHRyYW5zZm9ybT1cInRyYW5zbGF0ZSgtNTExLjAwMDAwMCwgLTIwLjAwMDAwMClcIiBmaWxsPVwiIzAwMDAwMFwiPjxnPjxwYXRoIGQ9XCJNNTU2Ljg2OSwzMC40MSBDNTU0LjgxNCwzMC40MSA1NTMuMTQ4LDMyLjA3NiA1NTMuMTQ4LDM0LjEzMSBDNTUzLjE0OCwzNi4xODYgNTU0LjgxNCwzNy44NTIgNTU2Ljg2OSwzNy44NTIgQzU1OC45MjQsMzcuODUyIDU2MC41OSwzNi4xODYgNTYwLjU5LDM0LjEzMSBDNTYwLjU5LDMyLjA3NiA1NTguOTI0LDMwLjQxIDU1Ni44NjksMzAuNDEgTTU0MSw2MC42NTcgQzUzNS4xMTQsNjAuNjU3IDUzMC4zNDIsNTUuODg3IDUzMC4zNDIsNTAgQzUzMC4zNDIsNDQuMTE0IDUzNS4xMTQsMzkuMzQyIDU0MSwzOS4zNDIgQzU0Ni44ODcsMzkuMzQyIDU1MS42NTgsNDQuMTE0IDU1MS42NTgsNTAgQzU1MS42NTgsNTUuODg3IDU0Ni44ODcsNjAuNjU3IDU0MSw2MC42NTcgTTU0MSwzMy44ODYgQzUzMi4xLDMzLjg4NiA1MjQuODg2LDQxLjEgNTI0Ljg4Niw1MCBDNTI0Ljg4Niw1OC44OTkgNTMyLjEsNjYuMTEzIDU0MSw2Ni4xMTMgQzU0OS45LDY2LjExMyA1NTcuMTE1LDU4Ljg5OSA1NTcuMTE1LDUwIEM1NTcuMTE1LDQxLjEgNTQ5LjksMzMuODg2IDU0MSwzMy44ODYgTTU2NS4zNzgsNjIuMTAxIEM1NjUuMjQ0LDY1LjAyMiA1NjQuNzU2LDY2LjYwNiA1NjQuMzQ2LDY3LjY2MyBDNTYzLjgwMyw2OS4wNiA1NjMuMTU0LDcwLjA1NyA1NjIuMTA2LDcxLjEwNiBDNTYxLjA1OCw3Mi4xNTUgNTYwLjA2LDcyLjgwMyA1NTguNjYyLDczLjM0NyBDNTU3LjYwNyw3My43NTcgNTU2LjAyMSw3NC4yNDQgNTUzLjEwMiw3NC4zNzggQzU0OS45NDQsNzQuNTIxIDU0OC45OTcsNzQuNTUyIDU0MSw3NC41NTIgQzUzMy4wMDMsNzQuNTUyIDUzMi4wNTYsNzQuNTIxIDUyOC44OTgsNzQuMzc4IEM1MjUuOTc5LDc0LjI0NCA1MjQuMzkzLDczLjc1NyA1MjMuMzM4LDczLjM0NyBDNTIxLjk0LDcyLjgwMyA1MjAuOTQyLDcyLjE1NSA1MTkuODk0LDcxLjEwNiBDNTE4Ljg0Niw3MC4wNTcgNTE4LjE5Nyw2OS4wNiA1MTcuNjU0LDY3LjY2MyBDNTE3LjI0NCw2Ni42MDYgNTE2Ljc1NSw2NS4wMjIgNTE2LjYyMyw2Mi4xMDEgQzUxNi40NzksNTguOTQzIDUxNi40NDgsNTcuOTk2IDUxNi40NDgsNTAgQzUxNi40NDgsNDIuMDAzIDUxNi40NzksNDEuMDU2IDUxNi42MjMsMzcuODk5IEM1MTYuNzU1LDM0Ljk3OCA1MTcuMjQ0LDMzLjM5MSA1MTcuNjU0LDMyLjMzOCBDNTE4LjE5NywzMC45MzggNTE4Ljg0NiwyOS45NDIgNTE5Ljg5NCwyOC44OTQgQzUyMC45NDIsMjcuODQ2IDUyMS45NCwyNy4xOTYgNTIzLjMzOCwyNi42NTQgQzUyNC4zOTMsMjYuMjQ0IDUyNS45NzksMjUuNzU2IDUyOC44OTgsMjUuNjIzIEM1MzIuMDU3LDI1LjQ3OSA1MzMuMDA0LDI1LjQ0OCA1NDEsMjUuNDQ4IEM1NDguOTk3LDI1LjQ0OCA1NDkuOTQzLDI1LjQ3OSA1NTMuMTAyLDI1LjYyMyBDNTU2LjAyMSwyNS43NTYgNTU3LjYwNywyNi4yNDQgNTU4LjY2MiwyNi42NTQgQzU2MC4wNiwyNy4xOTYgNTYxLjA1OCwyNy44NDYgNTYyLjEwNiwyOC44OTQgQzU2My4xNTQsMjkuOTQyIDU2My44MDMsMzAuOTM4IDU2NC4zNDYsMzIuMzM4IEM1NjQuNzU2LDMzLjM5MSA1NjUuMjQ0LDM0Ljk3OCA1NjUuMzc4LDM3Ljg5OSBDNTY1LjUyMiw0MS4wNTYgNTY1LjU1Miw0Mi4wMDMgNTY1LjU1Miw1MCBDNTY1LjU1Miw1Ny45OTYgNTY1LjUyMiw1OC45NDMgNTY1LjM3OCw2Mi4xMDEgTTU3MC44MiwzNy42MzEgQzU3MC42NzQsMzQuNDM4IDU3MC4xNjcsMzIuMjU4IDU2OS40MjUsMzAuMzQ5IEM1NjguNjU5LDI4LjM3NyA1NjcuNjMzLDI2LjcwMiA1NjUuOTY1LDI1LjAzNSBDNTY0LjI5NywyMy4zNjggNTYyLjYyMywyMi4zNDIgNTYwLjY1MiwyMS41NzUgQzU1OC43NDMsMjAuODM0IDU1Ni41NjIsMjAuMzI2IDU1My4zNjksMjAuMTggQzU1MC4xNjksMjAuMDMzIDU0OS4xNDgsMjAgNTQxLDIwIEM1MzIuODUzLDIwIDUzMS44MzEsMjAuMDMzIDUyOC42MzEsMjAuMTggQzUyNS40MzgsMjAuMzI2IDUyMy4yNTcsMjAuODM0IDUyMS4zNDksMjEuNTc1IEM1MTkuMzc2LDIyLjM0MiA1MTcuNzAzLDIzLjM2OCA1MTYuMDM1LDI1LjAzNSBDNTE0LjM2OCwyNi43MDIgNTEzLjM0MiwyOC4zNzcgNTEyLjU3NCwzMC4zNDkgQzUxMS44MzQsMzIuMjU4IDUxMS4zMjYsMzQuNDM4IDUxMS4xODEsMzcuNjMxIEM1MTEuMDM1LDQwLjgzMSA1MTEsNDEuODUxIDUxMSw1MCBDNTExLDU4LjE0NyA1MTEuMDM1LDU5LjE3IDUxMS4xODEsNjIuMzY5IEM1MTEuMzI2LDY1LjU2MiA1MTEuODM0LDY3Ljc0MyA1MTIuNTc0LDY5LjY1MSBDNTEzLjM0Miw3MS42MjUgNTE0LjM2OCw3My4yOTYgNTE2LjAzNSw3NC45NjUgQzUxNy43MDMsNzYuNjM0IDUxOS4zNzYsNzcuNjU4IDUyMS4zNDksNzguNDI1IEM1MjMuMjU3LDc5LjE2NyA1MjUuNDM4LDc5LjY3MyA1MjguNjMxLDc5LjgyIEM1MzEuODMxLDc5Ljk2NSA1MzIuODUzLDgwLjAwMSA1NDEsODAuMDAxIEM1NDkuMTQ4LDgwLjAwMSA1NTAuMTY5LDc5Ljk2NSA1NTMuMzY5LDc5LjgyIEM1NTYuNTYyLDc5LjY3MyA1NTguNzQzLDc5LjE2NyA1NjAuNjUyLDc4LjQyNSBDNTYyLjYyMyw3Ny42NTggNTY0LjI5Nyw3Ni42MzQgNTY1Ljk2NSw3NC45NjUgQzU2Ny42MzMsNzMuMjk2IDU2OC42NTksNzEuNjI1IDU2OS40MjUsNjkuNjUxIEM1NzAuMTY3LDY3Ljc0MyA1NzAuNjc0LDY1LjU2MiA1NzAuODIsNjIuMzY5IEM1NzAuOTY2LDU5LjE3IDU3MSw1OC4xNDcgNTcxLDUwIEM1NzEsNDEuODUxIDU3MC45NjYsNDAuODMxIDU3MC44MiwzNy42MzFcIj48L3BhdGg+PC9nPjwvZz48L2c+PC9zdmc+PC9kaXY+PGRpdiBzdHlsZT1cInBhZGRpbmctdG9wOiA4cHg7XCI+IDxkaXYgc3R5bGU9XCIgY29sb3I6IzM4OTdmMDsgZm9udC1mYW1pbHk6QXJpYWwsc2Fucy1zZXJpZjsgZm9udC1zaXplOjE0cHg7IGZvbnQtc3R5bGU6bm9ybWFsOyBmb250LXdlaWdodDo1NTA7IGxpbmUtaGVpZ2h0OjE4cHg7XCI+VmlldyB0aGlzIHBvc3Qgb24gSW5zdGFncmFtPC9kaXY+PC9kaXY+PGRpdiBzdHlsZT1cInBhZGRpbmc6IDEyLjUlIDA7XCI+PC9kaXY+IDxkaXYgc3R5bGU9XCJkaXNwbGF5OiBmbGV4OyBmbGV4LWRpcmVjdGlvbjogcm93OyBtYXJnaW4tYm90dG9tOiAxNHB4OyBhbGlnbi1pdGVtczogY2VudGVyO1wiPjxkaXY+IDxkaXYgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOiAjRjRGNEY0OyBib3JkZXItcmFkaXVzOiA1MCU7IGhlaWdodDogMTIuNXB4OyB3aWR0aDogMTIuNXB4OyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMHB4KSB0cmFuc2xhdGVZKDdweCk7XCI+PC9kaXY+IDxkaXYgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOiAjRjRGNEY0OyBoZWlnaHQ6IDEyLjVweDsgdHJhbnNmb3JtOiByb3RhdGUoLTQ1ZGVnKSB0cmFuc2xhdGVYKDNweCkgdHJhbnNsYXRlWSgxcHgpOyB3aWR0aDogMTIuNXB4OyBmbGV4LWdyb3c6IDA7IG1hcmdpbi1yaWdodDogMTRweDsgbWFyZ2luLWxlZnQ6IDJweDtcIj48L2Rpdj4gPGRpdiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6ICNGNEY0RjQ7IGJvcmRlci1yYWRpdXM6IDUwJTsgaGVpZ2h0OiAxMi41cHg7IHdpZHRoOiAxMi41cHg7IHRyYW5zZm9ybTogdHJhbnNsYXRlWCg5cHgpIHRyYW5zbGF0ZVkoLTE4cHgpO1wiPjwvZGl2PjwvZGl2PjxkaXYgc3R5bGU9XCJtYXJnaW4tbGVmdDogOHB4O1wiPiA8ZGl2IHN0eWxlPVwiIGJhY2tncm91bmQtY29sb3I6ICNGNEY0RjQ7IGJvcmRlci1yYWRpdXM6IDUwJTsgZmxleC1ncm93OiAwOyBoZWlnaHQ6IDIwcHg7IHdpZHRoOiAyMHB4O1wiPjwvZGl2PiA8ZGl2IHN0eWxlPVwiIHdpZHRoOiAwOyBoZWlnaHQ6IDA7IGJvcmRlci10b3A6IDJweCBzb2xpZCB0cmFuc3BhcmVudDsgYm9yZGVyLWxlZnQ6IDZweCBzb2xpZCAjZjRmNGY0OyBib3JkZXItYm90dG9tOiAycHggc29saWQgdHJhbnNwYXJlbnQ7IHRyYW5zZm9ybTogdHJhbnNsYXRlWCgxNnB4KSB0cmFuc2xhdGVZKC00cHgpIHJvdGF0ZSgzMGRlZylcIj48L2Rpdj48L2Rpdj48ZGl2IHN0eWxlPVwibWFyZ2luLWxlZnQ6IGF1dG87XCI+IDxkaXYgc3R5bGU9XCIgd2lkdGg6IDBweDsgYm9yZGVyLXRvcDogOHB4IHNvbGlkICNGNEY0RjQ7IGJvcmRlci1yaWdodDogOHB4IHNvbGlkIHRyYW5zcGFyZW50OyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMTZweCk7XCI+PC9kaXY+IDxkaXYgc3R5bGU9XCIgYmFja2dyb3VuZC1jb2xvcjogI0Y0RjRGNDsgZmxleC1ncm93OiAwOyBoZWlnaHQ6IDEycHg7IHdpZHRoOiAxNnB4OyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTRweCk7XCI+PC9kaXY+IDxkaXYgc3R5bGU9XCIgd2lkdGg6IDA7IGhlaWdodDogMDsgYm9yZGVyLXRvcDogOHB4IHNvbGlkICNGNEY0RjQ7IGJvcmRlci1sZWZ0OiA4cHggc29saWQgdHJhbnNwYXJlbnQ7IHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNHB4KSB0cmFuc2xhdGVYKDhweCk7XCI+PC9kaXY+PC9kaXY+PC9kaXY+IDxkaXYgc3R5bGU9XCJkaXNwbGF5OiBmbGV4OyBmbGV4LWRpcmVjdGlvbjogY29sdW1uOyBmbGV4LWdyb3c6IDE7IGp1c3RpZnktY29udGVudDogY2VudGVyOyBtYXJnaW4tYm90dG9tOiAyNHB4O1wiPiA8ZGl2IHN0eWxlPVwiIGJhY2tncm91bmQtY29sb3I6ICNGNEY0RjQ7IGJvcmRlci1yYWRpdXM6IDRweDsgZmxleC1ncm93OiAwOyBoZWlnaHQ6IDE0cHg7IG1hcmdpbi1ib3R0b206IDZweDsgd2lkdGg6IDIyNHB4O1wiPjwvZGl2PiA8ZGl2IHN0eWxlPVwiIGJhY2tncm91bmQtY29sb3I6ICNGNEY0RjQ7IGJvcmRlci1yYWRpdXM6IDRweDsgZmxleC1ncm93OiAwOyBoZWlnaHQ6IDE0cHg7IHdpZHRoOiAxNDRweDtcIj48L2Rpdj48L2Rpdj48L2E+PHAgc3R5bGU9XCIgY29sb3I6I2M5YzhjZDsgZm9udC1mYW1pbHk6QXJpYWwsc2Fucy1zZXJpZjsgZm9udC1zaXplOjE0cHg7IGxpbmUtaGVpZ2h0OjE3cHg7IG1hcmdpbi1ib3R0b206MDsgbWFyZ2luLXRvcDo4cHg7IG92ZXJmbG93OmhpZGRlbjsgcGFkZGluZzo4cHggMCA3cHg7IHRleHQtYWxpZ246Y2VudGVyOyB0ZXh0LW92ZXJmbG93OmVsbGlwc2lzOyB3aGl0ZS1zcGFjZTpub3dyYXA7XCI+PGEgaHJlZj1cImh0dHBzOi8vd3d3Lmluc3RhZ3JhbS5jb20vcmVlbC9DbHpmZlc0Z3U3Wi8/dXRtX3NvdXJjZT1pZ19lbWJlZCZhbXA7dXRtX2NhbXBhaWduPWxvYWRpbmdcIiBzdHlsZT1cIiBjb2xvcjojYzljOGNkOyBmb250LWZhbWlseTpBcmlhbCxzYW5zLXNlcmlmOyBmb250LXNpemU6MTRweDsgZm9udC1zdHlsZTpub3JtYWw7IGZvbnQtd2VpZ2h0Om5vcm1hbDsgbGluZS1oZWlnaHQ6MTdweDsgdGV4dC1kZWNvcmF0aW9uOm5vbmU7XCIgdGFyZ2V0PVwiX2JsYW5rXCI+QSBwb3N0IHNoYXJlZCBieSBLaWljaGlcdTIwMTlzIEJlbnRvIGFuZCBDZXJhbWljcyAoQGJlbnRvZ3JhbTIyKTwvYT48L3A+PC9kaXY+XG4gICAgICAgIDwvYmxvY2txdW90ZT4gXG4gICAgICAgIDxzY3JpcHQgYXN5bmMgc3JjPVwiLy93d3cuaW5zdGFncmFtLmNvbS9lbWJlZC5qc1wiPjwvc2NyaXB0PlxuICAgICAgICBgO1xuICAgIH1cbiAgICByZXR1cm4gc3VwZXIubGluayhocmVmLHRpdGxlLCB0ZXh0KTtcbiAgfVxufVxuTWFya2VkLnNldE9wdGlvbnMoe3JlbmRlcmVyOiBuZXcgTXlSZW5kZXJlcn0pO1xuXG5jbGFzcyBHZW5lcmljSXRlbSB7XG4gICAgbWRyYXc6c3RyaW5nID0gJyc7XG4gICAgbWRGaWxlUGF0aDpzdHJpbmcgPSAnJztcbiAgICBodG1sRmlsZVBhdGg6c3RyaW5nID0gJyc7XG4gICAgY29uc3RydWN0b3IoaW5NRFJhdzpzdHJpbmcpe1xuICAgICAgICB0aGlzLm1kcmF3ID0gaW5NRFJhdztcbiAgICB9XG5cbiAgICBnZXRIdG1sKCl7XG4gICAgICAgIHJldHVybiBNYXJrZWQucGFyc2UodGhpcy5tZHJhdyk7XG4gICAgfVxufVxuXG5jbGFzcyBBcnRpY2xlSXRlbSBleHRlbmRzIEdlbmVyaWNJdGVtIHtcbiAgICB0aXRsZTpzdHJpbmcgPSAnJztcbiAgICBzdW1tYXJ5OnN0cmluZyA9ICcnO1xuICAgIHRhZ3M6c3RyaW5nID0gJyc7XG4gICAgZGF0ZTpzdHJpbmcgPSAnJztcbiAgICBpbWFnZTpzdHJpbmcgPSAnJztcbiAgICBmaWxlUGF0aDpzdHJpbmcgPSAnJztcblxuICAgIGNvbnN0cnVjdG9yKGluTURSYXc6c3RyaW5nLCBpbkRpclBhdGg6c3RyaW5nLCBpbkZpbGVQYXRoOnN0cmluZyl7XG4gICAgICAgIHN1cGVyKGluTURSYXcpO1xuXG4gICAgICAgIGNvbnN0IGxpbmVzID0gdGhpcy5tZHJhdy5zcGxpdCgnXFxuJykuZmlsdGVyKCh4KT0+eCk7XG4gICAgICAgIGxldCBjb3VudGVyID0gMDtcbiAgICAgICAgbGV0IHRtcFN1bSA9ICcnO1xuICAgICAgICBmb3IgKGxldCBsaW5lIG9mIGxpbmVzKXtcbiAgICAgICAgICAgIGlmIChsaW5lLnN0YXJ0c1dpdGgoJyMgJykpe1xuICAgICAgICAgICAgICAgIGlmIChjb3VudGVyID09IDApe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRpdGxlID0gbGluZS5yZXBsYWNlKCcjICcsJycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvdW50ZXIrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjb3VudGVyID09IDEpe1xuICAgICAgICAgICAgICAgIGlmIChsaW5lLnN0YXJ0c1dpdGgoJy0gRGF0ZTonKSl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0ZSA9IGxpbmUucmVwbGFjZSgnLSBEYXRlOicsJycpLnRyaW0oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobGluZS5zdGFydHNXaXRoKCctIFRhZ3M6Jykpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRhZ3MgPSBsaW5lLnJlcGxhY2UoJy0gVGFnczonLCcnKS50cmltKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGxpbmUuc3RhcnRzV2l0aCgnIVtdKCcpKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2xlYW5lZCA9IGxpbmUucmVwbGFjZSgnIVtdKCcsJycpLnJlcGxhY2UoJyknLCcnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmltYWdlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2UgPSAgcGF0aC5qb2luKGluRGlyUGF0aCwgY2xlYW5lZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobGluZS5zdGFydHNXaXRoKCcjICcpKXtcbiAgICAgICAgICAgICAgICAgICAgLy8gbm90aGluZ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdG1wU3VtICs9IGxpbmU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdW1tYXJ5ID0gTWFya2VkLnBhcnNlKCh0bXBTdW0ubGVuZ3RoID4gMzAwKSA/IHRtcFN1bS5zdWJzdHJpbmcoMCwzMDApICsgJyAmbWxkcjsgJyA6IHRtcFN1bSk7XG4gICAgICAgIHRoaXMuZmlsZVBhdGggPSBpbkZpbGVQYXRoO1xuICAgIH1cbiAgICBnZXREYXRlKCl7XG4gICAgICAgIHJldHVybiAoKG5ldyBEYXRlKHRoaXMuZGF0ZSArICcgJykpLmdldERhdGUoKSk7XG4gICAgfVxuICAgIGdldE1vbnRoKCl7ICAgICAgICBcbiAgICAgICAgcmV0dXJuIChuZXcgRGF0ZSh0aGlzLmRhdGUgKyAnICcpKS50b0xvY2FsZVN0cmluZygnZW4tVVMnLCB7bW9udGg6ICdzaG9ydCd9KS50b0xvY2FsZVVwcGVyQ2FzZSgpO1xuICAgIH1cbiAgICBnZXREYXRlU3RyKCl7XG4gICAgICAgIHJldHVybiAobmV3IERhdGUodGhpcy5kYXRlICsgJyAnKSkudG9Mb2NhbGVEYXRlU3RyaW5nKCk7XG4gICAgfVxuICAgIGdldFJlcGVhdGVySHRtbCgpe1xuICAgICAgICByZXR1cm4gYFxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTQgYmxvZ2xpc3QgJHt0aGlzLnRhZ3MucmVwbGFjZSgnIycsJycpfVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwb3N0LWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwb3N0LWltYWdlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9XCIke3RoaXMuaW1hZ2V9XCIgYWx0PVwiXCIgZHJhZ2dhYmxlPVwiZmFsc2VcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRhdGUtYm94XCI+PHNwYW4gY2xhc3M9XCJkYXlcIj4ke3RoaXMuZ2V0RGF0ZSgpfTwvc3Bhbj4gPHNwYW4gY2xhc3M9XCJtb250aFwiPiR7dGhpcy5nZXRNb250aCgpfTwvc3Bhbj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwb3N0LXRleHRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDM+PGEgaHJlZj1cIiR7dGhpcy5maWxlUGF0aH1cIj4ke3RoaXMudGl0bGV9PC9hPjwvaDM+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBvc3Qtc3VtbWFyeVwiPiR7dGhpcy5zdW1tYXJ5fTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIke3RoaXMuZmlsZVBhdGh9XCIgY2xhc3M9XCJidG4tdGV4dFwiPlJlYWQgTW9yZTwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYFxuICAgIH1cbn1cbmNsYXNzIEdhbGxlcnlJdGVtIGV4dGVuZHMgR2VuZXJpY0l0ZW0ge1xuICAgIHRpdGxlOnN0cmluZyA9ICcnO1xuICAgIHRhZ3M6c3RyaW5nID0gJyc7XG4gICAgZGF0ZTpzdHJpbmcgPSAnJztcbiAgICBwbGFjZTpzdHJpbmcgPSAnJztcbiAgICBtZWRpdW06c3RyaW5nID0gJyc7XG4gICAgZGltZW5zaW9uczpzdHJpbmcgPSAnJztcbiAgICBubzpzdHJpbmcgPSAnJztcbiAgICBvcmRudW06bnVtYmVyID0gMDtcbiAgICBzb2xkOmJvb2xlYW4gPSBmYWxzZTtcbiAgICBkZXNjcmlwdGlvbjpzdHJpbmcgPSAnJztcbiAgICB0aHVtYm5haWw6c3RyaW5nID0gJyc7XG4gICAgZnVsbGltYWdlOnN0cmluZyA9ICcnO1xuICAgIGh0bWxwYXRoOnN0cmluZyA9ICcnO1xuXG4gICAgY29uc3RydWN0b3IoaW5NRFJhdzpzdHJpbmcsIGluUmVsYXRpdmVQYXRoOnN0cmluZywgaW5SZWxhdGl2ZUh0bWxQYXRoOnN0cmluZyApe1xuICAgICAgICBzdXBlcihpbk1EUmF3KTtcblxuICAgICAgICB2YXIgZGF0YTphbnkgPSB7fTtcbiAgICAgICAgdmFyIGtleSA9ICcnO1xuICAgICAgICBjb25zdCBsaW5lcyA9IHRoaXMubWRyYXcuc3BsaXQoJ1xcbicpLmZpbHRlcigoeCk9PngpO1xuXG4gICAgICAgIGZvciAobGV0IGxpbmUgb2YgbGluZXMpe1xuICAgICAgICAgICAgaWYgKGxpbmUuc3RhcnRzV2l0aCgnIycpKXtcbiAgICAgICAgICAgICAgICBrZXkgPSBsaW5lLnNwbGl0KCcgJylbMV07XG4gICAgICAgICAgICAgICAgZGF0YVtrZXldID0gW107XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoa2V5KXtcbiAgICAgICAgICAgICAgICBkYXRhW2tleV0ucHVzaChsaW5lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcblxuICAgICAgICBmb3IgKGxldCBsaW5lIG9mIGRhdGFbJ0Fib3V0J10pe1xuICAgICAgICAgICAgaWYgKGxpbmUuc3RhcnRzV2l0aCgnLSBUaXRsZTonKSl7XG4gICAgICAgICAgICAgICAgdGhpcy50aXRsZSA9IGxpbmUucmVwbGFjZSgnLSBUaXRsZTonLCcnKS50cmltKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChsaW5lLnN0YXJ0c1dpdGgoJy0gRGF0ZTonKSl7XG4gICAgICAgICAgICAgICAgdGhpcy5kYXRlID0gbGluZS5yZXBsYWNlKCctIERhdGU6JywnJykudHJpbSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobGluZS5zdGFydHNXaXRoKCctIFBsYWNlOicpKXtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYWNlID0gbGluZS5yZXBsYWNlKCctIFBsYWNlOicsJycpLnRyaW0oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGxpbmUuc3RhcnRzV2l0aCgnLSBNZWRpdW06Jykpe1xuICAgICAgICAgICAgICAgIHRoaXMubWVkaXVtID0gbGluZS5yZXBsYWNlKCctIE1lZGl1bTonLCcnKS50cmltKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChsaW5lLnN0YXJ0c1dpdGgoJy0gRGltZW5zaW9uczonKSl7XG4gICAgICAgICAgICAgICAgdGhpcy5kaW1lbnNpb25zID0gbGluZS5yZXBsYWNlKCctIERpbWVuc2lvbnM6JywnJykudHJpbSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobGluZS5zdGFydHNXaXRoKCctIE5vOicpKXtcbiAgICAgICAgICAgICAgICB0aGlzLm5vID0gbGluZS5yZXBsYWNlKCctIE5vOicsJycpLnRyaW0oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGxpbmUuc3RhcnRzV2l0aCgnLSBEZXNjcmlwdGlvbjonKSl7XG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IGxpbmUucmVwbGFjZSgnLSBEZXNjcmlwdGlvbjonLCcnKS50cmltKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChsaW5lLnN0YXJ0c1dpdGgoJy0gVGFnczonKSl7XG4gICAgICAgICAgICAgICAgdGhpcy50YWdzID0gbGluZS5yZXBsYWNlKCctIFRhZ3M6JywnJykudHJpbSgpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRhZ3MuaW5kZXhPZignI3NvbGQnKSA+IC0xKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zb2xkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChsaW5lLnN0YXJ0c1dpdGgoJy0gT3JkTnVtOicpKXtcbiAgICAgICAgICAgICAgICBsZXQgdG1wT3JkTnVtID0gbGluZS5yZXBsYWNlKCctIE9yZE51bTonLCcnKS50cmltKCk7XG4gICAgICAgICAgICAgICAgaWYgKHRtcE9yZE51bSl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3JkbnVtID0gcGFyc2VJbnQodG1wT3JkTnVtKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgaWYgKGRhdGFbXCJJbWFnZXNcIl0ubGVuZ3RoID09IDApe1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbWFnZSBOb3QgRm91bmQgJHt0aGlzLm1kcmF3fWApO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGNsZWFuZWQgPSBkYXRhWydJbWFnZXMnXVswXS5yZXBsYWNlKCchW10oJywnJykucmVwbGFjZSgnKScsJycpO1xuICAgICAgICB0aGlzLnRodW1ibmFpbCA9IHBhdGguam9pbihpblJlbGF0aXZlUGF0aCwgY2xlYW5lZCk7XG4gICAgICAgIHRoaXMuZnVsbGltYWdlID0gdGhpcy50aHVtYm5haWw7XG4gICAgICAgIHRoaXMuaHRtbHBhdGggPSBpblJlbGF0aXZlSHRtbFBhdGg7XG4gICAgfVxuXG4gICAgZ2V0UmVwZWF0ZXJIdG1sKCl7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJpdGVtICR7dGhpcy50YWdzLnJlcGxhY2UoLyMvaWcsJycpfVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBpY2ZyYW1lXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJvdmVybGF5XCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiaWNvblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiR7dGhpcy50aHVtYm5haWx9XCIgZGF0YS10eXBlPVwicHJldHR5UGhvdG9bZ2FsbGVyeV1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtc2VhcmNoIGljb24tdmlld1wiPjwvaT48L2E+XG4gICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJpY29uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiJHt0aGlzLmh0bWxwYXRofVwiPjxpIGNsYXNzPVwiZmEgZmEtYWxpZ24tanVzdGlmeSBmYS1leHRlcm5hbC1saW5rIGljb24taW5mb1wiPjwvaT48L2E+XG4gICAgICAgICAgICAgICAgICAgIDwvc3Bhbj4gXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicGZfdGV4dFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2plY3QtbmFtZVwiPiR7dGhpcy50aXRsZX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+RGF0ZTogJHt0aGlzLmRhdGV9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlBsYWNlOiAke3RoaXMucGxhY2V9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2Pk1lZGl1bTogJHt0aGlzLmRlc2NyaXB0aW9ufTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5EaW1lbnNpb25zOiAke3RoaXMuZGltZW5zaW9uc308L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+JHt0aGlzLnNvbGQgPyAnU09MRCcgOiAnJ308L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwhLS0gPGRpdj5ObzogJHt0aGlzLm5vfTwvZGl2PiAtLT5cbiAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cblxuICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiJHt0aGlzLmZ1bGxpbWFnZX1cIiBhbHQ9XCJcIiAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICBgXG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgS0V4cG9ydCB7XG4gICAgc3JjUGF0aDpzdHJpbmcgPSAnJztcbiAgICBkc3RQYXRoOnN0cmluZyA9ICcnO1xuICAgIHRwbFBhdGg6c3RyaW5nID0gJyc7XG4gICAgY29uc3RydWN0b3IoaW5TcmNQYXRoOnN0cmluZywgaW5UcGxQYXRoOnN0cmluZywgaW5Ec3RQYXRoOnN0cmluZyl7XG4gICAgICAgIHRoaXMuc3JjUGF0aCA9IGluU3JjUGF0aC5yZXBsYWNlKFwiflwiLG9zLmhvbWVkaXIoKSk7XG4gICAgICAgIHRoaXMuZHN0UGF0aCA9IGluRHN0UGF0aC5yZXBsYWNlKFwiflwiLG9zLmhvbWVkaXIoKSk7XG4gICAgICAgIHRoaXMudHBsUGF0aCA9IGluVHBsUGF0aC5yZXBsYWNlKFwiflwiLG9zLmhvbWVkaXIoKSk7XG4gICAgfVxuXG4gICAgYXN5bmMgc3RhcnQoKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJFeHBvcnQgU3RhcnRlZC4uLi5cIik7XG5cbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgICAgICAvLyBHZW5lcmljXG4gICAgICAgIGNvbnN0IGdlblRwbEZpbGVQYXRoID0gcGF0aC5qb2luKHRoaXMudHBsUGF0aCwnZ2VuZXJpYy10ZW1wbGF0ZS5odG1sJyk7XG4gICAgICAgIGNvbnN0IGdlblRlbXBsYXRlSHRtbCA9IGF3YWl0IGZzLnByb21pc2VzLnJlYWRGaWxlKGdlblRwbEZpbGVQYXRoLCd1dGYtOCcpO1xuICAgICAgICBcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgICAgICAvLyBXb3Jrc1xuICAgICAgICAvLyAxLiBHYXRoZXIgYWxsIE1ldGEgSW5mbyBhbmQgR2VuZXJhdGUgc2luZ2xlIFRodW1ibmFpbCBHYWxsZXJ5XG4gICAgICAgIC8vIDIuIEdlbmVyYXRlIGluZGl2aWR1YWwgcGFnZSBhbmQgZHVtcCB0aGUgLmh0bWwgbmV4dCB0byAubWQgZmlsZS5cbiAgICAgICAgLy8gICAgSW5kaXZpZHVhbCBwYWdlIHNob3VsZCBjb3ZlciBmdWxsIGh0bWwgY29udmVyc2lvbiBwbHVzIHlvdXR1YmUgb3IgZ2xiIFxuXG4gICAgICAgIGNvbnN0IHdvcmtTcmNQYXRoID0gcGF0aC5qb2luKHRoaXMuc3JjUGF0aCwnd29ya3MnKTtcbiAgICAgICAgY29uc3Qgd29ya1RwbEZpbGVQYXRoID0gcGF0aC5qb2luKHRoaXMudHBsUGF0aCwnd29ya3MtdGVtcGxhdGUuaHRtbCcpO1xuICAgICAgICBjb25zdCB3b3JrRHN0RmlsZVBhdGggPSBwYXRoLmpvaW4odGhpcy5kc3RQYXRoLCd3b3Jrcy5odG1sJyk7ICAgICAgICBcblxuICAgICAgICBsZXQgcmVwZWF0ZXJIdG1sQXJyID0gW107XG4gICAgICAgIGxldCB3b3JrSXRlbXM6R2FsbGVyeUl0ZW1bXSA9IFtdO1xuICAgICAgICAvLyBXYWxrIGVhY2ggLm1kIGZpbGVzIGluIHdvcmtzXG4gICAgICAgIGZvciBhd2FpdCAoY29uc3QgbWRmaWxlUGF0aCBvZiB0aGlzLmdldEZpbGVzKHdvcmtTcmNQYXRoKSkge1xuICAgICAgICAgICAgY29uc3QgaHRtbEZpbGVQYXRoID0gbWRmaWxlUGF0aC5yZXBsYWNlKCcubWQnLCcuaHRtbCcpO1xuICAgICAgICAgICAgdHJ5IHsgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBjb25zdCBjb250ZW50cyA9IGF3YWl0IGZzLnByb21pc2VzLnJlYWRGaWxlKG1kZmlsZVBhdGgsJ3V0Zi04Jyk7XG4gICAgICAgICAgICAgICAgLy8gQ2FsY3VsYXRlIHJlbGF0aXZlIHBhdGggLSBmdWxsIHBhdGggbWludXMgd29ya2ZvbGRlci4gXG4gICAgICAgICAgICAgICAgLy8gdGhpcyBpcyBuZWVkZWQgdG8gcG9pbnQgdGh1bWJuYWlsIGltYWdlIHBhdGggZnJvbSB0aGUgcm9vdCBvZiB3ZWJzaXRlIHRvIHdvcmtzLyAuLi4gZm9sZGVyXG4gICAgICAgICAgICAgICAgY29uc3QgZGlycGF0aCA9IHBhdGguZGlybmFtZShtZGZpbGVQYXRoKTtcbiAgICAgICAgICAgICAgICBjb25zdCByZWxhdGl2ZVNyY0RpclBhdGggPSBkaXJwYXRoLnJlcGxhY2UodGhpcy5zcmNQYXRoLCcnKTtcbiAgICAgICAgICAgICAgICBjb25zdCByZWxhdGl2ZUh0bWxQYXRoID0gaHRtbEZpbGVQYXRoLnJlcGxhY2UodGhpcy5zcmNQYXRoLCcnKTtcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtID0gbmV3IEdhbGxlcnlJdGVtKGNvbnRlbnRzLCByZWxhdGl2ZVNyY0RpclBhdGgsIHJlbGF0aXZlSHRtbFBhdGgpO1xuICAgICAgICAgICAgICAgIC8vIFRFTVA6IHRoaW5rIGFib3V0IGhvdyB0byBtYW5hZ2UgYWxsIGZ1bGwgcGF0aCB2cyByZWxhdGl2ZSBwYXRoIChjb250ZW50cyB3aXNlKVxuICAgICAgICAgICAgICAgIGl0ZW0uaHRtbEZpbGVQYXRoID0gaHRtbEZpbGVQYXRoO1xuICAgICAgICAgICAgICAgIHdvcmtJdGVtcy5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2goZSl7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlLCBodG1sRmlsZVBhdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cblxuICAgICAgICAvLyBMZXQncyBzb3J0ISBMb29rIEludG8gT3JkTnVtIGZpZWxkIGluIG1ldGEgZGF0YS4gSGlnaGVyIE51bWJlciBnb2VzIHRvcC5cbiAgICAgICAgd29ya0l0ZW1zLnNvcnQoKGE6R2FsbGVyeUl0ZW0sIGI6R2FsbGVyeUl0ZW0pPT5iLm9yZG51bS1hLm9yZG51bSk7XG5cbiAgICAgICAgZm9yKHZhciBpPTA7IGk8d29ya0l0ZW1zLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSB3b3JrSXRlbXNbaV07XG4gICAgICAgICAgICByZXBlYXRlckh0bWxBcnIucHVzaChpdGVtLmdldFJlcGVhdGVySHRtbCgpKTtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coaXRlbS50aXRsZSk7XG4gICAgICAgICAgICAvLyBFYWNoIE1EIC0+IEhUTUxcbiAgICAgICAgICAgIGxldCBnZW5PdXRwdXRIdG1sID0gZ2VuVGVtcGxhdGVIdG1sLnJlcGxhY2UoLzwhLS0ge3t7Q09OVEVOVH19fSAtLT4vLGl0ZW0uZ2V0SHRtbCgpKTtcbiAgICAgICAgICAgIGdlbk91dHB1dEh0bWwgPSBnZW5PdXRwdXRIdG1sLnJlcGxhY2UoLzwhLS0ge3t7Q09QWVJJR0hUfX19IC0tPi9nLCdcdTAwQTkgQ29weXJpZ2h0ICcrKG5ldyBEYXRlKCkpLmdldEZ1bGxZZWFyKCkrJyAtIEtpaWNoaSBUYWtldWNoaScpO1xuICAgICAgICAgICAgZ2VuT3V0cHV0SHRtbCA9IGdlbk91dHB1dEh0bWwucmVwbGFjZSgvPCEtLSB7e3tDQVRFR09SWX19fSAtLT4vZywnV29ya3MnKTtcbiAgICAgICAgICAgIGdlbk91dHB1dEh0bWwgPSBnZW5PdXRwdXRIdG1sLnJlcGxhY2UoLzwhLS0ge3t7VElUTEV9fX0gLS0+L2csaXRlbS50aXRsZSk7XG4gICAgICAgICAgICBnZW5PdXRwdXRIdG1sID0gZ2VuT3V0cHV0SHRtbC5yZXBsYWNlKC88IS0tIHt7e1NVQlRJVExFfX19IC0tPi9nLGAoJHtpdGVtLmRhdGV9KWApO1xuICAgICAgICAgICAgZ2VuT3V0cHV0SHRtbCA9IGdlbk91dHB1dEh0bWwucmVwbGFjZSgve3t7UEFHRVRZUEV9fX0vZywnd29yaycpOyAvLyBjbGFzcyBuYW1lIGluIGNvbnRhaW5lciB0YWdcbiAgICAgICAgICAgIGF3YWl0IGZzLnByb21pc2VzLndyaXRlRmlsZShpdGVtLmh0bWxGaWxlUGF0aCxnZW5PdXRwdXRIdG1sKTtcbiAgICAgICAgfSAgICAgICAgXG5cbiAgICAgICAgLy8gd29ya3MuaHRtbFxuICAgICAgICBsZXQgcmVwZWF0ZXJIdG1sID0gcmVwZWF0ZXJIdG1sQXJyLmpvaW4oJ1xcbicpOyAgICAgICAgXG4gICAgICAgIGNvbnN0IGdhbGxlcnlUZW1wbGF0ZUh0bWwgPSBhd2FpdCBmcy5wcm9taXNlcy5yZWFkRmlsZSh3b3JrVHBsRmlsZVBhdGgsJ3V0Zi04Jyk7XG4gICAgICAgIGxldCBnYWxsZXJ5T3V0cHV0SHRtbCA9IGdhbGxlcnlUZW1wbGF0ZUh0bWwucmVwbGFjZSgnPCEtLSB7e3tHQUxMRVJZfX19IC0tPicscmVwZWF0ZXJIdG1sKTtcbiAgICAgICAgZ2FsbGVyeU91dHB1dEh0bWwgPSBnYWxsZXJ5T3V0cHV0SHRtbC5yZXBsYWNlKCc8IS0tIHt7e0NPUFlSSUdIVH19fSAtLT4nLCdcdTAwQTkgQ29weXJpZ2h0ICcrKG5ldyBEYXRlKCkpLmdldEZ1bGxZZWFyKCkrJyAtIEtpaWNoaSBUYWtldWNoaScpO1xuICAgICAgICBhd2FpdCBmcy5wcm9taXNlcy53cml0ZUZpbGUod29ya0RzdEZpbGVQYXRoLGdhbGxlcnlPdXRwdXRIdG1sKTtcblxuICAgICAgICAvL2NvbnNvbGUubG9nKHdvcmtEc3RGaWxlUGF0aClcblxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAgICAgLy8gQXJ0aWNsZXNcbiAgICAgICAgY29uc3QgYXJ0aWNsZVNyY1BhdGggPSBwYXRoLmpvaW4odGhpcy5zcmNQYXRoLCdhcnRpY2xlcycpO1xuICAgICAgICBjb25zdCBhcnRpY2xlVHBsRmlsZVBhdGggPSBwYXRoLmpvaW4odGhpcy50cGxQYXRoLCdhcnRpY2xlcy10ZW1wbGF0ZS5odG1sJyk7XG4gICAgICAgIGNvbnN0IGFydGljbGVEc3RGaWxlUGF0aCA9IHBhdGguam9pbih0aGlzLmRzdFBhdGgsJ2FydGljbGVzLmh0bWwnKTtcbiAgICAgICAgbGV0IHJlcGVhdGVyQXJ0aWNsZUh0bWxBcnIgPSBbXTtcblxuICAgICAgICBsZXQgYXJ0aWNsZUl0ZW1zOkFydGljbGVJdGVtW10gPSBbXTtcblxuICAgICAgICAvLyBXYWxrIGVhY2ggLm1kIGZpbGVzIGluIHdvcmtzXG4gICAgICAgIGZvciBhd2FpdCAoY29uc3QgbWRmaWxlUGF0aCBvZiB0aGlzLmdldEZpbGVzKGFydGljbGVTcmNQYXRoKSkge1xuICAgICAgICAgICAgY29uc3QgaHRtbEZpbGVQYXRoID0gbWRmaWxlUGF0aC5yZXBsYWNlKCcubWQnLCcuaHRtbCcpO1xuICAgICAgICAgICAgY29uc3QgY29udGVudHMgPSBhd2FpdCBmcy5wcm9taXNlcy5yZWFkRmlsZShtZGZpbGVQYXRoLCd1dGYtOCcpO1xuICAgICAgICAgICAgLy8gQ2FsY3VsYXRlIHJlbGF0aXZlIHBhdGggLSBmdWxsIHBhdGggbWludXMgd29ya2ZvbGRlci4gXG4gICAgICAgICAgICAvLyB0aGlzIGlzIG5lZWRlZCB0byBwb2ludCB0aHVtYm5haWwgaW1hZ2UgcGF0aCBmcm9tIHRoZSByb290IG9mIHdlYnNpdGUgdG8gd29ya3MvIC4uLiBmb2xkZXJcbiAgICAgICAgICAgIGNvbnN0IGRpcnBhdGggPSBwYXRoLmRpcm5hbWUobWRmaWxlUGF0aCk7XG4gICAgICAgICAgICBjb25zdCByZWxhdGl2ZVNyY0RpclBhdGggPSBkaXJwYXRoLnJlcGxhY2UodGhpcy5zcmNQYXRoLCcnKTtcbiAgICAgICAgICAgIGNvbnN0IHJlbGF0aXZlSHRtbFBhdGggPSBodG1sRmlsZVBhdGgucmVwbGFjZSh0aGlzLnNyY1BhdGgsJycpO1xuICAgICAgICAgICAgY29uc3QgaXRlbSA9IG5ldyBBcnRpY2xlSXRlbShjb250ZW50cyxyZWxhdGl2ZVNyY0RpclBhdGgsIHJlbGF0aXZlSHRtbFBhdGgpO1xuICAgICAgICAgICAgaXRlbS5odG1sRmlsZVBhdGggPSBodG1sRmlsZVBhdGg7XG4gICAgICAgICAgICBhcnRpY2xlSXRlbXMucHVzaChpdGVtKTtcbiAgICAgICAgfSAgICAgICAgXG5cbiAgICAgICAgYXJ0aWNsZUl0ZW1zLnNvcnQoKGE6QXJ0aWNsZUl0ZW0sIGI6QXJ0aWNsZUl0ZW0pPT4obmV3IERhdGUoYi5kYXRlKSkuZ2V0VGltZSgpLShuZXcgRGF0ZShhLmRhdGUpKS5nZXRUaW1lKCkpO1xuXG5cblxuICAgICAgICBmb3IodmFyIGk9MDsgaTxhcnRpY2xlSXRlbXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgY29uc3QgaXRlbSA9IGFydGljbGVJdGVtc1tpXTtcbiAgICAgICAgICAgIC8vIEJ1aWxkIHVwIHRodW1ibmFpbCBodG1sIHJlcGVhdGVyXG4gICAgICAgICAgICBpZiAoaXRlbS50aXRsZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJyhkcmFmdCknKSA9PT0gLTEgJiZcbiAgICAgICAgICAgICAgICBpdGVtLnRhZ3MudG9Mb2NhbGVMb3dlckNhc2UoKS5pbmRleE9mKCcjdW5saXN0ZWQnKSA9PT0gLTEgJiZcbiAgICAgICAgICAgICAgICBpdGVtLnRhZ3MudG9Mb2NhbGVMb3dlckNhc2UoKS5pbmRleE9mKCcjZHJhZnQnKSA9PT0gLTEpe1xuICAgICAgICAgICAgICAgIHJlcGVhdGVyQXJ0aWNsZUh0bWxBcnIucHVzaChpdGVtLmdldFJlcGVhdGVySHRtbCgpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRWFjaCBNRCAtPiBIVE1MXG4gICAgICAgICAgICBsZXQgZ2VuT3V0cHV0SHRtbCA9IGdlblRlbXBsYXRlSHRtbC5yZXBsYWNlKC88IS0tIHt7e0NPTlRFTlR9fX0gLS0+LyxpdGVtLmdldEh0bWwoKSk7XG4gICAgICAgICAgICBnZW5PdXRwdXRIdG1sID0gZ2VuT3V0cHV0SHRtbC5yZXBsYWNlKC88IS0tIHt7e0NPUFlSSUdIVH19fSAtLT4vZywnXHUwMEE5IENvcHlyaWdodCAnKyhuZXcgRGF0ZSgpKS5nZXRGdWxsWWVhcigpKycgLSBLaWljaGkgVGFrZXVjaGknKTtcbiAgICAgICAgICAgIGdlbk91dHB1dEh0bWwgPSBnZW5PdXRwdXRIdG1sLnJlcGxhY2UoLzwhLS0ge3t7Q0FURUdPUll9fX0gLS0+L2csJ0FydGljbGUnKTtcbiAgICAgICAgICAgIGdlbk91dHB1dEh0bWwgPSBnZW5PdXRwdXRIdG1sLnJlcGxhY2UoLzwhLS0ge3t7VElUTEV9fX0gLS0+L2csaXRlbS50aXRsZSk7XG4gICAgICAgICAgICBnZW5PdXRwdXRIdG1sID0gZ2VuT3V0cHV0SHRtbC5yZXBsYWNlKC88IS0tIHt7e1NVQlRJVExFfX19IC0tPi9nLGAoJHtpdGVtLmdldERhdGVTdHIoKX0pYCk7XG4gICAgICAgICAgICBnZW5PdXRwdXRIdG1sID0gZ2VuT3V0cHV0SHRtbC5yZXBsYWNlKC97e3tQQUdFVFlQRX19fS9nLCdhcnRpY2xlJyk7IC8vIGNsYXNzIG5hbWUgaW4gY29udGFpbmVyIHRhZ1xuICAgICAgICAgICAgLy9nZW5PdXRwdXRIdG1sID0gZ2VuT3V0cHV0SHRtbC5yZXBsYWNlKC88IS0tIHt7e01EUkFXfX19IC0tPi9nLGAke2dlbkl0ZW0ubWRyYXd9YCk7IC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXJrbWFwL21hcmttYXAvdHJlZS9tYXN0ZXIvcGFja2FnZXMvbWFya21hcC1hdXRvbG9hZGVyXG4gICAgICAgICAgICBhd2FpdCBmcy5wcm9taXNlcy53cml0ZUZpbGUoaXRlbS5odG1sRmlsZVBhdGgsZ2VuT3V0cHV0SHRtbCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBhcnRpY2xlcy5odG1sXG4gICAgICAgIGNvbnN0IHJlcGVhdGVyQXJ0aWNsZUh0bWwgPSByZXBlYXRlckFydGljbGVIdG1sQXJyLmpvaW4oJ1xcbicpOyAgICAgICAgXG4gICAgICAgIGNvbnN0IGFydGljbGVUZW1wbGF0ZUh0bWwgPSBhd2FpdCBmcy5wcm9taXNlcy5yZWFkRmlsZShhcnRpY2xlVHBsRmlsZVBhdGgsJ3V0Zi04Jyk7XG4gICAgICAgIGxldCBhcnRpY2xlT3V0cHV0SHRtbCA9IGFydGljbGVUZW1wbGF0ZUh0bWwucmVwbGFjZSgnPCEtLSB7e3tBUlRJQ0xFU319fSAtLT4nLHJlcGVhdGVyQXJ0aWNsZUh0bWwpO1xuICAgICAgICBhcnRpY2xlT3V0cHV0SHRtbCA9IGFydGljbGVPdXRwdXRIdG1sLnJlcGxhY2UoJzwhLS0ge3t7Q09QWVJJR0hUfX19IC0tPicsJ1x1MDBBOSBDb3B5cmlnaHQgJysobmV3IERhdGUoKSkuZ2V0RnVsbFllYXIoKSsnIC0gS2lpY2hpIFRha2V1Y2hpJyk7XG4gICAgICAgIGF3YWl0IGZzLnByb21pc2VzLndyaXRlRmlsZShhcnRpY2xlRHN0RmlsZVBhdGgsYXJ0aWNsZU91dHB1dEh0bWwpO1xuXG4gICAgICAgIFxuXG4gICAgICAgIGNvbnNvbGUubG9nKFwiRXhwb3J0IEVuZGVkLi4uLlwiKTtcbiAgICB9XG5cbiAgICBhc3luYyAqZ2V0RmlsZXMoZGlyOnN0cmluZyk6YW55IHtcbiAgICAgICAgY29uc3QgZGlyZW50cyA9IGF3YWl0IGZzLnByb21pc2VzLnJlYWRkaXIoZGlyLCB7IHdpdGhGaWxlVHlwZXM6IHRydWUgfSk7XG4gICAgICAgIGZvciAoY29uc3QgZGlyZW50IG9mIGRpcmVudHMpIHtcbiAgICAgICAgICBjb25zdCByZXMgPSBwYXRoLnJlc29sdmUoZGlyLCBkaXJlbnQubmFtZSk7XG4gICAgICAgICAgaWYgKGRpcmVudC5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgICAgICB5aWVsZCogdGhpcy5nZXRGaWxlcyhyZXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIGlmKGRpcmVudC5uYW1lLmVuZHNXaXRoKFwiLm1kXCIpKXtcbiAgICAgICAgICAgIHlpZWxkIHJlcztcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gZWxzZSB7IC8vIGRvIG5vdGhpbmcgfSBcbiAgICAgICAgfVxuICAgIH1cblxuICAgIFxufSIsICIvKlxuICogQGxpY2Vuc2VcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTEtMjAxNCwgQ2hyaXN0b3BoZXIgSmVmZnJleS4gKE1JVCBMaWNlbnNlZClcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9jaGpqL21hcmtlZFxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxOC0yMDIxLCBcdTA0MUFcdTA0M0VcdTA0NDFcdTA0NDJcdTA0NEYgXHUwNDIyXHUwNDQwXHUwNDM1XHUwNDQyXHUwNDRGXHUwNDNBLiAoTUlUIExpY2Vuc2VkKVxuICogaHR0cHM6Ly9naXRodWIuY29tL3RzLXN0YWNrL21hcmtkb3duXG4gKi9cblxuZXhwb3J0IGNsYXNzIEV4dGVuZFJlZ2V4cCB7XG4gIHByaXZhdGUgc291cmNlOiBzdHJpbmc7XG4gIHByaXZhdGUgZmxhZ3M6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihyZWdleDogUmVnRXhwLCBmbGFnczogc3RyaW5nID0gJycpIHtcbiAgICB0aGlzLnNvdXJjZSA9IHJlZ2V4LnNvdXJjZTtcbiAgICB0aGlzLmZsYWdzID0gZmxhZ3M7XG4gIH1cblxuICAvKipcbiAgICogRXh0ZW5kIHJlZ3VsYXIgZXhwcmVzc2lvbi5cbiAgICpcbiAgICogQHBhcmFtIGdyb3VwTmFtZSBSZWd1bGFyIGV4cHJlc3Npb24gZm9yIHNlYXJjaCBhIGdyb3VwIG5hbWUuXG4gICAqIEBwYXJhbSBncm91cFJlZ2V4cCBSZWd1bGFyIGV4cHJlc3Npb24gb2YgbmFtZWQgZ3JvdXAuXG4gICAqL1xuICBzZXRHcm91cChncm91cE5hbWU6IFJlZ0V4cCB8IHN0cmluZywgZ3JvdXBSZWdleHA6IFJlZ0V4cCB8IHN0cmluZyk6IHRoaXMge1xuICAgIGxldCBuZXdSZWdleHA6IHN0cmluZyA9IHR5cGVvZiBncm91cFJlZ2V4cCA9PSAnc3RyaW5nJyA/IGdyb3VwUmVnZXhwIDogZ3JvdXBSZWdleHAuc291cmNlO1xuICAgIG5ld1JlZ2V4cCA9IG5ld1JlZ2V4cC5yZXBsYWNlKC8oXnxbXlxcW10pXFxeL2csICckMScpO1xuXG4gICAgLy8gRXh0ZW5kIHJlZ2V4cC5cbiAgICB0aGlzLnNvdXJjZSA9IHRoaXMuc291cmNlLnJlcGxhY2UoZ3JvdXBOYW1lLCBuZXdSZWdleHApO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSByZXN1bHQgb2YgZXh0ZW5kaW5nIGEgcmVndWxhciBleHByZXNzaW9uLlxuICAgKi9cbiAgZ2V0UmVnZXhwKCk6IFJlZ0V4cCB7XG4gICAgcmV0dXJuIG5ldyBSZWdFeHAodGhpcy5zb3VyY2UsIHRoaXMuZmxhZ3MpO1xuICB9XG59XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxMS0yMDE0LCBDaHJpc3RvcGhlciBKZWZmcmV5LiAoTUlUIExpY2Vuc2VkKVxuICogaHR0cHM6Ly9naXRodWIuY29tL2NoamovbWFya2VkXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE4LTIwMjEsIFx1MDQxQVx1MDQzRVx1MDQ0MVx1MDQ0Mlx1MDQ0RiBcdTA0MjJcdTA0NDBcdTA0MzVcdTA0NDJcdTA0NEZcdTA0M0EuIChNSVQgTGljZW5zZWQpXG4gKiBodHRwczovL2dpdGh1Yi5jb20vdHMtc3RhY2svbWFya2Rvd25cbiAqL1xuXG5pbXBvcnQgeyBSZXBsYWNlbWVudHMgfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuXG5jb25zdCBlc2NhcGVUZXN0ID0gL1smPD5cIiddLztcbmNvbnN0IGVzY2FwZVJlcGxhY2UgPSAvWyY8PlwiJ10vZztcbmNvbnN0IHJlcGxhY2VtZW50czogUmVwbGFjZW1lbnRzID0ge1xuICAnJic6ICcmYW1wOycsXG4gICc8JzogJyZsdDsnLFxuICAnPic6ICcmZ3Q7JyxcbiAgJ1wiJzogJyZxdW90OycsXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpxdW90ZW1hcmtcbiAgXCInXCI6ICcmIzM5OycsXG59O1xuXG5jb25zdCBlc2NhcGVUZXN0Tm9FbmNvZGUgPSAvWzw+XCInXXwmKD8hIz9cXHcrOykvO1xuY29uc3QgZXNjYXBlUmVwbGFjZU5vRW5jb2RlID0gL1s8PlwiJ118Jig/ISM/XFx3KzspL2c7XG5cbmV4cG9ydCBmdW5jdGlvbiBlc2NhcGUoaHRtbDogc3RyaW5nLCBlbmNvZGU/OiBib29sZWFuKSB7XG4gIGlmIChlbmNvZGUpIHtcbiAgICBpZiAoZXNjYXBlVGVzdC50ZXN0KGh0bWwpKSB7XG4gICAgICByZXR1cm4gaHRtbC5yZXBsYWNlKGVzY2FwZVJlcGxhY2UsIChjaDogc3RyaW5nKSA9PiByZXBsYWNlbWVudHNbY2hdKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGVzY2FwZVRlc3ROb0VuY29kZS50ZXN0KGh0bWwpKSB7XG4gICAgICByZXR1cm4gaHRtbC5yZXBsYWNlKGVzY2FwZVJlcGxhY2VOb0VuY29kZSwgKGNoOiBzdHJpbmcpID0+IHJlcGxhY2VtZW50c1tjaF0pO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBodG1sO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdW5lc2NhcGUoaHRtbDogc3RyaW5nKSB7XG4gIC8vIEV4cGxpY2l0bHkgbWF0Y2ggZGVjaW1hbCwgaGV4LCBhbmQgbmFtZWQgSFRNTCBlbnRpdGllc1xuICByZXR1cm4gaHRtbC5yZXBsYWNlKC8mKCMoPzpcXGQrKXwoPzojeFswLTlBLUZhLWZdKyl8KD86XFx3KykpOz8vZ2ksIGZ1bmN0aW9uIChfLCBuKSB7XG4gICAgbiA9IG4udG9Mb3dlckNhc2UoKTtcblxuICAgIGlmIChuID09PSAnY29sb24nKSB7XG4gICAgICByZXR1cm4gJzonO1xuICAgIH1cblxuICAgIGlmIChuLmNoYXJBdCgwKSA9PT0gJyMnKSB7XG4gICAgICByZXR1cm4gbi5jaGFyQXQoMSkgPT09ICd4J1xuICAgICAgICA/IFN0cmluZy5mcm9tQ2hhckNvZGUocGFyc2VJbnQobi5zdWJzdHJpbmcoMiksIDE2KSlcbiAgICAgICAgOiBTdHJpbmcuZnJvbUNoYXJDb2RlKCtuLnN1YnN0cmluZygxKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuICcnO1xuICB9KTtcbn1cbiIsICIvKipcbiAqIEBsaWNlbnNlXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE4LTIwMjEsIFx1MDQxQVx1MDQzRVx1MDQ0MVx1MDQ0Mlx1MDQ0RiBcdTA0MjJcdTA0NDBcdTA0MzVcdTA0NDJcdTA0NEZcdTA0M0EuIChNSVQgTGljZW5zZWQpXG4gKiBodHRwczovL2dpdGh1Yi5jb20vdHMtc3RhY2svbWFya2Rvd25cbiAqL1xuXG5pbXBvcnQgeyBlc2NhcGUsIHVuZXNjYXBlIH0gZnJvbSAnLi9oZWxwZXJzJztcbmltcG9ydCB7IFJlbmRlcmVyIH0gZnJvbSAnLi9yZW5kZXJlcic7XG5cbmV4cG9ydCBpbnRlcmZhY2UgT2JqIHtcbiAgW2tleTogc3RyaW5nXTogYW55O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJ1bGVzQmxvY2tCYXNlIHtcbiAgbmV3bGluZTogUmVnRXhwO1xuICBjb2RlOiBSZWdFeHA7XG4gIGhyOiBSZWdFeHA7XG4gIGhlYWRpbmc6IFJlZ0V4cDtcbiAgbGhlYWRpbmc6IFJlZ0V4cDtcbiAgYmxvY2txdW90ZTogUmVnRXhwO1xuICBsaXN0OiBSZWdFeHA7XG4gIGh0bWw6IFJlZ0V4cDtcbiAgZGVmOiBSZWdFeHA7XG4gIHBhcmFncmFwaDogUmVnRXhwO1xuICB0ZXh0OiBSZWdFeHA7XG4gIGJ1bGxldDogUmVnRXhwO1xuICAvKipcbiAgICogTGlzdCBpdGVtICg8bGk+KS5cbiAgICovXG4gIGl0ZW06IFJlZ0V4cDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSdWxlc0Jsb2NrR2ZtIGV4dGVuZHMgUnVsZXNCbG9ja0Jhc2Uge1xuICBmZW5jZXM6IFJlZ0V4cDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSdWxlc0Jsb2NrVGFibGVzIGV4dGVuZHMgUnVsZXNCbG9ja0dmbSB7XG4gIG5wdGFibGU6IFJlZ0V4cDtcbiAgdGFibGU6IFJlZ0V4cDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBMaW5rIHtcbiAgaHJlZjogc3RyaW5nO1xuICB0aXRsZTogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIExpbmtzIHtcbiAgW2tleTogc3RyaW5nXTogTGluaztcbn1cblxuZXhwb3J0IGVudW0gVG9rZW5UeXBlIHtcbiAgc3BhY2UgPSAxLFxuICB0ZXh0LFxuICBwYXJhZ3JhcGgsXG4gIGhlYWRpbmcsXG4gIGxpc3RTdGFydCxcbiAgbGlzdEVuZCxcbiAgbG9vc2VJdGVtU3RhcnQsXG4gIGxvb3NlSXRlbUVuZCxcbiAgbGlzdEl0ZW1TdGFydCxcbiAgbGlzdEl0ZW1FbmQsXG4gIGJsb2NrcXVvdGVTdGFydCxcbiAgYmxvY2txdW90ZUVuZCxcbiAgY29kZSxcbiAgdGFibGUsXG4gIGh0bWwsXG4gIGhyXG59XG5cbmV4cG9ydCB0eXBlIEFsaWduID0gJ2NlbnRlcicgfCAnbGVmdCcgfCAncmlnaHQnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFRva2VuIHtcbiAgdHlwZTogbnVtYmVyIHwgc3RyaW5nO1xuICB0ZXh0Pzogc3RyaW5nO1xuICBsYW5nPzogc3RyaW5nO1xuICAvKipcbiAgICogTWV0YWRhdGEgb2YgZ2ZtIGNvZGUuXG4gICAqL1xuICBtZXRhPzogc3RyaW5nO1xuICBkZXB0aD86IG51bWJlcjtcbiAgaGVhZGVyPzogc3RyaW5nW107XG4gIGFsaWduPzogQWxpZ25bXTtcbiAgY2VsbHM/OiBzdHJpbmdbXVtdO1xuICBvcmRlcmVkPzogYm9vbGVhbjtcbiAgcHJlPzogYm9vbGVhbjtcbiAgZXNjYXBlZD86IGJvb2xlYW47XG4gIGV4ZWNBcnI/OiBSZWdFeHBFeGVjQXJyYXk7XG4gIC8qKlxuICAgKiBVc2VkIGZvciBkZWJ1Z2dpbmcuIElkZW50aWZpZXMgdGhlIGxpbmUgbnVtYmVyIGluIHRoZSByZXN1bHRpbmcgSFRNTCBmaWxlLlxuICAgKi9cbiAgbGluZT86IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSdWxlc0lubGluZUJhc2Uge1xuICBlc2NhcGU6IFJlZ0V4cDtcbiAgYXV0b2xpbms6IFJlZ0V4cDtcbiAgdGFnOiBSZWdFeHA7XG4gIGxpbms6IFJlZ0V4cDtcbiAgcmVmbGluazogUmVnRXhwO1xuICBub2xpbms6IFJlZ0V4cDtcbiAgc3Ryb25nOiBSZWdFeHA7XG4gIGVtOiBSZWdFeHA7XG4gIGNvZGU6IFJlZ0V4cDtcbiAgYnI6IFJlZ0V4cDtcbiAgdGV4dDogUmVnRXhwO1xuICBfaW5zaWRlOiBSZWdFeHA7XG4gIF9ocmVmOiBSZWdFeHA7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUnVsZXNJbmxpbmVQZWRhbnRpYyBleHRlbmRzIFJ1bGVzSW5saW5lQmFzZSB7fVxuXG4vKipcbiAqIEdGTSBJbmxpbmUgR3JhbW1hclxuICovXG5leHBvcnQgaW50ZXJmYWNlIFJ1bGVzSW5saW5lR2ZtIGV4dGVuZHMgUnVsZXNJbmxpbmVCYXNlIHtcbiAgdXJsOiBSZWdFeHA7XG4gIGRlbDogUmVnRXhwO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJ1bGVzSW5saW5lQnJlYWtzIGV4dGVuZHMgUnVsZXNJbmxpbmVHZm0ge31cblxuZXhwb3J0IGNsYXNzIE1hcmtlZE9wdGlvbnMge1xuICBnZm0/OiBib29sZWFuID0gdHJ1ZTtcbiAgdGFibGVzPzogYm9vbGVhbiA9IHRydWU7XG4gIGJyZWFrcz86IGJvb2xlYW4gPSBmYWxzZTtcbiAgcGVkYW50aWM/OiBib29sZWFuID0gZmFsc2U7XG4gIHNhbml0aXplPzogYm9vbGVhbiA9IGZhbHNlO1xuICBzYW5pdGl6ZXI/OiAodGV4dDogc3RyaW5nKSA9PiBzdHJpbmc7XG4gIG1hbmdsZT86IGJvb2xlYW4gPSB0cnVlO1xuICBzbWFydExpc3RzPzogYm9vbGVhbiA9IGZhbHNlO1xuICBzaWxlbnQ/OiBib29sZWFuID0gZmFsc2U7XG4gIC8qKlxuICAgKiBAcGFyYW0gY29kZSBUaGUgc2VjdGlvbiBvZiBjb2RlIHRvIHBhc3MgdG8gdGhlIGhpZ2hsaWdodGVyLlxuICAgKiBAcGFyYW0gbGFuZyBUaGUgcHJvZ3JhbW1pbmcgbGFuZ3VhZ2Ugc3BlY2lmaWVkIGluIHRoZSBjb2RlIGJsb2NrLlxuICAgKi9cbiAgaGlnaGxpZ2h0PzogKGNvZGU6IHN0cmluZywgbGFuZz86IHN0cmluZykgPT4gc3RyaW5nO1xuICBsYW5nUHJlZml4Pzogc3RyaW5nID0gJ2xhbmctJztcbiAgc21hcnR5cGFudHM/OiBib29sZWFuID0gZmFsc2U7XG4gIGhlYWRlclByZWZpeD86IHN0cmluZyA9ICcnO1xuICAvKipcbiAgICogQW4gb2JqZWN0IGNvbnRhaW5pbmcgZnVuY3Rpb25zIHRvIHJlbmRlciB0b2tlbnMgdG8gSFRNTC4gRGVmYXVsdDogYG5ldyBSZW5kZXJlcigpYFxuICAgKi9cbiAgcmVuZGVyZXI/OiBSZW5kZXJlcjtcbiAgLyoqXG4gICAqIFNlbGYtY2xvc2UgdGhlIHRhZ3MgZm9yIHZvaWQgZWxlbWVudHMgKCZsdDtici8mZ3Q7LCAmbHQ7aW1nLyZndDssIGV0Yy4pXG4gICAqIHdpdGggYSBcIi9cIiBhcyByZXF1aXJlZCBieSBYSFRNTC5cbiAgICovXG4gIHhodG1sPzogYm9vbGVhbiA9IGZhbHNlO1xuICAvKipcbiAgICogVGhlIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSB1c2luZyB0byBlc2NhcGUgSFRNTCBlbnRpdGllcy5cbiAgICogQnkgZGVmYXVsdCB1c2luZyBpbm5lciBoZWxwZXIuXG4gICAqL1xuICBlc2NhcGU/OiAoaHRtbDogc3RyaW5nLCBlbmNvZGU/OiBib29sZWFuKSA9PiBzdHJpbmcgPSBlc2NhcGU7XG4gIC8qKlxuICAgKiBUaGUgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIHVzaW5nIHRvIHVuZXNjYXBlIEhUTUwgZW50aXRpZXMuXG4gICAqIEJ5IGRlZmF1bHQgdXNpbmcgaW5uZXIgaGVscGVyLlxuICAgKi9cbiAgdW5lc2NhcGU/OiAoaHRtbDogc3RyaW5nKSA9PiBzdHJpbmcgPSB1bmVzY2FwZTtcbiAgLyoqXG4gICAqIElmIHNldCB0byBgdHJ1ZWAsIGFuIGlubGluZSB0ZXh0IHdpbGwgbm90IGJlIHRha2VuIGluIHBhcmFncmFwaC5cbiAgICpcbiAgICogYGBgdHNcbiAgICogLy8gaXNOb1AgPT0gZmFsc2VcbiAgICogTWFya2VkLnBhcnNlKCdzb21lIHRleHQnKTsgLy8gcmV0dXJucyAnPHA+c29tZSB0ZXh0PC9wPidcbiAgICpcbiAgICogTWFya2VkLnNldE9wdGlvbnMoe2lzTm9QOiB0cnVlfSk7XG4gICAqXG4gICAqIE1hcmtlZC5wYXJzZSgnc29tZSB0ZXh0Jyk7IC8vIHJldHVybnMgJ3NvbWUgdGV4dCdcbiAgICogYGBgXG4gICAqL1xuICBpc05vUD86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGV4ZXJSZXR1cm5zIHtcbiAgdG9rZW5zOiBUb2tlbltdO1xuICBsaW5rczogTGlua3M7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRGVidWdSZXR1cm5zIGV4dGVuZHMgTGV4ZXJSZXR1cm5zIHtcbiAgcmVzdWx0OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVwbGFjZW1lbnRzIHtcbiAgW2tleTogc3RyaW5nXTogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJ1bGVzSW5saW5lQ2FsbGJhY2sge1xuICByZWdleHA/OiBSZWdFeHA7XG4gIGNvbmRpdGlvbigpOiBSZWdFeHA7XG4gIHRva2VuaXplKGV4ZWNBcnI6IFJlZ0V4cEV4ZWNBcnJheSk6IHZvaWQ7XG59XG5cbmV4cG9ydCB0eXBlIFNpbXBsZVJlbmRlcmVyID0gKGV4ZWNBcnI/OiBSZWdFeHBFeGVjQXJyYXkpID0+IHN0cmluZztcbiIsICIvKipcbiAqIEBsaWNlbnNlXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDExLTIwMTQsIENocmlzdG9waGVyIEplZmZyZXkuIChNSVQgTGljZW5zZWQpXG4gKiBodHRwczovL2dpdGh1Yi5jb20vY2hqai9tYXJrZWRcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTgtMjAyMSwgXHUwNDFBXHUwNDNFXHUwNDQxXHUwNDQyXHUwNDRGIFx1MDQyMlx1MDQ0MFx1MDQzNVx1MDQ0Mlx1MDQ0Rlx1MDQzQS4gKE1JVCBMaWNlbnNlZClcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS90cy1zdGFjay9tYXJrZG93blxuICovXG5cbmltcG9ydCB7IEFsaWduLCBNYXJrZWRPcHRpb25zIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7IE1hcmtlZCB9IGZyb20gJy4vbWFya2VkJztcblxuZXhwb3J0IGNsYXNzIFJlbmRlcmVyIHtcbiAgcHJvdGVjdGVkIG9wdGlvbnM6IE1hcmtlZE9wdGlvbnM7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucz86IE1hcmtlZE9wdGlvbnMpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IE1hcmtlZC5vcHRpb25zO1xuICB9XG5cbiAgY29kZShjb2RlOiBzdHJpbmcsIGxhbmc/OiBzdHJpbmcsIGVzY2FwZWQ/OiBib29sZWFuLCBtZXRhPzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLmhpZ2hsaWdodCkge1xuICAgICAgY29uc3Qgb3V0ID0gdGhpcy5vcHRpb25zLmhpZ2hsaWdodChjb2RlLCBsYW5nKTtcblxuICAgICAgaWYgKG91dCAhPSBudWxsICYmIG91dCAhPT0gY29kZSkge1xuICAgICAgICBlc2NhcGVkID0gdHJ1ZTtcbiAgICAgICAgY29kZSA9IG91dDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBlc2NhcGVkQ29kZSA9IChlc2NhcGVkID8gY29kZSA6IHRoaXMub3B0aW9ucy5lc2NhcGUoY29kZSwgdHJ1ZSkpO1xuXG4gICAgaWYgKCFsYW5nKSB7XG4gICAgICByZXR1cm4gYFxcbjxwcmU+PGNvZGU+JHtlc2NhcGVkQ29kZX1cXG48L2NvZGU+PC9wcmU+XFxuYDtcbiAgICB9XG5cbiAgICBjb25zdCBjbGFzc05hbWUgPSB0aGlzLm9wdGlvbnMubGFuZ1ByZWZpeCArIHRoaXMub3B0aW9ucy5lc2NhcGUobGFuZywgdHJ1ZSk7XG4gICAgcmV0dXJuIGBcXG48cHJlPjxjb2RlIGNsYXNzPVwiJHtjbGFzc05hbWV9XCI+JHtlc2NhcGVkQ29kZX1cXG48L2NvZGU+PC9wcmU+XFxuYDtcbiAgfVxuXG4gIGJsb2NrcXVvdGUocXVvdGU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGA8YmxvY2txdW90ZT5cXG4ke3F1b3RlfTwvYmxvY2txdW90ZT5cXG5gO1xuICB9XG5cbiAgaHRtbChodG1sOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBodG1sO1xuICB9XG5cbiAgaGVhZGluZyh0ZXh0OiBzdHJpbmcsIGxldmVsOiBudW1iZXIsIHJhdzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBpZDogc3RyaW5nID0gdGhpcy5vcHRpb25zLmhlYWRlclByZWZpeCArIHJhdy50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL1teXFx3XSsvZywgJy0nKTtcblxuICAgIHJldHVybiBgPGgke2xldmVsfSBpZD1cIiR7aWR9XCI+JHt0ZXh0fTwvaCR7bGV2ZWx9PlxcbmA7XG4gIH1cblxuICBocigpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLm9wdGlvbnMueGh0bWwgPyAnPGhyLz5cXG4nIDogJzxocj5cXG4nO1xuICB9XG5cbiAgbGlzdChib2R5OiBzdHJpbmcsIG9yZGVyZWQ/OiBib29sZWFuKTogc3RyaW5nIHtcbiAgICBjb25zdCB0eXBlID0gb3JkZXJlZCA/ICdvbCcgOiAndWwnO1xuXG4gICAgcmV0dXJuIGBcXG48JHt0eXBlfT5cXG4ke2JvZHl9PC8ke3R5cGV9PlxcbmA7XG4gIH1cblxuICBsaXN0aXRlbSh0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiAnPGxpPicgKyB0ZXh0ICsgJzwvbGk+XFxuJztcbiAgfVxuXG4gIHBhcmFncmFwaCh0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiAnPHA+JyArIHRleHQgKyAnPC9wPlxcbic7XG4gIH1cblxuICB0YWJsZShoZWFkZXI6IHN0cmluZywgYm9keTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYFxuPHRhYmxlPlxuPHRoZWFkPlxuJHtoZWFkZXJ9PC90aGVhZD5cbjx0Ym9keT5cbiR7Ym9keX08L3Rib2R5PlxuPC90YWJsZT5cbmA7XG4gIH1cblxuICB0YWJsZXJvdyhjb250ZW50OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiAnPHRyPlxcbicgKyBjb250ZW50ICsgJzwvdHI+XFxuJztcbiAgfVxuXG4gIHRhYmxlY2VsbChjb250ZW50OiBzdHJpbmcsIGZsYWdzOiB7IGhlYWRlcj86IGJvb2xlYW47IGFsaWduPzogQWxpZ24gfSk6IHN0cmluZyB7XG4gICAgY29uc3QgdHlwZSA9IGZsYWdzLmhlYWRlciA/ICd0aCcgOiAndGQnO1xuICAgIGNvbnN0IHRhZyA9IGZsYWdzLmFsaWduID8gJzwnICsgdHlwZSArICcgc3R5bGU9XCJ0ZXh0LWFsaWduOicgKyBmbGFncy5hbGlnbiArICdcIj4nIDogJzwnICsgdHlwZSArICc+JztcbiAgICByZXR1cm4gdGFnICsgY29udGVudCArICc8LycgKyB0eXBlICsgJz5cXG4nO1xuICB9XG5cbiAgLy8gKioqIElubGluZSBsZXZlbCByZW5kZXJlciBtZXRob2RzLiAqKipcblxuICBzdHJvbmcodGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gJzxzdHJvbmc+JyArIHRleHQgKyAnPC9zdHJvbmc+JztcbiAgfVxuXG4gIGVtKHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuICc8ZW0+JyArIHRleHQgKyAnPC9lbT4nO1xuICB9XG5cbiAgY29kZXNwYW4odGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gJzxjb2RlPicgKyB0ZXh0ICsgJzwvY29kZT4nO1xuICB9XG5cbiAgYnIoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLnhodG1sID8gJzxici8+JyA6ICc8YnI+JztcbiAgfVxuXG4gIGRlbCh0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiAnPGRlbD4nICsgdGV4dCArICc8L2RlbD4nO1xuICB9XG5cbiAgbGluayhocmVmOiBzdHJpbmcsIHRpdGxlOiBzdHJpbmcsIHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5zYW5pdGl6ZSkge1xuICAgICAgbGV0IHByb3Q6IHN0cmluZztcblxuICAgICAgdHJ5IHtcbiAgICAgICAgcHJvdCA9IGRlY29kZVVSSUNvbXBvbmVudCh0aGlzLm9wdGlvbnMudW5lc2NhcGUoaHJlZikpXG4gICAgICAgICAgLnJlcGxhY2UoL1teXFx3Ol0vZywgJycpXG4gICAgICAgICAgLnRvTG93ZXJDYXNlKCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgfVxuXG4gICAgICBpZiAocHJvdC5pbmRleE9mKCdqYXZhc2NyaXB0OicpID09PSAwIHx8IHByb3QuaW5kZXhPZigndmJzY3JpcHQ6JykgPT09IDAgfHwgcHJvdC5pbmRleE9mKCdkYXRhOicpID09PSAwKSB7XG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgfVxuICAgIH1cblxuICAgIGxldCBvdXQgPSAnPGEgaHJlZj1cIicgKyBocmVmICsgJ1wiJztcblxuICAgIGlmICh0aXRsZSkge1xuICAgICAgb3V0ICs9ICcgdGl0bGU9XCInICsgdGl0bGUgKyAnXCInO1xuICAgIH1cblxuICAgIG91dCArPSAnPicgKyB0ZXh0ICsgJzwvYT4nO1xuXG4gICAgcmV0dXJuIG91dDtcbiAgfVxuXG4gIGltYWdlKGhyZWY6IHN0cmluZywgdGl0bGU6IHN0cmluZywgdGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBsZXQgb3V0ID0gJzxpbWcgc3JjPVwiJyArIGhyZWYgKyAnXCIgYWx0PVwiJyArIHRleHQgKyAnXCInO1xuXG4gICAgaWYgKHRpdGxlKSB7XG4gICAgICBvdXQgKz0gJyB0aXRsZT1cIicgKyB0aXRsZSArICdcIic7XG4gICAgfVxuXG4gICAgb3V0ICs9IHRoaXMub3B0aW9ucy54aHRtbCA/ICcvPicgOiAnPic7XG5cbiAgICByZXR1cm4gb3V0O1xuICB9XG5cbiAgdGV4dCh0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiB0ZXh0O1xuICB9XG59XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxMS0yMDE0LCBDaHJpc3RvcGhlciBKZWZmcmV5LiAoTUlUIExpY2Vuc2VkKVxuICogaHR0cHM6Ly9naXRodWIuY29tL2NoamovbWFya2VkXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE4LTIwMjEsIFx1MDQxQVx1MDQzRVx1MDQ0MVx1MDQ0Mlx1MDQ0RiBcdTA0MjJcdTA0NDBcdTA0MzVcdTA0NDJcdTA0NEZcdTA0M0EuIChNSVQgTGljZW5zZWQpXG4gKiBodHRwczovL2dpdGh1Yi5jb20vdHMtc3RhY2svbWFya2Rvd25cbiAqL1xuXG5pbXBvcnQgeyBFeHRlbmRSZWdleHAgfSBmcm9tICcuL2V4dGVuZC1yZWdleHAnO1xuaW1wb3J0IHtcbiAgTGluayxcbiAgTGlua3MsXG4gIE1hcmtlZE9wdGlvbnMsXG4gIFJ1bGVzSW5saW5lQmFzZSxcbiAgUnVsZXNJbmxpbmVCcmVha3MsXG4gIFJ1bGVzSW5saW5lQ2FsbGJhY2ssXG4gIFJ1bGVzSW5saW5lR2ZtLFxuICBSdWxlc0lubGluZVBlZGFudGljLFxufSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgTWFya2VkIH0gZnJvbSAnLi9tYXJrZWQnO1xuaW1wb3J0IHsgUmVuZGVyZXIgfSBmcm9tICcuL3JlbmRlcmVyJztcblxuLyoqXG4gKiBJbmxpbmUgTGV4ZXIgJiBDb21waWxlci5cbiAqL1xuZXhwb3J0IGNsYXNzIElubGluZUxleGVyIHtcbiAgcHJvdGVjdGVkIHN0YXRpYyBydWxlc0Jhc2U6IFJ1bGVzSW5saW5lQmFzZSA9IG51bGw7XG4gIC8qKlxuICAgKiBQZWRhbnRpYyBJbmxpbmUgR3JhbW1hci5cbiAgICovXG4gIHByb3RlY3RlZCBzdGF0aWMgcnVsZXNQZWRhbnRpYzogUnVsZXNJbmxpbmVQZWRhbnRpYyA9IG51bGw7XG4gIC8qKlxuICAgKiBHRk0gSW5saW5lIEdyYW1tYXJcbiAgICovXG4gIHByb3RlY3RlZCBzdGF0aWMgcnVsZXNHZm06IFJ1bGVzSW5saW5lR2ZtID0gbnVsbDtcbiAgLyoqXG4gICAqIEdGTSArIExpbmUgQnJlYWtzIElubGluZSBHcmFtbWFyLlxuICAgKi9cbiAgcHJvdGVjdGVkIHN0YXRpYyBydWxlc0JyZWFrczogUnVsZXNJbmxpbmVCcmVha3MgPSBudWxsO1xuICBwcm90ZWN0ZWQgcnVsZXM6IFJ1bGVzSW5saW5lQmFzZSB8IFJ1bGVzSW5saW5lUGVkYW50aWMgfCBSdWxlc0lubGluZUdmbSB8IFJ1bGVzSW5saW5lQnJlYWtzO1xuICBwcm90ZWN0ZWQgcmVuZGVyZXI6IFJlbmRlcmVyO1xuICBwcm90ZWN0ZWQgaW5MaW5rOiBib29sZWFuO1xuICBwcm90ZWN0ZWQgaGFzUnVsZXNHZm06IGJvb2xlYW47XG4gIHByb3RlY3RlZCBydWxlQ2FsbGJhY2tzOiBSdWxlc0lubGluZUNhbGxiYWNrW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIHN0YXRpY1RoaXM6IHR5cGVvZiBJbmxpbmVMZXhlcixcbiAgICBwcm90ZWN0ZWQgbGlua3M6IExpbmtzLFxuICAgIHByb3RlY3RlZCBvcHRpb25zOiBNYXJrZWRPcHRpb25zID0gTWFya2VkLm9wdGlvbnMsXG4gICAgcmVuZGVyZXI/OiBSZW5kZXJlclxuICApIHtcbiAgICB0aGlzLnJlbmRlcmVyID0gcmVuZGVyZXIgfHwgdGhpcy5vcHRpb25zLnJlbmRlcmVyIHx8IG5ldyBSZW5kZXJlcih0aGlzLm9wdGlvbnMpO1xuXG4gICAgaWYgKCF0aGlzLmxpbmtzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYElubGluZUxleGVyIHJlcXVpcmVzICdsaW5rcycgcGFyYW1ldGVyLmApO1xuICAgIH1cblxuICAgIHRoaXMuc2V0UnVsZXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGF0aWMgTGV4aW5nL0NvbXBpbGluZyBNZXRob2QuXG4gICAqL1xuICBzdGF0aWMgb3V0cHV0KHNyYzogc3RyaW5nLCBsaW5rczogTGlua3MsIG9wdGlvbnM6IE1hcmtlZE9wdGlvbnMpOiBzdHJpbmcge1xuICAgIGNvbnN0IGlubGluZUxleGVyID0gbmV3IHRoaXModGhpcywgbGlua3MsIG9wdGlvbnMpO1xuICAgIHJldHVybiBpbmxpbmVMZXhlci5vdXRwdXQoc3JjKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzdGF0aWMgZ2V0UnVsZXNCYXNlKCk6IFJ1bGVzSW5saW5lQmFzZSB7XG4gICAgaWYgKHRoaXMucnVsZXNCYXNlKSB7XG4gICAgICByZXR1cm4gdGhpcy5ydWxlc0Jhc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5saW5lLUxldmVsIEdyYW1tYXIuXG4gICAgICovXG4gICAgY29uc3QgYmFzZTogUnVsZXNJbmxpbmVCYXNlID0ge1xuICAgICAgZXNjYXBlOiAvXlxcXFwoW1xcXFxgKnt9XFxbXFxdKCkjK1xcLS4hXz5dKS8sXG4gICAgICBhdXRvbGluazogL148KFteIDw+XSsoQHw6XFwvKVteIDw+XSspPi8sXG4gICAgICB0YWc6IC9ePCEtLVtcXHNcXFNdKj8tLT58XjxcXC8/XFx3Kyg/OlwiW15cIl0qXCJ8J1teJ10qJ3xbXjwnXCI+XSkqPz4vLFxuICAgICAgbGluazogL14hP1xcWyhpbnNpZGUpXFxdXFwoaHJlZlxcKS8sXG4gICAgICByZWZsaW5rOiAvXiE/XFxbKGluc2lkZSlcXF1cXHMqXFxbKFteXFxdXSopXFxdLyxcbiAgICAgIG5vbGluazogL14hP1xcWygoPzpcXFtbXlxcXV0qXFxdfFteXFxbXFxdXSkqKVxcXS8sXG4gICAgICBzdHJvbmc6IC9eX18oW1xcc1xcU10rPylfXyg/IV8pfF5cXCpcXCooW1xcc1xcU10rPylcXCpcXCooPyFcXCopLyxcbiAgICAgIGVtOiAvXlxcYl8oKD86W15fXXxfXykrPylfXFxifF5cXCooKD86XFwqXFwqfFtcXHNcXFNdKSs/KVxcKig/IVxcKikvLFxuICAgICAgY29kZTogL14oYCspKFtcXHNcXFNdKj9bXmBdKVxcMSg/IWApLyxcbiAgICAgIGJyOiAvXiB7Mix9XFxuKD8hXFxzKiQpLyxcbiAgICAgIHRleHQ6IC9eW1xcc1xcU10rPyg/PVtcXFxcPCFcXFtfKmBdfCB7Mix9XFxufCQpLyxcbiAgICAgIF9pbnNpZGU6IC8oPzpcXFtbXlxcXV0qXFxdfFteXFxbXFxdXXxcXF0oPz1bXlxcW10qXFxdKSkqLyxcbiAgICAgIF9ocmVmOiAvXFxzKjw/KFtcXHNcXFNdKj8pPj8oPzpcXHMrWydcIl0oW1xcc1xcU10qPylbJ1wiXSk/XFxzKi8sXG4gICAgfTtcblxuICAgIGJhc2UubGluayA9IG5ldyBFeHRlbmRSZWdleHAoYmFzZS5saW5rKS5zZXRHcm91cCgnaW5zaWRlJywgYmFzZS5faW5zaWRlKS5zZXRHcm91cCgnaHJlZicsIGJhc2UuX2hyZWYpLmdldFJlZ2V4cCgpO1xuXG4gICAgYmFzZS5yZWZsaW5rID0gbmV3IEV4dGVuZFJlZ2V4cChiYXNlLnJlZmxpbmspLnNldEdyb3VwKCdpbnNpZGUnLCBiYXNlLl9pbnNpZGUpLmdldFJlZ2V4cCgpO1xuXG4gICAgcmV0dXJuICh0aGlzLnJ1bGVzQmFzZSA9IGJhc2UpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHN0YXRpYyBnZXRSdWxlc1BlZGFudGljKCk6IFJ1bGVzSW5saW5lUGVkYW50aWMge1xuICAgIGlmICh0aGlzLnJ1bGVzUGVkYW50aWMpIHtcbiAgICAgIHJldHVybiB0aGlzLnJ1bGVzUGVkYW50aWM7XG4gICAgfVxuXG4gICAgcmV0dXJuICh0aGlzLnJ1bGVzUGVkYW50aWMgPSB7XG4gICAgICAuLi50aGlzLmdldFJ1bGVzQmFzZSgpLFxuICAgICAgLi4ue1xuICAgICAgICBzdHJvbmc6IC9eX18oPz1cXFMpKFtcXHNcXFNdKj9cXFMpX18oPyFfKXxeXFwqXFwqKD89XFxTKShbXFxzXFxTXSo/XFxTKVxcKlxcKig/IVxcKikvLFxuICAgICAgICBlbTogL15fKD89XFxTKShbXFxzXFxTXSo/XFxTKV8oPyFfKXxeXFwqKD89XFxTKShbXFxzXFxTXSo/XFxTKVxcKig/IVxcKikvLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzdGF0aWMgZ2V0UnVsZXNHZm0oKTogUnVsZXNJbmxpbmVHZm0ge1xuICAgIGlmICh0aGlzLnJ1bGVzR2ZtKSB7XG4gICAgICByZXR1cm4gdGhpcy5ydWxlc0dmbTtcbiAgICB9XG5cbiAgICBjb25zdCBiYXNlID0gdGhpcy5nZXRSdWxlc0Jhc2UoKTtcblxuICAgIGNvbnN0IGVzY2FwZSA9IG5ldyBFeHRlbmRSZWdleHAoYmFzZS5lc2NhcGUpLnNldEdyb3VwKCddKScsICd+fF0pJykuZ2V0UmVnZXhwKCk7XG5cbiAgICBjb25zdCB0ZXh0ID0gbmV3IEV4dGVuZFJlZ2V4cChiYXNlLnRleHQpLnNldEdyb3VwKCddfCcsICd+XXwnKS5zZXRHcm91cCgnfCcsICd8aHR0cHM/Oi8vfCcpLmdldFJlZ2V4cCgpO1xuXG4gICAgcmV0dXJuICh0aGlzLnJ1bGVzR2ZtID0ge1xuICAgICAgLi4uYmFzZSxcbiAgICAgIC4uLntcbiAgICAgICAgZXNjYXBlLFxuICAgICAgICB1cmw6IC9eKGh0dHBzPzpcXC9cXC9bXlxcczxdK1tePC4sOjtcIicpXFxdXFxzXSkvLFxuICAgICAgICBkZWw6IC9efn4oPz1cXFMpKFtcXHNcXFNdKj9cXFMpfn4vLFxuICAgICAgICB0ZXh0LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzdGF0aWMgZ2V0UnVsZXNCcmVha3MoKTogUnVsZXNJbmxpbmVCcmVha3Mge1xuICAgIGlmICh0aGlzLnJ1bGVzQnJlYWtzKSB7XG4gICAgICByZXR1cm4gdGhpcy5ydWxlc0JyZWFrcztcbiAgICB9XG5cbiAgICBjb25zdCBpbmxpbmUgPSB0aGlzLmdldFJ1bGVzR2ZtKCk7XG4gICAgY29uc3QgZ2ZtID0gdGhpcy5nZXRSdWxlc0dmbSgpO1xuXG4gICAgcmV0dXJuICh0aGlzLnJ1bGVzQnJlYWtzID0ge1xuICAgICAgLi4uZ2ZtLFxuICAgICAgLi4ue1xuICAgICAgICBicjogbmV3IEV4dGVuZFJlZ2V4cChpbmxpbmUuYnIpLnNldEdyb3VwKCd7Mix9JywgJyonKS5nZXRSZWdleHAoKSxcbiAgICAgICAgdGV4dDogbmV3IEV4dGVuZFJlZ2V4cChnZm0udGV4dCkuc2V0R3JvdXAoJ3syLH0nLCAnKicpLmdldFJlZ2V4cCgpLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzZXRSdWxlcygpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLmdmbSkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5icmVha3MpIHtcbiAgICAgICAgdGhpcy5ydWxlcyA9IHRoaXMuc3RhdGljVGhpcy5nZXRSdWxlc0JyZWFrcygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5ydWxlcyA9IHRoaXMuc3RhdGljVGhpcy5nZXRSdWxlc0dmbSgpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLnBlZGFudGljKSB7XG4gICAgICB0aGlzLnJ1bGVzID0gdGhpcy5zdGF0aWNUaGlzLmdldFJ1bGVzUGVkYW50aWMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ydWxlcyA9IHRoaXMuc3RhdGljVGhpcy5nZXRSdWxlc0Jhc2UoKTtcbiAgICB9XG5cbiAgICB0aGlzLmhhc1J1bGVzR2ZtID0gKHRoaXMucnVsZXMgYXMgUnVsZXNJbmxpbmVHZm0pLnVybCAhPT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIExleGluZy9Db21waWxpbmcuXG4gICAqL1xuICBvdXRwdXQobmV4dFBhcnQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgbmV4dFBhcnQgPSBuZXh0UGFydDtcbiAgICBsZXQgZXhlY0FycjogUmVnRXhwRXhlY0FycmF5O1xuICAgIGxldCBvdXQgPSAnJztcblxuICAgIHdoaWxlIChuZXh0UGFydCkge1xuICAgICAgLy8gZXNjYXBlXG4gICAgICBpZiAoKGV4ZWNBcnIgPSB0aGlzLnJ1bGVzLmVzY2FwZS5leGVjKG5leHRQYXJ0KSkpIHtcbiAgICAgICAgbmV4dFBhcnQgPSBuZXh0UGFydC5zdWJzdHJpbmcoZXhlY0FyclswXS5sZW5ndGgpO1xuICAgICAgICBvdXQgKz0gZXhlY0FyclsxXTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIGF1dG9saW5rXG4gICAgICBpZiAoKGV4ZWNBcnIgPSB0aGlzLnJ1bGVzLmF1dG9saW5rLmV4ZWMobmV4dFBhcnQpKSkge1xuICAgICAgICBsZXQgdGV4dDogc3RyaW5nO1xuICAgICAgICBsZXQgaHJlZjogc3RyaW5nO1xuICAgICAgICBuZXh0UGFydCA9IG5leHRQYXJ0LnN1YnN0cmluZyhleGVjQXJyWzBdLmxlbmd0aCk7XG5cbiAgICAgICAgaWYgKGV4ZWNBcnJbMl0gPT09ICdAJykge1xuICAgICAgICAgIHRleHQgPSB0aGlzLm9wdGlvbnMuZXNjYXBlKFxuICAgICAgICAgICAgZXhlY0FyclsxXS5jaGFyQXQoNikgPT09ICc6JyA/IHRoaXMubWFuZ2xlKGV4ZWNBcnJbMV0uc3Vic3RyaW5nKDcpKSA6IHRoaXMubWFuZ2xlKGV4ZWNBcnJbMV0pXG4gICAgICAgICAgKTtcbiAgICAgICAgICBocmVmID0gdGhpcy5tYW5nbGUoJ21haWx0bzonKSArIHRleHQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGV4dCA9IHRoaXMub3B0aW9ucy5lc2NhcGUoZXhlY0FyclsxXSk7XG4gICAgICAgICAgaHJlZiA9IHRleHQ7XG4gICAgICAgIH1cblxuICAgICAgICBvdXQgKz0gdGhpcy5yZW5kZXJlci5saW5rKGhyZWYsIG51bGwsIHRleHQpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gdXJsIChnZm0pXG4gICAgICBpZiAoIXRoaXMuaW5MaW5rICYmIHRoaXMuaGFzUnVsZXNHZm0gJiYgKGV4ZWNBcnIgPSAodGhpcy5ydWxlcyBhcyBSdWxlc0lubGluZUdmbSkudXJsLmV4ZWMobmV4dFBhcnQpKSkge1xuICAgICAgICBsZXQgdGV4dDogc3RyaW5nO1xuICAgICAgICBsZXQgaHJlZjogc3RyaW5nO1xuICAgICAgICBuZXh0UGFydCA9IG5leHRQYXJ0LnN1YnN0cmluZyhleGVjQXJyWzBdLmxlbmd0aCk7XG4gICAgICAgIHRleHQgPSB0aGlzLm9wdGlvbnMuZXNjYXBlKGV4ZWNBcnJbMV0pO1xuICAgICAgICBocmVmID0gdGV4dDtcbiAgICAgICAgb3V0ICs9IHRoaXMucmVuZGVyZXIubGluayhocmVmLCBudWxsLCB0ZXh0KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIHRhZ1xuICAgICAgaWYgKChleGVjQXJyID0gdGhpcy5ydWxlcy50YWcuZXhlYyhuZXh0UGFydCkpKSB7XG4gICAgICAgIGlmICghdGhpcy5pbkxpbmsgJiYgL148YSAvaS50ZXN0KGV4ZWNBcnJbMF0pKSB7XG4gICAgICAgICAgdGhpcy5pbkxpbmsgPSB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaW5MaW5rICYmIC9ePFxcL2E+L2kudGVzdChleGVjQXJyWzBdKSkge1xuICAgICAgICAgIHRoaXMuaW5MaW5rID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBuZXh0UGFydCA9IG5leHRQYXJ0LnN1YnN0cmluZyhleGVjQXJyWzBdLmxlbmd0aCk7XG5cbiAgICAgICAgb3V0ICs9IHRoaXMub3B0aW9ucy5zYW5pdGl6ZVxuICAgICAgICAgID8gdGhpcy5vcHRpb25zLnNhbml0aXplclxuICAgICAgICAgICAgPyB0aGlzLm9wdGlvbnMuc2FuaXRpemVyKGV4ZWNBcnJbMF0pXG4gICAgICAgICAgICA6IHRoaXMub3B0aW9ucy5lc2NhcGUoZXhlY0FyclswXSlcbiAgICAgICAgICA6IGV4ZWNBcnJbMF07XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBsaW5rXG4gICAgICBpZiAoKGV4ZWNBcnIgPSB0aGlzLnJ1bGVzLmxpbmsuZXhlYyhuZXh0UGFydCkpKSB7XG4gICAgICAgIG5leHRQYXJ0ID0gbmV4dFBhcnQuc3Vic3RyaW5nKGV4ZWNBcnJbMF0ubGVuZ3RoKTtcbiAgICAgICAgdGhpcy5pbkxpbmsgPSB0cnVlO1xuXG4gICAgICAgIG91dCArPSB0aGlzLm91dHB1dExpbmsoZXhlY0Fyciwge1xuICAgICAgICAgIGhyZWY6IGV4ZWNBcnJbMl0sXG4gICAgICAgICAgdGl0bGU6IGV4ZWNBcnJbM10sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuaW5MaW5rID0gZmFsc2U7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyByZWZsaW5rLCBub2xpbmtcbiAgICAgIGlmICgoZXhlY0FyciA9IHRoaXMucnVsZXMucmVmbGluay5leGVjKG5leHRQYXJ0KSkgfHwgKGV4ZWNBcnIgPSB0aGlzLnJ1bGVzLm5vbGluay5leGVjKG5leHRQYXJ0KSkpIHtcbiAgICAgICAgbmV4dFBhcnQgPSBuZXh0UGFydC5zdWJzdHJpbmcoZXhlY0FyclswXS5sZW5ndGgpO1xuICAgICAgICBjb25zdCBrZXlMaW5rID0gKGV4ZWNBcnJbMl0gfHwgZXhlY0FyclsxXSkucmVwbGFjZSgvXFxzKy9nLCAnICcpO1xuICAgICAgICBjb25zdCBsaW5rID0gdGhpcy5saW5rc1trZXlMaW5rLnRvTG93ZXJDYXNlKCldO1xuXG4gICAgICAgIGlmICghbGluayB8fCAhbGluay5ocmVmKSB7XG4gICAgICAgICAgb3V0ICs9IGV4ZWNBcnJbMF0uY2hhckF0KDApO1xuICAgICAgICAgIG5leHRQYXJ0ID0gZXhlY0FyclswXS5zdWJzdHJpbmcoMSkgKyBuZXh0UGFydDtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaW5MaW5rID0gdHJ1ZTtcbiAgICAgICAgb3V0ICs9IHRoaXMub3V0cHV0TGluayhleGVjQXJyLCBsaW5rKTtcbiAgICAgICAgdGhpcy5pbkxpbmsgPSBmYWxzZTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIHN0cm9uZ1xuICAgICAgaWYgKChleGVjQXJyID0gdGhpcy5ydWxlcy5zdHJvbmcuZXhlYyhuZXh0UGFydCkpKSB7XG4gICAgICAgIG5leHRQYXJ0ID0gbmV4dFBhcnQuc3Vic3RyaW5nKGV4ZWNBcnJbMF0ubGVuZ3RoKTtcbiAgICAgICAgb3V0ICs9IHRoaXMucmVuZGVyZXIuc3Ryb25nKHRoaXMub3V0cHV0KGV4ZWNBcnJbMl0gfHwgZXhlY0FyclsxXSkpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gZW1cbiAgICAgIGlmICgoZXhlY0FyciA9IHRoaXMucnVsZXMuZW0uZXhlYyhuZXh0UGFydCkpKSB7XG4gICAgICAgIG5leHRQYXJ0ID0gbmV4dFBhcnQuc3Vic3RyaW5nKGV4ZWNBcnJbMF0ubGVuZ3RoKTtcbiAgICAgICAgb3V0ICs9IHRoaXMucmVuZGVyZXIuZW0odGhpcy5vdXRwdXQoZXhlY0FyclsyXSB8fCBleGVjQXJyWzFdKSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBjb2RlXG4gICAgICBpZiAoKGV4ZWNBcnIgPSB0aGlzLnJ1bGVzLmNvZGUuZXhlYyhuZXh0UGFydCkpKSB7XG4gICAgICAgIG5leHRQYXJ0ID0gbmV4dFBhcnQuc3Vic3RyaW5nKGV4ZWNBcnJbMF0ubGVuZ3RoKTtcbiAgICAgICAgb3V0ICs9IHRoaXMucmVuZGVyZXIuY29kZXNwYW4odGhpcy5vcHRpb25zLmVzY2FwZShleGVjQXJyWzJdLnRyaW0oKSwgdHJ1ZSkpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gYnJcbiAgICAgIGlmICgoZXhlY0FyciA9IHRoaXMucnVsZXMuYnIuZXhlYyhuZXh0UGFydCkpKSB7XG4gICAgICAgIG5leHRQYXJ0ID0gbmV4dFBhcnQuc3Vic3RyaW5nKGV4ZWNBcnJbMF0ubGVuZ3RoKTtcbiAgICAgICAgb3V0ICs9IHRoaXMucmVuZGVyZXIuYnIoKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIGRlbCAoZ2ZtKVxuICAgICAgaWYgKHRoaXMuaGFzUnVsZXNHZm0gJiYgKGV4ZWNBcnIgPSAodGhpcy5ydWxlcyBhcyBSdWxlc0lubGluZUdmbSkuZGVsLmV4ZWMobmV4dFBhcnQpKSkge1xuICAgICAgICBuZXh0UGFydCA9IG5leHRQYXJ0LnN1YnN0cmluZyhleGVjQXJyWzBdLmxlbmd0aCk7XG4gICAgICAgIG91dCArPSB0aGlzLnJlbmRlcmVyLmRlbCh0aGlzLm91dHB1dChleGVjQXJyWzFdKSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyB0ZXh0XG4gICAgICBpZiAoKGV4ZWNBcnIgPSB0aGlzLnJ1bGVzLnRleHQuZXhlYyhuZXh0UGFydCkpKSB7XG4gICAgICAgIG5leHRQYXJ0ID0gbmV4dFBhcnQuc3Vic3RyaW5nKGV4ZWNBcnJbMF0ubGVuZ3RoKTtcbiAgICAgICAgb3V0ICs9IHRoaXMucmVuZGVyZXIudGV4dCh0aGlzLm9wdGlvbnMuZXNjYXBlKHRoaXMuc21hcnR5cGFudHMoZXhlY0FyclswXSkpKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChuZXh0UGFydCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0luZmluaXRlIGxvb3Agb24gYnl0ZTogJyArIG5leHRQYXJ0LmNoYXJDb2RlQXQoMCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBvdXQ7XG4gIH1cblxuICAvKipcbiAgICogQ29tcGlsZSBMaW5rLlxuICAgKi9cbiAgcHJvdGVjdGVkIG91dHB1dExpbmsoZXhlY0FycjogUmVnRXhwRXhlY0FycmF5LCBsaW5rOiBMaW5rKSB7XG4gICAgY29uc3QgaHJlZiA9IHRoaXMub3B0aW9ucy5lc2NhcGUobGluay5ocmVmKTtcbiAgICBjb25zdCB0aXRsZSA9IGxpbmsudGl0bGUgPyB0aGlzLm9wdGlvbnMuZXNjYXBlKGxpbmsudGl0bGUpIDogbnVsbDtcblxuICAgIHJldHVybiBleGVjQXJyWzBdLmNoYXJBdCgwKSAhPT0gJyEnXG4gICAgICA/IHRoaXMucmVuZGVyZXIubGluayhocmVmLCB0aXRsZSwgdGhpcy5vdXRwdXQoZXhlY0FyclsxXSkpXG4gICAgICA6IHRoaXMucmVuZGVyZXIuaW1hZ2UoaHJlZiwgdGl0bGUsIHRoaXMub3B0aW9ucy5lc2NhcGUoZXhlY0FyclsxXSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNtYXJ0eXBhbnRzIFRyYW5zZm9ybWF0aW9ucy5cbiAgICovXG4gIHByb3RlY3RlZCBzbWFydHlwYW50cyh0ZXh0OiBzdHJpbmcpIHtcbiAgICBpZiAoIXRoaXMub3B0aW9ucy5zbWFydHlwYW50cykge1xuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIHRleHRcbiAgICAgICAgLy8gZW0tZGFzaGVzXG4gICAgICAgIC5yZXBsYWNlKC8tLS0vZywgJ1xcdTIwMTQnKVxuICAgICAgICAvLyBlbi1kYXNoZXNcbiAgICAgICAgLnJlcGxhY2UoLy0tL2csICdcXHUyMDEzJylcbiAgICAgICAgLy8gb3BlbmluZyBzaW5nbGVzXG4gICAgICAgIC5yZXBsYWNlKC8oXnxbLVxcdTIwMTQvKFxcW3tcIlxcc10pJy9nLCAnJDFcXHUyMDE4JylcbiAgICAgICAgLy8gY2xvc2luZyBzaW5nbGVzICYgYXBvc3Ryb3BoZXNcbiAgICAgICAgLnJlcGxhY2UoLycvZywgJ1xcdTIwMTknKVxuICAgICAgICAvLyBvcGVuaW5nIGRvdWJsZXNcbiAgICAgICAgLnJlcGxhY2UoLyhefFstXFx1MjAxNC8oXFxbe1xcdTIwMThcXHNdKVwiL2csICckMVxcdTIwMWMnKVxuICAgICAgICAvLyBjbG9zaW5nIGRvdWJsZXNcbiAgICAgICAgLnJlcGxhY2UoL1wiL2csICdcXHUyMDFkJylcbiAgICAgICAgLy8gZWxsaXBzZXNcbiAgICAgICAgLnJlcGxhY2UoL1xcLnszfS9nLCAnXFx1MjAyNicpXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYW5nbGUgTGlua3MuXG4gICAqL1xuICBwcm90ZWN0ZWQgbWFuZ2xlKHRleHQ6IHN0cmluZykge1xuICAgIGlmICghdGhpcy5vcHRpb25zLm1hbmdsZSkge1xuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuXG4gICAgbGV0IG91dCA9ICcnO1xuICAgIGNvbnN0IGxlbmd0aCA9IHRleHQubGVuZ3RoO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgbGV0IHN0cjogc3RyaW5nO1xuXG4gICAgICBpZiAoTWF0aC5yYW5kb20oKSA+IDAuNSkge1xuICAgICAgICBzdHIgPSAneCcgKyB0ZXh0LmNoYXJDb2RlQXQoaSkudG9TdHJpbmcoMTYpO1xuICAgICAgfVxuXG4gICAgICBvdXQgKz0gJyYjJyArIHN0ciArICc7JztcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0O1xuICB9XG59XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxMS0yMDE0LCBDaHJpc3RvcGhlciBKZWZmcmV5LiAoTUlUIExpY2Vuc2VkKVxuICogaHR0cHM6Ly9naXRodWIuY29tL2NoamovbWFya2VkXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE4LTIwMjEsIFx1MDQxQVx1MDQzRVx1MDQ0MVx1MDQ0Mlx1MDQ0RiBcdTA0MjJcdTA0NDBcdTA0MzVcdTA0NDJcdTA0NEZcdTA0M0EuIChNSVQgTGljZW5zZWQpXG4gKiBodHRwczovL2dpdGh1Yi5jb20vdHMtc3RhY2svbWFya2Rvd25cbiAqL1xuXG5pbXBvcnQgeyBJbmxpbmVMZXhlciB9IGZyb20gJy4vaW5saW5lLWxleGVyJztcbmltcG9ydCB7IExpbmtzLCBNYXJrZWRPcHRpb25zLCBTaW1wbGVSZW5kZXJlciwgVG9rZW4sIFRva2VuVHlwZSB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBNYXJrZWQgfSBmcm9tICcuL21hcmtlZCc7XG5pbXBvcnQgeyBSZW5kZXJlciB9IGZyb20gJy4vcmVuZGVyZXInO1xuXG4vKipcbiAqIFBhcnNpbmcgJiBDb21waWxpbmcuXG4gKi9cbmV4cG9ydCBjbGFzcyBQYXJzZXIge1xuICBzaW1wbGVSZW5kZXJlcnM6IFNpbXBsZVJlbmRlcmVyW10gPSBbXTtcbiAgcHJvdGVjdGVkIHRva2VuczogVG9rZW5bXTtcbiAgcHJvdGVjdGVkIHRva2VuOiBUb2tlbjtcbiAgcHJvdGVjdGVkIGlubGluZUxleGVyOiBJbmxpbmVMZXhlcjtcbiAgcHJvdGVjdGVkIG9wdGlvbnM6IE1hcmtlZE9wdGlvbnM7XG4gIHByb3RlY3RlZCByZW5kZXJlcjogUmVuZGVyZXI7XG4gIHByb3RlY3RlZCBsaW5lOiBudW1iZXIgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM/OiBNYXJrZWRPcHRpb25zKSB7XG4gICAgdGhpcy50b2tlbnMgPSBbXTtcbiAgICB0aGlzLnRva2VuID0gbnVsbDtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IE1hcmtlZC5vcHRpb25zO1xuICAgIHRoaXMucmVuZGVyZXIgPSB0aGlzLm9wdGlvbnMucmVuZGVyZXIgfHwgbmV3IFJlbmRlcmVyKHRoaXMub3B0aW9ucyk7XG4gIH1cblxuICBzdGF0aWMgcGFyc2UodG9rZW5zOiBUb2tlbltdLCBsaW5rczogTGlua3MsIG9wdGlvbnM/OiBNYXJrZWRPcHRpb25zKTogc3RyaW5nIHtcbiAgICBjb25zdCBwYXJzZXIgPSBuZXcgdGhpcyhvcHRpb25zKTtcbiAgICByZXR1cm4gcGFyc2VyLnBhcnNlKGxpbmtzLCB0b2tlbnMpO1xuICB9XG5cbiAgcGFyc2UobGlua3M6IExpbmtzLCB0b2tlbnM6IFRva2VuW10pIHtcbiAgICB0aGlzLmlubGluZUxleGVyID0gbmV3IElubGluZUxleGVyKElubGluZUxleGVyLCBsaW5rcywgdGhpcy5vcHRpb25zLCB0aGlzLnJlbmRlcmVyKTtcbiAgICB0aGlzLnRva2VucyA9IHRva2Vucy5yZXZlcnNlKCk7XG5cbiAgICBsZXQgb3V0ID0gJyc7XG5cbiAgICB3aGlsZSAodGhpcy5uZXh0KCkpIHtcbiAgICAgIG91dCArPSB0aGlzLnRvaygpO1xuICAgIH1cblxuICAgIHJldHVybiBvdXQ7XG4gIH1cblxuICBkZWJ1ZyhsaW5rczogTGlua3MsIHRva2VuczogVG9rZW5bXSkge1xuICAgIHRoaXMuaW5saW5lTGV4ZXIgPSBuZXcgSW5saW5lTGV4ZXIoSW5saW5lTGV4ZXIsIGxpbmtzLCB0aGlzLm9wdGlvbnMsIHRoaXMucmVuZGVyZXIpO1xuICAgIHRoaXMudG9rZW5zID0gdG9rZW5zLnJldmVyc2UoKTtcblxuICAgIGxldCBvdXQgPSAnJztcblxuICAgIHdoaWxlICh0aGlzLm5leHQoKSkge1xuICAgICAgY29uc3Qgb3V0VG9rZW46IHN0cmluZyA9IHRoaXMudG9rKCk7XG4gICAgICB0aGlzLnRva2VuLmxpbmUgPSB0aGlzLmxpbmUgKz0gb3V0VG9rZW4uc3BsaXQoJ1xcbicpLmxlbmd0aCAtIDE7XG4gICAgICBvdXQgKz0gb3V0VG9rZW47XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dDtcbiAgfVxuXG4gIHByb3RlY3RlZCBuZXh0KCkge1xuICAgIHJldHVybiAodGhpcy50b2tlbiA9IHRoaXMudG9rZW5zLnBvcCgpKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXROZXh0RWxlbWVudCgpIHtcbiAgICByZXR1cm4gdGhpcy50b2tlbnNbdGhpcy50b2tlbnMubGVuZ3RoIC0gMV07XG4gIH1cblxuICBwcm90ZWN0ZWQgcGFyc2VUZXh0KCkge1xuICAgIGxldCBib2R5ID0gdGhpcy50b2tlbi50ZXh0O1xuICAgIGxldCBuZXh0RWxlbWVudDogVG9rZW47XG5cbiAgICB3aGlsZSAoKG5leHRFbGVtZW50ID0gdGhpcy5nZXROZXh0RWxlbWVudCgpKSAmJiBuZXh0RWxlbWVudC50eXBlID09IFRva2VuVHlwZS50ZXh0KSB7XG4gICAgICBib2R5ICs9ICdcXG4nICsgdGhpcy5uZXh0KCkudGV4dDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5pbmxpbmVMZXhlci5vdXRwdXQoYm9keSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgdG9rKCkge1xuICAgIHN3aXRjaCAodGhpcy50b2tlbi50eXBlKSB7XG4gICAgICBjYXNlIFRva2VuVHlwZS5zcGFjZToge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgICB9XG4gICAgICBjYXNlIFRva2VuVHlwZS5wYXJhZ3JhcGg6IHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyZXIucGFyYWdyYXBoKHRoaXMuaW5saW5lTGV4ZXIub3V0cHV0KHRoaXMudG9rZW4udGV4dCkpO1xuICAgICAgfVxuICAgICAgY2FzZSBUb2tlblR5cGUudGV4dDoge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmlzTm9QKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VUZXh0KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyZXIucGFyYWdyYXBoKHRoaXMucGFyc2VUZXh0KCkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjYXNlIFRva2VuVHlwZS5oZWFkaW5nOiB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlcmVyLmhlYWRpbmcodGhpcy5pbmxpbmVMZXhlci5vdXRwdXQodGhpcy50b2tlbi50ZXh0KSwgdGhpcy50b2tlbi5kZXB0aCwgdGhpcy50b2tlbi50ZXh0KTtcbiAgICAgIH1cbiAgICAgIGNhc2UgVG9rZW5UeXBlLmxpc3RTdGFydDoge1xuICAgICAgICBsZXQgYm9keSA9ICcnO1xuICAgICAgICBjb25zdCBvcmRlcmVkID0gdGhpcy50b2tlbi5vcmRlcmVkO1xuXG4gICAgICAgIHdoaWxlICh0aGlzLm5leHQoKS50eXBlICE9IFRva2VuVHlwZS5saXN0RW5kKSB7XG4gICAgICAgICAgYm9keSArPSB0aGlzLnRvaygpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyZXIubGlzdChib2R5LCBvcmRlcmVkKTtcbiAgICAgIH1cbiAgICAgIGNhc2UgVG9rZW5UeXBlLmxpc3RJdGVtU3RhcnQ6IHtcbiAgICAgICAgbGV0IGJvZHkgPSAnJztcblxuICAgICAgICB3aGlsZSAodGhpcy5uZXh0KCkudHlwZSAhPSBUb2tlblR5cGUubGlzdEl0ZW1FbmQpIHtcbiAgICAgICAgICBib2R5ICs9IHRoaXMudG9rZW4udHlwZSA9PSAoVG9rZW5UeXBlLnRleHQgYXMgYW55KSA/IHRoaXMucGFyc2VUZXh0KCkgOiB0aGlzLnRvaygpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyZXIubGlzdGl0ZW0oYm9keSk7XG4gICAgICB9XG4gICAgICBjYXNlIFRva2VuVHlwZS5sb29zZUl0ZW1TdGFydDoge1xuICAgICAgICBsZXQgYm9keSA9ICcnO1xuXG4gICAgICAgIHdoaWxlICh0aGlzLm5leHQoKS50eXBlICE9IFRva2VuVHlwZS5saXN0SXRlbUVuZCkge1xuICAgICAgICAgIGJvZHkgKz0gdGhpcy50b2soKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlcmVyLmxpc3RpdGVtKGJvZHkpO1xuICAgICAgfVxuICAgICAgY2FzZSBUb2tlblR5cGUuY29kZToge1xuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJlci5jb2RlKHRoaXMudG9rZW4udGV4dCwgdGhpcy50b2tlbi5sYW5nLCB0aGlzLnRva2VuLmVzY2FwZWQsIHRoaXMudG9rZW4ubWV0YSk7XG4gICAgICB9XG4gICAgICBjYXNlIFRva2VuVHlwZS50YWJsZToge1xuICAgICAgICBsZXQgaGVhZGVyID0gJyc7XG4gICAgICAgIGxldCBib2R5ID0gJyc7XG4gICAgICAgIGxldCBjZWxsO1xuXG4gICAgICAgIC8vIGhlYWRlclxuICAgICAgICBjZWxsID0gJyc7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy50b2tlbi5oZWFkZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBmbGFncyA9IHsgaGVhZGVyOiB0cnVlLCBhbGlnbjogdGhpcy50b2tlbi5hbGlnbltpXSB9O1xuICAgICAgICAgIGNvbnN0IG91dCA9IHRoaXMuaW5saW5lTGV4ZXIub3V0cHV0KHRoaXMudG9rZW4uaGVhZGVyW2ldKTtcblxuICAgICAgICAgIGNlbGwgKz0gdGhpcy5yZW5kZXJlci50YWJsZWNlbGwob3V0LCBmbGFncyk7XG4gICAgICAgIH1cblxuICAgICAgICBoZWFkZXIgKz0gdGhpcy5yZW5kZXJlci50YWJsZXJvdyhjZWxsKTtcblxuICAgICAgICBmb3IgKGNvbnN0IHJvdyBvZiB0aGlzLnRva2VuLmNlbGxzKSB7XG4gICAgICAgICAgY2VsbCA9ICcnO1xuXG4gICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCByb3cubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGNlbGwgKz0gdGhpcy5yZW5kZXJlci50YWJsZWNlbGwodGhpcy5pbmxpbmVMZXhlci5vdXRwdXQocm93W2pdKSwge1xuICAgICAgICAgICAgICBoZWFkZXI6IGZhbHNlLFxuICAgICAgICAgICAgICBhbGlnbjogdGhpcy50b2tlbi5hbGlnbltqXVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYm9keSArPSB0aGlzLnJlbmRlcmVyLnRhYmxlcm93KGNlbGwpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyZXIudGFibGUoaGVhZGVyLCBib2R5KTtcbiAgICAgIH1cbiAgICAgIGNhc2UgVG9rZW5UeXBlLmJsb2NrcXVvdGVTdGFydDoge1xuICAgICAgICBsZXQgYm9keSA9ICcnO1xuXG4gICAgICAgIHdoaWxlICh0aGlzLm5leHQoKS50eXBlICE9IFRva2VuVHlwZS5ibG9ja3F1b3RlRW5kKSB7XG4gICAgICAgICAgYm9keSArPSB0aGlzLnRvaygpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyZXIuYmxvY2txdW90ZShib2R5KTtcbiAgICAgIH1cbiAgICAgIGNhc2UgVG9rZW5UeXBlLmhyOiB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlcmVyLmhyKCk7XG4gICAgICB9XG4gICAgICBjYXNlIFRva2VuVHlwZS5odG1sOiB7XG4gICAgICAgIGNvbnN0IGh0bWwgPVxuICAgICAgICAgICF0aGlzLnRva2VuLnByZSAmJiAhdGhpcy5vcHRpb25zLnBlZGFudGljID8gdGhpcy5pbmxpbmVMZXhlci5vdXRwdXQodGhpcy50b2tlbi50ZXh0KSA6IHRoaXMudG9rZW4udGV4dDtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyZXIuaHRtbChodG1sKTtcbiAgICAgIH1cbiAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgaWYgKHRoaXMuc2ltcGxlUmVuZGVyZXJzLmxlbmd0aCkge1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zaW1wbGVSZW5kZXJlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnRva2VuLnR5cGUgPT0gJ3NpbXBsZVJ1bGUnICsgKGkgKyAxKSkge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zaW1wbGVSZW5kZXJlcnNbaV0uY2FsbCh0aGlzLnJlbmRlcmVyLCB0aGlzLnRva2VuLmV4ZWNBcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGVyck1zZyA9IGBUb2tlbiB3aXRoIFwiJHt0aGlzLnRva2VuLnR5cGV9XCIgdHlwZSB3YXMgbm90IGZvdW5kLmA7XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zaWxlbnQpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhlcnJNc2cpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJNc2cpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxMS0yMDE0LCBDaHJpc3RvcGhlciBKZWZmcmV5LiAoTUlUIExpY2Vuc2VkKVxuICogaHR0cHM6Ly9naXRodWIuY29tL2NoamovbWFya2VkXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE4LTIwMjEsIFx1MDQxQVx1MDQzRVx1MDQ0MVx1MDQ0Mlx1MDQ0RiBcdTA0MjJcdTA0NDBcdTA0MzVcdTA0NDJcdTA0NEZcdTA0M0EuIChNSVQgTGljZW5zZWQpXG4gKiBodHRwczovL2dpdGh1Yi5jb20vdHMtc3RhY2svbWFya2Rvd25cbiAqL1xuXG5pbXBvcnQgeyBCbG9ja0xleGVyIH0gZnJvbSAnLi9ibG9jay1sZXhlcic7XG5pbXBvcnQgeyBEZWJ1Z1JldHVybnMsIExleGVyUmV0dXJucywgTGlua3MsIE1hcmtlZE9wdGlvbnMsIFNpbXBsZVJlbmRlcmVyLCBUb2tlbiwgVG9rZW5UeXBlIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7IFBhcnNlciB9IGZyb20gJy4vcGFyc2VyJztcblxuZXhwb3J0IGNsYXNzIE1hcmtlZCB7XG4gIHN0YXRpYyBvcHRpb25zID0gbmV3IE1hcmtlZE9wdGlvbnMoKTtcbiAgcHJvdGVjdGVkIHN0YXRpYyBzaW1wbGVSZW5kZXJlcnM6IFNpbXBsZVJlbmRlcmVyW10gPSBbXTtcblxuICAvKipcbiAgICogTWVyZ2VzIHRoZSBkZWZhdWx0IG9wdGlvbnMgd2l0aCBvcHRpb25zIHRoYXQgd2lsbCBiZSBzZXQuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRpb25zIEhhc2ggb2Ygb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyBzZXRPcHRpb25zKG9wdGlvbnM6IE1hcmtlZE9wdGlvbnMpIHtcbiAgICBPYmplY3QuYXNzaWduKHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGluZyBzaW1wbGUgYmxvY2sgcnVsZS5cbiAgICovXG4gIHN0YXRpYyBzZXRCbG9ja1J1bGUocmVnZXhwOiBSZWdFeHAsIHJlbmRlcmVyOiBTaW1wbGVSZW5kZXJlciA9ICgpID0+ICcnKSB7XG4gICAgQmxvY2tMZXhlci5zaW1wbGVSdWxlcy5wdXNoKHJlZ2V4cCk7XG4gICAgdGhpcy5zaW1wbGVSZW5kZXJlcnMucHVzaChyZW5kZXJlcik7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBBY2NlcHRzIE1hcmtkb3duIHRleHQgYW5kIHJldHVybnMgdGV4dCBpbiBIVE1MIGZvcm1hdC5cbiAgICpcbiAgICogQHBhcmFtIHNyYyBTdHJpbmcgb2YgbWFya2Rvd24gc291cmNlIHRvIGJlIGNvbXBpbGVkLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBIYXNoIG9mIG9wdGlvbnMuIFRoZXkgcmVwbGFjZSwgYnV0IGRvIG5vdCBtZXJnZSB3aXRoIHRoZSBkZWZhdWx0IG9wdGlvbnMuXG4gICAqIElmIHlvdSB3YW50IHRoZSBtZXJnaW5nLCB5b3UgY2FuIHRvIGRvIHRoaXMgdmlhIGBNYXJrZWQuc2V0T3B0aW9ucygpYC5cbiAgICovXG4gIHN0YXRpYyBwYXJzZShzcmM6IHN0cmluZywgb3B0aW9uczogTWFya2VkT3B0aW9ucyA9IHRoaXMub3B0aW9ucyk6IHN0cmluZyB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHsgdG9rZW5zLCBsaW5rcyB9ID0gdGhpcy5jYWxsQmxvY2tMZXhlcihzcmMsIG9wdGlvbnMpO1xuICAgICAgcmV0dXJuIHRoaXMuY2FsbFBhcnNlcih0b2tlbnMsIGxpbmtzLCBvcHRpb25zKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gdGhpcy5jYWxsTWUoZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFjY2VwdHMgTWFya2Rvd24gdGV4dCBhbmQgcmV0dXJucyBvYmplY3Qgd2l0aCB0ZXh0IGluIEhUTUwgZm9ybWF0LFxuICAgKiB0b2tlbnMgYW5kIGxpbmtzIGZyb20gYEJsb2NrTGV4ZXIucGFyc2VyKClgLlxuICAgKlxuICAgKiBAcGFyYW0gc3JjIFN0cmluZyBvZiBtYXJrZG93biBzb3VyY2UgdG8gYmUgY29tcGlsZWQuXG4gICAqIEBwYXJhbSBvcHRpb25zIEhhc2ggb2Ygb3B0aW9ucy4gVGhleSByZXBsYWNlLCBidXQgZG8gbm90IG1lcmdlIHdpdGggdGhlIGRlZmF1bHQgb3B0aW9ucy5cbiAgICogSWYgeW91IHdhbnQgdGhlIG1lcmdpbmcsIHlvdSBjYW4gdG8gZG8gdGhpcyB2aWEgYE1hcmtlZC5zZXRPcHRpb25zKClgLlxuICAgKi9cbiAgc3RhdGljIGRlYnVnKHNyYzogc3RyaW5nLCBvcHRpb25zOiBNYXJrZWRPcHRpb25zID0gdGhpcy5vcHRpb25zKTogRGVidWdSZXR1cm5zIHtcbiAgICBjb25zdCB7IHRva2VucywgbGlua3MgfSA9IHRoaXMuY2FsbEJsb2NrTGV4ZXIoc3JjLCBvcHRpb25zKTtcbiAgICBsZXQgb3JpZ2luID0gdG9rZW5zLnNsaWNlKCk7XG4gICAgY29uc3QgcGFyc2VyID0gbmV3IFBhcnNlcihvcHRpb25zKTtcbiAgICBwYXJzZXIuc2ltcGxlUmVuZGVyZXJzID0gdGhpcy5zaW1wbGVSZW5kZXJlcnM7XG4gICAgY29uc3QgcmVzdWx0ID0gcGFyc2VyLmRlYnVnKGxpbmtzLCB0b2tlbnMpO1xuXG4gICAgLyoqXG4gICAgICogVHJhbnNsYXRlcyBhIHRva2VuIHR5cGUgaW50byBhIHJlYWRhYmxlIGZvcm0sXG4gICAgICogYW5kIG1vdmVzIGBsaW5lYCBmaWVsZCB0byBhIGZpcnN0IHBsYWNlIGluIGEgdG9rZW4gb2JqZWN0LlxuICAgICAqL1xuICAgIG9yaWdpbiA9IG9yaWdpbi5tYXAodG9rZW4gPT4ge1xuICAgICAgdG9rZW4udHlwZSA9IChUb2tlblR5cGUgYXMgYW55KVt0b2tlbi50eXBlXSB8fCB0b2tlbi50eXBlO1xuXG4gICAgICBjb25zdCBsaW5lID0gdG9rZW4ubGluZTtcbiAgICAgIGRlbGV0ZSB0b2tlbi5saW5lO1xuICAgICAgaWYgKGxpbmUpIHtcbiAgICAgICAgcmV0dXJuIHsgLi4ueyBsaW5lIH0sIC4uLnRva2VuIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdG9rZW47XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4geyB0b2tlbnM6IG9yaWdpbiwgbGlua3MsIHJlc3VsdCB9O1xuICB9XG5cbiAgcHJvdGVjdGVkIHN0YXRpYyBjYWxsQmxvY2tMZXhlcihzcmM6IHN0cmluZyA9ICcnLCBvcHRpb25zPzogTWFya2VkT3B0aW9ucyk6IExleGVyUmV0dXJucyB7XG4gICAgaWYgKHR5cGVvZiBzcmMgIT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgdGhhdCB0aGUgJ3NyYycgcGFyYW1ldGVyIHdvdWxkIGhhdmUgYSAnc3RyaW5nJyB0eXBlLCBnb3QgJyR7dHlwZW9mIHNyY30nYCk7XG4gICAgfVxuXG4gICAgLy8gUHJlcHJvY2Vzc2luZy5cbiAgICBzcmMgPSBzcmNcbiAgICAgIC5yZXBsYWNlKC9cXHJcXG58XFxyL2csICdcXG4nKVxuICAgICAgLnJlcGxhY2UoL1xcdC9nLCAnICAgICcpXG4gICAgICAucmVwbGFjZSgvXFx1MDBhMC9nLCAnICcpXG4gICAgICAucmVwbGFjZSgvXFx1MjQyNC9nLCAnXFxuJylcbiAgICAgIC5yZXBsYWNlKC9eICskL2dtLCAnJyk7XG5cbiAgICByZXR1cm4gQmxvY2tMZXhlci5sZXgoc3JjLCBvcHRpb25zLCB0cnVlKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzdGF0aWMgY2FsbFBhcnNlcih0b2tlbnM6IFRva2VuW10sIGxpbmtzOiBMaW5rcywgb3B0aW9ucz86IE1hcmtlZE9wdGlvbnMpOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLnNpbXBsZVJlbmRlcmVycy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IHBhcnNlciA9IG5ldyBQYXJzZXIob3B0aW9ucyk7XG4gICAgICBwYXJzZXIuc2ltcGxlUmVuZGVyZXJzID0gdGhpcy5zaW1wbGVSZW5kZXJlcnM7XG4gICAgICByZXR1cm4gcGFyc2VyLnBhcnNlKGxpbmtzLCB0b2tlbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gUGFyc2VyLnBhcnNlKHRva2VucywgbGlua3MsIG9wdGlvbnMpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBzdGF0aWMgY2FsbE1lKGVycjogRXJyb3IpIHtcbiAgICBlcnIubWVzc2FnZSArPSAnXFxuUGxlYXNlIHJlcG9ydCB0aGlzIHRvIGh0dHBzOi8vZ2l0aHViLmNvbS90cy1zdGFjay9tYXJrZG93bic7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLnNpbGVudCkge1xuICAgICAgcmV0dXJuICc8cD5BbiBlcnJvciBvY2N1cmVkOjwvcD48cHJlPicgKyB0aGlzLm9wdGlvbnMuZXNjYXBlKGVyci5tZXNzYWdlICsgJycsIHRydWUpICsgJzwvcHJlPic7XG4gICAgfVxuXG4gICAgdGhyb3cgZXJyO1xuICB9XG59XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxMS0yMDE0LCBDaHJpc3RvcGhlciBKZWZmcmV5LiAoTUlUIExpY2Vuc2VkKVxuICogaHR0cHM6Ly9naXRodWIuY29tL2NoamovbWFya2VkXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE4LTIwMjEsIFx1MDQxQVx1MDQzRVx1MDQ0MVx1MDQ0Mlx1MDQ0RiBcdTA0MjJcdTA0NDBcdTA0MzVcdTA0NDJcdTA0NEZcdTA0M0EuIChNSVQgTGljZW5zZWQpXG4gKiBodHRwczovL2dpdGh1Yi5jb20vdHMtc3RhY2svbWFya2Rvd25cbiAqL1xuXG5pbXBvcnQgeyBFeHRlbmRSZWdleHAgfSBmcm9tICcuL2V4dGVuZC1yZWdleHAnO1xuaW1wb3J0IHtcbiAgQWxpZ24sXG4gIExleGVyUmV0dXJucyxcbiAgTGlua3MsXG4gIE1hcmtlZE9wdGlvbnMsXG4gIFJ1bGVzQmxvY2tCYXNlLFxuICBSdWxlc0Jsb2NrR2ZtLFxuICBSdWxlc0Jsb2NrVGFibGVzLFxuICBUb2tlbixcbiAgVG9rZW5UeXBlLFxufSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgTWFya2VkIH0gZnJvbSAnLi9tYXJrZWQnO1xuXG5leHBvcnQgY2xhc3MgQmxvY2tMZXhlcjxUIGV4dGVuZHMgdHlwZW9mIEJsb2NrTGV4ZXI+IHtcbiAgc3RhdGljIHNpbXBsZVJ1bGVzOiBSZWdFeHBbXSA9IFtdO1xuICBwcm90ZWN0ZWQgc3RhdGljIHJ1bGVzQmFzZTogUnVsZXNCbG9ja0Jhc2UgPSBudWxsO1xuICAvKipcbiAgICogR0ZNIEJsb2NrIEdyYW1tYXIuXG4gICAqL1xuICBwcm90ZWN0ZWQgc3RhdGljIHJ1bGVzR2ZtOiBSdWxlc0Jsb2NrR2ZtID0gbnVsbDtcbiAgLyoqXG4gICAqIEdGTSArIFRhYmxlcyBCbG9jayBHcmFtbWFyLlxuICAgKi9cbiAgcHJvdGVjdGVkIHN0YXRpYyBydWxlc1RhYmxlczogUnVsZXNCbG9ja1RhYmxlcyA9IG51bGw7XG4gIHByb3RlY3RlZCBydWxlczogUnVsZXNCbG9ja0Jhc2UgfCBSdWxlc0Jsb2NrR2ZtIHwgUnVsZXNCbG9ja1RhYmxlcztcbiAgcHJvdGVjdGVkIG9wdGlvbnM6IE1hcmtlZE9wdGlvbnM7XG4gIHByb3RlY3RlZCBsaW5rczogTGlua3MgPSB7fTtcbiAgcHJvdGVjdGVkIHRva2VuczogVG9rZW5bXSA9IFtdO1xuICBwcm90ZWN0ZWQgaGFzUnVsZXNHZm06IGJvb2xlYW47XG4gIHByb3RlY3RlZCBoYXNSdWxlc1RhYmxlczogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgc3RhdGljVGhpczogVCwgb3B0aW9ucz86IG9iamVjdCkge1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgfHwgTWFya2VkLm9wdGlvbnM7XG4gICAgdGhpcy5zZXRSdWxlcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFjY2VwdHMgTWFya2Rvd24gdGV4dCBhbmQgcmV0dXJucyBvYmplY3Qgd2l0aCB0b2tlbnMgYW5kIGxpbmtzLlxuICAgKlxuICAgKiBAcGFyYW0gc3JjIFN0cmluZyBvZiBtYXJrZG93biBzb3VyY2UgdG8gYmUgY29tcGlsZWQuXG4gICAqIEBwYXJhbSBvcHRpb25zIEhhc2ggb2Ygb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyBsZXgoc3JjOiBzdHJpbmcsIG9wdGlvbnM/OiBNYXJrZWRPcHRpb25zLCB0b3A/OiBib29sZWFuLCBpc0Jsb2NrUXVvdGU/OiBib29sZWFuKTogTGV4ZXJSZXR1cm5zIHtcbiAgICBjb25zdCBsZXhlciA9IG5ldyB0aGlzKHRoaXMsIG9wdGlvbnMpO1xuICAgIHJldHVybiBsZXhlci5nZXRUb2tlbnMoc3JjLCB0b3AsIGlzQmxvY2tRdW90ZSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgc3RhdGljIGdldFJ1bGVzQmFzZSgpOiBSdWxlc0Jsb2NrQmFzZSB7XG4gICAgaWYgKHRoaXMucnVsZXNCYXNlKSB7XG4gICAgICByZXR1cm4gdGhpcy5ydWxlc0Jhc2U7XG4gICAgfVxuXG4gICAgY29uc3QgYmFzZTogUnVsZXNCbG9ja0Jhc2UgPSB7XG4gICAgICBuZXdsaW5lOiAvXlxcbisvLFxuICAgICAgY29kZTogL14oIHs0fVteXFxuXStcXG4qKSsvLFxuICAgICAgaHI6IC9eKCAqWy0qX10pezMsfSAqKD86XFxuK3wkKS8sXG4gICAgICBoZWFkaW5nOiAvXiAqKCN7MSw2fSkgKihbXlxcbl0rPykgKiMqICooPzpcXG4rfCQpLyxcbiAgICAgIGxoZWFkaW5nOiAvXihbXlxcbl0rKVxcbiAqKD18LSl7Mix9ICooPzpcXG4rfCQpLyxcbiAgICAgIGJsb2NrcXVvdGU6IC9eKCAqPlteXFxuXSsoXFxuW15cXG5dKykqXFxuKikrLyxcbiAgICAgIGxpc3Q6IC9eKCAqKShidWxsKSBbXFxzXFxTXSs/KD86aHJ8ZGVmfFxcbnsyLH0oPyEgKSg/IVxcMWJ1bGwgKVxcbip8XFxzKiQpLyxcbiAgICAgIGh0bWw6IC9eICooPzpjb21tZW50ICooPzpcXG58XFxzKiQpfGNsb3NlZCAqKD86XFxuezIsfXxcXHMqJCl8Y2xvc2luZyAqKD86XFxuezIsfXxcXHMqJCkpLyxcbiAgICAgIGRlZjogL14gKlxcWyhbXlxcXV0rKVxcXTogKjw/KFteXFxzPl0rKT4/KD86ICtbXCIoXShbXlxcbl0rKVtcIildKT8gKig/Olxcbit8JCkvLFxuICAgICAgcGFyYWdyYXBoOiAvXigoPzpbXlxcbl0rXFxuPyg/IWhyfGhlYWRpbmd8bGhlYWRpbmd8YmxvY2txdW90ZXx0YWd8ZGVmKSkrKVxcbiovLFxuICAgICAgdGV4dDogL15bXlxcbl0rLyxcbiAgICAgIGJ1bGxldDogLyg/OlsqKy1dfFxcZCtcXC4pLyxcbiAgICAgIGl0ZW06IC9eKCAqKShidWxsKSBbXlxcbl0qKD86XFxuKD8hXFwxYnVsbCApW15cXG5dKikqLyxcbiAgICB9O1xuXG4gICAgYmFzZS5pdGVtID0gbmV3IEV4dGVuZFJlZ2V4cChiYXNlLml0ZW0sICdnbScpLnNldEdyb3VwKC9idWxsL2csIGJhc2UuYnVsbGV0KS5nZXRSZWdleHAoKTtcblxuICAgIGJhc2UubGlzdCA9IG5ldyBFeHRlbmRSZWdleHAoYmFzZS5saXN0KVxuICAgICAgLnNldEdyb3VwKC9idWxsL2csIGJhc2UuYnVsbGV0KVxuICAgICAgLnNldEdyb3VwKCdocicsICdcXFxcbisoPz1cXFxcMT8oPzpbLSpfXSAqKXszLH0oPzpcXFxcbit8JCkpJylcbiAgICAgIC5zZXRHcm91cCgnZGVmJywgJ1xcXFxuKyg/PScgKyBiYXNlLmRlZi5zb3VyY2UgKyAnKScpXG4gICAgICAuZ2V0UmVnZXhwKCk7XG5cbiAgICBjb25zdCB0YWcgPVxuICAgICAgJyg/ISg/OicgK1xuICAgICAgJ2F8ZW18c3Ryb25nfHNtYWxsfHN8Y2l0ZXxxfGRmbnxhYmJyfGRhdGF8dGltZXxjb2RlJyArXG4gICAgICAnfHZhcnxzYW1wfGtiZHxzdWJ8c3VwfGl8Ynx1fG1hcmt8cnVieXxydHxycHxiZGl8YmRvJyArXG4gICAgICAnfHNwYW58YnJ8d2JyfGluc3xkZWx8aW1nKVxcXFxiKVxcXFx3Kyg/ITovfFteXFxcXHdcXFxcc0BdKkApXFxcXGInO1xuXG4gICAgYmFzZS5odG1sID0gbmV3IEV4dGVuZFJlZ2V4cChiYXNlLmh0bWwpXG4gICAgICAuc2V0R3JvdXAoJ2NvbW1lbnQnLCAvPCEtLVtcXHNcXFNdKj8tLT4vKVxuICAgICAgLnNldEdyb3VwKCdjbG9zZWQnLCAvPCh0YWcpW1xcc1xcU10rPzxcXC9cXDE+LylcbiAgICAgIC5zZXRHcm91cCgnY2xvc2luZycsIC88dGFnKD86XCJbXlwiXSpcInwnW14nXSonfFteJ1wiPl0pKj8+LylcbiAgICAgIC5zZXRHcm91cCgvdGFnL2csIHRhZylcbiAgICAgIC5nZXRSZWdleHAoKTtcblxuICAgIGJhc2UucGFyYWdyYXBoID0gbmV3IEV4dGVuZFJlZ2V4cChiYXNlLnBhcmFncmFwaClcbiAgICAgIC5zZXRHcm91cCgnaHInLCBiYXNlLmhyKVxuICAgICAgLnNldEdyb3VwKCdoZWFkaW5nJywgYmFzZS5oZWFkaW5nKVxuICAgICAgLnNldEdyb3VwKCdsaGVhZGluZycsIGJhc2UubGhlYWRpbmcpXG4gICAgICAuc2V0R3JvdXAoJ2Jsb2NrcXVvdGUnLCBiYXNlLmJsb2NrcXVvdGUpXG4gICAgICAuc2V0R3JvdXAoJ3RhZycsICc8JyArIHRhZylcbiAgICAgIC5zZXRHcm91cCgnZGVmJywgYmFzZS5kZWYpXG4gICAgICAuZ2V0UmVnZXhwKCk7XG5cbiAgICByZXR1cm4gKHRoaXMucnVsZXNCYXNlID0gYmFzZSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgc3RhdGljIGdldFJ1bGVzR2ZtKCk6IFJ1bGVzQmxvY2tHZm0ge1xuICAgIGlmICh0aGlzLnJ1bGVzR2ZtKSB7XG4gICAgICByZXR1cm4gdGhpcy5ydWxlc0dmbTtcbiAgICB9XG5cbiAgICBjb25zdCBiYXNlID0gdGhpcy5nZXRSdWxlc0Jhc2UoKTtcblxuICAgIGNvbnN0IGdmbTogUnVsZXNCbG9ja0dmbSA9IHtcbiAgICAgIC4uLmJhc2UsXG4gICAgICAuLi57XG4gICAgICAgIGZlbmNlczogL14gKihgezMsfXx+ezMsfSlbIFxcLl0qKChcXFMrKT8gKlteXFxuXSopXFxuKFtcXHNcXFNdKj8pXFxzKlxcMSAqKD86XFxuK3wkKS8sXG4gICAgICAgIHBhcmFncmFwaDogL14vLFxuICAgICAgICBoZWFkaW5nOiAvXiAqKCN7MSw2fSkgKyhbXlxcbl0rPykgKiMqICooPzpcXG4rfCQpLyxcbiAgICAgIH0sXG4gICAgfTtcblxuICAgIGNvbnN0IGdyb3VwMSA9IGdmbS5mZW5jZXMuc291cmNlLnJlcGxhY2UoJ1xcXFwxJywgJ1xcXFwyJyk7XG4gICAgY29uc3QgZ3JvdXAyID0gYmFzZS5saXN0LnNvdXJjZS5yZXBsYWNlKCdcXFxcMScsICdcXFxcMycpO1xuXG4gICAgZ2ZtLnBhcmFncmFwaCA9IG5ldyBFeHRlbmRSZWdleHAoYmFzZS5wYXJhZ3JhcGgpLnNldEdyb3VwKCcoPyEnLCBgKD8hJHtncm91cDF9fCR7Z3JvdXAyfXxgKS5nZXRSZWdleHAoKTtcblxuICAgIHJldHVybiAodGhpcy5ydWxlc0dmbSA9IGdmbSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgc3RhdGljIGdldFJ1bGVzVGFibGUoKTogUnVsZXNCbG9ja1RhYmxlcyB7XG4gICAgaWYgKHRoaXMucnVsZXNUYWJsZXMpIHtcbiAgICAgIHJldHVybiB0aGlzLnJ1bGVzVGFibGVzO1xuICAgIH1cblxuICAgIHJldHVybiAodGhpcy5ydWxlc1RhYmxlcyA9IHtcbiAgICAgIC4uLnRoaXMuZ2V0UnVsZXNHZm0oKSxcbiAgICAgIC4uLntcbiAgICAgICAgbnB0YWJsZTogL14gKihcXFMuKlxcfC4qKVxcbiAqKFstOl0rICpcXHxbLXwgOl0qKVxcbigoPzouKlxcfC4qKD86XFxufCQpKSopXFxuKi8sXG4gICAgICAgIHRhYmxlOiAvXiAqXFx8KC4rKVxcbiAqXFx8KCAqWy06XStbLXwgOl0qKVxcbigoPzogKlxcfC4qKD86XFxufCQpKSopXFxuKi8sXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIHNldFJ1bGVzKCkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuZ2ZtKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLnRhYmxlcykge1xuICAgICAgICB0aGlzLnJ1bGVzID0gdGhpcy5zdGF0aWNUaGlzLmdldFJ1bGVzVGFibGUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucnVsZXMgPSB0aGlzLnN0YXRpY1RoaXMuZ2V0UnVsZXNHZm0oKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ydWxlcyA9IHRoaXMuc3RhdGljVGhpcy5nZXRSdWxlc0Jhc2UoKTtcbiAgICB9XG5cbiAgICB0aGlzLmhhc1J1bGVzR2ZtID0gKHRoaXMucnVsZXMgYXMgUnVsZXNCbG9ja0dmbSkuZmVuY2VzICE9PSB1bmRlZmluZWQ7XG4gICAgdGhpcy5oYXNSdWxlc1RhYmxlcyA9ICh0aGlzLnJ1bGVzIGFzIFJ1bGVzQmxvY2tUYWJsZXMpLnRhYmxlICE9PSB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogTGV4aW5nLlxuICAgKi9cbiAgcHJvdGVjdGVkIGdldFRva2VucyhzcmM6IHN0cmluZywgdG9wPzogYm9vbGVhbiwgaXNCbG9ja1F1b3RlPzogYm9vbGVhbik6IExleGVyUmV0dXJucyB7XG4gICAgbGV0IG5leHRQYXJ0ID0gc3JjO1xuICAgIGxldCBleGVjQXJyOiBSZWdFeHBFeGVjQXJyYXk7XG5cbiAgICBtYWluTG9vcDogd2hpbGUgKG5leHRQYXJ0KSB7XG4gICAgICAvLyBuZXdsaW5lXG4gICAgICBpZiAoKGV4ZWNBcnIgPSB0aGlzLnJ1bGVzLm5ld2xpbmUuZXhlYyhuZXh0UGFydCkpKSB7XG4gICAgICAgIG5leHRQYXJ0ID0gbmV4dFBhcnQuc3Vic3RyaW5nKGV4ZWNBcnJbMF0ubGVuZ3RoKTtcblxuICAgICAgICBpZiAoZXhlY0FyclswXS5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgdGhpcy50b2tlbnMucHVzaCh7IHR5cGU6IFRva2VuVHlwZS5zcGFjZSB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBjb2RlXG4gICAgICBpZiAoKGV4ZWNBcnIgPSB0aGlzLnJ1bGVzLmNvZGUuZXhlYyhuZXh0UGFydCkpKSB7XG4gICAgICAgIG5leHRQYXJ0ID0gbmV4dFBhcnQuc3Vic3RyaW5nKGV4ZWNBcnJbMF0ubGVuZ3RoKTtcbiAgICAgICAgY29uc3QgY29kZSA9IGV4ZWNBcnJbMF0ucmVwbGFjZSgvXiB7NH0vZ20sICcnKTtcblxuICAgICAgICB0aGlzLnRva2Vucy5wdXNoKHtcbiAgICAgICAgICB0eXBlOiBUb2tlblR5cGUuY29kZSxcbiAgICAgICAgICB0ZXh0OiAhdGhpcy5vcHRpb25zLnBlZGFudGljID8gY29kZS5yZXBsYWNlKC9cXG4rJC8sICcnKSA6IGNvZGUsXG4gICAgICAgIH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gZmVuY2VzIGNvZGUgKGdmbSlcbiAgICAgIGlmICh0aGlzLmhhc1J1bGVzR2ZtICYmIChleGVjQXJyID0gKHRoaXMucnVsZXMgYXMgUnVsZXNCbG9ja0dmbSkuZmVuY2VzLmV4ZWMobmV4dFBhcnQpKSkge1xuICAgICAgICBuZXh0UGFydCA9IG5leHRQYXJ0LnN1YnN0cmluZyhleGVjQXJyWzBdLmxlbmd0aCk7XG5cbiAgICAgICAgdGhpcy50b2tlbnMucHVzaCh7XG4gICAgICAgICAgdHlwZTogVG9rZW5UeXBlLmNvZGUsXG4gICAgICAgICAgbWV0YTogZXhlY0FyclsyXSxcbiAgICAgICAgICBsYW5nOiBleGVjQXJyWzNdLFxuICAgICAgICAgIHRleHQ6IGV4ZWNBcnJbNF0gfHwgJycsXG4gICAgICAgIH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gaGVhZGluZ1xuICAgICAgaWYgKChleGVjQXJyID0gdGhpcy5ydWxlcy5oZWFkaW5nLmV4ZWMobmV4dFBhcnQpKSkge1xuICAgICAgICBuZXh0UGFydCA9IG5leHRQYXJ0LnN1YnN0cmluZyhleGVjQXJyWzBdLmxlbmd0aCk7XG4gICAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICAgIHR5cGU6IFRva2VuVHlwZS5oZWFkaW5nLFxuICAgICAgICAgIGRlcHRoOiBleGVjQXJyWzFdLmxlbmd0aCxcbiAgICAgICAgICB0ZXh0OiBleGVjQXJyWzJdLFxuICAgICAgICB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIHRhYmxlIG5vIGxlYWRpbmcgcGlwZSAoZ2ZtKVxuICAgICAgaWYgKHRvcCAmJiB0aGlzLmhhc1J1bGVzVGFibGVzICYmIChleGVjQXJyID0gKHRoaXMucnVsZXMgYXMgUnVsZXNCbG9ja1RhYmxlcykubnB0YWJsZS5leGVjKG5leHRQYXJ0KSkpIHtcbiAgICAgICAgbmV4dFBhcnQgPSBuZXh0UGFydC5zdWJzdHJpbmcoZXhlY0FyclswXS5sZW5ndGgpO1xuXG4gICAgICAgIGNvbnN0IGl0ZW06IFRva2VuID0ge1xuICAgICAgICAgIHR5cGU6IFRva2VuVHlwZS50YWJsZSxcbiAgICAgICAgICBoZWFkZXI6IGV4ZWNBcnJbMV0ucmVwbGFjZSgvXiAqfCAqXFx8ICokL2csICcnKS5zcGxpdCgvICpcXHwgKi8pLFxuICAgICAgICAgIGFsaWduOiBleGVjQXJyWzJdLnJlcGxhY2UoL14gKnxcXHwgKiQvZywgJycpLnNwbGl0KC8gKlxcfCAqLykgYXMgQWxpZ25bXSxcbiAgICAgICAgICBjZWxsczogW10sXG4gICAgICAgIH07XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtLmFsaWduLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKC9eICotKzogKiQvLnRlc3QoaXRlbS5hbGlnbltpXSkpIHtcbiAgICAgICAgICAgIGl0ZW0uYWxpZ25baV0gPSAncmlnaHQnO1xuICAgICAgICAgIH0gZWxzZSBpZiAoL14gKjotKzogKiQvLnRlc3QoaXRlbS5hbGlnbltpXSkpIHtcbiAgICAgICAgICAgIGl0ZW0uYWxpZ25baV0gPSAnY2VudGVyJztcbiAgICAgICAgICB9IGVsc2UgaWYgKC9eICo6LSsgKiQvLnRlc3QoaXRlbS5hbGlnbltpXSkpIHtcbiAgICAgICAgICAgIGl0ZW0uYWxpZ25baV0gPSAnbGVmdCc7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGl0ZW0uYWxpZ25baV0gPSBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRkOiBzdHJpbmdbXSA9IGV4ZWNBcnJbM10ucmVwbGFjZSgvXFxuJC8sICcnKS5zcGxpdCgnXFxuJyk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0ZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGl0ZW0uY2VsbHNbaV0gPSB0ZFtpXS5zcGxpdCgvICpcXHwgKi8pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50b2tlbnMucHVzaChpdGVtKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIGxoZWFkaW5nXG4gICAgICBpZiAoKGV4ZWNBcnIgPSB0aGlzLnJ1bGVzLmxoZWFkaW5nLmV4ZWMobmV4dFBhcnQpKSkge1xuICAgICAgICBuZXh0UGFydCA9IG5leHRQYXJ0LnN1YnN0cmluZyhleGVjQXJyWzBdLmxlbmd0aCk7XG5cbiAgICAgICAgdGhpcy50b2tlbnMucHVzaCh7XG4gICAgICAgICAgdHlwZTogVG9rZW5UeXBlLmhlYWRpbmcsXG4gICAgICAgICAgZGVwdGg6IGV4ZWNBcnJbMl0gPT09ICc9JyA/IDEgOiAyLFxuICAgICAgICAgIHRleHQ6IGV4ZWNBcnJbMV0sXG4gICAgICAgIH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gaHJcbiAgICAgIGlmICgoZXhlY0FyciA9IHRoaXMucnVsZXMuaHIuZXhlYyhuZXh0UGFydCkpKSB7XG4gICAgICAgIG5leHRQYXJ0ID0gbmV4dFBhcnQuc3Vic3RyaW5nKGV4ZWNBcnJbMF0ubGVuZ3RoKTtcbiAgICAgICAgdGhpcy50b2tlbnMucHVzaCh7IHR5cGU6IFRva2VuVHlwZS5ociB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIGJsb2NrcXVvdGVcbiAgICAgIGlmICgoZXhlY0FyciA9IHRoaXMucnVsZXMuYmxvY2txdW90ZS5leGVjKG5leHRQYXJ0KSkpIHtcbiAgICAgICAgbmV4dFBhcnQgPSBuZXh0UGFydC5zdWJzdHJpbmcoZXhlY0FyclswXS5sZW5ndGgpO1xuICAgICAgICB0aGlzLnRva2Vucy5wdXNoKHsgdHlwZTogVG9rZW5UeXBlLmJsb2NrcXVvdGVTdGFydCB9KTtcbiAgICAgICAgY29uc3Qgc3RyID0gZXhlY0FyclswXS5yZXBsYWNlKC9eICo+ID8vZ20sICcnKTtcblxuICAgICAgICAvLyBQYXNzIGB0b3BgIHRvIGtlZXAgdGhlIGN1cnJlbnRcbiAgICAgICAgLy8gXCJ0b3BsZXZlbFwiIHN0YXRlLiBUaGlzIGlzIGV4YWN0bHlcbiAgICAgICAgLy8gaG93IG1hcmtkb3duLnBsIHdvcmtzLlxuICAgICAgICB0aGlzLmdldFRva2VucyhzdHIpO1xuICAgICAgICB0aGlzLnRva2Vucy5wdXNoKHsgdHlwZTogVG9rZW5UeXBlLmJsb2NrcXVvdGVFbmQgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBsaXN0XG4gICAgICBpZiAoKGV4ZWNBcnIgPSB0aGlzLnJ1bGVzLmxpc3QuZXhlYyhuZXh0UGFydCkpKSB7XG4gICAgICAgIG5leHRQYXJ0ID0gbmV4dFBhcnQuc3Vic3RyaW5nKGV4ZWNBcnJbMF0ubGVuZ3RoKTtcbiAgICAgICAgY29uc3QgYnVsbDogc3RyaW5nID0gZXhlY0FyclsyXTtcblxuICAgICAgICB0aGlzLnRva2Vucy5wdXNoKHsgdHlwZTogVG9rZW5UeXBlLmxpc3RTdGFydCwgb3JkZXJlZDogYnVsbC5sZW5ndGggPiAxIH0pO1xuXG4gICAgICAgIC8vIEdldCBlYWNoIHRvcC1sZXZlbCBpdGVtLlxuICAgICAgICBjb25zdCBzdHIgPSBleGVjQXJyWzBdLm1hdGNoKHRoaXMucnVsZXMuaXRlbSk7XG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IHN0ci5sZW5ndGg7XG5cbiAgICAgICAgbGV0IG5leHQgPSBmYWxzZTtcbiAgICAgICAgbGV0IHNwYWNlOiBudW1iZXI7XG4gICAgICAgIGxldCBibG9ja0J1bGxldDogc3RyaW5nO1xuICAgICAgICBsZXQgbG9vc2U6IGJvb2xlYW47XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgIGxldCBpdGVtID0gc3RyW2ldO1xuXG4gICAgICAgICAgLy8gUmVtb3ZlIHRoZSBsaXN0IGl0ZW0ncyBidWxsZXQgc28gaXQgaXMgc2VlbiBhcyB0aGUgbmV4dCB0b2tlbi5cbiAgICAgICAgICBzcGFjZSA9IGl0ZW0ubGVuZ3RoO1xuICAgICAgICAgIGl0ZW0gPSBpdGVtLnJlcGxhY2UoL14gKihbKistXXxcXGQrXFwuKSArLywgJycpO1xuXG4gICAgICAgICAgLy8gT3V0ZGVudCB3aGF0ZXZlciB0aGUgbGlzdCBpdGVtIGNvbnRhaW5zLiBIYWNreS5cbiAgICAgICAgICBpZiAoaXRlbS5pbmRleE9mKCdcXG4gJykgIT09IC0xKSB7XG4gICAgICAgICAgICBzcGFjZSAtPSBpdGVtLmxlbmd0aDtcbiAgICAgICAgICAgIGl0ZW0gPSAhdGhpcy5vcHRpb25zLnBlZGFudGljXG4gICAgICAgICAgICAgID8gaXRlbS5yZXBsYWNlKG5ldyBSZWdFeHAoJ14gezEsJyArIHNwYWNlICsgJ30nLCAnZ20nKSwgJycpXG4gICAgICAgICAgICAgIDogaXRlbS5yZXBsYWNlKC9eIHsxLDR9L2dtLCAnJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIG5leHQgbGlzdCBpdGVtIGJlbG9uZ3MgaGVyZS5cbiAgICAgICAgICAvLyBCYWNrcGVkYWwgaWYgaXQgZG9lcyBub3QgYmVsb25nIGluIHRoaXMgbGlzdC5cbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNtYXJ0TGlzdHMgJiYgaSAhPT0gbGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgYmxvY2tCdWxsZXQgPSB0aGlzLnN0YXRpY1RoaXMuZ2V0UnVsZXNCYXNlKCkuYnVsbGV0LmV4ZWMoc3RyW2kgKyAxXSlbMF07XG5cbiAgICAgICAgICAgIGlmIChidWxsICE9PSBibG9ja0J1bGxldCAmJiAhKGJ1bGwubGVuZ3RoID4gMSAmJiBibG9ja0J1bGxldC5sZW5ndGggPiAxKSkge1xuICAgICAgICAgICAgICBuZXh0UGFydCA9IHN0ci5zbGljZShpICsgMSkuam9pbignXFxuJykgKyBuZXh0UGFydDtcbiAgICAgICAgICAgICAgaSA9IGxlbmd0aCAtIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gRGV0ZXJtaW5lIHdoZXRoZXIgaXRlbSBpcyBsb29zZSBvciBub3QuXG4gICAgICAgICAgLy8gVXNlOiAvKF58XFxuKSg/ISApW15cXG5dK1xcblxcbig/IVxccyokKS9cbiAgICAgICAgICAvLyBmb3IgZGlzY291bnQgYmVoYXZpb3IuXG4gICAgICAgICAgbG9vc2UgPSBuZXh0IHx8IC9cXG5cXG4oPyFcXHMqJCkvLnRlc3QoaXRlbSk7XG5cbiAgICAgICAgICBpZiAoaSAhPT0gbGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgbmV4dCA9IGl0ZW0uY2hhckF0KGl0ZW0ubGVuZ3RoIC0gMSkgPT09ICdcXG4nO1xuXG4gICAgICAgICAgICBpZiAoIWxvb3NlKSB7XG4gICAgICAgICAgICAgIGxvb3NlID0gbmV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLnRva2Vucy5wdXNoKHsgdHlwZTogbG9vc2UgPyBUb2tlblR5cGUubG9vc2VJdGVtU3RhcnQgOiBUb2tlblR5cGUubGlzdEl0ZW1TdGFydCB9KTtcblxuICAgICAgICAgIC8vIFJlY3Vyc2UuXG4gICAgICAgICAgdGhpcy5nZXRUb2tlbnMoaXRlbSwgZmFsc2UsIGlzQmxvY2tRdW90ZSk7XG4gICAgICAgICAgdGhpcy50b2tlbnMucHVzaCh7IHR5cGU6IFRva2VuVHlwZS5saXN0SXRlbUVuZCB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudG9rZW5zLnB1c2goeyB0eXBlOiBUb2tlblR5cGUubGlzdEVuZCB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIGh0bWxcbiAgICAgIGlmICgoZXhlY0FyciA9IHRoaXMucnVsZXMuaHRtbC5leGVjKG5leHRQYXJ0KSkpIHtcbiAgICAgICAgbmV4dFBhcnQgPSBuZXh0UGFydC5zdWJzdHJpbmcoZXhlY0FyclswXS5sZW5ndGgpO1xuICAgICAgICBjb25zdCBhdHRyID0gZXhlY0FyclsxXTtcbiAgICAgICAgY29uc3QgaXNQcmUgPSBhdHRyID09PSAncHJlJyB8fCBhdHRyID09PSAnc2NyaXB0JyB8fCBhdHRyID09PSAnc3R5bGUnO1xuXG4gICAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICAgIHR5cGU6IHRoaXMub3B0aW9ucy5zYW5pdGl6ZSA/IFRva2VuVHlwZS5wYXJhZ3JhcGggOiBUb2tlblR5cGUuaHRtbCxcbiAgICAgICAgICBwcmU6ICF0aGlzLm9wdGlvbnMuc2FuaXRpemVyICYmIGlzUHJlLFxuICAgICAgICAgIHRleHQ6IGV4ZWNBcnJbMF0sXG4gICAgICAgIH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gZGVmXG4gICAgICBpZiAodG9wICYmIChleGVjQXJyID0gdGhpcy5ydWxlcy5kZWYuZXhlYyhuZXh0UGFydCkpKSB7XG4gICAgICAgIG5leHRQYXJ0ID0gbmV4dFBhcnQuc3Vic3RyaW5nKGV4ZWNBcnJbMF0ubGVuZ3RoKTtcblxuICAgICAgICB0aGlzLmxpbmtzW2V4ZWNBcnJbMV0udG9Mb3dlckNhc2UoKV0gPSB7XG4gICAgICAgICAgaHJlZjogZXhlY0FyclsyXSxcbiAgICAgICAgICB0aXRsZTogZXhlY0FyclszXSxcbiAgICAgICAgfTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIHRhYmxlIChnZm0pXG4gICAgICBpZiAodG9wICYmIHRoaXMuaGFzUnVsZXNUYWJsZXMgJiYgKGV4ZWNBcnIgPSAodGhpcy5ydWxlcyBhcyBSdWxlc0Jsb2NrVGFibGVzKS50YWJsZS5leGVjKG5leHRQYXJ0KSkpIHtcbiAgICAgICAgbmV4dFBhcnQgPSBuZXh0UGFydC5zdWJzdHJpbmcoZXhlY0FyclswXS5sZW5ndGgpO1xuXG4gICAgICAgIGNvbnN0IGl0ZW06IFRva2VuID0ge1xuICAgICAgICAgIHR5cGU6IFRva2VuVHlwZS50YWJsZSxcbiAgICAgICAgICBoZWFkZXI6IGV4ZWNBcnJbMV0ucmVwbGFjZSgvXiAqfCAqXFx8ICokL2csICcnKS5zcGxpdCgvICpcXHwgKi8pLFxuICAgICAgICAgIGFsaWduOiBleGVjQXJyWzJdLnJlcGxhY2UoL14gKnxcXHwgKiQvZywgJycpLnNwbGl0KC8gKlxcfCAqLykgYXMgQWxpZ25bXSxcbiAgICAgICAgICBjZWxsczogW10sXG4gICAgICAgIH07XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtLmFsaWduLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKC9eICotKzogKiQvLnRlc3QoaXRlbS5hbGlnbltpXSkpIHtcbiAgICAgICAgICAgIGl0ZW0uYWxpZ25baV0gPSAncmlnaHQnO1xuICAgICAgICAgIH0gZWxzZSBpZiAoL14gKjotKzogKiQvLnRlc3QoaXRlbS5hbGlnbltpXSkpIHtcbiAgICAgICAgICAgIGl0ZW0uYWxpZ25baV0gPSAnY2VudGVyJztcbiAgICAgICAgICB9IGVsc2UgaWYgKC9eICo6LSsgKiQvLnRlc3QoaXRlbS5hbGlnbltpXSkpIHtcbiAgICAgICAgICAgIGl0ZW0uYWxpZ25baV0gPSAnbGVmdCc7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGl0ZW0uYWxpZ25baV0gPSBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRkID0gZXhlY0FyclszXS5yZXBsYWNlKC8oPzogKlxcfCAqKT9cXG4kLywgJycpLnNwbGl0KCdcXG4nKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaXRlbS5jZWxsc1tpXSA9IHRkW2ldLnJlcGxhY2UoL14gKlxcfCAqfCAqXFx8ICokL2csICcnKS5zcGxpdCgvICpcXHwgKi8pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50b2tlbnMucHVzaChpdGVtKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIHNpbXBsZSBydWxlc1xuICAgICAgaWYgKHRoaXMuc3RhdGljVGhpcy5zaW1wbGVSdWxlcy5sZW5ndGgpIHtcbiAgICAgICAgY29uc3Qgc2ltcGxlUnVsZXMgPSB0aGlzLnN0YXRpY1RoaXMuc2ltcGxlUnVsZXM7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2ltcGxlUnVsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAoKGV4ZWNBcnIgPSBzaW1wbGVSdWxlc1tpXS5leGVjKG5leHRQYXJ0KSkpIHtcbiAgICAgICAgICAgIG5leHRQYXJ0ID0gbmV4dFBhcnQuc3Vic3RyaW5nKGV4ZWNBcnJbMF0ubGVuZ3RoKTtcbiAgICAgICAgICAgIGNvbnN0IHR5cGUgPSAnc2ltcGxlUnVsZScgKyAoaSArIDEpO1xuICAgICAgICAgICAgdGhpcy50b2tlbnMucHVzaCh7IHR5cGUsIGV4ZWNBcnIgfSk7XG4gICAgICAgICAgICBjb250aW51ZSBtYWluTG9vcDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gdG9wLWxldmVsIHBhcmFncmFwaFxuICAgICAgaWYgKHRvcCAmJiAoZXhlY0FyciA9IHRoaXMucnVsZXMucGFyYWdyYXBoLmV4ZWMobmV4dFBhcnQpKSkge1xuICAgICAgICBuZXh0UGFydCA9IG5leHRQYXJ0LnN1YnN0cmluZyhleGVjQXJyWzBdLmxlbmd0aCk7XG5cbiAgICAgICAgaWYgKGV4ZWNBcnJbMV0uc2xpY2UoLTEpID09PSAnXFxuJykge1xuICAgICAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICAgICAgdHlwZTogVG9rZW5UeXBlLnBhcmFncmFwaCxcbiAgICAgICAgICAgIHRleHQ6IGV4ZWNBcnJbMV0uc2xpY2UoMCwgLTEpLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICAgICAgdHlwZTogdGhpcy50b2tlbnMubGVuZ3RoID4gMCA/IFRva2VuVHlwZS5wYXJhZ3JhcGggOiBUb2tlblR5cGUudGV4dCxcbiAgICAgICAgICAgIHRleHQ6IGV4ZWNBcnJbMV0sXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIHRleHRcbiAgICAgIC8vIFRvcC1sZXZlbCBzaG91bGQgbmV2ZXIgcmVhY2ggaGVyZS5cbiAgICAgIGlmICgoZXhlY0FyciA9IHRoaXMucnVsZXMudGV4dC5leGVjKG5leHRQYXJ0KSkpIHtcbiAgICAgICAgbmV4dFBhcnQgPSBuZXh0UGFydC5zdWJzdHJpbmcoZXhlY0FyclswXS5sZW5ndGgpO1xuICAgICAgICB0aGlzLnRva2Vucy5wdXNoKHsgdHlwZTogVG9rZW5UeXBlLnRleHQsIHRleHQ6IGV4ZWNBcnJbMF0gfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAobmV4dFBhcnQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICdJbmZpbml0ZSBsb29wIG9uIGJ5dGU6ICcgKyBuZXh0UGFydC5jaGFyQ29kZUF0KDApICsgYCwgbmVhciB0ZXh0ICcke25leHRQYXJ0LnNsaWNlKDAsIDMwKX0uLi4nYFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7IHRva2VuczogdGhpcy50b2tlbnMsIGxpbmtzOiB0aGlzLmxpbmtzIH07XG4gIH1cbn1cbiIsICIvKipcbiAqIEdlbmVyYXRlZCBidW5kbGUgaW5kZXguIERvIG5vdCBlZGl0LlxuICovXG5cbmV4cG9ydCAqIGZyb20gJy4vcHVibGljLWFwaSc7XG4iLCAiaW1wb3J0IHsgS0V4cG9ydCB9IGZyb20gJ2stZXhwb3J0J1xuY29uc3Qga2V4ID0gbmV3IEtFeHBvcnQoJ34vRGVza3RvcC9raWljaGktcG9ydGZvbGlvL3B1YmxpYycgLC8vIHNvdXJjZSBmb2xkZXIgLy8nfi9MaWJyYXJ5L01vYmlsZSBEb2N1bWVudHMvaUNsb3Vkfm1kfm9ic2lkaWFuL0RvY3VtZW50cy9vYnNpZGlhbi1raWljaGktcG9ydGZvbGlvLycsXG4gICAgICAgICAgICAnfi9EZXNrdG9wL2tpaWNoaS1wb3J0Zm9saW8vcHVibGljJywgLy8gdGVtcGxhdGUgZm9sZGVyXG4gICAgICAgICAgICAnfi9EZXNrdG9wL2tpaWNoaS1wb3J0Zm9saW8vcHVibGljJyk7IC8vIGRlc3RpbmF0aW9uIGZvbGRlclxua2V4LnN0YXJ0KCk7Il0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLFNBQW9CO0FBQ3BCLFdBQXNCO0FBQ3RCLFNBQW9COzs7QUNGcEIsSUFVYSxxQkFBWTtFQUl2QixZQUFZLE9BQWUsUUFBZ0IsSUFBRTtBQUMzQyxTQUFLLFNBQVMsTUFBTTtBQUNwQixTQUFLLFFBQVE7O0VB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
