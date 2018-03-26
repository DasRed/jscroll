/**
 * clone a object recursive
 *
 * @param object object
 * @return object
 */
function $clone(object)
{
	return $merge(object, {});
}

// Object erweiterungen
$extend(Object,
{
	/**
	 * Etwas nach HTML konvertieren
	 *
	 * @return string
	 */
	toHTML: function(object)
	{
		return object && object.toHTML ? object.toHTML() : String.interpret(object);
	}
});

// String Erweiterungen
$extend(String,
{
	/**
	 * interpretiert value als String
	 *
	 * @retrun string
	 */
	interpret: function(value)
	{
		return value == null ? '' : String(value);
	}
});

/**
 * Liefert die Nodes für HTML Text
 *
 * @param string tagName
 * @param string html
 * @return array
 */
Element._getContentFromAnonymousElement = function(tagName, html)
{
	var div = new Element('div'), t = Element._insertionTranslations.tags[tagName];
	if (t)
	{
		div.innerHTML = t[0] + html + t[1];
		t[2].times(function()
		{
			div = div.firstChild
		});
	}
	else
	{
		div.innerHTML = html;
	}

	return $A(div.childNodes);
};

// weitere Array Functions
Array.implement(
{
	/**
	 * find a element via function
	 *
	 * @param function fn
	 * @param object scope
	 * @return mixed
	 */
	find: function(fn, scope)
	{
		var result;
		var fnCall = fn

		if (scope)
		{
			fnCall = fnCall.bind(scope);
		}

		this.some(function(item, index, array)
		{
			if (fnCall(item, index, array))
			{
				result = item;
				return true;
			}

			return false;
		});

		return result;
	},

	/**
	 * invokes the fn on all elements
	 *
	 * @param string fn
	 * @return array
	 */
	invoke: function(fn)
	{
		this.each(function(element)
		{
			if (element[fn])
			{
				element[fn]();
			}
		});

		return this;
	}
});

/**
 * Element Erweiterungen
 *
 */
Element.implement(
{
	/**
	 * deaktiviert das markieren im Browser
	 *
	 * @var element
	 */
	disableSelection: function()
	{
		// selectable ist nun aus für gecko, webkit... nix mehr mit markieren
		return this.setStyles(
		{
			MozUserSelect:		'none',
			KhtmlUserSelect:	'none'
		})

		// selectable ist nun aus trident und presto... nix mehr mit markieren
		.setProperty('unselectable', 'on');
	},

	/**
	 * alias für getElement
	 *
	 * @return element
	 */
	down: function(selector)
	{
		return this.getElement(selector);
	},

	/**
	 * insert({ position: content }) -> HTMLElement
	 * insert(content) -> HTMLElement
	 * Inserts content before, after, at the top of, or at the bottom of element, as specified by
	 * the position property of the second argument. If the second argument is the content itself,
	 * insert will append it to element.
	 * insert accepts the following kind of content: text, HTML, DOM element, and any kind of
	 * object with a toHTML or toElement method.
	 * Note that if the inserted HTML contains any <script> tag, these will be automatically
	 * evaluated after the insertion (insert internally calls String#evalScripts when inserting HTML).
	 *
	 * @return element
	 */
	insert: function(insertions)
	{
		var element = $(this);

		if ($type(insertions) == 'string' || $type(insertions) == 'number' || $type(insertions) == 'element' || (insertions && (insertions.toElement || insertions.toHTML)))
		{
			insertions = {bottom:insertions};
		}

		var content, insert, tagName, childNodes;

		for (var position in insertions)
		{
			content  = insertions[position];
			position = position.toLowerCase();
			insert = Element._insertionTranslations[position];

			if (content && content.toElement)
			{
				content = content.toElement();
			}
			if ($type(content) == 'element')
			{
				insert(element, content);
				continue;
			}

			content = Object.toHTML(content);

			tagName = ((position == 'before' || position == 'after') ? element.parentNode : element).tagName.toUpperCase();

			childNodes = Element._getContentFromAnonymousElement(tagName, content);

			if (position == 'top' || position == 'after')
			{
				childNodes.reverse();
			}
			childNodes.each(function(childNode)
			{
				insert(element, childNode);
			});
		}

		return element;
	},

	/**
	 * next element
	 *
	 * @return element
	 */
	next: function (selector)
	{
		return this.getNext(selector);
	},

	/**
	 * previous element
	 *
	 * @return element
	 */
	prev: function (selector)
	{
		return this.getPrevious(selector);
	},

	/**
	 * Setzt die Höhe und Breite eines Elementes
	 *
	 * @param int|array|object width
	 * @param int height
	 */
	setSize: function(width, height)
	{
		if ($type(width) == 'array')
		{
			height = width[1];
			width = width[0];
		}
		else if ($type(width) == 'object')
		{
			if ($type(width.x) == 'number')
			{
				height = width.y;
				width = width.x;
			}
			else
			{
				height = width.height;
				width = width.width;
			}
		}

		return this.setStyles(
		{
			'width':	width,
			'height':	height
		});
	},

	/**
	 * alias für getParent
	 *
	 * @return element
	 */
	up: function(selector)
	{
		return this.getParent(selector);
	}
});

Element._insertionTranslations = {
  before: function(element, node) {
    element.parentNode.insertBefore(node, element);
  },
  top: function(element, node) {
    element.insertBefore(node, element.firstChild);
  },
  bottom: function(element, node) {
    element.appendChild(node);
  },
  after: function(element, node) {
    element.parentNode.insertBefore(node, element.nextSibling);
  },
  tags: {
    TABLE:  ['<table>',                '</table>',                   1],
    TBODY:  ['<table><tbody>',         '</tbody></table>',           2],
    TR:     ['<table><tbody><tr>',     '</tr></tbody></table>',      3],
    TD:     ['<table><tbody><tr><td>', '</td></tr></tbody></table>', 4],
    SELECT: ['<select>',               '</select>',                  1]
  }
};

String.implement(
{
	/**
     * Pads the left side of a string with a specified character.  This is especially useful
     * for normalizing number and date strings.
     *
     * @param {Number} size The total length of the output string
     * @param {String} char (optional) The character with which to pad the original string (defaults to empty string " ")
     * @return {String} The padded string
     */
    leftPad: function (size, ch)
    {
        var result = new String(this);
        if (!ch)
    	{
        	ch = " ";
    	}
        while (result.length < size)
    	{
        	result = ch + result;
    	}

        return result.toString();
    }
});