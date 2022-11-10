import React from 'react'
import "./Footer.css";

const Footer = () => {
  return (
    <>
<footer class="bg-gray-100 footer text-center">
  <div class="px-6 pt-6">
    <form action="">
      <div class="grid md:grid-cols-3 gird-cols-1 gap-4 flex justify-center items-center">
        <div class="md:ml-auto md:mb-6">
          <p class="text-gray-800">
            <strong>Sign up for our newsletter</strong>
          </p>
        </div>

        <div class="md:mb-6">
          <input
            type="text"
            class="
              form-control
              block
              w-full
              px-3
              py-1.5
              text-base
              font-normal
              text-gray-700
              bg-white bg-clip-padding
              border border-solid border-gray-300
              rounded
              transition
              ease-in-out
              m-0
              focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
            "
            id="exampleFormControlInput1"
            placeholder="Email address"/>
        </div>

        <div class="md:mr-auto mb-6">
          <button type="button" class="inline-block px-6 py-2.5 bg-green-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-white-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out">Subscribe</button>
        </div>
      </div>
    </form>
  </div>

  <div class="text-center text-gray-700 p-4 bg-color: rgba(0, 0, 0, 0.2);">
    © 2022 Copyright:
    <a class="text-gray-800" href="https://tailwind-elements.com/">Amenshi 4 Life</a>
  </div>
</footer>  
    </>
  )
}

export default Footer;