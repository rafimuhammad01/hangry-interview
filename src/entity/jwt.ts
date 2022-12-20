export type JWTPayload = {
    id: number;
    username: string;
};

export type Token = {
    accessToken: string;
    refreshToken: string;
};
