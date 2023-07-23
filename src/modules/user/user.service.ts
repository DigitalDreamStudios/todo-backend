import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ApiResponse } from 'src/common/types/ApiResponse.type';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<ApiResponse> {
    try {
      const newUser = this.userRepository.create(createUserDto);

      // Encrypt password
      newUser.password = await bcrypt.hash(newUser.password, 10);

      await this.userRepository.save(newUser);

      return {
        statusCode: HttpStatus.CREATED,
        message: 'User created successfully',
        data: newUser,
      };
    } catch (error) {
      // Check if the error is due to a unique constraint violation (duplicate data)
      if (error.code === '23505') { // PostgreSQL error code for unique constraint violation
        throw new HttpException('Username or Email already exist', HttpStatus.CONFLICT)
      } else {
        // Handle other errors (e.g., database connection issues, etc.)
        // You might want to log the error for debugging purposes.
        throw new HttpException('Something went wrong, try again later!', HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  }

  async findAll(): Promise<ApiResponse> {
    const users = await this.userRepository.find();

    return {
      statusCode: HttpStatus.OK,
      message: 'Users fetched successfully',
      data: users,
    }
  }

  async findOne(id: number): Promise<ApiResponse> {
    const findUser = await this.userRepository.findOne({
      where: { id },
      relations: ['todos'], // Assuming the user entity has a 'todos' property representing the todos relationship
    });

    if (!findUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'User fetched successfully',
      data: findUser,
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<ApiResponse> {
    const findUser = await this.userRepository.findOne({
      where: { id },
    });

    if (!findUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Encrypt password
    findUser.password = await bcrypt.hash(updateUserDto.password, 10);

    const updatedUser = await this.userRepository.save({
      ...findUser,
      ...updateUserDto,
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'User updated successfully',
      data: updatedUser,
    }
  }

  async remove(id: number): Promise<ApiResponse> {
    const findUser = await this.userRepository.findOne({
      where: { id },
    });

    if (!findUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.userRepository.remove(findUser);

    return {
      statusCode: HttpStatus.OK,
      message: 'User deleted successfully',
      data: findUser,
    }
  }
}
