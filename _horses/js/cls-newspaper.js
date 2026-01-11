export default class Newspaper {
    update(formBook) {
        this.printSummary(formBook);
    }

    printSummary(formBook) {
        const id = 34;
        console.log(
            formBook.getHorseName(id),
            formBook.placingsFor(id, 3),
            "from",
            formBook.runsFor(id)
        );
        const topTrainers = formBook.topTrainersByPlacings();
        let result = "";
        for ( let t of topTrainers )
            result += formBook.getTrainerName(t.trainerId) + " " + t.placings + "\n";
        console.log(result);
    }
}
