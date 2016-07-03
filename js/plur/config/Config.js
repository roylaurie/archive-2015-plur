/**
 * @copyright 2016 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject plur/tree/MapNode
 */
define([
    'plur/PlurObject',
    'plur/tree/MapNode' ],
function(
    PlurObject,
    MapTreeNode ) {

/**
 * Maintains key/value configuration for a subject object, typically for a prototype.
 *
 * @constructor plur/config/config
 **
 */
var Config = function(configurable, parentConfigurable, config) {
	this._inheritanceTree = new MapTreeNode();
	this._configurableNamepath = null;
	this._parentConfigurableNamepath = null;
	this._config = {};

    if (configurable instanceof Config) {
    } else {
    }
};

Config.prototype = PlurObject.create('plur/config/Config', Config);

Config.prototype.getConfigurableNamepath = function() {
    return this._configurableNamepath;
};

Config.prototype.merge = function(config) {
    if (typeof config === 'undefined') {
        return this;
    } else if (config instanceof Config) {
        return config;
    } else {
        return this._merge(config);
    }
};

Config.prototype.mergeJson = function(json) {
    return this.merge(JSON.parse(json));
};

Config.prototype._merge = function(primitiveMap) {
    var config = this.copy();
    this._fillWithPrimitiveMap(config, this._configTree, primitiveMap)
    config._update();
    return config;
};

Config.prototype._fillWithPrimitiveMap = function(config, configTreeNode, primitiveMap) {
    for (var key in primitiveMap) {
        var node = null;

        if (!configTreeNode.has(key) {
            node = configTreeNode.addChild(new MapTreeNode(configTreeNode, key));
        } else {
            node = configTreeNode.get(node);
        }

        var value = primitiveMap[key];

        switch(typeof value) {
        case 'string':
        case 'boolean':
        case 'number':
            node.set(value);
            break;

        case 'object':
            this._copyPrimitiveMap(config, node, value);
            break;

        case 'array':
            if (!configTreeNode.has('[]')) {
                node = node.addChild(new ListTreeNode(node), '[]');
            } else {
                node = configTreeNode.get('[]');
            }

            for (var i = 0, n = value.length; ++i) {
                this._copyPrimitiveMap(config, node, value);
            }
            break;

        default:
            break;
        }
    }
};

Config.prototype.copy = function() {
};

Config.prototype.config = function() {
    return this._config;
};

Config.prototype.configure = function(map) {
    /* Example usage:
     *     config.configure({ foo.bar.foobar: 'numberwang' });
     *     var foobar = config.config().foo.bar.foobar;
     *     console.log(foobar); // prints "numberwang"
     */
};
	

	

return Config;
});