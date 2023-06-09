insert into roles (id, role) values (1, 'Docente');
insert into roles (id, role) values (2, 'Alumno');
INSERT INTO `users` (`id`, `email`, `password`, `name`, `last_name`, `dni`, `mobile`, `role_id`) VALUES
(1, 'admin@admin', '$2y$10$n01fpAVQjJY5xXNPh6Oc../dyPojOthn7R79E3FdVm7I.bCXBNoBq', 'Admin', 'Admin', '123456789', '123456', 1);
