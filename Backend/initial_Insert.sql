insert into roles (id, role) values (1, 'Docente');
insert into roles (id, role) values (2, 'Alumno');
INSERT INTO `users` (`id`, `email`, `password`, `name`, `last_name`, `dni`, `mobile`, `role_id`) VALUES
(1, 'admin@admin.admin', '$2y$10$TNO/0f3VZhZl.hAkzH2IWeIlY5HumH/lxESytk.5HILrTIRBMl/i.', 'Admin', 'Admin', '123456789', '123456', 1);
