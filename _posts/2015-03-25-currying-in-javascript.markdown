---
layout: post
title:  "Currying in JavaScript"
date:   2015-03-25 22:35:01
categories: JavaScript
---

Currying is a technique used to translate a function that takes
multiple arguments into a sequence of single-argument functions. For
example, here is a normal function with 2 arguments:

{% highlight javascript %}
var adder = function(a, b) {
    return a + b;
};
{% endhighlight %}

With currying, it can be translated into a function same as below:
{% highlight javascript %}
var curriedAdder = curry(adder);

// curriedAdder is same as:
curriedAdder = function(a) {
    return function(b) {
        return a + b;
    };
};
{% endhighlight %}

We can call the curried function like this:
{% highlight javascript %}
var add1 = curriedAdder(1);
console.log(add1(2)); // => 3
{% endhighlight %}

## Implementing currying

As we can see, the function `curry` should take a normal function, and
return its curried function. The curried function actually needs to do
two things:

1. collecting arguments, and
2. returning another curried function that does *the same two things*

Obviously, it is a recursive pattern:
{% highlight javascript %}
var curry = function(f, args) {
    return function() {
        // 1. accumulate arguments
        var args = args.concat(Array.prototype.slice.call(arguments));
        // 2. return another curried function
        return curry(f, args);
    }
}
{% endhighlight %}

In addition, we also need to terminate the recursion when it has
collected enough arguments, and finally apply the arguments to the
input function.

Here is the complete `curry`:
{% highlight javascript %}
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
{% endhighlight %}

It takes 3 arguments: a function `f`, the number of arguments to
accumulate `nargs`, and the accumulated arguments `args`.

Try it with some examples:
{% highlight javascript %}
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
{% endhighlight %}

Passing multiple arguments is possible for the sake of convenience:
{% highlight javascript %}
console.log(curry(f)('a', 'b'));
// => [ 'a', 'b' ]
console.log(curry(f, 3)('a', 'b')('c', 'd'));
// => [ 'a', 'b', 'c', 'd' ]
{% endhighlight %}

Note that if you need to bind an argument to a function that only
takes a single argument, below is the only way:
{% highlight javascript %}
var greet = function(name) {
    return 'hello, ' + name;
};

var greetTao = curry(greet, 1, ['Tao']);
console.log(greetTao());
// => 'hello, Tao'
{% endhighlight %}

## Implementing uncurrying

Uncurrying is the reverse operation to currying. It converts a curried
function to a function that takes multiple arguments. Uncurrying can
be also implemented in a recursive way. Uncurrying a function
involves:

1. call the curried function with a single argument, and
2. uncurry the curried function returned by step 1

Same as currying, the recursion stops when it consumed enough
arguments:
{% highlight javascript %}
var uncurry = function(g, nargs) {
    return function(first) {
        if (nargs <= 1) return g.apply(this, arguments);
        var rest = Array.prototype.slice.call(arguments, 1);
        return uncurry(g(first), nargs - 1).apply(this, rest);
    };
};
{% endhighlight %}

Some examples:
{% highlight javascript %}
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
{% endhighlight %}

## Conclusions

Play with it if you are interested. All code in this article is
available at
[here](https://github.com/ptpt/ptpt.github.io/blob/master/_src/curry.js)
and tested under Node.js.
