import { json } from "express";
import { JwtPayload } from "jsonwebtoken";
import { RedisClientInternal } from "../database/redis/index";

export interface JWTRepository {
    CacheToken(refreshToken: string, payload: JwtPayload, exp: number): void;
    GetToken(refreshToken: string): Promise<JwtPayload>;
}

export class JWTRepositoryImpl implements JWTRepository {
    redis: Promise<RedisClientInternal>;

    constructor(redisClient: Promise<RedisClientInternal>) {
        this.redis = redisClient;
    }

    async GetToken(refreshToken: string): Promise<JwtPayload> {
        const payload = await (await this.redis).get(refreshToken);
        return JSON.parse(payload) as JwtPayload;
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
