import type { ServiceCardProps } from "../../types/service";
import styles from "./ServiceCard.module.css";

function ServiceCard({ service, onClick }: ServiceCardProps) {
    const handleClick = () => {
        if (onClick) {
            onClick(service);
        }
    };

    return (
        <div className={styles.card} onClick={handleClick}>
            <div className={styles.cardHeader}>
                <div className={styles.avatar}>
                    {service.image ? (
                        <img
                            src={service.image}
                            alt={service.name}
                            className={styles.avatarImage}
                        />
                    ) : (
                        <span className={styles.avatarEmoji}>
                            {service.avatar}
                        </span>
                    )}
                    {service.verified && (
                        <span
                            className={styles.verifiedBadge}
                            title="Проверенный специалист">
                            ✓
                        </span>
                    )}
                </div>
                <div className={styles.cardTitle}>{service.name}</div>
            </div>

            <div className={styles.cardCategory}>{service.category}</div>

            <div className={styles.cardDescription}>{service.description}</div>

            <div className={styles.cardFooter}>
                <div className={styles.cardRating}>
                    ⭐ {service.rating.toFixed(1)} ({service.reviews} отзывов)
                </div>
                <div className={styles.cardPrice}>
                    от {service.price.toLocaleString()}₽
                </div>
            </div>
        </div>
    );
}

export default ServiceCard;
