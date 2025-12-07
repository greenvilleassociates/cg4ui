import User from "./user";

export default interface Review {
    author: User;
    rating: number;
    review: string;
    dateWritten?: Date string | null;
    dateVisited?: Date | null;
    active?: boolean;
}