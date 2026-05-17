// designations/entities/designation.entity.ts

import {
    Collection,
    Entity,
    OneToMany,
    Property,
} from '@mikro-orm/core';
import { WorkingProfessionalProfile } from './working-professional.entity';
import { BaseEntity } from './base.entity';


@Entity()
export class Designation extends BaseEntity {

    @Property({
        unique: true,
    })
    name!: string;

    @OneToMany(
        () => WorkingProfessionalProfile,
        workingProfessionalProfile =>
            workingProfessionalProfile.designation,
    )
    workingProfessionalProfiles =
        new Collection<WorkingProfessionalProfile>(
            this,
        );
}