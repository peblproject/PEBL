
/* normalize environment calls */
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"};
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

window.IndexedDBStorageAdapterExists = window.indexedDB != null;

function iOS() {

  var iDevices = [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ];

  if (!!navigator.platform) {
    while (iDevices.length) {
      if (navigator.platform === iDevices.pop()){ return true; }
    }
  }

  return false;
}

var isIOS = iOS();

/* constants */
var MASTER_INDEX = "master";
var CURRENT_BOOK = "peblCurrentBook";
var CURRENT_USER = "peblCurrentUser";
var VERB_INDEX = "verbs";

function getAll(index, query, callback) {
    var request;
    var result;

    if (index.getAll)
	request = index.getAll(query);
    else {
	result = [];
	request = index.openCursor(query);
    }
    
    request.onerror = function (e) {
	//console.log(e);
    };
    request.onsuccess = function (e) {
	var r = e.target.result;
	if (result) {
	    if (r) {
		result.push(r.value);
		r.continue();
	    } else if (callback != null)
		callback(result);
	} else {
	    if (callback != null) {
		if (r != null)
		    callback(r);
		else
		    callback([]);
	    }
	}
    };
}

function cleanRecord(r) {
    var recordType = typeof(r);
    if (recordType == "object") {
	for (var p in r)
	    if (r.hasOwnProperty(p)) {
		var v = r[p];
		var t = typeof(v);
		if (t == "function")
		    delete r[p];
		else if (t == "array")
		    for (var i = 0; i < v.length; i++)
			cleanRecord(v[i]);
		else if (t == "object")
		    cleanRecord(v);
	    }
    } else if (recordType == "array")
	for (var i = 0; i < r.length; i++)
	    cleanRecord(r[i]);
    return r;
}

/* stjs IndexedDBInterop implemention */

window.IndexedDBInterop = function (readyCallback) {
    var self = this;
    var request = window.indexedDB.open("pebl", 7);

    request.onupgradeneeded = function (event) {
	var db = event.target.result;

	var objectStores = db.objectStoreNames;
	for (var i = 0; i < objectStores.length; i++)
	    db.deleteObjectStore(objectStores[i]);
	
	var eventStore = db.createObjectStore("events", {keyPath:"id"});
	var annotationStore = db.createObjectStore("annotations", {keyPath:"id"});
	var competencyStore = db.createObjectStore("competencies", {keyPath:["url","identity"]});
	var generalAnnotationStore = db.createObjectStore("generalAnnotations", {keyPath:"id"});
	var outgoingStore = db.createObjectStore("outgoing", {keyPath:["identity", "id"]});
	var messageStore = db.createObjectStore("messages", {keyPath:"id"});
	var userStore = db.createObjectStore("user", {keyPath:"identity"});
	var stateStore = db.createObjectStore("state", {keyPath:"id"});
	var assetStore = db.createObjectStore("assets", {keyPath:"id"});
	var notificationStore = db.createObjectStore("notifications", {keyPath:["identity", "id"]});
	var tocStore = db.createObjectStore("tocs", { keyPath:["identity", "containerPath", "section", "pageKey"] });

	eventStore.createIndex(MASTER_INDEX, ["identity", "containerPath"]);
	annotationStore.createIndex(MASTER_INDEX, ["identity", "containerPath"]);
	competencyStore.createIndex(MASTER_INDEX, ["identity"]);
	generalAnnotationStore.createIndex(MASTER_INDEX, ["containerPath"]);
	outgoingStore.createIndex(MASTER_INDEX, ["identity"]);
	messageStore.createIndex(MASTER_INDEX, ["identity", "thread"]);
	notificationStore.createIndex(MASTER_INDEX, ["identity"]);
	tocStore.createIndex(MASTER_INDEX, ["identity", "containerPath"]);
    };

    
    request.onsuccess = function (event) {
	self.db = event.target.result;
	
	readyCallback();
    };
    
    request.onerror = function (event) {
	// readyCallback(false, event.target.errorCode);
    };

};

window.IndexedDBInterop.prototype.getAnnotations = function (user, containerPath, callback) {
    var os = this.db.transaction(["annotations"], "readonly").objectStore("annotations");
    var index = os.index(MASTER_INDEX);
    getAll(index,
	   window.IDBKeyRange.only([user.identity, containerPath]),
	   callback);
};

window.IndexedDBInterop.prototype.storeCurrentUser = function(user, callback) {
    var pack = { id : CURRENT_USER,
		 value : user.identity };
    var request = this.db.transaction(["state"], "readwrite").objectStore("state").put(cleanRecord(pack));
    request.onerror = function (e) {
	//console.log(e);
    };
    request.onsuccess = function (e) {
	if (callback != null)
	    callback();
    };
};

window.IndexedDBInterop.prototype.getCurrentUser = function(callback) {
    var request = this.db.transaction(["state"], "readonly").objectStore("state").get(CURRENT_USER);
    request.onerror = function (e) {
	//console.log(e);
    };
    request.onsuccess = function (e) {
	var r = e.target.result;
	if (r != null)
	    callback(r.value);
	else
	    callback(null);
    };
};

window.IndexedDBInterop.prototype.storeCurrentBook = function(book) {
    var pack = { value : book,
		 id : CURRENT_BOOK };
    var request = this.db.transaction(["state"], "readwrite").objectStore("state").put(cleanRecord(pack));
    request.onerror = function (e) {
	//console.log(e);
    };
    request.onsuccess = function (e) {
	//console.log(e);
    };
};

window.IndexedDBInterop.prototype.getCurrentBook = function(callback) {
    var request = this.db.transaction(["state"], "readonly").objectStore("state").get(CURRENT_BOOK);
    request.onerror = function (e) {
	//console.log(e);
    };
    request.onsuccess = function (e) {
	var r = e.target.result;
	if (callback != null) {
	    if (r != null)
		callback(r.value);
	    else
		callback("");
	}
    };
};

window.IndexedDBInterop.prototype.saveEvent = function(user, containerPath, event) {
    var request = this.db.transaction(["events"], "readwrite").objectStore("events").add(cleanRecord(event));
    request.onerror = function (e) {
	//console.log(e);
    };
    request.onsuccess = function (e) {
	//console.log(e);
    };    
};

window.IndexedDBInterop.prototype.saveEvents = function(user, containerPath, events) {
    var objectStore = this.db.transaction(["events"], "readwrite").objectStore("events");
    var callback = function () {
	if (events.length > 0) {
	    var record = events.pop();
	    record.identity = user.identity;
	    record.containerPath = containerPath;
	    var request = objectStore.put(cleanRecord(record));
	    request.onerror = callback;
	    request.onsuccess = callback;
	}
    };
    callback();
};

window.IndexedDBInterop.prototype.getEvents = function(user, containerPath, callback) {
    var os = this.db.transaction(["events"], "readonly").objectStore("events");
    var index = os.index(MASTER_INDEX);
    getAll(index,
	   window.IDBKeyRange.only([user.identity, containerPath]),
	   callback);
};

window.IndexedDBInterop.prototype.getCompetencies = function(user, callback) {
    var os = this.db.transaction(["competencies"], "readonly").objectStore("competencies");
    var index = os.index(MASTER_INDEX);
    var param = isIOS ? user.identity : [user.identity];
    getAll(index,
	   window.IDBKeyRange.only(param),
	   callback);
};

window.IndexedDBInterop.prototype.setCompetencies = function(user, competenciesMap) {
    var os = this.db.transaction(["competencies"], "readwrite").objectStore("competencies");
    var competencies = [];
    for (var p in competenciesMap) {
	if (competenciesMap.hasOwnProperty(p)) {
	    var c = competenciesMap[p];
	    c.url = p;
	    c.identity = user.identity;
	    competencies.push(c);
	}
    }
    var callback = function () {
	if (competencies.length > 0) {
	    var record = competencies.pop();
	    var request = os.put(cleanRecord(record));
	    request.onerror = callback;
	    request.onsuccess = callback;
	}
    };
    callback();    
};

window.IndexedDBInterop.prototype.storeOutgoing = function(user, xapi) {
    xapi.identity = user.identity;
    var request = this.db.transaction(["outgoing"], "readwrite").objectStore("outgoing").put(cleanRecord(xapi));
    request.onerror = function (e) {
	//console.log(e);
    };
    request.onsuccess = function (e) {
	//console.log(e);
    };        
};

window.IndexedDBInterop.prototype.postMessage = function(user, thread, message) {
    message.identity = user.identity;
    message.thread = thread;
    var request = this.db.transaction(["messages"], "readwrite").objectStore("messages").put(cleanRecord(message));
    request.onerror = function (e) {
	//console.log(e);
    };
    request.onsuccess = function (e) {
	//console.log(e);
    };    
};

window.IndexedDBInterop.prototype.postMessages = function(user, thread, messages) {
    var objectStore = this.db.transaction(["messages"], "readwrite").objectStore("messages");
    var callback = function () {
	if (messages.length > 0) {
	    var record = messages.pop();
	    record.identity = user.identity;
	    record.thread = thread;
	    var request = objectStore.put(cleanRecord(record));
	    request.onerror = callback;
	    request.onsuccess = callback;
	}
    };
    callback();
};

window.IndexedDBInterop.prototype.addNotification = function(user, notification) {
    notification.identity = user.identity;
    var request = this.db.transaction(["notifications"], "readwrite").objectStore("notifications").put(cleanRecord(notification));
    request.onerror = function (e) {
	//console.log(e);
    };
    request.onsuccess = function (e) {
	//console.log(e);
    };    
};

window.IndexedDBInterop.prototype.getNotifications = function(user, callback) {
    var os = this.db.transaction(["notifications"], "readonly").objectStore("notifications");
    var index = os.index(MASTER_INDEX);
    var param = isIOS ? user.identity : [user.identity];
    getAll(index,
	   window.IDBKeyRange.only(param),
	   callback);
};

window.IndexedDBInterop.prototype.removeNotification = function(user, id) {
    var request = this.db.transaction(["notifications"], "readwrite").objectStore("notifications").delete(window.IDBKeyRange.only([user.identity, id]));
    request.onerror = function (e) {
	//console.log(e);
    };
    request.onsuccess = function (e) {
	//console.log(e);
    };
};

window.IndexedDBInterop.prototype.removeToc = function(user, containerPath, section, id) {
    var request = this.db.transaction(["tocs"], "readwrite").objectStore("tocs").delete(window.IDBKeyRange.only([user.identity, containerPath, section, id]));
    request.onerror = function (e) {
	//console.log(e);
    };
    request.onsuccess = function (e) {
	//console.log(e);
    };    
};

window.IndexedDBInterop.prototype.addToc = function(user, containerPath, data) {
    data.identity = user.identity;
    data.containerPath = containerPath;
    var request = this.db.transaction(["tocs"], "readwrite").objectStore("tocs").put(cleanRecord(data));
    request.onerror = function (e) {
	//console.log(e);
    };
    request.onsuccess = function (e) {
	//console.log(e);
    };    
};

window.IndexedDBInterop.prototype.getToc = function(user, containerPath, callback) {
    var os = this.db.transaction(["tocs"], "readonly").objectStore("tocs");
    var index = os.index(MASTER_INDEX);
    getAll(index,
	   window.IDBKeyRange.only([user.identity, containerPath]),
	   callback);
};

window.IndexedDBInterop.prototype.removeMessage = function(id) {
    var request = this.db.transaction(["messages"], "readwrite").objectStore("messages").delete(window.IDBKeyRange.only(id));
    request.onerror = function (e) {
	//console.log(e);
    };
    request.onsuccess = function (e) {
	//console.log(e);
    };    
};

window.IndexedDBInterop.prototype.getMessages = function(user, thread, callback) {
    var os = this.db.transaction(["messages"], "readonly").objectStore("messages");
    var index = os.index(MASTER_INDEX);
    getAll(index,
	   window.IDBKeyRange.only([user.identity, thread]),
	   callback);
};

window.IndexedDBInterop.prototype.saveUserProfile = function(user) {
    var request = this.db.transaction(["user"], "readwrite").objectStore("user").put(cleanRecord(user));
    request.onerror = function (e) {
	//console.log(e);
    };
    request.onsuccess = function (e) {
	//console.log(e);
    };
};

window.IndexedDBInterop.prototype.removeAnnotation = function(user, id) {
    var request = this.db.transaction(["annotations"], "readwrite").objectStore("annotations").delete(window.IDBKeyRange.only(id));
    request.onerror = function (e) {
	//console.log(e);
    };
    request.onsuccess = function (e) {
	//console.log(e);
    };    
};

window.IndexedDBInterop.prototype.removeSharedAnnotation = function(user, id) {
    var request = this.db.transaction(["generalAnnotations"], "readwrite").objectStore("generalAnnotations").delete(window.IDBKeyRange.only(id));
    request.onerror = function (e) {
    //console.log(e);
    };
    request.onsuccess = function (e) {
    //console.log(e);
    };
};

window.IndexedDBInterop.prototype.getGeneralAnnotations = function(user, containerPath, callback) {
    var index = this.db.transaction(["generalAnnotations"], "readonly").objectStore("generalAnnotations").index(MASTER_INDEX);
    console.log("index: " + index);
    var param = isIOS ? containerPath : [containerPath];
    getAll(index,
	   window.IDBKeyRange.only(param),
	   callback);
};

window.IndexedDBInterop.prototype.getUserProfile = function(id, callback) {
    var request = this.db.transaction(["user"], "readonly").objectStore("user").get(id);
    request.onerror = function (e) {
	//console.log(e);
    };
    request.onsuccess = function (e) {
	if (callback != null)
	    callback(e.target.result);
    };    
};

window.IndexedDBInterop.prototype.getOutgoing = function(user, callback) {
    var os = this.db.transaction(["outgoing"], "readonly").objectStore("outgoing");
    var index = os.index(MASTER_INDEX);
    var param = isIOS ? user.identity : [user.identity];
    getAll(index,
	   window.IDBKeyRange.only(param),
	   callback);
};


window.IndexedDBInterop.prototype.clearOutgoing = function(user, toClear) {
    var objectStore = this.db.transaction(["outgoing"], "readwrite").objectStore("outgoing");
    var index = objectStore.index(MASTER_INDEX);
    var callback = function () {
	if (toClear.length > 0) {
	    var record = toClear.pop();
	    var request = objectStore.delete(window.IDBKeyRange.only([user.identity, record.id]));
	    request.onerror = callback;
	    request.onsuccess = callback;
	}
    };
    callback();
};

window.IndexedDBInterop.prototype.saveAnnotation = function(user, containerPath, annotation) {
    annotation.identity = user.identity;
    annotation.containerPath = containerPath;
    var request = this.db.transaction(["annotations"], "readwrite").objectStore("annotations").put(cleanRecord(annotation));
    request.onerror = function (e) {
	// console.log(e);
    };
    request.onsuccess = function (e) {
	// console.log(e);
    };
};

window.IndexedDBInterop.prototype.saveAnnotations = function(user, containerPath, annotations) {
    var objectStore = this.db.transaction(["annotations"], "readwrite").objectStore("annotations");
    var callback = function () {
	if (annotations.length > 0) {
	    var record = annotations.pop();
	    record.identity = user.identity;
	    record.containerPath = containerPath;
	    var request = objectStore.put(cleanRecord(record));
	    request.onerror = callback;
	    request.onsuccess = callback;
	}
    };
    callback();
};


window.IndexedDBInterop.prototype.getAsset = function(id, callback) {
    var request = this.db.transaction(["assets"], "readonly").objectStore("assets").get(id);
    request.onerror = function (e) {
	//console.log(e);
    };
    request.onsuccess = function (e) {
	if (callback != null)
	    callback(e.target.result);
    };
};

window.IndexedDBInterop.prototype.saveAsset = function(id, data) {
    data.id = id;
    data.content = new Blob([data.content.response], { type : data.content.getResponseHeader("Content-Type") });
    var request = this.db.transaction(["assets"], "readwrite").objectStore("assets").put(cleanRecord(data));
    request.onerror = function (e) {
	// console.log(e);
    };
    request.onsuccess = function (e) {
	// console.log(e);
    };
};

window.IndexedDBInterop.prototype.saveGeneralAnnotation = function(user, containerPath, annotation) {
    annotation.containerPath = containerPath;
    var request = this.db.transaction(["generalAnnotations"], "readwrite").objectStore("generalAnnotations").put(cleanRecord(annotation));
    request.onerror = function (e) {
	// console.log(e);
    };
    request.onsuccess = function (e) {
	// console.log(e);
    };
};

window.IndexedDBInterop.prototype.saveGeneralAnnotations = function(user, containerPath, annotations) {
    var objectStore = this.db.transaction(["generalAnnotations"], "readwrite").objectStore("generalAnnotations");
    var callback = function () {
	if (annotations.length > 0) {
	    var record = annotations.pop();
	    record.containerPath = containerPath;
	    var request = objectStore.put(cleanRecord(record));
	    request.onerror = callback;
	    request.onsuccess = callback;
	}
    };
    callback();
};
