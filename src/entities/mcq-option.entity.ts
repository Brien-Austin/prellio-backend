// mcq-options/entities/mcq-option.entity.ts

import {
    Entity,
    Enum,
    ManyToOne,
    Property,
} from '@mikro-orm/core';
import { McqQuestion } from './mcq-question.entity';
import { McqOptionType } from '../enums/enums';
import { BaseEntity } from './base.entity';



@Entity()
export class McqOption extends BaseEntity {

    @ManyToOne(() => McqQuestion)
    mcqQuestion!: McqQuestion;

    @Property()
    text!: string;

    @Enum(() => McqOptionType)
    type!: McqOptionType;
}