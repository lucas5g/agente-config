# PRD - CRUD de Agentes com Chat de IA Configurável

## 1. Visão Geral

O projeto consiste em uma aplicação para criar, editar, listar e remover agentes de IA. Cada agente possui suas próprias configurações, incluindo `system prompt`, tools associadas e comportamento esperado no chat.

A proposta é permitir que o usuário tenha autonomia para criar agentes diferentes para objetivos diferentes, sem depender de alterações diretas no código da aplicação.

Exemplo: o usuário pode criar o agente `Suporte Técnico`, associar a ele a tool `buscar_cliente` e configurar um prompt específico para atendimento. Em seguida, pode criar outro agente, como `Vendas`, com outro prompt e outras tools.

## 2. Objetivo

Criar uma plataforma simples para gerenciar agentes de IA e conversar com eles, permitindo:

- Criar, listar, editar e remover agentes.
- Definir e editar o `system prompt` usado pelo chat.
- Cadastrar tools externas, informando endpoints HTTP.
- Associar uma ou mais tools a cada agente.
- Permitir que a IA utilize as tools do agente durante a conversa.
- Testar e ajustar configurações de agente de forma rápida.

## 3. Público-Alvo

- Desenvolvedores que desejam criar agentes customizados.
- Times que precisam testar prompts e integrações rapidamente.
- Usuários técnicos que querem conectar IA a APIs internas ou externas.

## 4. Problema

Muitas soluções de chat com IA são rígidas: o comportamento do assistente e as ferramentas disponíveis ficam fixos no código ou exigem alterações técnicas para cada novo caso de uso.

Isso dificulta a experimentação, a integração com sistemas externos e a criação de agentes específicos para diferentes contextos.

## 5. Solução Proposta

Construir um CRUD de agentes com chat de IA configurável, onde cada agente pode possuir:

- Nome e descrição.
- `system prompt` editável.
- Lista de tools disponíveis.
- Configuração de endpoints para cada tool.
- Histórico de conversas.

As tools serão cadastradas separadamente e poderão ser associadas a um ou mais agentes. Durante uma conversa, o modelo só poderá utilizar as tools disponíveis para o agente selecionado.

## 6. Funcionalidades Principais

### 6.1 CRUD de Agentes

O usuário deve conseguir criar, visualizar, editar e remover agentes de IA.

Cada agente representa uma configuração independente de comportamento e ferramentas.

Requisitos:

- Criar um agente com nome, descrição e `system prompt`.
- Listar agentes existentes.
- Visualizar os detalhes de um agente.
- Editar nome, descrição, prompt e tools associadas.
- Remover um agente.
- Selecionar um agente para iniciar uma conversa.

Exemplo:

```json
{
  "name": "Agente X",
  "description": "Agente para consultar informações externas.",
  "system_prompt": "Você é um assistente objetivo e deve usar tools quando precisar buscar dados externos.",
  "tools": ["xpto"]
}
```

### 6.2 Chat com IA

O usuário deve conseguir selecionar um agente, iniciar uma conversa com ele e enviar mensagens em uma interface de chat.

Requisitos:

- Selecionar o agente que será usado na conversa.
- Enviar mensagens para o modelo de IA.
- Exibir respostas da IA em tempo real ou após processamento.
- Manter o contexto da conversa.
- Permitir limpar ou reiniciar uma conversa.

### 6.3 Configuração do System Prompt

O usuário deve conseguir configurar o `system prompt` usado por cada agente.

Requisitos:

- Criar ou editar o `system prompt`.
- Salvar alterações.
- Aplicar o prompt salvo nas novas conversas daquele agente.
- Visualizar qual prompt está ativo.

Exemplo:

```text
Você é um assistente especializado em suporte técnico. Responda de forma objetiva, pergunte por logs quando necessário e nunca invente informações.
```

### 6.4 Cadastro de Tools

O usuário deve conseguir adicionar tools que serão disponibilizadas ao modelo.

Cada tool representa uma ação externa acessada por um endpoint HTTP. Depois de cadastrada, a tool pode ser associada a um ou mais agentes.

Campos sugeridos:

- Nome da tool.
- Descrição da tool.
- Método HTTP: `GET`, `POST`, `PUT`, `PATCH` ou `DELETE`.
- URL do endpoint.
- Headers opcionais.
- Body/schema de entrada.
- Mapeamento da resposta.
- Timeout.
- Status: ativa ou inativa.

Exemplo de tool:

```json
{
  "name": "buscar_cliente",
  "description": "Busca dados de um cliente pelo e-mail.",
  "method": "GET",
  "url": "https://api.exemplo.com/clientes?email={{email}}",
  "headers": {
    "Authorization": "Bearer {{TOKEN}}"
  },
  "input_schema": {
    "type": "object",
    "properties": {
      "email": {
        "type": "string",
        "description": "E-mail do cliente."
      }
    },
    "required": ["email"]
  }
}
```

### 6.4 Execução de Tools

Quando a IA precisar de uma informação externa ou quiser executar uma ação, ela poderá solicitar o uso de uma tool associada ao agente ativo.

Requisitos:

- Enviar parâmetros para o endpoint configurado.
- Executar a requisição HTTP.
- Retornar o resultado para o modelo.
- Exibir, no chat, quando uma tool for usada.
- Tratar erros de endpoint, timeout e resposta inválida.

### 6.6 Associação de Tools ao Agente

O usuário deve conseguir definir quais tools estarão disponíveis para cada agente.

Exemplo: o agente `Agente X` pode usar a tool `xpto`, enquanto o agente `Agente Y` pode usar apenas a tool `buscar_pedido`.

Requisitos:

- Associar uma tool existente a um agente.
- Remover uma tool de um agente.
- Ativar ou desativar uma tool dentro de um agente.
- Impedir que um agente use tools não associadas a ele.

## 7. Requisitos Funcionais

- O sistema deve permitir criar, editar e remover agentes.
- O sistema deve permitir configurar o `system prompt` de cada agente.
- O sistema deve permitir cadastrar tools baseadas em endpoints HTTP.
- O sistema deve permitir associar tools a agentes.
- O sistema deve permitir listar os agentes existentes.
- O sistema deve permitir visualizar os detalhes de um agente.
- O sistema deve enviar mensagens do usuário para o modelo de IA, junto com o contexto do agente.
- O sistema deve permitir que o modelo solicite a execução de uma tool.
- O sistema deve executar apenas tools associadas ao agente ativo.
- O sistema deve executar o endpoint da tool autorizada e devolver o resultado ao modelo.
- O sistema deve registrar, no histórico, quando uma tool foi chamada.
- O sistema deve tratar erros de chamada de tool de forma clara.

## 8. Requisitos Não Funcionais

- A aplicação deve ser simples de configurar.
- Dados sensíveis, como tokens de API, devem ser armazenados de forma segura.
- Chamadas externas devem ter timeout configurável.
- O sistema deve validar os parâmetros antes de chamar uma tool.
- O sistema deve evitar expor secrets no histórico do chat.
- A interface deve ser responsiva.
- O tempo de resposta deve ser aceitável, mesmo quando uma tool for executada.

## 9. Modelo Conceitual

### Agent

```json
{
  "id": "agent_123",
  "name": "Agente X",
  "description": "Agente para consultar informações externas.",
  "system_prompt": "Você é um assistente objetivo e deve usar tools quando precisar buscar dados externos.",
  "tools": ["tool_xpto"]
}
```

### Tool

```json
{
  "id": "tool_xpto",
  "name": "xpto",
  "description": "Consulta dados no endpoint XPTO.",
  "method": "GET",
  "url": "https://api.exemplo.com/xpto?id={{id}}",
  "headers": {},
  "input_schema": {},
  "enabled": true
}
```

### Conversation

```json
{
  "id": "conversation_123",
  "agent_id": "agent_123",
  "messages": [
    {
      "role": "user",
      "content": "Consulte os dados do ID 123 usando a tool xpto."
    },
    {
      "role": "assistant",
      "content": "Encontrei os dados solicitados."
    }
  ]
}
```

## 10. Fluxo Principal

1. O usuário cria um agente.
2. O usuário define o `system prompt`.
3. O usuário cadastra uma ou mais tools com endpoints, como a tool `xpto`.
4. O usuário associa as tools desejadas ao agente.
5. O usuário inicia uma conversa com o agente.
6. O usuário envia uma mensagem.
7. O sistema envia a mensagem, o prompt e as tools disponíveis para o modelo.
8. O modelo responde diretamente ou solicita uma tool.
9. O sistema executa a tool, recebe a resposta e envia o resultado ao modelo.
10. O modelo responde ao usuário com base no resultado.

## 11. Tratamento de Erros

- Endpoint indisponível: informar que a tool falhou e permitir nova tentativa.
- Timeout: encerrar a chamada e retornar um erro controlado.
- Parâmetros inválidos: impedir a chamada e pedir dados corretos ao usuário.
- Resposta inválida: registrar o erro e informar que a tool retornou um formato inesperado.
- Erro de autenticação: não expor tokens ou headers sensíveis na resposta.

## 12. Segurança

- Secrets devem ser armazenados fora do prompt e fora do histórico.
- Headers sensíveis devem ser mascarados na interface.
- URLs e métodos devem ser validados antes da execução.
- Deve existir proteção contra chamadas para endpoints internos indevidos, se a aplicação for exposta publicamente.
- Logs não devem conter tokens, senhas ou dados sensíveis.

## 13. MVP

O MVP deve conter:

- Interface de chat.
- CRUD de agentes.
- Configuração de `system prompt`.
- Cadastro manual de tools HTTP.
- Associação de tools ao agente.
- Execução de tools durante a conversa.
- Histórico simples da conversa.
- Tratamento básico de erros.

## 14. Fora do Escopo Inicial

- Marketplace público de tools.
- Sistema avançado de permissões por usuário.
- Versionamento completo de prompts.
- Analytics detalhado de uso.
- Fine-tuning de modelos.
- Agendamento de execução de tools.

## 15. Métricas de Sucesso

- O usuário consegue configurar um agente sem alterar código.
- O usuário consegue adicionar uma tool via endpoint e usá-la no chat.
- O tempo médio para criar um agente funcional é menor que 5 minutos.
- Há baixa taxa de falhas em chamadas de tools configuradas corretamente.
- As respostas da IA refletem corretamente o `system prompt` configurado.

## 16. Perguntas em Aberto

- Qual provedor de IA será usado inicialmente?
- As configurações serão salvas localmente ou em banco de dados?
- O sistema terá login de usuários no MVP?
- As tools poderão exigir aprovação manual antes da execução?
- Como os secrets serão cadastrados e armazenados?
- O chat deve suportar streaming de resposta desde o MVP?
