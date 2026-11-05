import { useCallback, useEffect, useState } from 'react';
import {
  clearHistory,
  deleteHistoryItem,
  loadHistory,
  saveHistoryItem,
  type HistoryItem,
} from '@/lib/history';

export function useHistory() {
  const [items, setItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setItems(loadHistory());
  }, []);

  const add = useCallback((item: HistoryItem) => {
    setItems(saveHistoryItem(item));
  }, []);

  const remove = useCallback((id: string) => {
    setItems(deleteHistoryItem(id));
  }, []);

  const clear = useCallback(() => {
    clearHistory();
    setItems([]);
  }, []);

  return { items, add, remove, clear };
}
