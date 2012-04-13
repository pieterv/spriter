define( function( require ) {

	// Test files
	var spriterBase = require( 'base' );

	// Testing class
	var Animation = spriterBase.Animation;
	
	// Test
	describe( "Animation creator", function() {

		it( "is a class", function() {

			expect( Animation ).toBeDefined();

			expect( new Animation() ).toBeDefined();

		} );

		it( "can be extended", function() {

			var _bob = sinon.spy(),
				Sub = Animation.extend( {
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

			it( "set properties", function() {

				var return_createFx = { 'bob': 'russ' },
					stub_createFx = sinon.stub( Animation.prototype, '_createFx' ).returns( return_createFx ),
					options = {
						fps: '27',
						thing: 'thing'
					};

				var ani = new Animation( options );

				expect( stub_createFx ).toHaveBeenCalledOnce();
				expect( stub_createFx ).toHaveBeenCalledWith( options );

				expect( ani._fps ).toBe( 27 );
				expect( ani._fx ).toEqual( return_createFx );

				stub_createFx.restore();

			} );

			it( "create fx object", function() {

				var ani = new Animation( {} );

				expect( ani._createFx( {
					frames: '10',
					start: { x: '100px', y: '200px' },
					offset: { x: '20px' }
				} ) ).toEqual( {
					frames: 10,
					start: { x: 100, y: 200 },
					offset: { x: 20, y: 0, dir: 'x' },
					end: { x: 300, y: 200 },
					unit: 'px'
				} );

			} );

		} );

		describe( "API", function() {

			beforeEach( function() {

				this.ani = new Animation( {
					fps: 15,
					frames: '10',
					start: { x: '100px', y: '200px' },
					offset: { x: '20px' }
				} );

			} );

			it( "create sprite", function() {

				var return_Sprite = { bob: function() {} },
					stub_Sprite = sinon.stub( spriterBase, 'Sprite' ).returns( return_Sprite ),
					el = document.createElement( 'div' );

				// Returns the sprite
				expect( this.ani.create( el ) ).toEqual( return_Sprite );

				// Creates a sprite
				expect( stub_Sprite ).toHaveBeenCalledWith( {
					animator: {},
					fps: 15,
					fx: this.ani._fx,
					active: false,
					el: el
				} );

				// Created as an instance
				expect( stub_Sprite.calledWithNew() ).toBeTruthy();

				stub_Sprite.restore();

			} );

			it( "update fps", function() {

				// Returns it self
				expect( this.ani.fps( '12' ) ).toEqual( this.ani );

				// Updated value
				expect( this.ani._fps ).toBe( 12 );

			} );

			it( "default start", function() {

				// Returns it self
				expect( this.ani.start() ).toEqual( this.ani );

				// Updated value
				expect( this.ani._active ).toBeTruthy();

			} );

			it( "default stop", function() {

				this.ani.start();
				expect( this.ani._active ).toBeTruthy();

				// Returns it self
				expect( this.ani.stop() ).toEqual( this.ani );

				// Updated value
				expect( this.ani._active ).not.toBeTruthy();

			} );

		} );

	} );
	
} );