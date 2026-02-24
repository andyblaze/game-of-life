import { byQsArray } from "./functions.js";

export default class TooltipHelp {
    static init(targetClass, tipClass) {
        byQsArray(targetClass).forEach(help => {
            help.addEventListener("click", e => {
                e.stopPropagation();
                // remove existing tooltip
                byQsArray(tipClass).forEach(t => t.remove());
                const tooltip = document.createElement("div");
                tooltip.className = tipClass.replace(".", "");// "help-tooltip";
                tooltip.textContent = help.dataset.help;
                help.appendChild(tooltip);
            });
        });
        // close tooltip when clicking elsewhere
        document.addEventListener("mousedown", () => {
            byQsArray(tipClass).forEach(t => t.remove());
        });
    }
}