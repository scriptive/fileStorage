!function(e) {
    e.versionNumber = "1.0.2", e.dataVersion = function(o) {
        o.innerHTML = e.versionNumber;
    }, e.initiate = function(o) {
        var n = document.querySelector("ul#notification");
        n.querySelector("p").innerHTML = e.versionNumber, e.fileStorage().then(function() {
            n.style.display = "none", n.remove(), document.querySelector("div#demo").style.display = "block", 
            document.querySelectorAll("form").each(function(o, n) {
                n.addEventListener("submit", function(o) {
                    var n = o.target.elements, l = o.target.getAttribute("id");
                    l && e.demo[l](n), o.preventDefault();
                }, !1);
            });
        }, function(o) {
            e.config.msg.info.innerHTML = "this Browser does not support the storage system!";
        }).then(function() {
            e.dataContent();
        });
    }, e.fileStorage = function() {
        return new Promise(function(o, n) {
            e.file = fileStorage({
                objectStore: {
                    version: 2
                }
            }, {
                success: function(e) {
                    console.log("success", e), o();
                },
                fail: function(e) {
                    console.log("fail", e), n(e);
                },
                done: function(e) {
                    console.log(e);
                    var o = document.querySelector("p.support");
                    if (e.support.length) {
                        o.innerHTML = e.support.join(" & ") + ", and using ";
                        var n = document.createElement("strong");
                        n.innerHTML = e.Base, o.appendChild(n);
                    } else o.innerHTML = "none";
                }
            });
        });
    }, e.demo = {
        download: function(o) {
            var n = o.url.value, l = o.readAs.value, t = o.responseType.value, u = "true" == o.urlLocal.value || o.urlLocal.value, c = o.requestMethod.value, r = o.requestCache.value;
            e.file.download({
                url: n,
                urlLocal: u,
                readAs: l,
                requestMethod: c,
                requestCache: r,
                before: function(e) {
                    t && (e.responseType = t);
                }
            }).then(function(e) {
                console.log("success", e);
            }, function(e) {
                console.log("fail", e);
            }).then(function(e) {
                console.log("done");
            });
        },
        save: function(o) {
            var n = o.urlLocal.value, l = o.fileContent.value, t = o.fileType.value;
            n ? e.file.save({
                urlLocal: n,
                fileContent: l,
                fileType: t
            }).then(function(e) {
                console.log("success", e);
            }, function(e) {
                console.log("fail", e);
            }).then(function(e) {
                console.log("done");
            }) : console.log("urlLocal?");
        },
        open: function(o) {
            var n = o.urlLocal.value, l = o.readAs.value;
            n ? e.file.open({
                urlLocal: n,
                readAs: l
            }).then(function(e) {
                console.log("success", e);
            }, function(e) {
                console.log("fail", e);
            }).then(function(e) {
                console.log("done");
            }) : console.log("urlLocal?");
        },
        delete: function(o) {
            var n = o.urlLocal.value;
            n ? e.file.delete({
                urlLocal: n,
                fileNotFound: !0
            }).then(function(e) {
                console.log("success", e);
            }, function(e) {
                console.log("fail", e);
            }).then(function(e) {
                console.log("done");
            }) : console.log("urlLocal?");
        },
        downloadThenSave: function(o) {
            var n = o.url.value, l = o.readAs.value, t = o.responseType.value, u = "true" == o.urlLocal.value || o.urlLocal.value, c = o.requestMethod.value, r = o.requestCache.value;
            e.file.download({
                url: n,
                urlLocal: u,
                readAs: l,
                requestMethod: c,
                requestCache: r,
                fileOption: {
                    create: !0
                },
                before: function(e) {
                    t && (e.responseType = t);
                }
            }).then(function(e) {
                console.log("success", e);
            }, function(e) {
                console.log("fail", e);
            }).then(function(e) {
                console.log("done");
            });
        }
    };
}(scriptive("app"));