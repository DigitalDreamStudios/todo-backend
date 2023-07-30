import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ApiResponse } from 'src/common/types/ApiResponse.type';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(createAuthDto: CreateAuthDto): Promise<User> {
    // Validate username and hashed password
    const user = await this.userRepository.findOne({
      where: { username: createAuthDto.username },
    });

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const isPasswordValid = await bcrypt.compare(
      createAuthDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  async register(createUserDto: CreateUserDto): Promise<ApiResponse> {
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
      if (error.code === '23505') {
        // PostgreSQL error code for unique constraint violation
        throw new HttpException(
          'Username or Email already exist',
          HttpStatus.CONFLICT,
        );
      } else {
        // Handle other errors (e.g., database connection issues, etc.)
        // You might want to log the error for debugging purposes.
        throw new HttpException(
          'Something went wrong, try again later!',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async login(user: CreateAuthDto): Promise<ApiResponse> {
    const findUser = await this.validateUser(user);
    const payload = { username: findUser.username, sub: findUser.id };

    return {
      statusCode: HttpStatus.OK,
      message: 'User logged in successfully',
      data: {
        ...findUser,
        access_token: this.jwtService.sign(payload),
      },
    };
  }
}
