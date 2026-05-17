// fill-up-answers/entities/fill-up-answer.entity.ts

import {
    Entity,
    ManyToOne,
    Property,
} from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { FillUpQuestion } from './fill-up-question.entity';


@Entity()
export class FillUpAnswer
    extends BaseEntity {

    @ManyToOne(
        () => FillUpQuestion,
    )
    fillUpQuestion!: FillUpQuestion;

    @Property()
    answer!: string;
}