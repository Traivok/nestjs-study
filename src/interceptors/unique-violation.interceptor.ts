import {
    BadRequestException,
    CallHandler,
    ExecutionContext,
    Injectable, Logger,
    NestInterceptor,
    UseInterceptors,
} from '@nestjs/common';
import { catchError, Observable }                                                          from 'rxjs';
import { QueryFailedError }                                                                from 'typeorm';


export function CatchUniqueViolation() {
    return UseInterceptors(new UniqueViolationInterceptor());
}

@Injectable()
export class UniqueViolationInterceptor implements NestInterceptor {
    private readonly logger = new Logger(UniqueViolationInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle()
            .pipe(catchError(error => {
                if (error instanceof QueryFailedError) {
                    const msg = error.message;

                    if (typeof msg === 'string' && msg.match(/^(.*\s)?unique(\s.*)?$/i)) {
                        // TODO test for postgres
                        const { groups: { column = 'table column' } } = /^(.*\s)?((\w+)\.(?<column>\w+))$/g.exec(msg);

                        throw new BadRequestException(`Unique constraint violation for ${ column }.`);
                    }
                }

                throw error;
            }));
    }
}
