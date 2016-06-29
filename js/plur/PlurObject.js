/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires requirejs
 */
 'use strict';

define([
    'require'],
function(
    requirejs ) {

/**
 * Utility for prototype object construction.
 *
 * @constructor plur/PlurObject
 * @private
 */
var PlurObject = function() {
    throw Error('Cannot instantiate private constructor of PlurObject');
};

// Standardize PlurObject
PlurObject.namepath = 'plur/PlurObject';
PlurObject.prototype.namepath = PlurObject.namepath;


/**
 * Determines whether the given function is a valid PlurObject constructor.
 *
 * @function PlurObject.isConstructor
 * @param Function constructor
 * @returns boolean TRUE if constructor FALSE if not
 */
PlurObject.isConstructor = function(constructor) {
    return ( constructor instanceof Function && typeof constructor.namepath === 'string'
        && typeof constructor.prototype === 'object' );
};


PlurObject.implementing = function(object, interfaceConstructor) {
    var constructor = Object.getPrototypeOf(object).constructor;
    return ( typeof constructor.implemented !== 'undefined'
            && typeof constructor.implemented[interfaceConstructor.namepath] !== 'undefined' );
};

/**
 * Meant to be assigned to abstract prototype functions that require overriding in child classes.
 *
 * @function plur/PlurObject.prototype.abstractMethod
 * @throws Error
 */
PlurObject.abstractMethod = function() {
    throw new Error('plur: Cannot call abstract method.');
};

/**
 * Creates a prototype object; extending it from a parent constructor if provided via Object.create().
 * Injects a namepath variable to the constructor and prototype that provided the namespace + partial file name.
 * Injects an implemented assoc array into the constructor that maintains namepaths of all interfaces implemented.
 * Injects an implementing() method into the prototype to check for interface inheritance.
 *
 * @function plur/PlurObject.prototype.create
 * @param string namepath
 * @param Function constructor
 * @param Function parentConstructor
 * @returns {} constructor.prototype
 */
PlurObject.create = function(namepath, constructor, parentConstructor) {
    var prototype = constructor.prototype;

    if (typeof parentConstructor !== 'undefined') {
        prototype = Object.create(parentConstructor.prototype);
        prototype.constructor = constructor;
    }

    // inject namepath on both constructor and prototype
    constructor.namepath = namepath;
    prototype.namepath = constructor.namepath;

    // inject an array that will store namepaths of interfaces as keys into the constructor
    constructor.implemented = {};

    return prototype;
};

/**
 * Define a subject constructor/prototype as implementing a given interface constructor.
 * Copies the interface prototype's abstract methods in to the subject prototype.
 * Adds the interface pathname to the subject constructor.implemented variable.
 *
 * @function plur/PlurObject.prototype.implement
 * @param function() constructor
 * @param function() interfaceConstructor
 * @returns plur/PlurObject For use in cascaded calls to PlurObject method
 */
PlurObject.implement = function(constructor, interfaceConstructor) {
    if (typeof constructor.implemented[interfaceConstructor.namepath] !== 'undefined')
        return;

    var interfacePrototype = interfaceConstructor.prototype;
    var prototype = constructor.prototype;

    for (var propertyName in interfacePrototype) {
        // make sure that the interface property is assigned to PlurObject.abstractMethod
        if (interfacePrototype[propertyName] === PlurObject.abstractMethod) {
            // set it if it's undefined. ignore if it exists and is already abstract. throw error otherwise.
            switch(typeof prototype[propertyName]) {
            case 'undefined':
                prototype[propertyName] = interfacePrototype[propertyName];
                break;
            default:
                if (prototype[propertyName] !== PlurObject.abstractMethod) {
                    throw new Error('Inheritance collision in ' + prototype.namepath + ' for ' +
                        interfaceConstructor.namepath + '.prototype.' + propertyName);
                }
            }
        }
    }

    constructor.implemented[interfaceConstructor.namepath] = null;
    return PlurObject;
};

PlurObject.values = function(object) {
    var values = [];
    for (var key in object) {
        values.push(object[key]);
    }

    return values;
};

PlurObject.hash = function(/*...*/) {
    var hash = 0;

    // varargs
    for (var i = 0, n = arguments.length; i < n; ++i) {
        var argument = arguments[i];
        // switch on type
        // use 0x45d9f3b as a marker for each data type, hash type then value.
        switch(typeof argument) {
        case 'string':
            hash = __hash(hash, 0x45d9f3b);
            for (var j = 0, jn = argument.length; j < jn; ++j) {
                result = __hash(hash, argument.charCodeAt(j));
            }
            break;
        case 'number':
            hash = __hash(hash, 0x45d9f3b * 2);
            hash = __hash(hash, argument);
            break;
        case 'boolean':
            hash = __hash(hash, 0x45d9f3b * 3);
            hash = __hash(hash, argument ? 1 : 2);
            break;
        case 'undefined':
            hash = __hash(hash, 0x45d9f3b * 4);
            break;
        case 'null':
            hash = __hash(hash, 0x45d9f3b * 5);
            break;
        case 'function':
            hash = __hash(hash, 00x45d9f3b * 6);
            break;
        case 'array':
            hash = __hash(hash, 00x45d9f3b, * 7)
            for (var j = 0, jn = argument.length; i < n; ++i) {
                hash = __hash(hash, PlurObject.hash(argument[j]));
            }
            break;
        case 'object':
            hash = __hash(hash, 0x45d9f3b * 8)
            for (var key in argument) {
                if (key === 'prototype') {
                    continue;
                }

                hash = __hash(hash, PlurObject.hash(argument[key]));
            }
            break;
        default:
            break;
        }
    }

    return result;
};

return PlurObject;
});
