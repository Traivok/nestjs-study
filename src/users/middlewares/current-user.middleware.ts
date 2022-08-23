import { Injectable, NestMiddleware }      from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService }                    from '../users.service';
import { User }                            from '../user.entity';

declare global {
    namespace Express {
        interface Request {
            currentUser?: User;
        }
    }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor(private userSrv: UsersService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const  { userId = null } = req?.session || {};

        if (userId !== null) {
            req.currentUser = await this.userSrv.findOne(userId) ?? null;
        }

        next();
    }
}