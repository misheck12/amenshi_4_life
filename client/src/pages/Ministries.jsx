import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { Spinner } from '../components/common/Spinner';
import Button from '../components/common/Button';

const Ministries = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['ministries'],
        queryFn: () => apiService.ministries.getAll({ active: true }),
    });

    const ministries = data?.data?.data || [];

    return (
        <>
            <Helmet>
                <title>Our Ministries - Amenshi 4 Life</title>
                <meta name="description" content="Learn about Amenshi4Life water well drilling and Somone House baby rescue ministries in Zambia" />
            </Helmet>

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-accent to-accent-hover text-white py-20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Ministries</h1>
                    <p className="text-xl max-w-3xl mx-auto">
                        Amenshi4Life drills and repairs water wells while Somone House rescues abandoned babies
                    </p>
                </div>
            </section>

            {/* Ministries Content */}
            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Spinner size="lg" />
                </div>
            ) : ministries.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-gray-600 text-lg">No ministries available at the moment.</p>
                </div>
            ) : (
                <>
                    {ministries.map((ministry, index) => (
                        <section
                            key={ministry._id}
                            className={`py-16 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                        >
                            <div className="max-w-7xl mx-auto px-4">
                                <div className="grid md:grid-cols-2 gap-12 items-center">
                                    {/* Image */}
                                    <div className={index % 2 === 0 ? '' : 'md:order-2'}>
                                        <img
                                            src={ministry.image}
                                            alt={ministry.title}
                                            className="w-full h-auto rounded-lg shadow-xl object-cover"
                                            loading="lazy"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className={index % 2 === 0 ? '' : 'md:order-1'}>
                                        <h2 className="text-3xl font-bold text-accent mb-6">
                                            {ministry.subtitle}
                                        </h2>

                                        {ministry.content.map((paragraph, idx) => (
                                            <p key={idx} className="text-gray-700 mb-4 leading-relaxed">
                                                {paragraph}
                                            </p>
                                        ))}

                                        <div className="mt-8">
                                            <Link to="/contact">
                                                <Button>Donate Now</Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    ))}
                </>
            )}

            {/* Call to Action Section */}
            <section className="py-16 bg-primary">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-accent mb-6">Support Our Ministries</h2>
                    <p className="text-gray-700 mb-8 text-lg">
                        Your donation helps provide clean water, rescue abandoned babies, and empower children through education.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/contact">
                            <Button size="lg">Get Involved</Button>
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

export default Ministries;
