import { Position } from "./position.entity";

export interface CUDPositionResponse {
    message: string;
    position: Position;
}

export interface GetPositionResponse {
    position: Promise<Position>;
}

export interface GetPositionsResponse {
    positions: Position[];
}

export interface ChildrenResponse {
    children: Position[]
}
