import {
  Module,
} from '@nestjs/common';

import {
  MikroOrmModule,
} from '@mikro-orm/nestjs';

import {
  AuthController,
} from './auth.controller';

import {
  AuthService,
} from './auth.service';
import { User } from 'src/entities/user.entity';
import { Session } from 'src/entities/session.entity';



@Module({
  imports: [
    MikroOrmModule.forFeature([
      User,
      Session,
    ]),
  ],

  controllers: [
    AuthController,
  ],

  providers: [
    AuthService,
  ],

  exports: [
    AuthService,
  ],
})
export class AuthModule { }