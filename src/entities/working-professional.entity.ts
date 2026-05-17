// working-professional-profiles/entities/working-professional-profile.entity.ts

import {
    Entity,
    ManyToOne,
    OneToOne,
    Property,
} from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Department } from './department.entity';
import { Designation } from './designation.entity';


@Entity()
export class WorkingProfessionalProfile
    extends BaseEntity {

    @OneToOne(() => User)
    user!: User;

    @Property({
        nullable: true,
    })
    companyName?: string;

    @ManyToOne(
        () => Designation,
        {
            nullable: true,
        },
    )
    designation?: Designation;

    @ManyToOne(
        () => Department,
        {
            nullable: true,
        },
    )
    department?: Department;

    @Property({
        nullable: true,
    })
    yearsOfExperience?: number;
}