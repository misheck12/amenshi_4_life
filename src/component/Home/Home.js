import React from 'react';
import Footer from '../Footer/Footer';
import "./Home.css";
import "./img/home3.png";

const Home = () => {
  return (
	<>
	<div className='Home pt-8'>
		<div className='Home-container'>
			<div className='Home-header'>
			<h1>
				<q>Thousands have lived without love, not one without water.</q>H. Auden
			</h1>
			<p>We are a non-profit ministry serving needs for clean water and care for abandoned babies in Zambia, Africa.</p>
			<button className='Home-header-btn'>Donate Now</button>
			</div>
		</div>

	</div>

	<section className='About-us'>
		<div className='flex-container'>
			<h2><i className="fa-solid fa-hand-holding-droplet"></i>20 Boreholes donated</h2>
			<h2><i className="fa-solid fa-hand-holding-droplet"></i>30 Boreholes repaired</h2>
			<h2><i className="fa-solid fa-hand-holding-droplet"></i>60 communities benefiting</h2>
		</div>

		<div className="flex flex-row ">
          <div className='w-1/2 h-12 md-10 pt-11'>
			<img src={require('./img/back.jpg')} alt="home3" />
		  </div>
          <div className='grow-0 shrink-0 basis-auto w-full lg:w-6/12 xl:w-8/12'>
          <div className='px-6 py-12 md:px-12'>
            <h2 className="text-1xl text-center mb-4">This is us</h2>
            <p className="uppercase text-3xl text-green-600 font-bold mb-6 flex items-center">
             We believe in the power giving
            </p>
            <p className="text-gray-500 mb-6 Abousec">
            Amenshi 4 life is dedicated to bringing clean, safe drinking water to communities in need around the world.
             We believe that access to clean water is a basic human right and are committed to working towards a future where everyone
              has access to this vital resource.Over the years, we have partnered with local organizations and communities to implement
               a range of water projects, including drilling and Repairing wells.
            </p>
            <p className="text-gray-500 mb-10">
            In addition to our water projects, we also prioritize education and awareness-raising about the importance of clean water.
            We believe that by empowering communities with knowledge and resources, we can create lasting change and ensure that everyone
            has the opportunity to live a healthy and fulfilling life.
            Thank you for supporting our mission to bring clean water to those who need it most. Together, we can make a difference and
            create a world where everyone has access to this essential human right.
            </p>
          <a href="https://app.clovergive.com/App/Giving/talm10e206" >
          <button className='Home-btn mt-20px' blank>Donate Now</button>
          </a>
          </div>
        </div>
      </div>
      <div className='grow-0 shrink-0 basis-auto w-full bg-#f5faf9'>
          <div className='px-6 py-12 md:px-12'>
            <h2 className="text-1xl text-center mb-4">Our projects</h2>
            <p className="uppercase text-3xl text-green-600 font-bold mb-6 text-center">
              What we are doing now
            </p>
            <p className="text-gray-500 mb-6 text-center m-20">
            Our borehole donation work involves drilling deep into the ground to access underground water sources,
            and installing pumps and other infrastructure to bring the water to the surface. This process can be 
            costly and time-consuming, but it is an effective way to provide clean, safe drinking water to communities
            that may not have access to it otherwise.
            </p>

          </div>
      </div>
<div className="container mt-24 mx-auto mb-50">
  <section className="mb-32 text-gray-800 text-left">

    <h2 className="text-3xl font-bold mb-12 text-center">Latest Projects</h2>

    <div className="grid lg:grid-cols-3 gap-6 xl:gap-x-12">
      <div className="mb-6 lg:mb-0">
        <div>
          <div
            className="relative overflow-hidden bg-no-repeat bg-cover relative overflow-hidden bg-no-repeat bg-cover ripple shadow-lg rounded-lg mb-6"
            data-mdb-ripple="true" data-mdb-ripple-color="light">
            <img src={require('./img/kamatipa.jpg')}
              className="w-full" alt="Louvre" />
            <a href="#!">
              <div className="absolute top-0 right-0 bottom-0 left-0 w-full h-full overflow-hidden bg-fixed opacity-0 hover:opacity-100 transition duration-300 ease-in-out bg-color: rgba(251, 251, 251, 0.2)"></div>
            </a>
          </div>

          <h5 className="text-lg font-bold mb-3">Kamatipa Drilling</h5>
          <div className="mb-3 text-red-600 font-medium text-sm flex items-center justify-center">
            <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path fill="currentColor" d="M248 8C111.03 8 0 119.03 0 256s111.03 248 248 248 248-111.03 248-248S384.97 8 248 8zm82.29 357.6c-3.9 3.88-7.99 7.95-11.31 11.28-2.99 3-5.1 6.7-6.17 10.71-1.51 5.66-2.73 11.38-4.77 16.87l-17.39 46.85c-13.76 3-28 4.69-42.65 4.69v-27.38c1.69-12.62-7.64-36.26-22.63-51.25-6-6-9.37-14.14-9.37-22.63v-32.01c0-11.64-6.27-22.34-16.46-27.97-14.37-7.95-34.81-19.06-48.81-26.11-11.48-5.78-22.1-13.14-31.65-21.75l-.8-.72a114.792 114.792 0 0 1-18.06-20.74c-9.38-13.77-24.66-36.42-34.59-51.14 20.47-45.5 57.36-82.04 103.2-101.89l24.01 12.01C203.48 89.74 216 82.01 216 70.11v-11.3c7.99-1.29 16.12-2.11 24.39-2.42l28.3 28.3c6.25 6.25 6.25 16.38 0 22.63L264 112l-10.34 10.34c-3.12 3.12-3.12 8.19 0 11.31l4.69 4.69c3.12 3.12 3.12 8.19 0 11.31l-8 8a8.008 8.008 0 0 1-5.66 2.34h-8.99c-2.08 0-4.08.81-5.58 2.27l-9.92 9.65a8.008 8.008 0 0 0-1.58 9.31l15.59 31.19c2.66 5.32-1.21 11.58-7.15 11.58h-5.64c-1.93 0-3.79-.7-5.24-1.96l-9.28-8.06a16.017 16.017 0 0 0-15.55-3.1l-31.17 10.39a11.95 11.95 0 0 0-8.17 11.34c0 4.53 2.56 8.66 6.61 10.69l11.08 5.54c9.41 4.71 19.79 7.16 30.31 7.16s22.59 27.29 32 32h66.75c8.49 0 16.62 3.37 22.63 9.37l13.69 13.69a30.503 30.503 0 0 1 8.93 21.57 46.536 46.536 0 0 1-13.72 32.98zM417 274.25c-5.79-1.45-10.84-5-14.15-9.97l-17.98-26.97a23.97 23.97 0 0 1 0-26.62l19.59-29.38c2.32-3.47 5.5-6.29 9.24-8.15l12.98-6.49C440.2 193.59 448 223.87 448 256c0 8.67-.74 17.16-1.82 25.54L417 274.25z"/></svg>Travels
          </div>
          <p className="text-gray-500 text-center">
            Kamatipa is home to 15,000 residents the area is populated by youths and children
            With few school and no clean water sources kamatipa suffers from water born diseases and low literacy.
            We have donated a borehole which is 30 meters deep to benefit the community , and we are hope that the story will change
          </p>
        </div>
      </div>

      <div className="mb-6 lg:mb-0">
        <div>
          <div
            className="relative overflow-hidden bg-no-repeat bg-cover relative overflow-hidden bg-no-repeat bg-cover ripple shadow-lg rounded-lg mb-6"
            data-mdb-ripple="true" data-mdb-ripple-color="light">
            <img src={require('./img/new1.jpg')}
              className="w-full" alt="Louvre" />
            <a href="#!">
              <div className="absolute top-0 right-0 bottom-0 left-0 w-full h-full overflow-hidden bg-fixed opacity-0 hover:opacity-100 transition duration-300 ease-in-out bg-color: rgba(251, 251, 251, 0.2)"></div>
            </a>
          </div>

          <h5 className="text-lg font-bold mb-3">New Kitwe Repairs</h5>
          <div className="mb-3 text-blue-600 font-medium text-sm flex items-center justify-center">
            <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M204.3 5C104.9 24.4 24.8 104.3 5.2 203.4c-37 187 131.7 326.4 258.8 306.7 41.2-6.4 61.4-54.6 42.5-91.7-23.1-45.4 9.9-98.4 60.9-98.4h79.7c35.8 0 64.8-29.6 64.9-65.3C511.5 97.1 368.1-26.9 204.3 5zM96 320c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm32-128c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm128-64c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm128 64c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z"/></svg>Art
          </div>
          <p className="text-gray-500">
            we have repaired two wells in new kitwe so far, this has been of benefit to this
             community owing to the fact that there is no other source of water apart from these wells.
          </p>
        </div>
      </div>

      <div className="mb-0">
        <div>
          <div
            className="relative overflow-hidden bg-no-repeat bg-cover relative overflow-hidden bg-no-repeat bg-cover ripple shadow-lg rounded-lg mb-6"
            data-mdb-ripple="true" data-mdb-ripple-color="light">
            <img src={require('./img/new2.jpg')}
              className="w-full" alt="Louvre" />
            <a href="#!">
              <div className="absolute top-0 right-0 bottom-0 left-0 w-full h-full overflow-hidden bg-fixed opacity-0 hover:opacity-100 transition duration-300 ease-in-out bg-color: rgba(251, 251, 251, 0.2)"></div>
            </a>
          </div>

          <h5 className="text-lg font-bold mb-3">Race course well donation</h5>
          <div className="mb-3 text-yellow-500 font-medium text-sm flex items-center justify-center">
            <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M608 64H32C14.33 64 0 78.33 0 96v320c0 17.67 14.33 32 32 32h576c17.67 0 32-14.33 32-32V96c0-17.67-14.33-32-32-32zM48 400v-64c35.35 0 64 28.65 64 64H48zm0-224v-64h64c0 35.35-28.65 64-64 64zm272 176c-44.19 0-80-42.99-80-96 0-53.02 35.82-96 80-96s80 42.98 80 96c0 53.03-35.83 96-80 96zm272 48h-64c0-35.35 28.65-64 64-64v64zm0-224c-35.35 0-64-28.65-64-64h64v64z"/></svg>Business
          </div>
          <p className="text-gray-500">
            We drilled this well 10 years ago and the community is still benefiting from it. 
            we have changed the pump and pipes , changed the base and rebuilt a new one . 
            we are happy to know that this well has served alot of residents who have no 
            other soursce of water.
          </p>
        </div>
      </div>
    </div>

  </section>

</div>
        
	</section>
  <div> <Footer /></div>
	</>

  )
}

export default Home;
