import { useRouter } from 'next/router';
import { EventCardProps } from '@/types/types';

const EventCard: React.FC<EventCardProps> = ({ event }) => {
    const router = useRouter();

    const handleDetailClick = () => {
        router.push(`/event/${event.id}`);
    };

    const getDayOfWeek = (dateString: string) => {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const date = new Date(dateString);
        return days[date.getDay()];
    };

    return (
        <div className="w-[300px] h-[350px] flex justify-center mb-[30px]">
            <p className="text-[10px] text-black flex items-center justify-center ms-[160px] z-10 -mt-[20px] bg-custom-grey w-[70px] h-[24px] rounded-[5px] absolute">{event.price}</p>
            <div className="w-[250px] h-[140px] bg-transparent backdrop-blur-md bg rounded-[10px] absolute mt-[-26px] flex justify-center items-center overflow-hidden hover:w-[260px] hover:h-[146px] hover:duration-300 ease-in-out duration-300 border-2 border-custom-purple-light z-0">
                {event.photo ? (
                    <img
                        src={`http://localhost:5000${event.photo}`}
                        className="hover:w-[260px] duration-300"
                        onError={(e) => {
                            console.log(`Image not found for event: ${event.id}, setting to default.`);
                            (e.target as HTMLImageElement).src = 'https://i.pinimg.com/736x/01/7c/44/017c44c97a38c1c4999681e28c39271d.jpg';
                        }}
                    />
                ) : (
                    <img src="https://i.pinimg.com/736x/01/7c/44/017c44c97a38c1c4999681e28c39271d.jpg" alt="" />
                )}
            </div>
            <div className="w-[300px] h-[300px] rounded-[10px] flex px-[37px] shadow-custom-dua border-custom-purple-2-100 bg-white">
                <div className="flex-wrap w-full ">
                    <h2 className="text-black text-[16px] text-center mt-[120px]">{event.name}</h2>
                    <p className="text-gray-600 text-[13px] mt-[10px]">{getDayOfWeek(event.date_start)}, {event.date_start}</p>
                    <p className="text-custom-purple text-[13px] mt-[10px]">{event.location}. {event.address}</p>
                </div>
                <button onClick={handleDetailClick} className="w-[80px] h-[30px] rounded-[5px] bg-custom-purple-2-100 mt-[250px] ms-[145px] text-white border border-custom-purple-light hover:bg-white hover:text-black absolute ease-in-out duration-300">
                    <p className="text-[10px] russo-one">DETAIL</p>
                </button>
            </div>
        </div>
    );
};

export default EventCard;
