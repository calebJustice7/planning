import { Outlet, Router, Route, redirect, RouterProvider, createRootRouteWithContext } from "@tanstack/react-router";

import Calendar from "../pages/Calendar";
import GoogleLogin from "../pages/GoogleLogin";
import MainLayout from "../Layouts/MainLayout";
import PageNotFound from "../pages/PageNotFound";
import { actions, subjects } from "../auth/ability";
import { QueryClient } from "@tanstack/react-query";
import { AUTH_QUERY_KEY, getAuth } from "../queries/Auth";

interface RouterContext {
    queryClient: QueryClient;
}

const requireAuth =
    (action?: (typeof actions)[number], subject?: (typeof subjects)[number]) =>
    async ({ context }: { context: RouterContext }) => {
        const auth = await context.queryClient.ensureQueryData({ queryKey: AUTH_QUERY_KEY, queryFn: getAuth });

        if (auth.status === "authenticated") {
            if (action && subject && !auth.ability.can(action, subject)) {
                throw redirect({ to: "/" });
            }
            return;
        }

        throw redirect({ to: "/login" });
    };

const rootRoute = createRootRouteWithContext<RouterContext>()({
    component: function Root() {
        return (
            <MainLayout>
                <Outlet />
            </MainLayout>
        );
    },
});

const indexRoute = new Route({
    getParentRoute: () => rootRoute,
    path: "/",
    component: Calendar,
    beforeLoad: requireAuth(),
});

const loginRoute = new Route({
    getParentRoute: () => rootRoute,
    path: "login",
    component: GoogleLogin,
});

const routeTree = rootRoute.addChildren([indexRoute, loginRoute]);

const router = new Router({
    routeTree,
    defaultNotFoundComponent: PageNotFound,
    context: {
        queryClient: undefined!,
    },
});

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

function AppRouterProvider(props: { queryClient: QueryClient }) {
    return (
        <RouterProvider
            router={router}
            context={{
                queryClient: props.queryClient,
            }}
        />
    );
}

export default AppRouterProvider;
