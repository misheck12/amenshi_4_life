import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { Spinner } from '../components/common/Spinner';
import { getCategoryLabel, getStatusColor } from '../utils/helpers';
import ProjectMap from '../components/common/ProjectMap';

const Projects = () => {
    const [showMap, setShowMap] = useState(false);
    const [filters, setFilters] = useState({
        status: '',
        category: '',
        search: '',
    });

    const { data, isLoading, error } = useQuery({
        queryKey: ['projects', filters],
        queryFn: () => {
            // Only send non-empty filters
            const cleanFilters = {};
            if (filters.status) cleanFilters.status = filters.status;
            if (filters.category) cleanFilters.category = filters.category;
            if (filters.search) cleanFilters.search = filters.search;

            return apiService.projects.getAll(cleanFilters);
        },
    });

    const projects = data?.data?.data || [];

    return (
        <>
            <Helmet>
                <title>Our Projects - Amenshi 4 Life</title>
                <meta name="description" content="Explore our water well projects across Zambia bringing clean water to communities." />
            </Helmet>

            <section className="bg-gradient-to-r from-accent to-accent-hover text-white py-20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Projects</h1>
                    <p className="text-xl">Bringing clean water to communities across Zambia</p>
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    {/* View Toggle & Filters Header */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
                            <button
                                onClick={() => setShowMap(false)}
                                className={`px-4 py-2 rounded-md transition-colors ${!showMap ? 'bg-white shadow text-accent font-medium' : 'text-gray-600 hover:text-gray-900'}`}
                            >
                                <i className="fa-solid fa-list mr-2"></i> List View
                            </button>
                            <button
                                onClick={() => setShowMap(true)}
                                className={`px-4 py-2 rounded-md transition-colors ${showMap ? 'bg-white shadow text-accent font-medium' : 'text-gray-600 hover:text-gray-900'}`}
                            >
                                <i className="fa-solid fa-map-location-dot mr-2"></i> Map View
                            </button>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={filters.search}
                                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                            />

                            <select
                                value={filters.category}
                                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                            >
                                <option value="">All Categories</option>
                                <option value="borehole-donation">Borehole Donation</option>
                                <option value="borehole-repair">Borehole Repair</option>
                                <option value="education">Education</option>
                                <option value="babies">Babies</option>
                            </select>

                            <select
                                value={filters.status}
                                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                            >
                                <option value="">All Status</option>
                                <option value="planned">Planned</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    </div>

                    {/* Content */}
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <Spinner size="lg" />
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600 text-lg">No projects found</p>
                        </div>
                    ) : showMap ? (
                        <div className="mb-8">
                            <ProjectMap projects={projects} />
                            <p className="text-center text-sm text-gray-500 mt-2">Showing projects with location data ({projects.filter(p => p.coordinates?.lat).length})</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {projects.map((project) => (
                                <Link
                                    key={project._id}
                                    to={`/projects/${project._id}`}
                                    className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                                >
                                    <div className="relative h-48 bg-gray-200">
                                        {project.images?.[0] && (
                                            <img
                                                src={project.images[0]}
                                                alt={project.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                loading="lazy"
                                            />
                                        )}
                                        <span className={`absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                                            {project.status.replace('-', ' ')}
                                        </span>
                                    </div>

                                    <div className="p-6">
                                        <span className="text-xs text-accent font-semibold uppercase">
                                            {getCategoryLabel(project.category)}
                                        </span>
                                        <h3 className="text-xl font-bold mt-2 mb-2 group-hover:text-accent transition-colors">
                                            {project.title}
                                        </h3>
                                        <p className="text-gray-600 line-clamp-2">{project.description}</p>
                                        <div className="mt-4 flex items-center text-sm text-gray-500">
                                            <i className="fa-solid fa-location-dot mr-2"></i>
                                            {project.location}
                                        </div>
                                        {project.beneficiaries > 0 && (
                                            <div className="mt-2 flex items-center text-sm text-gray-500">
                                                <i className="fa-solid fa-users mr-2"></i>
                                                {project.beneficiaries.toLocaleString()} beneficiaries
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default Projects;
