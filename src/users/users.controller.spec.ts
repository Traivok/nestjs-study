import { Test, TestingModule } from '@nestjs/testing';
import { UsersController }     from './users.controller';
import { Serialize }           from '../interceptors/serialize.interceptor';

xdescribe('UsersController', () => {
  let controller: UsersController;
  //
  // beforeEach(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     controllers: [UsersController],
  //     providers: [
  //         Serialize,
  //     ]
  //   }).compile();

    // controller = module.get<UsersController>(UsersController);
  // });

  it.skip('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
