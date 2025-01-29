import { useState, useEffect, useCallback } from "react";

function useLazyLoading(fetchData, limit) {
    const [items, setItems] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [reloadCount, setReloadCount] = useState(0);

    useEffect(() => {
        const getItems = async () => {
            try {
                const { data, hasMore } = await fetchData(page, limit);
                
                setItems((prevItems) => [...prevItems, ...data]);

                if (page === 1) {
                    setItems(data);
                } else {
                    setItems((prevItems) => {
                        const uniqueItems = [...prevItems, ...data].reduce((acc, item) => {
                            if (!acc.some((currItem) => currItem.id === item.id)) acc.push(item);
                            return acc;
                        }, []);
                        return uniqueItems;
                    });
                }

                setHasMore(hasMore);
            } catch (error) {
                console.error("Error: ", error);
            }
        }

        getItems();
    }, [page, fetchData, limit, reloadCount]);

    const loadMore = useCallback(() => {
        if (hasMore) {
            setPage((prevPage) => prevPage + 1);
        }
    }, [hasMore]);

    const reload = useCallback(() => {
        setPage(1);
        setReloadCount((prevReloadCount) => prevReloadCount + 1);
    }, []);

    return { items, hasMore, loadMore, reload };
}

export default useLazyLoading;