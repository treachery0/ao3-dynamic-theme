import {SkinChunk} from "common/models/SkinChunk";
import {TaskStatus} from "common/models/TaskStatus";

export interface GeneratedSkin {
    name: string
    timestamp: number
    status: TaskStatus
    chunks: SkinChunk[]
}
