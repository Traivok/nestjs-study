import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { UsersService }                                                       from '../users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
    private readonly logger = new Logger(CurrentUserInterceptor.name);
    constructor(private userSrv: UsersService) {}

    async intercept(context: ExecutionContext, next: CallHandler) {
        const request    = context.switchToHttp().getRequest();
        const { userId } = request.session ?? {};

        if (userId !== null && userId !== undefined)
            request.currentUser = await this.userSrv.findOne(userId);

        return next.handle();
    }
}
