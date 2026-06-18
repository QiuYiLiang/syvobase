export function useFocusClassName(focus: boolean) {
  return ['hover:ring-2 hover:ring-ring/80', focus && 'ring-2 ring-ring/50!']
}
