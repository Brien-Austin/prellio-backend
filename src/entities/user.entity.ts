import {
    Collection,
    Entity,
    ManyToOne,
    OneToMany,
    OneToOne,
    Property,
    Index,
} from '@mikro-orm/core';

import {
    BaseEntity,
} from './base.entity';

import {
    SchoolProfile,
} from './school-profile.entity';

import {
    LearnerType,
} from './learner-type.entity';

import {
    CollegeProfile,
} from './college-profile.entity';

import {
    WorkingProfessionalProfile,
} from './working-professional.entity';

import {
    Session,
} from './session.entity';

@Entity()
export class User
    extends BaseEntity {

    @Index()
    @Property({
        unique: true,
    })
    email: string;

    @Property({
        hidden: true,
    })
    password: string;

    @Property({
        nullable: true,
    })
    name?: string;

    @ManyToOne(
        () => LearnerType,
        {
            nullable: true,
        },
    )
    learnerType?: LearnerType;

    @OneToOne(
        () => SchoolProfile,
        schoolProfile =>
            schoolProfile.user,
        {
            nullable: true,
        },
    )
    schoolProfile?:
        SchoolProfile;

    @OneToOne(
        () => CollegeProfile,
        collegeProfile =>
            collegeProfile.user,
        {
            nullable: true,
        },
    )
    collegeProfile?:
        CollegeProfile;

    @OneToOne(
        () => WorkingProfessionalProfile,
        workingProfessionalProfile =>
            workingProfessionalProfile.user,
        {
            nullable: true,
        },
    )
    workingProfessionalProfile?:
        WorkingProfessionalProfile;

    @OneToMany(
        () => Session,
        session => session.user,
    )
    sessions =
        new Collection<Session>(
            this,
        );

    constructor(
        email: string,
        password: string,
        name?: string,
    ) {

        super();

        this.email =
            email;

        this.password =
            password;

        this.name =
            name;
    }
}