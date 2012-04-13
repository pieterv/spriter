( function( global, define ) {
define(
	[ '../base' ],
	function( spriterBase ) {

	//
	// Helper functions
	//


	//
	// Animator
	// Basic animator which uses an animation loop to update the background position of the sprite image
	// Extend the spriter base animator
	//
	var Animator = spriterBase.Animator.extend( {

		initialize: function() {

		},

		add: function( sprite ) {

		},

		remove: function( sprite ) {

		}

	} );


	//
	// Feature test
	// This basic animator should support all environments
	//
	Animator.test = function() {
		return true;
	};


	//
	// Hand over Animator object
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
			this.spriter_ani_basic = factory(
				// dependencies
				this.spriter_base
			);
	}
);