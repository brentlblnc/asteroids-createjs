class Laser {
    constructor(stage, assetManager) {
        this._stage = stage;
        this._sprite = assetManager.getSprite("spritesheet");
    }

    get laser() {
        return this._sprite;
    }

    dispatch(angle) {
        this._sprite.gotoAndStop("laser");
        this._sprite.setTransform(400, 275, 0.2, 0.2, angle);
    }
}