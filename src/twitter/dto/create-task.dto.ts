import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsBoolean()
  completed: boolean;
}