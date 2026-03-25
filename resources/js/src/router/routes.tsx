import React, { lazy, Suspense } from 'react';
import type { ReactNode, LazyExoticComponent, ComponentType } from 'react';
import routesConfig from './routes.json';

type RouteLayout = 'default' | 'blank';

type RouteConfigItem = {
    path: string;
    component: string;
    layout?: RouteLayout;
};

type AppRoute = {
    path: string;
    element: ReactNode;
    layout?: RouteLayout;
};

type PageModule = {
    default: ComponentType<any>;
};

const modules = import.meta.glob('../pages/**/*.tsx');
const errorModules = import.meta.glob('../components/**/*.tsx');

function normalizeComponentPath(component: string): string[] {
    return [
        `../pages/${component}.tsx`,
        `../pages/${component}/index.tsx`,
        `../components/${component}.tsx`,
        `../components/${component}/index.tsx`,
    ];
}

function resolveImporter(component: string): (() => Promise<PageModule>) | null {
    const candidates = normalizeComponentPath(component);

    for (const file of candidates) {
        if (file in modules) {
            return modules[file] as () => Promise<PageModule>;
        }

        if (file in errorModules) {
            return errorModules[file] as () => Promise<PageModule>;
        }
    }

    console.error(`[routes] Component not found for: ${component}`);
    return null;
}

function lazyPage(component: string): LazyExoticComponent<ComponentType<any>> {
    const importer = resolveImporter(component);

    if (!importer) {
        return lazy(async () => ({
            default: () => (
                <div style={{ padding: 24 }}>
                    Route component not found: <strong>{component}</strong>
                </div>
            ),
        }));
    }

    return lazy(importer);
}

function withSuspense(Component: LazyExoticComponent<ComponentType<any>>) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Component />
        </Suspense>
    );
}

const routes: AppRoute[] = (routesConfig as RouteConfigItem[]).map((route) => {
    const Component = lazyPage(route.component);

    return {
        path: route.path,
        element: withSuspense(Component),
        layout: route.layout ?? 'default',
    };
});

const ErrorComponent = lazyPage('Error');

routes.push({
    path: '*',
    element: withSuspense(ErrorComponent),
    layout: 'blank',
});

export { routes };
export type { AppRoute, RouteConfigItem, RouteLayout };