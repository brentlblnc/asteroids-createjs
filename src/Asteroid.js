class Asteroid {
    constructor(stage, assetManager, maxSpeed) {
        this._stage = stage;
        this._maxSpeed = maxSpeed;
        this._destroyed = false;
        this._active = false;
        this._sprite = assetManager.getSprite("spritesheet");
        this._sprite.mover = new MoverDiagonal(this._sprite, stage);
        this._eventAsteroidDestroyed = new createjs.Event("asteroidDestroyed", true);
    }

    // Get/set methods

    get active() {
        return this._active;
    }

    set active(val) {
        this._active = val;
    }

    // Private methods
    _randomMe(low, high) {
        return Math.round(Math.random() * (high - low)) + low;
    }

    // Public methods
    setupMe() {
        this._destroyed = false;
        this._sprite.setTransform(500, 100, 0.2, 0.2);
        this._sprite.gotoAndPlay("asteroidRotate");
        this._stage.addChild(this._sprite);

        // Random speed selection for asteroid
        this._sprite.mover.speed = this._randomMe(2,6);

        // Calculate dimension of sprite
        let dimensions = this._sprite.getBounds();
    }
}