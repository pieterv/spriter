define( function( require ) {

	// Libs
	var testAnimatorApi = require( 'spec/animator/api' );

	// Test files
	var Animator = require( 'animator/css_animate' );

	// Basic logic
	var spriterBase = require( 'base' );
	
	// Test
	describe( "Css animate Animator", function() {

		// Run the basic api tests
		testAnimatorApi( Animator );

		describe( "Feature test", function() {

			it( "test runs", function() {
				expect( {}.toString.call( Animator.test() ) == '[object Boolean]' ).toBeTruthy();
			} );

		} );

		// We better stop testing here if the client doesn't support this animator
		if ( !Animator.test() ) return;

		describe( "Initialize instance", function() {

			it( "find/create stylesheet", function() {
				var ani = new Animator();

				expect( ani._styleSheet ).toBeDefined();

			} );

		} );

		describe( "Animator specific functions", function() {

			beforeEach( function() {
				this.ani = new Animator();
				this.el = document.createElement( 'div' );
				this.sprite = new spriterBase.Animation( {
					fps: 15,
					frames: '10',
					start: { x: '100px', y: '200px' },
					offset: { x: '20px' }
				}, new spriterBase.Animator() ).create( this.el );
			} );

			it( "add new animation declaration to the style sheet", function() {

				var stub_insert = sinon.stub( this.ani._styleSheet, 'insertRule' ),
					first = this.ani._addAnimateStyle( 'background-position', '-10px -10px', '-20px -20px' ),
					second = this.ani._addAnimateStyle( 'background-position', '-10px -10px', '-20px -20px' ),
					third = this.ani._addAnimateStyle( 'background-position', '-10px -10px', '-50px -50px' );

				expect( stub_insert ).toHaveBeenCalledTwice();
				expect( first ).toBe( second );
				expect( first ).not.toBe( third );

				stub_insert.restore();

			} );

			it( "calculate animation completion from position", function() {

				expect( this.ani._calcAniCompletion( this.sprite ) ).toBe( 0 );

				this.sprite._now = { x: 140, y: 200 };
				expect( this.ani._calcAniCompletion( this.sprite ) ).toBe( 0.2 );

				this.sprite._now = { x: 200, y: 200 };
				expect( this.ani._calcAniCompletion( this.sprite ) ).toBe( 0.5 );

				this.sprite._now = { x: 240, y: 200 };
				expect( this.ani._calcAniCompletion( this.sprite ) ).toBe( 0.7 );

				this.sprite._now = { x: 300, y: 200 };
				expect( this.ani._calcAniCompletion( this.sprite ) ).toBe( 1 );


			} );

		} );

	} );
	
} );