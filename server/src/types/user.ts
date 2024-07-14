export interface User {
    name: string;
    email: string;
    picture: string;
    google_identifier: string;
    role: ObjectId | string;
}

export interface UserFull extends User, Doc {}
