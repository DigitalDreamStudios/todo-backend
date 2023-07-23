import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { Todo } from 'src/modules/todo/entities/todo.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsStrongPassword()
  @IsNotEmpty()
  readonly password: string;

  @IsArray()
  readonly todos: Todo[];

  constructor(
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    password: string,
    todos: Todo[],
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.email = email;
    this.password = password;
    this.todos = todos;
  }
}
