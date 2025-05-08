export interface Cliente {
    id_cliente: number;
    nome: string;
    email: string;
    numero: string;
  }
  
export interface Encomenda {
  figuras: Figura;
  clientes: Cliente;
  id_encomenda: number;
  quantidade: number;
  semana: number;
}

export interface Colaborador {
  id_colaborador: number;
  nome: string;
  idade: number;
  data_nascimento: string;
  email: string;
  numero: string;
  id_cargo: number;
  id_turno: number;
  password?: string;
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
  limite: boolean;
}

export interface Maquina {
  id_maquina: number;
  nome: string;
  data_inicio: string;
  ultima_inspecao: string;
  proxima_inspecao: string;
}

export interface Acompanhamento {
  id_acompanhamento: number;
  maquina: Maquina;
  encomenda: Encomenda;
  colaborador: Colaborador;
  quantidade_produzida: number;
}

export interface PlanoTrabalho {
  id_planodetrabalho: number;
  id_maquina?: number;
  id_encomenda?: Encomenda;
  id_colaborador?: number;
  maquina: Maquina;
  encomenda: Encomenda;
  colaborador: Colaborador;
  tempo_conclusao: string;
  quantidade: number;
  semana: number;
  quantidade_falta: number;
}

export interface Corante {
  id_corante: number;
  nome: string;
  quantidade: number;
  limite: boolean;
}

export interface FiguraCorante {
  id_figura: number;
  id_corante: number;
  quantidade_corante: number;
}

