import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import EventCard from '@/components/EventCard';
import EventPopular from '@/components/EventPopular';
import Navbar from '@/components/Navbar';
import { Event, Location } from '@/types/types';
import Slider from '@/components/slider';
import Subheading from '@/components/subHeading';
import Footer from '@/components/footer';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const LandingPage = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [popularEvents, setPopularEvents] = useState<Event[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [filters, setFilters] = useState({ category: '', location: '', name: '', dateStart: '', mode: 'all', payment: '', status: 'upcoming' });
    const [currentPage, setCurrentPage] = useState(1);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isLocationOpen, setIsLocationOpen] = useState(false);
    const eventsPerPage = 8;
    const categoryRef = useRef<HTMLDivElement | null>(null);
    const locationRef = useRef<HTMLDivElement | null>(null);
    const [loading, setLoading] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const cardContainerRef = useRef<HTMLDivElement | null>(null);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${API_URL}/categories`);
            setCategories(response.data.map((category: { name: string }) => category.name));
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchLocations = async () => {
        try {
            const response = await axios.get(`${API_URL}/location`);
            setLocations(response.data);
        } catch (error) {
            console.error('Error fetching locations:', error);
        }
    };

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/event`);
            const sortedEvents = response.data.sort(
                (a: Event, b: Event) => new Date(b.date_start).getTime() - new Date(a.date_start).getTime()
            );
            setEvents(sortedEvents);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPopularEvents = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/events/populars`);
            if (Array.isArray(response.data)) {
                const sortedEvents = response.data.sort((a: Event, b: Event) => b.popularity_score - a.popularity_score);
                setPopularEvents(sortedEvents.slice(0, 10));
            } else {
                console.error('Unexpected API response structure:', response.data);
            }
        } catch (error) {
            console.error('Error fetching popular events:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchLocations();
        fetchEvents();
        fetchPopularEvents();
    }, []);

    const filteredEvents = events.filter((event) => {
        const matchesCategory = filters.category ? event.category === filters.category : true;
        const matchesLocation = filters.location ? event.location === filters.location : true;
        const matchesName = filters.name ? event.name.toLowerCase().includes(filters.name.toLowerCase()) : true;
        const matchesDateStart = filters.dateStart ? event.date_start === filters.dateStart : true;
        const matchesMode = filters.mode && filters.mode !== 'all' ? event.mode === filters.mode : true;
        const matchesPayment = filters.payment === 'Free'
            ? event.price.toLowerCase() === 'free'
            : filters.payment === 'Tidak Free'
                ? event.price.toLowerCase() !== 'free'
                : true;

        const now = new Date();
        const eventStart = new Date(event.date_start);
        const eventEnd = new Date(event.date_end || event.date_start);

        const matchesStatus =
            filters.status === 'upcoming'
                ? eventStart > now
                : filters.status === 'ongoing'
                    ? eventStart <= now && eventEnd >= now
                    : filters.status === 'ended'
                        ? eventEnd < now
                        : true;

        return (
            matchesCategory &&
            matchesLocation &&
            matchesName &&
            matchesDateStart &&
            matchesMode &&
            matchesPayment &&
            matchesStatus
        );
    });

    const handleCategoryToggle = () => {
        setIsCategoryOpen(!isCategoryOpen);
    };

    const handleLocationToggle = () => {
        setIsLocationOpen(!isLocationOpen);
    };

    const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
    const startIndex = (currentPage - 1) * eventsPerPage;
    const currentEvents = filteredEvents.slice(startIndex, startIndex + eventsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentPage(currentPage + 1);
                setIsAnimating(false);
            }, 300);
        }
        if (cardContainerRef.current) {
            const offsetTop = cardContainerRef.current.getBoundingClientRect().top + window.scrollY - 150;
            window.scrollTo({ top: offsetTop, behavior: "smooth" });
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentPage(currentPage - 1);
                setIsAnimating(false);
            }, 300);
        }
        if (cardContainerRef.current) {
            const offsetTop = cardContainerRef.current.getBoundingClientRect().top + window.scrollY - 150;
            window.scrollTo({ top: offsetTop, behavior: "smooth" });
        }
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
        setCurrentPage(1);
    };

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([fetchCategories(), fetchLocations(), fetchEvents(), fetchPopularEvents()]);
        };
        fetchData();

        const handleClickOutside = (e: MouseEvent) => {
            if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
                setIsCategoryOpen(false);
            }
            if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
                setIsLocationOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div>
            <Navbar />
            <div className="pt-[113px]">
                <Slider />
            </div>

            <div className="flex mb-8 w-[1000px] h-[100px] rounded-[20px] bg-custom-navy mx-auto z-10 relative -top-16 items-center justify-between px-[60px]">
                <div className="relative z-10" ref={categoryRef}>
                    <button
                        onClick={handleCategoryToggle}
                        className="h-[40px] w-[250px] text-center text-[15px] rounded-[5px] bg-custom-grey text-custom-navy font-sans"
                    >
                        {filters.category || "Select Category"}
                    </button>
                    {isCategoryOpen && (
                        <div className="absolute left-0 right-0 max-h-60 overflow-hidden bg-white border mt-1 text-custom-navy font-sans    ">
                            <input
                                type="text"
                                placeholder="Search Categories"
                                className="border p-2 rounded w-full mb-2 sticky top-0 z-10"
                                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                value={filters.category}
                            />
                            <ul className="overflow-y-auto max-h-40 text-ellipsis">
                                {categories
                                    .filter((category) =>
                                        category.toLowerCase().includes(filters.category.toLowerCase())
                                    )
                                    .map((category, index) => (
                                        <li
                                            key={index}
                                            className="p-2 hover:bg-gray-200 cursor-pointer"
                                            onClick={() => setFilters({ ...filters, category })}
                                        >
                                            {category}
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="relative z-20" ref={locationRef}>
                    <button
                        onClick={handleLocationToggle}
                        className="h-[40px] w-[250px] text-center rounded-[5px] text-[15px] bg-custom-grey text-custom-navy font-sans"
                    >
                        {filters.location || "Select Location"}
                    </button>
                    {isLocationOpen && (
                        <div className="absolute left-0 right-0 max-h-60 overflow-hidden bg-white border mt-1 text-custom-navy font-sans">
                            <input
                                type="text"
                                placeholder="Search Locations"
                                className="border p-2 rounded w-full mb-2 sticky top-0 z-10"
                                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                value={filters.location}
                            />
                            <ul className="overflow-y-auto max-h-40">
                                {locations
                                    .filter((loc) =>
                                        loc.city.toLowerCase().includes(filters.location.toLowerCase())
                                    )
                                    .map((loc, index) => (
                                        <li
                                            key={index}
                                            className="p-2 hover:bg-gray-200 cursor-pointer"
                                            onClick={() => setFilters({ ...filters, location: loc.city })}
                                        >
                                            {loc.city}
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    )}
                </div>

                <input
                    type="text"
                    name="name"
                    placeholder="Search..."
                    value={filters.name}
                    onChange={handleFilterChange}
                    className="h-[40px] w-[250px] px-[40px] text-custom-navy outline-none rounded-[5px] z-10 bg-custom-grey font-sans"
                />
            </div>

            <div className="mt-[50px] px-[120px]">
                <div className="w-full flex items-center justify-between mb-20">
                    <h1 className="text-4xl font-bold ">
                        Acara <span className="text-custom-purple">Mendatang</span>
                    </h1>
                    <div className="flex gap-4 mb-6">
                        <input
                            type="date"
                            value={filters.dateStart}
                            onChange={(e) => setFilters({ ...filters, dateStart: e.target.value })}
                            className="w-[120px] px-[10px] text-[12px] outline-none rounded-[5px] font-sans flex items-center justify-center h-[40px]"
                        />
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            className="w-[120px] px-[10px] text-[12px] outline-none rounded-[5px] font-sans flex items-center justify-center h-[40px]"
                        >
                            <option value="upcoming">Mendatang</option>
                            <option value="ongoing">Berlangsung</option>
                            <option value="ended">Selesai</option>
                        </select>

                        <select
                            value={filters.mode}
                            onChange={(e) => setFilters({ ...filters, mode: e.target.value })}
                            className="w-[120px] px-[10px] text-[12px] outline-none rounded-[5px] font-sans flex items-center justify-center h-[40px]"
                        >
                            <option value="all">Mode</option>
                            <option value="offline">Offline</option>
                            <option value="online">Online</option>
                        </select>
                        <select
                            value={filters.payment}
                            onChange={(e) => setFilters({ ...filters, payment: e.target.value })}
                            className="w-[120px] px-[10px] text-[12px] outline-none rounded-[5px] font-sans flex items-center justify-center h-[40px]"
                        >
                            <option value="">Harga</option>
                            <option value="Tidak Free">Berbayar</option>
                            <option value="Free">Gratis</option>
                        </select>
                    </div>
                </div>
                <div
                    ref={cardContainerRef}
                    className={`grid grid-cols-4 gap-[25px] z-0 transform transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'
                        }`}
                >
                    {loading ? (
                        <div className="flex items-center justify-center col-span-4 h-[200px]">
                            <div className="flex flex-row gap-2">
                                <div className="w-4 h-4 rounded-full bg-custom-purple-light animate-bounce [animation-delay:.7s]"></div>
                                <div className="w-4 h-4 rounded-full bg-custom-purple-light animate-bounce [animation-delay:.3s]"></div>
                                <div className="w-4 h-4 rounded-full bg-custom-purple-light animate-bounce [animation-delay:.7s]"></div>
                            </div>
                        </div>
                    ) : currentEvents.length > 0 ? (
                        currentEvents
                            .sort((a, b) => {
                                const dateA = new Date(a.date_start);
                                const dateB = new Date(b.date_start);

                                const dateAOnly = new Date(dateA.getFullYear(), dateA.getMonth(), dateA.getDate());
                                const dateBOnly = new Date(dateB.getFullYear(), dateB.getMonth(), dateB.getDate());

                                return dateAOnly.getTime() - dateBOnly.getTime();
                            })

                            .map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))
                    ) : (
                        <p className="text-center col-span-4 h-[100px]">Event tidak ditemukan</p>
                    )}
                </div>

                <div className="flex justify-center -top-14 relative">
                    <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 mx-2 rounded-lg border ${currentPage === 1 ? 'bg-gray-300 text-gray-500' : 'bg-white text-custom-purple-light'
                            }`}
                    >
                        Prev
                    </button>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 mx-2 rounded-lg border ${currentPage === totalPages ? 'bg-gray-300 text-gray-500' : 'bg-white text-custom-purple-light'
                            }`}
                    >
                        Next
                    </button>
                </div>
            </div>

            <hr className='border border-custom-navy w-[1200px] mx-auto rounded-full mt-5' />

            <div className="px-[120px] mt-20">
                <h1 className="text-4xl font-bold mb-12">Acara <span className='text-custom-purple'>Populer</span></h1>
                <div className="relative">
                    <button
                        onClick={scrollLeft}
                        className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center z-10"
                    >
                        &#8249;
                    </button>

                    <div
                        ref={scrollContainerRef}
                        className="flex overflow-x-auto gap-[6px] [&::-webkit-scrollbar]:hidden overflow-hidden"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center w-full h-[200px]">
                                <div className="flex flex-row gap-2">
                                    <div className="w-4 h-4 rounded-full bg-custom-purple-light animate-bounce [animation-delay:.7s]"></div>
                                    <div className="w-4 h-4 rounded-full bg-custom-purple-light animate-bounce [animation-delay:.3s]"></div>
                                    <div className="w-4 h-4 rounded-full bg-custom-purple-light animate-bounce [animation-delay:.7s]"></div>
                                </div>
                            </div>
                        ) : popularEvents.filter((event) => event.status !== "ended").length > 0 ? (
                            popularEvents
                                .filter((event) => event.status !== "ended")
                                .map((event) => (
                                    <div key={event.id} className="flex-shrink-0 w-80">
                                        <EventPopular eventpopular={event} />
                                    </div>
                                ))
                        ) : (
                            <p className="text-center w-full">Event tidak ditemukan</p>
                        )}
                    </div>

                    <button
                        onClick={scrollRight}
                        className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center z-10"
                    >
                        &#8250;
                    </button>
                </div>
            </div>


            <hr className='border border-custom-navy w-[1200px] mx-auto rounded-full mt-20' />

            <div className="mb-[1px] mt-5">
                <Subheading />
            </div>
            <footer>
                <Footer />
            </footer>
        </div>
    );
};

export default LandingPage;
