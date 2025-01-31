import { z } from "zod";

const EnvsSchema = z.object({
    NODE_ENV: z.string().default("development"),
    PORT: z.string().default("3000"),
    RABBITMQ_URL: z.string().default("amqp://localhost"),
    RABBITMQ_QUEUE: z.string().default("csv_queue"),
}).transform((data) => {
    return {
        NODE_ENV: data.NODE_ENV,
        PORT: data.PORT,
        RABBIT: {
            URI: data.RABBITMQ_URL,
            QUEUES: {
                CSV: data.RABBITMQ_QUEUE,
            },
        },
    };
});

export type Envs = z.infer<typeof EnvsSchema>;

export const envs = EnvsSchema.parse(process.env);