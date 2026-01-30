import { useCallback, useRef, useState } from "react";

interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

const MAX_HISTORY = 50;

export function useUndoRedo<T>(initialState: T) {
  const [history, setHistory] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: [],
  });

  const isUndoingRef = useRef(false);

  const set = useCallback((newPresent: T | ((prev: T) => T)) => {
    if (isUndoingRef.current) {
      isUndoingRef.current = false;
      return;
    }

    setHistory((prev) => {
      const resolvedPresent =
        typeof newPresent === "function" ? (newPresent as (prev: T) => T)(prev.present) : newPresent;

      if (JSON.stringify(resolvedPresent) === JSON.stringify(prev.present)) {
        return prev;
      }

      const newPast = [...prev.past, prev.present].slice(-MAX_HISTORY);

      return {
        past: newPast,
        present: resolvedPresent,
        future: [],
      };
    });
  }, []);

  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.past.length === 0) return prev;

      const newPast = prev.past.slice(0, -1);
      const newPresent = prev.past[prev.past.length - 1];
      const newFuture = [prev.present, ...prev.future].slice(0, MAX_HISTORY);

      isUndoingRef.current = true;

      return {
        past: newPast,
        present: newPresent,
        future: newFuture,
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((prev) => {
      if (prev.future.length === 0) return prev;

      const newFuture = prev.future.slice(1);
      const newPresent = prev.future[0];
      const newPast = [...prev.past, prev.present].slice(-MAX_HISTORY);

      isUndoingRef.current = true;

      return {
        past: newPast,
        present: newPresent,
        future: newFuture,
      };
    });
  }, []);

  const replace = useCallback((newPresent: T) => {
    setHistory((prev) => ({
      ...prev,
      present: newPresent,
    }));
  }, []);

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  return {
    state: history.present,
    set,
    replace,
    undo,
    redo,
    canUndo,
    canRedo,
  };
}
