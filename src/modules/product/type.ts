import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"
import { SORT_DIRECTION } from "src/core/common/constants"
export class QueryListProduct {
    @ApiProperty({ required: false })
    searchText?: string

    @ApiProperty({ required: false })
    categories?: string[]
    
    @ApiProperty({ required: false })
    brands?: string[]
    
    @ApiProperty({ required: false })
    limit?: number

    @ApiProperty({ required: false })
    skip?: number
    
    @ApiProperty({ required: false })
    orderBy?: string
    
    @ApiProperty({ required: false, default: SORT_DIRECTION.DESC, enum: SORT_DIRECTION })
    direction?: SORT_DIRECTION
}


export class CreateProductInput {
    @IsNotEmpty()
    @ApiProperty({ required: true })
    name: string
    
    @IsNotEmpty()
    @ApiProperty({ required: true })
    shortName: string
    
    @IsNotEmpty()
    @ApiProperty({ required: true })
    images: string[]
    
    @ApiProperty({ required: false })
    description?: string
    
    @IsNotEmpty()
    @ApiProperty({ required: true })
    categoryId: string
    
    @IsNotEmpty()
    @ApiProperty({ required: true })
    brandId: string

    @ApiProperty({ required: true, nullable: false })
    orgId: string
    
    @ApiProperty({ required: true })
    keywords: string[]
    
    @ApiProperty({ required: false })
    others?: object
}
