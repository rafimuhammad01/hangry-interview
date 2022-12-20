export type Env = {
    REDIS_URL: string;
    PORT: string;
    DATABASE_URL: string;
    SALT: number;
    JWT_SECRET: string;
    ACCESS_TOKEN_EXP: number;
    REFRESH_TOKEN_EXP: number;
};
