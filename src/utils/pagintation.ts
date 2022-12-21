export type Pagination = {
    limit: number;
    page: number;
    next_url: string;
    prev_url: string;
    total_data: number;
};

export const pagination = (
    limit: number,
    page: number,
    totalData: number,
    url: string,
    otherParams?: string
): Pagination => {
    const lastPage = totalData / page;
    const fullURL = otherParams ? `${url}?${otherParams}` : ``;

    return {
        limit: limit,
        page: page,
        next_url: `${fullURL}&page=${
            page == lastPage ? lastPage : page + 1
        }&limit=${limit}`,
        prev_url: `${fullURL}&page=${page == 1 ? 1 : page - 1}&limit=${limit}`,
        total_data: totalData,
    };
};
