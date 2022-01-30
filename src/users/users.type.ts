import { ApiProperty } from "@nestjs/swagger"

export class CreateOrgInput {
    @ApiProperty({ required: true })
    name: string
    
    @ApiProperty({ required: true })
    domain: string

    @ApiProperty({ required: true })
    owner: string
    
    @ApiProperty({ required: false })
    managers?: string[]
    
    @ApiProperty({ required: false })
    siteSetting?: object
}

export class UpdateOrgInput {
    @ApiProperty({ required: false })
    name?: string
    
    @ApiProperty({ required: false })
    domain?: string

    @ApiProperty({ required: false })
    owner?: string
    
    @ApiProperty({ required: false })
    managers?: string[]
}