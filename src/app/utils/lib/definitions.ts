export type User = {
    dni?: string;
    name?: string;
    surname?: string;
    username?: string;
    email?: string;
    phone?: string;
    birthdate?: string;
    password?: string;
    aidsCompleted?: Date[];
    ratings?: UserRating[];
    receivedMessages?: Message[];
};

export type HelpPublication = {
    id?: number;
    title?: string;
    description?: string;
    media?: string[];
    userUsername?: string;
    tags?: string[];
    publicationDate?: string;
    comments?: Comment[];
    editDate?: string;
    helperUsername?: string;
};

export type Comment = {
    id?: number;
    text?: string;
    publicationDate?: string;
    editDateTime?: string;
    userUsername?: string;
    helpPublicationId?: number;
};

export type UserRating = {
    ratedByUsername?: string;
    ratingUserUsername?: string;
    rating?: number;
    message?: string;
    id?: number;
};

export type Message = {
    senderUsername?: string;
    receiverUsername?: string;
    message?: string;
    date?: string;
    id?: number;
};

