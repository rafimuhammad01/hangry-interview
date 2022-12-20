import { json } from "express";
import { JwtPayload } from "jsonwebtoken";
import { RedisClientInternal } from "../database/redis/index";

export interface JWTRepository {
    CacheToken(refreshToken: string, payload: JwtPayload, exp: number): void;
}

export class JWTRepositoryImpl implements JWTRepository {
    redis: Promise<RedisClientInternal>;

    constructor(redisClient: Promise<RedisClientInternal>) {
        this.redis = redisClient;
    }

    async CacheToken(
        refreshToken: string,
        payload: JwtPayload,
        exp: number
    ): Promise<void> {
        const payloadStr: string = JSON.stringify(payload);
        await (
            await this.redis
        ).set(refreshToken, payloadStr, {
            EX: exp,
        });
    }
}
