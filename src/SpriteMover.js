class SpriteMover {

    constructor(sprite, stage) {
        this._speed = 5;
        this._moving = false;
        this._sprite = sprite;
        this._stage = stage;
        // Change in x and y coordinates
        this._sprite.dx = 0;
        this._sprite.dy = 0;
    }

    // Static properties
    static Right = 1;
    static Left = 2;

    // --------------------------------------------------- Get/set methods
    set speed(value) {
        this._speed = value;
    }

    get moving() {
        return this._moving;
    }


    // --------------------------------------------------- Public methods
    static Random(low, high) {
        return Math.round(Math.random() * (high - low)) + low;
    }

    static DegToRad(degrees) {
        return degrees * Math.PI / 180;
    }

    calculateVelocity(sprite, rotation) {
        this._sprite = sprite;
        this._sprite.rotation = rotation;

        if (!this._moving) {
            // Convert rotation of sprite to radians
            let radians = SpriteMover.DegToRad(this._sprite.rotation);
            // Set change in x and y coordinates
            this._sprite.dx = Math.cos(radians) * this._speed;
            this._sprite.dy = Math.sin(radians) * this._speed;
            this._moving = true;
        }
    }

    stop() {
        if (this._moving) {
            this._sprite.stop();
            this._moving = false;
        }
    }

    update() {
        if (this._moving) {
            // Move sprite
            this._sprite.x += this._sprite.dx;
            this._sprite.y += this._sprite.dy;
        }
    }
}