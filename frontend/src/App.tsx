import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";
import ToastContainer from "./components/Toast/Toast";

const HomePage = lazy(() => import("./pages/HomePage/HomePage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage/ServicesPage"));
const ServiceDetailPage = lazy(
    () => import("./pages/ServiceDetailPage/ServiceDetailPage"),
);
const BlogPage = lazy(() => import("./pages/BlogPage/BlogPage"));
const MapPage = lazy(() => import("./pages/MapPage/MapPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage/ProfilePage"));
const Layout = lazy(() => import("./components/layout/Layout"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const CommunityPage = lazy(() => import("./pages/CommunityPage/CommunityPage"));
const ArticleDetailPage = lazy(
    () => import("./pages/ArticleDetailPage/ArticleDetailPage"),
);

function App() {
    const checkAuth = useAuthStore((state) => state.checkAuth);
    const isLoading = useAuthStore((state) => state.isLoading);

    useEffect(() => {
        checkAuth();
    }, []);

    if (isLoading) return <div>Загрузка...</div>;

    return (
        <Suspense fallback={<div className="loading">Загрузка...</div>}>
            <Routes>
                {/* Защищённые маршруты (с хедером и футером) */}
                <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="services" element={<ServicesPage />} />
                    <Route
                        path="services/:id"
                        element={<ServiceDetailPage />}
                    />
                    <Route path="blog" element={<BlogPage />} />
                    <Route path="map" element={<MapPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/community" element={<CommunityPage />} />
                    <Route
                        path="/community/:id"
                        element={<ArticleDetailPage />}
                    />
                </Route>
            </Routes>
            <ToastContainer />
        </Suspense>
    );
}

export default App;
