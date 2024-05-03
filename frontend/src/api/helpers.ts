export const REFETCH_INTERVAL_MS = 15000;

export function onChainSimpleMapToMap(
  onChainSimpleMap: { key: string; value: any }[],
): Map<string, any> {
  let out = new Map();
  for (var item of onChainSimpleMap) {
    out.set(item.key, item.value);
  }
  return out;
}
