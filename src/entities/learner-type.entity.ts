import {
    Collection,
    Entity,
    OneToMany,
    Property,
} from '@mikro-orm/core';


import { User } from './user.entity';
import { BaseEntity } from './base.entity';


@Entity()
export class LearnerType extends BaseEntity {

    @Property({
        unique: true,
    })
    name!: string;

    @OneToMany(
        () => User,
        user => user.learnerType,
    )
    users = new Collection<User>(this);
}