import { SortOrder } from "mongoose";

export interface FindQuery {
    where: object;
    sort?: string | { [key: string]: SortOrder | { $meta: object } } | [string, SortOrder][] | null | undefined;
    page: number;
    pageSize: number;
}
