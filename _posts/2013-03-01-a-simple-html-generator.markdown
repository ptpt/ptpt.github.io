---
layout: post
title:  "A Simple HTML Generator"
date:   2013-03-01 22:35:01
categories: CoffeeScript JavaScript
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
    return $(makeDom(['div', 'hello', ['span', {class: 'strong'}, name]]));
}
greet('world'); // =>  <div>hello<span class="strong">world</span></div>
{% endhighlight %}

It is not shorter, but much simpler, and easier to read.

Here is the code, written in CoffeeScript:

{% highlight coffeescript %}
 makeDom = (array) ->
    if not array.length
         return null

    if array[0] instanceof HTMLElement
        element = array[0]
    else
        element = document.createElement(array[0])

    for node in array[1..]
        # append strings and text nodes will as text node
        if toString.call(node) == '[object String]'
            element.appendChild document.createTextNode(node)
        else if node instanceof Text
            element.appendChild(node)

        # append arrays as child nodes
        else if Array.isArray(node)
            child = makeDom(node)
            element.appendChild(child) if child?

        # append Attr instance and objects as attributes
        else if node instanceof Attr
            element.setAttributeNode(node)
        else if node == Object(node)
            for key, value of node
                element.setAttribute(key, value)

    return element
{% endhighlight %}
