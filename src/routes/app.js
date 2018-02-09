import Dashboard from '../views/Dashboard/Dashboard';
import UserProfile from '../views/UserProfile/UserProfile';
import Reports from '../views/Reports/Reports';
import Maps from '../views/Maps/Maps';

const appRoutes = [
    { path: "/app/dashboard", name: "Dashboard", icon: "pe-7s-graph", component: Dashboard },
    { path: "/app/user", name: "User Profile", icon: "pe-7s-user", component: UserProfile },
    { path: "/app/reports", name: "Reports", icon: "pe-7s-note2", component: Reports },
    { path: "/app/maps", name: "Campus Map", icon: "pe-7s-map-marker", component: Maps },
    { redirect: true, path:"/", to:"/app/dashboard", name: "Dashboard" }
];

export default appRoutes;
