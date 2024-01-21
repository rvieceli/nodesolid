import { PageSizePolicy } from "@/core/policies/page-size.policy";
import z from "zod";

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).int().optional(),
  pageSize: z.coerce
    .number()
    .int()
    .min(1)
    .max(PageSizePolicy.MAX_PAGE_SIZE)
    .optional(),
});

export type Pagination = z.infer<typeof paginationSchema>;
