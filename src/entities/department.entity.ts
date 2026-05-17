// departments/entities/department.entity.ts

import {
    Collection,
    Entity,
    OneToMany,
    Property,
} from '@mikro-orm/core';
import { CollegeProfile } from './college-profile.entity';
import { BaseEntity } from './base.entity';
import { WorkingProfessionalProfile } from './working-professional.entity';

@Entity()
export class Department extends BaseEntity {

    @Property({
        unique: true,
    })
    name!: string;

    @OneToMany(
        () => CollegeProfile,
        collegeProfile => collegeProfile.department,
    )
    collegeProfiles =
        new Collection<CollegeProfile>(this);

    @OneToMany(
        () => WorkingProfessionalProfile,
        workingProfessionalProfile =>
            workingProfessionalProfile.department,
    )
    workingProfessionalProfiles =
        new Collection<WorkingProfessionalProfile>(
            this,
        );
}