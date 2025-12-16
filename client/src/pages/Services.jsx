import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { Spinner } from '../components/common/Spinner';
import Button from '../components/common/Button';
import { Link } from 'react-router-dom';

const Services = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['public-services'],
        queryFn: () => apiService.services.getAll({ active: true }),
    });

    const services = data?.data?.data || [];

    return (
        <>
            <Helmet>
                <title>Our Services - Amenshi 4 Life</title>
                <meta name="description" content="Learn about our water well drilling, baby rescue, and education programs in Zambia" />
            </Helmet>

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-accent to-accent-hover text-white py-20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
                    <p className="text-xl max-w-3xl mx-auto">
                        Discover the ways we're making a lasting impact in communities across Zambia
                    </p>
                </div>
            </section>

            {/* Services Content */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4">
                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <Spinner size="lg" />
                        </div>
                    ) : services.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-gray-600 text-lg">No services available at the moment.</p>
                        </div>
                    ) : (
                        <div className="space-y-16">
                            {services.map((service, index) => (
                                <div
                                    key={service._id}
                                    className={`grid md:grid-cols-2 gap-12 items-center ${index % 2 !== 0 ? 'bg-gray-50 -mx-4 px-4 py-12 md:-mx-8 md:px-8' : ''}`}
                                >
                                    {/* Image */}
                                    <div className={index % 2 === 0 ? '' : 'md:order-2'}>
                                        {service.image ? (
                                            <img
                                                src={service.image}
                                                alt={service.title}
                                                className="w-full h-auto rounded-lg shadow-xl object-cover"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="w-full h-96 bg-primary rounded-lg shadow-xl flex items-center justify-center">
                                                <i className="fa-solid fa-heart text-accent text-6xl opacity-50"></i>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className={index % 2 === 0 ? '' : 'md:order-1'}>
                                        <h2 className="text-3xl font-bold text-accent mb-6">
                                            {service.title}
                                        </h2>
                                        <p className="text-gray-700 mb-6 leading-relaxed">
                                            {service.description}
                                        </p>

                                        {/* Service Details */}
                                        {service.details && service.details.length > 0 && (
                                            <div className="mb-8">
                                                <h4 className="text-lg font-semibold text-gray-900 mb-4">What We Do:</h4>
                                                <ul className="space-y-3">
                                                    {service.details.map((detail, idx) => (
                                                        <li key={idx} className="flex items-start">
                                                            <i className="fa-solid fa-check text-accent mr-3 mt-1"></i>
                                                            <span className="text-gray-700">{detail}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* CTA */}
                                        <div className="flex gap-4">
                                            <Link to="/contact">
                                                <Button>Get Involved</Button>
                                            </Link>
                                            <a
                                                href="https://www.paypal.com/donate"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Button variant="outline">Donate Now</Button>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-16 bg-primary">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-accent mb-6">Ready to Make a Difference?</h2>
                    <p className="text-gray-700 mb-8 text-lg">
                        Your support helps us provide clean water, rescue babies, and empower communities through education.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/contact">
                            <Button size="lg">Contact Us</Button>
                        </Link>
                        <a
                            href="https://www.paypal.com/donate"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button size="lg" variant="outline">
                                Donate Today
                            </Button>
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Services;
