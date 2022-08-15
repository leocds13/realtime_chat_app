Repositório de estudo acompanhando o artigo:

[https://www.freecodecamp.org/news/build-a-realtime-chat-app-with-react-express-socketio-and-harperdb/](build-a-realtime-chat-app-with-react-express-socketio-and-harperdb)


Mudei um pouco do parte do FrontEnd usando NextJS afim de melhorar meus conhecimentos em cima do framework.
Também usei TS, pois prefiro para garantir uma melhor estruturação dos dados, no entanto sei que é possivel melhorar muito a estruturação das tipagens.

Para executar ambiente Dev:
1) Iniciar o servidor:
    1. Navegar para a paste do servidor:
        * cd server
    2. Criar .env seguindo o .env.example com url e pw do [https://harperdb.io](harperdb)
        * No Harper db, crie um schema com o nome "realtime_chat_app"
        * e uma tabela chamada "messages"
    3. Iniciar servidor:
        * yarn dev
        * ou 
        * npm run dev

2) Iniciar o cliente:
    1. Navegar para a pasta do cliente:
        * cd client
    2. Iniciar servidor do cliente:
        * yarn dev
        * ou
        * npm run dev

