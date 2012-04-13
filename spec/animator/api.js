define( function( require ) {

	// Wrap in function so it can test multiple
	return function( Animator ) {

		it( "is a class", function() {

			expect( Animator ).toBeDefined();

			expect( new Animator() ).toBeDefined();

		} );

		it( "can be extended", function() {

			var _bob = sinon.spy(),
				Sub = Animator.extend( {
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

		describe( "API", function() {

			beforeEach( function() {
				this.sprite = sinon.spy();
				this.ani = new Animator();
			} );

			it( "can add a sprite to the animation queue", function() {
				expect( this.ani.add( this.sprite ) ).not.toBeTruthy();
			} );

			it( "can remove a sprite from the animation queue", function() {
				expect( this.ani.remove( this.sprite ) ).not.toBeTruthy();
			} );

		} );

	};
	
} );