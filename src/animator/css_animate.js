( function( global, define ) {
define(
	[ '../base' ],
	function( spriterBase ) {

	//
	// Helper functions
	//

	// Memoize, an expensive function by storing its results
	// Based on the underscore memorize function
	// http://documentcloud.github.com/underscore/#memoize
	var memoize = function( func, hasher ) {
		var memo = {};
		return function() {
			var key = hasher.apply( this, arguments );
			return memo.hasOwnProperty( key ) ? memo[ key ] : ( memo[ key ] = func.apply( this, arguments ) );
		};
	};

	// Test the environment to see if it supports a certain css property
	// Cache the results with memoize
	var cssTest = memoize( function( prop, value ) {

		var envPrefixes = '|webkit|Moz|O|ms'.split('|'),

			// Testing items
			testElement = global.document.createElement( 'div' ),

			// Test if our style is supported, try prefix
			test = function( envPrefixTest ) {
				// Add prefix style\
				var style = envPrefixTest ? envPrefixTest + prop.charAt( 0 ).toUpperCase() + prop.substr( 1 ) : prop;

				if ( testElement.style[ style ] !== undefined ) {
					
					// Test the `value` against the `prop`
					testElement.style[ style ] = value;

					return ( testElement.style.cssText || '' ).indexOf( value ) > 0;
				}
			},

			// Loop properties
			i = 0, length = envPrefixes.length, envPrefix;

		// Try all prefixes
		for ( ; i < length; i++ ) {
			envPrefix = envPrefixes[ i ];
			if ( test( envPrefix ) ) { // Hazzah! we found a match
				return { js: envPrefix, css: envPrefix ? '-' + envPrefix.toLowerCase() + '-' : '' };
			}
		}

		return false; // Didn't find a match

	}, function( a, b ) { return a + '|' + b; } );


	//
	// Local vars
	//

	var Animator,
		animateStyleIndex = 0; // Will increment as styles are added

	// Store the current environments prefix
	var prefixCssAnimate = {}; // { js: '', css: '' },

	//
	// Animator
	// Insert css animate statements into the environment and use them to animate the sprite
	// Extend the spriter base animator
	//
	Animator = spriterBase.Animator.extend( {

		initialize: function() {
			var self = this;

			if ( !prefixCssAnimate && !Animator.test() ) {
				// Environment does not support this animator
				// Hand it back the base animator
				return new spriterBase.Animator();
			}

			// If no style sheets
			if ( !global.document.styleSheets.length ) {
				// Setup our style sheet to add animations to!
				global.document.getElementsByTagName( 'head' )[ 0 ].appendChild( global.document.createElement( 'style' ) );
			}

			// Get the last style sheet, we will add css animation rules to this
			this._styleSheet = document.styleSheets[ document.styleSheets.length - 1 ];

		},

		add: function( sprite ) {
			var self = this,
				fx = sprite._fx,
				el = sprite._el,
				animateStyle, animationVal, animationDur, animationDelay,
				prefixAnimation = ( prefixCssAnimate.js ? prefixCssAnimate.js + 'A' : 'a' ) + 'nimation';

			if ( !fx ) return;

			// Create css animation and get name
			animateStyle = self._addAnimateStyle(
				'background-position',
				'-' + fx.start.x + fx.unit + ' -' + fx.start.y + fx.unit,
				'-' + fx.end.x   + fx.unit + ' -' + fx.end.y   + fx.unit
			);

			animationDur = Math.round( ( 1000 / sprite._fps ) * fx.frames );

			animationDelay = Math.round( animationDur * self._calcAniCompletion( sprite ) );

			// Setup css animation value
			animationVal = [
				animateStyle,                    // Name
				animationDur +'ms',              // Duration
				'steps(' + fx.frames + ', start)', // Timing function
				'-' + animationDelay + 'ms',     // Delay
				'infinite'                       // Iteration count
			].join( ' ' );

			// Set to element
			el.style[ prefixAnimation ] = animationVal;

		},

		remove: function( sprite ) {
			var self = this,
				fx = sprite._fx,
				el = sprite._el,
				animation = ( prefixCssAnimate.js ? prefixCssAnimate.js + 'A' : 'a' ) + 'nimation',
				backgroundPosition = 'backgroundPosition';

			if ( !fx ) return;

			var bgPos = global.getComputedStyle( el, null )[ backgroundPosition ] || '0px 0px',
				bgPosArray = bgPos.split( ' ' );

			// Remove out current position
			sprite._now = {
				x: parseInt( bgPosArray[ 0 ], 10 ) * -1,
				y: parseInt( bgPosArray[ 1 ], 10 ) * -1
			};

			// Reset our style
			el.style[ animation ] = 'none';
			el.style[ backgroundPosition ] = bgPos;

		},

		_addAnimateStyle: memoize( function( name, start, end ) {
			var self = this,
				animateStyle, value;

			animateStyle = 'sprite' + animateStyleIndex++;

			value = '@' + prefixCssAnimate.css + 'keyframes ' + animateStyle + ' { ' +
					'from {' + name + ':' + start + '} ' +
					'to {'   + name + ':' +  end  + '} ' +
				'}';

			self._styleSheet.insertRule( value, 0 );

			return animateStyle;
		}, function( a, b, c ) { return a + '|' + b + '|' + c; } ),

		_calcAniCompletion: function( sprite ) {
			var self = this,
				fx = sprite._fx,
				dir = fx.offset.dir;

			// Calculate animation completion from position
			return ( sprite._now[ dir ] - fx.start[ dir ] ) / ( fx.end[ dir ] - fx.start[ dir ] ) || 0;
		}

	} );


	//
	// Feature test
	// Test whether this environment supports css animate, specifically the `step()` functionality
	//
	Animator.test = function() {
		var prefix = cssTest( 'animationTimingFunction', 'steps(1, start)' );

		if ( prefix ) {
			prefixCssAnimate = prefix;
		}

		return !!prefix;
	};


	//
	// Hand over animator object
	//
	return Animator;


});
})(this,
	typeof define == 'function'
	// use define for AMD if available
	? define
	// Browser
	// If no define or module, attach to current context.
	: typeof module != 'undefined'
		? function(deps, factory) {
			module.exports = factory.apply(this, deps.map(function(x) {
				return require(x);
			}));
		}
		: function(deps, factory) {
			this.spriter_ani_css_animate = factory(
				// dependencies
				this.spriter_base
			);
	}
);