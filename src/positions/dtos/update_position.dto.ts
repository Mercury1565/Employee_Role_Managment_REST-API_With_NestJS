import { CreatePositionDto } from "./create_position.dto";
import { PartialType } from "@nestjs/mapped-types"

export class UpdatePositionDto extends PartialType(CreatePositionDto) {}