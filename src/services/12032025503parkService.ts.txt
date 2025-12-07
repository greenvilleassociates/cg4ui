import IPark from "../models/park";

export default class 12032025ParkService {
    public parks: IPark[] = [];

   getAllParks: () => Promise<IPark[]> = async () => {
    console.log("getAllParks called...");

    try {
        const response = await fetch("https://parksapi.547bikes.info/api/Parks");
        console.log("API responded with status:", response.status);

        if (!response.ok) {
            throw new Error(`Failed to fetch parks: ${response.statusText}`);
        }

        const apiJson = await response.json();
        console.log("Raw API JSON:", apiJson);

        // 👉 Filter raw JSON before mapping
        const filteredapiJson = apiJson.filter((p: any) => p.motocross === 1);
        console.log("Filtered API JSON (motocross only):", filteredapiJson);

        // Map filtered JSON into IPark objects
        const apiParks: IPark[] = filteredapiJson.map((p: any) => ({
            id: p.id,
            parkName: p.name,
            location: p.address,
            description: p.description,
            adultPrice: p.adultPrice,
            childPrice: p.childPrice,
            imageUrl: p.pic1url,
            reviews: p.reviews ?? [],
            motocross: p.motocross
        }));

        console.log("Mapped motocross API parks:", apiParks);

        // Combine with ALL mockData (no filtering)
        const combined: IPark[] = [...apiParks, ...mockData];
        console.log("Combined parks (motocross API + all mockData):", combined);

        return combined;
    } catch (err) {
        console.error("Error in getAllParks:", err);
        // Fallback to mockData only
        return mockData;
    }
};


getParkById = async (id: string): Promise<IPark | undefined> => {
    console.log(`getParkById called with id=${id}`);

    try {
        // Fetch ALL parks
        const response = await fetch(`https://parksapi.547bikes.info/api/Parks`);
        console.log("API responded with status:", response.status);

        if (response.ok) {
            const parks = await response.json();

            // Find the one matching the ID
            const p = parks.find((park: any) => park.id === id);

            if (p) {
                const park: IPark = {
                    id: p.id,
                    parkName: p.name,
                    location: p.address,
                    description: p.description,
                    adultPrice: p.adultPrice,
                    childPrice: p.childPrice,
                    imageUrl: p.pic1url,
                    reviews: p.reviews ?? []
                };

                console.log("Returning matched park:", park);
                return park;
            }
        }
    } catch (err) {
        console.error("Error in getParkById:", err);
    }

    // Fallback to mock data
    const fallback = mockData.find((p) => p.id === id);
    console.log("Returning park from mockData:", fallback);
    return fallback;
};
}



// 🗒️ Static mockData
const mockData: IPark[] = [
    {
        id: "92ed4740-12d9-4573-a8f1-c883ca216a00",
        parkName: "Motobike Mayhem",
        location: "Springwood, CO",
        description: "Lorem ipsum dolor sit amet...",
        adultPrice: 25,
        childPrice: 15,
        imageUrl: "https://placehold.co/600x400/334155/FFF?text=Motobike+Mayhem",
        reviews: []
    },
    {
        id: "fc099512-96d4-497a-a42f-d7b3967abc03",
        parkName: "Crossbar Parkway",
        location: "Springwood, CO",
        description: "This park boasts extreme hills...",
        adultPrice: 25,
        childPrice: 15,
        imageUrl: "https://placehold.co/600x400/3321a5/FFF?text=Crossbar+Parkway",
        reviews: []
    }
];


//Updated Code Takes MockData, and Adds API Data.


    /*
    // 🗒️ Old mock implementation (kept for reference)
    getAllParks: () => Promise<IPark[]> = async () => {
        const parks = mockData.map((val) => JSON.parse(JSON.stringify(val)))
        return new Promise((res) => {
            setTimeout(() => {
                res(parks)
            }, 300);
        });
    };

    getParkById: (id: string) => Promise<IPark> = async (id: string) => {
        const parks = mockData.map((val) => JSON.parse(JSON.stringify(val)));
        return new Promise((res) => {
            setTimeout(() => {
                res(parks.find((park) => park.id === id))
            }, 500)
        })
    }
    */

/*
const mockData = [
    {
        "parkName": "Motobike Mayhem",
        "id": "92ed4740-12d9-4573-a8f1-c883ca216a00",
        "location": "Springwood, CO",
        "description": "Lorem ipsum dolor sit amet...",
        "adultPrice": 25,
        "childPrice": 15,
        "imageUrl": "https://placehold.co/600x400/334155/FFF?text=Motobike+Mayhem",
        "reviews": [
            {
                "author": {
                    "id": "17fa0861-d120-4cd8-a24b-f9a579ecbf17",
                    "displayName": "Moto R. Bike",
                    "fullName": "James Sheldon",
                    "dateOfBirth": "1987-04-23T18:25:43.511Z"
                },
                "rating": 5,
                "dateWritten": "2025-09-15T12:30:32.594Z",
                "dateVisited": "2025-09-13T00:00:00.000Z",
                "review": "Phenomenal park!"
            }
        ]
    },
    {
        "parkName": "Crossbar Parkway",
        "id": "fc099512-96d4-497a-a42f-d7b3967abc03",
        "location": "Springwood, CO",
        "description": "This park boasts extreme hills...",
        "adultPrice": 25,
        "childPrice": 15,
        "imageUrl": "https://placehold.co/600x400/3321a5/FFF?text=Crossbar+Parkway",
        "reviews": []
    }
]
*/
