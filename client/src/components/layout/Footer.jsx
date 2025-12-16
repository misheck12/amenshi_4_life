import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { config } from '../../config/config';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white mt-auto" role="contentinfo">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About Section */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            Amenshi 4 Life
                        </h3>
                        <p className="text-gray-300 mb-4">
                            A non-profit ministry serving needs for clean water and care for abandoned babies in Zambia, Africa.
                        </p>
                        <div className="flex gap-4">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-300 hover:text-accent transition-colors"
                                aria-label="Visit our Facebook page"
                            >
                                <FaFacebook size={24} />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-300 hover:text-accent transition-colors"
                                aria-label="Visit our Twitter profile"
                            >
                                <FaTwitter size={24} />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-300 hover:text-accent transition-colors"
                                aria-label="Visit our Instagram profile"
                            >
                                <FaInstagram size={24} />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-300 hover:text-accent transition-colors"
                                aria-label="Visit our LinkedIn page"
                            >
                                <FaLinkedin size={24} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                        <nav aria-label="Footer navigation">
                            <ul className="space-y-2">
                                <li>
                                    <Link to="/" className="text-gray-300 hover:text-accent transition-colors">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/about" className="text-gray-300 hover:text-accent transition-colors">
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/services" className="text-gray-300 hover:text-accent transition-colors">
                                        Our Ministries
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/projects" className="text-gray-300 hover:text-accent transition-colors">
                                        Projects
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/contact" className="text-gray-300 hover:text-accent transition-colors">
                                        Contact Us
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Contact Us</h3>
                        <address className="not-italic space-y-3 text-gray-300">
                            <p className="flex items-start gap-2">
                                <FaMapMarkerAlt className="mt-1 flex-shrink-0" aria-hidden="true" />
                                <span>{config.contactAddress}</span>
                            </p>
                            <p className="flex items-center gap-2">
                                <FaPhone aria-hidden="true" />
                                <a href={`tel:${config.contactPhone.replace(/\s/g, '')}`} className="hover:text-accent transition-colors">
                                    {config.contactPhone}
                                </a>
                            </p>
                            <p className="flex items-center gap-2">
                                <FaEnvelope aria-hidden="true" />
                                <a href={`mailto:${config.contactEmail}`} className="hover:text-accent transition-colors">
                                    {config.contactEmail}
                                </a>
                            </p>
                        </address>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 pt-8 border-t border-gray-800 text-center">
                    <p className="text-gray-400">
                        &copy; {currentYear} Amenshi 4 Life. All rights reserved. | Made with ❤️ for a better world
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
