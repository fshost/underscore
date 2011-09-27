$(document).ready(function() {

  module("Collection functions (each, any, select, and so on...)");

  test("collections: each", function() {
    _.each([1, 2, 3], function(num, i) {
      equals(num, i + 1, 'each iterators provide value and iteration count');
    });

    var answers = [];
    _.each([1, 2, 3], function(num){ answers.push(num * this.multiplier);}, {multiplier : 5});
    equals(answers.join(', '), '5, 10, 15', 'context object property accessed');

    answers = [];
    _.forEach([1, 2, 3], function(num){ answers.push(num); });
    equals(answers.join(', '), '1, 2, 3', 'aliased as "forEach"');

    answers = [];
    var obj = {one : 1, two : 2, three : 3};
    obj.constructor.prototype.four = 4;
    _.each(obj, function(value, key){ answers.push(key); });
    equals(answers.join(", "), 'one, two, three', 'iterating over objects works, and ignores the object prototype.');
    delete obj.constructor.prototype.four;

    answer = null;
    _.each([1, 2, 3], function(num, index, arr){ if (_.include(arr, num)) answer = true; });
    ok(answer, 'can reference the original collection from inside the iterator');

    answers = 0;
    _.each(null, function(){ ++answers; });
    equals(answers, 0, 'handles a null properly');
  });

  test('collections: map', function() {
    var doubled = _.map([1, 2, 3], function(num){ return num * 2; });
    equals(doubled.join(', '), '2, 4, 6', 'doubled numbers');

    var tripled = _.map([1, 2, 3], function(num){ return num * this.multiplier; }, {multiplier : 3});
    equals(tripled.join(', '), '3, 6, 9', 'tripled numbers with context');

    var doubled = _([1, 2, 3]).map(function(num){ return num * 2; });
    equals(doubled.join(', '), '2, 4, 6', 'OO-style doubled numbers');

    var ids = _.map($('div.underscore-test').children(), function(n){ return n.id; });
    ok(_.include(ids, 'qunit-header'), 'can use collection methods on NodeLists');

    var ids = _.map(document.images, function(n){ return n.id; });
    ok(ids[0] == 'chart_image', 'can use collection methods on HTMLCollections');

    var ifnull = _.map(null, function(){});
    ok(_.isArray(ifnull) && ifnull.length === 0, 'handles a null properly');
  });

  test('collections: reduce', function() {
    var sum = _.reduce([1, 2, 3], function(sum, num){ return sum + num; }, 0);
    equals(sum, 6, 'can sum up an array');

    var context = {multiplier : 3};
    sum = _.reduce([1, 2, 3], function(sum, num){ return sum + num * this.multiplier; }, 0, context);
    equals(sum, 18, 'can reduce with a context object');

    sum = _.inject([1, 2, 3], function(sum, num){ return sum + num; }, 0);
    equals(sum, 6, 'aliased as "inject"');

    sum = _([1, 2, 3]).reduce(function(sum, num){ return sum + num; }, 0);
    equals(sum, 6, 'OO-style reduce');

    var sum = _.reduce([1, 2, 3], function(sum, num){ return sum + num; });
    equals(sum, 6, 'default initial value');

    var ifnull;
    try {
      _.reduce(null, function(){});
    } catch (ex) {
      ifnull = ex;
    }
    ok(ifnull instanceof TypeError, 'handles a null (without inital value) properly');

    ok(_.reduce(null, function(){}, 138) === 138, 'handles a null (with initial value) properly');

    // Sparse arrays:
    var sparseArray  = [];
    sparseArray[100] = 10;
    sparseArray[200] = 20;

    equals(_.reduce(sparseArray, function(a, b){ return a + b }), 30, 'initially-sparse arrays with no memo');
  });

  test('collections: reduceRight', function() {
    var list = _.reduceRight(["foo", "bar", "baz"], function(memo, str){ return memo + str; }, '');
    equals(list, 'bazbarfoo', 'can perform right folds');

    var list = _.foldr(["foo", "bar", "baz"], function(memo, str){ return memo + str; }, '');
    equals(list, 'bazbarfoo', 'aliased as "foldr"');

    var list = _.foldr(["foo", "bar", "baz"], function(memo, str){ return memo + str; });
    equals(list, 'bazbarfoo', 'default initial value');

    var ifnull;
    try {
      _.reduceRight(null, function(){});
    } catch (ex) {
      ifnull = ex;
    }
    ok(ifnull instanceof TypeError, 'handles a null (without inital value) properly');

    ok(_.reduceRight(null, function(){}, 138) === 138, 'handles a null (with initial value) properly');
  });

  test('collections: detect', function() {
    var result = _.detect([1, 2, 3], function(num){ return num * 2 == 4; });
    equals(result, 2, 'found the first "2" and broke the loop');
  });

  test('collections: select', function() {
    var evens = _.select([1, 2, 3, 4, 5, 6], function(num){ return num % 2 == 0; });
    equals(evens.join(', '), '2, 4, 6', 'selected each even number');

    evens = _.filter([1, 2, 3, 4, 5, 6], function(num){ return num % 2 == 0; });
    equals(evens.join(', '), '2, 4, 6', 'aliased as "filter"');
  });

  test('collections: reject', function() {
    var odds = _.reject([1, 2, 3, 4, 5, 6], function(num){ return num % 2 == 0; });
    equals(odds.join(', '), '1, 3, 5', 'rejected each even number');
  });

  test('collections: all', function() {
    ok(_.all([], _.identity), 'the empty set');
    ok(_.all([true, true, true], _.identity), 'all true values');
    ok(!_.all([true, false, true], _.identity), 'one false value');
    ok(_.all([0, 10, 28], function(num){ return num % 2 == 0; }), 'even numbers');
    ok(!_.all([0, 11, 28], function(num){ return num % 2 == 0; }), 'an odd number');
    ok(_.every([true, true, true], _.identity), 'aliased as "every"');
  });

  test('collections: any', function() {
    var nativeSome = Array.prototype.some;
    Array.prototype.some = null;
    ok(!_.any([]), 'the empty set');
    ok(!_.any([false, false, false]), 'all false values');
    ok(_.any([false, false, true]), 'one true value');
    ok(!_.any([1, 11, 29], function(num){ return num % 2 == 0; }), 'all odd numbers');
    ok(_.any([1, 10, 29], function(num){ return num % 2 == 0; }), 'an even number');
    ok(_.some([false, false, true]), 'aliased as "some"');
    Array.prototype.some = nativeSome;
  });

  test('collections: include', function() {
    ok(_.include([1,2,3], 2), 'two is in the array');
    ok(!_.include([1,3,9], 2), 'two is not in the array');
    ok(_.contains({moe:1, larry:3, curly:9}, 3) === true, '_.include on objects checks their values');
    ok(_([1,2,3]).include(2), 'OO-style include');
  });

  test('collections: invoke', function() {
    var list = [[5, 1, 7], [3, 2, 1]];
    var result = _.invoke(list, 'sort');
    equals(result[0].join(', '), '1, 5, 7', 'first array sorted');
    equals(result[1].join(', '), '1, 2, 3', 'second array sorted');
  });

  test('collections: invoke w/ function reference', function() {
    var list = [[5, 1, 7], [3, 2, 1]];
    var result = _.invoke(list, Array.prototype.sort);
    equals(result[0].join(', '), '1, 5, 7', 'first array sorted');
    equals(result[1].join(', '), '1, 2, 3', 'second array sorted');
  });

  test('collections: pluck', function() {
    var people = [{name : 'moe', age : 30}, {name : 'curly', age : 50}];
    equals(_.pluck(people, 'name').join(', '), 'moe, curly', 'pulls names out of objects');
    ok(_.isEqual(people, [{name : 'moe', age : 30}, {name : 'curly', age : 50}]), 'does not alter the original');

    equals(_.pluck(people, 'name', true).join(', '), 'moe, curly', 'pulls names out of objects');
    ok(_.isEqual(people, [{age : 30}, {age : 50}]), 'removes the plucked values from the original');
  });

  test('collections: getValue', function() {
    var person = {name : 'moe', age : 30}, result;
    
    result = _.getValue(person, 'name', 'curly');
    equals(result, 'moe', 'gets the value when it exists');
    result = _.getValue(person, 'first_name', 'curly');
    equals(result, 'curly', 'gets the default value when it does not exist');
  });

  test('collections: copyProperties', function() {
    var person1;
    var person2;

    person1 = {name : 'curly', age : 50}; person2 = {}
    _.copyProperties(person2, person1);
    ok(_.isEqual(person1, {name : 'curly', age : 50}), 'no change to person1');
    ok(_.isEqual(person2, person1), 'copies everything over');
    
    person1 = {name : 'curly', age : 50}; person2 = {}
    _.copyProperties(person2, person1, ['name']);
    ok(_.isEqual(person1, {name : 'curly', age : 50}), 'no change to person1');
    ok(_.isEqual(person2, {name : 'curly'}), 'copies only name over');

    person1 = {name : 'curly', age : 50}; person2 = {}
    _.copyProperties(person2, person1, undefined, true);
    ok(_.isEqual(person1, {}), 'person1 loses all of its properties');
    ok(_.isEqual(person2, {name : 'curly', age : 50}), 'moves everything over');

    person1 = {name : 'curly', age : 50}; person2 = {}
    _.copyProperties(person2, person1, ['name'], true);
    ok(_.isEqual(person1, {age : 50}), 'person1 loses name property');
    ok(_.isEqual(person2, {name : 'curly'}), 'person1 gets name property');

    person1 = {name : 'curly', age : 50}; person2 = {gender: 'male'}
    _.copyProperties(person2, person1, ['name'], true);
    ok(_.isEqual(person1, {age : 50}), 'person1 loses name property');
    ok(_.isEqual(person2, {name : 'curly', gender: 'male'}), 'person1 gets name property and retains gender');
  });

  test('collections: max', function() {
    equals(3, _.max([1, 2, 3]), 'can perform a regular Math.max');

    var neg = _.max([1, 2, 3], function(num){ return -num; });
    equals(neg, 1, 'can perform a computation-based max');
  });

  test('collections: min', function() {
    equals(1, _.min([1, 2, 3]), 'can perform a regular Math.min');

    var neg = _.min([1, 2, 3], function(num){ return -num; });
    equals(neg, 3, 'can perform a computation-based min');
  });

  test('collections: sortBy', function() {
    var people = [{name : 'curly', age : 50}, {name : 'moe', age : 30}];
    people = _.sortBy(people, function(person){ return person.age; });
    equals(_.pluck(people, 'name').join(', '), 'moe, curly', 'stooges sorted by age');
  });

  test('collections: groupBy', function() {
    var parity = _.groupBy([1, 2, 3, 4, 5, 6], function(num){ return num % 2; });
    ok('0' in parity && '1' in parity, 'created a group for each value');
    equals(parity[0].join(', '), '2, 4, 6', 'put each even number in the right group');
  });

  test('collections: sortedIndex', function() {
    var numbers = [10, 20, 30, 40, 50], num = 35;
    var index = _.sortedIndex(numbers, num);
    equals(index, 3, '35 should be inserted at index 3');
  });

  test('collections: toArray', function() {
    ok(!_.isArray(arguments), 'arguments object is not an array');
    ok(_.isArray(_.toArray(arguments)), 'arguments object converted into array');
    var a = [1,2,3];
    ok(_.toArray(a) !== a, 'array is cloned');
    equals(_.toArray(a).join(', '), '1, 2, 3', 'cloned array contains same elements');

    var numbers = _.toArray({one : 1, two : 2, three : 3});
    equals(numbers.join(', '), '1, 2, 3', 'object flattened into array');
  });

  test('collections: size', function() {
    equals(_.size({one : 1, two : 2, three : 3}), 3, 'can compute the size of an object');
  });

  test('collections: own and disown', function() {
    var original, copy;

    original = null;
    copy = _.own(original);
    ok(copy==null, 'no instance');
    _.disown(original); _.disown(copy);

    CloneDestroy = (function() {
      CloneDestroy.clone_count = 0;
      function CloneDestroy() { CloneDestroy.clone_count++; }
      CloneDestroy.prototype.clone = function() { CloneDestroy.clone_count++; };
      CloneDestroy.prototype.destroy = function() { CloneDestroy.clone_count--; };
      return CloneDestroy;
    })();

    CloneDestroy.clone_count = 0; original = new CloneDestroy();
    ok(CloneDestroy.clone_count==1, '1 instance');
    copy = _.own(original);
    ok(CloneDestroy.clone_count==2, '2 instances');
    _.disown(original); _.disown(copy);
    ok(CloneDestroy.clone_count==0, '0 instances');

    CloneDestroy.clone_count = 0; original = [new CloneDestroy(), new CloneDestroy(), new CloneDestroy()];
    ok(CloneDestroy.clone_count==3, '3 instances');
    copy = _.own(original);
    ok(copy===original, 'retained existing');
    ok(CloneDestroy.clone_count==6, '6 instances');
    _.disown(original); _.disown(copy);
    ok(CloneDestroy.clone_count==0, '0 instances');

    CloneDestroy.clone_count = 0; original = [new CloneDestroy(), new CloneDestroy(), new CloneDestroy()];
    ok(CloneDestroy.clone_count==3, '3 instances');
    copy = _.own(original, {clone:true});
    ok(copy!==original, 'retained existing');
    ok(CloneDestroy.clone_count==6, '6 instances');
    _.disown(original); _.disown(copy);
    ok(CloneDestroy.clone_count==0, '0 instances');

    CloneDestroy.clone_count = 0; original = {one:new CloneDestroy(), two:new CloneDestroy(), three:new CloneDestroy()};
    ok(CloneDestroy.clone_count==3, '3 instances');
    copy = _.own(original, {properties:true});
    ok(CloneDestroy.clone_count==6, '6 instances');
    _.disown(original, {properties:true}); _.disown(copy, {properties:true});
    ok(CloneDestroy.clone_count==0, '0 instances');

    CloneDestroy.clone_count = 0; original = [new CloneDestroy(), new CloneDestroy(), new CloneDestroy()];
    _.disown(original, {clear:true});
    ok(original.length==3, '3 instances');

    RetainRelease = (function() {
      RetainRelease.retain_count = 0;
      function RetainRelease() { RetainRelease.retain_count++; }
      RetainRelease.prototype.retain = function() { RetainRelease.retain_count++; };
      RetainRelease.prototype.release = function() { RetainRelease.retain_count--; };
      return RetainRelease;
    })();

    RetainRelease.clone_count = 0; original = new RetainRelease();
    ok(RetainRelease.retain_count==1, '1 instance');
    copy = _.own(original);
    ok(RetainRelease.retain_count==2, '2 instances');
    _.disown(original); _.disown(copy);
    ok(RetainRelease.retain_count==0, '0 instances');

    RetainRelease.retain_count = 0; original = [new RetainRelease(), new RetainRelease(), new RetainRelease()];
    ok(RetainRelease.retain_count==3, '3 instances');
    copy = _.own(original);
    ok(RetainRelease.retain_count==6, '6 instances');
    _.disown(original); _.disown(copy);
    ok(RetainRelease.retain_count==0, '0 instances');

    RetainRelease.retain_count = 0; original = {one:new RetainRelease(), two:new RetainRelease(), three:new RetainRelease()};
    ok(RetainRelease.retain_count==3, '3 instances');
    copy = _.own(original, {properties:true});
    ok(RetainRelease.retain_count==6, '6 instances');
    _.disown(original, {properties:true}); _.disown(copy, {properties:true});
    ok(RetainRelease.retain_count==0, '0 instances');

    RetainRelease.clone_count = 0; original = {one:new RetainRelease(), two:new RetainRelease(), three:new RetainRelease()};
    _.disown(original, {properties:true, clear:true});
    ok(_.size(original)==3, '3 instances');
  });

  test('collections: remove', function() {
    var a, o, result;
    var callback_count, callback = function() {callback_count++;}

    a = [1,2,3,2,5]; callback_count = 0;
    result = _.remove(a, 2, callback);
    ok(result==2, '2 returned');
    ok(_.isEqual(a,[1,3,5]), '[1,3,5] remaining');
    ok(callback_count==2, '2 removed count');

    a = [1,2,3,2,5]; callback_count = 0;
    result = _.remove(a, 0, callback);
    ok(!result, 'none returned');
    ok(_.isEqual(a,[1,2,3,2,5]), '[1,2,3,2,5] remaining');
    ok(callback_count==0, 'none removed count');

    a = [1,2,2,4,5]; callback_count = 0;
    result = _.remove(a, [2,5], {callback: callback});
    ok(_.isEqual(result,[2,5]), '[2,5] returned');
    ok(_.isEqual(a,[1,4]), '[1,3,4] remaining');
    ok(callback_count==3, '[2,5] removed count');

    a = [1,2,2,4,5]; callback_count = 0;
    result = _.remove(a, [0], {callback: callback});
    ok(_.isEqual(result,[]), 'none returned');
    ok(_.isEqual(a,[1,2,2,4,5]), '[1,2,2,4,5] remaining');
    ok(callback_count==0, 'none removed count');

    a = [1,2,2,4,5]; callback_count = 0;
    result = _.remove(a, [0,2], {callback: callback});
    ok(_.isEqual(result,[2]), '[2] returned');
    ok(_.isEqual(a,[1,4,5]), '[1,4,5] remaining');
    ok(callback_count==2, '[2] removed count');

    a = [1,2,3,4,5]; callback_count = 0;
    result = _.remove(a, function(item) { return item % 2 == 0; }, callback);
    ok(_.isEqual(result,[2,4]), '[2,4] returned');
    ok(_.isEqual(a,[1,3,5]), '[1,3,5] remaining');
    ok(callback_count==2, '[2,4] removed count');

    a = [1,2,3,4,5]; callback_count = 0;
    result = _.remove(a, function() { return false; }, callback);
    ok(_.isEqual(result,[]), 'none returned');
    ok(_.isEqual(a,[1,2,3,4,5]), '[1,3,5] remaining');
    ok(callback_count==0, 'none removed count');

    a = [1,2,3,4,5]; callback_count = 0;
    result = _.remove(a, undefined, {callback: callback});
    ok(_.isEqual(result,[1,2,3,4,5]), '[1,2,3,4,5] returned');
    ok(_.isEqual(a,[]), '[] remaining');
    ok(callback_count==5, '[1,2,3,4,5] removed count');

    a = [1,2,3,2,5]; callback_count = 0;
    result = _.remove(a, 2, {callback:callback,first_only:true});
    ok(result==2, '2 returned');
    ok(_.isEqual(a,[1,3,2,5]), '[1,3,2,5] remaining');
    ok(callback_count==1, '2 removed count');

    a = [1,2,3,2,5]; callback_count = 0;
    result = _.remove(a, 0, {callback:callback,first_only:true});
    ok(!result, 'none returned');
    ok(_.isEqual(a,[1,2,3,2,5]), '[1,2,3,2,5] remaining');
    ok(callback_count==0, 'none removed count');

    a = [1,2,3,4,5]; callback_count = 0;
    result = _.remove(a, [2,5], {callback: callback});
    ok(_.isEqual(result,[2,5]), '[2,5] returned');
    ok(_.isEqual(a,[1,3,4]), '[1,3,4] remaining');
    ok(callback_count==2, '[2,5] removed count');

    a = [1,2,5,4,5]; callback_count = 0;
    var a_preclear_callback = function() { ok(_.isEqual(a,[]), 'cleared before remove'); callback_count++; }
    result = _.remove(a, 2, {callback:a_preclear_callback, preclear:true});
    ok(result==2, '2 removed');
    ok(callback_count==1, '2 removed count');

    o = {one:1,two:2,three:3,four:4,five:5}; callback_count = 0;
    result = _.remove(o, 'two', callback);
    ok(_.isEqual(result,2), '2 returned');
    ok(_.isEqual(o,{one:1,three:3,four:4,five:5}), '{one:1,three:3,four:4,five:5} remaining');
    ok(callback_count==1, '{two:2} removed');

    o = {one:1,two:2,three:3,four:4,five:5}; callback_count = 0;
    result = _.remove(o, 'zero', callback);
    ok(_.isUndefined(result), 'none returned');
    ok(_.isEqual(o,{one:1,two:2,three:3,four:4,five:5}), '{one:1,two:2,three:3,four:4,five:5} remaining');
    ok(callback_count==0, 'none removed');

    o = {one:1,two:2,three:3,four:4,five:5}; callback_count = 0;
    result = _.remove(o, 3, {values:true, callback: callback});
    ok(_.isEqual(result,{three:3}), '{three:3} returned');
    ok(_.isEqual(o,{one:1,two:2,four:4,five:5}), '{one:1,two:2,four:4,five:5} remaining');
    ok(callback_count==1, '{three:3} removed');

    o = {one:1,two:2,three:3,two_too:2,five:5}; callback_count = 0;
    result = _.remove(o, 2, {callback:callback});
    ok(_.isEqual(result,{two:2,two_too:2}), '{two:2,five:5} returned');
    ok(_.isEqual(o,{one:1,three:3,five:5}), '{one:1,three:3,five:5} remaining');
    ok(callback_count==2, '{two:2,two_too:2} removed count');

    o = {one:1,two:2,three:3,four:4,five:5}; callback_count = 0;
    result = _.remove(o, 0, {values:true, callback: callback});
    ok(_.isEqual(result,{}), 'none returned');
    ok(_.isEqual(o,{one:1,two:2,three:3,four:4,five:5}), '{one:1,two:2,three:3,four:4,five:5} remaining');
    ok(callback_count==0, 'none removed');

    o = {one:1,two:2,three:3,two_too:2,five:5}; callback_count = 0;
    result = _.remove(o, ['two','five'], callback);
    ok(_.isEqual(result,[2,5]), '[2,5] returned');
    ok(_.isEqual(o,{one:1,three:3,two_too:2}), '{one:1,three:3,two_too:2} remaining');
    ok(callback_count==2, '{two:2,five:5} removed count');

    o = {one:1,two:2,three:3,two_too:2,five:5}; callback_count = 0;
    result = _.remove(o, ['zero'], callback);
    ok(_.isEqual(result,[]), 'none returned');
    ok(_.isEqual(o,{one:1,two:2,three:3,two_too:2,five:5}), '{one:1,two:2,three:3,two_too:2,five:5} remaining');
    ok(callback_count==0, 'none removed count');

    o = {one:1,two:2,three:3,four:4,five:5}; callback_count = 0;
    result = _.remove(o, [2,5], {callback:callback,values:true});
    ok(_.isEqual(result,{two:2,five:5}), '{two:2,five:5} returned');
    ok(_.isEqual(o,{one:1,three:3,four:4}), '{one:1,three:3,four:4} remaining');
    ok(callback_count==2, '{two:2,five:5} removed count');

    o = {one:1,two:2,three:3,two_too:2,five:5}; callback_count = 0;
    result = _.remove(o, [2], {callback:callback,values:true});
    ok(_.isEqual(result,{two:2,two_too:2}), '{two:2,two_too:2} returned');
    ok(_.isEqual(o,{one:1,three:3,five:5}), '{one:1,three:3,five:5} remaining');
    ok(callback_count==2, '{two:2,two_too:2} removed count');

    o = {one:1,two:2,three:3,two_too:2,five:5}; callback_count = 0;
    result = _.remove(o, [0], {callback:callback,values:true});
    ok(_.isEqual(result,{}), 'none returned');
    ok(_.isEqual(o,{one:1,two:2,three:3,two_too:2,five:5}), '{one:1,two:2,three:3,two_too:2,five:5} remaining');
    ok(callback_count==0, 'none removed count');

    o = {one:1,two:2,three:3,two_too:2,five:5}; callback_count = 0;
    result = _.remove(o, [0,2], {callback:callback,values:true});
    ok(_.isEqual(result,{two:2,two_too:2}), '{two:2,two_too:2} returned');
    ok(_.isEqual(o,{one:1,three:3,five:5}), '{one:1,three:3,five:5} remaining');
    ok(callback_count==2, 'none removed count');

    o = {one:1,two:2,three:3,four:4,five:5}; callback_count = 0;
    result = _.remove(o, function(value,key) { return value % 2 == 0; }, {callback: callback});
    ok(_.isEqual(result,{two:2,four:4}), '{two:2,four:4} returned');
    ok(_.isEqual(o,{one:1,three:3,five:5}), '{one:1,three:3,five:5} remaining');
    ok(callback_count==2, '{two:2,four:4} removed count');

    o = {one:1,two:2,three:3,four:4,five:5}; callback_count = 0;
    result = _.remove(o, function() { return false; }, {callback: callback});
    ok(_.isEqual(result,{}), 'none returned');
    ok(_.isEqual(o,{one:1,two:2,three:3,four:4,five:5}), '{one:1,two:2,three:3,four:4,five:5} remaining');
    ok(callback_count==0, 'none removed count');

    o = {one:1,two:2,three:3,four:4,five:5}; callback_count = 0;
    result = _.remove(o, undefined, callback);
    ok(_.isEqual(result,{one:1,two:2,three:3,four:4,five:5}), '{one:1,two:2,three:3,four:4,five:5} returned');
    ok(_.isEmpty(o), 'all removed');
    ok(callback_count==5, '{one:1,two:2,three:3,four:4,five:5} removed count');

    o = {one:1,two:2,three:3,four:4,five:5}; callback_count = 0;
    var o_preclear_callback = function() { ok(_.isEqual(o,{}), 'cleared before remove'); callback_count++; }
    result = _.remove(o, 'two', {callback:a_preclear_callback, preclear:true});
    ok(_.isEqual(result,2), '2 returned');
    ok(_.isEqual(o,{}), '{} remaining');
    ok(callback_count==1, '{two:2} removed');
  });

});
