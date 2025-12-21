import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { formatNumber } from '../utils/helpers';
import Button from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import { config } from '../config/config';

const Home = () => {
    // Fetch home content
    const { data: homeData, isLoading: homeLoading } = useQuery({
        queryKey: ['home-content'],
        queryFn: () => apiService.homeContent.get(),
    });

    // Fetch statistics
    const { data: statsData, isLoading: statsLoading } = useQuery({
        queryKey: ['statistics'],
        queryFn: () => apiService.statistics.get(),
    });

    // Fetch featured projects
    const { data: projectsData, isLoading: projectsLoading } = useQuery({
        queryKey: ['featured-projects'],
        queryFn: () => apiService.projects.getFeatured(),
    });

    const homeContent = homeData?.data?.data;
    const stats = statsData?.data?.data;
    const projects = projectsData?.data?.data || [];

    return (
        <>
            <Helmet>
                <title>Amenshi 4 Life - Clean Water for Zambia</title>
                <meta name="description" content="Non-profit ministry providing clean water wells and caring for abandoned babies in Zambia, Africa." />
            </Helmet>

            {/* Hero Section */}
            <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-primary to-white">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-40"
                    style={{ backgroundImage: homeContent?.heroImage ? `url(${homeContent.heroImage})` : "url('/images/hero-bg.jpg')" }}
                ></div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                    {homeLoading ? (
                        <Spinner size="lg" />
                    ) : (
                        <>
                            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                                <q className="italic">{homeContent?.heroQuote || 'Thousands have lived without love, not one without water.'}</q>
                                {homeContent?.heroAuthor && (
                                    <span className="block text-2xl md:text-3xl mt-4 text-gray-700">
                                        - {homeContent.heroAuthor}
                                    </span>
                                )}
                            </h1>

                            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                                {homeContent?.heroDescription || 'We are a non-profit ministry serving needs for clean water and care for abandoned babies in Zambia, Africa.'}
                            </p>

                            <a href={config.donationUrl} target="_blank" rel="noopener noreferrer">
                                <Button size="lg" className="text-xl px-8 py-4">
                                    Donate Now
                                </Button>
                            </a>
                        </>
                    )}
                </div>
            </section>

            {/* Statistics Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    {statsLoading ? (
                        <div className="flex justify-center">
                            <Spinner size="lg" />
                        </div>
                    ) : stats ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-accent text-center transform hover:-translate-y-2 transition-all duration-300">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                                    <i className="fa-solid fa-hand-holding-droplet text-blue-600 text-3xl"></i>
                                </div>
                                <h3 className="text-4xl font-extrabold text-gray-900 mb-2">{formatNumber(stats.boreholeDonated)}</h3>
                                <p className="text-gray-600 font-medium uppercase tracking-wide text-sm">Boreholes Donated</p>
                            </div>

                            <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-accent text-center transform hover:-translate-y-2 transition-all duration-300">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                                    <i className="fa-solid fa-screwdriver-wrench text-green-600 text-3xl"></i>
                                </div>
                                <h3 className="text-4xl font-extrabold text-gray-900 mb-2">{formatNumber(stats.boreholesRepaired)}</h3>
                                <p className="text-gray-600 font-medium uppercase tracking-wide text-sm">Boreholes Repaired</p>
                            </div>

                            <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-accent text-center transform hover:-translate-y-2 transition-all duration-300">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6">
                                    <i className="fa-solid fa-users text-purple-600 text-3xl"></i>
                                </div>
                                <h3 className="text-4xl font-extrabold text-gray-900 mb-2">{formatNumber(stats.communitiesBenefiting)}</h3>
                                <p className="text-gray-600 font-medium uppercase tracking-wide text-sm">Communities Served</p>
                            </div>

                            <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-accent text-center transform hover:-translate-y-2 transition-all duration-300">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-6">
                                    <i className="fa-solid fa-baby text-pink-500 text-3xl"></i>
                                </div>
                                <h3 className="text-4xl font-extrabold text-gray-900 mb-2">{formatNumber(stats.babiesRescued || 0)}</h3>
                                <p className="text-gray-600 font-medium uppercase tracking-wide text-sm">Babies Rescued</p>
                            </div>
                        </div>
                    ) : null}
                </div>
            </section>

            {/* About Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    {homeLoading ? (
                        <div className="flex justify-center">
                            <Spinner size="lg" />
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <img
                                    src={homeContent?.aboutImage || '/images/about-us.jpg'}
                                    alt="Community members celebrating clean water access"
                                    className="rounded-lg shadow-xl w-full h-auto object-cover"
                                    loading="lazy"
                                />
                            </div>

                            <div>
                                <h2 className="text-sm text-accent font-semibold mb-2">
                                    {homeContent?.aboutLabel || 'This is us'}
                                </h2>
                                <h3 className="text-3xl font-bold text-accent mb-6">
                                    {homeContent?.aboutHeading || 'We believe in the power of giving'}
                                </h3>

                                <p className="text-gray-700 mb-4">
                                    {homeContent?.aboutParagraph1 || 'Amenshi 4 Life is dedicated to bringing clean, safe drinking water to communities in need around the world. We believe that access to clean water is a basic human right and are committed to working towards a future where everyone has access to this vital resource.'}
                                </p>

                                <p className="text-gray-700 mb-6">
                                    {homeContent?.aboutParagraph2 || 'Over the years, we have partnered with local organizations and communities to implement a range of water projects, including drilling and repairing wells. In addition to our water projects, we also prioritize education and awareness-raising about the importance of clean water.'}
                                </p>

                                <Link to="/about">
                                    <Button variant="outline">Learn More About Us</Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Featured Projects */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-sm text-accent font-semibold text-center mb-2">Our Projects</h2>
                    <h3 className="text-3xl font-bold text-center mb-4">What We Are Doing Now</h3>
                    <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
                        Our borehole donation work involves drilling deep into the ground to access underground water sources,
                        and installing pumps and other infrastructure to bring the water to the surface.
                    </p>

                    {projectsLoading ? (
                        <div className="flex justify-center">
                            <Spinner size="lg" />
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-8">
                            {projects.map((project) => (
                                <Link
                                    key={project._id}
                                    to={`/projects/${project._id}`}
                                    className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                                >
                                    <div className="relative h-48 bg-gray-200 overflow-hidden">
                                        {project.images?.[0] ? (
                                            <img
                                                src={project.images[0]}
                                                alt={project.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <i className="fa-solid fa-image text-6xl text-gray-400"></i>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6">
                                        <h4 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                                            {project.title}
                                        </h4>
                                        <p className="text-gray-600 line-clamp-3">{project.description}</p>
                                        <div className="mt-4 flex items-center text-sm text-gray-500">
                                            <i className="fa-solid fa-location-dot mr-2"></i>
                                            {project.location}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    <div className="text-center mt-12">
                        <Link to="/projects">
                            <Button variant="outline" size="lg">View All Projects</Button>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;
