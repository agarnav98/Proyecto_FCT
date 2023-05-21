insert into roles (id, rol) values (1, 'docente');
insert into roles (id, rol) values (2, 'alumno');
INSERT INTO `users` (`id`, `email`, `password`, `name`, `last_name`, `dni`, `mobile`, `rol_id`) VALUES
(1, 'admin@admin.admin', '$2y$10$ZqIi7GlA3dRmiIsiArf5H.sa8EB3jvYoChE7X9Lipg0yUzsPI3f9G', 'Admin', 'Admin', '123456789', '123456', 1);
