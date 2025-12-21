import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default marker icon
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const ProjectMap = ({ projects }) => {
    // Filter projects with valid coordinates
    const mapProjects = projects.filter(p => p.coordinates?.lat && p.coordinates?.lng);

    if (mapProjects.length === 0) {
        return (
            <div className="bg-gray-100 rounded-lg p-8 text-center h-[400px] flex items-center justify-center">
                <p className="text-gray-500">No projects with location data available to display on map.</p>
            </div>
        );
    }

    // Default center (Zambia approx.)
    const defaultCenter = [-13.1339, 27.8493];

    // Determine bounds or center? Minimal implementation: fixed center/zoom for Zambia

    return (
        <div className="h-[500px] rounded-xl overflow-hidden shadow-lg z-0 relative">
            <MapContainer
                center={defaultCenter}
                zoom={6}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {mapProjects.map((project) => (
                    <Marker
                        key={project._id}
                        position={[project.coordinates.lat, project.coordinates.lng]}
                    >
                        <Popup>
                            <div className="text-center">
                                <h3 className="font-bold text-lg mb-1">{project.title}</h3>
                                <p className="text-xs text-gray-600 mb-2">{project.location}</p>
                                {project.images?.[0] && (
                                    <img
                                        src={project.images[0]}
                                        alt={project.title}
                                        className="w-full h-24 object-cover rounded mb-2"
                                    />
                                )}
                                <Link
                                    to={`/projects/${project._id}`}
                                    className="text-accent text-sm font-bold hover:underline"
                                >
                                    View Details
                                </Link>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default ProjectMap;
