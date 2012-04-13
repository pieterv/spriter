define( function( require ) {

	// Libs
	var testAnimatorApi = require( 'spec/animator/api' );

	// Test files
	var Animator = require( 'animator/basic' );
	
	// Test
	describe( "Basic Animator", function() {

		// Run the basic api tests
		testAnimatorApi( Animator );

	} );
	
} );