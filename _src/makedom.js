//     makedom.js
//     http://taopeng.me
//     (c) 2013-2015 Tao Peng


// predictions below are copied from http://underscorejs.org/
var isString = function(obj) {
    return toString.call(obj) === '[object String]';
};

var isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
};

var isArray = function(obj) {
    return toString.call(obj) === '[object Array]';
};

var isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
};


// #+block makedom
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
// #+endblock


var test = function() {
    var dom;
    dom = makeDOM(['div', 'hello', ['span', {class: 'strong'}, 'world']]);
    console.assert(dom.outerHTML === "<div>hello<span class=\"strong\">world</span></div>");
    dom = makeDOM([document.createElement('div'), 'hello', ['span', {class: 'strong'}, 'world']]);
    console.assert(dom.outerHTML === "<div>hello<span class=\"strong\">world</span></div>");
    dom = makeDOM(['hello']);
    console.assert(dom.outerHTML, '<hello></hello>');
    dom = makeDOM(['hello', 'world']);
    console.assert(dom.outerHTML === '<hello>world</hello>');
    dom = makeDOM(['hello', 'world', 'haha']);
    console.assert(dom.outerHTML === '<hello>worldhaha</hello>');
    dom = makeDOM([document.createElement('hello'), 'world', 'haha']);
    console.assert(dom.outerHTML === '<hello>worldhaha</hello>');
    dom = makeDOM([document.createElement('hello'), 'world', 'haha', {id: 1}, ['haha', 'heihei', {class: 'cool'}]]);
    console.assert(dom.outerHTML === '<hello id="1">worldhaha<haha class="cool">heihei</haha></hello>');
    dom = makeDOM([document.createElement('hello'), {id: 1}, document.createElement('heihei')]);
    console.assert(dom.outerHTML === '<hello id="1"><heihei></heihei></hello>');
    alert('tests done');
};

test();
