/* eslint-disable prettier/prettier */

import 'dotenv/config';
import 'reflect-metadata';

import {
    Logger,
    NotFoundException,
} from '@nestjs/common';

import {
    defineConfig,
    LoadStrategy,
    Platform,
    TextType,
    Type,
} from '@mikro-orm/core';

import {
    Migrator,
} from '@mikro-orm/migrations';

import {
    PostgreSqlDriver,
} from '@mikro-orm/postgresql';

import {
    TsMorphMetadataProvider,
} from '@mikro-orm/reflection';

import {
    SqlHighlighter,
} from '@mikro-orm/sql-highlighter';

const logger = new Logger('MikroORM');

const isProduction =
    process.env.NODE_ENV === 'production';

const config = defineConfig({

    entities: [
        './dist/**/*.entity.js',
    ],

    entitiesTs: [
        './src/**/*.entity.ts',
    ],

    driver: PostgreSqlDriver,

    clientUrl: "postgresql://postgres.xihoohqgzclszmswxzzf:YouAndSkill2026@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres",

    metadataProvider:
        TsMorphMetadataProvider,

    loadStrategy:
        LoadStrategy.JOINED,

    debug: !isProduction,

    logger: logger.log.bind(logger),

    highlighter: !isProduction
        ? new SqlHighlighter()
        : undefined,


    allowGlobalContext: false,

    discovery: {

        warnWhenNoEntities: true,

        getMappedType(
            type: string,
            platform: Platform,
        ) {

            if (type === 'string') {
                return Type.getType(
                    TextType,
                );
            }

            return platform.getDefaultMappedType(
                type,
            );
        },
    },

    driverOptions: {
        connection: {

            keepAlive: true,

            connectionTimeoutMillis:
                30000,

            ssl: isProduction
                ? {
                    rejectUnauthorized:
                        false,
                }
                : false,
        },
    },

    pool: {
        min: 2,
        max: 10,
        idleTimeoutMillis: 10000,
    },

    migrations: {

        tableName:
            'mikro_orm_migrations',

        path: './dist/migrations',

        pathTs:
            './src/migrations',

        glob: '!(*.d).{js,ts}',

        transactional: true,

        disableForeignKeys: true,

        allOrNothing: true,

        dropTables: false,

        safe: true,

        emit: 'ts',
    },

    extensions: [
        Migrator,
    ],

    findOneOrFailHandler: (
        entityName: string,
    ) => {

        throw new NotFoundException(
            `${entityName} not found`,
        );
    },
});

export default config;