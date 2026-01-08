export default class ReelAnimator {
    constructor({
        reel,
        $reelEl,
        symbolMap,
        startIndex = 0,
        rotations = 4,
        stepDuration = 40,
        slowdownSteps = 10
    }) {
        this.reel = reel;
        this.length = reel.length;
        this.currentIndex = startIndex;

        this.rotations = rotations;
        this.stepDuration = stepDuration;
        this.slowdownSteps = slowdownSteps;

        this.$top = $reelEl.find(".symbol.top");
        this.$center = $reelEl.find(".symbol.center");
        this.$bottom = $reelEl.find(".symbol.bottom");

        this.symbolMap = symbolMap;
    }

    getWindow(index) {
        const len = this.length;
        return {
            top: this.reel[(index - 1 + len) % len],
            center: this.reel[index],
            bottom: this.reel[(index + 1) % len]
        };
    }

    render(window) {
        this.$top.attr("src", this.symbolMap[window.top]);
        this.$center.attr("src", this.symbolMap[window.center]);
        this.$bottom.attr("src", this.symbolMap[window.bottom]);
    }

    spinTo(finalIndex) {
        const totalSteps =
            (this.rotations * this.length) +
            ((finalIndex - this.currentIndex + this.length) % this.length);

        let step = 0;

        return new Promise(resolve => {
            const tick = () => {
                this.currentIndex = (this.currentIndex + 1) % this.length;
                this.render(this.getWindow(this.currentIndex));

                step++;

                if (step >= totalSteps) {
                    resolve(this.currentIndex);
                    return;
                }

                const remaining = totalSteps - step;

                const delay =
                    remaining < this.slowdownSteps
                        ? this.stepDuration * (1 + (this.slowdownSteps - remaining))
                        : this.stepDuration;

                setTimeout(tick, delay);
            };

            tick();
        });
    }
}
