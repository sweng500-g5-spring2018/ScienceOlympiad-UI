import Dashboard from '../views/Dashboard/Dashboard';
import UserProfile from '../views/UserProfile/UserProfile';
import Reports from '../views/Reports/Reports';
import Maps from '../views/Maps/Maps';
import Notifications from '../views/Notifications/Notifications';

const appRoutes = [
    { path: "/dashboard", name: "Dashboard", icon: "pe-7s-graph", component: Dashboard },
    { path: "/user", name: "User Profile", icon: "pe-7s-user", component: UserProfile },
    { path: "/reports", name: "Reports", icon: "pe-7s-note2", component: Reports },
    { path: "/maps", name: "Campus Map", icon: "pe-7s-map-marker", component: Maps },
    { path: "/notifications", name: "Notifications", icon: "pe-7s-bell", component: Notifications },
    { redirect: true, path:"/", to:"/dashboard", name: "Dashboard" }
];

export default appRoutes;
