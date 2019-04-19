class Asteroid {
    constructor(stage, assetManager, shooter) {
        this._stage = stage;
        this._shooter = shooter;
        this._destroyed = false;
        this._active = false;
        this._sprite = assetManager.getSprite("spritesheet");
        this._direction = 0;
        // this._sprite.dx = 0;
        // this._sprite.dy = 0;
        this._sprite.mover = new SpriteMover(this._sprite, stage);
        this._eventAsteroidDestroyed = new createjs.Event("asteroidDestroyed", true);
    }

    // Get/set methods

    get active() {
        return this._active;
    }

    get asteroid() {
        return this._sprite;
    }

    set active(val) {
        this._active = val;
    }

    // Private methods
    // _randomMe(low, high) {
    //     return Math.round(Math.random() * (high - low)) + low;
    // }

    // _degToRad(degrees) {
    //     return degrees * Math.PI / 180;
    // }

    // Public methods
    initialize() {
        this._destroyed = false;
        //this._sprite.setTransform(this._randomMe(0, 800), this._randomMe(0, 600), 0.2, 0.2);
        this._sprite.scaleX = 0.2;
        this._sprite.scaleY = 0.2;
        this._sprite.gotoAndPlay("asteroidRotate");

        // if (this._randomMe(1, 2) === 1) {
        //     // move right
        //     this._sprite.x = -50;
        //     this._sprite.y = this._randomMe(-this._sprite.getBounds().height, this._stage.canvas.height);
        //     this._sprite.rotation = this._randomMe(45, -45);
        // } else {
        //     this._sprite.x = this._stage.canvas.width;
        //     this._sprite.y = this._randomMe(-this._sprite.getBounds().height, this._stage.canvas.height);
        //     this._sprite.rotation = this._randomMe(135, 225);
        // }

        this._direction = SpriteMover.Random(SpriteMover.Left, SpriteMover.Right);
        this._sprite.mover.speed = SpriteMover.Random(1, 10);

        switch (this._direction) {
            case SpriteMover.Left:
                this._sprite.x = this._stage.canvas.width;
                this._sprite.y = SpriteMover.Random(-this._sprite.getBounds().height, this._stage.canvas.height);
                this._sprite.rotation = SpriteMover.Random(135, 225);
                break;
            default:
                this._sprite.x = -50;
                this._sprite.y = SpriteMover.Random(-this._sprite.getBounds().height, this._stage.canvas.height);
                this._sprite.rotation = SpriteMover.Random(45, -45);
        }

        // this._sprite.dx = 2 * Math.cos(this._degToRad(this._sprite.rotation));
        // this._sprite.dy = 2 * Math.sin(this._degToRad(this._sprite.rotation));

        this._sprite.mover.calculateVelocity(this._sprite, this._sprite.rotation);

        this._stage.addChild(this._sprite);
        // Random speed selection for asteroid
        //this._sprite.mover.speed = this._randomMe(2, 6);


        // Calculate dimension of sprite
        //let dimensions = this._sprite.getBounds();
    }

    update() {
        this._sprite.mover.update();
    }

    destroy() {
        this._sprite.gotoAndPlay("explosion");
        this._sprite.on("animationend", e => {
            this._sprite.stop();
            this._stage.removeChild(this._sprite);
        });

    }
}