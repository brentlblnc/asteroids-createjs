class Asteroid {
    constructor(stage, assetManager, maxSpeed) {
        this._stage = stage;
        this._maxSpeed = maxSpeed;
        this._destroyed = false;
        this._sprite = assetManager.getSprite("spritesheet");
        this._eventAsteroidDestroyed = new createjs.Event("asteroidDestroyed", true);
    }

    // Public methods
    setupMe() {
        this._destroyed = false;
        this._sprite.setTransform(500, 100, 0.2, 0.2);
        this._sprite.gotoAndPlay("asteroidRotate");
        this._stage.addChild(this._sprite);
    }
}