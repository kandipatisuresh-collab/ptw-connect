# Database migrations

Apply numbered SQL files in order using a reviewed migration runner. Production migrations must be
backward-compatible with the deployed application, and rollback or forward-fix procedures must be
reviewed before release.

Migration `007_access_configuration.sql` extends the existing `users` and `user_roles` tables,
adds the `role_permissions` relation, and creates `ptw_work_order_mapping`. It also inserts the PTW
role and permission catalog, without creating dummy user or SAP records. Configure `DATABASE_URL`
and run `npm run db:migrate` to apply it.

The access-configuration API is a local development feature only. It requires
`PTW_DEMO_ADMIN_ENABLED=true`, is blocked when `NODE_ENV=production`, and accepts loopback requests
only. It is not a substitute for Entra authentication or production authorization.
