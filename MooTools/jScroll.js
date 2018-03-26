/****************************************************************************************************
 *																									*
 *											jScroll													*
 *																									*
 ****************************************************************************************************
 *	jScroll
 *	Copyright (C) 2009 Marco Starker <marco.starker@gmx.net>
 *
 *	This program is free software; you can redistribute it and/or modify it under the terms of the
 *	GNU General Public License as published by the Free Software Foundation; either version 3 of the
 *	License, or (at your option) any later version.
 *
 *	This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 *	even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *	GNU General Public License for more details.
 *
 *	You should have received a copy of the GNU General Public License along with this program;
 *	if not, see <http://www.gnu.org/licenses/>.
 *
 * @version 1.1
 *
 *
 * global jScroll Funktion
 *	name									return		description
 *	==========================================================================================================================
 *	jScroll.$( (element|string)element )	jScroll		liefert ein jScroll in Bezug auf der DOM Node ID
 *
 * jScroll Object options
 *	name					optional	datatype		default							description
 *	==========================================================================================================================
 *	clsBetween				optional	string			jScroll-element-between			CSS Class für die Teile zwichen den Buttons und den Slider
 *	clsBetweenClicked		optional	string			clicked							CSS Class für die Teile zwichen den Buttons und den Slider wenn geklickt (die Class wird geadded und keine entfernt)
 *	clsDown					optional	string			jScroll-element-down			CSS Class für das "Nach unten"-Element (Höhe, Hintergrund, Hover)
 *	clsScroll				optional	string			jScroll-element-scroll			CSS Class für das gesammte "Scroll"-Element (Breite, Hintergrund)
 *	clsSlider				optional	string			jScroll-element-slider			CSS Class für das "Schieber"-Element (Hover, Height und Hintergrund für Subclasses .top, .center, .bottom)
 *	clsUp					optional	string			jScroll-element-up				CSS Class für das "Nach oben"-Element (Höhe, Hintergrund, Hover)
 *	container							string|element									Der DOM Node, in welchem gescrollt werden soll
 *	lines					optional	int				10								Anzahl der sichtbaren Zeilen
 *
 * jScroll Object Listeners in options (alle sind optional)
 *	name													description
 *	==========================================================================================================================
 *	onRenderAfter(jScroll)									nach dem rendering
 *	onRenderBefore(jScroll)									vor dem rendering, wenn die Funktion BOOLEAN FALSE ausgibt wird abgebrochen
 *	onScrollAfter(jScroll)									für nach dem Scrollen
 *	onScrollBefore(jScroll, oldPercent, newPercent)			für vor dem Scrollen, wenn die Funktion BOOLEAN FALSE ausgibt wird abgebrochen
 *	onScrollDownAfter(jScroll)								für nach dem "Nach unten" Scrollen
 *	onScrollDownBefore(jScroll, oldPercent, newPercent)		für vor dem "Nach unten" Scrollen, wenn die Funktion BOOLEAN FALSE ausgibt wird abgebrochen
 *	onScrollSlideAfter(jScroll)								für nach dem "Schiebe" Scrollen
 *	onScrollSlideBefore(jScroll, oldPercent, newPercent)	für vor dem "Schiebe" Scrollen, wenn die Funktion BOOLEAN FALSE ausgibt wird abgebrochen
 *	onScrollUpAfter(jScroll)								für nach dem "Nach oben" Scrollen
 *	onScrollUpBefore(jScroll, oldPercent, newPercent)		für vor dem "Nach oben" Scrollen, wenn die Funktion BOOLEAN FALSE ausgibt wird abgebrochen
 *	onUpdateAfter(jScroll)									für nach dem Aktualisieren eines Scrolls
 *	onUpdateBefore(jScroll)									für vor dem Aktualisieren eines Scrolls
 *
 * jScroll Object Properties
 *	name				datatype		description
 *	==========================================================================================================================
 *	current				float			aktueller % Wert
 *	container			element			DOM Node welcher der Container für das Scrolling ist
 *	element				element			das Hauptelement
 *	elementDownBetween	element			element zwischen dem Button für "nach unten" und dem Slider
 *	elementUpBetween	element			element zwischen dem Button für "nach oben" und dem Slider
 *	elementContent		element			das Element welches den Content anzeigt
 *	elementDown			element			das Element zum Runterscrollen in der Scrollbar
 *	elementScroll		element			die Scrollbar
 *	elementSliderBottom	element			Scrollbar unterer Teil
 *	elementSliderCenter	element			Scrollbar mittlerer Teil
 *	elementSliderTop	element			Scrollbar oberer Teil
 *	elementSlider		element			der Slider in der Scrollbar
 *	elementUp			element			das Element zum Raufscrollen in der Scrollbar
 *	enabled				bool			Scrolling ist aktiviert oder nicht
 *	options				object			alle übergebenen Options
 *	rendered			bool			Control wurde schon gerendert
 *	stepLarge			float			Schrittweit beim "großen" scrollen
 *	stepSmall			float			Schrittweit beim "normalen" scrollen
 *
 * jScroll Object Methodes
 *	name									return		description
 *	==========================================================================================================================
 *	applyContent( (string|element)content )	jScroll		den Inhalt des Containers mit diesen Inhalt ersetzen
 *	down( [(float)step] )					jScroll		um x% nach unten Scrollen
 *	insertContent( (object)content )		jScroll		diesen Inhalt einfügen in den Content (siehe Prototype Element.insert())
 *	refresh()								jScroll		alles aktualisieren (zB wenn manuell Content eingefügt wurde)
 *	scroll( (float)step )					jScroll		um x% nach in die jeweilige Richtung scrollen
 *	scrollTo( (string|element)element )		jScroll		scrollt zu dem angegebenen element, so das dieses sichtbar ist
 *	up( (float)step )						jScroll		um x% nach oben scrollen
 *	update( [(float)percent])				jScroll		zur Position in % springen
 *
 * <code>
 *		new jScroll(
 *	    {
 *	    	container:				"container",
 *			onScrollAfter:			function(jscroll)
 *			{
 *				alert("scroll after");
 *			},
 *			onScrollBefore:			function(jscroll, oldPercent, newPercent)
 *			{
 *				alert("scroll before");
 *			},
 *			onScrollDownAfter:		function(jscroll)
 *			{
 *				alert("scroll down after");
 *			},
 *			onScrollDownBefore:		function(jscroll, oldPercent, newPercent)
 *			{
 *				alert("scroll down before");
 *			},
 *			onScrollSlideAfter:		function(jscroll)
 *			{
 *				alert("scroll slide after");
 *			},
 *			onScrollSlideBefore:	function(jscroll, oldPercent, newPercent)
 *			{
 *				alert("scroll slide before");
 *			},
 *			onScrollUpAfter:		function(jscroll)
 *			{
 *				alert("scroll up after");
 *			},
 *			onScrollUpBefore:		function(jscroll, oldPercent, newPercent)
 *			{
 *				alert("scroll up before");
 *			}
 *	    });
 * </code>
 */
(function()
{
	var REQUIRED_MOOTOOLS			= '1.2.4';	/* erwartete Mootools Version */
	var loaded						= false;	/* gibt an ob das Fenster geladen ist oder nicht */
	var containers					= $A([]);	/* Liste aller jScrolls */

	/**
	 * konvertiert versions-nummern-string
	 *
	 * @param string versionString
	 * @retrun array
	 */
	var convertVersionString = function(versionString)
	{
		var r = versionString.split('.');
		return parseInt(r[0]) * 100000 + parseInt(r[1]) * 1000 + parseInt(r[2]);
	};

	/* Prüfen nach Prototype und korrekter Version */
	if ( typeof MooTools		== 'undefined' ||
		 convertVersionString(MooTools.version) < convertVersionString(REQUIRED_MOOTOOLS)
		)
	{
		throw('jScroll requires the MooTools JavaScript framework >= ' + REQUIRED_MOOTOOLS);
		return;
	}

	/* unseren Pfad finden */
	var js = /jScroll\.js(\?.*)?$/;
	var jsPath = $$('head script[src]').find(function(s)
	{
		return s.src.match(js);
	});
	jsPath = jsPath.src.replace(js, '');

	/****************************************************************************************************
	 *																									*
	 *									allgemeine Funktionen											*
	 *																									*
	 ****************************************************************************************************/

	/**
	 * etwas nach dem Dom load laden bzw ausführen
	 *
	 * @param function fn
	 */
	var autoload = function(fn)
	{
		if (!loaded)
		{
			window.addEvent('domready', function()
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
	 */
	var createCSSDeclaration = function(declaration)
	{
		/**
		 * Trims a string
		 *
		 * @param string str
		 * @return string
		 */
		var trim = function()
		{
		    var re = /^[\s\n\r]+|[\s\n\r]+$/g;
		    return function(str)
		    {
		    	return str.replace(re, '');
		    };
		}();

		/**
		 * CSS Rule einfügen
		 *
		 * @param string selector
		 * @param string|object declaration
		 */
		var createCSSRule = function(selector, declaration)
		{
			if (selector.indexOf(',') != -1)
			{
				selector.split(',').each(function(sel)
				{
					createCSSRule(trim(sel), declaration);
				});
				return;
			}

		    /* create the style node for all browsers */
		    var style_node = $('jScroll.css');
		    if (!style_node)
		    {
			    var style_node = document.createElement('style');
			    style_node.setAttribute('type', 'text/css');
			    style_node.setAttribute('media', 'screen');
			    style_node.setAttribute('id', 'jScroll.css');
			    /* append the style node */
			    Element.insert(document.getElementsByTagName('head')[0], {top: style_node});
		    }

		    if (typeof declaration != 'string')
		    {
		    	var decl = '';
		    	$each(declaration, function(entry, key)
		    	{
		    		decl + key.hyphenate() + ':' + entry, key;
		    	});
		    	declaration = decl;
		    }

		    /* append a rule for good browsers */
		    if (!Browser.Engine.trident)
		    {
		    	style_node.appendChild(document.createTextNode(selector + ' {' + declaration + '}' + "\n"));
		    }

		    /* use alternative methods for IE */
		    if (Browser.Engine.trident && document.styleSheets && document.styleSheets.length > 0)
		    {
				var last_style_node = document.styleSheets[0];
				if (typeof(last_style_node.addRule) == 'object')
				{
					last_style_node.addRule(selector, declaration);
				}
		    }
		};

		declaration.replace(/[\n\r]/gi , '').split('}').each(function(decl)
		{
			decl = decl.split('{');
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
	 */
	var createjScroll = function(jscroll)
	{
		jscroll.container = $(jscroll.container);

		/* kein Container?*/
		if ($type(jscroll.container) != 'element')
		{
			throw('Missing scroll container for jScroll!');
		}

		/* anmelden*/
		jscroll.container._jScroll = jscroll;
		register(jscroll.container);

		/* rendering*/
		/* Event */
		if (fireEvent(jscroll, 'onRenderBefore') === false)
		{
			return;
		}

		/* schon gerendert oder container kein element*/
		if (jscroll.rendered || $type(jscroll.container) != 'element')
		{
			return;
		}

		/* rendering marking*/
		jscroll.rendered = true;

		jscroll.container.setStyles(
		{
			overflow:	'hidden'
		});

		/* Childs merken*/
		//var childs = jscroll.container.getChildren().inject('dispose');
		var childs = jscroll.container.getChildren();
		childs.each(function(child)
		{
			child.dispose();
		});

		/* neuer kontent*/
		jscroll.container.innerHTML = '';
		Element.insert(jscroll.container,
		{
			bottom:	'<div class="jScroll">' +
						'<div class="jScroll-content">' +
						'</div>' +
						'<div class="jScroll-scroll ' + jscroll.options.clsScroll + '">' +
							'<div class="jScroll-scroll-up">' +
								'<div class="' + jscroll.options.clsUp + '"></div>' +
							'</div>' +
							'<div class="jScroll-scroll-between ' + jscroll.options.clsBetween + '"></div>' +
							'<div class="jScroll-scroll-slider ' + jscroll.options.clsSlider + '">' +
								'<div class="' + jscroll.options.clsSlider + ' top"></div>' +
								'<div class="' + jscroll.options.clsSlider + ' center"></div>' +
								'<div class="' + jscroll.options.clsSlider + ' bottom"></div>' +
							'</div>' +
							'<div class="jScroll-scroll-between ' + jscroll.options.clsBetween + '"></div>' +
							'<div class="jScroll-scroll-down">' +
								'<div class="' + jscroll.options.clsDown + '"></div>' +
							'</div>' +
						'</div>' +
					'</div>'
		});

		/* diverse elemente merken*/
		jscroll.element				= jscroll.container.down('.jScroll');
		jscroll.elementContent		= jscroll.container.down('.jScroll-content');
		jscroll.elementScroll		= jscroll.container.down('.jScroll-scroll');
		jscroll.elementUp			= jscroll.container.down('.jScroll-scroll-up');
		jscroll.elementUpBetween	= jscroll.container.down('.jScroll-scroll-between', 0);
		jscroll.elementSlider		= jscroll.container.down('.jScroll-scroll-slider');
		jscroll.elementSliderTop	= jscroll.elementSlider.down('.top');
		jscroll.elementSliderCenter	= jscroll.elementSlider.down('.center');
		jscroll.elementSliderBottom	= jscroll.elementSlider.down('.bottom');
		jscroll.elementDownBetween	= jscroll.container.down('.jScroll-scroll-between', 1);
		jscroll.elementDown			= jscroll.container.down('.jScroll-scroll-down');

		/* childs neu einfügen*/
		childs.each(function(element)
		{
			Element.insert(jscroll.elementContent, {bottom: element});
		});

		var pointerY = 0;
		/* wenn innerhalb des Scroller geklickt nicht auf eine der Subelement */
		jscroll.elementScroll.addEvent('mousedown', function(e)
		{
			jscroll._sliderScroll = true;
			e.stop();

			peStart(function()
			{
				if (jSElement_getY(jscroll.elementSlider) <= pointerY && pointerY <= jSElement_getY(jscroll.elementSlider) + jscroll.elementSlider.getSize().y)
				{
					return;
				}

				var direction = pointerY - jSElement_getY(jscroll.elementSlider);

				if (direction < 0)
				{
					jscroll.elementUpBetween.addClass(jscroll.options.clsBetweenClicked);
					jscroll.elementDownBetween.removeClass(jscroll.options.clsBetweenClicked);
				}
				else
				{
					jscroll.elementUpBetween.removeClass(jscroll.options.clsBetweenClicked);
					jscroll.elementDownBetween.addClass(jscroll.options.clsBetweenClicked);
				}

				jscroll.scroll((direction < 0 ? -1 : 1) * jscroll.stepLarge);
			}, jscroll);
		});

		/* wenn auf nach oben geklickt wird*/
		jscroll.elementUp.addEvent('mousedown', function(e)
		{
			jscroll._sliderScroll = true;
			e.stop();
			peStart(jscroll.up.pass([jscroll.stepSmall, jscroll], jscroll), jscroll);
		});

		/* wenn auf nach unten geklickt wird*/
		jscroll.elementDown.addEvent('mousedown', function(e)
		{
			jscroll._sliderScroll = true;
			e.stop();
			peStart(jscroll.down.pass([jscroll.stepSmall], jscroll), jscroll);
		});

		/* wenn auf den slider geklickt wird*/
		jscroll.elementSlider.addEvent('mousedown', function(e)
		{
			e.stop();
			jscroll._sliderMove	= true;
			jscroll._sliderY	= e.page.y - parseFloat(jscroll.elementSlider.getStyle('top')) + jscroll.elementUp.getSize().y;
		});

		/* fürs slider moveing*/
		document.addEvent('mousemove', function(e)
		{
			pointerY = e.page.y;
			if (!jscroll._sliderMove)
			{
				return;
			}

			e.stop();

			var percent = (e.page.y - jscroll._sliderY) * 100 / jscroll.sliderHeight;

			/* Event */
			if (fireEvent(jscroll, 'onScrollSlideBefore', percent) === false)
			{
				return;
			}

			jscroll.update(percent);

			/* Event */
			fireEvent(jscroll, 'onScrollSlideAfter');
		});

		/* beenden der events wenn Mous up geht */
		document.addEvent('mouseup', function(e)
		{
			if (jscroll._sliderMove || jscroll._sliderScroll)
			{
				e.stop();
				jscroll._sliderMove		= false;
				jscroll._sliderScroll	= false;
				peStop(jscroll);
				jscroll.elementUpBetween.removeClass(jscroll.options.clsBetweenClicked);
				jscroll.elementDownBetween.removeClass(jscroll.options.clsBetweenClicked);
				jscroll.elementDownBetween.removeClass(jscroll.options.clsBetweenClicked);
			}
		});

		/* Mouse Wheeling*/
		jscroll.element.addEvent('mousewheel', function(e)
		{
			e.stop();

			jscroll.scroll((e.wheel < 0 ? 1 : -1) * (e.alt ? jscroll.stepSmall : jscroll.stepLarge));
		});

		/* infos aktualisieren */
		jscroll.refresh();

		/* Event */
		fireEvent(jscroll, 'onRenderAfter');
	};

	/**
	 * fires given event
	 *
	 * @param jScroll jscroll
	 * @param string name
	 * @param float newValue
	 * @return mixed
	 */
	var fireEvent = function(jscroll, name, newValue)
	{
		if ($type(jscroll.options[name]) != 'function')
		{
			return true;
		}

		if (typeof newValue != 'undefined')
		{
			newValue = correctPercentage(newValue);
			if (jscroll.current == newValue)
			{
				return false;
			}

			var callback = jscroll.options[name].pass([jscroll, jscroll.current, newValue]);
		}
		else
		{
			var callback = jscroll.options[name].pass([jscroll]);
		}

		try
		{
			return callback();
		}
		catch(e)
		{
			if (Browser.Engine.gecko)
			{
				var msg = e.name + ' in ' + e.fileName + ' #' + e.lineNumber + ' : ' + e.message;
			}
			else if (Browser.Engine.trindent)
			{
				var msg = e.name + ' ' + e.number + ' : ' + e.message;
			}
			else if (Browser.Engine.webkit)
			{
				var msg = e.name + ' in ' + e.sourceURL + ' #' + e.line + ' : ' + e.message;
			}
			else
			{
				var msg = JSON.encode(e);
			}
			Travian.$d(msg + ' -> function: ' + String(jscroll.options[name]));
			return;
		}
	};

	/**
	 * PeriodicalExecuter starten ohne kollision
	 *
	 * @param function fn
	 * @param object scope
	 */
	var peStart = function(fn, scope)
	{
		peStop(scope);

		fn.bind(scope)();

		scope._pe = fn.periodical(50, scope);
	};

	/**
	 * PeriodicalExecuter stopen ohne kollision
	 *
	 * @param object scope
	 */
	var peStop = function(scope)
	{
		if (scope._pe)
		{
			$clear(scope._pe);
		}
	};

	/**
	 * registriert ein Container
	 *
	 * @param jScrolls.* container
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
	window.jScroll = new Class(
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
		 * content einfügen
		 *
		 * @param string|element content
		 * @return jScroll
		 */
		applyContent: function(content)
		{
			this.elementContent.innerHTML = '';
			Element.insert(this.elementContent, content);

			this.refresh();
			this.update();

			return this;
		},

		/**
		 * scrolls down
		 *
		 * @param int step
		 * @return jScroll
		 */
		down: function(step)
		{
			if (typeof step == 'undefined')
			{
				step = this.options.scrollSmall;
			}

			/* Event */
			if (fireEvent(this, 'onScrollDownBefore', this.current + step) === false)
			{
				return this;
			}

			this.scroll(step);

			/* event */
			fireEvent(this, 'onScrollDownAfter');

			return this;
		},

		/**
		 * init
		 *
		 * @param object options
		 */
		initialize: function(options)
		{
			if (typeof options.container == 'undefined')
			{
				throw('Missing container in options for jScroll!');
			}

			/* container wird sich so gemerkt*/
			this.container = options.container;

			/* options merken*/
			this.options = options;
 			this.options.clsBetween			= this.options.clsBetween			|| 'jScroll-element-between';
 			this.options.clsBetweenClicked	= this.options.clsBetweenClicked	|| 'clicked';
			this.options.clsDown			= this.options.clsDown				|| 'jScroll-element-down';
			this.options.clsScroll			= this.options.clsScroll			|| 'jScroll-element-scroll';
			this.options.clsSlider			= this.options.clsSlider			|| 'jScroll-element-slider';
			this.options.clsUp				= this.options.clsUp				|| 'jScroll-element-up';
			this.options.lines				= this.options.lines				|| 10;

			/* noch nicht geladen dann aufn Stack packen*/
			if (!loaded)
			{
				autoload(createjScroll.pass([this]));
			}
			/* sofort*/
			else
			{
				createjScroll(this);
			}
		},

		/**
		 * content ala Prototype einfügen
		 *
		 * @param object content
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
		 * @return jScroll
		 */
		refresh: function()
		{
			if (!this.rendered)
			{
				return this;
			}

			/* höhe zurücksetzen für berechnungen */
			this.elementContent.setStyles(
			{
				height:	'auto'
			});

			/* wenn inner content height kleiner container height, dann brauchen wir nix machen*/
			if (this.elementContent.getSize().y < this.element.getSize().y)
			{
				this.enabled = false;
				this.container.setStyles(
				{
					overflow:	''
				});
				this.elementScroll.hide();
				this.elementContent.setStyles(
				{
					marginTop:	0,
					right:		''
				});

				return this;
			}

			this.enabled = true;

			this.elementScroll.show();
			this.container.setStyles(
			{
				overflow:	'hidden'
			});

			/* maximale höhe des sliders */
			this.sliderTop			= this.elementUp.getSize().y - jSElement_getFrameWidth(this.elementUp, 'tb');
			this.sliderHeight		= this.elementScroll.getSize().y - this.elementUp.getSize().y - jSElement_getFrameWidth(this.elementUp, 'tb') - this.elementDown.getSize().y - jSElement_getFrameWidth(this.elementDown, 'tb');
			/* sichtbare höhe des Content */
			var contentViewHeight	= this.element.getSize().y;
			var contentRealHeight	= this.elementContent.getSize().y;
			this.contentHeight		= contentRealHeight - contentViewHeight;

			/* Steps berechnen */
			this.stepSmall = contentViewHeight * 100 / (this.options.lines * contentRealHeight);
			this.stepLarge = this.stepSmall * this.options.lines;

			/* conten korrektur in Bezug auf den Scroller*/
			this.elementContent.setStyles(
			{
				marginTop:	0,
				right:		this.elementScroll.getSize().x + 'px'
			});

			/* slider anpassen über die prozente*/
			var height = (this.sliderHeight * contentViewHeight / contentRealHeight);
			/* beachten der höhe der inneren Elemente */
			if (height < this.elementSliderTop.getSize().y + this.elementSliderBottom.getSize().y)
			{
				height = this.elementSliderTop.getSize().y + this.elementSliderBottom.getSize().y;
			}
			this.elementSlider.setStyles(
			{
				height:	height,
				top:	this.sliderTop
			});

			/* innerhalb des Sliders die element anpassen */
			this.elementSliderCenter.setStyles(
			{
				height:	(height - this.elementSliderTop.getSize().y - this.elementSliderBottom.getSize().y)
			});

			/* höhe setzen damit wir marginTop verwenden können */
			this.elementContent.setStyles(
			{
				height:	'100%'
			});

			this.elementUpBetween.setStyles(
			{
				top:	this.sliderTop,
				height:	0
			});
			this.elementDownBetween.setStyles(
			{
				top: 	(this.sliderTop + this.sliderHeight * this.current / 100 + this.elementSlider.getSize().y),
				bottom:	this.elementDown.getSize().y
			});

			/* sliderHeight noch mal anpassen*/
			this.sliderHeight -= height;

			return this;
		},

		/**
		 * scrollt
		 *
		 * @param int step
		 * @return jScroll
		 */
		scroll: function(step)
		{
			/* nothing to do*/
			if (typeof step == 'undefined' || step == 0 || (step < 0 && this.current <= 0) || (step > 0 && this.current >= 100))
			{
				return this;
			}

			/* Event */
			if (fireEvent(this, 'onScrollBefore', this.current + step) === false)
			{
				return this;
			}

			/* neuer wert*/
			this.current += step;

			/* aktualisieren*/
			this.update();

			/* Event */
			fireEvent(this, 'onScrollAfter');

			return this;
		},

		/**
		 * zu einem bestimmten element scrollen
		 *
		 * @param element|string element
		 * @return jScroll
		 */
		scrollTo: function(element)
		{
			element = $(element);

			/* element nicht gefunden oder element gehört nicht zu diesem jScroll */
			if (!element || !element.getParents().find(function(element)
			{
				return element == this.elementContent;
			}, this))
			{
				return this;
			}

			var percent = (jSElement_getY(element) - jSElement_getY(this.elementContent) - this.sliderHeight / 2) * 100 / this.contentHeight;

			/* Event */
			if (fireEvent(this, 'onScrollBefore', percent) === false)
			{
				return this;
			}

			this.update(percent);

			/* Event */
			fireEvent(this, 'onScrollAfter');

			return this;
		},

		/**
		 * scrolls up
		 *
		 * @param int step optional default
		 * @return jScroll
		 */
		up: function(step)
		{
			if (typeof step == 'undefined')
			{
				step = this.options.scrollSmall;
			}

			/* Event */
			if (fireEvent(this, 'onScrollUpBefore', this.current - step) === false)
			{
				return this;
			}

			this.scroll(-1 * step);

			/* Event */
			fireEvent(this, 'onScrollUpAfter');

			return this;
		},

		/**
		 * ansicht aktualisieren
		 *
		 * @param int percent
		 * @return jScroll
		 */
		update: function(percent)
		{
			/* nicht gerendert*/
			if (!this.rendered || !this.enabled)
			{
				return this;
			}

			if (typeof percent != 'undefined')
			{
				this.current = percent;
			}

			/* korrektur*/
			this.current = correctPercentage(this.current);

			/* Event */
			fireEvent(this, 'onUpdateBefore');

			/* slider anpassen*/
			this.elementSlider.setStyles(
			{
				top: (this.sliderTop + this.sliderHeight * this.current / 100)
			});

			/* content anpassen*/
			this.elementContent.setStyles(
			{
				marginTop: (-1 * this.contentHeight * this.current / 100)
			});

			this.elementUpBetween.setStyles(
			{
				height:	(this.sliderTop + this.sliderHeight * this.current / 100 - this.elementUp.getSize().y)
			});

			this.elementDownBetween.setStyles(
			{
				top: (this.sliderTop + this.sliderHeight * this.current / 100 + this.elementSlider.getSize().y)
			});

			/* Event */
			fireEvent(this, 'onUpdateAfter');

			return this;
		}
	});

	/**
	 * liefert das jScrolls zu einem DOM
	 *
	 * @param string|node element
	 * @return jScrolls.*
	 */
	jScroll.$ = function(element)
	{
		var container = $(element);

		if (!container && typeof element == 'string')
		{
			container = containers.find(function(c)
			{
				return c.id == element;
			});
		}
		else if (container && typeof container._jScroll != 'undefined')
		{
			container = container._jScroll;
		}
		else if (container && typeof container._jScroll == 'undefined')
		{
			container = null;
		}

		return (container ? container : null);
	};

	/****************************************************************************************************
	 *																									*
	 *										extend														*
	 *																									*
	 ****************************************************************************************************/
	var isStrict = document.compatMode == 'CSS1Compat';

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
			l: 'border-left-width',
			r: 'border-right-width',
			t: 'border-top-width',
			b: 'border-bottom-width'
		});
	};

	var jSElement_getContentHeight = function(element)
	{
		var prev = null;
		element = $(element);

		var result = 0;
		element.getChildren().each(function(child, index)
		{
			if (child.nodeType != 1)
			{
				if (index == 0)
				{
					prev = child;
				}
				return; /* nur element nodes*/
			}

			child = $(child);

			if (prev)
			{
				result += child.offsetTop - element.offsetTop;
				prev = null;
			}

			return result + child.getSize().y + jSElement_getMargins(child, 'tb');
		});

		return result;
	};

	var jSElement_getFrameWidth = function(element, sides, onlyContentBox)
	{
		element = $(element);
		return onlyContentBox && Browser.Engine.trident && !isStrict ? 0 : (jSElement_getPadding(element, sides) + jSElement_getBorderWidth(element, sides));
	};

	var jSElement_getMargins = function(element, side)
	{
		element = $(element);
		if (!side)
		{
			return {
				top:	parseInt(element.getStyle('margin-top'), 10) || 0,
				left:	parseInt(element.getStyle('margin-left'), 10) || 0,
				bottom:	parseInt(element.getStyle('margin-bottom'), 10) || 0,
				right:	parseInt(element.getStyle('margin-right'), 10) || 0
			};
		}
		else
		{
			return jSElement_addStyles(element, side,
			{
				l: 'margin-left',
				r: 'margin-right',
				t: 'margin-top',
				b: 'margin-bottom'
			});
		}
	};

	var jSElement_getPadding = function(element, side)
	{
		element = $(element);
		return jSElement_addStyles(element, side,
		{
			l: 'padding-left',
			r: 'padding-right',
			t: 'padding-top',
			b: 'padding-bottom'
		});
	};

	var jSElement_getScroll = function(element)
	{
		element = $(element);
		var d = element, doc = document;
		if (d == doc || d == doc.body)
		{
			var l, t;
			if (Browser.Engine.trident && isStrict)
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
		var E = element.getStyle('position') == 'absolute';

		while (F)
		{
			$(F);
			O += F.offsetLeft;
			L += F.offsetTop;
			if (!E && F.getStyle('position') == 'absolute')
			{
				E = true;
			}
			if (Browser.Engine.gecko)
			{
				K = F;
				var P = parseInt(K.getStyle('borderTopWidth'), 10) || 0;
				var H = parseInt(K.getStyle('borderLeftWidth'), 10) || 0;
				O += H;
				L += P;
				if ( F != element && K.getStyle('overflow') != 'visible')
				{
					O += H;
					L += P;
				}
			}
			F = F.offsetParent;
		}

		if (Browser.Engine.webkit && E)
		{
			O -= J.offsetLeft;
			L -= J.offsetTop;
		}
		if (Browser.Engine.gecko && !E)
		{
			var I = $(J);
			O += parseInt(I.getStyle('borderLeftWidth'), 10) || 0;
			L += parseInt(I.getStyle('borderTopWidth'), 10) || 0;
		}
		F = element.parentNode;

		while (F && F != J)
		{
			if (!Prototype.Browser.Opera || (F.tagName != 'TR' && $(F).getStyle('display') != 'inline'))
			{
				O -= F.scrollLeft;
				L -= F.scrollTop;
			}
			F = F.parentNode;
		}

		return L;
	};

	/* info durchschleifen, wenn DOM geladen ist*/
	autoload(function(){});

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