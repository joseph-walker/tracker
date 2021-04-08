import {randomBytes, createHash} from "crypto";
import http from "http";
import https from "https";
import zlib from "zlib";
import Stream, {PassThrough, pipeline} from "stream";
import {format, parse, resolve, URLSearchParams as URLSearchParams$1} from "url";
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
function createCommonjsModule(fn) {
  var module = {exports: {}};
  return fn(module, module.exports), module.exports;
}
var isBufferBrowser = function isBuffer(arg) {
  return arg && typeof arg === "object" && typeof arg.copy === "function" && typeof arg.fill === "function" && typeof arg.readUInt8 === "function";
};
var inherits_browser = createCommonjsModule(function(module) {
  if (typeof Object.create === "function") {
    module.exports = function inherits(ctor, superCtor) {
      ctor.super_ = superCtor;
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
    };
  } else {
    module.exports = function inherits(ctor, superCtor) {
      ctor.super_ = superCtor;
      var TempCtor = function() {
      };
      TempCtor.prototype = superCtor.prototype;
      ctor.prototype = new TempCtor();
      ctor.prototype.constructor = ctor;
    };
  }
});
var util = createCommonjsModule(function(module, exports) {
  var formatRegExp = /%[sdj%]/g;
  exports.format = function(f) {
    if (!isString(f)) {
      var objects = [];
      for (var i = 0; i < arguments.length; i++) {
        objects.push(inspect(arguments[i]));
      }
      return objects.join(" ");
    }
    var i = 1;
    var args = arguments;
    var len = args.length;
    var str = String(f).replace(formatRegExp, function(x2) {
      if (x2 === "%%")
        return "%";
      if (i >= len)
        return x2;
      switch (x2) {
        case "%s":
          return String(args[i++]);
        case "%d":
          return Number(args[i++]);
        case "%j":
          try {
            return JSON.stringify(args[i++]);
          } catch (_) {
            return "[Circular]";
          }
        default:
          return x2;
      }
    });
    for (var x = args[i]; i < len; x = args[++i]) {
      if (isNull(x) || !isObject(x)) {
        str += " " + x;
      } else {
        str += " " + inspect(x);
      }
    }
    return str;
  };
  exports.deprecate = function(fn, msg) {
    if (isUndefined(commonjsGlobal.process)) {
      return function() {
        return exports.deprecate(fn, msg).apply(this, arguments);
      };
    }
    if (process.noDeprecation === true) {
      return fn;
    }
    var warned = false;
    function deprecated() {
      if (!warned) {
        if (process.throwDeprecation) {
          throw new Error(msg);
        } else if (process.traceDeprecation) {
          console.trace(msg);
        } else {
          console.error(msg);
        }
        warned = true;
      }
      return fn.apply(this, arguments);
    }
    return deprecated;
  };
  var debugs = {};
  var debugEnviron;
  exports.debuglog = function(set) {
    if (isUndefined(debugEnviron))
      debugEnviron = "";
    set = set.toUpperCase();
    if (!debugs[set]) {
      if (new RegExp("\\b" + set + "\\b", "i").test(debugEnviron)) {
        var pid = process.pid;
        debugs[set] = function() {
          var msg = exports.format.apply(exports, arguments);
          console.error("%s %d: %s", set, pid, msg);
        };
      } else {
        debugs[set] = function() {
        };
      }
    }
    return debugs[set];
  };
  function inspect(obj, opts) {
    var ctx = {
      seen: [],
      stylize: stylizeNoColor
    };
    if (arguments.length >= 3)
      ctx.depth = arguments[2];
    if (arguments.length >= 4)
      ctx.colors = arguments[3];
    if (isBoolean(opts)) {
      ctx.showHidden = opts;
    } else if (opts) {
      exports._extend(ctx, opts);
    }
    if (isUndefined(ctx.showHidden))
      ctx.showHidden = false;
    if (isUndefined(ctx.depth))
      ctx.depth = 2;
    if (isUndefined(ctx.colors))
      ctx.colors = false;
    if (isUndefined(ctx.customInspect))
      ctx.customInspect = true;
    if (ctx.colors)
      ctx.stylize = stylizeWithColor;
    return formatValue(ctx, obj, ctx.depth);
  }
  exports.inspect = inspect;
  inspect.colors = {
    bold: [1, 22],
    italic: [3, 23],
    underline: [4, 24],
    inverse: [7, 27],
    white: [37, 39],
    grey: [90, 39],
    black: [30, 39],
    blue: [34, 39],
    cyan: [36, 39],
    green: [32, 39],
    magenta: [35, 39],
    red: [31, 39],
    yellow: [33, 39]
  };
  inspect.styles = {
    special: "cyan",
    number: "yellow",
    boolean: "yellow",
    undefined: "grey",
    null: "bold",
    string: "green",
    date: "magenta",
    regexp: "red"
  };
  function stylizeWithColor(str, styleType) {
    var style = inspect.styles[styleType];
    if (style) {
      return "[" + inspect.colors[style][0] + "m" + str + "[" + inspect.colors[style][1] + "m";
    } else {
      return str;
    }
  }
  function stylizeNoColor(str, styleType) {
    return str;
  }
  function arrayToHash(array) {
    var hash = {};
    array.forEach(function(val, idx) {
      hash[val] = true;
    });
    return hash;
  }
  function formatValue(ctx, value, recurseTimes) {
    if (ctx.customInspect && value && isFunction(value.inspect) && value.inspect !== exports.inspect && !(value.constructor && value.constructor.prototype === value)) {
      var ret = value.inspect(recurseTimes, ctx);
      if (!isString(ret)) {
        ret = formatValue(ctx, ret, recurseTimes);
      }
      return ret;
    }
    var primitive = formatPrimitive(ctx, value);
    if (primitive) {
      return primitive;
    }
    var keys2 = Object.keys(value);
    var visibleKeys = arrayToHash(keys2);
    if (ctx.showHidden) {
      keys2 = Object.getOwnPropertyNames(value);
    }
    if (isError(value) && (keys2.indexOf("message") >= 0 || keys2.indexOf("description") >= 0)) {
      return formatError(value);
    }
    if (keys2.length === 0) {
      if (isFunction(value)) {
        var name = value.name ? ": " + value.name : "";
        return ctx.stylize("[Function" + name + "]", "special");
      }
      if (isRegExp(value)) {
        return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
      }
      if (isDate(value)) {
        return ctx.stylize(Date.prototype.toString.call(value), "date");
      }
      if (isError(value)) {
        return formatError(value);
      }
    }
    var base = "", array = false, braces = ["{", "}"];
    if (isArray2(value)) {
      array = true;
      braces = ["[", "]"];
    }
    if (isFunction(value)) {
      var n = value.name ? ": " + value.name : "";
      base = " [Function" + n + "]";
    }
    if (isRegExp(value)) {
      base = " " + RegExp.prototype.toString.call(value);
    }
    if (isDate(value)) {
      base = " " + Date.prototype.toUTCString.call(value);
    }
    if (isError(value)) {
      base = " " + formatError(value);
    }
    if (keys2.length === 0 && (!array || value.length == 0)) {
      return braces[0] + base + braces[1];
    }
    if (recurseTimes < 0) {
      if (isRegExp(value)) {
        return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
      } else {
        return ctx.stylize("[Object]", "special");
      }
    }
    ctx.seen.push(value);
    var output;
    if (array) {
      output = formatArray(ctx, value, recurseTimes, visibleKeys, keys2);
    } else {
      output = keys2.map(function(key) {
        return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
      });
    }
    ctx.seen.pop();
    return reduceToSingleString(output, base, braces);
  }
  function formatPrimitive(ctx, value) {
    if (isUndefined(value))
      return ctx.stylize("undefined", "undefined");
    if (isString(value)) {
      var simple = "'" + JSON.stringify(value).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
      return ctx.stylize(simple, "string");
    }
    if (isNumber(value))
      return ctx.stylize("" + value, "number");
    if (isBoolean(value))
      return ctx.stylize("" + value, "boolean");
    if (isNull(value))
      return ctx.stylize("null", "null");
  }
  function formatError(value) {
    return "[" + Error.prototype.toString.call(value) + "]";
  }
  function formatArray(ctx, value, recurseTimes, visibleKeys, keys2) {
    var output = [];
    for (var i = 0, l = value.length; i < l; ++i) {
      if (hasOwnProperty(value, String(i))) {
        output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
      } else {
        output.push("");
      }
    }
    keys2.forEach(function(key) {
      if (!key.match(/^\d+$/)) {
        output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
      }
    });
    return output;
  }
  function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
    var name, str, desc;
    desc = Object.getOwnPropertyDescriptor(value, key) || {value: value[key]};
    if (desc.get) {
      if (desc.set) {
        str = ctx.stylize("[Getter/Setter]", "special");
      } else {
        str = ctx.stylize("[Getter]", "special");
      }
    } else {
      if (desc.set) {
        str = ctx.stylize("[Setter]", "special");
      }
    }
    if (!hasOwnProperty(visibleKeys, key)) {
      name = "[" + key + "]";
    }
    if (!str) {
      if (ctx.seen.indexOf(desc.value) < 0) {
        if (isNull(recurseTimes)) {
          str = formatValue(ctx, desc.value, null);
        } else {
          str = formatValue(ctx, desc.value, recurseTimes - 1);
        }
        if (str.indexOf("\n") > -1) {
          if (array) {
            str = str.split("\n").map(function(line) {
              return "  " + line;
            }).join("\n").substr(2);
          } else {
            str = "\n" + str.split("\n").map(function(line) {
              return "   " + line;
            }).join("\n");
          }
        }
      } else {
        str = ctx.stylize("[Circular]", "special");
      }
    }
    if (isUndefined(name)) {
      if (array && key.match(/^\d+$/)) {
        return str;
      }
      name = JSON.stringify("" + key);
      if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
        name = name.substr(1, name.length - 2);
        name = ctx.stylize(name, "name");
      } else {
        name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
        name = ctx.stylize(name, "string");
      }
    }
    return name + ": " + str;
  }
  function reduceToSingleString(output, base, braces) {
    var length = output.reduce(function(prev, cur) {
      if (cur.indexOf("\n") >= 0)
        ;
      return prev + cur.replace(/\u001b\[\d\d?m/g, "").length + 1;
    }, 0);
    if (length > 60) {
      return braces[0] + (base === "" ? "" : base + "\n ") + " " + output.join(",\n  ") + " " + braces[1];
    }
    return braces[0] + base + " " + output.join(", ") + " " + braces[1];
  }
  function isArray2(ar) {
    return Array.isArray(ar);
  }
  exports.isArray = isArray2;
  function isBoolean(arg) {
    return typeof arg === "boolean";
  }
  exports.isBoolean = isBoolean;
  function isNull(arg) {
    return arg === null;
  }
  exports.isNull = isNull;
  function isNullOrUndefined(arg) {
    return arg == null;
  }
  exports.isNullOrUndefined = isNullOrUndefined;
  function isNumber(arg) {
    return typeof arg === "number";
  }
  exports.isNumber = isNumber;
  function isString(arg) {
    return typeof arg === "string";
  }
  exports.isString = isString;
  function isSymbol(arg) {
    return typeof arg === "symbol";
  }
  exports.isSymbol = isSymbol;
  function isUndefined(arg) {
    return arg === void 0;
  }
  exports.isUndefined = isUndefined;
  function isRegExp(re) {
    return isObject(re) && objectToString(re) === "[object RegExp]";
  }
  exports.isRegExp = isRegExp;
  function isObject(arg) {
    return typeof arg === "object" && arg !== null;
  }
  exports.isObject = isObject;
  function isDate(d) {
    return isObject(d) && objectToString(d) === "[object Date]";
  }
  exports.isDate = isDate;
  function isError(e) {
    return isObject(e) && (objectToString(e) === "[object Error]" || e instanceof Error);
  }
  exports.isError = isError;
  function isFunction(arg) {
    return typeof arg === "function";
  }
  exports.isFunction = isFunction;
  function isPrimitive2(arg) {
    return arg === null || typeof arg === "boolean" || typeof arg === "number" || typeof arg === "string" || typeof arg === "symbol" || typeof arg === "undefined";
  }
  exports.isPrimitive = isPrimitive2;
  exports.isBuffer = isBufferBrowser;
  function objectToString(o) {
    return Object.prototype.toString.call(o);
  }
  function pad2(n) {
    return n < 10 ? "0" + n.toString(10) : n.toString(10);
  }
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  function timestamp() {
    var d = new Date();
    var time = [
      pad2(d.getHours()),
      pad2(d.getMinutes()),
      pad2(d.getSeconds())
    ].join(":");
    return [d.getDate(), months[d.getMonth()], time].join(" ");
  }
  exports.log = function() {
    console.log("%s - %s", timestamp(), exports.format.apply(exports, arguments));
  };
  exports.inherits = inherits_browser;
  exports._extend = function(origin, add) {
    if (!add || !isObject(add))
      return origin;
    var keys2 = Object.keys(add);
    var i = keys2.length;
    while (i--) {
      origin[keys2[i]] = add[keys2[i]];
    }
    return origin;
  };
  function hasOwnProperty(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }
});
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped$1 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function devalue(value) {
  var counts = new Map();
  function walk(thing) {
    if (typeof thing === "function") {
      throw new Error("Cannot stringify a function");
    }
    if (counts.has(thing)) {
      counts.set(thing, counts.get(thing) + 1);
      return;
    }
    counts.set(thing, 1);
    if (!isPrimitive(thing)) {
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
          return;
        case "Array":
          thing.forEach(walk);
          break;
        case "Set":
        case "Map":
          Array.from(thing).forEach(walk);
          break;
        default:
          var proto = Object.getPrototypeOf(thing);
          if (proto !== Object.prototype && proto !== null && Object.getOwnPropertyNames(proto).sort().join("\0") !== objectProtoOwnPropertyNames) {
            throw new Error("Cannot stringify arbitrary non-POJOs");
          }
          if (Object.getOwnPropertySymbols(thing).length > 0) {
            throw new Error("Cannot stringify POJOs with symbolic keys");
          }
          Object.keys(thing).forEach(function(key) {
            return walk(thing[key]);
          });
      }
    }
  }
  walk(value);
  var names = new Map();
  Array.from(counts).filter(function(entry) {
    return entry[1] > 1;
  }).sort(function(a, b) {
    return b[1] - a[1];
  }).forEach(function(entry, i) {
    names.set(entry[0], getName(i));
  });
  function stringify(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (isPrimitive(thing)) {
      return stringifyPrimitive(thing);
    }
    var type = getType(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return "Object(" + stringify(thing.valueOf()) + ")";
      case "RegExp":
        return "new RegExp(" + stringifyString(thing.source) + ', "' + thing.flags + '")';
      case "Date":
        return "new Date(" + thing.getTime() + ")";
      case "Array":
        var members = thing.map(function(v, i) {
          return i in thing ? stringify(v) : "";
        });
        var tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return "[" + members.join(",") + tail + "]";
      case "Set":
      case "Map":
        return "new " + type + "([" + Array.from(thing).map(stringify).join(",") + "])";
      default:
        var obj = "{" + Object.keys(thing).map(function(key) {
          return safeKey(key) + ":" + stringify(thing[key]);
        }).join(",") + "}";
        var proto = Object.getPrototypeOf(thing);
        if (proto === null) {
          return Object.keys(thing).length > 0 ? "Object.assign(Object.create(null)," + obj + ")" : "Object.create(null)";
        }
        return obj;
    }
  }
  var str = stringify(value);
  if (names.size) {
    var params_1 = [];
    var statements_1 = [];
    var values_1 = [];
    names.forEach(function(name, thing) {
      params_1.push(name);
      if (isPrimitive(thing)) {
        values_1.push(stringifyPrimitive(thing));
        return;
      }
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values_1.push("Object(" + stringify(thing.valueOf()) + ")");
          break;
        case "RegExp":
          values_1.push(thing.toString());
          break;
        case "Date":
          values_1.push("new Date(" + thing.getTime() + ")");
          break;
        case "Array":
          values_1.push("Array(" + thing.length + ")");
          thing.forEach(function(v, i) {
            statements_1.push(name + "[" + i + "]=" + stringify(v));
          });
          break;
        case "Set":
          values_1.push("new Set");
          statements_1.push(name + "." + Array.from(thing).map(function(v) {
            return "add(" + stringify(v) + ")";
          }).join("."));
          break;
        case "Map":
          values_1.push("new Map");
          statements_1.push(name + "." + Array.from(thing).map(function(_a2) {
            var k = _a2[0], v = _a2[1];
            return "set(" + stringify(k) + ", " + stringify(v) + ")";
          }).join("."));
          break;
        default:
          values_1.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
          Object.keys(thing).forEach(function(key) {
            statements_1.push("" + name + safeProp(key) + "=" + stringify(thing[key]));
          });
      }
    });
    statements_1.push("return " + str);
    return "(function(" + params_1.join(",") + "){" + statements_1.join(";") + "}(" + values_1.join(",") + "))";
  } else {
    return str;
  }
}
function getName(num) {
  var name = "";
  do {
    name = chars[num % chars.length] + name;
    num = ~~(num / chars.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? name + "_" : name;
}
function isPrimitive(thing) {
  return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
  if (typeof thing === "string")
    return stringifyString(thing);
  if (thing === void 0)
    return "void 0";
  if (thing === 0 && 1 / thing < 0)
    return "-0";
  var str = String(thing);
  if (typeof thing === "number")
    return str.replace(/^(-)?0\./, "$1.");
  return str;
}
function getType(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
  return escaped$1[c] || c;
}
function escapeUnsafeChars(str) {
  return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key));
}
function safeProp(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? "." + key : "[" + escapeUnsafeChars(JSON.stringify(key)) + "]";
}
function stringifyString(str) {
  var result = '"';
  for (var i = 0; i < str.length; i += 1) {
    var char = str.charAt(i);
    var code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$1) {
      result += escaped$1[char];
    } else if (code >= 55296 && code <= 57343) {
      var next = str.charCodeAt(i + 1);
      if (code <= 56319 && (next >= 56320 && next <= 57343)) {
        result += char + str[++i];
      } else {
        result += "\\u" + code.toString(16).toUpperCase();
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
function dataUriToBuffer(uri) {
  if (!/^data:/i.test(uri)) {
    throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
  }
  uri = uri.replace(/\r?\n/g, "");
  const firstComma = uri.indexOf(",");
  if (firstComma === -1 || firstComma <= 4) {
    throw new TypeError("malformed data: URI");
  }
  const meta = uri.substring(5, firstComma).split(";");
  let charset = "";
  let base64 = false;
  const type = meta[0] || "text/plain";
  let typeFull = type;
  for (let i = 1; i < meta.length; i++) {
    if (meta[i] === "base64") {
      base64 = true;
    } else {
      typeFull += `;${meta[i]}`;
      if (meta[i].indexOf("charset=") === 0) {
        charset = meta[i].substring(8);
      }
    }
  }
  if (!meta[0] && !charset.length) {
    typeFull += ";charset=US-ASCII";
    charset = "US-ASCII";
  }
  const encoding = base64 ? "base64" : "ascii";
  const data = unescape(uri.substring(firstComma + 1));
  const buffer = Buffer.from(data, encoding);
  buffer.type = type;
  buffer.typeFull = typeFull;
  buffer.charset = charset;
  return buffer;
}
var src = dataUriToBuffer;
const {Readable} = Stream;
const wm = new WeakMap();
async function* read(parts) {
  for (const part of parts) {
    if ("stream" in part) {
      yield* part.stream();
    } else {
      yield part;
    }
  }
}
class Blob {
  constructor(blobParts = [], options = {type: ""}) {
    let size = 0;
    const parts = blobParts.map((element) => {
      let buffer;
      if (element instanceof Buffer) {
        buffer = element;
      } else if (ArrayBuffer.isView(element)) {
        buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
      } else if (element instanceof ArrayBuffer) {
        buffer = Buffer.from(element);
      } else if (element instanceof Blob) {
        buffer = element;
      } else {
        buffer = Buffer.from(typeof element === "string" ? element : String(element));
      }
      size += buffer.length || buffer.size || 0;
      return buffer;
    });
    const type = options.type === void 0 ? "" : String(options.type).toLowerCase();
    wm.set(this, {
      type: /[^\u0020-\u007E]/.test(type) ? "" : type,
      size,
      parts
    });
  }
  get size() {
    return wm.get(this).size;
  }
  get type() {
    return wm.get(this).type;
  }
  async text() {
    return Buffer.from(await this.arrayBuffer()).toString();
  }
  async arrayBuffer() {
    const data = new Uint8Array(this.size);
    let offset = 0;
    for await (const chunk of this.stream()) {
      data.set(chunk, offset);
      offset += chunk.length;
    }
    return data.buffer;
  }
  stream() {
    return Readable.from(read(wm.get(this).parts));
  }
  slice(start = 0, end = this.size, type = "") {
    const {size} = this;
    let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
    let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
    const span = Math.max(relativeEnd - relativeStart, 0);
    const parts = wm.get(this).parts.values();
    const blobParts = [];
    let added = 0;
    for (const part of parts) {
      const size2 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
      if (relativeStart && size2 <= relativeStart) {
        relativeStart -= size2;
        relativeEnd -= size2;
      } else {
        const chunk = part.slice(relativeStart, Math.min(size2, relativeEnd));
        blobParts.push(chunk);
        added += ArrayBuffer.isView(chunk) ? chunk.byteLength : chunk.size;
        relativeStart = 0;
        if (added >= span) {
          break;
        }
      }
    }
    const blob = new Blob([], {type});
    Object.assign(wm.get(blob), {size: span, parts: blobParts});
    return blob;
  }
  get [Symbol.toStringTag]() {
    return "Blob";
  }
  static [Symbol.hasInstance](object) {
    return typeof object === "object" && typeof object.stream === "function" && object.stream.length === 0 && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[Symbol.toStringTag]);
  }
}
Object.defineProperties(Blob.prototype, {
  size: {enumerable: true},
  type: {enumerable: true},
  slice: {enumerable: true}
});
var fetchBlob = Blob;
class FetchBaseError extends Error {
  constructor(message, type) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.type = type;
  }
  get name() {
    return this.constructor.name;
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
}
class FetchError extends FetchBaseError {
  constructor(message, type, systemError) {
    super(message, type);
    if (systemError) {
      this.code = this.errno = systemError.code;
      this.erroredSysCall = systemError.syscall;
    }
  }
}
const NAME = Symbol.toStringTag;
const isURLSearchParameters = (object) => {
  return typeof object === "object" && typeof object.append === "function" && typeof object.delete === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.has === "function" && typeof object.set === "function" && typeof object.sort === "function" && object[NAME] === "URLSearchParams";
};
const isBlob = (object) => {
  return typeof object === "object" && typeof object.arrayBuffer === "function" && typeof object.type === "string" && typeof object.stream === "function" && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[NAME]);
};
function isFormData(object) {
  return typeof object === "object" && typeof object.append === "function" && typeof object.set === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.delete === "function" && typeof object.keys === "function" && typeof object.values === "function" && typeof object.entries === "function" && typeof object.constructor === "function" && object[NAME] === "FormData";
}
const isAbortSignal = (object) => {
  return typeof object === "object" && object[NAME] === "AbortSignal";
};
const carriage = "\r\n";
const dashes = "-".repeat(2);
const carriageLength = Buffer.byteLength(carriage);
const getFooter = (boundary) => `${dashes}${boundary}${dashes}${carriage.repeat(2)}`;
function getHeader(boundary, name, field) {
  let header = "";
  header += `${dashes}${boundary}${carriage}`;
  header += `Content-Disposition: form-data; name="${name}"`;
  if (isBlob(field)) {
    header += `; filename="${field.name}"${carriage}`;
    header += `Content-Type: ${field.type || "application/octet-stream"}`;
  }
  return `${header}${carriage.repeat(2)}`;
}
const getBoundary = () => randomBytes(8).toString("hex");
async function* formDataIterator(form, boundary) {
  for (const [name, value] of form) {
    yield getHeader(boundary, name, value);
    if (isBlob(value)) {
      yield* value.stream();
    } else {
      yield value;
    }
    yield carriage;
  }
  yield getFooter(boundary);
}
function getFormDataLength(form, boundary) {
  let length = 0;
  for (const [name, value] of form) {
    length += Buffer.byteLength(getHeader(boundary, name, value));
    if (isBlob(value)) {
      length += value.size;
    } else {
      length += Buffer.byteLength(String(value));
    }
    length += carriageLength;
  }
  length += Buffer.byteLength(getFooter(boundary));
  return length;
}
const INTERNALS$2 = Symbol("Body internals");
class Body {
  constructor(body, {
    size = 0
  } = {}) {
    let boundary = null;
    if (body === null) {
      body = null;
    } else if (isURLSearchParameters(body)) {
      body = Buffer.from(body.toString());
    } else if (isBlob(body))
      ;
    else if (Buffer.isBuffer(body))
      ;
    else if (util.types.isAnyArrayBuffer(body)) {
      body = Buffer.from(body);
    } else if (ArrayBuffer.isView(body)) {
      body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
    } else if (body instanceof Stream)
      ;
    else if (isFormData(body)) {
      boundary = `NodeFetchFormDataBoundary${getBoundary()}`;
      body = Stream.Readable.from(formDataIterator(body, boundary));
    } else {
      body = Buffer.from(String(body));
    }
    this[INTERNALS$2] = {
      body,
      boundary,
      disturbed: false,
      error: null
    };
    this.size = size;
    if (body instanceof Stream) {
      body.on("error", (err) => {
        const error2 = err instanceof FetchBaseError ? err : new FetchError(`Invalid response body while trying to fetch ${this.url}: ${err.message}`, "system", err);
        this[INTERNALS$2].error = error2;
      });
    }
  }
  get body() {
    return this[INTERNALS$2].body;
  }
  get bodyUsed() {
    return this[INTERNALS$2].disturbed;
  }
  async arrayBuffer() {
    const {buffer, byteOffset, byteLength} = await consumeBody(this);
    return buffer.slice(byteOffset, byteOffset + byteLength);
  }
  async blob() {
    const ct = this.headers && this.headers.get("content-type") || this[INTERNALS$2].body && this[INTERNALS$2].body.type || "";
    const buf = await this.buffer();
    return new fetchBlob([buf], {
      type: ct
    });
  }
  async json() {
    const buffer = await consumeBody(this);
    return JSON.parse(buffer.toString());
  }
  async text() {
    const buffer = await consumeBody(this);
    return buffer.toString();
  }
  buffer() {
    return consumeBody(this);
  }
}
Object.defineProperties(Body.prototype, {
  body: {enumerable: true},
  bodyUsed: {enumerable: true},
  arrayBuffer: {enumerable: true},
  blob: {enumerable: true},
  json: {enumerable: true},
  text: {enumerable: true}
});
async function consumeBody(data) {
  if (data[INTERNALS$2].disturbed) {
    throw new TypeError(`body used already for: ${data.url}`);
  }
  data[INTERNALS$2].disturbed = true;
  if (data[INTERNALS$2].error) {
    throw data[INTERNALS$2].error;
  }
  let {body} = data;
  if (body === null) {
    return Buffer.alloc(0);
  }
  if (isBlob(body)) {
    body = body.stream();
  }
  if (Buffer.isBuffer(body)) {
    return body;
  }
  if (!(body instanceof Stream)) {
    return Buffer.alloc(0);
  }
  const accum = [];
  let accumBytes = 0;
  try {
    for await (const chunk of body) {
      if (data.size > 0 && accumBytes + chunk.length > data.size) {
        const err = new FetchError(`content size at ${data.url} over limit: ${data.size}`, "max-size");
        body.destroy(err);
        throw err;
      }
      accumBytes += chunk.length;
      accum.push(chunk);
    }
  } catch (error2) {
    if (error2 instanceof FetchBaseError) {
      throw error2;
    } else {
      throw new FetchError(`Invalid response body while trying to fetch ${data.url}: ${error2.message}`, "system", error2);
    }
  }
  if (body.readableEnded === true || body._readableState.ended === true) {
    try {
      if (accum.every((c) => typeof c === "string")) {
        return Buffer.from(accum.join(""));
      }
      return Buffer.concat(accum, accumBytes);
    } catch (error2) {
      throw new FetchError(`Could not create Buffer from response body for ${data.url}: ${error2.message}`, "system", error2);
    }
  } else {
    throw new FetchError(`Premature close of server response while trying to fetch ${data.url}`);
  }
}
const clone = (instance, highWaterMark) => {
  let p1;
  let p2;
  let {body} = instance;
  if (instance.bodyUsed) {
    throw new Error("cannot clone body after it is used");
  }
  if (body instanceof Stream && typeof body.getBoundary !== "function") {
    p1 = new PassThrough({highWaterMark});
    p2 = new PassThrough({highWaterMark});
    body.pipe(p1);
    body.pipe(p2);
    instance[INTERNALS$2].body = p1;
    body = p2;
  }
  return body;
};
const extractContentType = (body, request) => {
  if (body === null) {
    return null;
  }
  if (typeof body === "string") {
    return "text/plain;charset=UTF-8";
  }
  if (isURLSearchParameters(body)) {
    return "application/x-www-form-urlencoded;charset=UTF-8";
  }
  if (isBlob(body)) {
    return body.type || null;
  }
  if (Buffer.isBuffer(body) || util.types.isAnyArrayBuffer(body) || ArrayBuffer.isView(body)) {
    return null;
  }
  if (body && typeof body.getBoundary === "function") {
    return `multipart/form-data;boundary=${body.getBoundary()}`;
  }
  if (isFormData(body)) {
    return `multipart/form-data; boundary=${request[INTERNALS$2].boundary}`;
  }
  if (body instanceof Stream) {
    return null;
  }
  return "text/plain;charset=UTF-8";
};
const getTotalBytes = (request) => {
  const {body} = request;
  if (body === null) {
    return 0;
  }
  if (isBlob(body)) {
    return body.size;
  }
  if (Buffer.isBuffer(body)) {
    return body.length;
  }
  if (body && typeof body.getLengthSync === "function") {
    return body.hasKnownLength && body.hasKnownLength() ? body.getLengthSync() : null;
  }
  if (isFormData(body)) {
    return getFormDataLength(request[INTERNALS$2].boundary);
  }
  return null;
};
const writeToStream = (dest, {body}) => {
  if (body === null) {
    dest.end();
  } else if (isBlob(body)) {
    body.stream().pipe(dest);
  } else if (Buffer.isBuffer(body)) {
    dest.write(body);
    dest.end();
  } else {
    body.pipe(dest);
  }
};
const validateHeaderName = typeof http.validateHeaderName === "function" ? http.validateHeaderName : (name) => {
  if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
    const err = new TypeError(`Header name must be a valid HTTP token [${name}]`);
    Object.defineProperty(err, "code", {value: "ERR_INVALID_HTTP_TOKEN"});
    throw err;
  }
};
const validateHeaderValue = typeof http.validateHeaderValue === "function" ? http.validateHeaderValue : (name, value) => {
  if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
    const err = new TypeError(`Invalid character in header content ["${name}"]`);
    Object.defineProperty(err, "code", {value: "ERR_INVALID_CHAR"});
    throw err;
  }
};
class Headers extends URLSearchParams {
  constructor(init2) {
    let result = [];
    if (init2 instanceof Headers) {
      const raw = init2.raw();
      for (const [name, values] of Object.entries(raw)) {
        result.push(...values.map((value) => [name, value]));
      }
    } else if (init2 == null)
      ;
    else if (typeof init2 === "object" && !util.types.isBoxedPrimitive(init2)) {
      const method = init2[Symbol.iterator];
      if (method == null) {
        result.push(...Object.entries(init2));
      } else {
        if (typeof method !== "function") {
          throw new TypeError("Header pairs must be iterable");
        }
        result = [...init2].map((pair) => {
          if (typeof pair !== "object" || util.types.isBoxedPrimitive(pair)) {
            throw new TypeError("Each header pair must be an iterable object");
          }
          return [...pair];
        }).map((pair) => {
          if (pair.length !== 2) {
            throw new TypeError("Each header pair must be a name/value tuple");
          }
          return [...pair];
        });
      }
    } else {
      throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
    }
    result = result.length > 0 ? result.map(([name, value]) => {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return [String(name).toLowerCase(), String(value)];
    }) : void 0;
    super(result);
    return new Proxy(this, {
      get(target, p, receiver) {
        switch (p) {
          case "append":
          case "set":
            return (name, value) => {
              validateHeaderName(name);
              validateHeaderValue(name, String(value));
              return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase(), String(value));
            };
          case "delete":
          case "has":
          case "getAll":
            return (name) => {
              validateHeaderName(name);
              return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase());
            };
          case "keys":
            return () => {
              target.sort();
              return new Set(URLSearchParams.prototype.keys.call(target)).keys();
            };
          default:
            return Reflect.get(target, p, receiver);
        }
      }
    });
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
  toString() {
    return Object.prototype.toString.call(this);
  }
  get(name) {
    const values = this.getAll(name);
    if (values.length === 0) {
      return null;
    }
    let value = values.join(", ");
    if (/^content-encoding$/i.test(name)) {
      value = value.toLowerCase();
    }
    return value;
  }
  forEach(callback) {
    for (const name of this.keys()) {
      callback(this.get(name), name);
    }
  }
  *values() {
    for (const name of this.keys()) {
      yield this.get(name);
    }
  }
  *entries() {
    for (const name of this.keys()) {
      yield [name, this.get(name)];
    }
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  raw() {
    return [...this.keys()].reduce((result, key) => {
      result[key] = this.getAll(key);
      return result;
    }, {});
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return [...this.keys()].reduce((result, key) => {
      const values = this.getAll(key);
      if (key === "host") {
        result[key] = values[0];
      } else {
        result[key] = values.length > 1 ? values : values[0];
      }
      return result;
    }, {});
  }
}
Object.defineProperties(Headers.prototype, ["get", "entries", "forEach", "values"].reduce((result, property) => {
  result[property] = {enumerable: true};
  return result;
}, {}));
function fromRawHeaders(headers = []) {
  return new Headers(headers.reduce((result, value, index2, array) => {
    if (index2 % 2 === 0) {
      result.push(array.slice(index2, index2 + 2));
    }
    return result;
  }, []).filter(([name, value]) => {
    try {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return true;
    } catch (e) {
      return false;
    }
  }));
}
const redirectStatus = new Set([301, 302, 303, 307, 308]);
const isRedirect = (code) => {
  return redirectStatus.has(code);
};
const INTERNALS$1 = Symbol("Response internals");
class Response extends Body {
  constructor(body = null, options = {}) {
    super(body, options);
    const status = options.status || 200;
    const headers = new Headers(options.headers);
    if (body !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(body);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    this[INTERNALS$1] = {
      url: options.url,
      status,
      statusText: options.statusText || "",
      headers,
      counter: options.counter,
      highWaterMark: options.highWaterMark
    };
  }
  get url() {
    return this[INTERNALS$1].url || "";
  }
  get status() {
    return this[INTERNALS$1].status;
  }
  get ok() {
    return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
  }
  get redirected() {
    return this[INTERNALS$1].counter > 0;
  }
  get statusText() {
    return this[INTERNALS$1].statusText;
  }
  get headers() {
    return this[INTERNALS$1].headers;
  }
  get highWaterMark() {
    return this[INTERNALS$1].highWaterMark;
  }
  clone() {
    return new Response(clone(this, this.highWaterMark), {
      url: this.url,
      status: this.status,
      statusText: this.statusText,
      headers: this.headers,
      ok: this.ok,
      redirected: this.redirected,
      size: this.size
    });
  }
  static redirect(url, status = 302) {
    if (!isRedirect(status)) {
      throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
    }
    return new Response(null, {
      headers: {
        location: new URL(url).toString()
      },
      status
    });
  }
  get [Symbol.toStringTag]() {
    return "Response";
  }
}
Object.defineProperties(Response.prototype, {
  url: {enumerable: true},
  status: {enumerable: true},
  ok: {enumerable: true},
  redirected: {enumerable: true},
  statusText: {enumerable: true},
  headers: {enumerable: true},
  clone: {enumerable: true}
});
const getSearch = (parsedURL) => {
  if (parsedURL.search) {
    return parsedURL.search;
  }
  const lastOffset = parsedURL.href.length - 1;
  const hash = parsedURL.hash || (parsedURL.href[lastOffset] === "#" ? "#" : "");
  return parsedURL.href[lastOffset - hash.length] === "?" ? "?" : "";
};
const INTERNALS = Symbol("Request internals");
const isRequest = (object) => {
  return typeof object === "object" && typeof object[INTERNALS] === "object";
};
class Request extends Body {
  constructor(input, init2 = {}) {
    let parsedURL;
    if (isRequest(input)) {
      parsedURL = new URL(input.url);
    } else {
      parsedURL = new URL(input);
      input = {};
    }
    let method = init2.method || input.method || "GET";
    method = method.toUpperCase();
    if ((init2.body != null || isRequest(input)) && input.body !== null && (method === "GET" || method === "HEAD")) {
      throw new TypeError("Request with GET/HEAD method cannot have body");
    }
    const inputBody = init2.body ? init2.body : isRequest(input) && input.body !== null ? clone(input) : null;
    super(inputBody, {
      size: init2.size || input.size || 0
    });
    const headers = new Headers(init2.headers || input.headers || {});
    if (inputBody !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(inputBody, this);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    let signal = isRequest(input) ? input.signal : null;
    if ("signal" in init2) {
      signal = init2.signal;
    }
    if (signal !== null && !isAbortSignal(signal)) {
      throw new TypeError("Expected signal to be an instanceof AbortSignal");
    }
    this[INTERNALS] = {
      method,
      redirect: init2.redirect || input.redirect || "follow",
      headers,
      parsedURL,
      signal
    };
    this.follow = init2.follow === void 0 ? input.follow === void 0 ? 20 : input.follow : init2.follow;
    this.compress = init2.compress === void 0 ? input.compress === void 0 ? true : input.compress : init2.compress;
    this.counter = init2.counter || input.counter || 0;
    this.agent = init2.agent || input.agent;
    this.highWaterMark = init2.highWaterMark || input.highWaterMark || 16384;
    this.insecureHTTPParser = init2.insecureHTTPParser || input.insecureHTTPParser || false;
  }
  get method() {
    return this[INTERNALS].method;
  }
  get url() {
    return format(this[INTERNALS].parsedURL);
  }
  get headers() {
    return this[INTERNALS].headers;
  }
  get redirect() {
    return this[INTERNALS].redirect;
  }
  get signal() {
    return this[INTERNALS].signal;
  }
  clone() {
    return new Request(this);
  }
  get [Symbol.toStringTag]() {
    return "Request";
  }
}
Object.defineProperties(Request.prototype, {
  method: {enumerable: true},
  url: {enumerable: true},
  headers: {enumerable: true},
  redirect: {enumerable: true},
  clone: {enumerable: true},
  signal: {enumerable: true}
});
const getNodeRequestOptions = (request) => {
  const {parsedURL} = request[INTERNALS];
  const headers = new Headers(request[INTERNALS].headers);
  if (!headers.has("Accept")) {
    headers.set("Accept", "*/*");
  }
  let contentLengthValue = null;
  if (request.body === null && /^(post|put)$/i.test(request.method)) {
    contentLengthValue = "0";
  }
  if (request.body !== null) {
    const totalBytes = getTotalBytes(request);
    if (typeof totalBytes === "number" && !Number.isNaN(totalBytes)) {
      contentLengthValue = String(totalBytes);
    }
  }
  if (contentLengthValue) {
    headers.set("Content-Length", contentLengthValue);
  }
  if (!headers.has("User-Agent")) {
    headers.set("User-Agent", "node-fetch");
  }
  if (request.compress && !headers.has("Accept-Encoding")) {
    headers.set("Accept-Encoding", "gzip,deflate,br");
  }
  let {agent} = request;
  if (typeof agent === "function") {
    agent = agent(parsedURL);
  }
  if (!headers.has("Connection") && !agent) {
    headers.set("Connection", "close");
  }
  const search = getSearch(parsedURL);
  const requestOptions = {
    path: parsedURL.pathname + search,
    pathname: parsedURL.pathname,
    hostname: parsedURL.hostname,
    protocol: parsedURL.protocol,
    port: parsedURL.port,
    hash: parsedURL.hash,
    search: parsedURL.search,
    query: parsedURL.query,
    href: parsedURL.href,
    method: request.method,
    headers: headers[Symbol.for("nodejs.util.inspect.custom")](),
    insecureHTTPParser: request.insecureHTTPParser,
    agent
  };
  return requestOptions;
};
class AbortError extends FetchBaseError {
  constructor(message, type = "aborted") {
    super(message, type);
  }
}
const supportedSchemas = new Set(["data:", "http:", "https:"]);
async function fetch(url, options_) {
  return new Promise((resolve2, reject) => {
    const request = new Request(url, options_);
    const options = getNodeRequestOptions(request);
    if (!supportedSchemas.has(options.protocol)) {
      throw new TypeError(`node-fetch cannot load ${url}. URL scheme "${options.protocol.replace(/:$/, "")}" is not supported.`);
    }
    if (options.protocol === "data:") {
      const data = src(request.url);
      const response2 = new Response(data, {headers: {"Content-Type": data.typeFull}});
      resolve2(response2);
      return;
    }
    const send = (options.protocol === "https:" ? https : http).request;
    const {signal} = request;
    let response = null;
    const abort = () => {
      const error2 = new AbortError("The operation was aborted.");
      reject(error2);
      if (request.body && request.body instanceof Stream.Readable) {
        request.body.destroy(error2);
      }
      if (!response || !response.body) {
        return;
      }
      response.body.emit("error", error2);
    };
    if (signal && signal.aborted) {
      abort();
      return;
    }
    const abortAndFinalize = () => {
      abort();
      finalize();
    };
    const request_ = send(options);
    if (signal) {
      signal.addEventListener("abort", abortAndFinalize);
    }
    const finalize = () => {
      request_.abort();
      if (signal) {
        signal.removeEventListener("abort", abortAndFinalize);
      }
    };
    request_.on("error", (err) => {
      reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, "system", err));
      finalize();
    });
    request_.on("response", (response_) => {
      request_.setTimeout(0);
      const headers = fromRawHeaders(response_.rawHeaders);
      if (isRedirect(response_.statusCode)) {
        const location2 = headers.get("Location");
        const locationURL = location2 === null ? null : new URL(location2, request.url);
        switch (request.redirect) {
          case "error":
            reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
            finalize();
            return;
          case "manual":
            if (locationURL !== null) {
              try {
                headers.set("Location", locationURL);
              } catch (error2) {
                reject(error2);
              }
            }
            break;
          case "follow": {
            if (locationURL === null) {
              break;
            }
            if (request.counter >= request.follow) {
              reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
              finalize();
              return;
            }
            const requestOptions = {
              headers: new Headers(request.headers),
              follow: request.follow,
              counter: request.counter + 1,
              agent: request.agent,
              compress: request.compress,
              method: request.method,
              body: request.body,
              signal: request.signal,
              size: request.size
            };
            if (response_.statusCode !== 303 && request.body && options_.body instanceof Stream.Readable) {
              reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
              finalize();
              return;
            }
            if (response_.statusCode === 303 || (response_.statusCode === 301 || response_.statusCode === 302) && request.method === "POST") {
              requestOptions.method = "GET";
              requestOptions.body = void 0;
              requestOptions.headers.delete("content-length");
            }
            resolve2(fetch(new Request(locationURL, requestOptions)));
            finalize();
            return;
          }
        }
      }
      response_.once("end", () => {
        if (signal) {
          signal.removeEventListener("abort", abortAndFinalize);
        }
      });
      let body = pipeline(response_, new PassThrough(), (error2) => {
        reject(error2);
      });
      if (process.version < "v12.10") {
        response_.on("aborted", abortAndFinalize);
      }
      const responseOptions = {
        url: request.url,
        status: response_.statusCode,
        statusText: response_.statusMessage,
        headers,
        size: request.size,
        counter: request.counter,
        highWaterMark: request.highWaterMark
      };
      const codings = headers.get("Content-Encoding");
      if (!request.compress || request.method === "HEAD" || codings === null || response_.statusCode === 204 || response_.statusCode === 304) {
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      const zlibOptions = {
        flush: zlib.Z_SYNC_FLUSH,
        finishFlush: zlib.Z_SYNC_FLUSH
      };
      if (codings === "gzip" || codings === "x-gzip") {
        body = pipeline(body, zlib.createGunzip(zlibOptions), (error2) => {
          reject(error2);
        });
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      if (codings === "deflate" || codings === "x-deflate") {
        const raw = pipeline(response_, new PassThrough(), (error2) => {
          reject(error2);
        });
        raw.once("data", (chunk) => {
          if ((chunk[0] & 15) === 8) {
            body = pipeline(body, zlib.createInflate(), (error2) => {
              reject(error2);
            });
          } else {
            body = pipeline(body, zlib.createInflateRaw(), (error2) => {
              reject(error2);
            });
          }
          response = new Response(body, responseOptions);
          resolve2(response);
        });
        return;
      }
      if (codings === "br") {
        body = pipeline(body, zlib.createBrotliDecompress(), (error2) => {
          reject(error2);
        });
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      response = new Response(body, responseOptions);
      resolve2(response);
    });
    writeToStream(request_, request);
  });
}
function noop$1() {
}
function safe_not_equal$1(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
const subscriber_queue$1 = [];
function writable$1(value, start = noop$1) {
  let stop;
  const subscribers = [];
  function set(new_value) {
    if (safe_not_equal$1(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue$1.length;
        for (let i = 0; i < subscribers.length; i += 1) {
          const s2 = subscribers[i];
          s2[1]();
          subscriber_queue$1.push(s2, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue$1.length; i += 2) {
            subscriber_queue$1[i][0](subscriber_queue$1[i + 1]);
          }
          subscriber_queue$1.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop$1) {
    const subscriber = [run2, invalidate];
    subscribers.push(subscriber);
    if (subscribers.length === 1) {
      stop = start(set) || noop$1;
    }
    run2(value);
    return () => {
      const index2 = subscribers.indexOf(subscriber);
      if (index2 !== -1) {
        subscribers.splice(index2, 1);
      }
      if (subscribers.length === 0) {
        stop();
        stop = null;
      }
    };
  }
  return {set, update, subscribe: subscribe2};
}
function normalize(loaded) {
  if (loaded.error) {
    const error2 = typeof loaded.error === "string" ? new Error(loaded.error) : loaded.error;
    const status = loaded.status;
    if (!(error2 instanceof Error)) {
      return {
        status: 500,
        error: new Error(`"error" property returned from load() must be a string or instance of Error, received type "${typeof error2}"`)
      };
    }
    if (!status || status < 400 || status > 599) {
      console.warn('"error" returned from load() without a valid status code \u2014 defaulting to 500');
      return {status: 500, error: error2};
    }
    return {status, error: error2};
  }
  if (loaded.redirect) {
    if (!loaded.status || Math.floor(loaded.status / 100) !== 3) {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be accompanied by a 3xx status code')
      };
    }
    if (typeof loaded.redirect !== "string") {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be a string')
      };
    }
  }
  return loaded;
}
const s = JSON.stringify;
async function respond({request, options, $session, route, status = 200, error: error2}) {
  const serialized_session = try_serialize($session, (error3) => {
    throw new Error(`Failed to serialize session data: ${error3.message}`);
  });
  const serialized_data = [];
  const match = error2 ? null : route.pattern.exec(request.path);
  const params = error2 ? {} : route.params(match);
  const page = {
    host: request.host,
    path: request.path,
    query: request.query,
    params
  };
  let uses_credentials = false;
  const fetcher = async (resource, opts = {}) => {
    let url;
    if (typeof resource === "string") {
      url = resource;
    } else {
      url = resource.url;
      opts = {
        method: resource.method,
        headers: resource.headers,
        body: resource.body,
        mode: resource.mode,
        credentials: resource.credentials,
        cache: resource.cache,
        redirect: resource.redirect,
        referrer: resource.referrer,
        integrity: resource.integrity,
        ...opts
      };
    }
    if (options.local && url.startsWith(options.paths.assets)) {
      url = url.replace(options.paths.assets, "");
    }
    const parsed = parse(url);
    let response;
    if (parsed.protocol) {
      response = await fetch(parsed.href, opts);
    } else {
      const resolved = resolve(request.path, parsed.pathname);
      const filename = resolved.slice(1);
      const filename_html = `${filename}/index.html`;
      const asset = options.manifest.assets.find((d) => d.file === filename || d.file === filename_html);
      if (asset) {
        if (options.get_static_file) {
          response = new Response(options.get_static_file(asset.file), {
            headers: {
              "content-type": asset.type
            }
          });
        } else {
          response = await fetch(`http://${page.host}/${asset.file}`, opts);
        }
      }
      if (!response) {
        const headers2 = {...opts.headers};
        if (opts.credentials !== "omit") {
          uses_credentials = true;
          headers2.cookie = request.headers.cookie;
          if (!headers2.authorization) {
            headers2.authorization = request.headers.authorization;
          }
        }
        const rendered2 = await ssr({
          host: request.host,
          method: opts.method || "GET",
          headers: headers2,
          path: resolved,
          body: opts.body,
          query: new URLSearchParams$1(parsed.query || "")
        }, {
          ...options,
          fetched: url,
          initiator: route
        });
        if (rendered2) {
          if (options.dependencies) {
            options.dependencies.set(resolved, rendered2);
          }
          response = new Response(rendered2.body, {
            status: rendered2.status,
            headers: rendered2.headers
          });
        }
      }
    }
    if (response && page_config.hydrate) {
      const proxy = new Proxy(response, {
        get(response2, key, receiver) {
          async function text() {
            const body2 = await response2.text();
            const headers2 = {};
            response2.headers.forEach((value, key2) => {
              if (key2 !== "etag" && key2 !== "set-cookie")
                headers2[key2] = value;
            });
            serialized_data.push({
              url,
              json: `{"status":${response2.status},"statusText":${s(response2.statusText)},"headers":${s(headers2)},"body":${escape$1(body2)}}`
            });
            return body2;
          }
          if (key === "text") {
            return text;
          }
          if (key === "json") {
            return async () => {
              return JSON.parse(await text());
            };
          }
          return Reflect.get(response2, key, receiver);
        }
      });
      return proxy;
    }
    return response || new Response("Not found", {
      status: 404
    });
  };
  const component_promises = error2 ? [options.manifest.layout()] : [options.manifest.layout(), ...route.parts.map((part) => part.load())];
  const components2 = [];
  const props_promises = [];
  let context = {};
  let maxage;
  let page_component;
  try {
    page_component = error2 ? {ssr: options.ssr, router: options.router, hydrate: options.hydrate} : await component_promises[component_promises.length - 1];
  } catch (e) {
    return await respond({
      request,
      options,
      $session,
      route: null,
      status: 500,
      error: e instanceof Error ? e : {name: "Error", message: e.toString()}
    });
  }
  const page_config = {
    ssr: "ssr" in page_component ? page_component.ssr : options.ssr,
    router: "router" in page_component ? page_component.router : options.router,
    hydrate: "hydrate" in page_component ? page_component.hydrate : options.hydrate
  };
  if (options.only_render_prerenderable_pages) {
    if (error2) {
      return {
        status,
        headers: {},
        body: error2.message
      };
    }
    if (!page_component.prerender) {
      return {
        status: 204,
        headers: {},
        body: null
      };
    }
  }
  let rendered;
  if (page_config.ssr) {
    for (let i = 0; i < component_promises.length; i += 1) {
      let loaded;
      try {
        const mod = await component_promises[i];
        components2[i] = mod.default;
        if (mod.load) {
          loaded = await mod.load.call(null, {
            page,
            get session() {
              uses_credentials = true;
              return $session;
            },
            fetch: fetcher,
            context: {...context}
          });
          if (!loaded && mod === page_component)
            return;
        }
      } catch (e) {
        if (error2)
          throw e instanceof Error ? e : new Error(e);
        loaded = {
          error: e instanceof Error ? e : {name: "Error", message: e.toString()},
          status: 500
        };
      }
      if (loaded) {
        loaded = normalize(loaded);
        if (loaded.error) {
          return await respond({
            request,
            options,
            $session,
            route: null,
            status: loaded.status,
            error: loaded.error
          });
        }
        if (loaded.redirect) {
          return {
            status: loaded.status,
            headers: {
              location: loaded.redirect
            }
          };
        }
        if (loaded.context) {
          context = {
            ...context,
            ...loaded.context
          };
        }
        maxage = loaded.maxage || 0;
        props_promises[i] = loaded.props;
      }
    }
    const session = writable$1($session);
    let session_tracking_active = false;
    const unsubscribe = session.subscribe(() => {
      if (session_tracking_active)
        uses_credentials = true;
    });
    session_tracking_active = true;
    if (error2) {
      if (options.dev) {
        error2.stack = await options.get_stack(error2);
      } else {
        error2.stack = String(error2);
      }
    }
    const props2 = {
      status,
      error: error2,
      stores: {
        page: writable$1(null),
        navigating: writable$1(null),
        session
      },
      page,
      components: components2
    };
    for (let i = 0; i < props_promises.length; i += 1) {
      props2[`props_${i}`] = await props_promises[i];
    }
    try {
      rendered = options.root.render(props2);
    } catch (e) {
      if (error2)
        throw e instanceof Error ? e : new Error(e);
      return await respond({
        request,
        options,
        $session,
        route: null,
        status: 500,
        error: e instanceof Error ? e : {name: "Error", message: e.toString()}
      });
    } finally {
      unsubscribe();
    }
  } else {
    rendered = {
      head: "",
      html: "",
      css: ""
    };
  }
  const js_deps = route && page_config.ssr ? route.js : [];
  const css_deps = route && page_config.ssr ? route.css : [];
  const style = route && page_config.ssr ? route.style : "";
  const prefix = `${options.paths.assets}/${options.app_dir}`;
  const links = options.amp ? `<style amp-custom>${style || (await Promise.all(css_deps.map((dep) => options.get_amp_css(dep)))).join("\n")}</style>` : [
    ...js_deps.map((dep) => `<link rel="modulepreload" href="${prefix}/${dep}">`),
    ...css_deps.map((dep) => `<link rel="stylesheet" href="${prefix}/${dep}">`)
  ].join("\n			");
  let init2 = "";
  if (options.amp) {
    init2 = `
		<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
		<noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
		<script async src="https://cdn.ampproject.org/v0.js"></script>`;
  } else if (page_config.router || page_config.hydrate) {
    init2 = `
		<script type="module">
			import { start } from ${s(options.entry)};
			start({
				target: ${options.target ? `document.querySelector(${s(options.target)})` : "document.body"},
				paths: ${s(options.paths)},
				session: ${serialized_session},
				host: ${request.host ? s(request.host) : "location.host"},
				route: ${!!page_config.router},
				hydrate: ${page_config.hydrate ? `{
					status: ${status},
					error: ${serialize_error(error2)},
					nodes: ${route ? `[
						${(route ? route.parts : []).map((part) => `import(${s(options.get_component_path(part.id))})`).join(",\n						")}
					]` : "[]"},
					page: {
						host: ${request.host ? s(request.host) : "location.host"}, // TODO this is redundant
						path: ${s(request.path)},
						query: new URLSearchParams(${s(request.query.toString())}),
						params: ${s(params)}
					}
				}` : "null"}
			});
		</script>`;
  }
  const head = [
    rendered.head,
    style && !options.amp ? `<style data-svelte>${style}</style>` : "",
    links,
    init2
  ].join("\n\n");
  const body = options.amp ? rendered.html : `${rendered.html}

			${serialized_data.map(({url, json}) => `<script type="svelte-data" url="${url}">${json}</script>`).join("\n\n			")}
		`.replace(/^\t{2}/gm, "");
  const headers = {
    "content-type": "text/html"
  };
  if (maxage) {
    headers["cache-control"] = `${uses_credentials ? "private" : "public"}, max-age=${maxage}`;
  }
  return {
    status,
    headers,
    body: options.template({head, body})
  };
}
async function render_page(request, route, options) {
  if (options.initiator === route) {
    return {
      status: 404,
      headers: {},
      body: `Not found: ${request.path}`
    };
  }
  const $session = await options.hooks.getSession({context: request.context});
  const response = await respond({
    request,
    options,
    $session,
    route,
    status: route ? 200 : 404,
    error: route ? null : new Error(`Not found: ${request.path}`)
  });
  if (response) {
    return response;
  }
  if (options.fetched) {
    return {
      status: 500,
      headers: {},
      body: `Bad request in load function: failed to fetch ${options.fetched}`
    };
  }
}
function try_serialize(data, fail2) {
  try {
    return devalue(data);
  } catch (err) {
    if (fail2)
      fail2(err);
    return null;
  }
}
function serialize_error(error2) {
  if (!error2)
    return null;
  let serialized = try_serialize(error2);
  if (!serialized) {
    const {name, message, stack} = error2;
    serialized = try_serialize({name, message, stack});
  }
  if (!serialized) {
    serialized = "{}";
  }
  return serialized;
}
const escaped$2 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
function escape$1(str) {
  let result = '"';
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charAt(i);
    const code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$2) {
      result += escaped$2[char];
    } else if (code >= 55296 && code <= 57343) {
      const next = str.charCodeAt(i + 1);
      if (code <= 56319 && next >= 56320 && next <= 57343) {
        result += char + str[++i];
      } else {
        result += `\\u${code.toString(16).toUpperCase()}`;
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
async function render_route(request, route) {
  const mod = await route.load();
  const handler = mod[request.method.toLowerCase().replace("delete", "del")];
  if (handler) {
    const match = route.pattern.exec(request.path);
    const params = route.params(match);
    const response = await handler({...request, params});
    if (response) {
      if (typeof response !== "object" || response.body == null) {
        return {
          status: 500,
          body: `Invalid response from route ${request.path}; ${response.body == null ? "body is missing" : `expected an object, got ${typeof response}`}`,
          headers: {}
        };
      }
      let {status = 200, body, headers = {}} = response;
      headers = lowercase_keys(headers);
      if (typeof body === "object" && !("content-type" in headers) || headers["content-type"] === "application/json") {
        headers = {...headers, "content-type": "application/json"};
        body = JSON.stringify(body);
      }
      return {status, body, headers};
    }
  }
}
function lowercase_keys(obj) {
  const clone2 = {};
  for (const key in obj) {
    clone2[key.toLowerCase()] = obj[key];
  }
  return clone2;
}
function md5(body) {
  return createHash("md5").update(body).digest("hex");
}
async function ssr(incoming, options) {
  if (incoming.path.endsWith("/") && incoming.path !== "/") {
    const q = incoming.query.toString();
    return {
      status: 301,
      headers: {
        location: incoming.path.slice(0, -1) + (q ? `?${q}` : "")
      }
    };
  }
  const context = await options.hooks.getContext(incoming) || {};
  try {
    return await options.hooks.handle({
      ...incoming,
      params: null,
      context
    }, async (request) => {
      for (const route of options.manifest.routes) {
        if (!route.pattern.test(request.path))
          continue;
        const response = route.type === "endpoint" ? await render_route(request, route) : await render_page(request, route, options);
        if (response) {
          if (response.status === 200) {
            if (!/(no-store|immutable)/.test(response.headers["cache-control"])) {
              const etag = `"${md5(response.body)}"`;
              if (request.headers["if-none-match"] === etag) {
                return {
                  status: 304,
                  headers: {},
                  body: null
                };
              }
              response.headers["etag"] = etag;
            }
          }
          return response;
        }
      }
      return await render_page(request, null, options);
    });
  } catch (e) {
    if (e && e.stack) {
      e.stack = await options.get_stack(e);
    }
    console.error(e && e.stack || e);
    return {
      status: 500,
      headers: {},
      body: options.dev ? e.stack : e.message
    };
  }
}
function noop() {
}
function is_promise(value) {
  return value && typeof value === "object" && typeof value.then === "function";
}
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    return noop;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function set_store_value(store, ret, value = ret) {
  store.set(value);
  return ret;
}
const is_client = typeof window !== "undefined";
let now = is_client ? () => window.performance.now() : () => Date.now();
let raf = is_client ? (cb) => requestAnimationFrame(cb) : noop;
const tasks = new Set();
function run_tasks(now2) {
  tasks.forEach((task2) => {
    if (!task2.c(now2)) {
      tasks.delete(task2);
      task2.f();
    }
  });
  if (tasks.size !== 0)
    raf(run_tasks);
}
function loop(callback) {
  let task2;
  if (tasks.size === 0)
    raf(run_tasks);
  return {
    promise: new Promise((fulfill) => {
      tasks.add(task2 = {c: callback, f: fulfill});
    }),
    abort() {
      tasks.delete(task2);
    }
  };
}
function custom_event(type, detail) {
  const e = document.createEvent("CustomEvent");
  e.initCustomEvent(type, false, false, detail);
  return e;
}
let current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function onMount(fn) {
  get_current_component().$$.on_mount.push(fn);
}
function afterUpdate(fn) {
  get_current_component().$$.after_update.push(fn);
}
function createEventDispatcher() {
  const component = get_current_component();
  return (type, detail) => {
    const callbacks = component.$$.callbacks[type];
    if (callbacks) {
      const event = custom_event(type, detail);
      callbacks.slice().forEach((fn) => {
        fn.call(component, event);
      });
    }
  };
}
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
}
const escaped = {
  '"': "&quot;",
  "'": "&#39;",
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;"
};
function escape(html) {
  return String(html).replace(/["'&<>]/g, (match) => escaped[match]);
}
function each(items, fn) {
  let str = "";
  for (let i = 0; i < items.length; i += 1) {
    str += fn(items[i], i);
  }
  return str;
}
const missing_component = {
  $$render: () => ""
};
function validate_component(component, name) {
  if (!component || !component.$$render) {
    if (name === "svelte:component")
      name += " this={...}";
    throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
  }
  return component;
}
let on_destroy;
function create_ssr_component(fn) {
  function $$render(result, props2, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(parent_component ? parent_component.$$.context : context || []),
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({$$});
    const html = fn(result, props2, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props2 = {}, {$$slots = {}, context = new Map()} = {}) => {
      on_destroy = [];
      const result = {title: "", head: "", css: new Set()};
      const html = $$render(result, props2, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css2) => css2.code).join("\n"),
          map: null
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
function add_attribute(name, value, boolean) {
  if (value == null || boolean && !value)
    return "";
  return ` ${name}${value === true ? "" : `=${typeof value === "string" ? JSON.stringify(escape(value)) : `"${value}"`}`}`;
}
const Error$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let {status} = $$props;
  let {error: error2} = $$props;
  if ($$props.status === void 0 && $$bindings.status && status !== void 0)
    $$bindings.status(status);
  if ($$props.error === void 0 && $$bindings.error && error2 !== void 0)
    $$bindings.error(error2);
  return `<h1>${escape(status)}</h1>

<p>${escape(error2.message)}</p>


${error2.stack ? `<pre>${escape(error2.stack)}</pre>` : ``}`;
});
var error = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  default: Error$1
});
var root_svelte_svelte_type_style_lang = "#svelte-announcer.svelte-1j55zn5{position:absolute;left:0;top:0;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px}";
const css$9 = {
  code: "#svelte-announcer.svelte-1j55zn5{position:absolute;left:0;top:0;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px}",
  map: `{"version":3,"file":"root.svelte","sources":["root.svelte"],"sourcesContent":["<!-- This file is generated by @sveltejs/kit \u2014 do not edit it! -->\\n<script>\\n\\timport { setContext, afterUpdate, onMount } from 'svelte';\\n\\timport ErrorComponent from \\"../components/error.svelte\\";\\n\\n\\t// error handling\\n\\texport let status = undefined;\\n\\texport let error = undefined;\\n\\n\\t// stores\\n\\texport let stores;\\n\\texport let page;\\n\\n\\texport let components;\\n\\texport let props_0 = null;\\n\\texport let props_1 = null;\\n\\n\\tconst Layout = components[0];\\n\\n\\tsetContext('__svelte__', stores);\\n\\n\\t$: stores.page.set(page);\\n\\tafterUpdate(stores.page.notify);\\n\\n\\tlet mounted = false;\\n\\tlet navigated = false;\\n\\tlet title = null;\\n\\n\\tonMount(() => {\\n\\t\\tconst unsubscribe = stores.page.subscribe(() => {\\n\\t\\t\\tif (mounted) {\\n\\t\\t\\t\\tnavigated = true;\\n\\t\\t\\t\\ttitle = document.title;\\n\\t\\t\\t}\\n\\t\\t});\\n\\n\\t\\tmounted = true;\\n\\t\\treturn unsubscribe;\\n\\t});\\n</script>\\n\\n<Layout {...(props_0 || {})}>\\n\\t{#if error}\\n\\t\\t<ErrorComponent {status} {error}/>\\n\\t{:else}\\n\\t\\t<svelte:component this={components[1]} {...(props_1 || {})}/>\\n\\t{/if}\\n</Layout>\\n\\n{#if mounted}\\n\\t<div id=\\"svelte-announcer\\" aria-live=\\"assertive\\" aria-atomic=\\"true\\">\\n\\t\\t{#if navigated}\\n\\t\\t\\tNavigated to {title}\\n\\t\\t{/if}\\n\\t</div>\\n{/if}\\n\\n<style>\\n\\t#svelte-announcer {\\n\\t\\tposition: absolute;\\n\\t\\tleft: 0;\\n\\t\\ttop: 0;\\n\\t\\tclip: rect(0 0 0 0);\\n\\t\\tclip-path: inset(50%);\\n\\t\\toverflow: hidden;\\n\\t\\twhite-space: nowrap;\\n\\t\\twidth: 1px;\\n\\t\\theight: 1px;\\n\\t}\\n</style>"],"names":[],"mappings":"AA0DC,iBAAiB,eAAC,CAAC,AAClB,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,CAAC,CACP,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CACnB,SAAS,CAAE,MAAM,GAAG,CAAC,CACrB,QAAQ,CAAE,MAAM,CAChB,WAAW,CAAE,MAAM,CACnB,KAAK,CAAE,GAAG,CACV,MAAM,CAAE,GAAG,AACZ,CAAC"}`
};
const Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let {status = void 0} = $$props;
  let {error: error2 = void 0} = $$props;
  let {stores} = $$props;
  let {page} = $$props;
  let {components: components2} = $$props;
  let {props_0 = null} = $$props;
  let {props_1 = null} = $$props;
  const Layout = components2[0];
  setContext("__svelte__", stores);
  afterUpdate(stores.page.notify);
  let mounted = false;
  let navigated = false;
  let title = null;
  onMount(() => {
    const unsubscribe = stores.page.subscribe(() => {
      if (mounted) {
        navigated = true;
        title = document.title;
      }
    });
    mounted = true;
    return unsubscribe;
  });
  if ($$props.status === void 0 && $$bindings.status && status !== void 0)
    $$bindings.status(status);
  if ($$props.error === void 0 && $$bindings.error && error2 !== void 0)
    $$bindings.error(error2);
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
    $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page !== void 0)
    $$bindings.page(page);
  if ($$props.components === void 0 && $$bindings.components && components2 !== void 0)
    $$bindings.components(components2);
  if ($$props.props_0 === void 0 && $$bindings.props_0 && props_0 !== void 0)
    $$bindings.props_0(props_0);
  if ($$props.props_1 === void 0 && $$bindings.props_1 && props_1 !== void 0)
    $$bindings.props_1(props_1);
  $$result.css.add(css$9);
  {
    stores.page.set(page);
  }
  return `


${validate_component(Layout, "Layout").$$render($$result, Object.assign(props_0 || {}), {}, {
    default: () => `${error2 ? `${validate_component(Error$1, "ErrorComponent").$$render($$result, {status, error: error2}, {}, {})}` : `${validate_component(components2[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {})}`}`
  })}

${mounted ? `<div id="${"svelte-announcer"}" aria-live="${"assertive"}" aria-atomic="${"true"}" class="${"svelte-1j55zn5"}">${navigated ? `Navigated to ${escape(title)}` : ``}</div>` : ``}`;
});
var user_hooks = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module"
});
const template = ({head, body}) => '<!DOCTYPE html>\n<html lang="en">\n	<head>\n		<meta charset="utf-8" />\n		<link rel="icon" href="/favicon.ico" />\n		<meta name="viewport" content="width=device-width, initial-scale=1" />\n		' + head + '\n	</head>\n	<body>\n		<div id="svelte">' + body + "</div>\n	</body>\n</html>\n";
function init({paths, prerendering}) {
}
const empty = () => ({});
const components = [
  () => Promise.resolve().then(function() {
    return index;
  }),
  () => Promise.resolve().then(function() {
    return track;
  })
];
const client_component_lookup = {".svelte/build/runtime/internal/start.js": "start-efa0b66f.js", "src/routes/index.svelte": "pages/index.svelte-77ff60b8.js", "src/routes/track.svelte": "pages/track.svelte-9a0bcb7a.js"};
const manifest = {
  assets: [{file: "favicon.ico", size: 1150, type: "image/vnd.microsoft.icon"}, {file: "robots.txt", size: 67, type: "text/plain"}],
  layout: () => Promise.resolve().then(function() {
    return $layout$1;
  }),
  error: () => Promise.resolve().then(function() {
    return error;
  }),
  routes: [
    {
      type: "page",
      pattern: /^\/$/,
      params: empty,
      parts: [{id: "src/routes/index.svelte", load: components[0]}],
      css: ["assets/start-68f38649.css", "assets/pages/index.svelte-9e80c706.css"],
      js: ["start-efa0b66f.js", "chunks/singletons-22c415ed.js", "chunks/index-55393e6c.js", "pages/index.svelte-77ff60b8.js", "chunks/emotions-8f3a6225.js"]
    },
    {
      type: "page",
      pattern: /^\/track\/?$/,
      params: empty,
      parts: [{id: "src/routes/track.svelte", load: components[1]}],
      css: ["assets/start-68f38649.css", "assets/pages/track.svelte-ed07887e.css"],
      js: ["start-efa0b66f.js", "chunks/singletons-22c415ed.js", "chunks/index-55393e6c.js", "pages/track.svelte-9a0bcb7a.js", "chunks/emotions-8f3a6225.js"]
    }
  ]
};
const get_hooks = (hooks2) => ({
  getContext: hooks2.getContext || (() => ({})),
  getSession: hooks2.getSession || (() => ({})),
  handle: hooks2.handle || ((request, render2) => render2(request))
});
const hooks = get_hooks(user_hooks);
function render(request, {
  paths = {base: "", assets: "/."},
  local = false,
  dependencies,
  only_render_prerenderable_pages = false,
  get_static_file
} = {}) {
  return ssr({
    ...request,
    host: request.headers["host"]
  }, {
    paths,
    local,
    template,
    manifest,
    target: "#svelte",
    entry: "/./_app/start-efa0b66f.js",
    root: Root,
    hooks,
    dev: false,
    amp: false,
    dependencies,
    only_render_prerenderable_pages,
    app_dir: "_app",
    get_component_path: (id) => "/./_app/" + client_component_lookup[id],
    get_stack: (error2) => error2.stack,
    get_static_file,
    get_amp_css: (dep) => amp_css_lookup[dep],
    ssr: false,
    router: true,
    hydrate: true
  });
}
var __assign = function() {
  __assign = Object.assign || function __assign2(t) {
    for (var s2, i = 1, n = arguments.length; i < n; i++) {
      s2 = arguments[i];
      for (var p in s2)
        if (Object.prototype.hasOwnProperty.call(s2, p))
          t[p] = s2[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
function __spreadArrays() {
  for (var s2 = 0, i = 0, il = arguments.length; i < il; i++)
    s2 += arguments[i].length;
  for (var r = Array(s2), k = 0, i = 0; i < il; i++)
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
      r[k] = a[j];
  return r;
}
var keys = Object.keys;
var isArray = Array.isArray;
var _global = typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
if (typeof Promise !== "undefined" && !_global.Promise) {
  _global.Promise = Promise;
}
function extend(obj, extension) {
  if (typeof extension !== "object")
    return obj;
  keys(extension).forEach(function(key) {
    obj[key] = extension[key];
  });
  return obj;
}
var getProto = Object.getPrototypeOf;
var _hasOwn = {}.hasOwnProperty;
function hasOwn(obj, prop) {
  return _hasOwn.call(obj, prop);
}
function props(proto, extension) {
  if (typeof extension === "function")
    extension = extension(getProto(proto));
  keys(extension).forEach(function(key) {
    setProp(proto, key, extension[key]);
  });
}
var defineProperty = Object.defineProperty;
function setProp(obj, prop, functionOrGetSet, options) {
  defineProperty(obj, prop, extend(functionOrGetSet && hasOwn(functionOrGetSet, "get") && typeof functionOrGetSet.get === "function" ? {get: functionOrGetSet.get, set: functionOrGetSet.set, configurable: true} : {value: functionOrGetSet, configurable: true, writable: true}, options));
}
function derive(Child) {
  return {
    from: function(Parent) {
      Child.prototype = Object.create(Parent.prototype);
      setProp(Child.prototype, "constructor", Child);
      return {
        extend: props.bind(null, Child.prototype)
      };
    }
  };
}
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
function getPropertyDescriptor(obj, prop) {
  var pd = getOwnPropertyDescriptor(obj, prop);
  var proto;
  return pd || (proto = getProto(obj)) && getPropertyDescriptor(proto, prop);
}
var _slice = [].slice;
function slice(args, start, end) {
  return _slice.call(args, start, end);
}
function override(origFunc, overridedFactory) {
  return overridedFactory(origFunc);
}
function assert(b) {
  if (!b)
    throw new Error("Assertion Failed");
}
function asap(fn) {
  if (_global.setImmediate)
    setImmediate(fn);
  else
    setTimeout(fn, 0);
}
function arrayToObject(array, extractor) {
  return array.reduce(function(result, item, i) {
    var nameAndValue = extractor(item, i);
    if (nameAndValue)
      result[nameAndValue[0]] = nameAndValue[1];
    return result;
  }, {});
}
function tryCatch(fn, onerror, args) {
  try {
    fn.apply(null, args);
  } catch (ex) {
    onerror && onerror(ex);
  }
}
function getByKeyPath(obj, keyPath) {
  if (hasOwn(obj, keyPath))
    return obj[keyPath];
  if (!keyPath)
    return obj;
  if (typeof keyPath !== "string") {
    var rv = [];
    for (var i = 0, l = keyPath.length; i < l; ++i) {
      var val = getByKeyPath(obj, keyPath[i]);
      rv.push(val);
    }
    return rv;
  }
  var period = keyPath.indexOf(".");
  if (period !== -1) {
    var innerObj = obj[keyPath.substr(0, period)];
    return innerObj === void 0 ? void 0 : getByKeyPath(innerObj, keyPath.substr(period + 1));
  }
  return void 0;
}
function setByKeyPath(obj, keyPath, value) {
  if (!obj || keyPath === void 0)
    return;
  if ("isFrozen" in Object && Object.isFrozen(obj))
    return;
  if (typeof keyPath !== "string" && "length" in keyPath) {
    assert(typeof value !== "string" && "length" in value);
    for (var i = 0, l = keyPath.length; i < l; ++i) {
      setByKeyPath(obj, keyPath[i], value[i]);
    }
  } else {
    var period = keyPath.indexOf(".");
    if (period !== -1) {
      var currentKeyPath = keyPath.substr(0, period);
      var remainingKeyPath = keyPath.substr(period + 1);
      if (remainingKeyPath === "")
        if (value === void 0) {
          if (isArray(obj) && !isNaN(parseInt(currentKeyPath)))
            obj.splice(currentKeyPath, 1);
          else
            delete obj[currentKeyPath];
        } else
          obj[currentKeyPath] = value;
      else {
        var innerObj = obj[currentKeyPath];
        if (!innerObj)
          innerObj = obj[currentKeyPath] = {};
        setByKeyPath(innerObj, remainingKeyPath, value);
      }
    } else {
      if (value === void 0) {
        if (isArray(obj) && !isNaN(parseInt(keyPath)))
          obj.splice(keyPath, 1);
        else
          delete obj[keyPath];
      } else
        obj[keyPath] = value;
    }
  }
}
function delByKeyPath(obj, keyPath) {
  if (typeof keyPath === "string")
    setByKeyPath(obj, keyPath, void 0);
  else if ("length" in keyPath)
    [].map.call(keyPath, function(kp) {
      setByKeyPath(obj, kp, void 0);
    });
}
function shallowClone(obj) {
  var rv = {};
  for (var m in obj) {
    if (hasOwn(obj, m))
      rv[m] = obj[m];
  }
  return rv;
}
var concat = [].concat;
function flatten(a) {
  return concat.apply([], a);
}
var intrinsicTypeNames = "Boolean,String,Date,RegExp,Blob,File,FileList,ArrayBuffer,DataView,Uint8ClampedArray,ImageData,Map,Set".split(",").concat(flatten([8, 16, 32, 64].map(function(num) {
  return ["Int", "Uint", "Float"].map(function(t) {
    return t + num + "Array";
  });
}))).filter(function(t) {
  return _global[t];
});
var intrinsicTypes = intrinsicTypeNames.map(function(t) {
  return _global[t];
});
var intrinsicTypeNameSet = arrayToObject(intrinsicTypeNames, function(x) {
  return [x, true];
});
function deepClone(any) {
  if (!any || typeof any !== "object")
    return any;
  var rv;
  if (isArray(any)) {
    rv = [];
    for (var i = 0, l = any.length; i < l; ++i) {
      rv.push(deepClone(any[i]));
    }
  } else if (intrinsicTypes.indexOf(any.constructor) >= 0) {
    rv = any;
  } else {
    rv = any.constructor ? Object.create(any.constructor.prototype) : {};
    for (var prop in any) {
      if (hasOwn(any, prop)) {
        rv[prop] = deepClone(any[prop]);
      }
    }
  }
  return rv;
}
var toString = {}.toString;
function toStringTag(o) {
  return toString.call(o).slice(8, -1);
}
var getValueOf = function(val, type) {
  return type === "Array" ? "" + val.map(function(v) {
    return getValueOf(v, toStringTag(v));
  }) : type === "ArrayBuffer" ? "" + new Uint8Array(val) : type === "Date" ? val.getTime() : ArrayBuffer.isView(val) ? "" + new Uint8Array(val.buffer) : val;
};
function getObjectDiff(a, b, rv, prfx) {
  rv = rv || {};
  prfx = prfx || "";
  keys(a).forEach(function(prop) {
    if (!hasOwn(b, prop))
      rv[prfx + prop] = void 0;
    else {
      var ap = a[prop], bp = b[prop];
      if (typeof ap === "object" && typeof bp === "object" && ap && bp) {
        var apTypeName = toStringTag(ap);
        var bpTypeName = toStringTag(bp);
        if (apTypeName === bpTypeName) {
          if (intrinsicTypeNameSet[apTypeName]) {
            if (getValueOf(ap, apTypeName) !== getValueOf(bp, bpTypeName)) {
              rv[prfx + prop] = b[prop];
            }
          } else {
            getObjectDiff(ap, bp, rv, prfx + prop + ".");
          }
        } else {
          rv[prfx + prop] = b[prop];
        }
      } else if (ap !== bp)
        rv[prfx + prop] = b[prop];
    }
  });
  keys(b).forEach(function(prop) {
    if (!hasOwn(a, prop)) {
      rv[prfx + prop] = b[prop];
    }
  });
  return rv;
}
var iteratorSymbol = typeof Symbol !== "undefined" && Symbol.iterator;
var getIteratorOf = iteratorSymbol ? function(x) {
  var i;
  return x != null && (i = x[iteratorSymbol]) && i.apply(x);
} : function() {
  return null;
};
var NO_CHAR_ARRAY = {};
function getArrayOf(arrayLike) {
  var i, a, x, it;
  if (arguments.length === 1) {
    if (isArray(arrayLike))
      return arrayLike.slice();
    if (this === NO_CHAR_ARRAY && typeof arrayLike === "string")
      return [arrayLike];
    if (it = getIteratorOf(arrayLike)) {
      a = [];
      while (x = it.next(), !x.done)
        a.push(x.value);
      return a;
    }
    if (arrayLike == null)
      return [arrayLike];
    i = arrayLike.length;
    if (typeof i === "number") {
      a = new Array(i);
      while (i--)
        a[i] = arrayLike[i];
      return a;
    }
    return [arrayLike];
  }
  i = arguments.length;
  a = new Array(i);
  while (i--)
    a[i] = arguments[i];
  return a;
}
var isAsyncFunction = typeof Symbol !== "undefined" ? function(fn) {
  return fn[Symbol.toStringTag] === "AsyncFunction";
} : function() {
  return false;
};
var debug = typeof location !== "undefined" && /^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);
function setDebug(value, filter) {
  debug = value;
  libraryFilter = filter;
}
var libraryFilter = function() {
  return true;
};
var NEEDS_THROW_FOR_STACK = !new Error("").stack;
function getErrorWithStack() {
  if (NEEDS_THROW_FOR_STACK)
    try {
      throw new Error();
    } catch (e) {
      return e;
    }
  return new Error();
}
function prettyStack(exception, numIgnoredFrames) {
  var stack = exception.stack;
  if (!stack)
    return "";
  numIgnoredFrames = numIgnoredFrames || 0;
  if (stack.indexOf(exception.name) === 0)
    numIgnoredFrames += (exception.name + exception.message).split("\n").length;
  return stack.split("\n").slice(numIgnoredFrames).filter(libraryFilter).map(function(frame) {
    return "\n" + frame;
  }).join("");
}
var dexieErrorNames = [
  "Modify",
  "Bulk",
  "OpenFailed",
  "VersionChange",
  "Schema",
  "Upgrade",
  "InvalidTable",
  "MissingAPI",
  "NoSuchDatabase",
  "InvalidArgument",
  "SubTransaction",
  "Unsupported",
  "Internal",
  "DatabaseClosed",
  "PrematureCommit",
  "ForeignAwait"
];
var idbDomErrorNames = [
  "Unknown",
  "Constraint",
  "Data",
  "TransactionInactive",
  "ReadOnly",
  "Version",
  "NotFound",
  "InvalidState",
  "InvalidAccess",
  "Abort",
  "Timeout",
  "QuotaExceeded",
  "Syntax",
  "DataClone"
];
var errorList = dexieErrorNames.concat(idbDomErrorNames);
var defaultTexts = {
  VersionChanged: "Database version changed by other database connection",
  DatabaseClosed: "Database has been closed",
  Abort: "Transaction aborted",
  TransactionInactive: "Transaction has already completed or failed"
};
function DexieError(name, msg) {
  this._e = getErrorWithStack();
  this.name = name;
  this.message = msg;
}
derive(DexieError).from(Error).extend({
  stack: {
    get: function() {
      return this._stack || (this._stack = this.name + ": " + this.message + prettyStack(this._e, 2));
    }
  },
  toString: function() {
    return this.name + ": " + this.message;
  }
});
function getMultiErrorMessage(msg, failures) {
  return msg + ". Errors: " + Object.keys(failures).map(function(key) {
    return failures[key].toString();
  }).filter(function(v, i, s2) {
    return s2.indexOf(v) === i;
  }).join("\n");
}
function ModifyError(msg, failures, successCount, failedKeys) {
  this._e = getErrorWithStack();
  this.failures = failures;
  this.failedKeys = failedKeys;
  this.successCount = successCount;
  this.message = getMultiErrorMessage(msg, failures);
}
derive(ModifyError).from(DexieError);
function BulkError(msg, failures) {
  this._e = getErrorWithStack();
  this.name = "BulkError";
  this.failures = failures;
  this.message = getMultiErrorMessage(msg, failures);
}
derive(BulkError).from(DexieError);
var errnames = errorList.reduce(function(obj, name) {
  return obj[name] = name + "Error", obj;
}, {});
var BaseException = DexieError;
var exceptions = errorList.reduce(function(obj, name) {
  var fullName = name + "Error";
  function DexieError2(msgOrInner, inner) {
    this._e = getErrorWithStack();
    this.name = fullName;
    if (!msgOrInner) {
      this.message = defaultTexts[name] || fullName;
      this.inner = null;
    } else if (typeof msgOrInner === "string") {
      this.message = "" + msgOrInner + (!inner ? "" : "\n " + inner);
      this.inner = inner || null;
    } else if (typeof msgOrInner === "object") {
      this.message = msgOrInner.name + " " + msgOrInner.message;
      this.inner = msgOrInner;
    }
  }
  derive(DexieError2).from(BaseException);
  obj[name] = DexieError2;
  return obj;
}, {});
exceptions.Syntax = SyntaxError;
exceptions.Type = TypeError;
exceptions.Range = RangeError;
var exceptionMap = idbDomErrorNames.reduce(function(obj, name) {
  obj[name + "Error"] = exceptions[name];
  return obj;
}, {});
function mapError(domError, message) {
  if (!domError || domError instanceof DexieError || domError instanceof TypeError || domError instanceof SyntaxError || !domError.name || !exceptionMap[domError.name])
    return domError;
  var rv = new exceptionMap[domError.name](message || domError.message, domError);
  if ("stack" in domError) {
    setProp(rv, "stack", {get: function() {
      return this.inner.stack;
    }});
  }
  return rv;
}
var fullNameExceptions = errorList.reduce(function(obj, name) {
  if (["Syntax", "Type", "Range"].indexOf(name) === -1)
    obj[name + "Error"] = exceptions[name];
  return obj;
}, {});
fullNameExceptions.ModifyError = ModifyError;
fullNameExceptions.DexieError = DexieError;
fullNameExceptions.BulkError = BulkError;
function nop() {
}
function mirror(val) {
  return val;
}
function pureFunctionChain(f1, f2) {
  if (f1 == null || f1 === mirror)
    return f2;
  return function(val) {
    return f2(f1(val));
  };
}
function callBoth(on1, on2) {
  return function() {
    on1.apply(this, arguments);
    on2.apply(this, arguments);
  };
}
function hookCreatingChain(f1, f2) {
  if (f1 === nop)
    return f2;
  return function() {
    var res = f1.apply(this, arguments);
    if (res !== void 0)
      arguments[0] = res;
    var onsuccess = this.onsuccess, onerror = this.onerror;
    this.onsuccess = null;
    this.onerror = null;
    var res2 = f2.apply(this, arguments);
    if (onsuccess)
      this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
    if (onerror)
      this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
    return res2 !== void 0 ? res2 : res;
  };
}
function hookDeletingChain(f1, f2) {
  if (f1 === nop)
    return f2;
  return function() {
    f1.apply(this, arguments);
    var onsuccess = this.onsuccess, onerror = this.onerror;
    this.onsuccess = this.onerror = null;
    f2.apply(this, arguments);
    if (onsuccess)
      this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
    if (onerror)
      this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
  };
}
function hookUpdatingChain(f1, f2) {
  if (f1 === nop)
    return f2;
  return function(modifications) {
    var res = f1.apply(this, arguments);
    extend(modifications, res);
    var onsuccess = this.onsuccess, onerror = this.onerror;
    this.onsuccess = null;
    this.onerror = null;
    var res2 = f2.apply(this, arguments);
    if (onsuccess)
      this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
    if (onerror)
      this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
    return res === void 0 ? res2 === void 0 ? void 0 : res2 : extend(res, res2);
  };
}
function reverseStoppableEventChain(f1, f2) {
  if (f1 === nop)
    return f2;
  return function() {
    if (f2.apply(this, arguments) === false)
      return false;
    return f1.apply(this, arguments);
  };
}
function promisableChain(f1, f2) {
  if (f1 === nop)
    return f2;
  return function() {
    var res = f1.apply(this, arguments);
    if (res && typeof res.then === "function") {
      var thiz = this, i = arguments.length, args = new Array(i);
      while (i--)
        args[i] = arguments[i];
      return res.then(function() {
        return f2.apply(thiz, args);
      });
    }
    return f2.apply(this, arguments);
  };
}
var INTERNAL = {};
var LONG_STACKS_CLIP_LIMIT = 100;
var MAX_LONG_STACKS = 20;
var ZONE_ECHO_LIMIT = 100;
var _a = typeof Promise === "undefined" ? [] : function() {
  var globalP = Promise.resolve();
  if (typeof crypto === "undefined" || !crypto.subtle)
    return [globalP, globalP.__proto__, globalP];
  var nativeP = crypto.subtle.digest("SHA-512", new Uint8Array([0]));
  return [
    nativeP,
    nativeP.__proto__,
    globalP
  ];
}();
var resolvedNativePromise = _a[0];
var nativePromiseProto = _a[1];
var resolvedGlobalPromise = _a[2];
var nativePromiseThen = nativePromiseProto && nativePromiseProto.then;
var NativePromise = resolvedNativePromise && resolvedNativePromise.constructor;
var patchGlobalPromise = !!resolvedGlobalPromise;
var stack_being_generated = false;
var schedulePhysicalTick = resolvedGlobalPromise ? function() {
  resolvedGlobalPromise.then(physicalTick);
} : _global.setImmediate ? setImmediate.bind(null, physicalTick) : _global.MutationObserver ? function() {
  var hiddenDiv = document.createElement("div");
  new MutationObserver(function() {
    physicalTick();
    hiddenDiv = null;
  }).observe(hiddenDiv, {attributes: true});
  hiddenDiv.setAttribute("i", "1");
} : function() {
  setTimeout(physicalTick, 0);
};
var asap$1 = function(callback, args) {
  microtickQueue.push([callback, args]);
  if (needsNewPhysicalTick) {
    schedulePhysicalTick();
    needsNewPhysicalTick = false;
  }
};
var isOutsideMicroTick = true;
var needsNewPhysicalTick = true;
var unhandledErrors = [];
var rejectingErrors = [];
var currentFulfiller = null;
var rejectionMapper = mirror;
var globalPSD = {
  id: "global",
  global: true,
  ref: 0,
  unhandleds: [],
  onunhandled: globalError,
  pgp: false,
  env: {},
  finalize: function() {
    this.unhandleds.forEach(function(uh) {
      try {
        globalError(uh[0], uh[1]);
      } catch (e) {
      }
    });
  }
};
var PSD = globalPSD;
var microtickQueue = [];
var numScheduledCalls = 0;
var tickFinalizers = [];
function DexiePromise(fn) {
  if (typeof this !== "object")
    throw new TypeError("Promises must be constructed via new");
  this._listeners = [];
  this.onuncatched = nop;
  this._lib = false;
  var psd = this._PSD = PSD;
  if (debug) {
    this._stackHolder = getErrorWithStack();
    this._prev = null;
    this._numPrev = 0;
  }
  if (typeof fn !== "function") {
    if (fn !== INTERNAL)
      throw new TypeError("Not a function");
    this._state = arguments[1];
    this._value = arguments[2];
    if (this._state === false)
      handleRejection(this, this._value);
    return;
  }
  this._state = null;
  this._value = null;
  ++psd.ref;
  executePromiseTask(this, fn);
}
var thenProp = {
  get: function() {
    var psd = PSD, microTaskId = totalEchoes;
    function then(onFulfilled, onRejected) {
      var _this = this;
      var possibleAwait = !psd.global && (psd !== PSD || microTaskId !== totalEchoes);
      var cleanup = possibleAwait && !decrementExpectedAwaits();
      var rv = new DexiePromise(function(resolve2, reject) {
        propagateToListener(_this, new Listener(nativeAwaitCompatibleWrap(onFulfilled, psd, possibleAwait, cleanup), nativeAwaitCompatibleWrap(onRejected, psd, possibleAwait, cleanup), resolve2, reject, psd));
      });
      debug && linkToPreviousPromise(rv, this);
      return rv;
    }
    then.prototype = INTERNAL;
    return then;
  },
  set: function(value) {
    setProp(this, "then", value && value.prototype === INTERNAL ? thenProp : {
      get: function() {
        return value;
      },
      set: thenProp.set
    });
  }
};
props(DexiePromise.prototype, {
  then: thenProp,
  _then: function(onFulfilled, onRejected) {
    propagateToListener(this, new Listener(null, null, onFulfilled, onRejected, PSD));
  },
  catch: function(onRejected) {
    if (arguments.length === 1)
      return this.then(null, onRejected);
    var type = arguments[0], handler = arguments[1];
    return typeof type === "function" ? this.then(null, function(err) {
      return err instanceof type ? handler(err) : PromiseReject(err);
    }) : this.then(null, function(err) {
      return err && err.name === type ? handler(err) : PromiseReject(err);
    });
  },
  finally: function(onFinally) {
    return this.then(function(value) {
      onFinally();
      return value;
    }, function(err) {
      onFinally();
      return PromiseReject(err);
    });
  },
  stack: {
    get: function() {
      if (this._stack)
        return this._stack;
      try {
        stack_being_generated = true;
        var stacks = getStack(this, [], MAX_LONG_STACKS);
        var stack = stacks.join("\nFrom previous: ");
        if (this._state !== null)
          this._stack = stack;
        return stack;
      } finally {
        stack_being_generated = false;
      }
    }
  },
  timeout: function(ms, msg) {
    var _this = this;
    return ms < Infinity ? new DexiePromise(function(resolve2, reject) {
      var handle = setTimeout(function() {
        return reject(new exceptions.Timeout(msg));
      }, ms);
      _this.then(resolve2, reject).finally(clearTimeout.bind(null, handle));
    }) : this;
  }
});
if (typeof Symbol !== "undefined" && Symbol.toStringTag)
  setProp(DexiePromise.prototype, Symbol.toStringTag, "Dexie.Promise");
globalPSD.env = snapShot();
function Listener(onFulfilled, onRejected, resolve2, reject, zone) {
  this.onFulfilled = typeof onFulfilled === "function" ? onFulfilled : null;
  this.onRejected = typeof onRejected === "function" ? onRejected : null;
  this.resolve = resolve2;
  this.reject = reject;
  this.psd = zone;
}
props(DexiePromise, {
  all: function() {
    var values = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
    return new DexiePromise(function(resolve2, reject) {
      if (values.length === 0)
        resolve2([]);
      var remaining = values.length;
      values.forEach(function(a, i) {
        return DexiePromise.resolve(a).then(function(x) {
          values[i] = x;
          if (!--remaining)
            resolve2(values);
        }, reject);
      });
    });
  },
  resolve: function(value) {
    if (value instanceof DexiePromise)
      return value;
    if (value && typeof value.then === "function")
      return new DexiePromise(function(resolve2, reject) {
        value.then(resolve2, reject);
      });
    var rv = new DexiePromise(INTERNAL, true, value);
    linkToPreviousPromise(rv, currentFulfiller);
    return rv;
  },
  reject: PromiseReject,
  race: function() {
    var values = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
    return new DexiePromise(function(resolve2, reject) {
      values.map(function(value) {
        return DexiePromise.resolve(value).then(resolve2, reject);
      });
    });
  },
  PSD: {
    get: function() {
      return PSD;
    },
    set: function(value) {
      return PSD = value;
    }
  },
  totalEchoes: {get: function() {
    return totalEchoes;
  }},
  newPSD: newScope,
  usePSD,
  scheduler: {
    get: function() {
      return asap$1;
    },
    set: function(value) {
      asap$1 = value;
    }
  },
  rejectionMapper: {
    get: function() {
      return rejectionMapper;
    },
    set: function(value) {
      rejectionMapper = value;
    }
  },
  follow: function(fn, zoneProps) {
    return new DexiePromise(function(resolve2, reject) {
      return newScope(function(resolve3, reject2) {
        var psd = PSD;
        psd.unhandleds = [];
        psd.onunhandled = reject2;
        psd.finalize = callBoth(function() {
          var _this = this;
          run_at_end_of_this_or_next_physical_tick(function() {
            _this.unhandleds.length === 0 ? resolve3() : reject2(_this.unhandleds[0]);
          });
        }, psd.finalize);
        fn();
      }, zoneProps, resolve2, reject);
    });
  }
});
if (NativePromise) {
  if (NativePromise.allSettled)
    setProp(DexiePromise, "allSettled", function() {
      var possiblePromises = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
      return new DexiePromise(function(resolve2) {
        if (possiblePromises.length === 0)
          resolve2([]);
        var remaining = possiblePromises.length;
        var results = new Array(remaining);
        possiblePromises.forEach(function(p, i) {
          return DexiePromise.resolve(p).then(function(value) {
            return results[i] = {status: "fulfilled", value};
          }, function(reason) {
            return results[i] = {status: "rejected", reason};
          }).then(function() {
            return --remaining || resolve2(results);
          });
        });
      });
    });
  if (NativePromise.any && typeof AggregateError !== "undefined")
    setProp(DexiePromise, "any", function() {
      var possiblePromises = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
      return new DexiePromise(function(resolve2, reject) {
        if (possiblePromises.length === 0)
          reject(new AggregateError([]));
        var remaining = possiblePromises.length;
        var failures = new Array(remaining);
        possiblePromises.forEach(function(p, i) {
          return DexiePromise.resolve(p).then(function(value) {
            return resolve2(value);
          }, function(failure) {
            failures[i] = failure;
            if (!--remaining)
              reject(new AggregateError(failures));
          });
        });
      });
    });
}
function executePromiseTask(promise, fn) {
  try {
    fn(function(value) {
      if (promise._state !== null)
        return;
      if (value === promise)
        throw new TypeError("A promise cannot be resolved with itself.");
      var shouldExecuteTick = promise._lib && beginMicroTickScope();
      if (value && typeof value.then === "function") {
        executePromiseTask(promise, function(resolve2, reject) {
          value instanceof DexiePromise ? value._then(resolve2, reject) : value.then(resolve2, reject);
        });
      } else {
        promise._state = true;
        promise._value = value;
        propagateAllListeners(promise);
      }
      if (shouldExecuteTick)
        endMicroTickScope();
    }, handleRejection.bind(null, promise));
  } catch (ex) {
    handleRejection(promise, ex);
  }
}
function handleRejection(promise, reason) {
  rejectingErrors.push(reason);
  if (promise._state !== null)
    return;
  var shouldExecuteTick = promise._lib && beginMicroTickScope();
  reason = rejectionMapper(reason);
  promise._state = false;
  promise._value = reason;
  debug && reason !== null && typeof reason === "object" && !reason._promise && tryCatch(function() {
    var origProp = getPropertyDescriptor(reason, "stack");
    reason._promise = promise;
    setProp(reason, "stack", {
      get: function() {
        return stack_being_generated ? origProp && (origProp.get ? origProp.get.apply(reason) : origProp.value) : promise.stack;
      }
    });
  });
  addPossiblyUnhandledError(promise);
  propagateAllListeners(promise);
  if (shouldExecuteTick)
    endMicroTickScope();
}
function propagateAllListeners(promise) {
  var listeners = promise._listeners;
  promise._listeners = [];
  for (var i = 0, len = listeners.length; i < len; ++i) {
    propagateToListener(promise, listeners[i]);
  }
  var psd = promise._PSD;
  --psd.ref || psd.finalize();
  if (numScheduledCalls === 0) {
    ++numScheduledCalls;
    asap$1(function() {
      if (--numScheduledCalls === 0)
        finalizePhysicalTick();
    }, []);
  }
}
function propagateToListener(promise, listener) {
  if (promise._state === null) {
    promise._listeners.push(listener);
    return;
  }
  var cb = promise._state ? listener.onFulfilled : listener.onRejected;
  if (cb === null) {
    return (promise._state ? listener.resolve : listener.reject)(promise._value);
  }
  ++listener.psd.ref;
  ++numScheduledCalls;
  asap$1(callListener, [cb, promise, listener]);
}
function callListener(cb, promise, listener) {
  try {
    currentFulfiller = promise;
    var ret, value = promise._value;
    if (promise._state) {
      ret = cb(value);
    } else {
      if (rejectingErrors.length)
        rejectingErrors = [];
      ret = cb(value);
      if (rejectingErrors.indexOf(value) === -1)
        markErrorAsHandled(promise);
    }
    listener.resolve(ret);
  } catch (e) {
    listener.reject(e);
  } finally {
    currentFulfiller = null;
    if (--numScheduledCalls === 0)
      finalizePhysicalTick();
    --listener.psd.ref || listener.psd.finalize();
  }
}
function getStack(promise, stacks, limit) {
  if (stacks.length === limit)
    return stacks;
  var stack = "";
  if (promise._state === false) {
    var failure = promise._value, errorName, message;
    if (failure != null) {
      errorName = failure.name || "Error";
      message = failure.message || failure;
      stack = prettyStack(failure, 0);
    } else {
      errorName = failure;
      message = "";
    }
    stacks.push(errorName + (message ? ": " + message : "") + stack);
  }
  if (debug) {
    stack = prettyStack(promise._stackHolder, 2);
    if (stack && stacks.indexOf(stack) === -1)
      stacks.push(stack);
    if (promise._prev)
      getStack(promise._prev, stacks, limit);
  }
  return stacks;
}
function linkToPreviousPromise(promise, prev) {
  var numPrev = prev ? prev._numPrev + 1 : 0;
  if (numPrev < LONG_STACKS_CLIP_LIMIT) {
    promise._prev = prev;
    promise._numPrev = numPrev;
  }
}
function physicalTick() {
  beginMicroTickScope() && endMicroTickScope();
}
function beginMicroTickScope() {
  var wasRootExec = isOutsideMicroTick;
  isOutsideMicroTick = false;
  needsNewPhysicalTick = false;
  return wasRootExec;
}
function endMicroTickScope() {
  var callbacks, i, l;
  do {
    while (microtickQueue.length > 0) {
      callbacks = microtickQueue;
      microtickQueue = [];
      l = callbacks.length;
      for (i = 0; i < l; ++i) {
        var item = callbacks[i];
        item[0].apply(null, item[1]);
      }
    }
  } while (microtickQueue.length > 0);
  isOutsideMicroTick = true;
  needsNewPhysicalTick = true;
}
function finalizePhysicalTick() {
  var unhandledErrs = unhandledErrors;
  unhandledErrors = [];
  unhandledErrs.forEach(function(p) {
    p._PSD.onunhandled.call(null, p._value, p);
  });
  var finalizers = tickFinalizers.slice(0);
  var i = finalizers.length;
  while (i)
    finalizers[--i]();
}
function run_at_end_of_this_or_next_physical_tick(fn) {
  function finalizer() {
    fn();
    tickFinalizers.splice(tickFinalizers.indexOf(finalizer), 1);
  }
  tickFinalizers.push(finalizer);
  ++numScheduledCalls;
  asap$1(function() {
    if (--numScheduledCalls === 0)
      finalizePhysicalTick();
  }, []);
}
function addPossiblyUnhandledError(promise) {
  if (!unhandledErrors.some(function(p) {
    return p._value === promise._value;
  }))
    unhandledErrors.push(promise);
}
function markErrorAsHandled(promise) {
  var i = unhandledErrors.length;
  while (i)
    if (unhandledErrors[--i]._value === promise._value) {
      unhandledErrors.splice(i, 1);
      return;
    }
}
function PromiseReject(reason) {
  return new DexiePromise(INTERNAL, false, reason);
}
function wrap(fn, errorCatcher) {
  var psd = PSD;
  return function() {
    var wasRootExec = beginMicroTickScope(), outerScope = PSD;
    try {
      switchToZone(psd, true);
      return fn.apply(this, arguments);
    } catch (e) {
      errorCatcher && errorCatcher(e);
    } finally {
      switchToZone(outerScope, false);
      if (wasRootExec)
        endMicroTickScope();
    }
  };
}
var task = {awaits: 0, echoes: 0, id: 0};
var taskCounter = 0;
var zoneStack = [];
var zoneEchoes = 0;
var totalEchoes = 0;
var zone_id_counter = 0;
function newScope(fn, props$$1, a1, a2) {
  var parent = PSD, psd = Object.create(parent);
  psd.parent = parent;
  psd.ref = 0;
  psd.global = false;
  psd.id = ++zone_id_counter;
  var globalEnv = globalPSD.env;
  psd.env = patchGlobalPromise ? {
    Promise: DexiePromise,
    PromiseProp: {value: DexiePromise, configurable: true, writable: true},
    all: DexiePromise.all,
    race: DexiePromise.race,
    allSettled: DexiePromise.allSettled,
    any: DexiePromise.any,
    resolve: DexiePromise.resolve,
    reject: DexiePromise.reject,
    nthen: getPatchedPromiseThen(globalEnv.nthen, psd),
    gthen: getPatchedPromiseThen(globalEnv.gthen, psd)
  } : {};
  if (props$$1)
    extend(psd, props$$1);
  ++parent.ref;
  psd.finalize = function() {
    --this.parent.ref || this.parent.finalize();
  };
  var rv = usePSD(psd, fn, a1, a2);
  if (psd.ref === 0)
    psd.finalize();
  return rv;
}
function incrementExpectedAwaits() {
  if (!task.id)
    task.id = ++taskCounter;
  ++task.awaits;
  task.echoes += ZONE_ECHO_LIMIT;
  return task.id;
}
function decrementExpectedAwaits() {
  if (!task.awaits)
    return false;
  if (--task.awaits === 0)
    task.id = 0;
  task.echoes = task.awaits * ZONE_ECHO_LIMIT;
  return true;
}
if (("" + nativePromiseThen).indexOf("[native code]") === -1) {
  incrementExpectedAwaits = decrementExpectedAwaits = nop;
}
function onPossibleParallellAsync(possiblePromise) {
  if (task.echoes && possiblePromise && possiblePromise.constructor === NativePromise) {
    incrementExpectedAwaits();
    return possiblePromise.then(function(x) {
      decrementExpectedAwaits();
      return x;
    }, function(e) {
      decrementExpectedAwaits();
      return rejection(e);
    });
  }
  return possiblePromise;
}
function zoneEnterEcho(targetZone) {
  ++totalEchoes;
  if (!task.echoes || --task.echoes === 0) {
    task.echoes = task.id = 0;
  }
  zoneStack.push(PSD);
  switchToZone(targetZone, true);
}
function zoneLeaveEcho() {
  var zone = zoneStack[zoneStack.length - 1];
  zoneStack.pop();
  switchToZone(zone, false);
}
function switchToZone(targetZone, bEnteringZone) {
  var currentZone = PSD;
  if (bEnteringZone ? task.echoes && (!zoneEchoes++ || targetZone !== PSD) : zoneEchoes && (!--zoneEchoes || targetZone !== PSD)) {
    enqueueNativeMicroTask(bEnteringZone ? zoneEnterEcho.bind(null, targetZone) : zoneLeaveEcho);
  }
  if (targetZone === PSD)
    return;
  PSD = targetZone;
  if (currentZone === globalPSD)
    globalPSD.env = snapShot();
  if (patchGlobalPromise) {
    var GlobalPromise_1 = globalPSD.env.Promise;
    var targetEnv = targetZone.env;
    nativePromiseProto.then = targetEnv.nthen;
    GlobalPromise_1.prototype.then = targetEnv.gthen;
    if (currentZone.global || targetZone.global) {
      Object.defineProperty(_global, "Promise", targetEnv.PromiseProp);
      GlobalPromise_1.all = targetEnv.all;
      GlobalPromise_1.race = targetEnv.race;
      GlobalPromise_1.resolve = targetEnv.resolve;
      GlobalPromise_1.reject = targetEnv.reject;
      if (targetEnv.allSettled)
        GlobalPromise_1.allSettled = targetEnv.allSettled;
      if (targetEnv.any)
        GlobalPromise_1.any = targetEnv.any;
    }
  }
}
function snapShot() {
  var GlobalPromise = _global.Promise;
  return patchGlobalPromise ? {
    Promise: GlobalPromise,
    PromiseProp: Object.getOwnPropertyDescriptor(_global, "Promise"),
    all: GlobalPromise.all,
    race: GlobalPromise.race,
    allSettled: GlobalPromise.allSettled,
    any: GlobalPromise.any,
    resolve: GlobalPromise.resolve,
    reject: GlobalPromise.reject,
    nthen: nativePromiseProto.then,
    gthen: GlobalPromise.prototype.then
  } : {};
}
function usePSD(psd, fn, a1, a2, a3) {
  var outerScope = PSD;
  try {
    switchToZone(psd, true);
    return fn(a1, a2, a3);
  } finally {
    switchToZone(outerScope, false);
  }
}
function enqueueNativeMicroTask(job) {
  nativePromiseThen.call(resolvedNativePromise, job);
}
function nativeAwaitCompatibleWrap(fn, zone, possibleAwait, cleanup) {
  return typeof fn !== "function" ? fn : function() {
    var outerZone = PSD;
    if (possibleAwait)
      incrementExpectedAwaits();
    switchToZone(zone, true);
    try {
      return fn.apply(this, arguments);
    } finally {
      switchToZone(outerZone, false);
      if (cleanup)
        enqueueNativeMicroTask(decrementExpectedAwaits);
    }
  };
}
function getPatchedPromiseThen(origThen, zone) {
  return function(onResolved, onRejected) {
    return origThen.call(this, nativeAwaitCompatibleWrap(onResolved, zone), nativeAwaitCompatibleWrap(onRejected, zone));
  };
}
var UNHANDLEDREJECTION = "unhandledrejection";
function globalError(err, promise) {
  var rv;
  try {
    rv = promise.onuncatched(err);
  } catch (e) {
  }
  if (rv !== false)
    try {
      var event, eventData = {promise, reason: err};
      if (_global.document && document.createEvent) {
        event = document.createEvent("Event");
        event.initEvent(UNHANDLEDREJECTION, true, true);
        extend(event, eventData);
      } else if (_global.CustomEvent) {
        event = new CustomEvent(UNHANDLEDREJECTION, {detail: eventData});
        extend(event, eventData);
      }
      if (event && _global.dispatchEvent) {
        dispatchEvent(event);
        if (!_global.PromiseRejectionEvent && _global.onunhandledrejection)
          try {
            _global.onunhandledrejection(event);
          } catch (_) {
          }
      }
      if (debug && event && !event.defaultPrevented) {
        console.warn("Unhandled rejection: " + (err.stack || err));
      }
    } catch (e) {
    }
}
var rejection = DexiePromise.reject;
function tempTransaction(db2, mode, storeNames, fn) {
  if (!db2._state.openComplete && !PSD.letThrough) {
    if (!db2._state.isBeingOpened) {
      if (!db2._options.autoOpen)
        return rejection(new exceptions.DatabaseClosed());
      db2.open().catch(nop);
    }
    return db2._state.dbReadyPromise.then(function() {
      return tempTransaction(db2, mode, storeNames, fn);
    });
  } else {
    var trans = db2._createTransaction(mode, storeNames, db2._dbSchema);
    try {
      trans.create();
    } catch (ex) {
      return rejection(ex);
    }
    return trans._promise(mode, function(resolve2, reject) {
      return newScope(function() {
        PSD.trans = trans;
        return fn(resolve2, reject, trans);
      });
    }).then(function(result) {
      return trans._completion.then(function() {
        return result;
      });
    });
  }
}
var DEXIE_VERSION = "3.0.3";
var maxString = String.fromCharCode(65535);
var minKey = -Infinity;
var INVALID_KEY_ARGUMENT = "Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.";
var STRING_EXPECTED = "String expected.";
var connections = [];
var isIEOrEdge = typeof navigator !== "undefined" && /(MSIE|Trident|Edge)/.test(navigator.userAgent);
var hasIEDeleteObjectStoreBug = isIEOrEdge;
var hangsOnDeleteLargeKeyRange = isIEOrEdge;
var dexieStackFrameFilter = function(frame) {
  return !/(dexie\.js|dexie\.min\.js)/.test(frame);
};
var DBNAMES_DB = "__dbnames";
var READONLY = "readonly";
var READWRITE = "readwrite";
function combine(filter1, filter2) {
  return filter1 ? filter2 ? function() {
    return filter1.apply(this, arguments) && filter2.apply(this, arguments);
  } : filter1 : filter2;
}
var AnyRange = {
  type: 3,
  lower: -Infinity,
  lowerOpen: false,
  upper: [[]],
  upperOpen: false
};
function workaroundForUndefinedPrimKey(keyPath) {
  return function(obj) {
    if (getByKeyPath(obj, keyPath) === void 0) {
      obj = deepClone(obj);
      delByKeyPath(obj, keyPath);
    }
    return obj;
  };
}
var Table = function() {
  function Table2() {
  }
  Table2.prototype._trans = function(mode, fn, writeLocked) {
    var trans = this._tx || PSD.trans;
    var tableName = this.name;
    function checkTableInTransaction(resolve2, reject, trans2) {
      if (!trans2.schema[tableName])
        throw new exceptions.NotFound("Table " + tableName + " not part of transaction");
      return fn(trans2.idbtrans, trans2);
    }
    var wasRootExec = beginMicroTickScope();
    try {
      return trans && trans.db === this.db ? trans === PSD.trans ? trans._promise(mode, checkTableInTransaction, writeLocked) : newScope(function() {
        return trans._promise(mode, checkTableInTransaction, writeLocked);
      }, {trans, transless: PSD.transless || PSD}) : tempTransaction(this.db, mode, [this.name], checkTableInTransaction);
    } finally {
      if (wasRootExec)
        endMicroTickScope();
    }
  };
  Table2.prototype.get = function(keyOrCrit, cb) {
    var _this = this;
    if (keyOrCrit && keyOrCrit.constructor === Object)
      return this.where(keyOrCrit).first(cb);
    return this._trans("readonly", function(trans) {
      return _this.core.get({trans, key: keyOrCrit}).then(function(res) {
        return _this.hook.reading.fire(res);
      });
    }).then(cb);
  };
  Table2.prototype.where = function(indexOrCrit) {
    if (typeof indexOrCrit === "string")
      return new this.db.WhereClause(this, indexOrCrit);
    if (isArray(indexOrCrit))
      return new this.db.WhereClause(this, "[" + indexOrCrit.join("+") + "]");
    var keyPaths = keys(indexOrCrit);
    if (keyPaths.length === 1)
      return this.where(keyPaths[0]).equals(indexOrCrit[keyPaths[0]]);
    var compoundIndex = this.schema.indexes.concat(this.schema.primKey).filter(function(ix) {
      return ix.compound && keyPaths.every(function(keyPath) {
        return ix.keyPath.indexOf(keyPath) >= 0;
      }) && ix.keyPath.every(function(keyPath) {
        return keyPaths.indexOf(keyPath) >= 0;
      });
    })[0];
    if (compoundIndex && this.db._maxKey !== maxString)
      return this.where(compoundIndex.name).equals(compoundIndex.keyPath.map(function(kp) {
        return indexOrCrit[kp];
      }));
    if (!compoundIndex && debug)
      console.warn("The query " + JSON.stringify(indexOrCrit) + " on " + this.name + " would benefit of a " + ("compound index [" + keyPaths.join("+") + "]"));
    var idxByName = this.schema.idxByName;
    var idb = this.db._deps.indexedDB;
    function equals(a, b) {
      try {
        return idb.cmp(a, b) === 0;
      } catch (e) {
        return false;
      }
    }
    var _a2 = keyPaths.reduce(function(_a3, keyPath) {
      var prevIndex = _a3[0], prevFilterFn = _a3[1];
      var index2 = idxByName[keyPath];
      var value = indexOrCrit[keyPath];
      return [
        prevIndex || index2,
        prevIndex || !index2 ? combine(prevFilterFn, index2 && index2.multi ? function(x) {
          var prop = getByKeyPath(x, keyPath);
          return isArray(prop) && prop.some(function(item) {
            return equals(value, item);
          });
        } : function(x) {
          return equals(value, getByKeyPath(x, keyPath));
        }) : prevFilterFn
      ];
    }, [null, null]), idx = _a2[0], filterFunction = _a2[1];
    return idx ? this.where(idx.name).equals(indexOrCrit[idx.keyPath]).filter(filterFunction) : compoundIndex ? this.filter(filterFunction) : this.where(keyPaths).equals("");
  };
  Table2.prototype.filter = function(filterFunction) {
    return this.toCollection().and(filterFunction);
  };
  Table2.prototype.count = function(thenShortcut) {
    return this.toCollection().count(thenShortcut);
  };
  Table2.prototype.offset = function(offset) {
    return this.toCollection().offset(offset);
  };
  Table2.prototype.limit = function(numRows) {
    return this.toCollection().limit(numRows);
  };
  Table2.prototype.each = function(callback) {
    return this.toCollection().each(callback);
  };
  Table2.prototype.toArray = function(thenShortcut) {
    return this.toCollection().toArray(thenShortcut);
  };
  Table2.prototype.toCollection = function() {
    return new this.db.Collection(new this.db.WhereClause(this));
  };
  Table2.prototype.orderBy = function(index2) {
    return new this.db.Collection(new this.db.WhereClause(this, isArray(index2) ? "[" + index2.join("+") + "]" : index2));
  };
  Table2.prototype.reverse = function() {
    return this.toCollection().reverse();
  };
  Table2.prototype.mapToClass = function(constructor) {
    this.schema.mappedClass = constructor;
    var readHook = function(obj) {
      if (!obj)
        return obj;
      var res = Object.create(constructor.prototype);
      for (var m in obj)
        if (hasOwn(obj, m))
          try {
            res[m] = obj[m];
          } catch (_) {
          }
      return res;
    };
    if (this.schema.readHook) {
      this.hook.reading.unsubscribe(this.schema.readHook);
    }
    this.schema.readHook = readHook;
    this.hook("reading", readHook);
    return constructor;
  };
  Table2.prototype.defineClass = function() {
    function Class(content) {
      extend(this, content);
    }
    return this.mapToClass(Class);
  };
  Table2.prototype.add = function(obj, key) {
    var _this = this;
    var _a2 = this.schema.primKey, auto = _a2.auto, keyPath = _a2.keyPath;
    var objToAdd = obj;
    if (keyPath && auto) {
      objToAdd = workaroundForUndefinedPrimKey(keyPath)(obj);
    }
    return this._trans("readwrite", function(trans) {
      return _this.core.mutate({trans, type: "add", keys: key != null ? [key] : null, values: [objToAdd]});
    }).then(function(res) {
      return res.numFailures ? DexiePromise.reject(res.failures[0]) : res.lastResult;
    }).then(function(lastResult) {
      if (keyPath) {
        try {
          setByKeyPath(obj, keyPath, lastResult);
        } catch (_) {
        }
      }
      return lastResult;
    });
  };
  Table2.prototype.update = function(keyOrObject, modifications) {
    if (typeof modifications !== "object" || isArray(modifications))
      throw new exceptions.InvalidArgument("Modifications must be an object.");
    if (typeof keyOrObject === "object" && !isArray(keyOrObject)) {
      keys(modifications).forEach(function(keyPath) {
        setByKeyPath(keyOrObject, keyPath, modifications[keyPath]);
      });
      var key = getByKeyPath(keyOrObject, this.schema.primKey.keyPath);
      if (key === void 0)
        return rejection(new exceptions.InvalidArgument("Given object does not contain its primary key"));
      return this.where(":id").equals(key).modify(modifications);
    } else {
      return this.where(":id").equals(keyOrObject).modify(modifications);
    }
  };
  Table2.prototype.put = function(obj, key) {
    var _this = this;
    var _a2 = this.schema.primKey, auto = _a2.auto, keyPath = _a2.keyPath;
    var objToAdd = obj;
    if (keyPath && auto) {
      objToAdd = workaroundForUndefinedPrimKey(keyPath)(obj);
    }
    return this._trans("readwrite", function(trans) {
      return _this.core.mutate({trans, type: "put", values: [objToAdd], keys: key != null ? [key] : null});
    }).then(function(res) {
      return res.numFailures ? DexiePromise.reject(res.failures[0]) : res.lastResult;
    }).then(function(lastResult) {
      if (keyPath) {
        try {
          setByKeyPath(obj, keyPath, lastResult);
        } catch (_) {
        }
      }
      return lastResult;
    });
  };
  Table2.prototype.delete = function(key) {
    var _this = this;
    return this._trans("readwrite", function(trans) {
      return _this.core.mutate({trans, type: "delete", keys: [key]});
    }).then(function(res) {
      return res.numFailures ? DexiePromise.reject(res.failures[0]) : void 0;
    });
  };
  Table2.prototype.clear = function() {
    var _this = this;
    return this._trans("readwrite", function(trans) {
      return _this.core.mutate({trans, type: "deleteRange", range: AnyRange});
    }).then(function(res) {
      return res.numFailures ? DexiePromise.reject(res.failures[0]) : void 0;
    });
  };
  Table2.prototype.bulkGet = function(keys$$1) {
    var _this = this;
    return this._trans("readonly", function(trans) {
      return _this.core.getMany({
        keys: keys$$1,
        trans
      }).then(function(result) {
        return result.map(function(res) {
          return _this.hook.reading.fire(res);
        });
      });
    });
  };
  Table2.prototype.bulkAdd = function(objects, keysOrOptions, options) {
    var _this = this;
    var keys$$1 = Array.isArray(keysOrOptions) ? keysOrOptions : void 0;
    options = options || (keys$$1 ? void 0 : keysOrOptions);
    var wantResults = options ? options.allKeys : void 0;
    return this._trans("readwrite", function(trans) {
      var _a2 = _this.schema.primKey, auto = _a2.auto, keyPath = _a2.keyPath;
      if (keyPath && keys$$1)
        throw new exceptions.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");
      if (keys$$1 && keys$$1.length !== objects.length)
        throw new exceptions.InvalidArgument("Arguments objects and keys must have the same length");
      var numObjects = objects.length;
      var objectsToAdd = keyPath && auto ? objects.map(workaroundForUndefinedPrimKey(keyPath)) : objects;
      return _this.core.mutate({trans, type: "add", keys: keys$$1, values: objectsToAdd, wantResults}).then(function(_a3) {
        var numFailures = _a3.numFailures, results = _a3.results, lastResult = _a3.lastResult, failures = _a3.failures;
        var result = wantResults ? results : lastResult;
        if (numFailures === 0)
          return result;
        throw new BulkError(_this.name + ".bulkAdd(): " + numFailures + " of " + numObjects + " operations failed", Object.keys(failures).map(function(pos) {
          return failures[pos];
        }));
      });
    });
  };
  Table2.prototype.bulkPut = function(objects, keysOrOptions, options) {
    var _this = this;
    var keys$$1 = Array.isArray(keysOrOptions) ? keysOrOptions : void 0;
    options = options || (keys$$1 ? void 0 : keysOrOptions);
    var wantResults = options ? options.allKeys : void 0;
    return this._trans("readwrite", function(trans) {
      var _a2 = _this.schema.primKey, auto = _a2.auto, keyPath = _a2.keyPath;
      if (keyPath && keys$$1)
        throw new exceptions.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");
      if (keys$$1 && keys$$1.length !== objects.length)
        throw new exceptions.InvalidArgument("Arguments objects and keys must have the same length");
      var numObjects = objects.length;
      var objectsToPut = keyPath && auto ? objects.map(workaroundForUndefinedPrimKey(keyPath)) : objects;
      return _this.core.mutate({trans, type: "put", keys: keys$$1, values: objectsToPut, wantResults}).then(function(_a3) {
        var numFailures = _a3.numFailures, results = _a3.results, lastResult = _a3.lastResult, failures = _a3.failures;
        var result = wantResults ? results : lastResult;
        if (numFailures === 0)
          return result;
        throw new BulkError(_this.name + ".bulkPut(): " + numFailures + " of " + numObjects + " operations failed", Object.keys(failures).map(function(pos) {
          return failures[pos];
        }));
      });
    });
  };
  Table2.prototype.bulkDelete = function(keys$$1) {
    var _this = this;
    var numKeys = keys$$1.length;
    return this._trans("readwrite", function(trans) {
      return _this.core.mutate({trans, type: "delete", keys: keys$$1});
    }).then(function(_a2) {
      var numFailures = _a2.numFailures, lastResult = _a2.lastResult, failures = _a2.failures;
      if (numFailures === 0)
        return lastResult;
      throw new BulkError(_this.name + ".bulkDelete(): " + numFailures + " of " + numKeys + " operations failed", failures);
    });
  };
  return Table2;
}();
function Events(ctx) {
  var evs = {};
  var rv = function(eventName, subscriber) {
    if (subscriber) {
      var i2 = arguments.length, args = new Array(i2 - 1);
      while (--i2)
        args[i2 - 1] = arguments[i2];
      evs[eventName].subscribe.apply(null, args);
      return ctx;
    } else if (typeof eventName === "string") {
      return evs[eventName];
    }
  };
  rv.addEventType = add;
  for (var i = 1, l = arguments.length; i < l; ++i) {
    add(arguments[i]);
  }
  return rv;
  function add(eventName, chainFunction, defaultFunction) {
    if (typeof eventName === "object")
      return addConfiguredEvents(eventName);
    if (!chainFunction)
      chainFunction = reverseStoppableEventChain;
    if (!defaultFunction)
      defaultFunction = nop;
    var context = {
      subscribers: [],
      fire: defaultFunction,
      subscribe: function(cb) {
        if (context.subscribers.indexOf(cb) === -1) {
          context.subscribers.push(cb);
          context.fire = chainFunction(context.fire, cb);
        }
      },
      unsubscribe: function(cb) {
        context.subscribers = context.subscribers.filter(function(fn) {
          return fn !== cb;
        });
        context.fire = context.subscribers.reduce(chainFunction, defaultFunction);
      }
    };
    evs[eventName] = rv[eventName] = context;
    return context;
  }
  function addConfiguredEvents(cfg) {
    keys(cfg).forEach(function(eventName) {
      var args = cfg[eventName];
      if (isArray(args)) {
        add(eventName, cfg[eventName][0], cfg[eventName][1]);
      } else if (args === "asap") {
        var context = add(eventName, mirror, function fire() {
          var i2 = arguments.length, args2 = new Array(i2);
          while (i2--)
            args2[i2] = arguments[i2];
          context.subscribers.forEach(function(fn) {
            asap(function fireEvent() {
              fn.apply(null, args2);
            });
          });
        });
      } else
        throw new exceptions.InvalidArgument("Invalid event config");
    });
  }
}
function makeClassConstructor(prototype, constructor) {
  derive(constructor).from({prototype});
  return constructor;
}
function createTableConstructor(db2) {
  return makeClassConstructor(Table.prototype, function Table$$1(name, tableSchema, trans) {
    this.db = db2;
    this._tx = trans;
    this.name = name;
    this.schema = tableSchema;
    this.hook = db2._allTables[name] ? db2._allTables[name].hook : Events(null, {
      creating: [hookCreatingChain, nop],
      reading: [pureFunctionChain, mirror],
      updating: [hookUpdatingChain, nop],
      deleting: [hookDeletingChain, nop]
    });
  });
}
function isPlainKeyRange(ctx, ignoreLimitFilter) {
  return !(ctx.filter || ctx.algorithm || ctx.or) && (ignoreLimitFilter ? ctx.justLimit : !ctx.replayFilter);
}
function addFilter(ctx, fn) {
  ctx.filter = combine(ctx.filter, fn);
}
function addReplayFilter(ctx, factory, isLimitFilter) {
  var curr = ctx.replayFilter;
  ctx.replayFilter = curr ? function() {
    return combine(curr(), factory());
  } : factory;
  ctx.justLimit = isLimitFilter && !curr;
}
function addMatchFilter(ctx, fn) {
  ctx.isMatch = combine(ctx.isMatch, fn);
}
function getIndexOrStore(ctx, coreSchema) {
  if (ctx.isPrimKey)
    return coreSchema.primaryKey;
  var index2 = coreSchema.getIndexByKeyPath(ctx.index);
  if (!index2)
    throw new exceptions.Schema("KeyPath " + ctx.index + " on object store " + coreSchema.name + " is not indexed");
  return index2;
}
function openCursor(ctx, coreTable, trans) {
  var index2 = getIndexOrStore(ctx, coreTable.schema);
  return coreTable.openCursor({
    trans,
    values: !ctx.keysOnly,
    reverse: ctx.dir === "prev",
    unique: !!ctx.unique,
    query: {
      index: index2,
      range: ctx.range
    }
  });
}
function iter(ctx, fn, coreTrans, coreTable) {
  var filter = ctx.replayFilter ? combine(ctx.filter, ctx.replayFilter()) : ctx.filter;
  if (!ctx.or) {
    return iterate(openCursor(ctx, coreTable, coreTrans), combine(ctx.algorithm, filter), fn, !ctx.keysOnly && ctx.valueMapper);
  } else {
    var set_1 = {};
    var union = function(item, cursor, advance) {
      if (!filter || filter(cursor, advance, function(result) {
        return cursor.stop(result);
      }, function(err) {
        return cursor.fail(err);
      })) {
        var primaryKey = cursor.primaryKey;
        var key = "" + primaryKey;
        if (key === "[object ArrayBuffer]")
          key = "" + new Uint8Array(primaryKey);
        if (!hasOwn(set_1, key)) {
          set_1[key] = true;
          fn(item, cursor, advance);
        }
      }
    };
    return Promise.all([
      ctx.or._iterate(union, coreTrans),
      iterate(openCursor(ctx, coreTable, coreTrans), ctx.algorithm, union, !ctx.keysOnly && ctx.valueMapper)
    ]);
  }
}
function iterate(cursorPromise, filter, fn, valueMapper) {
  var mappedFn = valueMapper ? function(x, c, a) {
    return fn(valueMapper(x), c, a);
  } : fn;
  var wrappedFn = wrap(mappedFn);
  return cursorPromise.then(function(cursor) {
    if (cursor) {
      return cursor.start(function() {
        var c = function() {
          return cursor.continue();
        };
        if (!filter || filter(cursor, function(advancer) {
          return c = advancer;
        }, function(val) {
          cursor.stop(val);
          c = nop;
        }, function(e) {
          cursor.fail(e);
          c = nop;
        }))
          wrappedFn(cursor.value, cursor, function(advancer) {
            return c = advancer;
          });
        c();
      });
    }
  });
}
var Collection = function() {
  function Collection2() {
  }
  Collection2.prototype._read = function(fn, cb) {
    var ctx = this._ctx;
    return ctx.error ? ctx.table._trans(null, rejection.bind(null, ctx.error)) : ctx.table._trans("readonly", fn).then(cb);
  };
  Collection2.prototype._write = function(fn) {
    var ctx = this._ctx;
    return ctx.error ? ctx.table._trans(null, rejection.bind(null, ctx.error)) : ctx.table._trans("readwrite", fn, "locked");
  };
  Collection2.prototype._addAlgorithm = function(fn) {
    var ctx = this._ctx;
    ctx.algorithm = combine(ctx.algorithm, fn);
  };
  Collection2.prototype._iterate = function(fn, coreTrans) {
    return iter(this._ctx, fn, coreTrans, this._ctx.table.core);
  };
  Collection2.prototype.clone = function(props$$1) {
    var rv = Object.create(this.constructor.prototype), ctx = Object.create(this._ctx);
    if (props$$1)
      extend(ctx, props$$1);
    rv._ctx = ctx;
    return rv;
  };
  Collection2.prototype.raw = function() {
    this._ctx.valueMapper = null;
    return this;
  };
  Collection2.prototype.each = function(fn) {
    var ctx = this._ctx;
    return this._read(function(trans) {
      return iter(ctx, fn, trans, ctx.table.core);
    });
  };
  Collection2.prototype.count = function(cb) {
    var _this = this;
    return this._read(function(trans) {
      var ctx = _this._ctx;
      var coreTable = ctx.table.core;
      if (isPlainKeyRange(ctx, true)) {
        return coreTable.count({
          trans,
          query: {
            index: getIndexOrStore(ctx, coreTable.schema),
            range: ctx.range
          }
        }).then(function(count2) {
          return Math.min(count2, ctx.limit);
        });
      } else {
        var count = 0;
        return iter(ctx, function() {
          ++count;
          return false;
        }, trans, coreTable).then(function() {
          return count;
        });
      }
    }).then(cb);
  };
  Collection2.prototype.sortBy = function(keyPath, cb) {
    var parts = keyPath.split(".").reverse(), lastPart = parts[0], lastIndex = parts.length - 1;
    function getval(obj, i) {
      if (i)
        return getval(obj[parts[i]], i - 1);
      return obj[lastPart];
    }
    var order = this._ctx.dir === "next" ? 1 : -1;
    function sorter(a, b) {
      var aVal = getval(a, lastIndex), bVal = getval(b, lastIndex);
      return aVal < bVal ? -order : aVal > bVal ? order : 0;
    }
    return this.toArray(function(a) {
      return a.sort(sorter);
    }).then(cb);
  };
  Collection2.prototype.toArray = function(cb) {
    var _this = this;
    return this._read(function(trans) {
      var ctx = _this._ctx;
      if (ctx.dir === "next" && isPlainKeyRange(ctx, true) && ctx.limit > 0) {
        var valueMapper_1 = ctx.valueMapper;
        var index2 = getIndexOrStore(ctx, ctx.table.core.schema);
        return ctx.table.core.query({
          trans,
          limit: ctx.limit,
          values: true,
          query: {
            index: index2,
            range: ctx.range
          }
        }).then(function(_a2) {
          var result = _a2.result;
          return valueMapper_1 ? result.map(valueMapper_1) : result;
        });
      } else {
        var a_1 = [];
        return iter(ctx, function(item) {
          return a_1.push(item);
        }, trans, ctx.table.core).then(function() {
          return a_1;
        });
      }
    }, cb);
  };
  Collection2.prototype.offset = function(offset) {
    var ctx = this._ctx;
    if (offset <= 0)
      return this;
    ctx.offset += offset;
    if (isPlainKeyRange(ctx)) {
      addReplayFilter(ctx, function() {
        var offsetLeft = offset;
        return function(cursor, advance) {
          if (offsetLeft === 0)
            return true;
          if (offsetLeft === 1) {
            --offsetLeft;
            return false;
          }
          advance(function() {
            cursor.advance(offsetLeft);
            offsetLeft = 0;
          });
          return false;
        };
      });
    } else {
      addReplayFilter(ctx, function() {
        var offsetLeft = offset;
        return function() {
          return --offsetLeft < 0;
        };
      });
    }
    return this;
  };
  Collection2.prototype.limit = function(numRows) {
    this._ctx.limit = Math.min(this._ctx.limit, numRows);
    addReplayFilter(this._ctx, function() {
      var rowsLeft = numRows;
      return function(cursor, advance, resolve2) {
        if (--rowsLeft <= 0)
          advance(resolve2);
        return rowsLeft >= 0;
      };
    }, true);
    return this;
  };
  Collection2.prototype.until = function(filterFunction, bIncludeStopEntry) {
    addFilter(this._ctx, function(cursor, advance, resolve2) {
      if (filterFunction(cursor.value)) {
        advance(resolve2);
        return bIncludeStopEntry;
      } else {
        return true;
      }
    });
    return this;
  };
  Collection2.prototype.first = function(cb) {
    return this.limit(1).toArray(function(a) {
      return a[0];
    }).then(cb);
  };
  Collection2.prototype.last = function(cb) {
    return this.reverse().first(cb);
  };
  Collection2.prototype.filter = function(filterFunction) {
    addFilter(this._ctx, function(cursor) {
      return filterFunction(cursor.value);
    });
    addMatchFilter(this._ctx, filterFunction);
    return this;
  };
  Collection2.prototype.and = function(filter) {
    return this.filter(filter);
  };
  Collection2.prototype.or = function(indexName) {
    return new this.db.WhereClause(this._ctx.table, indexName, this);
  };
  Collection2.prototype.reverse = function() {
    this._ctx.dir = this._ctx.dir === "prev" ? "next" : "prev";
    if (this._ondirectionchange)
      this._ondirectionchange(this._ctx.dir);
    return this;
  };
  Collection2.prototype.desc = function() {
    return this.reverse();
  };
  Collection2.prototype.eachKey = function(cb) {
    var ctx = this._ctx;
    ctx.keysOnly = !ctx.isMatch;
    return this.each(function(val, cursor) {
      cb(cursor.key, cursor);
    });
  };
  Collection2.prototype.eachUniqueKey = function(cb) {
    this._ctx.unique = "unique";
    return this.eachKey(cb);
  };
  Collection2.prototype.eachPrimaryKey = function(cb) {
    var ctx = this._ctx;
    ctx.keysOnly = !ctx.isMatch;
    return this.each(function(val, cursor) {
      cb(cursor.primaryKey, cursor);
    });
  };
  Collection2.prototype.keys = function(cb) {
    var ctx = this._ctx;
    ctx.keysOnly = !ctx.isMatch;
    var a = [];
    return this.each(function(item, cursor) {
      a.push(cursor.key);
    }).then(function() {
      return a;
    }).then(cb);
  };
  Collection2.prototype.primaryKeys = function(cb) {
    var ctx = this._ctx;
    if (ctx.dir === "next" && isPlainKeyRange(ctx, true) && ctx.limit > 0) {
      return this._read(function(trans) {
        var index2 = getIndexOrStore(ctx, ctx.table.core.schema);
        return ctx.table.core.query({
          trans,
          values: false,
          limit: ctx.limit,
          query: {
            index: index2,
            range: ctx.range
          }
        });
      }).then(function(_a2) {
        var result = _a2.result;
        return result;
      }).then(cb);
    }
    ctx.keysOnly = !ctx.isMatch;
    var a = [];
    return this.each(function(item, cursor) {
      a.push(cursor.primaryKey);
    }).then(function() {
      return a;
    }).then(cb);
  };
  Collection2.prototype.uniqueKeys = function(cb) {
    this._ctx.unique = "unique";
    return this.keys(cb);
  };
  Collection2.prototype.firstKey = function(cb) {
    return this.limit(1).keys(function(a) {
      return a[0];
    }).then(cb);
  };
  Collection2.prototype.lastKey = function(cb) {
    return this.reverse().firstKey(cb);
  };
  Collection2.prototype.distinct = function() {
    var ctx = this._ctx, idx = ctx.index && ctx.table.schema.idxByName[ctx.index];
    if (!idx || !idx.multi)
      return this;
    var set = {};
    addFilter(this._ctx, function(cursor) {
      var strKey = cursor.primaryKey.toString();
      var found = hasOwn(set, strKey);
      set[strKey] = true;
      return !found;
    });
    return this;
  };
  Collection2.prototype.modify = function(changes) {
    var _this = this;
    var ctx = this._ctx;
    return this._write(function(trans) {
      var modifyer;
      if (typeof changes === "function") {
        modifyer = changes;
      } else {
        var keyPaths = keys(changes);
        var numKeys = keyPaths.length;
        modifyer = function(item) {
          var anythingModified = false;
          for (var i = 0; i < numKeys; ++i) {
            var keyPath = keyPaths[i], val = changes[keyPath];
            if (getByKeyPath(item, keyPath) !== val) {
              setByKeyPath(item, keyPath, val);
              anythingModified = true;
            }
          }
          return anythingModified;
        };
      }
      var coreTable = ctx.table.core;
      var _a2 = coreTable.schema.primaryKey, outbound = _a2.outbound, extractKey = _a2.extractKey;
      var limit = "testmode" in Dexie ? 1 : 2e3;
      var cmp = _this.db.core.cmp;
      var totalFailures = [];
      var successCount = 0;
      var failedKeys = [];
      var applyMutateResult = function(expectedCount, res) {
        var failures = res.failures, numFailures = res.numFailures;
        successCount += expectedCount - numFailures;
        for (var _i = 0, _a3 = keys(failures); _i < _a3.length; _i++) {
          var pos = _a3[_i];
          totalFailures.push(failures[pos]);
        }
      };
      return _this.clone().primaryKeys().then(function(keys$$1) {
        var nextChunk = function(offset) {
          var count = Math.min(limit, keys$$1.length - offset);
          return coreTable.getMany({trans, keys: keys$$1.slice(offset, offset + count)}).then(function(values) {
            var addValues = [];
            var putValues = [];
            var putKeys = outbound ? [] : null;
            var deleteKeys = [];
            for (var i = 0; i < count; ++i) {
              var origValue = values[i];
              var ctx_1 = {
                value: deepClone(origValue),
                primKey: keys$$1[offset + i]
              };
              if (modifyer.call(ctx_1, ctx_1.value, ctx_1) !== false) {
                if (ctx_1.value == null) {
                  deleteKeys.push(keys$$1[offset + i]);
                } else if (!outbound && cmp(extractKey(origValue), extractKey(ctx_1.value)) !== 0) {
                  deleteKeys.push(keys$$1[offset + i]);
                  addValues.push(ctx_1.value);
                } else {
                  putValues.push(ctx_1.value);
                  if (outbound)
                    putKeys.push(keys$$1[offset + i]);
                }
              }
            }
            return Promise.resolve(addValues.length > 0 && coreTable.mutate({trans, type: "add", values: addValues}).then(function(res) {
              for (var pos in res.failures) {
                deleteKeys.splice(parseInt(pos), 1);
              }
              applyMutateResult(addValues.length, res);
            })).then(function(res) {
              return putValues.length > 0 && coreTable.mutate({trans, type: "put", keys: putKeys, values: putValues}).then(function(res2) {
                return applyMutateResult(putValues.length, res2);
              });
            }).then(function() {
              return deleteKeys.length > 0 && coreTable.mutate({trans, type: "delete", keys: deleteKeys}).then(function(res) {
                return applyMutateResult(deleteKeys.length, res);
              });
            }).then(function() {
              return keys$$1.length > offset + count && nextChunk(offset + limit);
            });
          });
        };
        return nextChunk(0).then(function() {
          if (totalFailures.length > 0)
            throw new ModifyError("Error modifying one or more objects", totalFailures, successCount, failedKeys);
          return keys$$1.length;
        });
      });
    });
  };
  Collection2.prototype.delete = function() {
    var ctx = this._ctx, range = ctx.range;
    if (isPlainKeyRange(ctx) && (ctx.isPrimKey && !hangsOnDeleteLargeKeyRange || range.type === 3)) {
      return this._write(function(trans) {
        var primaryKey = ctx.table.core.schema.primaryKey;
        var coreRange = range;
        return ctx.table.core.count({trans, query: {index: primaryKey, range: coreRange}}).then(function(count) {
          return ctx.table.core.mutate({trans, type: "deleteRange", range: coreRange}).then(function(_a2) {
            var failures = _a2.failures;
            _a2.lastResult;
            _a2.results;
            var numFailures = _a2.numFailures;
            if (numFailures)
              throw new ModifyError("Could not delete some values", Object.keys(failures).map(function(pos) {
                return failures[pos];
              }), count - numFailures);
            return count - numFailures;
          });
        });
      });
    }
    return this.modify(function(value, ctx2) {
      return ctx2.value = null;
    });
  };
  return Collection2;
}();
function createCollectionConstructor(db2) {
  return makeClassConstructor(Collection.prototype, function Collection$$1(whereClause, keyRangeGenerator) {
    this.db = db2;
    var keyRange = AnyRange, error2 = null;
    if (keyRangeGenerator)
      try {
        keyRange = keyRangeGenerator();
      } catch (ex) {
        error2 = ex;
      }
    var whereCtx = whereClause._ctx;
    var table = whereCtx.table;
    var readingHook = table.hook.reading.fire;
    this._ctx = {
      table,
      index: whereCtx.index,
      isPrimKey: !whereCtx.index || table.schema.primKey.keyPath && whereCtx.index === table.schema.primKey.name,
      range: keyRange,
      keysOnly: false,
      dir: "next",
      unique: "",
      algorithm: null,
      filter: null,
      replayFilter: null,
      justLimit: true,
      isMatch: null,
      offset: 0,
      limit: Infinity,
      error: error2,
      or: whereCtx.or,
      valueMapper: readingHook !== mirror ? readingHook : null
    };
  });
}
function simpleCompare(a, b) {
  return a < b ? -1 : a === b ? 0 : 1;
}
function simpleCompareReverse(a, b) {
  return a > b ? -1 : a === b ? 0 : 1;
}
function fail(collectionOrWhereClause, err, T) {
  var collection = collectionOrWhereClause instanceof WhereClause ? new collectionOrWhereClause.Collection(collectionOrWhereClause) : collectionOrWhereClause;
  collection._ctx.error = T ? new T(err) : new TypeError(err);
  return collection;
}
function emptyCollection(whereClause) {
  return new whereClause.Collection(whereClause, function() {
    return rangeEqual("");
  }).limit(0);
}
function upperFactory(dir) {
  return dir === "next" ? function(s2) {
    return s2.toUpperCase();
  } : function(s2) {
    return s2.toLowerCase();
  };
}
function lowerFactory(dir) {
  return dir === "next" ? function(s2) {
    return s2.toLowerCase();
  } : function(s2) {
    return s2.toUpperCase();
  };
}
function nextCasing(key, lowerKey, upperNeedle, lowerNeedle, cmp, dir) {
  var length = Math.min(key.length, lowerNeedle.length);
  var llp = -1;
  for (var i = 0; i < length; ++i) {
    var lwrKeyChar = lowerKey[i];
    if (lwrKeyChar !== lowerNeedle[i]) {
      if (cmp(key[i], upperNeedle[i]) < 0)
        return key.substr(0, i) + upperNeedle[i] + upperNeedle.substr(i + 1);
      if (cmp(key[i], lowerNeedle[i]) < 0)
        return key.substr(0, i) + lowerNeedle[i] + upperNeedle.substr(i + 1);
      if (llp >= 0)
        return key.substr(0, llp) + lowerKey[llp] + upperNeedle.substr(llp + 1);
      return null;
    }
    if (cmp(key[i], lwrKeyChar) < 0)
      llp = i;
  }
  if (length < lowerNeedle.length && dir === "next")
    return key + upperNeedle.substr(key.length);
  if (length < key.length && dir === "prev")
    return key.substr(0, upperNeedle.length);
  return llp < 0 ? null : key.substr(0, llp) + lowerNeedle[llp] + upperNeedle.substr(llp + 1);
}
function addIgnoreCaseAlgorithm(whereClause, match, needles, suffix) {
  var upper, lower, compare, upperNeedles, lowerNeedles, direction, nextKeySuffix, needlesLen = needles.length;
  if (!needles.every(function(s2) {
    return typeof s2 === "string";
  })) {
    return fail(whereClause, STRING_EXPECTED);
  }
  function initDirection(dir) {
    upper = upperFactory(dir);
    lower = lowerFactory(dir);
    compare = dir === "next" ? simpleCompare : simpleCompareReverse;
    var needleBounds = needles.map(function(needle) {
      return {lower: lower(needle), upper: upper(needle)};
    }).sort(function(a, b) {
      return compare(a.lower, b.lower);
    });
    upperNeedles = needleBounds.map(function(nb) {
      return nb.upper;
    });
    lowerNeedles = needleBounds.map(function(nb) {
      return nb.lower;
    });
    direction = dir;
    nextKeySuffix = dir === "next" ? "" : suffix;
  }
  initDirection("next");
  var c = new whereClause.Collection(whereClause, function() {
    return createRange(upperNeedles[0], lowerNeedles[needlesLen - 1] + suffix);
  });
  c._ondirectionchange = function(direction2) {
    initDirection(direction2);
  };
  var firstPossibleNeedle = 0;
  c._addAlgorithm(function(cursor, advance, resolve2) {
    var key = cursor.key;
    if (typeof key !== "string")
      return false;
    var lowerKey = lower(key);
    if (match(lowerKey, lowerNeedles, firstPossibleNeedle)) {
      return true;
    } else {
      var lowestPossibleCasing = null;
      for (var i = firstPossibleNeedle; i < needlesLen; ++i) {
        var casing = nextCasing(key, lowerKey, upperNeedles[i], lowerNeedles[i], compare, direction);
        if (casing === null && lowestPossibleCasing === null)
          firstPossibleNeedle = i + 1;
        else if (lowestPossibleCasing === null || compare(lowestPossibleCasing, casing) > 0) {
          lowestPossibleCasing = casing;
        }
      }
      if (lowestPossibleCasing !== null) {
        advance(function() {
          cursor.continue(lowestPossibleCasing + nextKeySuffix);
        });
      } else {
        advance(resolve2);
      }
      return false;
    }
  });
  return c;
}
function createRange(lower, upper, lowerOpen, upperOpen) {
  return {
    type: 2,
    lower,
    upper,
    lowerOpen,
    upperOpen
  };
}
function rangeEqual(value) {
  return {
    type: 1,
    lower: value,
    upper: value
  };
}
var WhereClause = function() {
  function WhereClause2() {
  }
  Object.defineProperty(WhereClause2.prototype, "Collection", {
    get: function() {
      return this._ctx.table.db.Collection;
    },
    enumerable: true,
    configurable: true
  });
  WhereClause2.prototype.between = function(lower, upper, includeLower, includeUpper) {
    includeLower = includeLower !== false;
    includeUpper = includeUpper === true;
    try {
      if (this._cmp(lower, upper) > 0 || this._cmp(lower, upper) === 0 && (includeLower || includeUpper) && !(includeLower && includeUpper))
        return emptyCollection(this);
      return new this.Collection(this, function() {
        return createRange(lower, upper, !includeLower, !includeUpper);
      });
    } catch (e) {
      return fail(this, INVALID_KEY_ARGUMENT);
    }
  };
  WhereClause2.prototype.equals = function(value) {
    if (value == null)
      return fail(this, INVALID_KEY_ARGUMENT);
    return new this.Collection(this, function() {
      return rangeEqual(value);
    });
  };
  WhereClause2.prototype.above = function(value) {
    if (value == null)
      return fail(this, INVALID_KEY_ARGUMENT);
    return new this.Collection(this, function() {
      return createRange(value, void 0, true);
    });
  };
  WhereClause2.prototype.aboveOrEqual = function(value) {
    if (value == null)
      return fail(this, INVALID_KEY_ARGUMENT);
    return new this.Collection(this, function() {
      return createRange(value, void 0, false);
    });
  };
  WhereClause2.prototype.below = function(value) {
    if (value == null)
      return fail(this, INVALID_KEY_ARGUMENT);
    return new this.Collection(this, function() {
      return createRange(void 0, value, false, true);
    });
  };
  WhereClause2.prototype.belowOrEqual = function(value) {
    if (value == null)
      return fail(this, INVALID_KEY_ARGUMENT);
    return new this.Collection(this, function() {
      return createRange(void 0, value);
    });
  };
  WhereClause2.prototype.startsWith = function(str) {
    if (typeof str !== "string")
      return fail(this, STRING_EXPECTED);
    return this.between(str, str + maxString, true, true);
  };
  WhereClause2.prototype.startsWithIgnoreCase = function(str) {
    if (str === "")
      return this.startsWith(str);
    return addIgnoreCaseAlgorithm(this, function(x, a) {
      return x.indexOf(a[0]) === 0;
    }, [str], maxString);
  };
  WhereClause2.prototype.equalsIgnoreCase = function(str) {
    return addIgnoreCaseAlgorithm(this, function(x, a) {
      return x === a[0];
    }, [str], "");
  };
  WhereClause2.prototype.anyOfIgnoreCase = function() {
    var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
    if (set.length === 0)
      return emptyCollection(this);
    return addIgnoreCaseAlgorithm(this, function(x, a) {
      return a.indexOf(x) !== -1;
    }, set, "");
  };
  WhereClause2.prototype.startsWithAnyOfIgnoreCase = function() {
    var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
    if (set.length === 0)
      return emptyCollection(this);
    return addIgnoreCaseAlgorithm(this, function(x, a) {
      return a.some(function(n) {
        return x.indexOf(n) === 0;
      });
    }, set, maxString);
  };
  WhereClause2.prototype.anyOf = function() {
    var _this = this;
    var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
    var compare = this._cmp;
    try {
      set.sort(compare);
    } catch (e) {
      return fail(this, INVALID_KEY_ARGUMENT);
    }
    if (set.length === 0)
      return emptyCollection(this);
    var c = new this.Collection(this, function() {
      return createRange(set[0], set[set.length - 1]);
    });
    c._ondirectionchange = function(direction) {
      compare = direction === "next" ? _this._ascending : _this._descending;
      set.sort(compare);
    };
    var i = 0;
    c._addAlgorithm(function(cursor, advance, resolve2) {
      var key = cursor.key;
      while (compare(key, set[i]) > 0) {
        ++i;
        if (i === set.length) {
          advance(resolve2);
          return false;
        }
      }
      if (compare(key, set[i]) === 0) {
        return true;
      } else {
        advance(function() {
          cursor.continue(set[i]);
        });
        return false;
      }
    });
    return c;
  };
  WhereClause2.prototype.notEqual = function(value) {
    return this.inAnyRange([[minKey, value], [value, this.db._maxKey]], {includeLowers: false, includeUppers: false});
  };
  WhereClause2.prototype.noneOf = function() {
    var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
    if (set.length === 0)
      return new this.Collection(this);
    try {
      set.sort(this._ascending);
    } catch (e) {
      return fail(this, INVALID_KEY_ARGUMENT);
    }
    var ranges = set.reduce(function(res, val) {
      return res ? res.concat([[res[res.length - 1][1], val]]) : [[minKey, val]];
    }, null);
    ranges.push([set[set.length - 1], this.db._maxKey]);
    return this.inAnyRange(ranges, {includeLowers: false, includeUppers: false});
  };
  WhereClause2.prototype.inAnyRange = function(ranges, options) {
    var _this = this;
    var cmp = this._cmp, ascending = this._ascending, descending = this._descending, min = this._min, max = this._max;
    if (ranges.length === 0)
      return emptyCollection(this);
    if (!ranges.every(function(range) {
      return range[0] !== void 0 && range[1] !== void 0 && ascending(range[0], range[1]) <= 0;
    })) {
      return fail(this, "First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower", exceptions.InvalidArgument);
    }
    var includeLowers = !options || options.includeLowers !== false;
    var includeUppers = options && options.includeUppers === true;
    function addRange(ranges2, newRange) {
      var i = 0, l = ranges2.length;
      for (; i < l; ++i) {
        var range = ranges2[i];
        if (cmp(newRange[0], range[1]) < 0 && cmp(newRange[1], range[0]) > 0) {
          range[0] = min(range[0], newRange[0]);
          range[1] = max(range[1], newRange[1]);
          break;
        }
      }
      if (i === l)
        ranges2.push(newRange);
      return ranges2;
    }
    var sortDirection = ascending;
    function rangeSorter(a, b) {
      return sortDirection(a[0], b[0]);
    }
    var set;
    try {
      set = ranges.reduce(addRange, []);
      set.sort(rangeSorter);
    } catch (ex) {
      return fail(this, INVALID_KEY_ARGUMENT);
    }
    var rangePos = 0;
    var keyIsBeyondCurrentEntry = includeUppers ? function(key) {
      return ascending(key, set[rangePos][1]) > 0;
    } : function(key) {
      return ascending(key, set[rangePos][1]) >= 0;
    };
    var keyIsBeforeCurrentEntry = includeLowers ? function(key) {
      return descending(key, set[rangePos][0]) > 0;
    } : function(key) {
      return descending(key, set[rangePos][0]) >= 0;
    };
    function keyWithinCurrentRange(key) {
      return !keyIsBeyondCurrentEntry(key) && !keyIsBeforeCurrentEntry(key);
    }
    var checkKey = keyIsBeyondCurrentEntry;
    var c = new this.Collection(this, function() {
      return createRange(set[0][0], set[set.length - 1][1], !includeLowers, !includeUppers);
    });
    c._ondirectionchange = function(direction) {
      if (direction === "next") {
        checkKey = keyIsBeyondCurrentEntry;
        sortDirection = ascending;
      } else {
        checkKey = keyIsBeforeCurrentEntry;
        sortDirection = descending;
      }
      set.sort(rangeSorter);
    };
    c._addAlgorithm(function(cursor, advance, resolve2) {
      var key = cursor.key;
      while (checkKey(key)) {
        ++rangePos;
        if (rangePos === set.length) {
          advance(resolve2);
          return false;
        }
      }
      if (keyWithinCurrentRange(key)) {
        return true;
      } else if (_this._cmp(key, set[rangePos][1]) === 0 || _this._cmp(key, set[rangePos][0]) === 0) {
        return false;
      } else {
        advance(function() {
          if (sortDirection === ascending)
            cursor.continue(set[rangePos][0]);
          else
            cursor.continue(set[rangePos][1]);
        });
        return false;
      }
    });
    return c;
  };
  WhereClause2.prototype.startsWithAnyOf = function() {
    var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
    if (!set.every(function(s2) {
      return typeof s2 === "string";
    })) {
      return fail(this, "startsWithAnyOf() only works with strings");
    }
    if (set.length === 0)
      return emptyCollection(this);
    return this.inAnyRange(set.map(function(str) {
      return [str, str + maxString];
    }));
  };
  return WhereClause2;
}();
function createWhereClauseConstructor(db2) {
  return makeClassConstructor(WhereClause.prototype, function WhereClause$$1(table, index2, orCollection) {
    this.db = db2;
    this._ctx = {
      table,
      index: index2 === ":id" ? null : index2,
      or: orCollection
    };
    var indexedDB = db2._deps.indexedDB;
    if (!indexedDB)
      throw new exceptions.MissingAPI("indexedDB API missing");
    this._cmp = this._ascending = indexedDB.cmp.bind(indexedDB);
    this._descending = function(a, b) {
      return indexedDB.cmp(b, a);
    };
    this._max = function(a, b) {
      return indexedDB.cmp(a, b) > 0 ? a : b;
    };
    this._min = function(a, b) {
      return indexedDB.cmp(a, b) < 0 ? a : b;
    };
    this._IDBKeyRange = db2._deps.IDBKeyRange;
  });
}
function safariMultiStoreFix(storeNames) {
  return storeNames.length === 1 ? storeNames[0] : storeNames;
}
function getMaxKey(IdbKeyRange) {
  try {
    IdbKeyRange.only([[]]);
    return [[]];
  } catch (e) {
    return maxString;
  }
}
function eventRejectHandler(reject) {
  return wrap(function(event) {
    preventDefault(event);
    reject(event.target.error);
    return false;
  });
}
function preventDefault(event) {
  if (event.stopPropagation)
    event.stopPropagation();
  if (event.preventDefault)
    event.preventDefault();
}
var Transaction = function() {
  function Transaction2() {
  }
  Transaction2.prototype._lock = function() {
    assert(!PSD.global);
    ++this._reculock;
    if (this._reculock === 1 && !PSD.global)
      PSD.lockOwnerFor = this;
    return this;
  };
  Transaction2.prototype._unlock = function() {
    assert(!PSD.global);
    if (--this._reculock === 0) {
      if (!PSD.global)
        PSD.lockOwnerFor = null;
      while (this._blockedFuncs.length > 0 && !this._locked()) {
        var fnAndPSD = this._blockedFuncs.shift();
        try {
          usePSD(fnAndPSD[1], fnAndPSD[0]);
        } catch (e) {
        }
      }
    }
    return this;
  };
  Transaction2.prototype._locked = function() {
    return this._reculock && PSD.lockOwnerFor !== this;
  };
  Transaction2.prototype.create = function(idbtrans) {
    var _this = this;
    if (!this.mode)
      return this;
    var idbdb = this.db.idbdb;
    var dbOpenError = this.db._state.dbOpenError;
    assert(!this.idbtrans);
    if (!idbtrans && !idbdb) {
      switch (dbOpenError && dbOpenError.name) {
        case "DatabaseClosedError":
          throw new exceptions.DatabaseClosed(dbOpenError);
        case "MissingAPIError":
          throw new exceptions.MissingAPI(dbOpenError.message, dbOpenError);
        default:
          throw new exceptions.OpenFailed(dbOpenError);
      }
    }
    if (!this.active)
      throw new exceptions.TransactionInactive();
    assert(this._completion._state === null);
    idbtrans = this.idbtrans = idbtrans || idbdb.transaction(safariMultiStoreFix(this.storeNames), this.mode);
    idbtrans.onerror = wrap(function(ev) {
      preventDefault(ev);
      _this._reject(idbtrans.error);
    });
    idbtrans.onabort = wrap(function(ev) {
      preventDefault(ev);
      _this.active && _this._reject(new exceptions.Abort(idbtrans.error));
      _this.active = false;
      _this.on("abort").fire(ev);
    });
    idbtrans.oncomplete = wrap(function() {
      _this.active = false;
      _this._resolve();
    });
    return this;
  };
  Transaction2.prototype._promise = function(mode, fn, bWriteLock) {
    var _this = this;
    if (mode === "readwrite" && this.mode !== "readwrite")
      return rejection(new exceptions.ReadOnly("Transaction is readonly"));
    if (!this.active)
      return rejection(new exceptions.TransactionInactive());
    if (this._locked()) {
      return new DexiePromise(function(resolve2, reject) {
        _this._blockedFuncs.push([function() {
          _this._promise(mode, fn, bWriteLock).then(resolve2, reject);
        }, PSD]);
      });
    } else if (bWriteLock) {
      return newScope(function() {
        var p2 = new DexiePromise(function(resolve2, reject) {
          _this._lock();
          var rv = fn(resolve2, reject, _this);
          if (rv && rv.then)
            rv.then(resolve2, reject);
        });
        p2.finally(function() {
          return _this._unlock();
        });
        p2._lib = true;
        return p2;
      });
    } else {
      var p = new DexiePromise(function(resolve2, reject) {
        var rv = fn(resolve2, reject, _this);
        if (rv && rv.then)
          rv.then(resolve2, reject);
      });
      p._lib = true;
      return p;
    }
  };
  Transaction2.prototype._root = function() {
    return this.parent ? this.parent._root() : this;
  };
  Transaction2.prototype.waitFor = function(promiseLike) {
    var root = this._root();
    var promise = DexiePromise.resolve(promiseLike);
    if (root._waitingFor) {
      root._waitingFor = root._waitingFor.then(function() {
        return promise;
      });
    } else {
      root._waitingFor = promise;
      root._waitingQueue = [];
      var store = root.idbtrans.objectStore(root.storeNames[0]);
      (function spin() {
        ++root._spinCount;
        while (root._waitingQueue.length)
          root._waitingQueue.shift()();
        if (root._waitingFor)
          store.get(-Infinity).onsuccess = spin;
      })();
    }
    var currentWaitPromise = root._waitingFor;
    return new DexiePromise(function(resolve2, reject) {
      promise.then(function(res) {
        return root._waitingQueue.push(wrap(resolve2.bind(null, res)));
      }, function(err) {
        return root._waitingQueue.push(wrap(reject.bind(null, err)));
      }).finally(function() {
        if (root._waitingFor === currentWaitPromise) {
          root._waitingFor = null;
        }
      });
    });
  };
  Transaction2.prototype.abort = function() {
    this.active && this._reject(new exceptions.Abort());
    this.active = false;
  };
  Transaction2.prototype.table = function(tableName) {
    var memoizedTables = this._memoizedTables || (this._memoizedTables = {});
    if (hasOwn(memoizedTables, tableName))
      return memoizedTables[tableName];
    var tableSchema = this.schema[tableName];
    if (!tableSchema) {
      throw new exceptions.NotFound("Table " + tableName + " not part of transaction");
    }
    var transactionBoundTable = new this.db.Table(tableName, tableSchema, this);
    transactionBoundTable.core = this.db.core.table(tableName);
    memoizedTables[tableName] = transactionBoundTable;
    return transactionBoundTable;
  };
  return Transaction2;
}();
function createTransactionConstructor(db2) {
  return makeClassConstructor(Transaction.prototype, function Transaction$$1(mode, storeNames, dbschema, parent) {
    var _this = this;
    this.db = db2;
    this.mode = mode;
    this.storeNames = storeNames;
    this.schema = dbschema;
    this.idbtrans = null;
    this.on = Events(this, "complete", "error", "abort");
    this.parent = parent || null;
    this.active = true;
    this._reculock = 0;
    this._blockedFuncs = [];
    this._resolve = null;
    this._reject = null;
    this._waitingFor = null;
    this._waitingQueue = null;
    this._spinCount = 0;
    this._completion = new DexiePromise(function(resolve2, reject) {
      _this._resolve = resolve2;
      _this._reject = reject;
    });
    this._completion.then(function() {
      _this.active = false;
      _this.on.complete.fire();
    }, function(e) {
      var wasActive = _this.active;
      _this.active = false;
      _this.on.error.fire(e);
      _this.parent ? _this.parent._reject(e) : wasActive && _this.idbtrans && _this.idbtrans.abort();
      return rejection(e);
    });
  });
}
function createIndexSpec(name, keyPath, unique, multi, auto, compound, isPrimKey) {
  return {
    name,
    keyPath,
    unique,
    multi,
    auto,
    compound,
    src: (unique && !isPrimKey ? "&" : "") + (multi ? "*" : "") + (auto ? "++" : "") + nameFromKeyPath(keyPath)
  };
}
function nameFromKeyPath(keyPath) {
  return typeof keyPath === "string" ? keyPath : keyPath ? "[" + [].join.call(keyPath, "+") + "]" : "";
}
function createTableSchema(name, primKey, indexes) {
  return {
    name,
    primKey,
    indexes,
    mappedClass: null,
    idxByName: arrayToObject(indexes, function(index2) {
      return [index2.name, index2];
    })
  };
}
function getKeyExtractor(keyPath) {
  if (keyPath == null) {
    return function() {
      return void 0;
    };
  } else if (typeof keyPath === "string") {
    return getSinglePathKeyExtractor(keyPath);
  } else {
    return function(obj) {
      return getByKeyPath(obj, keyPath);
    };
  }
}
function getSinglePathKeyExtractor(keyPath) {
  var split = keyPath.split(".");
  if (split.length === 1) {
    return function(obj) {
      return obj[keyPath];
    };
  } else {
    return function(obj) {
      return getByKeyPath(obj, keyPath);
    };
  }
}
function getEffectiveKeys(primaryKey, req) {
  if (req.type === "delete")
    return req.keys;
  return req.keys || req.values.map(primaryKey.extractKey);
}
function getExistingValues(table, req, effectiveKeys) {
  return req.type === "add" ? Promise.resolve(new Array(req.values.length)) : table.getMany({trans: req.trans, keys: effectiveKeys});
}
function arrayify(arrayLike) {
  return [].slice.call(arrayLike);
}
var _id_counter = 0;
function getKeyPathAlias(keyPath) {
  return keyPath == null ? ":id" : typeof keyPath === "string" ? keyPath : "[" + keyPath.join("+") + "]";
}
function createDBCore(db2, indexedDB, IdbKeyRange, tmpTrans) {
  var cmp = indexedDB.cmp.bind(indexedDB);
  function extractSchema(db3, trans) {
    var tables2 = arrayify(db3.objectStoreNames);
    return {
      schema: {
        name: db3.name,
        tables: tables2.map(function(table) {
          return trans.objectStore(table);
        }).map(function(store) {
          var keyPath = store.keyPath, autoIncrement = store.autoIncrement;
          var compound = isArray(keyPath);
          var outbound = keyPath == null;
          var indexByKeyPath = {};
          var result = {
            name: store.name,
            primaryKey: {
              name: null,
              isPrimaryKey: true,
              outbound,
              compound,
              keyPath,
              autoIncrement,
              unique: true,
              extractKey: getKeyExtractor(keyPath)
            },
            indexes: arrayify(store.indexNames).map(function(indexName) {
              return store.index(indexName);
            }).map(function(index2) {
              var name = index2.name, unique = index2.unique, multiEntry = index2.multiEntry, keyPath2 = index2.keyPath;
              var compound2 = isArray(keyPath2);
              var result2 = {
                name,
                compound: compound2,
                keyPath: keyPath2,
                unique,
                multiEntry,
                extractKey: getKeyExtractor(keyPath2)
              };
              indexByKeyPath[getKeyPathAlias(keyPath2)] = result2;
              return result2;
            }),
            getIndexByKeyPath: function(keyPath2) {
              return indexByKeyPath[getKeyPathAlias(keyPath2)];
            }
          };
          indexByKeyPath[":id"] = result.primaryKey;
          if (keyPath != null) {
            indexByKeyPath[getKeyPathAlias(keyPath)] = result.primaryKey;
          }
          return result;
        })
      },
      hasGetAll: tables2.length > 0 && "getAll" in trans.objectStore(tables2[0]) && !(typeof navigator !== "undefined" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604)
    };
  }
  function makeIDBKeyRange(range) {
    if (range.type === 3)
      return null;
    if (range.type === 4)
      throw new Error("Cannot convert never type to IDBKeyRange");
    var lower = range.lower, upper = range.upper, lowerOpen = range.lowerOpen, upperOpen = range.upperOpen;
    var idbRange = lower === void 0 ? upper === void 0 ? null : IdbKeyRange.upperBound(upper, !!upperOpen) : upper === void 0 ? IdbKeyRange.lowerBound(lower, !!lowerOpen) : IdbKeyRange.bound(lower, upper, !!lowerOpen, !!upperOpen);
    return idbRange;
  }
  function createDbCoreTable(tableSchema) {
    var tableName = tableSchema.name;
    function mutate(_a3) {
      var trans = _a3.trans, type = _a3.type, keys$$1 = _a3.keys, values = _a3.values, range = _a3.range, wantResults = _a3.wantResults;
      return new Promise(function(resolve2, reject) {
        resolve2 = wrap(resolve2);
        var store = trans.objectStore(tableName);
        var outbound = store.keyPath == null;
        var isAddOrPut = type === "put" || type === "add";
        if (!isAddOrPut && type !== "delete" && type !== "deleteRange")
          throw new Error("Invalid operation type: " + type);
        var length = (keys$$1 || values || {length: 1}).length;
        if (keys$$1 && values && keys$$1.length !== values.length) {
          throw new Error("Given keys array must have same length as given values array.");
        }
        if (length === 0)
          return resolve2({numFailures: 0, failures: {}, results: [], lastResult: void 0});
        var results = wantResults && __spreadArrays(keys$$1 ? keys$$1 : getEffectiveKeys(tableSchema.primaryKey, {type, keys: keys$$1, values}));
        var req;
        var failures = [];
        var numFailures = 0;
        var errorHandler = function(event) {
          ++numFailures;
          preventDefault(event);
          if (results)
            results[event.target._reqno] = void 0;
          failures[event.target._reqno] = event.target.error;
        };
        var setResult = function(_a5) {
          var target = _a5.target;
          results[target._reqno] = target.result;
        };
        if (type === "deleteRange") {
          if (range.type === 4)
            return resolve2({numFailures, failures, results, lastResult: void 0});
          if (range.type === 3)
            req = store.clear();
          else
            req = store.delete(makeIDBKeyRange(range));
        } else {
          var _a4 = isAddOrPut ? outbound ? [values, keys$$1] : [values, null] : [keys$$1, null], args1 = _a4[0], args2 = _a4[1];
          if (isAddOrPut) {
            for (var i = 0; i < length; ++i) {
              req = args2 && args2[i] !== void 0 ? store[type](args1[i], args2[i]) : store[type](args1[i]);
              req._reqno = i;
              if (results && results[i] === void 0) {
                req.onsuccess = setResult;
              }
              req.onerror = errorHandler;
            }
          } else {
            for (var i = 0; i < length; ++i) {
              req = store[type](args1[i]);
              req._reqno = i;
              req.onerror = errorHandler;
            }
          }
        }
        var done = function(event) {
          var lastResult = event.target.result;
          if (results)
            results[length - 1] = lastResult;
          resolve2({
            numFailures,
            failures,
            results,
            lastResult
          });
        };
        req.onerror = function(event) {
          errorHandler(event);
          done(event);
        };
        req.onsuccess = done;
      });
    }
    function openCursor2(_a3) {
      var trans = _a3.trans, values = _a3.values, query2 = _a3.query, reverse = _a3.reverse, unique = _a3.unique;
      return new Promise(function(resolve2, reject) {
        resolve2 = wrap(resolve2);
        var index2 = query2.index, range = query2.range;
        var store = trans.objectStore(tableName);
        var source = index2.isPrimaryKey ? store : store.index(index2.name);
        var direction = reverse ? unique ? "prevunique" : "prev" : unique ? "nextunique" : "next";
        var req = values || !("openKeyCursor" in source) ? source.openCursor(makeIDBKeyRange(range), direction) : source.openKeyCursor(makeIDBKeyRange(range), direction);
        req.onerror = eventRejectHandler(reject);
        req.onsuccess = wrap(function(ev) {
          var cursor = req.result;
          if (!cursor) {
            resolve2(null);
            return;
          }
          cursor.___id = ++_id_counter;
          cursor.done = false;
          var _cursorContinue = cursor.continue.bind(cursor);
          var _cursorContinuePrimaryKey = cursor.continuePrimaryKey;
          if (_cursorContinuePrimaryKey)
            _cursorContinuePrimaryKey = _cursorContinuePrimaryKey.bind(cursor);
          var _cursorAdvance = cursor.advance.bind(cursor);
          var doThrowCursorIsNotStarted = function() {
            throw new Error("Cursor not started");
          };
          var doThrowCursorIsStopped = function() {
            throw new Error("Cursor not stopped");
          };
          cursor.trans = trans;
          cursor.stop = cursor.continue = cursor.continuePrimaryKey = cursor.advance = doThrowCursorIsNotStarted;
          cursor.fail = wrap(reject);
          cursor.next = function() {
            var _this = this;
            var gotOne = 1;
            return this.start(function() {
              return gotOne-- ? _this.continue() : _this.stop();
            }).then(function() {
              return _this;
            });
          };
          cursor.start = function(callback) {
            var iterationPromise = new Promise(function(resolveIteration, rejectIteration) {
              resolveIteration = wrap(resolveIteration);
              req.onerror = eventRejectHandler(rejectIteration);
              cursor.fail = rejectIteration;
              cursor.stop = function(value) {
                cursor.stop = cursor.continue = cursor.continuePrimaryKey = cursor.advance = doThrowCursorIsStopped;
                resolveIteration(value);
              };
            });
            var guardedCallback = function() {
              if (req.result) {
                try {
                  callback();
                } catch (err) {
                  cursor.fail(err);
                }
              } else {
                cursor.done = true;
                cursor.start = function() {
                  throw new Error("Cursor behind last entry");
                };
                cursor.stop();
              }
            };
            req.onsuccess = wrap(function(ev2) {
              req.onsuccess = guardedCallback;
              guardedCallback();
            });
            cursor.continue = _cursorContinue;
            cursor.continuePrimaryKey = _cursorContinuePrimaryKey;
            cursor.advance = _cursorAdvance;
            guardedCallback();
            return iterationPromise;
          };
          resolve2(cursor);
        }, reject);
      });
    }
    function query(hasGetAll2) {
      return function(request) {
        return new Promise(function(resolve2, reject) {
          resolve2 = wrap(resolve2);
          var trans = request.trans, values = request.values, limit = request.limit, query2 = request.query;
          var nonInfinitLimit = limit === Infinity ? void 0 : limit;
          var index2 = query2.index, range = query2.range;
          var store = trans.objectStore(tableName);
          var source = index2.isPrimaryKey ? store : store.index(index2.name);
          var idbKeyRange = makeIDBKeyRange(range);
          if (limit === 0)
            return resolve2({result: []});
          if (hasGetAll2) {
            var req = values ? source.getAll(idbKeyRange, nonInfinitLimit) : source.getAllKeys(idbKeyRange, nonInfinitLimit);
            req.onsuccess = function(event) {
              return resolve2({result: event.target.result});
            };
            req.onerror = eventRejectHandler(reject);
          } else {
            var count_1 = 0;
            var req_1 = values || !("openKeyCursor" in source) ? source.openCursor(idbKeyRange) : source.openKeyCursor(idbKeyRange);
            var result_1 = [];
            req_1.onsuccess = function(event) {
              var cursor = req_1.result;
              if (!cursor)
                return resolve2({result: result_1});
              result_1.push(values ? cursor.value : cursor.primaryKey);
              if (++count_1 === limit)
                return resolve2({result: result_1});
              cursor.continue();
            };
            req_1.onerror = eventRejectHandler(reject);
          }
        });
      };
    }
    return {
      name: tableName,
      schema: tableSchema,
      mutate,
      getMany: function(_a3) {
        var trans = _a3.trans, keys$$1 = _a3.keys;
        return new Promise(function(resolve2, reject) {
          resolve2 = wrap(resolve2);
          var store = trans.objectStore(tableName);
          var length = keys$$1.length;
          var result = new Array(length);
          var keyCount = 0;
          var callbackCount = 0;
          var req;
          var successHandler = function(event) {
            var req2 = event.target;
            if ((result[req2._pos] = req2.result) != null)
              ;
            if (++callbackCount === keyCount)
              resolve2(result);
          };
          var errorHandler = eventRejectHandler(reject);
          for (var i = 0; i < length; ++i) {
            var key = keys$$1[i];
            if (key != null) {
              req = store.get(keys$$1[i]);
              req._pos = i;
              req.onsuccess = successHandler;
              req.onerror = errorHandler;
              ++keyCount;
            }
          }
          if (keyCount === 0)
            resolve2(result);
        });
      },
      get: function(_a3) {
        var trans = _a3.trans, key = _a3.key;
        return new Promise(function(resolve2, reject) {
          resolve2 = wrap(resolve2);
          var store = trans.objectStore(tableName);
          var req = store.get(key);
          req.onsuccess = function(event) {
            return resolve2(event.target.result);
          };
          req.onerror = eventRejectHandler(reject);
        });
      },
      query: query(hasGetAll),
      openCursor: openCursor2,
      count: function(_a3) {
        var query2 = _a3.query, trans = _a3.trans;
        var index2 = query2.index, range = query2.range;
        return new Promise(function(resolve2, reject) {
          var store = trans.objectStore(tableName);
          var source = index2.isPrimaryKey ? store : store.index(index2.name);
          var idbKeyRange = makeIDBKeyRange(range);
          var req = idbKeyRange ? source.count(idbKeyRange) : source.count();
          req.onsuccess = wrap(function(ev) {
            return resolve2(ev.target.result);
          });
          req.onerror = eventRejectHandler(reject);
        });
      }
    };
  }
  var _a2 = extractSchema(db2, tmpTrans), schema = _a2.schema, hasGetAll = _a2.hasGetAll;
  var tables = schema.tables.map(function(tableSchema) {
    return createDbCoreTable(tableSchema);
  });
  var tableMap = {};
  tables.forEach(function(table) {
    return tableMap[table.name] = table;
  });
  return {
    stack: "dbcore",
    transaction: db2.transaction.bind(db2),
    table: function(name) {
      var result = tableMap[name];
      if (!result)
        throw new Error("Table '" + name + "' not found");
      return tableMap[name];
    },
    cmp,
    MIN_KEY: -Infinity,
    MAX_KEY: getMaxKey(IdbKeyRange),
    schema
  };
}
function createMiddlewareStack(stackImpl, middlewares) {
  return middlewares.reduce(function(down, _a2) {
    var create = _a2.create;
    return __assign(__assign({}, down), create(down));
  }, stackImpl);
}
function createMiddlewareStacks(middlewares, idbdb, _a2, tmpTrans) {
  var IDBKeyRange = _a2.IDBKeyRange, indexedDB = _a2.indexedDB;
  var dbcore = createMiddlewareStack(createDBCore(idbdb, indexedDB, IDBKeyRange, tmpTrans), middlewares.dbcore);
  return {
    dbcore
  };
}
function generateMiddlewareStacks(db2, tmpTrans) {
  var idbdb = tmpTrans.db;
  var stacks = createMiddlewareStacks(db2._middlewares, idbdb, db2._deps, tmpTrans);
  db2.core = stacks.dbcore;
  db2.tables.forEach(function(table) {
    var tableName = table.name;
    if (db2.core.schema.tables.some(function(tbl) {
      return tbl.name === tableName;
    })) {
      table.core = db2.core.table(tableName);
      if (db2[tableName] instanceof db2.Table) {
        db2[tableName].core = table.core;
      }
    }
  });
}
function setApiOnPlace(db2, objs, tableNames, dbschema) {
  tableNames.forEach(function(tableName) {
    var schema = dbschema[tableName];
    objs.forEach(function(obj) {
      var propDesc = getPropertyDescriptor(obj, tableName);
      if (!propDesc || "value" in propDesc && propDesc.value === void 0) {
        if (obj === db2.Transaction.prototype || obj instanceof db2.Transaction) {
          setProp(obj, tableName, {
            get: function() {
              return this.table(tableName);
            },
            set: function(value) {
              defineProperty(this, tableName, {value, writable: true, configurable: true, enumerable: true});
            }
          });
        } else {
          obj[tableName] = new db2.Table(tableName, schema);
        }
      }
    });
  });
}
function removeTablesApi(db2, objs) {
  objs.forEach(function(obj) {
    for (var key in obj) {
      if (obj[key] instanceof db2.Table)
        delete obj[key];
    }
  });
}
function lowerVersionFirst(a, b) {
  return a._cfg.version - b._cfg.version;
}
function runUpgraders(db2, oldVersion, idbUpgradeTrans, reject) {
  var globalSchema = db2._dbSchema;
  var trans = db2._createTransaction("readwrite", db2._storeNames, globalSchema);
  trans.create(idbUpgradeTrans);
  trans._completion.catch(reject);
  var rejectTransaction = trans._reject.bind(trans);
  var transless = PSD.transless || PSD;
  newScope(function() {
    PSD.trans = trans;
    PSD.transless = transless;
    if (oldVersion === 0) {
      keys(globalSchema).forEach(function(tableName) {
        createTable(idbUpgradeTrans, tableName, globalSchema[tableName].primKey, globalSchema[tableName].indexes);
      });
      generateMiddlewareStacks(db2, idbUpgradeTrans);
      DexiePromise.follow(function() {
        return db2.on.populate.fire(trans);
      }).catch(rejectTransaction);
    } else
      updateTablesAndIndexes(db2, oldVersion, trans, idbUpgradeTrans).catch(rejectTransaction);
  });
}
function updateTablesAndIndexes(db2, oldVersion, trans, idbUpgradeTrans) {
  var queue = [];
  var versions = db2._versions;
  var globalSchema = db2._dbSchema = buildGlobalSchema(db2, db2.idbdb, idbUpgradeTrans);
  var anyContentUpgraderHasRun = false;
  var versToRun = versions.filter(function(v) {
    return v._cfg.version >= oldVersion;
  });
  versToRun.forEach(function(version) {
    queue.push(function() {
      var oldSchema = globalSchema;
      var newSchema = version._cfg.dbschema;
      adjustToExistingIndexNames(db2, oldSchema, idbUpgradeTrans);
      adjustToExistingIndexNames(db2, newSchema, idbUpgradeTrans);
      globalSchema = db2._dbSchema = newSchema;
      var diff = getSchemaDiff(oldSchema, newSchema);
      diff.add.forEach(function(tuple) {
        createTable(idbUpgradeTrans, tuple[0], tuple[1].primKey, tuple[1].indexes);
      });
      diff.change.forEach(function(change) {
        if (change.recreate) {
          throw new exceptions.Upgrade("Not yet support for changing primary key");
        } else {
          var store_1 = idbUpgradeTrans.objectStore(change.name);
          change.add.forEach(function(idx) {
            return addIndex(store_1, idx);
          });
          change.change.forEach(function(idx) {
            store_1.deleteIndex(idx.name);
            addIndex(store_1, idx);
          });
          change.del.forEach(function(idxName) {
            return store_1.deleteIndex(idxName);
          });
        }
      });
      var contentUpgrade = version._cfg.contentUpgrade;
      if (contentUpgrade && version._cfg.version > oldVersion) {
        generateMiddlewareStacks(db2, idbUpgradeTrans);
        trans._memoizedTables = {};
        anyContentUpgraderHasRun = true;
        var upgradeSchema_1 = shallowClone(newSchema);
        diff.del.forEach(function(table) {
          upgradeSchema_1[table] = oldSchema[table];
        });
        removeTablesApi(db2, [db2.Transaction.prototype]);
        setApiOnPlace(db2, [db2.Transaction.prototype], keys(upgradeSchema_1), upgradeSchema_1);
        trans.schema = upgradeSchema_1;
        var contentUpgradeIsAsync_1 = isAsyncFunction(contentUpgrade);
        if (contentUpgradeIsAsync_1) {
          incrementExpectedAwaits();
        }
        var returnValue_1;
        var promiseFollowed = DexiePromise.follow(function() {
          returnValue_1 = contentUpgrade(trans);
          if (returnValue_1) {
            if (contentUpgradeIsAsync_1) {
              var decrementor = decrementExpectedAwaits.bind(null, null);
              returnValue_1.then(decrementor, decrementor);
            }
          }
        });
        return returnValue_1 && typeof returnValue_1.then === "function" ? DexiePromise.resolve(returnValue_1) : promiseFollowed.then(function() {
          return returnValue_1;
        });
      }
    });
    queue.push(function(idbtrans) {
      if (!anyContentUpgraderHasRun || !hasIEDeleteObjectStoreBug) {
        var newSchema = version._cfg.dbschema;
        deleteRemovedTables(newSchema, idbtrans);
      }
      removeTablesApi(db2, [db2.Transaction.prototype]);
      setApiOnPlace(db2, [db2.Transaction.prototype], db2._storeNames, db2._dbSchema);
      trans.schema = db2._dbSchema;
    });
  });
  function runQueue() {
    return queue.length ? DexiePromise.resolve(queue.shift()(trans.idbtrans)).then(runQueue) : DexiePromise.resolve();
  }
  return runQueue().then(function() {
    createMissingTables(globalSchema, idbUpgradeTrans);
  });
}
function getSchemaDiff(oldSchema, newSchema) {
  var diff = {
    del: [],
    add: [],
    change: []
  };
  var table;
  for (table in oldSchema) {
    if (!newSchema[table])
      diff.del.push(table);
  }
  for (table in newSchema) {
    var oldDef = oldSchema[table], newDef = newSchema[table];
    if (!oldDef) {
      diff.add.push([table, newDef]);
    } else {
      var change = {
        name: table,
        def: newDef,
        recreate: false,
        del: [],
        add: [],
        change: []
      };
      if ("" + (oldDef.primKey.keyPath || "") !== "" + (newDef.primKey.keyPath || "") || oldDef.primKey.auto !== newDef.primKey.auto && !isIEOrEdge) {
        change.recreate = true;
        diff.change.push(change);
      } else {
        var oldIndexes = oldDef.idxByName;
        var newIndexes = newDef.idxByName;
        var idxName = void 0;
        for (idxName in oldIndexes) {
          if (!newIndexes[idxName])
            change.del.push(idxName);
        }
        for (idxName in newIndexes) {
          var oldIdx = oldIndexes[idxName], newIdx = newIndexes[idxName];
          if (!oldIdx)
            change.add.push(newIdx);
          else if (oldIdx.src !== newIdx.src)
            change.change.push(newIdx);
        }
        if (change.del.length > 0 || change.add.length > 0 || change.change.length > 0) {
          diff.change.push(change);
        }
      }
    }
  }
  return diff;
}
function createTable(idbtrans, tableName, primKey, indexes) {
  var store = idbtrans.db.createObjectStore(tableName, primKey.keyPath ? {keyPath: primKey.keyPath, autoIncrement: primKey.auto} : {autoIncrement: primKey.auto});
  indexes.forEach(function(idx) {
    return addIndex(store, idx);
  });
  return store;
}
function createMissingTables(newSchema, idbtrans) {
  keys(newSchema).forEach(function(tableName) {
    if (!idbtrans.db.objectStoreNames.contains(tableName)) {
      createTable(idbtrans, tableName, newSchema[tableName].primKey, newSchema[tableName].indexes);
    }
  });
}
function deleteRemovedTables(newSchema, idbtrans) {
  for (var i = 0; i < idbtrans.db.objectStoreNames.length; ++i) {
    var storeName = idbtrans.db.objectStoreNames[i];
    if (newSchema[storeName] == null) {
      idbtrans.db.deleteObjectStore(storeName);
    }
  }
}
function addIndex(store, idx) {
  store.createIndex(idx.name, idx.keyPath, {unique: idx.unique, multiEntry: idx.multi});
}
function buildGlobalSchema(db2, idbdb, tmpTrans) {
  var globalSchema = {};
  var dbStoreNames = slice(idbdb.objectStoreNames, 0);
  dbStoreNames.forEach(function(storeName) {
    var store = tmpTrans.objectStore(storeName);
    var keyPath = store.keyPath;
    var primKey = createIndexSpec(nameFromKeyPath(keyPath), keyPath || "", false, false, !!store.autoIncrement, keyPath && typeof keyPath !== "string", true);
    var indexes = [];
    for (var j = 0; j < store.indexNames.length; ++j) {
      var idbindex = store.index(store.indexNames[j]);
      keyPath = idbindex.keyPath;
      var index2 = createIndexSpec(idbindex.name, keyPath, !!idbindex.unique, !!idbindex.multiEntry, false, keyPath && typeof keyPath !== "string", false);
      indexes.push(index2);
    }
    globalSchema[storeName] = createTableSchema(storeName, primKey, indexes);
  });
  return globalSchema;
}
function readGlobalSchema(db2, idbdb, tmpTrans) {
  db2.verno = idbdb.version / 10;
  var globalSchema = db2._dbSchema = buildGlobalSchema(db2, idbdb, tmpTrans);
  db2._storeNames = slice(idbdb.objectStoreNames, 0);
  setApiOnPlace(db2, [db2._allTables], keys(globalSchema), globalSchema);
}
function verifyInstalledSchema(db2, tmpTrans) {
  var installedSchema = buildGlobalSchema(db2, db2.idbdb, tmpTrans);
  var diff = getSchemaDiff(installedSchema, db2._dbSchema);
  return !(diff.add.length || diff.change.some(function(ch) {
    return ch.add.length || ch.change.length;
  }));
}
function adjustToExistingIndexNames(db2, schema, idbtrans) {
  var storeNames = idbtrans.db.objectStoreNames;
  for (var i = 0; i < storeNames.length; ++i) {
    var storeName = storeNames[i];
    var store = idbtrans.objectStore(storeName);
    db2._hasGetAll = "getAll" in store;
    for (var j = 0; j < store.indexNames.length; ++j) {
      var indexName = store.indexNames[j];
      var keyPath = store.index(indexName).keyPath;
      var dexieName = typeof keyPath === "string" ? keyPath : "[" + slice(keyPath).join("+") + "]";
      if (schema[storeName]) {
        var indexSpec = schema[storeName].idxByName[dexieName];
        if (indexSpec) {
          indexSpec.name = indexName;
          delete schema[storeName].idxByName[dexieName];
          schema[storeName].idxByName[indexName] = indexSpec;
        }
      }
    }
  }
  if (typeof navigator !== "undefined" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && _global.WorkerGlobalScope && _global instanceof _global.WorkerGlobalScope && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604) {
    db2._hasGetAll = false;
  }
}
function parseIndexSyntax(primKeyAndIndexes) {
  return primKeyAndIndexes.split(",").map(function(index2, indexNum) {
    index2 = index2.trim();
    var name = index2.replace(/([&*]|\+\+)/g, "");
    var keyPath = /^\[/.test(name) ? name.match(/^\[(.*)\]$/)[1].split("+") : name;
    return createIndexSpec(name, keyPath || null, /\&/.test(index2), /\*/.test(index2), /\+\+/.test(index2), isArray(keyPath), indexNum === 0);
  });
}
var Version = function() {
  function Version2() {
  }
  Version2.prototype._parseStoresSpec = function(stores, outSchema) {
    keys(stores).forEach(function(tableName) {
      if (stores[tableName] !== null) {
        var indexes = parseIndexSyntax(stores[tableName]);
        var primKey = indexes.shift();
        if (primKey.multi)
          throw new exceptions.Schema("Primary key cannot be multi-valued");
        indexes.forEach(function(idx) {
          if (idx.auto)
            throw new exceptions.Schema("Only primary key can be marked as autoIncrement (++)");
          if (!idx.keyPath)
            throw new exceptions.Schema("Index must have a name and cannot be an empty string");
        });
        outSchema[tableName] = createTableSchema(tableName, primKey, indexes);
      }
    });
  };
  Version2.prototype.stores = function(stores) {
    var db2 = this.db;
    this._cfg.storesSource = this._cfg.storesSource ? extend(this._cfg.storesSource, stores) : stores;
    var versions = db2._versions;
    var storesSpec = {};
    var dbschema = {};
    versions.forEach(function(version) {
      extend(storesSpec, version._cfg.storesSource);
      dbschema = version._cfg.dbschema = {};
      version._parseStoresSpec(storesSpec, dbschema);
    });
    db2._dbSchema = dbschema;
    removeTablesApi(db2, [db2._allTables, db2, db2.Transaction.prototype]);
    setApiOnPlace(db2, [db2._allTables, db2, db2.Transaction.prototype, this._cfg.tables], keys(dbschema), dbschema);
    db2._storeNames = keys(dbschema);
    return this;
  };
  Version2.prototype.upgrade = function(upgradeFunction) {
    this._cfg.contentUpgrade = upgradeFunction;
    return this;
  };
  return Version2;
}();
function createVersionConstructor(db2) {
  return makeClassConstructor(Version.prototype, function Version$$1(versionNumber) {
    this.db = db2;
    this._cfg = {
      version: versionNumber,
      storesSource: null,
      dbschema: {},
      tables: {},
      contentUpgrade: null
    };
  });
}
var databaseEnumerator;
function DatabaseEnumerator(indexedDB) {
  var hasDatabasesNative = indexedDB && typeof indexedDB.databases === "function";
  var dbNamesTable;
  if (!hasDatabasesNative) {
    var db2 = new Dexie(DBNAMES_DB, {addons: []});
    db2.version(1).stores({dbnames: "name"});
    dbNamesTable = db2.table("dbnames");
  }
  return {
    getDatabaseNames: function() {
      return hasDatabasesNative ? DexiePromise.resolve(indexedDB.databases()).then(function(infos) {
        return infos.map(function(info) {
          return info.name;
        }).filter(function(name) {
          return name !== DBNAMES_DB;
        });
      }) : dbNamesTable.toCollection().primaryKeys();
    },
    add: function(name) {
      return !hasDatabasesNative && name !== DBNAMES_DB && dbNamesTable.put({name}).catch(nop);
    },
    remove: function(name) {
      return !hasDatabasesNative && name !== DBNAMES_DB && dbNamesTable.delete(name).catch(nop);
    }
  };
}
function initDatabaseEnumerator(indexedDB) {
  try {
    databaseEnumerator = DatabaseEnumerator(indexedDB);
  } catch (e) {
  }
}
function vip(fn) {
  return newScope(function() {
    PSD.letThrough = true;
    return fn();
  });
}
function dexieOpen(db2) {
  var state = db2._state;
  var indexedDB = db2._deps.indexedDB;
  if (state.isBeingOpened || db2.idbdb)
    return state.dbReadyPromise.then(function() {
      return state.dbOpenError ? rejection(state.dbOpenError) : db2;
    });
  debug && (state.openCanceller._stackHolder = getErrorWithStack());
  state.isBeingOpened = true;
  state.dbOpenError = null;
  state.openComplete = false;
  var resolveDbReady = state.dbReadyResolve, upgradeTransaction = null;
  return DexiePromise.race([state.openCanceller, new DexiePromise(function(resolve2, reject) {
    if (!indexedDB)
      throw new exceptions.MissingAPI("indexedDB API not found. If using IE10+, make sure to run your code on a server URL (not locally). If using old Safari versions, make sure to include indexedDB polyfill.");
    var dbName = db2.name;
    var req = state.autoSchema ? indexedDB.open(dbName) : indexedDB.open(dbName, Math.round(db2.verno * 10));
    if (!req)
      throw new exceptions.MissingAPI("IndexedDB API not available");
    req.onerror = eventRejectHandler(reject);
    req.onblocked = wrap(db2._fireOnBlocked);
    req.onupgradeneeded = wrap(function(e) {
      upgradeTransaction = req.transaction;
      if (state.autoSchema && !db2._options.allowEmptyDB) {
        req.onerror = preventDefault;
        upgradeTransaction.abort();
        req.result.close();
        var delreq = indexedDB.deleteDatabase(dbName);
        delreq.onsuccess = delreq.onerror = wrap(function() {
          reject(new exceptions.NoSuchDatabase("Database " + dbName + " doesnt exist"));
        });
      } else {
        upgradeTransaction.onerror = eventRejectHandler(reject);
        var oldVer = e.oldVersion > Math.pow(2, 62) ? 0 : e.oldVersion;
        db2.idbdb = req.result;
        runUpgraders(db2, oldVer / 10, upgradeTransaction, reject);
      }
    }, reject);
    req.onsuccess = wrap(function() {
      upgradeTransaction = null;
      var idbdb = db2.idbdb = req.result;
      var objectStoreNames = slice(idbdb.objectStoreNames);
      if (objectStoreNames.length > 0)
        try {
          var tmpTrans = idbdb.transaction(safariMultiStoreFix(objectStoreNames), "readonly");
          if (state.autoSchema)
            readGlobalSchema(db2, idbdb, tmpTrans);
          else {
            adjustToExistingIndexNames(db2, db2._dbSchema, tmpTrans);
            if (!verifyInstalledSchema(db2, tmpTrans)) {
              console.warn("Dexie SchemaDiff: Schema was extended without increasing the number passed to db.version(). Some queries may fail.");
            }
          }
          generateMiddlewareStacks(db2, tmpTrans);
        } catch (e) {
        }
      connections.push(db2);
      idbdb.onversionchange = wrap(function(ev) {
        state.vcFired = true;
        db2.on("versionchange").fire(ev);
      });
      databaseEnumerator.add(dbName);
      resolve2();
    }, reject);
  })]).then(function() {
    state.onReadyBeingFired = [];
    return DexiePromise.resolve(vip(db2.on.ready.fire)).then(function fireRemainders() {
      if (state.onReadyBeingFired.length > 0) {
        var remainders = state.onReadyBeingFired.reduce(promisableChain, nop);
        state.onReadyBeingFired = [];
        return DexiePromise.resolve(vip(remainders)).then(fireRemainders);
      }
    });
  }).finally(function() {
    state.onReadyBeingFired = null;
  }).then(function() {
    state.isBeingOpened = false;
    return db2;
  }).catch(function(err) {
    try {
      upgradeTransaction && upgradeTransaction.abort();
    } catch (e) {
    }
    state.isBeingOpened = false;
    db2.close();
    state.dbOpenError = err;
    return rejection(state.dbOpenError);
  }).finally(function() {
    state.openComplete = true;
    resolveDbReady();
  });
}
function awaitIterator(iterator) {
  var callNext = function(result) {
    return iterator.next(result);
  }, doThrow = function(error2) {
    return iterator.throw(error2);
  }, onSuccess = step(callNext), onError = step(doThrow);
  function step(getNext) {
    return function(val) {
      var next = getNext(val), value = next.value;
      return next.done ? value : !value || typeof value.then !== "function" ? isArray(value) ? Promise.all(value).then(onSuccess, onError) : onSuccess(value) : value.then(onSuccess, onError);
    };
  }
  return step(callNext)();
}
function extractTransactionArgs(mode, _tableArgs_, scopeFunc) {
  var i = arguments.length;
  if (i < 2)
    throw new exceptions.InvalidArgument("Too few arguments");
  var args = new Array(i - 1);
  while (--i)
    args[i - 1] = arguments[i];
  scopeFunc = args.pop();
  var tables = flatten(args);
  return [mode, tables, scopeFunc];
}
function enterTransactionScope(db2, mode, storeNames, parentTransaction, scopeFunc) {
  return DexiePromise.resolve().then(function() {
    var transless = PSD.transless || PSD;
    var trans = db2._createTransaction(mode, storeNames, db2._dbSchema, parentTransaction);
    var zoneProps = {
      trans,
      transless
    };
    if (parentTransaction) {
      trans.idbtrans = parentTransaction.idbtrans;
    } else {
      trans.create();
    }
    var scopeFuncIsAsync = isAsyncFunction(scopeFunc);
    if (scopeFuncIsAsync) {
      incrementExpectedAwaits();
    }
    var returnValue;
    var promiseFollowed = DexiePromise.follow(function() {
      returnValue = scopeFunc.call(trans, trans);
      if (returnValue) {
        if (scopeFuncIsAsync) {
          var decrementor = decrementExpectedAwaits.bind(null, null);
          returnValue.then(decrementor, decrementor);
        } else if (typeof returnValue.next === "function" && typeof returnValue.throw === "function") {
          returnValue = awaitIterator(returnValue);
        }
      }
    }, zoneProps);
    return (returnValue && typeof returnValue.then === "function" ? DexiePromise.resolve(returnValue).then(function(x) {
      return trans.active ? x : rejection(new exceptions.PrematureCommit("Transaction committed too early. See http://bit.ly/2kdckMn"));
    }) : promiseFollowed.then(function() {
      return returnValue;
    })).then(function(x) {
      if (parentTransaction)
        trans._resolve();
      return trans._completion.then(function() {
        return x;
      });
    }).catch(function(e) {
      trans._reject(e);
      return rejection(e);
    });
  });
}
function pad(a, value, count) {
  var result = isArray(a) ? a.slice() : [a];
  for (var i = 0; i < count; ++i)
    result.push(value);
  return result;
}
function createVirtualIndexMiddleware(down) {
  return __assign(__assign({}, down), {table: function(tableName) {
    var table = down.table(tableName);
    var schema = table.schema;
    var indexLookup = {};
    var allVirtualIndexes = [];
    function addVirtualIndexes(keyPath, keyTail, lowLevelIndex) {
      var keyPathAlias = getKeyPathAlias(keyPath);
      var indexList = indexLookup[keyPathAlias] = indexLookup[keyPathAlias] || [];
      var keyLength = keyPath == null ? 0 : typeof keyPath === "string" ? 1 : keyPath.length;
      var isVirtual = keyTail > 0;
      var virtualIndex = __assign(__assign({}, lowLevelIndex), {
        isVirtual,
        isPrimaryKey: !isVirtual && lowLevelIndex.isPrimaryKey,
        keyTail,
        keyLength,
        extractKey: getKeyExtractor(keyPath),
        unique: !isVirtual && lowLevelIndex.unique
      });
      indexList.push(virtualIndex);
      if (!virtualIndex.isPrimaryKey) {
        allVirtualIndexes.push(virtualIndex);
      }
      if (keyLength > 1) {
        var virtualKeyPath = keyLength === 2 ? keyPath[0] : keyPath.slice(0, keyLength - 1);
        addVirtualIndexes(virtualKeyPath, keyTail + 1, lowLevelIndex);
      }
      indexList.sort(function(a, b) {
        return a.keyTail - b.keyTail;
      });
      return virtualIndex;
    }
    var primaryKey = addVirtualIndexes(schema.primaryKey.keyPath, 0, schema.primaryKey);
    indexLookup[":id"] = [primaryKey];
    for (var _i = 0, _a2 = schema.indexes; _i < _a2.length; _i++) {
      var index2 = _a2[_i];
      addVirtualIndexes(index2.keyPath, 0, index2);
    }
    function findBestIndex(keyPath) {
      var result2 = indexLookup[getKeyPathAlias(keyPath)];
      return result2 && result2[0];
    }
    function translateRange(range, keyTail) {
      return {
        type: range.type === 1 ? 2 : range.type,
        lower: pad(range.lower, range.lowerOpen ? down.MAX_KEY : down.MIN_KEY, keyTail),
        lowerOpen: true,
        upper: pad(range.upper, range.upperOpen ? down.MIN_KEY : down.MAX_KEY, keyTail),
        upperOpen: true
      };
    }
    function translateRequest(req) {
      var index3 = req.query.index;
      return index3.isVirtual ? __assign(__assign({}, req), {query: {
        index: index3,
        range: translateRange(req.query.range, index3.keyTail)
      }}) : req;
    }
    var result = __assign(__assign({}, table), {
      schema: __assign(__assign({}, schema), {primaryKey, indexes: allVirtualIndexes, getIndexByKeyPath: findBestIndex}),
      count: function(req) {
        return table.count(translateRequest(req));
      },
      query: function(req) {
        return table.query(translateRequest(req));
      },
      openCursor: function(req) {
        var _a3 = req.query.index, keyTail = _a3.keyTail, isVirtual = _a3.isVirtual, keyLength = _a3.keyLength;
        if (!isVirtual)
          return table.openCursor(req);
        function createVirtualCursor(cursor) {
          function _continue(key) {
            key != null ? cursor.continue(pad(key, req.reverse ? down.MAX_KEY : down.MIN_KEY, keyTail)) : req.unique ? cursor.continue(pad(cursor.key, req.reverse ? down.MIN_KEY : down.MAX_KEY, keyTail)) : cursor.continue();
          }
          var virtualCursor = Object.create(cursor, {
            continue: {value: _continue},
            continuePrimaryKey: {
              value: function(key, primaryKey2) {
                cursor.continuePrimaryKey(pad(key, down.MAX_KEY, keyTail), primaryKey2);
              }
            },
            key: {
              get: function() {
                var key = cursor.key;
                return keyLength === 1 ? key[0] : key.slice(0, keyLength);
              }
            },
            value: {
              get: function() {
                return cursor.value;
              }
            }
          });
          return virtualCursor;
        }
        return table.openCursor(translateRequest(req)).then(function(cursor) {
          return cursor && createVirtualCursor(cursor);
        });
      }
    });
    return result;
  }});
}
var virtualIndexMiddleware = {
  stack: "dbcore",
  name: "VirtualIndexMiddleware",
  level: 1,
  create: createVirtualIndexMiddleware
};
var hooksMiddleware = {
  stack: "dbcore",
  name: "HooksMiddleware",
  level: 2,
  create: function(downCore) {
    return __assign(__assign({}, downCore), {table: function(tableName) {
      var downTable = downCore.table(tableName);
      var primaryKey = downTable.schema.primaryKey;
      var tableMiddleware = __assign(__assign({}, downTable), {mutate: function(req) {
        var dxTrans = PSD.trans;
        var _a2 = dxTrans.table(tableName).hook, deleting = _a2.deleting, creating = _a2.creating, updating = _a2.updating;
        switch (req.type) {
          case "add":
            if (creating.fire === nop)
              break;
            return dxTrans._promise("readwrite", function() {
              return addPutOrDelete(req);
            }, true);
          case "put":
            if (creating.fire === nop && updating.fire === nop)
              break;
            return dxTrans._promise("readwrite", function() {
              return addPutOrDelete(req);
            }, true);
          case "delete":
            if (deleting.fire === nop)
              break;
            return dxTrans._promise("readwrite", function() {
              return addPutOrDelete(req);
            }, true);
          case "deleteRange":
            if (deleting.fire === nop)
              break;
            return dxTrans._promise("readwrite", function() {
              return deleteRange(req);
            }, true);
        }
        return downTable.mutate(req);
        function addPutOrDelete(req2) {
          var dxTrans2 = PSD.trans;
          var keys$$1 = req2.keys || getEffectiveKeys(primaryKey, req2);
          if (!keys$$1)
            throw new Error("Keys missing");
          req2 = req2.type === "add" || req2.type === "put" ? __assign(__assign({}, req2), {keys: keys$$1, wantResults: true}) : __assign({}, req2);
          if (req2.type !== "delete")
            req2.values = __spreadArrays(req2.values);
          if (req2.keys)
            req2.keys = __spreadArrays(req2.keys);
          return getExistingValues(downTable, req2, keys$$1).then(function(existingValues) {
            var contexts = keys$$1.map(function(key, i) {
              var existingValue = existingValues[i];
              var ctx = {onerror: null, onsuccess: null};
              if (req2.type === "delete") {
                deleting.fire.call(ctx, key, existingValue, dxTrans2);
              } else if (req2.type === "add" || existingValue === void 0) {
                var generatedPrimaryKey = creating.fire.call(ctx, key, req2.values[i], dxTrans2);
                if (key == null && generatedPrimaryKey != null) {
                  key = generatedPrimaryKey;
                  req2.keys[i] = key;
                  if (!primaryKey.outbound) {
                    setByKeyPath(req2.values[i], primaryKey.keyPath, key);
                  }
                }
              } else {
                var objectDiff = getObjectDiff(existingValue, req2.values[i]);
                var additionalChanges_1 = updating.fire.call(ctx, objectDiff, key, existingValue, dxTrans2);
                if (additionalChanges_1) {
                  var requestedValue_1 = req2.values[i];
                  Object.keys(additionalChanges_1).forEach(function(keyPath) {
                    if (hasOwn(requestedValue_1, keyPath)) {
                      requestedValue_1[keyPath] = additionalChanges_1[keyPath];
                    } else {
                      setByKeyPath(requestedValue_1, keyPath, additionalChanges_1[keyPath]);
                    }
                  });
                }
              }
              return ctx;
            });
            return downTable.mutate(req2).then(function(_a3) {
              var failures = _a3.failures, results = _a3.results, numFailures = _a3.numFailures, lastResult = _a3.lastResult;
              for (var i = 0; i < keys$$1.length; ++i) {
                var primKey = results ? results[i] : keys$$1[i];
                var ctx = contexts[i];
                if (primKey == null) {
                  ctx.onerror && ctx.onerror(failures[i]);
                } else {
                  ctx.onsuccess && ctx.onsuccess(req2.type === "put" && existingValues[i] ? req2.values[i] : primKey);
                }
              }
              return {failures, results, numFailures, lastResult};
            }).catch(function(error2) {
              contexts.forEach(function(ctx) {
                return ctx.onerror && ctx.onerror(error2);
              });
              return Promise.reject(error2);
            });
          });
        }
        function deleteRange(req2) {
          return deleteNextChunk(req2.trans, req2.range, 1e4);
        }
        function deleteNextChunk(trans, range, limit) {
          return downTable.query({trans, values: false, query: {index: primaryKey, range}, limit}).then(function(_a3) {
            var result = _a3.result;
            return addPutOrDelete({type: "delete", keys: result, trans}).then(function(res) {
              if (res.numFailures > 0)
                return Promise.reject(res.failures[0]);
              if (result.length < limit) {
                return {failures: [], numFailures: 0, lastResult: void 0};
              } else {
                return deleteNextChunk(trans, __assign(__assign({}, range), {lower: result[result.length - 1], lowerOpen: true}), limit);
              }
            });
          });
        }
      }});
      return tableMiddleware;
    }});
  }
};
var Dexie = function() {
  function Dexie2(name, options) {
    var _this = this;
    this._middlewares = {};
    this.verno = 0;
    var deps = Dexie2.dependencies;
    this._options = options = __assign({
      addons: Dexie2.addons,
      autoOpen: true,
      indexedDB: deps.indexedDB,
      IDBKeyRange: deps.IDBKeyRange
    }, options);
    this._deps = {
      indexedDB: options.indexedDB,
      IDBKeyRange: options.IDBKeyRange
    };
    var addons = options.addons;
    this._dbSchema = {};
    this._versions = [];
    this._storeNames = [];
    this._allTables = {};
    this.idbdb = null;
    var state = {
      dbOpenError: null,
      isBeingOpened: false,
      onReadyBeingFired: null,
      openComplete: false,
      dbReadyResolve: nop,
      dbReadyPromise: null,
      cancelOpen: nop,
      openCanceller: null,
      autoSchema: true
    };
    state.dbReadyPromise = new DexiePromise(function(resolve2) {
      state.dbReadyResolve = resolve2;
    });
    state.openCanceller = new DexiePromise(function(_, reject) {
      state.cancelOpen = reject;
    });
    this._state = state;
    this.name = name;
    this.on = Events(this, "populate", "blocked", "versionchange", {ready: [promisableChain, nop]});
    this.on.ready.subscribe = override(this.on.ready.subscribe, function(subscribe2) {
      return function(subscriber, bSticky) {
        Dexie2.vip(function() {
          var state2 = _this._state;
          if (state2.openComplete) {
            if (!state2.dbOpenError)
              DexiePromise.resolve().then(subscriber);
            if (bSticky)
              subscribe2(subscriber);
          } else if (state2.onReadyBeingFired) {
            state2.onReadyBeingFired.push(subscriber);
            if (bSticky)
              subscribe2(subscriber);
          } else {
            subscribe2(subscriber);
            var db_1 = _this;
            if (!bSticky)
              subscribe2(function unsubscribe() {
                db_1.on.ready.unsubscribe(subscriber);
                db_1.on.ready.unsubscribe(unsubscribe);
              });
          }
        });
      };
    });
    this.Collection = createCollectionConstructor(this);
    this.Table = createTableConstructor(this);
    this.Transaction = createTransactionConstructor(this);
    this.Version = createVersionConstructor(this);
    this.WhereClause = createWhereClauseConstructor(this);
    this.on("versionchange", function(ev) {
      if (ev.newVersion > 0)
        console.warn("Another connection wants to upgrade database '" + _this.name + "'. Closing db now to resume the upgrade.");
      else
        console.warn("Another connection wants to delete database '" + _this.name + "'. Closing db now to resume the delete request.");
      _this.close();
    });
    this.on("blocked", function(ev) {
      if (!ev.newVersion || ev.newVersion < ev.oldVersion)
        console.warn("Dexie.delete('" + _this.name + "') was blocked");
      else
        console.warn("Upgrade '" + _this.name + "' blocked by other connection holding version " + ev.oldVersion / 10);
    });
    this._maxKey = getMaxKey(options.IDBKeyRange);
    this._createTransaction = function(mode, storeNames, dbschema, parentTransaction) {
      return new _this.Transaction(mode, storeNames, dbschema, parentTransaction);
    };
    this._fireOnBlocked = function(ev) {
      _this.on("blocked").fire(ev);
      connections.filter(function(c) {
        return c.name === _this.name && c !== _this && !c._state.vcFired;
      }).map(function(c) {
        return c.on("versionchange").fire(ev);
      });
    };
    this.use(virtualIndexMiddleware);
    this.use(hooksMiddleware);
    addons.forEach(function(addon) {
      return addon(_this);
    });
  }
  Dexie2.prototype.version = function(versionNumber) {
    if (isNaN(versionNumber) || versionNumber < 0.1)
      throw new exceptions.Type("Given version is not a positive number");
    versionNumber = Math.round(versionNumber * 10) / 10;
    if (this.idbdb || this._state.isBeingOpened)
      throw new exceptions.Schema("Cannot add version when database is open");
    this.verno = Math.max(this.verno, versionNumber);
    var versions = this._versions;
    var versionInstance = versions.filter(function(v) {
      return v._cfg.version === versionNumber;
    })[0];
    if (versionInstance)
      return versionInstance;
    versionInstance = new this.Version(versionNumber);
    versions.push(versionInstance);
    versions.sort(lowerVersionFirst);
    versionInstance.stores({});
    this._state.autoSchema = false;
    return versionInstance;
  };
  Dexie2.prototype._whenReady = function(fn) {
    var _this = this;
    return this._state.openComplete || PSD.letThrough ? fn() : new DexiePromise(function(resolve2, reject) {
      if (!_this._state.isBeingOpened) {
        if (!_this._options.autoOpen) {
          reject(new exceptions.DatabaseClosed());
          return;
        }
        _this.open().catch(nop);
      }
      _this._state.dbReadyPromise.then(resolve2, reject);
    }).then(fn);
  };
  Dexie2.prototype.use = function(_a2) {
    var stack = _a2.stack, create = _a2.create, level = _a2.level, name = _a2.name;
    if (name)
      this.unuse({stack, name});
    var middlewares = this._middlewares[stack] || (this._middlewares[stack] = []);
    middlewares.push({stack, create, level: level == null ? 10 : level, name});
    middlewares.sort(function(a, b) {
      return a.level - b.level;
    });
    return this;
  };
  Dexie2.prototype.unuse = function(_a2) {
    var stack = _a2.stack, name = _a2.name, create = _a2.create;
    if (stack && this._middlewares[stack]) {
      this._middlewares[stack] = this._middlewares[stack].filter(function(mw) {
        return create ? mw.create !== create : name ? mw.name !== name : false;
      });
    }
    return this;
  };
  Dexie2.prototype.open = function() {
    return dexieOpen(this);
  };
  Dexie2.prototype.close = function() {
    var idx = connections.indexOf(this), state = this._state;
    if (idx >= 0)
      connections.splice(idx, 1);
    if (this.idbdb) {
      try {
        this.idbdb.close();
      } catch (e) {
      }
      this.idbdb = null;
    }
    this._options.autoOpen = false;
    state.dbOpenError = new exceptions.DatabaseClosed();
    if (state.isBeingOpened)
      state.cancelOpen(state.dbOpenError);
    state.dbReadyPromise = new DexiePromise(function(resolve2) {
      state.dbReadyResolve = resolve2;
    });
    state.openCanceller = new DexiePromise(function(_, reject) {
      state.cancelOpen = reject;
    });
  };
  Dexie2.prototype.delete = function() {
    var _this = this;
    var hasArguments = arguments.length > 0;
    var state = this._state;
    return new DexiePromise(function(resolve2, reject) {
      var doDelete = function() {
        _this.close();
        var req = _this._deps.indexedDB.deleteDatabase(_this.name);
        req.onsuccess = wrap(function() {
          databaseEnumerator.remove(_this.name);
          resolve2();
        });
        req.onerror = eventRejectHandler(reject);
        req.onblocked = _this._fireOnBlocked;
      };
      if (hasArguments)
        throw new exceptions.InvalidArgument("Arguments not allowed in db.delete()");
      if (state.isBeingOpened) {
        state.dbReadyPromise.then(doDelete);
      } else {
        doDelete();
      }
    });
  };
  Dexie2.prototype.backendDB = function() {
    return this.idbdb;
  };
  Dexie2.prototype.isOpen = function() {
    return this.idbdb !== null;
  };
  Dexie2.prototype.hasBeenClosed = function() {
    var dbOpenError = this._state.dbOpenError;
    return dbOpenError && dbOpenError.name === "DatabaseClosed";
  };
  Dexie2.prototype.hasFailed = function() {
    return this._state.dbOpenError !== null;
  };
  Dexie2.prototype.dynamicallyOpened = function() {
    return this._state.autoSchema;
  };
  Object.defineProperty(Dexie2.prototype, "tables", {
    get: function() {
      var _this = this;
      return keys(this._allTables).map(function(name) {
        return _this._allTables[name];
      });
    },
    enumerable: true,
    configurable: true
  });
  Dexie2.prototype.transaction = function() {
    var args = extractTransactionArgs.apply(this, arguments);
    return this._transaction.apply(this, args);
  };
  Dexie2.prototype._transaction = function(mode, tables, scopeFunc) {
    var _this = this;
    var parentTransaction = PSD.trans;
    if (!parentTransaction || parentTransaction.db !== this || mode.indexOf("!") !== -1)
      parentTransaction = null;
    var onlyIfCompatible = mode.indexOf("?") !== -1;
    mode = mode.replace("!", "").replace("?", "");
    var idbMode, storeNames;
    try {
      storeNames = tables.map(function(table) {
        var storeName = table instanceof _this.Table ? table.name : table;
        if (typeof storeName !== "string")
          throw new TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");
        return storeName;
      });
      if (mode == "r" || mode === READONLY)
        idbMode = READONLY;
      else if (mode == "rw" || mode == READWRITE)
        idbMode = READWRITE;
      else
        throw new exceptions.InvalidArgument("Invalid transaction mode: " + mode);
      if (parentTransaction) {
        if (parentTransaction.mode === READONLY && idbMode === READWRITE) {
          if (onlyIfCompatible) {
            parentTransaction = null;
          } else
            throw new exceptions.SubTransaction("Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY");
        }
        if (parentTransaction) {
          storeNames.forEach(function(storeName) {
            if (parentTransaction && parentTransaction.storeNames.indexOf(storeName) === -1) {
              if (onlyIfCompatible) {
                parentTransaction = null;
              } else
                throw new exceptions.SubTransaction("Table " + storeName + " not included in parent transaction.");
            }
          });
        }
        if (onlyIfCompatible && parentTransaction && !parentTransaction.active) {
          parentTransaction = null;
        }
      }
    } catch (e) {
      return parentTransaction ? parentTransaction._promise(null, function(_, reject) {
        reject(e);
      }) : rejection(e);
    }
    var enterTransaction = enterTransactionScope.bind(null, this, idbMode, storeNames, parentTransaction, scopeFunc);
    return parentTransaction ? parentTransaction._promise(idbMode, enterTransaction, "lock") : PSD.trans ? usePSD(PSD.transless, function() {
      return _this._whenReady(enterTransaction);
    }) : this._whenReady(enterTransaction);
  };
  Dexie2.prototype.table = function(tableName) {
    if (!hasOwn(this._allTables, tableName)) {
      throw new exceptions.InvalidTable("Table " + tableName + " does not exist");
    }
    return this._allTables[tableName];
  };
  return Dexie2;
}();
var Dexie$1 = Dexie;
props(Dexie$1, __assign(__assign({}, fullNameExceptions), {
  delete: function(databaseName) {
    var db2 = new Dexie$1(databaseName);
    return db2.delete();
  },
  exists: function(name) {
    return new Dexie$1(name, {addons: []}).open().then(function(db2) {
      db2.close();
      return true;
    }).catch("NoSuchDatabaseError", function() {
      return false;
    });
  },
  getDatabaseNames: function(cb) {
    return databaseEnumerator ? databaseEnumerator.getDatabaseNames().then(cb) : DexiePromise.resolve([]);
  },
  defineClass: function() {
    function Class(content) {
      extend(this, content);
    }
    return Class;
  },
  ignoreTransaction: function(scopeFunc) {
    return PSD.trans ? usePSD(PSD.transless, scopeFunc) : scopeFunc();
  },
  vip,
  async: function(generatorFn) {
    return function() {
      try {
        var rv = awaitIterator(generatorFn.apply(this, arguments));
        if (!rv || typeof rv.then !== "function")
          return DexiePromise.resolve(rv);
        return rv;
      } catch (e) {
        return rejection(e);
      }
    };
  },
  spawn: function(generatorFn, args, thiz) {
    try {
      var rv = awaitIterator(generatorFn.apply(thiz, args || []));
      if (!rv || typeof rv.then !== "function")
        return DexiePromise.resolve(rv);
      return rv;
    } catch (e) {
      return rejection(e);
    }
  },
  currentTransaction: {
    get: function() {
      return PSD.trans || null;
    }
  },
  waitFor: function(promiseOrFunction, optionalTimeout) {
    var promise = DexiePromise.resolve(typeof promiseOrFunction === "function" ? Dexie$1.ignoreTransaction(promiseOrFunction) : promiseOrFunction).timeout(optionalTimeout || 6e4);
    return PSD.trans ? PSD.trans.waitFor(promise) : promise;
  },
  Promise: DexiePromise,
  debug: {
    get: function() {
      return debug;
    },
    set: function(value) {
      setDebug(value, value === "dexie" ? function() {
        return true;
      } : dexieStackFrameFilter);
    }
  },
  derive,
  extend,
  props,
  override,
  Events,
  getByKeyPath,
  setByKeyPath,
  delByKeyPath,
  shallowClone,
  deepClone,
  getObjectDiff,
  asap,
  minKey,
  addons: [],
  connections,
  errnames,
  dependencies: function() {
    try {
      return {
        indexedDB: _global.indexedDB || _global.mozIndexedDB || _global.webkitIndexedDB || _global.msIndexedDB,
        IDBKeyRange: _global.IDBKeyRange || _global.webkitIDBKeyRange
      };
    } catch (e) {
      return {indexedDB: null, IDBKeyRange: null};
    }
  }(),
  semVer: DEXIE_VERSION,
  version: DEXIE_VERSION.split(".").map(function(n) {
    return parseInt(n);
  }).reduce(function(p, c, i) {
    return p + c / Math.pow(10, i * 2);
  }),
  default: Dexie$1,
  Dexie: Dexie$1
}));
Dexie$1.maxKey = getMaxKey(Dexie$1.dependencies.IDBKeyRange);
initDatabaseEnumerator(Dexie.dependencies.indexedDB);
DexiePromise.rejectionMapper = mapError;
setDebug(debug, dexieStackFrameFilter);
class Database extends Dexie {
  constructor() {
    super("EmotionTracker");
    this.version(1).stores({
      events: "++id, date"
    });
  }
}
const db = new Database();
db.open().catch(function(reason) {
  throw new Error(reason);
});
db.on("populate", function() {
  db.events.add({
    emotions: ["excited", "glad"],
    note: "Today I was excited and glad because I decided to start tracking my feelings. :)",
    date: new Date()
  });
});
var requiredArgs_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = requiredArgs;
  function requiredArgs(required, args) {
    if (args.length < required) {
      throw new TypeError(required + " argument" + (required > 1 ? "s" : "") + " required, but only " + args.length + " present");
    }
  }
  module.exports = exports.default;
});
var toDate_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = toDate;
  var _index = _interopRequireDefault(requiredArgs_1);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  function toDate(argument) {
    (0, _index.default)(1, arguments);
    var argStr = Object.prototype.toString.call(argument);
    if (argument instanceof Date || typeof argument === "object" && argStr === "[object Date]") {
      return new Date(argument.getTime());
    } else if (typeof argument === "number" || argStr === "[object Number]") {
      return new Date(argument);
    } else {
      if ((typeof argument === "string" || argStr === "[object String]") && typeof console !== "undefined") {
        console.warn("Starting with v2.0.0-beta.1 date-fns doesn't accept strings as date arguments. Please use `parseISO` to parse strings. See: https://git.io/fjule");
        console.warn(new Error().stack);
      }
      return new Date(NaN);
    }
  }
  module.exports = exports.default;
});
var compareAsc_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = compareAsc;
  var _index = _interopRequireDefault(toDate_1);
  var _index2 = _interopRequireDefault(requiredArgs_1);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  function compareAsc(dirtyDateLeft, dirtyDateRight) {
    (0, _index2.default)(2, arguments);
    var dateLeft = (0, _index.default)(dirtyDateLeft);
    var dateRight = (0, _index.default)(dirtyDateRight);
    var diff = dateLeft.getTime() - dateRight.getTime();
    if (diff < 0) {
      return -1;
    } else if (diff > 0) {
      return 1;
    } else {
      return diff;
    }
  }
  module.exports = exports.default;
});
var differenceInCalendarMonths_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = differenceInCalendarMonths;
  var _index = _interopRequireDefault(toDate_1);
  var _index2 = _interopRequireDefault(requiredArgs_1);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  function differenceInCalendarMonths(dirtyDateLeft, dirtyDateRight) {
    (0, _index2.default)(2, arguments);
    var dateLeft = (0, _index.default)(dirtyDateLeft);
    var dateRight = (0, _index.default)(dirtyDateRight);
    var yearDiff = dateLeft.getFullYear() - dateRight.getFullYear();
    var monthDiff = dateLeft.getMonth() - dateRight.getMonth();
    return yearDiff * 12 + monthDiff;
  }
  module.exports = exports.default;
});
var endOfDay_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = endOfDay;
  var _index = _interopRequireDefault(toDate_1);
  var _index2 = _interopRequireDefault(requiredArgs_1);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  function endOfDay(dirtyDate) {
    (0, _index2.default)(1, arguments);
    var date = (0, _index.default)(dirtyDate);
    date.setHours(23, 59, 59, 999);
    return date;
  }
  module.exports = exports.default;
});
var endOfMonth_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = endOfMonth;
  var _index = _interopRequireDefault(toDate_1);
  var _index2 = _interopRequireDefault(requiredArgs_1);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  function endOfMonth(dirtyDate) {
    (0, _index2.default)(1, arguments);
    var date = (0, _index.default)(dirtyDate);
    var month = date.getMonth();
    date.setFullYear(date.getFullYear(), month + 1, 0);
    date.setHours(23, 59, 59, 999);
    return date;
  }
  module.exports = exports.default;
});
var isLastDayOfMonth_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isLastDayOfMonth;
  var _index = _interopRequireDefault(toDate_1);
  var _index2 = _interopRequireDefault(endOfDay_1);
  var _index3 = _interopRequireDefault(endOfMonth_1);
  var _index4 = _interopRequireDefault(requiredArgs_1);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  function isLastDayOfMonth(dirtyDate) {
    (0, _index4.default)(1, arguments);
    var date = (0, _index.default)(dirtyDate);
    return (0, _index2.default)(date).getTime() === (0, _index3.default)(date).getTime();
  }
  module.exports = exports.default;
});
var differenceInMonths_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = differenceInMonths;
  var _index = _interopRequireDefault(toDate_1);
  var _index2 = _interopRequireDefault(differenceInCalendarMonths_1);
  var _index3 = _interopRequireDefault(compareAsc_1);
  var _index4 = _interopRequireDefault(requiredArgs_1);
  var _index5 = _interopRequireDefault(isLastDayOfMonth_1);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  function differenceInMonths(dirtyDateLeft, dirtyDateRight) {
    (0, _index4.default)(2, arguments);
    var dateLeft = (0, _index.default)(dirtyDateLeft);
    var dateRight = (0, _index.default)(dirtyDateRight);
    var sign = (0, _index3.default)(dateLeft, dateRight);
    var difference = Math.abs((0, _index2.default)(dateLeft, dateRight));
    var result;
    if (difference < 1) {
      result = 0;
    } else {
      if (dateLeft.getMonth() === 1 && dateLeft.getDate() > 27) {
        dateLeft.setDate(30);
      }
      dateLeft.setMonth(dateLeft.getMonth() - sign * difference);
      var isLastMonthNotFull = (0, _index3.default)(dateLeft, dateRight) === -sign;
      if ((0, _index5.default)((0, _index.default)(dirtyDateLeft)) && difference === 1 && (0, _index3.default)(dirtyDateLeft, dateRight) === 1) {
        isLastMonthNotFull = false;
      }
      result = sign * (difference - isLastMonthNotFull);
    }
    return result === 0 ? 0 : result;
  }
  module.exports = exports.default;
});
var differenceInMilliseconds_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = differenceInMilliseconds;
  var _index = _interopRequireDefault(toDate_1);
  var _index2 = _interopRequireDefault(requiredArgs_1);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  function differenceInMilliseconds(dirtyDateLeft, dirtyDateRight) {
    (0, _index2.default)(2, arguments);
    var dateLeft = (0, _index.default)(dirtyDateLeft);
    var dateRight = (0, _index.default)(dirtyDateRight);
    return dateLeft.getTime() - dateRight.getTime();
  }
  module.exports = exports.default;
});
var differenceInSeconds_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = differenceInSeconds;
  var _index = _interopRequireDefault(differenceInMilliseconds_1);
  var _index2 = _interopRequireDefault(requiredArgs_1);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  function differenceInSeconds(dirtyDateLeft, dirtyDateRight) {
    (0, _index2.default)(2, arguments);
    var diff = (0, _index.default)(dirtyDateLeft, dirtyDateRight) / 1e3;
    return diff > 0 ? Math.floor(diff) : Math.ceil(diff);
  }
  module.exports = exports.default;
});
var formatDistance_1$1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = formatDistance;
  var formatDistanceLocale = {
    lessThanXSeconds: {
      one: "less than a second",
      other: "less than {{count}} seconds"
    },
    xSeconds: {
      one: "1 second",
      other: "{{count}} seconds"
    },
    halfAMinute: "half a minute",
    lessThanXMinutes: {
      one: "less than a minute",
      other: "less than {{count}} minutes"
    },
    xMinutes: {
      one: "1 minute",
      other: "{{count}} minutes"
    },
    aboutXHours: {
      one: "about 1 hour",
      other: "about {{count}} hours"
    },
    xHours: {
      one: "1 hour",
      other: "{{count}} hours"
    },
    xDays: {
      one: "1 day",
      other: "{{count}} days"
    },
    aboutXWeeks: {
      one: "about 1 week",
      other: "about {{count}} weeks"
    },
    xWeeks: {
      one: "1 week",
      other: "{{count}} weeks"
    },
    aboutXMonths: {
      one: "about 1 month",
      other: "about {{count}} months"
    },
    xMonths: {
      one: "1 month",
      other: "{{count}} months"
    },
    aboutXYears: {
      one: "about 1 year",
      other: "about {{count}} years"
    },
    xYears: {
      one: "1 year",
      other: "{{count}} years"
    },
    overXYears: {
      one: "over 1 year",
      other: "over {{count}} years"
    },
    almostXYears: {
      one: "almost 1 year",
      other: "almost {{count}} years"
    }
  };
  function formatDistance(token, count, options) {
    options = options || {};
    var result;
    if (typeof formatDistanceLocale[token] === "string") {
      result = formatDistanceLocale[token];
    } else if (count === 1) {
      result = formatDistanceLocale[token].one;
    } else {
      result = formatDistanceLocale[token].other.replace("{{count}}", count);
    }
    if (options.addSuffix) {
      if (options.comparison > 0) {
        return "in " + result;
      } else {
        return result + " ago";
      }
    }
    return result;
  }
  module.exports = exports.default;
});
var buildFormatLongFn_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = buildFormatLongFn;
  function buildFormatLongFn(args) {
    return function(dirtyOptions) {
      var options = dirtyOptions || {};
      var width = options.width ? String(options.width) : args.defaultWidth;
      var format2 = args.formats[width] || args.formats[args.defaultWidth];
      return format2;
    };
  }
  module.exports = exports.default;
});
var formatLong_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var _index = _interopRequireDefault(buildFormatLongFn_1);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  var dateFormats = {
    full: "EEEE, MMMM do, y",
    long: "MMMM do, y",
    medium: "MMM d, y",
    short: "MM/dd/yyyy"
  };
  var timeFormats = {
    full: "h:mm:ss a zzzz",
    long: "h:mm:ss a z",
    medium: "h:mm:ss a",
    short: "h:mm a"
  };
  var dateTimeFormats = {
    full: "{{date}} 'at' {{time}}",
    long: "{{date}} 'at' {{time}}",
    medium: "{{date}}, {{time}}",
    short: "{{date}}, {{time}}"
  };
  var formatLong = {
    date: (0, _index.default)({
      formats: dateFormats,
      defaultWidth: "full"
    }),
    time: (0, _index.default)({
      formats: timeFormats,
      defaultWidth: "full"
    }),
    dateTime: (0, _index.default)({
      formats: dateTimeFormats,
      defaultWidth: "full"
    })
  };
  var _default = formatLong;
  exports.default = _default;
  module.exports = exports.default;
});
var formatRelative_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = formatRelative;
  var formatRelativeLocale = {
    lastWeek: "'last' eeee 'at' p",
    yesterday: "'yesterday at' p",
    today: "'today at' p",
    tomorrow: "'tomorrow at' p",
    nextWeek: "eeee 'at' p",
    other: "P"
  };
  function formatRelative(token, _date, _baseDate, _options) {
    return formatRelativeLocale[token];
  }
  module.exports = exports.default;
});
var buildLocalizeFn_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = buildLocalizeFn;
  function buildLocalizeFn(args) {
    return function(dirtyIndex, dirtyOptions) {
      var options = dirtyOptions || {};
      var context = options.context ? String(options.context) : "standalone";
      var valuesArray;
      if (context === "formatting" && args.formattingValues) {
        var defaultWidth = args.defaultFormattingWidth || args.defaultWidth;
        var width = options.width ? String(options.width) : defaultWidth;
        valuesArray = args.formattingValues[width] || args.formattingValues[defaultWidth];
      } else {
        var _defaultWidth = args.defaultWidth;
        var _width = options.width ? String(options.width) : args.defaultWidth;
        valuesArray = args.values[_width] || args.values[_defaultWidth];
      }
      var index2 = args.argumentCallback ? args.argumentCallback(dirtyIndex) : dirtyIndex;
      return valuesArray[index2];
    };
  }
  module.exports = exports.default;
});
var localize_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var _index = _interopRequireDefault(buildLocalizeFn_1);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  var eraValues = {
    narrow: ["B", "A"],
    abbreviated: ["BC", "AD"],
    wide: ["Before Christ", "Anno Domini"]
  };
  var quarterValues = {
    narrow: ["1", "2", "3", "4"],
    abbreviated: ["Q1", "Q2", "Q3", "Q4"],
    wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
  };
  var monthValues = {
    narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
    abbreviated: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    wide: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  };
  var dayValues = {
    narrow: ["S", "M", "T", "W", "T", "F", "S"],
    short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    wide: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  };
  var dayPeriodValues = {
    narrow: {
      am: "a",
      pm: "p",
      midnight: "mi",
      noon: "n",
      morning: "morning",
      afternoon: "afternoon",
      evening: "evening",
      night: "night"
    },
    abbreviated: {
      am: "AM",
      pm: "PM",
      midnight: "midnight",
      noon: "noon",
      morning: "morning",
      afternoon: "afternoon",
      evening: "evening",
      night: "night"
    },
    wide: {
      am: "a.m.",
      pm: "p.m.",
      midnight: "midnight",
      noon: "noon",
      morning: "morning",
      afternoon: "afternoon",
      evening: "evening",
      night: "night"
    }
  };
  var formattingDayPeriodValues = {
    narrow: {
      am: "a",
      pm: "p",
      midnight: "mi",
      noon: "n",
      morning: "in the morning",
      afternoon: "in the afternoon",
      evening: "in the evening",
      night: "at night"
    },
    abbreviated: {
      am: "AM",
      pm: "PM",
      midnight: "midnight",
      noon: "noon",
      morning: "in the morning",
      afternoon: "in the afternoon",
      evening: "in the evening",
      night: "at night"
    },
    wide: {
      am: "a.m.",
      pm: "p.m.",
      midnight: "midnight",
      noon: "noon",
      morning: "in the morning",
      afternoon: "in the afternoon",
      evening: "in the evening",
      night: "at night"
    }
  };
  function ordinalNumber(dirtyNumber, _dirtyOptions) {
    var number = Number(dirtyNumber);
    var rem100 = number % 100;
    if (rem100 > 20 || rem100 < 10) {
      switch (rem100 % 10) {
        case 1:
          return number + "st";
        case 2:
          return number + "nd";
        case 3:
          return number + "rd";
      }
    }
    return number + "th";
  }
  var localize = {
    ordinalNumber,
    era: (0, _index.default)({
      values: eraValues,
      defaultWidth: "wide"
    }),
    quarter: (0, _index.default)({
      values: quarterValues,
      defaultWidth: "wide",
      argumentCallback: function(quarter) {
        return Number(quarter) - 1;
      }
    }),
    month: (0, _index.default)({
      values: monthValues,
      defaultWidth: "wide"
    }),
    day: (0, _index.default)({
      values: dayValues,
      defaultWidth: "wide"
    }),
    dayPeriod: (0, _index.default)({
      values: dayPeriodValues,
      defaultWidth: "wide",
      formattingValues: formattingDayPeriodValues,
      defaultFormattingWidth: "wide"
    })
  };
  var _default = localize;
  exports.default = _default;
  module.exports = exports.default;
});
var buildMatchPatternFn_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = buildMatchPatternFn;
  function buildMatchPatternFn(args) {
    return function(dirtyString, dirtyOptions) {
      var string = String(dirtyString);
      var options = dirtyOptions || {};
      var matchResult = string.match(args.matchPattern);
      if (!matchResult) {
        return null;
      }
      var matchedString = matchResult[0];
      var parseResult = string.match(args.parsePattern);
      if (!parseResult) {
        return null;
      }
      var value = args.valueCallback ? args.valueCallback(parseResult[0]) : parseResult[0];
      value = options.valueCallback ? options.valueCallback(value) : value;
      return {
        value,
        rest: string.slice(matchedString.length)
      };
    };
  }
  module.exports = exports.default;
});
var buildMatchFn_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = buildMatchFn;
  function buildMatchFn(args) {
    return function(dirtyString, dirtyOptions) {
      var string = String(dirtyString);
      var options = dirtyOptions || {};
      var width = options.width;
      var matchPattern = width && args.matchPatterns[width] || args.matchPatterns[args.defaultMatchWidth];
      var matchResult = string.match(matchPattern);
      if (!matchResult) {
        return null;
      }
      var matchedString = matchResult[0];
      var parsePatterns = width && args.parsePatterns[width] || args.parsePatterns[args.defaultParseWidth];
      var value;
      if (Object.prototype.toString.call(parsePatterns) === "[object Array]") {
        value = findIndex(parsePatterns, function(pattern) {
          return pattern.test(matchedString);
        });
      } else {
        value = findKey(parsePatterns, function(pattern) {
          return pattern.test(matchedString);
        });
      }
      value = args.valueCallback ? args.valueCallback(value) : value;
      value = options.valueCallback ? options.valueCallback(value) : value;
      return {
        value,
        rest: string.slice(matchedString.length)
      };
    };
  }
  function findKey(object, predicate) {
    for (var key in object) {
      if (object.hasOwnProperty(key) && predicate(object[key])) {
        return key;
      }
    }
  }
  function findIndex(array, predicate) {
    for (var key = 0; key < array.length; key++) {
      if (predicate(array[key])) {
        return key;
      }
    }
  }
  module.exports = exports.default;
});
var match_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var _index = _interopRequireDefault(buildMatchPatternFn_1);
  var _index2 = _interopRequireDefault(buildMatchFn_1);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  var matchOrdinalNumberPattern = /^(\d+)(th|st|nd|rd)?/i;
  var parseOrdinalNumberPattern = /\d+/i;
  var matchEraPatterns = {
    narrow: /^(b|a)/i,
    abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
    wide: /^(before christ|before common era|anno domini|common era)/i
  };
  var parseEraPatterns = {
    any: [/^b/i, /^(a|c)/i]
  };
  var matchQuarterPatterns = {
    narrow: /^[1234]/i,
    abbreviated: /^q[1234]/i,
    wide: /^[1234](th|st|nd|rd)? quarter/i
  };
  var parseQuarterPatterns = {
    any: [/1/i, /2/i, /3/i, /4/i]
  };
  var matchMonthPatterns = {
    narrow: /^[jfmasond]/i,
    abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
    wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
  };
  var parseMonthPatterns = {
    narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
    any: [/^ja/i, /^f/i, /^mar/i, /^ap/i, /^may/i, /^jun/i, /^jul/i, /^au/i, /^s/i, /^o/i, /^n/i, /^d/i]
  };
  var matchDayPatterns = {
    narrow: /^[smtwf]/i,
    short: /^(su|mo|tu|we|th|fr|sa)/i,
    abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
    wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
  };
  var parseDayPatterns = {
    narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
    any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
  };
  var matchDayPeriodPatterns = {
    narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
    any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
  };
  var parseDayPeriodPatterns = {
    any: {
      am: /^a/i,
      pm: /^p/i,
      midnight: /^mi/i,
      noon: /^no/i,
      morning: /morning/i,
      afternoon: /afternoon/i,
      evening: /evening/i,
      night: /night/i
    }
  };
  var match = {
    ordinalNumber: (0, _index.default)({
      matchPattern: matchOrdinalNumberPattern,
      parsePattern: parseOrdinalNumberPattern,
      valueCallback: function(value) {
        return parseInt(value, 10);
      }
    }),
    era: (0, _index2.default)({
      matchPatterns: matchEraPatterns,
      defaultMatchWidth: "wide",
      parsePatterns: parseEraPatterns,
      defaultParseWidth: "any"
    }),
    quarter: (0, _index2.default)({
      matchPatterns: matchQuarterPatterns,
      defaultMatchWidth: "wide",
      parsePatterns: parseQuarterPatterns,
      defaultParseWidth: "any",
      valueCallback: function(index2) {
        return index2 + 1;
      }
    }),
    month: (0, _index2.default)({
      matchPatterns: matchMonthPatterns,
      defaultMatchWidth: "wide",
      parsePatterns: parseMonthPatterns,
      defaultParseWidth: "any"
    }),
    day: (0, _index2.default)({
      matchPatterns: matchDayPatterns,
      defaultMatchWidth: "wide",
      parsePatterns: parseDayPatterns,
      defaultParseWidth: "any"
    }),
    dayPeriod: (0, _index2.default)({
      matchPatterns: matchDayPeriodPatterns,
      defaultMatchWidth: "any",
      parsePatterns: parseDayPeriodPatterns,
      defaultParseWidth: "any"
    })
  };
  var _default = match;
  exports.default = _default;
  module.exports = exports.default;
});
var enUS = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var _index = _interopRequireDefault(formatDistance_1$1);
  var _index2 = _interopRequireDefault(formatLong_1);
  var _index3 = _interopRequireDefault(formatRelative_1);
  var _index4 = _interopRequireDefault(localize_1);
  var _index5 = _interopRequireDefault(match_1);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  var locale = {
    code: "en-US",
    formatDistance: _index.default,
    formatLong: _index2.default,
    formatRelative: _index3.default,
    localize: _index4.default,
    match: _index5.default,
    options: {
      weekStartsOn: 0,
      firstWeekContainsDate: 1
    }
  };
  var _default = locale;
  exports.default = _default;
  module.exports = exports.default;
});
var assign_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = assign;
  function assign(target, dirtyObject) {
    if (target == null) {
      throw new TypeError("assign requires that input parameter not be null or undefined");
    }
    dirtyObject = dirtyObject || {};
    for (var property in dirtyObject) {
      if (dirtyObject.hasOwnProperty(property)) {
        target[property] = dirtyObject[property];
      }
    }
    return target;
  }
  module.exports = exports.default;
});
var cloneObject_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = cloneObject;
  var _index = _interopRequireDefault(assign_1);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  function cloneObject(dirtyObject) {
    return (0, _index.default)({}, dirtyObject);
  }
  module.exports = exports.default;
});
var getTimezoneOffsetInMilliseconds_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = getTimezoneOffsetInMilliseconds;
  function getTimezoneOffsetInMilliseconds(date) {
    var utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
    utcDate.setUTCFullYear(date.getFullYear());
    return date.getTime() - utcDate.getTime();
  }
  module.exports = exports.default;
});
var formatDistance_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = formatDistance;
  var _index = _interopRequireDefault(compareAsc_1);
  var _index2 = _interopRequireDefault(differenceInMonths_1);
  var _index3 = _interopRequireDefault(differenceInSeconds_1);
  var _index4 = _interopRequireDefault(enUS);
  var _index5 = _interopRequireDefault(toDate_1);
  var _index6 = _interopRequireDefault(cloneObject_1);
  var _index7 = _interopRequireDefault(getTimezoneOffsetInMilliseconds_1);
  var _index8 = _interopRequireDefault(requiredArgs_1);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  var MINUTES_IN_DAY = 1440;
  var MINUTES_IN_ALMOST_TWO_DAYS = 2520;
  var MINUTES_IN_MONTH = 43200;
  var MINUTES_IN_TWO_MONTHS = 86400;
  function formatDistance(dirtyDate, dirtyBaseDate, dirtyOptions) {
    (0, _index8.default)(2, arguments);
    var options = dirtyOptions || {};
    var locale = options.locale || _index4.default;
    if (!locale.formatDistance) {
      throw new RangeError("locale must contain formatDistance property");
    }
    var comparison = (0, _index.default)(dirtyDate, dirtyBaseDate);
    if (isNaN(comparison)) {
      throw new RangeError("Invalid time value");
    }
    var localizeOptions = (0, _index6.default)(options);
    localizeOptions.addSuffix = Boolean(options.addSuffix);
    localizeOptions.comparison = comparison;
    var dateLeft;
    var dateRight;
    if (comparison > 0) {
      dateLeft = (0, _index5.default)(dirtyBaseDate);
      dateRight = (0, _index5.default)(dirtyDate);
    } else {
      dateLeft = (0, _index5.default)(dirtyDate);
      dateRight = (0, _index5.default)(dirtyBaseDate);
    }
    var seconds = (0, _index3.default)(dateRight, dateLeft);
    var offsetInSeconds = ((0, _index7.default)(dateRight) - (0, _index7.default)(dateLeft)) / 1e3;
    var minutes = Math.round((seconds - offsetInSeconds) / 60);
    var months;
    if (minutes < 2) {
      if (options.includeSeconds) {
        if (seconds < 5) {
          return locale.formatDistance("lessThanXSeconds", 5, localizeOptions);
        } else if (seconds < 10) {
          return locale.formatDistance("lessThanXSeconds", 10, localizeOptions);
        } else if (seconds < 20) {
          return locale.formatDistance("lessThanXSeconds", 20, localizeOptions);
        } else if (seconds < 40) {
          return locale.formatDistance("halfAMinute", null, localizeOptions);
        } else if (seconds < 60) {
          return locale.formatDistance("lessThanXMinutes", 1, localizeOptions);
        } else {
          return locale.formatDistance("xMinutes", 1, localizeOptions);
        }
      } else {
        if (minutes === 0) {
          return locale.formatDistance("lessThanXMinutes", 1, localizeOptions);
        } else {
          return locale.formatDistance("xMinutes", minutes, localizeOptions);
        }
      }
    } else if (minutes < 45) {
      return locale.formatDistance("xMinutes", minutes, localizeOptions);
    } else if (minutes < 90) {
      return locale.formatDistance("aboutXHours", 1, localizeOptions);
    } else if (minutes < MINUTES_IN_DAY) {
      var hours = Math.round(minutes / 60);
      return locale.formatDistance("aboutXHours", hours, localizeOptions);
    } else if (minutes < MINUTES_IN_ALMOST_TWO_DAYS) {
      return locale.formatDistance("xDays", 1, localizeOptions);
    } else if (minutes < MINUTES_IN_MONTH) {
      var days = Math.round(minutes / MINUTES_IN_DAY);
      return locale.formatDistance("xDays", days, localizeOptions);
    } else if (minutes < MINUTES_IN_TWO_MONTHS) {
      months = Math.round(minutes / MINUTES_IN_MONTH);
      return locale.formatDistance("aboutXMonths", months, localizeOptions);
    }
    months = (0, _index2.default)(dateRight, dateLeft);
    if (months < 12) {
      var nearestMonth = Math.round(minutes / MINUTES_IN_MONTH);
      return locale.formatDistance("xMonths", nearestMonth, localizeOptions);
    } else {
      var monthsSinceStartOfYear = months % 12;
      var years = Math.floor(months / 12);
      if (monthsSinceStartOfYear < 3) {
        return locale.formatDistance("aboutXYears", years, localizeOptions);
      } else if (monthsSinceStartOfYear < 9) {
        return locale.formatDistance("overXYears", years, localizeOptions);
      } else {
        return locale.formatDistance("almostXYears", years + 1, localizeOptions);
      }
    }
  }
  module.exports = exports.default;
});
var formatDistanceToNow_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = formatDistanceToNow2;
  var _index = _interopRequireDefault(formatDistance_1);
  var _index2 = _interopRequireDefault(requiredArgs_1);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  function formatDistanceToNow2(dirtyDate, dirtyOptions) {
    (0, _index2.default)(1, arguments);
    return (0, _index.default)(dirtyDate, Date.now(), dirtyOptions);
  }
  module.exports = exports.default;
});
var formatDistanceToNow = /* @__PURE__ */ getDefaultExportFromCjs(formatDistanceToNow_1);
const emotions = {
  happiness: {
    high: [
      "elated",
      "giddy",
      "overjoyed",
      "radiant",
      "ecstatic",
      "jubilant"
    ],
    medium: [
      "tickled",
      "glowing",
      "excited",
      "joyous",
      "bubbly",
      "delighted"
    ],
    low: [
      "amused",
      "cheerful",
      "pleased",
      "relieved",
      "glad",
      "serene"
    ]
  },
  sadness: {
    high: [
      "miserable",
      "crushed",
      "worthless",
      "humiliated",
      "depressed",
      "helpless"
    ],
    medium: [
      "forlorn",
      "burdened",
      "slighted",
      "abused",
      "defeated",
      "dejected"
    ],
    low: [
      "resigned",
      "apathetic",
      "blue",
      "gloomy",
      "ignored",
      "glum"
    ]
  },
  anger: {
    high: [
      "fuming",
      "furious",
      "outraged",
      "incensed",
      "burned up",
      "hateful"
    ],
    medium: [
      "disgusted",
      "irritated",
      "aggravated",
      "biting",
      "hostile",
      "riled"
    ],
    low: [
      "peeved",
      "bugged",
      "annoyed",
      "ruffled",
      "nettled",
      "cross"
    ]
  },
  love: {
    high: [
      "adoring",
      "devoted",
      "passionate",
      "amorous",
      "tender",
      "ardent"
    ],
    medium: [
      "caring",
      "dedicated",
      "generous",
      "loving",
      "empathic",
      "considerate"
    ],
    low: [
      "warm",
      "amiable",
      "civil",
      "polite",
      "giving",
      "kindly"
    ]
  },
  fear: {
    high: [
      "dreadful",
      "panicky",
      "horrified",
      "terrified",
      "petrified",
      "desperate"
    ],
    medium: [
      "alarmed",
      "fearful",
      "jittery",
      "strained",
      "shaky",
      "threatened"
    ],
    low: [
      "uneasy",
      "tense",
      "timid",
      "anxious",
      "nervous",
      "puzzled"
    ]
  },
  distress: {
    high: [
      "anguished",
      "disgusted",
      "speechless",
      "tormented",
      "sickened",
      "afflicted"
    ],
    medium: [
      "badgered",
      "bewildered",
      "confused",
      "disturbed",
      "impaired",
      "offended"
    ],
    low: [
      "silly",
      "foolish",
      "unsure",
      "touchy",
      "lost",
      "disturbed"
    ]
  }
};
const inverseLookupMap = Object.entries(emotions).reduce(function(map, [groupName, emotionGroup]) {
  const addToMap = (level) => (emotion) => {
    map[emotion] = [groupName, level];
  };
  emotionGroup.high.forEach(addToMap("high"));
  emotionGroup.medium.forEach(addToMap("medium"));
  emotionGroup.low.forEach(addToMap("low"));
  return map;
}, {});
const emotionGroups = Object.keys(emotions);
function getGroupAndLevel(emotion) {
  return inverseLookupMap[emotion];
}
function emotionsForGroup(emotionGroup) {
  return Object.values(emotions[emotionGroup]).flat(1);
}
function reconstructEmotionMap(emotions2) {
  return emotions2.reduce(function(cardData, emotion) {
    var _a2, _b;
    const [group, level] = getGroupAndLevel(emotion);
    return {
      ...cardData,
      [group]: {
        ...cardData[group],
        [level]: [...(_b = (_a2 = cardData[group]) == null ? void 0 : _a2[level]) != null ? _b : [], emotion]
      }
    };
  }, {});
}
function emotionToColor(group) {
  const emotionToColorMap = {
    anger: "var(--red)",
    distress: "var(--yellow)",
    fear: "var(--orange)",
    happiness: "var(--green)",
    love: "var(--purple)",
    sadness: "var(--blue)"
  };
  return emotionToColorMap[group];
}
const Chevron = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg enable-background="${"new 0 0 444.819 444.819"}" version="${"1.1"}" viewBox="${"0 0 444.819 444.819"}" xml:space="${"preserve"}" xmlns="${"http://www.w3.org/2000/svg"}" style="${"position: absolute;"}"><path d="${"m352.02 196.71l-186.14-185.86c-6.855-7.233-15.415-10.848-25.697-10.848s-18.842 3.619-25.697 10.848l-21.698 21.416c-7.044 7.043-10.566 15.604-10.566 25.692 0 9.897 3.521 18.56 10.566 25.981l138.75 138.47-138.76 138.76c-7.042 7.043-10.564 15.604-10.564 25.693 0 9.896 3.521 18.562 10.564 25.98l21.7 21.413c7.043 7.043 15.612 10.564 25.697 10.564 10.089 0 18.656-3.521 25.697-10.564l186.14-185.86c7.046-7.423 10.571-16.084 10.571-25.981 1e-3 -10.088-3.525-18.654-10.571-25.697z"}"></path></svg>`;
});
var GlanceBar_svelte_svelte_type_style_lang = ".glance-bar.svelte-zimyhf{height:0.75rem;border-radius:4px;flex:1;margin-right:32px;max-width:64px}";
const css$8 = {
  code: ".glance-bar.svelte-zimyhf{height:0.75rem;border-radius:4px;flex:1;margin-right:32px;max-width:64px}",
  map: '{"version":3,"file":"GlanceBar.svelte","sources":["GlanceBar.svelte"],"sourcesContent":["\\n<script lang=\\"ts\\">;\\nimport { emotionToColor, reconstructEmotionMap } from \\"$lib/emotions\\";\\nexport let emotions;\\nconst cardData = reconstructEmotionMap(emotions);\\nconst cardEntries = Object.entries(cardData);\\nconst gradientData = cardEntries.map(function ([emotionGroup, levels]) {\\n    const colorData = Object.entries(levels);\\n    const groupScore = colorData.reduce(function (sum, [level, emotions]) {\\n        let multiplier;\\n        switch (level) {\\n            case \\"high\\":\\n                multiplier = 3;\\n                break;\\n            case \\"medium\\":\\n                multiplier = 2;\\n                break;\\n            case \\"low\\":\\n                multiplier = 1;\\n                break;\\n        }\\n        return sum + emotions.length * multiplier;\\n    }, 0);\\n    return [emotionToColor(emotionGroup), groupScore];\\n});\\nconst gradientSum = gradientData.reduce(function (sum, [_, colorSum]) {\\n    return sum + colorSum;\\n}, 0);\\nconst gradient = gradientData.reduce(function ([idx, partialGradient], [color, colorSum]) {\\n    const start = idx;\\n    const stop = idx + (colorSum / gradientSum * 100);\\n    return [stop, `${partialGradient}, ${color} ${Math.round(start)}%, ${color} ${Math.round(stop)}%`];\\n}, [0, \\"linear-gradient(90deg\\"])[1];\\n</script>\\n\\n<div class=\\"glance-bar\\" style={`background: ${gradient}`}></div>\\n\\n<style>\\n    .glance-bar {\\n        height: 0.75rem;\\n        border-radius: 4px;\\n        flex: 1;\\n        margin-right: 32px;\\n        max-width: 64px;\\n    }\\n</style>\\n"],"names":[],"mappings":"AAsCI,WAAW,cAAC,CAAC,AACT,MAAM,CAAE,OAAO,CACf,aAAa,CAAE,GAAG,CAClB,IAAI,CAAE,CAAC,CACP,YAAY,CAAE,IAAI,CAClB,SAAS,CAAE,IAAI,AACnB,CAAC"}'
};
const GlanceBar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let {emotions: emotions2} = $$props;
  const cardData = reconstructEmotionMap(emotions2);
  const cardEntries = Object.entries(cardData);
  const gradientData = cardEntries.map(function([emotionGroup, levels]) {
    const colorData = Object.entries(levels);
    const groupScore = colorData.reduce(function(sum, [level, emotions3]) {
      let multiplier;
      switch (level) {
        case "high":
          multiplier = 3;
          break;
        case "medium":
          multiplier = 2;
          break;
        case "low":
          multiplier = 1;
          break;
      }
      return sum + emotions3.length * multiplier;
    }, 0);
    return [emotionToColor(emotionGroup), groupScore];
  });
  const gradientSum = gradientData.reduce(function(sum, [_, colorSum]) {
    return sum + colorSum;
  }, 0);
  const gradient = gradientData.reduce(function([idx, partialGradient], [color, colorSum]) {
    const start = idx;
    const stop = idx + colorSum / gradientSum * 100;
    return [
      stop,
      `${partialGradient}, ${color} ${Math.round(start)}%, ${color} ${Math.round(stop)}%`
    ];
  }, [0, "linear-gradient(90deg"])[1];
  if ($$props.emotions === void 0 && $$bindings.emotions && emotions2 !== void 0)
    $$bindings.emotions(emotions2);
  $$result.css.add(css$8);
  return `<div class="${"glance-bar svelte-zimyhf"}"${add_attribute("style", `background: ${gradient}`, 0)}></div>`;
});
const Trash = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg enable-background="${"new 0 0 438.529 438.529"}" version="${"1.1"}" viewBox="${"0 0 438.529 438.529"}" xml:space="${"preserve"}" xmlns="${"http://www.w3.org/2000/svg"}"><path d="${"m417.69 75.654c-1.711-1.709-3.901-2.568-6.563-2.568h-88.224l-19.985-47.676c-2.854-7.044-7.994-13.04-15.413-17.989-7.426-4.948-14.948-7.421-22.559-7.421h-91.363c-7.611 0-15.131 2.473-22.554 7.421-7.424 4.949-12.563 10.944-15.419 17.989l-19.985 47.676h-88.22c-2.667 0-4.853 0.859-6.567 2.568-1.709 1.713-2.568 3.903-2.568 6.567v18.274c0 2.664 0.855 4.854 2.568 6.564 1.714 1.712 3.904 2.568 6.567 2.568h27.406v271.8c0 15.803 4.473 29.266 13.418 40.398 8.947 11.139 19.701 16.703 32.264 16.703h237.54c12.566 0 23.319-5.756 32.265-17.268 8.945-11.52 13.415-25.174 13.415-40.971v-270.66h27.411c2.662 0 4.853-0.856 6.563-2.568 1.708-1.709 2.57-3.9 2.57-6.564v-18.274c2e-3 -2.664-0.861-4.854-2.569-6.567zm-248.39-35.976c1.331-1.712 2.95-2.762 4.853-3.14h90.504c1.903 0.381 3.525 1.43 4.854 3.14l13.709 33.404h-127.91l13.99-33.404zm177.87 340.61c0 4.186-0.664 8.042-1.999 11.561-1.334 3.518-2.717 6.088-4.141 7.706-1.431 1.622-2.423 2.427-2.998 2.427h-237.54c-0.571 0-1.565-0.805-2.996-2.427-1.429-1.618-2.81-4.188-4.143-7.706-1.331-3.519-1.997-7.379-1.997-11.561v-270.66h255.82v270.66z"}"></path><path d="${"m137.04 347.17h18.271c2.667 0 4.858-0.855 6.567-2.567 1.709-1.718 2.568-3.901 2.568-6.57v-164.45c0-2.663-0.859-4.853-2.568-6.567-1.714-1.709-3.899-2.565-6.567-2.565h-18.271c-2.667 0-4.854 0.855-6.567 2.565-1.711 1.714-2.568 3.904-2.568 6.567v164.45c0 2.669 0.854 4.853 2.568 6.57 1.713 1.711 3.9 2.567 6.567 2.567z"}"></path><path d="${"m210.13 347.17h18.271c2.666 0 4.856-0.855 6.564-2.567 1.718-1.718 2.569-3.901 2.569-6.57v-164.45c0-2.663-0.852-4.853-2.569-6.567-1.708-1.709-3.898-2.565-6.564-2.565h-18.271c-2.664 0-4.854 0.855-6.567 2.565-1.714 1.714-2.568 3.904-2.568 6.567v164.45c0 2.669 0.854 4.853 2.568 6.57 1.712 1.711 3.903 2.567 6.567 2.567z"}"></path><path d="${"m283.22 347.17h18.268c2.669 0 4.859-0.855 6.57-2.567 1.711-1.718 2.562-3.901 2.562-6.57v-164.45c0-2.663-0.852-4.853-2.562-6.567-1.711-1.709-3.901-2.565-6.57-2.565h-18.268c-2.67 0-4.853 0.855-6.571 2.565-1.711 1.714-2.566 3.904-2.566 6.567v164.45c0 2.669 0.855 4.853 2.566 6.57 1.718 1.711 3.901 2.567 6.571 2.567z"}"></path></svg>`;
});
var EmotionCard_svelte_svelte_type_style_lang = 'ul.svelte-zlofwv.svelte-zlofwv{list-style:none}.emotion-card.svelte-zlofwv.svelte-zlofwv{margin:var(--base-gutter);padding:var(--base-gutter);border-radius:var(--roundy-bit-softness);background:var(--card-background);box-shadow:var(--soft-shadow);border:1px solid var(--middle-gray);position:relative;overflow:hidden;z-index:1;--bullet-size:11px;--list-gutter:4px}.delete-warning.svelte-zlofwv.svelte-zlofwv{opacity:0;pointer-events:none;display:flex;position:absolute;top:0;left:0;width:100%;height:100%;background:rgb(214 48 49 / 50%);z-index:5;justify-content:center;align-items:center;transition:0.25s opacity ease-in}.delete-warning.visible.svelte-zlofwv.svelte-zlofwv{opacity:1}.delete-warning.svelte-zlofwv i.svelte-zlofwv{width:32px;height:32px;fill:var(--red)}.header.svelte-zlofwv.svelte-zlofwv{display:flex;align-items:center;padding-bottom:calc(var(--base-gutter) / 2);margin-bottom:calc(var(--base-gutter) / 2);border-bottom:1px dashed var(--middle-gray)}.chevron.svelte-zlofwv.svelte-zlofwv{display:block;width:8px;height:8px;margin-left:4px;fill:var(--dark-gray);position:relative;transition:transform 0.2s ease-in-out}.emotion-card.expanded.svelte-zlofwv .chevron.svelte-zlofwv{transform:rotate(90deg)}.emotion-card.svelte-zlofwv:not(.expanded) .header.svelte-zlofwv{margin-bottom:0;border-bottom:none;padding-bottom:0}.timestamp.svelte-zlofwv.svelte-zlofwv{font-weight:600;text-align:right;margin-left:auto;color:var(--dark-gray);text-transform:capitalize}.emotion-group.svelte-zlofwv.svelte-zlofwv{text-transform:capitalize;font-weight:600;display:flex;align-items:center;margin-bottom:calc(var(--base-gutter) / 2)}.bullet.svelte-zlofwv.svelte-zlofwv{position:relative;display:block;content:"";width:var(--bullet-size);height:var(--bullet-size);border-radius:100%;margin-right:calc(var(--base-gutter) / 2);z-index:2;background:var(--white)}.bullet.low.svelte-zlofwv.svelte-zlofwv,.bullet.medium.svelte-zlofwv.svelte-zlofwv,.bullet.high.svelte-zlofwv.svelte-zlofwv{background:#FFF}.bullet.filled.svelte-zlofwv.svelte-zlofwv{border:none}.bullet.low.svelte-zlofwv.svelte-zlofwv{border:1px solid}.bullet.medium.svelte-zlofwv.svelte-zlofwv{border:2px solid}.bullet.high.svelte-zlofwv.svelte-zlofwv{border:3px solid}.levels.svelte-zlofwv>li.svelte-zlofwv{display:grid;grid-template-areas:"b l c"\n            "h d d";grid-template-columns:min-content 1fr min-content;align-items:center;justify-items:start;gap:var(--list-gutter) 0px;margin-bottom:calc(var(--base-gutter) / 2)}.levels.svelte-zlofwv>li.svelte-zlofwv:last-child{margin-bottom:0}.levels.svelte-zlofwv>li:last-child .hack.svelte-zlofwv{display:block}.levels.svelte-zlofwv .bullet.svelte-zlofwv{grid-area:b}.levels.svelte-zlofwv .level.svelte-zlofwv{text-transform:capitalize;grid-area:l}.hack.svelte-zlofwv.svelte-zlofwv{align-self:start;grid-area:h;display:none;position:relative;top:calc(var(--list-gutter) * -1 - 2px);content:"";width:100%;height:calc(100% + var(--list-gutter) + 2px);background:var(--white);z-index:2}.count.svelte-zlofwv.svelte-zlofwv{grid-area:c;white-space:nowrap}.emotions.svelte-zlofwv.svelte-zlofwv{grid-area:d;justify-self:end;display:flex;flex-wrap:wrap;justify-content:flex-end;margin-top:calc(var(--base-gutter) * -0.5)}.emotions.svelte-zlofwv>li.svelte-zlofwv{display:block;padding:2px 8px;border-radius:4px;background:var(--light-gray);border:1px solid var(--middle-gray);font-size:0.8rem;color:var(--dark-gray);margin-left:calc(var(--base-gutter) / 2);margin-top:calc(var(--base-gutter) / 2);text-transform:capitalize}.note.svelte-zlofwv.svelte-zlofwv{margin-top:calc(var(--base-gutter) / 2);font-style:italic;color:var(--dark-gray);line-height:1.4}.group-wrapper.svelte-zlofwv.svelte-zlofwv{margin-bottom:var(--base-gutter);position:relative}.group-wrapper.svelte-zlofwv.svelte-zlofwv:last-of-type{margin-bottom:0}.group-wrapper.svelte-zlofwv.svelte-zlofwv:before{z-index:1;position:absolute;content:"";width:0px;border-right:1px dotted var(--middle-gray);height:calc(100% - calc(var(--bullet-size) / 2 - 1px));left:calc(var(--bullet-size) / 2 - 1px);top:calc(var(--bullet-size) / 2 - 1px)}';
const css$7 = {
  code: 'ul.svelte-zlofwv.svelte-zlofwv{list-style:none}.emotion-card.svelte-zlofwv.svelte-zlofwv{margin:var(--base-gutter);padding:var(--base-gutter);border-radius:var(--roundy-bit-softness);background:var(--card-background);box-shadow:var(--soft-shadow);border:1px solid var(--middle-gray);position:relative;overflow:hidden;z-index:1;--bullet-size:11px;--list-gutter:4px}.delete-warning.svelte-zlofwv.svelte-zlofwv{opacity:0;pointer-events:none;display:flex;position:absolute;top:0;left:0;width:100%;height:100%;background:rgb(214 48 49 / 50%);z-index:5;justify-content:center;align-items:center;transition:0.25s opacity ease-in}.delete-warning.visible.svelte-zlofwv.svelte-zlofwv{opacity:1}.delete-warning.svelte-zlofwv i.svelte-zlofwv{width:32px;height:32px;fill:var(--red)}.header.svelte-zlofwv.svelte-zlofwv{display:flex;align-items:center;padding-bottom:calc(var(--base-gutter) / 2);margin-bottom:calc(var(--base-gutter) / 2);border-bottom:1px dashed var(--middle-gray)}.chevron.svelte-zlofwv.svelte-zlofwv{display:block;width:8px;height:8px;margin-left:4px;fill:var(--dark-gray);position:relative;transition:transform 0.2s ease-in-out}.emotion-card.expanded.svelte-zlofwv .chevron.svelte-zlofwv{transform:rotate(90deg)}.emotion-card.svelte-zlofwv:not(.expanded) .header.svelte-zlofwv{margin-bottom:0;border-bottom:none;padding-bottom:0}.timestamp.svelte-zlofwv.svelte-zlofwv{font-weight:600;text-align:right;margin-left:auto;color:var(--dark-gray);text-transform:capitalize}.emotion-group.svelte-zlofwv.svelte-zlofwv{text-transform:capitalize;font-weight:600;display:flex;align-items:center;margin-bottom:calc(var(--base-gutter) / 2)}.bullet.svelte-zlofwv.svelte-zlofwv{position:relative;display:block;content:"";width:var(--bullet-size);height:var(--bullet-size);border-radius:100%;margin-right:calc(var(--base-gutter) / 2);z-index:2;background:var(--white)}.bullet.low.svelte-zlofwv.svelte-zlofwv,.bullet.medium.svelte-zlofwv.svelte-zlofwv,.bullet.high.svelte-zlofwv.svelte-zlofwv{background:#FFF}.bullet.filled.svelte-zlofwv.svelte-zlofwv{border:none}.bullet.low.svelte-zlofwv.svelte-zlofwv{border:1px solid}.bullet.medium.svelte-zlofwv.svelte-zlofwv{border:2px solid}.bullet.high.svelte-zlofwv.svelte-zlofwv{border:3px solid}.levels.svelte-zlofwv>li.svelte-zlofwv{display:grid;grid-template-areas:"b l c"\n            "h d d";grid-template-columns:min-content 1fr min-content;align-items:center;justify-items:start;gap:var(--list-gutter) 0px;margin-bottom:calc(var(--base-gutter) / 2)}.levels.svelte-zlofwv>li.svelte-zlofwv:last-child{margin-bottom:0}.levels.svelte-zlofwv>li:last-child .hack.svelte-zlofwv{display:block}.levels.svelte-zlofwv .bullet.svelte-zlofwv{grid-area:b}.levels.svelte-zlofwv .level.svelte-zlofwv{text-transform:capitalize;grid-area:l}.hack.svelte-zlofwv.svelte-zlofwv{align-self:start;grid-area:h;display:none;position:relative;top:calc(var(--list-gutter) * -1 - 2px);content:"";width:100%;height:calc(100% + var(--list-gutter) + 2px);background:var(--white);z-index:2}.count.svelte-zlofwv.svelte-zlofwv{grid-area:c;white-space:nowrap}.emotions.svelte-zlofwv.svelte-zlofwv{grid-area:d;justify-self:end;display:flex;flex-wrap:wrap;justify-content:flex-end;margin-top:calc(var(--base-gutter) * -0.5)}.emotions.svelte-zlofwv>li.svelte-zlofwv{display:block;padding:2px 8px;border-radius:4px;background:var(--light-gray);border:1px solid var(--middle-gray);font-size:0.8rem;color:var(--dark-gray);margin-left:calc(var(--base-gutter) / 2);margin-top:calc(var(--base-gutter) / 2);text-transform:capitalize}.note.svelte-zlofwv.svelte-zlofwv{margin-top:calc(var(--base-gutter) / 2);font-style:italic;color:var(--dark-gray);line-height:1.4}.group-wrapper.svelte-zlofwv.svelte-zlofwv{margin-bottom:var(--base-gutter);position:relative}.group-wrapper.svelte-zlofwv.svelte-zlofwv:last-of-type{margin-bottom:0}.group-wrapper.svelte-zlofwv.svelte-zlofwv:before{z-index:1;position:absolute;content:"";width:0px;border-right:1px dotted var(--middle-gray);height:calc(100% - calc(var(--bullet-size) / 2 - 1px));left:calc(var(--bullet-size) / 2 - 1px);top:calc(var(--bullet-size) / 2 - 1px)}',
  map: '{"version":3,"file":"EmotionCard.svelte","sources":["EmotionCard.svelte"],"sourcesContent":["<script lang=\\"ts\\">import formatDistanceToNow from \\"date-fns/formatDistanceToNow\\";\\n;\\n;\\nimport { emotionToColor, reconstructEmotionMap } from \\"$lib/emotions\\";\\nimport Chevron from \'$lib/components/icons/Chevron.svelte\';\\nimport GlanceBar from \\"./GlanceBar.svelte\\";\\nimport Trash from \\"./icons/Trash.svelte\\";\\nexport let onDelete;\\nexport let event;\\nconst { date, emotions, note } = event;\\nlet deleteTimer;\\nlet showDeleteWarning = false;\\nlet expanded = false;\\nconst cardData = reconstructEmotionMap(emotions);\\nconst cardEntries = Object.entries(cardData);\\nfunction toggleExpanded() {\\n    expanded = !expanded;\\n}\\nfunction startDeleteTimer() {\\n    deleteTimer = setTimeout(function () {\\n        showDeleteWarning = true;\\n        deleteTimer = setTimeout(function () {\\n            if (confirm(\\"Are you sure you want to delete this entry?\\")) {\\n                onDelete();\\n            }\\n            showDeleteWarning = false;\\n        }, 500);\\n    }, 500);\\n}\\nfunction resetDeleteTime() {\\n    if (deleteTimer) {\\n        showDeleteWarning = false;\\n        clearTimeout(deleteTimer);\\n    }\\n}\\n</script>\\n\\n<div class=\\"emotion-card\\" class:expanded on:touchstart={startDeleteTimer} on:touchend={resetDeleteTime}>\\n    <div class=\\"delete-warning\\" class:visible={showDeleteWarning}>\\n        <i><Trash></Trash></i>\\n    </div>\\n    <div class=\\"header\\" on:click={toggleExpanded}>\\n        <GlanceBar emotions={emotions}></GlanceBar>\\n        <h3 class=\\"timestamp\\">{formatDistanceToNow(date)} Ago</h3>\\n        <i class=\\"chevron\\"><Chevron></Chevron></i>\\n    </div>\\n    {#if expanded}\\n        <dl>\\n            {#each cardEntries as emotionGroups}\\n                <div class=\\"group-wrapper\\">\\n                    <dt class=\\"emotion-group\\">\\n                        <span style={`background: ${emotionToColor(emotionGroups[0])}`} class=\\"bullet filled\\"></span>{emotionGroups[0]}\\n                    </dt>\\n                    <dd class=\\"breakdown\\">\\n                        <ul class=\\"levels\\">\\n                            {#each Object.entries(emotionGroups[1]) as emotionLevels}\\n                                <li>\\n                                    <span style={`border-color: ${emotionToColor(emotionGroups[0])}`} class={`bullet ${emotionLevels[0]}`}></span>\\n                                    <span class=\\"level\\">{emotionLevels[0]} Level</span>\\n                                    <span class=\\"count\\">\xD7 {emotionLevels[1].length}</span>\\n                                    <span class=\\"hack\\"></span>\\n                                    <ul class=\\"emotions\\">\\n                                        {#each emotionLevels[1] as emotion}\\n                                            <li>{emotion}</li>\\n                                        {/each}\\n                                    </ul>\\n                                </li>\\n                            {/each}\\n                        </ul>\\n                    </dd>\\n                </div>\\n            {/each}\\n        </dl>\\n        {#if note}\\n            <p class=\\"note\\">{note}</p>\\n        {/if}\\n    {/if}\\n</div>\\n\\n<style>\\n    ul {\\n        list-style: none;\\n    }\\n\\n    .emotion-card {\\n        margin: var(--base-gutter);\\n        padding: var(--base-gutter);\\n        border-radius: var(--roundy-bit-softness);\\n        background: var(--card-background);\\n        box-shadow: var(--soft-shadow);\\n        border: 1px solid var(--middle-gray);\\n        position: relative;\\n        overflow: hidden;\\n        z-index: 1;\\n\\n        /** Must be odd */\\n        --bullet-size: 11px;\\n        --list-gutter: 4px;\\n    }\\n\\n    .delete-warning {\\n        opacity: 0;\\n        pointer-events: none;\\n        display: flex;\\n        position: absolute;\\n        top: 0;\\n        left: 0;\\n        width: 100%;\\n        height: 100%;\\n        background: rgb(214 48 49 / 50%);\\n        z-index: 5;\\n        justify-content: center;\\n        align-items: center;\\n        transition: 0.25s opacity ease-in;\\n    }\\n\\n    .delete-warning.visible {\\n        opacity: 1;\\n    }\\n\\n    .delete-warning i {\\n        width: 32px;\\n        height: 32px;\\n        fill: var(--red);\\n    }\\n\\n    .header {\\n        display: flex;\\n        align-items: center;\\n        padding-bottom: calc(var(--base-gutter) / 2);\\n        margin-bottom: calc(var(--base-gutter) / 2);\\n        border-bottom: 1px dashed var(--middle-gray);\\n    }\\n\\n    .chevron {\\n        display: block;\\n        width: 8px;\\n        height: 8px;\\n        margin-left: 4px;\\n        fill: var(--dark-gray);\\n        position: relative;\\n        transition: transform 0.2s ease-in-out;\\n    }\\n\\n    .emotion-card.expanded .chevron {\\n        transform: rotate(90deg);\\n    }\\n\\n    .emotion-card:not(.expanded) .header {\\n        margin-bottom: 0;\\n        border-bottom: none;\\n        padding-bottom: 0;\\n    }\\n\\n\\n    .timestamp {\\n        font-weight: 600;\\n        text-align: right;\\n        margin-left: auto;\\n        color: var(--dark-gray);\\n        text-transform: capitalize;\\n    }\\n\\n    .emotion-group {\\n        text-transform: capitalize;\\n        font-weight: 600;\\n        display: flex;\\n        align-items: center;\\n        margin-bottom: calc(var(--base-gutter) / 2);\\n    }\\n\\n    .bullet {\\n        position: relative;\\n        display: block;\\n        content: \\"\\";\\n        width: var(--bullet-size);\\n        height: var(--bullet-size);\\n        border-radius: 100%;\\n        margin-right: calc(var(--base-gutter) / 2);\\n        z-index: 2;\\n        background: var(--white);\\n    }\\n\\n    .bullet.low,\\n    .bullet.medium,\\n    .bullet.high {\\n        background: #FFF;\\n    }\\n\\n    .bullet.filled {\\n        border: none;\\n    }\\n\\n    .bullet.low {\\n        border: 1px solid;\\n    }\\n\\n    .bullet.medium {\\n        border: 2px solid;\\n    }\\n\\n    .bullet.high {\\n        border: 3px solid;\\n    }\\n\\n    .levels > li {\\n        display: grid;\\n        grid-template-areas:\\n            \\"b l c\\"\\n            \\"h d d\\";\\n        grid-template-columns: min-content 1fr min-content;\\n        align-items: center;\\n        justify-items: start;\\n        gap: var(--list-gutter) 0px;\\n        margin-bottom: calc(var(--base-gutter) / 2);\\n    }\\n\\n    .levels > li:last-child {\\n        margin-bottom: 0;\\n    }\\n\\n    .levels > li:last-child .hack {\\n        display: block;\\n    }\\n\\n    .levels .bullet {\\n        grid-area: b;\\n    }\\n\\n    .levels .level {\\n        text-transform: capitalize;\\n        grid-area: l;\\n    }\\n\\n    .hack {\\n        align-self: start;\\n        grid-area: h;\\n        display: none;\\n        position: relative;\\n        top: calc(var(--list-gutter) * -1 - 2px);\\n        content: \\"\\";\\n        width: 100%;\\n        height: calc(100% + var(--list-gutter) + 2px);\\n        background: var(--white);\\n        z-index: 2;\\n    }\\n\\n    .count {\\n        grid-area: c;\\n        white-space: nowrap;\\n    }\\n\\n    .emotions {\\n        grid-area: d;\\n        justify-self: end;\\n        display: flex;\\n        flex-wrap: wrap;\\n        justify-content: flex-end;\\n        margin-top: calc(var(--base-gutter) * -0.5);\\n    }\\n\\n    .emotions > li {\\n        display: block;\\n        padding: 2px 8px;\\n        border-radius: 4px;\\n        background: var(--light-gray);\\n        border: 1px solid var(--middle-gray);\\n        font-size: 0.8rem;\\n        color: var(--dark-gray);\\n        margin-left: calc(var(--base-gutter) / 2);\\n        margin-top: calc(var(--base-gutter) / 2);\\n        text-transform: capitalize;\\n    }\\n\\n    .note {\\n        margin-top: calc(var(--base-gutter) / 2);\\n        font-style: italic;\\n        color: var(--dark-gray);\\n        line-height: 1.4;\\n    }\\n\\n    .group-wrapper {\\n        margin-bottom: var(--base-gutter);\\n        position: relative;\\n    }\\n\\n    .group-wrapper:last-of-type {\\n        margin-bottom: 0;\\n    }\\n\\n    .group-wrapper:before {\\n        z-index: 1;\\n        position: absolute;\\n        content: \\"\\";\\n        width: 0px;\\n        border-right: 1px dotted var(--middle-gray);\\n        height: calc(100% - calc(var(--bullet-size) / 2 - 1px));\\n        left: calc(var(--bullet-size) / 2 - 1px);\\n        top: calc(var(--bullet-size) / 2 - 1px);\\n    }\\n</style>\\n"],"names":[],"mappings":"AAgFI,EAAE,4BAAC,CAAC,AACA,UAAU,CAAE,IAAI,AACpB,CAAC,AAED,aAAa,4BAAC,CAAC,AACX,MAAM,CAAE,IAAI,aAAa,CAAC,CAC1B,OAAO,CAAE,IAAI,aAAa,CAAC,CAC3B,aAAa,CAAE,IAAI,qBAAqB,CAAC,CACzC,UAAU,CAAE,IAAI,iBAAiB,CAAC,CAClC,UAAU,CAAE,IAAI,aAAa,CAAC,CAC9B,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,aAAa,CAAC,CACpC,QAAQ,CAAE,QAAQ,CAClB,QAAQ,CAAE,MAAM,CAChB,OAAO,CAAE,CAAC,CAGV,aAAa,CAAE,IAAI,CACnB,aAAa,CAAE,GAAG,AACtB,CAAC,AAED,eAAe,4BAAC,CAAC,AACb,OAAO,CAAE,CAAC,CACV,cAAc,CAAE,IAAI,CACpB,OAAO,CAAE,IAAI,CACb,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,CAAC,CACP,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,UAAU,CAAE,IAAI,GAAG,CAAC,EAAE,CAAC,EAAE,CAAC,CAAC,CAAC,GAAG,CAAC,CAChC,OAAO,CAAE,CAAC,CACV,eAAe,CAAE,MAAM,CACvB,WAAW,CAAE,MAAM,CACnB,UAAU,CAAE,KAAK,CAAC,OAAO,CAAC,OAAO,AACrC,CAAC,AAED,eAAe,QAAQ,4BAAC,CAAC,AACrB,OAAO,CAAE,CAAC,AACd,CAAC,AAED,6BAAe,CAAC,CAAC,cAAC,CAAC,AACf,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,IAAI,CAAE,IAAI,KAAK,CAAC,AACpB,CAAC,AAED,OAAO,4BAAC,CAAC,AACL,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,cAAc,CAAE,KAAK,IAAI,aAAa,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAC5C,aAAa,CAAE,KAAK,IAAI,aAAa,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAC3C,aAAa,CAAE,GAAG,CAAC,MAAM,CAAC,IAAI,aAAa,CAAC,AAChD,CAAC,AAED,QAAQ,4BAAC,CAAC,AACN,OAAO,CAAE,KAAK,CACd,KAAK,CAAE,GAAG,CACV,MAAM,CAAE,GAAG,CACX,WAAW,CAAE,GAAG,CAChB,IAAI,CAAE,IAAI,WAAW,CAAC,CACtB,QAAQ,CAAE,QAAQ,CAClB,UAAU,CAAE,SAAS,CAAC,IAAI,CAAC,WAAW,AAC1C,CAAC,AAED,aAAa,uBAAS,CAAC,QAAQ,cAAC,CAAC,AAC7B,SAAS,CAAE,OAAO,KAAK,CAAC,AAC5B,CAAC,AAED,2BAAa,KAAK,SAAS,CAAC,CAAC,OAAO,cAAC,CAAC,AAClC,aAAa,CAAE,CAAC,CAChB,aAAa,CAAE,IAAI,CACnB,cAAc,CAAE,CAAC,AACrB,CAAC,AAGD,UAAU,4BAAC,CAAC,AACR,WAAW,CAAE,GAAG,CAChB,UAAU,CAAE,KAAK,CACjB,WAAW,CAAE,IAAI,CACjB,KAAK,CAAE,IAAI,WAAW,CAAC,CACvB,cAAc,CAAE,UAAU,AAC9B,CAAC,AAED,cAAc,4BAAC,CAAC,AACZ,cAAc,CAAE,UAAU,CAC1B,WAAW,CAAE,GAAG,CAChB,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,aAAa,CAAE,KAAK,IAAI,aAAa,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,AAC/C,CAAC,AAED,OAAO,4BAAC,CAAC,AACL,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,KAAK,CACd,OAAO,CAAE,EAAE,CACX,KAAK,CAAE,IAAI,aAAa,CAAC,CACzB,MAAM,CAAE,IAAI,aAAa,CAAC,CAC1B,aAAa,CAAE,IAAI,CACnB,YAAY,CAAE,KAAK,IAAI,aAAa,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAC1C,OAAO,CAAE,CAAC,CACV,UAAU,CAAE,IAAI,OAAO,CAAC,AAC5B,CAAC,AAED,OAAO,gCAAI,CACX,OAAO,mCAAO,CACd,OAAO,KAAK,4BAAC,CAAC,AACV,UAAU,CAAE,IAAI,AACpB,CAAC,AAED,OAAO,OAAO,4BAAC,CAAC,AACZ,MAAM,CAAE,IAAI,AAChB,CAAC,AAED,OAAO,IAAI,4BAAC,CAAC,AACT,MAAM,CAAE,GAAG,CAAC,KAAK,AACrB,CAAC,AAED,OAAO,OAAO,4BAAC,CAAC,AACZ,MAAM,CAAE,GAAG,CAAC,KAAK,AACrB,CAAC,AAED,OAAO,KAAK,4BAAC,CAAC,AACV,MAAM,CAAE,GAAG,CAAC,KAAK,AACrB,CAAC,AAED,qBAAO,CAAG,EAAE,cAAC,CAAC,AACV,OAAO,CAAE,IAAI,CACb,mBAAmB,CACf,OAAO;YACP,OAAO,CACX,qBAAqB,CAAE,WAAW,CAAC,GAAG,CAAC,WAAW,CAClD,WAAW,CAAE,MAAM,CACnB,aAAa,CAAE,KAAK,CACpB,GAAG,CAAE,IAAI,aAAa,CAAC,CAAC,GAAG,CAC3B,aAAa,CAAE,KAAK,IAAI,aAAa,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,AAC/C,CAAC,AAED,qBAAO,CAAG,gBAAE,WAAW,AAAC,CAAC,AACrB,aAAa,CAAE,CAAC,AACpB,CAAC,AAED,qBAAO,CAAG,EAAE,WAAW,CAAC,KAAK,cAAC,CAAC,AAC3B,OAAO,CAAE,KAAK,AAClB,CAAC,AAED,qBAAO,CAAC,OAAO,cAAC,CAAC,AACb,SAAS,CAAE,CAAC,AAChB,CAAC,AAED,qBAAO,CAAC,MAAM,cAAC,CAAC,AACZ,cAAc,CAAE,UAAU,CAC1B,SAAS,CAAE,CAAC,AAChB,CAAC,AAED,KAAK,4BAAC,CAAC,AACH,UAAU,CAAE,KAAK,CACjB,SAAS,CAAE,CAAC,CACZ,OAAO,CAAE,IAAI,CACb,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,KAAK,IAAI,aAAa,CAAC,CAAC,CAAC,CAAC,EAAE,CAAC,CAAC,CAAC,GAAG,CAAC,CACxC,OAAO,CAAE,EAAE,CACX,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,KAAK,IAAI,CAAC,CAAC,CAAC,IAAI,aAAa,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAC7C,UAAU,CAAE,IAAI,OAAO,CAAC,CACxB,OAAO,CAAE,CAAC,AACd,CAAC,AAED,MAAM,4BAAC,CAAC,AACJ,SAAS,CAAE,CAAC,CACZ,WAAW,CAAE,MAAM,AACvB,CAAC,AAED,SAAS,4BAAC,CAAC,AACP,SAAS,CAAE,CAAC,CACZ,YAAY,CAAE,GAAG,CACjB,OAAO,CAAE,IAAI,CACb,SAAS,CAAE,IAAI,CACf,eAAe,CAAE,QAAQ,CACzB,UAAU,CAAE,KAAK,IAAI,aAAa,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,AAC/C,CAAC,AAED,uBAAS,CAAG,EAAE,cAAC,CAAC,AACZ,OAAO,CAAE,KAAK,CACd,OAAO,CAAE,GAAG,CAAC,GAAG,CAChB,aAAa,CAAE,GAAG,CAClB,UAAU,CAAE,IAAI,YAAY,CAAC,CAC7B,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,aAAa,CAAC,CACpC,SAAS,CAAE,MAAM,CACjB,KAAK,CAAE,IAAI,WAAW,CAAC,CACvB,WAAW,CAAE,KAAK,IAAI,aAAa,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CACzC,UAAU,CAAE,KAAK,IAAI,aAAa,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CACxC,cAAc,CAAE,UAAU,AAC9B,CAAC,AAED,KAAK,4BAAC,CAAC,AACH,UAAU,CAAE,KAAK,IAAI,aAAa,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CACxC,UAAU,CAAE,MAAM,CAClB,KAAK,CAAE,IAAI,WAAW,CAAC,CACvB,WAAW,CAAE,GAAG,AACpB,CAAC,AAED,cAAc,4BAAC,CAAC,AACZ,aAAa,CAAE,IAAI,aAAa,CAAC,CACjC,QAAQ,CAAE,QAAQ,AACtB,CAAC,AAED,0CAAc,aAAa,AAAC,CAAC,AACzB,aAAa,CAAE,CAAC,AACpB,CAAC,AAED,0CAAc,OAAO,AAAC,CAAC,AACnB,OAAO,CAAE,CAAC,CACV,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,EAAE,CACX,KAAK,CAAE,GAAG,CACV,YAAY,CAAE,GAAG,CAAC,MAAM,CAAC,IAAI,aAAa,CAAC,CAC3C,MAAM,CAAE,KAAK,IAAI,CAAC,CAAC,CAAC,KAAK,IAAI,aAAa,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,CACvD,IAAI,CAAE,KAAK,IAAI,aAAa,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CACxC,GAAG,CAAE,KAAK,IAAI,aAAa,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,AAC3C,CAAC"}'
};
const EmotionCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let {onDelete} = $$props;
  let {event} = $$props;
  const {date, emotions: emotions2, note} = event;
  const cardData = reconstructEmotionMap(emotions2);
  Object.entries(cardData);
  if ($$props.onDelete === void 0 && $$bindings.onDelete && onDelete !== void 0)
    $$bindings.onDelete(onDelete);
  if ($$props.event === void 0 && $$bindings.event && event !== void 0)
    $$bindings.event(event);
  $$result.css.add(css$7);
  return `<div class="${["emotion-card svelte-zlofwv", ""].join(" ").trim()}"><div class="${["delete-warning svelte-zlofwv", ""].join(" ").trim()}"><i class="${"svelte-zlofwv"}">${validate_component(Trash, "Trash").$$render($$result, {}, {}, {})}</i></div>
    <div class="${"header svelte-zlofwv"}">${validate_component(GlanceBar, "GlanceBar").$$render($$result, {emotions: emotions2}, {}, {})}
        <h3 class="${"timestamp svelte-zlofwv"}">${escape(formatDistanceToNow(date))} Ago</h3>
        <i class="${"chevron svelte-zlofwv"}">${validate_component(Chevron, "Chevron").$$render($$result, {}, {}, {})}</i></div>
    ${``}
</div>`;
});
const Plus = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg enable-background="${"new 0 0 401.994 401.994"}" version="${"1.1"}" viewBox="${"0 0 401.994 401.994"}" xml:space="${"preserve"}" xmlns="${"http://www.w3.org/2000/svg"}"><path d="${"m394 154.18c-5.331-5.33-11.806-7.994-19.417-7.994h-118.77v-118.78c0-7.611-2.666-14.084-7.994-19.414-5.329-5.326-11.797-7.992-19.419-7.992h-54.812c-7.612 0-14.084 2.663-19.414 7.993s-7.994 11.803-7.994 19.414v118.78h-118.77c-7.611 0-14.084 2.664-19.414 7.994s-7.993 11.797-7.993 19.413v54.819c0 7.618 2.662 14.086 7.992 19.411 5.33 5.332 11.803 7.994 19.414 7.994h118.77v118.78c0 7.611 2.664 14.089 7.994 19.417 5.33 5.325 11.802 7.987 19.414 7.987h54.816c7.617 0 14.086-2.662 19.417-7.987 5.332-5.331 7.994-11.806 7.994-19.417v-118.78h118.77c7.618 0 14.089-2.662 19.417-7.994 5.329-5.325 7.994-11.793 7.994-19.411v-54.819c-2e-3 -7.616-2.661-14.087-7.993-19.414z"}"></path></svg>`;
});
var index_svelte_svelte_type_style_lang = ".scrollable.svelte-7pkgkg.svelte-7pkgkg{height:100%;overflow-y:scroll}.track.svelte-7pkgkg.svelte-7pkgkg{position:fixed;bottom:32px;right:32px;width:64px;height:64px;background:var(--cta);display:flex;justify-content:center;align-items:center;color:var(--white);border-radius:100%;font-weight:bold;box-shadow:var(--heavy-shadow);transition:0.1s transform ease-out}.track.svelte-7pkgkg.svelte-7pkgkg:active{transform:scale3d(0.9, 0.9, 1) translateY(2px) translateX(2px);outline:none}.track.svelte-7pkgkg>i.svelte-7pkgkg{width:25%;fill:white}";
const css$6 = {
  code: ".scrollable.svelte-7pkgkg.svelte-7pkgkg{height:100%;overflow-y:scroll}.track.svelte-7pkgkg.svelte-7pkgkg{position:fixed;bottom:32px;right:32px;width:64px;height:64px;background:var(--cta);display:flex;justify-content:center;align-items:center;color:var(--white);border-radius:100%;font-weight:bold;box-shadow:var(--heavy-shadow);transition:0.1s transform ease-out}.track.svelte-7pkgkg.svelte-7pkgkg:active{transform:scale3d(0.9, 0.9, 1) translateY(2px) translateX(2px);outline:none}.track.svelte-7pkgkg>i.svelte-7pkgkg{width:25%;fill:white}",
  map: `{"version":3,"file":"index.svelte","sources":["index.svelte"],"sourcesContent":["<script lang=\\"ts\\">var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\\n    return new (P || (P = Promise))(function (resolve, reject) {\\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\\n        function rejected(value) { try { step(generator[\\"throw\\"](value)); } catch (e) { reject(e); } }\\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\\n    });\\n};\\nimport { goto } from '$app/navigation';\\nimport { db } from '$lib/db';\\nimport EmotionCard from \\"$lib/components/EmotionCard.svelte\\";\\nimport Plus from '$lib/components/icons/Plus.svelte';\\nlet latestEntries = getLatestEntries();\\nfunction getLatestEntries() {\\n    return db.events.orderBy(\\"date\\").reverse().toArray();\\n}\\nfunction newEvent() {\\n    goto(\\"/track\\");\\n}\\nfunction deleteEntry(entryId) {\\n    return __awaiter(this, void 0, void 0, function* () {\\n        yield db.events.delete(entryId);\\n        latestEntries = getLatestEntries();\\n    });\\n}\\n</script>\\n\\n<div class=\\"scrollable\\">\\n    {#await latestEntries then entries}\\n        {#each entries as entry}\\n            <EmotionCard onDelete={() => deleteEntry(entry.id)} event={entry}></EmotionCard>\\n        {/each}\\n    {/await}\\n\\n    <button class=\\"track\\" on:click={newEvent}>\\n        <i><Plus></Plus></i>\\n    </button>\\n</div>\\n\\n<style>\\n    .scrollable {\\n        height: 100%;\\n        overflow-y: scroll;\\n    }\\n\\n    .track {\\n        position: fixed;\\n        bottom: 32px;\\n        right: 32px;\\n        width: 64px;\\n        height: 64px;\\n        background: var(--cta);\\n        display: flex;\\n        justify-content: center;\\n        align-items: center;\\n        color: var(--white);\\n        border-radius: 100%;\\n        font-weight: bold;\\n        box-shadow: var(--heavy-shadow);\\n        transition: 0.1s transform ease-out;\\n    }\\n\\n    .track:active {\\n        transform: scale3d(0.9, 0.9, 1) translateY(2px) translateX(2px);\\n        outline: none;\\n    }\\n\\n    .track > i {\\n        width: 25%;\\n        fill: white;\\n    }\\n</style>\\n"],"names":[],"mappings":"AAyCI,WAAW,4BAAC,CAAC,AACT,MAAM,CAAE,IAAI,CACZ,UAAU,CAAE,MAAM,AACtB,CAAC,AAED,MAAM,4BAAC,CAAC,AACJ,QAAQ,CAAE,KAAK,CACf,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,IAAI,CACX,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,UAAU,CAAE,IAAI,KAAK,CAAC,CACtB,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,MAAM,CACvB,WAAW,CAAE,MAAM,CACnB,KAAK,CAAE,IAAI,OAAO,CAAC,CACnB,aAAa,CAAE,IAAI,CACnB,WAAW,CAAE,IAAI,CACjB,UAAU,CAAE,IAAI,cAAc,CAAC,CAC/B,UAAU,CAAE,IAAI,CAAC,SAAS,CAAC,QAAQ,AACvC,CAAC,AAED,kCAAM,OAAO,AAAC,CAAC,AACX,SAAS,CAAE,QAAQ,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,CAAC,CAAC,CAAC,WAAW,GAAG,CAAC,CAAC,WAAW,GAAG,CAAC,CAC/D,OAAO,CAAE,IAAI,AACjB,CAAC,AAED,oBAAM,CAAG,CAAC,cAAC,CAAC,AACR,KAAK,CAAE,GAAG,CACV,IAAI,CAAE,KAAK,AACf,CAAC"}`
};
const Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var __awaiter = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve2) {
        resolve2(value);
      });
    }
    return new (P || (P = Promise))(function(resolve2, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  let latestEntries = getLatestEntries();
  function getLatestEntries() {
    return db.events.orderBy("date").reverse().toArray();
  }
  function deleteEntry(entryId) {
    return __awaiter(this, void 0, void 0, function* () {
      yield db.events.delete(entryId);
      latestEntries = getLatestEntries();
    });
  }
  $$result.css.add(css$6);
  return `<div class="${"scrollable svelte-7pkgkg"}">${function(__value) {
    if (is_promise(__value))
      return ``;
    return function(entries) {
      return `
        ${each(entries, (entry) => `${validate_component(EmotionCard, "EmotionCard").$$render($$result, {
        onDelete: () => deleteEntry(entry.id),
        event: entry
      }, {}, {})}`)}
    `;
    }(__value);
  }(latestEntries)}

    <button class="${"track svelte-7pkgkg"}"><i class="${"svelte-7pkgkg"}">${validate_component(Plus, "Plus").$$render($$result, {}, {}, {})}</i></button>
</div>`;
});
var index = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  default: Routes
});
const subscriber_queue = [];
function writable(value, start = noop) {
  let stop;
  const subscribers = [];
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (let i = 0; i < subscribers.length; i += 1) {
          const s2 = subscribers[i];
          s2[1]();
          subscriber_queue.push(s2, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.push(subscriber);
    if (subscribers.length === 1) {
      stop = start(set) || noop;
    }
    run2(value);
    return () => {
      const index2 = subscribers.indexOf(subscriber);
      if (index2 !== -1) {
        subscribers.splice(index2, 1);
      }
      if (subscribers.length === 0) {
        stop();
        stop = null;
      }
    };
  }
  return {set, update, subscribe: subscribe2};
}
function is_date(obj) {
  return Object.prototype.toString.call(obj) === "[object Date]";
}
function tick_spring(ctx, last_value, current_value, target_value) {
  if (typeof current_value === "number" || is_date(current_value)) {
    const delta = target_value - current_value;
    const velocity = (current_value - last_value) / (ctx.dt || 1 / 60);
    const spring2 = ctx.opts.stiffness * delta;
    const damper = ctx.opts.damping * velocity;
    const acceleration = (spring2 - damper) * ctx.inv_mass;
    const d = (velocity + acceleration) * ctx.dt;
    if (Math.abs(d) < ctx.opts.precision && Math.abs(delta) < ctx.opts.precision) {
      return target_value;
    } else {
      ctx.settled = false;
      return is_date(current_value) ? new Date(current_value.getTime() + d) : current_value + d;
    }
  } else if (Array.isArray(current_value)) {
    return current_value.map((_, i) => tick_spring(ctx, last_value[i], current_value[i], target_value[i]));
  } else if (typeof current_value === "object") {
    const next_value = {};
    for (const k in current_value) {
      next_value[k] = tick_spring(ctx, last_value[k], current_value[k], target_value[k]);
    }
    return next_value;
  } else {
    throw new Error(`Cannot spring ${typeof current_value} values`);
  }
}
function spring(value, opts = {}) {
  const store = writable(value);
  const {stiffness = 0.15, damping = 0.8, precision = 0.01} = opts;
  let last_time;
  let task2;
  let current_token;
  let last_value = value;
  let target_value = value;
  let inv_mass = 1;
  let inv_mass_recovery_rate = 0;
  let cancel_task = false;
  function set(new_value, opts2 = {}) {
    target_value = new_value;
    const token = current_token = {};
    if (value == null || opts2.hard || spring2.stiffness >= 1 && spring2.damping >= 1) {
      cancel_task = true;
      last_time = now();
      last_value = new_value;
      store.set(value = target_value);
      return Promise.resolve();
    } else if (opts2.soft) {
      const rate = opts2.soft === true ? 0.5 : +opts2.soft;
      inv_mass_recovery_rate = 1 / (rate * 60);
      inv_mass = 0;
    }
    if (!task2) {
      last_time = now();
      cancel_task = false;
      task2 = loop((now2) => {
        if (cancel_task) {
          cancel_task = false;
          task2 = null;
          return false;
        }
        inv_mass = Math.min(inv_mass + inv_mass_recovery_rate, 1);
        const ctx = {
          inv_mass,
          opts: spring2,
          settled: true,
          dt: (now2 - last_time) * 60 / 1e3
        };
        const next_value = tick_spring(ctx, last_value, value, target_value);
        last_time = now2;
        last_value = value;
        store.set(value = next_value);
        if (ctx.settled) {
          task2 = null;
        }
        return !ctx.settled;
      });
    }
    return new Promise((fulfil) => {
      task2.promise.then(() => {
        if (token === current_token)
          fulfil();
      });
    });
  }
  const spring2 = {
    set,
    update: (fn, opts2) => set(fn(target_value, value), opts2),
    subscribe: store.subscribe,
    stiffness,
    damping,
    precision
  };
  return spring2;
}
var EmotionButton_svelte_svelte_type_style_lang = ".emotion-button.svelte-dgbom4.svelte-dgbom4{display:block;height:100%;font-weight:500;font-size:1rem;text-transform:capitalize;position:relative;border-radius:var(--roundy-bit-softness);box-shadow:0px 3px 5px rgb(152 152 152 / 12%)}.layer-1.svelte-dgbom4.svelte-dgbom4,.layer-2.svelte-dgbom4.svelte-dgbom4{display:grid;place-items:center;position:absolute;top:0;left:0;width:100%;height:100%;border-radius:var(--roundy-bit-softness);border:1px solid var(--middle-gray);transition:clip-path 0.6s cubic-bezier(0.76, 0, 0.24, 1)}.layer-1.svelte-dgbom4.svelte-dgbom4{z-index:1;background:#FFF}.layer-2.svelte-dgbom4.svelte-dgbom4{z-index:2;clip-path:circle(0%);background:var(--blue);color:#FFF}.emotion-button.active.svelte-dgbom4.svelte-dgbom4{animation-duration:0.75s;animation-name:svelte-dgbom4-click;animation-fill-mode:forwards;animation-iteration-count:1}.emotion-button.active.svelte-dgbom4 .layer-2.svelte-dgbom4{clip-path:circle(100%)}@keyframes svelte-dgbom4-click{0%{transform:scale3d(1, 1, 1)}20%{transform:scale3d(0.9, 0.9, 1)}100%{transform:scale3d(1, 1, 1)}}";
const css$5 = {
  code: ".emotion-button.svelte-dgbom4.svelte-dgbom4{display:block;height:100%;font-weight:500;font-size:1rem;text-transform:capitalize;position:relative;border-radius:var(--roundy-bit-softness);box-shadow:0px 3px 5px rgb(152 152 152 / 12%)}.layer-1.svelte-dgbom4.svelte-dgbom4,.layer-2.svelte-dgbom4.svelte-dgbom4{display:grid;place-items:center;position:absolute;top:0;left:0;width:100%;height:100%;border-radius:var(--roundy-bit-softness);border:1px solid var(--middle-gray);transition:clip-path 0.6s cubic-bezier(0.76, 0, 0.24, 1)}.layer-1.svelte-dgbom4.svelte-dgbom4{z-index:1;background:#FFF}.layer-2.svelte-dgbom4.svelte-dgbom4{z-index:2;clip-path:circle(0%);background:var(--blue);color:#FFF}.emotion-button.active.svelte-dgbom4.svelte-dgbom4{animation-duration:0.75s;animation-name:svelte-dgbom4-click;animation-fill-mode:forwards;animation-iteration-count:1}.emotion-button.active.svelte-dgbom4 .layer-2.svelte-dgbom4{clip-path:circle(100%)}@keyframes svelte-dgbom4-click{0%{transform:scale3d(1, 1, 1)}20%{transform:scale3d(0.9, 0.9, 1)}100%{transform:scale3d(1, 1, 1)}}",
  map: `{"version":3,"file":"EmotionButton.svelte","sources":["EmotionButton.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { createEventDispatcher } from 'svelte';\\n;\\nexport let emotion;\\nconst dispatch = createEventDispatcher();\\nlet active = false;\\nfunction onClick(_event) {\\n    active = !active;\\n    dispatch('toggle', active);\\n}\\n</script>\\n\\n<button\\n    on:mouseup={onClick}\\n    class=\\"emotion-button\\"\\n    class:active\\n>\\n    <div class=\\"layer-1\\">\\n        {emotion}\\n    </div>\\n    <div class=\\"layer-2\\">\\n        {emotion}\\n    </div>\\n</button>\\n\\n<style>\\n    .emotion-button {\\n        display: block;\\n        height: 100%;\\n        font-weight: 500;\\n        font-size: 1rem;\\n        text-transform: capitalize;\\n        position: relative;\\n        border-radius: var(--roundy-bit-softness);\\n        box-shadow: 0px 3px 5px rgb(152 152 152 / 12%);\\n    }\\n\\n    .layer-1,\\n    .layer-2 {\\n        display: grid;\\n        place-items: center;\\n        position: absolute;\\n        top: 0;\\n        left: 0;\\n        width: 100%;\\n        height: 100%;\\n        border-radius: var(--roundy-bit-softness);\\n        border: 1px solid var(--middle-gray);\\n        transition: clip-path 0.6s cubic-bezier(0.76, 0, 0.24, 1);\\n    }\\n\\n    .layer-1 {\\n        z-index: 1;\\n        background: #FFF;\\n    }\\n\\n    .layer-2 {\\n        z-index: 2;\\n        clip-path: circle(0%);\\n        background: var(--blue);\\n        color: #FFF;\\n    }\\n\\n    .emotion-button.active {\\n        animation-duration: 0.75s;\\n        animation-name: click;\\n        animation-fill-mode: forwards;\\n        animation-iteration-count: 1;\\n    }\\n\\n    .emotion-button.active .layer-2 {\\n        clip-path: circle(100%);\\n    }\\n\\n    @keyframes click {\\n        0% {\\n            transform: scale3d(1, 1, 1);\\n        }\\n\\n        20% {\\n            transform: scale3d(0.9, 0.9, 1);\\n        }\\n\\n        100% {\\n            transform: scale3d(1, 1, 1);\\n        }\\n    }\\n</style>\\n"],"names":[],"mappings":"AAyBI,eAAe,4BAAC,CAAC,AACb,OAAO,CAAE,KAAK,CACd,MAAM,CAAE,IAAI,CACZ,WAAW,CAAE,GAAG,CAChB,SAAS,CAAE,IAAI,CACf,cAAc,CAAE,UAAU,CAC1B,QAAQ,CAAE,QAAQ,CAClB,aAAa,CAAE,IAAI,qBAAqB,CAAC,CACzC,UAAU,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,IAAI,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,CAAC,CAAC,GAAG,CAAC,AAClD,CAAC,AAED,oCAAQ,CACR,QAAQ,4BAAC,CAAC,AACN,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,CAAC,CACP,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,aAAa,CAAE,IAAI,qBAAqB,CAAC,CACzC,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,aAAa,CAAC,CACpC,UAAU,CAAE,SAAS,CAAC,IAAI,CAAC,aAAa,IAAI,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC,AAC7D,CAAC,AAED,QAAQ,4BAAC,CAAC,AACN,OAAO,CAAE,CAAC,CACV,UAAU,CAAE,IAAI,AACpB,CAAC,AAED,QAAQ,4BAAC,CAAC,AACN,OAAO,CAAE,CAAC,CACV,SAAS,CAAE,OAAO,EAAE,CAAC,CACrB,UAAU,CAAE,IAAI,MAAM,CAAC,CACvB,KAAK,CAAE,IAAI,AACf,CAAC,AAED,eAAe,OAAO,4BAAC,CAAC,AACpB,kBAAkB,CAAE,KAAK,CACzB,cAAc,CAAE,mBAAK,CACrB,mBAAmB,CAAE,QAAQ,CAC7B,yBAAyB,CAAE,CAAC,AAChC,CAAC,AAED,eAAe,qBAAO,CAAC,QAAQ,cAAC,CAAC,AAC7B,SAAS,CAAE,OAAO,IAAI,CAAC,AAC3B,CAAC,AAED,WAAW,mBAAM,CAAC,AACd,EAAE,AAAC,CAAC,AACA,SAAS,CAAE,QAAQ,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,AAC/B,CAAC,AAED,GAAG,AAAC,CAAC,AACD,SAAS,CAAE,QAAQ,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,CAAC,CAAC,AACnC,CAAC,AAED,IAAI,AAAC,CAAC,AACF,SAAS,CAAE,QAAQ,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,AAC/B,CAAC,AACL,CAAC"}`
};
const EmotionButton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let {emotion} = $$props;
  createEventDispatcher();
  if ($$props.emotion === void 0 && $$bindings.emotion && emotion !== void 0)
    $$bindings.emotion(emotion);
  $$result.css.add(css$5);
  return `<button class="${["emotion-button svelte-dgbom4", ""].join(" ").trim()}"><div class="${"layer-1 svelte-dgbom4"}">${escape(emotion)}</div>
    <div class="${"layer-2 svelte-dgbom4"}">${escape(emotion)}</div>
</button>`;
});
var SlideTracker_svelte_svelte_type_style_lang = ".slide-tracker.svelte-1lx93cv{position:relative;display:flex;--bullet-outer-size:20px;--bullet-inner-size:12px}.bullet-block.svelte-1lx93cv{position:relative;display:grid;place-items:center;width:var(--bullet-outer-size);height:var(--bullet-outer-size)}.bullet.svelte-1lx93cv{width:var(--bullet-inner-size);height:var(--bullet-inner-size);background:#d5dff1;border-radius:100%}.bullet-active.svelte-1lx93cv{position:absolute;top:0;left:0;width:var(--bullet-outer-size);height:var(--bullet-outer-size);background:var(--green);border-radius:100%}";
const css$4 = {
  code: ".slide-tracker.svelte-1lx93cv{position:relative;display:flex;--bullet-outer-size:20px;--bullet-inner-size:12px}.bullet-block.svelte-1lx93cv{position:relative;display:grid;place-items:center;width:var(--bullet-outer-size);height:var(--bullet-outer-size)}.bullet.svelte-1lx93cv{width:var(--bullet-inner-size);height:var(--bullet-inner-size);background:#d5dff1;border-radius:100%}.bullet-active.svelte-1lx93cv{position:absolute;top:0;left:0;width:var(--bullet-outer-size);height:var(--bullet-outer-size);background:var(--green);border-radius:100%}",
  map: `{"version":3,"file":"SlideTracker.svelte","sources":["SlideTracker.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { spring } from 'svelte/motion';\\nexport let bulletCount;\\nexport let currentIndex;\\nconst highlightOffset = spring(0, {\\n    stiffness: 0.4,\\n    damping: 0.9\\n});\\n$: $highlightOffset = currentIndex * 20;\\n</script>\\n\\n<ul class=\\"slide-tracker\\">\\n    <span class=\\"bullet-active\\" style=\\"transform: translateX({$highlightOffset}px);\\"></span>\\n    {#each [...Array(bulletCount)] as _, idx}\\n        <li class=\\"bullet-block\\" class:active={currentIndex === idx}>\\n            <span class=\\"bullet\\"></span>\\n        </li>\\n    {/each}\\n</ul>\\n\\n<style>\\n    .slide-tracker {\\n        position: relative;\\n        display: flex;\\n\\n        --bullet-outer-size: 20px;\\n        --bullet-inner-size: 12px;\\n    }\\n\\n    .bullet-block {\\n        position: relative;\\n        display: grid;\\n        place-items: center;\\n        width: var(--bullet-outer-size);\\n        height: var(--bullet-outer-size);\\n    }\\n\\n    .bullet {\\n        width: var(--bullet-inner-size);\\n        height: var(--bullet-inner-size);\\n        background: #d5dff1;\\n        border-radius: 100%;\\n    }\\n\\n    .bullet-active {\\n        position: absolute;\\n        top: 0;\\n        left: 0;\\n        width: var(--bullet-outer-size);\\n        height: var(--bullet-outer-size);\\n        background: var(--green);\\n        border-radius: 100%;\\n    }\\n</style>\\n"],"names":[],"mappings":"AAoBI,cAAc,eAAC,CAAC,AACZ,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,IAAI,CAEb,mBAAmB,CAAE,IAAI,CACzB,mBAAmB,CAAE,IAAI,AAC7B,CAAC,AAED,aAAa,eAAC,CAAC,AACX,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,KAAK,CAAE,IAAI,mBAAmB,CAAC,CAC/B,MAAM,CAAE,IAAI,mBAAmB,CAAC,AACpC,CAAC,AAED,OAAO,eAAC,CAAC,AACL,KAAK,CAAE,IAAI,mBAAmB,CAAC,CAC/B,MAAM,CAAE,IAAI,mBAAmB,CAAC,CAChC,UAAU,CAAE,OAAO,CACnB,aAAa,CAAE,IAAI,AACvB,CAAC,AAED,cAAc,eAAC,CAAC,AACZ,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,CAAC,CACP,KAAK,CAAE,IAAI,mBAAmB,CAAC,CAC/B,MAAM,CAAE,IAAI,mBAAmB,CAAC,CAChC,UAAU,CAAE,IAAI,OAAO,CAAC,CACxB,aAAa,CAAE,IAAI,AACvB,CAAC"}`
};
const SlideTracker = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $highlightOffset, $$unsubscribe_highlightOffset;
  let {bulletCount} = $$props;
  let {currentIndex} = $$props;
  const highlightOffset = spring(0, {stiffness: 0.4, damping: 0.9});
  $$unsubscribe_highlightOffset = subscribe(highlightOffset, (value) => $highlightOffset = value);
  if ($$props.bulletCount === void 0 && $$bindings.bulletCount && bulletCount !== void 0)
    $$bindings.bulletCount(bulletCount);
  if ($$props.currentIndex === void 0 && $$bindings.currentIndex && currentIndex !== void 0)
    $$bindings.currentIndex(currentIndex);
  $$result.css.add(css$4);
  set_store_value(highlightOffset, $highlightOffset = currentIndex * 20, $highlightOffset);
  $$unsubscribe_highlightOffset();
  return `<ul class="${"slide-tracker svelte-1lx93cv"}"><span class="${"bullet-active svelte-1lx93cv"}" style="${"transform: translateX(" + escape($highlightOffset) + "px);"}"></span>
    ${each([...Array(bulletCount)], (_, idx) => `<li class="${["bullet-block svelte-1lx93cv", currentIndex === idx ? "active" : ""].join(" ").trim()}"><span class="${"bullet svelte-1lx93cv"}"></span>
        </li>`)}
</ul>`;
});
var PanelSlider_svelte_svelte_type_style_lang = ".picker-viewport.svelte-exbv0m{display:flex;flex-direction:column;overflow-x:hidden;width:100%;height:100%}.container.svelte-exbv0m{display:flex;height:100%}.tracker-container.svelte-exbv0m{display:flex;justify-content:center}";
const css$3 = {
  code: ".picker-viewport.svelte-exbv0m{display:flex;flex-direction:column;overflow-x:hidden;width:100%;height:100%}.container.svelte-exbv0m{display:flex;height:100%}.tracker-container.svelte-exbv0m{display:flex;justify-content:center}",
  map: `{"version":3,"file":"PanelSlider.svelte","sources":["PanelSlider.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { onMount } from 'svelte';\\nimport { spring } from 'svelte/motion';\\nimport SlideTracker from '$lib/components/SlideTracker.svelte';\\n/** A touch gesture with a magnitude less than this will be considered a tap, not a pan */\\nconst TAP_PAN_THRESHOLD = 10;\\nlet touchVector;\\nlet clientInnerWidth;\\nlet currentIndex = 0;\\nlet touchStart = undefined;\\nlet touchEnd = undefined;\\nexport let sectionCount;\\nonMount(() => clientInnerWidth = window.innerWidth);\\nconst containerOffset = spring(0, {\\n    stiffness: 0.1,\\n    damping: 0.9\\n});\\n/** Maintain a vector for the movement of a touch/panning motion */\\n$: touchVector = (touchStart && touchEnd)\\n    ? [(touchEnd[0] - touchStart[0]), (touchEnd[1] - touchStart[1])]\\n    : [0, 0];\\n/** The x-component of the touchVector */\\n$: touchOffsetX = touchVector[0];\\n/** The touch offset vector clamped to within the pan/tap threshold */\\n$: clampedTouchOffsetX = Math.abs(touchOffsetX) > TAP_PAN_THRESHOLD\\n    ? touchOffsetX\\n    : 0;\\n/** Calculate the offset for the slider - springs to the current slide index */\\n$: $containerOffset = clampedTouchOffsetX - (clientInnerWidth * currentIndex);\\n/** Maintain the bounds of the current index within the displayable area */\\n$: {\\n    if (currentIndex < 0) {\\n        currentIndex = 0;\\n    }\\n    if (currentIndex >= sectionCount - 1) {\\n        currentIndex = sectionCount - 1;\\n    }\\n}\\n;\\nfunction reset() {\\n    touchStart = undefined;\\n    touchEnd = undefined;\\n}\\nfunction handleStart(event) {\\n    reset();\\n    touchStart = [event.touches[0].clientX, event.touches[0].clientY];\\n}\\nfunction handleEnd(event) {\\n    if (touchOffsetX < -100)\\n        currentIndex += 1;\\n    if (touchOffsetX > 100)\\n        currentIndex -= 1;\\n    // If this isn't a pan, it's a tap - dispatch a mouseup event\\n    if (clampedTouchOffsetX === 0) {\\n        const mouseEvent = document.createEvent(\\"MouseEvents\\");\\n        mouseEvent.initMouseEvent(\\"mouseup\\", true, true, \\n        // @ts-ignore\\n        event.target.ownerDocument.defaultView, 0, event.changedTouches[0].screenX, event.changedTouches[0].screenY, event.changedTouches[0].clientX, event.changedTouches[0].clientY, event.ctrlKey, event.altKey, event.shiftKey, event.metaKey, 0, null);\\n        event.target.dispatchEvent(mouseEvent);\\n    }\\n    reset();\\n}\\nfunction handleMove(event) {\\n    touchEnd = [event.touches[0].clientX, event.touches[0].clientY];\\n}\\n</script>\\n\\n<svelte:window bind:innerWidth={clientInnerWidth}></svelte:window>\\n\\n<section class=\\"picker-viewport\\">\\n    <div\\n        on:touchstart|preventDefault|stopPropagation={handleStart}\\n        on:touchmove|preventDefault|stopPropagation={handleMove}\\n        on:touchend|preventDefault|stopPropagation={handleEnd}\\n        on:touchcancel|preventDefault|stopPropagation={handleEnd}\\n        class=\\"container\\"\\n        style=\\"transform: translateX({$containerOffset}px); width: {sectionCount * 100}%;\\"\\n    >\\n        <slot name=\\"panels\\"></slot>\\n    </div>\\n\\n    <div class=\\"tracker-container\\">\\n        <SlideTracker bulletCount={sectionCount} {currentIndex}></SlideTracker>\\n    </div>\\n\\n    <slot name=\\"additional-content\\"></slot>\\n</section>\\n\\n<style>\\n    .picker-viewport {\\n        display: flex;\\n        flex-direction: column;\\n        overflow-x: hidden;\\n        width: 100%;\\n        height: 100%;\\n    }\\n\\n    .container {\\n        display: flex;\\n        height: 100%;\\n    }\\n\\n    .tracker-container {\\n        display: flex;\\n        justify-content: center;\\n    }\\n</style>\\n"],"names":[],"mappings":"AAwFI,gBAAgB,cAAC,CAAC,AACd,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,UAAU,CAAE,MAAM,CAClB,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,AAChB,CAAC,AAED,UAAU,cAAC,CAAC,AACR,OAAO,CAAE,IAAI,CACb,MAAM,CAAE,IAAI,AAChB,CAAC,AAED,kBAAkB,cAAC,CAAC,AAChB,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,MAAM,AAC3B,CAAC"}`
};
const TAP_PAN_THRESHOLD = 10;
const PanelSlider = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let touchOffsetX;
  let clampedTouchOffsetX;
  let $containerOffset, $$unsubscribe_containerOffset;
  let touchVector;
  let clientInnerWidth;
  let currentIndex = 0;
  let {sectionCount} = $$props;
  onMount(() => clientInnerWidth = window.innerWidth);
  const containerOffset = spring(0, {stiffness: 0.1, damping: 0.9});
  $$unsubscribe_containerOffset = subscribe(containerOffset, (value) => $containerOffset = value);
  if ($$props.sectionCount === void 0 && $$bindings.sectionCount && sectionCount !== void 0)
    $$bindings.sectionCount(sectionCount);
  $$result.css.add(css$3);
  touchVector = [0, 0];
  touchOffsetX = touchVector[0];
  clampedTouchOffsetX = Math.abs(touchOffsetX) > TAP_PAN_THRESHOLD ? touchOffsetX : 0;
  {
    {
      if (currentIndex < 0) {
        currentIndex = 0;
      }
      if (currentIndex >= sectionCount - 1) {
        currentIndex = sectionCount - 1;
      }
    }
  }
  set_store_value(containerOffset, $containerOffset = clampedTouchOffsetX - clientInnerWidth * currentIndex, $containerOffset);
  $$unsubscribe_containerOffset();
  return `

<section class="${"picker-viewport svelte-exbv0m"}"><div class="${"container svelte-exbv0m"}" style="${"transform: translateX(" + escape($containerOffset) + "px); width: " + escape(sectionCount * 100) + "%;"}">${slots.panels ? slots.panels({}) : ``}</div>

    <div class="${"tracker-container svelte-exbv0m"}">${validate_component(SlideTracker, "SlideTracker").$$render($$result, {bulletCount: sectionCount, currentIndex}, {}, {})}</div>

    ${slots["additional-content"] ? slots["additional-content"]({}) : ``}
</section>`;
});
var Panel_svelte_svelte_type_style_lang = ".panel.svelte-mrp05o{display:flex;flex-direction:column;align-items:flex-start;width:100vw;flex-grow:0;flex-shrink:0;color:#333;min-height:100%;padding:var(--base-gutter)}.panel-header.svelte-mrp05o{display:block;margin-bottom:var(--base-gutter);font-size:1.5rem;font-weight:600;text-transform:capitalize;text-align:left}";
const css$2 = {
  code: ".panel.svelte-mrp05o{display:flex;flex-direction:column;align-items:flex-start;width:100vw;flex-grow:0;flex-shrink:0;color:#333;min-height:100%;padding:var(--base-gutter)}.panel-header.svelte-mrp05o{display:block;margin-bottom:var(--base-gutter);font-size:1.5rem;font-weight:600;text-transform:capitalize;text-align:left}",
  map: '{"version":3,"file":"Panel.svelte","sources":["Panel.svelte"],"sourcesContent":["<script lang=\\"ts\\">export let title;\\n</script>\\n\\n<section class=\\"panel\\">\\n    <h1 class=\\"panel-header\\">{title}</h1>\\n    <slot></slot>\\n</section>\\n\\n<style>\\n    .panel {\\n        display: flex;\\n        flex-direction: column;\\n        align-items: flex-start;\\n        width: 100vw;\\n        flex-grow: 0;\\n        flex-shrink: 0;\\n        color: #333;\\n        min-height: 100%;\\n        padding: var(--base-gutter);\\n    }\\n\\n    .panel-header {\\n        display: block;\\n        margin-bottom: var(--base-gutter);\\n        font-size: 1.5rem;\\n        font-weight: 600;\\n        text-transform: capitalize;\\n        text-align: left;\\n    }\\n</style>\\n"],"names":[],"mappings":"AASI,MAAM,cAAC,CAAC,AACJ,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,WAAW,CAAE,UAAU,CACvB,KAAK,CAAE,KAAK,CACZ,SAAS,CAAE,CAAC,CACZ,WAAW,CAAE,CAAC,CACd,KAAK,CAAE,IAAI,CACX,UAAU,CAAE,IAAI,CAChB,OAAO,CAAE,IAAI,aAAa,CAAC,AAC/B,CAAC,AAED,aAAa,cAAC,CAAC,AACX,OAAO,CAAE,KAAK,CACd,aAAa,CAAE,IAAI,aAAa,CAAC,CACjC,SAAS,CAAE,MAAM,CACjB,WAAW,CAAE,GAAG,CAChB,cAAc,CAAE,UAAU,CAC1B,UAAU,CAAE,IAAI,AACpB,CAAC"}'
};
const Panel = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let {title} = $$props;
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  $$result.css.add(css$2);
  return `<section class="${"panel svelte-mrp05o"}"><h1 class="${"panel-header svelte-mrp05o"}">${escape(title)}</h1>
    ${slots.default ? slots.default({}) : ``}
</section>`;
});
var track_svelte_svelte_type_style_lang = ".wizard-viewport.svelte-xur6gl.svelte-xur6gl{width:100%;height:200%;position:relative;overflow:hidden;display:flex;flex-direction:column}.step.svelte-xur6gl.svelte-xur6gl{width:100%;height:100%}.confirm-button.svelte-xur6gl.svelte-xur6gl{font-size:1.2rem;background:var(--cta);color:#FFF;padding:16px;text-align:center;border-radius:var(--roundy-bit-softness)}.back-button.svelte-xur6gl.svelte-xur6gl{font-size:1.2rem;background:var(--middle-gray);color:var(--dark-gray);padding:16px;text-align:center;border-radius:var(--roundy-bit-softness)}.step-1.svelte-xur6gl .confirm-button.svelte-xur6gl{margin:var(--base-gutter)}.step-2.svelte-xur6gl .confirm-button.svelte-xur6gl{flex:1}.buttons.svelte-xur6gl.svelte-xur6gl{width:100%;display:flex;margin:auto 0 0 0}.buttons.svelte-xur6gl .back-button.svelte-xur6gl{margin-left:var(--base-gutter)\n    }.panel-buttons.svelte-xur6gl.svelte-xur6gl{flex-grow:1;width:100%;display:grid;grid-template-columns:1fr 1fr;grid-row-gap:var(--base-gutter);grid-column-gap:var(--base-gutter)}.notes.svelte-xur6gl.svelte-xur6gl{padding:var(--base-gutter);background:var(--white);width:100%;max-height:200px;flex-grow:1;border-radius:var(--roundy-bit-softness);border:1px solid var(--middle-gray)}";
const css$1 = {
  code: ".wizard-viewport.svelte-xur6gl.svelte-xur6gl{width:100%;height:200%;position:relative;overflow:hidden;display:flex;flex-direction:column}.step.svelte-xur6gl.svelte-xur6gl{width:100%;height:100%}.confirm-button.svelte-xur6gl.svelte-xur6gl{font-size:1.2rem;background:var(--cta);color:#FFF;padding:16px;text-align:center;border-radius:var(--roundy-bit-softness)}.back-button.svelte-xur6gl.svelte-xur6gl{font-size:1.2rem;background:var(--middle-gray);color:var(--dark-gray);padding:16px;text-align:center;border-radius:var(--roundy-bit-softness)}.step-1.svelte-xur6gl .confirm-button.svelte-xur6gl{margin:var(--base-gutter)}.step-2.svelte-xur6gl .confirm-button.svelte-xur6gl{flex:1}.buttons.svelte-xur6gl.svelte-xur6gl{width:100%;display:flex;margin:auto 0 0 0}.buttons.svelte-xur6gl .back-button.svelte-xur6gl{margin-left:var(--base-gutter)\n    }.panel-buttons.svelte-xur6gl.svelte-xur6gl{flex-grow:1;width:100%;display:grid;grid-template-columns:1fr 1fr;grid-row-gap:var(--base-gutter);grid-column-gap:var(--base-gutter)}.notes.svelte-xur6gl.svelte-xur6gl{padding:var(--base-gutter);background:var(--white);width:100%;max-height:200px;flex-grow:1;border-radius:var(--roundy-bit-softness);border:1px solid var(--middle-gray)}",
  map: '{"version":3,"file":"track.svelte","sources":["track.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { spring } from \'svelte/motion\';\\nimport { goto } from \'$app/navigation\';\\n;\\nimport { db } from \'$lib/db\';\\nimport { emotionGroups, emotionsForGroup } from \\"$lib/emotions\\";\\nimport EmotionButton from \'$lib/components/EmotionButton.svelte\';\\nimport PanelSlider from \'$lib/components/PanelSlider.svelte\';\\nimport Panel from \'$lib/components/Panel.svelte\';\\nlet note = \\"\\";\\nlet currentStep = 0;\\nlet selectedEmotions = new Set();\\nconst containerOffset = spring(0, {\\n    stiffness: 0.05,\\n    damping: 0.5\\n});\\n$: $containerOffset = currentStep * -50;\\nlet notePlaceholder;\\n$: {\\n    const emotionArray = [...selectedEmotions];\\n    switch (emotionArray.length) {\\n        case 0:\\n            notePlaceholder = \\"Today I felt...\\";\\n            break;\\n        case 1:\\n            notePlaceholder = `Today I felt ${emotionArray[0]} beacause...`;\\n            break;\\n        case 2:\\n            notePlaceholder = `Today I felt ${emotionArray[0]} and ${emotionArray[1]} because...`;\\n            break;\\n        default: {\\n            const init = emotionArray.slice(0, -1);\\n            const last = emotionArray.slice(-1)[0];\\n            notePlaceholder = `Today I felt ${init.join(\\", \\")}, and ${last} because...`;\\n        }\\n    }\\n}\\n// TODO: Maybe invert this, let this component control button toggle state? Is that \\"Svelte\\"-ier?\\nconst handleToggleEmotion = (emotion) => (toggleEvent) => {\\n    if (toggleEvent.detail === true) {\\n        selectedEmotions.add(emotion);\\n    }\\n    else {\\n        selectedEmotions.delete(emotion);\\n    }\\n    selectedEmotions = selectedEmotions;\\n};\\nfunction trackEmotion() {\\n    db.events.add({\\n        emotions: [...selectedEmotions],\\n        date: new Date(),\\n        note\\n    });\\n    goto(\\"/\\");\\n}\\n</script>\\n\\n<main class=\\"wizard-viewport\\" style={`transform: translateY(${$containerOffset}%)`}>\\n    <section class=\\"step step-1\\" class:active={currentStep === 0}>\\n        <PanelSlider sectionCount={emotionGroups.length}>\\n            <svelte:fragment slot=\\"panels\\">\\n                {#each emotionGroups as emotionGroup}\\n                    <Panel title={emotionGroup}>\\n                        <div class=\\"panel-buttons\\">\\n                            {#each emotionsForGroup(emotionGroup) as emotion}\\n                                <EmotionButton {emotion} on:toggle={handleToggleEmotion(emotion)}></EmotionButton>\\n                            {/each}\\n                        </div>\\n                    </Panel>\\n                {/each}\\n            </svelte:fragment>\\n\\n            <button slot=\\"additional-content\\" class=\\"confirm-button\\" on:click={_ => currentStep = 1}>Track {selectedEmotions.size} Emotions</button>\\n        </PanelSlider>\\n    </section>\\n\\n    <section class=\\"step step-2\\" class:active={currentStep === 1}>\\n        <Panel title=\\"Include a Note?\\">\\n            <svelte:fragment>\\n                <textarea class=\\"notes\\" bind:value={note} placeholder={notePlaceholder}></textarea>\\n                <div class=\\"buttons\\">\\n                    <button class=\\"confirm-button\\" on:click={trackEmotion}>Confirm {selectedEmotions.size} Emotions</button>\\n                    <button class=\\"back-button\\" on:click={_ => currentStep = 0}>Back</button>\\n                </div>\\n            </svelte:fragment>\\n        </Panel>\\n    </section>\\n</main>\\n\\n<style>\\n    .wizard-viewport {\\n        width: 100%;\\n        /* This is hard coded! 100% * numSections - This is a hack */\\n        height: 200%;\\n        position: relative;\\n        overflow: hidden;\\n        display: flex;\\n        flex-direction: column;\\n    }\\n\\n    .step {\\n        width: 100%;\\n        height: 100%;\\n    }\\n\\n    .confirm-button {\\n        font-size: 1.2rem;\\n        background: var(--cta);\\n        color: #FFF;\\n        padding: 16px;\\n        text-align: center;\\n        border-radius: var(--roundy-bit-softness);\\n    }\\n\\n    .back-button {\\n        font-size: 1.2rem;\\n        background: var(--middle-gray);\\n        color: var(--dark-gray);\\n        padding: 16px;\\n        text-align: center;\\n        border-radius: var(--roundy-bit-softness);\\n    }\\n\\n    .step-1 .confirm-button {\\n        margin: var(--base-gutter);\\n    }\\n\\n    .step-2 .confirm-button {\\n        flex: 1;\\n    }\\n\\n    .buttons {\\n        width: 100%;\\n        display: flex;\\n        margin: auto 0 0 0;\\n    }\\n\\n    .buttons .back-button {\\n        margin-left: var(--base-gutter)\\n    }\\n\\n    .panel-buttons {\\n        flex-grow: 1;\\n        width: 100%;\\n        display: grid;\\n        grid-template-columns: 1fr 1fr;\\n        grid-row-gap: var(--base-gutter);\\n        grid-column-gap: var(--base-gutter);\\n    }\\n\\n    .notes {\\n        padding: var(--base-gutter);\\n        background: var(--white);\\n        width: 100%;\\n        max-height: 200px;\\n        flex-grow: 1;\\n        border-radius: var(--roundy-bit-softness);\\n        border: 1px solid var(--middle-gray);\\n    }\\n</style>\\n"],"names":[],"mappings":"AAyFI,gBAAgB,4BAAC,CAAC,AACd,KAAK,CAAE,IAAI,CAEX,MAAM,CAAE,IAAI,CACZ,QAAQ,CAAE,QAAQ,CAClB,QAAQ,CAAE,MAAM,CAChB,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,AAC1B,CAAC,AAED,KAAK,4BAAC,CAAC,AACH,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,AAChB,CAAC,AAED,eAAe,4BAAC,CAAC,AACb,SAAS,CAAE,MAAM,CACjB,UAAU,CAAE,IAAI,KAAK,CAAC,CACtB,KAAK,CAAE,IAAI,CACX,OAAO,CAAE,IAAI,CACb,UAAU,CAAE,MAAM,CAClB,aAAa,CAAE,IAAI,qBAAqB,CAAC,AAC7C,CAAC,AAED,YAAY,4BAAC,CAAC,AACV,SAAS,CAAE,MAAM,CACjB,UAAU,CAAE,IAAI,aAAa,CAAC,CAC9B,KAAK,CAAE,IAAI,WAAW,CAAC,CACvB,OAAO,CAAE,IAAI,CACb,UAAU,CAAE,MAAM,CAClB,aAAa,CAAE,IAAI,qBAAqB,CAAC,AAC7C,CAAC,AAED,qBAAO,CAAC,eAAe,cAAC,CAAC,AACrB,MAAM,CAAE,IAAI,aAAa,CAAC,AAC9B,CAAC,AAED,qBAAO,CAAC,eAAe,cAAC,CAAC,AACrB,IAAI,CAAE,CAAC,AACX,CAAC,AAED,QAAQ,4BAAC,CAAC,AACN,KAAK,CAAE,IAAI,CACX,OAAO,CAAE,IAAI,CACb,MAAM,CAAE,IAAI,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,AACtB,CAAC,AAED,sBAAQ,CAAC,YAAY,cAAC,CAAC,AACnB,WAAW,CAAE,IAAI,aAAa,CAAC;IACnC,CAAC,AAED,cAAc,4BAAC,CAAC,AACZ,SAAS,CAAE,CAAC,CACZ,KAAK,CAAE,IAAI,CACX,OAAO,CAAE,IAAI,CACb,qBAAqB,CAAE,GAAG,CAAC,GAAG,CAC9B,YAAY,CAAE,IAAI,aAAa,CAAC,CAChC,eAAe,CAAE,IAAI,aAAa,CAAC,AACvC,CAAC,AAED,MAAM,4BAAC,CAAC,AACJ,OAAO,CAAE,IAAI,aAAa,CAAC,CAC3B,UAAU,CAAE,IAAI,OAAO,CAAC,CACxB,KAAK,CAAE,IAAI,CACX,UAAU,CAAE,KAAK,CACjB,SAAS,CAAE,CAAC,CACZ,aAAa,CAAE,IAAI,qBAAqB,CAAC,CACzC,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,aAAa,CAAC,AACxC,CAAC"}'
};
const Track = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $containerOffset, $$unsubscribe_containerOffset;
  let currentStep = 0;
  let selectedEmotions = new Set();
  const containerOffset = spring(0, {stiffness: 0.05, damping: 0.5});
  $$unsubscribe_containerOffset = subscribe(containerOffset, (value) => $containerOffset = value);
  let notePlaceholder;
  $$result.css.add(css$1);
  set_store_value(containerOffset, $containerOffset = currentStep * -50, $containerOffset);
  {
    {
      const emotionArray = [...selectedEmotions];
      switch (emotionArray.length) {
        case 0:
          notePlaceholder = "Today I felt...";
          break;
        case 1:
          notePlaceholder = `Today I felt ${emotionArray[0]} beacause...`;
          break;
        case 2:
          notePlaceholder = `Today I felt ${emotionArray[0]} and ${emotionArray[1]} because...`;
          break;
        default: {
          const init2 = emotionArray.slice(0, -1);
          const last = emotionArray.slice(-1)[0];
          notePlaceholder = `Today I felt ${init2.join(", ")}, and ${last} because...`;
        }
      }
    }
  }
  $$unsubscribe_containerOffset();
  return `<main class="${"wizard-viewport svelte-xur6gl"}"${add_attribute("style", `transform: translateY(${$containerOffset}%)`, 0)}><section class="${["step step-1 svelte-xur6gl", "active"].join(" ").trim()}">${validate_component(PanelSlider, "PanelSlider").$$render($$result, {sectionCount: emotionGroups.length}, {}, {
    "additional-content": () => `<button slot="${"additional-content"}" class="${"confirm-button svelte-xur6gl"}">Track ${escape(selectedEmotions.size)} Emotions</button>`,
    panels: () => `${each(emotionGroups, (emotionGroup) => `${validate_component(Panel, "Panel").$$render($$result, {title: emotionGroup}, {}, {
      default: () => `<div class="${"panel-buttons svelte-xur6gl"}">${each(emotionsForGroup(emotionGroup), (emotion) => `${validate_component(EmotionButton, "EmotionButton").$$render($$result, {emotion}, {}, {})}`)}</div>
                    `
    })}`)}`
  })}</section>

    <section class="${["step step-2 svelte-xur6gl", ""].join(" ").trim()}">${validate_component(Panel, "Panel").$$render($$result, {title: "Include a Note?"}, {}, {
    default: () => `<textarea class="${"notes svelte-xur6gl"}"${add_attribute("placeholder", notePlaceholder, 0)}>${""}</textarea>
                <div class="${"buttons svelte-xur6gl"}"><button class="${"confirm-button svelte-xur6gl"}">Confirm ${escape(selectedEmotions.size)} Emotions</button>
                    <button class="${"back-button svelte-xur6gl"}">Back</button></div>`
  })}</section>
</main>`;
});
var track = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  default: Track
});
var $layout_svelte_svelte_type_style_lang = `@namespace svg "http://www.w3.org/2000/svg";:root{--white:#FFF;--rich-black:#333;--light-gray:#f2f7ff;--middle-gray:#dadee4;--dark-gray:#686973;--green:#20c879;--blue:#6e91fb;--orange:#ff956a;--purple:#df6ddb;--yellow:#fcb855;--red:#d63031;--root-measure:12px;--base-gutter:16px;--roundy-bit-softness:8px;--card-background:var(--white);--background:var(--light-gray);--text:var(--rich-black);--primary:var(--blue);--cta:var(--green);--soft-shadow:0px 3px 5px rgb(152 152 152 / 12%);--heavy-shadow:0px 3px 5px rgb(152 152 152 / 36%)}:not(svg|*){all:unset;display:revert;box-sizing:border-box}html, body, #svelte, .app-container{height:100%}html{font-size:var(--root-measure);color:var(--text)}body{font-family:'Lexend', sans-serif;background:var(--background);overflow:hidden}`;
const css = {
  code: `@namespace svg "http://www.w3.org/2000/svg";:root{--white:#FFF;--rich-black:#333;--light-gray:#f2f7ff;--middle-gray:#dadee4;--dark-gray:#686973;--green:#20c879;--blue:#6e91fb;--orange:#ff956a;--purple:#df6ddb;--yellow:#fcb855;--red:#d63031;--root-measure:12px;--base-gutter:16px;--roundy-bit-softness:8px;--card-background:var(--white);--background:var(--light-gray);--text:var(--rich-black);--primary:var(--blue);--cta:var(--green);--soft-shadow:0px 3px 5px rgb(152 152 152 / 12%);--heavy-shadow:0px 3px 5px rgb(152 152 152 / 36%)}:not(svg|*){all:unset;display:revert;box-sizing:border-box}html, body, #svelte, .app-container{height:100%}html{font-size:var(--root-measure);color:var(--text)}body{font-family:'Lexend', sans-serif;background:var(--background);overflow:hidden}`,
  map: `{"version":3,"file":"$layout.svelte","sources":["$layout.svelte"],"sourcesContent":["<svelte:head>\\n    <link rel=\\"preconnect\\" href=\\"https://fonts.gstatic.com\\">\\n    <link href=\\"https://fonts.googleapis.com/css2?family=Lexend:wght@500;600&display=swap\\" rel=\\"stylesheet\\">\\n</svelte:head>\\n\\n<slot></slot>\\n\\n<style>\\n\\t@namespace svg \\"http://www.w3.org/2000/svg\\";\\n\\n    :root {\\n        --white: #FFF;\\n        --rich-black: #333;\\n        --light-gray: #f2f7ff;\\n        --middle-gray: #dadee4;\\n        --dark-gray: #686973;\\n        --green: #20c879;\\n        --blue: #6e91fb;\\n        --orange: #ff956a;\\n        --purple: #df6ddb;\\n        --yellow: #fcb855;\\n        --red: #d63031;\\n\\n        --root-measure: 12px;\\n        --base-gutter: 16px;\\n        --roundy-bit-softness: 8px;\\n\\n        --card-background: var(--white);\\n        --background: var(--light-gray);\\n        --text: var(--rich-black);\\n        --primary: var(--blue);\\n        --cta: var(--green);\\n        --soft-shadow: 0px 3px 5px rgb(152 152 152 / 12%);\\n        --heavy-shadow: 0px 3px 5px rgb(152 152 152 / 36%);\\n    }\\n\\n    :global(:not(svg|*)) {\\n        all: unset;\\n        display: revert;\\n        box-sizing: border-box;\\n    }\\n\\n    :global(html, body, #svelte, .app-container) {\\n        height: 100%;\\n    }\\n\\n    :global(html) {\\n        font-size: var(--root-measure);\\n        color: var(--text);\\n    }\\n\\n    :global(body) {\\n        font-family: 'Lexend', sans-serif;\\n        background: var(--background);\\n        overflow: hidden;\\n    }\\n</style>\\n"],"names":[],"mappings":"AAQC,WAAW,GAAG,CAAC,4BAA4B,CAAC,AAEzC,KAAK,AAAC,CAAC,AACH,OAAO,CAAE,IAAI,CACb,YAAY,CAAE,IAAI,CAClB,YAAY,CAAE,OAAO,CACrB,aAAa,CAAE,OAAO,CACtB,WAAW,CAAE,OAAO,CACpB,OAAO,CAAE,OAAO,CAChB,MAAM,CAAE,OAAO,CACf,QAAQ,CAAE,OAAO,CACjB,QAAQ,CAAE,OAAO,CACjB,QAAQ,CAAE,OAAO,CACjB,KAAK,CAAE,OAAO,CAEd,cAAc,CAAE,IAAI,CACpB,aAAa,CAAE,IAAI,CACnB,qBAAqB,CAAE,GAAG,CAE1B,iBAAiB,CAAE,YAAY,CAC/B,YAAY,CAAE,iBAAiB,CAC/B,MAAM,CAAE,iBAAiB,CACzB,SAAS,CAAE,WAAW,CACtB,KAAK,CAAE,YAAY,CACnB,aAAa,CAAE,kCAAkC,CACjD,cAAc,CAAE,kCAAkC,AACtD,CAAC,AAEO,WAAW,AAAE,CAAC,AAClB,GAAG,CAAE,KAAK,CACV,OAAO,CAAE,MAAM,CACf,UAAU,CAAE,UAAU,AAC1B,CAAC,AAEO,mCAAmC,AAAE,CAAC,AAC1C,MAAM,CAAE,IAAI,AAChB,CAAC,AAEO,IAAI,AAAE,CAAC,AACX,SAAS,CAAE,IAAI,cAAc,CAAC,CAC9B,KAAK,CAAE,IAAI,MAAM,CAAC,AACtB,CAAC,AAEO,IAAI,AAAE,CAAC,AACX,WAAW,CAAE,QAAQ,CAAC,CAAC,UAAU,CACjC,UAAU,CAAE,IAAI,YAAY,CAAC,CAC7B,QAAQ,CAAE,MAAM,AACpB,CAAC"}`
};
const $layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `${$$result.head += `<link rel="${"preconnect"}" href="${"https://fonts.gstatic.com"}" class="${"svelte-7iyfmg"}" data-svelte="svelte-dvx18a"><link href="${"https://fonts.googleapis.com/css2?family=Lexend:wght@500;600&display=swap"}" rel="${"stylesheet"}" class="${"svelte-7iyfmg"}" data-svelte="svelte-dvx18a">`, ""}

${slots.default ? slots.default({}) : ``}`;
});
var $layout$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  default: $layout
});
export {init, render};
