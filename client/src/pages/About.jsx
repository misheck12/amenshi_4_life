import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { Spinner } from '../components/common/Spinner';

const About = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['team'],
        queryFn: () => apiService.team.getAll(),
    });

    const team = data?.data?.data || [];

    return (
        <>
            <Helmet>
                <title>About Us - Amenshi 4 Life</title>
                <meta name="description" content="Learn about Amenshi 4 Life, our mission to provide clean water and care for communities in Zambia." />
            </Helmet>

            {/* Hero */}
            <section className="bg-gradient-to-r from-accent to-accent-hover text-white py-20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
                    <p className="text-xl max-w-3xl mx-auto">
                        We are part of The <span className="font-bold">Talmudine Foundation</span>: a non-profit ministry
                        serving needs for clean water and care for abandoned babies in Zambia, Africa.
                    </p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                        <div>
                            <img
                                src="/images/mission.jpg"
                                alt="Clean water well in Zambia"
                                className="rounded-lg shadow-xl w-full"
                                loading="lazy"
                            />
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold text-accent mb-6">
                                8 Years of Experience in Drilling and Maintenance of Water Wells
                            </h2>

                            <p className="text-gray-700 mb-4">
                                We are called to demonstrate Christ's love in communities by providing clean water.
                                We believe that access to clean water is a basic human right, and we are committed to
                                helping communities in need gain access to this vital resource.
                            </p>

                            <p className="text-gray-700">
                                Water-borne diseases are a major concern in Zambia, where poor sanitary services
                                and lack of clean water are all too common. We are dedicated to reducing the incidence
                                of water-borne diseases in the communities we serve.
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-primary p-8 rounded-lg shadow-lg">
                            <h3 className="text-2xl font-bold text-accent mb-4">Our Mission</h3>
                            <p className="text-gray-700">
                                Our mission is to provide clean water and care for abandoned babies in Zambia, Africa.
                                The foundation is a partnership between missions-minded believers in the USA and
                                Gilgal Christian Community Centre in Kitwe, Zambia.
                            </p>
                        </div>

                        <div className="bg-primary p-8 rounded-lg shadow-lg">
                            <h3 className="text-2xl font-bold text-accent mb-4">Our Vision</h3>
                            <p className="text-gray-700">
                                Our vision is a future where every community in Zambia has access to clean, safe drinking water
                                and where every child is cared for with love and dignity. We work towards sustainable solutions
                                that empower communities for generations to come.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-4">
                        Meet the <span className="text-accent">Team</span>
                    </h2>
                    <p className="text-center text-gray-600 mb-12">
                        Dedicated individuals making a difference in Zambia
                    </p>

                    {isLoading ? (
                        <div className="flex justify-center">
                            <Spinner size="lg" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {team.map((member) => (
                                <div key={member._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                                    <div className="relative h-64 bg-gray-200">
                                        {member.image ? (
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <i className="fa-solid fa-user text-6xl text-gray-400"></i>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6">
                                        <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                                        <p className="text-accent font-medium mb-3">{member.role}</p>
                                        {member.bio && (
                                            <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                                        )}

                                        {member.social && (
                                            <div className="flex gap-3">
                                                {member.social.facebook && (
                                                    <a href={member.social.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-accent">
                                                        <i className="fa-brands fa-facebook text-xl"></i>
                                                    </a>
                                                )}
                                                {member.social.twitter && (
                                                    <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-accent">
                                                        <i className="fa-brands fa-twitter text-xl"></i>
                                                    </a>
                                                )}
                                                {member.social.linkedin && (
                                                    <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-accent">
                                                        <i className="fa-brands fa-linkedin text-xl"></i>
                                                    </a>
                                                )}
                                                {member.social.instagram && (
                                                    <a href={member.social.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-accent">
                                                        <i className="fa-brands fa-instagram text-xl"></i>
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default About;
