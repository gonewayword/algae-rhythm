class Timeline {

    /*
    * 'year' | 'month' | 'quarter' | 'day' | 'hour'
    */
    scale;

    /*
    * 'standard'
    */
    speed;

    constructor(
        scale,
        speed
    ) {
        this.scale = scale;
        this.speed = !!speed ? speed : 'standard';
    }

    attach(selector) {
        // $(selector)
    }
}