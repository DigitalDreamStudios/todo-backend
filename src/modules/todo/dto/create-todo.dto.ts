import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsString()
  readonly completed: boolean;

  @IsString()
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
