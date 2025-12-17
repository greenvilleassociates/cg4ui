import Review from "./review";

// You can use whatever data type for ID as long as it's guaranteed unique
// Here we use GUIDs because they're almost guaranteed unique
// and any other id system is abnormal and honestly worse in my opinion
export default interface IPark {
    parkName: string;
    id: string;
    location: string;
    description: string;
    reviews: Review[];
    imageUrl?: string;
    adultPrice: number;
    childPrice: number;
    //ADDED BY JOHN STRITZINGER TO NORMALIZE SCHEMAS BETWEEN CGUI AND PARKS DB.
    parkId: number;
    someLat: number;
    someLong: number;
    maxVisitors: number;
    currentVisitors: number;
    reviewAverage: number;
}
