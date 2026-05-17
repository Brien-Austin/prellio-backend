import {
  Module,
} from '@nestjs/common';

import {
  ConfigModule,
} from '@nestjs/config';

import {
  MikroOrmModule,
} from '@mikro-orm/nestjs';

import mikroOrmConfig
  from '../mikro-orm.config';

import {
  AuthModule,
} from './auth/auth.module';

import {
  UsersModule,
} from './user/user.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MikroOrmModule.forRoot(
      mikroOrmConfig,
    ),

    AuthModule,

    UsersModule,

    CommonModule,
  ],
})
export class AppModule { }