import { createClient, RedisClientType } from "@redis/client";

export type RedisClientInternal = RedisClientType<any, any, any>;

export const InitRedis = async (url: string): Promise<RedisClientInternal> => {
    const client = await createClient({
        url: url,
    });

    await client.connect();

    return client as RedisClientType<any, any, any>;
};
