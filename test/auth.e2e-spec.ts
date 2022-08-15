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
        const email = 'john.doe@mail.com';

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


    it('allows signup as existing user', async () => {
        const email = 'john.doe@mail.com';

        await request(app.getHttpServer())
            .post('/auth/signup')
            .send({ email, password: 'password' })
            .expect(201);

        return await request(app.getHttpServer())
            .post('/auth/signup')
            .send({ email, password: 'password' })
            .expect(400);
    });


    it('not allows sign in with wrong credentials', async () => {
        const email = 'john.doe@mail.com';
        const password = 'password';

        await request(app.getHttpServer())
            .post('/auth/signup')
            .send({ email, password })
            .expect(201);

        await request(app.getHttpServer())
            .post('/auth/signin')
            .send({ email: 'joe.' + email, password })
            .expect(401);

        return await request(app.getHttpServer())
            .post('/auth/signin')
            .send({ email, password: password + password })
            .expect(401);
    });


    it('Sign in users', async () => {
        const email = 'john.doe@mail.com';

        const res = await request(app.getHttpServer())
            .post('/auth/signup')
            .send({ email, password: 'password' })
            .expect(201);

        const cookie = res.get('Set-Cookie');

        const { body } = await request(app.getHttpServer())
            .get('/auth/whoami')
            .set('Cookie', cookie)
            .expect(200);

        expect(body.email).toEqual(email);
    });
});
