import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication }    from '@nestjs/common';
import * as request            from 'supertest';
import { AppModule }           from '../src/app.module';

describe('Authentication Controller (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [ AppModule ],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('Handles a signup request', () => {
        const email = 'john.doe.new@mail.com';

        return request(app.getHttpServer())
            .post('/auth/signup')
            .send({ email, password: 'password' })
            .expect(201)
            .then((res) => {
                const { id, email: resEmail } = res.body;
                expect(id).toBeDefined();
                expect(resEmail).toEqual(email);
            });
    });
});
