// fill-up-questions/entities/fill-up-question.entity.ts

import {
    Collection,
    Entity,
    OneToMany,
    OneToOne,
} from '@mikro-orm/core';
import { Question } from './question.entity';
import { FillUpAnswer } from './fill-up-answer.entity';
import { BaseEntity } from './base.entity';


@Entity()
export class FillUpQuestion
    extends BaseEntity {

    @OneToOne(() => Question)
    question!: Question;

    @OneToMany(
        () => FillUpAnswer,
        answer => answer.fillUpQuestion,
    )
    acceptedAnswers =
        new Collection<FillUpAnswer>(this);
}