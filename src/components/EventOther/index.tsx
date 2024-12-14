import { useRouter } from 'next/router';
import { EventCardOther } from '@/types/types';

const EventOther: React.FC<EventCardOther> = ({ eventOther }) => {
    const router = useRouter();

    const handleDetailClick = () => {
        router.push(`/event/${eventOther.id}`);
    };

    const getDayOfWeek = (dateString: string) => {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const date = new Date(dateString);
        return days[date.getDay()];
    };

    return (
        <div className="w-[300px] h-[300px] flex flex-col border-[2px] border-custom-purple-2-100 overflow-hidden rounded-[10px]">
            <div className="w-full h-[150px] flex justify-center items-center overflow-hidden border-b border-custom-purple-2-100">
                {eventOther.photo ? (
                    <img
                        src={`http://localhost:5000${eventOther.photo}`}
                        onError={(e) => {
                            console.log(`Image not found for event: ${eventOther.id}, setting to default.`);
                            (e.target as HTMLImageElement).src =
                                'https://i.pinimg.com/736x/01/7c/44/017c44c97a38c1c4999681e28c39271d.jpg';
                        }}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <img
                        src="https://i.pinimg.com/736x/01/7c/44/017c44c97a38c1c4999681e28c39271d.jpg"
                        alt=""
                        className="w-full h-full object-cover"
                    />
                )}
            </div>
 
            <div className="flex-grow px-[37px]">
                <h2 className="text-black text-[16px] text-center mt-[10px]">{eventOther.name}</h2>
                <p className="text-gray-600 text-[13px] mt-[8px]">
                {getDayOfWeek(eventOther.date)}, {eventOther.date} 
                </p>
                <p className="text-custom-purple-2-100 text-[13px] mt-[8px]">
                    {eventOther.location}. {eventOther.address}
                </p>
            </div>
 
            <div className="flex justify-between px-[40px] mt-auto pb-[10px]">
                <div className="text-[12px] z-20 flex items-center justify-center gap-2">
                    <img src="../icons/bintang.svg" alt="" />
                    <p className="mt-[1px]">{eventOther.average_rating} ({eventOther.unique_raters})</p>
                </div>
                <button
                    onClick={handleDetailClick}
                    className="w-[80px] h-[30px] rounded-[5px] bg-custom-purple-2-100 text-white border border-custom-purple-light hover:bg-white hover:text-black ease-in-out duration-300"
                >
                    <p className="text-[10px] russo-one">DETAIL</p>
                </button>
            </div>
        </div>

    );
};

export default EventOther;
