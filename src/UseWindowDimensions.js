// Imports for react components
// useEffect - https://react.dev/reference/react/useEffect
// useState - https://react.dev/reference/react/useState
//
import { useState, useEffect } from 'react';



// getWindowDimensions - Function to get the current window dimensions
// Get window dimensions from the global window variable and return them as an object
// return: {width: Current screen width, height: Current screen height}
//
function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

// useWindowDimensions - Simple hook that returns an object with a width and height property corresponding to the window size in pixels
// Basic flow: 
// --> useEffect adds an eventlistener for whenever the browser window size changes
// --> Whenever the browser window is rezised update the value (handleResize)
// --> return the width and height of the window in pixels as an object with properties width and height
// return: {width: Current screen width, height: Current screen height}
//
export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}