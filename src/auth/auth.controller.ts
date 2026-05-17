import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
} from '@nestjs/common';

import {
  AuthService,
} from './auth.service';

import {
  LoginUserDto,
} from './dto/login-user.dto';

import {
  RefreshTokenDto,
} from './dto/refresh-token.dto';

import {
  RegisterUserDto,
} from './dto/register-user.dto';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService:
      AuthService,
  ) { }

  @Post('register')
  async registerUser(
    @Body()
    body: RegisterUserDto,
  ) {

    return this.authService
      .registerUser(
        body.email,
        body.password,
        body.name,
      );
  }

  @Post('login')
  async loginUser(
    @Body()
    body: LoginUserDto,

    @Headers('user-agent')
    userAgent: string,
  ) {

    return this.authService
      .loginUser(
        body.email,
        body.password,
        userAgent,
      );
  }

  @Post('refresh')
  async refreshAccessToken(
    @Body()
    body: RefreshTokenDto,
  ) {

    return this.authService
      .refreshAccessToken(
        body.refreshToken,
      );
  }

  @Post('logout/:sessionId')
  async logout(
    @Param('sessionId')
    sessionId: string,
  ) {

    return this.authService
      .logout(
        sessionId,
      );
  }

  @Post(
    'logout-all/:userId',
  )
  async logoutAllSessions(
    @Param('userId')
    userId: string,
  ) {

    return this.authService
      .logoutAllSessions(
        userId,
      );
  }

  @Get('profile/:userId')
  async getProfile(
    @Param('userId')
    userId: string,
  ) {

    return this.authService
      .getProfile(
        userId,
      );
  }
}