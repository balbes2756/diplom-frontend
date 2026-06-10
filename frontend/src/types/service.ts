export interface Service {
    id: number;
    name: string;
    category: string;
    description: string;
    rating: number;
    reviews: number;
    price: number;
    avatar: string;
    image?: string;
    verified?: boolean;
    location?: string;
}

export interface ServiceCardProps {
    service: Service;
    onClick?: (service: Service) => void;
}
