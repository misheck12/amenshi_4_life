import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { Spinner } from '../components/common/Spinner';

const Gallery = () => {
    const [filterCategory, setFilterCategory] = useState('');

    const { data, isLoading } = useQuery({
        queryKey: ['gallery', filterCategory],
        queryFn: () => apiService.gallery.getAll(filterCategory ? { category: filterCategory } : {}),
    });

    const images = data?.data?.data || [];

    return (
        <>
            <Helmet>
                <title>Gallery - Amenshi 4 Life</title>
                <meta name="description" content="Photo gallery showcasing our water well projects and impact in Zambia." />
            </Helmet>

            <section className="bg-gradient-to-r from-accent to-accent-hover text-white py-20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Gallery</h1>
                    <p className="text-xl">Our showcase of works in pictures</p>
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Category Filter */}
                    <div className="mb-8 flex flex-wrap gap-3 justify-center">
                        <button
                            onClick={() => setFilterCategory('')}
                            className={`px-6 py-2 rounded-lg transition-all ${!filterCategory
                                    ? 'bg-accent text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilterCategory('boreholes')}
                            className={`px-6 py-2 rounded-lg transition-all ${filterCategory === 'boreholes'
                                    ? 'bg-accent text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Boreholes
                        </button>
                        <button
                            onClick={() => setFilterCategory('babies')}
                            className={`px-6 py-2 rounded-lg transition-all ${filterCategory === 'babies'
                                    ? 'bg-accent text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Babies
                        </button>
                        <button
                            onClick={() => setFilterCategory('education')}
                            className={`px-6 py-2 rounded-lg transition-all ${filterCategory === 'education'
                                    ? 'bg-accent text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Education
                        </button>
                        <button
                            onClick={() => setFilterCategory('community')}
                            className={`px-6 py-2 rounded-lg transition-all ${filterCategory === 'community'
                                    ? 'bg-accent text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Community
                        </button>
                    </div>

                    {/* Gallery Grid */}
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <Spinner size="lg" />
                        </div>
                    ) : images.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600 text-lg">No images found in this category</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {images.map((image) => (
                                <div
                                    key={image._id}
                                    className="group relative aspect-square overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                                >
                                    <img
                                        src={image.image}
                                        alt={image.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex flex-col items-center justify-center p-4">
                                        <i className="fa-solid fa-search-plus text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity mb-2"></i>
                                        <h3 className="text-white font-semibold text-lg opacity-0 group-hover:opacity-100 transition-opacity text-center">
                                            {image.title}
                                        </h3>
                                        {image.description && (
                                            <p className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity text-center mt-1">
                                                {image.description}
                                            </p>
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

export default Gallery;
