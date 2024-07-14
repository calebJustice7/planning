export interface FindQuery {
  where: object;
  sort?: string | { [key: string]: number } | [string, number][];
  page?: number;
  pageSize?: number;
}
