# Exercício 01: Alpine com MOTD

##  Objetivo

Criar uma imagem Docker baseada em Alpine Linux que exibe uma mensagem personalizada (MOTD - Message of the Day) ao iniciar.

##  O que será criado

- Imagem Alpine customizada com `bash` e `curl`
- Mensagem de boas-vindas personalizada
- Shell interativo pronto para uso

##  Como executar

### Build da imagem

```bash
docker build -t cafe:1 .
```

### Executar container interativo

```bash
docker run -it --rm cafe:1
```

Ao iniciar, você verá a mensagem do arquivo `motd.txt` e entrará em um shell bash.

### Usando o Makefile (raiz do projeto)

```bash
make ex01
```

##  Critérios de aceite

- [x] Imagem constrói sem erros
- [x] Mensagem MOTD é exibida ao iniciar o container
- [x] Shell bash está disponível e funcional
- [x] Comando `curl` está instalado e funciona

##  Resultados dos Testes

**Status:** APROVADO 

### Build
-  Imagem construída com sucesso
-  Tamanho: 23.5MB (muito eficiente com Alpine)
-  Tag: `cafe:1`

### Funcionalidades Testadas
-  MOTD exibido: "Bom dia! Café quente e build verde."
-  Bash instalado e funcional: GNU bash v5.2.37
-  Curl instalado e funcional: curl v8.14.1
-  Arquivo /motd.txt presente e acessível

### Como Reproduzir os Testes
```bash
# 1. Build da imagem
docker build -t cafe:1 .

# 2. Testar comandos instalados
docker run --rm cafe:1 /bin/bash -c "curl --version && bash --version && cat /motd.txt"

# 3. Executar modo interativo (opcional)
docker run -it --rm cafe:1
```

##  Conceitos aprendidos

- Uso de Alpine Linux como base mínima
- Instalação de pacotes com `apk`
- Customização de mensagens de inicialização
- Containers interativos vs. daemon

##  Teste adicional

Dentro do container, teste:

```bash
curl --version
bash --version
cat /motd.txt
```

Todos devem funcionar corretamente.
