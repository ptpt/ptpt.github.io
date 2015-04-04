// #+block curry
var curry = function(f, nargs, args) {
    nargs = isFinite(nargs) ? nargs : f.length;
    args = args || [];
    return function() {
        // 1. accumulate arguments
        var newArgs = args.concat(Array.prototype.slice.call(arguments));
        if (newArgs.length >= nargs) {
            // apply accumulated arguments
            return f.apply(this, newArgs);
        }
        // 2. return another curried function
        return curry(f, nargs, newArgs);
    };
};
// #+endblock


// #+block test_curry
// a testing function that does nothing but return its arguments.
var f = function(a, b) {
    return Array.prototype.slice.call(arguments);
};
console.assert(f.length === 2);

console.log(curry(f)('a'));
// => [Function]
console.log(curry(f)('a')('b'));
// => [ 'a', 'b' ]
console.log(curry(f, 3)('a')('b')('c'));
// => [ 'a', 'b', 'c' ]
// #+endblock


// #+block test_curry_with_multi_args
console.log(curry(f)('a', 'b'));
// => [ 'a', 'b' ]
console.log(curry(f, 3)('a', 'b')('c', 'd'));
// => [ 'a', 'b', 'c', 'd' ]
// #+endblock



// #+block greet_tao
var greet = function(name) {
    return 'hello, ' + name;
};

var greetTao = curry(greet, 1, ['Tao']);
console.log(greetTao());
// => 'hello, Tao'
// #+endblock

console.assert(greetTao() === 'hello, Tao');

// utils for testing
var arrayEqual = function(a, b) {
    return a.length === b.length && a.every(function (ai, i) {
        var bi = b[i];
        return ai === bi || (Array.isArray(ai) && Array.isArray(bi) && arrayEqual(ai, bi));
    });
};
console.assert(arrayEqual([], []));
console.assert(arrayEqual([1,2,3], [1,2,3]));
console.assert(arrayEqual([1,[2,3]], [1,[2,3]]));
console.assert(!arrayEqual([1,2,3], [1,2,3,4]));
console.assert(!arrayEqual([1,[2,3]], [1,2,3]));
console.assert(!arrayEqual([1,[2,3]], [1,2,[3]]));

console.assert(arrayEqual(curry(f, 0)('a', 'b', 'd', 'e'),
                          ['a', 'b', 'd', 'e']));
console.assert(arrayEqual(curry(f, 1)('a'),
                          ['a']));
console.assert(arrayEqual(curry(f, 2)('a')('b'),
                          ['a', 'b']));
console.assert(arrayEqual(curry(f, 2)('a')('b', 'c'),
                          ['a', 'b', 'c']));
console.assert(arrayEqual(curry(f, 0)('a', 'b', 'd', 'e'),
                          ['a', 'b', 'd', 'e']));
console.assert(arrayEqual(curry(function(a, b) {return Array.prototype.slice.call(arguments);})('a')('b'),
                          ['a', 'b']));
console.assert(arrayEqual(curry(function(a, b, c) {return Array.prototype.slice.call(arguments);})('a')('b')('c'),
                          ['a', 'b', 'c']));


// #+block adder
var adder = function(a, b) {
    return a + b;
};
// #+endblock


// #+block curriedAdder
var curriedAdder = curry(adder);

// curriedAdder is same as:
curriedAdder = function(a) {
    return function(b) {
        return a + b;
    };
};
// #+endblock


// #+block add1
var add1 = curriedAdder(1);
console.log(add1(2)); // => 3
// #+endblock


// #+block uncurry
var uncurry = function(g, nargs) {
    return function(first) {
        if (nargs <= 1) return g.apply(this, arguments);
        var rest = Array.prototype.slice.call(arguments, 1);
        return uncurry(g(first), nargs - 1).apply(this, rest);
    };
};
// #+endblock


// #+block test_uncurry
adder = uncurry(curriedAdder, 2);
console.log(adder(1, 2));
// => 3

var f2 = uncurry(curry(f), 2);
console.log(f2('a'));
// => [Function]
console.log(f2('a', 'b'));
// => [ 'a', 'b' ]

var f1 = uncurry(curry(f), 1);
console.log(f1('a', 'b', 'c'));
// => [ 'a', 'b', 'c' ]
// #+endblock
