export interface User {
    id?: number;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    profilePictureUrl?: string;
    coverPictureUrl?:string;
    bio:'';
    lastUpdated: string;
    location: string;
    website: string;
    company: string;
    occupation: string;
    about: string;
    githubUrl: string;
    linkedinUrl: string;
    twitterUrl: string;
    visibility: 'PUBLIC' | 'PRIVATE';
    emailVerified: boolean;
    phoneVerified: boolean;
}
