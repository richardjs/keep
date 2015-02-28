'use strict';

game.PickupEntity = me.Entity.extend({
	init: function(x, y, settings){
		settings.image = 'tiles';
		settings.spritewidth = 32;
		settings.spriteheight = 32;
		settings.width = 25;
		settings.height = 17;
		settings.collisionType = 'COLLECTABLE_OBJECT';

		this._super(me.Entity, 'init', [x, y, settings]);

		this.anchorPoint.set(.5, 1);

		this.renderable.addAnimation('closed', [67]);
		this.renderable.addAnimation('open', [68]);

		this.opened = game.data[this.type];
		if(!this.opened){
			this.renderable.setCurrentAnimation('closed');
		}else{
			this.renderable.setCurrentAnimation('open');
		}
	},

	onCollision: function(response, other){
		if(this.opened || other.body.collisionType !== me.collision.types.PLAYER_OBJECT){
			return false;
		}

		this.renderable.setCurrentAnimation('open');
		this.opened = true;
		game.data[this.type] = true;

		var item;
		switch(this.type){
			case 'sword':
				item = new Sword();
				break;
			case 'teleporter':
				item = new Teleporter();
				game.data.items.push(new Teleporter(me.game.player));
				break;
		}
		if(item){
			game.data.items.push(item);
		}

		if(game.data.items.length === 2){
			game.data.items[1].equip(2);
		}

		var text = ''
		var words = item.text.split(' ')
		for(var i = 0; i < words.length; i++){
			text += words[i];
			if((i+1) % 10 === 0){
				text += '\n';
			}else{
				text += ' ';
			}
		}

		game.text.display('Obtained: ' + item.name + '\n\n' + text);

		return false;
	}

});