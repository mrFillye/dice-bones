/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.

declare type ValueOf<T> = T[keyof T]

declare module '*.webp' {
  const ref: string
  export default ref
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string }
  export default classes
}
