import { RefObject, useEffect, useRef, useState } from "react";

export function useObserver(ref: RefObject<HTMLElement>) {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const [isVisible, setIsVisible] = useState<boolean>(false)

  console.log(ref);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(([entry]) => {
        setIsVisible(entry.isIntersecting)
        console.log({entry});
      })
  }, [])

  useEffect(() => {
    if (ref.current && observerRef.current) {
      observerRef.current?.observe(ref.current)
    }

    return () => {
      observerRef.current?.disconnect()
    }
  }
    // ,[ref]
    // ! Doesnt work with 'ref' dependency, ref.current is null
  )

  return {isVisible, observerRef}
}