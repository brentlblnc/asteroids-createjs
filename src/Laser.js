class Laser {
    constructor(stage, assetManager) {
        this._stage = stage;
        this._sprite = assetManager.getSprite("spritesheet");
        //this._sprite.setTransform(400, 275, 0.1, 0.1, angle);

    }

    get laser() {
        return this._sprite;
    }

    dispatch(angle) {
        this._sprite.gotoAndStop("laser");
    }
}