import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { Spinner, LoadingPage } from '../components/common/Spinner';
import { formatDate } from '../utils/helpers';
import NewsletterSignup from '../components/common/NewsletterSignup';

const Stories = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['public-stories'],
        queryFn: () => apiService.stories.getAll({ status: 'published' }),
    });

    const stories = data?.data?.data || [];

    if (isLoading) return <LoadingPage />;

    return (
        <div className="pt-20 pb-16">
            <Helmet>
                <title>Stories & Updates - Amenshi 4 Life</title>
                <meta name="description" content="Read the latest stories from the field, updates on our water projects, and news about our mission in Zambia." />
            </Helmet>

            <div className="bg-accent text-white py-16 mb-12">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display">Stories from the Field</h1>
                    <p className="text-xl max-w-2xl mx-auto text-blue-100">
                        Witness the impact of clean water and compassion through the stories of the communities we serve.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4">
                {stories.length === 0 ? (
                    <div className="text-center py-12">
                        <i className="fa-solid fa-newspaper text-6xl text-gray-200 mb-4"></i>
                        <p className="text-xl text-gray-500">No stories published yet. Check back soon!</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {stories.map(story => (
                            <div key={story._id} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300">
                                <Link to={`/stories/${story.slug || story._id}`} className="block h-48 overflow-hidden relative group">
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 z-10" />
                                    <img
                                        src={story.imageUrl || '/images/hero-bg.jpg'}
                                        alt={story.title}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                    />
                                </Link>
                                <div className="p-6 flex-grow flex flex-col">
                                    <div className="flex items-center text-xs text-gray-500 mb-3 space-x-2">
                                        <span className="bg-blue-50 text-accent px-2 py-1 rounded-full uppercase tracking-wider font-semibold">
                                            {story.tags && story.tags.length > 0 ? story.tags[0] : 'Update'}
                                        </span>
                                        <span>•</span>
                                        <span>{formatDate(story.publishedAt || story.createdAt)}</span>
                                    </div>
                                    <Link to={`/stories/${story.slug || story._id}`} className="block">
                                        <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-accent transition-colors line-clamp-2">
                                            {story.title}
                                        </h2>
                                    </Link>
                                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm flex-grow">
                                        {story.summary}
                                    </p>
                                    <div className="pt-4 border-t flex justify-between items-center text-sm">
                                        <span className="text-gray-500">By {story.author}</span>
                                        <Link to={`/stories/${story.slug || story._id}`} className="text-accent font-medium hover:text-blue-700">
                                            Read More <i className="fa-solid fa-arrow-right ml-1"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-20">
                    <NewsletterSignup />
                </div>
            </div>
        </div>
    );
};

export default Stories;
