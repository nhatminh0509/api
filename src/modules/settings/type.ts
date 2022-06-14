import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"

export class CreateSettingInput {
    @IsNotEmpty()
    @ApiProperty({ required: true })
    key: string
    
    @ApiProperty({ required: true })
    value?: object
}