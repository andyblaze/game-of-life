export default class TownPopup {
  constructor(popupSelector = "#town-popup") {
    this.$popup = $(popupSelector);

    this.bindEvents();
  }
  bindEvents() {
    // Town click (delegated)
    $(document).on("click", ".town", (e) => {
      e.stopPropagation(); // stop document click from closing it

      const $town = $(e.currentTarget);
      const name = $town.data("name");

      this.show(name, e.pageX, e.pageY);
    });

    // Click anywhere else closes popup
    $(document).on("click", () => {
      this.hide();
    });
  }
  show(name, x, y) {
    this.$popup
      .text(name)
      .css({
        left: x + 10,
        top: y + 10
      })
      .fadeIn(250);
  }
  hide() {
    this.$popup.fadeOut(250);
  }
}
