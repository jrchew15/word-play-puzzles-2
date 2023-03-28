export interface user {
    id: number;
    username: string;
    profilePicture?: string | File;
    totalWordgons: number;
    totalWordles: number;
    createdAt?: string;
    email?: string;
    theme?: string;
    openSessions?: number[];
    openWordles?: number[];
}

export interface loadedUser extends user {
    openSessions: number[];
    openWordles: number[];
}

export interface userSignup {
    password: string;
    username: string;
    email: string;
    profilePicture?: string | File;
}

export const userPlaceholder = {
    id: 0,
    username: '',
    totalWordgons: 0,
    totalWordles: 0
}
