declare namespace App {
    namespace Data {
        export type PermissionData = {
            value: App.Enums.Permission;
            label: string;
        };
        export type PermissionGroupData = {
            value: App.Enums.PermissionGroup;
            label: string;
            permissions: App.Data.PermissionData[];
        };
        export type RoleData = {
            value: App.Enums.Role;
            label: string;
            tag: string;
            permissions: App.Enums.Permission[];
        };
        export type UserData = {
            id: number;
            name: string;
            email: string;
            role: App.Enums.Role;
            is_active: boolean;
            permissions: App.Enums.Permission[];
        };
        export type UserInputData = {
            name: string;
            email: string;
            role: App.Enums.Role;
            is_active: boolean;
            permissions: App.Enums.Permission[];
        };
    }
    namespace Enums {
        export type AuditArea = 'users';
        export type Permission = 'manage_users';
        export type PermissionGroup = 'general';
        export type Role = 'employee' | 'admin';
    }
}
declare namespace Illuminate {
    export type CursorPaginator<TKey, TValue> = {
        data: TKey extends string ? Record<TKey, TValue> : TValue[];
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
        meta: {
            path: string;
            per_page: number;
            next_cursor: string | null;
            next_page_url: string | null;
            prev_cursor: string | null;
            prev_page_url: string | null;
        };
    };
    export type CursorPaginatorInterface<TKey, TValue> =
        Illuminate.CursorPaginator<TKey, TValue>;
    export type LengthAwarePaginator<TKey, TValue> = {
        data: TKey extends string ? Record<TKey, TValue> : TValue[];
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
        meta: {
            total: number;
            current_page: number;
            first_page_url: string;
            from: number | null;
            last_page: number;
            last_page_url: string;
            next_page_url: string | null;
            path: string;
            per_page: number;
            prev_page_url: string | null;
            to: number | null;
        };
    };
    export type LengthAwarePaginatorInterface<TKey, TValue> =
        Illuminate.LengthAwarePaginator<TKey, TValue>;
}
declare namespace Spatie {
    namespace LaravelData {
        export type CursorPaginatedDataCollection<TKey, TValue> =
            Illuminate.CursorPaginator<TKey, TValue>;
        export type PaginatedDataCollection<TKey, TValue> =
            Illuminate.LengthAwarePaginator<TKey, TValue>;
    }
}
