-- drop database if exists market_cubos;
-- create database market_cubos;

drop table if exists produtos;
drop table if exists usuarios;


create table usuarios(
	id serial primary key,
  	nome varchar(30) not null,
  	nome_loja varchar(30) not null,
  	email text unique not null,
  	senha varchar(8) not null 
);

create table produtos(
  	id serial primary key,
  	usuario_id int,
  	nome varchar(30),
  	estoque int,
  	categoria varchar(30),
  	preco int,
  	descricao text,
  	imagem text,
   	foreign key (usuario_id) references usuarios (id)  
);