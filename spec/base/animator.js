define( function( require ) {

	// Libs
	var testAnimatorApi = require( 'spec/animator/api' );

	// Test files
	var spriterBase = require( 'base' );

	var Animator = spriterBase.Animator;
	
	// Test
	describe( "Base Animator", function() {

		// Run the basic api tests
		testAnimatorApi( Animator );

	} );
	
} );