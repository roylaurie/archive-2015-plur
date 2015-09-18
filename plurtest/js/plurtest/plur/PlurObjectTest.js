/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject plur/test/Test
 */
 'use strict';

define([
    'plur/PlurObject',
    'plur/test/Test' ],
function(
    PlurObject,
    Test) {

/**
 * @constructor plurtest/plur/PlurObjectTest
 * @extends plur/test/Test
 * @test plur/PlurObject
 **
 */
var PlurObjectTest = function() {
};

PlurObjectTest.prototype = PlurObject.create('plurtest/plur/PlurObjectTest', PlurObjectTest, Test);

/**
 * @function plurtest/plur/PlurObject.prototype.testCreate
 * @test plur/PlurObject.create
 */
PlurObjectTest.prototype.testCreate = function(expected) {
    // test create
    var Alpha = function() {
        this.o = 'a';
    };

    Alpha.prototype = PlurObject.create('plurtest/plur/PlurObject/testCreate/Alpha', Alpha);

    Alpha.prototype.a = 'a';

    // check basic creation
    this.assertCreation({
        constructor: Alpha,
        namepath: 'plurtest/plur/PlurObject/testCreate/Alpha'
    });

    var alpha = new Alpha();
    this.assertOwns(alpha, 'o', 'a');

    var Bravo = function() {
        Alpha.call(this);
        this.o += '->b'
    };

    Bravo.prototype = PlurObject.create('plurtest/plur/PlurObject/testCreate/Bravo', Bravo, Alpha);

    Bravo.prototype.b = 'b';

    // check details of inheritance
    this.assertCreation({
        constructor: Bravo,
        parentConstructor: Alpha,
        namepath: 'plurtest/plur/PlurObject/testCreate/Bravo',
    });

    var bravo = new Bravo();
    // check basics of inheritance
    this.assertHas(bravo, 'a', 'a');
    this.assertHas(bravo, 'b', 'b');
    this.assertHas(bravo, 'o', 'a->b');
};

/**
 * @function plurtest/plur/PlurObjectTest.prototype.testImplement
 * @test plur/PlurObject.implement
 * @test plur/PlurObject.implementing
 */
PlurObjectTest.prototype.testImplement = function() {
    var IAlpha = function() {};
    IAlpha.prototype = PlurObject.create('plurtest/IAlpha', IAlpha);
    IAlpha.prototype.alpha = PlurObject.pureVirtualFunction;

    var Alpha = function() {};
    Alpha.prototype = PlurObject.create('plurtest/Alpha', Alpha);
    PlurObject.implement(Alpha, IAlpha);

    this.assertHas(Alpha.prototype, 'alpha', IAlpha.prototype.alpha, 'Did not implement interface method');

    // test implementing
    this.assert(PlurObject.implementing(Alpha, IAlpha));
};

/**
 * @function plurtest/plur/PlurObjectTest.prototype.testPureVirtualFunction
 * @test plur/PlurObject.pureVirtualFunction
 */
PlurObjectTest.prototype.testPureVirtualFunction = function() {
    // this should throw an exception
    try {
        PlurObject.pureVirtualFunction();
        // we should not get here ...
        this.fail('Pure virtual function did not throw exception.');
    } catch (e) {}
};

return PlurObjectTest;
});