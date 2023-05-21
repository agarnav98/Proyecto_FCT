insert into roles (id, rol) values (1, 'docente');
insert into roles (id, rol) values (2, 'alumno');
INSERT INTO `users` (`id`, `email`, `password`, `name`, `last_name`, `dni`, `mobile`, `address`, `town`, `birth`, `cv`, `rol_id`, `email_verified_at`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'admin@admin.admin', '$2y$10$ZqIi7GlA3dRmiIsiArf5H.sa8EB3jvYoChE7X9Lipg0yUzsPI3f9G', 'Admin', 'Admin', '11111111H', '11111111', 'C/Inventada', 'Sevilla', NULL, NULL, 1, NULL, NULL, '2023-05-20 12:00:48', '2023-05-20 12:00:48');
