export const Spinner = ({ size = 'md', className = '' }) => {
    const sizes = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4',
    };

    return (
        <div
            className={`inline-block border-accent border-t-transparent rounded-full animate-spin ${sizes[size]} ${className}`}
            role="status"
            aria-label="Loading"
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export const LoadingPage = ({ message = 'Loading...' }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-600">{message}</p>
        </div>
    );
};

export default Spinner;
