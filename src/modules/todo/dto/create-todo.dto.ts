import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsBoolean()
  @IsOptional()
  readonly completed: boolean;

  @IsNumber()
  @IsNotEmpty()
  readonly userId: number;

  constructor(
    title: string,
    description: string,
    completed: boolean,
    userId: number,
  ) {
    this.title = title;
    this.description = description;
    this.completed = completed;
    this.userId = userId;
  }
}
