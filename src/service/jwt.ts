import jwt, { JwtPayload } from "jsonwebtoken";
import { JWTRepository } from "../repository/jwt";
import { v4 as uuidv4 } from "uuid";
import { Token, JWTPayload } from "../entity/jwt";
import { ErrorType } from "../utils/errors";

export interface JWTService {
    GenerateToken(payload: JWTPayload): Promise<Token>;
    VerifyJWT(token: string): JWTPayload | null;
    RefreshToken(refreshToken: string): Promise<Token>;
}

export class JWTServiceImpl implements JWTService {
    secretKey: string;
    accessTokenExpiry: number;
    refreshTokenExpiry: number;
    repository: JWTRepository;

    constructor(
        secretKey: string,
        accessTokenExpiry: number,
        refreshToken: number,
        jwtRepo: JWTRepository
    ) {
        (this.secretKey = secretKey),
            (this.accessTokenExpiry = accessTokenExpiry),
            (this.refreshTokenExpiry = refreshToken),
            (this.repository = jwtRepo);
    }

    async RefreshToken(refreshToken: string): Promise<Token> {
        const payload = await this.repository.GetToken(refreshToken);
        if (payload == null) {
            throw ErrorType.ErrNotFound("refresh token is invalid or expired");
        }

        const accesToken = jwt.sign(payload, this.secretKey, {
            expiresIn: this.accessTokenExpiry,
        });

        return {
            accessToken: accesToken,
            refreshToken: refreshToken,
        };
    }

    async GenerateToken(payload: JWTPayload): Promise<Token> {
        const accesToken = jwt.sign(payload, this.secretKey, {
            expiresIn: this.accessTokenExpiry,
        });

        const refreshToken: string = uuidv4();

        await this.repository.CacheToken(
            refreshToken,
            payload,
            this.refreshTokenExpiry
        );

        return {
            accessToken: accesToken,
            refreshToken: refreshToken,
        } as Token;
    }

    VerifyJWT(token: string): JWTPayload {
        try {
            const payload = jwt.verify(token, this.secretKey) as JwtPayload;
            return {
                id: payload.id,
                username: payload.username,
            };
        } catch (e: any) {
            if (e.message === "invalid signature") {
                throw ErrorType.ErrUnauthorized("token is invalid or expired");
            }
            throw e;
        }
    }
}
