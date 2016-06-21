/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @require plur/PlurObject plur/error/Error
 */
 'use strict';

define([
	'plur/PlurObject',
	'plur/error/Error',
	'plur/log/System',
	'plur/bootstrap/Bootstrap',
	'plur/es6/Promise' ],
function(
    PlurObject,
    PlurError,
    SystemLog,
    Bootstrap,
    PlurPromise ) {

var Tester = function(testTargets) {
    this._log = SystemLog.get();
    this._testTargets = testTargets;
    this._testTargetIndex = -1;
    this._testTarget = null;
    this._promise = null;
    this._promiseResolve = null;
    this._promiseReject = null;
};

Tester.prototype = PlurObject.create('plur/test/Tester', Tester);

Tester._TEST_CONSTRUCTOR = /^[a-zA-Z0-9_\-\/]+$/;

Tester.prototype._onComplete = function(namepath, method, passed) {
    if (passed) {
        this._log.info('Test passed: ' + namepath + '.' + method + '()');
    } else {
        this._log.error('Test failed: ' + namepath + '.' + method + '()');
    }
};
    
Tester.prototype.test = function() {
    var bootstrap = Bootstrap.get();

    // pass a noop function that writes the resolve and reject methods to state for use by test callbacks
    this._promise = new PlurPromise(function(resolve, reject) {
        this._promiseResolve = resolve;
        this._promiseReject = reject;
    });

    this._testNextTarget();

    return this._promise;
};

Tester.prototype._rejected = function(errors) {
    this._log.error('Test failed: ' + this._testTarget, errors);
};

Tester.prototype._testNextTarget = function() {
    var self = this;

    // if this was the last target prototype, resolve to pass the test entirely
    if (this._testTargetIndex === this._testTargets.length) {
        this._promiseResolve();
        return;
    }

    this._testTarget = this._testTargets[++this._testTargetIndex];

    if (!this._testTarget.match(Tester._TEST_CONSTRUCTOR)) {
        throw new PlurError('Invalid test target', { target: testTarget });
    }

    this._log.info('Testing ' + this._testTarget);

    var promise = new PlurPromise(function(resolve, reject) {
        var methodPromise = null;
FAILNOW;
        Bootstrap.get().require([this._testTarget], function(TestConstructor) {
            var test = new TestConstructor();

            for (methodName in test) {
                if (!methodName.match(/^test/) || !test[methodName] instanceof Function || methodName === 'test') {
                    continue;
                }

                if (methodPromise === null) {
                    methodPromise = new PlurPromise(Tester._callbackTestMethod(test, methodName, resolve));
                } else {
                    methodPromise.then(Tester._callbackTestMethod(test, methodName, resolve), reject);
                }
            }
        });
    });

    promise.then(function() { self._testNextTarget() }, function(error) { self._rejected(error); });
};

Tester._callbackTestMethod = function(test, methodName, targetResolve) {
    return function(methodResolve, methodReject) {
        this._log.info('Testing: ' + test.namepath + '.prototype.' + methodName + '()');

        var testMethod = test[methodName];

        testMethod();

        var promises = test.popPromises();
        if (promises.length === 0)  {
            if (targetResolve !== null) {
                targetResolve();
            } else {
                resolve();
            }
        } else {
            promises = promises.concat(new PlurPromise(Tester._timeoutPromiseExecutor));
            PlurPromise.all(promises, ( targetResolve !== null ? targetResolve : methodResolve ), reject);
        }
    }
};

Tester._timeoutPromiseExecutor = function(resolve, reject) {
    setTimeout(2000, function(resolve, reject) {
        reject('Test timed out after 2000 ms');
    });
};

return Tester;
});