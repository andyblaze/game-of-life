export default class Newspaper {
    update(formBook) {
        this.printSummary(formBook);
    }

    printSummary(formBook) {
        const id = 34;
        const horse = formBook.getHorse(id);
        console.log(
            horse.name,
            formBook.getTrainerName(horse.trainerId),
            formBook.placingsFor(id, 3),
            "from",
            formBook.runsFor(id)
        );
        const topTrainers = formBook.topTrainersByPlacings(3, 8);
        let result = "";
        for ( let t of topTrainers )
            result += formBook.getTrainerName(t.trainerId) + " " + t.placings + "\n";
        console.log(result);
    }
}
