addListeners();
let heartBeating = null;
let moveAndHideAnimation = null;
function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 1000);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 1000);
        });
    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            if (moveAndHideAnimation) {
                moveAndHideAnimation.reset();
            }
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            moveAndHideAnimation = animaster().moveAndHide(block, 1000, {x: 100, y: 20});
        });
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            heartBeating = animaster().heartBeating(block, 1000);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            heartBeating.stop();
        });
}


function animaster() {
    let _steps = [];
    let timer = null;
    function resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.add('hide');
        element.classList.remove('show');
    }

    function resetFadeOut(element) {
        element.style.transitionDuration = null;
        element.classList.add('show');
        element.classList.remove('hide');
    }

    function resetMove(element) {
        element.style.transitionDuration = null;
        element.style.transform = null;
    }

    function resetScale(element) {
        element.style.transitionDuration = null;
        element.style.transform = null;
    }

    function _applyMove(element, duration, translation) {
        resetMove(element);
        setTimeout(() => {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        }, 0);
    }

    function _applyScale(element, duration, ratio) {
        resetScale(element);
        setTimeout(() => {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        }, 0);
    }

    function _applyFadeIn(element, duration) {
        resetFadeIn(element);
        setTimeout(() => {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        }, 0);
    }

    function _applyFadeOut(element, duration) {
        resetFadeOut(element);
        setTimeout(() => {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        }, 0);
    }
    return {
        addMove(duration, translation) {
            _steps.push({
                name: 'move',
                duration,
                translation
            });
            return this;
        },
        addScale(duration, ratio) {
            _steps.push({
                name: 'scale',
                duration,
                ratio
            });
            return this;
        },
        addFadeIn(duration) {
            _steps.push({
                name: 'fadeIn',
                duration
            });
            return this;
        },
        addFadeOut(duration) {
            _steps.push({
                name: 'fadeOut',
                duration
            });
            return this;
        },
        play(element) {
            let delay = 0;

            _steps.forEach(step => {
                switch (step.name) {
                    case 'move':
                        setTimeout(() => {
                            _applyMove(element, step.duration, step.translation);
                        }, delay);
                        delay += step.duration;
                        break;

                    case 'scale':
                        setTimeout(() => {
                            _applyScale(element, step.duration, step.ratio);
                        }, delay);
                        delay += step.duration;
                        break;

                    case 'fadeIn':
                        setTimeout(() => {
                            _applyFadeIn(element, step.duration);
                        }, delay);
                        delay += step.duration;
                        break;

                    case 'fadeOut':
                        setTimeout(() => {
                            _applyFadeOut(element, step.duration);
                        }, delay);
                        delay += step.duration;
                        break;
                }
            });
        },
        move(element, duration, translation) {
            _applyMove(element, duration, translation);
        },
        scale(element, duration, ratio) {
            _applyScale(element, duration, ratio);
        },
        fadeIn(element, duration) {
            _applyFadeIn(element, duration);
        },
        fadeOut(element, duration) {
            _applyFadeOut(element, duration);
        },
        moveAndHide(element, duration, translation) {
            const moveDuration = (2 * duration) / 5;
            this.move(element, moveDuration, translation);
            const hideDuration = (3 * duration) / 5;
            const hideTimeout = setTimeout(() => {
                this.fadeOut(element, hideDuration);
            }, moveDuration);
            return {
                reset: () => {
                    clearTimeout(hideTimeout);
                    resetMove(element);
                    resetFadeOut(element);
                }
            };
        },

        showAndHide(element, duration) {
            this.fadeIn(element, duration / 3);
            setTimeout(this.fadeOut, duration / 3, element, duration / 3);
        },

        heartBeating(element, duration) {
            timer = setInterval(() => {
                this.scale(element, duration / 2, 1.4);
                setTimeout(() => {
                    this.scale(element, duration / 2, 1);
                }, duration / 2);
            }, duration);
            return {
                stop: () => {
                    clearInterval(timer);
                }
            };
        }
    };
}

function getTransform(translation, ratio) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    return result.join(' ');
}
