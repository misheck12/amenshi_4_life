import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const NotFound = () => {
    return (
        <>
            <Helmet>
                <title>Page Not Found - Amenshi 4 Life</title>
            </Helmet>

            <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4">
                <div className="text-center">
                    <div className="mb-8">
                        <i className="fa-solid fa-droplet text-accent text-6xl mb-4 opacity-50"></i>
                        <h1 className="text-9xl font-bold text-gray-300">404</h1>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Page Not Found
                    </h2>

                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                        Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
                    </p>

                    <div className="flex gap-4 justify-center">
                        <Link to="/">
                            <Button size="lg">Go Home</Button>
                        </Link>
                        <Link to="/projects">
                            <Button variant="outline" size="lg">View Projects</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NotFound;
