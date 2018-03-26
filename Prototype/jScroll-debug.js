(function()
{
	var REQUIRED_PROTOTYPE			= '1.6.0';	/* erwartete Prototype Version */
	var loaded						= false;	/* gibt an ob das Fenster geladen ist oder nicht */
	var containers					= $A([]);	/* Liste aller jScrolls */

	/**
	 * konvertiert versions-nummern-string
	 *
	 * @param string versionString
	 * @access private
	 * @retrun array
	 */
	var convertVersionString = function(versionString)
	{
		var r = versionString.split('.');
		return parseInt(r[0]) * 100000 + parseInt(r[1]) * 1000 + parseInt(r[2]);
	};

	/* Prüfen nach Prototype und korrekter Version */
	if ( typeof Prototype		== "undefined" ||
		 typeof Element			== "undefined" ||
	   	 typeof Element.Methods	== "undefined" ||
		 convertVersionString(Prototype.Version) < convertVersionString(REQUIRED_PROTOTYPE)
		)
	{
		throw("jScroll requires the Prototype JavaScript framework >= " + REQUIRED_PROTOTYPE);
		return;
	}

	/* unseren Pfad finden */
	var js = /jScroll\.js(\?.*)?$/;
	var jsPath = $$('head script[src]').find(function(s)
	{
		return s.src.match(js);
	});
	if (!jsPath)
	{
		js = /jScroll\-debug\.js(\?.*)?$/;
		jsPath = $$('head script[src]').find(function(s)
		{
			return s.src.match(js);
		});
	}
	jsPath = jsPath.src.replace(js, "");

	/****************************************************************************************************
	 *																									*
	 *									allgemeine Funktionen											*
	 *																									*
	 ****************************************************************************************************/
	/**
	 * gibt ggf debugmeldungen aus funktioniert nur mit FF und FireBug
	 *
	 * @param mixed notice
	 * @access public
	 */
	var $d = function(notice)
	{
		if (Prototype.Browser.Gecko)
		{
			console.info(notice);
		}
		else if (Prototype.Browser.WebKit)
		{
			console.log(notice);
		}
		else if (Prototype.Browser.Opera)
		{
			opera.postError(notice);
		}
		else
		{
			if (!loaded)
			{
				autoload(function()
				{
					$d(notice);
				});

				return;
			}

			if (!$("jScroll_console"))
			{
				Element.insert(document.body,
				{
					top:
						"<div id='jScroll_console' style='position:absolute;left:0px;height:150px;width:100%;bottom:0px;z-index:100000;overflow:hidden;border-top:1px solid #A06060;background-color:#FFD0D0;'>" +
							"<div style='color:#000000;font-weight:bold;padding:1px;border-bottom:1px solid #858484;height:15px;'>jScroll - Console</div>" +
							"<div id='jScroll_console_content' style='color:#000000;font-size:10px;font-family:tahoma,arial,helvetica,sans-serif;overflow-x:hidden;overflow-y:scroll;width:100%;height:132px;'></div>" +
						"</div>"
				});
			}
			Element.insert($("jScroll_console_content"), {bottom: "<div style='color:#000000;'>" + Object.toHTML(notice) + "</div>"});
			$("jScroll_console_content").select("div").last().scrollIntoView();
		}
	};

	/**
	 * etwas nach dem Dom load laden bzw ausführen
	 *
	 * @param function fn
	 * @access private
	 */
	var autoload = function(fn)
	{
		if (!loaded)
		{
			document.observe("dom:loaded", function()
			{
				loaded = true;
				fn();
			});
		}
		else
		{
			fn.bind(window)();
		}
	};

	/**
	 * prozent korrektur
	 *
	 * @param float percent
	 * @access private
	 * @return float
	 */
	var correctPercentage = function(percent)
	{
		if (percent < 0)
		{
			percent = 0;
		}
		else if (percent > 100)
		{
			percent = 100;
		}

		return percent;
	};

	/**
	 * CSS Declaration erzeugen
	 *
	 * @param string declaration
	 * @access private
	 */
	var createCSSDeclaration = function(declaration)
	{
		/**
		 * Trims a string
		 *
		 * @param string str
		 * @access private
		 * @return string
		 */
		var trim = function()
		{
		    var re = /^[\s\n\r]+|[\s\n\r]+$/g;
		    return function(str)
		    {
		    	return str.replace(re, "");
		    };
		}();

		/**
		 * CSS Rule einfügen
		 *
		 * @param string selector
		 * @param string|object declaration
		 * @access private
		 */
		var createCSSRule = function(selector, declaration)
		{
			if (selector.indexOf(",") != -1)
			{
				selector.split(",").each(function(sel)
				{
					createCSSRule(trim(sel), declaration);
				});
				return;
			}

		    /* create the style node for all browsers */
		    var style_node = $("jScroll.css");
		    if (!style_node)
		    {
			    var style_node = document.createElement("style");
			    style_node.setAttribute("type", "text/css");
			    style_node.setAttribute("media", "screen");
			    style_node.setAttribute("id", "jScroll.css");
			    /* append the style node */
			    Element.insert(document.getElementsByTagName("head")[0], {top: style_node});
		    }

		    if (!Object.isString(declaration))
		    {
		    	declaration = Object.keys(declaration).inject('', function(decl, key)
		    	{
		    		return decl + key.underscore().dasherize() + ":" + declaration[key];
		    	});
		    }

		    /* append a rule for good browsers */
		    if (!Prototype.Browser.IE)
		    {
		    	style_node.appendChild(document.createTextNode(selector + " {" + declaration + "}\n"));
		    }

		    /* use alternative methods for IE */
		    if (Prototype.Browser.IE && document.styleSheets && document.styleSheets.length > 0)
		    {
				var last_style_node = document.styleSheets[0];
				if (typeof(last_style_node.addRule) == "object")
				{
					last_style_node.addRule(selector, declaration);
				}
		    }
		};

		declaration.replace(/[\n\r]/gi , '').split("}").each(function(decl)
		{
			decl = decl.split("{");
			if (decl.length < 2 || trim(decl[0]) == 0 || trim(decl[1]) == 0)
			{
				return;
			}
			createCSSRule(trim(decl[0]), trim(decl[1]));
		});
	};

	/**
	 * erstellungsfunktion + rendering fürs jScroll
	 *
	 * @param jScroll jscroll
	 * @access private
	 */
	var createjScroll = function(jscroll)
	{
		jscroll.container = $(jscroll.container);

		/* kein Container?*/
		if (!Object.isElement(jscroll.container))
		{
			throw("Missing scroll container for jScroll!");
		}

		/* anmelden*/
		jscroll.container._jScroll = jscroll;
		register(jscroll.container);

		/* rendering*/
		/* Event */
		if (fireEvent(jscroll, "onRenderBefore") === false)
		{
			return;
		}

		/* schon gerendert oder container kein element*/
		if (jscroll.rendered || !Object.isElement(jscroll.container))
		{
			return;
		}

		/* rendering marking*/
		jscroll.rendered = true;

		jscroll.container.setStyle(
		{
			overflow:	"hidden"
		});

		/* Childs merken*/
		var childs = jscroll.container.childElements().each(function(element)
		{
			element.remove();
		});

		/* neuer kontent*/
		jscroll.container.innerHTML = "";
		Element.insert(jscroll.container,
		{
			bottom:	"<div class='jScroll'>" +
						"<div class='jScroll-content'>" +
						"</div>" +
						"<div class='jScroll-scroll " + jscroll.options.clsScroll + "'>" +
							"<div class='jScroll-scroll-up'>" +
								"<div class='" + jscroll.options.clsUp + "'></div>" +
							"</div>" +
							"<div class='jScroll-scroll-between " + jscroll.options.clsBetween + "'></div>" +
							"<div class='jScroll-scroll-slider " + jscroll.options.clsSlider + "'>" +
								"<div class='" + jscroll.options.clsSlider + " top'></div>" +
								"<div class='" + jscroll.options.clsSlider + " center'></div>" +
								"<div class='" + jscroll.options.clsSlider + " bottom'></div>" +
							"</div>" +
							"<div class='jScroll-scroll-between " + jscroll.options.clsBetween + "'></div>" +
							"<div class='jScroll-scroll-down'>" +
								"<div class='" + jscroll.options.clsDown + "'></div>" +
							"</div>" +
						"</div>" +
					"</div>"
		});

		/* diverse elemente merken*/
		jscroll.element				= jscroll.container.down(".jScroll");
		jscroll.elementContent		= jscroll.container.down(".jScroll-content");
		jscroll.elementScroll		= jscroll.container.down(".jScroll-scroll");
		jscroll.elementUp			= jscroll.container.down(".jScroll-scroll-up");
		jscroll.elementUpBetween	= jscroll.container.down(".jScroll-scroll-between", 0);
		jscroll.elementSlider		= jscroll.container.down(".jScroll-scroll-slider");
		jscroll.elementSliderTop	= jscroll.elementSlider.down(".top");
		jscroll.elementSliderCenter	= jscroll.elementSlider.down(".center");
		jscroll.elementSliderBottom	= jscroll.elementSlider.down(".bottom");
		jscroll.elementDownBetween	= jscroll.container.down(".jScroll-scroll-between", 1);
		jscroll.elementDown			= jscroll.container.down(".jScroll-scroll-down");

		/* childs neu einfügen*/
		childs.each(function(element)
		{
			Element.insert(jscroll.elementContent, {bottom: element});
		});

		var pointerY = 0;
		/* wenn innerhalb des Scroller geklickt nicht auf eine der Subelement */
		jscroll.elementScroll.observe("mousedown", function(e)
		{
			jscroll._sliderScroll = true;
			Event.stop(e);

			peStart(function()
			{
				if (jSElement_getY(jscroll.elementSlider) <= pointerY && pointerY <= jSElement_getY(jscroll.elementSlider) + jSElement_getHeight(jscroll.elementSlider))
				{
					return;
				}

				var direction = pointerY - jSElement_getY(jscroll.elementSlider);

				if (direction < 0)
				{
					jscroll.elementUpBetween.addClassName(jscroll.options.clsBetweenClicked);
					jscroll.elementDownBetween.removeClassName(jscroll.options.clsBetweenClicked);
				}
				else
				{
					jscroll.elementUpBetween.removeClassName(jscroll.options.clsBetweenClicked);
					jscroll.elementDownBetween.addClassName(jscroll.options.clsBetweenClicked);
				}

				jscroll.scroll((direction < 0 ? -1 : 1) * jscroll.stepLarge);
			}, jscroll);
		});

		/* wenn auf nach oben geklickt wird*/
		jscroll.elementUp.observe("mousedown", function(e)
		{
			jscroll._sliderScroll = true;
			Event.stop(e);
			peStart(jscroll.up.curry(jscroll.stepSmall), jscroll);
		});

		/* wenn auf nach unten geklickt wird*/
		jscroll.elementDown.observe("mousedown", function(e)
		{
			jscroll._sliderScroll = true;
			Event.stop(e);
			peStart(jscroll.down.curry(jscroll.stepSmall), jscroll);
		});

		/* wenn auf den slider geklickt wird*/
		jscroll.elementSlider.observe("mousedown", function(e)
		{
			Event.stop(e);
			jscroll._sliderMove	= true;
			jscroll._sliderY	= Event.pointerY(e) - parseFloat(jscroll.elementSlider.getStyle("top")) + jSElement_getHeight(jscroll.elementUp);
		});

		/* fürs slider moveing*/
		document.observe("mousemove", function(e)
		{
			pointerY = Event.pointerY(e);
			if (!jscroll._sliderMove)
			{
				return;
			}

			Event.stop(e);

			var percent = (Event.pointerY(e) - jscroll._sliderY) * 100 / jscroll.sliderHeight;

			/* Event */
			if (fireEvent(jscroll, "onScrollSlideBefore", percent) === false)
			{
				return;
			}

			jscroll.update(percent);

			/* Event */
			fireEvent(jscroll, "onScrollSlideAfter");
		});

		/* beenden der events wenn Mous up geht */
		document.observe("mouseup", function(e)
		{
			if (jscroll._sliderMove || jscroll._sliderScroll)
			{
				Event.stop(e);
				jscroll._sliderMove		= false;
				jscroll._sliderScroll	= false;
				peStop(jscroll);
				jscroll.elementUpBetween.removeClassName(jscroll.options.clsBetweenClicked);
				jscroll.elementDownBetween.removeClassName(jscroll.options.clsBetweenClicked);
			}
		});

		/* Mouse Wheeling*/
		jscroll.element.observe(Prototype.Browser.Gecko ? "DOMMouseScroll" : "mousewheel", function(e)
		{
			Event.stop(e);

			var delta = 0;

			/* IE / Opera*/
			if (e.wheelDelta)
			{
				delta = -e.wheelDelta;
			}
			/* Mozilla*/
			else if (e.detail)
			{
				delta = e.detail;
			}

			if (delta)
			{
				jscroll.scroll((delta < 0 ? -1 : 1) * (e.altKey ? jscroll.stepSmall : jscroll.stepLarge));
			}
		});

		/* infos aktualisieren */
		jscroll.refresh();

		/* Event */
		fireEvent(jscroll, "onRenderAfter");
	};

	/**
	 * fires given event
	 *
	 * @param jScroll jscroll
	 * @param string name
	 * @param float newValue
	 * @access private
	 * @return mixed
	 */
	var fireEvent = function(jscroll, name, newValue)
	{
		if (!Object.isFunction(jscroll.options[name]))
		{
			return true;
		}

		if (!Object.isUndefined(newValue))
		{
			newValue = correctPercentage(newValue);
			if (jscroll.current == newValue)
			{
				return false;
			}

			var callback = jscroll.options[name].curry(jscroll, jscroll.current, newValue);
		}
		else
		{
			var callback = jscroll.options[name].curry(jscroll);
		}

		try
		{
			return callback();
		}
		catch(e)
		{
			if (Prototype.Browser.Gecko)
			{
				var msg = e.name + " in " + e.fileName + " #" + e.lineNumber + " : " + e.message;
			}
			else if (Prototype.Browser.IE)
			{
				var msg = e.name + " " + e.number + " : " + e.message;
			}
			else if (Prototype.Browser.WebKit)
			{
				var msg = e.name + " in " + e.sourceURL + " #" + e.line + " : " + e.message;
			}
			else
			{
				var msg = Object.toJSON(e);
			}
			$d(msg + " -> function: " + String(jscroll.options[name]));
			return;
		}
	};

	/**
	 * PeriodicalExecuter starten ohne kollision
	 *
	 * @param function fn
	 * @param object scope
	 * @access private
	 */
	var peStart = function(fn, scope)
	{
		peStop(scope);

		fn.bind(scope)();

		scope._pe = new PeriodicalExecuter(fn.bind(scope), 0.05);
	};

	/**
	 * PeriodicalExecuter stopen ohne kollision
	 *
	 * @param object scope
	 * @access private
	 */
	var peStop = function(scope)
	{
		if (scope._pe && scope._pe.stop)
		{
			scope._pe.stop();
		}
	};

	/**
	 * registriert ein Container
	 *
	 * @param jScrolls.* container
	 * @access private
	 * @return jScrolls.*
	 */
	var register = function(container)
	{
		containers.push(container);

		return containers;
	};

	/****************************************************************************************************
	 *																									*
	 *											jScroll													*
	 *																									*
	 ****************************************************************************************************/
	window.jScroll = Class.create(
	{
		/**
		 * aktueller Anzeige % wert
		 */
		current: 0,

		/**
		 * Scroll Container
		 */
		container: null,

 		/**
 		 * das Hauptelement
 		 */
 		element: null,

 		/**
 		 * das Element welches den Content anzeigt
 		 */
 		elementContent: null,

 		/**
 		 * das Element zum Runterscrollen in der Scrollbar
 		 */
 		elementDown: null,

 		/**
 		 * die Scrollbar
 		 */
 		elementScroll: null,

 		/**
 		 * der Slider in der Scrollbar
 		 */
 		elementSlider: null,

 		/**
 		 * das Element zum Raufscrollen in der Scrollbar
 		 */
 		elementUp: null,

 		/**
 		 * Scrolling ist aktiviert oder nicht
 		 */
 		enabled: false,

		/**
		 * übergebene Options
		 */
		options: null,

		/**
		 * Schon gerendert?
		 */
		rendered: false,

		/**
		 * große Schritte
		 */
		stepLarge:	10,

		/**
		 * kleine Schritte
		 */
		stepSmall:	1,

		/**
		 * content ala Prototype einfügen
		 *
		 * @param string|element content
		 * @access public
		 * @return jScroll
		 */
		applyContent: function(content)
		{
			this.elementContent.innerHTML = "";
			Element.insert(this.elementContent, content);

			this.refresh();
			this.update();

			return this;
		},

		/**
		 * scrolls down
		 *
		 * @param int step
		 * @access public
		 * @return jScroll
		 */
		down: function(step)
		{
			if (Object.isUndefined(step))
			{
				step = this.options.scrollSmall;
			}

			/* Event */
			if (fireEvent(this, "onScrollDownBefore", this.current + step) === false)
			{
				return this;
			}

			this.scroll(step);

			/* event */
			fireEvent(this, "onScrollDownAfter");

			return this;
		},

		/**
		 * init
		 *
		 * @param object options
		 * @access public
		 */
		initialize: function(options)
		{
			if (Object.isUndefined(options.container))
			{
				throw("Missing container in options for jScroll!");
			}

			/* container wird sich so gemerkt*/
			this.container = options.container;

			/* options merken*/
			this.options = options;
 			this.options.clsBetween			= this.options.clsBetween			|| "jScroll-element-between";
 			this.options.clsBetweenClicked	= this.options.clsBetweenClicked	|| "clicked";
			this.options.clsDown			= this.options.clsDown				|| "jScroll-element-down";
			this.options.clsScroll			= this.options.clsScroll			|| "jScroll-element-scroll";
			this.options.clsSlider			= this.options.clsSlider			|| "jScroll-element-slider";
			this.options.clsUp				= this.options.clsUp				|| "jScroll-element-up";
			this.options.lines				= this.options.lines				|| 10;

			/* noch nicht geladen dann aufn Stack packen*/
			if (!loaded)
			{
				autoload(createjScroll.curry(this));
			}
			/* sofort*/
			else
			{
				createjScroll(createjScroll);
			}
		},

		/**
		 * content ala Prototype einfügen
		 *
		 * @param object content
		 * @access public
		 * @return jScroll
		 */
		insertContent: function(content)
		{
			Element.insert(this.elementContent, content);

			this.refresh();
			this.update();

			return this;
		},

		/**
		 * aktualisiert die Informationen weil sich eventuell der Content geändert hat
		 *
		 * @access public
		 * @return jScroll
		 */
		refresh: function()
		{
			if (!this.rendered)
			{
				return this;
			}

			/* höhe zurücksetzen für berechnungen */
			this.elementContent.setStyle(
			{
				height:	"auto"
			});

			/* wenn inner content height kleiner container height, dann brauchen wir nix machen*/
			if (jSElement_getContentHeight(this.elementContent) < jSElement_getHeight(this.element))
			{
				this.enabled = false;
				this.container.setStyle(
				{
					overflow:	""
				});
				this.elementScroll.hide();
				this.elementContent.setStyle(
				{
					marginTop:	"0px",
					right:		""
				});

				return this;
			}

			this.enabled = true;

			this.elementScroll.show();
			this.container.setStyle(
			{
				overflow:	"hidden"
			});

			/* maximale höhe des sliders */
			this.sliderTop			= jSElement_getHeight(this.elementUp) - jSElement_getFrameWidth(this.elementUp, "tb");
			this.sliderHeight		= jSElement_getHeight(this.elementScroll) - jSElement_getHeight(this.elementUp) - jSElement_getFrameWidth(this.elementUp, "tb") - jSElement_getHeight(this.elementDown) - jSElement_getFrameWidth(this.elementDown, "tb");
			/* sichtbare höhe des Content */
			var contentViewHeight	= jSElement_getHeight(this.element);
			var contentRealHeight	= jSElement_getHeight(this.elementContent);
			this.contentHeight		= contentRealHeight - contentViewHeight;

			/* Steps berechnen */
			this.stepSmall = contentViewHeight * 100 / (this.options.lines * contentRealHeight);
			this.stepLarge = this.stepSmall * this.options.lines;

			/* conten korrektur in Bezug auf den Scroller*/
			this.elementContent.setStyle(
			{
				marginTop:	"0px",
				right:		jSElement_getWidth(this.elementScroll) + "px"
			});

			/* slider anpassen über die prozente*/
			var height = (this.sliderHeight * contentViewHeight / contentRealHeight);
			/* beachten der höhe der inneren Elemente */
			if (height < jSElement_getHeight(this.elementSliderTop) + jSElement_getHeight(this.elementSliderBottom))
			{
				height = jSElement_getHeight(this.elementSliderTop) + jSElement_getHeight(this.elementSliderBottom);
			}
			this.elementSlider.setStyle(
			{
				height:	height + "px",
				top:	this.sliderTop + "px"
			});

			/* innerhalb des Sliders die element anpassen */
			this.elementSliderCenter.setStyle(
			{
				height:	(height - jSElement_getHeight(this.elementSliderTop) - jSElement_getHeight(this.elementSliderBottom)) + "px"
			});

			/* höhe setzen damit wir marginTop verwenden können */
			this.elementContent.setStyle(
			{
				height:	"100%"
			});

			this.elementUpBetween.setStyle(
			{
				top:	this.sliderTop + "px",
				height:	"0px"
			});
			this.elementDownBetween.setStyle(
			{
				top: 	(this.sliderTop + this.sliderHeight * this.current / 100 + jSElement_getHeight(this.elementSlider)) + "px",
				bottom:	jSElement_getHeight(this.elementDown) + "px"
			});

			/* sliderHeight noch mal anpassen*/
			this.sliderHeight -= height;

			return this;
		},

		/**
		 * scrollt
		 *
		 * @param int step
		 * @access public
		 * @return jScroll
		 */
		scroll: function(step)
		{
			/* nothing to do*/
			if (Object.isUndefined(step) || step == 0 || (step < 0 && this.current <= 0) || (step > 0 && this.current >= 100))
			{
				return this;
			}

			/* Event */
			if (fireEvent(this, "onScrollBefore", this.current + step) === false)
			{
				return this;
			}

			/* neuer wert*/
			this.current += step;

			/* aktualisieren*/
			this.update();

			/* Event */
			fireEvent(this, "onScrollAfter");

			return this;
		},

		/**
		 * zu einem bestimmten element scrollen
		 *
		 * @param element|string element
		 * @access public
		 * @return jScroll
		 */
		scrollTo: function(element)
		{
			element = $(element);

			/* element nicht gefunden oder element gehört nicht zu diesem jScroll */
			if (!element || !element.ancestors().find(function(element)
			{
				return element == this.elementContent;
			}, this))
			{
				return this;
			}

			var percent = (jSElement_getY(element) - jSElement_getY(this.elementContent) - this.sliderHeight / 2) * 100 / this.contentHeight;

			/* Event */
			if (fireEvent(this, "onScrollBefore", percent) === false)
			{
				return this;
			}

			this.update(percent);

			/* Event */
			fireEvent(this, "onScrollAfter");

			return this;
		},

		/**
		 * scrolls up
		 *
		 * @param int step optional default
		 * @access public
		 * @return jScroll
		 */
		up: function(step)
		{
			if (Object.isUndefined(step))
			{
				step = this.options.scrollSmall;
			}

			/* Event */
			if (fireEvent(this, "onScrollUpBefore", this.current - step) === false)
			{
				return this;
			}

			this.scroll(-1 * step);

			/* Event */
			fireEvent(this, "onScrollUpAfter");

			return this;
		},

		/**
		 * ansicht aktualisieren
		 *
		 * @param int percent
		 * @access public
		 * @return jScroll
		 */
		update: function(percent)
		{
			/* nicht gerendert*/
			if (!this.rendered || !this.enabled)
			{
				return this;
			}

			if (!Object.isUndefined(percent))
			{
				this.current = percent;
			}

			/* korrektur*/
			this.current = correctPercentage(this.current);

			/* Event */
			fireEvent(this, "onUpdateBefore");

			/* slider anpassen*/
			this.elementSlider.setStyle(
			{
				top: (this.sliderTop + this.sliderHeight * this.current / 100) + "px"
			});

			/* content anpassen*/
			this.elementContent.setStyle(
			{
				marginTop: (-1 * this.contentHeight * this.current / 100) + "px"
			});

			this.elementUpBetween.setStyle(
			{
				height:	(this.sliderTop + this.sliderHeight * this.current / 100 - jSElement_getHeight(this.elementUp)) + "px"
			});

			this.elementDownBetween.setStyle(
			{
				top: (this.sliderTop + this.sliderHeight * this.current / 100 + jSElement_getHeight(this.elementSlider)) + "px"
			});

			/* Event */
			fireEvent(this, "onUpdateAfter");

			return this;
		}
	});

	/**
	 * liefert das jScrolls zu einem DOM
	 *
	 * @param string|node element
	 * @access public
	 * @return jScrolls.*
	 */
	jScroll.$ = function(element)
	{
		var container = $(element);

		if (!container && Object.isString(element))
		{
			container = containers.find(function(c)
			{
				return c.id == element;
			});
		}
		else if (container && !Object.isUndefined(container._jScroll))
		{
			container = container._jScroll;
		}
		else if (container && Object.isUndefined(container._jScroll))
		{
			container = null;
		}

		return (container ? container : null);
	};


	/****************************************************************************************************
	 *																									*
	 *									Prototype extend												*
	 *																									*
	 ****************************************************************************************************/
	var isStrict = document.compatMode == "CSS1Compat";

	var jSElement_addStyles = function(element, sides, styles)
	{
		var val = 0, v, w;
		element = $(element);
		for (var i = 0, len = sides.length; i < len; i++)
		{
			v = element.getStyle(styles[sides.charAt(i)]);
			if (v)
			{
				 w = parseInt(v, 10);
				 if (w)
				 {
				 	val += (w >= 0 ? w : -1 * w);
				 }
			}
		}
		return val;
	};

	var jSElement_getBorderWidth = function(element, side)
	{
		element = $(element);
		return jSElement_addStyles(element, side,
		{
			l: "border-left-width",
			r: "border-right-width",
			t: "border-top-width",
			b: "border-bottom-width"
		});
	};

	var jSElement_getContentHeight = function(element)
	{
		var prev = null;
		element = $(element);

		return $A(element.cleanWhitespace().childNodes).inject(0, function(value, child, index)
		{
			if (child.nodeType != 1)
			{
				if (index == 0) prev = child;
				return value; /* nur element nodes*/
			}

			child = $(child);

			if (prev)
			{
				value += child.offsetTop - element.offsetTop;
				prev = null;
			}

			return value + jSElement_getHeight(child) + jSElement_getMargins(child, "tb");
		});
	};

	var jSElement_getFrameWidth = function(element, sides, onlyContentBox)
	{
		element = $(element);
		return onlyContentBox && Prototype.Browser.IE && !isStrict ? 0 : (jSElement_getPadding(element, sides) + jSElement_getBorderWidth(element, sides));
	};

	var jSElement_getHeight = function(element, contentHeight)
	{
		element = $(element);
		var h = element.offsetHeight || 0;
		h = contentHeight !== true ? h : h - jSElement_getBorderWidth(element, "tb") - jSElement_getPadding(element, "tb");

		return h < 0 ? 0 : h;
	};

	var jSElement_getMargins = function(element, side)
	{
		element = $(element);
		if (!side)
		{
			return {
				top:	parseInt(element.getStyle("margin-top"), 10) || 0,
				left:	parseInt(element.getStyle("margin-left"), 10) || 0,
				bottom:	parseInt(element.getStyle("margin-bottom"), 10) || 0,
				right:	parseInt(element.getStyle("margin-right"), 10) || 0
			};
		}
		else
		{
			return jSElement_addStyles(element, side,
			{
				l: "margin-left",
				r: "margin-right",
				t: "margin-top",
				b: "margin-bottom"
			});
		}
	};

	var jSElement_getPadding = function(element, side)
	{
		element = $(element);
		return jSElement_addStyles(element, side,
		{
			l: "padding-left",
			r: "padding-right",
			t: "padding-top",
			b: "padding-bottom"
		});
	};

	var jSElement_getScroll = function(element)
	{
		element = $(element);
		var d = element, doc = document;
		if (d == doc || d == doc.body)
		{
			var l, t;
			if (Prototype.Browser.IE && isStrict)
			{
				l = doc.documentElement.scrollLeft || (doc.body.scrollLeft || 0);
				t = doc.documentElement.scrollTop || (doc.body.scrollTop || 0);
			}
			else
			{
				l = window.pageXOffset || (doc.body.scrollLeft || 0);
				t = window.pageYOffset || (doc.body.scrollTop || 0);
			}
			return {left: l, top: t};
		}
		else
		{
			return {left: d.scrollLeft, top: d.scrollTop};
		}
	};

	var jSElement_getWidth = function(element, contentWidth)
	{
		element = $(element);
		var w = element.offsetWidth || 0;
		w = contentWidth !== true ? w : w - jSElement_getBorderWidth(element, "lr") - jSElement_getPadding(element, "lr");

		return w < 0 ? 0 : w;
	};

	var jSElement_getY = function(element)
	{
		element = $(element);
		var F,K,M,N,J = (document.body || document.documentElement);

		if (element == J)
		{
			return 0;
		}

		if (element.getBoundingClientRect)
		{
			M = element.getBoundingClientRect();
			N = jSElement_getScroll($(document.body));
			return M.top + N.top;
		}

		var O = 0, L = 0; F = element;
		var E = element.getStyle("position") == "absolute";

		while (F)
		{
			$(F);
			O += F.offsetLeft;
			L += F.offsetTop;
			if (!E && F.getStyle("position") == "absolute")
			{
				E = true;
			}
			if (Prototype.Browser.Gecko)
			{
				K = F;
				var P = parseInt(K.getStyle("borderTopWidth"), 10) || 0;
				var H = parseInt(K.getStyle("borderLeftWidth"), 10) || 0;
				O += H;
				L += P;
				if ( F != element && K.getStyle("overflow") != "visible")
				{
					O += H;
					L += P;
				}
			}
			F = F.offsetParent;
		}

		if (Prototype.Browser.WebKit && E)
		{
			O -= J.offsetLeft;
			L -= J.offsetTop;
		}
		if (Prototype.Browser.Gecko && !E)
		{
			var I = $(J);
			O += parseInt(I.getStyle("borderLeftWidth"), 10) || 0;
			L += parseInt(I.getStyle("borderTopWidth"), 10) || 0;
		}
		F = element.parentNode;

		while (F && F != J)
		{
			if (!Prototype.Browser.Opera || (F.tagName != "TR" && $(F).getStyle("display") != "inline"))
			{
				O -= F.scrollLeft;
				L -= F.scrollTop;
			}
			F = F.parentNode;
		}

		return L;
	};

	/* info durchschleifen, wenn DOM geladen ist*/
	autoload(Prototype.emptyFunction);

	/* CSS Rules einbauen */
	createCSSDeclaration(
		'.jScroll {overflow: hidden; width: 100%; height: 100%;position:relative;}' +
		'.jScroll .jScroll-content {position: absolute; top: 0px; left: 0px;}' +
		'.jScroll .jScroll-scroll {cursor:pointer; position: absolute; height: 100%; right: 0px; top: 0px;}' +

		'.jScroll .jScroll-scroll-up, .jScroll .jScroll-scroll-slider, .jScroll .jScroll-scroll-down, .jScroll .jScroll-scroll-between {position: absolute; width: 100%;}' +
		'.jScroll .jScroll-scroll-slider {top: 10px; height: 50px;}' +
		'.jScroll .jScroll-scroll-slider .top, .jScroll .jScroll-scroll-slider .center, .jScroll .jScroll-scroll-slider .bottom {width: 100%;}' +
		'.jScroll .jScroll-scroll-between {}' +
		'.jScroll .jScroll-scroll-down {bottom: 0px;}' +

		/** Scroller ---- Styleable **/
		'.jScroll .jScroll-element-scroll {width: 15px;}' +

		/** Pfeil nach unten ---- Styleable **/
		'.jScroll .jScroll-element-down {background: transparent url(' + jsPath + 'images/down.gif) no-repeat center bottom; height: 6px;}' +
		'.jScroll .jScroll-element-down:hover {background-image: url(' + jsPath + 'images/down-hover.gif);}' +

		/** Pfeil nach oben ---- Styleable **/
		'.jScroll .jScroll-element-up {background: transparent url(' + jsPath + 'images/up.gif) no-repeat center top; height: 6px;}' +
		'.jScroll .jScroll-element-up:hover {background-image: url(' + jsPath + 'images/up-hover.gif);}' +

		/** teile zw den Slider und Buttons **/
		'.jScroll .jScroll-element-between {margin-left: 4px; width: 7px; opacity: 0; filter: alpha(opacity=0); background-color: #000000;}' +
		'.jScroll .jScroll-element-between:hover {opacity: 0.25; filter: alpha(opacity=25);}' +
		'.jScroll .jScroll-element-between.clicked {opacity: 0.5;filter: alpha(opacity=50);}' +

		/** Scrollbalken ---- Styleable **/
		'.jScroll .jScroll-element-slider .top {background: transparent url(' + jsPath + 'images/slider-top.gif) no-repeat center top; height: 1px;}' +
		'.jScroll .jScroll-element-slider:hover .top {background-image: url(' + jsPath + 'images/slider-top-hover.gif);}' +
		'.jScroll .jScroll-element-slider .center {background: transparent url(' + jsPath + 'images/slider-center.gif) repeat-y center top;}' +
		'.jScroll .jScroll-element-slider:hover .center {background-image: url(' + jsPath + 'images/slider-center-hover.gif);}' +
		'.jScroll .jScroll-element-slider .bottom {background: transparent url(' + jsPath + 'images/slider-bottom.gif) no-repeat center bottom; height: 1px;}' +
		'.jScroll .jScroll-element-slider:hover .bottom {background-image: url(' + jsPath + 'images/slider-bottom-hover.gif);}'
	);
})();