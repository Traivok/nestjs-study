import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { UsersService }                                               from '../users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
    constructor(private userSrv: UsersService) {}

    async intercept(context: ExecutionContext, next: CallHandler) {
        const request    = context.switchToHttp().getRequest();
        const { userId } = request.session ?? {};

        if (userId !== null)
            request.currentUser = await this.userSrv.findOneOrNotFound(userId);

        return next.handle();
    }
}
