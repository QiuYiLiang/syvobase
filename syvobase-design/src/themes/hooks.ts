import { useContext } from 'react'
import { SyvobaseUiContext } from '@/syvobaseUI'

export function useTheme() {
  return useContext(SyvobaseUiContext).theme
}

export function useDark() {
  return useContext(SyvobaseUiContext).dark
}
