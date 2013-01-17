// BigClass.js:

(function(global) {

// --- header ----------------------------------------------
function BigClass(sceneID, classID) {
    BaseScene.call(this, sceneID, classID);
}

BigClass.prototype.__proto__  = BaseScene.prototype;
BigClass.prototype.update     = BigClass_update; // override
BigClass.prototype.updateView = BigClass_updateView;

// --- library scope vars ----------------------------------

// --- implement -------------------------------------------
function BigClass_update(eventType,  // @arg String: "build", "show", "hide", "destroy"
                         callback) { // @arg Function: callback(err:Error)
    var zabuton = Zabuton.getInstance();
    // your code here
    var that = this;

    if (eventType === "build") {
        var mustache_json = {}

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

function BigClass_updateView() {
    // your code here
    var zabuton = Zabuton.getInstance();
    var term = Date.now() - zabuton.scene().getInfo().transition.start;

//    document.title = "Big pict(" + term + "ms)";

    document.body.insertBefore(
        document.createTextNode("scene: " + term + ". "),
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
    module.exports = { BigClass: BigClass };
}
global.BigClass = BigClass;

})(this.self || global);
