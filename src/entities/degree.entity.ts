import { Collection, Entity, OneToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";
import { CollegeProfile } from "./college-profile.entity";



@Entity()
export class Degree extends BaseEntity {

    @Property({
        unique: true,
    })
    name!: string;

    @OneToMany(
        () => CollegeProfile,
        collegeProfile => collegeProfile.degree,
    )
    collegeProfiles =
        new Collection<CollegeProfile>(this);
}