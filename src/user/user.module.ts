import {
  Module,
} from '@nestjs/common';

import {
  MikroOrmModule,
} from '@mikro-orm/nestjs';
import { User } from 'src/entities/user.entity';
import { LearnerType } from 'src/entities/learner-type.entity';
import { SchoolBoard } from 'src/entities/school-board.entity';
import { Degree } from 'src/entities/degree.entity';
import { Department } from 'src/entities/department.entity';
import { Designation } from 'src/entities/designation.entity';
import { SchoolProfile } from 'src/entities/school-profile.entity';
import { CollegeProfile } from 'src/entities/college-profile.entity';
import { WorkingProfessionalProfile } from 'src/entities/working-professional.entity';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';


@Module({
  imports: [
    MikroOrmModule.forFeature([
      User,
      LearnerType,
      SchoolBoard,
      Degree,
      Department,
      Designation,
      SchoolProfile,
      CollegeProfile,
      WorkingProfessionalProfile,
    ]),
  ],

  controllers: [
    UsersController,
  ],

  providers: [
    UsersService,
  ],

  exports: [
    UsersService,
  ],
})
export class UsersModule { }