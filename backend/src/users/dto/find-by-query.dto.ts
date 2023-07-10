import { IsString, MinLength } from 'class-validator';

export class FindByQueryDto {
  @IsString()
  @MinLength(1)
  query: string;
}
