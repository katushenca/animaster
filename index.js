addListeners();
let heartBeating = null;

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

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 1000, {x: 100, y: 20});
        })

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            heartBeating = animaster().heartBeating(block, 1000);
        })

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            heartBeating.stop();
        });
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

function animaster() {

    let timer = null;

    function resetFadeIn(element){
        element.style.transitionDuration = null;
        element.classList.add('hide');
        element.classList.remove('show');
    }

    function resetFadeOut(element){
        element.style.transitionDuration = null;
        element.classList.add('show');
        element.classList.remove('hide');
    }

    function resetMove(element){
        element.style.transitionDuration = null;
        element.style.transform = null;
    }

    function resetScale(element){
        element.style.transitionDuration = null;
        element.style.transform = null;
    }

    return {
        /**
         * Блок плавно появляется из прозрачного.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */

        fadeOut(element, duration) {
            resetFadeOut(element);
            setTimeout(() => {
                element.style.transitionDuration = `${duration}ms`;
                element.classList.remove('show');
                element.classList.add('hide');
            }, 0);
        },

        fadeIn(element, duration) {
            resetFadeIn(element);
            setTimeout(() => {
                element.style.transitionDuration = `${duration}ms`;
                element.classList.remove('hide');
                element.classList.add('show');
            }, 1);
        },

        /**
         * Функция, передвигающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param translation — объект с полями x и y, обозначающими смещение блока
         */
        move(element, duration, translation) {
            resetMove(element);
            setTimeout(() => {
                element.style.transitionDuration = `${duration}ms`;
                element.style.transform = getTransform(translation, null);
            }, 10)

        },

        /**
         * Функция, увеличивающая/уменьшающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
         */
        scale(element, duration, ratio) {
            resetScale(element)
            setTimeout(() => {
                element.style.transitionDuration = `${duration}ms`;
                element.style.transform = getTransform(null, ratio);
            }, 10);
        },

        moveAndHide(element, duration, translation) {
            this.move(element, 2 * duration / 5, translation);
            setTimeout(this.fadeOut, 2 * duration / 5, element, 3 * duration / 5);
        },

        showAndHide(element, duration) {
            this.fadeIn(element, duration / 3);
            setTimeout(this.fadeOut, duration / 3, element, duration / 3)
        },

        heartBeating(element, duration) {
            let timer = setInterval(() => {
                this.scale(element, duration / 2, 1.4);
                setTimeout(this.scale, duration / 2, element, duration / 2, 1 / 1.4);
            }, duration);

            return {
                stop: () => {
                    clearInterval(timer);
                }
            };
        }
    }
}
