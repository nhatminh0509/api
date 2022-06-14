import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"

export class CreateTransactionLogInput {
    @IsNotEmpty()
    @ApiProperty({ required: true })
    hash: string
    
    @IsNotEmpty()
    @ApiProperty({ required: true })
    networkId: string

    @IsNotEmpty()
    @ApiProperty({ required: true })
    functionName: string
    
    @ApiProperty({ required: true })
    data: object
}