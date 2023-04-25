"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.checkIfEnvironmentVariableIsOmitted = exports.NullOutstreamStringWritable = exports.getCurrentTime = exports.giveExecutablePermissionsToFile = exports.deleteFile = exports.createScriptFile = exports.TEMP_DIRECTORY = void 0;
var stream = require("stream");
var exec = require("@actions/exec");
var core = require("@actions/core");
var path = require("path");
var os = require("os");
var fs = require("fs");
exports.TEMP_DIRECTORY = process.env.RUNNER_TEMP || os.tmpdir();
var createScriptFile = function (inlineScript) { return __awaiter(void 0, void 0, void 0, function () {
    var fileName, filePath;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                fileName = "AZ_CLI_GITHUB_ACTION_".concat((0, exports.getCurrentTime)().toString(), ".sh");
                filePath = path.join(exports.TEMP_DIRECTORY, fileName);
                fs.writeFileSync(filePath, "".concat(inlineScript));
                return [4 /*yield*/, (0, exports.giveExecutablePermissionsToFile)(filePath)];
            case 1:
                _a.sent();
                return [2 /*return*/, fileName];
        }
    });
}); };
exports.createScriptFile = createScriptFile;
var deleteFile = function (filePath) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
            }
            catch (err) {
                core.warning(err.toString());
            }
        }
        return [2 /*return*/];
    });
}); };
exports.deleteFile = deleteFile;
var giveExecutablePermissionsToFile = function (filePath) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, exec.exec("chmod +x ".concat(filePath), [], { silent: true })];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); };
exports.giveExecutablePermissionsToFile = giveExecutablePermissionsToFile;
var getCurrentTime = function () {
    return new Date().getTime();
};
exports.getCurrentTime = getCurrentTime;
var NullOutstreamStringWritable = /** @class */ (function (_super) {
    __extends(NullOutstreamStringWritable, _super);
    function NullOutstreamStringWritable(options) {
        return _super.call(this, options) || this;
    }
    NullOutstreamStringWritable.prototype._write = function (data, encoding, callback) {
        if (callback) {
            callback();
        }
    };
    return NullOutstreamStringWritable;
}(stream.Writable));
exports.NullOutstreamStringWritable = NullOutstreamStringWritable;
;
var checkIfEnvironmentVariableIsOmitted = function (key) {
    var omitEnvironmentVariables = [
        'LANG',
        'HOSTNAME',
        'PWD',
        'HOME',
        'PYTHON_VERSION',
        'PYTHON_PIP_VERSION',
        'SHLVL',
        'PATH',
        'GPG_KEY',
        'CONDA',
        'AGENT_TOOLSDIRECTORY',
        'RUNNER_PERFLOG',
        'RUNNER_WORKSPACE',
        'RUNNER_TEMP',
        'RUNNER_TRACKING_ID',
        'RUNNER_TOOL_CACHE',
        'DOTNET_SKIP_FIRST_TIME_EXPERIENCE',
        'JOURNAL_STREAM',
        'DEPLOYMENT_BASEPATH',
        'VCPKG_INSTALLATION_ROOT',
        'PERFLOG_LOCATION_SETTING'
    ];
    var omitEnvironmentVariablesWithPrefix = [
        'JAVA_',
        'LEIN_',
        'M2_',
        'BOOST_',
        'GOROOT',
        'ANDROID_',
        'GRADLE_',
        'ANT_',
        'CHROME',
        'SELENIUM_',
        'INPUT_'
    ];
    for (var i = 0; i < omitEnvironmentVariables.length; i++) {
        if (omitEnvironmentVariables[i] === key.toUpperCase()) {
            return true;
        }
    }
    return omitEnvironmentVariablesWithPrefix.some(function (prefix) { return key.toUpperCase().startsWith(prefix); });
};
exports.checkIfEnvironmentVariableIsOmitted = checkIfEnvironmentVariableIsOmitted;
