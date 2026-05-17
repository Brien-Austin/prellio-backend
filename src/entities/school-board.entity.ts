// school-boards/entities/school-board.entity.ts

import {
    Collection,
    Entity,
    OneToMany,
    Property,
} from '@mikro-orm/core';

import { SchoolProfile } from './school-profile.entity';
import { BaseEntity } from './base.entity';



@Entity()
export class SchoolBoard extends BaseEntity {

    @Property({
        unique: true,
    })
    name!: string;

    @OneToMany(
        () => SchoolProfile,
        schoolProfile => schoolProfile.schoolBoard,
    )
    schoolProfiles =
        new Collection<SchoolProfile>(this);
}