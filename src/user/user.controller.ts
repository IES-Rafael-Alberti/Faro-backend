import { Body, Controller, Get, Post, Res, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('users')
  getUsers(): any {
    return this.userService.getUsers();
  }
  @Post('/create')
  createUser(@Res() res: Response, @Body() userDto: UserDto): any {
    const user = this.userService
      .addUser(userDto)
      .then((user) => console.log(user));
    return res.status(HttpStatus.OK).json({
      message: 'User has been created successfully',
      user,
    });
  }
}
