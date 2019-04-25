class Asteroid {
    constructor(stage, assetManager, shooter) {
        this._stage = stage;
        this._shooter = shooter;
        this._destroyed = false;
        this._active = false;
        this._sprite = assetManager.getSprite("spritesheet");
        this._direction = 0;
        this._sprite.mover = new SpriteMover(this._sprite, stage);
        this._eventAsteroidDestroyed = new createjs.Event("asteroidDestroyed", true);
    }

    // ------------------------------ Get/set methods

    get active() {
        return this._active;
    }

    get sprite() {
        return this._sprite;
    }

    set active(val) {
        this._active = val;
    }

    // ------------------------------ Public methods
    initialize() {
        this._destroyed = false;
        this._sprite.scaleX = 0.2;
        this._sprite.scaleY = 0.2;
        this._sprite.gotoAndPlay("asteroidRotate");

        // Choose a random speed and direction 
        this._direction = SpriteMover.Random(SpriteMover.Left, SpriteMover.Right);
        this._sprite.mover.speed = SpriteMover.Random(1, 10);

        switch (this._direction) {
            case SpriteMover.Left:
                // Move leftward
                this._sprite.x = this._stage.canvas.width;
                this._sprite.y = SpriteMover.Random(-this._sprite.getBounds().height, this._stage.canvas.height);
                this._sprite.rotation = SpriteMover.Random(135, 225);
                break;
            default:
                // Move rightward
                this._sprite.x = -50;
                this._sprite.y = SpriteMover.Random(-this._sprite.getBounds().height, this._stage.canvas.height);
                this._sprite.rotation = SpriteMover.Random(45, -45);
        }

        // Calculate velocity of asteroid depending on rotation
        this._sprite.mover.calculateVelocity(this._sprite, this._sprite.rotation);

        this._stage.addChild(this._sprite);
    }

    update() {
        this._sprite.mover.update();
    }

    destroy() {
        this._sprite.gotoAndPlay("explosion");
        this._sprite.on("animationend", e => {
            e.remove();
            this._sprite.stop();
            this._stage.removeChild(this._sprite);
        });

    }
}