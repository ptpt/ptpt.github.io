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
var makeDOM = function (array) {
    if (!array || !array.length) return null;

    var child,
        root = array[0],
        element = isElement(root)? root : document.createElement(root);

    for (var i=1, l=array.length; i<l; i+=1) {
        child = array[i];

        // append string and text node as text node
        if (isString(child)) {
            element.appendChild(document.createTextNode(child));
        } else if (child instanceof Text) {
            element.appendChild(child);
        }

        // append array and element as child node
        else if (isArray(child)) {
            var dom = makeDOM(child);
            if (dom) element.appendChild(dom);
        } else if (isElement(child)) {
            element.appendChild(child);
        }

        // append attr and object as attribute
        else if (child instanceof Attr) {
            element.setAttribute(child);
        } else if (isObject(child)) {
            for (var key in child) {
                element.setAttribute(key, child[key]);
            }
        }
    }

    return element;
};
{% endhighlight %}

The full code is available
[here](https://github.com/ptpt/ptpt.github.io/blob/master/_src/makedom.js).
