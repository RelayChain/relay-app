import { useState, useEffect } from 'react';

const useResize = (myRef: any) => {
    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(0)
  
    useEffect(() => {
      const handleResize = () => {
        setWidth(myRef.current.offsetWidth - 50)
        setHeight(myRef.current.offsetHeight)
      }
  
      window.addEventListener('resize', handleResize)
  
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }, [myRef])
  
    return { width, height }
  }

  export default useResize;