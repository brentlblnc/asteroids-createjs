class Laser {
    constructor(stage, assetManager, rotation) {
        this._stage = stage;
        this._sprite = assetManager.getSprite("spritesheet");
        this._rotation = rotation;
        this._sprite.mover = new SpriteMover(this._sprite, stage);
    }

    // ------------------------------ Get/set methods
    get sprite() {
        return this._sprite;
    }

    // ------------------------------ Public methods
    reset() {
        this._sprite.rotation = 0;
    }

    initialize() {
        // Scale the laser to appropriate dimensions
        this._sprite.setTransform(400, 275, 0.1, 0.1, this._rotation);
        this._sprite.gotoAndStop("laser");
        this._sprite.mover.speed = 20;
        this._sprite.rotation = this._rotation;
        // Calculate velocity depending on rotation of sprite
        this._sprite.mover.calculateVelocity(this._sprite, this._sprite.rotation);
        this._stage.addChild(this._sprite);
    }

    update(laserPool) {
        // Update all lasers in the object pool (since multiple lasers can be fired at once)
        laserPool.forEach(laser => {
            laser.sprite.mover.update();
        });
    }
}