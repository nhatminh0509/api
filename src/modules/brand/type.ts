import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"
import { SORT_DIRECTION } from "src/core/common/constants"
export class QueryListBrand {
    @ApiProperty({ required: false })
    searchText?: string
    
    @ApiProperty({ required: false })
    limit?: number

    @ApiProperty({ required: false })
    skip?: number
    
    @ApiProperty({ required: false })
    orderBy?: string
    
    @ApiProperty({ required: false, default: SORT_DIRECTION.DESC, enum: SORT_DIRECTION })
    direction?: SORT_DIRECTION
}

export class CreateBrandInput {
    @IsNotEmpty()
    @ApiProperty({ required: true })
    name: string
    
    @IsNotEmpty()
    @ApiProperty({ required: true })
    shortName: string
    
    @IsNotEmpty()
    @ApiProperty({ required: true })
    image: string
    
    @ApiProperty({ required: false })
    description?: string
    
    @ApiProperty({ required: true })
    orgSlug: string
    
    @ApiProperty({ required: false })
    categoriesSlug?: string[]
    
    @ApiProperty({ required: false })
    others?: object
}

export class UpdateBrandInput {
    @ApiProperty({ required: false })
    name?: string
    
    @ApiProperty({ required: false })
    shortName?: string
    
    @ApiProperty({ required: false })
    image?: string
    
    @ApiProperty({ required: false })
    description?: string
    
    @ApiProperty({ required: false })
    orgSlug?: string
    
    @ApiProperty({ required: false })
    categoriesSlug?: string[]
    
    @ApiProperty({ required: false })
    others?: object
}