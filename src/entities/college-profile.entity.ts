
import {
    Entity,
    ManyToOne,
    OneToOne,
    Property,
} from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Degree } from './degree.entity';
import { Department } from './department.entity';



@Entity()
export class CollegeProfile extends BaseEntity {

    @OneToOne(() => User)
    user!: User;

    @Property({
        nullable: true,
    })
    collegeName?: string;

    @ManyToOne(
        () => Degree,
        {
            nullable: true,
        },
    )
    degree?: Degree;

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
    yearOfStudy?: number;
}