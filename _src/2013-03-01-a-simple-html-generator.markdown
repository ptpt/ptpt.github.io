---
layout: post
title:  "A Simple HTML Generator"
date:   2013-03-01 22:35:01
categories: JavaScript
---

I find It's very common for me to generate HTML in JavaScript. I used
to use jQuery to generate HTML like this:

{% highlight javascript %}
function greet(name) {
    return $('<div>hello<span class="strong">' + name + '</span></div>');
}
{% endhighlight %}

It's really a pain when you want to generate a long complex nested
HTML code in this way. I also tried some template libraries that can
do this job, but they are either too heavy or too complex to use.

So I wrote a simple one, just one function, which accepts an array as
its argument and return a HTML node. The first element of the array is
required to determine the HTML node's tag; the rest elements are
used to decide the node's attributes, text, and child nodes, depending
on the type of each element. For example:

{% highlight javascript %}
function greet(name) {
    return makeDom(['div', 'hello', ['span', {class: 'strong'}, name]]);
}
greet('world'); // =>  <div>hello<span class="strong">world</span></div>
{% endhighlight %}

It is not shorter, but much simpler, and easier to read.

The code is straightforward:
{% highlight javascript %}
#+sh block.awk name=makedom makedom.js
{% endhighlight %}

The full code is available
[here](https://github.com/ptpt/ptpt.github.io/blob/master/_src/makedom.js).
