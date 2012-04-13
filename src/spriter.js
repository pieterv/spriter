( function( global, define ) {
define(
	[ './base', './animator/basic', './animator/css_animate' ],
	function( spriterBase, AnimatorBasic, AnimatorCssAnimate ) {

	//
	// Find default animator
	// Feature test each animator to see if they support the environment, create the first that passes
	//
	var defaultAnimator;

	if ( AnimatorCssAnimate.test() ) {
		defaultAnimator = new AnimatorCssAnimate();
	} else if ( AnimatorBasic.test() ) {
		defaultAnimator = new AnimatorBasic();
	} else {
		defaultAnimator = new spriterBase.Animator();
	}


	//
	// Hand over our nice api
	//
	return function( options, animator ) {
		return new spriterBase.Animation( options, animator || defaultAnimator );
	};

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
			this.spriter = factory(
				// dependencies
				this.spriter_base, this.spriter_ani_basic, this.spriter_ani_css_animate
			);
	}
);