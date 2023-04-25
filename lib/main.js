"use strict";
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
exports.main = void 0;
var core = require("@actions/core");
var exec = require("@actions/exec");
var io = require("@actions/io");
var os = require("os");
var path = require("path");
var util = require('util');
var cpExec = util.promisify(require('child_process').exec);
var utils_1 = require("../src/utils");
var START_SCRIPT_EXECUTION_MARKER = "Starting script execution via docker image mcr.microsoft.com/azure-cli:";
var BASH_ARG = "bash --noprofile --norc -e ";
var AZ_CLI_VERSION_DEFAULT_VALUE = 'agentazcliversion';
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var scriptFileName, CONTAINER_NAME, inlineScript, azcliversion, _a, stdout, stderr, err_1, startCommand, environmentVariables, key, command, error_1, scriptFilePath;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    scriptFileName = '';
                    CONTAINER_NAME = "MICROSOFT_AZURE_CLI_".concat((0, utils_1.getCurrentTime)(), "_CONTAINER");
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 9, 10, 13]);
                    if (process.env.RUNNER_OS != 'Linux') {
                        core.setFailed('Please use Linux based OS as a runner.');
                        return [2 /*return*/];
                    }
                    inlineScript = core.getInput('inlineScript', { required: true });
                    azcliversion = core.getInput('azcliversion', { required: false }).trim().toLowerCase();
                    if (!(azcliversion == AZ_CLI_VERSION_DEFAULT_VALUE)) return [3 /*break*/, 5];
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, cpExec('az version')];
                case 3:
                    _a = _b.sent(), stdout = _a.stdout, stderr = _a.stderr;
                    if (!stderr) {
                        azcliversion = JSON.parse(stdout)["azure-cli"];
                    }
                    else {
                        throw stderr;
                    }
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _b.sent();
                    console.log('Failed to fetch az cli version from agent. Reverting back to latest.');
                    azcliversion = 'latest';
                    return [3 /*break*/, 5];
                case 5: return [4 /*yield*/, checkIfValidCLIVersion(azcliversion)];
                case 6:
                    if (!(_b.sent())) {
                        core.error('Please enter a valid azure cli version. \nSee available versions: https://github.com/Azure/azure-cli/releases.');
                        throw new Error('Please enter a valid azure cli version. \nSee available versions: https://github.com/Azure/azure-cli/releases.');
                    }
                    if (!inlineScript.trim()) {
                        core.error('Please enter a valid script.');
                        throw new Error('Please enter a valid script.');
                    }
                    inlineScript = " set -e >&2; echo '".concat(START_SCRIPT_EXECUTION_MARKER, "' >&2; ").concat(inlineScript);
                    return [4 /*yield*/, (0, utils_1.createScriptFile)(inlineScript)];
                case 7:
                    scriptFileName = _b.sent();
                    startCommand = " ".concat(BASH_ARG).concat(utils_1.TEMP_DIRECTORY, "/").concat(scriptFileName, " ");
                    environmentVariables = '';
                    for (key in process.env) {
                        // if (key.toUpperCase().startsWith("GITHUB_") && key.toUpperCase() !== 'GITHUB_WORKSPACE' && process.env[key]){
                        if (!(0, utils_1.checkIfEnvironmentVariableIsOmitted)(key) && process.env[key]) {
                            environmentVariables += " -e \"".concat(key, "=").concat(process.env[key], "\" ");
                        }
                    }
                    command = "run --workdir ".concat(process.env.GITHUB_WORKSPACE, " -v ").concat(process.env.GITHUB_WORKSPACE, ":").concat(process.env.GITHUB_WORKSPACE, " ");
                    command += " -v ".concat(process.env.HOME, "/.azure:/root/.azure -v ").concat(utils_1.TEMP_DIRECTORY, ":").concat(utils_1.TEMP_DIRECTORY, " ");
                    command += " ".concat(environmentVariables, " ");
                    command += "--name ".concat(CONTAINER_NAME, " ");
                    command += " mcr.microsoft.com/azure-cli:".concat(azcliversion, " ").concat(startCommand);
                    console.log("".concat(START_SCRIPT_EXECUTION_MARKER).concat(azcliversion));
                    return [4 /*yield*/, executeDockerCommand(command)];
                case 8:
                    _b.sent();
                    console.log("az script ran successfully.");
                    return [3 /*break*/, 13];
                case 9:
                    error_1 = _b.sent();
                    core.error(error_1);
                    throw error_1;
                case 10:
                    scriptFilePath = path.join(utils_1.TEMP_DIRECTORY, scriptFileName);
                    return [4 /*yield*/, (0, utils_1.deleteFile)(scriptFilePath)];
                case 11:
                    _b.sent();
                    console.log("cleaning up container...");
                    return [4 /*yield*/, executeDockerCommand(" container rm --force ".concat(CONTAINER_NAME, " "), true)];
                case 12:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 13: return [2 /*return*/];
            }
        });
    });
}
exports.main = main;
;
var checkIfValidCLIVersion = function (azcliversion) { return __awaiter(void 0, void 0, void 0, function () {
    var allVersions;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getAllAzCliVersions()];
            case 1:
                allVersions = _a.sent();
                if (!allVersions || allVersions.length == 0) {
                    return [2 /*return*/, true];
                }
                return [2 /*return*/, allVersions.some(function (eachVersion) { return eachVersion.toLowerCase() === azcliversion; })];
        }
    });
}); };
var getAllAzCliVersions = function () { return __awaiter(void 0, void 0, void 0, function () {
    var outStream, execOptions, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                outStream = '';
                execOptions = {
                    outStream: new utils_1.NullOutstreamStringWritable({ decodeStrings: false }),
                    listeners: {
                        stdout: function (data) { return outStream += data.toString() + os.EOL; }
                    }
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, exec.exec("curl --location -s https://mcr.microsoft.com/v2/azure-cli/tags/list", [], execOptions)];
            case 2:
                _a.sent();
                if (outStream && JSON.parse(outStream).tags) {
                    return [2 /*return*/, JSON.parse(outStream).tags];
                }
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                // if output is 404 page not found, please verify the url
                core.warning("Unable to fetch all az cli versions, please report it as an issue on https://github.com/Azure/CLI/issues. Output: ".concat(outStream, ", Error: ").concat(error_2));
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/, []];
        }
    });
}); };
var executeDockerCommand = function (dockerCommand, continueOnError) {
    if (continueOnError === void 0) { continueOnError = false; }
    return __awaiter(void 0, void 0, void 0, function () {
        var dockerTool, errorStream, shouldOutputErrorStream, execOptions, exitCode, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, io.which("docker", true)];
                case 1:
                    dockerTool = _a.sent();
                    errorStream = '';
                    shouldOutputErrorStream = false;
                    execOptions = {
                        outStream: new utils_1.NullOutstreamStringWritable({ decodeStrings: false }),
                        listeners: {
                            stdout: function (data) { return console.log(data.toString()); },
                            errline: function (data) {
                                if (!shouldOutputErrorStream) {
                                    errorStream += data + os.EOL;
                                }
                                else {
                                    console.log(data);
                                }
                                if (data.trim() === START_SCRIPT_EXECUTION_MARKER) {
                                    shouldOutputErrorStream = true;
                                    errorStream = ''; // Flush the container logs. After this, script error logs will be tracked.
                                }
                            }
                        }
                    };
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, 5, 6]);
                    return [4 /*yield*/, exec.exec("\"".concat(dockerTool, "\" ").concat(dockerCommand), [], execOptions)];
                case 3:
                    exitCode = _a.sent();
                    return [3 /*break*/, 6];
                case 4:
                    error_3 = _a.sent();
                    if (!continueOnError) {
                        throw error_3;
                    }
                    core.warning(error_3);
                    return [3 /*break*/, 6];
                case 5:
                    if (exitCode !== 0 && !continueOnError) {
                        throw new Error(errorStream || 'az cli script failed.');
                    }
                    core.warning(errorStream);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
};
