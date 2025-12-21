
export default class placeAdder {  
    static getSvgCoords(evt, svg) {
        const pt = svg.createSVGPoint();
        pt.x = evt.clientX;
        pt.y = evt.clientY;
        return pt.matrixTransform(svg.getScreenCTM().inverse());
    }
    init() {
        const svg = $("#map svg");
        svg.on("click", function(e) {
            // ignore clicks on existing towns
            if (e.target.closest(".town")) return;
            let { x, y } = placeAdder.getSvgCoords(e, this);
            x = parseInt(x);
            y = parseInt(y);
            const name = prompt("Town name?");
            if (!name) return;

            $.post("add-town.php", {
                "x": x,
                "y": y,
                placeName: name
            })
            .done(function (res) {
                //console.log("Town added:", res);
                location.reload();
            })
            .fail(function (xhr) {
                console.error("Failed to add town:", xhr.responseText);
                alert("Failed to add town");
            });


            //const nl = "\n"; const t = "\t";
            //console.log(`${nl}<g class="town" id="${name.toLowerCase()}" data-name="${name}">${nl+t}<circle cx="${x}" cy="${y}" r="9" />${nl+t}<text x="${(x + 10)}" y="${(y + 4)}">${name}</text>${nl}</g>`);
        });
    }
}