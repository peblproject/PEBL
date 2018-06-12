/**
 *  @author aaron.veden@eduworks.com
 */
var StorageAdapter = function() {};
StorageAdapter = stjs.extend(StorageAdapter, null, [], function(constructor, prototype) {
    constructor.AREA_INCOMING = "Incoming";
    constructor.AREA_OUTGOING = "Outgoing";
    constructor.AREA_EVENTS = "Events";
    constructor.AREA_GENERAL = "General";
    constructor.AREA_PROFILE = "Profile";
    constructor.AREA_COMPENTENCIES = "Competencies";
    constructor.AREA_CURRENT_USER = "CurrentUser";
    constructor.AREA_CURRENT_BOOK = "CurrentBook";
    prototype.getAnnotations = function(user, thread, callback) {};
    prototype.storeCurrentUser = function(user, callback) {};
    prototype.getCurrentUser = function(callback) {};
    prototype.storeCurrentBook = function(book) {};
    prototype.getCurrentBook = function(callback) {};
    prototype.saveEvent = function(user, containerPath, event) {};
    prototype.saveEvents = function(user, containerPath, events) {};
    prototype.getEvents = function(user, containerPath, callback) {};
    prototype.getCompetencies = function(user, callback) {};
    prototype.setCompetencies = function(user, competencies) {};
    prototype.storeOutgoing = function(user, xapi) {};
    prototype.postMessage = function(user, thread, message) {};
    prototype.postMessages = function(user, thread, messages) {};
    prototype.getMessages = function(user, thread, callback) {};
    prototype.saveUserProfile = function(user) {};
    prototype.removeAnnotation = function(user, id, containerPath) {};
    prototype.removeSharedAnnotation = function(user, id) {};
    prototype.getGeneralAnnotations = function(user, containerPath, callback) {};
    prototype.getUserProfile = function(id, callback) {};
    prototype.getOutgoing = function(user, callback) {};
    prototype.clearOutgoing = function(user, toClear) {};
    prototype.saveAnnotation = function(user, containerPath, annotation) {};
    prototype.saveAnnotations = function(user, containerPath, annotations) {};
    prototype.saveGeneralAnnotation = function(user, containerPath, annotation) {};
    prototype.saveGeneralAnnotations = function(user, containerPath, annotations) {};
    prototype.getAsset = function(id, callback) {};
    prototype.setAsset = function(id, data) {};
    prototype.removeMessage = function(user, id, thread) {};
    prototype.removeNotification = function(user, id) {};
    prototype.getNotifications = function(user, callback) {};
    prototype.addNotification = function(user, notification) {};
    prototype.getToc = function(user, containerPath, callback) {};
    prototype.removeToc = function(user, containerPath, section, id) {};
    prototype.addToc = function(user, containerPath, data) {};
}, {}, {});
var Endpoint = function() {
    this.username = "";
    this.password = "";
    this.url = "";
    this.token = "";
    this.lastSyncedThreads = {};
    this.lastSyncedBooksMine = {};
    this.lastSyncedBooksShared = {};
};
Endpoint = stjs.extend(Endpoint, null, [], function(constructor, prototype) {
    prototype.username = null;
    prototype.password = null;
    prototype.token = null;
    prototype.url = null;
    prototype.lastSyncedThreads = null;
    prototype.lastSyncedBooksMine = null;
    prototype.lastSyncedBooksShared = null;
    prototype.toConfigObject = function() {
        var s = {};
        s["user"] = this.username;
        s["password"] = this.password;
        s["endpoint"] = this.url;
        s["token"] = this.token;
        s["lastSyncedThreads"] = this.lastSyncedThreads;
        s["lastSyncedBooksMine"] = this.lastSyncedBooksMine;
        s["lastSyncedBooksShared"] = this.lastSyncedBooksShared;
        return s;
    };
    prototype.toObject = function() {
        var s = {};
        s["username"] = this.username;
        s["password"] = this.password;
        s["url"] = this.url;
        s["token"] = this.token;
        s["lastSyncedThreads"] = this.lastSyncedThreads;
        s["lastSyncedBooksMine"] = this.lastSyncedBooksMine;
        s["lastSyncedBooksShared"] = this.lastSyncedBooksShared;
        return s;
    };
    prototype.toString = function() {
        return JSON.stringify(this.toObject());
    };
    constructor.fromValues = function(username, password, token, url, lastSyncedThreads, lastSyncedBooksMine, lastSyncedBooksShared) {
        var e = new Endpoint();
        e.username = username;
        e.password = password;
        e.url = url;
        e.token = token;
        e.lastSyncedThreads = lastSyncedThreads;
        e.lastSyncedBooksMine = lastSyncedBooksMine;
        e.lastSyncedBooksShared = lastSyncedBooksShared;
        return e;
    };
    constructor.fromMap = function(values) {
        var e = new Endpoint();
        e.username = values["username"];
        e.password = values["password"];
        e.url = values["url"];
        e.token = values["token"];
        e.lastSyncedThreads = values["lastSyncedThreads"];
        e.lastSyncedBooksMine = values["lastSyncedBooksMine"];
        e.lastSyncedBooksShared = values["lastSyncedBooksShared"];
        return e;
    };
    constructor.fromString = function(s) {
        return Endpoint.fromMap(JSON.parse(s));
    };
}, {lastSyncedThreads: {name: "Map", arguments: [null, null]}, lastSyncedBooksMine: {name: "Map", arguments: [null, null]}, lastSyncedBooksShared: {name: "Map", arguments: [null, null]}}, {});
var UserAdapter = function() {};
UserAdapter = stjs.extend(UserAdapter, null, [], function(constructor, prototype) {
    prototype.getUser = function() {};
    prototype.login = function(callback) {};
    prototype.loginAsUser = function(username, password, callback) {};
    prototype.logout = function() {};
    prototype.loggedIn = function() {};
    prototype.isSameUser = function() {};
}, {}, {});
var NetworkAdapter = function() {};
NetworkAdapter = stjs.extend(NetworkAdapter, null, [], function(constructor, prototype) {
    prototype.activate = function(teacher) {};
    prototype.disable = function(finished) {};
    prototype.push = function(finished) {};
}, {}, {});
var ActivityAdapter = function() {};
ActivityAdapter = stjs.extend(ActivityAdapter, null, [], function(constructor, prototype) {
    prototype.openBook = function(containerPath, callback) {};
    prototype.getBook = function() {};
    prototype.setDirectMessageHandler = function(directMessageHandler) {};
    prototype.initializeToc = function(data) {};
    prototype.getToc = function(callback) {};
    prototype.hookDirectMessages = function() {};
    prototype.clearParentActivity = function() {};
    prototype.startParentActivity = function(activity) {};
    prototype.getParentActivity = function() {};
    prototype.getThreads = function() {};
    prototype.isSameBook = function() {};
    prototype.unsubscribeAll = function() {};
    prototype.subscribe = function(thread, callback) {};
}, {}, {});
var AssetAdapter = function() {};
AssetAdapter = stjs.extend(AssetAdapter, null, [], function(constructor, prototype) {
    prototype.setHookCallback = function(callback) {};
    prototype.queue = function(ref) {};
    prototype.startSync = function() {};
    prototype.stopSync = function() {};
}, {}, {});
var Debugger = function() {};
Debugger = stjs.extend(Debugger, null, [], function(constructor, prototype) {
    constructor.logs = null;
    constructor.debug = function(message) {
         while (Debugger.logs.length > 100)
            Debugger.logs.shift();
        Debugger.logs.push(new Date().toString() + "/" + message);
    };
}, {logs: {name: "Array", arguments: [null]}}, {});
(function() {
    Debugger.logs = [];
})();
var LauncherAdapter = function() {};
LauncherAdapter = stjs.extend(LauncherAdapter, null, [], function(constructor, prototype) {
    prototype.connect = function() {};
    prototype.close = function() {};
    prototype.setMessageCallback = function(callback) {};
}, {}, {});
var Page = function(firstVisibleCFI, lastVisibleCFI) {
    this.firstVisibleCFI = firstVisibleCFI;
    this.lastVisibleCFI = lastVisibleCFI;
};
Page = stjs.extend(Page, null, [], function(constructor, prototype) {
    prototype.firstVisibleCFI = null;
    prototype.lastVisibleCFI = null;
    prototype.toString = function() {
        return JSON.stringify(this.toObject());
    };
    prototype.toObject = function() {
        var m = {};
        m["firstCFI"] = this.firstVisibleCFI;
        m["lastCFI"] = this.lastVisibleCFI;
        return m;
    };
    constructor.fromMap = function(o) {
        return new Page(o["firstCFI"], o["lastCFI"]);
    };
}, {}, {});
var UserProfile = function(rawProfile) {
    this.lrsUrls = {};
    if (rawProfile != null) {
        var profile = (stjs.isInstanceOf(rawProfile.constructor, String) ? JSON.parse(rawProfile) : rawProfile);
        this.identity = profile["identity"];
        this.name = profile["name"];
        this.homePage = profile["homePage"];
        this.preferredName = profile["preferredName"];
        var o = profile["lrsUrls"];
        if (o != null) 
            for (var key in o) {
                var e = Endpoint.fromMap(o[key]);
                this.lrsUrls[e.url] = e;
            }
    }
    if ((this.homePage == "") || (this.homePage == null)) 
        this.homePage = "acct:keycloak-server";
};
UserProfile = stjs.extend(UserProfile, null, [], function(constructor, prototype) {
    prototype.identity = null;
    prototype.name = null;
    prototype.homePage = null;
    prototype.preferredName = null;
    prototype.lrsUrls = null;
    prototype.setName = function(name) {
        this.name = name;
    };
    prototype.setPreferredName = function(name) {
        this.preferredName = name;
    };
    prototype.setHomePage = function(homePage) {
        this.homePage = homePage;
    };
    prototype.getHomePage = function() {
        return this.homePage;
    };
    prototype.getName = function() {
        return this.name;
    };
    prototype.getPreferredName = function() {
        return this.preferredName;
    };
    prototype.setIdentity = function(user) {
        this.identity = user;
    };
    prototype.getLrsUrls = function() {
        return this.lrsUrls;
    };
    prototype.generateQueryAgent = function() {
        var account = {};
        account["homePage"] = this.homePage;
        account["name"] = this.identity;
        return account;
    };
    prototype.generateAgent = function() {
        var wrapper = {};
        wrapper["name"] = this.name;
        wrapper["account"] = this.generateQueryAgent();
        return wrapper;
    };
    prototype.getIdentity = function() {
        return this.identity;
    };
    prototype.addLrsUrl = function(config) {
        this.lrsUrls[config.url] = config;
    };
    prototype.toObject = function() {
        var out = {};
        out["identity"] = this.identity;
        out["name"] = this.name;
        out["homePage"] = this.homePage;
        out["preferredName"] = this.preferredName;
        var urls = {};
        for (var key in this.lrsUrls) {
            var e = this.lrsUrls[key];
            urls[e.url] = e.toObject();
        }
        out["lrsUrls"] = urls;
        return out;
    };
    prototype.toString = function() {
        return JSON.stringify(this.toObject());
    };
}, {lrsUrls: {name: "Map", arguments: [null, "Endpoint"]}}, {});
var NativeNetworkAdapter = function() {};
NativeNetworkAdapter = stjs.extend(NativeNetworkAdapter, null, [NetworkAdapter], function(constructor, prototype) {
    prototype.push = function(finished) {};
    prototype.disable = function(finished) {};
    prototype.activate = function(teacher) {};
}, {}, {});
var NativeActivityAdapter = function() {};
NativeActivityAdapter = stjs.extend(NativeActivityAdapter, null, [ActivityAdapter], function(constructor, prototype) {
    prototype.unsubscribeAll = function() {};
    prototype.subscribe = function(thread, callback) {};
    prototype.getToc = function(callback) {};
    prototype.openBook = function(containerPath, callback) {};
    prototype.isSameBook = function() {
        return false;
    };
    prototype.getBook = function() {
        return null;
    };
    prototype.getThreads = function() {
        return null;
    };
    prototype.clearParentActivity = function() {};
    prototype.startParentActivity = function(activity) {};
    prototype.getParentActivity = function() {
        return null;
    };
    prototype.setDirectMessageHandler = function(directMessageHandler) {};
    prototype.hookDirectMessages = function() {};
    prototype.initializeToc = function(data) {};
}, {}, {});
var XApiUtils = function() {};
XApiUtils = stjs.extend(XApiUtils, null, [], function(constructor, prototype) {
    constructor.sortNewest = function(xapis) {
        xapis.sort(function(a, b) {
            var v = new Date(b["timestamp"]).getTime() - new Date(a["timestamp"]).getTime();
            return v > 0 ? 1 : v != 0 ? -1 : (a["id"]).compareTo(b["id"]);
        });
    };
    constructor.sortNewestTimeSeries = function(xapis) {
        xapis.sort(function(a, b) {
            return a.compareTo(b);
        });
    };
    constructor.sortXApiNewest = function(xapis) {
        xapis.sort(function(a, b) {
            var v = new Date(b["timestamp"]).getTime() - new Date(a["timestamp"]).getTime();
            return v > 0 ? 1 : v != 0 ? -1 : (a["id"]).compareTo(b["id"]);
        });
    };
    constructor.addTimestamp = function(xapi) {
        if (xapi["timestamp"] == null) 
            xapi["timestamp"] = EcDate.toISOString(new Date());
        if (xapi["id"] == null) 
            xapi.generateId();
    };
    constructor.getTimestamp = function(xapi) {
        return new Date(xapi["timestamp"]);
    };
    constructor.getActorId = function(xapi) {
        var actorObj = xapi["actor"];
        var account = actorObj["account"];
        if (account != null) {
            return account["name"];
        } else {
            return actorObj["name"];
        }
    };
    constructor.getObjectId = function(xapi) {
        return (xapi["object"])["id"];
    };
    constructor.getVerb = function(xapi) {
        return ((xapi["verb"])["display"])["en-US"];
    };
    constructor.getObjectName = function(xapi) {
        var object = xapi["object"];
        var definition = object["definition"];
        if (definition != null) {
            var name = definition["name"];
            if (name != null) 
                return name["en-US"];
        }
        return null;
    };
    constructor.getObjectDescription = function(xapi) {
        var object = xapi["object"];
        var definition = object["definition"];
        if (definition != null) {
            var name = definition["description"];
            if (name != null) 
                return name["en-US"];
        }
        return null;
    };
    constructor.getParentActivity = function(xapi) {
        return (((xapi["context"])["contextActivities"])["parent"])[0]["id"];
    };
    constructor.parseXApiArray = function(s) {
        var xapis = JSON.parse(s);
        return xapis == null ? [] : xapis;
    };
    constructor.parseXApiMap = function(s) {
        if ((s == null) || (s.length == 0)) 
            return {};
        var map = JSON.parse(s);
        return map == null ? {} : map;
    };
    constructor.pathToFilename = function(path) {
        var filename = path.substring(path.lastIndexOf("/") + 1);
        return filename;
    };
}, {}, {});
var TimeSeriesData = function() {};
TimeSeriesData = stjs.extend(TimeSeriesData, null, [], function(constructor, prototype) {
    constructor.NAMESPACE_USERNAME = "user-";
    constructor.NAMESPACE_NOTIFICATION = "notification-";
    constructor.KEY_DOCTYPE = "docType";
    constructor.KEY_ACTIVITY_NAME = "activityName";
    constructor.KEY_ACTIVITY_DESCRIPTION = "activityDescription";
    constructor.KEY_XID = "id";
    constructor.KEY_TARGET = "target";
    constructor.KEY_TYPE = "type";
    constructor.KEY_ACTION = "action";
    constructor.KEY_ACTOR_ID = "actorId";
    constructor.KEY_ACTIVITY_ID = "activityId";
    constructor.KEY_TIMESTAMP = "timestamp";
    constructor.KEY_PARENT_ACTIVITY = "parentActivity";
    prototype.id = null;
    prototype.timestamp = null;
    prototype.parentActivity = null;
    prototype.actorId = null;
    prototype.compareTo = function(arg0) {
        var r = stjs.trunc((this.timestamp.getTime() - arg0.timestamp.getTime()));
        if (r == 0) 
            return this.id.compareTo(arg0.id);
        return r;
    };
    constructor.sort = function(data, asc) {
        if (asc) 
            data.sort(function(a, b) {
                return b.compareTo(a);
            });
         else 
            data.sort(function(a, b) {
                return a.compareTo(b);
            });
        return data;
    };
    prototype.toObject = function() {
        var result = {};
        result[TimeSeriesData.KEY_XID] = this.id;
        result[TimeSeriesData.KEY_PARENT_ACTIVITY] = this.parentActivity;
        result[TimeSeriesData.KEY_ACTOR_ID] = this.parentActivity;
        result[TimeSeriesData.KEY_TIMESTAMP] = EcDate.toISOString(this.timestamp);
        return result;
    };
    prototype.toString = function() {
        return JSON.stringify(this.toObject());
    };
}, {timestamp: "Date"}, {});
var NativeAssetAdapter = function() {};
NativeAssetAdapter = stjs.extend(NativeAssetAdapter, null, [AssetAdapter], function(constructor, prototype) {
    prototype.queue = function(ref) {};
    prototype.startSync = function() {};
    prototype.stopSync = function() {};
    prototype.setHookCallback = function(callback) {};
}, {}, {});
var LocalLauncherAdapter = function(userManager) {
    if (window.SocketConnectionHandler != null) {
        this.connectionHandler = new window.SocketConnectionHandler();
        this.connectionHandler.setMessageCallback(function(message) {
            var parameter = message["parameter"];
            if ((parameter != null) && parameter.startsWith("pebl://")) {
                if (window.ReadiumInterop != null) {
                    var pack = [];
                    pack.push("openBookWithCfi");
                    var payload = {};
                    var cfi = "";
                    var filename = "";
                    var idref = "";
                    if (parameter.indexOf("?cfi=") != -1) {
                        cfi = decodeURIComponent(parameter.substring(parameter.indexOf("?") + 5));
                        filename = parameter.substring(0, parameter.indexOf("?"));
                    } else 
                        filename = parameter;
                    if (cfi != "") {
                        var sI = cfi.indexOf("[");
                        var eI = cfi.indexOf("]");
                        if ((sI != -1) && (eI != -1)) 
                            idref = cfi.substring(sI + 1, eI);
                    }
                    filename = filename.substring(7);
                    payload["filename"] = filename;
                    if (cfi != "") 
                        payload["cfi"] = cfi;
                    if (idref != "") 
                        payload["idref"] = idref;
                    pack.push(JSON.stringify(payload));
                    window.ReadiumInterop.postHarnessMessage("pebl", pack);
                }
            }
        });
    }
    this.userManager = userManager;
};
LocalLauncherAdapter = stjs.extend(LocalLauncherAdapter, null, [LauncherAdapter], function(constructor, prototype) {
    prototype.connectionHandler = null;
    prototype.userManager = null;
    prototype.connect = function() {
        if (window.SocketConnectionHandler != null) {
            var up = this.userManager.getUser();
            if ((up.getIdentity() != "guest") && (up.getPreferredName() != null) && (!this.connectionHandler.connected)) {
                this.connectionHandler.connect(up.getPreferredName(), up.getName(), "PEBLTablet");
            }
        }
    };
    prototype.close = function() {
        if (window.SocketConnectionHandler != null) {
            this.connectionHandler.close();
        }
    };
    prototype.setMessageCallback = function(callback) {
        if (window.SocketConnectionHandler != null) {
            this.connectionHandler.setMessageCallback(callback);
        }
    };
}, {connectionHandler: "window.SocketConnectionHandler", userManager: "UserAdapter"}, {});
var LLUserAdapter = function(storage) {
    this.storage = storage;
    this.isLoggedIn = false;
    this.sameUser = false;
    this.profile = null;
    this.loginUserNameSelect = "loginUserNameSelector";
};
LLUserAdapter = stjs.extend(LLUserAdapter, null, [UserAdapter], function(constructor, prototype) {
    prototype.storage = null;
    prototype.isLoggedIn = false;
    prototype.sameUser = null;
    prototype.profile = null;
    prototype.loginUserNameSelect = null;
    prototype.loginCallback = null;
    constructor.guest = null;
    prototype.getUser = function() {
        if (this.isLoggedIn) 
            return this.profile;
        return LLUserAdapter.guest;
    };
    prototype.login = function(callback) {
        this.loginCallback = callback;
        var self = this;
        this.storage.getCurrentUser(function(currentUser) {
            if (window.Lightbox != null) {
                if ((currentUser == "") || (currentUser == "null") || (currentUser == null) || (currentUser == "guest")) {
                    window.Lightbox.createLoginForm();
                    var loginButton = window.document.getElementById("loginUserNameSubmit");
                    loginButton.onclick = function(event) {
                        var newUser = (window.document.getElementById(self.loginUserNameSelect)).value;
                        var MCISToken = "M2E5ZDMzMjNlMDIyODQwNzRhNjI2ODQzNWNlNGM1MGFlNWYzNjZmODpkOWZhZDUwZmIyY2VmNTE1MjMzZmRiNzc1ODhkMzkzMjhhNTliYzQ5";
                        var TBSToken = "MjM0ZTBhY2Y0OWVlZjNiYTBmY2VjOWM0N2FiNjc4ZDRiMDJmNjY0NzpjNTI2YTUwNDIwZDM5MTEyMDZkNGJhYTZhZjZhMTlkMzk4MGIwODFj";
                        var CDETToken = "M2IyOGE0YzU3YWUxM2Y1NTNiNzUzNWM5OTM3NGRhNzVmNGNhNDAzNjpiODMxNTI1NmUzN2JjZTlhYjUwMmZhNmI4ZmE2YTExODkzYzZmMmUy";
                        var SNCOAToken = "YjdjZDYyNGFkYzFiZjI4ZDE4MGZkZmExMjNjZTM2ZmI3MTNmYjVjMzo5ODMxNTQ3ZTkwZmFhMDRmMmIwNGZiOWJjZWY4MDZhZTZlNzRiNGM2";
                        var MSTPToken = "MGFmYjM5ZWI2NTAzMWRjNzI5NzVkZmIyZWYzMDE1NzUwY2U1ZWNiZDpmYzM5OTllN2ZiMjM4OTQ4Zjc0MWNkZmUzZWU2MDQwNWJiNTFlZmU2";
                        var EWSToken = "Yzk3M2I3N2I2MDQ5ZjAwMmFjYTRmNTcxZjQxMDhiMjc2YzY5ZTUxOTpkMzRhMjBjZDVkYTYwOGZkZDk3ODI3MjQxNDZjZjMwMTNjMGRmY2Qw";
                        var MCSCTToken = "MTRiMTQ0NjRiMGEyYmNlZDY4NzQwN2JmMGZlZGIwZjViNjE0YzBlNzo1ZTRiMTFhNzBmZDkyMjE3ZDE1NDUxYzZlNjdlZjBiYjc0MGZiMzMy";
                        window.Lightbox.getLRSURL(function(lrsURL) {
                            var GlobalEndpoint = lrsURL;
                            window.Lightbox.getLRSToken(function(lrsToken) {
                                var GlobalToken = lrsToken;
                                window.Lightbox.getLRSPassword(function(lrsPassword) {
                                    var GlobalPassword = lrsPassword;
                                    window.Lightbox.getLRSUsername(function(lrsUsername) {
                                        var GlobalUsername = lrsUsername;
                                        self.isLoggedIn = true;
                                        self.storage.getUserProfile(newUser, function(profile) {
                                            self.profile = null;
                                            self.sameUser = false;
                                            if (self.profile == null) {
                                                self.profile = new UserProfile(null);
                                                self.profile.setIdentity(newUser);
                                                self.profile.setName(newUser);
                                                self.profile.setPreferredName(newUser);
                                                var endpoint = new Endpoint();
                                                if (GlobalUsername != null) 
                                                    endpoint.username = GlobalUsername;
                                                 else 
                                                    endpoint.username = newUser;
                                                var token;
                                                if (newUser.substring(0, 4) == "MCIS") 
                                                    token = MCISToken;
                                                 else if (newUser.substring(0, 3) == "TBS") 
                                                    token = TBSToken;
                                                 else if (newUser.substring(0, 4) == "CDET") 
                                                    token = CDETToken;
                                                 else if (newUser.substring(0, 5) == "SNCOA") 
                                                    token = SNCOAToken;
                                                 else if (newUser.substring(0, 4) == "MSTP") 
                                                    token = MSTPToken;
                                                 else if (newUser.substring(0, 3) == "EWS") 
                                                    token = EWSToken;
                                                 else if (newUser.substring(0, 5) == "MCSCT") 
                                                    token = MCSCTToken;
                                                 else 
                                                    token = GlobalToken;
                                                endpoint.token = token;
                                                endpoint.password = GlobalPassword;
                                                endpoint.url = GlobalEndpoint;
                                                self.profile.addLrsUrl(endpoint);
                                                self.storage.saveUserProfile(self.profile);
                                                if (window.FakeCompetency != null) {
                                                    var result = window.FakeCompetency.getCompetencies(newUser);
                                                    var collapsed = {};
                                                    for (var i = 0; i < result.length; i++) {
                                                        var pair = result[i];
                                                        var obj = pair[1];
                                                        var temp = pair[0]["url"];
                                                        collapsed[temp.substring(0, temp.lastIndexOf("/"))] = obj;
                                                    }
                                                    self.storage.setCompetencies(self.profile, collapsed);
                                                }
                                            }
                                            self.storage.storeCurrentUser(self.profile, function() {
                                                setTimeout(function() {
                                                    window.location = window.location;
                                                }, 5);
                                                window.Lightbox.close();
                                                if (callback != null) 
                                                    callback();
                                            });
                                        });
                                    });
                                });
                            });
                        });
                        return false;
                    };
                } else {
                    self.storage.getUserProfile(currentUser, function(profile) {
                        self.profile = profile;
                        self.isLoggedIn = true;
                        self.sameUser = true;
                        self.storage.storeCurrentUser(profile, callback);
                    });
                }
            }
        });
    };
    prototype.loginAsUser = function(username, password, callback) {
        this.loginCallback = callback;
        var self = this;
        this.storage.getCurrentUser(function(currentUser) {
            if (window.Lightbox != null) {
                if ((currentUser == "") || (currentUser == "null") || (currentUser == null) || (currentUser == "guest")) {
                    var newUser = username;
                    window.Lightbox.getLRSURL(function(lrsURL) {
                        var GlobalEndpoint = lrsURL;
                        window.Lightbox.getLRSToken(function(lrsToken) {
                            var GlobalToken = lrsToken;
                            window.Lightbox.getLRSPassword(function(lrsPassword) {
                                var GlobalPassword = lrsPassword;
                                self.isLoggedIn = true;
                                self.storage.getUserProfile(newUser, function(profile) {
                                    self.profile = profile;
                                    self.sameUser = false;
                                    if (self.profile == null) {
                                        self.profile = new UserProfile(null);
                                        self.profile.setIdentity(newUser);
                                        self.profile.setName(newUser);
                                        self.profile.setPreferredName(newUser);
                                        var endpoint = new Endpoint();
                                        endpoint.username = newUser;
                                        endpoint.token = GlobalToken;
                                        endpoint.password = GlobalPassword;
                                        endpoint.url = GlobalEndpoint;
                                        self.profile.addLrsUrl(endpoint);
                                        self.storage.saveUserProfile(self.profile);
                                        if (window.FakeCompetency != null) {
                                            var result = window.FakeCompetency.getCompetencies(newUser);
                                            var collapsed = {};
                                            for (var i = 0; i < result.length; i++) {
                                                var pair = result[i];
                                                var obj = pair[1];
                                                var temp = pair[0]["url"];
                                                collapsed[temp.substring(0, temp.lastIndexOf("/"))] = obj;
                                            }
                                            self.storage.setCompetencies(self.profile, collapsed);
                                        }
                                    }
                                    self.storage.storeCurrentUser(self.profile, function() {
                                        setTimeout(function() {
                                            window.location = window.location;
                                        }, 5);
                                        if (callback != null) 
                                            callback();
                                    });
                                });
                            });
                        });
                    });
                } else {
                    self.storage.getUserProfile(currentUser, function(profile) {
                        self.profile = profile;
                        self.isLoggedIn = true;
                        self.sameUser = true;
                        self.storage.storeCurrentUser(profile, callback);
                    });
                }
            }
        });
    };
    prototype.logout = function() {
        var self = this;
        this.isLoggedIn = false;
        this.storage.storeCurrentUser(LLUserAdapter.guest, function() {
            self.profile = null;
            setTimeout(function() {
                window.location = window.location;
            }, 5);
            self.login(self.loginCallback);
        });
    };
    prototype.loggedIn = function() {
        return this.isLoggedIn;
    };
    prototype.isSameUser = function() {
        return this.sameUser;
    };
}, {storage: "StorageAdapter", profile: "UserProfile", loginCallback: "Callback0", guest: "UserProfile"}, {});
(function() {
    LLUserAdapter.guest = new UserProfile(null);
    LLUserAdapter.guest.setName("guest");
    LLUserAdapter.guest.setIdentity("guest");
})();
var ADLDemoUserAdapter = function(storage) {
    this.storage = storage;
    this.isLoggedIn = false;
    this.sameUser = false;
    this.profile = null;
    this.loginUserNameSelect = "loginUserNameSelector";
};
ADLDemoUserAdapter = stjs.extend(ADLDemoUserAdapter, null, [UserAdapter], function(constructor, prototype) {
    prototype.storage = null;
    prototype.isLoggedIn = false;
    prototype.sameUser = null;
    prototype.profile = null;
    prototype.loginUserNameSelect = null;
    prototype.loginCallback = null;
    constructor.guest = null;
    prototype.getUser = function() {
        if (this.isLoggedIn) 
            return this.profile;
        return ADLDemoUserAdapter.guest;
    };
    prototype.login = function(callback) {
        this.loginCallback = callback;
        var self = this;
        this.storage.getCurrentUser(function(currentUser) {
            if (window.Lightbox != null) {
                if ((currentUser == "") || (currentUser == "null") || (currentUser == null) || (currentUser == "guest")) {
                    window.Lightbox.createLoginForm();
                    var loginButton = window.document.getElementById("loginUserNameSubmit");
                    loginButton.onclick = function(event) {
                        var newUser = (window.document.getElementById(self.loginUserNameSelect)).value;
                        self.isLoggedIn = true;
                        self.storage.getUserProfile(newUser, function(profile) {
                            self.profile = profile;
                            self.sameUser = false;
                            if (self.profile == null) {
                                self.profile = new UserProfile(null);
                                self.profile.setIdentity(newUser);
                                self.profile.setName(newUser);
                                self.profile.setPreferredName(newUser);
                                var endpoint = new Endpoint();
                                endpoint.username = newUser;
                                endpoint.password = "#PEBLTest67";
                                endpoint.url = "https://lrs.adlnet.gov/xapi/";
                                self.profile.addLrsUrl(endpoint);
                                self.storage.saveUserProfile(self.profile);
                                if (window.FakeCompetency != null) {
                                    var result = window.FakeCompetency.getCompetencies(newUser);
                                    var collapsed = {};
                                    for (var i = 0; i < result.length; i++) {
                                        var pair = result[i];
                                        var obj = pair[1];
                                        var temp = pair[0]["url"];
                                        collapsed[temp.substring(0, temp.lastIndexOf("/"))] = obj;
                                    }
                                    self.storage.setCompetencies(self.profile, collapsed);
                                }
                            }
                            self.storage.storeCurrentUser(self.profile, function() {
                                setTimeout(function() {
                                    window.location = window.location;
                                }, 5);
                                window.Lightbox.close();
                                if (callback != null) 
                                    callback();
                            });
                        });
                        return false;
                    };
                } else {
                    self.storage.getUserProfile(currentUser, function(profile) {
                        self.profile = profile;
                        self.isLoggedIn = true;
                        self.sameUser = true;
                        self.storage.storeCurrentUser(profile, callback);
                    });
                }
            }
        });
    };
    prototype.loginAsUser = function(username, password, callback) {
        this.loginCallback = callback;
        var self = this;
        this.storage.getCurrentUser(function(currentUser) {
            if (window.Lightbox != null) {
                if ((currentUser == "") || (currentUser == "null") || (currentUser == null) || (currentUser == "guest")) {
                    var newUser = username;
                    self.isLoggedIn = true;
                    self.storage.getUserProfile(newUser, function(profile) {
                        self.profile = profile;
                        self.sameUser = false;
                        if (self.profile == null) {
                            self.profile = new UserProfile(null);
                            self.profile.setIdentity(newUser);
                            self.profile.setName(newUser);
                            self.profile.setPreferredName(newUser);
                            var endpoint = new Endpoint();
                            endpoint.username = newUser;
                            endpoint.password = password;
                            endpoint.url = "https://lrs.adlnet.gov/xapi/";
                            self.profile.addLrsUrl(endpoint);
                            self.storage.saveUserProfile(self.profile);
                            if (window.FakeCompetency != null) {
                                var result = window.FakeCompetency.getCompetencies(newUser);
                                var collapsed = {};
                                for (var i = 0; i < result.length; i++) {
                                    var pair = result[i];
                                    var obj = pair[1];
                                    var temp = pair[0]["url"];
                                    collapsed[temp.substring(0, temp.lastIndexOf("/"))] = obj;
                                }
                                self.storage.setCompetencies(self.profile, collapsed);
                            }
                        }
                        self.storage.storeCurrentUser(self.profile, function() {
                            setTimeout(function() {
                                window.location = window.location;
                            }, 5);
                            if (callback != null) 
                                callback();
                        });
                    });
                } else {
                    self.storage.getUserProfile(currentUser, function(profile) {
                        self.profile = profile;
                        self.isLoggedIn = true;
                        self.sameUser = true;
                        self.storage.storeCurrentUser(profile, callback);
                    });
                }
            }
        });
    };
    prototype.logout = function() {
        var self = this;
        this.isLoggedIn = false;
        this.storage.storeCurrentUser(ADLDemoUserAdapter.guest, function() {
            self.profile = null;
            setTimeout(function() {
                window.location = window.location;
            }, 5);
            self.login(self.loginCallback);
        });
    };
    prototype.loggedIn = function() {
        return this.isLoggedIn;
    };
    prototype.isSameUser = function() {
        return this.sameUser;
    };
}, {storage: "StorageAdapter", profile: "UserProfile", loginCallback: "Callback0", guest: "UserProfile"}, {});
(function() {
    ADLDemoUserAdapter.guest = new UserProfile(null);
    ADLDemoUserAdapter.guest.setName("guest");
    ADLDemoUserAdapter.guest.setIdentity("guest");
})();
var IndexedDBStorageAdapter = function(callback) {
    this.interop = new IndexedDBInterop(callback);
};
IndexedDBStorageAdapter = stjs.extend(IndexedDBStorageAdapter, null, [StorageAdapter], function(constructor, prototype) {
    prototype.interop = null;
    constructor.processMapToXApi = function(records, filter) {
        var result = [];
        for (var i = 0; i < records.length; i++) {
            var xapi = new ADL.XAPIStatement(records[i]);
            for (var x = 0; x < filter.length; x++) 
                delete xapi[filter[x]];
            result.push(xapi);
        }
        return result;
    };
    prototype.getAnnotations = function(user, thread, callback) {
        this.interop.getAnnotations(user, thread, function(records) {
            callback(IndexedDBStorageAdapter.processMapToXApi(records, ["identity", "containerPath"]));
        });
    };
    prototype.storeCurrentUser = function(user, callback) {
        this.interop.storeCurrentUser(user, callback);
    };
    prototype.getCurrentUser = function(callback) {
        this.interop.getCurrentUser(callback);
    };
    prototype.storeCurrentBook = function(book) {
        this.interop.storeCurrentBook(book);
    };
    prototype.getCurrentBook = function(callback) {
        this.interop.getCurrentBook(callback);
    };
    prototype.saveEvent = function(user, containerPath, event) {
        this.interop.saveEvent(user, containerPath, event);
    };
    prototype.saveEvents = function(user, containerPath, events) {
        this.interop.saveEvents(user, containerPath, events);
    };
    prototype.getEvents = function(user, containerPath, callback) {
        this.interop.getEvents(user, containerPath, function(records) {
            callback(IndexedDBStorageAdapter.processMapToXApi(records, ["identity", "containerPath"]));
        });
    };
    prototype.getCompetencies = function(user, callback) {
        this.interop.getCompetencies(user, callback);
    };
    prototype.setCompetencies = function(user, competencies) {
        this.interop.setCompetencies(user, competencies);
    };
    prototype.storeOutgoing = function(user, xapi) {
        this.interop.storeOutgoing(user, xapi);
    };
    prototype.postMessage = function(user, thread, message) {
        this.interop.postMessage(user, thread, message);
    };
    prototype.postMessages = function(user, thread, messages) {
        this.interop.postMessages(user, thread, messages);
    };
    prototype.getMessages = function(user, thread, callback) {
        this.interop.getMessages(user, thread, function(records) {
            callback(IndexedDBStorageAdapter.processMapToXApi(records, ["identity", "thread"]));
        });
    };
    prototype.saveUserProfile = function(user) {
        this.interop.saveUserProfile(user);
    };
    prototype.removeAnnotation = function(user, id, containerPath) {
        this.interop.removeAnnotation(user, id);
    };
    prototype.removeSharedAnnotation = function(user, id) {
        this.interop.removeSharedAnnotation(user, id);
    };
    prototype.getGeneralAnnotations = function(user, containerPath, callback) {
        this.interop.getGeneralAnnotations(user, containerPath, function(records) {
            callback(IndexedDBStorageAdapter.processMapToXApi(records, ["containerPath"]));
        });
    };
    prototype.getUserProfile = function(id, callback) {
        this.interop.getUserProfile(id, function(record) {
            callback((record == null) ? null : new UserProfile(record));
        });
    };
    prototype.getOutgoing = function(user, callback) {
        this.interop.getOutgoing(user, function(records) {
            callback(IndexedDBStorageAdapter.processMapToXApi(records, ["identity", "containerPath", "thread", "url"]));
        });
    };
    prototype.clearOutgoing = function(user, toClear) {
        this.interop.clearOutgoing(user, toClear);
    };
    prototype.saveAnnotation = function(user, containerPath, annotation) {
        this.interop.saveAnnotation(user, containerPath, annotation);
    };
    prototype.saveAnnotations = function(user, containerPath, annotations) {
        this.interop.saveAnnotations(user, containerPath, annotations);
    };
    prototype.saveGeneralAnnotation = function(user, containerPath, annotation) {
        this.interop.saveGeneralAnnotation(user, containerPath, annotation);
    };
    prototype.saveGeneralAnnotations = function(user, containerPath, annotations) {
        this.interop.saveGeneralAnnotations(user, containerPath, annotations);
    };
    prototype.getAsset = function(id, callback) {
        this.interop.getAsset(id, callback);
    };
    prototype.setAsset = function(id, data) {
        this.interop.saveAsset(id, data);
    };
    prototype.removeNotification = function(user, id) {
        this.interop.removeNotification(user, id);
    };
    prototype.getNotifications = function(user, callback) {
        this.interop.getNotifications(user, callback);
    };
    prototype.addNotification = function(user, notification) {
        this.interop.addNotification(user, notification);
    };
    prototype.getToc = function(user, containerPath, callback) {
        this.interop.getToc(user, containerPath, callback);
    };
    prototype.removeToc = function(user, containerPath, section, id) {
        this.interop.removeToc(user, containerPath, section, id);
    };
    prototype.addToc = function(user, containerPath, data) {
        this.interop.addToc(user, containerPath, data);
    };
    prototype.removeMessage = function(user, id, thread) {
        this.interop.removeMessage(id);
    };
}, {interop: "IndexedDBInterop"}, {});
var MoodleUserAdapter = function(storage) {
    this.storage = storage;
    this.isLoggedIn = false;
    this.sameUser = false;
    this.profile = null;
    this.loginUserNameSelector = "loginUserName";
    this.loginPasswordSelector = "loginPassword";
};
MoodleUserAdapter = stjs.extend(MoodleUserAdapter, null, [UserAdapter], function(constructor, prototype) {
    constructor.MOODLE_HOST = null;
    constructor.MOODLE_WEBSERVICE = null;
    constructor.MOODLE_WEBSERVICE_GET_INFO = null;
    constructor.MOODLE_LOGIN = null;
    constructor.MOODLE_LOGIN_PASSWORD = null;
    constructor.MOODLE_GET_INFO_ENDPOINT = null;
    constructor.MOODLE_LOGIN_ENDPOINT = null;
    prototype.storage = null;
    prototype.isLoggedIn = false;
    prototype.sameUser = null;
    prototype.profile = null;
    prototype.loginUserNameSelector = null;
    prototype.loginPasswordSelector = null;
    prototype.loginCallback = null;
    prototype.loginRequest = null;
    prototype.getInfoRequest = null;
    constructor.guest = null;
    prototype.makeLoginUrl = function(username, password) {
        return MoodleUserAdapter.MOODLE_LOGIN_ENDPOINT + encodeURIComponent(username) + MoodleUserAdapter.MOODLE_LOGIN_PASSWORD + encodeURIComponent(password);
    };
    prototype.makeGetInfoUrl = function(token) {
        return MoodleUserAdapter.MOODLE_GET_INFO_ENDPOINT + token;
    };
    prototype.getUser = function() {
        if (this.isLoggedIn) 
            return this.profile;
        return MoodleUserAdapter.guest;
    };
    prototype.login = function(callback) {
        this.loginRequest = new XMLHttpRequest();
        this.loginCallback = callback;
        var self = this;
        this.storage.getCurrentUser(function(currentUser) {
            if (window.Lightbox != null) {
                if ((currentUser == "") || (currentUser == "null") || (currentUser == null) || (currentUser == "guest")) {
                    window.Lightbox.createLoginFormWithFields();
                    var loginButton = window.document.getElementById("loginUserNameSubmit");
                    loginButton.onclick = function(event) {
                        var user = (window.document.getElementById(self.loginUserNameSelector)).value;
                        var password = (window.document.getElementById(self.loginPasswordSelector)).value;
                        self.loginRequest.open("POST", self.makeLoginUrl(user, password), true);
                        self.loginRequest.onreadystatechange = function() {
                            if (self.loginRequest.readyState == 4) {
                                if (self.loginRequest.status == 200) {
                                    var response = JSON.parse(self.loginRequest.responseText);
                                    if (response["error"] == null) {
                                        self.getInfoRequest = new XMLHttpRequest();
                                        self.getInfoRequest.open("POST", self.makeGetInfoUrl(response["token"]), true);
                                        self.getInfoRequest.onreadystatechange = function() {
                                            if (self.getInfoRequest.readyState == 4) {
                                                var response = JSON.parse(self.getInfoRequest.responseText);
                                                if (response["error"] == null) {
                                                    self.isLoggedIn = true;
                                                    self.storage.getUserProfile(response["username"], function(profile) {
                                                        self.profile = profile;
                                                        if (self.profile == null) {
                                                            self.profile = new UserProfile(null);
                                                            self.profile.setIdentity(response["username"]);
                                                            self.profile.setName(response["fullname"]);
                                                            self.profile.setHomePage(response["siteurl"]);
                                                            self.profile.setPreferredName(response["fullname"]);
                                                            var endpoint = new Endpoint();
                                                            endpoint.username = "pebl.plug";
                                                            endpoint.password = "#PEBLTest67";
                                                            endpoint.url = "https://lrs.peblproject.com/xapi/";
                                                            self.profile.addLrsUrl(endpoint);
                                                            self.storage.saveUserProfile(self.profile);
                                                            if (window.FakeCompetency != null) {
                                                                var result = window.FakeCompetency.getCompetencies(currentUser);
                                                                if (result != null) {
                                                                    var collapsed = {};
                                                                    for (var i = 0; i < result.length; i++) {
                                                                        var pair = result[i];
                                                                        var obj = pair[1];
                                                                        var temp = pair[0]["url"];
                                                                        collapsed[temp.substring(0, temp.lastIndexOf("/"))] = obj;
                                                                    }
                                                                    self.storage.setCompetencies(self.profile, collapsed);
                                                                }
                                                            }
                                                        }
                                                        self.storage.getCurrentUser(function(id) {
                                                            self.sameUser = id == self.profile.getIdentity();
                                                            self.storage.storeCurrentUser(self.profile, function() {
                                                                window.location = window.location;
                                                                if (callback != null) 
                                                                    callback();
                                                                window.Lightbox.close();
                                                            });
                                                        });
                                                    });
                                                }
                                            }
                                        };
                                        self.getInfoRequest.send();
                                    } else {
                                        self.isLoggedIn = false;
                                        var e = window.document.getElementById("loginError");
                                        e.setAttribute("style", "color:red");
                                    }
                                }
                            }
                        };
                        self.loginRequest.send();
                        return true;
                    };
                } else {
                    self.storage.getUserProfile(currentUser, function(profile) {
                        self.profile = profile;
                        self.isLoggedIn = true;
                        self.sameUser = true;
                        self.storage.storeCurrentUser(profile, callback);
                    });
                }
            }
        });
    };
    prototype.loginAsUser = function(username, password, callback) {};
    prototype.logout = function() {
        this.isLoggedIn = false;
        var self = this;
        this.storage.storeCurrentUser(MoodleUserAdapter.guest, function() {
            self.profile = null;
            window.location = window.location;
            self.login(self.loginCallback);
        });
    };
    prototype.loggedIn = function() {
        return this.isLoggedIn;
    };
    prototype.isSameUser = function() {
        return this.sameUser;
    };
}, {storage: "StorageAdapter", profile: "UserProfile", loginCallback: "Callback0", loginRequest: "XMLHttpRequest", getInfoRequest: "XMLHttpRequest", guest: "UserProfile"}, {});
(function() {
    MoodleUserAdapter.guest = new UserProfile(null);
    MoodleUserAdapter.guest.setName("guest");
    MoodleUserAdapter.guest.setIdentity("guest");
    MoodleUserAdapter.MOODLE_HOST = "http://extension.eduworks.com/moodle/";
    MoodleUserAdapter.MOODLE_WEBSERVICE = "webservice/rest/server.php";
    MoodleUserAdapter.MOODLE_WEBSERVICE_GET_INFO = "?wsfunction=core_webservice_get_site_info&moodlewsrestformat=json&wstoken=";
    MoodleUserAdapter.MOODLE_LOGIN = "login/token.php?service=PEBLLogin&username=";
    MoodleUserAdapter.MOODLE_LOGIN_PASSWORD = "&password=";
    MoodleUserAdapter.MOODLE_GET_INFO_ENDPOINT = MoodleUserAdapter.MOODLE_HOST + MoodleUserAdapter.MOODLE_WEBSERVICE + MoodleUserAdapter.MOODLE_WEBSERVICE_GET_INFO;
    MoodleUserAdapter.MOODLE_LOGIN_ENDPOINT = MoodleUserAdapter.MOODLE_HOST + MoodleUserAdapter.MOODLE_LOGIN;
})();
var OpenIDUserAdapter = function(storage) {
    this.errored = function() {};
    this.storage = storage;
    this.isLoggedIn = false;
    this.sameUser = false;
};
OpenIDUserAdapter = stjs.extend(OpenIDUserAdapter, null, [UserAdapter], function(constructor, prototype) {
    prototype.storage = null;
    prototype.isLoggedIn = false;
    prototype.authChannel = null;
    prototype.profile = null;
    prototype.sameUser = null;
    prototype.errored = null;
    constructor.guest = null;
    prototype.getUser = function() {
        if (this.isLoggedIn) 
            return this.profile;
        return OpenIDUserAdapter.guest;
    };
    prototype.isSameUser = function() {
        return this.sameUser;
    };
    prototype.handleProfile = function(userId, loginCallback) {
        var self = this;
        return function(profile) {
            self.profile = profile;
            if (self.profile == null) {
                self.profile = new UserProfile(null);
                self.profile.setIdentity(userId);
                self.profile.setName(self.authChannel.idTokenParsed["given_name"] + " " + self.authChannel.idTokenParsed["family_name"]);
                self.profile.setPreferredName(self.authChannel.idTokenParsed["preferred_username"]);
                var endpoint = new Endpoint();
                endpoint.username = "cc03593a1bbe60f13e761128a36e2a7739ea91d3";
                endpoint.password = "35638b8a3f6073d8a4163d6dae62be5437f10128";
                endpoint.url = "http://tla-core.adlnet.gov:8001/data/xAPI/";
                self.profile.addLrsUrl(endpoint);
                self.storage.saveUserProfile(self.profile);
            }
            self.storage.getCurrentUser(function(storedId) {
                self.sameUser = storedId == self.profile.getIdentity();
                self.storage.storeCurrentUser(self.profile, function() {
                    if (loginCallback != null) 
                        loginCallback();
                });
            });
        };
    };
    prototype.login = function(loginCallback) {
        var self = this;
        var config = {};
        config["realm"] = "fluent";
        config["url"] = "http://tla-core.adlnet.gov:8081/auth";
        config["clientId"] = "PEBL";
        var secret = {};
        secret["secret"] = "b13425d1-c730-4b57-9876-566fe08b7875";
        config["credentials"] = secret;
        var initConfig = {};
        initConfig["onLoad"] = "login-required";
        initConfig["flow"] = "implicit";
        this.authChannel = new Keycloak(config);
        var didLogin = function(authorized) {
            self.isLoggedIn = authorized;
            var userId = self.authChannel.idTokenParsed["sub"];
            self.storage.getUserProfile(userId, self.handleProfile(userId, loginCallback));
        };
        this.authChannel.init(initConfig).success(didLogin).error(this.errored);
    };
    prototype.loginAsUser = function(username, password, callback) {};
    prototype.logout = function() {
        var self = this;
        var options = {};
        options["redirectUri"] = window.location.href;
        this.isLoggedIn = false;
        this.storage.storeCurrentUser(OpenIDUserAdapter.guest, function() {
            self.profile = null;
            if (self.authChannel != null) 
                self.authChannel.logout(options);
        });
    };
    prototype.loggedIn = function() {
        return this.isLoggedIn;
    };
}, {storage: "StorageAdapter", authChannel: "Keycloak", profile: "UserProfile", errored: "Callback0", guest: "UserProfile"}, {});
(function() {
    OpenIDUserAdapter.guest = new UserProfile(null);
    OpenIDUserAdapter.guest.setName("guest");
    OpenIDUserAdapter.guest.setIdentity("guest");
})();
/**
 *  Basic HTML5 session storage or local storage
 *  @author aaron.veden@eduworks.com
 */
var InMemoryStorageAdapter = function(storage) {
    this.persistStorage = storage;
    this.storage = {};
};
InMemoryStorageAdapter = stjs.extend(InMemoryStorageAdapter, null, [StorageAdapter], function(constructor, prototype) {
    prototype.persistStorage = null;
    prototype.storage = null;
    prototype.saveXApisMap = function(key, value) {
        this.storage[key] = JSON.stringify(value);
    };
    prototype.storeMapRecord = function(key, item) {
        var records = XApiUtils.parseXApiMap(this.storage[key]);
        records[item["id"]] = item;
        this.saveXApisMap(key, records);
    };
    prototype.removeAnnotation = function(user, id, containerPath) {
        var key = user.getIdentity() + containerPath;
        var records = XApiUtils.parseXApiMap(this.storage[key]);
        delete records[id];
        this.saveXApisMap(key, records);
    };
    prototype.removeSharedAnnotation = function(user, id) {};
    prototype.postMessage = function(user, thread, message) {
        this.storeMapRecord(user.getIdentity() + thread, message);
    };
    prototype.postMessages = function(user, thread, messages) {
        var key = user.getIdentity() + thread;
        var records = XApiUtils.parseXApiMap(this.storage[key]);
        for (var i = 0; i < messages.length; i++) {
            var item = messages[i];
            records[item["id"]] = item;
        }
        this.saveXApisMap(key, records);
    };
    prototype.fromMapToArray = function(xapis) {
        var result = [];
        for (var key in xapis) 
            result.push(xapis[key]);
        XApiUtils.sortXApiNewest(result);
        return result;
    };
    prototype.getAnnotations = function(user, containerPath, callback) {
        var annotationsMap = XApiUtils.parseXApiMap(this.storage[user.getIdentity() + containerPath]);
        var result = this.fromMapToArray(annotationsMap);
        if (callback != null) 
            callback(result);
    };
    prototype.getGeneralAnnotations = function(user, containerPath, callback) {
        var annotationsMap = XApiUtils.parseXApiMap(this.storage[user.getIdentity() + containerPath + StorageAdapter.AREA_GENERAL]);
        var result = this.fromMapToArray(annotationsMap);
        if (callback != null) 
            callback(result);
    };
    prototype.getCompetencies = function(user, callback) {
        var obj = JSON.parse(this.persistStorage.getItem(user.getIdentity() + StorageAdapter.AREA_COMPENTENCIES));
        if (obj == null) 
            obj = {};
        if (callback != null) 
            callback(obj);
    };
    prototype.setCompetencies = function(user, incomingCompetencies) {
        var kvsa = this;
        if (incomingCompetencies != null) {
            this.getCompetencies(user, function(competencies) {
                for (var key in incomingCompetencies) 
                    competencies[key] = incomingCompetencies[key];
                kvsa.persistStorage.setItem(user.getIdentity() + StorageAdapter.AREA_COMPENTENCIES, JSON.stringify(competencies));
            });
        }
    };
    prototype.getMessages = function(user, thread, callback) {
        var messagesMap = XApiUtils.parseXApiMap(this.storage[user.getIdentity() + thread]);
        var result = this.fromMapToArray(messagesMap);
        if (callback != null) 
            callback(result);
    };
    prototype.getUserProfile = function(id, callback) {
        var profileString = this.persistStorage.getItem(id + StorageAdapter.AREA_PROFILE);
        var profile = null;
        if (profileString != null) 
            profile = new UserProfile(profileString);
        if (callback != null) 
            callback(profile);
    };
    prototype.storeCurrentUser = function(user, callback) {
        this.persistStorage.setItem(StorageAdapter.AREA_CURRENT_USER, user.getIdentity());
        if (callback != null) 
            callback();
    };
    prototype.getCurrentUser = function(callback) {
        if (callback != null) 
            callback(this.persistStorage.getItem(StorageAdapter.AREA_CURRENT_USER));
    };
    prototype.storeCurrentBook = function(book) {
        this.persistStorage.setItem(StorageAdapter.AREA_CURRENT_BOOK, book);
    };
    prototype.getCurrentBook = function(callback) {
        if (callback != null) 
            callback(this.persistStorage.getItem(StorageAdapter.AREA_CURRENT_BOOK));
    };
    prototype.saveUserProfile = function(user) {
        this.persistStorage.setItem(user.getIdentity() + StorageAdapter.AREA_PROFILE, user.toString());
    };
    prototype.storeOutgoing = function(user, xapi) {
        this.storeMapRecord(user.getIdentity() + StorageAdapter.AREA_OUTGOING, xapi);
    };
    prototype.clearOutgoing = function(user, toClear) {
        var key = user.getIdentity() + StorageAdapter.AREA_OUTGOING;
        var outgoingMap = XApiUtils.parseXApiMap(this.storage[key]);
        for (var i = 0; i < toClear.length; i++) 
            delete outgoingMap[toClear[i]["id"]];
        this.saveXApisMap(key, outgoingMap);
    };
    prototype.getOutgoing = function(user, callback) {
        var key = user.getIdentity() + StorageAdapter.AREA_OUTGOING;
        var outgoingMap = XApiUtils.parseXApiMap(this.storage[key]);
        var result = this.fromMapToArray(outgoingMap);
        if (callback != null) 
            callback(result);
    };
    prototype.removeMessage = function(user, id, thread) {
        var key = user.getIdentity() + thread;
        var records = XApiUtils.parseXApiMap(this.storage[key]);
        delete records[id];
        this.saveXApisMap(key, records);
    };
    prototype.saveAnnotation = function(user, containerPath, annotation) {
        this.storeMapRecord(user.getIdentity() + containerPath, annotation);
    };
    prototype.saveAnnotations = function(user, containerPath, annotations) {
        var key = user.getIdentity() + containerPath;
        var records = XApiUtils.parseXApiMap(this.storage[key]);
        for (var i = 0; i < annotations.length; i++) {
            var item = annotations[i];
            records[item["id"]] = item;
        }
        this.saveXApisMap(key, records);
    };
    prototype.saveGeneralAnnotation = function(user, containerPath, annotation) {
        this.storeMapRecord(user.getIdentity() + containerPath + "General", annotation);
    };
    prototype.saveGeneralAnnotations = function(user, containerPath, annotations) {
        var key = user.getIdentity() + containerPath + "General";
        var records = XApiUtils.parseXApiMap(this.storage[key]);
        for (var i = 0; i < annotations.length; i++) {
            var item = annotations[i];
            records[item["id"]] = item;
        }
        this.saveXApisMap(key, records);
    };
    prototype.saveEvent = function(user, containerPath, event) {
        this.storeMapRecord(user.getIdentity() + containerPath + StorageAdapter.AREA_EVENTS, event);
    };
    prototype.saveEvents = function(user, containerPath, events) {
        var key = user.getIdentity() + containerPath + StorageAdapter.AREA_EVENTS;
        var records = XApiUtils.parseXApiMap(this.storage[key]);
        for (var i = 0; i < events.length; i++) {
            var item = events[i];
            records[item["id"]] = item;
        }
        this.saveXApisMap(key, records);
    };
    prototype.getEvents = function(user, containerPath, callback) {
        var key = user.getIdentity() + containerPath + StorageAdapter.AREA_EVENTS;
        var eventMap = XApiUtils.parseXApiMap(this.storage[key]);
        var result = this.fromMapToArray(eventMap);
        if (callback != null) 
            callback(result);
    };
    prototype.getAsset = function(id, callback) {};
    prototype.setAsset = function(id, data) {};
    prototype.removeNotification = function(user, id) {};
    prototype.getNotifications = function(user, callback) {};
    prototype.addNotification = function(user, notification) {};
    prototype.getToc = function(user, containerPath, callback) {};
    prototype.removeToc = function(user, containerPath, section, id) {};
    prototype.addToc = function(user, containerPath, data) {};
}, {persistStorage: "Storage", storage: {name: "Map", arguments: [null, null]}}, {});
/**
 *  Hooks for which events are recorded during a session
 *  
 *  @author aaron.veden@eduworks.com
 */
var XApiGenerator = function(userManager, sa, activityManager) {
    this.storage = sa;
    this.userManager = userManager;
    this.activityManager = activityManager;
};
XApiGenerator = stjs.extend(XApiGenerator, null, [], function(constructor, prototype) {
    prototype.storage = null;
    prototype.userManager = null;
    prototype.activityManager = null;
    prototype.checklisted = function(checklistId, checklistUser, checklistPrompts, checklistResponses) {
        var containerPath = "pebl://" + this.activityManager.getBook();
        var checklistData = {};
        checklistData["checklistId"] = checklistId;
        checklistData["checklistUser"] = checklistUser;
        checklistData["checklistPrompts"] = checklistPrompts;
        checklistData["checklistResponses"] = checklistResponses;
        this.makeStatement(new ADL.XAPIStatement.Verb("http://www.peblproject.com/definitions.html#checklisted", "checklisted"), new ADL.XAPIStatement.Activity(containerPath, "", JSON.stringify(checklistData)));
    };
    prototype.compatibilityTested = function(eReaderName, osName, osVersion, browserName, browserVersion, userAgent, appVersion, platform, vendor, loginResult, localStorageResult, indexedDBResult, discussionResult, contentMorphingResult, figureResult, popoutResult, hotwordResult, quizResult, showHideResult) {
        var containerPath = "pebl://" + this.activityManager.getBook();
        var testData = {};
        testData["eReaderName"] = eReaderName;
        testData["osName"] = osName;
        testData["osVersion"] = osVersion;
        testData["browserName"] = browserName;
        testData["browserVersion"] = browserVersion;
        testData["userAgent"] = userAgent;
        testData["appVersion"] = appVersion;
        testData["platform"] = platform;
        testData["vendor"] = vendor;
        testData["loginResult"] = loginResult;
        testData["localStorageResult"] = localStorageResult;
        testData["indexedDBResult"] = indexedDBResult;
        testData["discussionResult"] = discussionResult;
        testData["contentMorphingResult"] = contentMorphingResult;
        testData["figureResult"] = figureResult;
        testData["popoutResult"] = popoutResult;
        testData["hotwordResult"] = hotwordResult;
        testData["quizResult"] = quizResult;
        testData["showHideResult"] = showHideResult;
        this.makeStatement(new ADL.XAPIStatement.Verb("http://www.peblproject.com/definitions.html#compatibilityTested", "compatibilityTested"), new ADL.XAPIStatement.Activity(containerPath, "", JSON.stringify(testData)));
    };
    prototype.pushed = function(target, location, card, url, docType, name, externalURL) {
        var containerPath = "peblThread://user-" + target;
        var pushData = {};
        pushData["target"] = target;
        pushData["url"] = url;
        pushData["name"] = name;
        pushData["location"] = location;
        pushData["card"] = card;
        pushData["docType"] = docType;
        pushData["externalURL"] = externalURL;
        this.makeStatement(new ADL.XAPIStatement.Verb("http://www.peblproject.com/definitions.html#pushed", "pushed"), new ADL.XAPIStatement.Activity(containerPath, "", JSON.stringify(pushData)));
    };
    prototype.pulled = function(target, location, card, url, docType, name, externalURL) {
        var containerPath = "peblThread://user-" + target;
        var pushData = {};
        pushData["target"] = target;
        pushData["url"] = url;
        pushData["name"] = name;
        pushData["location"] = location;
        pushData["card"] = card;
        pushData["docType"] = docType;
        pushData["externalURL"] = externalURL;
        this.makeStatement(new ADL.XAPIStatement.Verb("http://www.peblproject.com/definitions.html#pulled", "pulled"), new ADL.XAPIStatement.Activity(containerPath, "", JSON.stringify(pushData)));
    };
    prototype.completed = function(cfi, activity, description) {
        var containerPath = "pebl://" + this.activityManager.getBook();
        if ((activity != null) && (activity.trim() == "")) 
            activity = null;
        if (description != null) {
            if (description.trim() == "") 
                description = null;
             else 
                description = description.replaceAll("\\s+", " ");
        }
        this.makeStatement(new ADL.XAPIStatement.Verb("http://adlnet.gov/expapi/verbs/completed", "completed"), new ADL.XAPIStatement.Activity(containerPath, activity, description));
    };
    prototype.passed = function(points, activity, description) {
        var result = {};
        var score = {};
        score["scaled"] = points / 100.0;
        score["raw"] = points;
        score["min"] = 0;
        score["max"] = 100;
        result["score"] = score;
        result["success"] = true;
        result["completion"] = true;
        var containerPath = "pebl://" + this.activityManager.getBook();
        this.makeStatementWithResult(new ADL.XAPIStatement.Verb("http://adlnet.gov/expapi/verbs/passed", "passed"), new ADL.XAPIStatement.Activity(containerPath, activity, description), result, {});
    };
    prototype.initialized = function(activity, description) {
        var containerPath = "pebl://" + (this.activityManager.getBook() == null ? "" : this.activityManager.getBook());
        this.makeStatement(new ADL.XAPIStatement.Verb("http://adlnet.gov/expapi/verbs/initialized", "initialized"), new ADL.XAPIStatement.Activity(containerPath, activity, description));
    };
    prototype.failed = function(points, activity, description) {
        var result = {};
        var score = {};
        score["scaled"] = points / 100.0;
        score["raw"] = points;
        score["min"] = 0;
        score["max"] = 100;
        result["score"] = score;
        result["success"] = false;
        result["completion"] = true;
        var containerPath = "pebl://" + this.activityManager.getBook();
        this.makeStatementWithResult(new ADL.XAPIStatement.Verb("http://adlnet.gov/expapi/verbs/failed", "failed"), new ADL.XAPIStatement.Activity(containerPath, activity, description), result, {});
    };
    prototype.morphed = function(level, competency, cfi) {
        var containerPath = "pebl://" + (this.activityManager.getBook() == null ? "" : this.activityManager.getBook());
        this.makeStatement(new ADL.XAPIStatement.Verb("http://www.peblproject.com/definitions.html#morphed", "morphed"), new ADL.XAPIStatement.Activity(containerPath, "Level = " + level + " - " + competency, cfi));
    };
    prototype.interacted = function() {
        var containerPath = "pebl://" + (this.activityManager.getBook() == null ? "" : this.activityManager.getBook());
        this.makeStatement(new ADL.XAPIStatement.Verb("http://adlnet.gov/expapi/verbs/interacted", "interacted"), new ADL.XAPIStatement.Activity(containerPath, null, null));
    };
    prototype.terminated = function() {
        var activity = this.activityManager.getBook();
        if (activity != null) {
            var containerPath = "pebl://" + activity;
            this.makeStatement(new ADL.XAPIStatement.Verb("http://adlnet.gov/expapi/verbs/terminated", "terminated"), new ADL.XAPIStatement.Activity(containerPath, null, null));
        }
    };
    prototype.answered = function(prompt, answers, answer, correct, done) {
        var containerPath = "pebl://" + this.activityManager.getBook();
        var result = {};
        var score = {};
        var points = correct ? 1 : 0;
        score["scaled"] = points;
        score["raw"] = points;
        score["min"] = 0;
        score["max"] = 1;
        result["score"] = score;
        result["success"] = correct;
        result["completion"] = done;
        result["response"] = answer;
        var expandedActivity = {};
        expandedActivity["type"] = "http://adlnet.gov/expapi/activities/cmi.interaction";
        var cleanedAnswers = [];
        for (var i = 0; i < answers.length; i++) {
            var temp = {};
            temp["id"] = i + "";
            var temp2 = {};
            temp2["en-US"] = answers[i];
            temp["description"] = temp2;
            cleanedAnswers.push(temp);
        }
        expandedActivity["choices"] = cleanedAnswers;
        expandedActivity["interactionType"] = "choice";
        var responses = [];
        responses.push(answer.indexOf(answer) + "");
        expandedActivity["correctResponsesPattern"] = responses;
        this.makeStatementWithResult(new ADL.XAPIStatement.Verb("http://adlnet.gov/expapi/verbs/answered", "answered"), new ADL.XAPIStatement.Activity(containerPath, prompt, null), result, expandedActivity);
    };
    prototype.preferred = function(target, type) {
        var containerPath = "pebl://" + this.activityManager.getBook();
        this.makeStatement(new ADL.XAPIStatement.Verb("http://adlnet.gov/expapi/verbs/preferred", "preferred"), new ADL.XAPIStatement.Activity(containerPath, type, target));
    };
    prototype.nextPage = function(page) {
        var containerPath = "pebl://" + this.activityManager.getBook();
        this.makeStatement(new ADL.XAPIStatement.Verb("http://www.peblproject.com/definitions.html#paged-next", "paged-next"), new ADL.XAPIStatement.Activity(containerPath, null, page.toString()));
    };
    prototype.jumpedPage = function(page) {
        var containerPath = "pebl://" + this.activityManager.getBook();
        this.makeStatement(new ADL.XAPIStatement.Verb("http://www.peblproject.com/definitions.html#paged-jump", "paged-jump"), new ADL.XAPIStatement.Activity(containerPath, null, page.toString()));
    };
    prototype.prevPage = function(page) {
        var containerPath = "pebl://" + this.activityManager.getBook();
        this.makeStatement(new ADL.XAPIStatement.Verb("http://www.peblproject.com/definitions.html#paged-prev", "paged-prev"), new ADL.XAPIStatement.Activity(containerPath, null, page.toString()));
    };
    prototype.startSession = function() {
        var containerPath = "pebl://" + (this.activityManager.getBook() == null ? "" : this.activityManager.getBook());
        this.makeStatement(new ADL.XAPIStatement.Verb("http://www.peblproject.com/definitions.html#entered", "entered"), new ADL.XAPIStatement.Activity(containerPath, null, null));
    };
    prototype.login = function() {
        var containerPath = "pebl://" + (this.activityManager.getBook() == null ? "" : this.activityManager.getBook());
        this.makeStatement(new ADL.XAPIStatement.Verb("http://adlnet.gov/expapi/verbs/logged-in", "logged-in"), new ADL.XAPIStatement.Activity(containerPath, null, null));
    };
    prototype.logout = function() {
        this.makeStatement(new ADL.XAPIStatement.Verb("http://adlnet.gov/expapi/verbs/logged-out", "logged-out"), new ADL.XAPIStatement.Activity("pebl://" + (this.activityManager.getBook() == null ? "" : this.activityManager.getBook()), null, null));
    };
    prototype.endSession = function() {
        var containerPath = "pebl://" + (this.activityManager.getBook() == null ? "" : this.activityManager.getBook());
        this.makeStatement(new ADL.XAPIStatement.Verb("http://adlnet.gov/expapi/verbs/exited", "exited"), new ADL.XAPIStatement.Activity(containerPath, null, null));
    };
    prototype.makeStatement = function(verb, activity) {
        var up = this.userManager.getUser();
        if (up.getName().equals("guest")) 
            return;
        var containerPath = "pebl://" + (this.activityManager.getBook() == null ? "" : this.activityManager.getBook());
        var o = new ADL.XAPIStatement(new ADL.XAPIStatement.Agent(up.generateAgent(), up.getName()), verb, activity);
        XApiUtils.addTimestamp(o);
        var parentActivity = this.activityManager.getParentActivity();
        if ((parentActivity != null) && (parentActivity != "")) 
            containerPath = parentActivity;
        o.addParentActivity(new ADL.XAPIStatement.Activity(containerPath, null, null));
        if (this.activityManager.getBook() != null) 
            this.storage.saveEvent(up, this.activityManager.getBook(), o);
        this.storage.storeOutgoing(up, o);
    };
    prototype.makeStatementWithResult = function(verb, activity, result, expandedActivity) {
        var up = this.userManager.getUser();
        if (up.getName().equals("guest")) 
            return;
        var containerPath = "pebl://" + (this.activityManager.getBook() == null ? "" : this.activityManager.getBook());
        var def = activity["definition"];
        if (expandedActivity != null) 
            for (var key in expandedActivity) 
                def[key] = expandedActivity[key];
        var o = new ADL.XAPIStatement(new ADL.XAPIStatement.Agent(up.generateAgent(), up.getName()), verb, activity);
        o["result"] = result;
        XApiUtils.addTimestamp(o);
        var parentActivity = this.activityManager.getParentActivity();
        if ((parentActivity != null) && (parentActivity != "")) 
            containerPath = parentActivity;
        o.addParentActivity(new ADL.XAPIStatement.Activity(containerPath, null, null));
        if (this.activityManager.getBook() != null) 
            this.storage.saveEvent(up, this.activityManager.getBook(), o);
        this.storage.storeOutgoing(up, o);
    };
}, {storage: "StorageAdapter", userManager: "UserAdapter", activityManager: "ActivityAdapter"}, {});
/**
 *  Basic HTML5 session storage or local storage
 *  @author aaron.veden@eduworks.com
 */
var KeyValueStorageAdapter = function(storage) {
    this.storage = storage;
};
KeyValueStorageAdapter = stjs.extend(KeyValueStorageAdapter, null, [StorageAdapter], function(constructor, prototype) {
    prototype.storage = null;
    prototype.saveXApisMap = function(key, value) {
        this.storage.setItem(key, JSON.stringify(value));
    };
    prototype.storeMapRecord = function(key, item) {
        var records = XApiUtils.parseXApiMap(this.storage.getItem(key));
        records[item["id"]] = item;
        this.saveXApisMap(key, records);
    };
    prototype.removeAnnotation = function(user, id, containerPath) {
        var key = user.getIdentity() + containerPath;
        var records = XApiUtils.parseXApiMap(this.storage.getItem(key));
        delete records[id];
        this.saveXApisMap(key, records);
    };
    prototype.removeSharedAnnotation = function(user, id) {};
    prototype.postMessage = function(user, thread, message) {
        this.storeMapRecord(user.getIdentity() + thread, message);
    };
    prototype.postMessages = function(user, thread, messages) {
        var key = user.getIdentity() + thread;
        var records = XApiUtils.parseXApiMap(this.storage.getItem(key));
        for (var i = 0; i < messages.length; i++) {
            var item = messages[i];
            records[item["id"]] = item;
        }
        this.saveXApisMap(key, records);
    };
    prototype.fromMapToArray = function(xapis) {
        var result = [];
        for (var key in xapis) 
            result.push(xapis[key]);
        XApiUtils.sortXApiNewest(result);
        return result;
    };
    prototype.getAnnotations = function(user, containerPath, callback) {
        var annotationsMap = XApiUtils.parseXApiMap(this.storage.getItem(user.getIdentity() + containerPath));
        var result = this.fromMapToArray(annotationsMap);
        if (callback != null) 
            callback(result);
    };
    prototype.getGeneralAnnotations = function(user, containerPath, callback) {
        var annotationsMap = XApiUtils.parseXApiMap(this.storage.getItem(user.getIdentity() + containerPath + StorageAdapter.AREA_GENERAL));
        var result = this.fromMapToArray(annotationsMap);
        if (callback != null) 
            callback(result);
    };
    prototype.getCompetencies = function(user, callback) {
        var obj = JSON.parse(this.storage.getItem(user.getIdentity() + StorageAdapter.AREA_COMPENTENCIES));
        if (obj == null) 
            obj = {};
        if (callback != null) 
            callback(obj);
    };
    prototype.setCompetencies = function(user, incomingCompetencies) {
        var kvsa = this;
        if (incomingCompetencies != null) {
            this.getCompetencies(user, function(competencies) {
                for (var key in incomingCompetencies) 
                    competencies[key] = incomingCompetencies[key];
                kvsa.storage.setItem(user.getIdentity() + StorageAdapter.AREA_COMPENTENCIES, JSON.stringify(competencies));
            });
        }
    };
    prototype.getMessages = function(user, thread, callback) {
        var messagesMap = XApiUtils.parseXApiMap(this.storage.getItem(user.getIdentity() + thread));
        var result = this.fromMapToArray(messagesMap);
        if (callback != null) 
            callback(result);
    };
    prototype.getUserProfile = function(id, callback) {
        var profileString = this.storage.getItem(id + StorageAdapter.AREA_PROFILE);
        var profile = null;
        if (profileString != null) 
            profile = new UserProfile(profileString);
        if (callback != null) 
            callback(profile);
    };
    prototype.storeCurrentUser = function(user, callback) {
        this.storage.setItem(StorageAdapter.AREA_CURRENT_USER, user.getIdentity());
        if (callback != null) 
            callback();
    };
    prototype.getCurrentUser = function(callback) {
        if (callback != null) 
            callback(this.storage.getItem(StorageAdapter.AREA_CURRENT_USER));
    };
    prototype.storeCurrentBook = function(book) {
        this.storage.setItem(StorageAdapter.AREA_CURRENT_BOOK, book);
    };
    prototype.getCurrentBook = function(callback) {
        if (callback != null) 
            callback(this.storage.getItem(StorageAdapter.AREA_CURRENT_BOOK));
    };
    prototype.saveUserProfile = function(user) {
        this.storage.setItem(user.getIdentity() + StorageAdapter.AREA_PROFILE, user.toString());
    };
    prototype.storeOutgoing = function(user, xapi) {
        this.storeMapRecord(user.getIdentity() + StorageAdapter.AREA_OUTGOING, xapi);
    };
    prototype.clearOutgoing = function(user, toClear) {
        var key = user.getIdentity() + StorageAdapter.AREA_OUTGOING;
        var outgoingMap = XApiUtils.parseXApiMap(this.storage.getItem(key));
        for (var i = 0; i < toClear.length; i++) 
            delete outgoingMap[toClear[i]["id"]];
        this.saveXApisMap(key, outgoingMap);
    };
    prototype.getOutgoing = function(user, callback) {
        var key = user.getIdentity() + StorageAdapter.AREA_OUTGOING;
        var outgoingMap = XApiUtils.parseXApiMap(this.storage.getItem(key));
        var result = this.fromMapToArray(outgoingMap);
        if (callback != null) 
            callback(result);
    };
    prototype.removeMessage = function(user, id, thread) {
        var key = user.getIdentity() + thread;
        var messagesMap = XApiUtils.parseXApiMap(this.storage.getItem(key));
        delete messagesMap[id];
        this.saveXApisMap(key, messagesMap);
    };
    prototype.saveAnnotation = function(user, containerPath, annotation) {
        this.storeMapRecord(user.getIdentity() + containerPath, annotation);
    };
    prototype.saveAnnotations = function(user, containerPath, annotations) {
        var key = user.getIdentity() + containerPath;
        var records = XApiUtils.parseXApiMap(this.storage.getItem(key));
        for (var i = 0; i < annotations.length; i++) {
            var item = annotations[i];
            records[item["id"]] = item;
        }
        this.saveXApisMap(key, records);
    };
    prototype.saveGeneralAnnotation = function(user, containerPath, annotation) {
        this.storeMapRecord(user.getIdentity() + containerPath + "General", annotation);
    };
    prototype.saveGeneralAnnotations = function(user, containerPath, annotations) {
        var key = user.getIdentity() + containerPath + "General";
        var records = XApiUtils.parseXApiMap(this.storage.getItem(key));
        for (var i = 0; i < annotations.length; i++) {
            var item = annotations[i];
            records[item["id"]] = item;
        }
        this.saveXApisMap(key, records);
    };
    prototype.saveEvent = function(user, containerPath, event) {
        this.storeMapRecord(user.getIdentity() + containerPath + StorageAdapter.AREA_EVENTS, event);
    };
    prototype.saveEvents = function(user, containerPath, events) {
        var key = user.getIdentity() + containerPath + StorageAdapter.AREA_EVENTS;
        var records = XApiUtils.parseXApiMap(this.storage.getItem(key));
        for (var i = 0; i < events.length; i++) {
            var item = events[i];
            records[item["id"]] = item;
        }
        this.saveXApisMap(key, records);
    };
    prototype.getEvents = function(user, containerPath, callback) {
        var key = user.getIdentity() + containerPath + StorageAdapter.AREA_EVENTS;
        var eventMap = XApiUtils.parseXApiMap(this.storage.getItem(key));
        var result = this.fromMapToArray(eventMap);
        if (callback != null) 
            callback(result);
    };
    prototype.getAsset = function(id, callback) {};
    prototype.setAsset = function(id, data) {};
    prototype.removeNotification = function(user, id) {};
    prototype.getNotifications = function(user, callback) {};
    prototype.addNotification = function(user, notification) {};
    prototype.getToc = function(user, containerPath, callback) {};
    prototype.removeToc = function(user, containerPath, section, id) {};
    prototype.addToc = function(user, containerPath, data) {};
}, {storage: "Storage"}, {});
var Notification = function(message, payload) {
    TimeSeriesData.call(this);
    this.id = TimeSeriesData.NAMESPACE_NOTIFICATION + payload.id;
    this.timestamp = new Date();
    this.message = message;
    this.payload = payload;
};
Notification = stjs.extend(Notification, TimeSeriesData, [], function(constructor, prototype) {
    constructor.KEY_MESSAGE = "message";
    constructor.KEY_PAYLOAD = "payload";
    prototype.message = null;
    prototype.payload = null;
    prototype.pack = function() {
        var result = {};
        result[Notification.KEY_MESSAGE] = this.message;
        result[Notification.KEY_PAYLOAD] = this.payload;
        return JSON.stringify(result);
    };
    prototype.toObject = function() {
        var result = {};
        result[TimeSeriesData.KEY_XID] = this.id;
        result[Notification.KEY_MESSAGE] = this.message;
        if (this.payload != null) 
            result[Notification.KEY_PAYLOAD] = this.payload.toObject();
        result[TimeSeriesData.KEY_TIMESTAMP] = EcDate.toISOString(this.timestamp);
        return result;
    };
    prototype.toString = function() {
        return JSON.stringify(this.toObject());
    };
}, {payload: "TimeSeriesData", timestamp: "Date"}, {});
var LocalActivityAdapter = function(userManager, storage) {
    this.subscribedThreads = {};
    this.storage = storage;
    this.userManager = userManager;
};
LocalActivityAdapter = stjs.extend(LocalActivityAdapter, null, [ActivityAdapter], function(constructor, prototype) {
    prototype.storage = null;
    prototype.subscribedThreads = null;
    prototype.currentBook = null;
    prototype.previousBook = null;
    prototype.currentActivity = null;
    prototype.sameBook = false;
    prototype.userManager = null;
    prototype.directMessageHandler = null;
    prototype.getThreads = function() {
        return this.subscribedThreads;
    };
    prototype.setDirectMessageHandler = function(directMessageHandler) {
        var laa = this;
        this.directMessageHandler = directMessageHandler;
    };
    prototype.hookDirectMessages = function() {
        var laa = this;
        if (this.userManager.getUser().getIdentity() != "guest") 
            this.subscribedThreads[TimeSeriesData.NAMESPACE_USERNAME + this.userManager.getUser().getIdentity()] = function(incoming) {
                if (laa.directMessageHandler != null) 
                    laa.directMessageHandler(incoming);
            };
    };
    prototype.unsubscribeAll = function() {
        this.subscribedThreads = {};
        this.hookDirectMessages();
    };
    prototype.subscribe = function(thread, callback) {
        this.subscribedThreads[thread] = callback;
    };
    prototype.initializeToc = function(data) {
        var self = this;
        this.storage.getToc(this.userManager.getUser(), this.currentBook, function(toc) {
            if (toc.length == 0) {
                for (var section in data) {
                    var pages = data[section];
                    for (var pageKey in pages) {
                        var pageMetadata = pages[pageKey];
                        if (pageKey == "DynamicContent") {
                            var documents = pageMetadata["documents"];
                            for (var dynamicPageKey in documents) {
                                var documentMetadata = documents[dynamicPageKey];
                                documentMetadata["pageKey"] = dynamicPageKey;
                                documentMetadata["card"] = documentMetadata["card"];
                                documentMetadata["docType"] = documentMetadata["docType"];
                                documentMetadata["documentName"] = documentMetadata["documentName"];
                                documentMetadata["url"] = documentMetadata["url"];
                                documentMetadata["section"] = documentMetadata["section"];
                                documentMetadata["externalURL"] = documentMetadata["externalURL"];
                                self.storage.addToc(self.userManager.getUser(), self.currentBook, documentMetadata);
                            }
                        } else {
                            pageMetadata["pageKey"] = pageKey;
                            pageMetadata["section"] = section;
                            self.storage.addToc(self.userManager.getUser(), self.currentBook, pageMetadata);
                        }
                    }
                }
            }
        });
    };
    prototype.getToc = function(callback) {
        this.storage.getToc(this.userManager.getUser(), this.currentBook, function(entries) {
            var toc = {};
            for (var i = 0; i < entries.length; i++) {
                var entry = entries[i];
                var sectionKey = entry["section"];
                if (toc[sectionKey] == null) {
                    toc[sectionKey] = {};
                }
                var section = toc[sectionKey];
                if (sectionKey == "DynamicContent") {
                    if (section["documents"] == null) {
                        section["location"] = entry["location"];
                        section["documents"] = {};
                    }
                    var dynamicSection = section["documents"];
                    dynamicSection[entry["pageKey"]] = entry;
                } else 
                    section[entry["pageKey"]] = entry;
            }
            if (callback != null) 
                callback(toc);
        });
    };
    prototype.openBook = function(containerPath, callback) {
        var laa = this;
        if (this.previousBook == null) {
            this.storage.getCurrentBook(function(book) {
                laa.previousBook = book;
                laa.sameBook = (laa.currentBook == containerPath);
                laa.previousBook = laa.currentBook;
                laa.currentBook = containerPath;
                laa.storage.storeCurrentBook(containerPath);
                laa.hookDirectMessages();
                if (callback != null) 
                    callback(laa.sameBook);
            });
        } else {
            this.sameBook = (this.currentBook == containerPath);
            this.previousBook = this.currentBook;
            this.currentBook = containerPath;
            laa.storage.storeCurrentBook(containerPath);
            this.hookDirectMessages();
            if (callback != null) 
                callback(this.sameBook);
        }
    };
    prototype.startParentActivity = function(activity) {
        this.currentActivity = activity;
    };
    prototype.clearParentActivity = function() {
        this.currentActivity = null;
    };
    prototype.getParentActivity = function() {
        return this.currentActivity;
    };
    prototype.isSameBook = function() {
        return this.sameBook;
    };
    prototype.getBook = function() {
        return this.currentBook;
    };
}, {storage: "StorageAdapter", subscribedThreads: {name: "Map", arguments: [null, {name: "Callback1", arguments: [{name: "Array", arguments: ["TimeSeriesData"]}]}]}, userManager: "UserAdapter", directMessageHandler: {name: "Callback1", arguments: [{name: "Array", arguments: ["TimeSeriesData"]}]}}, {});
var Quiz = function(o) {
    TimeSeriesData.call(this);
    this.id = o["id"];
    this.timestamp = XApiUtils.getTimestamp(o);
    this.parentActivity = XApiUtils.getParentActivity(o);
    this.actorId = XApiUtils.getActorId(o);
    this.activityId = XApiUtils.getObjectId(o);
    var result = o["result"];
    this.completion = result["completion"];
    this.success = result["success"];
    this.quizId = XApiUtils.getObjectName(o);
    this.quizName = XApiUtils.getObjectDescription(o);
    var scores = result["score"];
    this.min = stjs.trunc(scores["min"]);
    this.max = stjs.trunc(scores["max"]);
    this.raw = stjs.trunc(scores["raw"]);
};
Quiz = stjs.extend(Quiz, TimeSeriesData, [], function(constructor, prototype) {
    prototype.raw = 0;
    prototype.min = 0;
    prototype.max = 0;
    prototype.activityId = null;
    prototype.quizId = null;
    prototype.quizName = null;
    prototype.completion = false;
    prototype.success = false;
    constructor.is = function(record) {
        var verb = XApiUtils.getVerb(record);
        return (verb == "failed") || (verb == "passed");
    };
}, {timestamp: "Date"}, {});
var Annotation = function(o) {
    TimeSeriesData.call(this);
    this.stmt = o;
    var annotationData;
    var dateKey;
    if (o["object"] != null) {
        annotationData = JSON.parse(XApiUtils.getObjectDescription(o));
        dateKey = TimeSeriesData.KEY_TIMESTAMP;
        var temp = XApiUtils.getObjectId(o);
        if (temp.lastIndexOf("/") != -1) 
            this.containerPath = temp.substring(temp.lastIndexOf("/") + 1);
         else 
            this.containerPath = temp;
        this.parentActivity = XApiUtils.getParentActivity(o);
        this.verb = XApiUtils.getVerb(o);
        this.actorId = XApiUtils.getActorId(o);
        this.owner = XApiUtils.getActorId(o);
    } else {
        annotationData = o;
        dateKey = Annotation.KEY_DATE;
        this.containerPath = annotationData[Annotation.KEY_CONTAINER_PATH];
        var parent = annotationData[TimeSeriesData.KEY_PARENT_ACTIVITY];
        if ((parent != null) && (parent != "")) 
            this.parentActivity = parent;
         else 
            this.parentActivity = this.containerPath;
        this.verb = "commented";
        this.owner = "N/A";
    }
    this.id = o[TimeSeriesData.KEY_XID];
    this.annId = stjs.trunc(annotationData[Annotation.KEY_ID]);
    this.type = stjs.trunc(annotationData[Annotation.KEY_TYPE]);
    this.cfi = annotationData[Annotation.KEY_CFI];
    this.idRef = annotationData[Annotation.KEY_IDREF];
    this.title = annotationData[Annotation.KEY_TITLE];
    this.style = stjs.trunc(annotationData[Annotation.KEY_STYLE]);
    this.text = annotationData[Annotation.KEY_TEXT];
    this.timestamp = new Date(o[dateKey]);
};
Annotation = stjs.extend(Annotation, TimeSeriesData, [], function(constructor, prototype) {
    constructor.TYPE_BOOKMARK = 1;
    constructor.TYPE_HIGHLIGHT = 2;
    constructor.TYPE_NOTE = 3;
    constructor.KEY_ID = "AnnID";
    constructor.KEY_TYPE = "Type";
    constructor.KEY_CFI = "CFI";
    constructor.KEY_CONTAINER_PATH = "ContainerPath";
    constructor.KEY_IDREF = "IDRef";
    constructor.KEY_TITLE = "Title";
    constructor.KEY_STYLE = "Style";
    constructor.KEY_TEXT = "Text";
    constructor.KEY_DATE = "Date";
    constructor.KEY_OWNER = "Owner";
    prototype.verb = null;
    prototype.annId = 0;
    prototype.type = 0;
    prototype.cfi = null;
    prototype.containerPath = null;
    prototype.idRef = null;
    prototype.title = null;
    prototype.style = 0;
    prototype.text = null;
    prototype.owner = null;
    prototype.stmt = null;
    prototype.pack = function() {
        var result = {};
        result[Annotation.KEY_ID] = this.annId;
        result[Annotation.KEY_CFI] = this.cfi;
        result[Annotation.KEY_TYPE] = this.type;
        result[Annotation.KEY_IDREF] = this.idRef;
        result[Annotation.KEY_TITLE] = this.title;
        result[Annotation.KEY_STYLE] = this.style;
        result[Annotation.KEY_TEXT] = this.text;
        result[Annotation.KEY_OWNER] = this.owner;
        return JSON.stringify(result);
    };
    prototype.toObject = function() {
        var result = {};
        result[TimeSeriesData.KEY_XID] = this.id;
        result[Annotation.KEY_ID] = this.annId;
        result[Annotation.KEY_CFI] = this.cfi;
        result[Annotation.KEY_TYPE] = this.type;
        result[Annotation.KEY_CONTAINER_PATH] = this.containerPath;
        result[TimeSeriesData.KEY_PARENT_ACTIVITY] = this.parentActivity;
        result[Annotation.KEY_IDREF] = this.idRef;
        result[Annotation.KEY_TITLE] = this.title;
        result[Annotation.KEY_STYLE] = this.style;
        result[Annotation.KEY_TEXT] = this.text;
        result[Annotation.KEY_DATE] = EcDate.toISOString(this.timestamp);
        result[Annotation.KEY_OWNER] = this.owner;
        return result;
    };
    constructor.is = function(record) {
        var verb = XApiUtils.getVerb(record);
        return (verb == "commented");
    };
}, {stmt: {name: "Map", arguments: [null, "Object"]}, timestamp: "Date"}, {});
var Message = function(o) {
    TimeSeriesData.call(this);
    var messageData;
    if (o["object"] != null) {
        messageData = JSON.parse(XApiUtils.getObjectDescription(o));
        var temp = XApiUtils.getObjectId(o);
        if (temp.lastIndexOf("/") != -1) 
            this.thread = temp.substring(temp.lastIndexOf("/") + 1);
         else 
            this.thread = temp;
        this.prompt = XApiUtils.getObjectName(o);
        this.actorId = XApiUtils.getActorId(o);
    } else {
        messageData = o;
        this.thread = messageData[Message.KEY_THREAD];
        this.prompt = messageData[Message.KEY_PROMPT];
        this.actorId = messageData[Message.KEY_USER_ID];
    }
    this.direct = this.thread == TimeSeriesData.NAMESPACE_USERNAME + this.actorId;
    this.id = o[Message.KEY_XID];
    this.text = messageData[Message.KEY_TEXT];
    this.timestamp = new Date(o[Message.KEY_TIMESTAMP]);
};
Message = stjs.extend(Message, TimeSeriesData, [], function(constructor, prototype) {
    constructor.KEY_XID = "id";
    constructor.KEY_TIMESTAMP = "timestamp";
    constructor.KEY_THREAD = "thread";
    constructor.KEY_PROMPT = "prompt";
    constructor.KEY_USER_ID = "userId";
    constructor.KEY_TEXT = "text";
    constructor.KEY_FROM = "from";
    prototype.thread = null;
    prototype.text = null;
    prototype.prompt = null;
    prototype.direct = false;
    prototype.pack = function() {
        var result = {};
        result[Message.KEY_TEXT] = this.text;
        return JSON.stringify(result);
    };
    prototype.toObject = function() {
        var result = {};
        result[Message.KEY_XID] = this.id;
        result[Message.KEY_THREAD] = this.thread;
        result[Message.KEY_PROMPT] = this.prompt;
        result[Message.KEY_TEXT] = this.text;
        result[Message.KEY_USER_ID] = this.actorId;
        result[Message.KEY_TIMESTAMP] = EcDate.toISOString(this.timestamp);
        return result;
    };
    prototype.toString = function() {
        return JSON.stringify(this.toObject());
    };
    constructor.is = function(record) {
        var verb = XApiUtils.getVerb(record);
        return (verb == "responded");
    };
}, {timestamp: "Date"}, {});
var Action = function(o) {
    TimeSeriesData.call(this);
    this.id = o["id"];
    this.timestamp = XApiUtils.getTimestamp(o);
    this.parentActivity = XApiUtils.getParentActivity(o);
    this.actorId = XApiUtils.getActorId(o);
    this.activityId = XApiUtils.getObjectId(o);
    this.action = XApiUtils.getVerb(o);
    if (this.action == "morphed") {
        var name = XApiUtils.getObjectName(o);
        var level = name.substring(0, name.indexOf("-") - 1);
        var competency = name.substring(name.indexOf("-") + 2);
        this.target = level;
        this.type = competency;
    } else if (this.action == "preferred") {
        this.type = XApiUtils.getObjectName(o);
        if (this.type == "link") 
            this.target = XApiUtils.getObjectDescription(o);
         else 
            this.target = "";
    } else {
        this.target = "";
        this.type = "";
    }
};
Action = stjs.extend(Action, TimeSeriesData, [], function(constructor, prototype) {
    prototype.activityId = null;
    prototype.target = null;
    prototype.type = null;
    prototype.action = null;
    prototype.toObject = function() {
        var result = TimeSeriesData.prototype.toObject.call(this);
        result[TimeSeriesData.KEY_ACTIVITY_ID] = this.activityId;
        result[TimeSeriesData.KEY_TARGET] = this.target;
        result[TimeSeriesData.KEY_TYPE] = this.type;
        result[TimeSeriesData.KEY_ACTION] = this.action;
        return result;
    };
    constructor.is = function(record) {
        var verb = XApiUtils.getVerb(record);
        return (verb == "preferred") || (verb == "morphed") || (verb == "interacted");
    };
}, {timestamp: "Date"}, {});
var Session = function(o) {
    TimeSeriesData.call(this);
    this.id = o["id"];
    this.timestamp = XApiUtils.getTimestamp(o);
    this.parentActivity = XApiUtils.getParentActivity(o);
    this.actorId = XApiUtils.getActorId(o);
    this.activityId = XApiUtils.getObjectId(o);
    this.type = XApiUtils.getVerb(o);
    if (this.type == "initialized") {
        this.activityName = XApiUtils.getObjectName(o);
        this.activityDescription = XApiUtils.getObjectDescription(o);
    } else {
        this.activityName = null;
        this.activityDescription = null;
    }
};
Session = stjs.extend(Session, TimeSeriesData, [], function(constructor, prototype) {
    prototype.activityId = null;
    prototype.activityName = null;
    prototype.activityDescription = null;
    prototype.type = null;
    constructor.is = function(record) {
        var verb = XApiUtils.getVerb(record);
        return (verb == "entered") || (verb == "exited") || (verb == "logged-in") || (verb == "logged-out") || (verb == "terminated") || (verb == "initialized");
    };
    prototype.toObject = function() {
        var result = TimeSeriesData.prototype.toObject.call(this);
        result[TimeSeriesData.KEY_ACTIVITY_ID] = this.activityId;
        result[TimeSeriesData.KEY_ACTIVITY_NAME] = this.activityName;
        result[TimeSeriesData.KEY_ACTIVITY_DESCRIPTION] = this.activityDescription;
        result[TimeSeriesData.KEY_TYPE] = this.type;
        return result;
    };
}, {timestamp: "Date"}, {});
var Voided = function(o) {
    TimeSeriesData.call(this);
    this.id = o["id"];
    this.timestamp = XApiUtils.getTimestamp(o);
    this.parentActivity = XApiUtils.getParentActivity(o);
    this.actorId = XApiUtils.getActorId(o);
    this.target = XApiUtils.getObjectId(o);
};
Voided = stjs.extend(Voided, TimeSeriesData, [], function(constructor, prototype) {
    prototype.target = null;
    prototype.toObject = function() {
        var result = TimeSeriesData.prototype.toObject.call(this);
        result[TimeSeriesData.KEY_TARGET] = this.target;
        return result;
    };
    constructor.is = function(record) {
        var verb = XApiUtils.getVerb(record);
        return (verb == "voided");
    };
}, {timestamp: "Date"}, {});
var Navigation = function(o) {
    TimeSeriesData.call(this);
    this.id = o["id"];
    this.timestamp = XApiUtils.getTimestamp(o);
    this.parentActivity = XApiUtils.getParentActivity(o);
    this.actorId = XApiUtils.getActorId(o);
    this.activityId = XApiUtils.getObjectId(o);
    this.type = XApiUtils.getVerb(o);
};
Navigation = stjs.extend(Navigation, TimeSeriesData, [], function(constructor, prototype) {
    prototype.activityId = null;
    prototype.type = null;
    constructor.is = function(record) {
        var verb = XApiUtils.getVerb(record);
        return (verb == "paged-next") || (verb == "paged-prev") || (verb == "paged-jump") || (verb == "interacted") || (verb == "completed");
    };
    prototype.toObject = function() {
        var result = TimeSeriesData.prototype.toObject.call(this);
        result[TimeSeriesData.KEY_ACTIVITY_ID] = this.activityId;
        result[TimeSeriesData.KEY_TYPE] = this.type;
        return result;
    };
}, {timestamp: "Date"}, {});
var Question = function(o) {
    TimeSeriesData.call(this);
    this.id = o["id"];
    this.timestamp = XApiUtils.getTimestamp(o);
    this.parentActivity = XApiUtils.getParentActivity(o);
    this.actorId = XApiUtils.getActorId(o);
    this.activityId = XApiUtils.getObjectId(o);
    var result = o["result"];
    this.completion = result["completion"];
    this.success = result["success"];
    var scores = result["score"];
    this.min = stjs.trunc(scores["min"]);
    this.max = stjs.trunc(scores["max"]);
    this.raw = stjs.trunc(scores["raw"]);
    this.response = result["response"];
    this.prompt = XApiUtils.getObjectName(o);
    var objDef = o["object"];
    objDef = objDef["definition"];
    this.answers = this.getChoices(objDef);
};
Question = stjs.extend(Question, TimeSeriesData, [], function(constructor, prototype) {
    prototype.raw = 0;
    prototype.min = 0;
    prototype.max = 0;
    prototype.activityId = null;
    prototype.completion = false;
    prototype.success = false;
    prototype.answers = null;
    prototype.prompt = null;
    prototype.response = null;
    prototype.getChoice = function(objDef) {
        return (objDef["description"])["en-US"];
    };
    prototype.getChoices = function(objDef) {
        var choices = objDef["choices"];
        var results = [];
        for (var i = 0; i < choices.length; i++) 
            results.push(this.getChoice(choices[i]));
        return results;
    };
    constructor.is = function(record) {
        var verb = XApiUtils.getVerb(record);
        return verb == "answered";
    };
}, {answers: {name: "Array", arguments: [null]}, timestamp: "Date"}, {});
var SharedAnnotation = function(o) {
    TimeSeriesData.call(this);
    this.stmt = o;
    var annotationData;
    var dateKey;
    if (o["object"] != null) {
        annotationData = JSON.parse(XApiUtils.getObjectDescription(o));
        dateKey = TimeSeriesData.KEY_TIMESTAMP;
        var temp = XApiUtils.getObjectId(o);
        if (temp.lastIndexOf("/") != -1) 
            this.containerPath = temp.substring(temp.lastIndexOf("/") + 1);
         else 
            this.containerPath = temp;
        this.parentActivity = XApiUtils.getParentActivity(o);
        this.verb = XApiUtils.getVerb(o);
        this.actorId = XApiUtils.getActorId(o);
        this.owner = XApiUtils.getActorId(o);
    } else {
        annotationData = o;
        dateKey = SharedAnnotation.KEY_DATE;
        this.containerPath = annotationData[SharedAnnotation.KEY_CONTAINER_PATH];
        var parent = annotationData[TimeSeriesData.KEY_PARENT_ACTIVITY];
        if ((parent != null) && (parent != "")) 
            this.parentActivity = parent;
         else 
            this.parentActivity = this.containerPath;
        this.verb = "shared";
        this.owner = "N/A";
    }
    this.id = o[TimeSeriesData.KEY_XID];
    this.annId = stjs.trunc(annotationData[SharedAnnotation.KEY_ID]);
    this.type = stjs.trunc(annotationData[SharedAnnotation.KEY_TYPE]);
    this.cfi = annotationData[SharedAnnotation.KEY_CFI];
    this.idRef = annotationData[SharedAnnotation.KEY_IDREF];
    this.title = annotationData[SharedAnnotation.KEY_TITLE];
    this.style = stjs.trunc(annotationData[SharedAnnotation.KEY_STYLE]);
    this.text = annotationData[SharedAnnotation.KEY_TEXT];
    this.timestamp = new Date(o[dateKey]);
};
SharedAnnotation = stjs.extend(SharedAnnotation, TimeSeriesData, [], function(constructor, prototype) {
    constructor.TYPE_BOOKMARK = 1;
    constructor.TYPE_HIGHLIGHT = 2;
    constructor.TYPE_NOTE = 3;
    constructor.KEY_ID = "AnnID";
    constructor.KEY_TYPE = "Type";
    constructor.KEY_CFI = "CFI";
    constructor.KEY_CONTAINER_PATH = "ContainerPath";
    constructor.KEY_IDREF = "IDRef";
    constructor.KEY_TITLE = "Title";
    constructor.KEY_STYLE = "Style";
    constructor.KEY_TEXT = "Text";
    constructor.KEY_DATE = "Date";
    constructor.KEY_OWNER = "Owner";
    prototype.verb = null;
    prototype.annId = 0;
    prototype.type = 0;
    prototype.cfi = null;
    prototype.containerPath = null;
    prototype.idRef = null;
    prototype.title = null;
    prototype.style = 0;
    prototype.text = null;
    prototype.owner = null;
    prototype.stmt = null;
    prototype.pack = function() {
        var result = {};
        result[SharedAnnotation.KEY_ID] = this.annId;
        result[SharedAnnotation.KEY_CFI] = this.cfi;
        result[SharedAnnotation.KEY_TYPE] = this.type;
        result[SharedAnnotation.KEY_IDREF] = this.idRef;
        result[SharedAnnotation.KEY_TITLE] = this.title;
        result[SharedAnnotation.KEY_STYLE] = this.style;
        result[SharedAnnotation.KEY_TEXT] = this.text;
        result[SharedAnnotation.KEY_OWNER] = this.owner;
        return JSON.stringify(result);
    };
    prototype.toObject = function() {
        var result = {};
        result[TimeSeriesData.KEY_XID] = this.id;
        result[SharedAnnotation.KEY_ID] = this.annId;
        result[SharedAnnotation.KEY_CFI] = this.cfi;
        result[SharedAnnotation.KEY_TYPE] = this.type;
        result[SharedAnnotation.KEY_CONTAINER_PATH] = this.containerPath;
        result[TimeSeriesData.KEY_PARENT_ACTIVITY] = this.parentActivity;
        result[SharedAnnotation.KEY_IDREF] = this.idRef;
        result[SharedAnnotation.KEY_TITLE] = this.title;
        result[SharedAnnotation.KEY_STYLE] = this.style;
        result[SharedAnnotation.KEY_TEXT] = this.text;
        result[SharedAnnotation.KEY_DATE] = EcDate.toISOString(this.timestamp);
        result[SharedAnnotation.KEY_OWNER] = this.owner;
        return result;
    };
    constructor.is = function(record) {
        var verb = XApiUtils.getVerb(record);
        return (verb == "shared");
    };
}, {stmt: {name: "Map", arguments: [null, "Object"]}, timestamp: "Date"}, {});
var Reference = function(o) {
    TimeSeriesData.call(this);
    var messageData;
    if (o["object"] != null) {
        messageData = JSON.parse(XApiUtils.getObjectDescription(o));
        this.actorId = XApiUtils.getActorId(o);
    } else {
        messageData = o;
        this.actorId = o[TimeSeriesData.KEY_ACTOR_ID];
    }
    this.docType = messageData[TimeSeriesData.KEY_DOCTYPE];
    this.location = messageData[Reference.KEY_LOCATION];
    this.card = messageData[Reference.KEY_CARD];
    this.url = messageData[Reference.KEY_URL];
    this.target = messageData[TimeSeriesData.KEY_TARGET];
    this.id = o[TimeSeriesData.KEY_XID];
    this.name = messageData[Reference.KEY_NAME];
    this.externalURL = messageData[Reference.KEY_EXTERNAL_URL];
    this.timestamp = new Date(o[TimeSeriesData.KEY_TIMESTAMP]);
};
Reference = stjs.extend(Reference, TimeSeriesData, [], function(constructor, prototype) {
    constructor.KEY_LOCATION = "location";
    constructor.KEY_CARD = "card";
    constructor.KEY_URL = "url";
    constructor.KEY_NAME = "name";
    constructor.KEY_EXTERNAL_URL = "externalURL";
    prototype.name = null;
    prototype.location = null;
    prototype.card = null;
    prototype.target = null;
    prototype.url = null;
    prototype.docType = null;
    prototype.externalURL = null;
    prototype.pack = function() {
        var result = {};
        result[Reference.KEY_LOCATION] = this.location;
        result[Reference.KEY_CARD] = this.card;
        result[TimeSeriesData.KEY_TARGET] = this.target;
        result[Reference.KEY_URL] = this.url;
        result[TimeSeriesData.KEY_DOCTYPE] = this.docType;
        result[Reference.KEY_NAME] = this.name;
        result[Reference.KEY_EXTERNAL_URL] = this.externalURL;
        return JSON.stringify(result);
    };
    prototype.toObject = function() {
        var result = {};
        result[TimeSeriesData.KEY_XID] = this.id;
        result[Reference.KEY_URL] = this.url;
        result[TimeSeriesData.KEY_ACTOR_ID] = this.actorId;
        result[Reference.KEY_LOCATION] = this.location;
        result[Reference.KEY_CARD] = this.card;
        result[TimeSeriesData.KEY_TARGET] = this.target;
        result[TimeSeriesData.KEY_DOCTYPE] = this.docType;
        result[Reference.KEY_NAME] = this.name;
        result[Reference.KEY_EXTERNAL_URL] = this.externalURL;
        result[TimeSeriesData.KEY_TIMESTAMP] = EcDate.toISOString(this.timestamp);
        return result;
    };
    prototype.toString = function() {
        return JSON.stringify(this.toObject());
    };
    constructor.is = function(record) {
        var verb = XApiUtils.getVerb(record);
        return (verb == "pushed") || (verb == "pulled");
    };
}, {timestamp: "Date"}, {});
var LocalAssetAdapter = function(userManager, storageManager, activityManager) {
    this.queuedResources = new Array();
    this.userManager = userManager;
    this.storageManager = storageManager;
    this.activityManager = activityManager;
    var self = this;
    this.syncAssets = function() {
        if (self.queuedResources.length > 0) 
            self.pull(self.queuedResources.pop());
         else if (self.running) 
            self.pending = setTimeout(self.syncAssets, 500);
    };
    this.startSync();
};
LocalAssetAdapter = stjs.extend(LocalAssetAdapter, null, [AssetAdapter], function(constructor, prototype) {
    prototype.queuedResources = null;
    prototype.userManager = null;
    prototype.storageManager = null;
    prototype.activityManager = null;
    prototype.running = false;
    prototype.pending = null;
    prototype.notificationHook = null;
    prototype.syncAssets = null;
    prototype.startSync = function() {
        this.running = true;
        if (this.pending != null) 
            clearTimeout(this.pending);
        this.syncAssets();
    };
    prototype.stopSync = function() {
        this.running = false;
        if (this.pending != null) 
            clearTimeout(this.pending);
    };
    prototype.setHookCallback = function(callback) {
        this.notificationHook = callback;
    };
    prototype.queue = function(ref) {
        this.queuedResources.push(ref);
    };
    prototype.pull = function(ref) {
        var xmr = new XMLHttpRequest();
        var self = this;
        xmr.onreadystatechange = function() {
            if (xmr.readyState == 4) {
                if (xmr.status >= 200 && xmr.status < 300) {
                    var data = {"content": xmr};
                    self.storageManager.setAsset(ref.url, data);
                    self.storageManager.addNotification(self.userManager.getUser(), new Notification("Success", ref));
                    var tocEntry = {};
                    tocEntry["url"] = ref.url;
                    tocEntry["documentName"] = ref.name;
                    tocEntry["section"] = ref.location;
                    tocEntry["pageKey"] = ref.id;
                    tocEntry["docType"] = ref.docType;
                    tocEntry["card"] = ref.card;
                    tocEntry["externalURL"] = ref.externalURL;
                    self.storageManager.addToc(self.userManager.getUser(), self.activityManager.getBook(), tocEntry);
                    if (self.notificationHook != null) 
                        self.notificationHook(ref);
                } else 
                    self.storageManager.addNotification(self.userManager.getUser(), new Notification("Failed", ref));
                if (self.running) 
                    self.pending = setTimeout(self.syncAssets, 500);
            }
        };
        xmr.open("GET", "https://peblproject.com/registry/api/downloadContent?guid=" + ref.url, true);
        xmr.send();
    };
}, {queuedResources: {name: "Array", arguments: ["Reference"]}, userManager: "UserAdapter", storageManager: "StorageAdapter", activityManager: "ActivityAdapter", pending: "TimeoutHandler", notificationHook: {name: "Callback1", arguments: ["TimeSeriesData"]}, syncAssets: "Callback0"}, {});
var SyncAction = function(endpoint, repeat, userManager, storage, activityManager, assetManager, teacher) {
    this.endpoint = endpoint;
    this.repeat = repeat;
    this.userManager = userManager;
    this.storage = storage;
    this.activityManager = activityManager;
    this.assetManager = assetManager;
    this.teacher = teacher;
    var sa = this;
    this.bookMinePollingCallback = function() {
        var containerPath = sa.activityManager.getBook();
        if (containerPath != null) {
            var lastSynced = sa.endpoint.lastSyncedBooksMine[containerPath];
            if (lastSynced == null) 
                lastSynced = "2017-06-05T21:07:49-07:00";
            sa.pullBookMine(lastSynced, containerPath, sa.teacher);
        } else if (sa.repeat) 
            sa.bookMinePoll = setTimeout(sa.bookMinePollingCallback, 5000);
    };
    this.bookSharedPollingCallback = function() {
        var containerPath = sa.activityManager.getBook();
        if (containerPath != null) {
            var lastSynced = sa.endpoint.lastSyncedBooksShared[containerPath];
            if (lastSynced == null) 
                lastSynced = "2017-06-05T21:07:49-07:00";
            sa.pullBookShared(lastSynced, containerPath);
        } else if (sa.repeat) 
            sa.bookSharedPoll = setTimeout(sa.bookSharedPollingCallback, 5000);
    };
    this.chatPollingCallback = function() {
        var threads = sa.activityManager.getThreads();
        sa.pulledThread = {};
        for (var thread in threads) 
            sa.pulledThread[thread] = false;
        var i = 0;
        for (var thread in threads) {
            i++;
            var lastSynced = sa.endpoint.lastSyncedThreads[thread];
            if (lastSynced == null) 
                lastSynced = "2017-06-05T21:07:49-07:00";
            sa.pullMessages(lastSynced, thread, threads[thread]);
        }
        if ((i == 0) && sa.repeat) 
            sa.chatPoll = setTimeout(sa.chatPollingCallback, 2000);
    };
    this.pull();
};
SyncAction = stjs.extend(SyncAction, null, [], function(constructor, prototype) {
    prototype.bookMinePoll = null;
    prototype.bookSharedPoll = null;
    prototype.chatPoll = null;
    prototype.bookMinePollingCallback = null;
    prototype.bookSharedPollingCallback = null;
    prototype.chatPollingCallback = null;
    prototype.pulledThread = null;
    prototype.endpoint = null;
    prototype.terminated = false;
    prototype.repeat = false;
    prototype.userManager = null;
    prototype.storage = null;
    prototype.activityManager = null;
    prototype.assetManager = null;
    prototype.teacher = false;
    prototype.clearTimeouts = function() {
        if (this.bookMinePoll != null) 
            clearTimeout(this.bookMinePoll);
        this.bookMinePoll = null;
        if (this.bookSharedPoll != null) 
            clearTimeout(this.bookSharedPoll);
        this.bookSharedPoll = null;
        if (this.chatPoll != null) 
            clearTimeout(this.chatPoll);
        this.chatPoll = null;
    };
    prototype.pull = function() {
        this.terminated = false;
        this.clearTimeouts();
        this.bookMinePollingCallback();
        this.bookSharedPollingCallback();
        this.chatPollingCallback();
    };
    prototype.terminate = function() {
        this.terminated = true;
        this.clearTimeouts();
    };
    prototype.pullHelper = function(searchParams, callback) {
        var sa = this;
        ADL.XAPIWrapper.changeConfig(this.endpoint.toConfigObject());
        ADL.XAPIWrapper.getStatements(searchParams, "", function(xhr) {
            if (xhr.readyState == 4) {
                var results = [];
                if (xhr.status == 200) {
                    if (!sa.terminated) {
                        var response = JSON.parse(xhr.responseText);
                        results = (response["statements"]);
                    }
                }
                callback(results);
            }
        });
    };
    prototype.pullMessages = function(lastSynced, thread, callback) {
        var sa = this;
        var params = ADL.XAPIWrapper.searchParams();
        params["activity"] = "peblThread://" + thread;
        params["ascending"] = "true";
        params["since"] = lastSynced;
        params["limit"] = 1500;
        this.pullHelper(params, function(items) {
            var lastSyncedDate = new Date(lastSynced);
            var deleteIds = [];
            var messages = {};
            for (var i = 0; i < items.length; i++) {
                var xapi = items[i];
                var id = xapi["id"];
                if (Message.is(xapi)) 
                    messages[id] = new Message(xapi);
                 else if (Reference.is(xapi)) {
                    var r = new Reference(xapi);
                    sa.assetManager.queue(r);
                    messages[id] = r;
                } else if (Voided.is(xapi)) {
                    var v = new Voided(xapi);
                    deleteIds.push(v.target);
                }
                var temp = new Date(xapi["stored"]);
                if (lastSyncedDate.getTime() < temp.getTime()) 
                    lastSyncedDate = temp;
            }
            sa.storage.postMessages(sa.userManager.getUser(), thread, items);
            for (var x = 0; x < deleteIds.length; x++) {
                var id = deleteIds[x];
                var up = sa.userManager.getUser();
                delete messages[id];
                sa.storage.removeMessage(up, id, thread);
            }
            var cleanMessages = [];
            for (var key in messages) 
                cleanMessages.push(messages[key]);
            XApiUtils.sortNewestTimeSeries(cleanMessages);
            if (lastSyncedDate.getTime() > new Date(lastSynced).getTime()) {
                lastSyncedDate.setMilliseconds(stjs.trunc(lastSyncedDate.getMilliseconds()) + 1);
                sa.endpoint.lastSyncedThreads[thread] = EcDate.toISOString(lastSyncedDate);
                sa.storage.saveUserProfile(sa.userManager.getUser());
            }
            sa.pulledThread[thread] = true;
            if (sa.repeat) {
                var finished = true;
                for (var key in sa.pulledThread) 
                    if (!sa.pulledThread[key]) {
                        finished = false;
                        break;
                    }
                if (finished) 
                    sa.chatPoll = setTimeout(sa.chatPollingCallback, 2000);
            }
            if (callback != null) 
                callback(cleanMessages);
        });
    };
    prototype.pullBookMine = function(lastSynced, containerPath, teacher) {
        var sa = this;
        var params = ADL.XAPIWrapper.searchParams();
        params["activity"] = "pebl://" + containerPath;
        params["since"] = lastSynced;
        params["limit"] = 1500;
        params["ascending"] = "true";
        if (!teacher) 
            params["agent"] = JSON.stringify(sa.userManager.getUser().generateAgent());
        this.pullHelper(params, function(items) {
            var lastSyncedDate = new Date(lastSynced);
            var annotations = [];
            var generalAnnotations = [];
            var events = [];
            var deleteIds = [];
            for (var i = 0; i < items.length; i++) {
                var xapi = items[i];
                if (Annotation.is(xapi)) 
                    annotations.push(xapi);
                 else if (SharedAnnotation.is(xapi)) 
                    generalAnnotations.push(xapi);
                 else if (Voided.is(xapi)) {
                    var v = new Voided(xapi);
                    deleteIds.push(v.target);
                } else 
                    events.push(xapi);
                var temp = new Date(xapi["stored"]);
                if (lastSyncedDate.getTime() < temp.getTime()) 
                    lastSyncedDate = temp;
            }
            sa.storage.saveAnnotations(sa.userManager.getUser(), containerPath, annotations);
            sa.storage.saveGeneralAnnotations(sa.userManager.getUser(), containerPath, generalAnnotations);
            sa.storage.saveEvents(sa.userManager.getUser(), containerPath, events);
            for (var x = 0; x < deleteIds.length; x++) {
                var id = deleteIds[x];
                var up = sa.userManager.getUser();
                sa.storage.removeSharedAnnotation(up, id);
                sa.storage.removeAnnotation(up, id, containerPath);
            }
            if (lastSyncedDate.getTime() > new Date(lastSynced).getTime()) {
                lastSyncedDate.setMilliseconds(stjs.trunc(lastSyncedDate.getMilliseconds()) + 1);
                sa.endpoint.lastSyncedBooksMine[containerPath] = EcDate.toISOString(lastSyncedDate);
                sa.storage.saveUserProfile(sa.userManager.getUser());
            }
            if (sa.repeat) 
                sa.bookMinePoll = setTimeout(sa.bookMinePollingCallback, 5000);
        });
    };
    prototype.pullBookShared = function(lastSynced, containerPath) {
        var sa = this;
        var params = ADL.XAPIWrapper.searchParams();
        params["limit"] = 1500;
        params["since"] = lastSynced;
        params["ascending"] = "true";
        params["verb"] = "http://adlnet.gov/expapi/verbs/shared";
        this.pullHelper(params, function(items) {
            var lastSyncedDate = new Date(lastSynced);
            var deleteIds = [];
            var gaMap = {};
            for (var i = 0; i < items.length; i++) {
                var xapi = items[i];
                if (SharedAnnotation.is(xapi)) {
                    var tempCp = XApiUtils.getObjectId(xapi);
                    var cp;
                    if (tempCp.lastIndexOf("/") != -1) 
                        cp = tempCp.substring(tempCp.lastIndexOf("/") + 1);
                     else 
                        cp = tempCp;
                    if (gaMap[cp] == null) 
                        gaMap[cp] = [];
                    gaMap[cp].push(xapi);
                } else if (Voided.is(xapi)) {
                    var v = new Voided(xapi);
                    deleteIds.push(v.target);
                }
                var temp = new Date(xapi["stored"]);
                if (lastSyncedDate.getTime() < temp.getTime()) 
                    lastSyncedDate = temp;
            }
            for (var cp in gaMap) 
                sa.storage.saveGeneralAnnotations(sa.userManager.getUser(), cp, gaMap[cp]);
            for (var x = 0; x < deleteIds.length; x++) {
                var id = deleteIds[x];
                var up = sa.userManager.getUser();
                sa.storage.removeSharedAnnotation(up, id);
            }
            if (lastSyncedDate.getTime() > new Date(lastSynced).getTime()) {
                lastSyncedDate.setMilliseconds(stjs.trunc(lastSyncedDate.getMilliseconds()) + 1);
                sa.endpoint.lastSyncedBooksShared[containerPath] = EcDate.toISOString(lastSyncedDate);
                sa.storage.saveUserProfile(sa.userManager.getUser());
            }
            if (sa.repeat) 
                sa.bookSharedPoll = setTimeout(sa.bookSharedPollingCallback, 5000);
        });
    };
    prototype.push = function(outgoing, callback) {
        var sa = this;
        if (outgoing == null) 
            outgoing = [];
        ADL.XAPIWrapper.changeConfig(this.endpoint.toConfigObject());
        ADL.XAPIWrapper.sendStatements(outgoing, function(xhr) {
            if (xhr.readyState == 4) {
                var success = xhr.status == 200;
                if (!success) 
                    Debugger.debug(sa.endpoint.url + ", " + xhr.status);
                if (callback != null) 
                    callback(sa.endpoint, success);
            }
        });
    };
}, {bookMinePoll: "TimeoutHandler", bookSharedPoll: "TimeoutHandler", chatPoll: "TimeoutHandler", bookMinePollingCallback: "Callback0", bookSharedPollingCallback: "Callback0", chatPollingCallback: "Callback0", pulledThread: {name: "Map", arguments: [null, null]}, endpoint: "Endpoint", userManager: "UserAdapter", storage: "StorageAdapter", activityManager: "ActivityAdapter", assetManager: "AssetAdapter"}, {});
var LocalNetworkAdapter = function(userManager, storage, activityManager, assetManager, TLAEnabled) {
    this.TLAEnabled = TLAEnabled;
    this.userManager = userManager;
    this.storage = storage;
    this.activityManager = activityManager;
    this.assetManager = assetManager;
    this.repeat = false;
    this.endpointHandlers = [];
    var lna = this;
    ADL.xhrRequestOnError = function(xhr, method, uri, callback, o5) {
        Debugger.debug(xhr.status + ", " + xhr.statusText + ", " + xhr.responseText + ", " + xhr.getAllResponseHeaders());
        if ((xhr.status == 409) && (xhr.statusText == "Conflict")) {
            var payload = xhr.responseText;
            if ((payload.indexOf("ID") != -1) && (payload.indexOf("already") != -1)) {
                var id = payload.substring(payload.indexOf("ID") + "ID ".length, payload.indexOf("already"));
                var toDelete = [];
                var xapi = new ADL.XAPIStatement();
                xapi["id"] = id.trim();
                toDelete.push(xapi);
                lna.storage.clearOutgoing(lna.userManager.getUser(), toDelete);
            }
        }
        if (callback != null) 
            callback(xhr);
    };
};
LocalNetworkAdapter = stjs.extend(LocalNetworkAdapter, null, [NetworkAdapter], function(constructor, prototype) {
    prototype.competencyPolling = null;
    prototype.pushPolling = null;
    prototype.recoveryPolling = null;
    prototype.competencyRequest = null;
    prototype.userManager = null;
    prototype.storage = null;
    prototype.activityManager = null;
    prototype.assetManager = null;
    prototype.endpointHandlers = null;
    prototype.repeat = false;
    prototype.TLAEnabled = false;
    prototype.teacher = false;
    prototype.pullCompetencies = function() {
        var lna = this;
        this.competencyRequest = new XMLHttpRequest();
        this.competencyRequest.onreadystatechange = function() {
            if (lna.competencyRequest.readyState == 4) {
                if (lna.competencyRequest.status == 200) {
                    var result = JSON.parse(lna.competencyRequest.responseText);
                    var collapsed = {};
                    for (var i = 0; i < result.length; i++) {
                        var pair = result[i];
                        var obj = pair[1];
                        var temp = pair[0]["url"];
                        collapsed[temp.substring(0, temp.lastIndexOf("/"))] = obj;
                    }
                    lna.storage.setCompetencies(lna.userManager.getUser(), collapsed);
                }
                if (lna.repeat) 
                    lna.competencyPolling = setTimeout(function() {
                        lna.pullCompetencies();
                    }, 120000);
            }
        };
        this.competencyRequest.open("GET", "https://cass.tla.cassproject.org/api/custom/learner/competency?userId=" + this.userManager.getUser().getIdentity() + "&framework=https%3A%2F%2Fcass.tla.cassproject.org%2Fapi%2Fcustom%2Fdata%2Fschema.cassproject.org.0.2.Framework%2F012e77e0-3a47-4b24-bb12-370a76ac2adc", true);
        this.competencyRequest.send();
    };
    prototype.push = function(finished) {
        var lna = this;
        this.storage.getOutgoing(this.userManager.getUser(), function(outgoing) {
            if (outgoing.length > 0) {
                if (lna.endpointHandlers.length == 1) 
                    lna.endpointHandlers[0].push(outgoing, function(endpoint, success) {
                        if (success) {
                            lna.storage.clearOutgoing(lna.userManager.getUser(), outgoing);
                        }
                        if (lna.repeat) 
                            lna.pushPolling = setTimeout(function() {
                                lna.push(null);
                            }, 5000);
                        if (finished != null) 
                            finished();
                    });
            } else {
                if (lna.repeat) {
                    lna.pushPolling = setTimeout(function() {
                        lna.push(null);
                    }, 5000);
                }
                if (finished != null) 
                    finished();
            }
        });
    };
    prototype.activate = function(teacher) {
        this.teacher = teacher;
        for (var i = 0; i < this.endpointHandlers.length; i++) 
            this.endpointHandlers[i].terminate();
        this.endpointHandlers = [];
        if (this.TLAEnabled) {
            if (this.competencyRequest != null) 
                this.competencyRequest.abort();
            if (this.competencyPolling != null) {
                clearTimeout(this.competencyPolling);
                this.competencyPolling = null;
            }
        }
        if (this.pushPolling != null) {
            clearTimeout(this.pushPolling);
            this.pushPolling = null;
        }
        this.repeat = true;
        var endpoints = this.userManager.getUser().getLrsUrls();
        for (var key in endpoints) 
            this.endpointHandlers.push(new SyncAction(endpoints[key], true, this.userManager, this.storage, this.activityManager, this.assetManager, teacher));
        if (this.TLAEnabled) 
            this.pullCompetencies();
        this.push(null);
    };
    prototype.disable = function(finished) {
        var lna = this;
        this.repeat = false;
        if (this.TLAEnabled) {
            if (this.competencyRequest != null) 
                this.competencyRequest.abort();
            if (this.competencyPolling != null) {
                clearTimeout(this.competencyPolling);
                this.competencyPolling = null;
            }
        }
        if (this.pushPolling != null) {
            clearTimeout(this.pushPolling);
            this.pushPolling = null;
        }
        this.push(function() {
            for (var i = 0; i < lna.endpointHandlers.length; i++) 
                lna.endpointHandlers[i].terminate();
            lna.endpointHandlers = [];
            lna.activityManager.unsubscribeAll();
            if (finished != null) 
                finished();
        });
    };
}, {competencyPolling: "TimeoutHandler", pushPolling: "TimeoutHandler", recoveryPolling: "TimeoutHandler", competencyRequest: "XMLHttpRequest", userManager: "UserAdapter", storage: "StorageAdapter", activityManager: "ActivityAdapter", assetManager: "AssetAdapter", endpointHandlers: {name: "Array", arguments: ["SyncAction"]}}, {});
/**
 *  @author aaron.veden@eduworks.com
 */
var PEBL = function() {};
PEBL = stjs.extend(PEBL, null, [], function(constructor, prototype) {
    prototype.storage = null;
    prototype.userManager = null;
    prototype.activityManager = null;
    prototype.networkManager = null;
    prototype.launcherManager = null;
    prototype.xapiGenerator = null;
    prototype.assetManager = null;
    prototype.teacher = false;
    prototype.loaded = false;
    prototype.directMessageHandler = null;
    constructor.TLAEnabled = false;
    constructor.start = function(teacher, callback, inRegistry) {
        var pebl = new PEBL();
        pebl.loaded = false;
        pebl.teacher = teacher;
        if (window.PEBLNative != null) {
            Debugger.debug("found native");
            pebl.storage = window.PEBLNative.storage;
            pebl.userManager = window.PEBLNative.userManager;
            pebl.activityManager = window.PEBLNative.activityManager;
            if (PEBL.TLAEnabled) 
                pebl.launcherManager = window.PEBLNative.launcherManager;
            pebl.networkManager = window.PEBLNative.networkManager;
            pebl.assetManager = window.PEBLNative.assetManager;
            pebl.xapiGenerator = new XApiGenerator(pebl.userManager, pebl.storage, pebl.activityManager);
            window.Lightbox.initDefaultLRSSettings();
            callback(pebl);
        } else {
            Debugger.debug("created pebl libraries");
            if (inRegistry != null && inRegistry) {
                IndexedDBStorageAdapterExists = false;
                Debugger.debug("in registry");
            }
            if (IndexedDBStorageAdapterExists == true) 
                pebl.storage = new IndexedDBStorageAdapter(function() {
                    PEBL.finishBootSequence(pebl, callback);
                });
             else {
                if (localStorage != null) 
                    pebl.storage = new KeyValueStorageAdapter(localStorage);
                 else if (sessionStorage != null) 
                    pebl.storage = new KeyValueStorageAdapter(sessionStorage);
                 else 
                    pebl.storage = new InMemoryStorageAdapter(localStorage);
                PEBL.finishBootSequence(pebl, callback);
            }
        }
    };
    constructor.finishBootSequence = function(pebl, callback) {
        if (pebl.storage != null) {
            if (PEBL.TLAEnabled) 
                pebl.userManager = new OpenIDUserAdapter(pebl.storage);
             else 
                pebl.userManager = new LLUserAdapter(pebl.storage);
            pebl.activityManager = new LocalActivityAdapter(pebl.userManager, pebl.storage);
            pebl.xapiGenerator = new XApiGenerator(pebl.userManager, pebl.storage, pebl.activityManager);
            if (PEBL.TLAEnabled) 
                pebl.launcherManager = new LocalLauncherAdapter(pebl.userManager);
            pebl.assetManager = new LocalAssetAdapter(pebl.userManager, pebl.storage, pebl.activityManager);
            pebl.networkManager = new LocalNetworkAdapter(pebl.userManager, pebl.storage, pebl.activityManager, pebl.assetManager, PEBL.TLAEnabled);
            pebl.loaded = true;
            window.Lightbox.initDefaultLRSSettings();
            callback(pebl);
        }
    };
    prototype.login = function(loggedIn) {
        var self = this;
        if ((this.userManager != null) && (!this.userManager.loggedIn())) {
            this.userManager.login(function() {
                if (!self.userManager.isSameUser()) 
                    self.xapiGenerator.login();
                if (self.userManager.loggedIn()) {
                    self.networkManager.activate(self.teacher);
                    if (PEBL.TLAEnabled) 
                        self.launcherManager.connect();
                    self.activityManager.hookDirectMessages();
                }
                if (loggedIn != null) 
                    loggedIn();
            });
        } else if (loggedIn != null) 
            loggedIn();
    };
    prototype.loginAsUser = function(username, password, loggedIn) {
        var self = this;
        if ((this.userManager != null) && (!this.userManager.loggedIn())) {
            this.userManager.loginAsUser(username, password, function() {
                if (!self.userManager.isSameUser()) 
                    self.xapiGenerator.login();
                if (self.userManager.loggedIn()) {
                    self.networkManager.activate(self.teacher);
                    if (PEBL.TLAEnabled) 
                        self.launcherManager.connect();
                    self.activityManager.hookDirectMessages();
                }
                if (loggedIn != null) 
                    loggedIn();
            });
        }
    };
    prototype.logout = function() {
        if (this.userManager != null) {
            this.xapiGenerator.logout();
            var self = this;
            this.networkManager.disable(function() {
                if (PEBL.TLAEnabled) 
                    self.launcherManager.close();
                self.userManager.logout();
            });
        }
    };
    prototype.eventChecklisted = function(checklistId, checklistUser, checklistPrompts, checklistResponses) {
        this.xapiGenerator.checklisted(checklistId, checklistUser, checklistPrompts, checklistResponses);
    };
    prototype.eventCompatibilityTested = function(eReaderName, osName, osVersion, browserName, browserVersion, userAgent, appVersion, platform, vendor, loginResult, localStorageResult, indexedDBResult, discussionResult, contentMorphingResult, figureResult, popoutResult, hotwordResult, quizResult, showHideResult) {
        this.xapiGenerator.compatibilityTested(eReaderName, osName, osVersion, browserName, browserVersion, userAgent, appVersion, platform, vendor, loginResult, localStorageResult, indexedDBResult, discussionResult, contentMorphingResult, figureResult, popoutResult, hotwordResult, quizResult, showHideResult);
    };
    prototype.eventCompleted = function(activity, description) {
        this.xapiGenerator.completed(this.activityManager.getParentActivity(), activity, description);
    };
    prototype.eventNextPage = function(firstVisibleCFI, lastVisibleCFI) {
        this.xapiGenerator.nextPage(new Page(firstVisibleCFI, lastVisibleCFI));
    };
    prototype.eventPrevPage = function(firstVisibleCFI, lastVisibleCFI) {
        this.xapiGenerator.prevPage(new Page(firstVisibleCFI, lastVisibleCFI));
    };
    prototype.eventPassed = function(score, activity, description) {
        this.xapiGenerator.passed(score, activity, description);
    };
    prototype.eventFailed = function(score, activity, description) {
        this.xapiGenerator.failed(score, activity, description);
    };
    prototype.eventAnswered = function(prompt, answers, answer, correct, done) {
        this.xapiGenerator.answered(prompt, answers, answer, correct, done);
    };
    prototype.eventPreferred = function(target, type) {
        this.xapiGenerator.preferred(target, type);
    };
    prototype.eventContentMorphed = function(level, competency, cfi) {
        this.xapiGenerator.morphed(level, competency, cfi);
    };
    prototype.eventStartSession = function() {
        this.xapiGenerator.startSession();
    };
    prototype.eventEndSession = function() {
        this.xapiGenerator.endSession();
        if (this.userManager.loggedIn()) 
            this.networkManager.push(null);
    };
    prototype.getUserName = function() {
        return this.userManager.getUser().getName();
    };
    prototype.shareAnnotation = function(rawAnnotation) {
        var user = this.userManager.getUser();
        if (user.getName().equals("guest")) 
            return;
        var annotation = new Annotation(rawAnnotation);
        var parentActivity = this.activityManager.getParentActivity();
        var stmt = new ADL.XAPIStatement(new ADL.XAPIStatement.Agent(user.generateAgent(), user.getName()), new ADL.XAPIStatement.Verb("http://adlnet.gov/expapi/verbs/shared", "shared"), new ADL.XAPIStatement.Activity("pebl://" + annotation.containerPath, null, annotation.pack()));
        stmt.generateId();
        stmt["timestamp"] = EcDate.toISOString(annotation.timestamp);
        var containerPath = "pebl://" + annotation.containerPath;
        if ((parentActivity != null) && (parentActivity != "")) 
            containerPath = parentActivity;
        stmt.addParentActivity(new ADL.XAPIStatement.Activity(containerPath, null, null));
        this.storage.storeOutgoing(user, stmt);
    };
    prototype.openBook = function(containerPath, callback) {
        if (containerPath.lastIndexOf("/") != -1) 
            containerPath = containerPath.substring(containerPath.lastIndexOf("/") + 1);
        if (this.activityManager.getBook() != containerPath) {
            this.xapiGenerator.terminated();
        }
        var p = this;
        this.activityManager.openBook(containerPath, function(sameBook) {
            if (!sameBook) {
                p.activityManager.clearParentActivity();
                p.xapiGenerator.interacted();
                p.xapiGenerator.initialized(null, null);
            } else {
                if (window.ReadiumInterop != null) 
                    p.xapiGenerator.jumpedPage(Page.fromMap(window.ReadiumInterop.getFirstAndLastVisibleCFI()));
            }
            if (callback != null) 
                callback();
        });
        this.unsubscribeAll();
    };
    prototype.startActivity = function(activity, name, description) {
        if (activity == null) 
            activity = "";
        if (this.activityManager.getParentActivity() != activity) {
            if ((this.activityManager.getParentActivity() != null) && (this.activityManager.getParentActivity() != "")) 
                this.xapiGenerator.terminated();
            this.activityManager.startParentActivity(activity);
            if (activity != "") 
                this.xapiGenerator.initialized(name, description);
            this.unsubscribeAll();
        }
    };
    prototype.initializeToc = function(initialToc) {
        this.activityManager.initializeToc(initialToc);
    };
    prototype.removeToc = function(id, section) {
        this.storage.removeToc(this.userManager.getUser(), this.activityManager.getBook(), section, id);
    };
    prototype.getToc = function(callback) {
        this.activityManager.getToc(callback);
    };
    prototype.postMessage = function(rawMessage) {
        var up = this.userManager.getUser();
        if (up.getName().equals("guest")) 
            return;
        rawMessage[Message.KEY_USER_ID] = this.userManager.getUser().getIdentity();
        var message = new Message(rawMessage);
        var xapi = new ADL.XAPIStatement(this.userManager.getUser().generateAgent(), new ADL.XAPIStatement.Verb("http://adlnet.gov/expapi/verbs/responded", "responded"), new ADL.XAPIStatement.Activity("peblThread://" + message.thread, message.prompt, message.pack()));
        xapi.generateId();
        xapi["timestamp"] = message.timestamp;
        var containerPath = "pebl://" + this.activityManager.getBook();
        var parentActivity = this.activityManager.getParentActivity();
        if ((parentActivity != null) && (parentActivity != "")) 
            containerPath = parentActivity;
        xapi.addParentActivity(new ADL.XAPIStatement.Activity(containerPath, null, null));
        this.storage.postMessage(this.userManager.getUser(), message.thread, xapi);
        this.storage.storeOutgoing(this.userManager.getUser(), xapi);
    };
    prototype.removeNotification = function(id) {
        this.storage.removeNotification(this.userManager.getUser(), id);
    };
    prototype.setNotificationHook = function(callback) {
        this.activityManager.setDirectMessageHandler(callback);
    };
    prototype.getNotifications = function(callback) {
        this.storage.getNotifications(this.userManager.getUser(), callback);
    };
    prototype.removeMessage = function(id, thread) {
        var up = this.userManager.getUser();
        if (up.getName().equals("guest")) 
            return;
        var user = this.userManager.getUser();
        var parentActivity = this.activityManager.getParentActivity();
        var stmt = new ADL.XAPIStatement(new ADL.XAPIStatement.Agent(user.generateAgent(), user.getName()), new ADL.XAPIStatement.Verb("http://adlnet.gov/expapi/verbs/voided", "voided"), new ADL.XAPIStatement.StatementRef(id));
        XApiUtils.addTimestamp(stmt);
        var containerPath = "peblThread://" + thread;
        if ((parentActivity != null) && (parentActivity != "")) 
            containerPath = parentActivity;
        stmt.addParentActivity(new ADL.XAPIStatement.Activity(containerPath, null, null));
        this.storage.storeOutgoing(user, stmt);
        this.storage.removeMessage(this.userManager.getUser(), id, thread);
    };
    prototype.unsubscribeAll = function() {
        this.activityManager.unsubscribeAll();
    };
    prototype.subscribeToDiscussion = function(thread, callback) {
        this.activityManager.subscribe(thread, function(packets) {
            var result = [];
            for (var i = 0; i < packets.length; i++) 
                result.push(packets[i].toObject());
            if (callback != null) 
                callback(result);
        });
        this.getMessages(thread, function(incoming) {
            if (callback != null) 
                callback(incoming);
        });
    };
    prototype.getMessages = function(thread, callback) {
        this.storage.getMessages(this.userManager.getUser(), thread, function(raw) {
            var result = [];
            for (var i = 0; i < raw.length; i++) 
                result.push(new Message(raw[i]).toObject());
            if (callback != null) 
                callback(result);
        });
    };
    prototype.getGeneralAnnotations = function(containerPath, callback) {
        this.storage.getGeneralAnnotations(this.userManager.getUser(), containerPath, function(raw) {
            var result = [];
            for (var i = 0; i < raw.length; i++) {
                result.push(new SharedAnnotation(raw[i]).toObject());
            }
            if (callback != null) 
                callback(result);
        });
    };
    prototype.getEvents = function(containerPath, callback) {
        this.storage.getGeneralAnnotations(this.userManager.getUser(), containerPath, function(raw) {
            var result = [];
            for (var i = 0; i < raw.length; i++) {
                var xapi = raw[i];
                if (Action.is(xapi)) 
                    result.push(new Action(xapi).toObject());
                 else if (Navigation.is(xapi)) 
                    result.push(new Navigation(xapi).toObject());
                 else if (Session.is(xapi)) 
                    result.push(new Session(xapi).toObject());
            }
            if (callback != null) 
                callback(result);
        });
    };
    prototype.getCompetencies = function(callback) {
        this.storage.getCompetencies(this.userManager.getUser(), function(competencies) {
            if (callback != null) 
                callback(competencies);
        });
    };
    prototype.getAnnotations = function(containerPath, callback) {
        this.storage.getAnnotations(this.userManager.getUser(), containerPath, function(raw) {
            var result = [];
            for (var i = 0; i < raw.length; i++) 
                result.push(new Annotation(raw[i]).toObject());
            if (callback != null) 
                callback(result);
        });
    };
    prototype.postHarnessMessage = function(target, id, data) {
        if (window.ReadiumInterop != null) {
            var pack = [id, data];
            window.ReadiumInterop.postHarnessMessage(target, pack);
        }
    };
    prototype.getAsset = function(id, callback) {
        this.storage.getAsset(id, callback);
    };
    prototype.addAnnotation = function(annotationJSON) {
        var up = this.userManager.getUser();
        if (up.getName().equals("guest")) 
            return null;
        annotationJSON[Annotation.KEY_PARENT_ACTIVITY] = this.activityManager.getParentActivity();
        var annotation = new Annotation(annotationJSON);
        var xapi = new ADL.XAPIStatement(this.userManager.getUser().generateAgent(), new ADL.XAPIStatement.Verb("http://adlnet.gov/expapi/verbs/commented", "commented"), new ADL.XAPIStatement.Activity("pebl://" + annotation.containerPath, "", annotation.pack()));
        xapi.generateId();
        xapi["timestamp"] = EcDate.toISOString(annotation.timestamp);
        var containerPath = "pebl://" + annotation.containerPath;
        var parentActivity = this.activityManager.getParentActivity();
        if ((parentActivity != null) && (parentActivity != "")) 
            containerPath = parentActivity;
        xapi.addParentActivity(new ADL.XAPIStatement.Activity(containerPath, null, null));
        this.storage.storeOutgoing(this.userManager.getUser(), xapi);
        this.storage.saveAnnotation(this.userManager.getUser(), annotation.containerPath, xapi);
        return xapi["id"];
    };
    prototype.removeSharedAnnotation = function(rawAnnotation) {
        var up = this.userManager.getUser();
        if (up.getName().equals("guest")) 
            return;
        var annotation = new SharedAnnotation(rawAnnotation);
        var user = this.userManager.getUser();
        var parentActivity = this.activityManager.getParentActivity();
        var stmt = new ADL.XAPIStatement(new ADL.XAPIStatement.Agent(user.generateAgent(), user.getName()), new ADL.XAPIStatement.Verb("http://adlnet.gov/expapi/verbs/voided", "voided"), new ADL.XAPIStatement.StatementRef(annotation.id));
        XApiUtils.addTimestamp(stmt);
        var containerPath = "pebl://" + annotation.containerPath;
        if ((parentActivity != null) && (parentActivity != "")) 
            containerPath = parentActivity;
        stmt.addParentActivity(new ADL.XAPIStatement.Activity(containerPath, null, null));
        this.storage.storeOutgoing(user, stmt);
        this.storage.removeSharedAnnotation(user, annotation.id);
    };
    prototype.removeAnnotation = function(rawAnnotation) {
        var up = this.userManager.getUser();
        if (up.getName().equals("guest")) 
            return;
        var annotation = new Annotation(rawAnnotation);
        var user = this.userManager.getUser();
        var parentActivity = this.activityManager.getParentActivity();
        var stmt = new ADL.XAPIStatement(new ADL.XAPIStatement.Agent(user.generateAgent(), user.getName()), new ADL.XAPIStatement.Verb("http://adlnet.gov/expapi/verbs/voided", "voided"), new ADL.XAPIStatement.StatementRef(annotation.id));
        XApiUtils.addTimestamp(stmt);
        var containerPath = "pebl://" + annotation.containerPath;
        if ((parentActivity != null) && (parentActivity != "")) 
            containerPath = parentActivity;
        stmt.addParentActivity(new ADL.XAPIStatement.Activity(containerPath, null, null));
        this.storage.storeOutgoing(user, stmt);
        this.storage.removeAnnotation(user, annotation.id, annotation.containerPath);
    };
    prototype.debugLog = function() {
        return Debugger.logs;
    };
}, {storage: "StorageAdapter", userManager: "UserAdapter", activityManager: "ActivityAdapter", networkManager: "NetworkAdapter", launcherManager: "LauncherAdapter", xapiGenerator: "XApiGenerator", assetManager: "AssetAdapter", directMessageHandler: {name: "Callback1", arguments: [{name: "Array", arguments: [{name: "Map", arguments: [null, "Object"]}]}]}}, {});
