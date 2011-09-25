//     Underscore.js 1.1.7
//     (c) 2011 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore is freely distributable under the MIT license.
//     Portions of Underscore are inspired or borrowed from Prototype,
//     Oliver Steele's Functional, and John Resig's Micro-Templating.
//     For all details and documentation:
//     http://documentcloud.github.com/underscore

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var slice            = ArrayProto.slice,
      unshift          = ArrayProto.unshift,
      toString         = ObjProto.toString,
      hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) { return new wrapper(obj); };

  // Export the Underscore object for **CommonJS**, with backwards-compatibility
  // for the old `require()` API. If we're not in CommonJS, add `_` to the
  // global object.
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = _;
    _._ = _;
  } else {
    // Exported as a string, for Closure Compiler "advanced" mode.
    root['_'] = _;
  }

  // Current version.
  _.VERSION = '1.1.7';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) return;
        }
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results[results.length] = iterator.call(context, value, index, list);
    });
    return results;
  };

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = memo !== void 0;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError("Reduce of empty array with no initial value");
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return memo !== void 0 ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var reversed = (_.isArray(obj) ? obj.slice() : _.toArray(obj)).reverse();
    return _.reduce(reversed, iterator, memo, context);
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    each(obj, function(value, index, list) {
      if (!iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator = iterator || _.identity;
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result |= iterator.call(context, value, index, list)) return breaker;
    });
    return !!result;
  };

  // Determine if a given value is included in the array or object using `===`.
  // Aliased as `contains`.
  _.include = _.contains = function(obj, target) {
    var found = false;
    if (obj == null) return found;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    any(obj, function(value) {
      if (found = value === target) return true;
    });
    return found;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    return _.map(obj, function(value) {
      return (method.call ? method || value : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property. 
  // Optionally removes all copied values from the source if you provide a remove parameter.
  _.pluck = function(obj, key, remove) {
    return remove ? _.map(obj, function(value) { var val = value[key]; delete value[key]; return val; }) :
      _.map(obj, function(value){ return value[key]; });
  };

  // Copy selected properties from the source to the destination.
  // Optionally removes copied values from the source if you provide a remove parameter.
  _.copyProperties = function(destination, source, keys, remove) {
    var key, source_keys = keys || _.keys(source);
    var copied_something = false;
    for (var i = 0, l = source_keys.length; i < l; i++) {
      key = source_keys[i];
      if (hasOwnProperty.call(source, key)) { 
        destination[key] = source[key]; copied_something = true; 
        if (remove) delete source[key];
      }
    }
    return copied_something;
  };

  // Get a value and if it does not exist, return the missing_value.
  // Optionally remove the value if you provide a remove parameter.
  _.getValue = function(obj, key, missing_value, remove) {
    if (hasOwnProperty.call(obj, key)) {
      if (!remove) return obj[key];
      var value = obj[key]; delete obj[key]; return value;
    }
    else return missing_value;
  };

  // Return the maximum element or (element-based computation).
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj)) return Math.max.apply(Math, obj);
    var result = {computed : -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed >= result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj)) return Math.min.apply(Math, obj);
    var result = {computed : Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, iterator, context) {
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value : value,
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria, b = right.criteria;
      return _.compare(a,b);
    }), 'value');
  };

  // Groups the object's values by a criterion produced by an iterator
  _.groupBy = function(obj, iterator) {
    var result = {};
    each(obj, function(value, index) {
      var key = iterator(value, index);
      (result[key] || (result[key] = [])).push(value);
    });
    return result;
  };

  // Maps simple comparison operators (< or ===) or custom comparison functions 
  // (such as localeCompare) to standardized comparison results.
  _.COMPARE_EQUAL = 0;
  _.COMPARE_ASCENDING = -1;
  _.COMPARE_DESCENDING = 1;
  _.compare = function(value_a, value_b, function_name) {
    // Non-object compare just comparing raw values 
    if (typeof(value_a) !== 'object') return (value_a === value_b) ? _.COMPARE_EQUAL : (value_a < value_b) ? _.COMPARE_ASCENDING : _.COMPARE_DESCENDING;
    
    // Use a compare function, if one exists
    if (!function_name) function_name = 'compare';
    if (value_a[function_name] && _.isFunction(value_a[function_name])) {
      var result = value_a[function_name](value_b);
      return (result === 0) ? _.COMPARE_EQUAL : (result < 0) ? _.COMPARE_ASCENDING : _.COMPARE_DESCENDING;
    }
    else if (value_b[function_name] && _.isFunction(value_b[function_name])) {
      var result = value_b[function_name](value_a);
      return (result === 0) ? _.COMPARE_EQUAL : (result < 0) ? _.COMPARE_DESCENDING : _.COMPARE_ASCENDING;
    }
    return (value_a === value_b) ? _.COMPARE_EQUAL : (value_a < value_b) ? _.COMPARE_ASCENDING : _.COMPARE_DESCENDING;
  };

  // Use a comparator function to figure out at what index an object should
  // be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator) {
    iterator || (iterator = _.identity);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >> 1;
      _.compare(iterator(array[mid]), iterator(obj))==_.COMPARE_ASCENDING ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely convert anything iterable into a real, live array.
  _.toArray = function(iterable) {
    if (!iterable)                return [];
    if (iterable.toArray)         return iterable.toArray();
    if (_.isArray(iterable))      return slice.call(iterable);
    if (_.isArguments(iterable))  return slice.call(iterable);
    return _.values(iterable);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    return _.toArray(obj).length;
  };

  // Deduces the type of ownership of an item and if available, it retains it (reference counted) or clones it.
  // Options: 
  //    properties - used to disambigate between owning an object and owning each property.
  //    clone - used to disambigate between owning a collection's items and cloning a collection.
  _.own = function(obj, options) {
    if (!obj) return obj;
    options || (options = {});
    if (_.isArray(obj)) {
      if (options.clone) { var clone =  []; each(obj, function(value) { clone.push(_.own(value)); }); return clone; }
      else { each(obj, function(value) { _.own(value); }); return obj; }
    }
    else if (options.properties) {
      if (options.clone) { var clone = {}; each(obj, function(value, key) { clone[key] = _.own(value); }); return clone; }
      else { each(obj, function(value, key) { _.own(value); }); return obj; }
    }
    else if (obj.retain) obj.retain();
    else if (obj.clone) obj.clone();
    return obj;
  };

  // Deduces the type of ownership of an item and if available, it releases it (reference counted) or destroys it.  
  // Options: 
  //    properties - used to disambigate between owning an object and owning each property.
  //    clear - used to disambigate between clearing disowned items and removing them (by default, they are removed).
  _.disown = function(obj, options) {
    if (!obj) return obj;
    options || (options = {});
    if (_.isArray(obj)) {
      if (options.clear) { each(obj, function(value, index) { _.disown(value); obj[index]=null; }); return obj; }
      else { each(obj, function(value) { _.disown(value); }); obj=[]; return obj; }
    }
    else if (options.properties) {
      if (options.clear) { each(obj, function(value, key) { _.disown(value); obj[key]=null; }); return obj; }
      else { each(obj, function(value) { _.disown(value); }); obj={}; return obj; }
    }
    else if (obj.release) obj.release();
    else if (obj.destroy) obj.destroy();
    return obj;
  };

  // Removes an value from a collection (array or object). 
  // If the matcher is a function, it removes and returns all values that match. 
  // If the matcher is an array, it removes and returns all values that match. 
  // If the matcher is undefined, it removes and returns all values.
  // If the collection is an object and the matcher is a key, it removes and return the value for that key (unless the is_value option is provided).
  // Otherwise, it removes and return the value if it finds it.
  // Options: 
  //    callback - if you provide a callback, it calls it with the removed value after the value is removed from the collection. Note: if the options are a function, it is set as the callback.
  //    is_value - used to disambigate between a key or value when removing from a collection that is an object.
  //    first_only - if you provide a first_only flag, it will stop looking for an value when it finds one that matches.  
  //    preclear - if you provide a preclear flag, it will clone the passed object, remove all the values, and then remove from the cloned object. 
  _.remove = function(obj, matcher, options) {
    if (_.isEmpty(obj)) return (!matcher || _.isFunction(matcher)) ? [] : undefined;
    options || (options = {});
    if (_.isFunction(options)) options = {callback:options};

    // Clone and clear the passed collection before removing. Useful if a callback uses the passed collection.
    if (options.preclear) { 
      var original_object = obj; 
      obj = _.clone(obj); 
      if (_.isArray(original_object)) { original_object.length=0; }
      else { for(var key in original_object) delete original_object[key]; }
    }

    var removed = [];
    // Array collection
    if (_.isArray(obj)) {
      var single_value=false;
      // Array: remove and return all values (returns: array of values)
      if (_.isUndefined(matcher)) { removed = _.keys(obj); }

      // Array: remove and return all values passing matcher function test (returns: array of values) or if first_only option, only the first one (returns: value or undefined)
      else if (_.isFunction(matcher)) {
        if (options.first_only) { single_value=true; _.find(obj, function(value, index) { if (matcher(value)) { removed.push(index); return true; }; return false; }) }
        else { each(obj, function(value, index) { if (matcher(value)) { removed.push(index); } } ); } 
      } 
      // Array: remove and return all values in the matcher array (returns: array of values)
      else if (_.isArray(matcher)) {
        if (options.first_only) {
          single_value=true; 
          var matcher_value, removed_index;
          for (var i = matcher.length - 1; i >= 0; i--) {
            matcher_value = matcher[i]; removed_index=-1;
            _.find(obj, function(value, index) { if (matcher_value===value) { removed.push(index); return true; }; return false; })
          }
        }
        else { 
          var matcher_value;
          for (var i = matcher.length - 1; i >= 0; i--) {
            matcher_value = matcher[i];
            each(obj, function(value, index) { if (matcher_value===value) { removed.push(index); } } ); 
          }
        }
      }
      // Array: remove all matching values (returns: array of values) or if first_only option, only the first one (returns: value or undefined).
      else {
        if (options.first_only) { single_value=true; var index = _.indexOf(obj, matcher); if (index>=0) removed.push(index); }
        // Array: remove all matching values (array return type).
        else { single_value=true; each(obj, function(value, index) { if (matcher===value) { removed.push(index); } } ); } 
      } 

      // Process the removed values if they exist
      var value;
      if (single_value) {
        if (removed.length) {
          var value_count = 0;
          value = obj[removed[0]]; 
          removed = removed.sort(function(left, right) { return _.compare(left, right); });
          while (removed.length) {
            value_count++; obj.splice(removed.pop(), 1);
          }
          if (options.callback) { while(value_count>0) { options.callback(value); value_count--; } }
          return value;
        }
        else return undefined;
      }
      else {
        if (removed.length) {
          var values = [], index;
          removed = removed.sort(function(left, right) { return _.compare(left, right); });
          while (removed.length) {
            index = removed.pop(); values.unshift(obj[index]); obj.splice(index, 1);
          }
          if (options.callback) { each(values, function(value) { options.callback(value); } ) }
          return _.uniq(values);
        }
        else return [];
      }
    }

    // Object collection 
    else {
      var key, ordered_keys, single_value=false;
      // Object: remove all values (returns: object with keys and values)
      if (_.isUndefined(matcher)) { removed = _.keys(obj); }

      // Object: remove and return all values passing matcher function test (returns: object with keys and values)
      else if (_.isFunction(matcher)) { for (key in obj) { if (matcher(obj[key], key)) removed.push(key); } } 
    
      // Object: remove and return all values by key or by value
      else if (_.isArray(matcher)) {
        // the matcher array contains values (returns: object with keys and values)
        if (options.is_value) {
          var matcher_value;
          for (var i = 0, l = matcher.length; i < l; i++) {
            matcher_value = matcher[i];
            if (options.first_only) { for (key in obj) { if (matcher_value===obj[key]) { removed.push(key); break; } } }
            else { for (key in obj) { if (matcher_value===obj[key]) { removed.push(key); } } }
          }
        }
        // the matcher array contains keys (returns: array of values)
        else {
          ordered_keys = matcher;
          var matcher_key;
          for (var i = 0, l = matcher.length; i < l; i++) {
            matcher_key = matcher[i];
            if (obj.hasOwnProperty(matcher_key)) { removed.push(matcher_key); }
          }
        }
      } 
      // Object: remove value matching a key (value or undefined return type)
      else if (_.isString(matcher) && !options.is_value) {
        single_value = true; ordered_keys = [];
        if (obj.hasOwnProperty(matcher)) { ordered_keys.push(matcher); removed.push(matcher) };
      } 
      // Object: remove matching value (array return type)
      else {
        for (key in obj) { if (matcher===obj[key]) { removed.push(key); } }
      } 
    
      // Process the removed values if they exist
      if (ordered_keys) {
        if (ordered_keys.length) {
          var result = [];
          while (removed.length) {
            key = removed.shift(); result.push(obj[key]); delete obj[key];
          }
          if (options.callback) { each(result, function(value, index) { options.callback(value, ordered_keys[index]); } ) }
          return single_value ? result[0] : result;
        }
        else return single_value ? undefined : [];
      }
      else {
        if (removed.length) {
          var result = {};
          while (removed.length) {
            key = removed.shift(); result[key] = obj[key]; delete obj[key];
          }
          if (options.callback) { each(result, function(value, key) { options.callback(value, key); } ) }
          return result;
        }
        else return {};
      }
    }
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head`. The **guard** check allows it to work
  // with `_.map`.
  _.first = _.head = function(array, n, guard) {
    return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
  };

  // Returns everything but the first entry of the array. Aliased as `tail`.
  // Especially useful on the arguments object. Passing an **index** will return
  // the rest of the values in the array from that index onward. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = function(array, index, guard) {
    return slice.call(array, (index == null) || guard ? 1 : index);
  };

  // Get the last element of an array.
  _.last = function(array) {
    return array[array.length - 1];
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, function(value){ return !!value; });
  };

  // Return a completely flattened version of an array.
  _.flatten = function(array) {
    return _.reduce(array, function(memo, value) {
      if (_.isArray(value)) return memo.concat(_.flatten(value));
      memo[memo.length] = value;
      return memo;
    }, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator) {
    var initial = iterator ? _.map(array, iterator) : array;
    var result = [];
    _.reduce(initial, function(memo, el, i) {
      if (0 == i || (isSorted === true ? _.last(memo) != el : !_.include(memo, el))) {
        memo[memo.length] = el;
        result[result.length] = array[i];
      }
      return memo;
    }, []);
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays. (Aliased as "intersect" for back-compat.)
  _.intersection = _.intersect = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and another.
  // Only the elements present in just the first array will remain.
  _.difference = function(array, other) {
    return _.filter(array, function(value){ return !_.include(other, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var args = slice.call(arguments);
    var length = _.max(_.pluck(args, 'length'));
    var results = new Array(length);
    for (var i = 0; i < length; i++) results[i] = _.pluck(args, "" + i);
    return results;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i, l;
    if (isSorted) {
      i = _.sortedIndex(array, item);
      return array[i] === item ? i : -1;
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item);
    for (i = 0, l = array.length; i < l; i++) if (array[i] === item) return i;
    return -1;
  };


  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item) {
    if (array == null) return -1;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) return array.lastIndexOf(item);
    var i = array.length;
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Finds an index of an item using a testing function.
  _.findIndex = function(array, fn) {
    for (i = 0, l = array.length; i < l; i++) if (fn(array[i])) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var len = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(len);

    while(idx < len) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Binding with arguments is also known as `curry`.
  // Delegates to **ECMAScript 5**'s native `Function.bind` if available.
  // We check for `func.bind` first, to fail fast when `func` is undefined.
  _.bind = function(func, obj) {
    if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    var args = slice.call(arguments, 2);
    return function() {
      return func.apply(obj, args.concat(slice.call(arguments)));
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length == 0) funcs = _.functions(obj);
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return hasOwnProperty.call(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(func, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Internal function used to implement `_.throttle` and `_.debounce`.
  var limit = function(func, wait, debounce) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var throttler = function() {
        timeout = null;
        func.apply(context, args);
      };
      if (debounce) clearTimeout(timeout);
      if (debounce || !timeout) timeout = setTimeout(throttler, wait);
    };
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.
  _.throttle = function(func, wait) {
    return limit(func, wait, false);
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds.
  _.debounce = function(func, wait) {
    return limit(func, wait, true);
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      return memo = func.apply(this, arguments);
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func].concat(slice.call(arguments));
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = slice.call(arguments);
    return function() {
      var args = slice.call(arguments);
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) { return func.apply(this, arguments); }
    };
  };


  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (hasOwnProperty.call(obj, key)) keys[keys.length] = key;
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    return _.map(obj, _.identity);
  };

  // Does the dot-delimited or array of keys path to a value exist.
  _.hasKeypath = _.keypathExists = function(object, keypath) {
    return !!_.keypathValueOwner(object, keypath);
  };

  // Finds the object that has or 'owns' the value if a dot-delimited or array of keys path to a value exists.
  _.keypathValueOwner = function(object, keypath) {
    var key, keypath_components = _.isString(keypath) ? keypath.split('.') : keypath;
    var current_object = object;
    for (var i = 0, l = keypath_components.length; i < l;) {
      key = keypath_components[i];
      if (!(key in current_object)) break;
      if (++i === l) return current_object;
      current_object = current_object[key];
      if (!current_object || !(current_object instanceof Object)) break;
    }
    return undefined;
  };

  // Get the value if a dot-delimited or array of keys path exists.
  _.keypathValue = function(object, keypath, missing_value) {
    var keypath_components = _.isString(keypath) ? keypath.split('.') : keypath;
    var value_owner = _.keypathValueOwner(object, keypath_components);
    if (!value_owner) return missing_value;
    return value_owner[keypath_components[keypath_components.length-1]];
  };

  // Set the value if a dot-delimited or array of keys path exists.
  _.keypathSetValue = function(object, keypath, value) {
    var keypath_components = _.isString(keypath) ? keypath.split('.') : keypath;
    var value_owner = _.keypathValueOwner(object, keypath_components);
    if (!value_owner) return;
    value_owner[keypath_components[keypath_components.length-1]] = value;
    return object;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        if (source[prop] !== void 0) obj[prop] = source[prop];
      }
    });
    return obj;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        if (obj[prop] == null) obj[prop] = source[prop];
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Create a duplicate of an object to any zero-indexed depth.
  _.cloneToDepth = function(obj, depth) {
    if (typeof obj !== 'object') return obj;
    if (_.isUndefined(depth)) depth = 0;
    if (depth < 1) return _.clone(obj);
    clone = _.clone(obj);
    for (var key in clone) {
      clone[key] = _.cloneToDepth(clone[key], depth-1);
    }
    return clone;
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    // Check object identity.
    if (a === b) return true;
    // One is falsy and the other truthy.
    if ((!a && b) || (a && !b)) return false;
    // Either one is undefined
    if ((a === void 0) || (b === void 0)) return false;
    // Unwrap any wrapped objects.
    if (a._chain) a = a._wrapped;
    if (b._chain) b = b._wrapped;
    // One of them implements an isEqual()?
    if (a.isEqual) return a.isEqual(b);
    if (b.isEqual) return b.isEqual(a);
    // Different types?
    var atype = typeof(a), btype = typeof(b);
    if (atype != btype) return false;
    // Basic equality test (watch out for coercions).
    if (a == b) return true;
    // Check dates' integer values.
    if (_.isDate(a) && _.isDate(b)) return a.getTime() === b.getTime();
    // Both are NaN?
    if (_.isNaN(a) && _.isNaN(b)) return false;
    // Compare regular expressions.
    if (_.isRegExp(a) && _.isRegExp(b))
      return a.source     === b.source &&
             a.global     === b.global &&
             a.ignoreCase === b.ignoreCase &&
             a.multiline  === b.multiline;
    // If a is not an object by this point, we can't handle it.
    if (atype !== 'object') return false;
    // Check for different array lengths before comparing contents.
    if (a.length && (a.length !== b.length)) return false;
    // Nothing else worked, deep compare the contents.
    var aKeys = _.keys(a), bKeys = _.keys(b);
    // Different object sizes?
    if (aKeys.length != bKeys.length) return false;
    // Recursive comparison of contents.
    for (var key in a) if (!(key in b) || !_.isEqual(a[key], b[key])) return false;
    return true;
  };

  // Is a given value a constructor?
  _.isConstructor = function(obj) {
    return (_.isFunction(obj) && ('name' in obj));
  };

  // Returns the class constructor (function return type) using a string, keypath or constructor.
  _.resolveConstructor = function(key) {
    var keypath_components = _.isArray(key) ? key : (_.isString(key) ? key.split('.') : undefined);

    // resolve a keypath
    if (keypath_components) { 
      var constructor = (keypath_components.length===1) ? window[keypath_components[0]] : _.keypathValue(window, keypath_components);
      return (constructor && _.isConstructor(constructor)) ? constructor : undefined;
    }
    else if (_.isFunction(key) && _.isConstructor(key)) {
      return key;
    }
    return undefined;
  }

  // Determines whether a conversion is possible checking typeof, instanceof, is{SomeType}(), to{SomeType}() using a string, keypath or constructor..
  // Convention for is{SomeType}(), to{SomeType}() with namespaced classes is to remove the namespace (like Javascript does).
  // Note: if you pass a constructor, the constructor name may not exist so use a string if you are relying on is{SomeType}(), to{SomeType}().
  _.CONVERT_NONE = 0;
  _.CONVERT_IS_TYPE = 1;
  _.CONVERT_TO_METHOD = 2;
  _.conversionPath = function(obj, key) {
    var keypath_components = _.isArray(key) ? key : (_.isString(key) ? key.split('.') : undefined);
    
    // Built-in type
    var obj_type = typeof(obj), check_name = keypath_components ? keypath_components[keypath_components.length-1] : undefined;
    if (keypath_components && (obj_type === check_name)) return _.CONVERT_IS_TYPE;

    // Resolved a constructor and object is an instance of it.
    var construtor = _.resolveConstructor(keypath_components ? keypath_components : key);
    if (construtor && (obj_type == 'object')) { try { if (obj instanceof construtor) return _.CONVERT_IS_TYPE; } catch (_e) {} }
    check_name = (construtor && construtor.name) ? construtor.name : check_name;
    if (!check_name) return _.CONVERT_NONE;

    // Try the conventions: is{SomeType}(), to{SomeType}()
    if (_['is'+check_name] && _['is'+check_name](obj)) return _.CONVERT_IS_TYPE;
    else if ((obj_type == 'object') && obj['to'+check_name]) return _.CONVERT_TO_METHOD;
    return _.CONVERT_NONE;
  };

  // Converts from one time to another using a string, keypath or constructor if it can find a conversion path.
  _.toType = function(obj, key) {
    var keypath_components = _.isArray(key) ? key : (_.isString(key) ? key.split('.') : undefined);

    switch (_.conversionPath(obj, keypath_components ? keypath_components : key)) {
      /*_.CONVERT_IS_TYPE*/   case 1: return obj;
      /*_.CONVERT_TO_METHOD*/ case 2: 
        if (keypath_components) {
          return obj['to'+keypath_components[keypath_components.length-1]]();
        }
        else {
          var constructor = _.resolveConstructor(key);
          return (constructor && constructor.name) ? obj['to'+constructor.name]() : undefined;
        }
    }
    return undefined;
  };

  // Checks if a function exists on an object.
  _.functionExists = function(object, function_name) {
    return (object instanceof Object) && object[function_name] && _.isFunction(object[function_name]);
  };

  // Call a function if it exists on an object.
  _.callIfExists = function(object, function_name) {
    return _.functionExists(object, function_name) ? object[function_name].apply(object, slice.call(arguments, 2)) : undefined;
  };

  // Get a specific super class function if it exists. Can be useful when dynamically updating a hierarchy.
  _.getSuperFunction = function(object, function_name) {
    var value_owner = _.keypathValueOwner(object, ['constructor','__super__',function_name]);
    return (value_owner && _.isFunction(value_owner[function_name])) ? value_owner[function_name] : undefined;
  };

  // Call a specific super class function with trailing arguments if it exists. 
  _.superCall = function(object, function_name) {
    return _.superApply(object, function_name, slice.call(arguments, 2));
  };

  // Call a specific super class function with an arguments list if it exists. 
  _.superApply = function(object, function_name, args) {
    var super_function = _.getSuperFunction(object, function_name);
    return super_function ? super_function.apply(object, args) : undefined;
  };

  // Is a given array or object empty?
  _.isEmpty = function(obj) {
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (hasOwnProperty.call(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType == 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Is a given variable an arguments object?
  _.isArguments = function(obj) {
    return !!(obj && hasOwnProperty.call(obj, 'callee'));
  };

  // Is a given value a function?
  _.isFunction = function(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
  };

  // Is a given value a string?
  _.isString = function(obj) {
    return !!(obj === '' || (obj && obj.charCodeAt && obj.substr));
  };

  // Is a given value a number?
  _.isNumber = function(obj) {
    return !!(obj === 0 || (obj && obj.toExponential && obj.toFixed));
  };

  // Is the given value `NaN`? `NaN` happens to be the only value in JavaScript
  // that does not equal itself.
  _.isNaN = function(obj) {
    return obj !== obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false;
  };

  // Is a given value a date?
  _.isDate = function(obj) {
    return !!(obj && obj.getTimezoneOffset && obj.setUTCFullYear);
  };

  // Is the given value a regular expression?
  _.isRegExp = function(obj) {
    return !!(obj && obj.test && obj.exec && (obj.ignoreCase || obj.ignoreCase === false));
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // JSON Functions
  // -----------------
  
  // Convert an array of objects or an object to JSON using the convention that if an
  // object has a toJSON function, it will use it rather than the raw object.
  _.toJSON = function(obj) {
    if (_.isArray(obj)) {
      var result = [];
      each(obj, function(value) { result.push(_.toJSON(value)); });
      return result;
    }
    else if ((obj instanceof Object) && obj.toJSON) {
      return obj.toJSON();
    }
    return obj;
  };

  // Deserialized an array of JSON objects or each object individually using the following conventions:
  // 1) if JSON has a recognized type identifier (_type as default), it will try to create an instance.
  // 2) if the class refered to by the type identifier has a parseJSON function, it will try to create an instance.
  // Options: 
  //    type_field - the default is '_type' but you can choose any field name to trigger the search for a parseJSON function.
  //    parse_properties - used to disambigate between owning a collection's items and cloning a collection.
  _.parseJSON = function(obj, options) {
    var obj_type = typeof(obj);

    // simple type
    if ((obj_type!=='object') && (obj_type!=='string')) return obj;

    // the object is still a JSON string, convert to JSON
    if ((obj_type==='string') && obj.length && ((obj[0] === '{')||(obj[0] === '['))) {
      try { var obj_as_JSON = JSON.parse(obj); if (obj_as_JSON) obj = obj_as_JSON; } 
      catch (_e) {throw new TypeError("Unable to parse JSON: " + obj);}
    }

    // parse an array
    options || (options = {});
    if (_.isArray(obj)) {
      var result = [];
      each(obj, function(value) { result.push(_.parseJSON(value, type_field)); });
      return result;
    }
    
    // parse the properties individually
    else if(options.parse_properties) {
      var result = {};
      each(obj, function(value, key) { result[key] = _.parseJSON(value, type_field); });
      return result;
    }

    // no deseralization available
    var type_field = options.type_field ? options.type_field : '_type';    // Convention
    if (!(obj instanceof Object) || !obj.hasOwnProperty(type_field)) return obj;

    // find and use the parseJSON function
    var type = obj[type_field], parseJSON_owner = _.keypathValueOwner(window, type+'.parseJSON');
    if (!parseJSON_owner) throw new TypeError("Unable to find a parseJSON function for type: " + type);
    return parseJSON_owner.parseJSON(obj);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function (n, iterator, context) {
    for (var i = 0; i < n; i++) iterator.call(context, i);
  };

  // Add your own custom functions to the Underscore object, ensuring that
  // they're correctly added to the OOP wrapper as well.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name){
      addToWrapper(name, _[name] = obj[name]);
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = idCounter++;
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(str, data) {
    var c  = _.templateSettings;
    var tmpl = 'var __p=[],print=function(){__p.push.apply(__p,arguments);};' +
      'with(obj||{}){__p.push(\'' +
      str.replace(/\\/g, '\\\\')
         .replace(/'/g, "\\'")
         .replace(c.interpolate, function(match, code) {
           return "'," + code.replace(/\\'/g, "'") + ",'";
         })
         .replace(c.evaluate || null, function(match, code) {
           return "');" + code.replace(/\\'/g, "'")
                              .replace(/[\r\n\t]/g, ' ') + "__p.push('";
         })
         .replace(/\r/g, '\\r')
         .replace(/\n/g, '\\n')
         .replace(/\t/g, '\\t')
         + "');}return __p.join('');";
    var func = new Function('obj', tmpl);
    return data ? func(data) : func;
  };

  // The OOP Wrapper
  // ---------------

  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.
  var wrapper = function(obj) { this._wrapped = obj; };

  // Expose `wrapper.prototype` as `_.prototype`
  _.prototype = wrapper.prototype;

  // Helper function to continue chaining intermediate results.
  var result = function(obj, chain) {
    return chain ? _(obj).chain() : obj;
  };

  // A method to easily add functions to the OOP wrapper.
  var addToWrapper = function(name, func) {
    wrapper.prototype[name] = function() {
      var args = slice.call(arguments);
      unshift.call(args, this._wrapped);
      return result(func.apply(_, args), this._chain);
    };
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      method.apply(this._wrapped, arguments);
      return result(this._wrapped, this._chain);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      return result(method.apply(this._wrapped, arguments), this._chain);
    };
  });

  // Start chaining a wrapped Underscore object.
  wrapper.prototype.chain = function() {
    this._chain = true;
    return this;
  };

  // Extracts the result from a wrapped and chained object.
  wrapper.prototype.value = function() {
    return this._wrapped;
  };

})();
