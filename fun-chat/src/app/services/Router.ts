// class Router {
//     static routes = [
//         {
//             path: '/',
//             view: () => {
//                 console.log('main');
//             },
//         },
//         {
//             path: '/login',
//             view: () => {
//                 console.log('login');
//             },
//         },
//     ];
//
//     constructor() {
//         this.start();
//     }
//
//     start() {
//         const match = this.getCurrentPage();
//         console.log(match);
//     }
//
//     getCurrentPage() {
//         const potentialMatches = Router.routes.map((route) => {
//             return { route, isMatch: window.location.pathname === route.path };
//         });
//         console.log(potentialMatches);
//         let match = potentialMatches.find((matches) => matches.isMatch);
//         if (!match) {
//             match = { route: Router.routes[0], isMatch: true };
//         }
//         return match;
//     }
// }
//
// export default Router;
