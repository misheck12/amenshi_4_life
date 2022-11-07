import React from 'react';
import "./Home.css";
import "./img/home3.png";

const Home = () => {
  return (
	<>
	<div className='Home'>
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
			<h2><i class="fa-solid fa-hand-holding-droplet"></i>20 Boreholes donated</h2>
			<h2><i class="fa-solid fa-hand-holding-droplet"></i>30 Boreholes repaired</h2>
			<h2><i class="fa-solid fa-hand-holding-droplet"></i>60 communities benefiting</h2>
		</div>

		<div class="flex flex-row ">
          <div class='w-1/2 h-12 md-10'>
			<img src={require('./img/back.jpg')} alt="home3" />
		  </div>
          <div class="grow-0 shrink-0 basis-auto w-full lg:w-6/12 xl:w-8/12">
          <div class="px-6 py-12 md:px-12">
            <h2 class="text-2xl font-bold mb-4">This is us</h2>
            <p class="uppercase text-red-600 font-bold mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="w-4 h-4 mr-2">
                <path fill="currentColor" />
                </svg>What's the secret of the great taste?
            </p>
            <p class="text-gray-500 mb-6 Abousec">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Earum maxime voluptas
              ipsam aliquam itaque cupiditate provident architecto expedita harum culpa odit,
              inventore rem molestias laborum repudiandae corporis pariatur quo eius iste!
              Quaerat, assumenda voluptates! Molestias, recusandae? Maxime fuga omnis ducimus.
            </p>
            <p class="text-gray-500">
              Commodi ut nisi assumenda alias maxime necessitatibus ad rem repellat explicabo,
              reiciendis illum suscipit iusto? Provident dignissimos similique, reiciendis
              inventore accusantium unde mollitia, deleniti quae atque error id perspiciatis
              illum. Laboriosam aperiam ab illo dignissimos obcaecati corporis similique a odio,
              optio iste quis placeat alias amet rerum sint quos dolor pariatur inventore
              possimus ad consequuntur fugiat perferendis consectetur laudantium.
            </p>
          </div>
        </div>
      </div>

	</section>
	</>
  )
}

export default Home;
