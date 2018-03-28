import Dashboard from '../views/Dashboard/Dashboard';
import UserProfile from '../views/UserProfile/UserProfile';
import Events from '../views/Events/Events'
import Schools from '../views/Schools/Schools'
import Buildings from '../views/Locations/Buildings'
import Rooms from '../views/Locations/Rooms'
import TeamManagement from "../views/Teams/TeamManagement";

const appRoutes = [
    { path: "/app/dashboard", name: "Dashboard", icon: "pe-7s-graph", component: Dashboard },
    { path: "/app/events", name:"Events", icon:"pe-7s-global", component :Events},
    { path: "/app/schools", name:"Schools", icon:"pe-7s-home", component :Schools, users:['ADMIN']},
    { path: "/app/buildings", name:"Buildings", icon:"pe-7s-map", component: Buildings, users:['ADMIN']},
    { path: "/app/rooms", name:"Rooms", icon:"pe-7s-ribbon", component: Rooms, users:['ADMIN']},
    { path: "/app/teams", name: "Team Management", icon: "pe-7s-users", component : TeamManagement, users:['ADMIN', 'COACH']},
    { redirect: true, path:"/", to:"/app/dashboard", name: "Dashboard" }
];

export default appRoutes;
