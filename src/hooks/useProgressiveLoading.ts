import { useState, useEffect, useCallback } from 'react';

interface ProgressiveLoadingOptions {
  batchSize?: number;
  delay?: number;
  threshold?: number;
}

export function useProgressiveLoading<T>(
  items: T[],
  options: ProgressiveLoadingOptions = {}
) {
  const { batchSize = 20, delay = 100, threshold = 0.1 } = options;
  const [visibleItems, setVisibleItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Reset when items change
  useEffect(() => {
    setVisibleItems(items.slice(0, batchSize));
    setHasMore(items.length > batchSize);
    setLoading(false);
  }, [items, batchSize]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    
    // Simulate network delay for smooth UX
    await new Promise(resolve => setTimeout(resolve, delay));
    
    setVisibleItems(prev => {
      const nextBatch = items.slice(0, prev.length + batchSize);
      setHasMore(nextBatch.length < items.length);
      return nextBatch;
    });
    
    setLoading(false);
  }, [items, loading, hasMore, batchSize, delay]);

  // Intersection observer for automatic loading
  const observerRef = useCallback((node: HTMLElement | null) => {
    if (loading || !hasMore) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold }
    );
    
    if (node) observer.observe(node);
    
    return () => observer.disconnect();
  }, [loading, hasMore, loadMore, threshold]);

  return {
    visibleItems,
    loading,
    hasMore,
    loadMore,
    observerRef
  };
}