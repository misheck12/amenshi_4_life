import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { Spinner } from '../components/common/Spinner';
import { formatDate, formatNumber, formatCurrency, getCategoryLabel, getStatusColor } from '../utils/helpers';
import Button from '../components/common/Button';

const ProjectDetail = () => {
    const { id } = useParams();

    const { data, isLoading, error } = useQuery({
        queryKey: ['project', id],
        queryFn: () => apiService.projects.getOne(id),
    });

    const project = data?.data?.data;

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen"><Spinner size="lg" /></div>;
    }

    if (error || !project) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <h2 className="text-2xl font-bold mb-4">Project not found</h2>
                <Link to="/projects">
                    <Button>Back to Projects</Button>
                </Link>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>{project.title} - Amenshi 4 Life</title>
                <meta name="description" content={project.description.substring(0, 155)} />
            </Helmet>

            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <Link to="/projects" className="inline-flex items-center text-accent hover:underline mb-6">
                        <i className="fa-solid fa-arrow-left mr-2"></i>
                        Back to Projects
                    </Link>

                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            {project.images?.length > 0 ? (
                                <img
                                    src={project.images[0]}
                                    alt={project.title}
                                    className="w-full h-96 object-cover rounded-lg shadow-xl"
                                />
                            ) : (
                                <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <i className="fa-solid fa-image text-6xl text-gray-400"></i>
                                </div>
                            )}

                            {project.videoId && (
                                <div className="mt-8">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Project Video</h3>
                                    <div className="aspect-video">
                                        <iframe
                                            src={`https://www.youtube.com/embed/${project.videoId}`}
                                            title={project.title}
                                            className="w-full h-full rounded-lg shadow-lg border-0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                                    {project.status.replace('-', ' ')}
                                </span>
                                <span className="text-sm text-accent font-semibold uppercase">
                                    {getCategoryLabel(project.category)}
                                </span>
                            </div>

                            <h1 className="text-4xl font-bold text-gray-900 mb-4">{project.title}</h1>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center text-gray-600">
                                    <i className="fa-solid fa-location-dot w-6 text-accent"></i>
                                    <span>{project.location}</span>
                                </div>

                                {project.beneficiaries > 0 && (
                                    <div className="flex items-center text-gray-600">
                                        <i className="fa-solid fa-users w-6 text-accent"></i>
                                        <span>{formatNumber(project.beneficiaries)} beneficiaries</span>
                                    </div>
                                )}

                                {project.cost > 0 && (
                                    <div className="flex items-center text-gray-600">
                                        <i className="fa-solid fa-dollar-sign w-6 text-accent"></i>
                                        <span>Project Cost: {formatCurrency(project.cost)}</span>
                                    </div>
                                )}

                                {project.completedDate && (
                                    <div className="flex items-center text-gray-600">
                                        <i className="fa-solid fa-calendar w-6 text-accent"></i>
                                        <span>Completed: {formatDate(project.completedDate)}</span>
                                    </div>
                                )}
                            </div>

                            <div className="prose max-w-none">
                                <p className="text-gray-700 leading-relaxed">{project.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ProjectDetail;
