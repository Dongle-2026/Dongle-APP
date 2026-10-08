import { termService } from '@/services/termService';
import type { TermDefinition } from '@/types/learning';
import { useCallback, useRef, useState } from 'react';
import { Alert } from 'react-native';

/**
 * 용어 저장/해제 (뉴스 상세와 저장한 용어 화면에서 공통 사용)
 * 낙관적 업데이트: 먼저 UI를 바꾸고, API가 실패하면 되돌린 뒤 알림.
 */
export function useTermSave(initialSavedIds: string[] = []) {
  const [savedIds, setSavedIds] = useState<Set<string>>(() => new Set(initialSavedIds));
  const pending = useRef(new Set<string>()); // 같은 용어의 연타 방지

  const change = useCallback(async (term: TermDefinition, next: boolean) => {
    if (pending.current.has(term.id)) return;
    pending.current.add(term.id);
    const apply = (on: boolean) =>
      setSavedIds((prev) => {
        const n = new Set(prev);
        if (on) n.add(term.id);
        else n.delete(term.id);
        return n;
      });

    apply(next);
    try {
      const res = await (next ? termService.saveTerm(term.id) : termService.unsaveTerm(term.id));
      if (res.status >= 400) throw new Error(`status ${res.status}`);
    } catch {
      apply(!next);
      Alert.alert(next ? '저장 실패' : '저장 해제 실패', '잠시 후 다시 시도해주세요.');
    } finally {
      pending.current.delete(term.id);
    }
  }, []);

  return {
    savedIds,
    isSaved: (id: string) => savedIds.has(id),
    save: (t: TermDefinition) => change(t, true),
    unsave: (t: TermDefinition) => change(t, false),
  };
}
