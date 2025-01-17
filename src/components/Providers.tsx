import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import { createContext } from "react"
import type { RsiProps } from "../types"
import type { CustomTheme } from "../theme"

export const RsiContext = createContext({} as any)


type ProvidersProps<T extends string> = {
  children: React.ReactNode
  theme: CustomTheme
  rsiValues: RsiProps<T>
}

export const rootId = "chakra-modal-rsi"

export const Providers = <T extends string>({ children, theme, rsiValues }: ProvidersProps<T>) => {
  const mergedTheme = extendTheme(theme);
  delete mergedTheme.styles.global.body;

  if (!rsiValues.fields) {
    throw new Error("Fields must be provided to react-spreadsheet-import")
  }

  return (
    <RsiContext.Provider value={rsiValues}>
      <ChakraProvider theme={mergedTheme} cssVarsRoot={`#${rootId}`} resetCSS={false}>
        {children}
      </ChakraProvider>
    </RsiContext.Provider>
  )
}