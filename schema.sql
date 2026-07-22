-- Ficha de anamnese — Fuzieger Tattoo
-- Postgres. Rode com: psql "$DATABASE_URL" -f schema.sql

create extension if not exists "pgcrypto";

create table if not exists anamnese (
  id                        uuid primary key default gen_random_uuid(),
  created_at                timestamptz not null default now(),

  -- dados pessoais
  nome                      text not null,
  telefone                  text not null,
  data_nascimento           date,

  -- saúde (respostas sim/não + detalhe quando aplicável)
  alergias                  boolean not null default false,
  alergias_detalhe          text,
  medicamentos              boolean not null default false,
  medicamentos_detalhe      text,
  diabetes                  boolean not null default false,
  problemas_cardiacos       boolean not null default false,
  problemas_coagulacao      boolean not null default false,
  doenca_infecciosa         boolean not null default false,  -- hepatite, HIV, etc.
  doenca_infecciosa_detalhe text,
  epilepsia                 boolean not null default false,
  pressao_alta              boolean not null default false,
  queloide                  boolean not null default false,  -- cicatrização / queloide
  gestante                  boolean not null default false,  -- grávida ou amamentando
  alcool_drogas_24h         boolean not null default false,
  problemas_pele            boolean not null default false,
  problemas_pele_detalhe    text,

  -- consentimento
  consentimento             boolean not null,
  consentimento_em          timestamptz not null default now(),

  constraint consentimento_obrigatorio check (consentimento = true)
);

create index if not exists anamnese_created_at_idx on anamnese (created_at desc);
create index if not exists anamnese_telefone_idx on anamnese (telefone);

-- Avaliações / feedback dos clientes
create table if not exists feedback (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  nome         text not null,
  resultado    text,   -- o que achou do resultado
  ambiente     text,   -- o que achou do ambiente
  atendimento  text,   -- o que achou do atendimento
  estrelas     smallint not null,
  publicado    boolean not null default true,
  constraint estrelas_1_a_5 check (estrelas between 1 and 5)
);

create index if not exists feedback_created_at_idx on feedback (created_at desc);
