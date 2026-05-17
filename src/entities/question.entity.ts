
import {
    Entity,
    Enum,
    OneToOne,
    Property,
} from '@mikro-orm/core';
import { DifficultyLevel, QuestionType } from '../enums/enums';
import { BaseEntity } from './base.entity';
import { McqQuestion } from './mcq-question.entity';
import { FillUpQuestion } from './fill-up-question.entity';


@Entity()
export class Question extends BaseEntity {

    @Enum(() => QuestionType)
    type!: QuestionType;

    @Property({
        type: 'text',
    })
    question!: string;

    @Property({
        type: 'text',
        nullable: true,
    })
    explanation?: string;

    @Enum(() => DifficultyLevel)
    difficulty!: DifficultyLevel;

    @OneToOne(
        () => McqQuestion,
        mcqQuestion => mcqQuestion.question,
        {
            nullable: true,
        },
    )
    mcqQuestion?: McqQuestion;

    @OneToOne(
        () => FillUpQuestion,
        fillUpQuestion =>
            fillUpQuestion.question,
        {
            nullable: true,
        },
    )
    fillUpQuestion?: FillUpQuestion;
}