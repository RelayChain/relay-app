import React from 'react'

const ListMode = ({ fillColor = '#FFFFFF' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="12" viewBox="0 0 13 12">
    <g fill="none">
      <polygon points="13 0.5 13 1.5 4 1.5 4 0.5" />
      <polygon points="13 5.5 13 6.5 4 6.5 4 5.5" />
      <polygon points="13 10.5 13 11.5 4 11.5 4 10.5" />
      <circle cx="1" cy="1" r="1" />
      <circle cx="1" cy="6" r="1" />
      <circle cx="1" cy="11" r="1" />
    </g>
  </svg>
)
export default ListMode
