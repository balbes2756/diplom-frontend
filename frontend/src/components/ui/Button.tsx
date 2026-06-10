import styles from "./Button.module.css";

interface ButtonProps {
    children: React.ReactNode;
    variant?: "primary" | "secondary";
    onClick?: () => void;
}

function Button({ children, variant = "primary", onClick }: ButtonProps) {
    return (
        <button
            className={`${styles.button} ${variant === "primary" ? styles.primary : styles.secondary}`}
            onClick={onClick}>
            {children}
        </button>
    );
}

export default Button;
