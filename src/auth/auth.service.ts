import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
    ConflictException,
    ForbiddenException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';

import {
    InjectRepository,
} from '@mikro-orm/nestjs';

import {
    EntityManager,
    EntityRepository,
} from '@mikro-orm/postgresql';

import { User } from 'src/entities/user.entity';
import { DeviceType } from 'src/enums/enums';
import jwt from 'jsonwebtoken';
import { Session } from 'src/entities/session.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

    private readonly REFRESH_TOKEN_EXPIRY_DAYS =
        30;

    private readonly MAX_ACTIVE_SESSIONS =
        5;

    constructor(

        @InjectRepository(User)
        private readonly userRepository:
            EntityRepository<User>,

        @InjectRepository(Session)
        private readonly sessionRepository:
            EntityRepository<Session>,

        private readonly em:
            EntityManager,

        private readonly configService:
            ConfigService,
    ) { }

    private getRefreshTokenExpiryDate():
        Date {

        const currentDate =
            new Date();

        currentDate.setDate(
            currentDate.getDate() +
            this
                .REFRESH_TOKEN_EXPIRY_DAYS,
        );

        return currentDate;
    }

    private generateAccessToken(
        userId: string,
        sessionId: string,
    ): string {

        return jwt.sign(
            {
                userId,
                sessionId,
            },
            this.configService.getOrThrow<string>(
                'JWT_ACCESS_SECRET',
            ),
            {
                expiresIn: '15m',
            },
        );
    }

    private generateRefreshToken(
        userId: string,
        sessionId: string,
    ): string {

        return jwt.sign(
            {
                userId,
                sessionId,
            },
            this.configService.getOrThrow<string>(
                'JWT_REFRESH_SECRET',
            ),

            {
                expiresIn: '30d',
            },
        );
    }

    private getDeviceType(
        userAgent: string,
    ): DeviceType {

        const lowerCaseUserAgent =
            userAgent.toLowerCase();

        if (
            lowerCaseUserAgent.includes(
                'android',
            )
        ) {
            return DeviceType.ANDROID;
        }

        if (
            lowerCaseUserAgent.includes(
                'iphone',
            )
        ) {
            return DeviceType.IOS;
        }

        if (
            lowerCaseUserAgent.includes(
                'mozilla',
            )
        ) {
            return DeviceType.WEB;
        }

        return DeviceType.UNKNOWN;
    }

    async registerUser(
        email: string,
        password: string,
        name?: string,
    ) {

        const existingUser =
            await this.userRepository
                .findOne({
                    email,
                    deletedAt: null,
                });

        if (existingUser) {
            throw new ConflictException(
                'User already exists',
            );
        }

        const hashedPassword =
            await bcrypt.hash(
                password,
                10,
            );

        const user =
            this.userRepository.create({
                email,
                password:
                    hashedPassword,
                name,
            });

        await this.em.persistAndFlush(
            user,
        );

        return {
            success: true,
            message:
                'User registered successfully',
        };
    }

    async loginUser(
        email: string,
        password: string,
        userAgent: string,
    ) {

        const user =
            await this.userRepository
                .findOne({
                    email,
                    deletedAt: null,
                });

        if (!user) {
            throw new UnauthorizedException(
                'Invalid credentials',
            );
        }

        const isPasswordValid =
            await bcrypt.compare(
                password,
                user.password,
            );

        if (!isPasswordValid) {
            throw new UnauthorizedException(
                'Invalid credentials',
            );
        }

        const activeSessions =
            await this.sessionRepository
                .find({
                    user: user.id,
                    revokedAt: null,
                });

        const validSessions =
            activeSessions.filter(
                session =>
                    session.expiresAt >
                    new Date(),
            );

        if (
            validSessions.length >=
            this.MAX_ACTIVE_SESSIONS
        ) {
            throw new ForbiddenException(
                `Maximum active sessions reached`,
            );
        }

        const session =
            this.sessionRepository
                .create({
                    user,
                    userAgent,
                    deviceType:
                        this.getDeviceType(
                            userAgent,
                        ),
                    expiresAt:
                        this.getRefreshTokenExpiryDate(),
                });

        await this.em.persistAndFlush(
            session,
        );

        const accessToken =
            this.generateAccessToken(
                user.id,
                session.id,
            );

        const refreshToken =
            this.generateRefreshToken(
                user.id,
                session.id,
            );

        session.hashedRefreshToken =
            await bcrypt.hash(
                refreshToken,
                10,
            );

        await this.em.flush();

        return {
            user,
            accessToken,
            refreshToken,
        };
    }

    async getProfile(
        userId: string,
    ): Promise<User> {

        const user =
            await this.userRepository
                .findOne(
                    {
                        id: userId,
                    },
                    {
                        populate: [
                            'learnerType',
                            'schoolProfile.schoolBoard',
                            'collegeProfile.degree',
                            'collegeProfile.department',
                            'workingProfessionalProfile.designation',
                            'workingProfessionalProfile.department',
                        ],
                    },
                );

        if (!user) {
            throw new NotFoundException(
                'User not found',
            );
        }

        return user;
    }

    async refreshAccessToken(
        refreshToken: string,
    ) {

        let decoded:
            | jwt.JwtPayload
            | string;

        try {

            decoded = jwt.verify(
                refreshToken,
                process.env
                    .JWT_REFRESH_SECRET as string,
            );

        } catch {

            throw new UnauthorizedException(
                'Invalid refresh token',
            );
        }

        if (
            typeof decoded ===
            'string'
        ) {
            throw new UnauthorizedException(
                'Invalid refresh token',
            );
        }

        const session =
            await this.sessionRepository
                .findOne({
                    id: decoded
                        .sessionId as string,
                    revokedAt: null,
                });

        if (!session) {
            throw new UnauthorizedException(
                'Session not found',
            );
        }

        if (
            session.expiresAt <
            new Date()
        ) {
            throw new UnauthorizedException(
                'Session expired',
            );
        }

        if (
            !session.hashedRefreshToken
        ) {
            throw new UnauthorizedException(
                'Invalid session',
            );
        }

        const isRefreshTokenValid =
            await bcrypt.compare(
                refreshToken,
                session.hashedRefreshToken,
            );

        if (
            !isRefreshTokenValid
        ) {
            throw new UnauthorizedException(
                'Invalid refresh token',
            );
        }

        const accessToken =
            this.generateAccessToken(
                decoded.userId as string,
                session.id,
            );

        return {
            accessToken,
        };
    }

    async logout(
        sessionId: string,
    ) {

        const session =
            await this.sessionRepository
                .findOne({
                    id: sessionId,
                });

        if (!session) {
            throw new NotFoundException(
                'Session not found',
            );
        }

        session.revokedAt =
            new Date();

        await this.em.flush();

        return {
            success: true,
        };
    }

    async logoutAllSessions(
        userId: string,
    ) {

        const sessions =
            await this.sessionRepository
                .find({
                    user: userId,
                    revokedAt: null,
                });

        sessions.forEach(
            session => {

                session.revokedAt =
                    new Date();
            },
        );

        await this.em.flush();

        return {
            success: true,
        };
    }
}