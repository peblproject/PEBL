/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./src/xapi.ts
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var NAMESPACE_USER_MESSAGES = "user-";
var PREFIX_PEBL_THREAD = "peblThread://";
var PREFIX_PEBL = "pebl://";
var PREFIX_PEBL_EXTENSION = "https://www.peblproject.com/definitions.html#";
// -------------------------------
var XApiStatement = /** @class */ (function () {
    function XApiStatement(raw) {
        this.id = raw.id;
        this.actor = raw.actor;
        this.verb = raw.verb;
        this.context = raw.context;
        this.stored = raw.stored;
        this.timestamp = raw.timestamp;
        this.result = raw.result;
        this["object"] = raw.object;
        this.attachments = raw.attachments;
    }
    XApiStatement.prototype.toXAPI = function () {
        return new XApiStatement(this);
    };
    XApiStatement.prototype.getActorId = function () {
        return this.actor.mbox || this.actor.openid ||
            (this.actor.account && this.actor.account.name);
    };
    XApiStatement.is = function (x) {
        if (x.verb)
            return true;
        else
            return false;
    };
    return XApiStatement;
}());

// -------------------------------
var Reference = /** @class */ (function (_super) {
    __extends(Reference, _super);
    function Reference(raw) {
        var _this = _super.call(this, raw) || this;
        _this.thread = _this["object"].id;
        if (_this.thread.indexOf(PREFIX_PEBL_THREAD) != -1)
            _this.thread = _this.thread.substring(PREFIX_PEBL_THREAD.length);
        _this.name = _this.object.definition.name["en-US"];
        var extensions = _this["object"].definition.extensions;
        _this.book = extensions[PREFIX_PEBL_EXTENSION + "book"];
        _this.docType = extensions[PREFIX_PEBL_EXTENSION + "docType"];
        _this.location = extensions[PREFIX_PEBL_EXTENSION + "location"];
        _this.card = extensions[PREFIX_PEBL_EXTENSION + "card"];
        _this.url = extensions[PREFIX_PEBL_EXTENSION + "url"];
        _this.target = extensions[PREFIX_PEBL_EXTENSION + "target"];
        _this.externalURL = extensions[PREFIX_PEBL_EXTENSION + "externalURL"];
        return _this;
    }
    Reference.is = function (x) {
        var verb = x.verb.display["en-US"];
        return (verb == "pushed") || (verb == "pulled");
    };
    return Reference;
}(XApiStatement));

// -------------------------------
var Annotation = /** @class */ (function (_super) {
    __extends(Annotation, _super);
    function Annotation(raw) {
        var _this = _super.call(this, raw) || this;
        _this.title = _this.object.definition.name && _this.object.definition.name["en-US"];
        _this.text = _this.object.definition.description && _this.object.definition.description["en-US"];
        _this.book = _this.object.id;
        if (_this.book.indexOf(PREFIX_PEBL) != -1)
            _this.book = _this.book.substring(_this.book.indexOf(PREFIX_PEBL) + PREFIX_PEBL.length);
        else if (_this.book.indexOf(PREFIX_PEBL_THREAD) != -1)
            _this.book = _this.book.substring(_this.book.indexOf(PREFIX_PEBL_THREAD) + PREFIX_PEBL_THREAD.length);
        _this.owner = _this.getActorId();
        var extensions = _this.object.definition.extensions;
        _this.type = extensions[PREFIX_PEBL_EXTENSION + "type"];
        _this.cfi = extensions[PREFIX_PEBL_EXTENSION + "cfi"];
        _this.idRef = extensions[PREFIX_PEBL_EXTENSION + "idRef"];
        _this.style = extensions[PREFIX_PEBL_EXTENSION + "style"];
        return _this;
    }
    Annotation.is = function (x) {
        var verb = x.verb.display["en-US"];
        return (verb == "commented") || (verb == "bookmarked") || (verb == "annotated");
    };
    return Annotation;
}(XApiStatement));

// -------------------------------
var SharedAnnotation = /** @class */ (function (_super) {
    __extends(SharedAnnotation, _super);
    function SharedAnnotation(raw) {
        return _super.call(this, raw) || this;
    }
    SharedAnnotation.is = function (x) {
        var verb = x.verb.display["en-US"];
        return (verb == "shared");
    };
    return SharedAnnotation;
}(Annotation));

// -------------------------------
var Action = /** @class */ (function (_super) {
    __extends(Action, _super);
    function Action(raw) {
        var _this = _super.call(this, raw) || this;
        _this.activityId = _this.object.id;
        _this.action = _this.verb.display["en-US"];
        _this.book = _this.object.id;
        if (_this.book.indexOf(PREFIX_PEBL) != -1)
            _this.book = _this.book.substring(_this.book.indexOf(PREFIX_PEBL) + PREFIX_PEBL.length);
        else if (_this.book.indexOf(PREFIX_PEBL_THREAD) != -1)
            _this.book = _this.book.substring(_this.book.indexOf(PREFIX_PEBL_THREAD) + PREFIX_PEBL_THREAD.length);
        if (_this.object.definition) {
            _this.name = _this.object.definition.name && _this.object.definition.name["en-US"];
            _this.description = _this.object.definition.description && _this.object.definition.description["en-US"];
            var extensions = _this.object.definition.extensions;
            if (extensions) {
                _this.target = extensions[PREFIX_PEBL_EXTENSION + "target"];
                _this.type = extensions[PREFIX_PEBL_EXTENSION + "type"];
                _this.idref = extensions[PREFIX_PEBL_EXTENSION + "idref"];
                _this.cfi = extensions[PREFIX_PEBL_EXTENSION + "cfi"];
            }
        }
        return _this;
    }
    Action.is = function (x) {
        var verb = x.verb.display["en-US"];
        return (verb == "preferred") || (verb == "morphed") || (verb == "interacted") || (verb == "experienced") || (verb == "disliked") ||
            (verb == "liked") || (verb == "accessed") || (verb == "hid") || (verb == "showed") || (verb == "displayed") || (verb == "undisplayed") ||
            (verb == "searched") || (verb == "selected") || (verb == "unbookmarked") || (verb == "discarded") || (verb == "unshared") || (verb == "unannotated") ||
            (verb == "submitted");
    };
    return Action;
}(XApiStatement));

// -------------------------------
var Navigation = /** @class */ (function (_super) {
    __extends(Navigation, _super);
    function Navigation(raw) {
        var _this = _super.call(this, raw) || this;
        _this.type = _this.verb.display["en-US"];
        _this.activityId = _this.object.id;
        _this.book = _this.object.id;
        if (_this.book.indexOf(PREFIX_PEBL) != -1)
            _this.book = _this.book.substring(_this.book.indexOf(PREFIX_PEBL) + PREFIX_PEBL.length);
        else if (_this.book.indexOf(PREFIX_PEBL_THREAD) != -1)
            _this.book = _this.book.substring(_this.book.indexOf(PREFIX_PEBL_THREAD) + PREFIX_PEBL_THREAD.length);
        var extensions = _this.object.definition.extensions;
        if (extensions) {
            _this.firstCfi = extensions[PREFIX_PEBL_EXTENSION + "firstCfi"];
            _this.lastCfi = extensions[PREFIX_PEBL_EXTENSION + "lastCfi"];
        }
        return _this;
    }
    Navigation.is = function (x) {
        var verb = x.verb.display["en-US"];
        return (verb == "paged-next") || (verb == "paged-prev") || (verb == "paged-jump") || (verb == "interacted") ||
            (verb == "completed");
    };
    return Navigation;
}(XApiStatement));

// -------------------------------
var Message = /** @class */ (function (_super) {
    __extends(Message, _super);
    function Message(raw) {
        var _this = _super.call(this, raw) || this;
        _this.thread = _this.object.id;
        if (_this.thread.indexOf(PREFIX_PEBL_THREAD) != -1)
            _this.thread = _this.thread.substring(PREFIX_PEBL_THREAD.length);
        _this.prompt = _this.object.definition.name["en-US"];
        _this.name = _this.actor.name;
        _this.direct = _this.thread == (NAMESPACE_USER_MESSAGES + _this.getActorId());
        _this.text = _this.object.definition.description["en-US"];
        var extensions = _this.object.definition.extensions;
        if (extensions) {
            _this.access = extensions[PREFIX_PEBL_EXTENSION + "access"];
            _this.type = extensions[PREFIX_PEBL_EXTENSION + "type"];
            _this.masterThread = extensions[PREFIX_PEBL_EXTENSION + "masterThread"];
        }
        return _this;
    }
    Message.is = function (x) {
        var verb = x.verb.display["en-US"];
        return (verb == "responded") || (verb == "noted");
    };
    return Message;
}(XApiStatement));

// -------------------------------
var Voided = /** @class */ (function (_super) {
    __extends(Voided, _super);
    function Voided(raw) {
        var _this = _super.call(this, raw) || this;
        _this.thread = _this.context.contextActivities.parent[0].id;
        if (_this.thread.indexOf(PREFIX_PEBL_THREAD) != -1)
            _this.thread = _this.thread.substring(PREFIX_PEBL_THREAD.length);
        _this.target = _this.object.id;
        return _this;
    }
    Voided.is = function (x) {
        var verb = x.verb.display["en-US"];
        return (verb == "voided");
    };
    return Voided;
}(XApiStatement));

// -------------------------------
var Question = /** @class */ (function (_super) {
    __extends(Question, _super);
    function Question(raw) {
        var _this = _super.call(this, raw) || this;
        _this.book = _this.object.id;
        if (_this.book.indexOf(PREFIX_PEBL) != -1)
            _this.book = _this.book.substring(_this.book.indexOf(PREFIX_PEBL) + PREFIX_PEBL.length);
        else if (_this.book.indexOf(PREFIX_PEBL_THREAD) != -1)
            _this.book = _this.book.substring(_this.book.indexOf(PREFIX_PEBL_THREAD) + PREFIX_PEBL_THREAD.length);
        _this.score = _this.result.score.raw;
        _this.min = _this.result.score.min;
        _this.max = _this.result.score.max;
        _this.completion = _this.result.completion;
        _this.success = _this.result.success;
        _this.response = _this.result.response;
        _this.prompt = _this.object.definition.description["en-US"];
        _this.activityId = _this.object.id;
        var choices = _this.object.definition.choices;
        _this.answers = [];
        for (var _i = 0, _a = Object.keys(choices); _i < _a.length; _i++) {
            var key = _a[_i];
            _this.answers.push(choices[key].description["en-US"]);
        }
        return _this;
    }
    Question.is = function (x) {
        var verb = x.verb.display["en-US"];
        return (verb == "attempted");
    };
    return Question;
}(XApiStatement));

// -------------------------------
var Quiz = /** @class */ (function (_super) {
    __extends(Quiz, _super);
    function Quiz(raw) {
        var _this = _super.call(this, raw) || this;
        _this.book = _this.object.id;
        if (_this.book.indexOf(PREFIX_PEBL) != -1)
            _this.book = _this.book.substring(_this.book.indexOf(PREFIX_PEBL) + PREFIX_PEBL.length);
        else if (_this.book.indexOf(PREFIX_PEBL_THREAD) != -1)
            _this.book = _this.book.substring(_this.book.indexOf(PREFIX_PEBL_THREAD) + PREFIX_PEBL_THREAD.length);
        _this.score = _this.result.score.raw;
        _this.min = _this.result.score.min;
        _this.max = _this.result.score.max;
        _this.completion = _this.result.completion;
        _this.success = _this.result.success;
        _this.quizId = _this.object.definition.name["en-US"];
        _this.quizName = _this.object.definition.description["en-US"];
        _this.activityId = _this.object.id;
        return _this;
    }
    Quiz.is = function (x) {
        var verb = x.verb.display["en-US"];
        return (verb == "failed") || (verb == "passed");
    };
    return Quiz;
}(XApiStatement));

// -------------------------------
var Session = /** @class */ (function (_super) {
    __extends(Session, _super);
    function Session(raw) {
        var _this = _super.call(this, raw) || this;
        _this.activityId = _this.object.id;
        if (_this.object.definition) {
            _this.activityName = _this.object.definition.name && _this.object.definition.name["en-US"];
            _this.activityDescription = _this.object.definition.description && _this.object.definition.description["en-US"];
        }
        _this.book = _this.object.id;
        if (_this.book.indexOf(PREFIX_PEBL) != -1)
            _this.book = _this.book.substring(_this.book.indexOf(PREFIX_PEBL) + PREFIX_PEBL.length);
        else if (_this.book.indexOf(PREFIX_PEBL_THREAD) != -1)
            _this.book = _this.book.substring(_this.book.indexOf(PREFIX_PEBL_THREAD) + PREFIX_PEBL_THREAD.length);
        _this.type = _this.verb.display["en-US"];
        return _this;
    }
    Session.is = function (x) {
        var verb = x.verb.display["en-US"];
        return (verb == "entered") || (verb == "exited") || (verb == "logged-in") ||
            (verb == "logged-out") || (verb == "terminated") || (verb == "initialized") || (verb == "launched");
    };
    return Session;
}(XApiStatement));

// -------------------------------
var Membership = /** @class */ (function (_super) {
    __extends(Membership, _super);
    function Membership(raw) {
        var _this = _super.call(this, raw) || this;
        _this.thread = _this.object.id;
        if (_this.thread.indexOf(PREFIX_PEBL_THREAD) != -1)
            _this.thread = _this.thread.substring(PREFIX_PEBL_THREAD.length);
        _this.membershipId = _this.object.definition.name["en-US"];
        _this.description = _this.object.definition.description && _this.object.definition.description["en-US"];
        var extensions = _this.object.definition.extensions;
        _this.role = extensions[PREFIX_PEBL_EXTENSION + "role"];
        _this.activityType = extensions[PREFIX_PEBL_EXTENSION + "activityType"];
        _this.organization = extensions[PREFIX_PEBL_EXTENSION + "organization"];
        _this.organizationName = extensions[PREFIX_PEBL_EXTENSION + "organizationName"];
        return _this;
    }
    Membership.is = function (x) {
        var verb = x.verb.display["en-US"];
        return (verb == "joined");
    };
    return Membership;
}(XApiStatement));

// -------------------------------
var Artifact = /** @class */ (function (_super) {
    __extends(Artifact, _super);
    function Artifact(raw) {
        var _this = _super.call(this, raw) || this;
        _this.thread = _this.object.id;
        if (_this.thread.indexOf(PREFIX_PEBL_THREAD) != -1)
            _this.thread = _this.thread.substring(PREFIX_PEBL_THREAD.length);
        _this.artifactId = _this.object.definition.name["en-US"];
        _this.artifactDescription = _this.object.definition.description && _this.object.definition.description["en-US"];
        var extensions = _this.object.definition.extensions;
        _this.body = extensions[PREFIX_PEBL_EXTENSION + "body"];
        return _this;
    }
    Artifact.is = function (x) {
        var verb = x.verb.display["en-US"];
        return (verb == "artifactCreated");
    };
    return Artifact;
}(XApiStatement));

// -------------------------------
var Invitation = /** @class */ (function (_super) {
    __extends(Invitation, _super);
    function Invitation(raw) {
        var _this = _super.call(this, raw) || this;
        var extensions = _this.object.definition.extensions;
        _this.token = _this.object.definition.name["en-US"];
        _this.programId = extensions[PREFIX_PEBL_EXTENSION + "programId"];
        return _this;
    }
    Invitation.is = function (x) {
        var verb = x.verb.display["en-US"];
        return (verb == "invited");
    };
    return Invitation;
}(XApiStatement));

// -------------------------------
var ProgramAction = /** @class */ (function (_super) {
    __extends(ProgramAction, _super);
    function ProgramAction(raw) {
        var _this = _super.call(this, raw) || this;
        _this.thread = _this.object.id;
        var extensions = _this.object.definition.extensions;
        _this.programId = _this.object.definition.name["en-US"];
        _this.previousValue = extensions[PREFIX_PEBL_EXTENSION + "previousValue"];
        _this.newValue = extensions[PREFIX_PEBL_EXTENSION + "newValue"];
        _this.action = extensions[PREFIX_PEBL_EXTENSION + "action"];
        return _this;
    }
    ProgramAction.is = function (x) {
        var verb = x.verb.display["en-US"];
        return (verb == "programLevelUp") || (verb == "programLevelDown") || (verb == "programInvited") || (verb == "programUninvited")
            || (verb == "programExpelled") || (verb == "programJoined") || (verb == "programActivityLaunched")
            || (verb == "programActivityCompleted") || (verb == "programActivityTeamCompleted") || (verb == "programModified")
            || (verb == "programDeleted") || (verb == "programCompleted") || (verb == "programCopied") || (verb == "programDiscussed");
    };
    return ProgramAction;
}(XApiStatement));

// -------------------------------
var CompatibilityTest = /** @class */ (function (_super) {
    __extends(CompatibilityTest, _super);
    function CompatibilityTest(raw) {
        var _this = _super.call(this, raw) || this;
        var extensions = _this.object.definition.extensions;
        _this.readerName = extensions[PREFIX_PEBL_EXTENSION + "readerName"];
        _this.osName = extensions[PREFIX_PEBL_EXTENSION + "osName"];
        _this.osVersion = extensions[PREFIX_PEBL_EXTENSION + "osVersion"];
        _this.browserName = extensions[PREFIX_PEBL_EXTENSION + "browserName"];
        _this.browserVersion = extensions[PREFIX_PEBL_EXTENSION + "browserVersion"];
        _this.userAgent = extensions[PREFIX_PEBL_EXTENSION + "userAgent"];
        _this.appVersion = extensions[PREFIX_PEBL_EXTENSION + "appVersion"];
        _this.platform = extensions[PREFIX_PEBL_EXTENSION + "platform"];
        _this.vendor = extensions[PREFIX_PEBL_EXTENSION + "vendor"];
        _this.testResults = JSON.parse(extensions[PREFIX_PEBL_EXTENSION + "testResults"]);
        return _this;
    }
    CompatibilityTest.is = function (x) {
        var verb = x.verb.display["en-US"];
        return (verb == "compatibilityTested");
    };
    return CompatibilityTest;
}(XApiStatement));

// -------------------------------
var ModuleEvent = /** @class */ (function (_super) {
    __extends(ModuleEvent, _super);
    function ModuleEvent(raw) {
        return _super.call(this, raw) || this;
    }
    return ModuleEvent;
}(XApiStatement));

var ModuleRating = /** @class */ (function (_super) {
    __extends(ModuleRating, _super);
    function ModuleRating(raw) {
        var _this = _super.call(this, raw) || this;
        var extensions = _this.object.definition.extensions;
        _this.rating = _this.object.definition.name["en-US"];
        _this.idref = extensions[PREFIX_PEBL_EXTENSION + "idref"];
        _this.programId = extensions[PREFIX_PEBL_EXTENSION + "programId"];
        return _this;
    }
    ModuleRating.is = function (x) {
        var verb = x.verb.display["en-US"];
        return (verb == "moduleRating");
    };
    return ModuleRating;
}(ModuleEvent));

var ModuleFeedback = /** @class */ (function (_super) {
    __extends(ModuleFeedback, _super);
    function ModuleFeedback(raw) {
        var _this = _super.call(this, raw) || this;
        var extensions = _this.object.definition.extensions;
        _this.feedback = _this.object.definition.name["en-US"];
        _this.willingToDiscuss = extensions[PREFIX_PEBL_EXTENSION + "willingToDiscuss"];
        _this.idref = extensions[PREFIX_PEBL_EXTENSION + "idref"];
        _this.programId = extensions[PREFIX_PEBL_EXTENSION + "programId"];
        return _this;
    }
    ModuleFeedback.is = function (x) {
        var verb = x.verb.display["en-US"];
        return (verb == "moduleFeedback");
    };
    return ModuleFeedback;
}(ModuleEvent));

var ModuleExample = /** @class */ (function (_super) {
    __extends(ModuleExample, _super);
    function ModuleExample(raw) {
        var _this = _super.call(this, raw) || this;
        var extensions = _this.object.definition.extensions;
        _this.example = _this.object.definition.name["en-US"];
        _this.description = _this.object.definition.description["en-US"];
        _this.idref = extensions[PREFIX_PEBL_EXTENSION + "idref"];
        _this.youtubeUrl = extensions[PREFIX_PEBL_EXTENSION + "youtubeUrl"];
        _this.imageUrl = extensions[PREFIX_PEBL_EXTENSION + "imageUrl"];
        _this.websiteUrl = extensions[PREFIX_PEBL_EXTENSION + "websiteUrl"];
        _this.quotedPerson = extensions[PREFIX_PEBL_EXTENSION + "quotedPerson"];
        _this.quotedTeam = extensions[PREFIX_PEBL_EXTENSION + "quotedTeam"];
        return _this;
    }
    ModuleExample.is = function (x) {
        var verb = x.verb.display["en-US"];
        return (verb == "moduleExample");
    };
    return ModuleExample;
}(ModuleEvent));

var ModuleExampleRating = /** @class */ (function (_super) {
    __extends(ModuleExampleRating, _super);
    function ModuleExampleRating(raw) {
        var _this = _super.call(this, raw) || this;
        var extensions = _this.object.definition.extensions;
        _this.rating = _this.object.definition.name["en-US"];
        _this.idref = extensions[PREFIX_PEBL_EXTENSION + "idref"];
        _this.programId = extensions[PREFIX_PEBL_EXTENSION + "programId"];
        _this.exampleId = extensions[PREFIX_PEBL_EXTENSION + "exampleId"];
        return _this;
    }
    ModuleExampleRating.is = function (x) {
        var verb = x.verb.display["en-US"];
        return (verb == "moduleExampleRating");
    };
    return ModuleExampleRating;
}(ModuleEvent));

var ModuleExampleFeedback = /** @class */ (function (_super) {
    __extends(ModuleExampleFeedback, _super);
    function ModuleExampleFeedback(raw) {
        var _this = _super.call(this, raw) || this;
        var extensions = _this.object.definition.extensions;
        _this.feedback = _this.object.definition.name["en-US"];
        _this.willingToDiscuss = extensions[PREFIX_PEBL_EXTENSION + "willingToDiscuss"];
        _this.idref = extensions[PREFIX_PEBL_EXTENSION + "idref"];
        _this.programId = extensions[PREFIX_PEBL_EXTENSION + "programId"];
        _this.exampleId = extensions[PREFIX_PEBL_EXTENSION + "exampleId"];
        return _this;
    }
    ModuleExampleFeedback.is = function (x) {
        var verb = x.verb.display["en-US"];
        return (verb == "moduleExampleFeedback");
    };
    return ModuleExampleFeedback;
}(ModuleEvent));

var ModuleRemovedEvent = /** @class */ (function (_super) {
    __extends(ModuleRemovedEvent, _super);
    function ModuleRemovedEvent(raw) {
        var _this = _super.call(this, raw) || this;
        var extensions = _this.object.definition.extensions;
        _this.idref = _this.object.definition.name["en-US"];
        _this.eventId = _this.object.definition.description["en-US"];
        _this.type = extensions[PREFIX_PEBL_EXTENSION + "type"];
        return _this;
    }
    ModuleRemovedEvent.is = function (x) {
        var verb = x.verb.display["en-US"];
        return (verb == "moduleRemovedEvent");
    };
    return ModuleRemovedEvent;
}(ModuleEvent));


// CONCATENATED MODULE: ./src/models.ts
// -------------------------------
var UserProfile = /** @class */ (function () {
    function UserProfile(raw) {
        this.identity = raw.identity;
        this.name = raw.name;
        this.homePage = raw.homePage;
        this.preferredName = raw.preferredName;
        if (raw.registryEndpoint)
            this.registryEndpoint = new Endpoint(raw.registryEndpoint);
        if (raw.currentTeam)
            this.currentTeam = raw.currentTeam;
        if (raw.currentClass)
            this.currentClass = raw.currentClass;
        this.endpoints = [];
        this.metadata = raw.metadata;
        if (raw.endpoints)
            for (var _i = 0, _a = raw.endpoints; _i < _a.length; _i++) {
                var endpointObj = _a[_i];
                this.endpoints.push(new Endpoint(endpointObj));
            }
        if (this.homePage == null)
            this.homePage = "acct:keycloak-server";
        if (raw.firstName)
            this.firstName = raw.firstName;
        if (raw.lastName)
            this.lastName = raw.lastName;
        if (raw.avatar)
            this.avatar = raw.avatar;
        if (raw.email)
            this.email = raw.email;
        if (raw.phoneNumber)
            this.phoneNumber = raw.phoneNumber;
        if (raw.streetAddress)
            this.streetAddress = raw.streetAddress;
        if (raw.city)
            this.city = raw.city;
        if (raw.state)
            this.state = raw.state;
        if (raw.zipCode)
            this.zipCode = raw.zipCode;
        if (raw.country)
            this.country = raw.country;
    }
    UserProfile.prototype.toObject = function () {
        var urls = {};
        for (var _i = 0, _a = this.endpoints; _i < _a.length; _i++) {
            var e = _a[_i];
            urls[e.url] = e.toObject();
        }
        var obj = {
            "identity": this.identity,
            "name": this.name,
            "homePage": this.homePage,
            "preferredName": this.preferredName,
            "lrsUrls": urls,
            "metadata": {},
            "registryEndpoint": this.registryEndpoint,
            "currentTeam": this.currentTeam,
            "currentClass": this.currentClass,
            "firstName": this.firstName,
            "lastName": this.lastName,
            "avatar": this.avatar,
            "email": this.email,
            "phoneNumber": this.phoneNumber,
            "streetAddress": this.streetAddress,
            "city": this.city,
            "state": this.state,
            "zipCode": this.zipCode,
            "country": this.country
        };
        if (this.metadata)
            obj.metadata = this.metadata;
        return obj;
    };
    return UserProfile;
}());

// -------------------------------
var Endpoint = /** @class */ (function () {
    function Endpoint(raw) {
        this.url = raw.url;
        this.username = raw.username;
        this.password = raw.password;
        this.token = raw.token;
        if (!this.token) {
            this.token = btoa(this.username + ":" + this.password);
        }
        this.lastSyncedBooksMine = {};
        this.lastSyncedBooksShared = {};
        this.lastSyncedThreads = {};
        this.lastSyncedActivityEvents = {};
        this.lastSyncedModules = {};
    }
    Endpoint.prototype.toObject = function (urlPrefix) {
        if (urlPrefix === void 0) { urlPrefix = ""; }
        return {
            url: urlPrefix + this.url,
            username: this.username,
            password: this.password,
            token: this.token,
            lastSyncedThreads: this.lastSyncedThreads,
            lastSyncedBooksMine: this.lastSyncedBooksMine,
            lastSyncedBooksShared: this.lastSyncedBooksMine,
            lastSyncedActivityEvents: this.lastSyncedActivityEvents,
            lastSyncedModules: this.lastSyncedModules
        };
    };
    return Endpoint;
}());

// -------------------------------
var TempMembership = /** @class */ (function () {
    function TempMembership(raw) {
        this.id = raw.id;
        this.identity = raw.identity;
        this.actor = raw.actor;
        this.inviteId = raw.inviteId;
        this.inviteLink = raw.inviteLink;
        this.status = raw.status;
        this.role = raw.role;
        this.inviteRole = raw.inviteRole;
    }
    TempMembership.is = function (x) {
        if (x.id && x.identity && x.actor && x.actor.name && x.inviteLink && x.status && x.role && x.inviteRole)
            return true;
        else
            return false;
    };
    return TempMembership;
}());


// CONCATENATED MODULE: ./src/activity.ts
var activity_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// import { PEBL } from "./pebl";



var Activity = /** @class */ (function () {
    function Activity(raw) {
        this.isNew = false;
        this.dirtyEdits = {};
        if (!raw.id) {
            /*!
              Excerpt from: Math.uuid.js (v1.4)
              http://www.broofa.com
              mailto:robert@broofa.com
              Copyright (c) 2010 Robert Kieffer
              Dual licensed under the MIT and GPL licenses.
            */
            this.id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            this.isNew = true;
        }
        else {
            this.id = raw.id;
            this.isNew = false;
        }
        this.timestamp = (typeof (raw.timestamp) === "string") ? new Date(Date.parse(raw.timestamp)) : new Date();
        this.etag = raw.etag;
        this.type = raw.type;
        this.delete = raw.delete;
    }
    Activity.is = function (raw) {
        return (raw.id && raw.type) != null;
    };
    Activity.prototype.clearDirtyEdits = function () {
        this.dirtyEdits = {};
    };
    Activity.prototype.toTransportFormat = function () {
        return {
            type: this.type,
            timestamp: this.timestamp ? this.timestamp.toISOString() : (new Date()).toISOString(),
            id: this.id
        };
    };
    ;
    Activity.merge = function (oldActivity, newActivity) {
        var mergedActivity = {};
        var oldKeys = Object.keys(oldActivity);
        var newKeys = Object.keys(newActivity);
        for (var _i = 0, oldKeys_1 = oldKeys; _i < oldKeys_1.length; _i++) {
            var key = oldKeys_1[_i];
            mergedActivity[key] = oldActivity[key];
        }
        for (var _a = 0, newKeys_1 = newKeys; _a < newKeys_1.length; _a++) {
            var key = newKeys_1[_a];
            // Null properties were set for a reason and should not be changed.
            if (mergedActivity[key] == null) {
                // Leave it
            }
            else {
                mergedActivity[key] = newActivity[key];
            }
        }
        // If either is flagged for deletion, that should not be changed.
        if ((oldActivity.delete && oldActivity.delete == true) || (newActivity.delete && newActivity.delete == true)) {
            mergedActivity.delete = true;
        }
        // If either is flagged as completed, that should not be changed.
        if ((oldActivity.completed && oldActivity.completed == true) || (newActivity.completed && newActivity.completed == true)) {
            mergedActivity.completed = true;
        }
        return mergedActivity;
    };
    return Activity;
}());

var Learnlet = /** @class */ (function (_super) {
    activity_extends(Learnlet, _super);
    function Learnlet(raw) {
        var _this = this;
        raw.type = "learnlet";
        _this = _super.call(this, raw) || this;
        _this._cfi = raw.cfi;
        _this._level = raw.level;
        _this.programTitle = raw.name;
        _this._description = raw.description;
        return _this;
    }
    Object.defineProperty(Learnlet.prototype, "name", {
        get: function () { return this.programTitle; },
        set: function (arg) {
            this.dirtyEdits["name"] = true;
            this.programTitle = arg;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Learnlet.prototype, "description", {
        get: function () { return this._description; },
        set: function (arg) {
            this.dirtyEdits["description"] = true;
            this._description = arg;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Learnlet.prototype, "level", {
        get: function () { return this._level; },
        set: function (arg) {
            this.dirtyEdits["level"] = true;
            this._level = arg;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Learnlet.prototype, "cfi", {
        get: function () { return this._cfi; },
        set: function (arg) {
            this.dirtyEdits["cfi"] = true;
            this._cfi = arg;
        },
        enumerable: true,
        configurable: true
    });
    Learnlet.is = function (raw) {
        return raw.type == "learnlet";
    };
    Learnlet.prototype.toTransportFormat = function () {
        var sObj = _super.prototype.toTransportFormat.call(this);
        var obj = {};
        if (this.dirtyEdits["name"] || this.isNew)
            sObj.name = this.programTitle;
        if (this.dirtyEdits["description"] || this.isNew)
            sObj.description = this._description;
        if (this.dirtyEdits["description"] || this.isNew)
            sObj.description = this._description;
        if (this.dirtyEdits["cfi"] || this.isNew)
            sObj.cfi = this._cfi;
        if (this.dirtyEdits["level"] || this.isNew)
            sObj.level = this._level;
        obj[this.id] = sObj;
        return obj;
    };
    return Learnlet;
}(Activity));

// -------------------------------
var activity_Program = /** @class */ (function (_super) {
    activity_extends(Program, _super);
    function Program(raw) {
        var _this = this;
        raw.type = "program";
        _this = _super.call(this, raw) || this;
        var self = _this;
        // Translate legacy member format to new format
        var members = [];
        if (raw.members)
            members = typeof (raw.members) === "string" ? JSON.parse(decodeURIComponent(raw.members)) : (raw.members ? raw.members : []);
        if (members.length > 0) {
            for (var _i = 0, members_1 = members; _i < members_1.length; _i++) {
                var member = members_1[_i];
                self.addMember(member);
            }
        }
        var rawKeys = Object.keys(raw);
        for (var _a = 0, rawKeys_1 = rawKeys; _a < rawKeys_1.length; _a++) {
            var key = rawKeys_1[_a];
            if (key.indexOf('member-') !== -1) {
                var member = typeof (raw[key]) === "string" ? JSON.parse(decodeURIComponent(raw[key])) : (raw[key] ? raw[key] : null);
                if (member == null || (XApiStatement.is(member) && Membership.is(member)) || TempMembership.is(member)) {
                    self[key] = member;
                }
            }
        }
        _this.programLevelStepsComplete = raw.programLevelStepsComplete || 0;
        _this.programLevels = raw.programLevels || [];
        _this.programTitle = raw.programTitle || "";
        _this.programShortDescription = raw.programShortDescription || "";
        _this.programLongDescription = raw.programLongDescription || "";
        _this.programLevel = raw.programLevel || 0;
        _this.programIssues = raw.programIssues ? raw.programIssues : [];
        _this.programCommunities = raw.programCommunities ? raw.programCommunities : [];
        _this.programInstitutions = raw.programInstitutions ? raw.programInstitutions : [];
        _this.programAvatar = raw.programAvatar;
        _this.programTeamName = raw.programTeamName;
        _this.programFocus = raw.programFocus;
        _this.completed = raw.completed ? new Date(raw.completed) : undefined;
        _this.created = raw.created ? new Date(raw.created) : undefined;
        // Estimate created time to backfill older programs, find oldest member and use their timestamp
        if (!_this.created) {
            if (_this.isNew) {
                _this.created = new Date();
            }
            else {
                var oldestMember = null;
                var keys = Object.keys(_this);
                for (var _b = 0, keys_1 = keys; _b < keys_1.length; _b++) {
                    var key = keys_1[_b];
                    if (key.indexOf('member-') !== -1) {
                        var member = typeof (_this[key]) === "string" ? JSON.parse(decodeURIComponent(_this[key])) : (_this[key] ? _this[key] : null);
                        if (member && XApiStatement.is(member) && Membership.is(member)) {
                            if (!oldestMember || (new Date(member.timestamp) < new Date(oldestMember.timestamp)))
                                oldestMember = member;
                        }
                    }
                }
                if (oldestMember)
                    _this.created = new Date(oldestMember.timestamp);
            }
        }
        _this.members = typeof (raw.members) === "string" ? JSON.parse(decodeURIComponent(raw.members)) : (raw.members ? raw.members : []);
        return _this;
    }
    Program.is = function (raw) {
        return raw.type == "program";
    };
    Program.prototype.toTransportFormat = function () {
        var obj = _super.prototype.toTransportFormat.call(this);
        var self = this;
        var keys = Object.keys(this);
        for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
            var key = keys_2[_i];
            if (key.indexOf('member-') !== -1) {
                if (self[key] == null) {
                    obj[key] = self[key];
                }
                else if ((XApiStatement.is(self[key]) && Membership.is(self[key])) || TempMembership.is(self[key])) {
                    obj[key] = encodeURIComponent(JSON.stringify(self[key]));
                }
            }
        }
        obj.programLevelStepsComplete = this.programLevelStepsComplete;
        obj.programLevels = this.programLevels;
        obj.programTitle = this.programTitle;
        obj.programShortDescription = this.programShortDescription;
        obj.programLongDescription = this.programLongDescription;
        obj.programLevel = this.programLevel;
        obj.programIssues = this.programIssues;
        obj.programAvatar = this.programAvatar;
        obj.programTeamName = this.programTeamName;
        obj.programFocus = this.programFocus;
        obj.programCommunities = this.programCommunities;
        obj.programInstitutions = this.programInstitutions;
        obj.completed = this.completed ? this.completed.toISOString() : undefined,
            obj.created = this.created ? this.created.toISOString() : undefined,
            obj.members = encodeURIComponent(JSON.stringify(this.members));
        return obj;
    };
    Program.prototype.addMember = function (membership) {
        this['member-' + membership.id] = membership;
    };
    Program.iterateMembers = function (program, callback) {
        var keys = Object.keys(program);
        for (var _i = 0, keys_3 = keys; _i < keys_3.length; _i++) {
            var key = keys_3[_i];
            if (key.indexOf('member-') !== -1 && program[key]) {
                if (XApiStatement.is(program[key]) && Membership.is(program[key])) {
                    callback(key, program[key]);
                }
                else if (TempMembership.is(program[key])) {
                    callback(key, program[key]);
                }
            }
        }
    };
    Program.getMembers = function (program) {
        var members = [];
        var keys = Object.keys(program);
        for (var _i = 0, keys_4 = keys; _i < keys_4.length; _i++) {
            var key = keys_4[_i];
            if (key.indexOf('member-') !== -1 && program[key]) {
                if (XApiStatement.is(program[key]) && Membership.is(program[key])) {
                    members.push(program[key]);
                }
            }
        }
        return members;
    };
    Program.isMember = function (program, userIdentity) {
        var isMember = false;
        var keys = Object.keys(program);
        for (var _i = 0, keys_5 = keys; _i < keys_5.length; _i++) {
            var key = keys_5[_i];
            if (key.indexOf('member-') !== -1 && program[key]) {
                if (program[key].identity === userIdentity) {
                    isMember = true;
                }
            }
        }
        return isMember;
    };
    Program.isNew = function (program) {
        var isNew = true;
        var keys = Object.keys(program);
        for (var _i = 0, keys_6 = keys; _i < keys_6.length; _i++) {
            var key = keys_6[_i];
            if (key.indexOf('member-') !== -1) {
                isNew = false;
            }
        }
        return isNew;
    };
    return Program;
}(Activity));

var activity_Institution = /** @class */ (function (_super) {
    activity_extends(Institution, _super);
    function Institution(raw) {
        var _this = this;
        raw.type = "institution";
        _this = _super.call(this, raw) || this;
        var self = _this;
        var rawKeys = Object.keys(raw);
        for (var _i = 0, rawKeys_2 = rawKeys; _i < rawKeys_2.length; _i++) {
            var key = rawKeys_2[_i];
            if (key.indexOf('member-') !== -1) {
                var member = typeof (raw[key]) === "string" ? JSON.parse(decodeURIComponent(raw[key])) : (raw[key] ? raw[key] : null);
                if (member == null || (XApiStatement.is(member) && Membership.is(member)) || TempMembership.is(member)) {
                    self[key] = member;
                }
            }
            else if (key.indexOf('program-') !== -1) {
                var program = typeof (raw[key]) === "string" ? JSON.parse(decodeURIComponent(raw[key])) : (raw[key] ? raw[key] : null);
                if (program == null || (activity_Program.is(program))) {
                    self[key] = program;
                }
            }
        }
        _this.institutionName = raw.institutionName || "";
        _this.institutionDescription = raw.institutionDescription || "";
        _this.institutionAvatar = raw.institutionAvatar;
        return _this;
    }
    Institution.is = function (raw) {
        return raw.type == "institution";
    };
    Institution.prototype.toTransportFormat = function () {
        var obj = _super.prototype.toTransportFormat.call(this);
        var self = this;
        var keys = Object.keys(this);
        for (var _i = 0, keys_7 = keys; _i < keys_7.length; _i++) {
            var key = keys_7[_i];
            if (key.indexOf('member-') !== -1) {
                if (self[key] == null) {
                    obj[key] = self[key];
                }
                else if ((XApiStatement.is(self[key]) && Membership.is(self[key])) || TempMembership.is(self[key])) {
                    obj[key] = encodeURIComponent(JSON.stringify(self[key]));
                }
            }
            else if (key.indexOf('program-') !== -1) {
                if (self[key] == null) {
                    obj[key] = self[key];
                }
                else if (activity_Program.is(self[key])) {
                    obj[key] = encodeURIComponent(JSON.stringify(self[key]));
                }
            }
        }
        obj.institutionName = this.institutionName;
        obj.institutionDescription = this.institutionDescription;
        obj.institutionAvatar = this.institutionAvatar;
        return obj;
    };
    Institution.prototype.addMember = function (membership) {
        this['member-' + membership.id] = membership;
    };
    Institution.prototype.addProgram = function (program) {
        this['program-' + program.id] = program;
    };
    Institution.iterateMembers = function (institution, callback) {
        var keys = Object.keys(institution);
        for (var _i = 0, keys_8 = keys; _i < keys_8.length; _i++) {
            var key = keys_8[_i];
            if (key.indexOf('member-') !== -1 && institution[key]) {
                if (XApiStatement.is(institution[key]) && Membership.is(institution[key])) {
                    callback(key, institution[key]);
                }
                else if (TempMembership.is(institution[key])) {
                    callback(key, institution[key]);
                }
            }
        }
    };
    Institution.isMember = function (institution, userIdentity) {
        var isMember = false;
        var keys = Object.keys(institution);
        for (var _i = 0, keys_9 = keys; _i < keys_9.length; _i++) {
            var key = keys_9[_i];
            if (key.indexOf('member-') !== -1 && institution[key]) {
                if (institution[key].identity === userIdentity) {
                    isMember = true;
                }
            }
        }
        return isMember;
    };
    Institution.iteratePrograms = function (institution, callback) {
        var keys = Object.keys(institution);
        for (var _i = 0, keys_10 = keys; _i < keys_10.length; _i++) {
            var key = keys_10[_i];
            if (key.indexOf('program-') !== -1 && institution[key]) {
                if (activity_Program.is(institution[key])) {
                    callback(key, institution[key]);
                }
            }
        }
    };
    Institution.isProgram = function (institution, programId) {
        var isProgram = false;
        var keys = Object.keys(institution);
        for (var _i = 0, keys_11 = keys; _i < keys_11.length; _i++) {
            var key = keys_11[_i];
            if (key.indexOf('program-') !== -1 && institution[key]) {
                if (institution[key].id === programId) {
                    isProgram = true;
                }
            }
        }
        return isProgram;
    };
    Institution.isNew = function (institution) {
        var isNew = true;
        var keys = Object.keys(institution);
        for (var _i = 0, keys_12 = keys; _i < keys_12.length; _i++) {
            var key = keys_12[_i];
            if (key.indexOf('member-') !== -1) {
                isNew = false;
            }
        }
        return isNew;
    };
    return Institution;
}(Activity));

var activity_System = /** @class */ (function (_super) {
    activity_extends(System, _super);
    function System(raw) {
        var _this = this;
        raw.type = "system";
        _this = _super.call(this, raw) || this;
        var self = _this;
        var rawKeys = Object.keys(raw);
        for (var _i = 0, rawKeys_3 = rawKeys; _i < rawKeys_3.length; _i++) {
            var key = rawKeys_3[_i];
            if (key.indexOf('member-') !== -1) {
                var member = typeof (raw[key]) === "string" ? JSON.parse(decodeURIComponent(raw[key])) : (raw[key] ? raw[key] : null);
                if (member == null || (XApiStatement.is(member) && Membership.is(member)) || TempMembership.is(member)) {
                    self[key] = member;
                }
            }
        }
        _this.systemName = raw.systemName || "";
        _this.systemDescription = raw.systemDescription || "";
        return _this;
    }
    System.is = function (raw) {
        return raw.type == "system";
    };
    System.prototype.toTransportFormat = function () {
        var obj = _super.prototype.toTransportFormat.call(this);
        var self = this;
        var keys = Object.keys(this);
        for (var _i = 0, keys_13 = keys; _i < keys_13.length; _i++) {
            var key = keys_13[_i];
            if (key.indexOf('member-') !== -1) {
                if (self[key] == null) {
                    obj[key] = self[key];
                }
                else if ((XApiStatement.is(self[key]) && Membership.is(self[key])) || TempMembership.is(self[key])) {
                    obj[key] = encodeURIComponent(JSON.stringify(self[key]));
                }
            }
        }
        obj.systemName = this.systemName;
        obj.systemDescription = this.systemDescription;
        return obj;
    };
    System.prototype.addMember = function (membership) {
        this['member-' + membership.id] = membership;
    };
    System.iterateMembers = function (system, callback) {
        var keys = Object.keys(system);
        for (var _i = 0, keys_14 = keys; _i < keys_14.length; _i++) {
            var key = keys_14[_i];
            if (key.indexOf('member-') !== -1 && system[key]) {
                if (XApiStatement.is(system[key]) && Membership.is(system[key])) {
                    callback(key, system[key]);
                }
                else if (TempMembership.is(system[key])) {
                    callback(key, system[key]);
                }
            }
        }
    };
    System.isMember = function (system, userIdentity) {
        var isMember = false;
        var keys = Object.keys(system);
        for (var _i = 0, keys_15 = keys; _i < keys_15.length; _i++) {
            var key = keys_15[_i];
            if (key.indexOf('member-') !== -1 && system[key]) {
                if (system[key].identity === userIdentity) {
                    isMember = true;
                }
            }
        }
        return isMember;
    };
    System.isNew = function (system) {
        var isNew = true;
        var keys = Object.keys(system);
        for (var _i = 0, keys_16 = keys; _i < keys_16.length; _i++) {
            var key = keys_16[_i];
            if (key.indexOf('member-') !== -1) {
                isNew = false;
            }
        }
        return isNew;
    };
    return System;
}(Activity));

// -------------------------------
var Presence = /** @class */ (function (_super) {
    activity_extends(Presence, _super);
    function Presence() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Presence.is = function (raw) {
        return raw.type == "presence";
    };
    return Presence;
}(Activity));

// -------------------------------
function toActivity(obj) {
    var act = null;
    if (activity_Program.is(obj)) {
        act = new activity_Program(obj);
    }
    else if (Learnlet.is(obj)) {
        act = new Learnlet(obj);
    }
    else if (Learnlet.is(obj)) {
        act = new Presence(obj);
    }
    else if (activity_Institution.is(obj)) {
        act = new activity_Institution(obj);
    }
    else if (activity_System.is(obj)) {
        act = new activity_System(obj);
    }
    else
        new Error("Unknown activity type");
    return act;
}

// CONCATENATED MODULE: ./src/storage.ts


var MASTER_INDEX = "master";
var CURRENT_BOOK = "peblCurrentBook";
var CURRENT_USER = "peblCurrentUser";
// const VERB_INDEX = "verbs";
var storage_IndexedDBStorageAdapter = /** @class */ (function () {
    function IndexedDBStorageAdapter(callback) {
        this.invocationQueue = [];
        var request = window.indexedDB.open("pebl", 26);
        var self = this;
        request.onupgradeneeded = function () {
            var db = request.result;
            var objectStores = db.objectStoreNames;
            for (var i = 0; i < objectStores.length; i++)
                db.deleteObjectStore(objectStores[i]);
            var eventStore = db.createObjectStore("events", { keyPath: ["identity", "id"] });
            var annotationStore = db.createObjectStore("annotations", { keyPath: ["identity", "id"] });
            var competencyStore = db.createObjectStore("competencies", { keyPath: ["url", "identity"] });
            var generalAnnotationStore = db.createObjectStore("sharedAnnotations", { keyPath: ["identity", "id"] });
            var outgoingXApiStore = db.createObjectStore("outgoingXApi", { keyPath: ["identity", "id"] });
            var outgoingActivityStore = db.createObjectStore("outgoingActivity", { keyPath: ["identity", "id"] });
            var messageStore = db.createObjectStore("messages", { keyPath: ["identity", "id"] });
            var groupStore = db.createObjectStore("groups", { keyPath: ["identity", "id"] });
            db.createObjectStore("user", { keyPath: "identity" });
            db.createObjectStore("state", { keyPath: "id" });
            db.createObjectStore("assets", { keyPath: ["identity", "id"] });
            var queuedReferences = db.createObjectStore("queuedReferences", { keyPath: ["identity", "id"] });
            var notificationStore = db.createObjectStore("notifications", { keyPath: ["identity", "id"] });
            var tocStore = db.createObjectStore("tocs", { keyPath: ["identity", "book", "section", "pageKey"] });
            db.createObjectStore("lrsAuth", { keyPath: "id" });
            var activityStore = db.createObjectStore("activity", { keyPath: ["identity", "type", "id"] });
            var activityEventStore = db.createObjectStore("activityEvents", { keyPath: ["id", "programId"] });
            var moduleEventStore = db.createObjectStore("moduleEvents", { keyPath: ["id", "idref"] });
            activityStore.createIndex(MASTER_INDEX, ["identity", "type"]);
            activityEventStore.createIndex(MASTER_INDEX, ["programId"]);
            moduleEventStore.createIndex(MASTER_INDEX, ["idref"]);
            eventStore.createIndex(MASTER_INDEX, ["identity", "book"]);
            annotationStore.createIndex(MASTER_INDEX, ["identity", "book"]);
            competencyStore.createIndex(MASTER_INDEX, "identity");
            generalAnnotationStore.createIndex(MASTER_INDEX, "book");
            outgoingActivityStore.createIndex(MASTER_INDEX, "identity");
            outgoingXApiStore.createIndex(MASTER_INDEX, "identity");
            groupStore.createIndex(MASTER_INDEX, "identity");
            messageStore.createIndex(MASTER_INDEX, ["identity", "thread"]);
            queuedReferences.createIndex(MASTER_INDEX, ["identity", "book"]);
            notificationStore.createIndex(MASTER_INDEX, "identity");
            tocStore.createIndex(MASTER_INDEX, ["identity", "book"]);
        };
        request.onsuccess = function () {
            self.db = request.result;
            callback();
            for (var i = 0; i < self.invocationQueue.length; i++)
                self.invocationQueue[i]();
            self.invocationQueue = [];
        };
        request.onerror = function (event) {
            console.log("error opening indexeddb", event);
        };
    }
    IndexedDBStorageAdapter.prototype.getAll = function (index, query, callback) {
        var request = index.openCursor(query);
        var result = [];
        request.onerror = function (e) {
            console.log("Error", query, e);
        };
        request.onsuccess = function () {
            var r = request.result;
            if (result) {
                if (r) {
                    result.push(r.value);
                    r.continue();
                }
                else if (callback != null)
                    callback(result);
            }
            else {
                if (callback != null) {
                    if (r != null)
                        callback(r.value);
                    else
                        callback([]);
                }
            }
        };
    };
    IndexedDBStorageAdapter.prototype.cleanRecord = function (r) {
        var recordType = typeof (r);
        if (r && (recordType == "object")) {
            var rec = r;
            for (var _i = 0, _a = Object.keys(r); _i < _a.length; _i++) {
                var p = _a[_i];
                var v = rec[p];
                var t = typeof (v);
                if (t == "function")
                    delete rec[p];
                else if (t == "array")
                    for (var i = 0; i < v.length; i++)
                        this.cleanRecord(v[i]);
                else if (t == "object")
                    this.cleanRecord(v);
            }
        }
        else if (recordType == "array") {
            var rec = r;
            for (var i = 0; i < rec.length; i++)
                this.cleanRecord(rec[i]);
        }
        return r;
    };
    // -------------------------------
    IndexedDBStorageAdapter.prototype.saveSharedAnnotations = function (userProfile, stmts, callback) {
        if (this.db) {
            if (stmts instanceof SharedAnnotation) {
                var ga = stmts;
                ga.identity = userProfile.identity;
                var request = this.db.transaction(["sharedAnnotations"], "readwrite").objectStore("sharedAnnotations").put(ga);
                request.onerror = function (e) {
                    console.log(e);
                };
                request.onsuccess = function () {
                    if (callback)
                        callback();
                };
            }
            else {
                var objectStore_1 = this.db.transaction(["sharedAnnotations"], "readwrite").objectStore("sharedAnnotations");
                var stmtsCopy_1 = stmts.slice(0);
                var processCallback_1 = function () {
                    var record = stmtsCopy_1.pop();
                    if (record) {
                        var ga = record;
                        ga.identity = userProfile.identity;
                        var request = objectStore_1.put(ga);
                        request.onerror = processCallback_1;
                        request.onsuccess = processCallback_1;
                    }
                    else {
                        if (callback)
                            callback();
                    }
                };
                processCallback_1();
            }
        }
        else {
            var self_1 = this;
            this.invocationQueue.push(function () {
                self_1.saveSharedAnnotations(userProfile, stmts, callback);
            });
        }
    };
    IndexedDBStorageAdapter.prototype.getSharedAnnotations = function (userProfile, book, callback) {
        if (this.db) {
            var index = this.db.transaction(["sharedAnnotations"], "readonly").objectStore("sharedAnnotations").index(MASTER_INDEX);
            var param = book;
            this.getAll(index, IDBKeyRange.only(param), callback);
        }
        else {
            var self_2 = this;
            this.invocationQueue.push(function () {
                self_2.getSharedAnnotations(userProfile, book, callback);
            });
        }
    };
    IndexedDBStorageAdapter.prototype.removeSharedAnnotation = function (userProfile, id, callback) {
        if (this.db) {
            var request = this.db.transaction(["sharedAnnotations"], "readwrite").objectStore("sharedAnnotations").delete(IDBKeyRange.only([userProfile.identity, id]));
            request.onerror = function (e) {
                console.log(e);
            };
            request.onsuccess = function () {
                if (callback)
                    callback();
            };
        }
        else {
            var self_3 = this;
            this.invocationQueue.push(function () {
                self_3.removeSharedAnnotation(userProfile, id, callback);
            });
        }
    };
    // -------------------------------
    IndexedDBStorageAdapter.prototype.getAnnotations = function (userProfile, book, callback) {
        if (this.db) {
            var index = this.db.transaction(["annotations"], "readonly").objectStore("annotations").index(MASTER_INDEX);
            var param = [userProfile.identity, book];
            this.getAll(index, IDBKeyRange.only(param), callback);
        }
        else {
            var self_4 = this;
            this.invocationQueue.push(function () {
                self_4.getAnnotations(userProfile, book, callback);
            });
        }
    };
    IndexedDBStorageAdapter.prototype.saveAnnotations = function (userProfile, stmts, callback) {
        if (this.db) {
            if (stmts instanceof Annotation) {
                var ga = stmts;
                ga.identity = userProfile.identity;
                var request = this.db.transaction(["annotations"], "readwrite").objectStore("annotations").put(ga);
                request.onerror = function (e) {
                    console.log(e);
                };
                request.onsuccess = function () {
                    if (callback)
                        callback();
                };
            }
            else {
                var objectStore_2 = this.db.transaction(["annotations"], "readwrite").objectStore("annotations");
                var stmtsCopy_2 = stmts.slice(0);
                var self_5 = this;
                var processCallback_2 = function () {
                    var record = stmtsCopy_2.pop();
                    if (record) {
                        var clone = record;
                        clone.identity = userProfile.identity;
                        var request = objectStore_2.put(self_5.cleanRecord(clone));
                        request.onerror = processCallback_2;
                        request.onsuccess = processCallback_2;
                    }
                    else {
                        if (callback)
                            callback();
                    }
                };
                processCallback_2();
            }
        }
        else {
            var self_6 = this;
            this.invocationQueue.push(function () {
                self_6.saveAnnotations(userProfile, stmts, callback);
            });
        }
    };
    IndexedDBStorageAdapter.prototype.removeAnnotation = function (userProfile, id, callback) {
        if (this.db) {
            var request = this.db.transaction(["annotations"], "readwrite").objectStore("annotations").delete(IDBKeyRange.only([userProfile.identity, id]));
            request.onerror = function (e) {
                console.log(e);
            };
            request.onsuccess = function () {
                if (callback)
                    callback();
            };
        }
        else {
            var self_7 = this;
            this.invocationQueue.push(function () {
                self_7.removeAnnotation(userProfile, id, callback);
            });
        }
    };
    // -------------------------------
    IndexedDBStorageAdapter.prototype.removeCurrentUser = function (callback) {
        if (this.db) {
            var request = this.db.transaction(["state"], "readwrite").objectStore("state").delete(IDBKeyRange.only(CURRENT_USER));
            request.onerror = function (e) {
                console.log(e);
            };
            request.onsuccess = function () {
                if (callback)
                    callback();
            };
        }
        else {
            var self_8 = this;
            this.invocationQueue.push(function () {
                self_8.removeCurrentUser(callback);
            });
        }
    };
    IndexedDBStorageAdapter.prototype.saveCurrentUser = function (userProfile, callback) {
        var pack = {
            id: CURRENT_USER,
            value: userProfile.identity
        };
        if (this.db) {
            var request = this.db.transaction(["state"], "readwrite").objectStore("state").put(this.cleanRecord(pack));
            request.onerror = function (e) {
                console.log(e);
            };
            request.onsuccess = function () {
                if (callback)
                    callback();
            };
        }
        else {
            var self_9 = this;
            this.invocationQueue.push(function () {
                self_9.saveCurrentUser(userProfile, callback);
            });
        }
    };
    IndexedDBStorageAdapter.prototype.getCurrentUser = function (callback) {
        if (this.db) {
            var request_1 = this.db.transaction(["state"], "readonly").objectStore("state").get(CURRENT_USER);
            request_1.onerror = function (e) {
                console.log(e);
            };
            request_1.onsuccess = function () {
                var r = request_1.result;
                if (r != null)
                    callback(r.value);
                else
                    callback();
            };
        }
        else {
            var self_10 = this;
            this.invocationQueue.push(function () {
                self_10.getCurrentUser(callback);
            });
        }
    };
    // -------------------------------
    IndexedDBStorageAdapter.prototype.getUserProfile = function (userIdentity, callback) {
        if (this.db) {
            var request_2 = this.db.transaction(["user"], "readonly").objectStore("user").get(userIdentity);
            request_2.onerror = function (e) {
                console.log(e);
            };
            request_2.onsuccess = function () {
                var r = request_2.result;
                if (r != null)
                    callback(r);
                else
                    callback();
            };
        }
        else {
            var self_11 = this;
            this.invocationQueue.push(function () {
                self_11.getUserProfile(userIdentity, callback);
            });
        }
    };
    IndexedDBStorageAdapter.prototype.saveUserProfile = function (userProfile, callback) {
        if (this.db) {
            var request = this.db.transaction(["user"], "readwrite").objectStore("user").put(this.cleanRecord(userProfile));
            request.onerror = function (e) {
                console.log(e);
            };
            request.onsuccess = function () {
                if (callback)
                    callback();
            };
        }
        else {
            var self_12 = this;
            this.invocationQueue.push(function () {
                self_12.saveUserProfile(userProfile, callback);
            });
        }
    };
    // -------------------------------
    IndexedDBStorageAdapter.prototype.saveCurrentActivity = function (book, callback) {
        var pack = {
            value: book,
            id: CURRENT_BOOK
        };
        if (this.db) {
            var request = this.db.transaction(["state"], "readwrite").objectStore("state").put(this.cleanRecord(pack));
            request.onerror = function (e) {
                console.log(e);
            };
            request.onsuccess = function () {
                if (callback)
                    callback();
            };
        }
        else {
            var self_13 = this;
            this.invocationQueue.push(function () {
                self_13.saveCurrentActivity(book, callback);
            });
        }
    };
    IndexedDBStorageAdapter.prototype.getCurrentActivity = function (callback) {
        if (this.db) {
            var request_3 = this.db.transaction(["state"], "readonly").objectStore("state").get(CURRENT_BOOK);
            request_3.onerror = function (e) {
                console.log(e);
            };
            request_3.onsuccess = function () {
                var r = request_3.result;
                if (callback != null) {
                    if (r != null)
                        callback(r.value);
                    else
                        callback();
                }
            };
        }
        else {
            var self_14 = this;
            this.invocationQueue.push(function () {
                self_14.getCurrentActivity(callback);
            });
        }
    };
    IndexedDBStorageAdapter.prototype.removeCurrentActivity = function (callback) {
        if (this.db) {
            var request = this.db.transaction(["state"], "readwrite").objectStore("state").delete(IDBKeyRange.only(CURRENT_BOOK));
            request.onerror = function (e) {
                console.log(e);
            };
            request.onsuccess = function () {
                if (callback)
                    callback();
            };
        }
        else {
            var self_15 = this;
            this.invocationQueue.push(function () {
                self_15.removeCurrentActivity(callback);
            });
        }
    };
    // -------------------------------
    IndexedDBStorageAdapter.prototype.saveCurrentBook = function (book, callback) {
        var pack = {
            value: book,
            id: CURRENT_BOOK
        };
        if (this.db) {
            var request = this.db.transaction(["state"], "readwrite").objectStore("state").put(this.cleanRecord(pack));
            request.onerror = function (e) {
                console.log(e);
            };
            request.onsuccess = function () {
                if (callback)
                    callback();
            };
        }
        else {
            var self_16 = this;
            this.invocationQueue.push(function () {
                self_16.saveCurrentBook(book, callback);
            });
        }
    };
    IndexedDBStorageAdapter.prototype.getCurrentBook = function (callback) {
        if (this.db) {
            var request_4 = this.db.transaction(["state"], "readonly").objectStore("state").get(CURRENT_BOOK);
            request_4.onerror = function (e) {
                console.log(e);
            };
            request_4.onsuccess = function () {
                var r = request_4.result;
                if (callback != null) {
                    if (r != null)
                        callback(r.value);
                    else
                        callback();
                }
            };
        }
        else {
            var self_17 = this;
            this.invocationQueue.push(function () {
                self_17.getCurrentBook(callback);
            });
        }
    };
    // -------------------------------
    IndexedDBStorageAdapter.prototype.saveEvent = function (userProfile, events, callback) {
        if (this.db) {
            if (events instanceof XApiStatement) {
                var ga = events;
                ga.identity = userProfile.identity;
                var request = this.db.transaction(["events"], "readwrite").objectStore("events").put(ga);
                request.onerror = function (e) {
                    console.log(e);
                };
                request.onsuccess = function () {
                    if (callback)
                        callback();
                };
            }
            else {
                var objectStore_3 = this.db.transaction(["events"], "readwrite").objectStore("events");
                var stmtsCopy_3 = events.slice(0);
                var self_18 = this;
                var processCallback_3 = function () {
                    var record = stmtsCopy_3.pop();
                    if (record) {
                        var clone = record;
                        clone.identity = userProfile.identity;
                        var request = objectStore_3.put(self_18.cleanRecord(clone));
                        request.onerror = processCallback_3;
                        request.onsuccess = processCallback_3;
                    }
                    else {
                        if (callback)
                            callback();
                    }
                };
                processCallback_3();
            }
        }
        else {
            var self_19 = this;
            this.invocationQueue.push(function () {
                self_19.saveEvent(userProfile, events, callback);
            });
        }
    };
    IndexedDBStorageAdapter.prototype.getEvents = function (userProfile, book, callback) {
        if (this.db) {
            var index = this.db.transaction(["events"], "readonly").objectStore("events").index(MASTER_INDEX);
            var param = [userProfile.identity, book];
            var self_20 = this;
            self_20.getAll(index, IDBKeyRange.only(param), callback);
        }
        else {
            var self_21 = this;
            this.invocationQueue.push(function () {
                self_21.getEvents(userProfile, book, callback);
            });
        }
    };
    // -------------------------------
    IndexedDBStorageAdapter.prototype.getCompetencies = function (userProfile, callback) {
        if (this.db) {
            var os = this.db.transaction(["competencies"], "readonly").objectStore("competencies");
            var index_1 = os.index(MASTER_INDEX);
            var param_1 = userProfile.identity;
            var self_22 = this;
            this.getAll(index_1, IDBKeyRange.only(param_1), function (arr) {
                if (arr.length == 0)
                    self_22.getAll(index_1, IDBKeyRange.only([param_1]), callback);
                else
                    callback(arr);
            });
        }
        else {
            var self_23 = this;
            this.invocationQueue.push(function () {
                self_23.getCompetencies(userProfile, callback);
            });
        }
    };
    IndexedDBStorageAdapter.prototype.saveCompetencies = function (userProfile, competencies, callback) {
        if (this.db) {
            var os_1 = this.db.transaction(["competencies"], "readwrite").objectStore("competencies");
            for (var _i = 0, _a = Object.keys(competencies); _i < _a.length; _i++) {
                var p = _a[_i];
                var c = competencies[p];
                c.url = p;
                c.identity = userProfile.identity;
                competencies.push(c);
            }
            var self_24 = this;
            var processCallback_4 = function () {
                if (competencies.length > 0) {
                    var record = competencies.pop();
                    var request = os_1.put(self_24.cleanRecord(record));
                    request.onerror = processCallback_4;
                    request.onsuccess = processCallback_4;
                }
                else {
                    if (callback)
                        callback();
                }
            };
            processCallback_4();
        }
        else {
            var self_25 = this;
            this.invocationQueue.push(function () {
                self_25.saveCompetencies(userProfile, competencies, callback);
            });
        }
    };
    // -------------------------------
    IndexedDBStorageAdapter.prototype.saveOutgoingXApi = function (userProfile, stmt, callback) {
        if (this.db) {
            var clone = stmt.toXAPI();
            clone.identity = userProfile.identity;
            var request = this.db.transaction(["outgoingXApi"], "readwrite").objectStore("outgoingXApi").put(this.cleanRecord(clone));
            request.onerror = function (e) {
                console.log(e);
            };
            request.onsuccess = function () {
                if (callback)
                    callback();
            };
        }
        else {
            var self_26 = this;
            this.invocationQueue.push(function () {
                self_26.saveOutgoingXApi(userProfile, stmt, callback);
            });
        }
    };
    IndexedDBStorageAdapter.prototype.getOutgoingXApi = function (userProfile, callback) {
        if (this.db) {
            var os = this.db.transaction(["outgoingXApi"], "readonly").objectStore("outgoingXApi");
            var index_2 = os.index(MASTER_INDEX);
            var param_2 = userProfile.identity;
            var self_27 = this;
            this.getAll(index_2, IDBKeyRange.only(param_2), function (arr) {
                if (arr.length == 0)
                    self_27.getAll(index_2, IDBKeyRange.only([param_2]), callback);
                else
                    callback(arr);
            });
        }
        else {
            var self_28 = this;
            this.invocationQueue.push(function () {
                self_28.getOutgoingXApi(userProfile, callback);
            });
        }
    };
    IndexedDBStorageAdapter.prototype.removeOutgoingXApi = function (userProfile, toClear, callback) {
        if (this.db) {
            var objectStore_4 = this.db.transaction(["outgoingXApi"], "readwrite").objectStore("outgoingXApi");
            var toClearCopy_1 = toClear.slice(0);
            var processCallback_5 = function () {
                if (toClear.length > 0) {
                    var record = toClearCopy_1.pop();
                    if (record) {
                        var request = objectStore_4.delete(IDBKeyRange.only([userProfile.identity, record.id]));
                        request.onerror = processCallback_5;
                        request.onsuccess = processCallback_5;
                    }
                    else {
                        if (callback)
                            callback();
                    }
                }
            };
            processCallback_5();
        }
        else {
            var self_29 = this;
            this.invocationQueue.push(function () {
                self_29.removeOutgoingXApi(userProfile, toClear, callback);
            });
        }
    };
    // -------------------------------
    IndexedDBStorageAdapter.prototype.saveMessages = function (userProfile, stmts, callback) {
        if (this.db) {
            if (stmts instanceof Message) {
                var clone = stmts;
                clone.identity = userProfile.identity;
                var request = this.db.transaction(["messages"], "readwrite").objectStore("messages").put(this.cleanRecord(clone));
                request.onerror = function (e) {
                    console.log(e);
                };
                request.onsuccess = function () {
                    if (callback)
                        callback();
                };
            }
            else {
                var objectStore_5 = this.db.transaction(["messages"], "readwrite").objectStore("messages");
                var stmtsCopy_4 = stmts.slice(0);
                var self_30 = this;
                var processCallback_6 = function () {
                    var record = stmtsCopy_4.pop();
                    if (record) {
                        var clone = record;
                        clone.identity = userProfile.identity;
                        var request = objectStore_5.put(self_30.cleanRecord(clone));
                        request.onerror = processCallback_6;
                        request.onsuccess = processCallback_6;
                    }
                    else if (callback)
                        callback();
                };
                processCallback_6();
            }
        }
        else {
            var self_31 = this;
            this.invocationQueue.push(function () {
                self_31.saveMessages(userProfile, stmts, callback);
            });
        }
    };
    IndexedDBStorageAdapter.prototype.removeMessage = function (userProfile, id, callback) {
        if (this.db) {
            var request = this.db.transaction(["messages"], "readwrite").objectStore("messages").delete(IDBKeyRange.only([userProfile.identity, id]));
            request.onerror = function (e) {
                console.log(e);
            };
            request.onsuccess = function () {
                if (callback)
                    callback();
            };
        }
        else {
            var self_32 = this;
            this.invocationQueue.push(function () {
                self_32.removeMessage(userProfile, id, callback);
            });
        }
    };
    IndexedDBStorageAdapter.prototype.getMessages = function (userProfile, thread, callback) {
        if (this.db) {
            var index = this.db.transaction(["messages"], "readonly").objectStore("messages").index(MASTER_INDEX);
            this.getAll(index, IDBKeyRange.only([userProfile.identity, thread]), callback);
        }
        else {
            var self_33 = this;
            this.invocationQueue.push(function () {
                self_33.getMessages(userProfile, thread, callback);
            });
        }
    };
    // -------------------------------
    IndexedDBStorageAdapter.prototype.saveAsset = function (assetId, data, callback) {
        // data.id = id;
        // data.content = new Blob([data.content.response], { type: data.content.getResponseHeader("Content-Type") });
        // let request = this.db.transaction(["assets"], "readwrite").objectStore("assets").put(cleanRecord(data));
        // request.onerror = function(e) {
        //     // console.log(e);
        // };
        // request.onabort = function(e) {
        //     console.log("Abort", query, e);
        // };
        // request.onsuccess = function(e) {
        //     // console.log(e);
        // };
        throw new Error("Method not implemented.");
    };
    IndexedDBStorageAdapter.prototype.getAsset = function (assetId, callback) {
        // let request = this.db.transaction(["assets"], "readonly").objectStore("assets").get(id);
        // request.onerror = function(e) {
        //     //console.log(e);
        // };
        // request.onsuccess = function(e) {
        //     if (callback != null)
        //         callback(e.target.result);
        // };
        throw new Error("Method not implemented.");
    };
    // -------------------------------
    IndexedDBStorageAdapter.prototype.saveQueuedReference = function (userProfile, ref, callback) {
        if (this.db) {
            ref.identity = userProfile.identity;
            var request = this.db.transaction(["queuedReferences"], "readwrite").objectStore("queuedReferences").put(this.cleanRecord(ref));
            request.onerror = function (e) {
                console.log(e);
            };
            request.onsuccess = function () {
                if (callback)
                    callback();
            };
        }
        else {
            var self_34 = this;
            this.invocationQueue.push(function () {
                self_34.saveQueuedReference(userProfile, ref, callback);
            });
        }
    };
    IndexedDBStorageAdapter.prototype.getQueuedReference = function (userProfile, currentBook, callback) {
        if (this.db) {
            var os = this.db.transaction(["queuedReferences"], "readonly").objectStore("queuedReferences");
            var index_3 = os.index(MASTER_INDEX);
            var request_5 = index_3.openCursor(IDBKeyRange.only([userProfile.identity, currentBook]));
            request_5.onerror = function (e) {
                console.log(e);
            };
            request_5.onsuccess = function () {
                if (request_5.result == null) {
                    var req = index_3.openCursor(IDBKeyRange.only([userProfile.identity, currentBook]));
                    req.onerror = function (e) {
                        console.log(e);
                    };
                    req.onsuccess = function () {
                        if (callback && request_5.result)
                            callback(request_5.result.value);
                        else
                            callback();
                    };
                }
                else if (callback && request_5.result)
                    callback(request_5.result.value);
                else
                    callback();
            };
        }
        else {
            var self_35 = this;
            this.invocationQueue.push(function () {
                self_35.getQueuedReference(userProfile, currentBook, callback);
            });
        }
    };
    IndexedDBStorageAdapter.prototype.removeQueuedReference = function (userProfile, refId, callback) {
        if (this.db) {
            var request = this.db.transaction(["queuedReferences"], "readwrite").objectStore("queuedReferences").delete(IDBKeyRange.only([userProfile.identity, refId]));
            request.onerror = function (e) {
                console.log(e);
            };
            request.onsuccess = function () {
                if (callback)
                    callback();
            };
        }
        else {
            var self_36 = this;
            this.invocationQueue.push(function () {
                self_36.removeQueuedReference(userProfile, refId, callback);
            });
        }
    };
    // -------------------------------
    IndexedDBStorageAdapter.prototype.saveToc = function (userProfile, book, data, callback) {
        if (this.db) {
            data.identity = userProfile.identity;
            data.book = book;
            var request = this.db.transaction(["tocs"], "readwrite").objectStore("tocs").put(this.cleanRecord(data));
            request.onerror = function (e) {
                console.log(e);
            };
            request.onsuccess = function () {
                if (callback)
                    callback();
            };
        }
        else {
            var self_37 = this;
            this.invocationQueue.push(function () {
                self_37.saveToc(userProfile, book, data, callback);
            });
        }
    };
    IndexedDBStorageAdapter.prototype.getToc = function (userProfile, book, callback) {
        //TODO Remove me
        if (book == null) {
            callback([]);
            return;
        }
        if (this.db) {
            var os = this.db.transaction(["tocs"], "readonly").objectStore("tocs");
            var index = os.index(MASTER_INDEX);
            this.getAll(index, IDBKeyRange.only([userProfile.identity, book]), callback);
        }
        else {
            var self_38 = this;
            this.invocationQueue.push(function () {
                self_38.getToc(userProfile, book, callback);
            });
        }
    };
    IndexedDBStorageAdapter.prototype.removeToc = function (userProfile, book, section, id, callback) {
        if (this.db) {
            var request = this.db.transaction(["tocs"], "readwrite").objectStore("tocs").delete(IDBKeyRange.only([userProfile.identity, book, section, id]));
            request.onerror = function (e) {
                console.log(e);
            };
            request.onsuccess = function () {
                if (callback)
                    callback();
            };
        }
        else {
            var self_39 = this;
            this.invocationQueue.push(function () {
                self_39.removeToc(userProfile, book, section, id, callback);
            });
        }
    };
    // -------------------------------
    IndexedDBStorageAdapter.prototype.saveNotification = function (userProfile, notification, callback) {
        if (this.db) {
            notification.identity = userProfile.identity;
            var request = this.db.transaction(["notifications"], "readwrite").objectStore("notifications").put(this.cleanRecord(notification));
            request.onerror = function (e) {
                console.log(e);
            };
            request.onsuccess = function () {
                if (callback)
                    callback();
            };
        }
        else {
            var self_40 = this;
            this.invocationQueue.push(function () {
                self_40.saveNotification(userProfile, notification, callback);
            });
        }
    };
    IndexedDBStorageAdapter.prototype.getNotifications = function (userProfile, callback) {
        if (this.db) {
            var os = this.db.transaction(["notifications"], "readonly").objectStore("notifications");
            var index_4 = os.index(MASTER_INDEX);
            var param_3 = userProfile.identity;
            var self_41 = this;
            this.getAll(index_4, IDBKeyRange.only(param_3), function (arr) {
                if (arr.length == 0)
                    self_41.getAll(index_4, IDBKeyRange.only([param_3]), callback);
                else
                    callback(arr);
            });
        }
        else {
            var self_42 = this;
            this.invocationQueue.push(function () {
                self_42.getNotifications(userProfile, callback);
            });
        }
    };
    IndexedDBStorageAdapter.prototype.removeNotification = function (userProfile, notificationId, callback) {
        if (this.db) {
            var request = this.db.transaction(["notifications"], "readwrite").objectStore("notifications").delete(IDBKeyRange.only([userProfile.identity, notificationId]));
            request.onerror = function (e) {
                console.log(e);
            };
            request.onsuccess = function () {
                if (callback)
                    callback();
            };
        }
        else {
            var self_43 = this;
            this.invocationQueue.push(function () {
                self_43.removeNotification(userProfile, notificationId, callback);
            });
        }
    };
    // -------------------------------
    IndexedDBStorageAdapter.prototype.saveGroupMembership = function (userProfile, stmts, callback) {
        if (this.db) {
            if (stmts instanceof Membership) {
                var ga = stmts;
                ga.identity = userProfile.identity;
                var request = this.db.transaction(["groups"], "readwrite").objectStore("groups").put(ga);
                request.onerror = function (e) {
                    console.log(e);
                };
                request.onsuccess = function () {
                    if (callback)
                        callback();
                };
            }
            else {
                var objectStore_6 = this.db.transaction(["groups"], "readwrite").objectStore("groups");
                var stmtsCopy_5 = stmts.slice(0);
                var self_44 = this;
                var processCallback_7 = function () {
                    var record = stmtsCopy_5.pop();
                    if (record) {
                        var clone = record;
                        clone.identity = userProfile.identity;
                        var request = objectStore_6.put(self_44.cleanRecord(clone));
                        request.onerror = processCallback_7;
                        request.onsuccess = processCallback_7;
                    }
                    else {
                        if (callback)
                            callback();
                    }
                };
                processCallback_7();
            }
        }
        else {
            var self_45 = this;
            this.invocationQueue.push(function () {
                self_45.saveGroupMembership(userProfile, stmts, callback);
            });
        }
    };
    IndexedDBStorageAdapter.prototype.getGroupMembership = function (userProfile, callback) {
        if (this.db) {
            var os = this.db.transaction(["groups"], "readonly").objectStore("groups");
            var index_5 = os.index(MASTER_INDEX);
            var param_4 = userProfile.identity;
            var self_46 = this;
            this.getAll(index_5, IDBKeyRange.only(param_4), function (arr) {
                if (arr.length == 0)
                    self_46.getAll(index_5, IDBKeyRange.only([param_4]), callback);
                else
                    callback(arr);
            });
        }
        else {
            var self_47 = this;
            this.invocationQueue.push(function () {
                self_47.getGroupMembership(userProfile, callback);
            });
        }
    };
    IndexedDBStorageAdapter.prototype.removeGroupMembership = function (userProfile, xId, callback) {
        if (this.db) {
            var request = this.db.transaction(["groups"], "readwrite").objectStore("groups").delete(IDBKeyRange.only([userProfile.identity, xId]));
            request.onerror = function (e) {
                console.log(e);
            };
            request.onsuccess = function () {
                if (callback)
                    callback();
            };
        }
        else {
            var self_48 = this;
            this.invocationQueue.push(function () {
                self_48.removeGroupMembership(userProfile, xId, callback);
            });
        }
    };
    // -------------------------------
    IndexedDBStorageAdapter.prototype.getActivityEvent = function (programId, callback) {
        if (this.db) {
            var os = this.db.transaction(["activityEvents"], "readonly").objectStore("activityEvents");
            var index_6 = os.index(MASTER_INDEX);
            var param_5 = programId;
            var self_49 = this;
            this.getAll(index_6, IDBKeyRange.only(param_5), function (arr) {
                if (arr.length == 0)
                    self_49.getAll(index_6, IDBKeyRange.only([param_5]), callback);
                else
                    callback(arr);
            });
        }
        else {
            var self_50 = this;
            this.invocationQueue.push(function () {
                self_50.getActivityEvent(programId, callback);
            });
        }
    };
    IndexedDBStorageAdapter.prototype.saveActivityEvent = function (userProfile, stmts, callback) {
        if (this.db) {
            if (stmts instanceof ProgramAction) {
                var ga = stmts;
                ga.identity = ga.actor.account.name;
                var request = this.db.transaction(["activityEvents"], "readwrite").objectStore("activityEvents").put(ga);
                request.onerror = function (e) {
                    console.log(e);
                };
                request.onsuccess = function () {
                    if (callback)
                        callback();
                };
            }
            else {
                var objectStore_7 = this.db.transaction(["activityEvents"], "readwrite").objectStore("activityEvents");
                var stmtsCopy_6 = stmts.slice(0);
                var self_51 = this;
                var processCallback_8 = function () {
                    var record = stmtsCopy_6.pop();
                    if (record) {
                        var clone = record;
                        clone.identity = clone.actor.account.name;
                        var request = objectStore_7.put(self_51.cleanRecord(clone));
                        request.onerror = processCallback_8;
                        request.onsuccess = processCallback_8;
                    }
                    else {
                        if (callback)
                            callback();
                    }
                };
                processCallback_8();
            }
        }
        else {
            var self_52 = this;
            this.invocationQueue.push(function () {
                self_52.saveActivityEvent(userProfile, stmts, callback);
            });
        }
    };
    // -------------------------------
    IndexedDBStorageAdapter.prototype.getModuleEvent = function (idref, callback) {
        if (this.db) {
            var os = this.db.transaction(["moduleEvents"], "readonly").objectStore("moduleEvents");
            var index_7 = os.index(MASTER_INDEX);
            var param_6 = idref;
            var self_53 = this;
            this.getAll(index_7, IDBKeyRange.only(param_6), function (arr) {
                if (arr.length == 0)
                    self_53.getAll(index_7, IDBKeyRange.only([param_6]), callback);
                else
                    callback(arr);
            });
        }
        else {
            var self_54 = this;
            this.invocationQueue.push(function () {
                self_54.getModuleEvent(idref, callback);
            });
        }
    };
    IndexedDBStorageAdapter.prototype.saveModuleEvent = function (userProfile, stmts, callback) {
        if (this.db) {
            if (stmts instanceof ModuleEvent) {
                var ga = stmts;
                ga.identity = ga.actor.account.name;
                var request = this.db.transaction(["moduleEvents"], "readwrite").objectStore("moduleEvents").put(ga);
                request.onerror = function (e) {
                    console.log(e);
                };
                request.onsuccess = function () {
                    if (callback)
                        callback();
                };
            }
            else {
                var objectStore_8 = this.db.transaction(["moduleEvents"], "readwrite").objectStore("moduleEvents");
                var stmtsCopy_7 = stmts.slice(0);
                var self_55 = this;
                var processCallback_9 = function () {
                    var record = stmtsCopy_7.pop();
                    if (record) {
                        var clone = record;
                        clone.identity = clone.actor.account.name;
                        var request = objectStore_8.put(self_55.cleanRecord(clone));
                        request.onerror = processCallback_9;
                        request.onsuccess = processCallback_9;
                    }
                    else {
                        if (callback)
                            callback();
                    }
                };
                processCallback_9();
            }
        }
        else {
            var self_56 = this;
            this.invocationQueue.push(function () {
                self_56.saveModuleEvent(userProfile, stmts, callback);
            });
        }
    };
    IndexedDBStorageAdapter.prototype.removeModuleEvent = function (idref, xId, callback) {
        if (this.db) {
            var request = this.db.transaction(["moduleEvents"], "readwrite").objectStore("moduleEvents").delete(IDBKeyRange.only([xId, idref]));
            request.onerror = function (e) {
                console.log(e);
            };
            request.onsuccess = function () {
                if (callback)
                    callback();
            };
        }
        else {
            var self_57 = this;
            this.invocationQueue.push(function () {
                self_57.removeModuleEvent(idref, xId, callback);
            });
        }
    };
    // -------------------------------
    IndexedDBStorageAdapter.prototype.saveActivity = function (userProfile, stmts, callback) {
        if (this.db) {
            if ((stmts instanceof Activity) || Activity.is(stmts)) {
                var ga = (stmts instanceof Activity) ? stmts : toActivity(stmts);
                if (ga) {
                    ga.identity = userProfile.identity;
                    var request = this.db.transaction(["activity"], "readwrite").objectStore("activity").put(ga);
                    request.onerror = function (e) {
                        console.log(e);
                    };
                    request.onsuccess = function () {
                        if (callback)
                            callback();
                    };
                }
            }
            else {
                var objectStore_9 = this.db.transaction(["activity"], "readwrite").objectStore("activity");
                var stmtsCopy_8 = stmts.slice(0);
                var self_58 = this;
                var processCallback_10 = function () {
                    var record = stmtsCopy_8.pop();
                    if (record) {
                        var clone = record;
                        clone.identity = userProfile.identity;
                        var request = objectStore_9.put(self_58.cleanRecord(clone));
                        request.onerror = processCallback_10;
                        request.onsuccess = processCallback_10;
                    }
                    else {
                        if (callback)
                            callback();
                    }
                };
                processCallback_10();
            }
        }
        else {
            var self_59 = this;
            this.invocationQueue.push(function () {
                self_59.saveActivity(userProfile, stmts, callback);
            });
        }
    };
    IndexedDBStorageAdapter.prototype.getActivity = function (userProfile, activityType, callback) {
        if (this.db) {
            var os = this.db.transaction(["activity"], "readonly").objectStore("activity");
            var index = os.index(MASTER_INDEX);
            var param = [userProfile.identity, activityType];
            var self_60 = this;
            self_60.getAll(index, IDBKeyRange.only(param), callback);
        }
        else {
            var self_61 = this;
            this.invocationQueue.push(function () {
                self_61.getActivity(userProfile, activityType, callback);
            });
        }
    };
    IndexedDBStorageAdapter.prototype.getActivityById = function (userProfile, activityType, activityId, callback) {
        if (this.db) {
            var param = [userProfile.identity, activityType, activityId];
            var request_6 = this.db.transaction(["activity"], "readonly").objectStore("activity").get(param);
            request_6.onerror = function (e) {
                console.log(e);
            };
            request_6.onsuccess = function () {
                var r = request_6.result;
                if (r != null)
                    callback(r);
                else
                    callback();
            };
        }
        else {
            var self_62 = this;
            this.invocationQueue.push(function () {
                self_62.getActivityById(userProfile, activityType, activityId, callback);
            });
        }
    };
    IndexedDBStorageAdapter.prototype.removeActivity = function (userProfile, xId, activityType, callback) {
        if (this.db) {
            var request = this.db.transaction(["activity"], "readwrite").objectStore("activity").delete(IDBKeyRange.only([userProfile.identity, activityType, xId]));
            request.onerror = function (e) {
                console.log(e);
            };
            request.onsuccess = function () {
                if (callback)
                    callback();
            };
        }
        else {
            var self_63 = this;
            this.invocationQueue.push(function () {
                self_63.removeActivity(userProfile, xId, activityType, callback);
            });
        }
    };
    // -------------------------------
    IndexedDBStorageAdapter.prototype.saveOutgoingActivity = function (userProfile, stmt, callback) {
        if (this.db) {
            var clone = stmt;
            clone.identity = userProfile.identity;
            var request = this.db.transaction(["outgoingActivity"], "readwrite").objectStore("outgoingActivity").put(this.cleanRecord(clone));
            request.onerror = function (e) {
                console.log(e);
            };
            request.onsuccess = function () {
                if (callback)
                    callback();
            };
        }
        else {
            var self_64 = this;
            this.invocationQueue.push(function () {
                self_64.saveOutgoingActivity(userProfile, stmt, callback);
            });
        }
    };
    IndexedDBStorageAdapter.prototype.getOutgoingActivity = function (userProfile, callback) {
        if (this.db) {
            var os = this.db.transaction(["outgoingActivity"], "readonly").objectStore("outgoingActivity");
            var index_8 = os.index(MASTER_INDEX);
            var param_7 = userProfile.identity;
            var self_65 = this;
            this.getAll(index_8, IDBKeyRange.only(param_7), function (arr) {
                if (arr.length == 0)
                    self_65.getAll(index_8, IDBKeyRange.only([param_7]), callback);
                else
                    callback(arr);
            });
        }
        else {
            var self_66 = this;
            this.invocationQueue.push(function () {
                self_66.getOutgoingActivity(userProfile, callback);
            });
        }
    };
    IndexedDBStorageAdapter.prototype.removeOutgoingActivity = function (userProfile, toClear, callback) {
        if (this.db) {
            var objectStore = this.db.transaction(["outgoingActivity"], "readwrite").objectStore("outgoingActivity");
            var request = objectStore.delete(IDBKeyRange.only([userProfile.identity, toClear.id]));
            if (callback) {
                request.onerror = callback;
                request.onsuccess = callback;
            }
        }
        else {
            var self_67 = this;
            this.invocationQueue.push(function () {
                self_67.removeOutgoingActivity(userProfile, toClear, callback);
            });
        }
    };
    return IndexedDBStorageAdapter;
}());


// CONCATENATED MODULE: ./src/user.ts
var User = /** @class */ (function () {
    function User(pebl) {
        this.pebl = pebl;
    }
    User.prototype.isLoggedIn = function (callback) {
        this.pebl.storage.getCurrentUser(function (currentUser) {
            callback(currentUser != null);
        });
    };
    User.prototype.getUser = function (callback) {
        var self = this;
        this.pebl.storage.getCurrentUser(function (currentUser) {
            if (currentUser) {
                self.pebl.storage.getUserProfile(currentUser, function (userProfile) {
                    if (userProfile)
                        callback(userProfile);
                    else
                        callback();
                });
            }
            else
                callback();
        });
    };
    return User;
}());


// CONCATENATED MODULE: ./src/syncing.ts
var USER_PREFIX = "user-";
var GROUP_PREFIX = "group-";
var PEBL_THREAD_PREFIX = "peblThread://";
// const PEBL_THREAD_REGISTRY = "peblThread://registry";
var PEBL_THREAD_USER_PREFIX = "peblThread://" + USER_PREFIX;
var PEBL_THREAD_GROUP_PREFIX = "peblThread://" + GROUP_PREFIX;
var THREAD_POLL_INTERVAL = 4000;
var BOOK_POLL_INTERVAL = 6000;
var MODULE_POLL_INTERVAL = 6000;
// const PRESENCE_POLL_INTERVAL = 120000;
// const LEARNLET_POLL_INTERVAL = 60000;
var PROGRAM_POLL_INTERVAL = 60000;
var INSTITUTION_POLL_INTERVAL = 60000;
var SYSTEM_POLL_INTERVAL = 60000;



var syncing_LLSyncAction = /** @class */ (function () {
    function LLSyncAction(pebl, endpoint) {
        this.bookPoll = null;
        this.modulePoll = null;
        this.threadPoll = null;
        this.activityPolls = {};
        this.running = false;
        this.pebl = pebl;
        this.endpoint = endpoint;
        this.pull();
    }
    LLSyncAction.prototype.clearTimeouts = function () {
        if (this.bookPoll)
            clearTimeout(this.bookPoll);
        this.bookPoll = null;
        if (this.modulePoll)
            clearTimeout(this.modulePoll);
        this.modulePoll = null;
        if (this.threadPoll)
            clearTimeout(this.threadPoll);
        this.threadPoll = null;
        for (var key in this.activityPolls)
            clearTimeout(this.activityPolls[key]);
        this.activityPolls = {};
    };
    LLSyncAction.prototype.toVoidRecord = function (rec) {
        var o = {
            "context": {
                "contextActivities": {
                    "parent": [{
                            "id": (rec.object) ? rec.object.id : "",
                            "objectType": "Activity"
                        }]
                }
            },
            "actor": rec.actor,
            "verb": {
                "display": {
                    "en-US": "voided"
                },
                "id": "http://adlnet.gov/expapi/verbs/voided"
            },
            "object": {
                "id": rec.id,
                "objectType": "StatementRef"
            },
            "stored": rec.stored,
            "timestamp": rec.timestamp,
            "id": "v-" + rec.id
        };
        return new Voided(o);
    };
    // private retrieveActivityListing(activity: string, since: Date): void {
    //     let self = this;
    //     let presence = new XMLHttpRequest();
    //     presence.addEventListener("load", function() {
    //         // self.pebl.emitEvent(self.pebl.events.incomingPresence, JSON.parse(presence.responseText));
    //         // if (self.running)
    //         //     self.activityPoll = setTimeout(self.registerPresence.bind(self), PRESENCE_POLL_INTERVAL);
    //     });
    //     presence.addEventListener("error", function() {
    //         // if (self.running)
    //         //     self.activityPoll = setTimeout(self.registerPresence.bind(self), PRESENCE_POLL_INTERVAL);
    //     });
    //     presence.open("GET", self.endpoint.url + "data/xapi/activities/profile?activityId=" + encodeURIComponent(PEBL_THREAD_PREFIX + activity + "s") + "&since=" + since.toISOString(), true);
    //     presence.setRequestHeader("X-Experience-API-Version", "1.0.3");
    //     presence.setRequestHeader("Authorization", "Basic " + self.endpoint.token);
    //     //TODO fix if-match for post merging
    //     presence.send();
    // }
    LLSyncAction.prototype.pullActivity = function (activity, profileId, callback) {
        var self = this;
        var presence = new XMLHttpRequest();
        var profileIdToUse;
        presence.addEventListener("load", function () {
            if ((presence.status >= 200) && (presence.status <= 209)) {
                var activityEvent_1;
                var activityObj_1;
                var jsonObj = JSON.parse(presence.responseText);
                if (activity == "program" && activity_Program.is(jsonObj)) {
                    activityEvent_1 = self.pebl.events.incomingProgram;
                    var p = new activity_Program(jsonObj);
                    var s = presence.getResponseHeader("etag");
                    if (s) {
                        p.etag = s;
                    }
                    activityObj_1 = [p];
                    // If passed an array of profileIds, pull them one by one.
                    if (profileId && Array.isArray(profileId) && profileId.length > 0) {
                        self.pullActivity(activity, profileId, callback);
                    }
                }
                else if (activity == "program" && Array.isArray(jsonObj)) {
                    // First call without a profileId returns an array of all profileIds, use that to start getting them one by one.
                    // FIXME: this should be a separate code path
                    if (jsonObj.length > 0)
                        self.pullActivity(activity, jsonObj, callback);
                    if (callback)
                        callback(jsonObj);
                    return;
                }
                else if (activity == "learnlet" && Learnlet.is(jsonObj)) {
                    activityEvent_1 = self.pebl.events.incomingLearnlet;
                    var l = new Learnlet(jsonObj);
                    activityObj_1 = [l];
                    var s = presence.getResponseHeader("etag");
                    if (s) {
                        l.etag = s;
                    }
                }
                else if (activity == "presence" && Presence.is(jsonObj)) {
                    activityEvent_1 = self.pebl.events.incomingPresence;
                    var p = new Presence(jsonObj);
                    activityObj_1 = [p];
                    var s = presence.getResponseHeader("etag");
                    if (s) {
                        p.etag = s;
                    }
                }
                else if (activity == "institution" && activity_Institution.is(jsonObj)) {
                    activityEvent_1 = self.pebl.events.incomingInstitution;
                    var i = new activity_Institution(jsonObj);
                    activityObj_1 = [i];
                    var s = presence.getResponseHeader("etag");
                    if (s) {
                        i.etag = s;
                    }
                    activityObj_1 = [i];
                    // If passed an array of profileIds, pull them one by one.
                    if (profileId && Array.isArray(profileId) && profileId.length > 0) {
                        self.pullActivity(activity, profileId, callback);
                    }
                }
                else if (activity == "institution" && Array.isArray(jsonObj)) {
                    // First call without a profileId returns an array of all profileIds, use that to start getting them one by one.
                    // FIXME: this should be a separate code path
                    self.pebl.emitEvent(self.pebl.events.totalInstitutionActivities, jsonObj);
                    if (jsonObj.length > 0)
                        self.pullActivity(activity, jsonObj, callback);
                    if (callback)
                        callback(jsonObj);
                    return;
                }
                else if (activity == "system" && activity_System.is(jsonObj)) {
                    activityEvent_1 = self.pebl.events.incomingSystem;
                    var sys = new activity_System(jsonObj);
                    activityObj_1 = [sys];
                    var s = presence.getResponseHeader("etag");
                    if (s) {
                        sys.etag = s;
                    }
                }
                else {
                    console.log(jsonObj);
                    activityObj_1 = [];
                    new Error("Missing activity type dispatch or invalid response");
                }
                if (activityEvent_1) {
                    self.pebl.user.getUser(function (userProfile) {
                        if (userProfile) {
                            if (activity == "program") {
                                self.pebl.storage.saveActivity(userProfile, activityObj_1[0]);
                            }
                            else if (activity == "learnlet") {
                            }
                            else if (activity == "presense") {
                            }
                            else if (activity == "institution") {
                                self.pebl.storage.saveActivity(userProfile, activityObj_1[0]);
                            }
                            else if (activity == "system") {
                                self.pebl.storage.saveActivity(userProfile, activityObj_1[0]);
                            }
                            if (activityEvent_1) {
                                self.pebl.emitEvent(activityEvent_1, activityObj_1);
                            }
                        }
                    });
                }
                if (callback) {
                    if (activityObj_1 && activityObj_1.length > 0) {
                        callback(activityObj_1[0]);
                    }
                    else
                        callback();
                }
            }
            else {
                console.log("Failed to pull", activity);
                // if (presence.status === 404) {
                //     // Activity must have been deleted, remove group membership
                //     if (profileId && typeof profileId === 'string') {
                //         self.pebl.utils.getSpecificGroupMembership(profileId, function (membership) {
                //             if (membership) {
                //                 console.log('Removing membership to deleted activity', membership);
                //                 self.pebl.emitEvent(self.pebl.events.removedMembership, membership.id);
                //             }
                //         });
                //     }
                // }
                if (callback) {
                    callback();
                }
            }
        });
        presence.addEventListener("error", function () {
            console.log("Failed to pull", activity);
            if (callback) {
                callback();
            }
        });
        if (profileId) {
            if (Array.isArray(profileId)) {
                profileIdToUse = profileId.pop();
            }
            else {
                profileIdToUse = profileId;
            }
        }
        presence.open("GET", self.endpoint.url + "data/xapi/activities/profile?activityId=" + encodeURIComponent(PEBL_THREAD_PREFIX + activity + "s") + (profileIdToUse ? ("&profileId=" + encodeURIComponent(profileIdToUse)) : '') + "&t=" + Date.now(), true);
        presence.setRequestHeader("X-Experience-API-Version", "1.0.3");
        presence.setRequestHeader("Authorization", "Basic " + self.endpoint.token);
        presence.send();
    };
    LLSyncAction.prototype.postActivity = function (activity, callback) {
        var xhr = new XMLHttpRequest();
        var self = this;
        var jsObj = null;
        if (activity_Program.is(activity)) {
            activity = new activity_Program(activity);
            jsObj = JSON.stringify(activity.toTransportFormat());
        }
        else if (Learnlet.is(activity)) {
            activity = new Learnlet(activity);
            jsObj = JSON.stringify(new Learnlet(activity).toTransportFormat());
        }
        else if (activity_Institution.is(activity)) {
            activity = new activity_Institution(activity);
            jsObj = JSON.stringify(activity.toTransportFormat());
        }
        else if (activity_System.is(activity)) {
            activity = new activity_System(activity);
            jsObj = JSON.stringify(activity.toTransportFormat());
        }
        else
            new Error("Unknown activity format");
        xhr.addEventListener("load", function () {
            if (xhr.status === 412) {
                // There is a newer version on the server
                console.log('Receieved a 412');
                activity.clearDirtyEdits();
                self.pullActivity(activity.type, activity.id, function (newActivity) {
                    if (activity.type === 'program') {
                        self.pebl.emitEvent(self.pebl.events.saveProgramConflict, newActivity);
                    }
                    callback(false, activity, newActivity);
                });
            }
            else {
                activity.clearDirtyEdits();
                self.pullActivity(activity.type, activity.id, function () {
                    if (activity.type === 'program') {
                        self.pebl.emitEvent(self.pebl.events.saveProgramSuccess, activity);
                    }
                    callback(true);
                });
            }
        });
        xhr.addEventListener("error", function () {
            self.pullActivity(activity.type, activity.id, function () {
                if (activity.type === 'program') {
                    self.pebl.emitEvent(self.pebl.events.saveProgramError, activity);
                }
                callback(false);
            });
        });
        xhr.open("POST", self.endpoint.url + "data/xapi/activities/profile?activityId=" + encodeURIComponent(PEBL_THREAD_PREFIX + activity.type + "s") + "&profileId=" + activity.id, true);
        if (activity.etag) {
            xhr.setRequestHeader("If-Match", activity.etag);
        }
        xhr.setRequestHeader("X-Experience-API-Version", "1.0.3");
        xhr.setRequestHeader("Authorization", "Basic " + self.endpoint.token);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(jsObj);
    };
    LLSyncAction.prototype.deleteActivity = function (activity, callback) {
        var xhr = new XMLHttpRequest();
        var self = this;
        if (!activity_Program.is(activity) && !Learnlet.is(activity) && !activity_Institution.is(activity) && !activity_System.is(activity)) {
            new Error("Unknown activity format");
        }
        xhr.addEventListener("load", function () {
            if (xhr.status === 412) {
                console.log('CONFLICT DURING DELETE: RETRYING');
                self.pullActivity(activity.type, activity.id, function (newActivity) {
                    callback(false, activity, newActivity);
                });
            }
            else {
                callback(true);
            }
        });
        xhr.addEventListener("error", function () {
            callback(false);
        });
        xhr.open("DELETE", self.endpoint.url + "data/xapi/activities/profile?activityId=" + encodeURIComponent(PEBL_THREAD_PREFIX + activity.type + "s") + "&profileId=" + activity.id, true);
        if (activity.etag) {
            xhr.setRequestHeader("If-Match", activity.etag);
        }
        xhr.setRequestHeader("X-Experience-API-Version", "1.0.3");
        xhr.setRequestHeader("Authorization", "Basic " + self.endpoint.token);
        xhr.send();
    };
    // private registerPresence(): void {
    //     let self = this;
    //     let xhr = new XMLHttpRequest();
    //     this.pebl.user.getUser(function(userProfile) {
    //         if (userProfile) {
    //             xhr.addEventListener("load", function() {
    //                 self.retrievePresence();
    //             });
    //             xhr.addEventListener("error", function() {
    //                 if (self.running)
    //                     self.activityPoll = setTimeout(self.registerPresence.bind(self), PRESENCE_POLL_INTERVAL);
    //             });
    //             xhr.open("POST", self.endpoint.url + "data/xapi/activities/profile?activityId=" + encodeURIComponent(PEBL_THREAD_REGISTRY) + "&profileId=Registration", true);
    //             xhr.setRequestHeader("X-Experience-API-Version", "1.0.3");
    //             xhr.setRequestHeader("Authorization", "Basic " + self.endpoint.token);
    //             xhr.setRequestHeader("Content-Type", "application/json");
    //             let obj: { [key: string]: any } = {};
    //             obj[userProfile.identity] = true;
    //             xhr.send(JSON.stringify(obj));
    //         } else if (self.running)
    //             self.activityPoll = setTimeout(self.registerPresence.bind(self), PRESENCE_POLL_INTERVAL);
    //     });
    // }
    // private unregisterPresence(): void {
    //     let self = this;
    //     let xhr = new XMLHttpRequest();
    //     this.pebl.user.getUser(function(userProfile) {
    //         if (userProfile) {
    //             xhr.open("POST", self.endpoint.url + "data/xapi/activities/profile?activityId=" + encodeURIComponent(PEBL_THREAD_REGISTRY) + "&profileId=Registration", true);
    //             xhr.setRequestHeader("X-Experience-API-Version", "1.0.3");
    //             xhr.setRequestHeader("Authorization", "Basic " + self.endpoint.token);
    //             xhr.setRequestHeader("Content-Type", "application/json");
    //             let obj: { [key: string]: any } = {};
    //             obj[userProfile.identity] = false;
    //             xhr.send(JSON.stringify(obj));
    //         }
    //     });
    // }
    LLSyncAction.prototype.bookPollingCallback = function () {
        var self = this;
        this.pebl.storage.getCurrentBook(function (book) {
            if (book) {
                var lastSynced = self.endpoint.lastSyncedBooksMine[book];
                if (lastSynced == null) {
                    lastSynced = new Date("2017-06-05T21:07:49-07:00");
                    self.endpoint.lastSyncedBooksMine[book] = lastSynced;
                }
                self.pullBook(lastSynced, book);
            }
            else if (self.running)
                self.bookPoll = setTimeout(self.bookPollingCallback.bind(self), BOOK_POLL_INTERVAL);
        });
    };
    LLSyncAction.prototype.modulePollingCallback = function () {
        var self = this;
        this.pebl.storage.getCurrentBook(function (book) {
            if (book) {
                var lastSynced = self.endpoint.lastSyncedModules[book];
                if (lastSynced == null) {
                    lastSynced = new Date("2017-06-05T21:07:49-07:00");
                    self.endpoint.lastSyncedModules[book] = lastSynced;
                }
                self.pullModules(lastSynced, book);
            }
            else if (self.running)
                self.modulePoll = setTimeout(self.modulePollingCallback.bind(self), MODULE_POLL_INTERVAL);
        });
    };
    LLSyncAction.prototype.threadPollingCallback = function () {
        var self = this;
        var threadPairs = [];
        for (var _i = 0, _a = Object.keys(this.pebl.subscribedThreadHandlers); _i < _a.length; _i++) {
            var thread = _a[_i];
            var timeStr = self.endpoint.lastSyncedThreads[thread];
            var timestamp = timeStr == null ? new Date("2017-06-05T21:07:49-07:00") : timeStr;
            self.endpoint.lastSyncedThreads[thread] = timestamp;
            threadPairs.push({
                "statement.stored": {
                    "$gt": timestamp.toISOString()
                },
                "statement.object.id": PEBL_THREAD_PREFIX + thread
            });
        }
        this.pebl.utils.getGroupMemberships(function (memberships) {
            if (memberships) {
                var addedMemberships = {};
                for (var _i = 0, memberships_1 = memberships; _i < memberships_1.length; _i++) {
                    var membership = memberships_1[_i];
                    var fullDirectThread = PEBL_THREAD_GROUP_PREFIX + membership.membershipId;
                    if (!addedMemberships[fullDirectThread]) {
                        addedMemberships[fullDirectThread] = true;
                        var thread = GROUP_PREFIX + membership.thread;
                        var timeStr = self.endpoint.lastSyncedThreads[thread];
                        var timestamp = timeStr == null ? new Date("2017-06-05T21:07:49-07:00") : timeStr;
                        self.endpoint.lastSyncedThreads[thread] = timestamp;
                        threadPairs.push({
                            "statement.stored": {
                                "$gt": timestamp.toISOString()
                            },
                            "statement.object.id": fullDirectThread
                        });
                    }
                }
            }
            self.pebl.user.getUser(function (userProfile) {
                if (userProfile && self.pebl.enableDirectMessages) {
                    var fullDirectThread = PEBL_THREAD_USER_PREFIX + userProfile.identity;
                    var thread = USER_PREFIX + userProfile.identity;
                    var timeStr = self.endpoint.lastSyncedThreads[thread];
                    var timestamp = timeStr == null ? new Date("2017-06-05T21:07:49-07:00") : timeStr;
                    self.endpoint.lastSyncedThreads[thread] = timestamp;
                    threadPairs.push({
                        "statement.stored": {
                            "$gt": timestamp.toISOString()
                        },
                        "statement.object.id": fullDirectThread
                    });
                }
                if ((threadPairs.length == 0) && self.running)
                    self.threadPoll = setTimeout(self.threadPollingCallback.bind(self), THREAD_POLL_INTERVAL);
                else
                    self.pullMessages({ "$or": threadPairs });
            });
        });
    };
    LLSyncAction.prototype.pullHelper = function (pipeline, callback) {
        var self = this;
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("load", function () {
            var result = JSON.parse(xhr.responseText);
            for (var i = 0; i < result.length; i++) {
                var rec = result[i];
                if (!rec.voided)
                    result[i] = rec.statement;
                else
                    result[i] = self.toVoidRecord(rec.statement);
            }
            if (callback != null) {
                callback(result);
            }
        });
        xhr.addEventListener("error", function () {
            callback([]);
        });
        xhr.open("GET", self.endpoint.url + "api/statements/aggregate?pipeline=" + encodeURIComponent(JSON.stringify(pipeline)), true);
        xhr.setRequestHeader("Authorization", "Basic " + self.endpoint.token);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    };
    LLSyncAction.prototype.pullMessages = function (params) {
        //TODO: Assumes only $or in the object
        var stringifiedParams = JSON.stringify(params["$or"]);
        var arrayChunks = [params["$or"]];
        //If the character count exceeds 4000, keep dividing the arrays in half until they are under 4000 characters
        while (stringifiedParams.length > 4000) {
            var newArrayChunks = [];
            for (var _i = 0, arrayChunks_1 = arrayChunks; _i < arrayChunks_1.length; _i++) {
                var array = arrayChunks_1[_i];
                var newHalf = array.splice(0, Math.ceil(array.length / 2));
                newArrayChunks.push(array);
                newArrayChunks.push(newHalf);
            }
            //Deep copy
            arrayChunks = JSON.parse(JSON.stringify(newArrayChunks));
            stringifiedParams = JSON.stringify(newArrayChunks[0]);
        }
        var self = this;
        var chunkIterator = function (arrays) {
            var array = arrays.pop();
            var pipeline = [
                {
                    "$match": { "$or": array }
                },
                {
                    "$project": {
                        "statement": 1,
                        "_id": 0,
                        "voided": 1
                    }
                },
                {
                    "$sort": {
                        "stored": -1,
                        "_id": 1
                    }
                },
                {
                    "$limit": 1500
                }
            ];
            self.pullHelper(pipeline, function (stmts) {
                var buckets = {};
                var memberships = {};
                var deleteIds = [];
                self.pebl.user.getUser(function (userProfile) {
                    if (userProfile) {
                        for (var i = 0; i < stmts.length; i++) {
                            var xapi = stmts[i];
                            var thread = null;
                            var tsd = null;
                            if (Message.is(xapi)) {
                                var m = new Message(xapi);
                                thread = m.thread;
                                tsd = m;
                            }
                            else if (Reference.is(xapi)) {
                                var r = new Reference(xapi);
                                self.pebl.network.queueReference(r);
                                tsd = r;
                                thread = r.thread;
                            }
                            else if (Voided.is(xapi)) {
                                var v = new Voided(xapi);
                                deleteIds.push(v);
                                thread = v.thread;
                            }
                            else if (Membership.is(xapi)) {
                                var m = new Membership(xapi);
                                thread = m.thread;
                                tsd = m;
                            }
                            else if (ProgramAction.is(xapi)) {
                                var pa = new ProgramAction(xapi);
                                thread = 'group-user-' + userProfile.identity;
                                tsd = pa;
                            }
                            if (thread != null) {
                                if (tsd != null) {
                                    var container = tsd instanceof Membership ? memberships : buckets;
                                    var stmts_1 = container[thread];
                                    if (stmts_1 == null) {
                                        stmts_1 = {};
                                        container[thread] = stmts_1;
                                    }
                                    stmts_1[tsd.id] = tsd;
                                }
                                var temp = new Date(xapi.stored);
                                var lastSyncedDate = self.endpoint.lastSyncedThreads[thread];
                                if (lastSyncedDate.getTime() < temp.getTime())
                                    self.endpoint.lastSyncedThreads[thread] = temp;
                            }
                        }
                        for (var i = 0; i < deleteIds.length; i++) {
                            var v = deleteIds[i];
                            var thread = v.thread;
                            var bucket = buckets[thread];
                            if (bucket != null) {
                                delete bucket[v.target];
                            }
                            self.pebl.storage.removeMessage(userProfile, v.target);
                            self.pebl.storage.removeGroupMembership(userProfile, v.target);
                        }
                        for (var _i = 0, _a = Object.keys(memberships); _i < _a.length; _i++) {
                            var thread = _a[_i];
                            var membership = memberships[thread];
                            var cleanMemberships = [];
                            for (var _b = 0, _c = Object.keys(membership); _b < _c.length; _b++) {
                                var messageId = _c[_b];
                                var rec = membership[messageId];
                                cleanMemberships.push(rec);
                            }
                            if (cleanMemberships.length > 0) {
                                cleanMemberships.sort();
                                self.pebl.storage.saveGroupMembership(userProfile, cleanMemberships);
                                self.pebl.emitEvent(thread, cleanMemberships);
                                self.pullActivitiesFromMemberships("program", cleanMemberships);
                                self.pullActivitiesFromMemberships("institution", cleanMemberships);
                                self.pullActivitiesFromMemberships("system", cleanMemberships);
                            }
                        }
                        for (var _d = 0, _e = Object.keys(buckets); _d < _e.length; _d++) {
                            var thread = _e[_d];
                            var bucket = buckets[thread];
                            var cleanMessages = [];
                            var cleanProgramActions = [];
                            for (var _f = 0, _g = Object.keys(bucket); _f < _g.length; _f++) {
                                var messageId = _g[_f];
                                var rec = bucket[messageId];
                                if (rec instanceof Message)
                                    cleanMessages.push(rec);
                                else if (rec instanceof ProgramAction)
                                    cleanProgramActions.push(rec);
                            }
                            if (cleanMessages.length > 0) {
                                cleanMessages.sort();
                                self.pebl.storage.saveMessages(userProfile, cleanMessages);
                                self.pebl.emitEvent(thread, cleanMessages);
                            }
                            if (cleanProgramActions.length > 0) {
                                cleanProgramActions.sort();
                                self.pebl.storage.saveActivityEvent(userProfile, cleanProgramActions);
                                self.pebl.emitEvent(self.pebl.events.incomingActivityEvents, cleanProgramActions);
                            }
                        }
                        self.pebl.storage.saveUserProfile(userProfile);
                        if (arrays.length > 0) {
                            chunkIterator(arrays);
                        }
                        else {
                            if (self.running)
                                self.threadPoll = setTimeout(self.threadPollingCallback.bind(self), THREAD_POLL_INTERVAL);
                        }
                    }
                });
            });
        };
        chunkIterator(arrayChunks);
    };
    LLSyncAction.prototype.pullModules = function (lastSynced, book) {
        var self = this;
        var pipeline = [
            {
                "$match": {
                    "$or": [
                        {
                            "statement.object.id": "pebl://" + book,
                            "statement.stored": {
                                "$gt": lastSynced.toISOString()
                            },
                            "statement.verb.id": {
                                "$in": [
                                    "http://www.peblproject.com/definitions.html#moduleRating",
                                    "http://www.peblproject.com/definitions.html#moduleFeedback",
                                    "http://www.peblproject.com/definitions.html#moduleExample",
                                    "http://www.peblproject.com/definitions.html#moduleExampleRating",
                                    "http://www.peblproject.com/definitions.html#moduleExampleFeedback",
                                    "http://www.peblproject.com/definitions.html#moduleRemovedEvent"
                                ]
                            }
                        }
                    ]
                }
            },
            {
                "$project": {
                    "statement": 1,
                    "_id": 0,
                    "voided": 1
                }
            },
            {
                "$sort": {
                    "stored": -1,
                    "_id": 1
                }
            },
            {
                "$limit": 1500
            }
        ];
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.pullHelper(pipeline, function (stmts) {
                    var moduleEvents = {};
                    for (var i = 0; i < stmts.length; i++) {
                        var xapi = stmts[i];
                        if (ModuleRating.is(xapi)) {
                            var mr = new ModuleRating(xapi);
                            moduleEvents[mr.id] = mr;
                        }
                        else if (ModuleFeedback.is(xapi)) {
                            var mf = new ModuleFeedback(xapi);
                            moduleEvents[mf.id] = mf;
                        }
                        else if (ModuleExample.is(xapi)) {
                            var me = new ModuleExample(xapi);
                            moduleEvents[me.id] = me;
                        }
                        else if (ModuleExampleRating.is(xapi)) {
                            var mer = new ModuleExampleRating(xapi);
                            moduleEvents[mer.id] = mer;
                        }
                        else if (ModuleExampleFeedback.is(xapi)) {
                            var mef = new ModuleExampleFeedback(xapi);
                            moduleEvents[mef.id] = mef;
                        }
                        else if (ModuleRemovedEvent.is(xapi)) {
                            var mre = new ModuleRemovedEvent(xapi);
                            moduleEvents[mre.id] = mre;
                        }
                        else {
                            new Error("Unknown Statement type");
                        }
                        var temp = new Date(xapi.stored);
                        var lastSyncedDate = self.endpoint.lastSyncedModules[book];
                        if (lastSyncedDate.getTime() < temp.getTime())
                            self.endpoint.lastSyncedModules[book] = temp;
                    }
                    var cleanModuleEvents = [];
                    for (var _i = 0, _a = Object.keys(moduleEvents); _i < _a.length; _i++) {
                        var id = _a[_i];
                        cleanModuleEvents.push(moduleEvents[id]);
                    }
                    if (cleanModuleEvents.length > 0) {
                        cleanModuleEvents.sort();
                        self.pebl.storage.saveModuleEvent(userProfile, cleanModuleEvents);
                        self.pebl.emitEvent(self.pebl.events.incomingModuleEvents, cleanModuleEvents);
                    }
                    self.pebl.storage.saveUserProfile(userProfile);
                    if (self.running)
                        self.modulePoll = setTimeout(self.modulePollingCallback.bind(self), MODULE_POLL_INTERVAL);
                });
            }
        });
    };
    LLSyncAction.prototype.pullBook = function (lastSynced, book) {
        var teacherPack = {
            "statement.object.id": "pebl://" + book,
            "statement.stored": {
                "$gt": lastSynced.toISOString()
            }
        };
        var self = this;
        var pipeline = [
            {
                "$match": {
                    "$or": [
                        teacherPack,
                        {
                            "statement.object.id": "pebl://" + book,
                            "statement.stored": {
                                "$gt": lastSynced.toISOString()
                            },
                            "statement.verb.id": {
                                "$in": [
                                    "http://adlnet.gov/expapi/verbs/shared"
                                ]
                            }
                        }
                    ]
                }
            },
            {
                "$project": {
                    "statement": 1,
                    "_id": 0,
                    "voided": 1
                }
            },
            {
                "$sort": {
                    "stored": -1,
                    "_id": 1
                }
            },
            {
                "$limit": 1500
            }
        ];
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                if (!self.pebl.teacher)
                    teacherPack["agents"] = userProfile.homePage + "|" + userProfile.identity;
                self.pullHelper(pipeline, function (stmts) {
                    var annotations = {};
                    var sharedAnnotations = {};
                    var events = {};
                    var moduleEvents = {};
                    var deleted = [];
                    for (var i = 0; i < stmts.length; i++) {
                        var xapi = stmts[i];
                        if (Annotation.is(xapi)) {
                            var a = new Annotation(xapi);
                            annotations[a.id] = a;
                        }
                        else if (SharedAnnotation.is(xapi)) {
                            var a = new SharedAnnotation(xapi);
                            sharedAnnotations[a.id] = a;
                        }
                        else if (Voided.is(xapi)) {
                            var v = new Voided(xapi);
                            deleted.push(v);
                        }
                        else if (Session.is(xapi)) {
                            var s = new Session(xapi);
                            events[s.id] = s;
                        }
                        else if (Action.is(xapi)) {
                            var a = new Action(xapi);
                            events[a.id] = a;
                        }
                        else if (Navigation.is(xapi)) {
                            var a = new Navigation(xapi);
                            events[a.id] = a;
                        }
                        else if (Quiz.is(xapi)) {
                            var q = new Quiz(xapi);
                            events[q.id] = q;
                        }
                        else if (Question.is(xapi)) {
                            var q = new Question(xapi);
                            events[q.id] = q;
                        }
                        else if (Reference.is(xapi)) {
                            var r = new Reference(xapi);
                            events[r.id] = r;
                            self.pebl.network.queueReference(r);
                        }
                        else if (ModuleRating.is(xapi)) {
                            var mr = new ModuleRating(xapi);
                            moduleEvents[mr.id] = mr;
                        }
                        else if (ModuleFeedback.is(xapi)) {
                            var mf = new ModuleFeedback(xapi);
                            moduleEvents[mf.id] = mf;
                        }
                        else if (ModuleExample.is(xapi)) {
                            var me = new ModuleExample(xapi);
                            moduleEvents[me.id] = me;
                        }
                        else if (ModuleExampleRating.is(xapi)) {
                            var mer = new ModuleExampleRating(xapi);
                            moduleEvents[mer.id] = mer;
                        }
                        else if (ModuleExampleFeedback.is(xapi)) {
                            var mef = new ModuleExampleFeedback(xapi);
                            moduleEvents[mef.id] = mef;
                        }
                        else if (ModuleRemovedEvent.is(xapi)) {
                            var mre = new ModuleRemovedEvent(xapi);
                            moduleEvents[mre.id] = mre;
                        }
                        else {
                            new Error("Unknown Statement type");
                        }
                        var temp = new Date(xapi.stored);
                        var lastSyncedDate = self.endpoint.lastSyncedBooksMine[book];
                        if (lastSyncedDate.getTime() < temp.getTime())
                            self.endpoint.lastSyncedBooksMine[book] = temp;
                    }
                    for (var i = 0; i < deleted.length; i++) {
                        var v = deleted[i];
                        delete annotations[v.target];
                        delete sharedAnnotations[v.target];
                        // delete events[v.target];
                        self.pebl.storage.removeAnnotation(userProfile, v.target);
                        self.pebl.storage.removeSharedAnnotation(userProfile, v.target);
                        // self.pebl.storage.removeEvent(userProfile, v.target);
                    }
                    var cleanAnnotations = [];
                    for (var _i = 0, _a = Object.keys(annotations); _i < _a.length; _i++) {
                        var id = _a[_i];
                        cleanAnnotations.push(annotations[id]);
                    }
                    if (cleanAnnotations.length > 0) {
                        cleanAnnotations.sort();
                        self.pebl.storage.saveAnnotations(userProfile, cleanAnnotations);
                        self.pebl.emitEvent(self.pebl.events.incomingAnnotations, cleanAnnotations);
                    }
                    var cleanSharedAnnotations = [];
                    for (var _b = 0, _c = Object.keys(sharedAnnotations); _b < _c.length; _b++) {
                        var id = _c[_b];
                        cleanSharedAnnotations.push(sharedAnnotations[id]);
                    }
                    if (cleanSharedAnnotations.length > 0) {
                        cleanSharedAnnotations.sort();
                        self.pebl.storage.saveSharedAnnotations(userProfile, cleanSharedAnnotations);
                        self.pebl.emitEvent(self.pebl.events.incomingSharedAnnotations, cleanSharedAnnotations);
                    }
                    var cleanEvents = [];
                    for (var _d = 0, _e = Object.keys(events); _d < _e.length; _d++) {
                        var id = _e[_d];
                        cleanEvents.push(events[id]);
                    }
                    if (cleanEvents.length > 0) {
                        cleanEvents.sort();
                        self.pebl.storage.saveEvent(userProfile, cleanEvents);
                        self.pebl.emitEvent(self.pebl.events.incomingEvents, cleanEvents);
                    }
                    var cleanModuleEvents = [];
                    for (var _f = 0, _g = Object.keys(moduleEvents); _f < _g.length; _f++) {
                        var id = _g[_f];
                        cleanModuleEvents.push(moduleEvents[id]);
                    }
                    if (cleanModuleEvents.length > 0) {
                        cleanModuleEvents.sort();
                        self.pebl.storage.saveModuleEvent(userProfile, cleanModuleEvents);
                        self.pebl.emitEvent(self.pebl.events.incomingModuleEvents, cleanModuleEvents);
                    }
                    self.pebl.storage.saveUserProfile(userProfile);
                    if (self.running)
                        self.bookPoll = setTimeout(self.bookPollingCallback.bind(self), BOOK_POLL_INTERVAL);
                });
            }
        });
    };
    LLSyncAction.prototype.pull = function () {
        this.running = true;
        this.clearTimeouts();
        this.bookPollingCallback();
        this.threadPollingCallback();
        this.modulePollingCallback();
        // this.startActivityPull("presence", PRESENCE_POLL_INTERVAL);
        // this.startActivityPull("learnlet", LEARNLET_POLL_INTERVAL);
        this.startActivityPull("program", PROGRAM_POLL_INTERVAL);
        this.startActivityPull("institution", INSTITUTION_POLL_INTERVAL, true);
        this.startActivityPull("system", SYSTEM_POLL_INTERVAL);
    };
    LLSyncAction.prototype.pullActivitiesFromMemberships = function (activityType, memberships) {
        var self = this;
        var queuedMembership = [];
        if (memberships) {
            for (var _i = 0, memberships_2 = memberships; _i < memberships_2.length; _i++) {
                var membership = memberships_2[_i];
                if (membership.activityType == activityType)
                    queuedMembership.push(membership);
            }
        }
        var callbackProcessor = function () {
            if (queuedMembership.length > 0) {
                var member = queuedMembership.pop();
                if (member) {
                    self.pullActivity(activityType, member.membershipId, callbackProcessor);
                }
            }
        };
        callbackProcessor();
    };
    LLSyncAction.prototype.startActivityPull = function (activityType, interval, all) {
        var self = this;
        var groupGetter = function () {
            if (all) {
                self.pullActivity(activityType, undefined, undefined);
            }
            else {
                self.pebl.utils.getGroupMemberships(function (memberships) {
                    var queuedMembership = [];
                    if (memberships) {
                        for (var _i = 0, memberships_3 = memberships; _i < memberships_3.length; _i++) {
                            var membership = memberships_3[_i];
                            if (membership.activityType == activityType)
                                queuedMembership.push(membership);
                        }
                    }
                    var callbackProcessor = function () {
                        if (queuedMembership.length == 0) {
                            if (self.running)
                                self.activityPolls[activityType] = setTimeout(groupGetter.bind(self), interval);
                        }
                        else {
                            var member = queuedMembership.pop();
                            if (member) {
                                self.pullActivity(activityType, member.membershipId, callbackProcessor);
                            }
                        }
                    };
                    callbackProcessor();
                });
            }
        };
        groupGetter();
    };
    LLSyncAction.prototype.push = function (outgoing, callback) {
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("load", function () {
            callback(true);
        });
        xhr.addEventListener("error", function () {
            callback(false);
        });
        xhr.open("POST", this.endpoint.url + "data/xapi/statements");
        xhr.setRequestHeader("Authorization", "Basic " + this.endpoint.token);
        xhr.setRequestHeader("X-Experience-API-Version", "1.0.3");
        xhr.setRequestHeader("Content-Type", "application/json");
        outgoing.forEach(function (rec) {
            delete rec.identity;
        });
        xhr.send(JSON.stringify(outgoing));
    };
    LLSyncAction.prototype.pushActivity = function (outgoing, callback) {
        var self = this;
        var xhr = new XMLHttpRequest();
        this.pebl.user.getUser(function (userProfile) {
            var activity = outgoing.pop();
            if (userProfile && activity) {
                if (activity.delete && activity.delete === true) {
                    self.deleteActivity(activity, function (success, oldActivity, newActivity) {
                        if (success) {
                            if (activity) {
                                self.pebl.storage.removeOutgoingActivity(userProfile, activity);
                                self.pebl.storage.removeActivity(userProfile, activity.id, activity.type);
                                if (activity_Program.is(activity)) {
                                    var program = new activity_Program(activity);
                                    activity_Program.iterateMembers(program, function (key, membership) {
                                        if (!TempMembership.is(membership)) {
                                            self.pebl.emitEvent(self.pebl.events.modifiedMembership, {
                                                oldMembership: membership,
                                                newMembership: null
                                            });
                                        }
                                    });
                                    self.pebl.emitEvent(self.pebl.events.removedProgram, program);
                                    self.pebl.emitEvent(self.pebl.events.eventProgramDeleted, {
                                        programId: program.id,
                                        action: 'deleted',
                                        previousValue: null,
                                        newValue: null
                                    });
                                }
                                else if (activity_Institution.is(activity)) {
                                    var institution = new activity_Institution(activity);
                                    activity_Institution.iterateMembers(institution, function (key, membership) {
                                        if (!TempMembership.is(membership)) {
                                            self.pebl.emitEvent(self.pebl.events.modifiedMembership, {
                                                oldMembership: membership,
                                                newMembership: null
                                            });
                                        }
                                    });
                                    self.pebl.emitEvent(self.pebl.events.removedInstitution, institution);
                                    self.pebl.emitEvent(self.pebl.events.eventInstitutionDeleted, {
                                        institutionId: institution.id,
                                        action: 'deleted',
                                        previousvalue: null,
                                        newValue: null
                                    });
                                }
                                else if (activity_System.is(activity)) {
                                    var system = new activity_System(activity);
                                    activity_System.iterateMembers(system, function (key, membership) {
                                        if (!TempMembership.is(membership)) {
                                            self.pebl.emitEvent(self.pebl.events.modifiedMembership, {
                                                oldMembership: membership,
                                                newMembership: null
                                            });
                                        }
                                    });
                                    self.pebl.emitEvent(self.pebl.events.removedSystem, system);
                                    self.pebl.emitEvent(self.pebl.events.eventSystemDeleted, {
                                        institutionId: system.id,
                                        action: 'deleted',
                                        previousvalue: null,
                                        newValue: null
                                    });
                                }
                            } //typechecker
                            if (outgoing.length == 0)
                                callback();
                            else {
                                self.pushActivity(outgoing, callback);
                            }
                        }
                        else {
                            if (activity) //typechecker
                                self.pebl.storage.removeOutgoingActivity(userProfile, activity);
                            if (oldActivity && newActivity) {
                                var mergedActivity = Activity.merge(oldActivity, newActivity);
                                outgoing.push(mergedActivity);
                            }
                            if (outgoing.length == 0)
                                callback();
                            else {
                                self.pebl.emitEvent(self.pebl.events.incomingErrors, {
                                    error: xhr.status,
                                    obj: activity
                                });
                                self.pushActivity(outgoing, callback);
                            }
                        }
                    });
                }
                else {
                    self.postActivity(activity, function (success, oldActivity, newActivity) {
                        if (success) {
                            if (activity) { //typechecker
                                self.pebl.storage.removeOutgoingActivity(userProfile, activity);
                                self.pebl.emitEvent(self.pebl.events.eventProgramModified, {
                                    programId: activity.id,
                                    action: 'modified',
                                    previousValue: null,
                                    newValue: null
                                });
                            }
                            if (outgoing.length == 0)
                                callback();
                            else {
                                self.pushActivity(outgoing, callback);
                            }
                        }
                        else {
                            if (activity) //typechecker
                                self.pebl.storage.removeOutgoingActivity(userProfile, activity);
                            if (oldActivity && newActivity) {
                                var mergedActivity = Activity.merge(oldActivity, newActivity);
                                outgoing.push(mergedActivity);
                            }
                            if (outgoing.length == 0)
                                callback();
                            else {
                                self.pebl.emitEvent(self.pebl.events.incomingErrors, {
                                    error: xhr.status,
                                    obj: activity
                                });
                                self.pushActivity(outgoing, callback);
                            }
                        }
                    });
                }
            }
            else
                callback();
        });
    };
    LLSyncAction.prototype.terminate = function () {
        this.running = false;
        //FIXME presence
        // this.unregisterPresence();
        this.clearTimeouts();
    };
    return LLSyncAction;
}());


// CONCATENATED MODULE: ./src/network.ts

// import { Activity } from "./activity";
var network_Network = /** @class */ (function () {
    function Network(pebl) {
        this.pushTimeout = undefined;
        this.pushActivityTimeout = undefined;
        this.pullAssetTimeout = undefined;
        this.pebl = pebl;
        this.running = false;
        this.syncingProcess = [];
    }
    Network.prototype.activate = function (callback) {
        var self = this;
        self.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                var endpoints = userProfile.endpoints;
                if (!self.running) {
                    self.syncingProcess = [];
                    for (var _i = 0, endpoints_1 = endpoints; _i < endpoints_1.length; _i++) {
                        var e = endpoints_1[_i];
                        self.syncingProcess.push(new syncing_LLSyncAction(self.pebl, e));
                    }
                    self.push();
                    self.pushActivity();
                    self.pullAsset();
                    self.running = true;
                }
                if (callback)
                    callback();
            }
        });
    };
    Network.prototype.queueReference = function (ref) {
        var self = this;
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile)
                self.pebl.storage.saveQueuedReference(userProfile, ref, self.pullAsset.bind(self));
        });
    };
    Network.prototype.retrievePresence = function () {
        // for (let sync of this.syncingProcess)
        //     sync.retrievePresence();
    };
    Network.prototype.pullAsset = function () {
        var self = this;
        self.pebl.user.getUser(function (userProfile) {
            if (userProfile && userProfile.registryEndpoint) {
                self.pebl.storage.getCurrentBook(function (currentBook) {
                    if (currentBook) {
                        self.pebl.storage.getQueuedReference(userProfile, currentBook, function (ref) {
                            if (ref) {
                                self.pebl.storage.getToc(userProfile, ref.book, function (toc) {
                                    //Wait to add resources until the static TOC has been initialized, otherwise it never gets intialized
                                    if (toc.length > 0) {
                                        self.pebl.storage.saveNotification(userProfile, ref);
                                        var tocEntry = {
                                            "url": ref.url,
                                            "documentName": ref.name,
                                            "section": ref.location,
                                            "pageKey": ref.id,
                                            "docType": ref.docType,
                                            "card": ref.card,
                                            "externalURL": ref.externalURL
                                        };
                                        self.pebl.storage.saveToc(userProfile, ref.book, tocEntry);
                                        self.pebl.emitEvent(self.pebl.events.incomingNotification, ref);
                                        self.pebl.storage.removeQueuedReference(userProfile, ref.id);
                                        if (self.running)
                                            self.pullAssetTimeout = setTimeout(self.pullAsset.bind(self), 5000);
                                        // The below requires an API that is currently unavailable and also not needed at this time
                                        // let xhr = new XMLHttpRequest();
                                        // xhr.addEventListener("load", function() {
                                        //     self.pebl.storage.saveNotification(userProfile, ref);
                                        //     let tocEntry: { [key: string]: any } = {
                                        //         "url": ref.url,
                                        //         "documentName": ref.name,
                                        //         "section": ref.location,
                                        //         "pageKey": ref.id,
                                        //         "docType": ref.docType,
                                        //         "card": ref.card,
                                        //         "externalURL": ref.externalURL
                                        //     };
                                        //     self.pebl.storage.saveToc(userProfile, ref.book, tocEntry);
                                        //     self.pebl.emitEvent(self.pebl.events.incomingNotification, ref);
                                        //     self.pebl.storage.removeQueuedReference(userProfile, ref.id);
                                        //     if (self.running)
                                        //         self.pullAssetTimeout = setTimeout(self.pullAsset.bind(self), 5000);
                                        // });
                                        // xhr.addEventListener("error", function() {
                                        //     self.pebl.storage.saveNotification(userProfile, ref);
                                        //     self.pebl.emitEvent(self.pebl.events.incomingNotification, ref);
                                        //     self.pebl.storage.removeQueuedReference(userProfile, ref.id);
                                        //     if (self.running)
                                        //         self.pullAssetTimeout = setTimeout(self.pullAsset.bind(self), 5000);
                                        // });
                                        // let url = userProfile.registryEndpoint && userProfile.registryEndpoint.url;
                                        // if (url) {
                                        //     xhr.open("GET", url + ref.url);
                                        //     xhr.send();
                                        // } else if (self.running)
                                        //     self.pullAssetTimeout = setTimeout(self.pullAsset.bind(self), 5000);
                                    }
                                    else {
                                        self.pullAssetTimeout = setTimeout(self.pullAsset.bind(self), 5000);
                                    }
                                });
                            }
                            else {
                                if (self.running)
                                    self.pullAssetTimeout = setTimeout(self.pullAsset.bind(self), 5000);
                            }
                        });
                    }
                    else if (self.running) {
                        self.pullAssetTimeout = setTimeout(self.pullAsset.bind(self), 5000);
                    }
                });
            }
            else if (self.running)
                self.pullAssetTimeout = setTimeout(self.pullAsset.bind(self), 5000);
        });
    };
    Network.prototype.disable = function (callback) {
        this.running = false;
        if (this.pushTimeout)
            clearTimeout(this.pushTimeout);
        this.pushTimeout = undefined;
        if (this.pullAssetTimeout)
            clearTimeout(this.pullAssetTimeout);
        this.pullAssetTimeout = undefined;
        if (callback)
            callback();
    };
    Network.prototype.pushActivity = function (finished) {
        var self = this;
        if (self.pushActivityTimeout) {
            clearTimeout(self.pushActivityTimeout);
            self.pushActivityTimeout = undefined;
        }
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.pebl.storage.getOutgoingActivity(userProfile, function (stmts) {
                    if (self.syncingProcess.length == 1) {
                        if (stmts.length > 0) {
                            // HACK this assumes a single sync process by deleting outgoing activities on success
                            // to fix pass an object with the results to selectively delete outside the sync process for
                            // a single endpoing
                            self.syncingProcess[0].pushActivity(stmts, function () {
                                // if (success)
                                //     self.pebl.storage.removeOutgoingActivity(userProfile, stmts);
                                if (self.running)
                                    self.pushActivityTimeout = setTimeout(self.pushActivity.bind(self), 5000);
                                if (finished)
                                    finished();
                            });
                        }
                        else {
                            if (self.running)
                                self.pushActivityTimeout = setTimeout(self.pushActivity.bind(self), 5000);
                            if (finished)
                                finished();
                        }
                    }
                });
            }
            else if (self.running)
                self.pushActivityTimeout = setTimeout(self.pushActivity.bind(self), 5000);
        });
    };
    Network.prototype.push = function (finished) {
        var self = this;
        if (self.pushTimeout) {
            clearTimeout(self.pushTimeout);
            self.pushTimeout = undefined;
        }
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.pebl.storage.getOutgoingXApi(userProfile, function (stmts) {
                    if (self.syncingProcess.length == 1) {
                        if (stmts.length > 0) {
                            self.syncingProcess[0].push(stmts, function (success) {
                                if (success)
                                    self.pebl.storage.removeOutgoingXApi(userProfile, stmts);
                                if (self.running)
                                    self.pushTimeout = setTimeout(self.push.bind(self), 5000);
                                if (finished)
                                    finished();
                            });
                        }
                        else {
                            if (self.running)
                                self.pushTimeout = setTimeout(self.push.bind(self), 5000);
                            if (finished)
                                finished();
                        }
                    }
                });
            }
            else {
                if (self.running)
                    self.pushTimeout = setTimeout(self.push.bind(self), 5000);
                if (finished)
                    finished();
            }
        });
    };
    return Network;
}());


// CONCATENATED MODULE: ./src/eventSet.ts
var EventSet = /** @class */ (function () {
    function EventSet() {
        this.incomingAnnotations = "incomingAnnotations";
        this.incomingSharedAnnotations = "incomingSharedAnnotations";
        this.incomingNotifications = "incomingNotifications";
        this.incomingAssets = "incomingAssets";
        this.incomingEvents = "incomingEvents";
        this.incomingPresence = "incomingPresence";
        this.incomingLearnlet = "incomingLearnlet";
        this.incomingProgram = "incomingProgram";
        this.incomingInstitution = "incomingInstitution";
        this.incomingSystem = "incomingSystem";
        this.incomingArtifact = "incomingArtifact";
        this.incomingMembership = "incomingMembership";
        this.incomingActivityEvents = "incomingActivityEvents";
        this.incomingModuleEvents = "incomingModuleEvents";
        this.incomingErrors = "incomingErrors";
        this.saveProgram = "saveProgram";
        this.saveProgramConflict = "saveProgramConflict";
        this.saveProgramSuccess = "saveProgramSuccess";
        this.saveProgramError = "saveProgramError";
        this.saveInstitution = "saveInstitution";
        this.saveSystem = "saveSystem";
        this.newBookNoReset = "newBookNoReset";
        this.newLearnlet = "newLearnlet";
        this.newBook = "newBook";
        this.newMessage = "newMessage";
        this.newActivity = "newActivity";
        this.newAnnotation = "newAnnotation";
        this.newReference = "newReference";
        this.newPresence = "newPresence";
        this.newMembership = "newMembership";
        this.newSharedAnnotation = "newSharedAnnotation";
        this.newArtifact = "newArtifact";
        this.modifiedMembership = "modifiedMembership";
        this.removedPresence = "removedPresence";
        this.removedMembership = "removedMembership";
        this.removedAnnotation = "removedAnnotation";
        this.removedSharedAnnotation = "removedSharedAnnotation";
        this.removedLearnlet = "removedLearnlet";
        this.removedProgram = "removedProgram";
        this.removedMessage = "removedMessage";
        this.eventLoggedIn = "eventLoggedIn";
        this.eventLoggedOut = "eventLoggedOut";
        this.eventLogin = "eventLogin";
        this.eventLogout = "eventLogout";
        this.eventFinishedLogin = "eventFinishedLogin";
        this.eventSessionStart = "eventSessionStart";
        this.eventSessionStop = "eventSessionStop";
        this.eventNextPage = "eventNextPage";
        this.eventPrevPage = "eventPrevPage";
        this.eventJumpPage = "eventJumpPage";
        this.eventInitialized = "eventInitialized";
        this.eventTerminated = "eventTerminated";
        this.eventInteracted = "eventInteracted";
        this.eventAttempted = "eventAttempted";
        this.eventPassed = "eventPassed";
        this.eventFailed = "eventFailed";
        this.eventPreferred = "eventPreferred";
        this.eventContentMorphed = "eventContentMorphed";
        this.eventExperienced = "eventExperienced";
        this.eventDisliked = "eventDisliked";
        this.eventLiked = "eventLiked";
        this.eventAccessed = "eventAccessed";
        this.eventHid = "eventHid";
        this.eventShowed = "eventShowed";
        this.eventDisplayed = "eventDisplayed";
        this.eventUndisplayed = "eventUndisplayed";
        this.eventSelected = "eventSelected";
        this.eventDiscarded = "eventDiscarded";
        this.eventBookmarked = "eventBookmarked";
        this.eventUnbookmarked = "eventUnbookmarked";
        this.eventUnsharedAnnotation = "eventUnsharedAnnotation";
        this.eventAnnotated = "eventAnnotated";
        this.eventUnannotated = "eventUnannotated";
        this.eventNoted = "eventNoted";
        this.eventSearched = "eventSearched";
        this.eventCompleted = "eventCompleted";
        this.eventLaunched = "eventLaunched";
        this.eventCompatibilityTested = "eventCompatibilityTested";
        this.eventChecklisted = "eventChecklisted";
        this.eventHelped = "eventHelped";
        this.eventInvited = "eventInvited";
        this.eventUninvited = "eventUninvited";
        this.eventSubmitted = "eventSubmitted";
        this.eventProgramLevelUp = "eventProgramLevelUp";
        this.eventProgramLevelDown = "eventProgramLevelDown";
        this.eventProgramInvited = "eventProgramInvited";
        this.eventProgramUninvited = "eventProgramUninvited";
        this.eventProgramJoined = "eventProgramJoined";
        this.eventProgramExpelled = "eventProgramExpelled";
        this.eventProgramActivityLaunched = "eventProgramActivityLaunched";
        this.eventProgramActivityCompleted = "eventProgramActivityCompleted";
        this.eventProgramActivityTeamCompleted = "eventProgramActivityTeamCompleted";
        this.eventProgramModified = "eventProgramModified";
        this.eventProgramDeleted = "eventProgramDeleted";
        this.eventProgramCompleted = "eventProgramCompleted";
        this.eventProgramCopied = "eventProgramCopied";
        this.eventProgramDiscussed = "eventProgramDiscussed";
        this.eventModuleRating = "eventModuleRating";
        this.eventModuleFeedback = "eventModuleFeedback";
        this.eventModuleExample = "eventModuleExample";
        this.eventModuleExampleRating = "eventModuleExampleRating";
        this.eventModuleExampleFeedback = "eventModuleExampleFeedback";
        this.moduleRemovedEvent = "moduleRemovedEvent";
        this.totalInstitutionActivities = "totalInstitutionActivities";
    }
    return EventSet;
}());


// CONCATENATED MODULE: ./src/utils.ts


var utils_Utils = /** @class */ (function () {
    function Utils(pebl) {
        this.pebl = pebl;
    }
    Utils.prototype.getAnnotations = function (callback) {
        var self = this;
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.pebl.storage.getCurrentBook(function (book) {
                    if (book)
                        self.pebl.storage.getAnnotations(userProfile, book, callback);
                    else
                        callback([]);
                });
            }
            else
                callback([]);
        });
    };
    Utils.prototype.getSharedAnnotations = function (callback) {
        var self = this;
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.pebl.storage.getCurrentBook(function (book) {
                    if (book)
                        self.pebl.storage.getSharedAnnotations(userProfile, book, callback);
                    else
                        callback([]);
                });
            }
            else
                callback([]);
        });
    };
    Utils.prototype.initializeToc = function (data) {
        var self = this;
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.pebl.storage.getCurrentBook(function (book) {
                    if (book) {
                        self.pebl.storage.getToc(userProfile, book, function (toc) {
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
                                                self.pebl.storage.saveToc(userProfile, book, documentMetadata);
                                            }
                                        }
                                        else {
                                            pageMetadata["pageKey"] = pageKey;
                                            pageMetadata["section"] = section;
                                            self.pebl.storage.saveToc(userProfile, book, pageMetadata);
                                        }
                                    }
                                }
                            }
                        });
                    }
                });
            }
        });
    };
    Utils.prototype.getToc = function (callback) {
        var self = this;
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.pebl.storage.getCurrentBook(function (book) {
                    if (book)
                        self.pebl.storage.getToc(userProfile, book, function (entries) {
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
                                }
                                else
                                    section[entry["pageKey"]] = entry;
                            }
                            callback(toc);
                        });
                    else
                        callback({});
                });
            }
            else
                callback({});
        });
    };
    Utils.prototype.removeToc = function (id, section) {
        var self = this;
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile)
                self.pebl.storage.getCurrentBook(function (book) {
                    if (book)
                        self.pebl.storage.removeToc(userProfile, book, section, id);
                });
        });
    };
    Utils.prototype.pullProgram = function (programId, callback) {
        var self = this;
        self.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                var network = self.pebl.network;
                if (network && network.syncingProcess && network.syncingProcess.length > 0) {
                    network.syncingProcess[0].pullActivity('program', programId, function (activity) {
                        if (activity) {
                            callback(activity);
                        }
                        else {
                            callback();
                        }
                    });
                }
            }
        });
    };
    Utils.prototype.mergePrograms = function (oldProgram, newProgram) {
        var mergedProgram = activity_Program.merge(oldProgram, newProgram);
        return mergedProgram;
    };
    Utils.prototype.mergeInstitutions = function (oldInstitution, newInstitution) {
        var mergedInstitution = activity_Institution.merge(oldInstitution, newInstitution);
        return mergedInstitution;
    };
    Utils.prototype.mergeSystems = function (oldSystem, newSystem) {
        var mergedSystem = activity_System.merge(oldSystem, newSystem);
        return mergedSystem;
    };
    Utils.prototype.getProgram = function (programId, callback) {
        var self = this;
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.pebl.storage.getActivityById(userProfile, "program", programId, function (activity) {
                    if (activity)
                        callback(activity);
                    else
                        callback();
                });
            }
        });
    };
    Utils.prototype.getInstitution = function (institutionId, callback) {
        var self = this;
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.pebl.storage.getActivityById(userProfile, "institution", institutionId, function (activity) {
                    if (activity)
                        callback(activity);
                    else
                        callback();
                });
            }
        });
    };
    Utils.prototype.getSystem = function (systemId, callback) {
        var self = this;
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.pebl.storage.getActivityById(userProfile, "system", systemId, function (activity) {
                    if (activity)
                        callback(activity);
                    else
                        callback();
                });
            }
        });
    };
    Utils.prototype.isProgramMember = function (program, userIdentity) {
        return activity_Program.isMember(program, userIdentity);
    };
    Utils.prototype.isInstitutionMember = function (institution, userIdentity) {
        return activity_Institution.isMember(institution, userIdentity);
    };
    Utils.prototype.isProgramMemberOfInstitution = function (institution, programId) {
        return activity_Institution.isProgram(institution, programId);
    };
    Utils.prototype.isSystemMember = function (system, userIdentity) {
        return activity_System.isMember(system, userIdentity);
    };
    Utils.prototype.removeProgram = function (programId, callback) {
        var self = this;
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.pebl.storage.removeActivity(userProfile, programId, 'program', callback);
            }
        });
    };
    Utils.prototype.removeInstitution = function (institutionId, callback) {
        var self = this;
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.pebl.storage.removeActivity(userProfile, institutionId, 'institution', callback);
            }
        });
    };
    Utils.prototype.newEmptyProgram = function (callback) {
        callback(new activity_Program({}));
    };
    Utils.prototype.newEmptyInstitution = function (callback) {
        callback(new activity_Institution({}));
    };
    Utils.prototype.newEmptySystem = function (callback) {
        callback(new activity_System({}));
    };
    Utils.prototype.getGroupMemberships = function (callback) {
        var self = this;
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.pebl.storage.getGroupMembership(userProfile, callback);
            }
            else
                callback([]);
        });
    };
    Utils.prototype.getSpecificGroupMembership = function (groupId, callback) {
        var self = this;
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.pebl.storage.getGroupMembership(userProfile, function (memberships) {
                    var result = null;
                    for (var _i = 0, memberships_1 = memberships; _i < memberships_1.length; _i++) {
                        var membership = memberships_1[_i];
                        if (membership.membershipId === groupId)
                            result = membership;
                    }
                    callback(result);
                });
            }
            else
                callback(null);
        });
    };
    Utils.prototype.removeGroupMembership = function (groupId, callback) {
        var self = this;
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.pebl.storage.removeGroupMembership(userProfile, groupId, callback);
            }
        });
    };
    Utils.prototype.getPrograms = function (callback) {
        var self = this;
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.pebl.storage.getActivity(userProfile, "program", function (activities) {
                    callback(activities);
                });
            }
            else
                callback([]);
        });
    };
    Utils.prototype.getInstitutions = function (callback) {
        var self = this;
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.pebl.storage.getActivity(userProfile, "institution", function (activities) {
                    callback(activities);
                });
            }
            else
                callback([]);
        });
    };
    Utils.prototype.getSystems = function (callback) {
        var self = this;
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.pebl.storage.getActivity(userProfile, "system", function (activities) {
                    callback(activities);
                });
            }
            else
                callback([]);
        });
    };
    Utils.prototype.getUuid = function () {
        /*!
          Excerpt from: Math.uuid.js (v1.4)
          http://www.broofa.com
          mailto:robert@broofa.com
          Copyright (c) 2010 Robert Kieffer
          Dual licensed under the MIT and GPL licenses.
        */
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        return uuid;
    };
    Utils.prototype.getInviteToken = function (token, callback) {
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                var xhr_1 = new XMLHttpRequest();
                //TODO: multiple endpoints?
                var endpoint = userProfile.endpoints[0];
                var pipeline = [{
                        "$match": {
                            "$and": [{
                                    "statement.verb.id": {
                                        "$in": [
                                            "http://www.peblproject.com/definitions.html#invited"
                                        ]
                                    }
                                },
                                {
                                    "statement.object.definition.name.en-US": {
                                        "$in": [
                                            token
                                        ]
                                    }
                                }]
                        }
                    }];
                xhr_1.addEventListener("load", function () {
                    var result = JSON.parse(xhr_1.responseText);
                    for (var i = 0; i < result.length; i++) {
                        var rec = result[i];
                        if (!rec.voided)
                            result[i] = rec.statement;
                        else
                            result.splice(i, 1);
                    }
                    if (callback != null) {
                        callback(result);
                    }
                });
                xhr_1.addEventListener("error", function () {
                    callback([]);
                });
                xhr_1.open("GET", endpoint.url + "api/statements/aggregate?pipeline=" + encodeURIComponent(JSON.stringify(pipeline)), true);
                xhr_1.setRequestHeader("Authorization", "Basic " + endpoint.token);
                xhr_1.setRequestHeader("Content-Type", "application/json");
                xhr_1.send();
            }
        });
    };
    Utils.prototype.getProgramActivityEvents = function (programId, callback) {
        var self = this;
        this.pebl.storage.getActivityEvent(programId, function (events) {
            callback(events.sort(self.sortByTimestamp));
        });
    };
    Utils.prototype.sortByTimestamp = function (a, b) {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    };
    Utils.prototype.iterateProgramMembers = function (program, callback) {
        activity_Program.iterateMembers(program, callback);
    };
    Utils.prototype.getProgramMembers = function (program) {
        return activity_Program.getMembers(program);
    };
    Utils.prototype.iterateInstitutionMembers = function (institution, callback) {
        activity_Institution.iterateMembers(institution, callback);
    };
    Utils.prototype.iterateInstitutionPrograms = function (institution, callback) {
        activity_Institution.iteratePrograms(institution, callback);
    };
    Utils.prototype.iterateSystemMembers = function (system, callback) {
        activity_System.iterateMembers(system, callback);
    };
    Utils.prototype.newTempMember = function (obj, callback) {
        var tm = new TempMembership(obj);
        callback(tm);
    };
    Utils.prototype.getNotifications = function (callback) {
        var self = this;
        self.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.pebl.storage.getNotifications(userProfile, function (notifications) {
                    callback(notifications);
                });
            }
            else {
                callback([]);
            }
        });
    };
    Utils.prototype.removeNotification = function (notificationId) {
        var self = this;
        self.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.pebl.storage.removeNotification(userProfile, notificationId);
            }
        });
    };
    Utils.prototype.getMessages = function (thread, callback) {
        var self = this;
        self.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.pebl.storage.getMessages(userProfile, thread, function (messages) {
                    callback(messages);
                });
            }
            else {
                callback([]);
            }
        });
    };
    Utils.prototype.getModuleEvents = function (idref, callback, type) {
        var self = this;
        self.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.pebl.storage.getModuleEvent(idref, function (moduleEvents) {
                    if (type) {
                        callback(moduleEvents.filter(function (event) { return event.verb.display['en-US'] === type; }));
                    }
                    else {
                        callback(moduleEvents);
                    }
                });
            }
            else {
                callback([]);
            }
        });
    };
    Utils.prototype.removeModuleEvent = function (idref, id) {
        var self = this;
        self.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.pebl.storage.removeModuleEvent(idref, id);
            }
        });
    };
    Utils.prototype.getEvents = function (callback) {
        var self = this;
        self.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.pebl.storage.getCurrentBook(function (book) {
                    if (book) {
                        self.pebl.storage.getEvents(userProfile, book, callback);
                    }
                    else {
                        callback([]);
                    }
                });
            }
            else {
                callback([]);
            }
        });
    };
    return Utils;
}());


// CONCATENATED MODULE: ./src/xapiGenerator.ts
var xapiGenerator_PREFIX_PEBL_EXTENSION = "https://www.peblproject.com/definitions.html#";
var XApiGenerator = /** @class */ (function () {
    function XApiGenerator() {
    }
    XApiGenerator.prototype.addExtensions = function (extensions) {
        var result = {};
        for (var _i = 0, _a = Object.keys(extensions); _i < _a.length; _i++) {
            var key = _a[_i];
            result[xapiGenerator_PREFIX_PEBL_EXTENSION + key] = extensions[key];
        }
        return result;
    };
    XApiGenerator.prototype.addResult = function (stmt, score, minScore, maxScore, complete, success, answered, duration, extensions) {
        if (!stmt.result)
            stmt.result = {};
        stmt.result.success = success;
        stmt.result.completion = complete;
        stmt.result.response = answered;
        if (!stmt.result.score)
            stmt.result.score = {};
        stmt.result.score.raw = score;
        stmt.result.score.duration = duration;
        stmt.result.score.scaled = (score - minScore) / (maxScore - minScore);
        stmt.result.score.min = minScore;
        stmt.result.score.max = maxScore;
        if (extensions) {
            if (!stmt.extensions)
                stmt.extensions = {};
            for (var _i = 0, _a = Object.keys(extensions); _i < _a.length; _i++) {
                var key = _a[_i];
                stmt.extensions[key] = extensions[key];
            }
        }
        return stmt;
    };
    XApiGenerator.prototype.addObject = function (stmt, activityId, name, description, extensions) {
        if (!stmt.object)
            stmt.object = {};
        stmt.object.id = activityId;
        stmt.object.objectType = "Activity";
        if (!stmt.object.definition)
            stmt.object.definition = {};
        if (name) {
            if (!stmt.object.definition.name)
                stmt.object.definition.name = {};
            stmt.object.definition.name["en-US"] = name;
        }
        if (description) {
            if (!stmt.object.definition.description)
                stmt.object.definition.description = {};
            stmt.object.definition.description["en-US"] = description;
        }
        if (extensions)
            stmt.object.definition.extensions = extensions;
        return stmt;
    };
    XApiGenerator.prototype.memberToIndex = function (x, arr) {
        for (var i = 0; i < arr.length; i++)
            if (x == arr[i])
                return i;
        return -1;
    };
    XApiGenerator.prototype.arrayToIndexes = function (arr, indexArr) {
        var clone = arr.slice(0);
        for (var i = 0; i < arr.length; i++) {
            clone[i] = this.memberToIndex(arr[i], indexArr).toString();
        }
        return clone;
    };
    XApiGenerator.prototype.addObjectInteraction = function (stmt, activityId, name, prompt, interaction, answers, correctAnswers) {
        if (!stmt.object)
            stmt.object = {};
        stmt.object.id = activityId;
        stmt.object.objectType = "Activity";
        if (!stmt.object.definition)
            stmt.object.definition = {};
        if (!stmt.object.definition.name)
            stmt.object.definition.name = {};
        stmt.object.definition.type = "http://adlnet.gov/expapi/activities/cmi.interaction";
        stmt.object.definition.interactionType = interaction;
        var answerArr = [];
        for (var _i = 0, correctAnswers_1 = correctAnswers; _i < correctAnswers_1.length; _i++) {
            var corrrectAnswer = correctAnswers_1[_i];
            answerArr.push(this.arrayToIndexes(corrrectAnswer, answers).join("[,]"));
        }
        stmt.object.definition.correctResponsesPattern = answerArr;
        if (interaction == "choice") {
            stmt.object.definition.choices = [];
            var i = 0;
            for (var _a = 0, answers_1 = answers; _a < answers_1.length; _a++) {
                var answer = answers_1[_a];
                stmt.object.definition.choices.push({
                    id: i.toString(),
                    description: {
                        "en-US": answer
                    }
                });
                i++;
            }
        }
        stmt.object.definition.name["en-US"] = name;
        if (!stmt.object.definition.description)
            stmt.object.definition.description = {};
        stmt.object.definition.description["en-US"] = prompt;
        return stmt;
    };
    XApiGenerator.prototype.addVerb = function (stmt, url, name) {
        stmt.verb = {
            id: url,
            display: {
                "en-US": name
            }
        };
        return stmt;
    };
    XApiGenerator.prototype.addActorAccount = function (stmt, userProfile) {
        if (!stmt.actor)
            stmt.actor = {};
        stmt.actor.objectType = "Agent";
        stmt.actor.name = userProfile.name || userProfile.identity;
        stmt.actor.account = {
            homePage: userProfile.homePage,
            name: userProfile.identity
        };
        return stmt;
    };
    XApiGenerator.prototype.addActorMBox = function (stmt, userProfile) {
        if (!stmt.actor)
            stmt.actor = {};
        stmt.actor.objectType = "Agent";
        stmt.actor.name = userProfile.name;
        stmt.actor.mbox = userProfile.identity;
        return stmt;
    };
    XApiGenerator.prototype.addTimestamp = function (stmt) {
        if (!stmt.timestamp)
            stmt.timestamp = new Date().toISOString();
        return stmt;
    };
    XApiGenerator.prototype.addStatementRef = function (stmt, id) {
        if (!stmt.object)
            stmt.object = {};
        stmt.object.objectType = "StatementRef";
        stmt.object.id = id;
        return stmt;
    };
    XApiGenerator.prototype.addId = function (stmt) {
        /*!
          Excerpt from: Math.uuid.js (v1.4)
          http://www.broofa.com
          mailto:robert@broofa.com
          Copyright (c) 2010 Robert Kieffer
          Dual licensed under the MIT and GPL licenses.
        */
        stmt.id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        return stmt;
    };
    XApiGenerator.prototype.addContext = function (stmt, options) {
        stmt.context = options;
        return stmt;
    };
    XApiGenerator.prototype.addParentActivity = function (stmt, parentId) {
        if (!stmt.context)
            stmt.context = {};
        if (!stmt.context.contextActivities)
            stmt.context.contextActivities = {};
        if (!stmt.context.contextActivities.parent)
            stmt.context.contextActivities.parent = [];
        stmt.context.contextActivities.parent.push({
            objectType: "Activity",
            id: parentId
        });
        return stmt;
    };
    return XApiGenerator;
}());


// CONCATENATED MODULE: ./src/eventHandlers.ts
var PEBL_PREFIX = "pebl://";
var eventHandlers_PEBL_THREAD_PREFIX = "peblThread://";
var eventHandlers_PEBL_THREAD_USER_PREFIX = "peblThread://user-";
var PEBL_THREAD_ARTIFACT_PREFIX = "peblThread://artifact-";
var eventHandlers_PEBL_THREAD_GROUP_PREFIX = "peblThread://group-";




var eventHandlers_PEBLEventHandlers = /** @class */ (function () {
    function PEBLEventHandlers(pebl) {
        this.pebl = pebl;
        this.xapiGen = new XApiGenerator();
    }
    // -------------------------------
    PEBLEventHandlers.prototype.newBook = function (event) {
        var book = event.detail;
        var self = this;
        if (book.indexOf("/") != -1)
            book = book.substring(book.lastIndexOf("/") + 1);
        this.pebl.storage.getCurrentBook(function (currentBook) {
            if (currentBook != book) {
                if (currentBook)
                    self.pebl.emitEvent(self.pebl.events.eventTerminated, currentBook);
                self.pebl.storage.removeCurrentActivity();
                // self.pebl.emitEvent(self.pebl.events.eventInteracted, {
                //     activity: book
                // });
                self.pebl.unsubscribeAllEvents();
                self.pebl.unsubscribeAllThreads();
                self.pebl.storage.saveCurrentBook(book);
            }
            else {
                self.pebl.emitEvent(self.pebl.events.eventJumpPage, {});
            }
            self.pebl.emitEvent(self.pebl.events.eventLaunched, {});
        });
    };
    PEBLEventHandlers.prototype.newBookNoReset = function (event) {
        var book = event.detail;
        var self = this;
        if (book.indexOf("/") != -1)
            book = book.substring(book.lastIndexOf("/") + 1);
        this.pebl.storage.getCurrentBook(function (currentBook) {
            if (currentBook != book) {
                if (currentBook)
                    self.pebl.emitEvent(self.pebl.events.eventTerminated, currentBook);
                self.pebl.storage.removeCurrentActivity();
                self.pebl.emitEvent(self.pebl.events.eventInteracted, {
                    activity: book
                });
                self.pebl.storage.saveCurrentBook(book);
            }
            else {
                self.pebl.emitEvent(self.pebl.events.eventJumpPage, {});
            }
        });
    };
    PEBLEventHandlers.prototype.newActivity = function (event) {
        var payload = event.detail;
        var self = this;
        this.pebl.storage.getCurrentActivity(function (currentActivity) {
            if (payload.activity != currentActivity) {
                if (currentActivity)
                    self.pebl.emitEvent(self.pebl.events.eventTerminated, currentActivity);
                self.pebl.emitEvent(self.pebl.events.eventInitialized, {
                    name: payload.name,
                    description: payload.description
                });
            }
            self.pebl.storage.saveCurrentActivity(payload.activity);
        });
    };
    PEBLEventHandlers.prototype.newReference = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        var exts = {
            docType: payload.docType,
            location: payload.location,
            card: payload.card,
            url: payload.url,
            book: payload.book,
            externalURL: payload.externalURL
        };
        this.pebl.storage.getCurrentActivity(function (activity) {
            self.pebl.storage.getCurrentBook(function (book) {
                self.pebl.user.getUser(function (userProfile) {
                    if (userProfile) {
                        self.xapiGen.addId(xapi);
                        self.xapiGen.addTimestamp(xapi);
                        self.xapiGen.addActorAccount(xapi, userProfile);
                        self.xapiGen.addObject(xapi, eventHandlers_PEBL_THREAD_USER_PREFIX + payload.target, payload.name, payload.description, self.xapiGen.addExtensions(exts));
                        var pulled = userProfile.identity == payload.target;
                        if (pulled)
                            self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#pulled", "pulled");
                        else
                            self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#pushed", "pushed");
                        if (activity || book)
                            self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + (activity || book));
                        var s = new Reference(xapi);
                        self.pebl.storage.saveOutgoingXApi(userProfile, s);
                        self.pebl.storage.saveEvent(userProfile, s);
                        if (pulled)
                            self.pebl.emitEvent(eventHandlers_PEBL_THREAD_USER_PREFIX + payload.target, [s]);
                    }
                });
            });
        });
    };
    PEBLEventHandlers.prototype.newMessage = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        var exts = {
            access: payload.access,
            type: payload.type,
            masterThread: payload.masterThread
        };
        self.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.pebl.storage.getCurrentActivity(function (activity) {
                    self.pebl.storage.getCurrentBook(function (book) {
                        self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + (activity || book));
                        self.xapiGen.addId(xapi);
                        self.xapiGen.addVerb(xapi, "http://adlnet.gov/expapi/verbs/responded", "responded");
                        self.xapiGen.addTimestamp(xapi);
                        self.xapiGen.addObject(xapi, eventHandlers_PEBL_THREAD_PREFIX + payload.thread, payload.prompt, payload.text, self.xapiGen.addExtensions(exts));
                        self.xapiGen.addActorAccount(xapi, userProfile);
                        var message = new Message(xapi);
                        self.pebl.storage.saveMessages(userProfile, message);
                        self.pebl.storage.saveOutgoingXApi(userProfile, message);
                        self.pebl.emitEvent(message.thread, [message]);
                    });
                });
            }
        });
    };
    PEBLEventHandlers.prototype.eventNoted = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        var exts = {
            access: payload.access,
            type: payload.type
        };
        self.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.pebl.storage.getCurrentActivity(function (activity) {
                    self.pebl.storage.getCurrentBook(function (book) {
                        self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + (activity || book));
                        self.xapiGen.addId(xapi);
                        self.xapiGen.addVerb(xapi, "http://adlnet.gov/expapi/verbs/noted", "noted");
                        self.xapiGen.addTimestamp(xapi);
                        self.xapiGen.addObject(xapi, eventHandlers_PEBL_THREAD_PREFIX + payload.thread, payload.prompt, payload.text, self.xapiGen.addExtensions(exts));
                        self.xapiGen.addActorAccount(xapi, userProfile);
                        var message = new Message(xapi);
                        self.pebl.storage.saveMessages(userProfile, message);
                        self.pebl.storage.saveOutgoingXApi(userProfile, message);
                        self.pebl.emitEvent(message.thread, [message]);
                    });
                });
            }
        });
    };
    PEBLEventHandlers.prototype.removedMessage = function (event) {
        var xId = event.detail;
        var xapi = {};
        var self = this;
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.pebl.storage.getCurrentActivity(function (activity) {
                    self.pebl.storage.getCurrentBook(function (book) {
                        self.xapiGen.addId(xapi);
                        self.xapiGen.addVerb(xapi, "http://adlnet.gov/expapi/verbs/voided", "voided");
                        self.xapiGen.addTimestamp(xapi);
                        self.xapiGen.addStatementRef(xapi, xId);
                        self.xapiGen.addActorAccount(xapi, userProfile);
                        self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + xId);
                        var m = new Voided(xapi);
                        self.pebl.storage.removeMessage(userProfile, xId);
                        self.pebl.storage.saveOutgoingXApi(userProfile, m);
                    });
                });
            }
        });
    };
    PEBLEventHandlers.prototype.newLearnlet = function (event) {
        // let payload = event.detail;
        var xapi = {};
        var self = this;
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                // let exts = {
                //     cfi: payload.cfi
                // };
                self.pebl.storage.getCurrentActivity(function (activity) {
                    self.pebl.storage.getCurrentBook(function (book) {
                        // self.xapiGen.addId(xapi);
                        // self.xapiGen.addTimestamp(xapi);
                        // self.xapiGen.addActorAccount(xapi, userProfile);
                        // self.xapiGen.addObject(xapi, PEBL_THREAD_USER_PREFIX + payload.thread, payload.learnletId, payload.learnletDescription, exts);
                        // self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#learnletCreated", "learnletCreated");
                        // if (book || activity)
                        //     self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + (book || activity));
                        var m = new Learnlet(xapi);
                        self.pebl.storage.saveOutgoingActivity(userProfile, m);
                        // self.pebl.storage.saveEvent(userProfile, m);
                    });
                });
            }
        });
    };
    PEBLEventHandlers.prototype.saveProgram = function (event) {
        var prog = event.detail;
        var xapi = {};
        var self = this;
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                var exts_1 = {
                    role: "owner",
                    activityType: "program"
                };
                self.pebl.storage.getCurrentActivity(function (activity) {
                    self.pebl.storage.getCurrentBook(function (book) {
                        if (activity_Program.isNew(prog)) {
                            self.xapiGen.addId(xapi);
                            self.xapiGen.addTimestamp(xapi);
                            self.xapiGen.addActorAccount(xapi, userProfile);
                            self.xapiGen.addObject(xapi, eventHandlers_PEBL_THREAD_USER_PREFIX + userProfile.identity, prog.id, prog.programShortDescription, self.xapiGen.addExtensions(exts_1));
                            self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#joined", "joined");
                            if (book || activity)
                                self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + (book || activity));
                            var m = new Membership(xapi);
                            prog.addMember(m);
                            self.pebl.storage.saveGroupMembership(userProfile, m);
                            self.pebl.storage.saveOutgoingXApi(userProfile, m);
                        }
                        self.pebl.storage.saveOutgoingActivity(userProfile, prog);
                        self.pebl.storage.saveActivity(userProfile, prog);
                        self.pebl.emitEvent(self.pebl.events.incomingProgram, [prog]);
                    });
                });
            }
        });
    };
    PEBLEventHandlers.prototype.saveInstitution = function (event) {
        var inst = new activity_Institution(event.detail);
        var xapi = {};
        var self = this;
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                var exts_2 = {
                    role: "owner",
                    activityType: "institution"
                };
                self.pebl.storage.getCurrentActivity(function (activity) {
                    self.pebl.storage.getCurrentBook(function (book) {
                        if (activity_Institution.isNew(inst)) {
                            self.xapiGen.addId(xapi);
                            self.xapiGen.addTimestamp(xapi);
                            self.xapiGen.addActorAccount(xapi, userProfile);
                            self.xapiGen.addObject(xapi, eventHandlers_PEBL_THREAD_USER_PREFIX + userProfile.identity, inst.id, inst.description, self.xapiGen.addExtensions(exts_2));
                            self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#joined", "joined");
                            if (book || activity)
                                self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + (book || activity));
                            var m = new Membership(xapi);
                            inst.addMember(m);
                            self.pebl.storage.saveGroupMembership(userProfile, m);
                            self.pebl.storage.saveOutgoingXApi(userProfile, m);
                        }
                        self.pebl.storage.saveOutgoingActivity(userProfile, inst);
                        self.pebl.storage.saveActivity(userProfile, inst);
                        self.pebl.emitEvent(self.pebl.events.incomingInstitition, [inst]);
                    });
                });
            }
        });
    };
    PEBLEventHandlers.prototype.saveSystem = function (event) {
        var system = new activity_System(event.detail);
        var xapi = {};
        var self = this;
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                var exts_3 = {
                    role: "owner",
                    activityType: "system"
                };
                self.pebl.storage.getCurrentActivity(function (activity) {
                    self.pebl.storage.getCurrentBook(function (book) {
                        if (activity_System.isNew(system)) {
                            self.xapiGen.addId(xapi);
                            self.xapiGen.addTimestamp(xapi);
                            self.xapiGen.addActorAccount(xapi, userProfile);
                            self.xapiGen.addObject(xapi, eventHandlers_PEBL_THREAD_USER_PREFIX + userProfile.identity, system.id, system.description, self.xapiGen.addExtensions(exts_3));
                            self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#joined", "joined");
                            if (book || activity)
                                self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + (book || activity));
                            var m = new Membership(xapi);
                            system.addMember(m);
                            self.pebl.storage.saveGroupMembership(userProfile, m);
                            self.pebl.storage.saveOutgoingXApi(userProfile, m);
                        }
                        self.pebl.storage.saveOutgoingActivity(userProfile, system);
                        self.pebl.storage.saveActivity(userProfile, system);
                        self.pebl.emitEvent(self.pebl.events.incomingSystem, [system]);
                    });
                });
            }
        });
    };
    PEBLEventHandlers.prototype.newArtifact = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                var exts_4 = {
                    role: payload.role
                };
                self.pebl.storage.getCurrentActivity(function (activity) {
                    self.pebl.storage.getCurrentBook(function (book) {
                        self.xapiGen.addId(xapi);
                        self.xapiGen.addTimestamp(xapi);
                        self.xapiGen.addActorAccount(xapi, userProfile);
                        self.xapiGen.addObject(xapi, PEBL_THREAD_ARTIFACT_PREFIX + payload.thread, payload.artifactId, payload.artifactDescription, self.xapiGen.addExtensions(exts_4));
                        self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#artifactCreated", "artifactCreated");
                        if (book || activity)
                            self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + (book || activity));
                        var m = new Artifact(xapi);
                        self.pebl.storage.saveOutgoingXApi(userProfile, m);
                        self.pebl.storage.saveEvent(userProfile, m);
                    });
                });
            }
        });
    };
    PEBLEventHandlers.prototype.newMembership = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                var exts_5 = {
                    role: payload.role,
                    activityType: payload.activityType,
                    organization: payload.organization,
                    organizationName: payload.organizationName
                };
                self.pebl.storage.getCurrentActivity(function (activity) {
                    self.pebl.storage.getCurrentBook(function (book) {
                        self.xapiGen.addId(xapi);
                        self.xapiGen.addTimestamp(xapi);
                        self.xapiGen.addActorAccount(xapi, userProfile);
                        self.xapiGen.addObject(xapi, eventHandlers_PEBL_THREAD_USER_PREFIX + payload.thread, payload.groupId, payload.groupDescription, self.xapiGen.addExtensions(exts_5));
                        self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#joined", "joined");
                        if (book || activity)
                            self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + (book || activity));
                        var m = new Membership(xapi);
                        self.pebl.storage.saveOutgoingXApi(userProfile, m);
                        self.pebl.emitEvent(self.pebl.events.incomingMembership, [m]);
                        if (payload.thread == userProfile.identity)
                            self.pebl.storage.saveGroupMembership(userProfile, m);
                    });
                });
            }
        });
    };
    PEBLEventHandlers.prototype.modifiedMembership = function (event) {
        var payload = event.detail;
        var oldMembership = payload.oldMembership;
        var newMembership = payload.newMembership;
        var xapiVoided = {};
        var xapiNew = {
            id: ''
        };
        var self = this;
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                var newUserProfile_1 = new UserProfile({
                    identity: oldMembership.actor.account.name,
                    name: oldMembership.actor.name,
                    homePage: oldMembership.actor.account.homePage,
                    preferredName: oldMembership.actor.name
                });
                // First void the old membership
                self.xapiGen.addId(xapiVoided);
                self.xapiGen.addVerb(xapiVoided, "http://adlnet.gov/expapi/verbs/voided", "voided");
                self.xapiGen.addTimestamp(xapiVoided);
                self.xapiGen.addStatementRef(xapiVoided, oldMembership.id);
                self.xapiGen.addActorAccount(xapiVoided, newUserProfile_1);
                self.xapiGen.addParentActivity(xapiVoided, PEBL_PREFIX + oldMembership.id);
                var m = new Voided(xapiVoided);
                // If modifying my own membership
                self.pebl.storage.saveOutgoingXApi(userProfile, m);
                if (newUserProfile_1.identity === userProfile.identity)
                    self.pebl.storage.removeGroupMembership(newUserProfile_1, oldMembership.id);
                self.pebl.emitEvent(self.pebl.events.incomingMembership, [m]);
                // Then send out a new one
                if (newMembership) {
                    var exts_6 = {
                        role: newMembership.role,
                        activityType: newMembership.activityType,
                        organization: newMembership.organization,
                        organizationName: newMembership.organizationName
                    };
                    self.pebl.storage.getCurrentActivity(function (activity) {
                        self.pebl.storage.getCurrentBook(function (book) {
                            xapiNew.id = newMembership.id;
                            self.xapiGen.addTimestamp(xapiNew);
                            self.xapiGen.addActorAccount(xapiNew, newUserProfile_1);
                            self.xapiGen.addObject(xapiNew, eventHandlers_PEBL_THREAD_USER_PREFIX + newUserProfile_1.identity, newMembership.membershipId, newMembership.groupDescription, self.xapiGen.addExtensions(exts_6));
                            self.xapiGen.addVerb(xapiNew, "http://www.peblproject.com/definitions.html#joined", "joined");
                            if (book || activity)
                                self.xapiGen.addParentActivity(xapiNew, PEBL_PREFIX + (book || activity));
                            var n = new Membership(xapiNew);
                            self.pebl.storage.saveOutgoingXApi(userProfile, n);
                            self.pebl.emitEvent(self.pebl.events.incomingMembership, [n]);
                            if (newUserProfile_1.identity === userProfile.identity)
                                self.pebl.storage.saveGroupMembership(userProfile, n);
                        });
                    });
                }
            }
        });
    };
    PEBLEventHandlers.prototype.removedMembership = function (event) {
        var xId = event.detail;
        var xapi = {};
        var self = this;
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.pebl.storage.getCurrentActivity(function (activity) {
                    self.pebl.storage.getCurrentBook(function (book) {
                        self.xapiGen.addId(xapi);
                        self.xapiGen.addVerb(xapi, "http://adlnet.gov/expapi/verbs/voided", "voided");
                        self.xapiGen.addTimestamp(xapi);
                        self.xapiGen.addStatementRef(xapi, xId);
                        self.xapiGen.addActorAccount(xapi, userProfile);
                        self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + xId);
                        var m = new Voided(xapi);
                        self.pebl.storage.removeGroupMembership(userProfile, xId);
                        self.pebl.storage.saveOutgoingXApi(userProfile, m);
                        self.pebl.emitEvent(self.pebl.events.incomingMembership, [m]);
                    });
                });
            }
        });
    };
    PEBLEventHandlers.prototype.newAnnotation = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        self.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                var exts_7 = {
                    type: payload.type,
                    cfi: payload.cfi,
                    idRef: payload.idRef,
                    style: payload.style
                };
                self.pebl.storage.getCurrentActivity(function (activity) {
                    self.pebl.storage.getCurrentBook(function (book) {
                        self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + (activity || book));
                        self.xapiGen.addId(xapi);
                        self.xapiGen.addVerb(xapi, "http://adlnet.gov/expapi/verbs/commented", "commented");
                        self.xapiGen.addTimestamp(xapi);
                        self.xapiGen.addObject(xapi, PEBL_PREFIX + book, payload.title, payload.text, self.xapiGen.addExtensions(exts_7));
                        self.xapiGen.addActorAccount(xapi, userProfile);
                        var annotation = new Annotation(xapi);
                        self.pebl.storage.saveAnnotations(userProfile, annotation);
                        self.pebl.storage.saveOutgoingXApi(userProfile, annotation);
                        self.pebl.emitEvent(self.pebl.events.incomingAnnotations, [annotation]);
                    });
                });
            }
        });
    };
    PEBLEventHandlers.prototype.eventBookmarked = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        self.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                var exts_8 = {
                    type: payload.type,
                    cfi: payload.cfi,
                    idRef: payload.idRef,
                    style: payload.style
                };
                self.pebl.storage.getCurrentActivity(function (activity) {
                    self.pebl.storage.getCurrentBook(function (book) {
                        self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + (activity || book));
                        self.xapiGen.addId(xapi);
                        self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#bookmarked", "bookmarked");
                        self.xapiGen.addTimestamp(xapi);
                        self.xapiGen.addObject(xapi, PEBL_PREFIX + book, payload.title, payload.text, self.xapiGen.addExtensions(exts_8));
                        self.xapiGen.addActorAccount(xapi, userProfile);
                        var annotation = new Annotation(xapi);
                        self.pebl.storage.saveAnnotations(userProfile, annotation);
                        self.pebl.storage.saveOutgoingXApi(userProfile, annotation);
                        self.pebl.emitEvent(self.pebl.events.incomingAnnotations, [annotation]);
                    });
                });
            }
        });
    };
    PEBLEventHandlers.prototype.eventUnbookmarked = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        var exts = {
            idref: payload.idref,
            cfi: payload.cfi
        };
        this.pebl.storage.getCurrentActivity(function (activity) {
            self.pebl.storage.getCurrentBook(function (book) {
                self.pebl.user.getUser(function (userProfile) {
                    if (userProfile) {
                        self.xapiGen.addId(xapi);
                        self.xapiGen.addTimestamp(xapi);
                        self.xapiGen.addActorAccount(xapi, userProfile);
                        self.xapiGen.addObject(xapi, PEBL_PREFIX + book, payload.name, payload.description, self.xapiGen.addExtensions(exts));
                        self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#unbookmarked", "unbookmarked");
                        self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + activity);
                        var s = new Action(xapi);
                        self.pebl.storage.saveOutgoingXApi(userProfile, s);
                        self.pebl.storage.saveEvent(userProfile, s);
                    }
                });
            });
        });
    };
    PEBLEventHandlers.prototype.eventAnnotated = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        self.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                var exts_9 = {
                    type: payload.type,
                    cfi: payload.cfi,
                    idRef: payload.idRef,
                    style: payload.style
                };
                self.pebl.storage.getCurrentActivity(function (activity) {
                    self.pebl.storage.getCurrentBook(function (book) {
                        self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + (activity || book));
                        self.xapiGen.addId(xapi);
                        self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#annotated", "annotated");
                        self.xapiGen.addTimestamp(xapi);
                        self.xapiGen.addObject(xapi, PEBL_PREFIX + book, payload.title, payload.text, self.xapiGen.addExtensions(exts_9));
                        self.xapiGen.addActorAccount(xapi, userProfile);
                        var annotation = new Annotation(xapi);
                        self.pebl.storage.saveAnnotations(userProfile, annotation);
                        self.pebl.storage.saveOutgoingXApi(userProfile, annotation);
                        self.pebl.emitEvent(self.pebl.events.incomingAnnotations, [annotation]);
                    });
                });
            }
        });
    };
    PEBLEventHandlers.prototype.newSharedAnnotation = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                var exts_10 = {
                    type: payload.type,
                    cfi: payload.cfi,
                    idRef: payload.idRef,
                    style: payload.style
                };
                self.pebl.storage.getCurrentActivity(function (activity) {
                    self.pebl.storage.getCurrentBook(function (book) {
                        self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + (activity || book));
                        self.xapiGen.addId(xapi);
                        self.xapiGen.addVerb(xapi, "http://adlnet.gov/expapi/verbs/shared", "shared");
                        self.xapiGen.addTimestamp(xapi);
                        self.xapiGen.addObject(xapi, PEBL_PREFIX + book, payload.title, payload.text, self.xapiGen.addExtensions(exts_10));
                        self.xapiGen.addActorAccount(xapi, userProfile);
                        var annotation = new SharedAnnotation(xapi);
                        self.pebl.storage.saveSharedAnnotations(userProfile, annotation);
                        self.pebl.storage.saveOutgoingXApi(userProfile, annotation);
                        self.pebl.emitEvent(self.pebl.events.incomingSharedAnnotations, [annotation]);
                    });
                });
            }
        });
    };
    PEBLEventHandlers.prototype.eventUnsharedAnnotation = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                var exts_11 = {
                    cfi: payload.cfi,
                    idRef: payload.idRef
                };
                self.pebl.storage.getCurrentActivity(function (activity) {
                    self.pebl.storage.getCurrentBook(function (book) {
                        self.xapiGen.addId(xapi);
                        self.xapiGen.addTimestamp(xapi);
                        self.xapiGen.addActorAccount(xapi, userProfile);
                        self.xapiGen.addObject(xapi, PEBL_PREFIX + book, payload.name, payload.description, self.xapiGen.addExtensions(exts_11));
                        self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#unshared", "unshared");
                        self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + activity);
                        var s = new Action(xapi);
                        self.pebl.storage.saveOutgoingXApi(userProfile, s);
                        self.pebl.storage.saveEvent(userProfile, s);
                    });
                });
            }
        });
    };
    PEBLEventHandlers.prototype.eventUnannotated = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                var exts_12 = {
                    cfi: payload.cfi,
                    idRef: payload.idRef
                };
                self.pebl.storage.getCurrentActivity(function (activity) {
                    self.pebl.storage.getCurrentBook(function (book) {
                        self.xapiGen.addId(xapi);
                        self.xapiGen.addTimestamp(xapi);
                        self.xapiGen.addActorAccount(xapi, userProfile);
                        self.xapiGen.addObject(xapi, PEBL_PREFIX + book, payload.name, payload.description, self.xapiGen.addExtensions(exts_12));
                        self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#unannotated", "unannotated");
                        self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + activity);
                        var s = new Action(xapi);
                        self.pebl.storage.saveOutgoingXApi(userProfile, s);
                        self.pebl.storage.saveEvent(userProfile, s);
                    });
                });
            }
        });
    };
    PEBLEventHandlers.prototype.removedAnnotation = function (event) {
        var xId = event.detail;
        var xapi = {};
        var self = this;
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.pebl.storage.getCurrentActivity(function (activity) {
                    self.pebl.storage.getCurrentBook(function (book) {
                        if (activity)
                            self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + activity);
                        else
                            self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + book);
                        self.xapiGen.addId(xapi);
                        self.xapiGen.addVerb(xapi, "http://adlnet.gov/expapi/verbs/voided", "voided");
                        self.xapiGen.addTimestamp(xapi);
                        self.xapiGen.addStatementRef(xapi, xId);
                        self.xapiGen.addActorAccount(xapi, userProfile);
                        var annotation = new Voided(xapi);
                        self.pebl.storage.removeAnnotation(userProfile, xId);
                        self.pebl.storage.saveOutgoingXApi(userProfile, annotation);
                        self.pebl.emitEvent(self.pebl.events.incomingAnnotations, [annotation]);
                    });
                });
            }
        });
    };
    PEBLEventHandlers.prototype.removedSharedAnnotation = function (event) {
        var xId = event.detail;
        var xapi = {};
        var self = this;
        self.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.xapiGen.addId(xapi);
                self.xapiGen.addVerb(xapi, "http://adlnet.gov/expapi/verbs/voided", "voided");
                self.xapiGen.addTimestamp(xapi);
                self.pebl.storage.getCurrentActivity(function (activity) {
                    self.pebl.storage.getCurrentBook(function (book) {
                        if (activity)
                            self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + activity);
                        else
                            self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + book);
                        self.xapiGen.addStatementRef(xapi, xId);
                        self.xapiGen.addActorAccount(xapi, userProfile);
                        var annotation = new Voided(xapi);
                        self.pebl.storage.removeSharedAnnotation(userProfile, xId);
                        self.pebl.storage.saveOutgoingXApi(userProfile, annotation);
                        self.pebl.emitEvent(self.pebl.events.incomingSharedAnnotations, [annotation]);
                    });
                });
            }
        });
    };
    // -------------------------------
    PEBLEventHandlers.prototype.eventLoggedIn = function (event) {
        var userP = new UserProfile(event.detail);
        var self = this;
        this.pebl.storage.getCurrentUser(function (currentIdentity) {
            self.pebl.storage.saveUserProfile(userP, function () {
                if (userP.identity != currentIdentity) {
                    self.pebl.emitEvent(self.pebl.events.eventLogin, userP);
                }
                self.pebl.network.activate();
            });
        });
    };
    PEBLEventHandlers.prototype.eventLoggedOut = function (event) {
        var self = this;
        this.pebl.user.getUser(function (currentUser) {
            self.pebl.network.disable(function () {
                self.pebl.emitEvent(self.pebl.events.eventLogout, currentUser);
            });
        });
    };
    // -------------------------------
    PEBLEventHandlers.prototype.eventSessionStart = function (event) {
        var xapi = {};
        var self = this;
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.pebl.storage.getCurrentActivity(function (activity) {
                    self.pebl.storage.getCurrentBook(function (book) {
                        self.xapiGen.addId(xapi);
                        self.xapiGen.addTimestamp(xapi);
                        self.xapiGen.addActorAccount(xapi, userProfile);
                        self.xapiGen.addObject(xapi, PEBL_PREFIX + book);
                        self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#entered", "entered");
                        if (book || activity)
                            self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + (book || activity));
                        var s = new Session(xapi);
                        self.pebl.storage.saveOutgoingXApi(userProfile, s);
                        self.pebl.storage.saveEvent(userProfile, s);
                    });
                });
            }
        });
    };
    PEBLEventHandlers.prototype.eventSessionStop = function (event) {
        var xapi = {};
        var self = this;
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.pebl.storage.getCurrentActivity(function (activity) {
                    self.pebl.storage.getCurrentBook(function (book) {
                        self.xapiGen.addId(xapi);
                        self.xapiGen.addTimestamp(xapi);
                        self.xapiGen.addActorAccount(xapi, userProfile);
                        self.xapiGen.addObject(xapi, PEBL_PREFIX + book);
                        self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#exited", "exited");
                        if (book || activity)
                            self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + (book || activity));
                        var s = new Session(xapi);
                        self.pebl.storage.saveOutgoingXApi(userProfile, s);
                        self.pebl.storage.saveEvent(userProfile, s);
                    });
                });
            }
        });
    };
    PEBLEventHandlers.prototype.eventLaunched = function (event) {
        var xapi = {};
        var self = this;
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.pebl.storage.getCurrentActivity(function (activity) {
                    self.pebl.storage.getCurrentBook(function (book) {
                        self.xapiGen.addId(xapi);
                        self.xapiGen.addTimestamp(xapi);
                        self.xapiGen.addActorAccount(xapi, userProfile);
                        self.xapiGen.addObject(xapi, PEBL_PREFIX + book);
                        self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#launched", "launched");
                        if (book || activity)
                            self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + (book || activity));
                        var s = new Session(xapi);
                        self.pebl.storage.saveOutgoingXApi(userProfile, s);
                        self.pebl.storage.saveEvent(userProfile, s);
                    });
                });
            }
        });
    };
    // -------------------------------
    PEBLEventHandlers.prototype.eventTerminated = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.xapiGen.addId(xapi);
                self.xapiGen.addTimestamp(xapi);
                self.xapiGen.addActorAccount(xapi, userProfile);
                self.xapiGen.addObject(xapi, PEBL_PREFIX + payload);
                self.xapiGen.addVerb(xapi, "http://adlnet.gov/expapi/verbs/terminated", "terminated");
                self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + payload);
                var s = new Session(xapi);
                self.pebl.storage.saveOutgoingXApi(userProfile, s);
                self.pebl.storage.saveEvent(userProfile, s);
            }
        });
    };
    PEBLEventHandlers.prototype.eventInitialized = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        this.pebl.storage.getCurrentBook(function (book) {
            self.pebl.user.getUser(function (userProfile) {
                if (userProfile) {
                    self.xapiGen.addId(xapi);
                    self.xapiGen.addTimestamp(xapi);
                    self.xapiGen.addActorAccount(xapi, userProfile);
                    self.xapiGen.addObject(xapi, PEBL_PREFIX + book, payload.name, payload.description);
                    self.xapiGen.addVerb(xapi, "http://adlnet.gov/expapi/verbs/initialized", "initialized");
                    self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + payload.activity);
                    var s = new Session(xapi);
                    self.pebl.storage.saveOutgoingXApi(userProfile, s);
                    self.pebl.storage.saveEvent(userProfile, s);
                }
            });
        });
    };
    PEBLEventHandlers.prototype.eventInteracted = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        var exts = {
            target: payload.target,
            type: payload.type
        };
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.xapiGen.addId(xapi);
                self.xapiGen.addTimestamp(xapi);
                self.xapiGen.addActorAccount(xapi, userProfile);
                self.xapiGen.addObject(xapi, PEBL_PREFIX + payload.activity, payload.name, payload.description, self.xapiGen.addExtensions(exts));
                self.xapiGen.addVerb(xapi, "http://adlnet.gov/expapi/verbs/interacted", "interacted");
                self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + payload.activity);
                var s = new Action(xapi);
                self.pebl.storage.saveOutgoingXApi(userProfile, s);
                self.pebl.storage.saveEvent(userProfile, s);
            }
        });
    };
    PEBLEventHandlers.prototype.eventJumpPage = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        this.pebl.storage.getCurrentBook(function (book) {
            self.pebl.storage.getCurrentActivity(function (activity) {
                self.pebl.user.getUser(function (userProfile) {
                    if (userProfile) {
                        self.xapiGen.addId(xapi);
                        self.xapiGen.addTimestamp(xapi);
                        self.xapiGen.addActorAccount(xapi, userProfile);
                        self.xapiGen.addObject(xapi, PEBL_PREFIX + book, payload.name, payload.description);
                        self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#paged-jump", "paged-jump");
                        if (activity)
                            self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + activity);
                        var s = new Navigation(xapi);
                        self.pebl.storage.saveOutgoingXApi(userProfile, s);
                        self.pebl.storage.saveEvent(userProfile, s);
                    }
                });
            });
        });
    };
    // -------------------------------
    PEBLEventHandlers.prototype.eventAttempted = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        this.pebl.storage.getCurrentActivity(function (activity) {
            self.pebl.storage.getCurrentActivity(function (book) {
                self.pebl.user.getUser(function (userProfile) {
                    if (userProfile) {
                        self.xapiGen.addId(xapi);
                        self.xapiGen.addTimestamp(xapi);
                        self.xapiGen.addActorAccount(xapi, userProfile);
                        self.xapiGen.addObjectInteraction(xapi, PEBL_PREFIX + book, payload.name, payload.prompt, "choice", payload.answers, payload.correctAnswers);
                        self.xapiGen.addResult(xapi, payload.score, payload.minScore, payload.maxScore, payload.complete, payload.success, payload.answered);
                        self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#attempted", "attempted");
                        self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + (activity || book));
                        var s = new Question(xapi);
                        self.pebl.storage.saveOutgoingXApi(userProfile, s);
                        self.pebl.storage.saveEvent(userProfile, s);
                    }
                });
            });
        });
    };
    PEBLEventHandlers.prototype.eventPassed = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        this.pebl.storage.getCurrentActivity(function (activity) {
            self.pebl.storage.getCurrentActivity(function (book) {
                self.pebl.user.getUser(function (userProfile) {
                    if (userProfile) {
                        self.xapiGen.addId(xapi);
                        self.xapiGen.addTimestamp(xapi);
                        self.xapiGen.addActorAccount(xapi, userProfile);
                        self.xapiGen.addObject(xapi, PEBL_PREFIX + book, payload.name, payload.description);
                        self.xapiGen.addResult(xapi, payload.score, payload.minScore, payload.maxScore, payload.complete, payload.success);
                        self.xapiGen.addVerb(xapi, "http://adlnet.gov/expapi/verbs/passed", "passed");
                        self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + (activity || book));
                        var s = new Quiz(xapi);
                        self.pebl.storage.saveOutgoingXApi(userProfile, s);
                        self.pebl.storage.saveEvent(userProfile, s);
                    }
                });
            });
        });
    };
    PEBLEventHandlers.prototype.eventFailed = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        this.pebl.storage.getCurrentActivity(function (activity) {
            self.pebl.storage.getCurrentActivity(function (book) {
                self.pebl.user.getUser(function (userProfile) {
                    if (userProfile) {
                        self.xapiGen.addId(xapi);
                        self.xapiGen.addTimestamp(xapi);
                        self.xapiGen.addActorAccount(xapi, userProfile);
                        self.xapiGen.addObject(xapi, PEBL_PREFIX + book, payload.name, payload.description);
                        self.xapiGen.addResult(xapi, payload.score, payload.minScore, payload.maxScore, payload.complete, payload.success);
                        self.xapiGen.addVerb(xapi, "http://adlnet.gov/expapi/verbs/failed", "failed");
                        self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + (activity || book));
                        var s = new Quiz(xapi);
                        self.pebl.storage.saveOutgoingXApi(userProfile, s);
                        self.pebl.storage.saveEvent(userProfile, s);
                    }
                });
            });
        });
    };
    // -------------------------------
    PEBLEventHandlers.prototype.eventPreferred = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        var exts = {
            target: payload.target,
            type: payload.type
        };
        this.pebl.storage.getCurrentActivity(function (activity) {
            self.pebl.storage.getCurrentActivity(function (book) {
                self.pebl.user.getUser(function (userProfile) {
                    if (userProfile) {
                        self.xapiGen.addId(xapi);
                        self.xapiGen.addTimestamp(xapi);
                        self.xapiGen.addActorAccount(xapi, userProfile);
                        self.xapiGen.addObject(xapi, PEBL_PREFIX + book, payload.name, payload.description, self.xapiGen.addExtensions(exts));
                        self.xapiGen.addVerb(xapi, "http://adlnet.gov/expapi/verbs/preferred", "preferred");
                        self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + (activity || book));
                        var s = new Action(xapi);
                        self.pebl.storage.saveOutgoingXApi(userProfile, s);
                        self.pebl.storage.saveEvent(userProfile, s);
                    }
                });
            });
        });
    };
    PEBLEventHandlers.prototype.eventContentMorphed = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        var exts = {
            target: payload.target,
            type: payload.type
        };
        this.pebl.storage.getCurrentActivity(function (activity) {
            self.pebl.storage.getCurrentBook(function (book) {
                self.pebl.user.getUser(function (userProfile) {
                    if (userProfile) {
                        self.xapiGen.addId(xapi);
                        self.xapiGen.addTimestamp(xapi);
                        self.xapiGen.addActorAccount(xapi, userProfile);
                        self.xapiGen.addObject(xapi, PEBL_PREFIX + book, payload.name, payload.description, self.xapiGen.addExtensions(exts));
                        self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#morphed", "morphed");
                        self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + activity);
                        var s = new Action(xapi);
                        self.pebl.storage.saveOutgoingXApi(userProfile, s);
                        self.pebl.storage.saveEvent(userProfile, s);
                    }
                });
            });
        });
    };
    PEBLEventHandlers.prototype.eventExperienced = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        var exts = {
            target: payload.target,
            type: payload.type
        };
        this.pebl.storage.getCurrentActivity(function (activity) {
            self.pebl.storage.getCurrentBook(function (book) {
                self.pebl.user.getUser(function (userProfile) {
                    if (userProfile) {
                        self.xapiGen.addId(xapi);
                        self.xapiGen.addTimestamp(xapi);
                        self.xapiGen.addActorAccount(xapi, userProfile);
                        self.xapiGen.addObject(xapi, PEBL_PREFIX + book, payload.name, payload.description, self.xapiGen.addExtensions(exts));
                        self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#experienced", "experienced");
                        self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + activity);
                        var s = new Action(xapi);
                        self.pebl.storage.saveOutgoingXApi(userProfile, s);
                        self.pebl.storage.saveEvent(userProfile, s);
                    }
                });
            });
        });
    };
    PEBLEventHandlers.prototype.eventDisliked = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        var exts = {
            target: payload.target,
            type: payload.type
        };
        this.pebl.storage.getCurrentActivity(function (activity) {
            self.pebl.storage.getCurrentBook(function (book) {
                self.pebl.user.getUser(function (userProfile) {
                    if (userProfile) {
                        self.xapiGen.addId(xapi);
                        self.xapiGen.addTimestamp(xapi);
                        self.xapiGen.addActorAccount(xapi, userProfile);
                        self.xapiGen.addObject(xapi, PEBL_PREFIX + book, payload.name, payload.description, self.xapiGen.addExtensions(exts));
                        self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#disliked", "disliked");
                        self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + activity);
                        var s = new Action(xapi);
                        self.pebl.storage.saveOutgoingXApi(userProfile, s);
                        self.pebl.storage.saveEvent(userProfile, s);
                    }
                });
            });
        });
    };
    PEBLEventHandlers.prototype.eventLiked = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        var exts = {
            target: payload.target,
            type: payload.type
        };
        this.pebl.storage.getCurrentActivity(function (activity) {
            self.pebl.storage.getCurrentBook(function (book) {
                self.pebl.user.getUser(function (userProfile) {
                    if (userProfile) {
                        self.xapiGen.addId(xapi);
                        self.xapiGen.addTimestamp(xapi);
                        self.xapiGen.addActorAccount(xapi, userProfile);
                        self.xapiGen.addObject(xapi, PEBL_PREFIX + book, payload.name, payload.description, self.xapiGen.addExtensions(exts));
                        self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#liked", "liked");
                        self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + activity);
                        var s = new Action(xapi);
                        self.pebl.storage.saveOutgoingXApi(userProfile, s);
                        self.pebl.storage.saveEvent(userProfile, s);
                    }
                });
            });
        });
    };
    PEBLEventHandlers.prototype.eventAccessed = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        var exts = {
            idref: payload.idref,
            cfi: payload.cfi,
            target: payload.target,
            type: payload.type
        };
        this.pebl.storage.getCurrentActivity(function (activity) {
            self.pebl.storage.getCurrentBook(function (book) {
                self.pebl.user.getUser(function (userProfile) {
                    if (userProfile) {
                        self.xapiGen.addId(xapi);
                        self.xapiGen.addTimestamp(xapi);
                        self.xapiGen.addActorAccount(xapi, userProfile);
                        self.xapiGen.addObject(xapi, PEBL_PREFIX + book, payload.name, payload.description, self.xapiGen.addExtensions(exts));
                        self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#accessed", "accessed");
                        self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + activity);
                        var s = new Action(xapi);
                        self.pebl.storage.saveOutgoingXApi(userProfile, s);
                        self.pebl.storage.saveEvent(userProfile, s);
                    }
                });
            });
        });
    };
    PEBLEventHandlers.prototype.eventSubmitted = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        var exts = {
            idref: payload.idref,
            cfi: payload.cfi,
            target: payload.target,
            type: payload.type
        };
        this.pebl.storage.getCurrentActivity(function (activity) {
            self.pebl.storage.getCurrentBook(function (book) {
                self.pebl.user.getUser(function (userProfile) {
                    if (userProfile) {
                        self.xapiGen.addId(xapi);
                        self.xapiGen.addTimestamp(xapi);
                        self.xapiGen.addActorAccount(xapi, userProfile);
                        self.xapiGen.addObject(xapi, PEBL_PREFIX + book, payload.name, payload.description, self.xapiGen.addExtensions(exts));
                        self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#submitted", "submitted");
                        self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + activity);
                        var s = new Action(xapi);
                        self.pebl.storage.saveOutgoingXApi(userProfile, s);
                        self.pebl.storage.saveEvent(userProfile, s);
                    }
                });
            });
        });
    };
    PEBLEventHandlers.prototype.eventHid = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        var exts = {
            target: payload.target,
            type: payload.type
        };
        this.pebl.storage.getCurrentActivity(function (activity) {
            self.pebl.storage.getCurrentBook(function (book) {
                self.pebl.user.getUser(function (userProfile) {
                    if (userProfile) {
                        self.xapiGen.addId(xapi);
                        self.xapiGen.addTimestamp(xapi);
                        self.xapiGen.addActorAccount(xapi, userProfile);
                        self.xapiGen.addObject(xapi, PEBL_PREFIX + book, payload.name, payload.description, self.xapiGen.addExtensions(exts));
                        self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#hid", "hid");
                        self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + activity);
                        var s = new Action(xapi);
                        self.pebl.storage.saveOutgoingXApi(userProfile, s);
                        self.pebl.storage.saveEvent(userProfile, s);
                    }
                });
            });
        });
    };
    PEBLEventHandlers.prototype.eventShowed = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        var exts = {
            target: payload.target,
            type: payload.type
        };
        this.pebl.storage.getCurrentActivity(function (activity) {
            self.pebl.storage.getCurrentBook(function (book) {
                self.pebl.user.getUser(function (userProfile) {
                    if (userProfile) {
                        self.xapiGen.addId(xapi);
                        self.xapiGen.addTimestamp(xapi);
                        self.xapiGen.addActorAccount(xapi, userProfile);
                        self.xapiGen.addObject(xapi, PEBL_PREFIX + book, payload.name, payload.description, self.xapiGen.addExtensions(exts));
                        self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#showed", "showed");
                        self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + activity);
                        var s = new Action(xapi);
                        self.pebl.storage.saveOutgoingXApi(userProfile, s);
                        self.pebl.storage.saveEvent(userProfile, s);
                    }
                });
            });
        });
    };
    PEBLEventHandlers.prototype.eventDisplayed = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        var exts = {
            target: payload.target,
            type: payload.type
        };
        this.pebl.storage.getCurrentActivity(function (activity) {
            self.pebl.storage.getCurrentBook(function (book) {
                self.pebl.user.getUser(function (userProfile) {
                    if (userProfile) {
                        self.xapiGen.addId(xapi);
                        self.xapiGen.addTimestamp(xapi);
                        self.xapiGen.addActorAccount(xapi, userProfile);
                        self.xapiGen.addObject(xapi, PEBL_PREFIX + book, payload.name, payload.description, self.xapiGen.addExtensions(exts));
                        self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#displayed", "displayed");
                        self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + activity);
                        var s = new Action(xapi);
                        self.pebl.storage.saveOutgoingXApi(userProfile, s);
                        self.pebl.storage.saveEvent(userProfile, s);
                    }
                });
            });
        });
    };
    PEBLEventHandlers.prototype.eventUndisplayed = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        var exts = {
            target: payload.target,
            type: payload.type
        };
        this.pebl.storage.getCurrentActivity(function (activity) {
            self.pebl.storage.getCurrentBook(function (book) {
                self.pebl.user.getUser(function (userProfile) {
                    if (userProfile) {
                        self.xapiGen.addId(xapi);
                        self.xapiGen.addTimestamp(xapi);
                        self.xapiGen.addActorAccount(xapi, userProfile);
                        self.xapiGen.addObject(xapi, PEBL_PREFIX + book, payload.name, payload.description, self.xapiGen.addExtensions(exts));
                        self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#undisplayed", "undisplayed");
                        self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + activity);
                        var s = new Action(xapi);
                        self.pebl.storage.saveOutgoingXApi(userProfile, s);
                        self.pebl.storage.saveEvent(userProfile, s);
                    }
                });
            });
        });
    };
    PEBLEventHandlers.prototype.eventSearched = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        var exts = {
            target: payload.target,
            type: payload.type
        };
        this.pebl.storage.getCurrentActivity(function (activity) {
            self.pebl.storage.getCurrentBook(function (book) {
                self.pebl.user.getUser(function (userProfile) {
                    if (userProfile) {
                        self.xapiGen.addId(xapi);
                        self.xapiGen.addTimestamp(xapi);
                        self.xapiGen.addActorAccount(xapi, userProfile);
                        self.xapiGen.addObject(xapi, PEBL_PREFIX + book, payload.name, payload.description, self.xapiGen.addExtensions(exts));
                        self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#searched", "searched");
                        self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + activity);
                        var s = new Action(xapi);
                        self.pebl.storage.saveOutgoingXApi(userProfile, s);
                        self.pebl.storage.saveEvent(userProfile, s);
                    }
                });
            });
        });
    };
    PEBLEventHandlers.prototype.eventSelected = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        var exts = {
            target: payload.target,
            type: payload.type
        };
        this.pebl.storage.getCurrentActivity(function (activity) {
            self.pebl.storage.getCurrentBook(function (book) {
                self.pebl.user.getUser(function (userProfile) {
                    if (userProfile) {
                        self.xapiGen.addId(xapi);
                        self.xapiGen.addTimestamp(xapi);
                        self.xapiGen.addActorAccount(xapi, userProfile);
                        self.xapiGen.addObject(xapi, PEBL_PREFIX + book, payload.name, payload.description, self.xapiGen.addExtensions(exts));
                        self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#selected", "selected");
                        self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + activity);
                        var s = new Action(xapi);
                        self.pebl.storage.saveOutgoingXApi(userProfile, s);
                        self.pebl.storage.saveEvent(userProfile, s);
                    }
                });
            });
        });
    };
    PEBLEventHandlers.prototype.eventDiscarded = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        var exts = {
            target: payload.target,
            type: payload.type
        };
        this.pebl.storage.getCurrentActivity(function (activity) {
            self.pebl.storage.getCurrentBook(function (book) {
                self.pebl.user.getUser(function (userProfile) {
                    if (userProfile) {
                        self.xapiGen.addId(xapi);
                        self.xapiGen.addTimestamp(xapi);
                        self.xapiGen.addActorAccount(xapi, userProfile);
                        self.xapiGen.addObject(xapi, PEBL_PREFIX + book, payload.name, payload.description, self.xapiGen.addExtensions(exts));
                        self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#discarded", "discarded");
                        self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + activity);
                        var s = new Action(xapi);
                        self.pebl.storage.saveOutgoingXApi(userProfile, s);
                        self.pebl.storage.saveEvent(userProfile, s);
                    }
                });
            });
        });
    };
    PEBLEventHandlers.prototype.eventNextPage = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        var exts = {
            firstCfi: payload.firstCfi,
            lastCfi: payload.lastCfi
        };
        this.pebl.storage.getCurrentBook(function (book) {
            self.pebl.storage.getCurrentActivity(function (activity) {
                self.pebl.user.getUser(function (userProfile) {
                    if (userProfile) {
                        self.xapiGen.addId(xapi);
                        self.xapiGen.addTimestamp(xapi);
                        self.xapiGen.addActorAccount(xapi, userProfile);
                        self.xapiGen.addObject(xapi, PEBL_PREFIX + book, payload.name, payload.description, self.xapiGen.addExtensions(exts));
                        self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#paged-next", "paged-next");
                        if (activity)
                            self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + activity);
                        var s = new Navigation(xapi);
                        self.pebl.storage.saveOutgoingXApi(userProfile, s);
                        self.pebl.storage.saveEvent(userProfile, s);
                    }
                });
            });
        });
    };
    PEBLEventHandlers.prototype.eventPrevPage = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        var exts = {
            firstCfi: payload.firstCfi,
            lastCfi: payload.lastCfi
        };
        this.pebl.storage.getCurrentBook(function (book) {
            self.pebl.storage.getCurrentActivity(function (activity) {
                self.pebl.user.getUser(function (userProfile) {
                    if (userProfile) {
                        self.xapiGen.addId(xapi);
                        self.xapiGen.addTimestamp(xapi);
                        self.xapiGen.addActorAccount(xapi, userProfile);
                        self.xapiGen.addObject(xapi, PEBL_PREFIX + book, payload.name, payload.description, self.xapiGen.addExtensions(exts));
                        self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#paged-prev", "paged-prev");
                        if (activity)
                            self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + activity);
                        var s = new Navigation(xapi);
                        self.pebl.storage.saveOutgoingXApi(userProfile, s);
                        self.pebl.storage.saveEvent(userProfile, s);
                    }
                });
            });
        });
    };
    PEBLEventHandlers.prototype.eventCompleted = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        this.pebl.storage.getCurrentBook(function (book) {
            self.pebl.storage.getCurrentActivity(function (activity) {
                self.pebl.user.getUser(function (userProfile) {
                    if (userProfile) {
                        self.xapiGen.addId(xapi);
                        self.xapiGen.addTimestamp(xapi);
                        self.xapiGen.addActorAccount(xapi, userProfile);
                        self.xapiGen.addObject(xapi, PEBL_PREFIX + book, payload.name, payload.description);
                        self.xapiGen.addVerb(xapi, "http://adlnet.gov/expapi/verbs/completed", "completed");
                        if (activity)
                            self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + activity);
                        var s = new Navigation(xapi);
                        self.pebl.storage.saveOutgoingXApi(userProfile, s);
                        self.pebl.storage.saveEvent(userProfile, s);
                    }
                });
            });
        });
    };
    PEBLEventHandlers.prototype.eventCompatibilityTested = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        var exts = {
            readerName: payload.readerName,
            osName: payload.osName,
            osVersion: payload.osVersion,
            browserName: payload.browserName,
            browserVersion: payload.browserVersion,
            userAgent: payload.userAgent,
            appVersion: payload.appVersion,
            platform: payload.platform,
            vendor: payload.vendor,
            testResults: payload.testResults
        };
        this.pebl.storage.getCurrentBook(function (book) {
            self.pebl.storage.getCurrentActivity(function (activity) {
                self.pebl.user.getUser(function (userProfile) {
                    if (userProfile) {
                        self.xapiGen.addId(xapi);
                        self.xapiGen.addTimestamp(xapi);
                        self.xapiGen.addActorAccount(xapi, userProfile);
                        self.xapiGen.addObject(xapi, PEBL_PREFIX + book, payload.name, payload.description, self.xapiGen.addExtensions(exts));
                        self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#compatibilityTested", "compatibilityTested");
                        if (activity)
                            self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + activity);
                        var test = new CompatibilityTest(xapi);
                        self.pebl.storage.saveOutgoingXApi(userProfile, test);
                    }
                });
            });
        });
    };
    PEBLEventHandlers.prototype.eventChecklisted = function (event) {
    };
    PEBLEventHandlers.prototype.eventHelped = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        this.pebl.storage.getCurrentBook(function (book) {
            self.pebl.storage.getCurrentActivity(function (activity) {
                self.pebl.user.getUser(function (userProfile) {
                    if (userProfile) {
                        self.xapiGen.addId(xapi);
                        self.xapiGen.addTimestamp(xapi);
                        self.xapiGen.addActorAccount(xapi, userProfile);
                        self.xapiGen.addObject(xapi, PEBL_PREFIX + book, payload.name, payload.description);
                        self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#helped", "helped");
                        if (activity)
                            self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + activity);
                        var s = new Navigation(xapi);
                        self.pebl.storage.saveOutgoingXApi(userProfile, s);
                        self.pebl.storage.saveEvent(userProfile, s);
                    }
                });
            });
        });
    };
    PEBLEventHandlers.prototype.eventInvited = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        var exts = {
            programId: payload.programId,
            programRole: payload.programRole
        };
        this.pebl.storage.getCurrentBook(function (book) {
            self.pebl.storage.getCurrentActivity(function (activity) {
                self.pebl.user.getUser(function (userProfile) {
                    if (userProfile) {
                        self.xapiGen.addId(xapi);
                        self.xapiGen.addTimestamp(xapi);
                        self.xapiGen.addActorAccount(xapi, userProfile);
                        self.xapiGen.addObject(xapi, PEBL_PREFIX + 'Harness', payload.token, payload.description, self.xapiGen.addExtensions(exts));
                        self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#invited", "invited");
                        if (activity)
                            self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + activity);
                        var invite = new Invitation(xapi);
                        self.pebl.storage.saveOutgoingXApi(userProfile, invite);
                    }
                });
            });
        });
    };
    PEBLEventHandlers.prototype.eventUninvited = function (event) {
        var xId = event.detail;
        var xapi = {};
        var self = this;
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.pebl.storage.getCurrentActivity(function (activity) {
                    self.pebl.storage.getCurrentBook(function (book) {
                        self.xapiGen.addId(xapi);
                        self.xapiGen.addVerb(xapi, "http://adlnet.gov/expapi/verbs/voided", "voided");
                        self.xapiGen.addTimestamp(xapi);
                        self.xapiGen.addStatementRef(xapi, xId);
                        self.xapiGen.addActorAccount(xapi, userProfile);
                        self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + 'Harness');
                        var uninvite = new Voided(xapi);
                        self.pebl.storage.saveOutgoingXApi(userProfile, uninvite);
                    });
                });
            }
        });
    };
    PEBLEventHandlers.prototype.eventProgramLevelUp = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        var exts = {
            previousValue: payload.previousValue,
            newValue: payload.newValue,
            action: payload.action
        };
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.xapiGen.addId(xapi);
                self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#programLevelUp", "programLevelUp");
                self.xapiGen.addTimestamp(xapi);
                self.xapiGen.addActorAccount(xapi, userProfile);
                self.xapiGen.addObject(xapi, eventHandlers_PEBL_THREAD_GROUP_PREFIX + payload.programId, payload.programId, payload.description, self.xapiGen.addExtensions(exts));
                var pa = new ProgramAction(xapi);
                self.pebl.storage.saveOutgoingXApi(userProfile, pa);
            }
        });
    };
    PEBLEventHandlers.prototype.eventProgramLevelDown = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        var exts = {
            previousValue: payload.previousValue,
            newValue: payload.newValue,
            action: payload.action
        };
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.xapiGen.addId(xapi);
                self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#programLevelDown", "programLevelDown");
                self.xapiGen.addTimestamp(xapi);
                self.xapiGen.addActorAccount(xapi, userProfile);
                self.xapiGen.addObject(xapi, eventHandlers_PEBL_THREAD_GROUP_PREFIX + payload.programId, payload.programId, payload.description, self.xapiGen.addExtensions(exts));
                var pa = new ProgramAction(xapi);
                self.pebl.storage.saveOutgoingXApi(userProfile, pa);
            }
        });
    };
    PEBLEventHandlers.prototype.eventProgramInvited = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        var exts = {
            previousValue: payload.previousValue,
            newValue: payload.newValue,
            action: payload.action
        };
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.xapiGen.addId(xapi);
                self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#programInvited", "programInvited");
                self.xapiGen.addTimestamp(xapi);
                self.xapiGen.addActorAccount(xapi, userProfile);
                self.xapiGen.addObject(xapi, eventHandlers_PEBL_THREAD_GROUP_PREFIX + payload.programId, payload.programId, payload.description, self.xapiGen.addExtensions(exts));
                var pa = new ProgramAction(xapi);
                self.pebl.storage.saveOutgoingXApi(userProfile, pa);
            }
        });
    };
    PEBLEventHandlers.prototype.eventProgramUninvited = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        var exts = {
            previousValue: payload.previousValue,
            newValue: payload.newValue,
            action: payload.action
        };
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.xapiGen.addId(xapi);
                self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#programUninvited", "programUninvited");
                self.xapiGen.addTimestamp(xapi);
                self.xapiGen.addActorAccount(xapi, userProfile);
                self.xapiGen.addObject(xapi, eventHandlers_PEBL_THREAD_GROUP_PREFIX + payload.programId, payload.programId, payload.description, self.xapiGen.addExtensions(exts));
                var pa = new ProgramAction(xapi);
                self.pebl.storage.saveOutgoingXApi(userProfile, pa);
            }
        });
    };
    PEBLEventHandlers.prototype.eventProgramJoined = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        var exts = {
            previousValue: payload.previousValue,
            newValue: payload.newValue,
            action: payload.action
        };
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.xapiGen.addId(xapi);
                self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#programJoined", "programJoined");
                self.xapiGen.addTimestamp(xapi);
                self.xapiGen.addActorAccount(xapi, userProfile);
                self.xapiGen.addObject(xapi, eventHandlers_PEBL_THREAD_GROUP_PREFIX + payload.programId, payload.programId, payload.description, self.xapiGen.addExtensions(exts));
                var pa = new ProgramAction(xapi);
                self.pebl.storage.saveOutgoingXApi(userProfile, pa);
            }
        });
    };
    PEBLEventHandlers.prototype.eventProgramExpelled = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        var exts = {
            previousValue: payload.previousValue,
            newValue: payload.newValue,
            action: payload.action
        };
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.xapiGen.addId(xapi);
                self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#programExpelled", "programExpelled");
                self.xapiGen.addTimestamp(xapi);
                self.xapiGen.addActorAccount(xapi, userProfile);
                self.xapiGen.addObject(xapi, eventHandlers_PEBL_THREAD_GROUP_PREFIX + payload.programId, payload.programId, payload.description, self.xapiGen.addExtensions(exts));
                var pa = new ProgramAction(xapi);
                self.pebl.storage.saveOutgoingXApi(userProfile, pa);
            }
        });
    };
    PEBLEventHandlers.prototype.eventProgramActivityLaunched = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        var exts = {
            newValue: payload.newValue,
            action: payload.action
        };
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.xapiGen.addId(xapi);
                self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#programActivityLaunched", "programActivityLaunched");
                self.xapiGen.addTimestamp(xapi);
                self.xapiGen.addActorAccount(xapi, userProfile);
                self.xapiGen.addObject(xapi, eventHandlers_PEBL_THREAD_GROUP_PREFIX + payload.programId, payload.programId, payload.description, self.xapiGen.addExtensions(exts));
                var pa = new ProgramAction(xapi);
                self.pebl.storage.saveOutgoingXApi(userProfile, pa);
            }
        });
    };
    PEBLEventHandlers.prototype.eventProgramActivityCompleted = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        var exts = {
            newValue: payload.newValue,
            action: payload.action
        };
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.xapiGen.addId(xapi);
                self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#programActivityCompleted", "programActivityCompleted");
                self.xapiGen.addTimestamp(xapi);
                self.xapiGen.addActorAccount(xapi, userProfile);
                self.xapiGen.addObject(xapi, eventHandlers_PEBL_THREAD_GROUP_PREFIX + payload.programId, payload.programId, payload.description, self.xapiGen.addExtensions(exts));
                var pa = new ProgramAction(xapi);
                self.pebl.storage.saveOutgoingXApi(userProfile, pa);
            }
        });
    };
    PEBLEventHandlers.prototype.eventProgramActivityTeamCompleted = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        var exts = {
            newValue: payload.newValue,
            action: payload.action
        };
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.xapiGen.addId(xapi);
                self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#programActivityTeamCompleted", "programActivityTeamCompleted");
                self.xapiGen.addTimestamp(xapi);
                self.xapiGen.addActorAccount(xapi, userProfile);
                self.xapiGen.addObject(xapi, eventHandlers_PEBL_THREAD_GROUP_PREFIX + payload.programId, payload.programId, payload.description, self.xapiGen.addExtensions(exts));
                var pa = new ProgramAction(xapi);
                self.pebl.storage.saveOutgoingXApi(userProfile, pa);
            }
        });
    };
    PEBLEventHandlers.prototype.eventProgramModified = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        var exts = {
            previousValue: payload.previousValue,
            newValue: payload.newValue,
            action: payload.action
        };
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.xapiGen.addId(xapi);
                self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#programModified", "programModified");
                self.xapiGen.addTimestamp(xapi);
                self.xapiGen.addActorAccount(xapi, userProfile);
                self.xapiGen.addObject(xapi, eventHandlers_PEBL_THREAD_GROUP_PREFIX + payload.programId, payload.programId, payload.description, self.xapiGen.addExtensions(exts));
                var pa = new ProgramAction(xapi);
                self.pebl.storage.saveOutgoingXApi(userProfile, pa);
            }
        });
    };
    PEBLEventHandlers.prototype.eventProgramDeleted = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        var exts = {
            previousValue: payload.previousValue,
            newValue: payload.newValue,
            action: payload.action
        };
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.xapiGen.addId(xapi);
                self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#programDeleted", "programDeleted");
                self.xapiGen.addTimestamp(xapi);
                self.xapiGen.addActorAccount(xapi, userProfile);
                self.xapiGen.addObject(xapi, eventHandlers_PEBL_THREAD_GROUP_PREFIX + payload.programId, payload.programId, payload.description, self.xapiGen.addExtensions(exts));
                var pa = new ProgramAction(xapi);
                self.pebl.storage.saveOutgoingXApi(userProfile, pa);
            }
        });
    };
    PEBLEventHandlers.prototype.eventProgramCompleted = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        var exts = {
            action: payload.action
        };
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.xapiGen.addId(xapi);
                self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#programCompleted", "programCompleted");
                self.xapiGen.addTimestamp(xapi);
                self.xapiGen.addActorAccount(xapi, userProfile);
                self.xapiGen.addObject(xapi, eventHandlers_PEBL_THREAD_GROUP_PREFIX + payload.programId, payload.programId, payload.description, self.xapiGen.addExtensions(exts));
                var pa = new ProgramAction(xapi);
                self.pebl.storage.saveOutgoingXApi(userProfile, pa);
            }
        });
    };
    PEBLEventHandlers.prototype.eventProgramCopied = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        var exts = {
            previousValue: payload.previousValue,
            newValue: payload.newValue,
            action: payload.action
        };
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.xapiGen.addId(xapi);
                self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#programCopied", "programCopied");
                self.xapiGen.addTimestamp(xapi);
                self.xapiGen.addActorAccount(xapi, userProfile);
                self.xapiGen.addObject(xapi, eventHandlers_PEBL_THREAD_GROUP_PREFIX + payload.programId, payload.programId, payload.description, self.xapiGen.addExtensions(exts));
                var pa = new ProgramAction(xapi);
                self.pebl.storage.saveOutgoingXApi(userProfile, pa);
            }
        });
    };
    PEBLEventHandlers.prototype.eventProgramDiscussed = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        var exts = {
            previousValue: payload.previousValue,
            newValue: payload.newValue,
            action: payload.action
        };
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.xapiGen.addId(xapi);
                self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#programDiscussed", "programDiscussed");
                self.xapiGen.addTimestamp(xapi);
                self.xapiGen.addActorAccount(xapi, userProfile);
                self.xapiGen.addObject(xapi, eventHandlers_PEBL_THREAD_GROUP_PREFIX + payload.programId, payload.programId, payload.description, self.xapiGen.addExtensions(exts));
                var pa = new ProgramAction(xapi);
                self.pebl.storage.saveOutgoingXApi(userProfile, pa);
            }
        });
    };
    // -------------------------------
    PEBLEventHandlers.prototype.eventLogin = function (event) {
        var userProfile = event.detail;
        var xapi = {};
        var self = this;
        this.pebl.storage.saveCurrentUser(userProfile, function () {
            if (userProfile) {
                self.xapiGen.addId(xapi);
                self.xapiGen.addTimestamp(xapi);
                self.xapiGen.addVerb(xapi, "http://adlnet.gov/expapi/verbs/logged-in", "logged-in");
                self.pebl.storage.getCurrentBook(function (book) {
                    if (book)
                        self.xapiGen.addObject(xapi, PEBL_PREFIX + book);
                    else
                        self.xapiGen.addObject(xapi, PEBL_PREFIX + "Harness");
                    self.xapiGen.addActorAccount(xapi, userProfile);
                    var session = new Session(xapi);
                    self.pebl.storage.saveEvent(userProfile, session);
                    self.pebl.storage.saveOutgoingXApi(userProfile, session);
                });
            }
        });
    };
    PEBLEventHandlers.prototype.eventLogout = function (event) {
        var xapi = {};
        var self = this;
        self.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.xapiGen.addId(xapi);
                self.xapiGen.addTimestamp(xapi);
                self.xapiGen.addVerb(xapi, "http://adlnet.gov/expapi/verbs/logged-out", "logged-out");
                self.pebl.storage.getCurrentBook(function (book) {
                    if (book)
                        self.xapiGen.addObject(xapi, PEBL_PREFIX + book);
                    else
                        self.xapiGen.addObject(xapi, PEBL_PREFIX + "Harness");
                    self.xapiGen.addActorAccount(xapi, userProfile);
                    var session = new Session(xapi);
                    self.pebl.storage.saveEvent(userProfile, session);
                    self.pebl.storage.saveOutgoingXApi(userProfile, session);
                    self.pebl.storage.removeCurrentUser();
                });
            }
        });
    };
    // -------------------------------
    PEBLEventHandlers.prototype.eventModuleRating = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        var exts = {
            idref: payload.idref,
            programId: payload.programId
        };
        this.pebl.storage.getCurrentBook(function (book) {
            self.pebl.storage.getCurrentActivity(function (activity) {
                self.pebl.user.getUser(function (userProfile) {
                    if (userProfile) {
                        self.xapiGen.addId(xapi);
                        self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#moduleRating", "moduleRating");
                        self.xapiGen.addTimestamp(xapi);
                        self.xapiGen.addActorAccount(xapi, userProfile);
                        self.xapiGen.addObject(xapi, PEBL_PREFIX + book, payload.rating, payload.description, self.xapiGen.addExtensions(exts));
                        if (activity)
                            self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + activity);
                        var mr = new ModuleRating(xapi);
                        self.pebl.storage.saveOutgoingXApi(userProfile, mr);
                    }
                });
            });
        });
    };
    PEBLEventHandlers.prototype.eventModuleFeedback = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        var exts = {
            willingToDiscuss: payload.willingToDiscuss,
            idref: payload.idref,
            programId: payload.programId
        };
        this.pebl.storage.getCurrentBook(function (book) {
            self.pebl.storage.getCurrentActivity(function (activity) {
                self.pebl.user.getUser(function (userProfile) {
                    if (userProfile) {
                        self.xapiGen.addId(xapi);
                        self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#moduleFeedback", "moduleFeedback");
                        self.xapiGen.addTimestamp(xapi);
                        self.xapiGen.addActorAccount(xapi, userProfile);
                        self.xapiGen.addObject(xapi, PEBL_PREFIX + book, payload.feedback, payload.description, self.xapiGen.addExtensions(exts));
                        if (activity)
                            self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + activity);
                        var mf = new ModuleFeedback(xapi);
                        self.pebl.storage.saveOutgoingXApi(userProfile, mf);
                    }
                });
            });
        });
    };
    PEBLEventHandlers.prototype.eventModuleExample = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        var exts = {
            idref: payload.idref,
            youtubeUrl: payload.youtubeUrl,
            imageUrl: payload.imageUrl,
            websiteUrl: payload.websiteUrl,
            quotedPerson: payload.quotedPerson,
            quotedTeam: payload.quotedTeam
        };
        this.pebl.storage.getCurrentBook(function (book) {
            self.pebl.storage.getCurrentActivity(function (activity) {
                self.pebl.user.getUser(function (userProfile) {
                    if (userProfile) {
                        self.xapiGen.addId(xapi);
                        self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#moduleExample", "moduleExample");
                        self.xapiGen.addTimestamp(xapi);
                        self.xapiGen.addActorAccount(xapi, userProfile);
                        self.xapiGen.addObject(xapi, PEBL_PREFIX + book, payload.example, payload.description, self.xapiGen.addExtensions(exts));
                        if (activity)
                            self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + activity);
                        var me = new ModuleExample(xapi);
                        self.pebl.storage.saveOutgoingXApi(userProfile, me);
                        self.pebl.emitEvent(self.pebl.events.incomingModuleEvents, [me]);
                    }
                });
            });
        });
    };
    PEBLEventHandlers.prototype.eventModuleExampleRating = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        var exts = {
            idref: payload.idref,
            programId: payload.programId,
            exampleId: payload.exampleId
        };
        this.pebl.storage.getCurrentBook(function (book) {
            self.pebl.storage.getCurrentActivity(function (activity) {
                self.pebl.user.getUser(function (userProfile) {
                    if (userProfile) {
                        self.xapiGen.addId(xapi);
                        self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#moduleExampleRating", "moduleExampleRating");
                        self.xapiGen.addTimestamp(xapi);
                        self.xapiGen.addActorAccount(xapi, userProfile);
                        self.xapiGen.addObject(xapi, PEBL_PREFIX + book, payload.rating, payload.description, self.xapiGen.addExtensions(exts));
                        if (activity)
                            self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + activity);
                        var mer = new ModuleExampleRating(xapi);
                        self.pebl.storage.saveOutgoingXApi(userProfile, mer);
                    }
                });
            });
        });
    };
    PEBLEventHandlers.prototype.eventModuleExampleFeedback = function (event) {
        var payload = event.detail;
        var xapi = {};
        var self = this;
        var exts = {
            willingToDiscuss: payload.willingToDiscuss,
            idref: payload.idref,
            programId: payload.programId,
            exampleId: payload.exampleId
        };
        this.pebl.storage.getCurrentBook(function (book) {
            self.pebl.storage.getCurrentActivity(function (activity) {
                self.pebl.user.getUser(function (userProfile) {
                    if (userProfile) {
                        self.xapiGen.addId(xapi);
                        self.xapiGen.addVerb(xapi, "http://www.peblproject.com/definitions.html#moduleExampleFeedback", "moduleExampleFeedback");
                        self.xapiGen.addTimestamp(xapi);
                        self.xapiGen.addActorAccount(xapi, userProfile);
                        self.xapiGen.addObject(xapi, PEBL_PREFIX + book, payload.feedback, payload.description, self.xapiGen.addExtensions(exts));
                        if (activity)
                            self.xapiGen.addParentActivity(xapi, PEBL_PREFIX + activity);
                        var mef = new ModuleExampleFeedback(xapi);
                        self.pebl.storage.saveOutgoingXApi(userProfile, mef);
                    }
                });
            });
        });
    };
    PEBLEventHandlers.prototype.moduleRemovedEvent = function (event) {
        var payload = event.detail;
        var voidXapi = {};
        var eventXapi = {};
        var self = this;
        var exts = {
            type: payload.type
        };
        this.pebl.user.getUser(function (userProfile) {
            if (userProfile) {
                self.pebl.storage.getCurrentActivity(function (activity) {
                    self.pebl.storage.getCurrentBook(function (book) {
                        self.xapiGen.addId(voidXapi);
                        self.xapiGen.addVerb(voidXapi, "http://adlnet.gov/expapi/verbs/voided", "voided");
                        self.xapiGen.addTimestamp(voidXapi);
                        self.xapiGen.addStatementRef(voidXapi, payload.eventId);
                        self.xapiGen.addActorAccount(voidXapi, userProfile);
                        if (activity)
                            self.xapiGen.addParentActivity(voidXapi, PEBL_PREFIX + activity);
                        var voided = new Voided(voidXapi);
                        self.pebl.storage.saveOutgoingXApi(userProfile, voided);
                        // Send event to everyone to remove that module event from their local storage
                        self.xapiGen.addId(eventXapi);
                        self.xapiGen.addVerb(eventXapi, "http://www.peblproject.com/definitions.html#moduleRemovedEvent", "moduleRemovedEvent");
                        self.xapiGen.addTimestamp(eventXapi);
                        self.xapiGen.addActorAccount(eventXapi, userProfile);
                        self.xapiGen.addObject(eventXapi, PEBL_PREFIX + book, payload.idref, payload.eventId, self.xapiGen.addExtensions(exts));
                        if (activity)
                            self.xapiGen.addParentActivity(eventXapi, PEBL_PREFIX + activity);
                        var mre = new ModuleRemovedEvent(eventXapi);
                        self.pebl.storage.saveOutgoingXApi(userProfile, mre);
                        self.pebl.emitEvent(self.pebl.events.incomingModuleEvents, [mre]);
                    });
                });
            }
        });
    };
    PEBLEventHandlers.prototype.incomingModuleEvents = function (event) {
        var self = this;
        var events = event.detail;
        for (var _i = 0, events_1 = events; _i < events_1.length; _i++) {
            var event_1 = events_1[_i];
            if (event_1.verb.display['en-US'] === 'moduleRemovedEvent') {
                self.pebl.storage.removeModuleEvent(event_1.idref, event_1.eventId);
            }
        }
    };
    return PEBLEventHandlers;
}());


// CONCATENATED MODULE: ./src/pebl.ts

// import { Activity } from "./activity";


// import { Messenger } from "./messenger";



var pebl_PEBL = /** @class */ (function () {
    // readonly launcher: LauncherAdapter;
    function PEBL(config, callback) {
        this.firedEvents = [];
        this.subscribedEventHandlers = {};
        this.subscribedSingularEventHandlers = {};
        this.subscribedThreadHandlers = {};
        this.loaded = false;
        this.extension = {};
        // this.extension.shared = {};
        if (config) {
            this.teacher = config.teacher;
            this.enableDirectMessages = config.enableDirectMessages;
            this.useIndexedDB = config.useIndexedDB;
        }
        else {
            this.teacher = false;
            this.enableDirectMessages = true;
            this.useIndexedDB = true;
        }
        this.utils = new utils_Utils(this);
        this.eventHandlers = new eventHandlers_PEBLEventHandlers(this);
        this.events = new EventSet();
        this.user = new User(this);
        this.network = new network_Network(this);
        var self = this;
        // if (this.useIndexedDB) {
        this.storage = new storage_IndexedDBStorageAdapter(function () {
            self.loaded = true;
            self.addSystemEventListeners();
            if (callback)
                callback(self);
            self.processQueuedEvents();
        });
        // } else {
        //     this.storage = new IndexedDBStorageAdapter(function() { });
        //     // if (localStorage != null) {
        //     //     this.storage;
        //     // } else if (sessionStorage != null) {
        //     //     this.storage;
        //     // } else {
        //     //     this.storage;
        //     // }
        //     this.loaded = true;
        //     this.addSystemEventListeners();
        //     if (callback)
        //         callback(this);
        //     self.processQueuedEvents();
        // }
    }
    PEBL.prototype.addListener = function (event, callback) {
        document.removeEventListener(event, callback);
        document.addEventListener(event, callback);
    };
    PEBL.prototype.addSystemEventListeners = function () {
        var events = Object.keys(this.events);
        for (var _i = 0, events_1 = events; _i < events_1.length; _i++) {
            var event_1 = events_1[_i];
            var listener = this.eventHandlers[event_1];
            if (listener) {
                var call = listener.bind(this.eventHandlers);
                this.addListener(event_1, call);
            }
        }
    };
    PEBL.prototype.processQueuedEvents = function () {
        for (var _i = 0, _a = this.firedEvents; _i < _a.length; _i++) {
            var e = _a[_i];
            document.dispatchEvent(e);
        }
        this.firedEvents = [];
    };
    PEBL.prototype.unsubscribeAllEvents = function () {
        for (var _i = 0, _a = Object.keys(this.subscribedEventHandlers); _i < _a.length; _i++) {
            var key = _a[_i];
            for (var _b = 0, _c = this.subscribedEventHandlers[key]; _b < _c.length; _b++) {
                var pack = _c[_b];
                document.removeEventListener(key, pack.modifiedFn);
            }
            delete this.subscribedEventHandlers[key];
        }
        for (var _d = 0, _e = Object.keys(this.subscribedSingularEventHandlers); _d < _e.length; _d++) {
            var key = _e[_d];
            for (var _f = 0, _g = Object.keys(this.subscribedSingularEventHandlers[key]); _f < _g.length; _f++) {
                var pack = _g[_f];
                document.removeEventListener(key, this.subscribedSingularEventHandlers[key][pack].modifiedFn);
            }
            delete this.subscribedSingularEventHandlers[key];
        }
    };
    PEBL.prototype.unsubscribeAllThreads = function () {
        for (var _i = 0, _a = Object.keys(this.subscribedEventHandlers); _i < _a.length; _i++) {
            var key = _a[_i];
            for (var _b = 0, _c = this.subscribedEventHandlers[key]; _b < _c.length; _b++) {
                var pack = _c[_b];
                document.removeEventListener(key, pack.modifiedFn);
            }
            delete this.subscribedEventHandlers[key];
        }
    };
    PEBL.prototype.unsubscribeEvent = function (eventName, once, callback) {
        var i = 0;
        if (this.subscribedEventHandlers[eventName]) {
            for (var _i = 0, _a = this.subscribedEventHandlers[eventName]; _i < _a.length; _i++) {
                var pack = _a[_i];
                if ((pack.once == once) && (pack.fn == callback)) {
                    document.removeEventListener(eventName, pack.modifiedFn);
                    this.subscribedEventHandlers[eventName].splice(i, 1);
                    return;
                }
                i++;
            }
        }
    };
    PEBL.prototype.unsubscribeSingularEvent = function (eventName, id) {
        if (this.subscribedSingularEventHandlers[eventName] && this.subscribedSingularEventHandlers[eventName][id]) {
            document.removeEventListener(eventName, this.subscribedSingularEventHandlers[eventName][id].modifiedFn);
            delete this.subscribedSingularEventHandlers[eventName][id];
        }
    };
    PEBL.prototype.unsubscribeThread = function (thread, once, callback) {
        var i = 0;
        if (this.subscribedThreadHandlers[thread]) {
            for (var _i = 0, _a = this.subscribedThreadHandlers[thread]; _i < _a.length; _i++) {
                var pack = _a[_i];
                if ((pack.once == once) && (pack.fn == callback)) {
                    document.removeEventListener(thread, pack.modifiedFn);
                    this.subscribedThreadHandlers[thread].splice(i, 1);
                    return;
                }
                i++;
            }
        }
    };
    PEBL.prototype.subscribeEvent = function (eventName, once, callback) {
        if (!this.subscribedEventHandlers[eventName])
            this.subscribedEventHandlers[eventName] = [];
        var self = this;
        //fix once for return of annotations
        if (once) {
            var modifiedHandler = function (e) {
                self.unsubscribeEvent(eventName, once, callback);
                callback(e.detail);
            };
            document.addEventListener(eventName, modifiedHandler, { once: once });
            this.subscribedEventHandlers[eventName].push({ once: once, fn: callback, modifiedFn: modifiedHandler });
        }
        else {
            var modifiedHandler = function (e) { callback(e.detail); };
            document.addEventListener(eventName, modifiedHandler);
            this.subscribedEventHandlers[eventName].push({ once: once, fn: callback, modifiedFn: modifiedHandler });
        }
        if (eventName == self.events.incomingAnnotations) {
            self.utils.getAnnotations(function (annotations) {
                callback(annotations);
            });
        }
        else if (eventName == self.events.incomingSharedAnnotations) {
            self.utils.getSharedAnnotations(function (annotations) {
                callback(annotations);
            });
        }
        else if (eventName == self.events.incomingPresence) {
            self.network.retrievePresence();
        }
        else if (eventName == self.events.incomingProgram) {
            self.utils.getPrograms(function (programs) {
                callback(programs);
            });
        }
        else if (eventName == self.events.incomingMembership) {
            self.utils.getGroupMemberships(function (groups) {
                callback(groups);
            });
        }
    };
    PEBL.prototype.subscribeSingularEvent = function (eventName, id, once, callback) {
        this.unsubscribeSingularEvent(eventName, id);
        if (!this.subscribedSingularEventHandlers[eventName])
            this.subscribedSingularEventHandlers[eventName] = {};
        var self = this;
        if (once) {
            var modifiedHandler = function (e) {
                self.unsubscribeSingularEvent(eventName, id);
                callback(e.detail);
            };
            document.addEventListener(eventName, modifiedHandler, { once: once });
            this.subscribedSingularEventHandlers[eventName][id] = { once: once, fn: callback, modifiedFn: modifiedHandler };
        }
        else {
            var modifiedHandler = function (e) { callback(e.detail); };
            document.addEventListener(eventName, modifiedHandler);
            this.subscribedSingularEventHandlers[eventName][id] = { once: once, fn: callback, modifiedFn: modifiedHandler };
        }
        if (eventName == self.events.incomingAnnotations) {
            self.utils.getAnnotations(function (annotations) {
                callback(annotations);
            });
        }
        else if (eventName == self.events.incomingSharedAnnotations) {
            self.utils.getSharedAnnotations(function (annotations) {
                callback(annotations);
            });
        }
        else if (eventName == self.events.incomingPresence) {
            self.network.retrievePresence();
        }
        else if (eventName == self.events.incomingProgram) {
            self.utils.getPrograms(function (programs) {
                callback(programs);
            });
        }
        else if (eventName == self.events.incomingMembership) {
            self.utils.getGroupMemberships(function (groups) {
                callback(groups);
            });
        }
    };
    //fix once for return of getMessages
    PEBL.prototype.subscribeThread = function (thread, once, callback) {
        var threadCallbacks = this.subscribedThreadHandlers[thread];
        if (!threadCallbacks) {
            threadCallbacks = [];
            this.subscribedThreadHandlers[thread] = threadCallbacks;
        }
        if (once) {
            var modifiedHandler = function (e) {
                self.unsubscribeEvent(thread, once, callback);
                callback(e.detail);
            };
            document.addEventListener(thread, modifiedHandler, { once: once });
            threadCallbacks.push({ once: once, fn: callback, modifiedFn: modifiedHandler });
        }
        else {
            var modifiedHandler = function (e) { callback(e.detail); };
            document.addEventListener(thread, modifiedHandler);
            threadCallbacks.push({ once: once, fn: callback, modifiedFn: modifiedHandler });
        }
        var self = this;
        this.user.getUser(function (userProfile) {
            if (userProfile)
                self.storage.getMessages(userProfile, thread, callback);
            else
                callback([]);
        });
    };
    PEBL.prototype.emitEvent = function (eventName, data) {
        var e = document.createEvent("CustomEvent");
        e.initCustomEvent(eventName, true, true, data);
        if (this.loaded)
            document.dispatchEvent(e);
        else
            this.firedEvents.push(e);
    };
    return PEBL;
}());


// CONCATENATED MODULE: ./src/api.ts
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "install", function() { return install; });

var core = new pebl_PEBL(window.PeBLConfig, window.PeBLLoaded);
var install = function (vue, options) {
    vue.prototype.$PeBL = core;
    vue.prototype.$PeBLEvents = core.events;
    vue.prototype.$PeBLUtils = core.utils;
    vue.prototype.$PeBLUser = core.user;
};
if (typeof window !== 'undefined') {
    window.PeBL = core;
    if (window.Vue) {
        window.Vue.use({ install: install });
    }
}


/***/ })
/******/ ]);