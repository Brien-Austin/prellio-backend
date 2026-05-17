// mcq-questions/entities/mcq-question.entity.ts

import {
    Collection,
    Entity,
    OneToMany,
    OneToOne,
} from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { Question } from './question.entity';
import { McqOption } from './mcq-option.entity';



@Entity()
export class McqQuestion
    extends BaseEntity {

    @OneToOne(() => Question)
    question!: Question;

    @OneToMany(
        () => McqOption,
        option => option.mcqQuestion,
    )
    options =
        new Collection<McqOption>(this);
}