define( function( require ) {

	// Test files
	var spriterBase = require( 'base' );

	// Testing class
	var Sprite = spriterBase.Sprite;
	
	// Test
	describe( "Sprite", function() {

		it( "is a class", function() {

			expect( Sprite ).toBeDefined();

			expect( new Sprite( { fps: 0, fx: { start: {} } } ) ).toBeDefined();

		} );

		it( "can be extended", function() {

			var _bob = sinon.spy(),
				Sub = Sprite.extend( {
					_bob: _bob,
					initialize: function() {
						this._bob();
					}
				} );

			var sub = new Sub();

			expect( sub._bob ).toBeDefined();
			expect( _bob ).toHaveBeenCalledOnce();
			expect( Sub.extend ).toBeDefined();

		} );

		describe( "Can setup and create new instance", function() {

			it( "error if options not provided", function() {

				var sprite_throw = false;

				try {
					new Sprite();
				} catch( e ) {
					sprite_throw = true;
				}

				expect( sprite_throw ).toBeTruthy();

			} );

			xit( "set properties", function() {

				

			} );

		} );

		describe( "API", function() {

			beforeEach( function() {

				this.fx = ( new spriterBase.Animation( {
						frames: '10',
						start: { x: '100px', y: '200px' },
						offset: { x: '20px' }
					} ) )._fx;
				this.el = document.createElement( 'div' );
				this.animator = sinon.stub( new spriterBase.Animator() );
				this.sprite = new Sprite( {
					animator: this.animator,
					el: this.el,
					fx: this.fx,
					fps: 10
				} );

			} );

			it( "update fps", function() {

				var stub_sprite_stop = sinon.stub( this.sprite, 'stop' );

				// Returns it self
				expect( this.sprite.fps( '12' ) ).toEqual( this.sprite );

				// Updated value
				expect( this.sprite._fps ).toBe( 12 );

				// Stop the sprite on 0
				this.sprite.fps( 0 );
				expect( this.sprite._fps ).toBe( 0 );
				expect( stub_sprite_stop ).toHaveBeenCalledOnce();

				stub_sprite_stop.restore();

			} );

			it( "start", function() {

				// Returns it self
				expect( this.sprite.start() ).toEqual( this.sprite );

				// Updated value
				expect( this.sprite._active ).toBeTruthy();

				// Updated Animator
				expect( this.animator.add ).toHaveBeenCalledOnce();
				expect( this.animator.add ).toHaveBeenCalledWith( this.sprite );

			} );

			it( "stop", function() {

				this.sprite.start();
				expect( this.sprite._active ).toBeTruthy();

				// Returns it self
				expect( this.sprite.stop() ).toEqual( this.sprite );

				// Updated value
				expect( this.sprite._active ).not.toBeTruthy();

				// Updated Animator
				expect( this.animator.remove ).toHaveBeenCalledOnce();
				expect( this.animator.remove ).toHaveBeenCalledWith( this.sprite );

			} );

			it( "restart", function() {

				// Returns it self
				expect( this.sprite.restart() ).toEqual( this.sprite );

				// Updated value
				expect( this.sprite._now ).toEqual( this.fx.start );

			} );

		} );

	} );
	
} );