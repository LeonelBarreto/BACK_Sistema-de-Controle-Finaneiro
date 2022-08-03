# BACK END DA APLICAÇÃO DINDIN

Essa API RESTful é a parte Back End do projeto full stack desenvolvido no desafio do módulo 3 de Desenvolvimento de Software da Cubos Academy.

A API consiste de arquivos que possuem toda a estrutura e inclui também o schema do Banco de Dados.

O **JavaScript** foi a linguagem de programação utilizada em todo a API.

##  A API RESTful
A API da aplicação DinDin permite:

>**Cadastrar Usuário**
>`POST` `/usuario`

> **Fazer Login** 
> `POST` `/login`

> **Detalhar Perfil do Usuário Logado** :heavy_exclamation_mark:
> `GET` `/usuario`

> **Editar Perfil do Usuário Logado** :heavy_exclamation_mark:
> `PUT` `/usuario`

> **Listar categorias**  :heavy_exclamation_mark:
> `GET`  `/categoria`

> **Listar transações** :heavy_exclamation_mark:
> `GET` `/transacao`

> **Detalhar transação** :heavy_exclamation_mark:
> `GET` `/transacao/:id`

> **Cadastrar transação** :heavy_exclamation_mark:
> `POST` `/transacao`

> **Editar transação** :heavy_exclamation_mark:
> `PUT` `/transacao/:id`

> **Remover transaçãoObter extrato de transações**  :heavy_exclamation_mark:
> `DELETE` `/transacao/:id`

> **[Extra] Filtrar transações por categoria** :heavy_exclamation_mark:
> `GET` `/transacao/extrato`

## Validação de Token

Todas os endpoints marcados com o emoji ":heavy_exclamation_mark:" exigem o token de autenticação do usuário logado, recebendo no header com o formato Bearer Token. Portanto, em cada funcionalidade será necessário validar o token informado.


## Dependências
As dependências abaixos foram instaladas durante o desenvolvimento da API:

> Reinicialização automática do servidor:
> `nodemon: ^2.0.19`

> Método de criptografia utilizado:
> `bcrypt: ^5.0.1`

> Framework utilizado:
> `express: ^4.18.1`

> Padrão para autenticação utilizado:
> `jsonwebtoken: ^8.5.1`

> Biblioteca para conexão com o PostgreSQL:
> `pg: ^8.7.3`
