import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"

export class CreateNetworkInput {
    @IsNotEmpty()
    @ApiProperty({ required: true })
    name: string

    @IsNotEmpty()
    @ApiProperty({ required: true })
    slug: string

    @IsNotEmpty()
    @ApiProperty({ required: true })
    rpc: string

    @IsNotEmpty()
    @ApiProperty({ required: true })
    wss: string

    @IsNotEmpty()
    @ApiProperty({ required: true })
    chainId: string
}