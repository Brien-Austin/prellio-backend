// school-profiles/entities/school-profile.entity.ts

import {
    Entity,
    ManyToOne,
    OneToOne,
    Property,
} from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { SchoolBoard } from './school-board.entity';



@Entity()
export class SchoolProfile extends BaseEntity {

    @OneToOne(() => User)
    user!: User;

    @Property({
        nullable: true,
    })
    schoolName?: string;

    @Property({
        nullable: true,
    })
    className?: string;

    @ManyToOne(
        () => SchoolBoard,
        {
            nullable: true,
        },
    )
    schoolBoard?: SchoolBoard;
}