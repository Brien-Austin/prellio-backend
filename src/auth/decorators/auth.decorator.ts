import {
    applyDecorators,
    createParamDecorator,
    ExecutionContext,
    UseGuards,
} from '@nestjs/common';

import {
    ApiBearerAuth,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import {
    JwtAuthGuard,
} from '../guards/auth.guard';

export const GetUserFromToken =
    createParamDecorator(

        (
            _data: unknown,
            context: ExecutionContext,
        ): string => {

            const request =
                context
                    .switchToHttp()
                    .getRequest();

            return request.userId;
        },
    );

export function Auth() {

    return applyDecorators(

        UseGuards(
            JwtAuthGuard,
        ),

        ApiBearerAuth(
            'JWT',
        ),

        ApiUnauthorizedResponse({
            description:
                'Unauthorized',
        }),
    );
}