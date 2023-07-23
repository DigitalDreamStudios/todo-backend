import { IsNotEmpty, IsString } from "class-validator";

export class CreateTodoDto {
    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @IsString()
    @IsNotEmpty()
    readonly description: string;

    @IsString()
    @IsNotEmpty()
    readonly completed: boolean;
}
