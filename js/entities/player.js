/**
 * Player Entity
 */
game.PlayerEntity = me.Entity.extend({

	/**
	 * constructor
	 */
	init:function (x, y, settings) {
		// set the image
		settings.image = 'player';
		settings.spritewidth = 15;
		settings.spriteheight = 30;
		settings.width = 15;
		settings.height = 15;

		// call the constructor
		this._super(me.Entity, 'init', [x, y , settings]);

		// set player movement speed
		this.body.setVelocity(2, 2);

		// set the viewport to follow the player
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
		me.game.viewport.setDeadzone(0, 0);

		this.body.gravity = 0;

		me.input.registerPointerEvent('pointermove', me.game.viewport, this.pointerMove.bind(this));

		// used to properly indicate the sprite has updated in this.update
		this.rotatedThisFrame = false;
	},


	/**
	 * called when the mouse moves
	 */
	pointerMove: function(eventType, region){
		// rotate to face the pointer
		this.renderable.angle = Math.atan2(
			eventType.gameY - this.pos.y,
			eventType.gameX - this.pos.x
		);
		this.rotatedThisFrame = true;
	},

	/**
	 * update the entity
	 */
	update : function (dt) {
		// respond to contols
		if(me.input.isKeyPressed('left') && !me.input.isKeyPressed('right')){
			this.body.vel.x -= this.body.accel.x * me.timer.tick;
		}else if(me.input.isKeyPressed('right') && !me.input.isKeyPressed('left')){
			this.body.vel.x += this.body.accel.x * me.timer.tick;
		}else{
			this.body.vel.x = 0;
		}

		if(me.input.isKeyPressed('up') && !me.input.isKeyPressed('down')){
			this.body.vel.y -= this.body.accel.y * me.timer.tick;
		}else if(me.input.isKeyPressed('down') && !me.input.isKeyPressed('up')){
			this.body.vel.y += this.body.accel.y * me.timer.tick;
		}else{
			this.body.vel.y = 0;
		}

		// apply physics to the body (this moves the entity)
		this.body.update(dt);

		// handle collisions against other shapes
		me.collision.check(this);

		var rotatedThisFrame = this.rotatedThisFrame;
		this.rotatedThisFrame = false;

		// return true if we moved or if the renderable was updated
		return (
			rotatedThisFrame
			|| this._super(me.Entity, 'update', [dt])
			|| this.body.vel.x !== 0
			|| this.body.vel.y !== 0
		);
	},

   /**
	 * colision handler
	 * (called when colliding with other objects)
	 */
	onCollision : function (response, other) {
		// Make all other objects solid
		return true;
	}
});
