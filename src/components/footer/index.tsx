import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-custom-purple-2-100 text-secondary py-8 w-full">
      <div className="container mx-auto px-4 flex flex-wrap justify-between items-center">
        <div className="w-full md:w-1/4 mb-6 md:mb-0 text-center md:text-left">
          <h1 className=""><img src="../images/logo2.png" alt=""
            className="w-[70px] h-[70px] lg:w-[150px] lg:h-[150px] mx-auto" /></h1>
        </div>
        <div className="w-full md:w-3/4 flex flex-wrap justify-around text-center">
          <div className="mb-6 md:mb-0 text-white">
            <a href="#"
              className="block mb-2 hover:text-secondary  ">CONTACT</a>
            <a href="#" className="flex mb-2 font-mono hover:text-secondary items-center "><svg
              xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 512 512" fill='white'>
              <path
                d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM0 176L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-208L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
            </svg><span className="ms-[10px]">anjarridho081@gmail.com</span></a>
            <a href="#" className="flex mb-2 font-mono hover:text-secondary items-center"><svg
              xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 512 512" fill='white'>
              <path
                d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" />
            </svg><span className="ms-[10px]">+62 1234 5678 9990</span></a>
            <a href="#" className="flex mb-2 font-mono hover:text-secondary items-center"><svg
              xmlns="http://www.w3.org/2000/svg" height="20" width="15" viewBox="0 0 384 512" fill='white'>
              <path
                d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
            </svg><span className="ms-[15px]">Bandung Barat Lumpat</span></a>
          </div>

          <div className="mb-6 md:mb-0 text-white">
            <a href="#" className="block mb-2 hover:text-secondary ">NAVIGATION</a>
            <a href="#" className="block mb-2 hover:text-secondary font-mono">Beranda</a>
            <a href="#" className="block mb-2 hover:text-secondary font-mono">Tentang</a>
            <a href="#" className="block mb-2 hover:text-secondary font-mono">Kontak</a>
          </div>
        </div>
      </div>

      <div className="border-t border-secondary mt-8 lg:w-[1400px] mx-auto"></div>

      <div className='mt-8'>
        <div className="mt-[100px] lg:flex lg:justify-center lg:m-auto lg:w-[500px] lg:mt-0 ">
          <ul className="example-2">
            <li className="icon-content">
              <a href="https://www.linkedin.com/in/ridho-anjar-maulana-a27b94324?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" aria-label="LinkedIn" data-social="linkedin" target='_blank'>
                <div className="filled"></div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                  className="bi bi-linkedin" viewBox="0 0 16 16">
                  <path
                    d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"
                    fill="currentColor"></path>
                </svg>
              </a>
              <div className="tooltip">LinkedIn</div>
            </li>
            <li className="icon-content">
              <a href="https://www.github.com/RidhoAnjarM" aria-label="GitHub" data-social="github" target='_blank'>
                <div className="filled"></div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                  className="bi bi-github" viewBox="0 0 16 16">
                  <path
                    d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"
                    fill="currentColor"></path>
                </svg>
              </a>
              <div className="tooltip">GitHub</div>
            </li>
            <li className="icon-content">
              <a href="https://www.instagram.com/ridhoanjar_18" aria-label="Instagram" data-social="instagram" target='_blank'>
                <div className="filled"></div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                  className="bi bi-instagram" viewBox="0 0 16 16">
                  <path
                    d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"
                    fill="currentColor"></path>
                </svg>
              </a>
              <div className="tooltip">Instagram</div>
            </li>
            <li className="icon-content">
              <a href="https://youtube.com/" aria-label="Youtube" data-social="youtube" target='_blank'>
                <div className="filled"></div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                  className="bi bi-youtube" viewBox="0 0 16 16">
                  <path
                    d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z"
                    fill="currentColor"></path>
                </svg>
              </a>
              <div className="tooltip">Youtube</div>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center py-4 text-white">
        <p className="font-mono">&copy;Copyright 2024 Ridho Anjar M.</p>
      </div>
    </footer>
  )
}

export default Footer