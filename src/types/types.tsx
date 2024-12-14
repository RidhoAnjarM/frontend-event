export type Category = {
    id: number;
    name: string;
};

export type Location = {
    id: number;
    city: string;
};

export interface Event {
    sessions: any;
    id: number;
    name: string;
    description: string;
    date_start: string;
    date_end: string;
    date: string;
    time: string;
    location: string;
    address: string;
    capacity: number;
    remaining_capacity: number;
    category: string;
    photo: string;
    price: string;
    benefits: string;
    mode: string;
    link: string;
    status: string;
    average_rating: number;
    unique_raters: number;
    popularity_score: number;
}

export interface Registrant {
    username: string;
    name: string;
    email: string;
    phone: string;
    job: string;
}

export interface EventDetail {
    event_id: number;
    event_name: string;
    registrants: Registrant[];
}

export type RegisteredEvent = {
    id: number;
    photo: string;
    name: string;
    description: string;
    location: string;
    date: string;
    time: string;
    price: string;
    name_reg: string;
    status: string;
    rating: number;
    uniqueraters: number;
};

export interface EventCardProps {
    event: {
        id: number;
        name: string;
        description: string;
        date_start: string;
        date_end: string;
        time: string;
        location: string;
        address: string;
        capacity: number;
        remaining_capacity: number;
        category: string;
        photo: string;
        price: string;
        benefits: string;
        mode: string;
        status: string;
        average_rating: number;
        unique_raters: number;
    };
}

export interface EventCardPopular {
    eventpopular: {
        id: number;
        name: string;
        description: string;
        date_start: string;
        date_end: string;
        time: string;
        location: string;
        address: string;
        capacity: number;
        remaining_capacity: number;
        category: string;
        photo: string;
        price: string;
        benefits: string;
        mode: string;
        status: string;
        average_rating: number;
        unique_raters: number;
    };
}

export interface EventCardOther {
    eventOther: {
        id: number;
        name: string;
        description: string;
        date_start: string;
        date_end: string;
        date: string;
        time: string;
        location: string;
        address: string;
        capacity: number;
        remaining_capacity: number;
        category: string;
        photo: string;
        price: string;
        benefits: string;
        mode: string;
        status: string;
        average_rating: number;
        unique_raters: number;
    };
}