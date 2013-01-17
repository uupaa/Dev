// es.js: polyfill ECMAScript 262-3rd and 5th method and properties

//{@es
(function(global) { // @arg Global: window or global

function _polyfill() {
    if (!Object.keys) {
         Object.keys = Object_keys;     // Object.keys(obj:Mix):Array
    }
    wiz(Date, {
        now:        Date_now            // Date.now():Integer
    });
    wiz(Date.prototype, {
        toJSON:     Date_toJSON         // Date#toJSON():JSONObject
    });
    wiz(Array, {
        of:         Array_of,           // Array.of(...:Mix):Array
        from:       Array_from,         // Array.from(list:FakeArray):Array
        isArray:    Array_isArray       // Array.isArray(mix:Mix):Boolean
    });
    wiz(Array.prototype, {
        map:        Array_map,          // [].map(fn:Function, that:this):Array
        forEach:    Array_forEach,      // [].forEach(fn:Function, that:this):void
        some:       Array_some,         // [].some(fn:Function, that:this):Boolean
        every:      Array_every,        // [].every(fn:Function, that:this):Boolean
        indexOf:    Array_indexOf,      // [].indexOf(mix:Mix, index:Integer = 0):Integer
        lastIndexOf:Array_lastIndexOf,  // [].lastIndexOf(mix:Mix, index:Integer = 0):Integer
        filter:     Array_filter        // [].filter(fn:Function, that:this):Array
    });
    wiz(String.prototype, {
        trim:       String_trim,        // "".trim():String
        repeat:     String_repeat       // "".repeat(count:Integer):String
    });
    wiz(Function.prototype, {
        bind:       Function_bind       // Function#bind():Function
    });
}

// --- library scope vars ----------------------------------
// none

// --- implement -------------------------------------------
function Object_keys(obj) { // @arg Object/Function/Array:
                            // @ret KeyStringArray: [key, ... ]
                            // @help: Object.keys
    var rv = [], key, i = 0;

        for (key in obj) {
            obj.hasOwnProperty(key) && (rv[i++] = key);
        }
    return rv;
}

function Date_now() { // @ret Integer: milli seconds
                      // @desc: get current time
                      // @help: Date.now
    return +new Date();
}

function Array_isArray(mix) { // @arg Mix:
                              // @ret Boolean:
                              // @help: Array.isArray
    return Object.prototype.toString.call(mix) === "[object Array]";
}

function Array_map(fn,     // @arg Function:
                   that) { // @arg this(= undefined): fn this
                           // @ret Array: [element, ... ]
                           // @help: Array#map
    var i = 0, iz = this.length, rv = Array(iz);

    for (; i < iz; ++i) {
        if (i in this) {
            rv[i] = fn.call(that, this[i], i, this);
        }
    }
    return rv;
}

function Array_forEach(fn,     // @arg Function:
                       that) { // @arg this(= undefined): fn this
                               // @help: Array#forEach
    var i = 0, iz = this.length;

    for (; i < iz; ++i) {
        i in this && fn.call(that, this[i], i, this);
    }
}

function Array_some(fn,     // @arg Function:
                    that) { // @arg this(= undefined): fn this
                            // @ret Boolean:
                            // @help: Array#some
    var i = 0, iz = this.length;

    for (; i < iz; ++i) {
        if (i in this && fn.call(that, this[i], i, this)) {
            return true;
        }
    }
    return false;
}

function Array_every(fn,     // @arg Function:
                     that) { // @arg this(= undefined): fn this
                             // @ret Boolean:
                             // @help: Array#every
    var i = 0, iz = this.length;

    for (; i < iz; ++i) {
        if (i in this && !fn.call(that, this[i], i, this)) {
            return false;
        }
    }
    return true;
}

function Array_filter(fn,     // @arg Function:
                      that) { // @arg this(= undefined): fn this
                              // @ret Array: [value, ... ]
                              // @help: Array#filter
    var rv = [], value, i = 0, iz = this.length;

    for (; i < iz; ++i) {
        if (i in this) {
            value = this[i];
            if (fn.call(that, value, i, this)) {
                rv.push(value);
            }
        }
    }
    return rv;
}

function Array_indexOf(mix,     // @arg Mix: search element
                       index) { // @arg Integer(= 0): from index
                                // @ret Integer: found index or -1
                                // @help: Array#indexOf
    var i = index || 0, iz = this.length;

    i = (i < 0) ? i + iz : i;
    for (; i < iz; ++i) {
        if (i in this && this[i] === mix) {
            return i;
        }
    }
    return -1;
}

function Array_lastIndexOf(mix,     // @arg Mix: search element
                           index) { // @arg Integer(= this.length): from index
                                    // @ret Integer: found index or -1
                                    // @help: Array#lastIndexOf
    var i = index, iz = this.length;

    i = (i < 0) ? i + iz + 1 : iz;
    while (--i >= 0) {
        if (i in this && this[i] === mix) {
            return i;
        }
    }
    return -1;
}

function String_trim() { // @ret String:
                         // @desc: trim both spaces
                         // @help: String#trim
    return this.replace(/^\s+/, "").
                replace(/\s+$/, "");
}

function Array_of(ooo) { // @var_args Mix: values
                         // @ret MixArray:
                         // @desc: Array.of(1, 2, 3) -> [1, 2, 3]
                         // @help: Array.of
    return Array.prototype.slice.call(arguments);
}

function Array_from(fakeArray) { // @arg FakeArray: Arguments or NodeList
                                 // @ret Array/NodeArray:
                                 // @help: Array.from
    var rv = [], i = 0, iz = fakeArray.length;

    for (; i < iz; ++i) {
        rv.push(fakeArray[i]);
    }
    return rv;
}

function Date_toJSON() { // @ret String: "2000-01-01T00:00:00.000Z"
                         // @help: Date#toJSON
    var dates = { y:  this.getUTCFullYear(),         // 1970 -
                  m:  this.getUTCMonth() + 1,        //    1 - 12
                  d:  this.getUTCDate() },           //    1 - 31
        times = { h:  this.getUTCHours(),            //    0 - 23
                  m:  this.getUTCMinutes(),          //    0 - 59
                  s:  this.getUTCSeconds(),          //    0 - 59
                  ms: this.getUTCMilliseconds() };   //    0 - 999

    return dates.y + "-" + (dates.m < 10 ? "0" : "") + dates.m + "-" +
                           (dates.d < 10 ? "0" : "") + dates.d + "T" +
                           (times.h < 10 ? "0" : "") + times.h + ":" +
                           (times.m < 10 ? "0" : "") + times.m + ":" +
                           (times.s < 10 ? "0" : "") + times.s + "." +
                           ("00" + times.ms).slice(-3) + "Z";
}

function String_repeat(count) { // @arg Integer: repeat count. negative is 0
                                // @ret String: repeated string
                                // @desc: repeat strings
                                // @help: String#repeat
    return (this.length && count > 0) ? Array((count + 1) | 0).join(this) : "";
}

function Function_bind(context, // @arg that: context
                       ooo) {   // @var_args Mix: arguments
                                // @ret Function:
                                // @help: Function#bind
    var rv, that = this,
        args = Array.prototype.slice.call(arguments, 1),
        fn = function() {};

    rv = function(ooo) { // @var_args Mix: bound arguments
        return that.apply(this instanceof fn ? this : context,
                    Array.prototype.concat.call(
                            args,
                            Array.prototype.slice.call(arguments)));
    };
    fn.prototype = that.prototype;
    rv.prototype = new fn();
    return rv;
}

function wiz(object, extend, override) {
    for (var key in extend) {
        (override || !(key in object)) && Object.defineProperty(object, key, {
            configurable: true, writable: true, value: extend[key]
        });
    }
}

// --- export ---
_polyfill();

})(this.self || global);
//}@es

// html5.ajax.js
// @call: codec.base64.js, html5.script.js

//{@ajax
(function(global) {

// --- header ----------------------------------------------
function Ajax() {
    Object.defineProperty &&
        Object.defineProperty(this, "ClassName", { value: "Ajax" });
}

Ajax.prototype = {
    load:   Ajax_load   // Ajax#load(url:String, param:Object, fn:Function):this
};

// --- library scope vars ----------------------------------
//
// --- implement -------------------------------------------
function Ajax_load(url,   // @arg String:
                   param, // @arg Object: { type }
                          //    param.type - String(= "text"):
                          //        "binary"        -> load Binary to Binary
                          //        "binary/base64" -> load Binary to Base64String
                          //        "image"         -> load Binary to Binary
                          //        "image/base64"  -> load Binary to Base64String
                          //        "text"          -> load Text to Text
                          //        "text/js"       -> load Text to evvalJavaScript
                          //        "text/node"     -> load Text to HTMLFragment
                   fn) {  // @arg Await/Function(= null): fn(err:Error, data:String/Base64String/Node, time:Integer)
                          //    fn.err - Error: error Object or null
                          //    fn.data - String/Base64String/Node:
                          //    fn.time - Integer: from Last-Modified header or current time
                          // @ret this:
                          // @desc: get remote data
    param = param || {};

    var type = param.type || "text";
    var xhr = new XMLHttpRequest();
    var isAwait = fn.ClassName === "Await";

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            var text = xhr.responseText;
            var mod  = xhr.getResponseHeader("Last-Modified") || "";
            var time = mod ? Date.parse(mod) : Date.now();

            switch (xhr.status) {
            case 200:
            case 201:
                // "image/base64" -> Base64String
                if (/base64$/i.test(type)) {
                    return isAwait ? fn.pass({ data: Monogram.Base64.btoa(text, true),
                                               time: time })
                                   : fn(null, Monogram.Base64.btoa(text, true), time);
                }
                // "text/node" -> <body>
                if (/node$/i.test(type)) {
                    var body = document.createElement("body");

                    body.innerHTML = text;
                    return isAwait ? fn.pass({ data: body, time: time })
                                   : fn(null, body, time);
                }
                // "text/js" -> eval(js)
                if (/js$/i.test(type)) {
                    Script.run(text);
                    return isAwait ? fn.pass({ data: text, time: time })
                                   : fn(null, text, time);
                }
                isAwait ? fn.pass({ data: text, time: time })
                        : fn(null, text, time);
                break;
            case 304:
            default:
                isAwait ? fn.miss({ data: new TypeError(xhr.status), time: time })
                        : fn(new TypeError(xhr.status), "", time);
            }
        }
    };
    xhr.open("GET", url, true);
    if (/^(binary|image)/i.test(type)) {
        xhr.overrideMimeType("text/plain; charset=x-user-defined");
    }
    xhr.withCredentials = true;
    xhr.send(null);

    return this;
}

// --- build and export API --------------------------------
if (typeof module !== "undefined") { // is modular
    module.exports = { Monogram: { Ajax: Ajax } };
}
global.Monogram || (global.Monogram = {});
global.Monogram.Ajax = Ajax;

})(this.self || global);
//}@ajax

/*
    var Ajax = require("./Ajax").Monogram.Ajax;

    new Ajax().load(url, { type: "text" }, function(err, result, time) {
    });
 */

// logic.await.js: awaiting async/sync events

//{@await
(function(global) {

// --- header ----------------------------------------------
function Await(events, // @arg Integer: event count
               fn) {   // @arg Function: fn(err:Error, args:MixArray)
                       // @help: Await
    Object.defineProperty &&
        Object.defineProperty(this, "ClassName", { value: "Await" });

    this._missable = 0;         // Integer: missable count
    this._events = events;      // Integer: event count
    this._pass  = 0;            // Integer: pass() called count
    this._miss  = 0;            // Integer: miss() called count
    this._state = "progress";   // String: "progress", "done", "error", "halt"
    this._args  = [];           // MixArray: pass(arg), miss(arg) collections
    this._fn    = fn;           // Function: callback(err:Error, args:MixArray)

    _judge(this); // events is 0 -> done
}

Await.name = "Await";
Await.prototype = {
    constructor:Await,
    missable:   Await_missable, // Await#missable(count:Integer):this
    add:        Await_add,      // Await#add(count:Integer):this
    halt:       Await_halt,     // Await#halt():this
    pass:       Await_pass,     // Await#pass(value:Mix = undefined):this
    miss:       Await_miss,     // Await#miss(value:Mix = undefined):this
    getStatus:  Await_getStatus // Await#getStatus():Object
};

// --- library scope vars ----------------------------------

// --- implement -------------------------------------------
function Await_missable(count) { // @arg Integer: missable count
                                 // @ret this:
                                 // @help: Await#missable
                                 // @desc: set missable counts
//{@debug
    if (count < 0 || count >= this._events) {
        throw new Error("BAD_ARG");
    }
//}@debug
    this._missable = count;
    return this;
}

function Await_add(count) { // @arg Integer: event count
                            // @ret this:
                            // @help: Await#add
                            // @desc: add events
    if (this._state === "progress") {
        this._events += count;
    }
    return this;
}

function Await_pass(value) { // @arg Mix(= undefined): value
                             // @ret this:
                             // @help: Await#pass
                             // @desc: pass a process
    ++this._pass;
    if (value !== void 0) {
        this._args.push(value);
    }
    return _judge(this);
}

function Await_miss(value) { // @arg Mix(= undefined): value
                             // @ret this:
                             // @help: Await#miss
                             // @desc: miss a process
    ++this._miss;
    if (value !== void 0) {
        this._args.push(value);
    }
    return _judge(this);
}

function Await_halt() { // @ret this:
                        // @help: Await#halt
                        // @desc: end of await
    if (this._state === "progress") {
        this._state = "halt";
    }
    return _judge(this);
}

function _judge(that) { // @arg this:
                        // @ret this:
                        // @inner: judge state and callback function
    if (that._state === "progress") {
        that._state = that._miss > that._missable ? "error"
                    : that._pass + that._miss >= that._events ? "done"
                    : that._state;
    }
    if (that._fn) {
        switch (that._state) {
        case "progress": break;
        case "error":
        case "halt":
            that._fn(new TypeError(that._state), // err.message: "error" or "halt"
                     that._args);
            that._fn = null;
            that._args = []; // free
            break;
        case "done":
            that._fn(null, that._args);
            that._fn = null;
            that._args = []; // free
        }
    }
    return that;
}

function Await_getStatus() { // @ret Object: { missable, events, pass, miss, state }
                             //     missable - Integer:
                             //     events - Integer:
                             //     state - String: "progress", "done", "error", "halt"
                             //     pass - Integer:
                             //     miss - Integer:
                             // @help: Await#getStatus
    return {
        missable:   this._missable,
        events:     this._events,
        state:      this._state,
        pass:       this._pass,
        miss:       this._miss
    };
}

// --- build and export API --------------------------------
if (typeof module !== "undefined") { // is modular
    module.exports = { Monogram: { Await: Await } };
} else {
    global.Monogram || (global.Monogram = {});
    global.Monogram.Await = Await;
}

})(this.self || global);
//}@await

/*
    var Await = require("./logic.await").Monogram.Await;

    function test1() { // await sync 4 events
        var await = new Await(4, callback);

        [1,2,3].forEach(function(value) {
            await.pass(value);
        });
        await.pass(4); // fire callback

        function callback(err, args) { // err = null, args = [1,2,3,4]
            if (err) {
                switch (err.message) {
                case "halt":  console.log("halt",  args.join()); break;
                case "error": console.log("error", args.join()); break;
                }
            } else {
                // err is null
                console.log(args.join()); // "1,2,3,4"
            }
        }
    }

    function test2() { // await async 4 events (missable 1)
        var await = new Await(4, callback).missable(1);

        setTimeout(function() { await.pass(1); }, Math.random() * 1000); // goo
        setTimeout(function() { await.pass(2); }, Math.random() * 1000); // goo
        setTimeout(function() { await.pass(3); }, Math.random() * 1000); // goo
        setTimeout(function() { await.miss(4); }, Math.random() * 1000); // boo?
        setTimeout(function() { await.miss(5); }, Math.random() * 1000); // boo?

        function callback(err, args) { // random result
            if (err) {
                console.log("boo!", args.join()); // eg: "boo! 4,1,5"
            } else {
                console.log("goo!", args.join()); // eg: "goo! 2,3,1,4"
            }
        }
    }
 */

// html5.script.js: eval JavaScript

//{@script
(function(global) {

// --- header ----------------------------------------------
function Script() {
    Object.defineProperty &&
        Object.defineProperty(this, "ClassName", { value: "Script" });
}
Script.run = Script_run;

// --- library scope vars ----------------------------------

// --- implement -------------------------------------------
function Script_run(expression) { // @arg String: JavaScript Expression
                                  // @desc: blocking api
    var script = document.createElement("script"),
        head = document.head ||
               document.getElementsByTagName("head")[0];

    script.charset = "utf-8";
    script.text = expression;
    head.appendChild(script);
}

// --- build and export API --------------------------------
if (typeof module !== "undefined") { // is modular
    module.exports = { Monogram: { Script: Script } };
} else {
    global.Monogram || (global.Monogram = {});
    global.Monogram.Script = Script;
}

})(this.self || global);
//}@script

/*
    var Script = require("./html5.script").Monogram.Script;

    Script.run("alert(123)");
 */
// html5.sql.storage.js: WebSQLStorage

//{@sqlstorage
(function(global) {

// --- header ----------------------------------------------
function SQLStorage(dbName,    // @arg String: db name
                    tableName, // @arg String: table name
                    fn) {      // @arg Function(= null): fn(err:Error, instance:this)
    this._init(dbName, tableName, fn);
}

SQLStorage.name = "SQLStorage";
SQLStorage.prototype = {
    constructor:SQLStorage,
    _init:      SQLStorage_init,
    has:        SQLStorage_has,         // SQLStorage#has(id:String, fn:Function = null):void
    get:        SQLStorage_get,         // SQLStorage#get(id:String, fn:Function = null):void
    set:        SQLStorage_set,         // SQLStorage#set(id:String, data:String,
                                        //                hash:String, time:Integer, fn:Function = null):void
    list:       SQLStorage_list,        // SQLStorage#list(fn):void
    fetch:      SQLStorage_fetch,       // SQLStorage#fetch(id:String, fn:Function = null):void
    remove:     SQLStorage_remove,      // SQLStorage#remove(id:String, fn:Function = null):void
    clear:      SQLStorage_clear,       // SQLStorage#clear(fn:Function = null):void
    tearDown:   SQLStorage_tearDown,    // SQLStorage#tearDown(fn:Function = null):void
    showTable:  SQLStorage_showTable,   // SQLStorage#showTable():void
    dump:       SQLStorage_dump         // SQLStorage#dump(idonly:Boolean = false):void
};
SQLStorage.dump = function() {
    var storage = new SQLStorage("Zabuton", "Zabuton", function(err) {
        storage.dump();
    });
};
SQLStorage.clear = function() {
    var storage = new SQLStorage("Zabuton", "Zabuton", function(err) {
        storage.clear();
    });
};


// --- library scope vars ----------------------------------

// --- implement -------------------------------------------
function SQLStorage_init(dbName, tableName, fn) {
    var that = this;

    this._dbName = dbName;
    this._tableName = tableName;

    var limit = (1024 * 1024 * 5) - 1024; // 5MB - 1KB

    // [iPhone] LIMIT 5MB, Sometimes throw exception in openDatabase
    this._db = openDatabase(dbName, "1.0", dbName, limit);
    this._db.transaction(function(tr) {
        var sql = "CREATE TABLE IF NOT EXISTS " + tableName +
                  " (id TEXT PRIMARY KEY,time INTEGER,hash TEXT,data TEXT)";
        // console.log(sql);
        tr.executeSql(sql, [],
            function(tr, result) {
                fn && fn(null, that); // ok
            },
            function(tr, err) {
                fn && fn(err, that);
            });
    });
}

function SQLStorage_has(id,   // @arg String:
                        fn) { // @arg Function(= null): fn(has:Boolean)
                              // @desc: has id
    this.get(id, function(err, id, data) {
        fn(err || !id ? false : true);
    });
}

function SQLStorage_get(id,   // @arg String:
                        fn) { // @arg Function(= null): fn(err:Error, id:String, data:String,
                              //                           hash:String, time:Integer)
                              // @desc: fetch a row
    var that = this;

    this._db.readTransaction(function(tr) {
        tr.executeSql("SELECT time,hash,data FROM " + that._tableName +
                      " WHERE id=?", [id],
            function(tr, result) {
                var time = 0;
                var hash = "";
                var data = "";

                if (result.rows.length) {
                    time = result.rows.item(0).time;
                    hash = result.rows.item(0).hash;
                    data = result.rows.item(0).data;
                }
                fn(null, id, data, hash, time);
            },
            function(tr, error) {
                fn(error, "", "", "");
            });
    });
}

function SQLStorage_set(id,   // @arg String:
                        data, // @arg String: "" is delete row.
                        hash, // @arg String(= ""):
                        time, // @arg Integer(= 0):
                        fn) { // @arg Function(= null): fn(err:Error)
                              // @desc: add/update row
    _exec(this._db, "INSERT OR REPLACE INTO " + this._tableName +
                    " VALUES(?,?,?,?)", [id, time, hash, data], fn);
}

function SQLStorage_list(fn) { // @arg Function: fn(err:Error, ids:Array)
                               //    ids - Array: [ id, ... ]
    var that = this;

    this._db.readTransaction(function(tr) {
        tr.executeSql("SELECT id FROM " + that._tableName, [],
            function(tr, result) {
                var rv = [],
                    i = 0, iz = result.rows.length, obj;

                for (; i < iz; ++i) {
                    obj = result.rows.item(i);
                    rv.push(obj.id);
                }
                fn && fn(null, rv); // ok
            }, function(tr, error) {
                fn && fn(error, []);
            });
    });
}

function SQLStorage_fetch(fn) { // @arg Function: fn(err:Error, result:Object, hashs:Object, times:Object)
                                //    result - Object: { id: data, ... }
                                //    hashs - Object: { id: hash, ... }
                                //    times - Object: { id: time, ... }
    var that = this;

    this._db.readTransaction(function(tr) {
        tr.executeSql("SELECT * FROM " + that._tableName, [],
            function(tr, result) {
                var rv = {}, hashs = {}, times = {},
                    i = 0, iz = result.rows.length, obj;

                for (; i < iz; ++i) {
                    obj = result.rows.item(i);
                       rv[obj.id] = obj.data;
                    hashs[obj.id] = obj.hash;
                    times[obj.id] = obj.time;
                }
                fn && fn(null, rv, hashs, times); // ok
            }, function(tr, error) {
                fn && fn(error, {}, {}, {});
            });
    });
}

function SQLStorage_remove(id,   // @arg String:
                           fn) { // @arg Function(= null): fn(err:Error)
                                 // @desc: add/update row
    _exec(this._db, "DELETE FROM " + this._tableName +
                    " WHERE id=?", [id], fn);
}

function SQLStorage_clear(fn) { // @arg Function(= null): fn(err:Error)
                                // @desc: clear all data
    _exec(this._db, "DELETE FROM " + this._tableName, [], fn);
}

function SQLStorage_tearDown(fn) { // @arg Function(= null): fn(err:Error)
                                   // @desc: drop table
    _exec(this._db, "DROP TABLE " + this._tableName, [], fn);
}

function SQLStorage_showTable() {
    this._db.transaction(function(tr) {
        tr.executeSql("SELECT * FROM sqlite_master WHERE type='table'", [], function(tr, result) {
            var i = 0, iz = result.rows.length, obj, key;

            for (; i < iz; ++i) {
                obj = result.rows.item(i);
                for (key in obj) {
                    console.log(key + ": " + obj[key]);
                }
            }
        }, function(tr, error) {
        });
    });
}

function SQLStorage_dump(idonly) { // @arg Boolean(= false): true is id only
    if (idonly) {
        this.list(function(err, ids) {
            console.log(ids.join(", "));
        });
    } else {
        this.fetch(function(err, results, hashs, times) {
            for (id in results) {
                console.log(id + " " + hashs[id].slice(0, 6) + " " + times[id] + " " + results[id].slice(0, 12));
            }
        });
    }
}

function _exec(db,
               sql,  // @arg String:
               args, // @arg Array(= []): [arg, ...]
               fn) { // @arg Function(= null): fn(err:Error)
    db.transaction(function(tr) {
        tr.executeSql(sql, args || [], function(tr, result) {
            fn && fn(null); // ok
        }, function(tr, error) {
            if (fn) {
                fn(error);
            } else {
                throw new TypeError(error.message);
            }
        });
    });
}

// --- build and export API --------------------------------
if (typeof module !== "undefined") { // is modular
    module.exports = { Monogram: { SQLStorage: SQLStorage } };
} else {
    global.Monogram || (global.Monogram = {});
    global.Monogram.SQLStorage = SQLStorage;
}

})(this.self || global);
//}@sqlstorage

/*
    var SQLStorage = reuqire("./html5.sql.storage").Monogram.SQLStorage;

    function test1() {
        new SQLStorage("mydb", "mytable", function(err, storage) {
            storage.set("key", "value", function(err) {
                storage.get("key", function(err, id, data, hash, time) {
                    console.log(data);
                });
                storage.clear();
            });
        });
    }
 */

// html5.storage.cache.js: Storage Cache

//{@storagecache
(function(global) {

// --- header ----------------------------------------------
function StorageCache(storage, // @arg Instance: SQLStorage or WebStorage
                      fn) {    // @arg Function(= null): fn(err:Error, that:this)
    Object.defineProperty &&
        Object.defineProperty(this, "ClassName", { value: "StorageCache" });

    this._init(storage, fn);
}

StorageCache.prototype = {
    _init:  StorageCache_init,
    has:    StorageCache_has,     // StorageCache#has(id:String):void
    get:    StorageCache_get,     // StorageCache#get(id:String):String
    getHash:StorageCache_getHash, // StorageCache#getHash(id:String):String
    getTime:StorageCache_getTime, // StorageCache#getTime(id:String):Integer
    set:    StorageCache_set,     // StorageCache#set(id:String, data:String, hash:String, time:Integer):void
    remove: StorageCache_remove,  // StorageCache#remove(id:String):void
    clear:  StorageCache_clear,   // StorageCache#clear(fn:Function = null):void
    tearDown:StorageCache_tearDown// StorageCache#tearDown(fn:Function = null):void
};

// --- library scope vars ----------------------------------

// --- implement -------------------------------------------
function StorageCache_init(storage, fn) {
    var that = this;

    this._storage = storage;
    this._cache = {};   // Object: on memory cache data. { key: data, ... }
    this._hashs = {};   // Object: on memory cache data. { key: hash, ... }
    this._times = {};   // Object: on memory cache data. { key: time, ... }
    this._queue = [];   // Array: insert queue [<id, data, hash, time>, ...]
    this._timerID = 0;  // Integer: timer id

    storage.fetch(function(err, result, hashs, times) {
        if (err) { throw err; }

        that._cache = result;
        that._hashs = hashs;
        that._times = times;
        fn(null, that);
    });
}

function StorageCache_has(id) { // @arg String:
                                // @ret Boolean:
                                // @desc: has id
    return id in this._cache;
}

function StorageCache_fetch(id,   // @arg String:
                            fn) { // @arg Function: fn(err:Error, result:Object, hashs:Object, times:Object)
    var that = this;

    this._storage.fetch(function(err, result, hashs, times) {
        if (err) { throw err; }

        that._cache = result;
        that._hashs = hashs;
        that._times = times;
        fn(null, result, hashs, times); // ok
    });
}

function StorageCache_get(id) { // @arg String:
                                // @ret String:
    return this._cache[id] || "";
}

function StorageCache_getHash(id) { // @arg String:
                                    // @ret String:
    return this._hashs[id] || "";
}

function StorageCache_getTime(id) { // @arg String:
                                    // @ret Integer:
    return this._times[id] || 0;
}

function StorageCache_set(id,     // @arg String:
                          data,   // @arg String: "" is delete row.
                          hash,   // @arg String(= ""):
                          time) { // @arg Integer(= 0):
                                  // @desc: add/update row
    this._cache[id] = data;
    this._hashs[id] = hash;
    this._times[id] = time;
    this._queue.push(id, data, hash || "", time || 0);
    _startQueue(this);
}

function StorageCache_remove(id) { // @arg String:
                                   // @desc: remove cache
    delete this._cache[id];
    delete this._hashs[id];
    delete this._times[id];

    this._storage.remove(id, function(err) {
        if (err) {
            console.log("ERROR: StorageCache#remove");
        }
    });
}

function StorageCache_clear(fn) { // @arg Function(= null): fn(err:Error)
                                  // @desc: clear all data
    _stopQueue(this);
    this._cache = {};
    this._hashs = {};
    this._times = {};
    this._storage.clear(fn);
}

function StorageCache_tearDown(fn) { // @arg Function(= null): fn(err:Error)
                                     // @desc: drop table
    _stopQueue(this);
    this._cache = {};
    this._hashs = {};
    this._times = {};
    this._storage.tearDown();
}

function _startQueue(that) {
    if (!that._timerID) {
        that._timerID = setInterval(function() {
            _tick(that);
        }, 100);
    }
}

function _stopQueue(that) {
    if (that._timerID) {
        clearTimeout(that._timerID);
        that._timerID = 0;
    }
}

function _tick(that) {
    if (!that._queue.length) {
        return _stopQueue(that);
    }

    var id   = that._queue.shift();
    var data = that._queue.shift();
    var hash = that._queue.shift();
    var time = that._queue.shift();

    that._storage.set(id, data, hash, time, function(err) {
        if (err) { throw err; }
        // console.log(err.message);
        // that._queue.push(id, data);
    });
}

// --- build and export API --------------------------------
if (typeof module !== "undefined") { // is modular
    module.exports = { Monogram: { StorageCache: StorageCache } };
} else {
    global.Monogram || (global.Monogram = {});
    global.Monogram.StorageCache = StorageCache;
}

})(this.self || global);
//}@storagecache

/*
    var SQLStorage   = reuqire("./html5.sql.storage").Monogram.SQLStorage;
    var StorageCache = reuqire("./html5.storage.cache").Monogram.StorageCache;

    var storage = new SQLStorage("mydb", "mytable", function(err, storage) {
    });

    function test1() {
        new StorageCache(storage, function(err, cache) {
            cache.set("id", "base64data");
            cache.has("id"); // true

            node.src = "data:image/png;base64" + cache.get("id");

            cache.clear();
        });
    }
 */

// codec.base64.js: Base64

//{@base64
(function(global) {

// --- header ----------------------------------------------
function Base64(data,                 // @arg String/Array:
                decodeBase64String) { // @arg Boolean(= false):
    Object.defineProperty &&
        Object.defineProperty(this, "ClassName", { value: "Base64" });

    this._data = [];
    this._init(data, decodeBase64String);
}

Base64.prototype = {
    _init:          Base64_init,
    toArray:        Base64_toArray,         // Base64#toArray():Array/Base64Array
    toString:       Base64_toString,        // Base64#toString():String
    toBase64String: Base64_toBase64String   // Base64#toBase64String(safe:Boolean = false):Base64String
};

Base64.btoa = Base64_btoa;  // Base64#btoa(binary:String, fromXHR:Boolean = false):Base64String
Base64.atob = Base64_atob;  // Base64#atob(base64:String):BinaryString

// --- library scope vars ----------------------------------
var _DB = {
        chars: [],                          // ["A", "B", ... "/"]
        codes: { "=": 0, "-": 62, "_": 63 } // { 65: 0, 66: 1 }
                                            // charCode and URLSafe64 chars("-", "_")
    };

// --- implement -------------------------------------------
function Base64_init(data, decodeBase64String) {
    if (Array.isArray(data)) {
        this._data = data; // by ref (not copy)
    } else if (typeof data === "string") {
        this._data = decodeBase64String ? _decode(data)
                                        : _toByteArray(data);
    }
}

function Base64_toString() { // @ret String:
                             // @help: Base64#toString
                             // @desc: to
    return _toString(this._data);
}

function Base64_toArray() { // @ret Array/Base64Array:
                            // @help: Base64#toArray
                            // @desc: get raw data
    return this._data;
}

function Base64_toBase64String(safe) { // @arg Boolean(= false):
                                       // @ret Base64String:
                                       // @help: Base64#toBase64String
    return _encode(this._data, safe);
}

function Base64_btoa(binary,    // @arg String:
                     fromXHR) { // @arg Boolean(= false):
                                // @ret Base64String:
    if (global.btoa) {
        if (!fromXHR) {
            try {
                return global.btoa(binary); // BinaryString to Base64String
            } catch (o_o) {
                // maybe. xhr binary has non ascii value
            }
        }
        return global.btoa( _toAsciiString(binary) );
    }
    return _encode( _toByteArray(binary) );
}

function Base64_atob(base64) { // @arg Base64String:
                               // @ret BinaryString:
    if (global.atob) {
        try {
            return global.atob(base64);
        } catch (o_o) {
            // maybe. broken base64 data
        }
    }
    return _toString( _decode(base64) );
}

function _toAsciiString(binary) { // @arg String: has non ascii value
                                  // @ret BinaryString:
                                  // @inner: filer
    var rv = Array(binary.length), i = 0, iz = binary.length;

    for (; i < iz; ++i) {
        rv[i] = String.fromCharCode( binary.charCodeAt(i) & 0xFF ); // 0xffff -> 0xff
    }
    return rv.join("");
}

function _toString(ary) { // @arg Array:
                          // @ret String:
                          // @inner: UTF16Array to String
    var rv = [], i = 0, iz = ary.length, bulkSize = 10240;

    // avoid String.fromCharCode.apply(null, BigArray) exception
    for (; i < iz; i += bulkSize) {
        rv.push( String.fromCharCode.apply(null, ary.slice(i, i + bulkSize)) );
    }
    return rv.join("");
}

function _toByteArray(str) { // @arg String:
                             // @ret ByteArray:
                             // @inner: BinaryString to ByteArray
    var rv = Array(str.length), i = 0, iz = str.length;

    for (; i < iz; ++i) {
        rv[i] = str.charCodeAt(i) & 0xFF; // 0xffff -> 0xff
    }
    return rv;
}

function _encode(ary,    // @arg Array:
                 safe) { // @arg Boolean(= false): true is URLSafe64
                         // @ret Base64String:
                         // @inner: ByteArray to Base64String
    var rv = [],
        c = 0, i = -1, iz = ary.length,
        pad = [0, 2, 1][iz % 3],
        chars = _DB.chars;

    --iz;
    while (i < iz) {
        c =  ((ary[++i] & 0xff) << 16) |
             ((ary[++i] & 0xff) <<  8) |
              (ary[++i] & 0xff); // 24bit

        rv.push(chars[(c >> 18) & 0x3f],
                chars[(c >> 12) & 0x3f],
                chars[(c >>  6) & 0x3f],
                chars[ c        & 0x3f]);
    }
    pad > 1 && (rv[rv.length - 2] = "=");
    pad > 0 && (rv[rv.length - 1] = "=");
    if (safe) {
        return rv.join("").replace(/\=+$/g, "").replace(/\+/g, "-").
                                                replace(/\//g, "_");
    }
    return rv.join("");
}

function _decode(str) { // @arg Base64String:
                        // @ret Array:
                        // @inner: decode Base64String to array
    var rv = [], c = 0, i = 0, ary = str.split(""),
        iz = str.length - 1,
        codes = _DB.codes;

    while (i < iz) {                // 00000000|00000000|00000000 (24bit)
        c = (codes[ary[i++]] << 18) // 111111  |        |
          | (codes[ary[i++]] << 12) //       11|1111    |
          | (codes[ary[i++]] <<  6) //         |    1111|11
          |  codes[ary[i++]];       //         |        |  111111
                                    //    v        v        v
        rv.push((c >> 16) & 0xff,   // --------
                (c >>  8) & 0xff,   //          --------
                 c        & 0xff);  //                   --------
    }
    rv.length -= [0, 0, 2, 1][str.replace(/\=+$/, "").length % 4]; // cut tail

    return rv;
}

// --- build and export API --------------------------------
(function() { // @inner: init base64
    var CODE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
               "abcdefghijklmnopqrstuvwxyz0123456789+/";

    _DB.chars = CODE.split("");

    for (var i = 0; i < 64; ++i) {
        _DB.codes[CODE.charAt(i)] = i;
    }
})();

if (typeof module !== "undefined") { // is modular
    module.exports = { Monogram: { Base64: Base64 } };
} else {
    global.Monogram || (global.Monogram = {});
    global.Monogram.Base64 = Base64;
}

})(this.self || global);
//}@base64

/*
    var Base64 = require("./codec.base64").Monogram.Base64;

    function test1() { // encode/decode String <-> Base64String
        var base64String = new Base64("abc").toBase64String(); // -> "YWJj"
        var decode = new Base64(base64String, true).toString(); // -> "abc"

        console.log( base64String === "YWJj" );
        console.log( decode === "abc" );
    }

    function test2() { // some case
        console.log(new Base64("abc").toBase64String() === "YWJj" );
        console.log(new Base64("abcd").toBase64String() === "YWJjZA==" );
        console.log(new Base64("abcde").toBase64String() === "YWJjZGU=" );
        console.log(new Base64("abcdef").toBase64String() === "YWJjZGVm" );
    }

    function test3() { // BinaryData to Base64String
        function xhr(url) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, false); // false is sync
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
            xhr.send(null);
            return xhr.responseText + "";
        }
        var binary = xhr("uupaa.jpg"), point1 = Date.now(), rv1;
        for (var i = 0; i < 100; ++i) { rv1 = Base64.btoa(binary, true); }
        console.log(Date.now() - point1); // 27ms (quick)

        var binary = xhr("uupaa.jpg"), point2 = Date.now(), rv2;
        for (var i = 0; i < 100; ++i) { rv2 = new Base64(binary).toBase64String(); }
        console.log(Date.now() - point2); // 44ms (slow)

        if (rv1 === rv2) {
            console.log("ok");
        } else {
            console.log("ng");
        }
    }
 */

/*!
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 */

/*global define: false*/

var Mustache;

(function (exports) {
  if (typeof module !== "undefined" && module.exports) {
    module.exports = exports; // CommonJS
  } else if (typeof define === "function") {
    define(exports); // AMD
  } else {
    Mustache = exports; // <script>
  }
}((function () {

  var exports = {};

  exports.name = "mustache.js";
  exports.version = "0.7.1";
  exports.tags = ["{{", "}}"];

  exports.Scanner = Scanner;
  exports.Context = Context;
  exports.Writer = Writer;

  var whiteRe = /\s*/;
  var spaceRe = /\s+/;
  var nonSpaceRe = /\S/;
  var eqRe = /\s*=/;
  var curlyRe = /\s*\}/;
  var tagRe = /#|\^|\/|>|\{|&|=|!/;

  // Workaround for https://issues.apache.org/jira/browse/COUCHDB-577
  // See https://github.com/janl/mustache.js/issues/189
  function testRe(re, string) {
    return RegExp.prototype.test.call(re, string);
  }

  function isWhitespace(string) {
    return !testRe(nonSpaceRe, string);
  }

  var isArray = Array.isArray || function (obj) {
    return Object.prototype.toString.call(obj) === "[object Array]";
  };

  function escapeRe(string) {
    return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
  }

  var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };

  function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  }

  // Export the escaping function so that the user may override it.
  // See https://github.com/janl/mustache.js/issues/244
  exports.escape = escapeHtml;

  function Scanner(string) {
    this.string = string;
    this.tail = string;
    this.pos = 0;
  }

  /**
   * Returns `true` if the tail is empty (end of string).
   */
  Scanner.prototype.eos = function () {
    return this.tail === "";
  };

  /**
   * Tries to match the given regular expression at the current position.
   * Returns the matched text if it can match, the empty string otherwise.
   */
  Scanner.prototype.scan = function (re) {
    var match = this.tail.match(re);

    if (match && match.index === 0) {
      this.tail = this.tail.substring(match[0].length);
      this.pos += match[0].length;
      return match[0];
    }

    return "";
  };

  /**
   * Skips all text until the given regular expression can be matched. Returns
   * the skipped string, which is the entire tail if no match can be made.
   */
  Scanner.prototype.scanUntil = function (re) {
    var match, pos = this.tail.search(re);

    switch (pos) {
    case -1:
      match = this.tail;
      this.pos += this.tail.length;
      this.tail = "";
      break;
    case 0:
      match = "";
      break;
    default:
      match = this.tail.substring(0, pos);
      this.tail = this.tail.substring(pos);
      this.pos += pos;
    }

    return match;
  };

  function Context(view, parent) {
    this.view = view;
    this.parent = parent;
    this.clearCache();
  }

  Context.make = function (view) {
    return (view instanceof Context) ? view : new Context(view);
  };

  Context.prototype.clearCache = function () {
    this._cache = {};
  };

  Context.prototype.push = function (view) {
    return new Context(view, this);
  };

  Context.prototype.lookup = function (name) {
    var value = this._cache[name];

    if (!value) {
      if (name === ".") {
        value = this.view;
      } else {
        var context = this;

        while (context) {
          if (name.indexOf(".") > 0) {
            var names = name.split("."), i = 0;

            value = context.view;

            while (value && i < names.length) {
              value = value[names[i++]];
            }
          } else {
            value = context.view[name];
          }

          if (value != null) {
            break;
          }

          context = context.parent;
        }
      }

      this._cache[name] = value;
    }

    if (typeof value === "function") {
      value = value.call(this.view);
    }

    return value;
  };

  function Writer() {
    this.clearCache();
  }

  Writer.prototype.clearCache = function () {
    this._cache = {};
    this._partialCache = {};
  };

  Writer.prototype.compile = function (template, tags) {
    var fn = this._cache[template];

    if (!fn) {
      var tokens = exports.parse(template, tags);
      fn = this._cache[template] = this.compileTokens(tokens, template);
    }

    return fn;
  };

  Writer.prototype.compilePartial = function (name, template, tags) {
    var fn = this.compile(template, tags);
    this._partialCache[name] = fn;
    return fn;
  };

  Writer.prototype.compileTokens = function (tokens, template) {
    var fn = compileTokens(tokens);
    var self = this;

    return function (view, partials) {
      if (partials) {
        if (typeof partials === "function") {
          self._loadPartial = partials;
        } else {
          for (var name in partials) {
            self.compilePartial(name, partials[name]);
          }
        }
      }

      return fn(self, Context.make(view), template);
    };
  };

  Writer.prototype.render = function (template, view, partials) {
    return this.compile(template)(view, partials);
  };

  Writer.prototype._section = function (name, context, text, callback) {
    var value = context.lookup(name);

    switch (typeof value) {
    case "object":
      if (isArray(value)) {
        var buffer = "";

        for (var i = 0, len = value.length; i < len; ++i) {
          buffer += callback(this, context.push(value[i]));
        }

        return buffer;
      }

      return value ? callback(this, context.push(value)) : "";
    case "function":
      var self = this;
      var scopedRender = function (template) {
        return self.render(template, context);
      };

      var result = value.call(context.view, text, scopedRender);
      return result != null ? result : "";
    default:
      if (value) {
        return callback(this, context);
      }
    }

    return "";
  };

  Writer.prototype._inverted = function (name, context, callback) {
    var value = context.lookup(name);

    // Use JavaScript's definition of falsy. Include empty arrays.
    // See https://github.com/janl/mustache.js/issues/186
    if (!value || (isArray(value) && value.length === 0)) {
      return callback(this, context);
    }

    return "";
  };

  Writer.prototype._partial = function (name, context) {
    if (!(name in this._partialCache) && this._loadPartial) {
      this.compilePartial(name, this._loadPartial(name));
    }

    var fn = this._partialCache[name];

    return fn ? fn(context) : "";
  };

  Writer.prototype._name = function (name, context) {
    var value = context.lookup(name);

    if (typeof value === "function") {
      value = value.call(context.view);
    }

    return (value == null) ? "" : String(value);
  };

  Writer.prototype._escaped = function (name, context) {
    return exports.escape(this._name(name, context));
  };

  /**
   * Calculates the bounds of the section represented by the given `token` in
   * the original template by drilling down into nested sections to find the
   * last token that is part of that section. Returns an array of [start, end].
   */
  function sectionBounds(token) {
    var start = token[3];
    var end = start;

    var tokens;
    while ((tokens = token[4]) && tokens.length) {
      token = tokens[tokens.length - 1];
      end = token[3];
    }

    return [start, end];
  }

  /**
   * Low-level function that compiles the given `tokens` into a function
   * that accepts three arguments: a Writer, a Context, and the template.
   */
  function compileTokens(tokens) {
    var subRenders = {};

    function subRender(i, tokens, template) {
      if (!subRenders[i]) {
        var fn = compileTokens(tokens);
        subRenders[i] = function (writer, context) {
          return fn(writer, context, template);
        };
      }

      return subRenders[i];
    }

    return function (writer, context, template) {
      var buffer = "";
      var token, sectionText;

      for (var i = 0, len = tokens.length; i < len; ++i) {
        token = tokens[i];

        switch (token[0]) {
        case "#":
          sectionText = template.slice.apply(template, sectionBounds(token));
          buffer += writer._section(token[1], context, sectionText, subRender(i, token[4], template));
          break;
        case "^":
          buffer += writer._inverted(token[1], context, subRender(i, token[4], template));
          break;
        case ">":
          buffer += writer._partial(token[1], context);
          break;
        case "&":
          buffer += writer._name(token[1], context);
          break;
        case "name":
          buffer += writer._escaped(token[1], context);
          break;
        case "text":
          buffer += token[1];
          break;
        }
      }

      return buffer;
    };
  }

  /**
   * Forms the given array of `tokens` into a nested tree structure where
   * tokens that represent a section have a fifth item: an array that contains
   * all tokens in that section.
   */
  function nestTokens(tokens) {
    var tree = [];
    var collector = tree;
    var sections = [];
    var token, section;

    for (var i = 0; i < tokens.length; ++i) {
      token = tokens[i];

      switch (token[0]) {
      case "#":
      case "^":
        token[4] = [];
        sections.push(token);
        collector.push(token);
        collector = token[4];
        break;
      case "/":
        if (sections.length === 0) {
          throw new Error("Unopened section: " + token[1]);
        }

        section = sections.pop();

        if (section[1] !== token[1]) {
          throw new Error("Unclosed section: " + section[1]);
        }

        if (sections.length > 0) {
          collector = sections[sections.length - 1][4];
        } else {
          collector = tree;
        }
        break;
      default:
        collector.push(token);
      }
    }

    // Make sure there were no open sections when we're done.
    section = sections.pop();

    if (section) {
      throw new Error("Unclosed section: " + section[1]);
    }

    return tree;
  }

  /**
   * Combines the values of consecutive text tokens in the given `tokens` array
   * to a single token.
   */
  function squashTokens(tokens) {
    var token, lastToken, squashedTokens = [];

    for (var i = 0; i < tokens.length; ++i) {
      token = tokens[i];

      if (lastToken && lastToken[0] === "text" && token[0] === "text") {
        lastToken[1] += token[1];
        lastToken[3] = token[3];
      } else {
        lastToken = token;
        squashedTokens.push(token);
      }
    }

    return squashedTokens;
  }

  function escapeTags(tags) {
    if (tags.length !== 2) {
      throw new Error("Invalid tags: " + tags.join(" "));
    }

    return [
      new RegExp(escapeRe(tags[0]) + "\\s*"),
      new RegExp("\\s*" + escapeRe(tags[1]))
    ];
  }

  /**
   * Breaks up the given `template` string into a tree of token objects. If
   * `tags` is given here it must be an array with two string values: the
   * opening and closing tags used in the template (e.g. ["<%", "%>"]). Of
   * course, the default is to use mustaches (i.e. Mustache.tags).
   */
  exports.parse = function (template, tags) {
    template = template || '';
    tags = tags || exports.tags;

    var tagRes = escapeTags(tags);
    var scanner = new Scanner(template);

    var tokens = [],      // Buffer to hold the tokens
        spaces = [],      // Indices of whitespace tokens on the current line
        hasTag = false,   // Is there a {{tag}} on the current line?
        nonSpace = false; // Is there a non-space char on the current line?

    // Strips all whitespace tokens array for the current line
    // if there was a {{#tag}} on it and otherwise only space.
    function stripSpace() {
      if (hasTag && !nonSpace) {
        while (spaces.length) {
          tokens.splice(spaces.pop(), 1);
        }
      } else {
        spaces = [];
      }

      hasTag = false;
      nonSpace = false;
    }

    var start, type, value, chr;

    while (!scanner.eos()) {
      start = scanner.pos;
      value = scanner.scanUntil(tagRes[0]);

      if (value) {
        for (var i = 0, len = value.length; i < len; ++i) {
          chr = value.charAt(i);

          if (isWhitespace(chr)) {
            spaces.push(tokens.length);
          } else {
            nonSpace = true;
          }

          tokens.push(["text", chr, start, start + 1]);
          start += 1;

          if (chr === "\n") {
            stripSpace(); // Check for whitespace on the current line.
          }
        }
      }

      start = scanner.pos;

      // Match the opening tag.
      if (!scanner.scan(tagRes[0])) {
        break;
      }

      hasTag = true;
      type = scanner.scan(tagRe) || "name";

      // Skip any whitespace between tag and value.
      scanner.scan(whiteRe);

      // Extract the tag value.
      if (type === "=") {
        value = scanner.scanUntil(eqRe);
        scanner.scan(eqRe);
        scanner.scanUntil(tagRes[1]);
      } else if (type === "{") {
        var closeRe = new RegExp("\\s*" + escapeRe("}" + tags[1]));
        value = scanner.scanUntil(closeRe);
        scanner.scan(curlyRe);
        scanner.scanUntil(tagRes[1]);
        type = "&";
      } else {
        value = scanner.scanUntil(tagRes[1]);
      }

      // Match the closing tag.
      if (!scanner.scan(tagRes[1])) {
        throw new Error("Unclosed tag at " + scanner.pos);
      }

      tokens.push([type, value, start, scanner.pos]);

      if (type === "name" || type === "{" || type === "&") {
        nonSpace = true;
      }

      // Set the tags for the next time around.
      if (type === "=") {
        tags = value.split(spaceRe);
        tagRes = escapeTags(tags);
      }
    }

    tokens = squashTokens(tokens);

    return nestTokens(tokens);
  };

  // The high-level clearCache, compile, compilePartial, and render functions
  // use this default writer.
  var _writer = new Writer();

  /**
   * Clears all cached templates and partials in the default writer.
   */
  exports.clearCache = function () {
    return _writer.clearCache();
  };

  /**
   * Compiles the given `template` to a reusable function using the default
   * writer.
   */
  exports.compile = function (template, tags) {
    return _writer.compile(template, tags);
  };

  /**
   * Compiles the partial with the given `name` and `template` to a reusable
   * function using the default writer.
   */
  exports.compilePartial = function (name, template, tags) {
    return _writer.compilePartial(name, template, tags);
  };

  /**
   * Compiles the given array of tokens (the output of a parse) to a reusable
   * function using the default writer.
   */
  exports.compileTokens = function (tokens, template) {
    return _writer.compileTokens(tokens, template);
  };

  /**
   * Renders the `template` with the given `view` and `partials` using the
   * default writer.
   */
  exports.render = function (template, view, partials) {
    return _writer.render(template, view, partials);
  };

  // This is here for backwards compatibility with 0.4.x.
  exports.to_html = function (template, view, partials, send) {
    var result = exports.render(template, view, partials);

    if (typeof send === "function") {
      send(result);
    } else {
      return result;
    }
  };

  return exports;

}())));
// Asset.js:

/*
    var Asset = require("./Asset").Asset;

    var asset = new Asset(json);
 */

(function(global) {

// --- header ----------------------------------------------
function Asset(json) {
    this._asset = json;
    this._assetQueue = new AssetQueue();
}
Asset.prototype = {
    has: Asset_has,                 // Asset#has(id:String):Boolean
    get: Asset_get,                 // Asset#get(id:String):Object
    download: Asset_download,       // Asset#downLoad(ids:String/StringArray, fn:Function, force:Boolean(= false)):void
    getTreeNodes: Asset_getTreeNodes, // Asset#getTreeNodes(id:String = ""):Array
    getSceneRelationObject: Asset_getSceneRelationObject,// Asset#getSceneRelationObject(id:String):Object
    downloadSceneRelationCSS: Asset_downloadSceneRelationCSS, // Asset#downloadSceneRelationCSS(id:String, fn:Function):void
    downloadSceneRelationImage: Asset_downloadSceneRelationImage, // Asset#downloadSceneRelationImage(id:String, fn:Function):void
    // --- refresh cache ---
    refresh: Asset_refresh          // Asset#refresh(curtText:String, lastText:String, fn:Function):void
};

// --- library scope vars ----------------------------------

// --- implement -------------------------------------------
function Asset_has(id) { // @arg String: asset id
                         // @ret Boolean:
    return id in this._asset.list;
}

function Asset_get(id) { // @arg String: asset id
                         // @ret Object: asset info Object
    return this._asset.list[id] || {};
}

function Asset_download(ids,     // @arg String/StringArray: id or [id, ...]
                        fn,      // @arg Function: fn(err:Error, result:AssetIDStringArray)
                        force) { // @arg Boolean(= false): force download
    force = force || false;

    if (typeof ids === "string") {
        ids = [ids];
    }
    var that = this;
    var await = new Await(ids.length, fn);
    var cache = Zabuton.getInstance().cache();

    ids.forEach(function(id) {
        if (id) {
            if (!force && cache.has(id)) {
                await.pass(id);
            } else {
                that._assetQueue.add(id, function(err, id) {
                    err ? await.miss(id)
                        : await.pass(id);
                });
            }
        }
    });
}

function Asset_getSceneRelationObject(id) { // @arg String(= ""): sceneID, "" is all scene
                                            // @ret Object: { css, preload, bgimage }
    if (id) {
        return this._asset.relation[id] || {};
    }
    return this._asset.relation;
}

function Asset_downloadSceneRelationCSS(id,   // @arg String: scene id
                                        fn) { // @arg Function: fn(err:Error, result:CSSAssetIDArray)
    var ids = this._asset.relation[id].css; // [css-asset-id, ...]

    if (!ids && !ids.length) {
        fn && fn(null, []);
        return;
    }
    // --- download template css files ---
    this.download(ids, function(err) {
        fn && fn(err, ids);
    });
}

function Asset_downloadSceneRelationImage(id,
                                          fn) {
    var ids = this._asset.relation[id].image; // [image-asset-id, ...]

    if (!ids && !ids.length) {
        fn && fn(null, []);
        return;
    }
    // --- download images ---
    this.download(ids, function(err) {
        fn && fn(err, ids);
    });
}

function Asset_getTreeNodes(id) { // @arg String(= ""): current scene id
                                  // @ret Array: children. [scene-id, ...]
    function _nest(obj) {
        if (rv.length) {
            return;
        }
        for (var key in obj) {
            if (key === id) {
                rv = Object.keys(obj[key]);
                return;
            }
            if (object === obj[key].constructor) {
                _nest(obj[key]);
                if (rv.length) {
                    return;
                }
            }
        }
    }

    if (!id) {
        return Object.keys(this._asset.tree); // root scene
    }

    var object = ({}).constructor;
    var rv = [];

    _nest(this._asset.tree);
    return rv;
}

function Asset_refresh(curtText, // @arg String: current asset.json
                       lastText, // @arg String: last(old) asset.json
                       fn) {     // @arg Function: fn(err:Error,
                                 //                   appendIDs:Array,
                                 //                   removedIDs:Array,
                                 //                   replacedIDs:Array)
    var appendIDs   = []; // [ id, ... ]
    var removedIDs  = []; // [ id, ... ]
    var replacedIDs = []; // [ id ...  ]

    var curtJson = JSON.parse( curtText ); // json <- text
    var lastJson = JSON.parse( lastText ); // json <- text

    Object.keys(curtJson.list).forEach(function(id) {
        if (id in lastJson.list) {
            if (lastJson.list[id].hash !== curtJson.list[id].hash) {
                replacedIDs.push(id);
            }
        } else {
            appendIDs.push(id);
        }
    });

    var diffs = xorArray(Object.keys(curtJson.list),
                         Object.keys(lastJson.list));
    removedIDs = xorArray(diffs, appendIDs);

    fn(null, appendIDs, removedIDs, replacedIDs);
}

// --- helper ---------------------------------------------
function xorArray(that, compare) { // @arg Array: compare array
                                   // @ret Array: filtered array
                                   // @desc: XOR operator
    var rv = [], index, i = 0, iz = that.length;

    for (; i < iz; ++i) {
        if (i in that) {
            index = compare.indexOf(that[i]);
            index >= 0 ? compare.splice(index, 1)
                       : rv.push(that[i]);
        }
    }
    return rv.concat(compare);
}


// --- build and export API --------------------------------
if (typeof module !== "undefined") { // is modular
    module.exports = { Asset: Asset };
} else {
    global.Asset = Asset;
}

})(this.self || global);

// AsseAgent.js: AssetQueue に使役されるエージェント

/*
    var AssetAgent = require("./AssetAgent").AssetAgent;

    var agent = new AssetAgent();
 */

(function(global) {

// --- header ----------------------------------------------
function AssetAgent(number) { // @arg Integer: agent number
    this._status = {
        number: number,
        id:     "", // job asset id
        type:   "", // job asset type
        url:    "", // job asset url
        state:  "ready" // job state. "ready", "progress", "error", "notfound"
    };
}
AssetAgent.prototype = {
    isReady:    AssetAgent_isReady,     // AssetAgent#isReady():Boolean
    isError:    AssetAgent_isError,     // AssetAgent#isError():Boolean
    isProgress: AssetAgent_isProgress,  // AssetAgent#isProgress():Boolean
    isNotFound: AssetAgent_isNotFound,  // AssetAgent#isNotFound():Boolean
    getStatus:  AssetAgent_getStatus,   // AssetAgent#getStatus():Object
    job:        AssetAgent_job          // AssetAgent#job(id:String, fn:Function):void
};

// --- library scope vars ----------------------------------

// --- implement -------------------------------------------
function AssetAgent_isReady() {
    return this._status.state === "ready";
}

function AssetAgent_isError() {
    return this._status.state === "error";
}

function AssetAgent_isProgress() {
    return this._status.state === "progress";
}

function AssetAgent_isNotFound() {
    return this._status.state === "notfound";
}

function AssetAgent_getStatus() { // @ret Object:
    return this._status;
}

function AssetAgent_job(id,   // @arg String: asset id
                        fn) { // @arg Function: fn(err:Error, state:String)
    var that = this;

    if (!Zabuton.getInstance().asset().has(id)) { // asset not found
        that._status.state = "notfound";
        fn( new TypeError("ASSET_NOT_FOUND: " + id), that._status.state );
        return;
    }

    var asset = Zabuton.getInstance().asset().get(id);
    var type  = asset.type;
    var url   = asset.url;
    var hash  = asset.hash || "";
    var fileType = "text";

    this._status = { id: id, type: type, url: url, state: "progress" };

    // console.log(JSON.stringify(this._status));

    switch (type) {
    case "text/css":
    case "scene/html":
    case "scene/class":
        break;
    case "image/gif":
    case "image/png":
    case "image/jpg":
    case "image/jpeg":
        fileType = "image/base64";
        break;
    default:
        that._status.state = "error";
        throw new TypeError("BAD_TYPE: " + type);
    }
    new Ajax().load(url, { type: fileType }, function(err, text, time) {
        if (err) {
            that._status.state = "error";
        } else {
            Zabuton.getInstance().cache().set(id, text, hash, time);
            that._status.state = "ready";
        }
        fn(err, that._status.state);
    });
}

// --- build and export API --------------------------------
if (typeof module !== "undefined") { // is modular
    module.exports = { AssetAgent: AssetAgent };
} else {
    global.AssetAgent = AssetAgent;
}

})(this.self || global);

// AsseQueue.js: ダウンロードジョブキューを保持し、AssetAgentにjobを割り振る

/*
    var AssetQueue = require("./AssetQueue").AssetQueue;

    var queue = new AssetQueue();
 */

(function(global) {

// --- header ----------------------------------------------
function AssetQueue() {
    this._agent = [
        new AssetAgent(1),
        new AssetAgent(2),
        new AssetAgent(3),
        new AssetAgent(4),
        new AssetAgent(5)
    ];
    this._jobQueue = [];    // [ { url, cache, errorCount }, ... ]
    this._timerID = 0;      // queue timer id
    this._timerDelay = 0;   // unit: ms
}
AssetQueue.prototype = {
    add:    AssetQueue_add,     // AssetQueue#add(id:String, fn:Function):void
    start:  AssetQueue_start,   // AssetQueue#start():void
    stop:   AssetQueue_stop     // AssetQueue#stop():void
};

// --- library scope vars ----------------------------------

// --- implement -------------------------------------------
function AssetQueue_add(id,   // @arg String:
                        fn) { // @arg Function(= null): fn(err:Error, id:String)
    this._jobQueue.push({ id: id, fn: fn || null, errorCount: 0 });
    this.start(); // auto start
}

function AssetQueue_start() {
    var that = this;

    if (!this._timerID) {
        this._timerID = setInterval(function() {
            _tick(that);
        }, this._timerDelay);
    }
}

function AssetQueue_stop() {
    if (this._timerID) {
        clearInterval(this._timerID);
        this._timerID = 0;
    }
}

function _tick(that) {
    if (!that._jobQueue.length) { // empty -> auto stop
        return that.stop();
    }
    that._agent.forEach(function(agent) {
        if (agent.isReady()) {
            var job = that._jobQueue.shift();

            // job assign
            job && agent.job(job.id, function(err, state) {
                if (err) { // state === "error" -> re-schedule (limit: 3 times)
                           // state === "notfound" -> error
                    switch (state) {
                    case "error":
                        if (++job.errorCount > 3) { // [!] magic word
                            console.log("retry out id: " + job.id);
                            job.fn && job.fn(new TypeError("RETRY OUT"), job.id);
                        } else {
                            console.log("retry id: " + job.id);
                            that._jobQueue.push(job);
                        }
                        break;
                    case "notfound":
                        console.log("file or asset-id not found id: " + job.id);
                        break;
                    }
                } else {
//                  console.log("downloaded id:@@".at(job.id));
                    job.fn && job.fn(null, job.id);
                }
            });
        } else if (agent.isProgress()) {
//          console.log("progress.. @@".at(mm.dump(agent.getStatus())));
        } else if (agent.isError()) {
//          console.log("error.. @@".at(mm.dump(agent.getStatus())));
        }
    });
}

// --- build and export API --------------------------------
if (typeof module !== "undefined") { // is modular
    module.exports = { AssetQueue: AssetQueue };
} else {
    global.AssetQueue = AssetQueue;
}

})(this.self || global);
// Scene.js
/*

    var Scene = require("./Scene").Scene;

    var scene = new Scene();
 */

(function(global) {

// --- header ----------------------------------------------
function Scene() {
    var that = this;

    this._sceneDB = {};     // { scene-id: { instance:BaseScene, state:Integer, id:String } }
    this._stack = [];       // [ { id, param }, ... ]
    this._history = [];     // [ { id, param }, ... ]
    this._timerID = 0;      // stack timer id
    this._currentSceneID = "";
    this._sceneTransitionEventStart = 0; // for debug
    this._sceneTransitionEventFinish = 0;
    this._sceneTransitionParam = {};

    global.addEventListener("hashchange", function(event) {
        that._sceneTransitionEventStart = event.timeStamp;
        that._sceneTransitionEventFinish = 0;

        var id = location.hash.replace(/^#/, "");

        if (event.newURL) {
            id = event.newURL.split("#")[1]; // next scene
        }
console.log("hashchange");
        _open(that, id, that._sceneTransitionParam); // use param
        that._sceneTransitionParam = {}; // clear param
    });
}
Scene.prototype = {
    register:   Scene_register, // Scene#register(id:String, fn:Function):void
    prefetch:   Scene_prefetch, // Scene#prefetch(ids:Array):this
    open:       Scene_open,     // Scene#open(id:String = "", sceneTransitionParam:Object = {}):void
    has:        Scene_has,      // Scene#has(id:String):Boolean
//  get:        Scene_get,      // Scene#get(id:String = ""):SceneInstance
    build:      Scene_build,    // Scene#build(id:String, sceneTransitionParam:Object, fn:Function = null):void
    show:       Scene_show,     // Scene#show(id:String, fn:Function = null):void
    hide:       Scene_hide,     // Scene#hide(id:String, fn:Function = null):void
    destroy:    Scene_destroy,  // Scene#destroy(id:String, fn:Function = null):void
    getInfo:    Scene_getInfo   // Scene#getInfo():Object - { ... }
};

// --- library scope vars ----------------------------------

// --- implement -------------------------------------------
function Scene_register(id,   // @arg String: scene-id. "top", "mission"
                        fn) { // @arg Function: fn(err:Error)
    if (this.has(id)) {
        fn(null); // ok - already registerd
        return;
    }
    var that = this;
    var zabuton = Zabuton.getInstance();
    var classID = zabuton.asset().get(id).bind; // scene-id(top) -> class-id(TopScene)

    // --- eval scene script. scene:"top" -> eval("TopScene.js") ---
    zabuton.asset().download([id, classID], function(err, result) {
        if (err) { return fn(err); }

        if (!that.has(id)) {
            Script.run( zabuton.cache().get(classID) );
        }
        that._sceneDB[id] = {
            instance: new global[classID](id, classID),
            state:    0, // 0: init, 1: builded, 2: shown, 3: hidden, 4: destroyed
            id:       id
        };
        fn(null); // ok
    });
}

function Scene_prefetch(ids) { // @arg Array: [scene-id, ...]
                               // prefetch and register next scenes
    var that = this;

    ids.forEach(function(id) {
        that.register(id, function(err) {
            console.log("prefetch: " + id);
            Zabuton.getInstance().asset().downloadSceneRelationImage(id);
        });
    });
    return this;
}

function Scene_open(id,                     // @arg String(= ""): scene-id, "" is rootScene. "top", "mypage", ...
                    sceneTransitionParam) { // @arg Object(= {}): { key: value }. aka: http://.../?key=value
    this._sceneTransitionEventStart = Date.now();
    this._sceneTransitionEventFinish = 0;
    this._sceneTransitionParam = sceneTransitionParam || {}; // set param

    var prev = location.hash.replace(/^#/, "");
    var next = id ? id.replace(/^#/, "")
                  : _getTopScene();

    if (prev != next) {
        location.hash = next; // -> fire hashchangeevent & use param
    } else {
        var node = document.getElementById("zabuton_view");

        if (!node) {
            _open(this, id, sceneTransitionParam);
        } else {
            console.log("skip scene transition");
        }
    }
}

function _getTopScene() { // @arg String:
    var topScenes = Zabuton.getInstance().asset().getTreeNodes();
    var id = topScenes[0];
    id = id.replace(/^#/, "");
    return id;
}

function _open(that, id, param) {
console.log("Scene._open");
    if (!id) {
        id = _getTopScene();
    }
    id = id.replace(/^#/, "");

    that._stack.push({ id: id, param: param || {} });
    that._sceneTransitionParam = {}; // clear param

    if (that._timerID) {
        clearTimeout(that._timerID);
    }
    that._timerID = setTimeout(_tick, 16);

    function _tick() {
console.log("_tick");
        // stack はフリッカー(チャタリング)を抑止するためのもの。
        // 短時間に、ページ遷移リクエストを連続で処理すると、
        // ユーザには不具合(チラチラ)に見えてしまうため。対策する。
        //
        // ページ遷移リクエスト( open ) の呼び出しで stack にリクエストを積み、
        // _tick() で stack の一番上(最後のリクエスト)を取り出しページ遷移を行う。
        // 取り出した後は stack をクリアし余計なリクエストを破棄する。
        var prev = that._history[that._history.length - 1] || { id: "", param: {} };
        var next = that._stack[that._stack.length - 1];

        console.log("scene transition prev:" + prev.id + ", next:" + next.id);

        // --- build next(new) scene ---
        that.build(next.id, next.param, function(err) {
            if (!err) {
                // --- hide prev(old) scene ---
                that.hide(next.id === prev.id ? "" : prev.id, function(err) {
                    // --- show next(new) scene ---
                    that.show(next.id, function(err) {
                        // --- update status ---
                        that._currentSceneID = next.id;
                        location.hash = that._currentSceneID; // [!] neeeeeeed

                        that._history.push({ id: next.id, param: next.param });
                        that._sceneTransitionEventFinish = Date.now();

                        // prefetch and register next scenes
                        that.prefetch(Zabuton.getInstance().asset().getTreeNodes(next.id));

                        // --- destroy prev(old) scene ---
                        that.destroy(next.id === prev.id ? "" : prev.id, function(err) {
                            ;
                        });
                    });
                });
            } else {
                alert("scene transition error: " + err);
            }
            console.log("clear stack");
            that._stack = []; // clear stack
        });
    }
}

function Scene_has(id) { // @arg String: scene-id
    return id in this._sceneDB;
}

/*
function Scene_get(id) { // @arg String( = ""): scene-id. "" is current scene
                         // @ret Object: { instance:BaseScene, state:Integer, id:String }
                         // @desc: get scene instance by scene id
    return this._sceneDB[id || this._currentSceneID];
}
 */

function Scene_build(id,
                     sceneTransitionParam,
                     fn) {
    var that = this;

    if (this.has(id)) {
        _build(this._sceneDB[id], fn);
    } else {
        // this case, scene was not exists -> self register
        this.register(id, function(err) {
            if (err) {
                fn( new TypeError("ERROR: UNKNOWN_SCENE_ID " + id) );
            } else {
                // scene is undefined
                _build(that._sceneDB[id], fn);
            }
        });
    }

    function _build(scene, fn) {
        scene.instance.setTransitionParam(sceneTransitionParam);
        scene.instance.build(function(err) {
            if (!err) {
                scene.state = 1; // builded
            }
            fn && fn(err);
        });
    }
}

function Scene_show(id,
                    fn) {
    var scene = this._sceneDB[id];

    scene.instance.show(function(err) {
        if (!err) {
            scene.state = 2; // shown
        }
        fn && fn(err);
    });
}

function Scene_hide(id,
                    fn) {
    if (!id) { // [!] unknown id -> empty history or prev qe next -> immediate callback
        fn && fn(null);
        return;
    }
    var scene = this._sceneDB[id];

    scene.instance.hide(function(err) {
        if (!err) {
            scene.state = 3; // hidden
        }
        fn && fn(err);
    });
}

function Scene_destroy(id,   // @arg String:
                       fn) { // @arg Function:
    if (!id) { // [!] unknown id -> maybe empty history -> immediate callback
        fn && fn(null);
        return;
    }
    var scene = this._sceneDB[id];

    scene.instance.destroy(function(err) {
        if (!err) {
            scene.state = 4; // destroyed
        }
        fn && fn(err);
    });
}

function Scene_getInfo() { // @ret Object - { scene, transition }
                           //      sceneID - String: scene asset id
                           //      transition - Object: { start:Integer, finish:Integer }
    return {
        sceneID:    this._currentSceneID,
        transition: {
            start:  this._sceneTransitionEventStart,
            finish: this._sceneTransitionEventFinish
        }
    };
}

// --- build and export API --------------------------------
if (typeof module !== "undefined") { // is modular
    module.exports = { Scene: Scene };
} else {
    global.Scene = Scene;
}

})(this.self || global);

// BaseScene.js:

/*
    var BaseScene = require("./BaseScene").BaseScene;

 */
(function(global) {

function BaseScene(sceneID,   // @arg String: scene id. "top"
                   classID) { // @arg String: class id. "TopClass"
    this._init(sceneID, classID);
}
BaseScene.prototype = {
    _init:              _init,
    setTransitionParam: setTransitionParam,
    getTransitionParam: getTransitionParam,
    getParentNode:      getParentNode,
    getViewNode:        getViewNode,
    getSceneID:         getSceneID,
    getClassID:         getClassID,
    build:              build,
    show:               show,
    hide:               hide,
    destroy:            destroy,
    getViewNodeStyle:   getViewNodeStyle,
    update:             update,
    render:             render
};

// --- library scope vars ----------------------------------

// --- implement -------------------------------------------
function _init(sceneID, classID) {
    this._sceneID = sceneID;
    this._classID = classID;
    this._parentNode = document.getElementById("zabuton_scene");
    this._viewNode = null;
    this._transitionParam = {};
}

function setTransitionParam(obj) { // @arg Object: { key: value, ... }
    this._transitionParam = obj || {};
}

function getTransitionParam() { // @ret Object:
    return this._transitionParam;
}

function getParentNode() { // @ret Node: <div id="zabuton_scene">
    return this._parentNode;
}

function getViewNode() { // @ret Node: <div id="zabuton_view">
    return this._viewNode;
}

function getSceneID() { // @ret String: "top"
    return this._sceneID;
}

function getClassID() { // @ret String: "TopClass"
    return this._classID;
}

function build(fn) { // @arg Function: fn(err:Error)
                     // @callStack: Scene#open -> Scene#build -> BaseScene#build
    if (!this._viewNode) {
        this._viewNode = document.createElement("div");
        this._viewNode.id = "zabuton_view";
        this._viewNode.style.cssText = this.getViewNodeStyle();
        this._parentNode.appendChild( this._viewNode ); // HTMLElement#add()
        this.update("build", function(err) {
            fn && fn(null); // ok
        });
    } else {
        fn && fn(null); // ok
    }
}

function show(fn) { // @arg Function: fn(err:Error)
                    // @callStack: Scene#open -> Scene#show -> BaseScene#show
    var that = this;

    if (this._viewNode) {
        this.update("show", function(err) {
            that._viewNode.style.display = "block";
            fn && fn(null); // ok
        });
    } else {
        fn && fn(null); // ok
    }
}

function hide(fn) { // @arg Function: fn(err:Error)
                    // @callStack: Scene#open -> Scene#hide -> BaseScene#hide
    var that = this;

    if (this._viewNode) {
        this.update("hide", function(err) {
            that._viewNode.style.display = "none";
            fn && fn(null); // ok
        });
    } else {
        fn && fn(null); // ok
    }
}

function destroy(fn) { // @arg Function: fn(err:Error)
                       // @callStack: Scene#open -> Scene#destroy -> BaseScene#destroy
    var that = this;

    if (this._viewNode) {
        this.update("destroy", function(err) {
            that._viewNode.parentNode.removeChild(that._viewNode);
            that._viewNode = null;
            fn && fn(null); // ok
        });
    } else {
        fn && fn(null); // ok
    }
}

// --- override here ---
function getViewNodeStyle() { // @ret String: css text style
    return "position:relative;top:0;left:0;width:100%;" +
           "background-color:transparent;display:none";
}

function update(eventType, // @arg String: update event type. "build", "show", "hide", "destroy"
                fn) {      // @arg Function: callback. fn(err:Error)
    // your code here
    fn && fn(null); // ok
}

function render(json, // @arg Object: template data
                fn) { // @arg Function: callback. fn(err:Error)
    var that = this;
    var builder = new SceneBuilder(this.getSceneID());

    builder.buildCSS(function(err, css) {
        builder.applyCSS(css);
    });
    builder.render(json, function(err, node) {
        if (!err) {
            that.getViewNode().appendChild(node);
        }
        fn(err);
    });
}

// --- build and export API --------------------------------
if (typeof module !== "undefined") { // is modular
    module.exports = { BaseScene: BaseScene };
} else {
    global.BaseScene = BaseScene;
}

})(this.self || global);

// Builder.js

/*
    var SceneBuilder = require("./Builder").SceneBuilder;

    var sceneBuilder = new SceneBuilder();
 */

(function(global) {

// --- header ----------------------------------------------
function SceneBuilder(id) { // @arg String: scene id
    this._sceneID = id;
}
SceneBuilder.prototype = {
    buildCSS: SceneBuilder_buildCSS,// SceneBuilder#buildCSS(fn:Function):void - fn(err:Error, cssText:String)
    applyCSS: SceneBuilder_applyCSS,// SceneBuilder#applyCSS(cssText:String, fn:Function = null):void - fn(err:Error)
    render: SceneBuilder_render     // SceneBuilder#render(json:Object, fn:Function):void
};
SceneBuilder.trimQuote = SceneBuilder_trimQuote;
SceneBuilder.toRegExpEscapedString = SceneBuilder_toRegExpEscapedString;

// --- library scope vars ----------------------------------

// --- implement -------------------------------------------
function SceneBuilder_buildCSS(fn) { // @arg Function: fn(err, css)
                                     //     fn.err - Error:
                                     //     fn.css - String: dataURI effected css text
                                     // @desc: DBからCSSを取り出し、画像を埋め込んだCSSを生成する
    var zabuton = Zabuton.getInstance();

    // source css:
    //  E > F { background-image: url("http://example.com/hoge.png#hoge") }
    //                            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //
    // base64 effected css:
    //  E > F { background-image: url(data:image/png;base64,...) }
    //                            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //
    // 現在は、DBにキャッシュされているCSSを元に、
    // 毎回動的にBase64化された画像を埋め込んでいる
    //
    // Base64化した画像をCSSに埋め込んだ状態でキャッシュする方法もあるが、
    // 同じ画像を使いまわしている場合に、容量が肥大化するため、問題になる
    zabuton.asset().downloadSceneRelationCSS(this._sceneID, function(err, cssAssetIDArray) {
        if (err) { return fn(err, ""); }

        // --- query all background-image: url(url#id) ---
        var result = _collectCSSTextAndEmbeddedURLs(cssAssetIDArray); // { cssText, urls }
        var bgimages = Object.keys(result.urls);

        zabuton.asset().download(bgimages, function(err) {
            if (err) { return fn(err, ""); }

            var cssText = result.cssText;
            // console.log("CSS before", cssText.slice(0, 200));

            // --- swap url(...#id) to url(data:...) ---
            for (var id in result.urls) {
                var url = result.urls[id];
                var rex = SceneBuilder.toRegExpEscapedString(url);
                var dataURI = zabuton.getCache(id, true);

                // inject "url(...#id)" -> "url(data:image/png;base64,...)"
                cssText = cssText.replace(RegExp(rex, "g"), function(_) {
                    // console.log(_ + " -> url(" + dataURI.slice(0, 30) + ")");

                    return "url(" + dataURI + ")";
                });
            }
            fn(null, cssText);
        });
    });
}

function _collectCSSTextAndEmbeddedURLs(cssAssetIDArray) { // @arg CSSAssetIDArray: [css-asset-id, ...]
                                                           // @ret Object: { cssText, urls }
                                                           //       cssText - String:
                                                           //       urls - Object: { id: url }
    var urls = {};
    var ary;

    ary = cssAssetIDArray.map(function(cssAssetID) { // css-asset-id
        var text = Zabuton.getInstance().cache().get(cssAssetID); // css text
        var hash = _queryURLWrappedAssetID(text);   // { id: url, ... }

        for (var id in hash) {
            urls[id] = hash[id]; // { id: url } mixin { id: url }
        }
        return text;
    });
    return { cssText: ary.join(""), urls: urls };
}

//
// _queryURLWrappedAssetID('E > F { background-image: url("foobar.png#foobar") }')
//                                                    ~~~~~~~~~~~~~~~~~~~~~~~~
// --> [ { url: 'url("foobar.png#foobar")', id: "foobar" } ]
//
function _queryURLWrappedAssetID(text) { // @arg String: plain css text
                                         // @ret Object: { id: url }
                                         // @inner: query all url(...#id)
    var rv = {}; // { id: "url(...#bgimage-id)", ... }
    var rex = /url\(([^\)]+)\)/g, match;

    while (match = rex.exec(text)) {
        var outer = match[0]; // "url('...#id')"
        var inner = match[1]; // "'...#id'"  [!] maybe quoted( "..." or '...' )
        var id    = SceneBuilder.trimQuote(inner); // "'...#id'" -> "...#id"
        var pos   = id.indexOf("#");

        if (pos < 0) { // has not "#id"
            continue;
        }
        var id = id.slice(pos + 1); // "...#id" -> "id"
        if (!id) { // "...#" -> empty
            continue;
        }
        rv[id] = outer;
    }
    return rv;
}

function SceneBuilder_applyCSS(cssText, // @arg String:
                               fn) {    // @arg Function(= null): fn(err:Error)
                                        // @desc: <style id="zabuton_css">動的に生成したCSS</style> を追加/更新する
    _insertAndUpdateStyleNode("zabuton_css", cssText);
    fn && fn(null); // ok
}

function _insertAndUpdateStyleNode(nodeID,    // @arg String:
                                   cssText) { // @arg String:
    var node = document.querySelector("#" + nodeID);
    var head = document.getElementsByTagName("head")[0];

    if (node) {
        ;
    } else {
        node = document.createElement("style");
        node.id = nodeID;
        head.appendChild(node);
    }
    node.textContent = cssText;
    return node;
}




function SceneBuilder_render(json, // @arg Object: mustache view data
                             fn) { // @arg Function: fn(err:Error, dataURI:String)
    var zabuton = Zabuton.getInstance();
    var sceneID = this._sceneID

    zabuton.asset().download(sceneID, function(err) {
        if (!err) {
            _next( zabuton.cache().get(sceneID) );
        }
    });

    function _next(tmpl) { // @arg String: cached scene template html
        var body = document.createElement("body");
        var html = Mustache.render(tmpl, json);

        // render <div style="background-image: url(...#id)"> -> url(data:image/png;base64,...)
        _renderURL(html, function(err, html) {
            body.innerHTML = html;

            // <div id="{{scene-id}}">...</div> で囲まれた document fragment を読み込む
            var fragment = body.querySelector("#" + sceneID);


            // --- query all <a href="url?key=value" data-scene"#scene"> ---
            var anchorNodeList = fragment.querySelectorAll('a[data-scene]'); // [<a>, ...]
            var anchorNodeArray = Array.prototype.slice.call(anchorNodeList);

            anchorNodeArray.forEach(function(node) {
                var scene = node.getAttribute("data-scene").replace(/^#/, "");
                var obj = _parseURL(node.href).query;

                // keep original url
                node.setAttribute("data-href", node.href);

                var json = JSON.stringify(obj);
              //var href = 'javascript:Zabuton.getInstance().open("#@@",@@)'.at(scene, json);
                var href = 'javascript:Zabuton.getInstance().open("#' + scene + '",' + json + ')';
                node.setAttribute("href", href);
            });

            // --- query all <img src="url#id"> node ---
            var imageNodeList  = fragment.querySelectorAll('img[src*="#"]'); // [<img>, ...]
            var imageNodeArray = Array.prototype.slice.call(imageNodeList);

            var await = new Await(imageNodeArray.length, _callback);

            imageNodeArray.forEach(function(node) {
                var imageID = (node.getAttribute("src") || ""); // "#id" -> "id"

                var pos = imageID.indexOf("#");

                if (pos >= 0) {
                    imageID = imageID.slice(pos + 1); // "http://.../abc#def" -> "def"
                }
                if (!imageID) {
                    await.pass(imageID); // no asset-id
                }

                zabuton.asset().download(imageID, function(err) {
                    if (err) {
                        await.miss(imageID);
                    } else {
                        // keep original src
                        node.setAttribute("data-src", node.src);

                        node.src = zabuton.getCache(imageID, true); // overwrite <img src="...">
                        await.pass(imageID);
                    }
                });
            });

            function _callback(err, args) {
                if (err) {
                    fn(new TypeError("xxx"), fragment);
                } else {
                    fn(null, fragment);
                }
            }
        });
    }
}

function _renderURL(text, // @arg String: before text
                    fn) { // @arg Function: fn(err:Error, afterText:String)
                          // @desc: url("...#id") -> url("data:image/png;base64,...")

    var hash = _queryURLWrappedAssetID(text);   // { id: url, ... }
    var bgimages = Object.keys(hash);
    var zabuton = Zabuton.getInstance();

    zabuton.asset().download(bgimages, function(err) {
        if (err) { return fn(err, ""); }

        // console.log("CSS before", text.slice(0, 200));

        // --- swap url(...#id) to url(data:...) ---
        for (var id in hash) {
            var url = hash[id];
            var rex = SceneBuilder.toRegExpEscapedString(url);
            var dataURI = zabuton.getCache(id, true);

            // inject "url(...#id)" -> "url(data:image/png;base64,...)"
            text = text.replace(RegExp(rex, "g"), function(_) {
                // console.log(_ + " -> url(" + dataURI.slice(0, 30) + ")");

                return "url(" + dataURI + ")";
            });
        }
        fn(null, text);
    });
}

function SceneBuilder_toRegExpEscapedString(str) {
   return str.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
}

function SceneBuilder_trimQuote(str) {
    function _trims(str, chr) {
     // var esc = chr.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
        var esc = SceneBuilder_toRegExpEscapedString(chr);

        return str.trim().replace(RegExp("^" + esc + "+"), "").
                          replace(RegExp(esc + "+" + "$"), "");
    }

    var str = str.trim(), m = /^["']/.exec(str);

    if (m) {
        m = RegExp(m[0] + "$").exec(str);
        if (m) {
            return _trims(str, m[0]);
        }
    }
    return str;
}

function _parseURL(url) { // @arg URLString: abs or rel,
                          //                   "http://user:pass@example.com:8080/dir1/dir2/file.ext?a=b&c=d#fragment"
                          // @ret URLObject: { href, protocol, scheme, secure, host,
                          //                   auth, hostname, port, pathname, dir, file,
                          //                   search, query, fragment, ok }
                          //     href     - String:  "http://user:pass@example.com:8080/dir1/dir2/file.ext?a=b;c=d#fragment"
                          //     protocol - String:  "http:"
                          //     scheme   - String:  "http:"
                          //     secure   - Boolean: false
                          //     host     - String:  "user:pass@example.com:8080". has auth
                          //     auth     - String:  "user:pass"
                          //     hostname - String:  "example.com"
                          //     port     - Number:  8080
                          //     pathname - String:  "/dir1/dir2/file.ext"
                          //     dir      - String:  "/dir1/dir2"
                          //     file     - String:  "file.ext"
                          //     search   - String:  "?a=b&c=d"
                          //     query    - URLQueryObject: { a: "b", c: "d" }
                          //     fragment - String:  "#fragment"
                          //     ok       - Boolean: true is valid url
                          // @inner: parse URL

    function _extends(obj) { // @arg URLObject:
                             // @ret URLObject:
        var ary = obj.pathname.split("/");

        obj.href       = obj.href     || "";
        obj.protocol   = obj.protocol || "";
        obj.scheme     = obj.protocol;        // [alias]
        obj.secure     = obj.secure   || false;
        obj.host       = obj.host     || "";
        obj.auth       = obj.auth     || "";
        obj.hostname   = obj.hostname || "";
        obj.port       = obj.port     || 0;
        obj.pathname   = obj.pathname || "";
        obj.file       = ary.pop();
        obj.dir        = ary.join("/") + "/";
        obj.search     = obj.search   || "";
        obj.query      = _parseURLQuery(obj.search);
        obj.fragment   = obj.fragment || "";
        obj.ok         = obj.ok       || true;
        return obj;
    }

    var FILE =      /^(file:)\/{2,3}(?:localhost)?([^ ?#]*)(?:(\?[^#]*))?(?:(#.*))?$/i,
                    //                 localhost    /dir/f.ext ?key=value    #hash
                    //  [1]                         [2]        [3]          [4]
        URL =       /^(\w+:)\/\/((?:([\w:]+)@)?([^\/:]+)(?::(\d*))?)([^ :?#]*)(?:(\?[^#]*))?(?:(#.*))?$/,
                    //  https://    user:pass@    server   :port    /dir/f.ext   ?key=value     #hash
                    //  [1]         [3]           [4]       [5]     [6]         [7]            [8]
        PATH =      /^([^ ?#]*)(?:(\?[^#]*))?(?:(#.*))?$/;
                    //  /dir/f.ext   key=value    hash
                    //  [1]          [2]          [3]

    var m, ports = { "http:": 80, "https": 443, "ws:": 81, "wss:": 816 };

    m = FILE.exec(url);
    if (m) {
        return _extends({
            href: url, protocol: m[1], pathname: m[2],
                       search:   m[3], fragment: m[4] });
    }
    m = URL.exec(url);
    if (m) {
        return _extends({
            href: url, protocol: m[1],
                       secure:   m[1] === "https:" || m[1] === "wss:",
                       host:     m[2], auth:   m[3],
                       hostname: m[4], port:   m[5] ? +m[5] : (ports[m[1]] || 0),
                       pathname: m[6], search: m[7],
                       fragment: m[8] });
    }
    m = PATH.exec(url);
    if (m) {
        return _extends({
            href: url, pathname: m[1], search: m[2], fragment: m[3] });
    }
    return _extends({ href: url, pathname: url, ok: false });
}

function _parseURLQuery(query) { // @arg URLString/URLQueryString: "key1=a;key2=b;key3=0;key3=1"
                                 // @ret URLQueryObject: { key1: "a", key2: "b", key3: ["0", "1"] }
                                 // @help: mm.url.parseQuery
                                 // @desc: parse query string
    function _parse(_, key, value) {
        var k = global.encodeURIComponent(key),
            v = global.encodeURIComponent(value);

        if (rv[k]) {
            if (Array.isArray(rv[k])) {
                rv[k].push(v);
            } else {
                rv[k] = [rv[k], v];
            }
        } else {
            rv[k] = v;
        }
        return "";
    }

    var rv = {};

    if (query.indexOf("?") >= 0) {
        query = query.split("?")[1].split("#")[0];
    }
    query.replace(/&amp;|&|;/g, ";"). // "&amp;" or "&" or ";" -> ";"
          replace(/(?:([^\=]+)\=([^\;]+);?)/g, _parse);

    return rv;
}


// --- build and export API --------------------------------
if (typeof module !== "undefined") { // is modular
    module.exports = { SceneBuilder: SceneBuilder };
} else {
    global.SceneBuilder = SceneBuilder;
}

})(this.self || global);

// Zabuton.js

/*
    var Zabuton = require("./Zabuton").Zabuton;

    var zabuton = new Zabuton();

    zabuton.init();

    zabuton.download(["id1", "id2"], function(err, ids) {
        console.log("done");
    });
 */

(function(global) {

// --- header ----------------------------------------------
function Zabuton() {
    if (_zabuton) {
        return _zabuton;
    }
    _zabuton = this;
}
Zabuton.prototype = {
    init:       Zabuton_init,       // Zabuton#setup(config = {}):void
    // --- cache ---
    cache:      Zabuton_cache,      // Zabuton#cache():StorageCacheInstance
    hasCache:   Zabuton_hasCache,   // Zabuton#hasCache(id:AssetIDString):Boolean
    getCache:   Zabuton_getCache,   // Zabuton#getCache(id:AssetIDString, dataURI:boolean = false):Base64String/DataURIString
    setCache:   Zabuton_setCache,   // Zabuton#setCache(id:AssetIDString, data:Base64String):void
    // --- asset ---
    asset:      Zabuton_asset,      // Zabuton#asset():AssetInstance
    download:   Zabuton_download,   // Zabuton#download(ids:String/StringArray, fn:Function):void
    hasAsset:   Zabuton_hasAsset,   // Zabuton#hasAsset(id):Boolean
    getAsset:   Zabuton_getAsset,   // Zabuton#getAsset(id):Object
    // --- scene ---
    scene:      Zabuton_scene,      // Zabuton#scene():SceneInstance
    open:       Zabuton_open,       // Zabuton#open(id:String, param:Object = {}):Boolean
    // --- debug ---
    reset:      Zabuton_reset       // Zabuton#reset(reload:Boolean = false):void
};
Zabuton.getInstance = Zabuton_getInstance; // Zabuton.getInstance():ZabutonInstance

// --- library scope vars ----------------------------------
var _zabuton = null;

// --- implement -------------------------------------------
function Zabuton_init(config) { // @arg Object: { asset, iframes }
                                //  asset - String(= "asset/asset.json"): "asset-json-path"
                                //  iframes - StringArray(= []): AssetIFrame URLs
    config = config || {};

    this._cache = null; // StorageCacheInstance
    this._asset = null; // AssetInstance
    this._scene = null; // SceneInstance
    this._storage = null; // SQLStorage
    this._config = config;
    this._config.asset = config.asset || "asset/asset.json";
    this._config.iframes = config.iframes || [];
    this._assetIFrames = []; // [ AssetIFrameInstane, ...]

    var that = this;

    this._scene = new Scene();

    var await = new Await(3, _refreshCache);

    // --- wait for DOMContentLoaded ---
    if (global.addEventListener) {
        if (/complete|loaded/.test(document.readyState)) {
            await.pass();
        } else {
            global.addEventListener("DOMContentLoaded", function() {
                await.pass();
            });
        }
    }
    // --- wait for Storage ready ---
        this._storage = new SQLStorage("Zabuton", "Zabuton", function(err, storage) {
            that._cache = new StorageCache(storage, function(err, cache, times) {
                await.pass();
            });
        });
    // --- wait for asset.json loaded ---
    new Ajax().load(this._config.asset, { type: "text" }, function(err, text, time) {
        if (err) { throw err; }

        try {
            var json = JSON.parse( text );

            that._asset = new Asset( json );
            await.pass( { text: text, time: time } );
        } catch (err) {
            await.miss( { text: "", time: 0 } );
        }
    });

    function _refreshCache(err, args) {
        if (err) { throw err; }

        var curtTime = args[0].time; // current asset.json mod time
        var curtText = args[0].text; // current asset.json text
        var lastText = that._cache.get("asset.json");
        var update = false;

        if (lastText && lastText !== curtText) {
            update = true;
        }
        if (update || !lastText) {
            that._cache.set("asset.json", curtText, "", curtTime); // overwrite
        }

        // asset.json updated?
        if (update) {
            console.log("asset.json updated");

            that._asset.refresh(curtText, lastText, function(err, appendIDs, removedIDs, replacedIDs) {
                // appendIDs -> lazy download
                // removedIDs -> just remove
                // replacedIDs -> just and force download
                if (replacedIDs.length) {
                    console.log( "Hash changes: " + replacedIDs.join(",") );
                }
                that._asset.download(replacedIDs, function(err) {
                    _openScene();
                    // parallel (lazy)
                    setTimeout(function() {
                        that._asset.download(appendIDs, function(err) {
                        });
                    }, 6000); // 6sec
                }, true); // force download
                removedIDs.forEach(function(id) {
                    that._cache.remove(id); // remove
                });
            });
        } else {
            _openScene();
        }
    }

    function _openScene() {
        /*
         * WiFi                     [BAD]    [GOOD]    [btoa]
         * -----------------------------------------------------------
         * IS03 (2.2)           - 11479ms -> 1865ms ->  951ms
         * IS05 (2.2.1)         -  9926ms -> 1485ms -> 1313ms
         * NW-Z1000 (2.3.4)     -  4778ms -> 1079ms ->  444ms
         * Galaxy S II (2.3.6)  -  5704ms ->  729ms ->  251ms
         * Nexus7 (4.2)         -  1836ms ->  253ms
         * iPhone4 (5.1.1)      -                   ->  451ms (887ms Power OFF/ON)
         * iPhone4S (5.1.1)     -  1356ms ->  510ms ->  184ms (378ms Power OFF/ON)
         * iPhone5 (6.0.1)      -                   ->   88ms (209ms Power OFF/ON)
         * iPad3 (5.1.1)        -  2050ms ->  257ms
         * Chrome 23            -   212ms ->   83ms
         */
        if (0) { // [BAD] bulk download
            _zabuton.scene().prefetch( _zabuton.asset().getTreeNodes() ).
                             open( _detectStartScene() );
        } else { // [GOOD] current scene -> 4sec delay -> bulk download
            var rootScenes = _zabuton.asset().getTreeNodes();

            _zabuton.scene().open( _detectStartScene() );

            // load remain root scenes
            setTimeout(function() {
                _zabuton.scene().prefetch( rootScenes );
            }, 4000); // 4sec
        }
    }
    return this;
}

function Zabuton_cache() { // @ret StorageCacheInstance:
    return this._cache;
}

function Zabuton_hasCache(id) { // @arg String: asset id
                                // @ret Boolean:
    return this._cache.has(id);
}

function Zabuton_getCache(id,        // @arg String: asset id
                          dataURI) { // @arg Boolean(= false): true is add DataURI header("data:image/png...")
                                     // @ret Base64String/DataURIString: "Base64..." or "data:image/png;base64,...
    if (!this._cache.has(id)) {
        return "";
    }
    if (!dataURI) {
        return this._cache.get(id);
    }
    switch (this._asset.get(id).type) {
    case "text/css":  return "data:text/css;base64,"   + this._cache.get(id);
    case "image/gif": return "data:image/gif;base64,"  + this._cache.get(id);
    case "image/png": return "data:image/png;base64,"  + this._cache.get(id);
    case "image/jpg":
    case "image/jpeg":return "data:image/jpeg;base64," + this._cache.get(id);
    }
    return "";
}

function Zabuton_setCache(id,     // @arg AssetIDString:
                          data,   // @arg Base64String:
                          hash,   // @arg String:
                          time) { // @arg Integer(= 0):

    return this._cache.set(id, data, hash, time || 0);
}

function Zabuton_asset() { // @ret AssetInstance
    return this._asset;
}

function Zabuton_download(ids,  // @arg String/StringArray: id or [id, ...]
                          fn) { // @arg Function: fn(err:Error, result:AssetIDStringArray)
    this._asset.download(ids, fn);
}

function Zabuton_hasAsset(id) { // @arg String: asset id
                                // @ret Boolean:
    return this._asset.has(id);
}

function Zabuton_getAsset(id) { // @arg String: asset id
                                // @ret Object: asset data
    return this._asset.get(id);
}

function Zabuton_scene() { // @ret SceneInstance:
    return this._scene;
}

function Zabuton_open(id,      // @arg String: scene-id
                      param) { // @arg Object(= {}): { key: value, ... }
                               // @ret Boolean: false
                               // Zabuton.scene():Boolean
    this._scene.open(id, param || {});
    return false;
}

function Zabuton_reset(reload) { // @arg Boolean(= false): true is force reload
                                 // @desc: clear cache and force reload
    var that = this;

    this._cache.clear(function() {
        try {
            that._storage.tearDown();
        } catch (err) {
        }

        if (reload) {
            location.reload(true); // reload from server
        }
    });
}

function _detectStartScene() { // @ret: scene-id
                               // @desc: detect start scene-id
    var rv = "",
        id = location.hash.replace(/^#/, ""); // "#id" -> "id"

    if (_zabuton.scene().has(id)) { // registerd?
        if (_zabuton.asset().get(id).bookmarkble) {
            rv = id;               // "mission"        -> "mission"
        } else {
            rv = id.split("_")[0]; // "mission_result" -> "mission"
        }
    }
    return rv;
}

function Zabuton_getInstance() { // @ret ZabutonInstance:
    return new Zabuton();
}

// --- build and export API --------------------------------
if (typeof module !== "undefined") { // is modular
    module.exports = { Zabuton: Zabuton };
} else {
    global.Zabuton = Zabuton;
}

})(this.self || global);

