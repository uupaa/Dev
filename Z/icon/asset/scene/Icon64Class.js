// Icon64Class.js:

(function(global) {

// --- header ----------------------------------------------
function Icon64Class(sceneID, classID) {
    BaseScene.call(this, sceneID, classID);
}

Icon64Class.prototype.__proto__  = BaseScene.prototype;
Icon64Class.prototype.update     = Icon64Class_update; // override
Icon64Class.prototype.updateView = Icon64Class_updateView;

// --- library scope vars ----------------------------------

// --- implement -------------------------------------------
function Icon64Class_update(eventType,  // @arg String: "build", "show", "hide", "destroy"
                         callback) { // @arg Function: callback(err:Error)
    var zabuton = Zabuton.getInstance();
    // your code here
    var that = this;

    if (eventType === "build") {
        var mustache_json = {
            linkButtons: [
/*
                { href0: "#mypage", src0: "#16_00", w0: "16", h0: "16",
                  href1: "#mypage", src1: "#16_01", w1: "16", h1: "16",
                  href2: "#mypage", src2: "#16_02", w2: "16", h2: "16",
                  href3: "#mypage", src3: "#16_03", w3: "16", h3: "16",
                  href4: "#mypage", src4: "#16_04", w4: "16", h4: "16" },
 */
            ]
        };
        function createData(size) {
          //"0123456789abcdefghijklmnopqrstuvwxyz_".split("").forEach(function(key) {
            "012345".split("").forEach(function(key) {
                var obj =
                    { href0: "#icon128", src0: "#16_00", w0: "16", h0: "16",
                      href1: "#icon128", src1: "#16_01", w1: "16", h1: "16",
                      href2: "#icon128", src2: "#16_02", w2: "16", h2: "16",
                      href3: "#icon128", src3: "#16_03", w3: "16", h3: "16",
                      href4: "#icon128", src4: "#16_04", w4: "16", h4: "16" };
                for (var i = 0; i < 5; ++i) {
                    var url = zabuton.getAsset(size + "_" + key + i).url;
                    obj["src" + i] = url + "#" + size + "_" + key + i;
                    obj["w" + i] = size;
                    obj["h" + i] = size;
                }
                mustache_json.linkButtons.push(obj);
            });
        }
        createData(64);

        this.render(mustache_json, function(err) {
            if (!err) {
                that.updateView();
            }
            callback(err);
        });
    } else { // "show", "hide", "destroy"
        callback(null); // ok
    }
}

function Icon64Class_updateView() {
    // your code here
    var zabuton = Zabuton.getInstance();
    var term = Date.now() - zabuton.scene().getInfo().transition.start;

//    document.title = "Icon64(" + term + "ms)";
    document.body.insertBefore(
        document.createTextNode("icon64: " + term + ". "),
        document.body.firstElementChild);

/*
    var id = "128x128";

    zabuton.download(id, function(err) {
        var data = zabuton.getCache(id, true);

//      document.body.style.backgroundImage = "url(" + data + ")";
        document.body.style.backgroundImage = "";
    });
 */
}

// --- build and export -----------------------------------
if (typeof module !== "undefined") { // module
    module.exports = { Icon64Class: Icon64Class };
} else {
    global.Icon64Class = Icon64Class;
}

})(this.self || global);
