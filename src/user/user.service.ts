import { EntityManager, EntityRepository, LoadStrategy } from "@mikro-orm/postgresql";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CollegeProfile } from "src/entities/college-profile.entity";
import { Degree } from "src/entities/degree.entity";
import { Department } from "src/entities/department.entity";
import { Designation } from "src/entities/designation.entity";
import { LearnerType } from "src/entities/learner-type.entity";
import { SchoolBoard } from "src/entities/school-board.entity";
import { SchoolProfile } from "src/entities/school-profile.entity";
import { User } from "src/entities/user.entity";
import { WorkingProfessionalProfile } from "src/entities/working-professional.entity";
import {
    InjectRepository,
} from '@mikro-orm/nestjs';
import { redis } from "src/common/redis";






@Injectable()
export class UsersService {

    constructor(

        @InjectRepository(User)
        private readonly userRepository:
            EntityRepository<User>,

        @InjectRepository(LearnerType)
        private readonly learnerTypeRepository:
            EntityRepository<LearnerType>,

        @InjectRepository(SchoolBoard)
        private readonly schoolBoardRepository:
            EntityRepository<SchoolBoard>,

        @InjectRepository(Degree)
        private readonly degreeRepository:
            EntityRepository<Degree>,

        @InjectRepository(Department)
        private readonly departmentRepository:
            EntityRepository<Department>,

        @InjectRepository(Designation)
        private readonly designationRepository:
            EntityRepository<Designation>,

        @InjectRepository(SchoolProfile)
        private readonly schoolProfileRepository:
            EntityRepository<SchoolProfile>,

        @InjectRepository(CollegeProfile)
        private readonly collegeProfileRepository:
            EntityRepository<CollegeProfile>,

        @InjectRepository(
            WorkingProfessionalProfile,
        )
        private readonly workingProfessionalProfileRepository:
            EntityRepository<WorkingProfessionalProfile>,

        private readonly em: EntityManager,
    ) { }

    async getLearnerTypes():
        Promise<LearnerType[]> {

        return this.learnerTypeRepository.find(
            {
                deletedAt: null,
            },
            {
                orderBy: {
                    name: 'asc',
                },
            },
        );
    }

    async getSchoolBoards():
        Promise<SchoolBoard[]> {

        return this.schoolBoardRepository.find(
            {
                deletedAt: null,
            },
            {
                orderBy: {
                    name: 'asc',
                },
            },
        );
    }

    async getDegrees():
        Promise<Degree[]> {

        return this.degreeRepository.find(
            {
                deletedAt: null,
            },
            {
                orderBy: {
                    name: 'asc',
                },
            },
        );
    }

    async getDepartments():
        Promise<Department[]> {

        return this.departmentRepository.find(
            {
                deletedAt: null,
            },
            {
                orderBy: {
                    name: 'asc',
                },
            },
        );
    }

    async getDesignations():
        Promise<Designation[]> {

        return this.designationRepository.find(
            {
                deletedAt: null,
            },
            {
                orderBy: {
                    name: 'asc',
                },
            },
        );
    }

    async getUserById(
        userId: string,
    ) {

        const cacheKey =
            `user:${userId}`;

        const cachedUser =
            await redis.get(
                cacheKey,
            );

        if (cachedUser) {


            return cachedUser;
        }



        const qb =
            this.userRepository
                .createQueryBuilder('u')

                .select([
                    'u.id',
                    'u.email',
                    'u.name',

                    'lt.id as learner_type_id',
                    'lt.name as learner_type_name',
                ])

                .leftJoin(
                    'u.learnerType',
                    'lt',
                )

                .where({
                    id: userId,
                    deletedAt: null,
                })

                .limit(1);

        const result =
            await qb.execute(
                'get',
            );

        if (!result) {
            throw new NotFoundException(
                'User not found',
            );
        }

        await redis.set(
            cacheKey,
            result,
            {
                ex: 300,
            },
        );

        return result;
    }

    // src/user/user.service.ts

    async saveSchoolProfile(
        userId: string,
        schoolName?: string,
        className?: string,
        schoolBoardId?: string,
    ) {

        const user =
            await this.userRepository.findOne({
                id: userId,
                deletedAt: null,
            });

        if (!user) {
            throw new NotFoundException(
                'User not found',
            );
        }

        let schoolProfile =
            await this.schoolProfileRepository
                .findOne({
                    user: user.id,
                });

        if (!schoolProfile) {

            schoolProfile =
                new SchoolProfile();

            schoolProfile.user =
                user;
        }

        schoolProfile.schoolName =
            schoolName;

        schoolProfile.className =
            className;

        if (schoolBoardId) {

            const schoolBoard =
                await this.schoolBoardRepository
                    .findOne({
                        id: schoolBoardId,
                        deletedAt: null,
                    });

            if (!schoolBoard) {
                throw new NotFoundException(
                    'School board not found',
                );
            }

            schoolProfile.schoolBoard =
                schoolBoard;
        }

        await this.em.persistAndFlush(
            schoolProfile,
        );

        await redis.del(
            `user:${userId}`,
        );

        return schoolProfile;
    }

    async saveCollegeProfile(
        userId: string,
        collegeName?: string,
        degreeId?: string,
        departmentId?: string,
        yearOfStudy?: number,
    ) {

        const user =
            await this.userRepository.findOne({
                id: userId,
                deletedAt: null,
            });

        if (!user) {
            throw new NotFoundException(
                'User not found',
            );
        }

        let collegeProfile =
            await this.collegeProfileRepository
                .findOne({
                    user: user.id,
                });

        if (!collegeProfile) {

            collegeProfile =
                new CollegeProfile();

            collegeProfile.user =
                user;
        }

        collegeProfile.collegeName =
            collegeName;

        collegeProfile.yearOfStudy =
            yearOfStudy;

        if (degreeId) {

            const degree =
                await this.degreeRepository
                    .findOne({
                        id: degreeId,
                        deletedAt: null,
                    });

            if (!degree) {
                throw new NotFoundException(
                    'Degree not found',
                );
            }

            collegeProfile.degree =
                degree;
        }

        if (departmentId) {

            const department =
                await this.departmentRepository
                    .findOne({
                        id: departmentId,
                        deletedAt: null,
                    });

            if (!department) {
                throw new NotFoundException(
                    'Department not found',
                );
            }

            collegeProfile.department =
                department;
        }

        await this.em.persistAndFlush(
            collegeProfile,
        );

        await redis.del(
            `user:${userId}`,
        );

        return collegeProfile;
    }

    async saveWorkingProfessionalProfile(
        userId: string,
        companyName?: string,
        designationId?: string,
        departmentId?: string,
        yearsOfExperience?: number,
    ) {

        const user =
            await this.userRepository.findOne({
                id: userId,
                deletedAt: null,
            });

        if (!user) {
            throw new NotFoundException(
                'User not found',
            );
        }

        let workingProfessionalProfile =
            await this
                .workingProfessionalProfileRepository
                .findOne({
                    user: user.id,
                });

        if (!workingProfessionalProfile) {

            workingProfessionalProfile =
                new WorkingProfessionalProfile();

            workingProfessionalProfile.user =
                user;
        }

        workingProfessionalProfile.companyName =
            companyName;

        workingProfessionalProfile.yearsOfExperience =
            yearsOfExperience;

        if (designationId) {

            const designation =
                await this.designationRepository
                    .findOne({
                        id: designationId,
                        deletedAt: null,
                    });

            if (!designation) {
                throw new NotFoundException(
                    'Designation not found',
                );
            }

            workingProfessionalProfile.designation =
                designation;
        }

        if (departmentId) {

            const department =
                await this.departmentRepository
                    .findOne({
                        id: departmentId,
                        deletedAt: null,
                    });

            if (!department) {
                throw new NotFoundException(
                    'Department not found',
                );
            }

            workingProfessionalProfile.department =
                department;
        }

        await this.em.persistAndFlush(
            workingProfessionalProfile,
        );

        await redis.del(
            `user:${userId}`,
        );

        return workingProfessionalProfile;
    }
}