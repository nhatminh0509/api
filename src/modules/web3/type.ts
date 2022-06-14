import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"
import { SORT_DIRECTION } from "src/core/common/constants"

export class EnableWeb3Input {
    @ApiProperty({ required: true })
    slug: string
    
    @ApiProperty({ required: false })
    block?: number
}

export class DisableWeb3Input {
    @ApiProperty({ required: true })
    slug: string
}