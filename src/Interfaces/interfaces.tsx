export interface Cliente {
    id_cliente: number;
    nome: string;
    email: string;
    numero: string;
  }
  
export interface Encomenda {
  figuras?: any;
  clientes?: any;
  id_encomenda: number;
  id_figura: number;
  id_cliente: number;
  quantidade: number;
  data_inicio: string;
  data_fim: string;
}

export interface Colaborador {
  id_colaborador: number;
  nome: string;
  idade: number;
  data_nascimento: string;
  email: string;
  numero: string;
  id_turno: number;
  password: string;
}

export interface Figura {
  id_figura: number;
  referencia: string;
  nome: string;
  tempo_ciclo: number;
  id_materiaprima: number;
  quantidade_materiaprima: number;
}

export interface Turno {
  id_turno: number;
  descricao: string;
}

export interface MateriaPrima {
  id_materiaprima: number;
  nome: string;
  quantidade: number;
}

export interface Maquina {
  id_maquina: number;
  nome: string;
  data_inicio: string;
  ultima_inspecao: string;
  proxima_inspecao: string;
}

export interface Acompanhamento {
  id: number;
  maquina_id: number;
  encomenda_id: number;
  id_colaborador: number;
  quantidade_produzida: number;
}

export interface PlanoTrabalho {
  id: number;
  maquina_id: number;
  encomenda_id: number;
  tempo_conclusao: string;
  quantidade: number;
  semana: number;
  quantidade_falta: number;
}

export interface Corante {
  id_corante: number;
  nome: string;
  quantidade: number;
}

export interface FiguraCorante {
  id_figura: number;
  id_corante: number;
  quantidade_corante: number;
}
