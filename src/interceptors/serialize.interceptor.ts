import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor, UseInterceptors } from '@nestjs/common';
import { map, Observable }                                                                     from 'rxjs';
import { ClassConstructor, plainToInstance }                                  from 'class-transformer';

export function Serialize<DTO>(dto: ClassConstructor<DTO>) {
    return UseInterceptors(new SerializeInterceptor<DTO>(dto));
}

@Injectable()
export class SerializeInterceptor<DTO> implements NestInterceptor {
  constructor(private dto: ClassConstructor<DTO>) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
        map((data: any) => {
          return plainToInstance(this.dto, data, { excludeExtraneousValues: true });
        })
    )
  }
}
