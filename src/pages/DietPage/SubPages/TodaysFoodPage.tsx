type Entry = {
    food: string;
    time: string;
    ammount: string;
    protein: string;
    fat: string;
    carbs: string
}

function TodaysFoodPage() {
    const todaysEntries: Entry[] = [
        {
            food: "Grilled Chicken Breast",
            time: "12:30",
            ammount: "200g",
            protein: "62g",
            fat: "7g",
            carbs: "0g"
        },
        {
            food: "Brown Rice",
            time: "12:30",
            ammount: "1 cup",
            protein: "5g",
            fat: "2g",
            carbs: "45g"
        },
        {
            food: "Broccoli",
            time: "12:30",
            ammount: "150g",
            protein: "4g",
            fat: "0.5g",
            carbs: "10g"
        },
        {
            food: "Oatmeal with Banana",
            time: "08:00",
            ammount: "60g oats + 1 banana",
            protein: "12g",
            fat: "5g",
            carbs: "78g"
        },
        {
            food: "Greek Yogurt",
            time: "16:00",
            ammount: "200g",
            protein: "20g",
            fat: "8g",
            carbs: "9g"
        },
        {
            food: "Salmon",
            time: "19:30",
            ammount: "180g",
            protein: "40g",
            fat: "24g",
            carbs: "0g"
        },
        {
            food: "Protein Bar",
            time: "22:00",
            ammount: "1 bar",
            protein: "20g",
            fat: "9g",
            carbs: "22g"
        }
    ];

    return (
        <div>
            {todaysEntries.map((entry) => (
                <div className="br-white rounded-lg shadow p-5 border border-gray-200 hover:shadow-md transition">
                    <div className="d-flex flex-row gap-2"> 
                        <p>{entry.time}</p>
                        <p>{entry.food}</p>
                        <p>{entry.ammount}</p>
                    </div>
                    <div className="d-flex flex-row gap-2"> 
                        <p>Protein: {entry.protein}</p>
                        <p>Fat: {entry.fat}</p>
                        <p>Carbs: {entry.carbs}</p>
                    </div>
                    <br></br>
                </div>
            ))}
        </div>
    )
}
export default TodaysFoodPage