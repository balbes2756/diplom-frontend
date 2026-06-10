import { Outlet } from "react-router-dom";
import styles from "./AuthLayout.module.css";

function AuthLayout() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <Outlet />
            </div>
        </div>
    );
}

export default AuthLayout;
