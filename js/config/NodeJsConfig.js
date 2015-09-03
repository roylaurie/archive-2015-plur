/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @require fs plur/PlurObject plur/config/Config plur/file/System plur/obj/Parser
 */
define(['fs', 'plur/PlurObject', 'plur/config/Config', 'plur/file/System', 'plur/obj/Parser'],
	function(fs, PlurObject, PlurConfig, FileSystem, ObjParser) {

/**
 * Maintains file-based JSON configuration within the Node.js platform.
 * @var plur/config/NodeJsConfig
 **
 * @function plur/config/NodeJsConfig
 * @param subjectNamepath
 * @param baseConfig
 */
var NodeJsConfig = function(subjectNamepath, baseConfig) {
	PlurConfig.call(this, subjectNamepath, baseConfig);

	this._jsonNamepath = subjectNamepath + '.json';

	// parse defaults first
	var defaultsFilepath = FileSystem.getResourcePath(this._jsonNamepath);
	var json = fs.readFileSync(defaultsFilepath, 'utf8');
	if (json !== null) {
		var obj = JSON.parse(json);
		PlurConfig.parseObj(obj, this);
	}

	// parse config
	var configFilepath = FileSystem.getConfigPath(this._jsonNamepath);
	var json = fs.readFileSync(configFilepath, 'utf8');
	if (json !== null) {
		var obj = JSON.parse(json);
		PlurConfig.parseObj(obj, this);
	}
};

NodeJsConfig.prototype = PlurObject.create('plur/config/NodeJsConfig', NodeJsConfig);

/**
 * Writes the current configuration to file in JSON.
 * @function plur/config/NodeJsConfig.prototype.write
 * @param filepath
 * @param callback
 */
NodeJsConfig.prototype.write = function(filepath, callback) {
	if (typeof filepath === 'undefined') {
		filepath = FileSystem.getResourcePath(this._jsonNamepath);
	}
	
	var json = JSON.stringify(this.getObj());
	fs.fileWrite(filepath, json, callback);
};

return NodeJsConfig;
});