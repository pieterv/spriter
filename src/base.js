( function( define ) {
define( function() {

	//
	// Helper functions
	//

	// Extend obj with new properties
	var extend = function( obj ) {
			var args = Array.prototype.slice.call( arguments, 1 );
			for ( var i = 0, l = args.length; i < l; i++ ) {
				var source = args[ i ];
				for ( var prop in source ) {
					if ( source[ prop ] !== void 0 ) obj[ prop ] = source[ prop ];
				}
			}
			return obj;
		};

	// Basic class creator
	var type = function( obj ) {
			var constructor_name = 'initialize';

			// Constructor function
			var base = function() {
					if ( typeof this[ constructor_name ] === 'function' ) {
						this[ constructor_name ].apply( this, arguments );
					}
				};

			base.prototype = obj;

			// Create new class inheriting from this class
			base.extend = function( protoProps ) {
				var ctor = function() {},
					child = type( {} );

				// Copy over properties
				ctor.prototype = base.prototype;
				child.prototype = new ctor();

				// Set properties
				extend( child.prototype, protoProps );

				return child;
			};


			return base;
		};


	//
	// Spriter objects holder
	//
	var spriterBase = {};


	//
	// Animation creator
	// Interface for creating and setting up animation time lines and properties
	//
	spriterBase.Animation = type( {

		_fps: 0,
		_active: false,
		_fx: {},

		initialize: function( options, animator ) {
			var self = this;

			options = options || {};

			self._fx = self._createFx( options );
			self._fps = +options.fps || 0;
			self._active = !!options.active || false;
			self._animator = animator || {};

		},

		// Setup a 'fx' object for our sprites
		_createFx: function( options ) {

			// Parse values to ints
			var getInt = function( value ) { return parseInt( value, 10 ); },

				// Number of frames
				frames = +options.frames || 0,

				// Set unit
				// TODO: Calc unit from values
				unit = options.unit || 'px',

				// Setup our start values
				start = ( options.start ) ? {
					x: getInt( options.start.x ) || 0,
					y: getInt( options.start.y ) || 0
				} : { x: 0, y: 0 },

				// Setup our animation offset values (how far a frame should advance)
				offset = ( options.offset ) ? {
					x: getInt( options.offset.x ) || 0,
					y: getInt( options.offset.y ) || 0
				} : { x: 0, y: 0 },

				// Position of last frame
				end = {
					x: start.x + ( offset.x * frames ),
					y: start.y + ( offset.y * frames )
				};

			// Direction of animation
			offset.dir = ( offset.y ) ? 'y' : 'x';

			return {
				start: start,
				end: end,
				offset: offset,
				unit: unit,
				frames: frames
			};
		},

		// API

		// Create a new sprite
		create: function( el ) {
			var self = this;

			return new spriterBase.Sprite( {
				animator: self._animator,
				fx: self._fx,
				fps: self._fps,
				active: self._active,
				el: el
			} );
		},

		// Update fps
		fps: function( fps ) {
			var self = this;

			self._fps = +fps;
			return self;
		},

		// Default the sprites to start
		start: function() {
			var self = this;

			self._active = true;
			return self;
		},

		// Default the sprites to stopped
		stop: function() {
			var self = this;

			self._active = false;
			return self;
		}

	} );



	//
	// Sprite
	// Interface for controlling an individual sprite
	//
	spriterBase.Sprite = type( {

		_fps: 0,
		_active: false,
		_now: {},

		_animator: false,
		_fx: {},
		_el: false,

		initialize: function( options ) {
			var self = this;

			if ( !options ) {
				throw new Error( "Sprite options missing" );
			}

			// Copy over options
			self._animator = options.animator;
			self._fx = options.fx;
			self._fps = options.fps;
			self._el = options.el;

			// Set our current position
			// back to the start
			self.restart();

			// Should it start by default
			if ( options.active ) {
				self.start();
			}

		},

		fps: function( fps ) {
			var self = this,
				_fps = +fps;

			self._fps = _fps;

			if ( _fps <= 0 ) {
				self._fps = 0;
				self.stop();
			}

			return self;

		},

		start: function() {
			var self = this;

			// Nothing to do
			if ( self._active || !self._fps ) return;

			// Start errr up
			self._active = true;
			self._animator.add( self );

			return self;
		},

		stop: function() {
			var self = this;

			self._active = false;
			self._animator.remove( self );

			return self;
		},

		restart: function() {
			var self = this;

			self._now = {
				x: self._fx.start.x,
				y: self._fx.start.y
			};

			return self;
		}

	} );


	//
	// Base animator
	// An extendible class to use for creating animator objects
	//
	spriterBase.Animator = type( {

		add: function( sprite ) {},

		remove: function( sprite ) {}

	} );



	//
	// Hand over internal objects
	//
	return spriterBase;

} );
} )( typeof define == 'function'
		? define
		: function( factory ) { typeof module != 'undefined'
				? ( module.exports    = factory() )
				: ( this.spriter_base = factory() );
		}
		// Boilerplate for AMD, Node, and browser global
);