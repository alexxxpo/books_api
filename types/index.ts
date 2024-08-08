export type BookType = {
    author?: string;
    title?: string;
    genres?: string;
    publicationDate?: string;
}

export type UserType = {
    username?: string;
    email?: string;
    password?: string;
}

export type AuthUser = {
    userId: number;
    iat: number;
    rights: number;
}

export type ResErrorType = {
    error: string;
}