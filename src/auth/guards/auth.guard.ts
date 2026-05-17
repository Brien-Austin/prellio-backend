import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

import jwt from 'jsonwebtoken';

import {
    ConfigService,
} from '@nestjs/config';

import {
    JwtPayloadType,
} from '../auth.types';

@Injectable()
export class JwtAuthGuard
    implements CanActivate {

    constructor(
        private readonly configService:
            ConfigService,
    ) { }

    canActivate(
        context: ExecutionContext,
    ): boolean {

        const request =
            context
                .switchToHttp()
                .getRequest();

        const authorizationHeader =
            request.headers.authorization;

        if (!authorizationHeader) {
            throw new UnauthorizedException(
                'Authorization header missing',
            );
        }

        const [
            type,
            token,
        ] =
            authorizationHeader.split(
                ' ',
            );

        if (
            type !== 'Bearer' ||
            !token
        ) {
            throw new UnauthorizedException(
                'Invalid authorization format',
            );
        }

        try {

            const decoded =
                jwt.verify(
                    token,
                    this.configService.getOrThrow<string>(
                        'JWT_ACCESS_SECRET',
                    ),
                ) as JwtPayloadType;

            request.userId =
                decoded.userId;

            return true;

        } catch {

            throw new UnauthorizedException(
                'Invalid token',
            );
        }
    }
}