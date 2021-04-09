import React from 'react'

const copyClipboard = ({ color = '#A7B1F4' }) => (
  <>
    <path
      d="M17 1H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V3a2 2 0 00-2-2z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 15v2a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2h2"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </>
)

const home = ({ color = 'white' }) => (
  <path
    d="M1 19h18M8 19v-3a2 2 0 014 0v3m-8-1V7m12 0v11M2 9l8-8 8 8H2z"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  />
)

const trade = ({ color = 'white' }) => (
  <>
    <path
      d="M2 3a2 2 0 104 0 2 2 0 00-4 0zM14 17a2 2 0 104 0 2 2 0 00-4 0zM14 17H9a5 5 0 01-5-5V9l-3 3"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 3h5a5 5 0 015 5v3m0 0l3-3m-3 3l-3-3"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </>
)

const bridges = ({ color = 'white' }) => (
  <path
    d="M3 19a2 2 0 100-4 2 2 0 000 4zM17 5a2 2 0 100-4 2 2 0 000 4zM9 17h5.5a3.5 3.5 0 100-7h-8a3.5 3.5 0 110-7H11"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  />
)

const earn = ({ color = 'white' }) => (
  <>
    <path
      d="M4 1h12l3 6.438-8.5 11.334a.701.701 0 01-.229.169.651.651 0 01-.542 0 .7.7 0 01-.229-.17L1 7.438 4 1z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M8 10L6 7.25 7 5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </>
)

const charts = ({ color = 'white' }) => (
  <path
    d="M1 19l4.5-7.2 4.5 2.4 4.5-6L19 13v5a1 1 0 01-1 1H1zM1 10.6l3.375-4.8 4.5 2.4L14.5 1 19 5.8"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  />
)

const market = ({ color = 'white' }) => (
  <>
    <path
      d="M4 19a2 2 0 100-4 2 2 0 000 4zM15 19a2 2 0 100-4 2 2 0 000 4zM15 15H4V1H1"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M4 3l15 1-1 7H4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </>
)

const planet = ({ color = 'white' }) => (
  <>
    <path
      d="M16.045 11.677c2.05 1.913 3.173 3.579 2.767 4.384-.667 1.306-5.175-.232-10.07-3.434C3.847 9.425.417 5.77 1.082 4.464c.416-.814 2.619-.397 5.193.72"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.947 16.526A6.263 6.263 0 109.947 4a6.263 6.263 0 000 12.526z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </>
)

const wallet = ({ color = 'white' }) => (
  <>
    <path
      d="M15 3.6V3a1 1 0 00-1-1H4a2 2 0 00-2 2m0 0a2 2 0 002 2h12a1 1 0 011 1v3M2 4v12a2 2 0 002 2h12a1 1 0 001-1v-3"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M18 10v4h-4a2 2 0 010-4h4z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </>
)

const alien = ({ color = 'white' }) => (
  <path
    d="M9.09 14.444a2.317 2.317 0 001.817 0M9.998 2C5.76 2 3.276 4.072 2.852 6.973A10.322 10.322 0 004.67 14.61a9.705 9.705 0 002.908 2.723 4.734 4.734 0 004.844 0 9.704 9.704 0 002.908-2.723 10.387 10.387 0 001.817-7.637C16.724 4.071 14.241 2 10.002 2h-.004zM6.363 9.11l1.817 1.778M13.634 9.11l-1.818 1.778"
    strokeWidth={2}
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
  />
)

const settings = ({ color = 'white' }) => (
  <>
    <path
      d="M11.8 2.142c0-.63-.511-1.142-1.142-1.142H9.343C8.711 1 8.2 1.511 8.2 2.142c0 .52-.356.967-.841 1.158-.077.03-.154.063-.228.095-.478.207-1.046.144-1.415-.224a1.142 1.142 0 00-1.615 0l-.93.93a1.142 1.142 0 000 1.615v0c.369.369.432.936.223 1.415a7.14 7.14 0 00-.095.228c-.19.485-.637.841-1.157.841C1.512 8.2 1 8.711 1 9.342v1.316c0 .63.511 1.142 1.142 1.142.52 0 .967.356 1.158.841.03.077.063.153.094.228.208.478.145 1.046-.223 1.415a1.142 1.142 0 000 1.615l.93.93a1.142 1.142 0 001.615 0c.369-.369.936-.432 1.415-.224.074.033.151.065.228.096.485.19.841.637.841 1.157 0 .63.511 1.142 1.142 1.142h1.316c.63 0 1.142-.511 1.142-1.142 0-.52.356-.967.841-1.158a6.35 6.35 0 00.228-.094c.478-.209 1.046-.145 1.414.223a1.142 1.142 0 001.616 0l.93-.93a1.142 1.142 0 000-1.615v0c-.369-.369-.432-.936-.224-1.415.033-.075.065-.151.096-.227.19-.486.637-.842 1.157-.842.63 0 1.142-.511 1.142-1.142V9.343c0-.63-.511-1.142-1.142-1.142-.52 0-.967-.357-1.158-.842a7.167 7.167 0 00-.095-.227c-.207-.478-.144-1.046.224-1.415a1.142 1.142 0 000-1.615l-.93-.93a1.142 1.142 0 00-1.615 0v0c-.369.369-.936.432-1.415.224a7.127 7.127 0 00-.227-.096c-.486-.191-.842-.638-.842-1.157v0z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.7 10a2.7 2.7 0 11-5.4 0 2.7 2.7 0 015.4 0v0z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </>
)

const arrowDown = ({ color = 'white' }) => (
  <>
    <path d="M16.292 6.293a1.001 1.001 0 011.415 1.414l-7 7a1.001 1.001 0 01-1.415-1.414l7-7z" fill={color} />
    <path d="M2.293 7.707a1 1 0 111.415-1.414l7 7a1 1 0 11-1.416 1.414l-6.999-7z" fill={color} />
  </>
)

const swap = ({ color = 'white' }) => (
  <>
    <path
      d="M2 3a2 2 0 104 0 2 2 0 00-4 0zM14 17a2 2 0 104 0 2 2 0 00-4 0zM14 17H9a5 5 0 01-5-5V9l-3 3"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 3h5a5 5 0 015 5v3m0 0l3-3m-3 3l-3-3"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </>
)

const Icons = {
  home,
  trade,
  bridges,
  swap,
  earn,
  charts,
  market,
  planet,
  wallet,
  alien,
  settings,
  copyClipboard,
  arrowDown
}

export default Icons
