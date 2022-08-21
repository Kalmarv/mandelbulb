const Logo = () => {
  return (
    <a href='https://kalmarv.xyz/' target='_blank' rel='noopener noreferrer'>
      <div className='transition fixed bottom-4 left-4 fill-white stroke-white w-10 h-10 md:w-16 md:h-16 hover:fill-[#ff8f88] hover:stroke-[#ff8f88]'>
        <svg viewBox='205.1 165.5 130 130' xmlns='http://www.w3.org/2000/svg'>
          <path
            style={{
              height: '100%',
              width: '100%',
              fillOpacity: '1',
              strokeWidth: '5',
              strokeLinejoin: 'round',
              strokeDasharray: 'none',
              strokeOpacity: '1',
              paintOrder: 'fill',
            }}
            d='M43.1 7.6c-29.4 15.9-26.7 40-26.7 40v85S43 119 43 92.6zM55.1 85l20-20 45 45h-40ZM53.2 72.6l65-65h-35l-30 30z'
            transform='translate(201.9 160.5)'
          />
        </svg>
      </div>
    </a>
  )
}

export default Logo
