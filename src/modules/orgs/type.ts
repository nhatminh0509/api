import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"
import { SORT_DIRECTION } from "src/core/common/constants"

export class QueryListOrg {
    @ApiProperty({ required: false })
    searchText?: string
    
    @ApiProperty({ required: false })
    domain?: string
    
    @ApiProperty({ required: false })
    owner?: string
    
    @ApiProperty({ required: false })
    limit?: number

    @ApiProperty({ required: false })
    skip?: number
    
    @ApiProperty({ required: false })
    orderBy?: string
    
    @ApiProperty({ required: false, default: SORT_DIRECTION.DESC, enum: SORT_DIRECTION })
    direction?: SORT_DIRECTION
}

export class CreateOrgInput {
    @IsNotEmpty()
    @ApiProperty({ required: true })
    name: string
    
    @IsNotEmpty()
    @ApiProperty({ required: true })
    image: string
    
    @IsNotEmpty()
    @ApiProperty({ required: true })
    domain: string
    
    @IsNotEmpty()
    @ApiProperty({ required: true })
    owner: string
    
    @ApiProperty({ required: false })
    siteSetting?: object
}

export class UpdateOrgInput {
    @ApiProperty({ required: false })
    name?: string
    
    @ApiProperty({ required: false })
    image?: string
    
    @ApiProperty({ required: false })
    domain?: string

    @ApiProperty({ required: false })
    owner?: string
}