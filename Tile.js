export default class Tile {
  #tileElement;
  #x;
  #y;
  #tileContent;
  constructor(tileContainer, value = Math.random() > 0.5 ? 2 : 4) {
    this.#tileElement = document.createElement("div");
    this.#tileElement.classList.add("tile");
    tileContainer.append(this.#tileElement);
    this.tileContent = value;
  }

  set tileContent(value) {
    this.#tileContent = value;
    this.#tileElement.textContent = value;
    const power = Math.log2(value);
    const backgroundLightness = 100 - power * 9;
    this.#tileElement.style.setProperty(
      "--background-lightness",
      `${backgroundLightness}%`
    );
    this.#tileElement.style.setProperty(
      "--text-lightness",
      `${backgroundLightness <= 50 ? 90 : 10}%`
    );
  }

  set x(x) {
    this.#x = x;
    this.#tileElement.style.setProperty("--x", x);
  }

  set y(y) {
    this.#y = y;
    this.#tileElement.style.setProperty("--y", y);
  }

  get tileContent() {
    return this.#tileContent;
  }

  remove() {
    this.#tileElement.remove();
  }

  waitForTransition(animation = false) {
    return new Promise((resolve) => {
      this.#tileElement.addEventListener(
        animation ? "animationend" : "transitionend",
        resolve,
        {
          once: true,
        }
      );
    });
  }
}
