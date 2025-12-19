import placeAdder from "./place-adder.js";
import SeaEvents from "./sea-events.js";
import EventsObservable from "./events-observable.js";
import { checkOrientation } from "./functions.js";


const p = new placeAdder();
p.init();    
const ambientEvents = new EventsObservable();
ambientEvents.add(new SeaEvents($("#events-text")));

$(window).on("resize", checkOrientation);

$(document).on("click", ".town", function (e) {
  const name = $(this).data("name");
    const $popup = $("#town-popup");
  $popup.text(name);

  $popup.css({
    left: e.pageX + 10,
    top: e.pageY + 10
  }).fadeIn(250);
});
$(document).on("click", function (e) {
  if (!$(e.target).closest(".town").length) {
   $("#town-popup").fadeOut(250);
  }
});

let lastTime = 0;
function animate(time) {
    const dt = (time - lastTime); // ms
    lastTime = time;
    ambientEvents.notify(dt);
    requestAnimationFrame(animate);
}

animate(performance.now());