import React from 'react'
import { useLocation } from 'react-router-dom';

function Home() {
    const location = useLocation();
    const user = location.state?.login || 'No message';
    // console.log(message)
  return (
    <div>{user.name}</div>
  )
}

export default Home