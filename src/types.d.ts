declare module "diff" {
  export function diffWordsWithSpace(
    oldStr: string,
    newStr: string
  ): Array<{ value: string; added?: boolean; removed?: boolean }>;
  export function diffChars(
    oldStr: string,
    newStr: string
  ): Array<{ value: string; added?: boolean; removed?: boolean }>;
}
