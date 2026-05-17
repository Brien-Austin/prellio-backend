// src/user/user.controller.ts

import {
  Body,
  Controller,
  Get,
  Patch,
} from '@nestjs/common';

import {
  UsersService,
} from './user.service';
import { Auth, GetUserFromToken } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/entities/user.entity';



@Controller('users')
export class UsersController {

  constructor(
    private readonly usersService:
      UsersService,
  ) { }

  @Auth()
  @Get('me')
  async getMe(
    @GetUserFromToken()
    userId: string,
  ) {

    return this.usersService
      .getUserById(
        userId,
      );
  }

  @Auth()
  @Patch('school-profile')
  async saveSchoolProfile(
    @GetUserFromToken()
    userId: string,

    @Body()
    body: {
      schoolName?: string;
      className?: string;
      schoolBoardId?: string;
    },
  ) {

    return this.usersService
      .saveSchoolProfile(
        userId,
        body.schoolName,
        body.className,
        body.schoolBoardId,
      );
  }

  @Auth()
  @Patch('college-profile')
  async saveCollegeProfile(
    @GetUserFromToken()
    userId: string,

    @Body()
    body: {
      collegeName?: string;
      degreeId?: string;
      departmentId?: string;
      yearOfStudy?: number;
    },
  ) {

    return this.usersService
      .saveCollegeProfile(
        userId,
        body.collegeName,
        body.degreeId,
        body.departmentId,
        body.yearOfStudy,
      );
  }

  @Auth()
  @Patch('working-profile')
  async saveWorkingProfessionalProfile(
    @GetUserFromToken()
    userId: string,

    @Body()
    body: {
      companyName?: string;
      designationId?: string;
      departmentId?: string;
      yearsOfExperience?: number;
    },
  ) {

    return this.usersService
      .saveWorkingProfessionalProfile(
        userId,
        body.companyName,
        body.designationId,
        body.departmentId,
        body.yearsOfExperience,
      );
  }
}