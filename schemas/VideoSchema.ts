import { z } from "zod/v4";

export const videoSchema = z.object({
    title: z.string().min(4, {message: "Title is required"}),
    description: z.string().min(4, {message: "Description is required"}),
    videoUrl: z.string().url({message: "Video URL must be a valid URL"}),
})
// thumbnailUrl: z.string().url({message: "Thumbnail URL must be a valid URL"}),