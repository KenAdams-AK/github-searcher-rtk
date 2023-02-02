export function parseLink (link: string): string {
  let nextUrl: string = ''
  const nextPattern = /(?<=<)([\S]*)(?=>; rel="Next")/i;
  const pagesRemaining = link.includes(`rel=\"next\"`)

  if (link && pagesRemaining) {
    const arr = link.match(nextPattern)
    if (arr && arr.length > 0) {
      nextUrl = arr[0]
    }
  }

  console.log({ nextUrl });
  return nextUrl
}