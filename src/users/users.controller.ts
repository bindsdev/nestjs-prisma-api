import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  UseFilters,
} from '@nestjs/common';
import { User as UserModel } from '@prisma/client';
import { UsersService } from './users.service';
import { HttpExceptionFilter } from '../exceptions/http-exception.filter';
import { MissingRequiredFieldException } from '../exceptions/missing-required-field.exception';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<UserModel[]> {
    const users = await this.usersService.user.findMany();
    return users;
  }

  @Post('create')
  @UseFilters(HttpExceptionFilter)
  async createUser(@Body() user: UserModel): Promise<UserModel> {
    const { username, email } = user;

    if (!username || !email) {
      throw new MissingRequiredFieldException();
    }

    const createdUser = await this.usersService.user.create({
      data: {
        username,
        email,
      },
    });

    return createdUser;
  }

  @Delete('delete/:id')
  async deleteUser(@Param('id') id: number): Promise<UserModel> {
    const deletedUser = await this.usersService.user.delete({
      where: {
        id: Number(id),
      },
    });

    return deletedUser;
  }

  @Get('user/:id')
  async getUserById(@Param('id') id: number): Promise<UserModel> {
    const fetchedUser = await this.usersService.user.findUnique({
      where: {
        id: Number(id),
      },
    });

    return fetchedUser;
  }

  @Patch('user/update/:id')
  async updateUser(
    @Param('id') id: number,
    @Body() user: UserModel,
  ): Promise<UserModel> {
    const updatedUser = await this.usersService.user.update({
      where: {
        id: Number(id),
      },
      data: {
        username: user.username,
        email: user.email,
      },
    });

    return updatedUser;
  }
}
