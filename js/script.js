var file, msgContainer, app = {
    ready: function(callback) {
        window.addEventListener("DOMContentLoaded", function() {
            hljs.initHighlightingOnLoad();
            if (callback instanceof Function) {
                if (window.cordova && location.protocol == "file:") {
                    document.addEventListener("deviceready", callback, false);
                } else {
                    callback();
                }
            }
        });
    },
    store: {
        name: {},
        unique: "fileStorage:103",
        select: function() {
            var val = window.localStorage.getItem(this.unique);
            try {
                this.name = val ? JSON.parse(val) : {};
            } catch (e) {
                this.name = {};
            } finally {
                return this;
            }
        },
        update: function() {
            window.localStorage.setItem(this.unique, JSON.stringify(this.name));
        },
        find: function(filename) {
            return this.name.hasOwnProperty(filename);
        },
        delete: function(filename) {
            if (this.find(filename)) {
                delete this.name[filename];
                this.update();
            }
            return this;
        },
        insert: function(filename, filetype) {
            this.name[filename] = filetype;
            this.update();
            return this;
        }
    },
    requestResponse: function(s) {
        var id, elm = document.getElementById("configuration").children;
        for (var i = 0, len = elm.length; i < len; i++) {
            id = elm[i].getAttribute("id");
            if (id && s.hasOwnProperty(id)) {
                elm[i].innerHTML = s[id] instanceof Array ? s[id].join(", ") : s[id];
            }
        }
        var toggleCode = document.getElementsByClassName("toggleCode");
        for (var i = 0, len = toggleCode.length; i < len; i++) {
            var e = toggleCode[i], codeBlock = toggleCode[i].nextSibling.nextSibling;
            e.classList.toggle("active", app.visibleElement(codeBlock));
            app.click(toggleCode[i], function(evt) {
                var e = evt.target, codeBlock = e.nextSibling.nextSibling;
                if (app.visibleElement(codeBlock)) {
                    codeBlock.style.display = "none";
                    e.classList.remove("active");
                } else {
                    e.classList.add("active");
                    codeBlock.style.display = "block";
                }
            });
        }
    },
    click: function(element, callback) {
        element.addEventListener("click", callback);
    },
    submit: function(element, callback) {
        element.addEventListener("submit", callback);
    },
    visibleElement: function(element) {
        return window.getComputedStyle(element).display === "block";
    },
    form: {
        watch: function() {
            document.querySelectorAll("form").forEach(function(form) {
                app.submit(form, function(evt) {
                    var data = evt.target.elements, task = evt.target.getAttribute("id");
                    if (task) app.form[task](data);
                    evt.preventDefault();
                });
            });
            document.querySelectorAll(".update-urlLocalList").forEach(function(handler) {
                app.click(handler, function(evt) {
                    var p = evt.target.parentElement;
                    var container = p.querySelector("datalist"), datalist = app.store.select().name;
                    container.innerHTML = "";
                    p.querySelector("input").value = "";
                    for (var filename in datalist) {
                        if (datalist.hasOwnProperty(filename)) {
                            var eOption = document.createElement("option");
                            eOption.setAttribute("value", filename);
                            container.appendChild(eOption);
                        }
                    }
                });
            });
        },
        download: function(o) {
            var url = o.url.value;
            var readAs = o.readAs.value;
            var responseType = o.responseType.value;
            var urlLocal = o.urlLocal.value == "true" ? true : o.urlLocal.value;
            var requestMethod = o.requestMethod.value;
            var requestCache = o.requestCache.value;
            file.download({
                url: url,
                urlLocal: urlLocal,
                readAs: readAs,
                requestMethod: requestMethod,
                requestCache: requestCache,
                before: function(xmlHttp) {
                    if (responseType) xmlHttp.responseType = responseType;
                }
            }).then(function(e) {
                console.log("success", e);
            }, function(e) {
                console.log("fail", e);
            }).then(function(e) {});
        },
        save: function(o) {
            var urlLocal = o.urlLocal.value;
            var fileContent = o.fileContent.value;
            var fileType = o.fileType.value;
            if (urlLocal) {
                file.save({
                    urlLocal: urlLocal,
                    fileContent: fileContent,
                    fileType: fileType
                }).then(function(e) {
                    console.log("success", e);
                    app.store.insert(urlLocal, fileType);
                }, function(e) {
                    console.log("fail", e);
                }).then(function(e) {});
            } else {
                console.log("urlLocal?");
            }
        },
        open: function(o) {
            var urlLocal = o.urlLocal.value;
            var readAs = o.readAs.value;
            if (urlLocal) {
                file.open({
                    urlLocal: urlLocal,
                    readAs: readAs
                }).then(function(e) {
                    console.log("success", e);
                }, function(e) {
                    console.log("fail", e);
                }).then(function(e) {});
            } else {
                console.log("urlLocal?");
            }
        },
        delete: function(o) {
            var urlLocal = o.urlLocal.value;
            if (urlLocal) {
                file.delete({
                    urlLocal: urlLocal,
                    fileNotFound: true
                }).then(function(e) {
                    console.log("success", e);
                    app.store.delete(urlLocal);
                }, function(e) {
                    console.log("fail", e);
                }).then(function(e) {});
            } else {
                console.log("urlLocal?");
            }
        },
        downloadThenSave: function(o) {
            var url = o.url.value;
            var readAs = o.readAs.value;
            var responseType = o.responseType.value;
            var urlLocal = o.urlLocal.value == "true" ? true : o.urlLocal.value;
            var requestMethod = o.requestMethod.value;
            var requestCache = o.requestCache.value;
            file.download({
                url: url,
                urlLocal: urlLocal,
                readAs: readAs,
                requestMethod: requestMethod,
                requestCache: requestCache,
                fileOption: {
                    create: true
                },
                before: function(xmlHttp) {
                    if (responseType) xmlHttp.responseType = responseType;
                }
            }).then(function(e) {
                console.log("success", e);
                app.store.insert(e.urlLocal, e.fileType);
            }, function(e) {
                console.log("fail", e);
            }).then(function(e) {});
        }
    }
};

app.ready(function() {
    file = fileStorage({
        Base: "storage",
        RequestQuota: 1073741824,
        Permission: 1,
        objectStore: {
            name: "fileStorage",
            version: 1,
            file: "file",
            other: {
                name: "otherName",
                option: {}
            }
        }
    }, {
        done: function(status) {
            app.requestResponse(status);
        },
        fail: function(status) {},
        success: function(fs) {
            app.form.watch();
        }
    });
});