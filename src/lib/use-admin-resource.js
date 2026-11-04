import { useEffect, useState } from 'react';
import { useAdmin } from './admin-session';
export function useAdminResource(path) {
  const { api } = useAdmin();
  const [revision, setRevision] = useState(0);
  const [result, setResult] = useState(null);
  const key = `${path}:${revision}`;
  useEffect(() => {
    if (!path) return;
    const controller = new AbortController();
    api.request(path, { signal: controller.signal }).then(data => {
      if (!controller.signal.aborted) setResult({ key, data });
    }).catch(error => {
      if (!controller.signal.aborted) setResult({ key, error });
    });
    return () => controller.abort();
  }, [api, path, key]);
  const current = result?.key === key ? result : null;
  return { data: path ? current?.data : undefined, error: path ? current?.error : undefined, loading: !!path && !current, reload: () => setRevision(v => v + 1) };
}
