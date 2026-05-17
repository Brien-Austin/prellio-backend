import {
    Entity,
    ManyToOne,
    Enum,
    Property,
} from '@mikro-orm/core';
import { User } from './user.entity';
import { BaseEntity } from './base.entity';
import {
    DeviceType,
} from '../enums/enums';


@Entity()
export class Session extends BaseEntity {

    @ManyToOne(() => User)
    user!: User;

    @Property({
        nullable: true,
    })
    hashedRefreshToken?: string;

    @Property()
    expiresAt!: Date;

    @Property({
        nullable: true,
    })
    revokedAt?: Date;

    @Enum(() => DeviceType)
    deviceType: DeviceType =
        DeviceType.UNKNOWN;

    @Property({
        nullable: true,
    })
    userAgent?: string;
}