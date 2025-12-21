import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { apiService } from '../services/api';
import { LoadingPage } from '../components/common/Spinner';
import { formatDate } from '../utils/helpers';
import NewsletterSignup from '../components/common/NewsletterSignup';

const StoryDetail = () => {
    const { id } = useParams(); // 'id' matches route param name, which is likely ':id' in App.jsx but wait, in App.jsx I need to define it.
    // In the controller I used 'idOrSlug' but route param name depends on App.jsx definition.
    // I will check App.jsx route definition in next steps.
    // Assuming I will name the route param ':id'.

    const { data, isLoading, isError } = useQuery({
        queryKey: ['story', id],
        queryFn: () => apiService.stories.getOne(id),
    });

    const story = data?.data?.data;

    if (isLoading) return <LoadingPage />;

    if (isError || !story) {
        return (
            <div className="pt-32 pb-20 text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Story Not Found</h1>
                <Link to="/stories" className="text-accent hover:underline">Return to Stories</Link>
            </div>
        );
    }

    return (
        <div className="pt-20 pb-16">
            <Helmet>
                <title>{story.title} - Amenshi 4 Life</title>
                <meta name="description" content={story.summary} />
            </Helmet>

            {/* Hero Image */}
            <div className="h-[400px] w-full relative">
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <img
                    src={story.imageUrl || '/images/hero-bg.jpg'}
                    alt={story.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="container mx-auto px-4 text-center">
                        <div className="bg-accent inline-block px-3 py-1 rounded-full text-white text-sm font-semibold mb-4 bg-opacity-90">
                            {story.tags && story.tags.length > 0 ? story.tags[0] : 'Update'}
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white max-w-4xl mx-auto font-display leading-tight shadow-sm">
                            {story.title}
                        </h1>
                        <div className="flex justify-center items-center mt-6 text-white text-sm md:text-base space-x-4">
                            <span className="flex items-center">
                                <i className="fa-solid fa-user-circle mr-2"></i> {story.author}
                            </span>
                            <span>•</span>
                            <span className="flex items-center">
                                <i className="fa-regular fa-calendar-alt mr-2"></i> {formatDate(story.publishedAt || story.createdAt)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-4xl -mt-10 relative z-10">
                <div className="bg-white rounded-xl shadow-xl p-8 md:p-12">

                    {/* Content */}
                    <article className="prose prose-lg max-w-none text-gray-700">
                        {/* We trust admin content, so dangerous HTML is allowed here */}
                        <div dangerouslySetInnerHTML={{ __html: story.content }} />
                    </article>

                    {/* Share / Tags */}
                    <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex flex-wrap gap-2">
                            {story.tags && story.tags.map((tag, index) => (
                                <span key={index} className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                        <div className="flex space-x-4">
                            <span className="text-gray-500 font-medium">Share:</span>
                            <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors">
                                <i className="fa-brands fa-facebook fa-lg"></i>
                            </a>
                            <a href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=${encodeURIComponent(story.title)}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600 transition-colors">
                                <i className="fa-brands fa-twitter fa-lg"></i>
                            </a>
                            <a href={`mailto:?subject=${encodeURIComponent(story.title)}&body=${window.location.href}`} className="text-gray-600 hover:text-gray-800 transition-colors">
                                <i className="fa-solid fa-envelope fa-lg"></i>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-12">
                    <NewsletterSignup />
                </div>
            </div>
        </div>
    );
};

export default StoryDetail;
