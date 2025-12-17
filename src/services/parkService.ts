import IPark from "../models/park";

export default class ParkService {
    public parks: IPark[] = [];

    // Helper to fetch parks from remote API
private async fetchRemoteParks(): Promise<IPark[]> {
    try {
        const response = await fetch("https://parksapi.547bikes.info/api/CGParks");
        if (!response.ok) {
            throw new Error(`Failed to fetch parks: ${response.statusText}`);
        }
        const data = await response.json();
		console.log("dirtbikeapi",data);
        const today = new Date().toISOString();

        // Reset dates to today
        const normalized = (data as IPark[]).map((park) => ({
            ...park,
            reviews: park.reviews?.map((review) => ({
                ...review,
                author: {
                    ...review.author,
                    dateOfBirth: today
                },
                dateWritten: today,
                dateVisited: today
            })) || []
        }));

        return normalized;
    } catch (error) {
        console.error("Error fetching remote parks:", error);
        return []; // fallback to empty if API fails
    }
}

    // Get all parks (local + remote)
    getAllParks: () => Promise<IPark[]> = async () => {
        const localParks = mockData.map((val) => JSON.parse(JSON.stringify(val)));
        const remoteParks = await this.fetchRemoteParks();
		
        const combined = [...remoteParks, ...localParks];

        return new Promise((res) => {
            setTimeout(() => {
                res(combined);
            }, 300);
        });
    };

    // Get park by ID (searches both local + remote)
    getParkById: (id: string) => Promise<IPark | undefined> = async (id: string) => {
        const localParks = mockData.map((val) => JSON.parse(JSON.stringify(val)));
        const remoteParks = await this.fetchRemoteParks();

        const combined = [...localParks, ...remoteParks];
        const found = combined.find((park) => park.id === id);

        return new Promise((res) => {
            setTimeout(() => {
                res(found);
            }, 500);
        });
    };
}

// --- Static mock data with augmented reviews ---
const mockData: IPark[] = [
    {
        parkName: "Motobike Mayhem",
        id: "92ed4740-12d9-4573-a8f1-c883ca216a00",
        location: "Springwood, CO",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
        adultPrice: 25,
        childPrice: 15,
	someLat: 0.0,
	someLong: 0.0,
	parkId: 1001,
        imageUrl: "https://placehold.co/600x400/334155/FFF?text=Motobike+Mayhem",
        reviews: [
            {
                author: {
                    id: "17fa0861-d120-4cd8-a24b-f9a579ecbf17",
                    displayName: "Moto R. Bike",
                    fullName: "James Sheldon",
                    dateOfBirth: "1987-04-23T18:25:43.511Z"
                },
                rating: 5,
                dateWritten: "2025-09-15T12:30:32.594Z",
                dateVisited: "2025-09-13T00:00:00.000Z",
                review: "Phenomenal park!"
            },
            // --- Augmented Reviews ---
            {
                author: { id: "a1", displayName: "Trail Blazer", fullName: "Sarah Johnson", dateOfBirth: "1990-05-14T00:00:00.000Z" },
                rating: 5,
                dateWritten: "2025-09-20T10:15:00.000Z",
                dateVisited: "2025-09-18T00:00:00.000Z",
                review: "The rides were thrilling and the staff was super friendly. Highly recommend!"
            },
            {
                author: { id: "b2", displayName: "Speed Seeker", fullName: "Carlos Martinez", dateOfBirth: "1985-11-02T00:00:00.000Z" },
                rating: 4,
                dateWritten: "2025-09-19T14:45:00.000Z",
                dateVisited: "2025-09-17T00:00:00.000Z",
                review: "Great park overall, though I wish there were more shaded rest areas."
            },
            {
                author: { id: "c3", displayName: "Moto Queen", fullName: "Emily Davis", dateOfBirth: "1993-03-22T00:00:00.000Z" },
                rating: 5,
                dateWritten: "2025-09-18T09:00:00.000Z",
                dateVisited: "2025-09-16T00:00:00.000Z",
                review: "Absolutely loved the adrenaline rush. The hills were perfectly designed!"
            },
            {
                author: { id: "d4", displayName: "Ride Master", fullName: "David Lee", dateOfBirth: "1978-07-09T00:00:00.000Z" },
                rating: 4,
                dateWritten: "2025-09-17T16:20:00.000Z",
                dateVisited: "2025-09-15T00:00:00.000Z",
                review: "Fun experience! Some rides were a bit crowded but still worth the wait."
            },
            {
                author: { id: "e5", displayName: "Adventure Addict", fullName: "Olivia Brown", dateOfBirth: "2000-01-30T00:00:00.000Z" },
                rating: 5,
                dateWritten: "2025-09-16T11:10:00.000Z",
                dateVisited: "2025-09-14T00:00:00.000Z",
                review: "Best park I’ve visited in years. Smooth rides and great atmosphere!"
            }
        ]
    },
    {
        parkName: "Crossbar Parkway",
        id: "fc099512-96d4-497a-a42f-d7b3967abc03",
        location: "Springwood, CO",
        description: "This park boasts extreme hills and fun drops for all thrill-seekers.",
        adultPrice: 25,
        childPrice: 15,
	someLat: 0.0,
	someLong: 0.0,
	parkId: 1002,
        imageUrl: "https://placehold.co/600x400/3321a5/FFF?text=Crossbar+Parkway",
        reviews: [
            {
                author: {
                    id: "17fa0861-d120-4cd8-a24b-f9a579ecbf17",
                    displayName: "Moto R. Bike",
                    fullName: "James Sheldon",
                    dateOfBirth: "1987-04-23T18:25:43.511Z"
                },
                rating: 0,
                dateWritten: "2025-09-12T12:30:32.594Z",
                dateVisited: "2025-09-11T00:00:00.000Z",
                review: "Phenomenal park!"
            },
            // --- Augmented Reviews ---
            {
                author: { id: "f6", displayName: "Hill Thrill", fullName: "Michael Thompson", dateOfBirth: "1982-09-12T00:00:00.000Z" },
                rating: 5,
                dateWritten: "2025-09-20T13:00:00.000Z",
                dateVisited: "2025-09-18T00:00:00.000Z",
                review: "The drops were exhilarating! Perfect for thrill-seekers."
            },
            {
                author: { id: "g7", displayName: "Slope Rider", fullName: "Anna Wilson", dateOfBirth: "1995-12-05T00:00:00.000Z" },
                rating: 4,
                dateWritten: "2025-09-19T15:30:00.000Z",
                dateVisited: "2025-09-17T00:00:00.000Z",
                review: "Loved the hills, though the food options could be better."
            },
            {
                author: { id: "h8", displayName: "Thrill Rider", fullName: "Jason Clark", dateOfBirth: "1988-08-21T00:00:00.000Z" },
                rating: 5,
                dateWritten: "2025-09-18T12:45:00.000Z",
                dateVisited: "2025-09-16T00:00:00.000Z",
                review: "Crossbar Parkway exceeded my expectations. Smooth rides and breathtaking views."
            },
            {
                author: { id: "i9", displayName: "Drop Lover", fullName: "Sophia Taylor", dateOfBirth: "1992-04-11T00:00:00.000Z" },
                rating: 4,
                dateWritten: "2025-09-17T17:10:00.000Z",
                dateVisited: "2025-09-15T00:00:00.000Z",
                review: "Exciting rides, though a bit too intense for younger kids."
            }
            ]}]
    
            
