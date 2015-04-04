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
#+sh block.awk name=adder curry.js
{% endhighlight %}

With currying, it can be translated into a function same as below:
{% highlight javascript %}
#+sh block.awk name=curriedAdder curry.js
{% endhighlight %}

We can call the curried function like this:
{% highlight javascript %}
#+sh block.awk name=add1 curry.js
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
        var newArgs = args.concat(Array.prototype.slice.call(arguments));
        // 2. return another curried function
        return curry(f, newArgs);
    }
}
{% endhighlight %}

In addition, we also need to terminate the recursion when it has
collected enough arguments, and finally apply the arguments to the
input function.

Here is the complete `curry`:
{% highlight javascript %}
#+sh block.awk name=curry curry.js
{% endhighlight %}

It takes 3 arguments: a function `f`, the number of arguments to
accumulate `nargs`, and the accumulated arguments `args`.

Try it with some examples:
{% highlight javascript %}
#+sh block.awk name=test_curry curry.js
{% endhighlight %}

Passing multiple arguments is possible for the sake of convenience:
{% highlight javascript %}
#+sh block.awk name=test_curry_with_multi_args curry.js
{% endhighlight %}

Note that if you need to bind an argument to a function that only
takes a single argument, below is the only way:
{% highlight javascript %}
#+sh block.awk name=greet_tao curry.js
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
#+sh block.awk name=uncurry curry.js
{% endhighlight %}

Some examples:
{% highlight javascript %}
#+sh block.awk name=test_uncurry curry.js
{% endhighlight %}

## Conclusion

Play with it if you are interested. All code in this article is
available at
[here](https://github.com/ptpt/ptpt.github.io/blob/master/_src/curry.js)
and tested under Node.js.
