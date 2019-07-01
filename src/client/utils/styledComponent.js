import styled from '@emotion/styled'

// HOC that applies a hashed class to a component or HTML tag
export function styledComponent(Comp, styleObject) {
  return styled(Comp)(styleObject)
}
